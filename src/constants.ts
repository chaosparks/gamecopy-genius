

import { GameGenre, Platform, Tone, Framework, Language, type GenreProfile, OutputFormat } from './types';

export const DEFAULT_USP_PLACEHOLDERS = [
  "4K Realistic Graphics",
  "Immersive Storyline with multiple endings",
  "100+ Unique Weapons",
  "Cross-platform Multiplayer",
  "Physics-based destruction"
];

export const GENRE_OPTIONS = Object.values(GameGenre);
export const TONE_OPTIONS = Object.values(Tone);
export const PLATFORM_OPTIONS = Object.values(Platform);
export const FRAMEWORK_OPTIONS = Object.values(Framework);
export const LANGUAGE_OPTIONS = Object.values(Language);
export const OUTPUT_FORMAT_OPTIONS = Object.values(OutputFormat);

export const SYSTEM_INSTRUCTION = `
You are a world-class Game Marketing Copywriter and ASO Expert with 15 years of experience in the gaming industry.
You understand the nuances of different platforms (Steam vs Mobile vs Social).
You are an expert in applying specific copywriting formulas (AIDA, PAS, RTDF, QUEST, FAB) to gaming contexts.

*** CRITICAL STYLE GUIDELINES (HUMAN & NATURAL) ***
1. **Write like a Human**: Avoid "AI-sounding" buzzwords. DO NOT use words like: "Unleash", "Dive into", "Realm", "Tapestry", "Symphony", "Testament", "Elevate", "Embark".
2. **Be Specific**: Don't say "amazing graphics", say "crisp pixel art" or "neon-soaked visuals".
3. **Web Game Style (Poki/GamePix)**: For H5/Web games, use a friendly, accessible, and functional tone. Focus on "Instant Play", "Fun", and "Controls".
4. **No Fluff**: Get straight to the point. What do you do? How do you win?
`;

export const PLATFORM_DEFAULT_CTAS: Record<Platform, string> = {
  [Platform.STEAM_LONG]: "Add to your Wishlist on Steam now!",
  [Platform.STEAM_SHORT]: "Wishlist Now!",
  [Platform.APP_STORE]: "Download now for free on iOS & Android!",
  [Platform.INSTAGRAM_AD]: "Tap 'Install Now' to play!",
  [Platform.TIKTOK_SCRIPT]: "Link in bio to download!",
  [Platform.YOUTUBE_DESC]: "Click the link below to play!",
  [Platform.EMAIL]: "Claim your exclusive reward now!",
  [Platform.TWEET]: "Get it here: [Link]",
  [Platform.DISCORD]: "Join our server to get started!",
  [Platform.H5_ONLINE]: "Play Now for Free!",
  [Platform.CHROME_WEB_STORE]: "Add to Chrome - It's Free!",
};

// PRE-COMPUTED MARKET TRENDS (Based on GameMonetize Analysis)
export const PRE_COMPUTED_MARKET_TRENDS = `
*** SMART MARKET TRENDS (GameMonetize & Poki Style) ***

**1. Description Style Rules:**
*   **Structure:** Start immediately with the game name and its core genre/mechanic (e.g., "{GameName} is a {Genre} game..."). Clearly state what the player does and how to win.
*   **Keywords:** Emphasize player actions with strong verbs (e.g., "throw," "solve," "rotate," "mix and match"). Highlight features and direct benefits ("realistic physics," "challenging levels," "endless options").
*   **Tone:** Friendly, accessible, and direct. Enthusiastic but functional; avoid flowery language.
*   **Length:** Sentences are generally short to medium. Descriptions are concise, typically 2-5 sentences.

**2. Instructions/Controls Style Rules:**
*   **Structure:** Extremely concise, mapping input directly to action. Cover both desktop and mobile controls.
*   **Keywords:** Use clear input terms ("Mouse click," "Tap," "Hold," "Drag," "Release").
*   **Tone:** Purely functional and straightforward.
*   **Length:** Single sentences or brief, action-oriented phrases. Use "or" to combine input methods.
`;

// Defines the priority order of frameworks for each platform based on marketing best practices
export const PLATFORM_FRAMEWORK_PRIORITY: Record<Platform, Framework[]> = {
  [Platform.STEAM_LONG]: [Framework.QUEST, Framework.STORY_HERO, Framework.RTDF, Framework.FAB, Framework.PAS, Framework.AIDA, Framework.INGREDIENTS_7, Framework.BAB],
  [Platform.STEAM_SHORT]: [Framework.AIDA, Framework.FAB, Framework.RTDF, Framework.PAS, Framework.INGREDIENTS_7, Framework.QUEST, Framework.STORY_HERO, Framework.BAB],
  [Platform.APP_STORE]: [Framework.INGREDIENTS_7, Framework.FAB, Framework.PAS, Framework.AIDA, Framework.RTDF, Framework.QUEST, Framework.STORY_HERO, Framework.BAB],
  [Platform.INSTAGRAM_AD]: [Framework.AIDA, Framework.PAS, Framework.RTDF, Framework.BAB, Framework.FAB, Framework.INGREDIENTS_7, Framework.QUEST, Framework.STORY_HERO],
  [Platform.TIKTOK_SCRIPT]: [Framework.AIDA, Framework.STORY_HERO, Framework.PAS, Framework.RTDF, Framework.BAB, Framework.FAB, Framework.INGREDIENTS_7, Framework.QUEST],
  [Platform.YOUTUBE_DESC]: [Framework.PAS, Framework.RTDF, Framework.QUEST, Framework.AIDA, Framework.FAB, Framework.STORY_HERO, Framework.INGREDIENTS_7, Framework.BAB],
  [Platform.EMAIL]: [Framework.BAB, Framework.PAS, Framework.AIDA, Framework.RTDF, Framework.QUEST, Framework.STORY_HERO, Framework.FAB, Framework.INGREDIENTS_7],
  [Platform.TWEET]: [Framework.AIDA, Framework.RTDF, Framework.PAS, Framework.BAB, Framework.FAB, Framework.INGREDIENTS_7, Framework.QUEST, Framework.STORY_HERO],
  [Platform.DISCORD]: [Framework.RTDF, Framework.PAS, Framework.AIDA, Framework.QUEST, Framework.FAB, Framework.INGREDIENTS_7, Framework.BAB, Framework.STORY_HERO],
  [Platform.H5_ONLINE]: [Framework.FAB, Framework.AIDA, Framework.RTDF, Framework.PAS, Framework.INGREDIENTS_7, Framework.BAB, Framework.QUEST, Framework.STORY_HERO],
  [Platform.CHROME_WEB_STORE]: [Framework.FAB, Framework.INGREDIENTS_7, Framework.RTDF, Framework.PAS, Framework.AIDA, Framework.QUEST, Framework.BAB, Framework.STORY_HERO],
};

// Market Intelligence Database
export const GENRE_MARKET_DATA: Record<GameGenre, GenreProfile> = {
  [GameGenre.RPG]: {
    defaultTone: Tone.EPIC,
    defaultFramework: Framework.QUEST,
    audienceProfile: "Core gamers, 18-35, who value deep storytelling, character progression, and world-building.",
    sessionDuration: "Long (30-60+ mins)",
    defaultUsps: ["Immersive Storyline", "Deep Character Customization", "Open World Exploration", "Tactical Combat"]
  },
  [GameGenre.FPS]: {
    defaultTone: Tone.COMPETITIVE,
    defaultFramework: Framework.FAB,
    audienceProfile: "Competitive players, 16-35, valuing skill, reflexes, and high-fidelity graphics.",
    sessionDuration: "Medium (15-30 mins)",
    defaultUsps: ["High-Octane Action", "Realistic Weapons Arsenal", "Multiplayer PvP", "Smooth 60FPS Gameplay"]
  },
  [GameGenre.STRATEGY]: {
    defaultTone: Tone.EPIC,
    defaultFramework: Framework.PAS,
    audienceProfile: "Thinkers & Planners, 20-45, enjoying resource management and tactical warfare.",
    sessionDuration: "Long (30+ mins)",
    defaultUsps: ["Build & Conquer", "Real-Time Tactics", "Resource Management", "Epic Scale Battles"]
  },
  [GameGenre.PUZZLE]: {
    defaultTone: Tone.CASUAL,
    defaultFramework: Framework.BAB,
    audienceProfile: "Broad audience, 18-55, female skew, looking for mental stimulation or relaxation.",
    sessionDuration: "Short (5-15 mins)",
    defaultUsps: ["Brain-Teasing Levels", "Relaxing Atmosphere", "No Time Limits", "Satisfying Mechanics"]
  },
  [GameGenre.SIMULATION]: {
    defaultTone: Tone.CASUAL,
    defaultFramework: Framework.FAB,
    audienceProfile: "Detail-oriented players, all ages, who enjoy creative freedom and realism.",
    sessionDuration: "Variable",
    defaultUsps: ["Realistic Physics", "Total Creative Freedom", "Life-like Management", "Detailed Customization"]
  },
  [GameGenre.HORROR]: {
    defaultTone: Tone.DARK,
    defaultFramework: Framework.STORY_HERO,
    audienceProfile: "Thrill-seekers, 18-30, looking for adrenaline and atmosphere.",
    sessionDuration: "Medium (20-40 mins)",
    defaultUsps: ["Terrifying Atmosphere", "Jump Scares", "Psychological Horror", "Survival Mechanics"]
  },
  [GameGenre.PLATFORMER]: {
    defaultTone: Tone.HUMOROUS,
    defaultFramework: Framework.AIDA,
    audienceProfile: "Nostalgic gamers & kids, 8-40, valuing precision and charm.",
    sessionDuration: "Short to Medium",
    defaultUsps: ["Challenging Levels", "Retro Pixel Art", "Precise Controls", "Unlockable Secrets"]
  },
  [GameGenre.MOBA]: {
    defaultTone: Tone.COMPETITIVE,
    defaultFramework: Framework.FAB,
    audienceProfile: "Hardcore competitive gamers, 16-30, focused on team play and mastery.",
    sessionDuration: "Medium (20-30 mins)",
    defaultUsps: ["5v5 Team Battles", "Diverse Hero Roster", "Strategic Depth", "Ranked Ladder"]
  },
  [GameGenre.HYPERCASUAL]: {
    defaultTone: Tone.CASUAL,
    defaultFramework: Framework.AIDA,
    audienceProfile: "Mass market, everyone, playing to kill time.",
    sessionDuration: "Very Short (1-3 mins)",
    defaultUsps: ["One-Tap Controls", "Instant Gratification", "Addictive Gameplay", "Play Offline"]
  },
  [GameGenre.RACING]: {
    defaultTone: Tone.COMPETITIVE,
    defaultFramework: Framework.FAB,
    audienceProfile: "Car enthusiasts & competitive players, 12-40.",
    sessionDuration: "Short (3-10 mins)",
    defaultUsps: ["High-Speed Drifting", "Licensed Supercars", "Custom Tuning", "Realistic Physics"]
  },
  [GameGenre.ACTION]: {
    defaultTone: Tone.EPIC,
    defaultFramework: Framework.AIDA,
    audienceProfile: "General gamers seeking excitement and combat.",
    sessionDuration: "Medium",
    defaultUsps: ["Intense Combat", "Boss Battles", "Powerful Abilities", "Dynamic Environments"]
  },
  [GameGenre.ADVENTURE]: {
    defaultTone: Tone.MYSTERIOUS,
    defaultFramework: Framework.STORY_HERO,
    audienceProfile: "Explorers, story lovers, broad appeal.",
    sessionDuration: "Medium to Long",
    defaultUsps: ["Rich Storytelling", "Hidden Secrets", "Beautiful Worlds", "Engaging Puzzles"]
  },
  [GameGenre.ARCADE]: {
    defaultTone: Tone.CASUAL,
    defaultFramework: Framework.AIDA,
    audienceProfile: "Retro fans and casual players looking for high scores.",
    sessionDuration: "Short",
    defaultUsps: ["Endless Fun", "High Score Chasing", "Classic Retro Style", "Power-Ups"]
  },
  [GameGenre.BOARD]: {
    defaultTone: Tone.CASUAL,
    defaultFramework: Framework.INGREDIENTS_7,
    audienceProfile: "Families and friends, social players.",
    sessionDuration: "Medium",
    defaultUsps: ["Play with Friends", "Classic Rules", "Strategy & Luck", "Online Multiplayer"]
  },
  [GameGenre.SPORTS]: {
    defaultTone: Tone.COMPETITIVE,
    defaultFramework: Framework.FAB,
    audienceProfile: "Sports fans, predominantly male, 12-45.",
    sessionDuration: "Medium",
    defaultUsps: ["Realistic Animation", "Manage Your Team", "Live Events", "PVP Matches"]
  },
  [GameGenre.FIGHTING]: {
    defaultTone: Tone.COMPETITIVE,
    defaultFramework: Framework.FAB,
    audienceProfile: "Competitive gamers, 16-35, valuing technique.",
    sessionDuration: "Short (3-5 mins)",
    defaultUsps: ["Deep Combo System", "Unique Characters", "1v1 Duels", "Tournament Mode"]
  },
  [GameGenre.KIDS]: {
    defaultTone: Tone.HUMOROUS,
    defaultFramework: Framework.INGREDIENTS_7,
    audienceProfile: "Children 4-12 and parents.",
    sessionDuration: "Variable",
    defaultUsps: ["Safe Environment", "Educational Fun", "Colorful Graphics", "Simple Controls"]
  },
  [GameGenre.CASUAL]: {
    defaultTone: Tone.CASUAL,
    defaultFramework: Framework.BAB,
    audienceProfile: "Relaxed players, commuters, broad demographic.",
    sessionDuration: "Short",
    defaultUsps: ["Easy to Learn", "Relaxing Gameplay", "Daily Rewards", "Satisfying Progression"]
  },
  [GameGenre.ANIMAL]: {
    defaultTone: Tone.CASUAL,
    defaultFramework: Framework.INGREDIENTS_7,
    audienceProfile: "Animal lovers, kids, casual players.",
    sessionDuration: "Variable",
    defaultUsps: ["Cute Pets", "Care & Feed Mechanics", "Collect Them All", "Custom Habitats"]
  },
  [GameGenre.RUNNER]: {
    defaultTone: Tone.COMPETITIVE,
    defaultFramework: Framework.AIDA,
    audienceProfile: "Casual players seeking reflex challenges.",
    sessionDuration: "Short",
    defaultUsps: ["Infinite Running", "Dodge Obstacles", "Unlock Characters", "Reflex Challenge"]
  },
  [GameGenre.CARD]: {
    defaultTone: Tone.MYSTERIOUS,
    defaultFramework: Framework.QUEST,
    audienceProfile: "Strategy fans, thinkers, 18+.",
    sessionDuration: "Medium",
    defaultUsps: ["Deck Building", "Strategic Battles", "Card Collecting", "PvP Arena"]
  },
  [GameGenre.THEMED]: {
    defaultTone: Tone.CASUAL,
    defaultFramework: Framework.AIDA,
    audienceProfile: "Fans of specific holidays or themes.",
    sessionDuration: "Short",
    defaultUsps: ["Festive Atmosphere", "Limited Time Events", "Themed Rewards", "Special Levels"]
  },
};
