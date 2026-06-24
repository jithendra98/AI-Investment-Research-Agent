import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const getGeminiModel = (temperature = 0.2) => {
  return new ChatGoogleGenerativeAI({
    modelName: "gemini-2.5-flash",
    maxOutputTokens: 2048,
    temperature,
    apiKey: process.env.GOOGLE_API_KEY || "dummy-key",
    // Built-in retry: LangChain's BaseChatModel supports maxRetries
    maxRetries: 3,
  });
};
