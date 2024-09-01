'use client';

import React, { useState, useEffect } from 'react'
import { Skills, Stats } from '@/types/player';
import useStore from '@/store/store';
import classes from '@/data/classes';

const initialState: Stats = {
  hp: 100,
  mp: 100,
  maxHP: 100,
  maxMP: 100,
  atk: 0,
  def: 0,
  spd: 0,
  int: 0
}
const BounusStatsPointScreen = ({ selectedClass, handleUpdateStats, handlePrevStep }: { selectedClass: string, handleUpdateStats: (data: any) => void, handlePrevStep: () => void }) => {
  const [statsState, setStatsState] = useState<Stats>(initialState);
  const [classStats, setClassStats] = useState<Stats>(initialState)
  const [points, setPoints] = useState(5);
  const updateStats = useStore(state => state.updateStats);

  useEffect(() => {
    if (selectedClass) {
      setStatsState({ ...initialState, ...classes[selectedClass as keyof typeof classes].stats });
      setClassStats({ ...initialState, ...classes[selectedClass as keyof typeof classes].stats });
    }
    // handleUpdateClassData({ stats: statsState });
  }, [selectedClass]);

  const handleAddPoint = (type: string) => {
    const _stats: Stats = { ...statsState };
    if (type === 'hp') {
      _stats[type] += 1;
      _stats['maxHP'] += 1;
    } else {
      _stats[type as keyof typeof _stats] += 1;
    }
    setStatsState(_stats);
    setPoints(points - 1);
  }

  const handleSubtractPoint = (type: string) => {
    const _stats: Stats = { ...statsState };
    if (type === 'hp') {
      _stats[type] -= 1;
      _stats['maxHP'] -= 1;
    } else {
      _stats[type as keyof typeof _stats] -= 1;
    }
    setStatsState(_stats);
    setPoints(points + 1);
  }

  return (
    <div className='flex flex-col items-center'>
      <h4 className='stats-note text-lg'>You have <span className='text-white'>{points}</span> points to assign to your stats</h4>
      {
        statsState
          ? <div className='p-3 mb-5 flex flex-col gap-3'>
            <div className='flex gap-5 justify-center items-center text-white'>
              <p className='text-xl font-bold min-w-24'>Hp: {statsState.hp}</p>
              <div className='flex gap-3'>
                <button
                  className='rounded-sm bg-red-500 p-1 h-8 w-8'
                  onClick={() => handleAddPoint('hp')}
                  disabled={points === 0}
                >+</button>
                <button
                  className='rounded-sm bg-white text-black p-1 h-8 w-8'
                  style={{ opacity: statsState.hp > classStats.hp ? 1 : 0 }}
                  onClick={() => handleSubtractPoint('hp')}
                  disabled={points === 5 || statsState.hp === classStats.hp}>-</button>
              </div>
            </div>
            <div className='flex gap-5 justify-center items-center text-white'>
              <p className='text-xl font-bold min-w-24'>Atk: {statsState.atk}</p>
              <div className='flex gap-3'>
                <button className='rounded-sm bg-red-500 p-1 h-8 w-8' onClick={() => handleAddPoint('atk')} disabled={points === 0}>+</button>
                <button
                  className='rounded-sm bg-white text-black p-1 h-8 w-8'
                  style={{ opacity: statsState.atk > classStats.atk ? 1 : 0 }}
                  onClick={() => handleSubtractPoint('atk')}
                  disabled={points === 5 || statsState.atk === classStats.atk}
                >-</button>
              </div>
            </div>
            <div className='flex gap-5 justify-center items-center text-white'>
              <p className='text-xl font-bold min-w-24'>Def: {classStats.def}</p>
              <div className='flex gap-3'>
                <button className='rounded-sm bg-red-500 p-1 h-8 w-8' onClick={() => handleAddPoint('def')} disabled={points === 0}>+</button>
                <button
                  className='rounded-sm bg-white text-black p-1 h-8 w-8'
                  style={{ opacity: statsState.def > classStats.def ? 1 : 0 }}
                  onClick={() => handleSubtractPoint('def')}
                  disabled={points === 5 || statsState.def === classStats.def}
                >-</button>
              </div>
            </div>
            <div className='flex gap-5 justify-center items-center text-white'>
              <p className='text-xl font-bold min-w-24'>Int: {classStats.int}</p>
              <div className='flex gap-3'>
                <button className='rounded-sm bg-red-500 p-1 h-8 w-8' onClick={() => handleAddPoint('int')} disabled={points === 0}>+</button>

                <button
                  className='rounded-sm bg-white text-black p-1 h-8 w-8'
                  style={{ opacity: statsState.int > initialState.int ? 1 : 0 }}
                  onClick={() => handleSubtractPoint('int')}
                  disabled={points === 5 || statsState.int === classStats.int}
                >-</button>
              </div>
            </div>
            <div className='flex gap-5 justify-center items-center text-white text-xl font-bold'>
              <p className='text-xl font-bold min-w-24'>Spd: {classStats.spd}</p>
              <div className='flex gap-3'>
                <button className='rounded-sm bg-red-500 p-1 h-8 w-8' onClick={() => handleAddPoint('spd')} disabled={points === 0}>+</button>

                <button
                  className='rounded-sm bg-white text-black p-1 h-8 w-8'
                  style={{ opacity: statsState.spd > classStats.spd ? 1 : 0 }}
                  onClick={() => handleSubtractPoint('spd')}
                  disabled={points === 5 || statsState.spd === classStats.spd}
                >-</button>
              </div>
            </div>
          </div>
          : <div></div>
      }
      <div className='flex gap-3'>
        <button className='btn bg-green' onClick={handlePrevStep} style={{ marginRight: '10px' }}>Back</button>
        <button type='submit' className='btn bg-green' onClick={() => handleUpdateStats(statsState)}>Finish</button>
      </div>
    </div>
  )
}

export default BounusStatsPointScreen