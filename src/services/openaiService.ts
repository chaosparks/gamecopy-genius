import { SYSTEM_INSTRUCTION } from "../constants";

export const generateMarketingCopyOpenAI = async (prompt: string, apiKey: string): Promise<string> => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "OpenAI API request failed");
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No content generated.";
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    throw new Error(error.message || "Failed to generate content with OpenAI.");
  }
};
