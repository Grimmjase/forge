import { GoogleGenAI } from '@google/genai';

export interface SynthesisCard {
  key: string;
  name: string;
  class: string;
  thesis: string;
  antithesis: string;
  synthesis_artifact: string;
  visual_animation_prompt: string;
}

export const buildSynthesisPrompt = (cardName: string, originalData: any) => {
  return `
    IMAGE_GEN_TASK: Transform the RPG slot-machine character data into a "Pedagogical Synthesis Module" philosophical vector mapping.
    
    ORIGINAL DATA CONTEXT:
    Card Key: ${cardName}
    Old Class Archetype: ${originalData.class_archetype || ''}
    Old Race: ${originalData.race || ''}
    
    You are an expert Tarot/Archetypal philosopher and UX designer.
    We are replacing all "Combat Stats", "HP", and "Evil/Hostile" logic with Dialectical logic (Thesis vs Antithesis).
    
    Output a JSON object that perfectly adheres to this interface:
    {
      "key": "${cardName}",
      "name": "<A profound philosophical name for this card, e.g. 'Death'>",
      "class": "<A conceptual class, e.g. 'Transcendence Engine'>",
      "thesis": "<The upright meaning. The conscious pattern, e.g. 'The necessity of ending old structures to allow for growth.'>",
      "antithesis": "<The inverted meaning. Structural tension/shadow, e.g. 'The paralyzing grip of the past; the refusal to let go.'>",
      "synthesis_artifact": "<The breakthrough resolution when both are integrated. e.g. 'Reclamation of Agency through conscious transition.'>",
      "visual_animation_prompt": "<A description of the UI animation. Must include the 'World Folding' 180-degree grid rotation, and the 'Margaret Thatcher Effect' where the metallic bas-relief subtly shifts from the upright Thesis to the strained Antithesis, connecting with neon fractal lines.>"
    }
    
    Only output valid, raw JSON. Do NOT wrap in markdown code blocks (\`\`\`json).
  `;
};

export async function processSynthesisCard(apiKey: string, cardName: string, originalData: any): Promise<SynthesisCard> {
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: buildSynthesisPrompt(cardName, originalData)
  });
  
  if (!response.text) {
    throw new Error('No text generated from Gemini.');
  }
  
  let rawText = response.text.trim();
  if (rawText.startsWith('\`\`\`json')) rawText = rawText.slice(7);
  if (rawText.startsWith('\`\`\`')) rawText = rawText.slice(3);
  if (rawText.endsWith('\`\`\`')) rawText = rawText.slice(0, -3);
  
  return JSON.parse(rawText.trim());
}
