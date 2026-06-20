import { StaticImageData } from "next/image";
import { BonusStats, Stats } from "./player";
import { ItemRarity } from "./shop";

type Enemy = {
  type: string;
  key: string;
  name: string;
  description: string;
  image: StaticImageData;
  xp: number;
  score: number;
  gold: number;
  matchLvl: number[];
  stats: Stats;
  bonusStats: BonusStats;
  dropRarity: ItemRarity;
};

export type { Enemy };
