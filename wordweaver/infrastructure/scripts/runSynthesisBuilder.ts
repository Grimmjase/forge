import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { processSynthesisCard } from '../agents/SynthesisDictionaryBuilder.js';

const ENGINE_DIR = path.join(process.cwd(), 'src', 'engine');
const SOURCE_FILE = path.join(ENGINE_DIR, 'master_creatures.json');
const TARGET_FILE = path.join(ENGINE_DIR, 'master_synthesis.json');
const API_KEY = process.env.GEMINI_API_KEY;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  if (!API_KEY) {
    console.error("Missing GEMINI_API_KEY in .env");
    process.exit(1);
  }

  console.log('Reading master_creatures.json...');
  const dataRaw = await fs.readFile(SOURCE_FILE, 'utf-8');
  const oldDatabase = JSON.parse(dataRaw);
  const keys = Object.keys(oldDatabase);
  
  let synthesisDatabase: Record<string, any> = {};
  
  // Try to resume if target file already exists
  try {
    const existingRaw = await fs.readFile(TARGET_FILE, 'utf-8');
    synthesisDatabase = JSON.parse(existingRaw);
    console.log(`Found existing master_synthesis.json with ${Object.keys(synthesisDatabase).length} entries. Resuming...`);
  } catch (e) {
    console.log("No existing synthesis database found. Starting fresh.");
  }

  console.log(`Transforming ${keys.length} cards into Pedagogical Synthesis Modules...`);
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (synthesisDatabase[key]) {
      continue; // Skip if already done
    }
    
    console.log(`[${i + 1}/${keys.length}] Generating Synthesis Vector for ${key}...`);
    try {
      const synthesizedCard = await processSynthesisCard(API_KEY, key, oldDatabase[key]);
      synthesisDatabase[key] = synthesizedCard;
      
      // Save continuously to prevent data loss
      await fs.writeFile(TARGET_FILE, JSON.stringify(synthesisDatabase, null, 2));
      console.log(`  -> Success! Saved to master_synthesis.json`);
      
      // Rate limiting
      await sleep(3000);
    } catch (err: any) {
      console.error(`  -> Failed on ${key}:`, err.message);
      // Wait longer on fail
      await sleep(10000);
    }
  }
  
  console.log("Synthesis Pipeline execution complete.");
}

main().catch(console.error);
