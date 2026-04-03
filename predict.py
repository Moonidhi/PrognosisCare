"""
AI Healthcare Triage Engine — Prediction Interface
====================================================
Loads the trained model from model/ and exposes a ``predict()`` function that
returns structured JSON with disease prediction, risk level, confidence scores,
and SHAP-based feature-importance explanations.
"""

import os
import json
import argparse
import warnings
import numpy as np
import pandas as pd
import joblib

from config_loader import config

warnings.filterwarnings("ignore")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, config["paths"]["model_dir"])

# ── Lazy-loaded singletons ────────────────────────────────────────────────────
_model = None
_preprocessor = None
_label_encoders = None
_specialty_map = None


def _load_artifacts():
    """Load model, preprocessor, label encoders, and specialty map once."""
    global _model, _preprocessor, _label_encoders, _specialty_map
    if _model is None:
        _model = joblib.load(os.path.join(MODEL_DIR, "triage_model.joblib"))
        _preprocessor = joblib.load(os.path.join(MODEL_DIR, "preprocessor.joblib"))
        _label_encoders = joblib.load(os.path.join(MODEL_DIR, "label_encoders.joblib"))
        _specialty_map = joblib.load(os.path.join(MODEL_DIR, "specialty_map.joblib"))


def _parse_bp(bp_string: str):
    """Parse '150/95' → (150.0, 95.0)."""
    parts = bp_string.strip().split("/")
    return float(parts[0]), float(parts[1])


def _get_feature_names(preprocessor) -> list:
    """Extract human-readable feature names from the fitted ColumnTransformer."""
    names = []
    for name, transformer, columns in preprocessor.transformers_:
        if name == "num":
            names.extend(columns)
        elif name == "cat":
            names.extend(transformer.get_feature_names_out(columns).tolist())
        elif name == "text":
            names.extend(
                [f"symptom_{w}" for w in transformer.get_feature_names_out()]
            )
    return names


def _get_explanation(model, preprocessor, X_transformed, top_n: int = 5) -> dict:
    """
    Compute per-prediction feature importance using the RandomForest's
    built-in feature_importances_ (averaged across the 3 output estimators).
    Falls back gracefully if SHAP is unavailable.
    """
    feature_names = _get_feature_names(preprocessor)

    try:
        import shap

        # Use the Disease estimator (index 0) for explanation — it's the most
        # informative target.  TreeExplainer is fast for RF.
        disease_estimator = model.estimators_[0]
        explainer = shap.TreeExplainer(disease_estimator)
        shap_values = explainer.shap_values(X_transformed)

        # shap_values is a list (one array per class). Average absolute values
        # across classes to get overall importance for this sample.
        if isinstance(shap_values, list):
            abs_shap = np.mean(
                [np.abs(sv) for sv in shap_values], axis=0
            )  # shape (1, n_features)
        else:
            abs_shap = np.abs(shap_values)

        importances = abs_shap[0]
        method = "shap"
    except Exception:
        # Fallback: use the mean of per-estimator feature_importances_
        importances = np.mean(
            [est.feature_importances_ for est in model.estimators_], axis=0
        )
        method = "feature_importance"

    # Build top-N list
    top_idx = np.argsort(importances)[::-1][:top_n]
    top_features = []
    for idx in top_idx:
        fname = feature_names[idx] if idx < len(feature_names) else f"feature_{idx}"
        top_features.append(
            {"feature": fname, "importance": round(float(importances[idx]), 4)}
        )

    return {"method": method, "top_features": top_features}


# ── Public API ─────────────────────────────────────────────────────────────────
def predict(
    age: int,
    gender: str,
    symptoms: str,
    blood_pressure: str,
    heart_rate: int,
    temperature: float,
) -> dict:
    """
    Run the triage model on a single patient record.

    Parameters
    ----------
    age : int
    gender : str            — Male / Female / Other
    symptoms : str          — comma-separated symptom list
    blood_pressure : str    — e.g. "150/95"
    heart_rate : int
    temperature : float     — in °F

    Returns
    -------
    dict with keys: disease, normal_abnormal, risk_level, confidence,
                    explanation, specialty
    """
    _load_artifacts()

    systolic, diastolic = _parse_bp(blood_pressure)

    # Build a single-row DataFrame matching training schema
    row = pd.DataFrame(
        [
            {
                "Age": age,
                "Gender": gender,
                "Detailed_Symptoms": symptoms.strip().lower(),
                "Blood Pressure": blood_pressure,
                "Heart Rate": heart_rate,
                "Temperature": temperature,
                "BP_Systolic": systolic,
                "BP_Diastolic": diastolic,
            }
        ]
    )

    # Transform
    X = _preprocessor.transform(row)

    # Predict class indices
    y_pred = _model.predict(X)  # shape (1, 3)

    # Predict probabilities for confidence
    confidences = {}
    target_names = ["Disease", "Normal_Abnormal", "Risk_Level"]
    predictions = {}

    for i, target in enumerate(target_names):
        le = _label_encoders[target]
        pred_label = le.inverse_transform([y_pred[0, i]])[0]
        predictions[target] = pred_label

        # Probability of the predicted class
        proba = _model.estimators_[i].predict_proba(X)[0]
        pred_class_idx = y_pred[0, i]
        confidences[target.lower()] = round(float(proba[pred_class_idx]), 4)

    # Specialty
    disease = predictions["Disease"]
    specialty = _specialty_map.get(disease, "General Medicine")

    # Explanation
    explanation = _get_explanation(_model, _preprocessor, X)

    return {
        "disease": disease,
        "normal_abnormal": predictions["Normal_Abnormal"],
        "risk_level": predictions["Risk_Level"],
        "confidence": confidences,
        "explanation": explanation,
        "specialty": specialty,
    }


# ── CLI entry point ────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="AI Healthcare Triage — Single-patient prediction"
    )
    parser.add_argument("--age", type=int, required=True)
    parser.add_argument("--gender", type=str, required=True, choices=["Male", "Female", "Other"])
    parser.add_argument("--symptoms", type=str, required=True, help="Comma-separated symptoms")
    parser.add_argument("--bp", type=str, required=True, help="Blood pressure, e.g. 150/95")
    parser.add_argument("--hr", type=int, required=True, help="Heart rate (bpm)")
    parser.add_argument("--temp", type=float, required=True, help="Temperature (°F)")
    args = parser.parse_args()

    result = predict(
        age=args.age,
        gender=args.gender,
        symptoms=args.symptoms,
        blood_pressure=args.bp,
        heart_rate=args.hr,
        temperature=args.temp,
    )
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
