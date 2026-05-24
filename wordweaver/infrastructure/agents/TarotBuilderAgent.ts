import { GoogleGenAI } from '@google/genai';

export async function executeTarotBuilderLoop(cardKey: string, seedContext: string = "") {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const agentPrompt = `
    You are the primary D3LPHI Systems Architect. Your task is to process a tarot card entry and structure it into a bivalent, adversarial RPG character record.
    
    TARGET CARD: ${cardKey}
    SEED CONTEXT: ${seedContext}
    
    CRITICAL DESIGN CONSTRAINTS:
    1. ART DIRECTION: The card must be described as a thick, physical metallic collector coin medallion featuring deep bas-relief contours and crisp minted edge topography. Humanoid fantasy races only (Orcs, Elves, Giants, Gnomes, Halflings, Undead). Absolutely NO anthropomorphic or talking animals.
    2. HUD LAYER: Overlaid on the coin is a razor-thin digital HUD tracking menu made of glowing vector shapes (#00F0FF) and telemetry tracks (#FF7E1B).
    3. INVERSION MECHANIC: When inverted, the card acts as a hostile adversarial obstacle. The physical coin fractures, causing the clean digital UI lines to crack and shift under a heavy gravity tilt.
    
    Generate a pure JSON block following this exact structural sheet:
    {
      "key": "${cardKey}",
      "class_archetype": "Fantasy class matched to suit",
      "race": "Humanoid fantasy race",
      "base_stats": { "hp": 100, "mana": 50, "initiative": 10 },
      "upright_state": {
        "ability_name": "Name of pristine hero action",
        "system_callback": "Game engine multiplier or buff math modification description",
        "visual_animation_prompt": "Prompt for video engine detailing the flawless stamped metal coin with clean tracking HUD lines catching studio edge lights"
      },
      "inverted_state": {
        "ability_name": "Name of hostile counter-modifier action",
        "system_callback": "Adversarial gravity drain, friction penalty, or grid blocker behavior description",
        "visual_animation_prompt": "Prompt for video engine detailing the coin physically flipping upside-down, fracturing its metallic chassis as neon lines break and bleed out"
      }
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: agentPrompt,
    config: { responseMimeType: 'application/json' }
  });

  return JSON.parse(response.text);
}
