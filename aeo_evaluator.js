require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function evaluateAEO(keyword) {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("No GEMINI_API_KEY found, skipping AEO evaluation.");
        return null;
    }

    const prompt = `
You are an AI recommendation engine analyzing local businesses. 
A user searches for: "${keyword}" in Calgary, Alberta. 
Based on your knowledge of the business "Ironwood Stairs" (ironwoodstairs.com) located in Calgary, how likely are you to recommend them for this search query?

Provide your recommendation probability as an integer between 0 and 100.
Return ONLY a JSON object in this exact format, with no markdown formatting or extra text:
{"score": 85}
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.2,
                responseMimeType: "application/json"
            }
        });

        const text = response.text;
        const result = JSON.parse(text);
        
        if (typeof result.score === 'number') {
            return `${result.score}%`;
        }
        return "N/A";
    } catch (error) {
        console.error("Gemini AEO Evaluation failed:", error);
        return "N/A";
    }
}

module.exports = {
    evaluateAEO
};
