import shops from "@/data/shop";
import { useState } from "react";
import * as _ from "lodash";
import { IShopConfig, IShopItem, ItemRarity } from "@/types/shop";
import items from "@/data/items";

export default function useShop() {
  const [shop, setShop] = useState<IShopConfig>(shops[0]);

  const getRandomShop = () => {
    const _shop = _.cloneDeep(shops[1]);
    setShop(_shop);
    return _shop;
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

  return {
    shop,
    getRandomShop,
    getShop,
    resolveShopItems,
    getRandomItemByRarity,
  };
}
