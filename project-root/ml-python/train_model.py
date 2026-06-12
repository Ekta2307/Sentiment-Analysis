from pathlib import Path
import pickle

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.model_selection import train_test_split

from preprocess import clean_text


BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "data" / "dataset.csv"
MODEL_DIR = BASE_DIR / "model"


df = pd.read_csv(DATASET_PATH)
df = df.dropna(subset=["review", "sentiment"])
df["sentiment"] = df["sentiment"].astype(str).str.strip().str.lower()

# NLP preprocessing
df["clean_review"] = df["review"].astype(str).apply(clean_text)

# TF-IDF
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df["clean_review"])
y = df["sentiment"]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

# ML model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Evaluation
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))

cm = confusion_matrix(y_test, y_pred, labels=model.classes_)
sns.heatmap(cm, annot=True, fmt="d", xticklabels=model.classes_, yticklabels=model.classes_)
plt.title("Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.tight_layout()

# Save model artifacts
MODEL_DIR.mkdir(exist_ok=True)
plt.savefig(MODEL_DIR / "confusion_matrix.png")
pickle.dump(model, open(MODEL_DIR / "model.pkl", "wb"))
pickle.dump(vectorizer, open(MODEL_DIR / "vectorizer.pkl", "wb"))

print("Model and vectorizer saved!")
