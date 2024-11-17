import React from 'react'

const BattleLog = ({ battleLogs }: { battleLogs: string[] }) => {
  return (
    <div className='w-2/3 h-[17rem] bg-slate-100 rounded-lg p-3 overflow-y-auto mx-auto shadow-md border border-1 border-slate-600'>
      {
        battleLogs.map((log, i) => (
          <p key={i} className='text-slate-900'>{log}</p>
        ))
      }
    </div>
  )
}

export default BattleLog