import React from 'react'
import StatsBar from './StatsBar'
import Image from 'next/image'

function FighterStatsBlock(props: any) {
  const { player, com } = props
  return (
    <>
      {
        player.stats !== undefined &&
        <div className="flex justify-center items-center">
          <div className="player grow flex flex-col items-center justify-center">
            <div className='image-container mb-3'>
              <Image className='size-64' src={player.image} alt="player_avatar" />
              {/* {player.buffs.length > 0 ? player.buffs[0].duration : '???'} */}
            </div>
            <div className="flex flex-col justify-start w-[15rem] text-lg text-stone-100">
              <div className="hp-mp">
                <p><b>HP: </b> {player.stats.hp}/{player.stats.maxHP}</p>
                <StatsBar stats={{ hp: player.stats.hp, maxHP: player.stats.maxHP }} name={'hp'} />
                <p><b>MP: </b> {player.stats.mp}/{player.stats.maxMP}</p>
                <StatsBar stats={{ mp: player.stats.mp, maxMP: player.stats.maxMP }} name={'mp'} />
              </div>
              <div className="stats">
                <p><b>ATK: </b> {player.stats.atk}
                  <i className='txt-green'>{player.bonusStats.atk > 0 ? `(+ ${player.bonusStats.atk})` : ''}</i>
                  <i className='txt-purple'>{player.buffStats.atk > 0 ? `(+ ${player.buffStats.atk})` : ''}</i>
                </p>
                <p><b>DEF: </b> {player.stats.def}
                  <i className='txt-green'>{player.bonusStats.def > 0 ? `(+ ${player.bonusStats.def})` : ''}</i>
                  <i className='txt-purple'>{player.buffStats.def > 0 ? `(+ ${player.buffStats.def})` : ''}</i>
                </p>
                <p><b>SPD: </b> {player.stats.spd}
                  <i className='txt-green'>{player.bonusStats.spd > 0 ? `(+ ${player.bonusStats.spd})` : ''}</i>
                  <i className='txt-purple'>{player.buffStats.spd > 0 ? `(+ ${player.buffStats.spd})` : ''}</i>
                </p>
              </div>
            </div>
          </div>
          <div className='text-stone-100 font-bold text-3xl'>VS.</div>
          <div className="com grow flex flex-col items-center justify-center">
            <div className='image-container mb-3'>
              <Image className='size-64' src={com.image} alt="com_avatar" />
            </div>
            <div className="flex flex-col justify-start w-[15rem] text-lg text-stone-100">
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
