import { BonusStats, BuffStat, IInventoryItem, Skills, Stats } from "./player";
import { ItemRarity } from "./shop";

type Enemy = {
  type: string;
  key: string;
  name: string;
  description: string;
  image: string;
  xp: number;
  score: number;
  gold: number;
  matchLvl: number[];
  stats: Stats;
  bonusStats: BonusStats;
  buffStats: BuffStat[];
  items: IInventoryItem[];
  skills: Skills[];
  dropRarity: ItemRarity;
  isBoss: boolean;
};

export type { Enemy };
