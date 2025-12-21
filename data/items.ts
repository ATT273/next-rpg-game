import RustySword from "@/public/images/items/rusty_sword.jpeg";
import WoodenShield from "@/public/images/items/wooden_shield.jpeg";
import LeatherBoots from "@/public/images/items/leather_boots.jpeg";
import IronShield from "@/public/images/items/Iron_Shield.png";
import BroadSword from "@/public/images/items/broad_sword.jpeg";
import PlateArmor from "@/public/images/items/plate_armor.jpeg";
import HPPotion from "@/public/images/items/hp_potion.jpeg";
import { IShopItem } from "@/types/shop";

const items: IShopItem[] = [
  {
    id: 0,
    image: RustySword,
    key: "rusty_sword",
    name: "Rusty Sword",
    type: "sword",
    isConsumable: false,
    price: 10,
    qty: 0,
    maxQty: 1,
    stats: {
      atk: 1,
    },
    skills: [],
    description: "",
  },
  {
    id: 1,
    image: WoodenShield,
    key: "wooden_shield",
    name: "Wooden shield",
    type: "shield",
    isConsumable: false,
    price: 20,
    qty: 0,
    maxQty: 1,
    stats: {
      def: 3,
    },
    skills: [],
    description: "",
  },
  {
    id: 2,
    image: LeatherBoots,
    key: "leather_boots",
    name: "Leather boots",
    type: "boots",
    isConsumable: false,
    price: 20,
    qty: 0,
    maxQty: 1,
    stats: {
      def: 2,
      spd: 1,
    },
    skills: [],
    description: "",
  },
  {
    id: 3,
    image: IronShield,
    key: "iron_shield",
    name: "Iron shield",
    type: "shield",
    isConsumable: false,
    price: 30,
    qty: 0,
    maxQty: 1,
    stats: {
      def: 5,
    },
    skills: [],
    description: "",
  },
  {
    id: 4,
    image: BroadSword,
    key: "broad_sword",
    name: "Broadsword",
    type: "sword",
    isConsumable: false,
    price: 30,
    qty: 0,
    maxQty: 1,
    stats: {
      atk: 5,
    },
    skills: [],
    description: "",
  },
  {
    id: 5,
    image: PlateArmor,
    key: "plate-armor",
    name: "Plate armor",
    type: "armor",
    isConsumable: false,
    price: 50,
    qty: 0,
    maxQty: 1,
    stats: {
      def: 10,
    },
    skills: [],
    description: "",
  },
  {
    id: 6,
    image: HPPotion,
    key: "health-potion",
    name: "HP potion",
    type: "hp_potion",
    isConsumable: true,
    price: 5,
    qty: 0,
    maxQty: 5,
    stats: {
      hp: 10,
    },
    skills: [],
    description: "",
  },
  {
    id: 7,
    image: "/images/items/chanimail.jpeg",
    key: "chainmail",
    name: "Chainmail vest",
    type: "armor",
    isConsumable: false,
    price: 10,
    qty: 0,
    maxQty: 1,
    stats: {
      def: 2,
    },
    skills: [],
    description: "",
  },
];

export default items;
