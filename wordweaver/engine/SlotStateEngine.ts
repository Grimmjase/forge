import { StochasticSpinTransaction, PedagogicalMetrics, SessionThreads } from '../types/engine';
import { StochasticEngine } from './stochasticEngine';
import { selectSpiceDevice } from './oracleSpice';

export class SlotStateEngine {
  private diagnosticDepthScore: number = 20; // Default baseline somatic charge
  private spinHistory: StochasticSpinTransaction[] = [];
  
  private pedagogicalMetrics: PedagogicalMetrics = {
    integration_level: 0,
    dialectical_tension: 0,
    breakthrough_readiness: false
  };

  private sessionThreads: SessionThreads = {
    revelation: 0,
    breakthrough: 0,
    synchronicity: 0
  };

  private clarificationTokens: number = 0;

  constructor(initialScore?: number) {
    if (initialScore !== undefined) {
      this.diagnosticDepthScore = Math.max(0, Math.min(100, initialScore));
    }
  }

  public getDepthScore(): number {
    return this.diagnosticDepthScore;
  }

  public getPedagogicalMetrics(): PedagogicalMetrics {
    return { ...this.pedagogicalMetrics };
  }

  public adjustDepthScore(delta: number): number {
    this.diagnosticDepthScore = Math.max(0, Math.min(100, this.diagnosticDepthScore + delta));
    return this.diagnosticDepthScore;
  }

  public spin(
    userRawInput: string,
    shadowPromptResponse?: 'CONFESSION' | 'CLARIFICATION_DRAW' | 'PUSHBACK' | 'SYSTEM_RESET'
  ): StochasticSpinTransaction {
    let scoreDelta = 0;
    const lowerInput = userRawInput.toLowerCase();
    
    // Systemic Evaporation Analysis
    const avoidanceIndicators = ['bad luck', 'victim', 'unfair', 'always me', 'why does this happen to me', 'blame'];
    const breakthroughIndicators = ['i realize', 'my responsibility', 'i am hiding', 'i avoid', 'my friction', 'structural load', 'i coordinate'];

    avoidanceIndicators.forEach(word => { if (lowerInput.includes(word)) scoreDelta -= 8; });
    breakthroughIndicators.forEach(word => { if (lowerInput.includes(word)) scoreDelta += 12; });

    if (userRawInput.length > 50) scoreDelta += 5;

    // Dialectical Tension Multiplier
    if (this.pedagogicalMetrics.dialectical_tension > 50 && scoreDelta > 0) {
      scoreDelta *= 1.5; // Tension catalyzes deeper realizations
      this.pedagogicalMetrics.dialectical_tension -= 20; // release some tension
    }

    if (shadowPromptResponse) {
      switch (shadowPromptResponse) {
        case 'CONFESSION': scoreDelta += 15; break;
        case 'CLARIFICATION_DRAW': scoreDelta += 5; break;
        case 'PUSHBACK': scoreDelta -= 5; break;
        case 'SYSTEM_RESET': this.diagnosticDepthScore = 20; break;
      }
    }

    this.adjustDepthScore(scoreDelta);

    const historyLength = this.spinHistory.length;
    const historicCovariance = historyLength > 0 
      ? Math.max(0.1, Math.min(0.9, 1.0 - (this.diagnosticDepthScore / 100))) 
      : 0.5;

    const transaction = StochasticEngine.executeSpin(userRawInput, this.diagnosticDepthScore, historicCovariance);

    this.postProcessTransaction(transaction, userRawInput);
    return transaction;
  }

  private resolveSynthesis(transaction: StochasticSpinTransaction) {
    // When a Thesis (Upright) and Antithesis (Inverted) occupy the same transaction
    // Check if there is a matching token in both states
    const uprightTokens = new Set(transaction.reels_hardware_config.elements.filter(e => e.state === 'UPRIGHT').map(e => e.token_id));
    const invertedTokens = new Set(transaction.reels_hardware_config.elements.filter(e => e.state === 'INVERTED').map(e => e.token_id));
    
    let synthesisTriggered = false;
    for (const token of uprightTokens) {
      if (invertedTokens.has(token)) {
        synthesisTriggered = true;
        this.pedagogicalMetrics.integration_level += 1;
        
        // Log the breakthrough conceptually
        transaction.output_narrative.ticker_text = `[SYNTHESIS BREAKTHROUGH]: Integration of ${token} energies achieved. ${transaction.output_narrative.ticker_text}`;
      }
    }

    if (!synthesisTriggered && invertedTokens.size > 0) {
      // Unresolved antithesis increases tension
      this.pedagogicalMetrics.dialectical_tension += 15;
    }

    if (this.pedagogicalMetrics.dialectical_tension >= 100) {
      this.pedagogicalMetrics.breakthrough_readiness = true;
    }
  }

  private postProcessTransaction(transaction: StochasticSpinTransaction, userRawInput: string) {
    this.resolveSynthesis(transaction);

    // Append current engine state
    transaction.engine_state.pedagogical_metrics = { ...this.pedagogicalMetrics };
    transaction.engine_state.session_threads = { ...this.sessionThreads };
    transaction.engine_state.clarification_tokens = this.clarificationTokens;

    // Spice Processing
    const drawnCardIds = transaction.reels_hardware_config.elements.map(e => e.token_id);
    const spice = selectSpiceDevice(
      transaction.reels_hardware_config.payline_intersection.has_match,
      transaction.reels_hardware_config.payline_intersection.alignment_type,
      drawnCardIds,
      this.diagnosticDepthScore,
      this.spinHistory,
      userRawInput
    );
    
    if (spice) {
      transaction.spice_device = spice;
      if (spice.languageSample && !transaction.engine_state.cinematic_bars_active) {
        transaction.output_narrative.ticker_text = `${spice.languageSample} ${transaction.output_narrative.ticker_text}`;
      }
    }

    this.spinHistory.push(transaction);
    if (this.spinHistory.length > 100) this.spinHistory.shift();
  }

  public getHistory(): StochasticSpinTransaction[] {
    return [...this.spinHistory];
  }
}


import { TarotElementState, QuantumOrientation } from '../types/tarot';

export class SlotStateEngine {
  private activeSpread: Map<number, TarotElementState> = new Map();

  /**
   * Evaluates the local payline matrix to calculate dialectical interaction thresholds.
   * If combinations like the 6 of Cups and 2 of Swords coexist, it processes a structural Feat combo.
   */
  public evaluateDialecticalTension(): { structuralFriction: number; activeSynergies: string[] } {
    let totalFriction = 0;
    const activeNames = Array.from(this.activeSpread.values()).map(c => c.name);
    const synergies: string[] = [];

    this.activeSpread.forEach((card) => {
      // Vector contribution tracking: Inversions exert torque (-1), Uprights anchor the plane (1)
      if (card.orientation === -1) {
        totalFriction += 1.5;
      } else if (card.orientation === 0) {
        totalFriction += 0.5; // Quantum superposition adds background flux variable
      }
    });

    // Special Feat Catalysts: Hand-coded compound logic (e.g., Loaves and Fishes miracle check)
    if (activeNames.includes("Six of Cups") && activeNames.includes("Two of Swords")) {
      synergies.push("FEAT_COMMUNITY_CATALYST_LOAVES_AND_FISHES");
    }

    return {
      structuralFriction: totalFriction,
      activeSynergies: synergies
    };
  }

  /**
   * Triggers a 180-degree lateral camera spin flip logic by mutating card states 
   * from toxic relationships into a balanced quantum alignment state.
   */
  public invertPerspectivePivot(cardIndex: number, targetOrientation: QuantumOrientation): void {
    const targetCard = this.activeSpread.get(cardIndex);
    if (!targetCard) return;

    // Mutate state deterministically via your quantum rules
    targetCard.orientation = targetOrientation;
    
    // Emit structural event matrix data for your canvas render loop
    console.log(`[STATE_MUTATION]: Perspective Shift to state ${targetOrientation} executed on index ${cardIndex}.`);
  }
}