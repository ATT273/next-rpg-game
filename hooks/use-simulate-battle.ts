import * as _ from "lodash";
import { BuffCounter, Player, TriggerCounter } from "@/types/player";
import { Enemy } from "@/types/enemy";
import { SKILL_TARGET, WIN_CONDITION_STATUS } from "@/data/data";
import { BattleEvent, BattleTimeline } from "@/types/battle-timeline";
import {
  normalAttack,
  skillUsing,
  calculateBuff,
  winCondition,
  classifySkillsByTrigger,
  getEligibleSkills,
  updateTriggerCounter,
  calculateFinalPriority,
} from "@/hooks/use-game";

const MAX_TURNS = 200;

export const simulateBattle = (initialPlayer: Player, initialEnemy: Enemy): BattleTimeline => {
  let player = _.cloneDeep(initialPlayer);
  let enemy = _.cloneDeep(initialEnemy);
  let playerBuffCounter: BuffCounter = {};
  let enemyBuffCounter: BuffCounter = {};
  let playerTriggerCounter: TriggerCounter = {};
  let enemyTriggerCounter: TriggerCounter = {};
  // "Was the other side hit by a plain normal attack this action-phase" - feeds on_hit.
  let playerWasHitByNormalAttack = false;
  let enemyWasHitByNormalAttack = false;
  const playerSkillBuckets = classifySkillsByTrigger(player.skills);
  const enemySkillBuckets = classifySkillsByTrigger(enemy.skills);
  const events: BattleEvent[] = [];
  // Round counters are tracked per side (matches the per-side "Round: X" UI); their sum feeds result.totalTurns.
  const turn = { player: 0, enemy: 0 };
  let isPlayerTurn = player.stats.spd >= enemy.stats.spd;

  const pushEvent = (event: Omit<BattleEvent, "playerSnapshot" | "enemySnapshot" | "buffCounterSnapshot">) => {
    events.push({
      ...event,
      playerSnapshot: _.cloneDeep(player),
      enemySnapshot: _.cloneDeep(enemy),
      // Timeline replay (battle/page.tsx) only reads the player's buff counter today,
      // so the snapshot keeps reporting that one; enemyBuffCounter is engine-internal.
      buffCounterSnapshot: _.cloneDeep(playerBuffCounter),
    });
  };

  const checkWinCondition = () => winCondition(player, enemy);

  for (let i = 0; i < MAX_TURNS; i++) {
    if (isPlayerTurn) {
      turn.player += 1;

      const afterAtk = normalAttack(player, enemy);
      player = afterAtk.attacker as Player;
      enemy = afterAtk.target as Enemy;
      enemyWasHitByNormalAttack = true;
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

      const eligibleSkills = getEligibleSkills(
        playerSkillBuckets,
        player,
        enemy,
        turn.player,
        playerTriggerCounter,
        playerWasHitByNormalAttack,
      );

      // on_hit is consumed once checked this action-phase, regardless of whether
      // an on_hit skill actually fired.
      playerWasHitByNormalAttack = false;

      const sortedEligible = [...eligibleSkills].sort(
        (a, b) => calculateFinalPriority(b.skill, b.triggerType) - calculateFinalPriority(a.skill, a.triggerType),
      );

      const firedSkillKeys = new Set<string>();

      for (const { skill } of sortedEligible) {
        if (player.stats.mp < skill.cost) continue;

        const isNewCasted = !playerBuffCounter[skill.key];
        const afterUsingSkill = skillUsing(player, enemy, skill, isNewCasted);
        player = afterUsingSkill.attacker as Player;
        enemy = afterUsingSkill.target as Enemy;
        firedSkillKeys.add(skill.key);

        if (isNewCasted && skill.target === SKILL_TARGET.SELF) {
          playerBuffCounter = {
            ...playerBuffCounter,
            [skill.key]: {
              duration: !isNaN(Number(skill.duration)) ? Number(skill.duration) : 0,
              turnCasted: turn.player,
              appliedEffects: afterUsingSkill.appliedEffects,
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

      playerTriggerCounter = updateTriggerCounter(
        playerSkillBuckets,
        player,
        enemy,
        turn.player,
        playerTriggerCounter,
        firedSkillKeys,
      );

      // Tick down the enemy's own buffs at the end of the player's round (mirrors
      // how the player's buffs tick at the end of the enemy's round below).
      if (enemy.buffStats.length > 0) {
        const buffResult = calculateBuff(enemy, enemyBuffCounter);
        enemy = buffResult.player as Enemy;
        enemyBuffCounter = buffResult.buffCounter;
        if (buffResult.combatLog) {
          pushEvent({
            turn: turn.player,
            actorType: "enemy",
            roundActor: "player",
            actionType: "buff-tick",
            combatLog: buffResult.combatLog,
            actions: [],
          });
        }
      }
    } else {
      turn.enemy += 1;

      const afterAtk = normalAttack(enemy, player);
      player = afterAtk.target as Player;
      enemy = afterAtk.attacker as Enemy;
      playerWasHitByNormalAttack = true;
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

      const eligibleSkills = getEligibleSkills(
        enemySkillBuckets,
        enemy,
        player,
        turn.enemy,
        enemyTriggerCounter,
        enemyWasHitByNormalAttack,
      );

      enemyWasHitByNormalAttack = false;

      const sortedEligible = [...eligibleSkills].sort(
        (a, b) => calculateFinalPriority(b.skill, b.triggerType) - calculateFinalPriority(a.skill, a.triggerType),
      );

      const firedSkillKeys = new Set<string>();

      for (const { skill } of sortedEligible) {
        if (enemy.stats.mp < skill.cost) continue;

        const isNewCasted = !enemyBuffCounter[skill.key];
        const afterUsingSkill = skillUsing(enemy, player, skill, isNewCasted);
        enemy = afterUsingSkill.attacker as Enemy;
        player = afterUsingSkill.target as Player;
        firedSkillKeys.add(skill.key);

        if (isNewCasted && skill.target === SKILL_TARGET.SELF) {
          enemyBuffCounter = {
            ...enemyBuffCounter,
            [skill.key]: {
              duration: !isNaN(Number(skill.duration)) ? Number(skill.duration) : 0,
              turnCasted: turn.enemy,
              appliedEffects: afterUsingSkill.appliedEffects,
            },
          };
        }

        pushEvent({
          turn: turn.enemy,
          actorType: "enemy",
          roundActor: "enemy",
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

      enemyTriggerCounter = updateTriggerCounter(
        enemySkillBuckets,
        enemy,
        player,
        turn.enemy,
        enemyTriggerCounter,
        firedSkillKeys,
      );

      if (player.buffStats.length > 0) {
        const buffResult = calculateBuff(player, playerBuffCounter);
        player = buffResult.player as Player;
        playerBuffCounter = buffResult.buffCounter;
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
