def generate_summary(pos, neg, neu, good_aspects, bad_aspects):
    total = pos + neg + neu

    if total == 0:
        return (
            "What users like: Not enough data\n"
            "What users dislike: Not enough data\n"
            "Recommendation: No reviews available."
        )

    pos_pct = (pos / total) * 100
    neg_pct = (neg / total) * 100
    likes = ", ".join(good_aspects[:3]) if good_aspects else "No strong positive aspects found"
    dislikes = ", ".join(bad_aspects[:3]) if bad_aspects else "No major repeated issues found"

    if pos_pct > 60:
        recommendation = "Strong recommendation. Most users are satisfied, so this looks like a good choice."
    elif neg_pct > 50:
        recommendation = "Warning. Negative feedback is high, so compare alternatives before buying."
    else:
        recommendation = "Mixed feedback. Buy only if the liked aspects matter more than the reported issues."

    return (
        f"What users like: {likes}\n"
        f"What users dislike: {dislikes}\n"
        f"Recommendation: {recommendation}"
    )
