const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const WISE_API_KEY = process.env.WISE_API_KEY;
const COMPETITOR_RATES = {

    "Al Ansari": {
        AED_INR: 25.90,
        AED_PKR: 76.80,
        AED_PHP: 16.10
    },

    "LuLu Exchange": {
        AED_INR: 25.88,
        AED_PKR: 76.50,
        AED_PHP: 16.20
    },

    "Western Union": {
        AED_INR: 25.82,
        AED_PKR: 76.20,
        AED_PHP: 15.95
    },

    "UAE Exchange": {
        AED_INR: 25.68,
        AED_PKR: 75.90,
        AED_PHP: 15.85
    }

};

app.get("/", (req, res) => {
    res.send("Backend running fine");
});

app.get("/rate", async (req, res) => {

    const source = req.query.source?.toUpperCase();
    const target = req.query.target?.toUpperCase();
    const amount = Number(req.query.amount);

    if (!source || !target || !amount) {
        return res.status(400).json({
            message: "Please provide source, target and amount",
            example: "/rate?source=USD&target=INR&amount=1000"
        });
    }

    try {

        const response = await axios.get(
            `https://api.wise.com/v1/rates?source=${source}&target=${target}`,
            {
                headers: {
                    Authorization: `Bearer ${WISE_API_KEY}`,
                },
            }
        );

        const rate = response.data[0].rate;
        const recipientGets = amount * rate;

        res.json({
            source,
            target,
            amount_sent: amount,
            exchange_rate: rate,
            recipient_gets: recipientGets.toFixed(2)
        });


    } catch (error) {

        res.status(500).json({
            message: "Wise API request failed",
            error: error.response?.data || error.message,
        });

    }
});

app.get("/compare", async (req, res) => {
    const source = req.query.source?.toUpperCase();
    const target = req.query.target?.toUpperCase();
    const amount = Number(req.query.amount);

    if (!source || !target || !amount) {
        return res.status(400).json({
            message: "Please provide source, target, and amount",
            example: "/compare?source=AED&target=INR&amount=1000"
        });
    }

    const results = [];

    try {
        const wiseResponse = await axios.get(
            `https://api.wise.com/v1/rates?source=${source}&target=${target}`,
            {
                headers: {
                    Authorization: `Bearer ${WISE_API_KEY}`,
                },
            }
        );

        const wiseRate = wiseResponse.data[0].rate;

        results.push({
            provider: "Wise",
            rate: wiseRate,
            recipient_gets: Number((amount * wiseRate).toFixed(2))
        });

    } catch (error) {
        console.log("Wise API failed:", error.message);
    }

    const corridor = `${source}_${target}`;

    for (const provider in COMPETITOR_RATES) {
        const rate = COMPETITOR_RATES[provider][corridor];

        if (rate) {
            results.push({
                provider: provider,
                rate: rate,
                recipient_gets: Number((amount * rate).toFixed(2))
            });
        }
    }

    if (results.length === 0) {
        return res.status(404).json({
            message: "No rates found for this currency pair"
        });
    }

    results.sort((a, b) => b.recipient_gets - a.recipient_gets);

    res.json({
        source,
        target,
        amount_sent: amount,
        best_provider: results[0].provider,
        results
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});