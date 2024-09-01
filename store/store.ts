import { create } from 'zustand'
import { BonusStats, Stats, Player } from '@/types/player'
import player_img from '@/public/images/player/player.jpg'
interface Store {
    player: Player;
    createPlayer: (payload: Player) => void;
    updateStats: (payload: Stats) => void;
    updateBonusStats: (payload: BonusStats) => void;
    // createCharacter: (payload: Player) => void;
    // updateStats: (payload: Stats) => void;
    // updateBonusStats: (payload: BonusStats) => void;
    // updateInventory: (payload: any) => void;
    // updatePlayer: (payload: any) => void;
}
const useStore = create<Store>((set) => ({
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

    createPlayer: (payload: Player) => {
        set((state) => ({ ...state, player: payload }))
    },
    updateStats: (payload: Stats) => set((state) => ({ player: { ...state.player, stats: payload } })),
    updateBonusStats: (payload: BonusStats) => set((state) => ({ player: { ...state.player, bonusStats: payload } }))
    // createCharacter: (state) => set(state => ({
    //     state.player = action.payload;
    // })) ,
    // updateStats: (state, action) => {
    //     const newStats = action.payload;
    //     state.player = { ...state.player, stats: { ...newStats } };
    // },
    // updateBonusStats: (state, action) => {
    //     const newBonusStats = action.payload;
    //     state.player = { ...state.player, bonusStats: { ...newBonusStats } };
    // },
    // updateInventory: (state, action) => {
    //     const newItems = action.payload;

    //     state.player = { ...state.player, items: [...newItems] };
    // },
    // updatePlayer: (state, action) => {
    //     state.player = { ...state.player, ...action.payload };
    // }
}))

export default useStore