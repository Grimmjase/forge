export const D3LPHI_RPG_CLASSES = {
  WANDS: {
    className: "Sorcerer / Barbarian",
    element: "Fire",
    mechanicalAction: "Adds kinetic velocity; triggers immediate re-spins when paylines align."
  },
  CUPS: {
    className: "Cleric / Bard",
    element: "Water",
    mechanicalAction: "Absorbs resource drain; generates mana pools per spin cycle tier."
  },
  SWORDS: {
    className: "Rogue / Fighter",
    element: "Air",
    mechanicalAction: "Cleanses negative modifiers; cuts through grid blockers and locked positions."
  },
  PENTACLES: {
    className: "Druid / Wizard",
    element: "Earth",
    mechanicalAction: "Locks variables in place; stacks multipliers persistently across multiple spins."
  }
};

// Generates the standard 78 RWS keys
export const TAROT_DECK_KEYS: string[] = [
  // Major Arcana
  ...Array.from({ length: 22 }, (_, i) => `MAJOR_${i.toString().padStart(2, '0')}`),
  // Wands
  ...Array.from({ length: 14 }, (_, i) => `MINOR_WANDS_${(i + 1).toString().padStart(2, '0')}`),
  // Cups
  ...Array.from({ length: 14 }, (_, i) => `MINOR_CUPS_${(i + 1).toString().padStart(2, '0')}`),
  // Swords
  ...Array.from({ length: 14 }, (_, i) => `MINOR_SWORDS_${(i + 1).toString().padStart(2, '0')}`),
  // Pentacles
  ...Array.from({ length: 14 }, (_, i) => `MINOR_PENTACLES_${(i + 1).toString().padStart(2, '0')}`)
];
