import { StaticImageData } from "next/image"

type Player = {
  type: string,
  name: string,
  image: StaticImageData,
  plClass: string,
  level: number,
  exp: number,
  levelExp: number,
  stats: Stats,
  bonusStats: BonusStats,
  buffStats: BuffStat[],
  buffs: Record<string, number>,
  items: Items[],
  skills: Skills[]
}
type BuffStat = {
  name: string,
  value: number,
  duration: number
}

type Stats = {
  hp: number,
  mp: number,
  maxHP: number,
  maxMP: number,
  atk: number,
  def: number,
  spd: number,
  int: number
}

type BonusStats = {
  maxHP: number,
  maxMP: number,
  atk: number,
  def: number,
  spd: number,
  int?: number,
  hp?: number,
  mp?: number
}

type Skills = {
  key: string,
  name: string,
  target: string,
  cost: number,
  effects: { stats: string, value: number }[],
  duration: number | boolean
}
type Items = {
  id: number,
  type: string,
  key: string,
  name: string,
  image: string,
  price: number,
  qty: number,
  maxQty: number,
  stats: {
    [key: string]: number
  }
  isConsumable: boolean,
}
export type {
  Stats,
  BuffStat,
  Player,
  BonusStats,
  Skills,
  Items
}