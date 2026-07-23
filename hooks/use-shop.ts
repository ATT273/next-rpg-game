import shops from "@/data/shop";
import { useState } from "react";
import * as _ from "lodash";
import { IShopConfig, IShopItem, ItemRarity } from "@/types/shop";
import items from "@/data/items";
import { getRandomIndex } from "@/utils";

export default function useShop() {
  const [shop, setShop] = useState<IShopConfig>(shops[0]);

  const getRandomShop = () => {
    const randomIndex = getRandomIndex(shops.length);
    return randomIndex;
  };

  const getShop = (id: number) => {
    return _.cloneDeep(shops.find((s) => s.id === id));
  };

  const resolveShopItems = (shopId: number): IShopItem[] => {
    const _shop = shops.find((s) => s.id === shopId);
    if (!_shop) return [];
    return _shop.items
      .map((config) => {
        const itemDef = items.find((item) => item.key === config.key);
        if (!itemDef) return null;
        return { ..._.cloneDeep(itemDef), price: config.price, qty: config.qty };
      })
      .filter(Boolean) as IShopItem[];
  };

  const getRandomItemByRarity = (rarity: ItemRarity) => {
    const itemsByRarity = items.filter((item) => item.rarity === rarity);
    const randomIdx = Math.floor(Math.random() * itemsByRarity.length);
    const randomItem = _.cloneDeep(itemsByRarity[randomIdx]);
    return randomItem;
  };

  const getRandomItems = (count: number = 3): IShopItem[] => {
    const shuffled = _.shuffle(items);
    return _.cloneDeep(shuffled.slice(0, count));
  };

  return {
    shop,
    getRandomShop,
    getShop,
    resolveShopItems,
    getRandomItemByRarity,
    getRandomItems,
  };
}
