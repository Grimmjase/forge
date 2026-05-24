import fs from 'fs/promises';
import path from 'path';
import { buildAdversarialPrompt, TarotCardData } from '../agents/ImagePromptAgent.js';

const ENGINE_DIR = path.join(process.cwd(), 'src', 'engine');
const SOURCE_FILE = path.join(ENGINE_DIR, 'master_creatures.json');
const TARGET_FILE = path.join(ENGINE_DIR, 'card_visuals.json');

async function main() {
  console.log('Reading master_creatures.json...');
  const dataRaw = await fs.readFile(SOURCE_FILE, 'utf-8');
  const database: Record<string, TarotCardData> = JSON.parse(dataRaw);
  
  const visualsDb: Record<string, any> = {};
  const keys = Object.keys(database);
  
  console.log(`Generating prompts for ${keys.length} cards...`);
  
  for (const key of keys) {
    visualsDb[key] = buildAdversarialPrompt(database[key]);
  }
  
  await fs.writeFile(TARGET_FILE, JSON.stringify(visualsDb, null, 2));
  console.log(`Successfully wrote ${keys.length} dual-state prompts to card_visuals.json`);
}

main().catch(console.error);
