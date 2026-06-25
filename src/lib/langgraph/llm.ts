import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const getGeminiModel = (temperature = 0.2) => {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error(
      "Missing GOOGLE_API_KEY — add it to .env.local. " +
      "Get a free key at https://aistudio.google.com/apikey"
    );
  }

  const primaryModel = new ChatGoogleGenerativeAI({
    modelName: "gemini-2.5-flash",
    maxOutputTokens: 2048,
    temperature,
    apiKey: process.env.GOOGLE_API_KEY,
    maxRetries: 3,
  });

  const fallbackModel = new ChatGoogleGenerativeAI({
    modelName: "gemini-1.5-flash", // Fallback to an older model which might have less load
    maxOutputTokens: 2048,
    temperature,
    apiKey: process.env.GOOGLE_API_KEY,
    maxRetries: 3,
  });

  // LangChain automatically routes to the fallback model if the primary model fails (e.g., 503 error)
  return primaryModel.withFallbacks({
    fallbacks: [fallbackModel]
  });
};
