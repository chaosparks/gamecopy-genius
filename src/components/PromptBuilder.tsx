
import { type FormState, Platform, Framework } from '../types';
import { PLATFORM_DEFAULT_CTAS } from '../constants';

export const buildPrompt = (state: FormState): string => {
  const { gameName, genre, tone, platform, framework, language, usps, competitorReferences, keywords, rawDescription, customPrompt } = state;

  // Auto-generate CTA based on platform
  const callToAction = PLATFORM_DEFAULT_CTAS[platform] || "Play Now";

  // 1. Define Format Instructions based on Platform
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
      formatInstruction = `IMPORTANT OUTPUT REQUIREMENTS:
1. **Meta Description**: Strictly between 150 and 160 characters (spaces included). SEO optimized.
2. **Game Description**: Strictly between 300 and 500 words. Focus on 'Instant Play', 'No Download Required', and accessibility. Use headers and bullet points for readability on web portals.`;
      break;
    case Platform.CHROME_WEB_STORE:
      formatInstruction = "SEO-focused for Chrome Web Store. Start with a strong 1-sentence summary (above the fold). Use bullet points for features. Highlight lightweight performance and browser integration.";
      break;
    default:
      formatInstruction = "Standard marketing copy structure.";
  }

  // 2. Prepare Keyword Instruction
  const keywordList = keywords ? keywords.split('\n').filter(k => k.trim() !== '') : [];
  const keywordInstruction = keywordList.length > 0
    ? `\n- **Mandatory Keywords (SEO):** Ensure the following keywords appear naturally in the copy with good density, but do not keyword stuff:\n${keywordList.map(k => `  - "${k.trim()}"`).join('\n')}`
    : '';

  // 3. Prepare Raw Description Context (The Missing Piece)
  const rawDescriptionContext = rawDescription ? `
- **Raw Game Context / Fact Sheet:**
${rawDescription}
(IMPORTANT: Extract key factual details, mechanics, and lore from the text above to inform the copy)` : '';

  // 4. Construct Common Context (Used primarily by RTDF)
  const commonContext = `
- **Product:** ${gameName}
- **Genre:** ${genre}
- **Tone Voice:** ${tone}
${competitorReferences ? `- **Competitor/Vibe References:** ${competitorReferences}` : ''}
${rawDescriptionContext}
- **Key Selling Points:**
${usps.map(u => `  - ${u}`).join('\n')}
${keywordInstruction}
- **Call to Action:** ${callToAction}
- **Output Language:** ${language} (Write the entire copy in this language, except for untranslatable technical terms)
  `;

  const audienceInstruction = `(IMPORTANT: You must infer and define the ideal target audience based on the Genre: "${genre}", Tone: "${tone}", and Platform: "${platform}")`;

  let frameworkPrompt = "";

  switch (framework) {
    case Framework.RTDF:
      // Based on the CoppyGPT "Role-Task-Details-Format" formula
      frameworkPrompt = `
*** FORMULA: RTDF (Role, Task, Details, Format) ***

**ROLE**
You are an expert Video Game Copywriter and Marketing Strategist with a focus on high-conversion text.

**TASK**
Write a ${platform} for the game "${gameName}".

**DETAILS**
${commonContext}
- **Target Audience:** ${audienceInstruction}

**FORMAT**
${formatInstruction}
`;
      break;

    case Framework.INGREDIENTS_7:
      // Based on the "7 Essential Ingredients" formula
      frameworkPrompt = `
*** FORMULA: The 7 Essential Ingredients ***

Please write a piece of copy containing the following 7 ingredients:

1. **Length/Format:** Appropriate for ${platform}.
2. **Type:** ${platform}
3. **Product:** "${gameName}" (${genre})
4. **Target Audience:** ${audienceInstruction}
5. **Tone of Voice:** ${tone}
6. **Call to Action:** ${callToAction}
7. **Key Points (Must Include):**
${usps.map(u => `   - ${u}`).join('\n')}
${keywordList.length > 0 ? `\n(Integrate these keywords: ${keywordList.join(', ')})` : ''}

${competitorReferences ? `(Context: Similar vibe to ${competitorReferences})` : ''}
${rawDescriptionContext}

**Language:** ${language}
**Specific Formatting:** ${formatInstruction}
`;
      break;

    case Framework.QUEST:
      // Qualify, Understand, Educate, Stimulate, Transition
      frameworkPrompt = `
*** FORMULA: QUEST (Qualify, Understand, Educate, Stimulate, Transition) ***

Write a ${platform} for "${gameName}" using the QUEST framework. This is ideal for guiding the player through a journey.

1. **QUALIFY:** "Is this you?" - Call out the specific audience ${audienceInstruction} and filter them in.
2. **UNDERSTAND:** "We get it." - Show empathy for their desire for a specific gaming experience (e.g., specific genre tropes or lack thereof).
3. **EDUCATE:** "Here is the solution." - Introduce ${gameName} and how it solves their need.
4. **STIMULATE:** "Why it's awesome." - List the benefits using the USPs:
${usps.map(u => `   - ${u}`).join('\n')}
   ${keywordList.length > 0 ? `(Weave in keywords: ${keywordList.join(', ')})` : ''}
5. **TRANSITION:** "What next?" - Drive them to the ${callToAction}.

**Context:**
- Tone: ${tone}
- Language: ${language}
- Format: ${formatInstruction}
${rawDescriptionContext}
`;
      break;

    case Framework.FAB:
      // Features, Advantages, Benefits
      frameworkPrompt = `
*** FORMULA: FAB (Features, Advantages, Benefits) ***

Write a ${platform} for "${gameName}" strictly using the FAB framework. 
For EACH Key Selling Point below, you must write a bullet point that follows this structure:
"Feature (The Mechanic) -> Advantage (What it does) -> Benefit (Why the player loves it)"

**Key Selling Points to Convert:**
${usps.map(u => `- ${u}`).join('\n')}

**Context:**
- Tone: ${tone}
- Target Audience: ${audienceInstruction}
- Closing CTA: ${callToAction}
${keywordInstruction}
${rawDescriptionContext}
- Language: ${language}
- Format: ${formatInstruction}
`;
      break;

    case Framework.AIDA:
      // Attention, Interest, Desire, Action
      frameworkPrompt = `
*** FORMULA: AIDA ***

Write a ${platform} for "${gameName}" using the AIDA framework. Structure the output clearly (though you don't need to label the sections in the final copy, strictly follow the flow):

1. **ATTENTION:** Create a powerful hook related to ${genre} that stops the scroll or grabs attention immediately.
2. **INTEREST:** Elaborate on the setting or core premise. Use the specific details: ${competitorReferences || 'unique game world'}.
3. **DESIRE:** Convert features into emotional benefits. Use these USPs:
${usps.map(u => `   - ${u}`).join('\n')}
4. **ACTION:** ${callToAction}

**SEO Note:**
${keywordInstruction}

**Context:**
- Audience: ${audienceInstruction}
- Tone: ${tone}
- Language: ${language}
- Format: ${formatInstruction}
${rawDescriptionContext}
`;
      break;

    case Framework.PAS:
      // Problem, Agitation, Solution
      frameworkPrompt = `
*** FORMULA: PAS (Problem, Agitation, Solution) ***

Write a ${platform} for "${gameName}" using the PAS framework. This is excellent for ${genre} players who are tired of generic games.

1. **PROBLEM:** Identify a common frustration or boredom point for players of ${genre} (e.g., pay-to-win, repetitive grinding, lack of story).
2. **AGITATION:** Agitate that pain point. Make them feel why the current market options aren't good enough.
3. **SOLUTION:** Introduce "${gameName}" as the perfect solution.
   - Highlight these USPs as the cure:
${usps.map(u => `     - ${u}`).join('\n')}

**SEO Note:**
${keywordInstruction}

**Context:**
- Audience: ${audienceInstruction}
- Tone: ${tone}
- CTA: ${callToAction}
- Language: ${language}
- Format: ${formatInstruction}
${rawDescriptionContext}
`;
      break;

    case Framework.BAB:
      // Before, After, Bridge
      frameworkPrompt = `
*** FORMULA: BAB (Before, After, Bridge) ***

Write a ${platform} for "${gameName}" using the BAB framework.

1. **BEFORE:** Describe the player's current world (boredom, looking for the next big adventure, playing generic ${genre} games).
2. **AFTER:** Describe an ideal state where they are immersed, challenged, or having intense fun.
3. **BRIDGE:** Show how "${gameName}" gets them from Before to After.
   - Use these features as the bridge:
${usps.map(u => `     - ${u}`).join('\n')}

**SEO Note:**
${keywordInstruction}

**Context:**
- Audience: ${audienceInstruction}
- Tone: ${tone}
- CTA: ${callToAction}
- Language: ${language}
- Format: ${formatInstruction}
${rawDescriptionContext}
`;
      break;

    case Framework.STORY_HERO:
      // Hero's Journey / Narrative Focus
      frameworkPrompt = `
*** FORMULA: Story-Driven (Hero's Journey) ***

Write a narrative-focused ${platform} for "${gameName}". Focus less on technical features and more on the *experience*.

1. **The Call to Adventure:** Set the scene of the game world.
2. **The Challenge:** What stands in the player's way? (The antagonist or environment).
3. **The Transformation:** How will the player grow? (Leveling, building, conquering).

Weave these technical USPs into the story naturally:
${usps.map(u => `- ${u}`).join('\n')}

**SEO Note:**
${keywordInstruction}

**Context:**
- Audience: ${audienceInstruction}
- Tone: ${tone}
- CTA: ${callToAction}
- Language: ${language}
- Format: ${formatInstruction}
${rawDescriptionContext}
`;
      break;

    default:
      frameworkPrompt = `
*** FORMULA: General Marketing Copy ***
Write a ${platform} for ${gameName}.
Tone: ${tone}.
Audience: ${audienceInstruction}.
USPs: ${usps.join(', ')}.
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
${frameworkPrompt}

${customInstruction}

*** FINAL EXECUTION GUIDELINES ***
1. Do not includes the labels (e.g. "Role:", "Task:") in the final output unless requested by the platform format.
2. Be creative and engaging.
3. Ensure the output length matches the platform constraints.
4. STRICTLY output in ${language}.
`;
};
