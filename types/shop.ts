import { StaticImageData } from "next/image";
import { SkillDefinition, Skills } from "./player";

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
  skills: string[] | [];
  rarity: ItemRarity;
  lvlRequired: number;
  itemLevel: number;
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

export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface RarityStat {
  type: ItemRarity;
  color: string;
  percentage: number;
}

export interface IShopItemConfig {
  key: string;
  price: number;
  qty: number;
}

export interface IShopConfig {
  id: number;
  name: string;
  quotes: string;
  image: string;
  items: IShopItemConfig[];
}
