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
    buffStats: BuffStats,
    buffs: [],
    items: [],
    skills: Skills[]
}
type BuffStats = {
    atk: number,
    def: number,
    spd: number
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
    spd: number
}

type Skills = {
    key: string,
    name: string,
    target: string,
    cost: number,
    effects: { stats: string, value: number }[],
    duration: number | boolean
}
export type {
    Stats,
    BuffStats,
    Player,
    BonusStats,
    Skills
}