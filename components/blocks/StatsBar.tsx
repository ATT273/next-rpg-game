import React from 'react'

function StatsBar(props: any) {
  const { stats, name } = props
  const maxStat = name === 'hp' ? 'maxHP' : 'maxMP';

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ height: '10px', width: '100px', backgroundColor: 'gray' }}></div>
      <div style={{ height: '10px', width: `${(stats[name] / stats[maxStat]) * 100}px`, position: 'absolute', top: '0px', left: '0px', backgroundColor: name === 'hp' ? 'red' : 'blue' }}></div>
    </div>
  )
}

export default StatsBar
