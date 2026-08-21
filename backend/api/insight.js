const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }

    try {
        const practiceData = req.body;

        const genAI = new GoogleGenerativeAI(
            process.env.GEMINI_API_KEY
        );

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        const prompt = `
You are Dhyana, a calm digital wellbeing companion.

Analyze the user's practice data.

Give:
1. One observation about their practice.
2. One short reflection.
3. One practical suggestion.

Your wisdom may be inspired by the Bhagavad Gita
and Vijnana Bhairava Tantra.

Do not invent quotations.
If referring to scripture, clearly say "Inspired by"
or provide the chapter/verse reference.

Keep the response concise, warm, and practical.

User practice data:
${JSON.stringify(practiceData, null, 2)}
`;

        const result = await model.generateContent(prompt);
        const insight = result.response.text();

        return res.status(200).json({
            success: true,
            insight: insight
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: "Unable to generate insight."
        });
    }
};