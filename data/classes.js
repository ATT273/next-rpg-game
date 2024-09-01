import knight from '@/public/images/classes/knight.jpg';
import warrior from '@/public/images/classes/warrior.jpg';
import assassin from '@/public/images/classes/assassin.jpg';
import mage from '@/public/images/classes/mage.jpg';

const classes = {
    knight: {
        key: 'knight',
        name: 'Knight',
        image: knight,
        bonuses: {
            def: 1,
        },
        stats: {
            hp: 50,
            mp: 100,
            atk: 5,
            def: 8,
            int: 0,
            spd: 3,
            maxHP: 50,
            maxMP: 100,
        },
        skills: [
            {
                key: 'holy_strike',
                name: 'Holy Strike',
                target: 'enemy',
                cost: 10,
                effects: [
                    { stats: 'hp', value: -10 }
                ],
                duration: false
            },
            {
                key: 'iron_skin',
                name: 'Iron Skin',
                target: 'self',
                cost: 20,
                effects: [
                    { stats: 'def', value: 5 }
                ],
                duration: 3
            },
            {
                key: 'holy_water',
                name: 'Holy Water',
                target: 'self',
                cost: 20,
                effects: [
                    { stats: 'def', value: 3 },
                    { stats: 'atk', value: 3 }
                ],
                duration: 3
            }
        ]
    },
    warrior: {
        key: 'warrior',
        name: 'Warrior',
        image: warrior,
        bonuses: {
            atk: 1,
        },
        stats: {
            hp: 50,
            mp: 100,
            atk: 8,
            def: 5,
            int: 0,
            spd: 3,
            maxHP: 50,
            maxMP: 100,
        },
        skills: [
            {
                key: 'battle_roar',
                name: 'Battle Roar',
                target: 'self',
                cost: 7,
                effects: [
                    { stats: 'atk', value: 3 }
                ],
                duration: 3
            },
            {
                key: 'rage',
                name: 'Rage',
                target: 'self',
                cost: 10,
                effects: [
                    { stats: 'atk', value: 5 },
                    { stats: 'spd', value: 3 },
                ],
                duration: 3
            },
            {
                key: 'second_wind',
                name: 'Second Wind',
                target: 'self',
                cost: 10,
                effects: [
                    { stats: 'hp', value: 6 }
                ],
                duration: 3
            }
        ]
    },
    assassin: {
        key: 'assassin',
        name: 'Assassin',
        image: assassin,
        bonuses: {
            spd: 1,
        },
        stats: {
            hp: 30,
            mp: 100,
            atk: 8,
            def: 3,
            int: 0,
            spd: 5,
            maxHP: 30,
            maxMP: 100,
        },
        skills: [
            {
                key: 'backstab',
                name: 'Backstab',
                target: 'enemy',
                cost: 15,
                effects: [
                    { stats: 'hp', value: -15 }
                ],
                duration: false
            },
            {
                key: 'ambus_and_assassinate',
                name: 'Ambus and assassinate',
                target: 'enemy',
                cost: 25,
                effects: [
                    { stats: 'hp', value: -25 },
                ],
                duration: 3
            },
            {
                key: 'poision_dagger',
                name: 'Poison Dagger',
                target: 'enemy',
                cost: 10,
                effects: [
                    { stats: 'hp', value: -10 }
                ],
                duration: 3
            }
        ]
    },
    mage: {
        key: 'mage',
        name: 'Mage',
        image: mage,
        bonuses: {
            int: 1
        },
        stats: {
            hp: 30,
            mp: 100,
            atk: 3,
            def: 5,
            int: 5,
            spd: 3,
            maxHP: 30,
            maxMP: 100,
        },
        skills: [
            {
                key: 'fireball',
                name: 'Fireball',
                target: 'enemy',
                cost: 10,
                effects: [
                    { stats: 'hp', value: -15 }
                ],
                duration: 3
            },
            {
                key: 'ice_shard',
                name: 'Ice shard',
                target: 'enemy',
                cost: 5,
                effects: [
                    { stats: 'hp', value: -9 },
                ],
                duration: 3
            },
            {
                key: 'divine_light',
                name: 'Divine Light',
                target: 'self',
                cost: 5,
                effects: [
                    { stats: 'hp', value: 10 }
                ],
                duration: 3
            }
        ]
    }
};
export default classes;