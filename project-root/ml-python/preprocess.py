import re

try:
    from nltk.corpus import stopwords
    from nltk.tokenize import word_tokenize
    stop_words = set(stopwords.words("english"))
except Exception:
    word_tokenize = None
    stop_words = {
        "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from",
        "has", "have", "he", "in", "is", "it", "its", "of", "on", "or", "that",
        "the", "this", "to", "was", "were", "will", "with", "you", "your"
    }


def clean_text(text):
    if not isinstance(text, str):
        return ""

    text = text.lower()
    text = re.sub(r"[^a-z\s]", "", text)

    if word_tokenize:
        try:
            words = word_tokenize(text)
        except Exception:
            words = text.split()
    else:
        words = text.split()

    words = [word for word in words if word not in stop_words]

    return " ".join(words)
