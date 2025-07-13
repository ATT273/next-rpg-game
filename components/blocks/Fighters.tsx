import React from 'react'
import StatsBar from './StatsBar'
import Image from 'next/image'
import { Player } from '@/types/player'
import { Enemy } from '@/types/enemy'

const getStat = (statName: string, buffStats: { name: string, value: number, duration: number }[]) => {
  const buff = buffStats.find(buff => buff.name === statName)
  return {
    value: buff ? buff.value : 0,
    duration: buff ? buff.duration : 0
  }
}
function FighterStatsBlock({ player, com, currentTurn }: { player: Player, com: Enemy, currentTurn: { player: number, enemy: number } }) {

  return (
    <>
      {
        player.stats !== undefined &&
        <div className="flex justify-center items-stretch">
          <div className="player grow flex flex-col items-center justify-center">
            <div className='image-container mb-3'>
              <Image className='size-64' src={player.image} alt="player_avatar" />
              {/* {player.buffs.length > 0 ? player.buffs[0].duration : '???'} */}
            </div>
              <div className="flex flex-col justify-start w-[15rem] text-lg">
              <div className="hp-mp">
                <p><b>HP: </b> {player.stats.hp}/{player.stats.maxHP}</p>
                <StatsBar stats={{ hp: player.stats.hp, maxHP: player.stats.maxHP }} name={'hp'} />
                <p><b>MP: </b> {player.stats.mp}/{player.stats.maxMP}</p>
                <StatsBar stats={{ mp: player.stats.mp, maxMP: player.stats.maxMP }} name={'mp'} />
              </div>
              <div className="stats">
                <p><b>ATK: </b> {player.stats.atk}
                  <i className='txt-green'>{player.bonusStats.atk > 0 ? `(+ ${player.bonusStats.atk})` : ''}</i>
                    <i className='txt-purple'>(+ {getStat('atk', player.buffStats).value})</i>
                </p>
                <p><b>DEF: </b> {player.stats.def}
                  <i className='txt-green'>{player.bonusStats.def > 0 ? `(+ ${player.bonusStats.def})` : ''}</i>
                    <i className='txt-purple'>(+ {getStat('def', player.buffStats).value})</i>
                </p>
                <p><b>SPD: </b> {player.stats.spd}
                  <i className='txt-green'>{player.bonusStats.spd > 0 ? `(+ ${player.bonusStats.spd})` : ''}</i>
                    <i className='txt-purple'>(+{getStat('spd', player.buffStats).value})</i>
                </p>
              </div>
            </div>
          </div>
            <div className='flex flex-col items-center justify-between gap-2 h-[200px]'>
              <div className='font-bold text-3xl'>Turn: {currentTurn.player}</div>
              <div className='font-bold text-3xl'>VS.</div>
            </div>
          <div className="com grow flex flex-col items-center justify-center">
            <div className='image-container mb-3'>
              <Image className='size-64' src={com.image} alt="com_avatar" />
            </div>
              <div className="flex flex-col justify-start w-[15rem] text-lg">
              <div className="hp-mp">
                <p><b>HP: </b> {com.stats.hp}/{com.stats.maxHP}</p>
                <StatsBar stats={{ hp: com.stats.hp, maxHP: com.stats.maxHP }} name={'hp'} />
                <p><b>MP: </b> {com.stats.mp}/{com.stats.maxMP}</p>
                <StatsBar stats={{ mp: com.stats.mp, maxMP: com.stats.maxMP }} name={'mp'} />
              </div>
              <div className="stats">
                <p><b>ATK: </b> {com.stats.atk}</p>
                <p><b>DEF: </b> {com.stats.def}</p>
                <p><b>SPD: </b> {com.stats.spd}</p>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default FighterStatsBlock
