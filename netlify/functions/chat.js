// Import the Google AI library
const { GoogleGenerativeAI } = require("@google/generative-ai");

// This is the main function that Netlify will run
exports.handler = async function (event) {
  // --- SECURITY CHECK ---
  // We only accept POST requests. This is a basic security measure.
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // --- ACCESS YOUR SECRETS SAFELY ---
  // Get the API key and your secret prompt from environment variables
  // We will set these up in the Netlify dashboard later.
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const secretSystemPrompt = process.env.SECRET_SYSTEM_PROMPT;

  // Get the user's message from the frontend
  const { userInput } = JSON.parse(event.body);

  try {
    // Initialize the AI with your secret API key
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // --- BUILD THE FULL PROMPT ---
    // Combine your secret system prompt with the user's input
    const fullPrompt = `${secretSystemPrompt}\n\nUser: ${userInput}`;

    // --- CALL THE GEMINI API ---
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Send the AI's response back to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: text }),
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Sorry, something went wrong." }),
    };
  }
};