'use client'

import React, { useEffect, useState } from 'react'
import { Items } from '@/types/player'
import Game from '../../../game'
import { useRouter } from 'next/navigation'
import useStore from '@/store/store'
import Image from 'next/image'
import { BATTLE_EVENT, LOOT_EVENT, SHOP_EVENT } from '@/data/data'
type StaticImageData = {
  src: string;
  height: number;
  width: number;
  placeholder?: string;
};
const initialItem = {
  id: 0,
  type: '',
  key: '',
  name: '',
  image: undefined || '',
  price: 0,
  qty: 0,
  maxQty: 0,
  stats: { atk: 0 },
  isConsumable: true,
}
const LootScreen = () => {
  const [item, setItem] = useState(initialItem)
  const router = useRouter()
  const createPlayerStore = useStore(state => state.createPlayer);
  const updateCurrentEvent = useStore(state => state.updatePlayer)
  const player = useStore(state => state.player);

  useEffect(() => {
    getLootData()
  }, [])
  const takeItem = (item: Items) => {
    const _takeItems = Game.takeItem(item, player.items);

    if (_takeItems.isMaxQty) {
      alert(_takeItems.message)
    } else {
      const bonusStats = Game.getBonusStats(_takeItems.newInventory);
      // const newInventory = updateInventory([..._takeItems.newInventory]);
      // const newBonusStats = updateBonusStats(bonusStats);
      const _player = {
        ...player,
        items: [..._takeItems.newInventory],
        bonusStats
      }
      createPlayerStore({ ..._player })
      getEvent();
    }
  }

  const leaveItem = () => {
    getEvent()
  }
  const getLootData = () => {
    const lootItem = Game.getLootItem()
    // @ts-expect-error image type
    setItem(lootItem);
  }
  const getEvent = () => {
    const id = Game.getEvent(LOOT_EVENT);

    // let id = 2
    if (id === BATTLE_EVENT) {
      router.push('/battle')
    } else if (id === LOOT_EVENT) {
      router.push('/loot')
    } else if (id === SHOP_EVENT) {
      router.push('/shop')
    }
  }

  const renderStats = () => {
    let stats = []
    for (const stat in item.stats) {
      if (item.stats.hasOwnProperty(stat)) {
        stats.push(
          <p key={stat}>{`${stat}: ${item.stats[stat as keyof typeof item.stats]}`}</p>
        )
      }
    }
    return stats
  }

  return (
    <div className="loot-screen w-full h-full relative">
      <div className='w-[40rem] m-auto absolute flex flex-col gap-2 justify-center items-center p-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 shadow-md'>
        <div className="item-img">
          {item.image && <Image src={item.image} alt="" height={300} width={300} />}
        </div>
        <div className="item-detail">
          <p>{item.name.toUpperCase()}</p>
          <p>{`price: ${item.price}`}</p>
          {renderStats()}
        </div>
        <div className="flex gap-2 justify-center items-center">
          <button className="btn bg-green w-200" onClick={() => takeItem(item)}>Take</button>
          <button className="btn bg-red w-200" onClick={leaveItem}>Leave</button>
        </div>
      </div>

    </div>
  )
}

export default LootScreen