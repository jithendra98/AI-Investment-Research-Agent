import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const getGeminiModel = (temperature = 0.2) => {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error(
      "Missing GOOGLE_API_KEY — add it to .env.local. " +
      "Get a free key at https://aistudio.google.com/apikey"
    );
  }

  return new ChatGoogleGenerativeAI({
    modelName: "gemini-2.5-flash",
    maxOutputTokens: 2048,
    temperature,
    apiKey: process.env.GOOGLE_API_KEY,
    // Built-in retry: LangChain's BaseChatModel supports maxRetries
    maxRetries: 3,
  });
};
