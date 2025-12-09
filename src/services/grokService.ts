
import { SYSTEM_INSTRUCTION } from "../constants";

export const generateMarketingCopyGrok = async (prompt: string, apiKey: string): Promise<string> => {
  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-beta", 
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: prompt },
        ],
        stream: false,
        temperature: 0.9, // Grok benefits from slightly higher temp for wit
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "xAI API request failed");
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No content generated.";
  } catch (error: any) {
    console.error("Grok API Error:", error);
    throw new Error(error.message || "Failed to generate content with Grok.");
  }
};