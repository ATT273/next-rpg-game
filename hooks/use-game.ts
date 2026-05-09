import enemies from "@/data/enemies";
import items from "@/data/items";
import { ActionType, BuffCounter, Player, SkillDefinition, Skills, SkillTreeNode, SkillType } from "@/types/player";
import { IShopItem } from "@/types/shop";
import { Enemy } from "@/types/enemy";
import * as _ from "lodash";
import { SKILL_TARGET, WIN_CONDITION_STATUS } from "@/data/data";

function useGame() {
  const isPlayer = (object: Player | Enemy): object is Player => {
    return (object as Player).type === "player";
  };

  const getPlayerItems = (attacker: Player | Enemy, target: Player | Enemy) => {
    if ((attacker as Player).type === "player") {
      return (attacker as Player).items;
    } else if ((target as Player).type === "player") {
      return (target as Player).items;
    }
  };

  const getEvent = (id: number) => {
    const eventIdsList = [1, 2, 3];
    const filterEvents = eventIdsList.filter((event) => event !== id);
    const randomIdx = Math.floor(Math.random() * filterEvents.length);
    return filterEvents[randomIdx];
  };

  const getRandomEnemy = (key: string | "", level: number) => {
    const filterEnemies = enemies.filter((enemy) => enemy.key !== key && enemy.matchLvl.includes(level));
    const randomIdx = Math.floor(Math.random() * filterEnemies.length);
    return _.cloneDeep(filterEnemies[randomIdx]);
    // return JSON.parse(JSON.stringify(filterEnemies[randomIdx]))
  };

  const getEnemy = (key: string) => {
    const filterEnemies = enemies.filter((enemy) => enemy.key === key);
    return _.cloneDeep(filterEnemies.length > 0 ? filterEnemies[0] : undefined);
    // return JSON.parse(JSON.stringify(filterEnemies[randomIdx]))
  };

  const normalAttack = async (attacker: Player | Enemy, target: Player | Enemy) => {
    const _items = getPlayerItems(attacker, target);
    const bonusStats = getBonusStats(_items ? _items : []);
    const _buffStats = isPlayer(attacker) ? (attacker as Player).buffStats : (target as Player).buffStats;
    const atkBuff = isPlayer(attacker)
      ? _.find(_buffStats, (buff) => buff.name === "atk") || { value: 0 }
      : { value: 0 };
    const defBuff = isPlayer(target) ? _.find(_buffStats, (buff) => buff.name === "def") || { value: 0 } : { value: 0 };
    const atkOfAttacker = isPlayer(attacker)
      ? attacker.stats.atk + bonusStats.atk + atkBuff!.value
      : attacker.stats.atk;
    const defOfTarget =
      target.type === "player" ? target.stats.def + bonusStats.def + defBuff!.value : target.stats.def;

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
  const calculateSkillValue = (baseValue: number, skillType: SkillType, attacker: Player, amplified: number = 1.0) => {
    const _items = attacker.items;
    const bonusStats = getBonusStats(_items ? _items : []);

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
  const skillUsing = async (attacker: Player, target: Enemy, skill: Skills, isNewCasted: boolean) => {
    // debugger;
    let combatLog = "";
    const actions: (ActionType | null)[] = [];
    if (skill.target === SKILL_TARGET.ENEMY) {
      const baseValue = skill.effects[0].value;
      const amplified = skill.amplified ?? 1.0;
      const atkOfAttacker = calculateSkillValue(baseValue, skill.type, attacker, amplified);
      const defOfTarget = target.stats.def;
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
    }
    return {
      attacker,
      target,
      combatLog,
      actions,
    };
  };

  const calculateBuff = async (player: Player, buffCounter: BuffCounter) => {
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
      } else {
        // remove buff effects
        buff.effects.forEach((fx) => {
          removed.push({
            stat: fx.stats,
            value: fx.value,
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

  const winCondition = async (player: Player, com: Enemy) => {
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

  const getBonusStats = (itemList: IShopItem[]) => {
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

  const takeItem = (
    item: IShopItem,
    itemList: IShopItem[],
  ): { newInventory: IShopItem[]; message: string; isMaxQty: boolean; isAdded: boolean } => {
    let newInventory = _.cloneDeep(itemList);
    let message = "";
    let isMaxQty = false;
    let isAdded = false;
    if (newInventory.length < 6) {
      const itemIndex = _.findIndex(newInventory, (pItem) => pItem.key === item.key);
      if (itemIndex < 0) {
        message = "no item added";
      }
      message = "item added";
      newInventory.push(item);
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
    } else if (itemList.length > 6) {
      message = "Please remove 1 of your items";
      isMaxQty = true;
    }

    return { newInventory, message, isMaxQty, isAdded };
  };

  const consumeItem = (player: Player, key: string) => {
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

  const calculateCurrentLvlExp = (level: number) => {
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
  const calculateLvlFromExp = (exp: number) => {
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
  const buildSkillTree = (skills: SkillDefinition[]) => {
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

  return {
    isPlayer,
    getPlayerItems,
    getRandomEnemy,
    getEnemy,
    normalAttack,
    skillUsing,
    calculateBuff,
    winCondition,
    getBonusStats,
    takeItem,
    consumeItem,
    calculateCurrentLvlExp,
    calculateLvlFromExp,
    buildSkillTree,
    getGameEvent: getEvent,
  };
}

export default useGame;
