import { useContext } from "react";
import Image from "next/image";
import { BattleContext, IBattleContext } from "@/app/(game)/battle/_components/BattleProvider";
import ActionBlock from "@/app/(game)/battle/_components/ActionBlock";
import StatBlock from "./StatBlock";

const getStat = (statName: string, buffStats: { name: string; value: number; duration: number }[]) => {
  const buff = buffStats.find((buff) => buff.name === statName);
  return {
    value: buff ? buff.value : 0,
    duration: buff ? buff.duration : 0,
  };
};
function FighterStatsBlockPC() {
  const { player, enemy, actions, currentTurn, actionIndex, battleLogs } = useContext(BattleContext) as IBattleContext;
  if (!player) return null;

  return (
    <div className="block md:hidden">
      {player.stats !== undefined && (
        <div className="relative flex flex-col justify-between items-stretch gap-2">
          <div className="flex flex-col items-center justify-between flex-1 gap-2 h-50">
            <div className="font-bold text-3xl">Round: {currentTurn?.player}</div>
            {/* <div className="font-bold text-3xl">VS.</div> */}
          </div>
          <div className="flex gap-4">
            <div className="mb-3">
              <Image className="grayscale size-40" src={player.image} width={160} height={160} alt="player_avatar" />
            </div>
            <div className="flex flex-col justify-start w-60 text-lg">
              <StatBlock values={{ stats: player.stats, bonusStats: player.bonusStats }} statKey="hp" showBar={true} />
              <StatBlock values={{ stats: player.stats, bonusStats: player.bonusStats }} statKey="mp" showBar={true} />
              <div className="stats">
                <p>
                  <b>ATK: </b> {player.stats.atk}
                  <i className="txt-green">{player.bonusStats.atk > 0 ? `(+ ${player.bonusStats.atk})` : ""}</i>
                  <i className="txt-purple">(+ {getStat("atk", player.buffStats).value})</i>
                </p>
                <p>
                  <b>DEF: </b> {player.stats.def}
                  <i className="txt-green">{player.bonusStats.def > 0 ? `(+ ${player.bonusStats.def})` : ""}</i>
                  <i className="txt-purple">(+ {getStat("def", player.buffStats).value})</i>
                </p>
                <p>
                  <b>SPD: </b> {player.stats.spd}
                  <i className="txt-green">{player.bonusStats.spd > 0 ? `(+ ${player.bonusStats.spd})` : ""}</i>
                  <i className="txt-purple">(+{getStat("spd", player.buffStats).value})</i>
                </p>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center items-center p-2 bg-neutral-200 rounded-md font-bold text-xl text-gray-400">
            {battleLogs?.length > 0 && (
              <span>
                {"< "}
                {battleLogs[battleLogs?.length - 1]}
                {" >"}
              </span>
            )}
            <div className="absolute inset-0 flex flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-20 h-12.5">
                {actions?.[actionIndex]?.source === "player" && (
                  <ActionBlock key={actionIndex} actions={actions[actionIndex]} />
                )}
              </div>

              <div className="absolute right-0 top-1/2 -translate-y-1/2  w-20 h-12.5">
                {actions?.[actionIndex]?.source === "com" && (
                  <ActionBlock key={actionIndex} actions={actions[actionIndex]} />
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <div className="flex flex-col justify-start w-60 text-lg">
                <StatBlock values={{ stats: enemy.stats, bonusStats: enemy.bonusStats }} statKey="hp" showBar={true} />
                <StatBlock values={{ stats: enemy.stats, bonusStats: enemy.bonusStats }} statKey="mp" showBar={true} />
                <div className="stats">
                  <p>
                    <b>ATK: </b> {enemy.stats.atk}
                  </p>
                  <p>
                    <b>DEF: </b> {enemy.stats.def}
                  </p>
                  <p>
                    <b>SPD: </b> {enemy.stats.spd}
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <Image className="grayscale size-40" src={enemy.image} width={160} height={160} alt="enemy_avatar" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FighterStatsBlockPC;
