import { StochasticSpinTransaction, SpiceDevice, SpiceCategory } from '../types/engine';

// 1. Global Tuning Configuration for complete legibility, scaling, and instant disabling
export const ORACLE_SPICE_CONFIG = {
  enabled: true,           // Global toggle: set to false to completely silence the spice layer
  baseIntensity: 1.0,      // Scaler for visual animations & reveal delay durations (0.0 to 2.0)
  minimumSpinGap: 2,       // Cooldown: minimum number of spins between spice activations
};

// 2. The Comprehensive Registry of Dramatic Devices
export const SPICE_REGISTRY: Record<string, SpiceDevice> = {
  // --- ATMOSPHERIC DEVICES ---
  "bg_shift": {
    id: "bg_shift",
    category: "ATMOSPHERIC",
    triggerCondition: "Card similarity or suit resonance exceeds 0.75",
    uiEffect: { type: "backgroundShift", intensity: 0.4 }
  },
  "hush_mode": {
    id: "hush_mode",
    category: "ATMOSPHERIC",
    triggerCondition: "Standard spin with high emotional trajectory",
    uiEffect: { type: "hushMode", intensity: 0.6 }
  },
  "res_pulse": {
    id: "res_pulse",
    category: "ATMOSPHERIC",
    triggerCondition: "High single card focus",
    uiEffect: { type: "resonancePulse", intensity: 0.7 }
  },
  "omen_state": {
    id: "omen_state",
    category: "ATMOSPHERIC",
    triggerCondition: "Critical payline lock (Swords, triple reversals, etc.)",
    uiEffect: { type: "omenState", intensity: 1.0 },
    languageSample: "The mechanism registers a rare and heavy alignment."
  },

  // --- PACING DEVICES ---
  "sacred_pause": {
    id: "sacred_pause",
    category: "PACING",
    triggerCondition: "High Diagnostic Depth Score (> 60) before key lines",
    pacingEffect: { type: "sacredPause", delayMs: 1500 }
  },
  "three_beat": {
    id: "three_beat",
    category: "PACING",
    triggerCondition: "Active somatic inquiry needing progression space",
    pacingEffect: { type: "threeBeatReveal", delayMs: 800 }
  },
  "delayed_naming": {
    id: "delayed_naming",
    category: "PACING",
    triggerCondition: "Presence of a Major Arcana element",
    pacingEffect: { type: "delayedNaming", delayMs: 1200 },
    languageSample: "Before labeling the force at play, observe the environment."
  },
  "false_close": {
    id: "false_close",
    category: "PACING",
    triggerCondition: "Stagnant depth score or high defensive friction",
    pacingEffect: { type: "falseClose", delayMs: 2000 },
    languageSample: "And yet, there is a second layer clicking into place underneath."
  },
  "echo_beat": {
    id: "echo_beat",
    category: "PACING",
    triggerCondition: "High-friction Swords cards drawn",
    pacingEffect: { type: "echoBeat", delayMs: 600 },
    languageSample: "Friction... friction... look at where the heat builds."
  },

  // --- LANGUAGE DEVICES ---
  "cards_hesitate": {
    id: "cards_hesitate",
    category: "LANGUAGE",
    triggerCondition: "Highly ambiguous input or balanced vectors",
    languageSample: "The gears hesitate here, as if mapping two equal and opposing pressures."
  },
  "under_layer": {
    id: "under_layer",
    category: "LANGUAGE",
    triggerCondition: "Moderate depth confession",
    languageSample: "There is an uncalibrated capacity loop under this description."
  },
  "keeps_returning": {
    id: "keeps_returning",
    category: "LANGUAGE",
    triggerCondition: "Persistent suit drawn in consecutive spins",
    languageSample: "This calculation keeps returning to the same friction point."
  },

  // --- USER-SIGNAL DEVICES ---
  "temp_check": {
    id: "temp_check",
    category: "USER_SIGNAL",
    triggerCondition: "Short user query needing somatic localization",
    userSignal: {
      type: "temperatureCheck",
      options: ["Pressure", "Grief", "Speed", "Friction"]
    }
  },
  "clarifier_magnet": {
    id: "clarifier_magnet",
    category: "USER_SIGNAL",
    triggerCondition: "High emotional charge but unresolved direction",
    userSignal: {
      type: "clarifierMagnet",
      options: ["Draw clarifying card", "Bypass friction", "Acknowledge load"]
    }
  },
  "layer_choice": {
    id: "layer_choice",
    category: "USER_SIGNAL",
    triggerCondition: "Transition between initial state and resolution vector",
    userSignal: {
      type: "layerChoice",
      options: ["Systemic/Structural Layer", "Somatic/Friction Layer", "Shadow/Impedance Layer"]
    }
  }
};

/**
 * pure mathematical selection logic that evaluates state parameters,
 * enforces strict cooldown limits based on spin history, and selects an optimal spice device.
 */
export function selectSpiceDevice(
  reelsMatch: boolean,
  alignmentType: string,
  drawnCardIds: string[],
  depthScore: number,
  history: StochasticSpinTransaction[],
  userQuery: string
): SpiceDevice | undefined {
  // 1. Enforce global active toggle
  if (!ORACLE_SPICE_CONFIG.enabled) {
    return undefined;
  }

  // 2. Enforce global cooldown gap
  const historyLen = history.length;
  if (historyLen > 0) {
    // Look back at the last N transactions
    const lookbackLimit = Math.min(ORACLE_SPICE_CONFIG.minimumSpinGap, historyLen);
    for (let i = 1; i <= lookbackLimit; i++) {
      if (history[historyLen - i]?.spice_device !== undefined) {
        // Cooldown active: a spice device triggered too recently
        return undefined;
      }
    }
  }

  // 3. Analyze structural and environmental parameters
  const lastSpiceCategory: SpiceCategory | undefined = historyLen > 0 
    ? history[historyLen - 1]?.spice_device?.category 
    : undefined;

  // Check if we have an active payline lock
  if (reelsMatch) {
    if (alignmentType === 'STRUCTURAL_LOCK' || alignmentType === 'ENTROPIC_DECAY' || alignmentType === 'KINETIC_OVERLOAD') {
      return getScaleAdjustedSpice("omen_state");
    }
  }

  // Check if there are Swords cards indicating cognitive friction
  const hasSwords = drawnCardIds.some(id => id.startsWith('S'));
  if (hasSwords && lastSpiceCategory !== 'PACING') {
    return getScaleAdjustedSpice("echo_beat");
  }

  // Check for Major Arcana indicating a major archetypal shift
  const hasMajor = drawnCardIds.some(id => id.startsWith('M'));
  if (hasMajor && lastSpiceCategory !== 'PACING') {
    return getScaleAdjustedSpice("delayed_naming");
  }

  // Check for user-submitted telemetry length (short vs long)
  if (userQuery.length > 0 && userQuery.length < 30 && lastSpiceCategory !== 'USER_SIGNAL') {
    return getScaleAdjustedSpice("temp_check");
  }

  // If Somatic depth score is high (>60) and rising, trigger a sacred pause to let it land
  if (depthScore > 60 && lastSpiceCategory !== 'PACING') {
    return getScaleAdjustedSpice("sacred_pause");
  }

  // Default fallback: select a subtle language or pacing device based on the transaction sequence
  // We use the length of history to deterministically cycle through fallback options
  const fallbackSequence = ["cards_hesitate", "hush_mode", "under_layer", "three_beat", "layer_choice"];
  const cycleIndex = historyLen % fallbackSequence.length;
  const fallbackId = fallbackSequence[cycleIndex];
  
  const chosenDevice = SPICE_REGISTRY[fallbackId];
  if (chosenDevice && chosenDevice.category !== lastSpiceCategory) {
    return getScaleAdjustedSpice(fallbackId);
  }

  return undefined;
}

/**
 * Returns a cloned copy of the registry device, scaling any delay or visual intensity fields
 * according to the global ORACLE_SPICE_CONFIG intensity scalers.
 */
function getScaleAdjustedSpice(id: string): SpiceDevice {
  const device = SPICE_REGISTRY[id];
  const cloned = JSON.parse(JSON.stringify(device)) as SpiceDevice;

  // Scale UI Effect visual intensities
  if (cloned.uiEffect) {
    cloned.uiEffect.intensity = Math.max(0.0, Math.min(1.0, cloned.uiEffect.intensity * ORACLE_SPICE_CONFIG.baseIntensity));
  }

  // Scale Pacing delay durations
  if (cloned.pacingEffect && cloned.pacingEffect.delayMs) {
    cloned.pacingEffect.delayMs = Math.round(cloned.pacingEffect.delayMs * ORACLE_SPICE_CONFIG.baseIntensity);
  }

  return cloned;
}
