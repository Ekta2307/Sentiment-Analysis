const express = require("express");
const cors = require("cors");
require("dotenv").config();

const analyzeRoute = require("./routes/analyze");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ ok: true });
});

app.use("/analyze", analyzeRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
