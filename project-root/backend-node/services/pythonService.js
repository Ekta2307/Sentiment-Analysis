const axios = require("axios");

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:5000/predict";

async function analyzeReviews(reviews) {
    try {
        const response = await axios.post(PYTHON_API_URL, {
            reviews: reviews
        }, {
            timeout: 10000
        });

        return response.data;
    } catch (error) {
        console.error("Error calling Python API:", error.message);
        throw error;
    }
}

module.exports = { analyzeReviews };
