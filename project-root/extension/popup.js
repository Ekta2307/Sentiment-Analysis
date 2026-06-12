document.addEventListener("DOMContentLoaded", () => {

    console.log("Popup loaded");

    const BACKEND_URL = "http://127.0.0.1:3000/analyze";
    let chartAnimationId = null;

    function renderChart(pos, neg, neu) {
        const canvas = document.getElementById("chart");

        if (!canvas) {
            console.error("Chart canvas not found");
            return;
        }

        const ctx = canvas.getContext("2d");
        const size = 180;
        const center = size / 2;
        const radius = 70;
        const innerRadius = 38;
        const ringWidth = radius - innerRadius;
        const values = [
            { value: pos, color: "#22c55e" },
            { value: neu, color: "#3b82f6" },
            { value: neg, color: "#ef4444" }
        ];
        const total = values.reduce((sum, item) => sum + item.value, 0);

        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, size, size);

        if (chartAnimationId) {
            cancelAnimationFrame(chartAnimationId);
        }

        function drawTrack() {
            ctx.beginPath();
            ctx.arc(center, center, radius, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(148, 163, 184, 0.22)";
            ctx.lineWidth = ringWidth;
            ctx.lineCap = "round";
            ctx.stroke();
        }

        function drawCenterLabel() {
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--text").trim() || "#172033";
            ctx.font = "700 20px Segoe UI, Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(Math.round(pos) + "%", center, center - 6);
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--muted").trim() || "#667085";
            ctx.font = "12px Segoe UI, Arial";
            ctx.fillText("positive", center, center + 15);
        }

        if (total <= 0) {
            drawTrack();
            drawCenterLabel();
            return;
        }

        function draw(progress) {
            let startAngle = -Math.PI / 2;

            ctx.clearRect(0, 0, size, size);
            drawTrack();

            values.forEach((item) => {
                const angle = (item.value / total) * Math.PI * 2 * progress;
                const endAngle = startAngle + angle;

                ctx.beginPath();
                ctx.arc(center, center, radius, startAngle, endAngle);
                ctx.strokeStyle = item.color;
                ctx.lineWidth = ringWidth;
                ctx.lineCap = "round";
                ctx.stroke();

                startAngle = endAngle;
            });

            drawCenterLabel();
        }

        const startedAt = performance.now();
        const duration = 850;

        function animate(now) {
            const progress = Math.min((now - startedAt) / duration, 1);
            draw(progress);

            if (progress < 1) {
                chartAnimationId = requestAnimationFrame(animate);
            }
        }

        chartAnimationId = requestAnimationFrame(animate);
    }

    function animateBars(pos, neg, neu) {
        const bars = [
            { id: "posBar", value: pos },
            { id: "neuBar", value: neu },
            { id: "negBar", value: neg }
        ];

        bars.forEach((bar) => {
            const element = document.getElementById(bar.id);
            if (!element) return;
            element.style.width = "0%";
            requestAnimationFrame(() => {
                element.style.width = bar.value + "%";
            });
        });
    }

    function getReviews() {
        return new Promise((resolve) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

                if (!tabs || !tabs.length) {
                    console.error("No active tab");
                    resolve([]);
                    return;
                }

                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { action: "GET_REVIEWS" },
                    (response) => {

                        if (chrome.runtime.lastError) {
                            console.error("Content script error:", chrome.runtime.lastError.message);
                            resolve([]);
                        } else {
                            console.log("Reviews received:", response?.reviews);
                            resolve(response?.reviews || []);
                        }
                    }
                );
            });
        });
    }

    async function postReviews(reviews) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const res = await fetch(BACKEND_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ reviews }),
                signal: controller.signal
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.error || "Server error: " + res.status);
            }

            return data;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    function toPercent(value) {
        const number = Number(value);
        if (!Number.isFinite(number)) return 0;
        return Math.max(0, Math.min(100, number));
    }

    function renderAspectList(elementId, aspects) {
        const list = document.getElementById(elementId);
        const cleanAspects = Array.isArray(aspects)
            ? aspects.filter((aspect) => typeof aspect === "string" && aspect.trim().length > 0)
            : [];

        if (!list) return;

        list.innerHTML = "";

        if (!cleanAspects.length) {
            const item = document.createElement("li");
            item.innerText = "No clear aspects found";
            list.appendChild(item);
            return;
        }

        cleanAspects.forEach((aspect) => {
            const item = document.createElement("li");
            item.innerText = aspect;
            list.appendChild(item);
        });
    }

    const analyzeBtn = document.getElementById("analyzeBtn");
    const summaryEl = document.getElementById("summary");
    const recommendationEl = document.getElementById("recommendation");

    if (!analyzeBtn) {
        console.error("Analyze button not found");
        return;
    }

    analyzeBtn.addEventListener("click", async () => {

        console.log("Analyze clicked");

        analyzeBtn.disabled = true;
        analyzeBtn.innerText = "Analyzing...";
        summaryEl.innerText = "Collecting reviews from the current page...";

        const reviews = await getReviews();

        console.log("Final reviews:", reviews);

        const validReviews = reviews.filter((review) => typeof review === "string" && review.trim().length > 0);

        if (!validReviews.length) {
            summaryEl.innerText = "No reviews found on this page.";
            analyzeBtn.disabled = false;
            analyzeBtn.innerText = "Analyze Reviews";
            return;
        }

        try {
            console.log("Calling backend...");
            summaryEl.innerText = "Sending reviews to the ML backend...";

            const data = await postReviews(validReviews);

            console.log("Data received:", data);

            const pos = toPercent(data.positive);
            const neg = toPercent(data.negative);
            const neu = toPercent(data.neutral);

            document.getElementById("positive").innerText = pos + "%";
            document.getElementById("negative").innerText = neg + "%";
            document.getElementById("neutral").innerText = neu + "%";

            animateBars(pos, neg, neu);
            renderChart(pos, neg, neu);
            renderAspectList("goodAspects", data.good_aspects);
            renderAspectList("badAspects", data.bad_aspects);

            summaryEl.innerText = "Analysis complete.";
            recommendationEl.innerText = data.summary;

        } catch (err) {
            console.error("FETCH ERROR:", err);
            summaryEl.innerText = "Failed to connect to backend: " + err.message;
            recommendationEl.innerText = "Backend connection failed.";
            animateBars(0, 0, 0);
            renderChart(0, 0, 0);
            renderAspectList("goodAspects", []);
            renderAspectList("badAspects", []);
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.innerText = "Analyze Reviews";
        }
    });

    // Dark Mode
    const body = document.getElementById("body");
    const toggle = document.getElementById("toggleTheme");

    if (toggle) {
        toggle.addEventListener("click", () => {
            body.classList.toggle("dark");
            body.classList.toggle("light");
            toggle.innerText = body.classList.contains("dark") ? "\u2600" : "\u263E";
        });
    }

    renderChart(0, 0, 0);
});
