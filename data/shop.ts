import { IShop } from "@/types/shop";

const shops: IShop[] = [
  {
    id: 1,
    name: "Igor - Blacksmith",
    quotes: "I'm a blacksmith, I make weapons and armor.",
    image: "/images/shops/igor_blacksmith.jpeg",
    items: [
      {
        id: 1,
        name: "Iron Sword",
        price: 5,
        image: "/images/items/iron_sword.png",
        description: "A sword made of iron. It is a good weapon for beginners.",
        type: "weapon",
        stats: {
          atk: 3,
        },
      },
      {
        id: 2,
        name: "Iron Axe",
        price: 5,
        image: "/images/items/iron_axe.png",
        description: "An axe made of iron. It is a good weapon for beginners.",
        type: "weapon",
        stats: {
          atk: 4,
        },
      },
      {
        id: 3,
        name: "Iron Shield",
        price: 5,
        image: "/images/items/iron_shield.png",
        description:
          "A shield made of iron. It is a good weapon for beginners.",
        type: "shield",
        stats: {
          def: 3,
        },
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
        name: "Oak wood wand ",
        price: 5,
        image: "/images/items/enchanted_sword.png",
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
      },
      {
        id: 2,
        name: "Fire spellbook",
        price: 5,
        image: "/images/items/enchanted_sword.png",
        description: "Spellbook that can cast fire spells.",
        type: "book",
        stats: null,
        skills: [
          {
            name: "Fire spell",
            description: "The target will receive fire damage.",
            value: 5,
            cost: 5,
          },
        ],
      },
      {
        id: 3,
        name: "Ice spellbook",
        price: 5,
        image: "/images/items/enchanted_sword.png",
        description: "Spellbook that can cast fire spells.",
        type: "book",
        stats: null,
        skills: [
          {
            name: "Ice spell",
            description: "The target will receive ice damage.",
            value: 5,
            cost: 5,
          },
        ],
      },
    ],
  },
];

export default shops;
