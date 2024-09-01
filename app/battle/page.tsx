'use client';

import React, { useEffect } from 'react'
import useStore from '@/store/store';

const Battle = () => {
  const player = useStore(state => state.player);

  useEffect(() => {
    if (player) {
      console.log('player', player)
    }
  }, [player])

  return (
    <div>Battle</div>
  )
}

export default Battle