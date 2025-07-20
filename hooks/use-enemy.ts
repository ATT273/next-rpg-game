import enemies from "@/data/enemies";
import * as _ from "lodash";
import { Enemy } from "@/types/enemy";
export default function useEnemy() {
  const getRandomEnemy = (enemyKey: string, playerLvl: number) => {
    console.log("data", enemyKey, playerLvl);
    const filterEnemies = enemies.filter(
      (enemy) => enemy.key !== enemyKey && enemy.matchLvl.includes(playerLvl)
    );
    const randomIdx = Math.floor(Math.random() * filterEnemies.length);
    const _enemy = _.cloneDeep(filterEnemies[randomIdx]);

    return _enemy as Enemy;
  };

  return {
    getRandomEnemy,
  };
}
