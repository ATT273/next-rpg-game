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

export const ACTION_DELAY = 700;
export const ROUND_DELAY = 1000;
