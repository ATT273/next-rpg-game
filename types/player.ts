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

// Base skill definition stored in classes.ts (static data)
type SkillDefinition = {
  key: string;
  name: string;
  type?: SkillType;
  target: string;
  description: string;
  required?: string | null;
  cost: number[]; // Level 1, 2, 3
  effects: { stats: string; value: number[] }[];
  amplified?: number[];
  duration: number | boolean;
  image?: string;
};

// Runtime skill used in game (dynamic data)
type Skills = {
  key: string;
  type: SkillType;
  level: number; // Current skill level (1-3)
  amplified?: number;
  name: string;
  target: string;
  cost: number;
  description: string;
  effects: { stats: string; value: number }[];
  duration: number | boolean;
};

type BuffCounter = {
  [key: string]: {
    duration: number;
    turnCasted: number;
  };
};

type ActionType = {
  type: string;
  value: number;
  source: string;
  effects?: { type: string; value: number }[]; // For multi-effect skills
};

type SkillType = "physical" | "magical" | undefined;

type SkillNode = {
  key: string;
  children?: SkillNode[];
  parent?: string | null;
  data: Skills;
};
export type {
  Stats,
  BuffStat,
  Player,
  BonusStats,
  Skills,
  SkillDefinition,
  BuffCounter,
  ActionType,
  SkillType,
  SkillNode,
};

export type SkillLevel = Record<string, { key: string; level: number }>;