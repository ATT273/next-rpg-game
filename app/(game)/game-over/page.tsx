'use client'
import useGameStore from '@/store/store';
import Link from 'next/link'
import { useEffect } from 'react'

const GameOver = () => {
  const resetPlayer = useGameStore(state => state.resetPlayer);
  useEffect(() => {
    localStorage.removeItem('rpg_game')
    resetPlayer()
  }, [])
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <h1 className='text-3xl font-bold mb-2'>GameOver</h1>
      <Link href='/'>
        <button className='w-[6em] h-[3em] rounded-md bg-slate-900 text-slate-200'>Restart</button>
      </Link>
    </div>
  )
}

export default GameOver