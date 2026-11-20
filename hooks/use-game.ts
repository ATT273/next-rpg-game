import enemies from "@/data/enemies";
import items from "@/data/items";
import {
  ActionType,
  BuffCounter,
  IInventoryItem,
  Player,
  SkillDefinition,
  Skills,
  SkillTreeNode,
  SkillType,
  TriggerCounter,
} from "@/types/player";
import { IShopItem } from "@/types/shop";
import { Enemy } from "@/types/enemy";
import * as _ from "lodash";
import { SKILL_TARGET, SKILL_TRIGGER_TYPE, SKILL_TYPE_PRIORITY, WIN_CONDITION_STATUS } from "@/data/data";
import { MAX_ITEM_LEVEL } from "@/constants/items.constants";
import { RunConfig } from "@/data/run-config";

export const isPlayer = (object: Player | Enemy): object is Player => {
  return (object as Player).type === "player";
};

export const getPlayerItems = (attacker: Player | Enemy, target: Player | Enemy) => {
  if ((attacker as Player).type === "player") {
    return (attacker as Player).items;
  } else if ((target as Player).type === "player") {
    return (target as Player).items;
  }
};

/** Both Player and Enemy now carry items/buffStats, so combat math (normalAttack,
 * skillUsing) can read bonus/buff stats off either side symmetrically. */
const getCombatBonusStats = (actor: Player | Enemy) => getBonusStats(actor.items ?? []);

const getCombatBuffValue = (actor: Player | Enemy, statName: string): number =>
  _.find(actor.buffStats ?? [], (buff) => buff.name === statName)?.value ?? 0;

const getEvent = (id: number) => {
  const eventIdsList = [1, 2, 3];
  const filterEvents = eventIdsList.filter((event) => event !== id);
  const randomIdx = Math.floor(Math.random() * filterEvents.length);
  return filterEvents[randomIdx];
};

export const getRandomEnemy = (key: string | "", level: number) => {
  const filterEnemies = enemies.filter((enemy) => enemy.key !== key && enemy.matchLvl.includes(level));
  const randomIdx = Math.floor(Math.random() * filterEnemies.length);
  return _.cloneDeep(filterEnemies[randomIdx]);
  // return JSON.parse(JSON.stringify(filterEnemies[randomIdx]))
};

export const getEnemy = (key: string) => {
  const filterEnemies = enemies.filter((enemy) => enemy.key === key);
  return _.cloneDeep(filterEnemies.length > 0 ? filterEnemies[0] : undefined);
  // return JSON.parse(JSON.stringify(filterEnemies[randomIdx]))
};

export const normalAttack = (attacker: Player | Enemy, target: Player | Enemy) => {
  const attackerBonusStats = getCombatBonusStats(attacker);
  const targetBonusStats = getCombatBonusStats(target);
  const atkBuff = getCombatBuffValue(attacker, "atk");
  const defBuff = getCombatBuffValue(target, "def");
  const atkOfAttacker = attacker.stats.atk + attackerBonusStats.atk + atkBuff;
  const defOfTarget = target.stats.def + targetBonusStats.def + defBuff;

  const dmgDealed = atkOfAttacker - defOfTarget > 0 ? atkOfAttacker - defOfTarget : 0;
  let type = attacker.type;
  const newHp = target.stats.hp - dmgDealed < 0 ? 0 : target.stats.hp - dmgDealed;
  target.stats.hp = Math.round(newHp * 10) / 10;
  const actions = [{ type: "atk", value: dmgDealed, source: attacker.type }];
  const combatLog = `${attacker.name} deals ${dmgDealed} damage`;
  return { attacker, target, type, combatLog, actions };
};

/**
 * Calculates the amplified skill damage based on skill type and character stats
 *
 * @param baseValue - The base damage value of the skill
 * @param skillType - The type of skill ('physical' or 'magical')
 * @param attacker - The player using the skill
 * @param amplified - The amplification multiplier (default: 1.0)
 *
 * @returns The calculated skill damage after applying stat-based amplification (rounded to 1 decimal place)
 *
 * @functionality
 * - Physical skills: Amplified by attacker's ATK stat
 * - Magical skills: Amplified by attacker's INT stat
 * - Formula: baseValue + (stat * amplified)
 * - Result is rounded to 1 decimal place
 */
export const calculateSkillValue = (
  baseValue: number,
  skillType: SkillType,
  attacker: Player | Enemy,
  amplified: number = 1.0,
) => {
  const bonusStats = getCombatBonusStats(attacker);

  let result = 0;
  if (skillType === "physical") {
    const totalAtk = attacker.stats.atk + bonusStats.atk;
    result = Math.abs(baseValue) + totalAtk * amplified;
  } else if (skillType === "magical") {
    const totalInt = attacker.stats.int + (bonusStats.int || 0);
    result = Math.abs(baseValue) + totalInt * amplified;
  } else {
    // If skill type is undefined, return base value
    result = Math.abs(baseValue);
  }

  // Round to 1 decimal place
  return Math.round(result * 10) / 10;
};

/**
 * Executes a player's skill during combat, handling both offensive and self-buff abilities
 * with proper damage calculations, stat modifications, and resource (MP) consumption.
 *
 * @param attacker - The player using the skill
 * @param target - The enemy being targeted
 * @param skill - The skill being used
 * @param isNewCasted - Flag indicating if this is a fresh skill cast (vs. ongoing buff effect)
 *
 * @functionality
 *
 * **Enemy-Targeted Skills** (`SKILL_TARGET.ENEMY`):
 * - Calculates damage using calculateSkillValue (considers skill type and stat amplification)
 * - Subtracts target's defense from amplified damage
 * - Applies damage to enemy's HP (minimum 0)
 * - Deducts MP cost from attacker
 * - Creates combat action log entry
 *
 * **Self-Targeted Skills** (`SKILL_TARGET.SELF`):
 * - Initializes buff tracking for hp, atk, def, and spd stats
 * - Applies skill effects to corresponding buff stats
 * - Sets buff duration only for new casts
 * - Updates player's `buffStats` array
 * - Handles HP restoration (capped at max HP)
 * - Deducts MP cost only for new casts
 *
 * @returns Object containing:
 * - `attacker` - Updated player state
 * - `target` - Updated enemy state
 * - `combatLog` - String description of the action taken
 * - `actions` - Array of `ActionType` objects tracking stat changes
 *
 * @features
 * - Duration-based buff system with turn tracking
 * - Prevents HP overflow beyond max HP
 * - MP cost only charged on initial cast for buffs
 * - Supports multiple stat effects per skill
 * - Skill damage scales with ATK (physical) or INT (magical) stats
 */
export const skillUsing = (
  attacker: Player | Enemy,
  target: Player | Enemy,
  skill: Skills,
  isNewCasted: boolean,
) => {
  // debugger;
  let combatLog = "";
  const actions: (ActionType | null)[] = [];
  if (skill.target === SKILL_TARGET.ENEMY) {
    const baseValue = skill.effects[0].value;
    const amplified = skill.amplified ?? 1.0;
    const atkOfAttacker = calculateSkillValue(baseValue, skill.type, attacker, amplified);
    const defBuff = getCombatBuffValue(target, "def");
    const defOfTarget = target.stats.def + getCombatBonusStats(target).def + defBuff;
    const rawDmg = atkOfAttacker - defOfTarget > 0 ? atkOfAttacker - defOfTarget : 0;
    const dmgDealed = Math.round(rawDmg * 10) / 10;

    const newHp = target.stats.hp - dmgDealed < 0 ? 0 : target.stats.hp - dmgDealed;
    target.stats.hp = Math.round(newHp * 10) / 10;
    attacker.stats.mp -= skill.cost;
    // attacker.stats.mp -= 0;
    const actionType = skill.type === "magical" ? "int" : "atk";
    actions.push({
      type: actionType,
      value: dmgDealed,
      source: attacker.type,
    });
    combatLog = `${attacker.name} used ${skill.name} => deals ${dmgDealed} damage`;
  }

  if (skill.target === SKILL_TARGET.SELF) {
    const amplified = skill.amplified ?? 1.0;
    const buffStats = [
      {
        name: "hp",
        value: 0,
        duration: 0,
      },
      {
        name: "atk",
        value: 0,
        duration: 0,
      },
      {
        name: "def",
        value: 0,
        duration: 0,
      },
      {
        name: "spd",
        value: 0,
        duration: 0,
      },
    ];
    // Object.assign(attacker.buffs, { ...attacker.buffs, skill })

    // Collect all effects for multi-effect skills
    const skillEffects: { type: string; value: number }[] = [];
    // Amplified values actually applied this cast, keyed by stat — callers persist
    // this on the buff counter so it can be subtracted back exactly on expiry.
    const appliedEffects: { stats: string; value: number }[] = [];

    skill.effects.forEach((fx) => {
      buffStats.forEach((buff) => {
        if (fx.stats === buff.name) {
          // Calculate amplified value based on skill type
          const amplifiedValue = calculateSkillValue(fx.value, skill.type, attacker, amplified);

          if (isNewCasted) {
            skillEffects.push({
              type: `${fx.stats}Bff`,
              value: amplifiedValue,
            });
            appliedEffects.push({ stats: fx.stats, value: amplifiedValue });
          }
          buff.value += amplifiedValue;
          // set duration only if this is a new cast
          if (isNewCasted) {
            buff.duration += typeof skill.duration === "boolean" ? 0 : skill.duration;
          }
        }
      });
    });

    // Push a single action with all effects if it's a new cast
    if (isNewCasted && skillEffects.length > 0) {
      if (skillEffects.length === 1) {
        // Single effect skill
        actions.push({
          type: skillEffects[0].type,
          value: skillEffects[0].value,
          source: attacker.type,
        });
      } else {
        // Multi-effect skill - group them together
        actions.push({
          type: "multiBuff",
          value: 0, // Not used for multi-effects
          source: attacker.type,
          effects: skillEffects,
        });
      }
    } else if (!isNewCasted) {
      actions.push(null);
    }

    attacker.buffStats = [...buffStats];
    buffStats.forEach((buff) => {
      if (buff.name === "hp" && buff.value > 0) {
        const healAmount =
          attacker.stats.maxHP - attacker.stats.hp > buff.value
            ? buff.value
            : attacker.stats.maxHP - attacker.stats.hp;
        attacker.stats.hp = Math.round((attacker.stats.hp + healAmount) * 10) / 10;
      }
    });

    // if this is a new cast, deduct mp
    // attacker.stats.mp -= 0;
    attacker.stats.mp -= isNewCasted ? skill.cost : 0;
    combatLog = isNewCasted ? `${attacker.name} used ${skill.name}` : `${skill.name} effect continues`;

    return {
      attacker,
      target,
      combatLog,
      actions,
      appliedEffects,
    };
  }

  return {
    attacker,
    target,
    combatLog,
    actions,
    appliedEffects: [] as { stats: string; value: number }[],
  };
};

export const calculateBuff = (player: Player | Enemy, buffCounter: BuffCounter) => {
  const selfBuffs = player.skills.filter((item) => item.target === SKILL_TARGET.SELF);
  const _counter = { ...buffCounter };

  let _combatLog = "";
  const removed: { stat: string; value: number }[] = [];
  selfBuffs.forEach((buff) => {
    // if buff is still active
    if (_counter[buff.key] && _counter[buff.key].duration > 1) {
      _counter[buff.key].duration -= 1;
      _combatLog += `
          ${buff.name} ends in ${_counter[buff.key].duration} turns
        `;
    } else if (_counter[buff.key]) {
      // remove buff effects — subtract the exact amplified values that were
      // added at cast time (see skillUsing), not the raw base fx.value.
      _counter[buff.key].appliedEffects.forEach((applied) => {
        removed.push({
          stat: applied.stats,
          value: applied.value,
        });
      });
      delete _counter[buff.key];
    }
  });
  // calculate buffs if any buff is removed
  removed.forEach((item) => {
    player.buffStats.forEach((bs) => {
      if (bs.name === item.stat) {
        bs.value -= item.value;
      }
    });
  });

  return { player, buffCounter: _counter, combatLog: _combatLog };
};

/**
 * Calculates the final execution priority of a skill for a given trigger type.
 * Combines the trigger type's base priority (survival/finisher triggers rank
 * above routine ones) with the skill's own priority (tie-breaker among skills
 * sharing the same trigger type).
 *
 * Kept as its own function so future context-aware adjustments (e.g. boosting
 * a heal's priority when HP is critically low) can be added without touching callers.
 */
export const calculateFinalPriority = (skill: Skills, triggerType: string): number => {
  const basePriority = SKILL_TYPE_PRIORITY[triggerType] ?? 0;
  return basePriority + skill.priority;
};

/**
 * Buckets a skill list by trigger type. A skill with multiple trigger types
 * (trigger.type.length > 1) appears in every bucket it declares - evaluated
 * independently per type (see eligibility functions below). Built once per
 * battle since skills/trigger data don't change mid-battle.
 */
export const classifySkillsByTrigger = (skills: Skills[]): Record<string, Skills[]> => {
  const buckets: Record<string, Skills[]> = {};
  skills.forEach((skill) => {
    skill.trigger.type.forEach((triggerType) => {
      if (!buckets[triggerType]) buckets[triggerType] = [];
      buckets[triggerType].push(skill);
    });
  });
  return buckets;
};

export type EligibleSkill = { skill: Skills; triggerType: string };

const hpPercent = (stats: { hp: number; maxHP: number }): number =>
  stats.maxHP > 0 ? (stats.hp / stats.maxHP) * 100 : 0;

/** on_hp_below: eligible when the skill OWNER's own HP% is below trigger.threshHold
 *  AND the skill is not currently armed (hysteresis - must rise back above
 *  threshold before it can fire again). Early-skips if bucket is empty. */
export const getOnHpBelowEligible = (
  skills: Skills[] | undefined,
  owner: Player | Enemy,
  triggerCounter: TriggerCounter,
): EligibleSkill[] => {
  if (!skills || skills.length === 0) return [];
  return skills
    .filter((skill) => hpPercent(owner.stats) < skill.trigger.threshHold)
    .filter((skill) => !(triggerCounter[skill.key]?.armed ?? false))
    .map((skill) => ({ skill, triggerType: SKILL_TRIGGER_TYPE.ON_HP_BELOW }));
};

/** on_enemy_below: eligible when the OPPONENT's HP% is below trigger.threshHold
 *  AND not currently armed. Early-skips if bucket is empty. */
export const getOnEnemyBelowEligible = (
  skills: Skills[] | undefined,
  opponent: Player | Enemy,
  triggerCounter: TriggerCounter,
): EligibleSkill[] => {
  if (!skills || skills.length === 0) return [];
  return skills
    .filter((skill) => hpPercent(opponent.stats) < skill.trigger.threshHold)
    .filter((skill) => !(triggerCounter[skill.key]?.armed ?? false))
    .map((skill) => ({ skill, triggerType: SKILL_TRIGGER_TYPE.ON_ENEMY_BELOW }));
};

/** can_use: MP-gate only - existing default behavior, every skill in the bucket
 *  is always "eligible" here; the actual MP check stays at execution time in
 *  the turn loop (`if (mp < cost) continue`), identical to today. No hysteresis. */
export const getCanUseEligible = (skills: Skills[] | undefined): EligibleSkill[] => {
  if (!skills || skills.length === 0) return [];
  return skills.map((skill) => ({ skill, triggerType: SKILL_TRIGGER_TYPE.CAN_USE }));
};

/** on_battle_start: eligible only on the owner's very first turn AND not already
 *  armed (armed check makes it a permanent one-shot latch, see updateTriggerCounter). */
export const getOnBattleStartEligible = (
  skills: Skills[] | undefined,
  ownerTurnNumber: number,
  triggerCounter: TriggerCounter,
): EligibleSkill[] => {
  if (!skills || skills.length === 0) return [];
  if (ownerTurnNumber !== 1) return [];
  return skills
    .filter((skill) => !(triggerCounter[skill.key]?.armed ?? false))
    .map((skill) => ({ skill, triggerType: SKILL_TRIGGER_TYPE.ON_BATTLE_START }));
};

/** on_turn_start: eligible every turn, unconditionally, no hysteresis. */
export const getOnTurnStartEligible = (skills: Skills[] | undefined): EligibleSkill[] => {
  if (!skills || skills.length === 0) return [];
  return skills.map((skill) => ({ skill, triggerType: SKILL_TRIGGER_TYPE.ON_TURN_START }));
};

/** every_n_turn: eligible when the owner's per-side turn count is a positive
 *  multiple of threshHold (turn 2, 4, 6... for threshHold=2). No hysteresis
 *  needed - the modulo check itself already prevents refiring on off-turns. */
export const getEveryNTurnEligible = (skills: Skills[] | undefined, ownerTurnNumber: number): EligibleSkill[] => {
  if (!skills || skills.length === 0) return [];
  return skills
    .filter((skill) => skill.trigger.threshHold > 0 && ownerTurnNumber % skill.trigger.threshHold === 0)
    .map((skill) => ({ skill, triggerType: SKILL_TRIGGER_TYPE.EVERY_N_TURN }));
};

/** on_hit: eligible only when `wasHitByNormalAttack` is true this action phase
 *  (set when struck by a plain normalAttack, consumed after this check - see
 *  turn loop). No hysteresis beyond the one-shot flag itself. */
export const getOnHitEligible = (skills: Skills[] | undefined, wasHitByNormalAttack: boolean): EligibleSkill[] => {
  if (!skills || skills.length === 0 || !wasHitByNormalAttack) return [];
  return skills.map((skill) => ({ skill, triggerType: SKILL_TRIGGER_TYPE.ON_HIT }));
};

/**
 * Assembles this turn's full eligible-skill candidate pool by calling each
 * per-trigger-type function against its own bucket, then dedupes by skill key
 * (a skill matching >1 trigger type keeps only its highest-priority match).
 * Does NOT mutate triggerCounter (pure read) and does NOT execute/sort -
 * the turn loop sorts the returned list by calculateFinalPriority and executes.
 */
export const getEligibleSkills = (
  buckets: Record<string, Skills[]>,
  owner: Player | Enemy,
  opponent: Player | Enemy,
  ownerTurnNumber: number,
  triggerCounter: TriggerCounter,
  wasHitByNormalAttack: boolean,
): EligibleSkill[] => {
  const candidates: EligibleSkill[] = [
    ...getOnHpBelowEligible(buckets[SKILL_TRIGGER_TYPE.ON_HP_BELOW], owner, triggerCounter),
    ...getOnEnemyBelowEligible(buckets[SKILL_TRIGGER_TYPE.ON_ENEMY_BELOW], opponent, triggerCounter),
    ...getOnHitEligible(buckets[SKILL_TRIGGER_TYPE.ON_HIT], wasHitByNormalAttack),
    ...getOnTurnStartEligible(buckets[SKILL_TRIGGER_TYPE.ON_TURN_START]),
    ...getEveryNTurnEligible(buckets[SKILL_TRIGGER_TYPE.EVERY_N_TURN], ownerTurnNumber),
    ...getOnBattleStartEligible(buckets[SKILL_TRIGGER_TYPE.ON_BATTLE_START], ownerTurnNumber, triggerCounter),
    ...getCanUseEligible(buckets[SKILL_TRIGGER_TYPE.CAN_USE]),
  ];

  // Dedupe: a skill may appear once per matching trigger type (only possible
  // once a skill declares >1 trigger.type - none do today). Keep the
  // candidate with the highest calculateFinalPriority so a future multi-type
  // skill is never cast twice in the same turn.
  const bestByKey = new Map<string, EligibleSkill>();
  candidates.forEach((candidate) => {
    const existing = bestByKey.get(candidate.skill.key);
    if (
      !existing ||
      calculateFinalPriority(candidate.skill, candidate.triggerType) >
        calculateFinalPriority(existing.skill, existing.triggerType)
    ) {
      bestByKey.set(candidate.skill.key, candidate);
    }
  });

  return Array.from(bestByKey.values());
};

/**
 * Reconciles triggerCounter for hysteresis-gated trigger types (on_hp_below,
 * on_enemy_below, on_battle_start) after this turn's actions are resolved:
 * - Skills that just fired this turn (in `firedSkillKeys`) become armed.
 * - Skills whose condition is no longer true become un-armed (so they can
 *   fire again next time the condition becomes true).
 * on_hit/every_n_turn/on_turn_start/can_use skills are not tracked here (no
 * hysteresis semantics - on_hit uses the separate one-shot hit marker instead).
 */
export const updateTriggerCounter = (
  buckets: Record<string, Skills[]>,
  owner: Player | Enemy,
  opponent: Player | Enemy,
  ownerTurnNumber: number,
  triggerCounter: TriggerCounter,
  firedSkillKeys: Set<string>,
): TriggerCounter => {
  const next: TriggerCounter = { ...triggerCounter };
  const hysteresisTypes = [
    SKILL_TRIGGER_TYPE.ON_HP_BELOW,
    SKILL_TRIGGER_TYPE.ON_ENEMY_BELOW,
    SKILL_TRIGGER_TYPE.ON_BATTLE_START,
  ];

  hysteresisTypes.forEach((triggerType) => {
    (buckets[triggerType] ?? []).forEach((skill) => {
      const conditionTrue =
        triggerType === SKILL_TRIGGER_TYPE.ON_HP_BELOW
          ? hpPercent(owner.stats) < skill.trigger.threshHold
          : triggerType === SKILL_TRIGGER_TYPE.ON_ENEMY_BELOW
            ? hpPercent(opponent.stats) < skill.trigger.threshHold
            : ownerTurnNumber === 1;

      if (firedSkillKeys.has(skill.key)) {
        next[skill.key] = { armed: true, lastFiredTurn: ownerTurnNumber };
      } else if (!conditionTrue && next[skill.key]?.armed) {
        next[skill.key] = { ...next[skill.key], armed: false };
      }
    });
  });

  return next;
};

export const winCondition = (player: Player, com: Enemy) => {
  if (player.stats.hp === 0) {
    return {
      status: WIN_CONDITION_STATUS.LOSE,
      message: "You are defeated",
    };
  }
  if (com.stats.hp === 0) {
    return {
      status: WIN_CONDITION_STATUS.WIN,
      message: "You win",
    };
  }

  return {
    status: WIN_CONDITION_STATUS.CONTINUE,
    message: "continue",
  };
};

export const getBonusStats = (itemList: IShopItem[]) => {
  const bonusStats = {
    atk: 0,
    def: 0,
    spd: 0,
    maxHP: 0,
    maxMP: 0,
    int: 0,
  };
  if (itemList.length > 0)
    itemList.forEach((item) => {
      if (item.stats) {
        bonusStats.atk += item.stats.atk ?? 0;
        bonusStats.def += item.stats.def ?? 0;
        bonusStats.spd += item.stats.spd ?? 0;
        bonusStats.maxHP += item.stats.maxHP ?? 0;
        bonusStats.maxMP += item.stats.maxMP ?? 0;
        bonusStats.int += item.stats.int ?? 0;
      }
    });

  return bonusStats;
};

export const takeItem = (
  item: IShopItem,
  itemList: IInventoryItem[],
): { newInventory: IInventoryItem[]; message: string; isMaxQty: boolean; isAdded: boolean } => {
  let newInventory = _.cloneDeep(itemList);
  let message = "";
  let isMaxQty = false;
  let isAdded = false;
  if (newInventory.length < 6) {
    // const itemIndex = _.findIndex(newInventory, (pItem) => pItem.key === item.key);
    message = "item added";
    newInventory.push({
      ...item,
      instanceId: new Date().getTime(),
    });
    isAdded = true;

    // if (itemIndex > -1) {
    //   if (newInventory[itemIndex].qty === newInventory[itemIndex].maxQty) {
    //     isMaxQty = true;
    //     message = `You can only have ${newInventory[itemIndex].maxQty} of this item`;
    //   } else {
    //     newInventory[itemIndex].qty ? (newInventory[itemIndex].qty += 1) : 1;
    //     message = `${item.name} is added to your inventory`;
    //     return { newInventory, message, isMaxQty };
    //   }
    // } else {
    //   if (!isMaxQty) {
    //     item.qty ? (item.qty += 1) : 1;
    //     newInventory.push(item);
    //     message = `${item.name} is added to your inventory`;
    //   }
    // }
  } else {
    message = "Inventory is full. Please remove an item first";
    isMaxQty = true;
  }

  return { newInventory, message, isMaxQty, isAdded };
};

export const consumeItem = (player: Player, key: string) => {
  const stats = { ...player.stats };
  const selectedItem = items.find((item) => item.key === key);
  if (selectedItem && selectedItem.stats) {
    Object.keys(selectedItem.stats).forEach((key) => {
      if (selectedItem.stats) {
        if (
          stats[key as keyof typeof stats] + selectedItem.stats[key as keyof typeof selectedItem.stats]! >
          stats[`max${key.toUpperCase()}` as keyof typeof stats]!
        ) {
          stats[key as keyof typeof stats] = stats[`max${key.toUpperCase()}` as keyof typeof stats];
        } else stats[key as keyof typeof stats] += selectedItem.stats[key as keyof typeof selectedItem.stats]!;
      }
    });
  }

  return stats;
};

export const calculateCurrentLvlExp = (level: number) => {
  const exp = 50 * Math.pow(2, level - 1);
  return exp;
};

/**
 * Calculates the player's level based on total experience points
 *
 * @param exp - Total experience points
 * @returns The player's current level
 *
 * @functionality
 * - XP curve follows: exp = 50 * 2^(level - 1)
 * - Level 1: 0-99 XP
 * - Level 2: 100-199 XP
 * - Level 3: 200-399 XP
 * - Level 4: 400-799 XP
 * - Supports level skipping (e.g., gaining 500 XP at level 1 jumps to level 4)
 * - Formula: level = floor(log2(exp / 50) + 1)
 */
export const calculateLvlFromExp = (exp: number) => {
  // Players start at level 1
  if (exp < 50) return 1;

  // Calculate level from XP using logarithm
  // Derived from: exp = 50 * 2^(level - 1)
  // Solving for level: level = log2(exp / 50) + 1
  const lvl = Math.log2(exp / 50) + 1;
  return Math.floor(lvl);
};

/**
 * Creates a skill tree structure from a class's skills array
 *
 * @param skills - Array of skills from a class
 * @returns Array of skill tree nodes with parent-child relationships
 *
 * @structure
 * Each node contains:
 * - key: Unique identifier for the skill
 * - parent: Key of the parent skill (null for root skills)
 * - children: Array of child nodes (with the same structure recursively)
 * - data: Complete skill data object
 *
 * @example
 * Input: [
 *   { key: "backstab", required: null, ... },
 *   { key: "double_backstab", required: "backstab", ... }
 * ]
 * Output: [
 *   {
 *     key: "backstab",
 *     parent: null,
 *     children: [
 *       { key: "double_backstab", parent: "backstab", children: [], data: {...} }
 *     ],
 *     data: {...}
 *   }
 * ]
 */
export const buildSkillTree = (skills: SkillDefinition[]) => {
  // Create a map for quick lookup
  const nodeMap: { [key: string]: SkillTreeNode } = {};

  // Initialize all nodes
  skills.forEach((skill) => {
    nodeMap[skill.key] = {
      key: skill.key,
      parent: (skill as any).required || null,
      children: [],
      data: skill,
    };
  });

  // Build parent-child relationships
  const rootNodes: SkillTreeNode[] = [];

  Object.values(nodeMap).forEach((node) => {
    if (node.parent) {
      // Add this node to its parent's children array
      const parentNode = nodeMap[node.parent];
      if (parentNode) {
        parentNode.children.push(node);
      }
    } else {
      // This is a root node (no parent)
      rootNodes.push(node);
    }
  });

  return rootNodes;
};

export const validateForgeItems = ({
  itemsInForgeSlot,
  selectedItem,
}: {
  itemsInForgeSlot: IInventoryItem[];
  selectedItem: IInventoryItem;
}): { goodToForge: boolean; message: string } => {
  if (itemsInForgeSlot.length >= 2) {
    return { goodToForge: false, message: "Forge slots are full. Remove an item first" };
  }

  if (selectedItem.itemLevel >= MAX_ITEM_LEVEL) {
    return { goodToForge: false, message: "This item is already at max level and cannot be forged further" };
  }

  if (itemsInForgeSlot.length === 0) {
    return { goodToForge: true, message: "good to forge" };
  }

  const firstItem = itemsInForgeSlot[0];

  if (firstItem.instanceId === selectedItem.instanceId) {
    return { goodToForge: false, message: "You selected this copy. Please select another copy" };
  }

  if (firstItem.key !== selectedItem.key) {
    return { goodToForge: false, message: "Please select 2 copies of the same item" };
  }

  if (firstItem.itemLevel !== selectedItem.itemLevel) {
    return { goodToForge: false, message: "Both items must have the same item level" };
  }

  return { goodToForge: true, message: "good to forge" };
};

export const forgeItems = (
  itemsToForge: IInventoryItem[],
  inventory: IInventoryItem[],
): { newInventory: IInventoryItem[]; forgedItem: IInventoryItem; message: string } => {
  const [itemA] = itemsToForge;
  const newItemLevel = itemA.itemLevel + 1;
  const baseItem = items.find((i) => i.key === itemA.key);

  const upgradedStats = Object.fromEntries(
    Object.entries(itemA.stats).map(([stat, _value]) => {
      const base = baseItem?.stats[stat as keyof typeof baseItem.stats] ?? 1;
      const newStat = Math.round(base * (1 + 0.25 * newItemLevel)) + newItemLevel;
      return [stat, newStat];
    }),
  ) as typeof itemA.stats;

  const forgedItem: IInventoryItem = {
    ...itemA,
    instanceId: new Date().getTime(),
    itemLevel: newItemLevel,
    stats: upgradedStats,
  };

  const newInventory = inventory
    .filter((i) => i.instanceId !== itemA.instanceId && i.instanceId !== itemsToForge[1].instanceId)
    .concat(forgedItem);

  return {
    newInventory,
    forgedItem,
    message: `${itemA.name} forged to level ${newItemLevel}!`,
  };
};

// Run stages
export const getStageData = (index: number) => {
  const stageData = RunConfig.stages[index];
  return stageData;
};

export const getGameEvent = getEvent;
