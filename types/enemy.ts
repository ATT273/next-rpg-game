import { StaticImageData } from "next/image"

type Enemy = {
  type: string,
  key: string,
  name: string,
  image: StaticImageData,
  xp: number,
  score: number,
  matchLvl: number[],
  stats: Stats
}
type Stats = {
  hp: number,
  mp: number,
  maxHP: number,
  maxMP: number,
  atk: number,
  def: number,
  spd: number,
  int?: number
}

export type {
  Stats,
  Enemy,
}