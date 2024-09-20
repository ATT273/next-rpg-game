import React from 'react'

const BattleLog = ({ battleLogs }: { battleLogs: string[] }) => {
  return (
    <div className='w-2/3 h-[30rem] bg-slate-100 rounded-lg p-3 overflow-y-auto mx-auto'>
      {
        battleLogs.map((log, i) => (
          <p key={i} className='text-slate-900'>{log}</p>
        ))
      }
    </div>
  )
}

export default BattleLog