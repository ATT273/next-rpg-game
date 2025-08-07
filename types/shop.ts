import { StaticImageData } from "next/image";
import { Skills } from "./player";

export interface IShop {
  id: number;
  name: string;
  quotes: string;
  image: string;
  items: IShopItem[];
}

export interface IShopItem {
  id: number;
  key: string;
  name: string;
  price: number;
  image: string | StaticImageData;
  description: string;
  type: string;
  qty: number;
  maxQty: number;
  isConsumable: boolean;
  stats: IItemStat;
  effects:
    | {
        name: string;
        description: string;
        value: number;
      }[]
    | [];
  skills: Skills[] | [];
}
export interface IItemStat {
  hp?: number;
  mp?: number;
  maxHP?: number;
  maxMP?: number;
  atk?: number;
  def?: number;
  spd?: number;
  int?: number;
}
// type IShopItem = {
//   id: number;
//   type: string;
//   key: string;
//   name: string;
//   image: StaticImageData;
//   price: number;
//   description?: string;
//   qty?: number;
//   maxQty?: number;
//   stats: {
//     [key: string]: number;
//   };
//   isConsumable: boolean;
// };
