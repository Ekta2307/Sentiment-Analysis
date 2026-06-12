# Sentiment Analysis for Product Reviews (ML + NLP + Chrome Extension)

## Description

This project analyzes product reviews from websites like Amazon and classifies them as **Positive**, **Negative**, or **Neutral**. It uses a trained Machine Learning model based on **TF-IDF vectorization** and **Logistic Regression**.

The project also generates simple product insights by identifying what users like and dislike from the reviews.

## Features

- Analyze multiple product reviews at once
- Classify reviews into positive, negative, and neutral sentiments
- Generate product-level sentiment counts
- Extract good and bad aspects from reviews
- Use a Chrome Extension as the frontend interface
- Connect the extension to a Node.js backend
- Use a Python Flask API for ML/NLP prediction

## Tech Stack

**Frontend**
- Chrome Extension
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js

**ML/NLP**
- Python
- Flask
- scikit-learn
- nltk
- TF-IDF
- Logistic Regression

## Project Structure

```text
project-root/
|
+-- backend-node/
|   +-- routes/
|   +-- services/
|   +-- server.js
|   +-- package.json
|
+-- extension/
|   +-- manifest.json
|   +-- popup.html
|   +-- popup.js
|   +-- content.js
|   +-- styles.css
|
+-- ml-python/
|   +-- data/
|   |   +-- dataset.csv
|   +-- model/
|   |   +-- model.pkl
|   |   +-- vectorizer.pkl
|   +-- app.py
|   +-- train_model.py
|   +-- preprocess.py
|   +-- keyword_extractor.py
|   +-- summary.py
|   +-- requirements.txt
|
+-- README.md
```

## Dataset Used

The dataset is stored at:

```text
ml-python/data/dataset.csv
```

It contains product reviews labeled as:

- Positive
- Negative
- Neutral

The machine learning model is trained offline using this dataset. After training, the trained model and TF-IDF vectorizer are saved using **pickle** inside the `ml-python/model/` folder.

## How It Works

1. Product reviews are collected from the Chrome Extension.
2. The reviews are sent to the Node.js Express backend.
3. The Node.js backend forwards the reviews to the Python Flask API.
4. The Flask API cleans and preprocesses the review text.
5. TF-IDF converts the text into numerical features.
6. Logistic Regression predicts the sentiment of each review.
7. The API counts positive, negative, and neutral reviews.
8. The system extracts useful product insights such as liked and disliked aspects.
9. The final result is displayed in the Chrome Extension.

## Installation Steps

### 1. Clone or Open the Project

Open the project folder:

```bash
cd project-root
```

### 2. Install Python Dependencies

```bash
cd ml-python
pip install -r requirements.txt
```

### 3. Install Node.js Dependencies

```bash
cd ../backend-node
npm install
```

## How to Run

### 1. Run the Python Flask API

Open a terminal in the `ml-python` folder and run:

```bash
python app.py
```

The Flask API will run on:

```text
http://localhost:5000
```

### 2. Run the Node.js Backend

Open another terminal in the `backend-node` folder and run:

```bash
npm start
```

The Node server will run on:

```text
http://localhost:3000
```

### 3. Load the Chrome Extension

1. Open Google Chrome.
2. Go to:

```text
chrome://extensions/
```

3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the `extension` folder.
6. Open the extension and analyze product reviews.

## Output Example

Example response after analyzing reviews:

```json
{
  "positive": 8,
  "negative": 2,
  "neutral": 1,
  "good_aspects": ["battery", "camera", "display"],
  "bad_aspects": ["delivery", "price"],
  "summary": "Most users liked the battery, camera, and display. Some users complained about delivery and price."
}
```

## Future Improvements

- Add support for more e-commerce websites
- Improve review scraping accuracy
- Use a larger and more balanced dataset
- Add advanced NLP models like BERT
- Show charts for sentiment distribution
- Add user authentication and review history
- Deploy the backend and ML API online

## Conclusion

This project demonstrates how Machine Learning, NLP, backend development, and a Chrome Extension can be combined to analyze product reviews and generate useful product insights.
