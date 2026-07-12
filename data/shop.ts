import { IShopConfig } from "@/types/shop";

const shops: IShopConfig[] = [
  {
    id: 1,
    name: "Igor - Blacksmith",
    quotes: "I'm a blacksmith, I make weapons and armor.",
    image: "/images/shops/igor_blacksmith.webp",
    items: [
      { key: "iron_sword", price: 5, qty: 1 },
      { key: "iron_axe", price: 5, qty: 1 },
      { key: "iron_shield", price: 5, qty: 1 },
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
    ],
  },
];

export default shops;
