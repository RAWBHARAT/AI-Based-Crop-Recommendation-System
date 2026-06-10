from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

# ================= LOAD MODEL =================
model = joblib.load("model.pkl")

print("Model Loaded ✅")

# ================= HOME ROUTE =================
@app.route("/")
def home():
    return "Crop Prediction API Running 🚀"

# ================= PREDICT ROUTE =================
from flask import Flask, request, jsonify
import numpy as np

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        features = [[
            float(data["N"]),
            float(data["P"]),
            float(data["K"]),
            float(data["temperature"]),
            float(data["humidity"]),
            float(data["ph"]),
            float(data["rainfall"])
        ]]

        # 🔥 Predict probabilities
        probs = model.predict_proba(features)[0]

        # 🔥 Get top 3 indexes
        top3_idx = np.argsort(probs)[-3:][::-1]

        results = []
        for i in top3_idx:
            results.append({
                "crop": model.classes_[i],
                "confidence": round(probs[i] * 100, 2)
            })

        return jsonify({
            "recommendations": results
        })

    except Exception as e:
        return jsonify({"error": str(e)})


# ================= RUN SERVER =================
if __name__ == "__main__":
    app.run(debug=True, port=5001)