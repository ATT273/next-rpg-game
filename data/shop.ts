import { IShop } from "@/types/shop";
import Oakwand from "@/public/images/items/oak_wand.jpeg";
import Firebook from "@/public/images/items/fire_book.jpeg";
import Icebook from "@/public/images/items/ice_book.jpeg";
import { SKILL_TARGET } from "./data";

const shops: IShop[] = [
  {
    id: 1,
    name: "Igor - Blacksmith",
    quotes: "I'm a blacksmith, I make weapons and armor.",
    image: "/images/shops/igor_blacksmith.jpeg",
    items: [
      {
        id: 1,
        key: "iron_sword",
        name: "Iron Sword",
        price: 5,
        qty: 1,
        maxQty: 1,
        isConsumable: false,
        image: "/images/items/iron_sword.jpeg",
        description: "A sword made of iron. It is a good weapon for beginners.",
        type: "weapon",
        stats: {
          atk: 3,
        },
        skills: [],
      },
      {
        id: 2,
        key: "iron_axe",
        name: "Iron Axe",
        price: 5,
        qty: 1,
        maxQty: 1,
        isConsumable: false,
        image: "/images/items/iron_axe.jpeg",
        description: "An axe made of iron. It is a good weapon for beginners.",
        type: "weapon",
        stats: {
          atk: 4,
        },
        skills: [],
      },
      {
        id: 3,
        name: "Iron Shield",
        key: "iron_shhield",
        price: 5,
        qty: 1,
        maxQty: 1,
        isConsumable: false,
        image: "/images/items/iron_shield.jpeg",
        description:
          "A shield made of iron. It is a good weapon for beginners.",
        type: "shield",
        stats: {
          def: 3,
        },
        skills: [],
      },
    ],
  },
  {
    id: 2,
    name: "Melina - Enchanter",
    quotes: "I'm an enchantress, I can enchant items.",
    image: "/images/shops/melina_enchantress.png",
    items: [
      {
        id: 1,
        key: "oak_wand",
        name: "Oak wood wand ",
        price: 5,
        qty: 1,
        maxQty: 1,
        isConsumable: false,
        image: Oakwand,
        description:
          "A wand made of oak wood. It is a good weapon for beginners.",
        type: "weapon",
        stats: {
          atk: 2,
        },
        skills: [],
      },
      {
        id: 2,
        key: "fire_book",
        name: "Fire spellbook",
        price: 5,
        qty: 1,
        maxQty: 1,
        isConsumable: false,
        image: Firebook,
        description: "Spellbook that can cast fire spells.",
        type: "book",
        stats: {},
        skills: [
          {
            key: "fireball",
            name: "Fireball",
            type: "magical",
            required: null,
            level: 0,
            target: SKILL_TARGET.ENEMY,
            amplified: [0.3, 0.35, 0.5],
            cost: [10, 12, 15],
            effects: [{ stats: "hp", value: [-15, -16, -18] }],
            duration: false,
            description: "",
            image: "",
          },
        ],
      },
      {
        id: 3,
        key: "ice_book",
        name: "Ice spellbook",
        price: 5,
        qty: 1,
        maxQty: 1,
        isConsumable: false,
        image: Icebook,
        description: "Spellbook that can cast fire spells.",
        type: "book",
        stats: {},
        skills: [
          {
            key: "ice_shard",
            name: "Ice shard",
            type: "magical",
            level: 0,
            required: null,
            amplified: [0.3, 0.5, 0.5],
            target: SKILL_TARGET.ENEMY,
            cost: [5, 6, 7],
            effects: [{ stats: "hp", value: [-9, -10, -13] }],
            duration: false,
            description: "",
          },
        ],
      },
    ],
  },
];

export default shops;
