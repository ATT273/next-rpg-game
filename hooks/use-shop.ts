import shops from "@/data/shop";
import { useState } from "react";
import * as _ from "lodash";
import { IShop } from "@/types/shop";
import items from "@/data/items";
import { IShopItem } from "@/types/shop";

export default function useShop() {
  const [shop, setShop] = useState<IShop>(shops[0]);

  const getRandomShop = () => {
    const randomIdx = Math.floor(Math.random() * shops.length);
    const _shop = _.cloneDeep(shops[randomIdx]);
    setShop(_shop);

    return _shop;
  };
  const getShop = (id: number) => {
    const _shop = _.cloneDeep(shops[id]);
    getShopItems(_shop.items);

    return _shop;
  };

  const getShopItems = (shopItems: IShopItem[]) => {
    const randomIdx = Math.floor(Math.random() * items.length);
    const secondIdx =
      randomIdx !== items.length ? randomIdx + 1 : randomIdx - 1;
    const thirdIdx =
      randomIdx === 0
        ? randomIdx + 2
        : randomIdx !== items.length
        ? randomIdx - 1
        : randomIdx - 2;
    const itemsList = [items[randomIdx], items[secondIdx], items[thirdIdx]];

    return itemsList;
  };

  return {
    shop,
    getRandomShop,
    getShop,
  };
}
