import React from 'react'

function StatsBar(props: any) {
  const { stats, name } = props
  const maxStat = name === 'hp' ? 'maxHP' : 'maxMP';

  return (
    <div style={{ position: 'relative' }}>
      <div className='w-[150px] h-[15px] bg-stone-300 rounded-full'></div>
      <div style={{ height: '15px', width: `${(stats[name] / stats[maxStat]) * 150}px`, position: 'absolute', top: '0px', left: '0px' }} className='rounded-full bg-stone-700'></div>
    </div>
  )
}

export default StatsBar
