import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware';
import { BonusStats, Stats, Player, Items } from '@/types/player'
import player_img from '@/public/images/player/player.png'
interface Store {
    player: Player;
    currentEvent: number;
    createPlayer: (payload: Player) => void;
    updateStats: (payload: Stats) => void;
    updatItems: (payload: Items[]) => void;
    updateBonusStats: (payload: BonusStats) => void;
    updatePlayer: (payload: any) => void;
    resetPlayer: () => void;
    setScore: (payload: number) => void
    setCurrentEvent: (payload: number) => void;
    // updateInventory: (payload: any) => void;
}

const initialPlayer = {
    type: 'player',
    name: '',
    image: player_img,
    plClass: '',
    level: 1,
    exp: 0,
    levelExp: 100,
    stats: {
        hp: 100,
        mp: 100,
        maxHP: 100,
        maxMP: 100,
        int: 0,
        atk: 0,
        def: 0,
        spd: 0
    },
    skills: [],
    bonusStats: {
        maxHP: 0,
        maxMP: 0,
        atk: 0,
        def: 0,
        spd: 0
    },
    buffStats: [],
    buffs: [],
    items: []
}

const useStore = create<Store>()(
    persist(
        (set) => ({
            player: {
                type: 'player',
                name: '',
                image: player_img,
                plClass: '',
                level: 1,
                exp: 0,
                levelExp: 100,
                stats: {
                    hp: 100,
                    mp: 100,
                    maxHP: 100,
                    maxMP: 100,
                    int: 0,
                    atk: 0,
                    def: 0,
                    spd: 0
                },
                skills: [],
                bonusStats: {
                    maxHP: 0,
                    maxMP: 0,
                    atk: 0,
                    def: 0,
                    spd: 0
                },
                buffStats: {
                    atk: 0,
                    def: 0,
                    spd: 0
                },
                buffs: [],
                items: []
            },
            continueGame: false,
            // lootItems: [],
            currentEvent: 0,
            score: 0,
            createPlayer: (payload: Player) => {
                set((state: any) => ({ ...state, player: payload }))
            },
            resetPlayer: () => set((state: any) => ({ ...state, player: initialPlayer })),
            updateStats: (payload: Stats) => set((state: any) => ({ player: { ...state.player, stats: payload } })),
            updateItems: (payload: Stats) => set((state: any) => ({ player: { ...state.player, items: payload } })),
            updateBonusStats: (payload: BonusStats) => set((state: any) => ({ player: { ...state.player, bonusStats: payload } })),
            setCurrentEvent: (payload: number) => set((state: any) => ({ ...state, currentEvent: payload })),
            setScore: (payload: number) => set((state: any) => ({ ...state, score: state.score + payload }))
        }),
        {
            name: 'rpg_game',
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export default useStore