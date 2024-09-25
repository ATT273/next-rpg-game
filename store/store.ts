import { create } from 'zustand'
import { persist } from 'zustand/middleware';
import { BonusStats, Stats, Player, Items } from '@/types/player'
import player_img from '@/public/images/player/player.jpg'
interface Store {
    player: Player;
    createPlayer: (payload: Player) => void;
    updateStats: (payload: Stats) => void;
    updatItems: (payload: Items[]) => void;
    updateBonusStats: (payload: BonusStats) => void;
    updatePlayer: (payload: any) => void;
    // createCharacter: (payload: Player) => void;
    // updateStats: (payload: Stats) => void;
    // updateBonusStats: (payload: BonusStats) => void;
    // updateInventory: (payload: any) => void;
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
                levelExp: 0,
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
            // lootItems: [],
            currentEvent: 0,
            createPlayer: (payload: Player) => {
                set((state: any) => ({ ...state, player: payload }))
            },
            updateStats: (payload: Stats) => set((state: any) => ({ player: { ...state.player, stats: payload } })),
            updateItems: (payload: Stats) => set((state: any) => ({ player: { ...state.player, items: payload } })),
            updateBonusStats: (payload: BonusStats) => set((state: any) => ({ player: { ...state.player, bonusStats: payload } })),
            setCurrentEvent: (payload: number) => set((state: any) => ({ ...state, currentEvent: payload }))
        }),
        {
            name: 'rpg_game',
            getStorage: () => localStorage
        }
    )
)

export default useStore