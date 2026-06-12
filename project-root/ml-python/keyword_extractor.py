from collections import Counter


def extract_aspects(texts, limit=5):
    words = []
    for text in texts:
        words.extend(text.split())

    # Remove weak/common words so aspects focus on product details.
    stop_words = {
        "about",
        "after",
        "again",
        "also",
        "amazon",
        "because",
        "been",
        "before",
        "best",
        "better",
        "bought",
        "brand",
        "buy",
        "buying",
        "came",
        "could",
        "days",
        "does",
        "dont",
        "even",
        "ever",
        "excellent",
        "expected",
        "feel",
        "feels",
        "fine",
        "flipkart",
        "from",
        "give",
        "going",
        "good",
        "great",
        "have",
        "item",
        "just",
        "like",
        "more",
        "much",
        "nice",
        "okay",
        "only",
        "order",
        "overall",
        "price",
        "bad",
        "product",
        "products",
        "purchase",
        "purchased",
        "really",
        "received",
        "review",
        "reviews",
        "same",
        "seller",
        "should",
        "some",
        "than",
        "that",
        "them",
        "then",
        "there",
        "this",
        "time",
        "used",
        "using",
        "very",
        "would",
        "worth",
        "works",
        "working",
        "amazing",
        "awesome",
        "disappointed",
        "disappointing",
        "hate",
        "hated",
        "love",
        "loved",
        "perfect",
        "perfectly",
        "poor",
        "satisfied",
        "worst",
    }

    words = [
        word
        for word in words
        if word.isalpha() and len(word) > 3 and word not in stop_words
    ]

    counter = Counter(words)
    common = counter.most_common(limit)

    return [word for word, count in common]


def extract_keywords(texts):
    return extract_aspects(texts)
