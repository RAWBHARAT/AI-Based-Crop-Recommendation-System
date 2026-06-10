import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# ================= LOAD DATA =================
data = pd.read_csv("Crop_recommendation.csv")

print("Dataset Loaded ✅")
print("Rows:", len(data))

# ================= FEATURES & LABEL =================
X = data.drop("label", axis=1)   # inputs
y = data["label"]                # output

# ================= SPLIT DATA =================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ================= MODEL =================
model = RandomForestClassifier(n_estimators=100, random_state=42)

# ================= TRAIN =================
model.fit(X_train, y_train)
print("Model Trained ✅")

# ================= TEST =================
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("Accuracy:", accuracy)

# ================= SAVE MODEL =================
joblib.dump(model, "model.pkl")
print("Model saved as model.pkl ✅")