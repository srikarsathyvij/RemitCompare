const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const WISE_API_KEY = process.env.WISE_API_KEY;

const COMPETITOR_DATA = {
    "Al Ansari": {
        AED_INR: {
            rate: 25.90,
            limit: 1000,
            feeBelowLimit: 18.57,
            feeAboveLimit: 25.24
        },
        AED_PKR: {
            rate: 76.80,
            limit: 740,
            feeBelowLimit: 20,
            feeAboveLimit: 0
        },
        AED_PHP: {
            rate: 16.10,
            fee: 23.10
        }
    },

    "LuLu Exchange": {
        AED_INR: {
            rate: 25.88,
            feeMin: 15,
            feeMax: 25
        },
        AED_PKR: {
            rate: 76.50,
            feeMin: 15,
            feeMax: 25
        },
        AED_PHP: {
            rate: 16.20,
            feeMin: 15,
            feeMax: 25
        }
    },

    "Western Union": {
        AED_INR: {
            rate: 25.82,
            fee: 12
        },
        AED_PKR: {
            rate: 76.20,
            fee: 12
        },
        AED_PHP: {
            rate: 15.95,
            fee: 12
        }
    },

    "UAE Exchange": {
        AED_INR: {
            rate: 25.68,
            fee: 10
        },
        AED_PKR: {
            rate: 75.90,
            fee: 10
        },
        AED_PHP: {
            rate: 15.85,
            fee: 10
        }
    }
};

function calculateFee(data, amount) {
    if (data.fee !== undefined) {
        return data.fee;
    }

    if (
        data.limit !== undefined &&
        data.feeBelowLimit !== undefined &&
        data.feeAboveLimit !== undefined
    ) {
        return amount < data.limit ? data.feeBelowLimit : data.feeAboveLimit;
    }

    if (data.feeMin !== undefined && data.feeMax !== undefined) {
        return data.feeMax;
    }

    return 0;
}

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
            example: "/rate?source=AED&target=INR&amount=1000"
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
        const fee = 0;
        const amountAfterFee = amount - fee;
        const recipientGets = amountAfterFee * rate;

        res.json({
            provider: "Wise",
            source,
            target,
            amount_sent: amount,
            exchange_rate: rate,
            fee,
            amount_after_fee: Number(amountAfterFee.toFixed(2)),
            recipient_gets: Number(recipientGets.toFixed(2))
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
    const corridor = `${source}_${target}`;

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
        const wiseFee = 0;
        const wiseAmountAfterFee = amount - wiseFee;
        const wiseRecipientGets = wiseAmountAfterFee * wiseRate;

        results.push({
            provider: "Wise",
            rate: wiseRate,
            fee: wiseFee,
            amount_after_fee: Number(wiseAmountAfterFee.toFixed(2)),
            recipient_gets: Number(wiseRecipientGets.toFixed(2))
        });

    } catch (error) {
        console.log("Wise API failed:", error.message);
    }

    for (const provider in COMPETITOR_DATA) {
        const data = COMPETITOR_DATA[provider][corridor];

        if (data) {
            const rate = data.rate;
            const fee = calculateFee(data, amount);
            const amountAfterFee = amount - fee;
            const recipientGets = amountAfterFee * rate;

            results.push({
                provider,
                rate,
                fee,
                amount_after_fee: Number(amountAfterFee.toFixed(2)),
                recipient_gets: Number(recipientGets.toFixed(2))
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
        best_recipient_gets: results[0].recipient_gets,
        results
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});