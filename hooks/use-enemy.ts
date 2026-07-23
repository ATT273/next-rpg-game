import enemies from "@/data/enemies";
import * as _ from "lodash";
import { Enemy } from "@/types/enemy";
export default function useEnemy() {
  const getRandomEnemy = (enemyKey: string, playerLvl: number) => {
    const filterEnemies = enemies.filter((enemy) => enemy.key !== enemyKey && enemy.matchLvl.includes(playerLvl));
    const randomIdx = Math.floor(Math.random() * filterEnemies.length);
    const _enemy = _.cloneDeep(filterEnemies[randomIdx]);

    return _enemy as Enemy;
  };

  const getRandomEnemies = (playerLvl: number, count: number = 3): Enemy[] => {
    const eligible = enemies.filter((enemy) => enemy.matchLvl.includes(playerLvl) && !enemy.isBoss);
    const shuffled = _.shuffle(eligible);
    return _.cloneDeep(shuffled.slice(0, count));
  };

  const getRandomBoss = (playerLvl: number): Enemy | undefined => {
    const eligibleBosses = enemies.filter((enemy) => enemy.isBoss && enemy.matchLvl.includes(playerLvl));
    const randomIdx = Math.floor(Math.random() * eligibleBosses.length);
    const boss = eligibleBosses[randomIdx];

    return boss && (_.cloneDeep(boss) as Enemy);
  };

  return {
    getRandomEnemy,
    getRandomEnemies,
    getRandomBoss,
  };
}
