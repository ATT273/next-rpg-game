import { Player } from '@/types/player'
import React from 'react'
import Spinner from '../svg/spinner'

function PlayerActionsBlock({
  handleAtkButtonClick, handleSkillBtnClick, player
}: {
  handleAtkButtonClick: Function,
  handleSkillBtnClick: Function,
  player: Player
}) {
  return (
    <div className="player-actions mb-5 h-14 flex justify-center gap-3">
      <div className="button-group flex justify-center gap-3">
        <button
          className="bg-emerald-300 w-48"
          onClick={() => handleAtkButtonClick("player", "com")}
        >
          Attack
        </button>
        <button
          disabled={player.stats.mp < player.skills[0].cost}
          className="bg-emerald-300 w-48"
          onClick={() => handleSkillBtnClick(player.skills[0].key)}
        >
          {player.skills[0].name}
        </button>
      </div>
    </div>
  );
}

export default PlayerActionsBlock