import shops from "@/data/shop";
import { useState } from "react";
import * as _ from "lodash";
import { IShop } from "@/types/shop";
export default function useShop() {
  const [shop, setShop] = useState<IShop>(shops[0]);

  const getShop = () => {
    const randomIdx = Math.floor(Math.random() * shops.length);
    const _shop = _.cloneDeep(shops[randomIdx]);
    setShop(_shop);

    return _shop;
  };

  return {
    shop,
    getShop,
  };
}
