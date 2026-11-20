import { ActionType, BuffCounter, Player } from "./player";
import { Enemy } from "./enemy";
import { WIN_CONDITION_STATUS } from "@/data/data";

type BattleActorType = "player" | "enemy";

type BattleActionType = "attack" | "skill" | "buff-tick";

type BattleEvent = {
  /** Round number counted per-actor (e.g. the player's 4th round), matches the "Round: X" UI. */
  turn: number;
  /** Who performed this specific action (buff-tick reports "player" even though it fires during the enemy's round). */
  actorType: BattleActorType;
  /** Whose round this event belongs to — use this to detect round boundaries, not actorType. */
  roundActor: BattleActorType;
  actionType: BattleActionType;
  skillKey?: string;
  combatLog: string;
  actions: (ActionType | null)[];
  playerSnapshot: Player;
  enemySnapshot: Enemy;
  buffCounterSnapshot: BuffCounter;
};

type WinConditionStatus = (typeof WIN_CONDITION_STATUS)[keyof typeof WIN_CONDITION_STATUS];

type BattleResult = {
  status: WinConditionStatus;
  message: string;
  /** Combined round count from both sides (player rounds + enemy rounds) — a battle-length stat, not the per-side "Round: X" shown in the UI. */
  totalTurns: number;
};

type BattleTimeline = {
  events: BattleEvent[];
  result: BattleResult;
};

export type { BattleActorType, BattleActionType, BattleEvent, WinConditionStatus, BattleResult, BattleTimeline };
