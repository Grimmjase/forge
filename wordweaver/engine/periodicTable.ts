export interface CognitiveVector {
  focus: number;
  entropy: number;
  resilience: number;
  latency: number;
  receptivity: number;
  expression: number;
  synthesis: number;
  friction: number;
}

export type PhysicalWeight = 'MAJOR_AXIS' | 'MINOR_KINETIC' | 'MINOR_FRICTION' | 'MINOR_RECEPTIVE' | 'MINOR_STABILIZER';

export interface RWSCardDefinition {
  tokenId: string;
  label: string;
  physicalWeight: PhysicalWeight;
  reactiveProperties: string[];
  mechanicalPayload: string;
  baseVector: CognitiveVector;
}

// The Periodic Table of D3LPHI: 8D Coordinate Space coordinates mapped statically as thermodynamic physical properties
export const RWS_PERIODIC_TABLE: Record<string, RWSCardDefinition> = {
  // Major Arcana (M00 - M21) - Core baseline systemic forces
  "M00": {
    tokenId: "M00",
    label: "The Fool",
    physicalWeight: "MAJOR_AXIS",
    reactiveProperties: ["High Velocity", "Zero Drag", "Initial Acceleration"],
    mechanicalPayload: "High-Velocity, Zero-Drag System Initiation.",
    baseVector: { focus: 0.1, entropy: 0.9, resilience: 0.4, latency: 0.2, receptivity: 0.8, expression: 0.7, synthesis: 0.2, friction: 0.3 }
  },
  "M06": {
    tokenId: "M06",
    label: "The Lovers",
    physicalWeight: "MAJOR_AXIS",
    reactiveProperties: ["Bi-Directional Binding", "Systemic Convergence", "Phase Alignment"],
    mechanicalPayload: "Harmonic Bi-Directional Binding (Cooperative System Link).",
    baseVector: { focus: 0.4, entropy: 0.6, resilience: 0.7, latency: 0.3, receptivity: 0.8, expression: 0.6, synthesis: 0.5, friction: 0.4 }
  },
  "M10": {
    tokenId: "M10",
    label: "Wheel of Fortune",
    physicalWeight: "MAJOR_AXIS",
    reactiveProperties: ["Stochastic Torque", "Rotational Inertia", "Environmental Volatility"],
    mechanicalPayload: "Fluctuating Probability Vector (Stochastic Environmental Torque).",
    baseVector: { focus: 0.2, entropy: 0.9, resilience: 0.5, latency: 0.1, receptivity: 0.6, expression: 0.8, synthesis: 0.4, friction: 0.6 }
  },
  "M13": {
    tokenId: "M13",
    label: "Death",
    physicalWeight: "MAJOR_AXIS",
    reactiveProperties: ["Terminal Dissolution", "Phase Transition", "Forced Asset Liquidation"],
    mechanicalPayload: "Terminal System Phase Transition (Liquidation of Outdated Assets).",
    baseVector: { focus: 0.9, entropy: 0.3, resilience: 0.2, latency: 0.8, receptivity: 0.1, expression: 0.1, synthesis: 0.8, friction: 0.2 }
  },
  "M16": {
    tokenId: "M16",
    label: "The Tower",
    physicalWeight: "MAJOR_AXIS",
    reactiveProperties: ["Catastrophic Decompression", "Structural Disruption", "Sudden Kinetic Release"],
    mechanicalPayload: "Catastrophic Structural Failure (Decompression of Overloaded Assets).",
    baseVector: { focus: 0.2, entropy: 0.9, resilience: 0.1, latency: 0.1, receptivity: 0.2, expression: 0.9, synthesis: 0.3, friction: 0.9 }
  },
  
  // Wands Suite (W01 - W14) - Pure kinetic energy and expression
  "W05": {
    tokenId: "W05",
    label: "Five of Wands",
    physicalWeight: "MINOR_KINETIC",
    reactiveProperties: ["Intersecting Kinetics", "Vector Dissipation", "Thermal Agitation"],
    mechanicalPayload: "Chaotic Intersecting Kinetics (Uncoordinated Vector Dissipation).",
    baseVector: { focus: 0.3, entropy: 0.7, resilience: 0.4, latency: 0.1, receptivity: 0.2, expression: 0.8, synthesis: 0.3, friction: 0.8 }
  },
  
  // Swords Suite (S01 - S14) - Structural logic and cognitive friction
  "S03": {
    tokenId: "S03",
    label: "Three of Swords",
    physicalWeight: "MINOR_FRICTION",
    reactiveProperties: ["Friction Loop", "Containment Leak", "Voltage Drain"],
    mechanicalPayload: "Somatic Friction Loop (Three-Point Emotional Containment Leak).",
    baseVector: { focus: 0.8, entropy: 0.3, resilience: 0.2, latency: 0.4, receptivity: 0.3, expression: 0.5, synthesis: 0.4, friction: 0.9 }
  },
  "S10": {
    tokenId: "S10",
    label: "Ten of Swords",
    physicalWeight: "MINOR_FRICTION",
    reactiveProperties: ["Impedance Lock", "Terminal Collapse", "Grounding Drain"],
    mechanicalPayload: "Absolute Impedance Lock (Terminal Phase Collapse).",
    baseVector: { focus: 0.9, entropy: 0.2, resilience: 0.1, latency: 0.8, receptivity: 0.1, expression: 0.3, synthesis: 0.5, friction: 0.9 }
  }
};
