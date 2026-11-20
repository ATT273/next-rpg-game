import player_img from "@/public/images/player/player.png";

export const initialPlayer = {
  type: "player",
  name: "",
  image: player_img,
  plClass: "",
  level: 1,
  exp: 0,
  levelExp: 100,
  stats: {
    hp: 100,
    mp: 100,
    maxHP: 100,
    maxMP: 100,
    int: 0,
    atk: 0,
    def: 0,
    spd: 0,
  },
  skills: [],
  bonusStats: {
    maxHP: 0,
    maxMP: 0,
    atk: 0,
    def: 0,
    spd: 0,
  },
  buffStats: [],
  buffs: [],
  items: [],
  gold: 0,
  skillPoints: 0,
};

export const WIN_CONDITION_STATUS = {
  WIN: "win",
  LOSE: "lose",
  CONTINUE: "continue",
};

export const SKILL_TARGET = {
  SELF: "self",
  ENEMY: "enemy",
};

export const SKILL_TRIGGER_TYPE = {
  CAN_USE: "can_use",
  ON_BATTLE_START: "on_battle_start",
  ON_TURN_START: "on_turn_start",
  EVERY_N_TURN: "every_n_turn",
  ON_HP_BELOW: "on_hp_below",
  ON_HIT: "on_hit",
  ON_ENEMY_BELOW: "on_enemy_below",
};

// Base priority per trigger type, low -> high. Combined with each skill's own
// `priority` field to break ties between skills sharing the same trigger type.
export const SKILL_TYPE_PRIORITY: Record<string, number> = {
  [SKILL_TRIGGER_TYPE.CAN_USE]: 1,
  [SKILL_TRIGGER_TYPE.ON_BATTLE_START]: 2,
  [SKILL_TRIGGER_TYPE.EVERY_N_TURN]: 3,
  [SKILL_TRIGGER_TYPE.ON_TURN_START]: 4,
  [SKILL_TRIGGER_TYPE.ON_ENEMY_BELOW]: 5,
  [SKILL_TRIGGER_TYPE.ON_HIT]: 6,
  [SKILL_TRIGGER_TYPE.ON_HP_BELOW]: 7,
};

export const ACTION_DELAY = 700;
export const ROUND_DELAY = 1000;
