import { generateMarketingCopy } from "./geminiService";

// Uses a CORS proxy to fetch the data client-side
const FEED_URL = "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://rss.gamemonetize.com/rssfeed.php?format=json&type=html5&popularity=newest&category=All&company=All&amount=20");

interface GameFeedItem {
  title: string;
  description: string;
  instructions: string;
  category: string;
}

export const analyzeGameMonetizeTrends = async (genre: string): Promise<string> => {
  try {
    // 1. Fetch real market data
    const response = await fetch(FEED_URL);
    if (!response.ok) throw new Error("Failed to fetch GameMonetize feed");
    
    const data: GameFeedItem[] = await response.json();

    // 2. Filter / Sample data (Get top 5 longest descriptions to analyze style)
    // We prefer longer descriptions as they contain more "style" data than 1-liners.
    const samples = data
      .filter(game => game.description && game.description.length > 50) 
      .slice(0, 5)
      .map(g => `GAME: ${g.title} (${g.category})\nDESC: ${g.description}\nINSTRUCTIONS: ${g.instructions}`)
      .join("\n\n----------------\n\n");

    if (!samples || samples.length === 0) return "Could not find sufficient market data to analyze.";

    // 3. Construct the Analysis Prompt for Gemini
    // We ask Gemini to act as a Data Scientist/Copywriter
    const analysisPrompt = `
      You are a Senior Game Market Analyst. 
      I have fetched the latest popular games from GameMonetize.com.
      
      Here are 5 samples of their raw descriptions and instructions:
      
      ${samples}
      
      *** YOUR TASK ***
      Analyze these samples and extract the "Winning Copywriting Patterns" for this market.
      Focus on:
      1. **Structure**: How do they start? How do they explain controls?
      2. **Keywords**: What specific words appear frequently (e.g., "Browser", "Mobile", "Tap")?
      3. **Tone**: Is it formal, hype-driven, or purely functional?
      4. **Length**: Are sentences short or long?
      
      Output a concise set of "Style Rules" (max 150 words) that I can feed into an AI to replicate this successful style. 
      Do not describe the games, just describe the *writing style*.
    `;

    // 4. Get the insights
    // process.env.API_KEY is handled inside generateMarketingCopy
    const insights = await generateMarketingCopy(analysisPrompt);
    return insights;

  } catch (error: any) {
    console.error("Market Analysis Error:", error);
    throw new Error("Failed to analyze market trends: " + error.message);
  }
};