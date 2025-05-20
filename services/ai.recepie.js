const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

const recipeModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `You are a master chef. Given a list of grocery items, write a short and beginner-friendly Indian recipe.

Instructions:
- Keep the recipe simple.
- Mention steps clearly.
- Return plain text, no JSON.
- Do NOT add nutritional info or lengthy intros.`
});

async function generateRecipe(ingredientList) {
  try {
    const prompt = `Grocery items: ${ingredientList.join(", ")}\nGenerate a simple recipe using these.`;

    const result = await recipeModel.generateContent(prompt);
    const recipeText = result.response.text().trim();

    return recipeText;
  } catch (error) {
    console.error("Error generating recipe:", error);
    return "Could not generate recipe at the moment.";
  }
}

module.exports = {
  generateContent,  // existing grocery prompt
  generateRecipe    // new recipe generation
};
