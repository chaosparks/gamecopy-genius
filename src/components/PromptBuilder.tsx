
import { type FormState, Platform, Framework, GameGenre, AiProvider } from '../types';
import { PLATFORM_DEFAULT_CTAS, GENRE_MARKET_DATA } from '../constants';

export const buildPrompt = (state: FormState, provider: AiProvider): string => {
  const { gameName, genre, tone, platform, framework, language, usps, competitorReferences, keywords, rawDescription, customPrompt } = state;

  // Filter out empty USPs
  const validUsps = usps.filter(u => u && u.trim().length > 0);

  // Auto-generate CTA based on platform
  const callToAction = PLATFORM_DEFAULT_CTAS[platform] || "Play Now";

  // Lookup Market Data based on Genre
  const marketData = GENRE_MARKET_DATA[genre as GameGenre] || {
    audienceProfile: "General Gaming Audience",
    sessionDuration: "Variable"
  };

  // --- 1. PROVIDER OPTIMIZATION LAYER ---
  let providerContext = "";
  switch (provider) {
    case AiProvider.GEMINI:
      providerContext = `
**AI OPTIMIZATION (GEMINI)**:
- Leverage your high-context window to deeply understand the "Vibe" and "Tone".
- Be creatively expressive. Use evocative language (but avoid the banned AI buzzwords).
- Formatting: Use clean, spacious Markdown. 
`;
      break;
    case AiProvider.CLAUDE:
      providerContext = `
**AI OPTIMIZATION (CLAUDE)**:
- I have provided context in structured sections. Please parse them carefully.
- Claude excels at nuance; ensure the "Tone" (${tone}) is distinctly captured.
- Structure your response using clear headers and avoid unnecessary preamble.
`;
      break;
    case AiProvider.GROK:
      providerContext = `
**AI OPTIMIZATION (xAI GROK)**:
- Be witty, sharp, and engaging.
- Avoid the "corporate sterile" tone common in other AIs.
- Focus on "Real Talk" with the gamer. 
- Don't be afraid to be slightly edgy if the Tone (${tone}) allows it.
`;
      break;
    case AiProvider.OPENAI:
    default:
      providerContext = `
**AI OPTIMIZATION (GPT-4)**:
- Strictly adhere to the requested structure and logic.
- Do not add conversational filler before or after the copy.
- Focus on high-conversion psychology and precision.
`;
      break;
  }

  // --- 2. MULTI-VARIATION LOGIC (STANDARD) ---
  // Always request 3 distinct options to give the user choices.
  const variationInstruction = `
**TASK**: Generate **3 DISTINCT COPY OPTIONS** for this request.
Do not output just one version. I need to choose the best one.

1. **Option 1 (Direct & Clear)**: Focus on clarity, core features, and trust. 
2. **Option 2 (Balanced & Engaging)**: A mix of narrative hook and strong selling points.
3. **Option 3 (Creative & Bold)**: Push the boundaries of the tone "${tone}". High energy.

**Format Output As:**
--- OPTION 1 ---
[Content]

--- OPTION 2 ---
[Content]

--- OPTION 3 ---
[Content]
`;

  // 3. Define Format Instructions based on Platform
  let formatInstruction = "";
  switch (platform) {
    case Platform.STEAM_LONG:
      formatInstruction = "Use Markdown formatting (headers, bold, lists). Include a 'Reviews' section placeholder and 'Features' list. Focus on immersion and mechanics.";
      break;
    case Platform.STEAM_SHORT:
      formatInstruction = "Strictly under 300 characters if possible, or very concise. High impact hook immediately.";
      break;
    case Platform.APP_STORE:
      formatInstruction = "Focus on keywords for ASO (App Store Optimization). Use emoji bullet points. Structure: Hook -> Benefits -> Features -> Social Proof -> CTA.";
      break;
    case Platform.INSTAGRAM_AD:
      formatInstruction = "Short, punchy, visually descriptive text. Include 15-20 relevant hashtags at the end. Use emojis.";
      break;
    case Platform.TIKTOK_SCRIPT:
      formatInstruction = "Format as a video script. [Scene Start] -> [Visual Cue] -> [Audio/Voiceover]. Keep it under 60 seconds spoken. High energy hook in the first 3 seconds.";
      break;
    case Platform.YOUTUBE_DESC:
      formatInstruction = "SEO-optimized video description. Include timestamps placeholder, feature list, and social links placeholder.";
      break;
    case Platform.TWEET:
      formatInstruction = "Under 280 characters. Witty, engaging, use 2-3 hashtags max.";
      break;
    case Platform.EMAIL:
      formatInstruction = "Subject Line options included. Personal tone. Body structure: Hook -> Value -> Offer.";
      break;
    case Platform.H5_ONLINE:
      formatInstruction = `IMPORTANT OUTPUT REQUIREMENTS (Modeled after Poki / GamePix styles):

1. **Meta Description**: 
   - STRICTLY between 150 and 160 characters. 
   - SEO optimized but highly readable.
   - Example style: "Play ${gameName} for free online! Master the art of ${genre} in this addictive browser game. No downloads required."
   - **MUST include the game name "${gameName}"**.

2. **Game Description**:
   - **Length**: 300-500 words.
   - **Tone**: Casual, enthusiastic, and direct. Write like a gamer recommending a game to a friend. Avoid "marketing speak".
   - **Structure**:
     - **Intro Hook**: 2-3 sentences. What is the game? Why is it fun? (e.g., "${gameName} is an addictive ${genre} game where you...")
     - **Gameplay & Mechanics**: How do you play? What are the goals?
     - **Key Features**: Bullet points of what makes it cool.
     - **How to Play / Controls**: A specific section explaining controls (e.g., "Controls: Use WASD to move...").
   - **Keywords**: Naturally integrate "play for free", "online browser game", "no download", "play on mobile".
   - **MUST include the game name "${gameName}" naturally multiple times**.`;
      break;
    case Platform.CHROME_WEB_STORE:
      formatInstruction = "SEO-focused for Chrome Web Store. Start with a strong 1-sentence summary (above the fold). Use bullet points for features. Highlight lightweight performance and browser integration.";
      break;
    default:
      formatInstruction = "Standard marketing copy structure.";
  }

  // 4. Prepare Keyword Instruction
  const keywordList = keywords ? keywords.split('\n').filter(k => k.trim() !== '') : [];
  const keywordInstruction = keywordList.length > 0
    ? `\n- **Mandatory Keywords (SEO):** Ensure the following keywords appear naturally in the copy with good density, but do not keyword stuff:\n${keywordList.map(k => `  - "${k.trim()}"`).join('\n')}`
    : '';

  // 5. Prepare Raw Description Context
  const rawDescriptionContext = rawDescription ? `
- **Raw Game Context / Fact Sheet:**
${rawDescription}

**INSTRUCTION FOR RAW CONTEXT:**
Analyze the text above and prioritize extracting the following facts to use in the copy:
1. **Core game mechanics** (How the game actually plays)
2. **Key features** (Top 3-5 standout elements)
3. **Player benefits** (Why the player will love it)
4. **Unique selling points** (What makes it different from competitors)
5. **Current tone/style** (Identify and adapt the vibe)
6. **Keywords** (Retain significant terms found in the text)
` : '';

  // 6. Construct Common Context
  // Conditionally render USP section only if valid USPs exist
  const uspSection = validUsps.length > 0 
    ? `- **Key Selling Points:**\n${validUsps.map(u => `  - ${u}`).join('\n')}`
    : '';

  const commonContext = `
- **Product:** ${gameName}
- **Genre:** ${genre}
- **Tone Voice:** ${tone}
${competitorReferences ? `- **Competitor/Vibe References:** ${competitorReferences}` : ''}
${rawDescriptionContext}
${uspSection}
${keywordInstruction}
- **Call to Action:** ${callToAction}
- **Output Language:** ${language} (Write the entire copy in this language, except for untranslatable technical terms)

**Market Intelligence Data (Auto-Inferred):**
- **Target Audience:** ${marketData.audienceProfile} (Infer further details from Platform: ${platform})
- **Typical Session Length:** ${marketData.sessionDuration}
  `;

  const audienceInstruction = `(Use Auto-Inferred Market Intelligence: "${marketData.audienceProfile}" adapted for ${platform})`;

  let frameworkPrompt = "";

  switch (framework) {
    case Framework.RTDF:
      frameworkPrompt = `
*** FORMULA: RTDF (Role, Task, Details, Format) ***

**ROLE**
You are an expert Video Game Copywriter and Marketing Strategist with a focus on high-conversion text.

**TASK**
${variationInstruction}

**DETAILS**
${commonContext}

**FORMAT**
${formatInstruction}
`;
      break;

    case Framework.INGREDIENTS_7:
      frameworkPrompt = `
*** FORMULA: The 7 Essential Ingredients ***

Please write copy containing the following 7 ingredients.
${variationInstruction}

1. **Length/Format:** Appropriate for ${platform}.
2. **Type:** ${platform}
3. **Product:** "${gameName}" (${genre})
4. **Target Audience:** ${audienceInstruction}
5. **Tone of Voice:** ${tone}
6. **Call to Action:** ${callToAction}
7. **Key Points (Must Include):**
${validUsps.length > 0 ? validUsps.map(u => `   - ${u}`).join('\n') : '(Extract relevant features from Raw Context)'}
${keywordList.length > 0 ? `\n(Integrate these keywords: ${keywordList.join(', ')})` : ''}

${competitorReferences ? `(Context: Similar vibe to ${competitorReferences})` : ''}
${rawDescriptionContext}

**Language:** ${language}
**Specific Formatting:** ${formatInstruction}
`;
      break;

    case Framework.QUEST:
      frameworkPrompt = `
*** FORMULA: QUEST (Qualify, Understand, Educate, Stimulate, Transition) ***

${variationInstruction}
Use the QUEST framework to guide the player through a journey.

1. **QUALIFY:** "Is this you?" - Call out the specific audience ${audienceInstruction}.
2. **UNDERSTAND:** "We get it." - Show empathy.
3. **EDUCATE:** "Here is the solution." - Introduce ${gameName}.
4. **STIMULATE:** "Why it's awesome." - List benefits/Key Selling Points.
5. **TRANSITION:** "What next?" - Drive them to the ${callToAction}.

**Context:**
- Tone: ${tone}
- Language: ${language}
- Format: ${formatInstruction}
${commonContext}
`;
      break;

    case Framework.FAB:
      frameworkPrompt = `
*** FORMULA: FAB (Features, Advantages, Benefits) ***

${variationInstruction}
Strictly use the FAB framework. For EACH Key Selling Point, write:
"Feature (The Mechanic) -> Advantage (What it does) -> Benefit (Why the player loves it)"

${validUsps.length > 0 ? `**Key Selling Points:**\n${validUsps.map(u => `- ${u}`).join('\n')}` : '(Instruction: Extract features from the Raw Context/Description to apply FAB formula)'}

**Context:**
- Tone: ${tone}
- Audience: ${audienceInstruction}
- CTA: ${callToAction}
${keywordInstruction}
${rawDescriptionContext}
- Language: ${language}
- Format: ${formatInstruction}
`;
      break;

    case Framework.AIDA:
      frameworkPrompt = `
*** FORMULA: AIDA ***

${variationInstruction}
Structure the output strictly following the AIDA flow:

1. **ATTENTION:** Powerful hook related to ${genre}.
2. **INTEREST:** Elaborate on setting/premise.
3. **DESIRE:** Convert features into emotional benefits.
4. **ACTION:** ${callToAction}

**Context:**
- Audience: ${audienceInstruction}
- Tone: ${tone}
- Language: ${language}
- Format: ${formatInstruction}
${commonContext}
`;
      break;

    case Framework.PAS:
      frameworkPrompt = `
*** FORMULA: PAS (Problem, Agitation, Solution) ***

${variationInstruction}
Use the PAS framework:

1. **PROBLEM:** Identify a common frustration for ${genre} players.
2. **AGITATION:** Agitate that pain point.
3. **SOLUTION:** Introduce "${gameName}" as the perfect solution using the Key Selling Points.

**Context:**
- Audience: ${audienceInstruction}
- Tone: ${tone}
- CTA: ${callToAction}
- Language: ${language}
- Format: ${formatInstruction}
${commonContext}
`;
      break;

    case Framework.BAB:
      frameworkPrompt = `
*** FORMULA: BAB (Before, After, Bridge) ***

${variationInstruction}
Use the BAB framework:

1. **BEFORE:** Describe the player's current world (boredom, generic games).
2. **AFTER:** Describe an ideal state of fun/immersion.
3. **BRIDGE:** Show how "${gameName}" gets them there.

**Context:**
- Audience: ${audienceInstruction}
- Tone: ${tone}
- CTA: ${callToAction}
- Language: ${language}
- Format: ${formatInstruction}
${commonContext}
`;
      break;

    case Framework.STORY_HERO:
      frameworkPrompt = `
*** FORMULA: Story-Driven (Hero's Journey) ***

${variationInstruction}
Focus on the *experience* and narrative:

1. **The Call to Adventure:** Set the scene.
2. **The Challenge:** What stands in the way?
3. **The Transformation:** How will the player grow?

**Context:**
- Audience: ${audienceInstruction}
- Tone: ${tone}
- CTA: ${callToAction}
- Language: ${language}
- Format: ${formatInstruction}
${commonContext}
`;
      break;

    default:
      frameworkPrompt = `
*** FORMULA: General Marketing Copy ***
${variationInstruction}
Tone: ${tone}.
Audience: ${audienceInstruction}.
USPs: ${validUsps.length > 0 ? validUsps.join(', ') : 'Refer to Context'}.
CTA: ${callToAction}.
Language: ${language}.
${keywordInstruction}
${rawDescriptionContext}
`;
  }

  const customInstruction = customPrompt 
    ? `\n*** CUSTOM USER INSTRUCTIONS (Must Follow) ***\n${customPrompt}\n`
    : "";

  return `
${providerContext}

${frameworkPrompt}

${customInstruction}

*** FINAL EXECUTION GUIDELINES ***
1. Do not includes the labels (e.g. "Role:", "Task:") in the final output unless requested by the platform format.
2. Be creative and engaging.
3. Ensure the output length matches the platform constraints.
4. STRICTLY output in ${language}.
`;
};
