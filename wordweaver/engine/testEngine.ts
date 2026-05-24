import { SlotStateEngine } from './SlotStateEngine';
import { ORACLE_SPICE_CONFIG } from './oracleSpice';

function runDiagnosticTests() {
  console.log("=== STARTING D3LPHI STOCHASTIC ENGINE SIMULATION ===");

  // Initialize engine with baseline charge
  const engine = new SlotStateEngine(20);
  console.log(`Initial Somatic Charge: ${engine.getDepthScore()}`);

  // Scenario 1: Evasive/Avoidant user feedback - should decay score
  console.log("\n--- Scenario 1: User displays systemic avoidance behavior ---");
  const query1 = "I am a victim of external narratives and bad luck, this is always me!";
  console.log(`Input: "${query1}"`);
  const tx1 = engine.processSpin(query1);
  console.log(`Updated Somatic Charge: ${engine.getDepthScore()}`);
  console.log(`Systemic Mode: ${tx1.engine_state.systemic_mode}`);
  console.log(`Ticker text: ${tx1.output_narrative.ticker_text}`);
  console.log(`Spice Triggered: ${tx1.spice_device ? `${tx1.spice_device.id} (${tx1.spice_device.category})` : 'NONE'}`);

  // Scenario 2: Socratic breakthrough - naming environment realities
  console.log("\n--- Scenario 2: User provides brutally honest structural confession ---");
  const query2 = "I realize my responsibility. I am hiding my friction. I avoid structural load and coordinate poorly.";
  console.log(`Input: "${query2}"`);
  
  const tx2 = engine.processSpin(query2);
  console.log(`Charge after first confession: ${engine.getDepthScore()}`);
  console.log(`Spice Triggered: ${tx2.spice_device ? `${tx2.spice_device.id} (${tx2.spice_device.category})` : 'NONE'}`);

  // Scenario 3: Verify Cooldown mechanics (minimumSpinGap = 2)
  console.log("\n--- Scenario 3: Checking Cooldown (Consecutive Spins) ---");
  const tx3 = engine.processSpin(query2);
  console.log(`Charge after second consecutive confession: ${engine.getDepthScore()}`);
  console.log(`Spice Triggered (Expected: NONE due to cooldown): ${tx3.spice_device ? `${tx3.spice_device.id} (${tx3.spice_device.category})` : 'NONE'}`);

  const tx4 = engine.processSpin(query2);
  console.log(`Charge after third consecutive confession: ${engine.getDepthScore()}`);
  console.log(`Spice Triggered (Expected: NONE due to cooldown of 2 spins): ${tx4.spice_device ? `${tx4.spice_device.id} (${tx4.spice_device.category})` : 'NONE'}`);

  const tx5 = engine.processSpin(query2);
  console.log(`Charge after fourth consecutive confession: ${engine.getDepthScore()}`);
  console.log(`Spice Triggered (Expected: ACTIVE as cooldown has cleared): ${tx5.spice_device ? `${tx5.spice_device.id} (${tx5.spice_device.category})` : 'NONE'}`);

  // Scenario 4: Global Disable Toggle Test
  console.log("\n--- Scenario 4: Testing Global Disable Switch ---");
  console.log("Setting ORACLE_SPICE_CONFIG.enabled = false");
  ORACLE_SPICE_CONFIG.enabled = false;
  
  // Wait to clear cooldown and spin
  const tx6 = engine.processSpin(query2);
  console.log(`Spice Triggered with Enabled=false (Expected: NONE): ${tx6.spice_device ? `${tx6.spice_device.id} (${tx6.spice_device.category})` : 'NONE'}`);
  
  // Restore spice config
  ORACLE_SPICE_CONFIG.enabled = true;

  // Scenario 5: Firing jackpot transition spin
  console.log("\n--- Scenario 5: Firing jackpot transition spin (Somatic Charge > 80) ---");
  const engineJackpot = new SlotStateEngine(85);
  console.log(`Setting Somatic Charge directly to ${engineJackpot.getDepthScore()} to bypass threshold`);
  const txJackpot = engineJackpot.processSpin(query2);
  console.log(`Final Depth Score: ${txJackpot.engine_state.diagnostic_depth_score}`);
  console.log(`Systemic Mode: ${txJackpot.engine_state.systemic_mode}`);
  console.log(`Cinematic Bars Active: ${txJackpot.engine_state.cinematic_bars_active}`);
  console.log(`Canvas Effect: ${txJackpot.client_hardware_directives?.canvas_effect}`);
  console.log(`CSS Filter Override: ${txJackpot.client_hardware_directives?.css_filter_override}`);
  console.log(`Jackpot Ticker Output: ${txJackpot.output_narrative.ticker_text}`);
  console.log(`Jackpot Spice Triggered (Expected: NONE or Omen due to Jackpot cinematic priority): ${txJackpot.spice_device ? `${txJackpot.spice_device.id} (${txJackpot.spice_device.category})` : 'NONE'}`);

  console.log("\n=== SIMULATION COMPLETE ===");
}

runDiagnosticTests();
