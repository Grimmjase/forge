export interface TarotCardData {
  key: string;
  class_archetype: string;
  race: string;
  upright_state: {
    ability_name: string;
    system_callback: string;
    visual_animation_prompt: string;
  };
  inverted_state: {
    ability_name: string;
    system_callback: string;
    visual_animation_prompt: string;
  };
}

export const buildAdversarialPrompt = (card: TarotCardData) => {
  return {
    key: card.key,
    upright_prompt: `
      IMAGE_GEN_TASK: Create a dual-state metallic bas-relief token for ${card.key}.
      
      UPRIGHT_VERSION_DESCRIPTION: 
      [Physical: Thick, physical metallic collector coin medallion featuring deep bas-relief contours and crisp minted edge topography] 
      [Class: ${card.class_archetype}] 
      [Race: ${card.race}]
      [HUD: Overlaid on the coin is a razor-thin digital HUD tracking menu made of stable, readable glowing vector shapes (#00F0FF) and telemetry tracks (#FF7E1B)] 
      [Vibe: Heroic, armored, tactical, pristine, precise]
      [Specific Action: ${card.upright_state.visual_animation_prompt}]
         
      STYLE_LOCK: Ultra-realistic macro photograph, studio edge lighting, deep metallic bas-relief depth. No anthropomorphic animals.
    `.trim().replace(/\n\s+/g, '\n'),
    
    inverted_prompt: `
      IMAGE_GEN_TASK: Create a dual-state metallic bas-relief token for ${card.key}.
      
      INVERTED_VERSION_DESCRIPTION:
      [Physical: The heavy metal coin chassis physically fractures and splits. Deep, jagged cracks appear in the metal, distorting the ${card.race} relief]
      [Class: ${card.class_archetype}]
      [HUD: The glowing digital overlay ruptures into chaotic, bleeding neon fragments that lash out from the cracks like corrupted data (#00F0FF), while the telemetry metrics invert into an angry, pulsing red glitch-hue (#FF4500)]
      [Vibe: Corrupted, predatory, gravity-shifting, system-adversary]
      [Specific Action: ${card.inverted_state.visual_animation_prompt}]
         
      STYLE_LOCK: Ultra-realistic macro photograph, studio edge lighting, deep metallic bas-relief depth. No anthropomorphic animals.
    `.trim().replace(/\n\s+/g, '\n')
  };
};
