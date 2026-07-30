import shops from "@/data/shop";
import { useState } from "react";
import * as _ from "lodash";
import { IShopConfig, IShopItem, ItemRarity } from "@/types/shop";
import items from "@/data/items";
import { getRandomIndex } from "@/utils";
import { RARITY_ORDER, RARITY_DROP_FALLOFF } from "@/constants/items.constants";

export default function useShop() {
  const [shop, setShop] = useState<IShopConfig>(shops[0]);

  const getRandomShopId = () => {
    const randomIndex = getRandomIndex(shops.length);
    return shops[randomIndex].id;
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

  // Rolls a rarity at or below maxRarity: each rank below it is RARITY_DROP_FALLOFF times
  // more likely than the one above, so maxRarity itself is the rarest possible outcome.
  const rollDropRarity = (maxRarity: ItemRarity): ItemRarity => {
    const maxIdx = RARITY_ORDER.indexOf(maxRarity);
    const weights = RARITY_ORDER.slice(0, maxIdx + 1).map((_rarity, idx) => {
      const distanceFromMax = maxIdx - idx;
      return Math.pow(RARITY_DROP_FALLOFF, distanceFromMax);
    });

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let roll = Math.random() * totalWeight;
    for (let idx = 0; idx <= maxIdx; idx++) {
      roll -= weights[idx];
      if (roll <= 0) return RARITY_ORDER[idx] as ItemRarity;
    }
    return RARITY_ORDER[maxIdx] as ItemRarity;
  };

  const getRandomItemByRarity = (maxRarity: ItemRarity) => {
    const droppedRarity = rollDropRarity(maxRarity);
    const itemsByRarity = items.filter((item) => item.rarity === droppedRarity);
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
    getRandomShopId,
    getShop,
    resolveShopItems,
    getRandomItemByRarity,
    getRandomItems,
  };
}
