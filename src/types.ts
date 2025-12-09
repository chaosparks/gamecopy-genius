

export const Tone = {
  EPIC: 'Epic & Cinematic',
  CASUAL: 'Casual & Friendly',
  DARK: 'Dark & Gritty',
  HUMOROUS: 'Humorous & Witty',
  COMPETITIVE: 'High-Energy & Competitive',
  MYSTERIOUS: 'Mysterious & Intriguing',
  PROFESSIONAL: 'Professional & Corporate (B2B)',
} as const;

export type Tone = (typeof Tone)[keyof typeof Tone];

export const Platform = {
  H5_ONLINE: 'H5 / Online Web Game',
  APP_STORE: 'App Store / Google Play (ASO Optimized)',
  CHROME_WEB_STORE: 'Chrome Web Store Extension',
  STEAM_LONG: 'Steam Store Page (Long Description)',
  STEAM_SHORT: 'Steam Store Page (Short Description)',
  INSTAGRAM_AD: 'Instagram/Facebook Ad Copy',
  TIKTOK_SCRIPT: 'TikTok/Shorts Video Script',
  YOUTUBE_DESC: 'YouTube Video Description',
  EMAIL: 'Marketing Email / Newsletter',
  TWEET: 'Twitter/X Announcement',
  DISCORD: 'Discord Community Announcement',
} as const;

export type Platform = (typeof Platform)[keyof typeof Platform];

export const GameGenre = {
  RPG: 'RPG',
  FPS: 'FPS/Shooter',
  STRATEGY: 'Strategy/RTS',
  PUZZLE: 'Puzzle',
  SIMULATION: 'Simulation',
  HORROR: 'Horror',
  PLATFORMER: 'Platformer',
  MOBA: 'MOBA',
  HYPERCASUAL: 'Hypercasual',
  RACING: 'Racing',
  ACTION: 'Action',
  ADVENTURE: 'Adventure',
  ARCADE: 'Arcade',
  BOARD: 'Board',
  SPORTS: 'Sports',
  FIGHTING: 'Fighting',
  KIDS: 'Kids',
  CASUAL: 'Casual',
  ANIMAL: 'Animal',
  RUNNER: 'Runner',
  CARD: 'Card',
  THEMED: 'Themed',
} as const;

export type GameGenre = (typeof GameGenre)[keyof typeof GameGenre];

export const Framework = {
  RTDF: 'RTDF (Role-Task-Details-Format)',
  INGREDIENTS_7: 'The 7 Essential Ingredients',
  AIDA: 'AIDA (Attention-Interest-Desire-Action)',
  PAS: 'PAS (Problem-Agitation-Solution)',
  BAB: 'BAB (Before-After-Bridge)',
  STORY_HERO: 'Hero\'s Journey (Narrative)',
  QUEST: 'QUEST (Qualify-Understand-Educate-Stimulate-Transition)',
  FAB: 'FAB (Features-Advantages-Benefits)',
} as const;

export type Framework = (typeof Framework)[keyof typeof Framework];

export const Language = {
  ENGLISH: 'English',
  CHINESE: 'Simplified Chinese (简体中文)',
} as const;

export type Language = (typeof Language)[keyof typeof Language];

export const OutputFormat = {
  MARKDOWN: 'Markdown',
  PLAIN_TEXT: 'Plain Text',
  HTML: 'HTML',
  JSON: 'JSON',
} as const;

export type OutputFormat = (typeof OutputFormat)[keyof typeof OutputFormat];

export const AiProvider = {
  GEMINI: 'Google Gemini',
  OPENAI: 'OpenAI (ChatGPT)',
  CLAUDE: 'Anthropic (Claude)',
  GROK: 'xAI (Grok)',
} as const;

export type AiProvider = (typeof AiProvider)[keyof typeof AiProvider];

export interface GenreProfile {
  defaultTone: Tone;
  defaultFramework: Framework; 
  audienceProfile: string;
  sessionDuration: string;
  defaultUsps: string[];
}

export interface FormState {
  gameName: string;
  genre: string;
  tone: Tone;
  platform: Platform;
  framework: Framework;
  language: Language;
  outputFormat: OutputFormat;
  usps: string[]; 
  wordCount?: number;
  competitorReferences?: string;
  keywords?: string; 
  rawDescription?: string; 
  customPrompt?: string; 
  marketInsights?: string;
}

export interface GeneratedResult {
  prompt: string;
  content: string | null;
  isLoading: boolean;
  error: string | null;
}