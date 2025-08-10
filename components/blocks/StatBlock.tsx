import { BonusStats, Player, Stats } from "@/types/player";
import React from "react";

interface Props {
  player: Player;
  statKey: keyof Stats | keyof BonusStats;
}

interface Stat {
  stat: number;
  maxStat?: number;
  bonusStat: number;
  statKey: string;
  maxStatKey?: string;
}
export const PLAYER_STAT_KEYS = {
  ATK: "atk",
  DEF: "def",
  SPD: "spd",
  HP: "hp",
  MP: "mp",
  MAX_HP: "maxHP",
  MAX_MP: "maxMP",
  INT: "int",
} as const;
type StatKeyType = (typeof PLAYER_STAT_KEYS)[keyof typeof PLAYER_STAT_KEYS];
const statWithBar: StatKeyType[] = [
  PLAYER_STAT_KEYS.HP,
  PLAYER_STAT_KEYS.MP,
] as const;
const statNoBar: StatKeyType[] = [
  PLAYER_STAT_KEYS.ATK,
  PLAYER_STAT_KEYS.DEF,
  PLAYER_STAT_KEYS.INT,
  PLAYER_STAT_KEYS.SPD,
];
const StatWithBar = ({ stat, maxStat, bonusStat, statKey }: Stat) => {
  return (
    <div className="flex">
      <p className="font-bold">{statKey.toUpperCase()}: </p>&nbsp; {stat}/
      {maxStat}
      <i className="txt-green">{bonusStat ? `(+ ${bonusStat})` : ""}</i>
    </div>
  );
};

const StatNoBar = ({ stat, bonusStat, statKey }: Stat) => {
  return (
    <div className="flex text-">
      <p className="font-bold">{statKey.toUpperCase()}: </p> &nbsp; {stat}
      <i className="txt-green">{bonusStat ? `(+ ${bonusStat})` : ""}</i>
      <i className="txt-purple"></i>
    </div>
  );
};

const StatBlock = ({ player, statKey }: Props) => {
  const maxStatKey = statKey === "hp" ? "maxHP" : "maxMP";

  return (
    <div className="pl-4">
      {statWithBar.includes(statKey) && (
        <StatWithBar
          stat={player.stats[statKey]}
          maxStat={player.stats[maxStatKey]}
          bonusStat={player.bonusStats[statKey] || 0}
          statKey={statKey}
        />
      )}
      {statNoBar.includes(statKey) && (
        <StatNoBar
          stat={player.stats[statKey]}
          bonusStat={player.bonusStats[statKey] || 0}
          statKey={statKey}
        />
      )}
    </div>
  );
};

export default StatBlock;
