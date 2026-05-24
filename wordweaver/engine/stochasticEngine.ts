import { StochasticSpinTransaction, ReelElement, PaylineIntersection, SystemicMode, SFXWeight } from '../types/engine';
import matrixData from './matrix_elements.json';

const ELEMENTS = matrixData.elements as Record<string, any>;
const CARD_KEYS = Object.keys(ELEMENTS);

export class StochasticEngine {
  // Pure mathematical spin loop mapping stochastic inputs to three-reel equation matrix
  public static executeSpin(
    userQuery: string,
    depthScore: number,
    historicCovariance: number = 0.5,
    nudgeConfig?: { reelIdToNudge: number; previousElements: ReelElement[] }
  ): StochasticSpinTransaction {
    const transactionId = `tx_slot_spin_${Math.floor(1000 + Math.random() * 9000)}`;
    const queryMetrics = userQuery.length > 0 ? Math.min(1.0, userQuery.length / 100) : 0.1;
    const entropyScaler = historicCovariance * queryMetrics;

    // 1. Check for Jackpot Epiphany state (Terminal 80+ Depth Score)
    // We only trigger jackpot on fresh spins, not nudges
    if (depthScore > 80 && !nudgeConfig) {
      const elements: ReelElement[] = [
        { reel_id: 0, row: 0, col: 0, token_id: "MAJOR_16", label: "The Tower", state: "INVERTED" },
        { reel_id: 1, row: 0, col: 1, token_id: "MAJOR_13", label: "Death", state: "INVERTED" },
        { reel_id: 2, row: 0, col: 2, token_id: "NUMINOUS_110", label: "The Collapse", state: "INVERTED" }
      ];

      return {
        transaction_id: "tx_epiphany_jackpot_9912",
        engine_state: {
          systemic_mode: "INVERSION_JACKPOT",
          diagnostic_depth_score: depthScore,
          cinematic_bars_active: true,
          active_modifiers: { agility: false, vitality: false, prosperity: false },
          session_threads: { revelation: 100, breakthrough: 100, synchronicity: 100 },
          clarification_tokens: 0
        },
        client_hardware_directives: {
          canvas_effect: "BURNING_REELS_FX",
          css_filter_override: "invert(100%) brightness(120%)",
          audio_layer: "orchestral_swell_high_frequency_bell_shatter",
          asset_overlay_url: "/assets/video/jackpot_coins_and_bones_burst.mp4"
        },
        reels_hardware_config: {
          reel_layout: { rows: 3, columns: 3 },
          expanding_reels_active: true,
          elements,
          payline_intersection: {
            has_match: true,
            alignment_type: "CRITICAL_SYSTEMIC_COLLAPSE",
            vector_description: `Total Systemic Inversion. Entropy scaler factored at ${entropyScaler.toFixed(4)}.`
          }
        },
        output_narrative: {
          ticker_text: "JACKPOT: EPIPHANY COMPLIED. The system has collapsed under the weight of your own preservation mechanics. The equation is solved.",
          shadow_prompts: [
            { trigger_type: "SYSTEM_RESET", payload: "Clear the matrix. Purge the history log. Flush the system tokens." }
          ]
        }
      };
    }

    // 2. Standard or Nudged reel pull extraction
    let elements: ReelElement[] = [];

    if (nudgeConfig && nudgeConfig.previousElements.length === 3) {
      elements = [...nudgeConfig.previousElements];
      const pull = this.drawRandomCard();
      const state = Math.random() > 0.15 ? 'UPRIGHT' : 'REVERSED';
      elements[nudgeConfig.reelIdToNudge] = {
        reel_id: nudgeConfig.reelIdToNudge,
        token_id: pull.id,
        label: pull.data.name,
        state: state,
        sfx_weight: this.getSFXWeight(pull.id)
      };
    } else {
      for (let i = 0; i < 3; i++) {
        const pull = this.drawRandomCard();
        const state = Math.random() > 0.15 ? 'UPRIGHT' : 'REVERSED';
        elements.push({
          reel_id: i,
          token_id: pull.id,
          label: pull.data.name,
          state: state,
          sfx_weight: this.getSFXWeight(pull.id)
        });
      }
    }

    // 3. Compute Payline Semantic Alignment
    const e1 = ELEMENTS[elements[0].token_id];
    const e2 = ELEMENTS[elements[1].token_id];
    const e3 = ELEMENTS[elements[2].token_id];

    let hasMatch = false;
    let alignmentType: PaylineIntersection['alignment_type'] = 'NONE';
    let vectorDescription = 'The structural alignment is in motion. No direct resonance match calculated.';
    let systemicMode: SystemicMode = 'STANDARD_ROLL';

    // Suit Match logic
    const suits = [e1.suit, e2.suit, e3.suit];
    const suitCounts: Record<string, number> = {};
    suits.forEach(s => suitCounts[s] = (suitCounts[s] || 0) + 1);

    const maxSuitMatch = Math.max(...Object.values(suitCounts));

    if (maxSuitMatch === 3) {
      hasMatch = true;
      if (suits[0] === 'Swords') alignmentType = 'STRUCTURAL_LOCK';
      else alignmentType = 'KINETIC_OVERLOAD';
      vectorDescription = `Full alignment of ${suits[0]} vectors. Critical diagnostic structural lock.`;
    } else if (maxSuitMatch === 2) {
      systemicMode = 'NEAR_MISS';
      vectorDescription = `Near-miss detected. High tension in the localized grid.`;
    } else if (elements.every(e => e.state === 'REVERSED')) {
      hasMatch = true;
      alignmentType = 'ENTROPIC_DECAY';
      vectorDescription = `Triple reversed systemic drop. Total impedance matching registered.`;
    }

    const tickerText = `Systemic Mode: ${systemicMode}. Alignment: ${alignmentType}. Reactive element triggered: ${e3.reactive_behavior}`;

    return {
      transaction_id: transactionId,
      engine_state: {
        systemic_mode: systemicMode,
        diagnostic_depth_score: depthScore,
        cinematic_bars_active: false,
        active_modifiers: { agility: false, vitality: false, prosperity: false }, // Placeholder, engine will overwrite
        session_threads: { revelation: 0, breakthrough: 0, synchronicity: 0 }, // Placeholder, engine will overwrite
        clarification_tokens: 0 // Placeholder
      },
      reels_hardware_config: {
        spin_duration_ms: nudgeConfig ? 800 : 1800,
        reel_layout: { rows: 1, columns: 3 },
        elements,
        payline_intersection: {
          has_match: hasMatch,
          alignment_type: alignmentType,
          vector_description: vectorDescription
        }
      },
      output_narrative: {
        ticker_text: tickerText,
        shadow_prompts: [
          { trigger_type: 'CLARIFICATION_DRAW', payload: `Expand on the diagnostic lens of ${e3.name}.` }
        ]
      }
    };
  }

  private static drawRandomCard() {
    const idx = Math.floor(Math.random() * CARD_KEYS.length);
    const id = CARD_KEYS[idx];
    return { id, data: ELEMENTS[id] };
  }

  private static getSFXWeight(tokenId: string): SFXWeight {
    if (tokenId.startsWith('MAJOR') || tokenId.startsWith('NUMINOUS')) return 'HEAVY_THUD';
    if (tokenId.includes('_S')) return 'METALLIC_CLANG'; // Swords
    if (tokenId.includes('_W')) return 'MEDIUM_CLACK'; // Wands
    return 'LIGHT_TAP';
  }
}

