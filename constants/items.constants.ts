export const MAX_ITEM_LEVEL = 5;
export const RARITY = {
  COMMON: "common",
  UNCOMMON: "uncommon",
  RARE: "rare",
  LEGENDARY: "legendary",
  EPIC: "epic",
};

// Low to high — index doubles as rarity rank for drop-weight calculations.
export const RARITY_ORDER = [RARITY.COMMON, RARITY.UNCOMMON, RARITY.RARE, RARITY.EPIC, RARITY.LEGENDARY];

// Each rank below the enemy's dropRarity is this many times more likely to drop.
export const RARITY_DROP_FALLOFF = 3;

export const RARITY_DATA = {
  [RARITY.COMMON]: {
    borderColor: "border-gray-300",
  },
  [RARITY.UNCOMMON]: {
    borderColor: "border-green-500",
  },
  [RARITY.RARE]: {
    borderColor: "border-blue-500",
  },
  [RARITY.EPIC]: {
    borderColor: "border-violet-500",
  },
  [RARITY.LEGENDARY]: {
    borderColor: "border-orange-500",
  },
};
