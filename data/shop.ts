import { IShop } from "@/types/shop";
import Oakwand from "@/public/images/items/oak_wand.jpeg";
import Firebook from "@/public/images/items/fire_book.jpeg";
import Icebook from "@/public/images/items/ice_book.jpeg";

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
        effects: [],
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
        effects: [],
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
        effects: [],
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
        effects: [
          {
            name: "Extra hit",
            description: "The target will receive an extra hit.",
            value: 1,
          },
        ],
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
            key: "fire_spell",
            name: "Fire spell",
            target: "com",
            description: "The target will receive fire damage.",
            effects: [{ stats: "atk", value: 5 }],
            cost: 5,
            duration: false,
          },
        ],
        effects: [],
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
        effects: [],
        skills: [
          {
            key: "ice_shard",
            name: "Ice shard",
            target: "com",
            description: "The target will receive ice damage.",
            effects: [{ stats: "atk", value: 5 }],
            cost: 5,
            duration: false,
          },
        ],
      },
    ],
  },
];

export default shops;
