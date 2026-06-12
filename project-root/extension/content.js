function extractReviews() {
    let reviews = [];

    // Amazon
    document.querySelectorAll('[data-hook="review-body"]').forEach(r => {
        reviews.push(r.innerText.trim());
    });

    // Flipkart
    document.querySelectorAll('._6K-7Co').forEach(r => {
        reviews.push(r.innerText.trim());
    });

    // Generic fallback
    if (reviews.length === 0) {
        document.querySelectorAll("p").forEach(p => {
            if (p.innerText.length > 50) {
                reviews.push(p.innerText.trim());
            }
        });
    }

    return reviews.slice(0, 20);
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.action === "GET_REVIEWS") {
        sendResponse({ reviews: extractReviews() });
    }
});