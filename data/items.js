import RustySword from '../images/items/Rusty_sword.png';
import WoodenShield from '../images/items/wood_shield.png';
import LeatherBoots from '../images/items/Leather_boot.png';
import IronShield from '../images/items/Iron_Shield.png';
import BroadSword from '../images/items/broad_sword.jpg';
import ChestPlate from '../images/items/chest_plate.jpg';
import HPPotion from '../images/items/hp_potion.jpg';

const items = [
    {
        id: 0,
        image: RustySword,
        key: 'rusty_sword',
        name: 'Rusty Sword',
        type: 'sword',
        isConsumable: false,
        price: 100,
        qty: 0,
        maxQty: 1,
        stats: {
            atk: 1,
        }
    },
    {
        id: 1,
        image: WoodenShield,
        key: 'wooden_shield',
        name: 'Wooden shield',
        type: 'shield',
        isConsumable: false,
        price: 200,
        qty: 0,
        maxQty: 1,
        stats: {
            def: 3,
        }
    },
    {
        id: 2,
        image: LeatherBoots,
        key: 'leather_boots',
        name: 'Leather boots',
        type: 'boots',
        isConsumable: false,
        price: 200,
        qty: 0,
        maxQty: 1,
        stats: {
            def: 2,
            spd: 1
        }
    },
    {
        id: 3,
        image: IronShield,
        key: 'iron_shield',
        name: 'Iron shield',
        type: 'shield',
        isConsumable: false,
        price: 300,
        qty: 0,
        maxQty: 1,
        stats: {
            def: 5,
        }
    },
    {
        id: 4,
        image: BroadSword,
        key: 'broad_sword',
        name: 'Broadsword',
        type: 'sword',
        isConsumable: false,
        price: 300,
        qty: 0,
        maxQty: 1,
        stats: {
            atk: 5,
        }
    },
    {
        id: 5,
        image: ChestPlate,
        key: 'chest-plate',
        name: 'Chest plate',
        type: 'armor',
        isConsumable: false,
        price: 500,
        qty: 0,
        maxQty: 1,
        stats: {
            def: 10,
        }
    },
    {
        id: 6,
        image: HPPotion,
        key: 'health-potion',
        name: 'HP potion',
        type: 'hp_potion',
        isConsumable: true,
        price: 50,
        qty: 0,
        maxQty: 5,
        stats: {
            hp: 10,
        }
    }
];
export default items;