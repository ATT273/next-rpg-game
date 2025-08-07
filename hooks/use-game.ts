import enemies from "@/data/enemies";
import items from "@/data/items";
import { ActionType, BuffCounter, Player, Skills } from "@/types/player";
import { IShopItem } from "@/types/shop";
import { Enemy } from "@/types/enemy";
import * as _ from "lodash";
import { SKILL_TARGET, WIN_CONDITION_STATUS } from "@/data/data";

function UseGame() {
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
  const getRandomEnemy = (key: string | "", level: number) => {
    const filterEnemies = enemies.filter(
      (enemy) => enemy.key !== key && enemy.matchLvl.includes(level)
    );
    const randomIdx = Math.floor(Math.random() * filterEnemies.length);
    return _.cloneDeep(filterEnemies[randomIdx]);
    // return JSON.parse(JSON.stringify(filterEnemies[randomIdx]))
  };
  const getEnemy = (key: string) => {
    const filterEnemies = enemies.filter((enemy) => enemy.key === key);
    return _.cloneDeep(filterEnemies.length > 0 ? filterEnemies[0] : undefined);
    // return JSON.parse(JSON.stringify(filterEnemies[randomIdx]))
  };

  const normalAttack = async (
    attacker: Player | Enemy,
    target: Player | Enemy
  ) => {
    const _items = getPlayerItems(attacker, target);
    const bonusStats = getBonusStats(_items ? _items : []);
    const _buffStats = isPlayer(attacker)
      ? (attacker as Player).buffStats
      : (target as Player).buffStats;
    const atkBuff = isPlayer(attacker)
      ? _.find(_buffStats, (buff) => buff.name === "atk") || { value: 0 }
      : { value: 0 };
    const defBuff = isPlayer(target)
      ? _.find(_buffStats, (buff) => buff.name === "def") || { value: 0 }
      : { value: 0 };
    const atkOfAttacker = isPlayer(attacker)
      ? attacker.stats.atk + bonusStats.atk + atkBuff!.value
      : attacker.stats.atk;
    const defOfTarget =
      target.type === "player"
        ? target.stats.def + bonusStats.def + defBuff!.value
        : target.stats.def;

    const dmgDealed =
      atkOfAttacker - defOfTarget > 0 ? atkOfAttacker - defOfTarget : 0;
    let type = attacker.type;
    target.stats.hp =
      target.stats.hp - dmgDealed < 0 ? 0 : target.stats.hp - dmgDealed;
    const actions = [{ type: "atk", value: dmgDealed, source: attacker.type }];
    const combatLog = `${attacker.name} deals ${dmgDealed} damage`;
    return { attacker, target, type, combatLog, actions };
  };

  const skillUsing = async (attacker: Player, target: Enemy, skill: Skills) => {
    // debugger;
    let combatLog = "";
    const actions: ActionType[] = [];
    if (skill.target === SKILL_TARGET.ENEMY) {
      const atkOfAttacker = Math.abs(skill.effects[0].value);
      const defOfTarget = target.stats.def;
      const dmgDealed =
        atkOfAttacker - defOfTarget > 0 ? atkOfAttacker - defOfTarget : 0;

      target.stats.hp =
        target.stats.hp - dmgDealed < 0 ? 0 : target.stats.hp - dmgDealed;
      attacker.stats.mp -= skill.cost;
      actions.push({
        type: "atk",
        value: dmgDealed,
        source: attacker.type,
      });
      combatLog = `${attacker.name} used ${skill.name} => deals ${dmgDealed} damage`;
    }

    if (skill.target === SKILL_TARGET.SELF) {
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

      skill.effects.forEach((fx) => {
        buffStats.forEach((buff) => {
          if (fx.stats === buff.name) {
            actions.push({
              type: fx.stats,
              value: fx.value,
              source: attacker.type,
            });
            buff.value += fx.value;
            buff.duration +=
              typeof skill.duration === "boolean" ? 0 : skill.duration;
          }
        });
      });

      attacker.buffStats = [...buffStats];
      buffStats.forEach((buff) => {
        if (buff.name === "hp" && buff.value > 0) {
          attacker.stats.hp += buff.value;
        }
      });

      attacker.stats.mp -= skill.cost;
      combatLog = `${attacker.name} used ${skill.name}`;
    }
    return {
      attacker,
      target,
      combatLog,
      actions,
    };
  };

  const calculateBuff = async (player: Player, buffCounter: BuffCounter) => {
    const selfBuffs = player.skills.filter(
      (item) => item.target === SKILL_TARGET.SELF
    );
    const _counter = { ...buffCounter };

    let _combatLog = "";
    const removed: { stat: string; value: number }[] = [];
    selfBuffs.forEach((buff) => {
      if (_counter[buff.key] && _counter[buff.key].duration > 1) {
        _counter[buff.key].duration -= 1;
        _combatLog += `
            ${buff.name} ends in ${_counter[buff.key].duration} turns
          `;
      } else {
        buff.effects.forEach((fx) => {
          removed.push({
            stat: fx.stats,
            value: fx.value,
          });
        });
        delete _counter[buff.key];
      }
    });
    // calculate buffs after removed
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

  // const  getLootItem = () => {
  //   // const filterEvents = events.filter(event => event.id !== id)
  //   const randomIdx = Math.floor(Math.random() * items.length);
  //   return _.cloneDeep(items[randomIdx]);
  // }
  // const  getEvent = (id: number) => {
  //   const eventIdsList = [1, 2, 3];
  //   const filterEvents = eventIdsList.filter((event) => event !== id);
  //   const randomIdx = Math.floor(Math.random() * filterEvents.length);
  //   return filterEvents[randomIdx];
  // }

  const getBonusStats = (itemList: IShopItem[]) => {
    const bonusStats = {
      atk: 0,
      def: 0,
      spd: 0,
      maxHP: 0,
      maxMP: 0,
    };
    if (itemList.length > 0)
      itemList.forEach((item) => {
        if (item.stats) {
          bonusStats.atk += item.stats.atk ?? 0;
          bonusStats.def += item.stats.def ?? 0;
          // bonusStats.hp += item.stats.hp !== undefined ? item.stats.hp : 0
          // bonusStats.mp += item.stats.mp !== undefined ? item.stats.mp : 0
          bonusStats.spd += item.stats.spd ?? 0;
          bonusStats.maxHP += item.stats.maxHP ?? 0;
          bonusStats.maxMP += item.stats.maxMP ?? 0;
        }
      });

    return bonusStats;
  };

  const takeItem = (item: IShopItem, itemList: IShopItem[]) => {
    let newInventory = _.cloneDeep(itemList);
    let message = "";
    let isMaxQty = false;
    if (newInventory.length < 6) {
      const itemIndex = _.findIndex(
        newInventory,
        (pItem) => pItem.key === item.key
      );
      if (itemIndex > -1) {
        if (newInventory[itemIndex].qty === newInventory[itemIndex].maxQty) {
          isMaxQty = true;
          message = `You can only have ${newInventory[itemIndex].maxQty} of this item`;
        } else {
          newInventory[itemIndex].qty ? (newInventory[itemIndex].qty += 1) : 1;
          message = `${item.name} is added to your inventory`;
          return { newInventory, message, isMaxQty };
        }
      } else {
        if (!isMaxQty) {
          item.qty ? (item.qty += 1) : 1;
          newInventory.push(item);
          message = `${item.name} is added to your inventory`;
        }
      }
    } else if (itemList.length > 6) {
      message = "Please remove 1 of your items";
      isMaxQty = true;
    }

    return { newInventory, message, isMaxQty };
  };

  const consumeItem = (player: Player, key: string) => {
    const stats = { ...player.stats };
    const selectedItem = items.find((item) => item.key === key);
    if (selectedItem && selectedItem.stats) {
      Object.keys(selectedItem.stats).forEach((key) => {
        if (selectedItem.stats) {
          if (
            stats[key as keyof typeof stats] +
              selectedItem.stats[key as keyof typeof selectedItem.stats]! >
            stats[`max${key.toUpperCase()}` as keyof typeof stats]!
          ) {
            stats[key as keyof typeof stats] =
              stats[`max${key.toUpperCase()}` as keyof typeof stats];
          } else
            stats[key as keyof typeof stats] +=
              selectedItem.stats[key as keyof typeof selectedItem.stats]!;
        }
      });
    }

    return stats;
  };

  const calculateCurrentLvlExp = (level: number) => {
    const exp = 50 * Math.pow(2, level - 1);
    return exp;
  };

  const calculateLvlFromExp = (exp: number) => {
    const lvl = Math.log(exp / 25) / Math.log(2);
    return parseInt(lvl.toFixed(2));
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
  };
}

export default UseGame;
