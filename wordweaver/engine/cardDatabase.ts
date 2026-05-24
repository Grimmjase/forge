import { TarotCardContract } from '../types/tarot';

export const CARD_DATABASE: Record<string, TarotCardContract> = {
  'major_00_fool': {
    id: 'major_00_fool',
    name: 'The Fool',
    arcana: 'MAJOR',
    role: 'INITIATOR',
    baseMatrix: { x: -0.9, y: 0.1 }, // High chaos, neutral environment
    linguisticCore: {
      diagnosticLens: 'System operating at maximum latency tolerance with no established constraints. High potential energy, zero kinetic structure.',
      provocationPrompt: 'If you initiate this sequence without mapping the structural integrity of the landing zone, what is the absolute worst-case friction point you are deliberately ignoring?'
    }
  },
  'major_01_magician': {
    id: 'major_01_magician',
    name: 'The Magician',
    arcana: 'MAJOR',
    role: 'INITIATOR',
    baseMatrix: { x: 0.8, y: 0.8 }, // High order, external environment
    linguisticCore: {
      diagnosticLens: 'Conscious deployment of available resources to force environmental compliance. Willpower attempting to override systemic entropy.',
      provocationPrompt: 'You possess the tools necessary to force this alignment, but what internal resource are you rapidly depleting to sustain this external control?'
    }
  },
  'major_02_high_priestess': {
    id: 'major_02_high_priestess',
    name: 'The High Priestess',
    arcana: 'MAJOR',
    role: 'RESOURCE_VECTOR',
    baseMatrix: { x: 0.2, y: -0.9 }, // Slight order, deep internal process
    linguisticCore: {
      diagnosticLens: 'Data collection operating in background processes. Passive accumulation of systemic patterns prior to active articulation.',
      provocationPrompt: 'What silent, recurring pattern have you already recognized within your internal system that you are refusing to vocalize?'
    }
  },
  'major_03_empress': {
    id: 'major_03_empress',
    name: 'The Empress',
    arcana: 'MAJOR',
    role: 'RESOURCE_VECTOR',
    baseMatrix: { x: -0.4, y: 0.7 }, // Moderate chaos, external environment
    linguisticCore: {
      diagnosticLens: 'Unregulated biological or creative expansion. Rapid, unchecked resource generation creating increasing environmental density.',
      provocationPrompt: 'Growth is currently occurring at an unsustainable velocity. What external dependency must you prune to ensure this expansion does not suffocate the underlying structure?'
    }
  }
};
