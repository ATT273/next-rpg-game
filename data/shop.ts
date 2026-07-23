import { IShopConfig } from "@/types/shop";

const shops: IShopConfig[] = [
  {
    id: 1,
    name: "Igor - Blacksmith",
    quotes: "I'm a blacksmith, I make weapons and armor.",
    image: "/images/shops/igor_blacksmith.webp",
    items: [
      { key: "rusty_sword", price: 10, qty: 1 },
      { key: "iron_axe", price: 5, qty: 1 },
      { key: "broad_sword", price: 40, qty: 1 },
      { key: "wooden_shield", price: 20, qty: 1 },
      { key: "iron_shield", price: 30, qty: 1 },
      { key: "knight_shield", price: 50, qty: 1 },
      { key: "plate-armor", price: 50, qty: 1 },
      { key: "chainmail", price: 10, qty: 1 },
      { key: "battle_axe", price: 120, qty: 1 },
      { key: "dragonbone_sword", price: 300, qty: 1 },
      { key: "excalibur", price: 999, qty: 1 },
    ],
  },
  {
    id: 2,
    name: "Melina - Enchanter",
    quotes: "I'm an enchantress, I can enchant items.",
    image: "/images/shops/melina_enchantress.webp",
    items: [
      { key: "oak_wand", price: 5, qty: 1 },
      { key: "fire_book", price: 5, qty: 1 },
      { key: "ice_book", price: 5, qty: 1 },
      { key: "leather_boots", price: 20, qty: 1 },
      { key: "shadow_cloak", price: 90, qty: 1 },
      { key: "fire_breath_tome", price: 100, qty: 1 },
      { key: "fire_storm_tome", price: 280, qty: 1 },
    ],
  },
];

export default shops;
