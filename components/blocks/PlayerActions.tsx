import { Player } from '@/types/player'
import React from 'react'
import Spinner from '../svg/spinner'

function PlayerActionsBlock({
  showComTurn, handleAtkButtonClick, handleSkillBtnClick, player
}: {
  showComTurn: boolean,
  handleAtkButtonClick: Function,
  handleSkillBtnClick: Function,
  player: Player
}) {
  return (
    <div className="player-actions mb-5 h-14 flex justify-center gap-3">
      <div className="button-group flex justify-center gap-3">
        <button disabled={showComTurn} className="bg-emerald-300 w-[12rem]" onClick={() => handleAtkButtonClick('player', 'com')} >Attack</button>
        <button disabled={showComTurn || player.stats.mp < player.skills[0].cost} className="bg-emerald-300 w-[12rem]" onClick={() => handleSkillBtnClick(player.skills[0].key)}>{player.skills[0].name}</button>
        {/* <button disabled={showComTurn} className="btn bg-green w-200">Skill 2</button>
                <button disabled={showComTurn} className="btn bg-green w-200">Skill 3</button> */}

      </div>
    </div>
  )
}

export default PlayerActionsBlock