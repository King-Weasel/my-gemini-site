const { GoogleGenerativeAI } = require("@google/generative-ai");

// Note: We no longer need the 'fs' and 'path' modules.

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // --- REBUILD THE PROMPT FROM ENVIRONMENT VARIABLES ---
    // This reads multiple variables and joins them together in order.
    const promptPart1 = process.env.SECRET_PROMPT_1 || '';
    const promptPart2 = process.env.SECRET_PROMPT_2 || '';
    const promptPart3 = process.env.SECRET_PROMPT_3 || '';
    // Add more parts if you need them.
    const secretSystemPrompt = promptPart1 + promptPart2 + promptPart3;

    // --- ACCESS YOUR API KEY (No change here) ---
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error("Gemini API key is not configured.");
    }
    
    const requestBody = JSON.parse(event.body);
    const userInput = requestBody.userInput || requestBody.promptText;

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const fullPrompt = `${secretSystemPrompt}\n\nUser: ${userInput}`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: text, response: text }),
    };
  } catch (error) {
    console.error("Error in function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Sorry, something went wrong on the server." }),
    };
  }
};