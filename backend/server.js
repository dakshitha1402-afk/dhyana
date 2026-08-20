const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

app.post("/api/insight", async (req, res) => {

    try {

        const practiceData = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        const prompt = `
You are Dhyana, a calm digital wellbeing companion.

Analyze the user's practice data below.

Your job is NOT to judge the user or compare them with others.

Give:
1. One observation about their practice.
2. One short reflection.
3. One practical suggestion.

You may draw inspiration from the Bhagavad Gita
and Vijnana Bhairava Tantra.

IMPORTANT:
- Do not invent quotations.
- Do not pretend a paraphrase is a direct quotation.
- If mentioning scripture, clearly identify it as
  "Inspired by" or give the chapter/verse reference.
- Keep the response concise and warm.
- Do not give medical or psychological diagnoses.

User practice data:

${JSON.stringify(practiceData, null, 2)}
`;

        const result = await model.generateContent(prompt);

        const response = result.response.text();

        res.json({
            success: true,
            insight: response
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: "Unable to generate insight."
        });
    }
});

app.listen(3000, () => {
    console.log("Dhyana AI backend running on http://localhost:3000");
});