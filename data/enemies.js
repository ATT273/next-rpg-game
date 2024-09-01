import tiger from '../images/enemies/tiger.webp';
import orc from '../images/enemies/orc.png';
import dragon from '../images/enemies/dragon.jpg';
import Slime from '../images/enemies/Slime_puddle.png';
import Cobra from '../images/enemies/cobra.jpg';
import Rat from '../images/enemies/zombie_rat.jpg';

const enemies = [
    {
        type: 'com',
        key: 'tiger',
        name: 'Tiger',
        image: tiger,
        xp: 20,
        score: 20,
        matchLvl: [1, 2, 3],
        stats: {
            hp: 200,
            maxHP: 20,
            maxMP: 10,
            mp: 10,
            atk: 10,
            def: 5,
            spd: 3
        }
    },
    {
        type: 'com',
        key: 'orc',
        name: 'Orc',
        image: orc,
        matchLvl: [3, 4, 5],
        xp: 40,
        score: 50,
        stats: {
            hp: 45,
            maxHP: 45,
            mp: 10,
            maxMP: 10,
            atk: 30,
            def: 5,
            spd: 2
        }
    },
    {
        type: 'com',
        key: 'dragon',
        name: 'Dragon',
        image: dragon,
        matchLvl: [5, 6, 7, 8],
        xp: 255,
        score: 100,
        stats: {
            hp: 100,
            mp: 30,
            maxHP: 100,
            maxMP: 30,
            atk: 50,
            def: 20,
            spd: 10
        }
    },
    {
        type: 'com',
        key: 'Slime',
        name: 'Demon Slime',
        image: Slime,
        matchLvl: [1, 2],
        xp: 5,
        score: 3,
        stats: {
            hp: 100,
            mp: 10,
            maxHP: 10,
            maxMP: 10,
            atk: 10,
            def: 3,
            spd: 1
        }
    },
    {
        type: 'com',
        key: 'cobra',
        name: 'King Cobra',
        image: Cobra,
        matchLvl: [2, 3],
        xp: 16,
        score: 10,
        stats: {
            hp: 15,
            mp: 10,
            maxHP: 15,
            maxMP: 10,
            atk: 7,
            def: 3,
            spd: 3
        }
    },
    {
        type: 'com',
        key: 'rat',
        name: 'Zombie rat',
        image: Rat,
        matchLvl: [1, 2],
        xp: 7,
        score: 5,
        stats: {
            hp: 100,
            mp: 10,
            maxHP: 10,
            maxMP: 10,
            atk: 10,
            def: 3,
            spd: 2
        }
    },
];

export default enemies;