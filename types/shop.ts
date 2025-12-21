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
