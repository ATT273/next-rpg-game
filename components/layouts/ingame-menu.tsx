'use client'
import useStore from '@/store/store';
import React from 'react'

const IngameMenu = () => {
  const playerStore = useStore((state: any) => state.player);
  const currentEvent = useStore((state: any) => state.currentEvent);
  const handleSaveGame = () => {
    const _saveGame = {
      player: playerStore,
      currentEvent
    };

    localStorage.setItem('rpg_game', JSON.stringify(_saveGame));
    alert('Save game complete');
  }

  return (
    <div className='w-full'>
      <div className='flex flex-col justify-center items-center gap-1'>
        <div className='p-3 w-full bg-stone-700 text-stone-100 text-center cursor-pointer'>Resume</div>
        <div className='p-3 w-full bg-stone-700 text-stone-100 text-center cursor-pointer' onClick={handleSaveGame}>Save Game</div>
        <div className='p-3 w-full bg-stone-700 text-stone-100 text-center cursor-pointer'>Exit</div>
      </div>
    </div>
  )
}

export default IngameMenu