import { StaticImageData } from "next/image";
import { IShopItem } from "./shop";

type Player = {
  type: string;
  name: string;
  image: StaticImageData;
  plClass: string;
  level: number;
  exp: number;
  levelExp: number;
  stats: Stats;
  bonusStats: BonusStats;
  buffStats: BuffStat[];
  // buffs: Record<string, number>,
  items: IShopItem[];
  skills: Skills[];
  gold: number;
};
type BuffStat = {
  name: string;
  value: number;
  duration: number;
};

type Stats = {
  hp: number;
  mp: number;
  maxHP: number;
  maxMP: number;
  atk: number;
  def: number;
  spd: number;
  int: number;
};

type BonusStats = {
  maxHP: number;
  maxMP: number;
  atk: number;
  def: number;
  spd: number;
  int?: number;
  hp?: number;
  mp?: number;
};

type Skills = {
  key: string;
  name: string;
  target: string;
  cost: number;
  description: string;
  effects: { stats: string; value: number }[];
  duration: number | boolean;
};

export type { Stats, BuffStat, Player, BonusStats, Skills };
