import subprocess
import json
import sys

def run_predict(age, gender, symptoms, bp, hr, temp, desc):
    print(f"\n--- Test Case: {desc} ---")
    cmd = [
        sys.executable, "predict.py",
        "--age", str(age),
        "--gender", gender,
        "--symptoms", symptoms,
        "--bp", bp,
        "--hr", str(hr),
        "--temp", str(temp)
    ]
    try:
        result = subprocess.check_output(cmd, stderr=subprocess.STDOUT)
        data = json.loads(result)
        print(json.dumps(data, indent=2))
        return data
    except subprocess.CalledProcessError as e:
        print("Error:", e.output.decode())
        return None

# 1. Classic Heart Attack (High Risk)
run_predict(65, "Male", "Severe chest pain, sweating, shortness of breath", "160/95", 110, 99.0, "Myocardial Infarction (High Risk)")

# 2. Acne (Low Risk)
run_predict(18, "Female", "Pimples on face, redness", "110/70", 72, 98.6, "Acne (Low Risk)")

# 3. Hypertension (Medium Risk base)
run_predict(50, "Male", "Headache, dizziness", "150/95", 80, 98.6, "Hypertension (Medium Risk)")

# 4. Acne but CRITICAL vitals (Escalation test: Low -> Medium)
# BP > 180 systolic is critical
run_predict(19, "Male", "Pimples on face", "190/100", 75, 98.6, "Acne with Critical BP (Escalated Risk)")
