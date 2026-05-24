import fs from 'fs/promises';
import path from 'path';

const ENGINE_DIR = path.join(process.cwd(), 'src', 'engine');
const TARGET_FILE = path.join(ENGINE_DIR, 'master_synthesis.json');

const rwsNames: Record<string, string> = {
  "MAJOR_00": "The Fool",
  "MAJOR_01": "The Magician",
  "MAJOR_02": "The High Priestess",
  "MAJOR_03": "The Empress",
  "MAJOR_04": "The Emperor",
  "MAJOR_05": "The Hierophant",
  "MAJOR_06": "The Lovers",
  "MAJOR_07": "The Chariot",
  "MAJOR_08": "Strength",
  "MAJOR_09": "The Hermit",
  "MAJOR_10": "Wheel of Fortune",
  "MAJOR_11": "Justice",
  "MAJOR_12": "The Hanged Man",
  "MAJOR_13": "Death",
  "MAJOR_14": "Temperance",
  "MAJOR_15": "The Devil",
  "MAJOR_16": "The Tower",
  "MAJOR_17": "The Star",
  "MAJOR_18": "The Moon",
  "MAJOR_19": "The Sun",
  "MAJOR_20": "Judgement",
  "MAJOR_21": "The World"
};

const getMinorName = (suit: string, num: string) => {
  const numberNames: Record<string, string> = {
    "01": "Ace", "02": "Two", "03": "Three", "04": "Four", "05": "Five",
    "06": "Six", "07": "Seven", "08": "Eight", "09": "Nine", "10": "Ten",
    "11": "Page", "12": "Knight", "13": "Queen", "14": "King"
  };
  return `${numberNames[num]} of ${suit.charAt(0).toUpperCase() + suit.slice(1).toLowerCase()}`;
};

async function main() {
  console.log('Reading master_synthesis.json...');
  const dataRaw = await fs.readFile(TARGET_FILE, 'utf-8');
  const database = JSON.parse(dataRaw);
  
  for (const key of Object.keys(database)) {
    if (rwsNames[key]) {
      database[key].name = rwsNames[key];
    } else if (key.startsWith('MINOR_')) {
      // e.g., MINOR_WANDS_01
      const parts = key.split('_');
      if (parts.length === 3) {
        database[key].name = getMinorName(parts[1], parts[2]);
      }
    }
  }
  
  await fs.writeFile(TARGET_FILE, JSON.stringify(database, null, 2));
  console.log('Successfully reverted all 78 names to traditional Rider-Waite-Smith nomenclature.');
}

main().catch(console.error);
