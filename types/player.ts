import { StaticImageData } from "next/image";
import { IShopItem } from "./shop";
import { extendWith } from "lodash";

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
  items: IInventoryItem[];
  skills: Skills[];
  gold: number;
  skillPoints: number;
};

// ITEM
export interface IInventoryItem extends IShopItem {
  instanceId: number;
}

// STATS
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

// SKILL
// Skill trigger
type SkillTrigger = {
  type: string[]; // can_use | on_battle_start | on_turn_start | every_n_turn | on_hp_below | on_hit | on_enemy_below
  threshHold: number; // can_use, on_hit, on_battle_start: thresh hold = 0
};

// Base skill definition stored in classes.ts (static data)
type SkillDefinition = {
  key: string;
  name: string;
  type?: SkillType;
  level?: number;
  target: string;
  description: string;
  required?: string | null;
  cost: number[]; // Level 1, 2, 3
  effects: { stats: string; value: number[] }[];
  amplified?: number[];
  duration: number[] | boolean;
  image?: string;
  trigger: SkillTrigger;
  priority: number;
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
  trigger: SkillTrigger;
  priority: number;
};

type BuffCounter = {
  [key: string]: {
    duration: number;
    turnCasted: number;
    // Amplified values actually added to buffStats at cast time, so they can
    // be subtracted back exactly when the buff expires (see calculateBuff).
    appliedEffects: { stats: string; value: number }[];
  };
};

// Tracks reactive-trigger firing state, separate from BuffCounter (which tracks
// buff *duration*, not "has this trigger condition fired since it last reset").
type TriggerCounter = {
  [skillKey: string]: {
    // True once the skill has fired while its condition holds; cleared (hysteresis)
    // once the condition becomes false again, allowing it to re-fire next time
    // the condition becomes true. Used by on_hp_below / on_enemy_below / on_battle_start.
    armed: boolean;
    // Turn (per-side counter, e.g. turn.player) on which this skill last fired.
    lastFiredTurn: number;
  };
};

type ActionType = {
  type: string;
  value: number;
  source: string;
  effects?: { type: string; value: number }[]; // For multi-effect skills
};

type SkillType = "physical" | "magical" | undefined;

type SkillTreeNode = {
  key: string;
  parent: string | null;
  children: SkillTreeNode[];
  data: SkillDefinition;
};

export type SkillLevel = Record<string, { key: string; level: number }>;

export type {
  Stats,
  BuffStat,
  Player,
  BonusStats,
  Skills,
  SkillDefinition,
  BuffCounter,
  TriggerCounter,
  ActionType,
  SkillType,
  SkillTreeNode,
};
