import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { executeTarotBuilderLoop } from '../agents/TarotBuilderAgent.js';
import { TAROT_DECK_KEYS, D3LPHI_RPG_CLASSES } from './seedDictionary.js';

// Setup file paths
const TARGET_DIR = path.join(process.cwd(), 'src', 'engine');
const TARGET_FILE = path.join(TARGET_DIR, 'master_creatures.json');

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('ERROR: GEMINI_API_KEY environment variable is missing.');
    console.error('Please run: export GEMINI_API_KEY="your_key"');
    process.exit(1);
  }

  console.log(`Starting generation of ${TAROT_DECK_KEYS.length} RPG Tarot Entities...`);

  // Try to load existing data to support resuming
  let database: Record<string, any> = {};
  try {
    const existing = await fs.readFile(TARGET_FILE, 'utf-8');
    database = JSON.parse(existing);
    console.log(`Loaded ${Object.keys(database).length} existing entries.`);
  } catch (e) {
    console.log('No existing database found. Starting fresh.');
  }

  for (let i = 0; i < TAROT_DECK_KEYS.length; i++) {
    const key = TAROT_DECK_KEYS[i];
    
    if (database[key]) {
      console.log(`[${i + 1}/${TAROT_DECK_KEYS.length}] Skipping ${key} (Already exists)`);
      continue;
    }

    console.log(`[${i + 1}/${TAROT_DECK_KEYS.length}] Generating ${key}...`);

    let seedContext = "";
    if (key.includes('WANDS')) seedContext = JSON.stringify(D3LPHI_RPG_CLASSES.WANDS);
    if (key.includes('CUPS')) seedContext = JSON.stringify(D3LPHI_RPG_CLASSES.CUPS);
    if (key.includes('SWORDS')) seedContext = JSON.stringify(D3LPHI_RPG_CLASSES.SWORDS);
    if (key.includes('PENTACLES')) seedContext = JSON.stringify(D3LPHI_RPG_CLASSES.PENTACLES);
    if (key.startsWith('MAJOR')) seedContext = "Major Arcana. Legendary Tier. Reality-breaking global multipliers or complete payline immunity shields.";

    try {
      const generatedRecord = await executeTarotBuilderLoop(key, seedContext);
      database[key] = generatedRecord;

      // Save continuously to prevent data loss on crash
      await fs.writeFile(TARGET_FILE, JSON.stringify(database, null, 2));
      console.log(`  -> Success! Saved to master_creatures.json`);

      // Rate limiting buffer (3 seconds)
      await delay(3000);
    } catch (err: any) {
      console.error(`  -> ERROR generating ${key}:`, err.message);
      console.log('Halting pipeline. You can run the script again to resume from this point.');
      break;
    }
  }

  console.log('Pipeline execution complete.');
}

main();
