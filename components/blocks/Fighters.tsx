import React, { useContext } from "react";
import StatsBar from "./StatsBar";
import Image from "next/image";
import {
  BattleContext,
  IBattleContext,
} from "@/app/(game)/battle/_components/battle-provider";
import ActionBlock from "@/app/(game)/battle/_components/action-block";
import StatBlock from "./StatBlock";
const getStat = (
  statName: string,
  buffStats: { name: string; value: number; duration: number }[]
) => {
  const buff = buffStats.find((buff) => buff.name === statName);
  return {
    value: buff ? buff.value : 0,
    duration: buff ? buff.duration : 0,
  };
};
function FighterStatsBlock() {
  const { player, enemy, actions, currentTurn, actionIndex, battleLogs } =
    useContext(BattleContext) as IBattleContext;
  return (
    <>
      {player.stats !== undefined && (
        <div className="relative flex justify-between items-stretch">
          <div className="relative flex flex-col items-center justify-center grow-[1]">
            <div className="mb-3">
              <Image
                className="size-64"
                src={player.image}
                alt="player_avatar"
              />
            </div>
            <div className="absolute right-0 top-[100px] w-[80px] h-[50px]">
              {actions?.[actionIndex]?.source === "player" && (
                <ActionBlock key={actionIndex} actions={actions[actionIndex]} />
              )}
            </div>
            <div className="flex flex-col justify-start w-[15rem] text-lg">
              <StatBlock
                values={{ stats: player.stats, bonusStats: player.bonusStats }}
                statKey="hp"
                showBar={true}
              />
              <StatBlock
                values={{ stats: player.stats, bonusStats: player.bonusStats }}
                statKey="mp"
                showBar={true}
              />
              <div className="stats">
                <p>
                  <b>ATK: </b> {player.stats.atk}
                  <i className="txt-green">
                    {player.bonusStats.atk > 0
                      ? `(+ ${player.bonusStats.atk})`
                      : ""}
                  </i>
                  <i className="txt-purple">
                    (+ {getStat("atk", player.buffStats).value})
                  </i>
                </p>
                <p>
                  <b>DEF: </b> {player.stats.def}
                  <i className="txt-green">
                    {player.bonusStats.def > 0
                      ? `(+ ${player.bonusStats.def})`
                      : ""}
                  </i>
                  <i className="txt-purple">
                    (+ {getStat("def", player.buffStats).value})
                  </i>
                </p>
                <p>
                  <b>SPD: </b> {player.stats.spd}
                  <i className="txt-green">
                    {player.bonusStats.spd > 0
                      ? `(+ ${player.bonusStats.spd})`
                      : ""}
                  </i>
                  <i className="txt-purple">
                    (+{getStat("spd", player.buffStats).value})
                  </i>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between grow-[1] gap-2 h-[200px]">
            <div className="font-bold text-3xl">
              Turn: {currentTurn?.player}
            </div>
            <div className="font-bold text-3xl">VS.</div>
            {battleLogs?.length > 0 && (
              <div className="absolute top-1/2 font-bold text-xl text-gray-400">
                {"< "}
                {battleLogs[battleLogs?.length - 1]}
                {" >"}
              </div>
            )}
          </div>
          <div className="relative flex flex-col items-center justify-center  grow-[1]">
            <div className="image-container mb-3">
              <Image className="size-64" src={enemy.image} alt="enemy_avatar" />
            </div>
            <div className="absolute left-0 top-[100px] w-[80px] h-[50px]">
              {actions?.[actionIndex]?.source === "com" && (
                <ActionBlock key={actionIndex} actions={actions[actionIndex]} />
              )}
            </div>
            <div className="flex flex-col justify-start w-[15rem] text-lg">
              <StatBlock
                values={{ stats: enemy.stats, bonusStats: enemy.bonusStats }}
                statKey="hp"
                showBar={true}
              />
              <StatBlock
                values={{ stats: enemy.stats, bonusStats: enemy.bonusStats }}
                statKey="mp"
                showBar={true}
              />
              {/* <div className="hp-mp">
                <p>
                  <b>HP: </b> {enemy.stats.hp}/{enemy.stats.maxHP}
                </p>
                <StatsBar
                  stats={{ hp: enemy.stats.hp, maxHP: enemy.stats.maxHP }}
                  name={"hp"}
                />
                <p>
                  <b>MP: </b> {enemy.stats.mp}/{enemy.stats.maxMP}
                </p>
                <StatsBar
                  stats={{ mp: enemy.stats.mp, maxMP: enemy.stats.maxMP }}
                  name={"mp"}
                />
              </div> */}
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
        </div>
      )}
    </>
  );
}

export default FighterStatsBlock;
