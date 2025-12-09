
import { SYSTEM_INSTRUCTION } from "../constants";

export const generateMarketingCopyClaude = async (prompt: string, apiKey: string): Promise<string> => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true" // Required for client-side testing
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
        system: SYSTEM_INSTRUCTION,
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Anthropic API request failed");
    }

    const data = await response.json();
    return data.content[0]?.text || "No content generated.";
  } catch (error: any) {
    console.error("Claude API Error:", error);
    throw new Error(error.message || "Failed to generate content with Claude.");
  }
};
