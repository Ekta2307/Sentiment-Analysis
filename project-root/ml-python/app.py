from flask import Flask, request, jsonify
import pickle

from preprocess import clean_text
from keyword_extractor import extract_aspects
from summary import generate_summary

app = Flask(__name__)

# Load model
model = pickle.load(open("model/model.pkl", "rb"))
vectorizer = pickle.load(open("model/vectorizer.pkl", "rb"))


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}
    reviews = data.get("reviews", [])

    if not isinstance(reviews, list) or not reviews:
        return jsonify({"error": "No reviews provided"}), 400

    valid_reviews = [r for r in reviews if isinstance(r, str) and r.strip()]

    if not valid_reviews:
        return jsonify({"error": "No valid reviews provided"}), 400

    cleaned = [clean_text(r) for r in valid_reviews]
    vectors = vectorizer.transform(cleaned)

    predictions = model.predict(vectors)

    positive = 0
    negative = 0
    neutral = 0

    pos_texts = []
    neg_texts = []

    for i, pred in enumerate(predictions):
        pred = str(pred).lower()

        if pred == "positive":
            positive += 1
            pos_texts.append(cleaned[i])
        elif pred == "negative":
            negative += 1
            neg_texts.append(cleaned[i])
        else:
            neutral += 1

    # Aspect-based insights from the predicted sentiment groups.
    good_aspects = extract_aspects(pos_texts)
    bad_aspects = extract_aspects(neg_texts)

    # Summary
    summary = generate_summary(
        positive,
        negative,
        neutral,
        good_aspects,
        bad_aspects,
    )

    return jsonify(
        {
            "positive": positive,
            "negative": negative,
            "neutral": neutral,
            "good_aspects": good_aspects,
            "bad_aspects": bad_aspects,
            "summary": summary,
        }
    )


if __name__ == "__main__":
    app.run(port=5000, debug=True)
