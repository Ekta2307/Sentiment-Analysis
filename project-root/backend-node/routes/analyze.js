const express = require("express");
const router = express.Router();
const { analyzeReviews } = require("../services/pythonService");

router.post("/", async (req, res) => {
    try {
        const { reviews } = req.body;

        if (!Array.isArray(reviews) || reviews.length === 0) {
            return res.status(400).json({ error: "No reviews provided" });
        }

        const result = await analyzeReviews(reviews);

        const total = result.positive + result.negative + result.neutral;

        if (total === 0) {
            return res.json({
                positive: 0,
                negative: 0,
                neutral: 0,
                good_aspects: result.good_aspects || [],
                bad_aspects: result.bad_aspects || [],
                summary: result.summary || "No sentiment data returned."
            });
        }

        const response = {
            positive: Number(((result.positive / total) * 100).toFixed(2)),
            negative: Number(((result.negative / total) * 100).toFixed(2)),
            neutral: Number(((result.neutral / total) * 100).toFixed(2)),
            good_aspects: result.good_aspects || [],
            bad_aspects: result.bad_aspects || [],
            summary: result.summary
        };

        res.json(response);

    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

module.exports = router;
