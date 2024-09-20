'use client'
import { Player } from '@/types/player'
import React, { Component, use, useEffect, useState } from 'react'
import player_img from '@/public/images/player/player.jpg'
import StatsBar from './StatsBar'
import InventoryBlock from './Inventory'
import Game from '../../game';
import * as _ from 'lodash';
import useStore from '@/store/store'
import Image from 'next/image'
const CharacterStats = ({ playerStore }: { playerStore: Player }) => {
  const { updateStats, udpateBonusStats, updatePlayer } = useStore((store: any) => store);
  const [player, setPlayer] = useState(playerStore);
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setPlayer(playerStore)
  }, [playerStore])

  useEffect(() => {
    setIsClient(true)
  }, [])
  const handleUseItem = (itemKey: string, itemIndex: number) => {
    const _player = _.cloneDeep(player);
    const selectedItem = _player.items[itemIndex];
    let message = '';
    Object.keys(selectedItem.stats).forEach(key => {
      if (_player.stats[key as keyof typeof _player.stats] === _player.stats[`max${key.toUpperCase()}` as keyof typeof _player.stats]) message += `Your ${key} is full. You don't need to use this \n`;
    })
    if (message !== '') return alert(message);

    if (selectedItem.qty === 1) {
      _player.items.splice(itemIndex, 1);
    } else if (selectedItem.qty > 1) {
      _player.items[itemIndex].qty -= 1;
    }
    _player.bonusStats = Game.getBonusStats(_player.items);
    const newStats = Game.consumeItem(_player, itemKey);
    _player.stats = { ..._player.stats, ...newStats };
    updatePlayer(_player);
  }

  const handleDropItem = (key: string, itemIndex: number) => {
    const _player = _.cloneDeep(player);
    _player.items.splice(itemIndex, 1);
    _player.bonusStats = Game.getBonusStats(_player.items);
    updatePlayer(_player);
  }
  return (
    <React.Fragment>
      {
        isClient
          ? <>
            <div className="stats">
              <div className="player-avatar">
                <Image className='size-48' src={player_img} alt="player_avatar" />
              </div>
              <div className="player-stats">
                <div className="item player-name">
                  <p><b>{player.name}</b></p>
                </div>
                <div className="item">
                  <p><b>HP: </b> {player.stats.hp}/{player.stats.maxHP}<i className='txt-green'>{player.bonusStats.hp && player.bonusStats.hp > 0 ? `(+ ${player.bonusStats.hp})` : ''}</i></p>
                  <StatsBar stats={{ hp: player.stats.hp, maxHP: player.stats.maxHP }} name={'hp'} />
                </div>
                <div className="item">
                  <p><b>MP: </b> {player.stats.mp}/{player.stats.maxMP} <i className='txt-green'>{player.bonusStats.mp && player.bonusStats.mp > 0 ? `(+ ${player.bonusStats.mp})` : ''}</i></p>
                  <StatsBar stats={{ mp: player.stats.mp, maxMP: player.stats.maxMP }} name={'mp'} />
                </div>
                <div className="item level">
                  <p><b>Lvl {player.level}: </b> {player.exp}/{player.levelExp}</p>
                </div>
                <div className="item">
                  <p>
                    <b>ATK: </b> {player.stats.atk}
                    <i className='txt-green'>{player.bonusStats.atk > 0 ? `(+ ${player.bonusStats.atk})` : ''}</i>
                    <i className='txt-purple'>{player.buffs.atk > 0 ? `(+ ${player.buffs.atk})` : ''}</i>
                  </p>
                </div>
                <div className="item">
                  <p><b>DEF: </b> {player.stats.def}
                    <i className='txt-green'>{player.bonusStats.def > 0 ? `(+ ${player.bonusStats.def})` : ''}</i>
                    <i className='txt-purple'>{player.buffs.def > 0 ? `(+ ${player.buffs.def})` : ''}</i>
                  </p>
                </div>
                <div className="item">
                  <p><b>SPD: </b> {player.stats.spd}
                    <i className='txt-green'>{player.bonusStats.spd > 0 ? `(+ ${player.bonusStats.spd})` : ''}</i>
                    <i className='txt-purple'>{player.buffs.spd > 0 ? `(+ ${player.buffs.spd})` : ''}</i>
                  </p>
                </div>
              </div>
            </div>
            <div className='player-inventory flex flex-wrap w-[310px] gap-1'>
              {[0, 1, 2, 3, 4, 5].map(x => {
                return <InventoryBlock key={x} itemIndex={x} item={player.items[x]} onItemUsed={handleUseItem} onItemDropped={handleDropItem} />
              })}
            </div>
          </>
          : <>Loading...</>
      }
    </React.Fragment>
  )
}

export default CharacterStats