import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export const generateMarketingCopy = async (prompt: string, apiKey?: string): Promise<string> => {
  try {
    // Priority: Function argument -> Environment Variable
    const key = apiKey || process.env.API_KEY;
    
    if (!key) {
      throw new Error("API Key is missing. Please configure it in Settings or set the API_KEY environment variable.");
    }

    const ai = new GoogleGenAI({ apiKey: key });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8, // Slightly creative for marketing
      },
    });

    return response.text || "No content generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate content.");
  }
};
