import { BonusStats, Stats } from "@/types/player";
import StatsBar from "./StatsBar";

interface Props {
  values: {
    stats: Stats;
    bonusStats: BonusStats;
  };
  statKey: keyof Stats | keyof BonusStats;
  showBar?: boolean;
}

interface Stat {
  stat: number;
  maxStat?: number;
  bonusStat: number;
  statKey: string;
  maxStatKey?: string;
  showBar?: boolean;
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
const statWithBar: StatKeyType[] = [PLAYER_STAT_KEYS.HP, PLAYER_STAT_KEYS.MP] as const;
const statNoBar: StatKeyType[] = [
  PLAYER_STAT_KEYS.ATK,
  PLAYER_STAT_KEYS.DEF,
  PLAYER_STAT_KEYS.INT,
  PLAYER_STAT_KEYS.SPD,
];
const StatWithBar = ({ stat, maxStat, bonusStat, statKey, showBar }: Stat) => {
  return (
    <>
      <div className="flex">
        <p className="font-bold">{statKey.toUpperCase()}: </p>&nbsp; {stat}/{maxStat}
        <i className="txt-green">{bonusStat ? `(+ ${bonusStat})` : ""}</i>
      </div>
      {showBar && <StatsBar stat={stat} maxStat={maxStat || 0} />}
    </>
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

const StatBlock = ({ values, statKey, showBar }: Props) => {
  const maxStatKey = statKey === "hp" ? "maxHP" : "maxMP";

  return (
    <div>
      {statWithBar.includes(statKey) && (
        <StatWithBar
          stat={values.stats[statKey]}
          maxStat={values.stats[maxStatKey]}
          bonusStat={values.bonusStats[statKey] || 0}
          statKey={statKey}
          showBar={showBar}
        />
      )}
      {statNoBar.includes(statKey) && (
        <StatNoBar stat={values.stats[statKey]} bonusStat={values.bonusStats[statKey] || 0} statKey={statKey} />
      )}
    </div>
  );
};

export default StatBlock;
