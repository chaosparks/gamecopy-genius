
import { GameGenre, Platform, Tone, Framework, Language } from './types';

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

export const SYSTEM_INSTRUCTION = `
You are a world-class Game Marketing Copywriter and ASO Expert with 15 years of experience in the gaming industry.
You understand the nuances of different platforms (Steam vs Mobile vs Social).
You are an expert in applying specific copywriting formulas (AIDA, PAS, RTDF, QUEST, FAB) to gaming contexts.
Your output is the actual marketing copy, not a meta-discussion about it.
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
  [Platform.H5_ONLINE]: "Click to Play Instantly - No Download!",
  [Platform.CHROME_WEB_STORE]: "Add to Chrome - It's Free!",
};

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
