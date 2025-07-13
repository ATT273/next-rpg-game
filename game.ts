import enemies from '@/data/enemies'
import items from '@/data/items'
import { BuffStat, Items, Player, Skills } from './types/player';
import { Enemy } from './types/enemy';
import * as _ from 'lodash'
import { events } from '@/data/data';
class Game {

  static isPlayer(object: Player | Enemy): object is Player {
    return (object as Player).type === 'player';
  }

  static getPlayerItems(attacker: Player | Enemy, target: Player | Enemy) {
    if ((attacker as Player).type === 'player') {
      return (attacker as Player).items;
    } else if ((target as Player).type === 'player') {
      return (target as Player).items;
    }
  }
  static getEnemy(key: string | '', level: number) {
    const filterEnemies = enemies.filter(enemy => enemy.key !== key && enemy.matchLvl.includes(level));
    const randomIdx = Math.floor(Math.random() * (filterEnemies.length));
    return _.cloneDeep(filterEnemies[randomIdx])
    // return JSON.parse(JSON.stringify(filterEnemies[randomIdx]))
  }

  static normalAttack(attacker: Player | Enemy, target: Player | Enemy) {
    const _items = this.getPlayerItems(attacker, target);
    const bonusStats = this.getBonusStats(_items ? _items : []);
    const _buffStats = this.isPlayer(attacker) ? (attacker as Player).buffStats : (target as Player).buffStats
    const atkBuff = this.isPlayer(attacker) ? _.find(_buffStats, buff => buff.name === "atk") || { value: 0 } : { value: 0 }
    const defBuff = this.isPlayer(target) ? _.find(_buffStats, buff => buff.name === "def") || { value: 0 } : { value: 0 }
    const atkOfAttacker = this.isPlayer(attacker) ? (attacker.stats.atk + bonusStats.atk + atkBuff!.value) : attacker.stats.atk;
    const defOfTarget = target.type === 'player' ? (target.stats.def + bonusStats.def + defBuff!.value) : target.stats.def;

    const dmgDealed = (atkOfAttacker - defOfTarget) > 0 ? atkOfAttacker - defOfTarget : 0
    let type = attacker.type
    target.stats.hp = (target.stats.hp - dmgDealed) < 0 ? 0 : target.stats.hp - dmgDealed

    const combatLog = `${attacker.name} deals ${dmgDealed} damage`
    return { attacker, target, type, combatLog }
  }

  static skillUsing(attacker: Player, target: Enemy, skill: Skills) {
    // let dmgDealed = 0;
    let combatLog = '';
    let type = '';
    if (skill.target === 'enemy') {
      const atkOfAttacker = Math.abs(skill.effects[0].value);
      const defOfTarget = target.stats.def;
      const dmgDealed = (atkOfAttacker - defOfTarget) > 0 ? atkOfAttacker - defOfTarget : 0
      type = attacker.type;
      target.stats.hp = (target.stats.hp - dmgDealed) < 0 ? 0 : target.stats.hp - dmgDealed;
      attacker.stats.mp -= skill.cost;

      combatLog = `${attacker.name} used ${skill.name} => deals ${dmgDealed} damage`;
    }

    if (skill.target === 'self') {
      const buffStats = [
        {
          name: "hp",
          value: 0,
          duration: 0
        },
        {
          name: "atk",
          value: 0,
          duration: 0
        },
        {
          name: "def",
          value: 0,
          duration: 0
        },
        {
          name: "spd",
          value: 0,
          duration: 0
        },
      ]
      // Object.assign(attacker.buffs, { ...attacker.buffs, skill })
      skill.effects.forEach(fx => {
        buffStats.forEach(buff => {
          if (fx.stats === buff.name) {
            buff.value += fx.value
            buff.duration += (typeof skill.duration === 'boolean') ? 0 : skill.duration
          }
        })
      })

      attacker.buffStats = [...buffStats];
      buffStats.forEach(buff => {
        if (buff.name === "hp" && buff.value > 0) {
          attacker.stats.hp += buff.value;
        }
      })

      attacker.stats.mp -= skill.cost;
      type = attacker.type;
      combatLog = `${attacker.name} used ${skill.name}`;
    }
    return { attacker, target, type, combatLog }
  }

  static calculateBuffDuration(player: Player) {
    let _buffStats = player.buffStats.map((buff: BuffStat) => {
      if (buff.duration > 0) buff.duration -= 1
      if (buff.duration === 0) buff.value = 0
      return buff
    })
    let _combatLog = ''

    _buffStats.forEach((buff: BuffStat) => {
      if (buff.duration > 0) {
        _combatLog += `${player.name} buffed ${buff.name} by ${buff.value}\n`
      }
    })
    return { _combatLog, _buffStats }
  }

  static winCondition(player: Player, com: Enemy) {
    if (player.stats.hp === 0) {
      return {
        status: 0,
        message: 'You are defeated'
      }
    }
    if (com.stats.hp === 0) {
      return {
        status: 0,
        message: 'You win'
      }
    }

    return {
      status: 1,
      message: 'continue'
    }
  }

  static getLootItem() {
    // const filterEvents = events.filter(event => event.id !== id)
    const randomIdx = Math.floor(Math.random() * (items.length));
    return _.cloneDeep(items[randomIdx]);
  }
  static getEvent(id: number) {
    const eventIdsList = [1, 2, 3]
    const filterEvents = eventIdsList.filter(event => event !== id)
    const randomIdx = Math.floor(Math.random() * (filterEvents.length));
    return filterEvents[randomIdx]
  }

  static getBonusStats(itemList: Items[]) {
    const bonusStats = {
      atk: 0,
      def: 0,
      spd: 0,
      maxHP: 0,
      maxMP: 0
    }
    if (itemList.length > 0) itemList.forEach(item => {
      bonusStats.atk += item.stats.atk !== undefined ? item.stats.atk : 0
      bonusStats.def += item.stats.def !== undefined ? item.stats.def : 0
      // bonusStats.hp += item.stats.hp !== undefined ? item.stats.hp : 0
      // bonusStats.mp += item.stats.mp !== undefined ? item.stats.mp : 0
      bonusStats.spd += item.stats.spd !== undefined ? item.stats.spd : 0
      bonusStats.maxHP += item.stats.maxHP !== undefined ? item.stats.maxHP : 0
      bonusStats.maxMP += item.stats.maxMP !== undefined ? item.stats.maxMP : 0

    })

    return bonusStats
  }

  static takeItem(item: Items, itemList: Items[]) {
    let newInventory = _.cloneDeep(itemList);
    let message = '';
    let isMaxQty = false;
    if (newInventory.length < 6) {
      const itemIndex = _.findIndex(newInventory, pItem => pItem.key === item.key);
      if (itemIndex > -1) {
        if (newInventory[itemIndex].qty === newInventory[itemIndex].maxQty) {
          isMaxQty = true;
          message = `You can only have ${newInventory[itemIndex].maxQty} of this item`;
        } else {
          newInventory[itemIndex].qty += 1;
          message = `${item.name} is added to your inventory`;
          return { newInventory, message, isMaxQty }
        }
      } else {
        if (!isMaxQty) {
          item.qty += 1;
          newInventory.push(item);
          message = `${item.name} is added to your inventory`;
        }
      }


    } else if (itemList.length > 6) {
      message = 'Please remove 1 of your items';
      isMaxQty = true;
    }

    return { newInventory, message, isMaxQty }
  }

  static consumeItem(player: Player, key: string) {
    const stats = { ...player.stats };
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem) {
      Object.keys(selectedItem.stats).forEach(key => {
        if (stats[key as keyof typeof stats] + selectedItem.stats[key as keyof typeof selectedItem.stats]! > stats[`max${key.toUpperCase()}` as keyof typeof stats]!) {
          stats[key as keyof typeof stats] = stats[`max${key.toUpperCase()}` as keyof typeof stats];
        } else stats[key as keyof typeof stats] += selectedItem.stats[key as keyof typeof selectedItem.stats]!;
      })
    }

    return stats
  }

  static calculateCurrentLvlExp(level: number) {
    const exp = 50 * Math.pow(2, (level - 1));
    return exp
  }

  static calculateLvlFromExp(exp: number) {
    const lvl = Math.log(exp / 25) / Math.log(2);
    return parseInt(lvl.toFixed(2));
  }
}

export default Game