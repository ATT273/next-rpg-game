'use client'

import React, { useEffect, useState } from 'react'
import useStore from '@/store/store';
import CharacterStats from '../blocks/CharacterStats';
const LeftSideBar = () => {
  const playerStore = useStore((state: any) => state.player);
  const [player, setPlayer] = useState(playerStore);

  useEffect(() => {
    setPlayer(playerStore)
  }, [playerStore])
  return (
    <div className='absolute top-0 left-0 md:w-[25rem] h-full bg-stone-300 p-3'>
      <CharacterStats playerStore={player} />
    </div>
  )
}

export default LeftSideBar