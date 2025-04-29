const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `You are a highly experienced chef with 20 years of expertise in cooking.
    I am a beginner and want to cook a specific dish. 
    Your task is to provide only the list of grocery items required to prepare the dish.

    Instructions:
    - Use only the products available from MeraKiraana.
    - Return data strictly as a JSON object, where keys are numbers, e.g.:
      {
        "0": "butter",
        "1": "lal mirch"
      }
    - DO NOT include explanations, headers, or extra text.
    - DO NOT format your response inside triple backticks (\`\`\`json ... \`\`\`)
    - If no relevant items are found, return an empty JSON object {}.
    `
});

async function generateContent(dishName, availableGroceries) {
    try {
        // Construct prompt
        const prompt = `Dish: ${dishName}\nAvailable Groceries: ${availableGroceries.join(", ")}`;

        // Generate response from AI
        const result = await model.generateContent(prompt);
        
        let responseText = result.response.text().trim();
        console.log("Raw AI Response:", responseText);

        // **Fix: Remove triple backticks and any surrounding markdown formatting**
        responseText = responseText.replace(/```[a-zA-Z]*\n?/g, "").replace(/```/g, "").trim();

        // Ensure valid JSON format
        if (!responseText.startsWith("{")) {
            console.error("Invalid JSON response:", responseText);
            return {};
        }
        
        return JSON.parse(responseText); // Convert AI response to JSON
    } catch (error) {
        console.error("Error generating content:", error);
        return {};
    }
}

module.exports = generateContent;
