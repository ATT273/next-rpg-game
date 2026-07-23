import * as _ from "lodash";
import { BuffCounter, Player } from "@/types/player";
import { Enemy } from "@/types/enemy";
import { SKILL_TARGET, WIN_CONDITION_STATUS } from "@/data/data";
import { BattleEvent, BattleTimeline } from "@/types/battle-timeline";
import { normalAttack, skillUsing, calculateBuff, winCondition } from "@/hooks/use-game";

const MAX_TURNS = 200;

export const simulateBattle = (initialPlayer: Player, initialEnemy: Enemy): BattleTimeline => {
  let player = _.cloneDeep(initialPlayer);
  let enemy = _.cloneDeep(initialEnemy);
  let buffCounter: BuffCounter = {};
  const events: BattleEvent[] = [];
  // Round counters are tracked per side (matches the per-side "Round: X" UI); their sum feeds result.totalTurns.
  const turn = { player: 0, enemy: 0 };
  let isPlayerTurn = player.stats.spd >= enemy.stats.spd;

  const pushEvent = (event: Omit<BattleEvent, "playerSnapshot" | "enemySnapshot" | "buffCounterSnapshot">) => {
    events.push({
      ...event,
      playerSnapshot: _.cloneDeep(player),
      enemySnapshot: _.cloneDeep(enemy),
      buffCounterSnapshot: _.cloneDeep(buffCounter),
    });
  };

  const checkWinCondition = () => winCondition(player, enemy);

  for (let i = 0; i < MAX_TURNS; i++) {
    if (isPlayerTurn) {
      turn.player += 1;

      const afterAtk = normalAttack(player, enemy);
      player = afterAtk.attacker as Player;
      enemy = afterAtk.target as Enemy;
      pushEvent({
        turn: turn.player,
        actorType: "player",
        roundActor: "player",
        actionType: "attack",
        combatLog: afterAtk.combatLog,
        actions: afterAtk.actions,
      });

      let winStatus = checkWinCondition();
      if (winStatus.status !== WIN_CONDITION_STATUS.CONTINUE) {
        return finalize(events, winStatus, turn.player + turn.enemy);
      }

      for (const skill of player.skills) {
        if (player.stats.mp < skill.cost) continue;

        const isNewCasted = !buffCounter[skill.key];
        const afterUsingSkill = skillUsing(player, enemy, skill, isNewCasted);
        player = afterUsingSkill.attacker;
        enemy = afterUsingSkill.target;

        if (isNewCasted && skill.target === SKILL_TARGET.SELF) {
          buffCounter = {
            ...buffCounter,
            [skill.key]: {
              duration: !isNaN(Number(skill.duration)) ? Number(skill.duration) : 0,
              turnCasted: turn.player,
            },
          };
        }

        pushEvent({
          turn: turn.player,
          actorType: "player",
          roundActor: "player",
          actionType: "skill",
          skillKey: skill.key,
          combatLog: afterUsingSkill.combatLog,
          actions: afterUsingSkill.actions,
        });

        winStatus = checkWinCondition();
        if (winStatus.status !== WIN_CONDITION_STATUS.CONTINUE) {
          return finalize(events, winStatus, turn.player + turn.enemy);
        }
      }
    } else {
      turn.enemy += 1;

      const afterAtk = normalAttack(enemy, player);
      player = afterAtk.target as Player;
      enemy = afterAtk.attacker as Enemy;
      pushEvent({
        turn: turn.enemy,
        actorType: "enemy",
        roundActor: "enemy",
        actionType: "attack",
        combatLog: afterAtk.combatLog,
        actions: afterAtk.actions,
      });

      let winStatus = checkWinCondition();
      if (winStatus.status !== WIN_CONDITION_STATUS.CONTINUE) {
        return finalize(events, winStatus, turn.player + turn.enemy);
      }

      if (player.buffStats.length > 0) {
        const buffResult = calculateBuff(player, buffCounter);
        player = buffResult.player;
        buffCounter = buffResult.buffCounter;
        if (buffResult.combatLog) {
          pushEvent({
            turn: turn.enemy,
            actorType: "player",
            roundActor: "enemy",
            actionType: "buff-tick",
            combatLog: buffResult.combatLog,
            actions: [],
          });
        }
      }
    }

    isPlayerTurn = !isPlayerTurn;
  }

  return finalize(
    events,
    { status: WIN_CONDITION_STATUS.CONTINUE, message: "Battle exceeded max turns" },
    turn.player + turn.enemy,
  );
};

function finalize(
  events: BattleEvent[],
  winStatus: { status: string; message: string },
  totalTurns: number,
): BattleTimeline {
  return {
    events,
    result: {
      status: winStatus.status as BattleTimeline["result"]["status"],
      message: winStatus.message,
      totalTurns,
    },
  };
}
