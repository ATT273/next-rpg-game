import { StaticImageData } from "next/image";
import { BonusStats, Stats } from "./player";

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
};

export type { Enemy };
