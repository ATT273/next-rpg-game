'use client'
import React, { useState, useEffect, useRef, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Game from '../../../game'
import { useRouter } from 'next/navigation'
import useStore from '@/store/store';
import { Enemy } from '@/types/enemy';
import { Player, Skills } from '@/types/player';
import PopUp from '@/components/shared/popup'
import FighterStatsBlock from '@/components/blocks/Fighters'
import Spinner from '@/components/svg/spinner'
import { initialEnemies } from '@/data/enemies'
import { BATTLE_EVENT, LOOT_EVENT, SHOP_EVENT } from '@/data/data'
import dynamic from 'next/dynamic'

const PlayerActionsBlock = dynamic(() => import('@/components/blocks/PlayerActions'), { ssr: false })
const BattleLog = dynamic(() => import('@/components/blocks/BattleLog'), { ssr: false })

const initiateBuffs: { [key: string]: number } = {}
const BattleScreen = () => {
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState({
    display: 'block',
    intrOpacity: 1,
    mainOpacity: 0,
    comKey: '',
    battleLogs: ['Start!!!'],
    displayCombatLog: {
      display: 'none'
    },
    showReadyPopup: true,
    showBattleScreen: false,
    showNextBtn: false,
    initState: {},
    turnCt: 0,
    currentTurn: '',
  })
  const playerStore = useStore((state: any) => state.player);
  const createPlayerStore = useStore(state => state.createPlayer);
  const setCurrentEvent = useStore(state => state.setCurrentEvent);
  const setScore = useStore(state => state.setScore);
  const [player, setPlayer] = useState<Player>(playerStore);
  const [enemy, setEnemy] = useState<Enemy>(initialEnemies);
  const [currentTurn, setCurrentTurn] = useState<{ player: number, enemy: number }>({ player: 0, enemy: 0 })
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>();
  const router = useRouter();

  // useEffect(() => {
  //   if (playerStore) {
  //     if (playerStore.stats.hp <= 0) {
  //       router.push('/game-over')
  //     }
  //     setPlayer(playerStore)
  //   }
  // }, [playerStore]);
  useEffect(() => {
    const localsave = localStorage.getItem('rpg_game');
    if (!localsave) {
      router.push('/create-character')
    } else {
      const saveGame = JSON.parse(localsave);
      if (!saveGame.continueGame) {
        console.log('no save game')
    // router.push('/create-character')
      }
    }
    if (playerStore.name) {
      setCurrentEvent(BATTLE_EVENT)
      getBattleData()
    }
  }, []);

  // useEffect(() => {
  //   if (audioPlayer.current) {
  //     audioPlayer.current.volume = 0.5;
  //   }
  // }, [audioPlayer]);


  useEffect(() => {
    if (player.name && enemy.key) {
      if (currentTurn.player === 0) chooseFirstAttacker()
      checkWinCondition(player, enemy)
    }
  }, [enemy, player]);

  useEffect(() => {
    if (isPlayerTurn === undefined) return
    if (isPlayerTurn) {
      setCurrentTurn(prev => ({ ...prev, player: prev.player + 1 }))
    } else {
      setCurrentTurn(prev => ({ ...prev, enemy: prev.enemy + 1 }))
    }
    if (!isPlayerTurn && enemy && enemy.stats.hp > 0) {
      handleAtkButtonClick('com', 'player')
    }
  }, [isPlayerTurn])

  const chooseFirstAttacker = () => {

    if (player.name && enemy.key) {
      const playerSpd = player.stats.spd
      const enemySPd = enemy.stats.spd
      setIsPlayerTurn(playerSpd >= enemySPd)
    } else {
      console.log('data not found')
    }
  }

  const handleReady = () => {
    setState(prev => ({
      ...prev,
      intrOpacity: 0,
      mainOpacity: 1,
      display: 'none',
      showReadyPopup: false,
      showBattleScreen: true,
    }))
  }

  const getEvent = () => {
    // let id = 0;
    let id = Game.getEvent(BATTLE_EVENT);
    // let id  = 1
    if (id === BATTLE_EVENT) {
      router.push('/battle')
    } else if (id === LOOT_EVENT) {
      router.push('/loot')
    } else if (id === SHOP_EVENT) {
      router.push('/shop')
    }
  }

  const getBattleData = () => {
    setPlayer(playerStore)
    const getEnemy = Object.assign({}, Game.getEnemy(enemy.key, player.level))
    if (getEnemy) {
      setEnemy(getEnemy)
    }
  }

  const handleEndturn = (atkerType: string) => {
    if (atkerType === 'player') {
      const _calculateInfo = Game.calculateBuffDuration(player)
      if (_calculateInfo._combatLog !== '') {
        setState(prev => ({
          ...prev,
          battleLogs: [...state.battleLogs, _calculateInfo._combatLog],
        }))
      }
      setPlayer({ ...player, buffStats: _calculateInfo._buffStats })
    }

    setIsPlayerTurn(!isPlayerTurn);
  }

  const renderFighters = () => {
    return (
      <FighterStatsBlock player={player} com={enemy} currentTurn={currentTurn} />
    )
  }

  const checkWinCondition = (player: Player, enemy: Enemy) => {
    let winStatus = Game.winCondition(player, enemy)
    if (winStatus.status === 0) {
      setState(prev => ({
        ...prev,
        battleLogs: [...state.battleLogs, winStatus.message],
        showNextBtn: true,
      }))
    }
  }

  // // NORMAL ATK
  const handleAtkButtonClick = async (attackerName: string, targetName: string) => {
    let attacker = attackerName === 'player' ? player : enemy
    let target = targetName === 'player' ? player : enemy
    // let winStatus = {}
    const afterAtk = Game.normalAttack(attacker, target)
    if (attackerName === 'player') {
      setPlayer(afterAtk.attacker as Player);
      setEnemy(afterAtk.target as Enemy);
    } else {
      setPlayer(afterAtk.target as Player);
      setEnemy(afterAtk.attacker as Enemy);
    }

    setState(prev => ({
      ...prev,
      battleLogs: [...state.battleLogs, afterAtk.combatLog]
    }))

    if (!isPlayerTurn) {
      setTimeout(() => {
        handleEndturn(afterAtk.type);
      }, 500)
    } else {
      handleEndturn(afterAtk.type);
    }
  }
  // // USE SKILL
  const handleSkillBtnClick = (key: string) => {
    const skillUsed = player.skills.find((skill: Skills) => skill.key === key);
    if (!skillUsed) return
    const afterAtk = Game.skillUsing(player, enemy, skillUsed);
    setPlayer(afterAtk.attacker);
    setEnemy(afterAtk.target);

    setState(prev => ({
      ...prev,
      battleLogs: [...state.battleLogs, afterAtk.combatLog]
    }))

    if (!isPlayerTurn) {
      setTimeout(() => {
        handleEndturn(afterAtk.type);
      }, 500)
    } else {
      handleEndturn(afterAtk.type);
    }
  }
  const handleEndMatch = () => {
    const _player = { ...player };
    _player.buffStats = [];
    const playerExp = player.exp + enemy.xp;
    _player.exp = playerExp;
    if (playerExp >= player.levelExp) {
      const nextLvl = Game.calculateLvlFromExp(playerExp);
      const newLevelExp = Game.calculateCurrentLvlExp(Math.floor(nextLvl) + 1);
      _player.level = Math.floor(nextLvl) + 1;
      _player.exp = playerExp - player.levelExp;
      _player.levelExp = newLevelExp;
    }
    if (_player.stats.hp > 0) {
      setScore(enemy.score);
    }
    createPlayerStore(_player);
    setState(prevState => ({ ...prevState, showNextBtn: false }));
    getEvent();
  }
  console.log('===========');
  return (
    <div className='w-full h-full text-slate-900'>
      {/* <audio id='audioPlayer' ref={audioPlayer} src="/music/dungeon_theme_ost.mp3" autoPlay loop /> */}
      {
        (player && enemy) &&
        <div className="fight-screen w-full h-full">
          <AnimatePresence>
            {
              state.showReadyPopup && enemy.key &&
              <motion.div
                className="container"
                key={'container'}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}>
                <PopUp
                  title={'Ready for the battle'}
                  content={`${player.name} vs ${enemy.name}`}
                  display={state.display}
                  size={'big'}
                  renderButtons={true}
                  renderInfo={true}
                  handleReady={handleReady} />
              </motion.div>
            }
          </AnimatePresence>
          <AnimatePresence>
            {
              state.showBattleScreen &&
                <motion.div
                  className="w-[calc(100vw-800px)] h-full m-auto p-6"
                  key={'main-content'}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}>
                    {
                      player !== null && renderFighters()
                    }
                    {
                      isPlayerTurn
                        ? <PlayerActionsBlock
                          handleAtkButtonClick={handleAtkButtonClick}
                          handleSkillBtnClick={handleSkillBtnClick}
                          player={player}
                        />
                        : <Spinner size="4rem" color="#e2e2e2" />
                    }
                    <BattleLog battleLogs={state.battleLogs} />
                    {state.showNextBtn &&
                      <div className='w-full text-center p-2'>
                        <button className="btn bg-green w-200" style={{ margin: 'auto' }} onClick={handleEndMatch}>Next</button>
                      </div>}
              </motion.div>
            }
          </AnimatePresence>
        </div>
      }
    </div>
  )
}

export default BattleScreen