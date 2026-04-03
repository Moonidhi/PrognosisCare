from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import predict
from config_loader import config
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Prognosis Care Backend")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientSymptomRequest(BaseModel):
    symptoms: str
    age: int = 35
    gender: str = "Male"
    bp: str = "120/80"
    hr: int = 72
    temp: float = 98.6

@app.post("/predict")
def get_prediction(data: PatientSymptomRequest):
    try:
        # 1. Get prediction from existing model (predict.py)
        result = predict.predict(
            age=data.age,
            gender=data.gender,
            symptoms=data.symptoms,
            blood_pressure=data.bp,
            heart_rate=data.hr,
            temperature=data.temp
        )

        # 2. Augment with Test Recommendations from config
        # Result has 'specialty' or 'disease'; we use specialty for broad test groups
        specialty = result.get("specialty", "General Medicine")
        if specialty not in config["test_recommendations"]:
             specialty = "General Medicine"

        recommended_tests = config["test_recommendations"].get(specialty, [])
        
        # Add tests to the result
        result["recommended_tests"] = recommended_tests
        
        # Also construct a simple summary string for the frontend
        disease = result.get("disease", "Unknown Condition")
        risk = result.get("risk_level", "Unknown")
        result["summary"] = f"Based on your symptoms, our AI analysis suggests possible {disease} ({risk} Risk). We recommend consulting a {specialty} specialist. Suggested diagnostic tests are listed below."

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
