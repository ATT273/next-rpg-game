'use client'
import React, { useState, useEffect, useRef, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Game from '../../game'
import { useRouter } from 'next/navigation'
import useStore from '@/store/store';
// import * as _ from 'lodash'
import { Enemy } from '@/types/enemy';
import { Player, Skills } from '@/types/player';
import PopUp from '@/components/shared/popup'
import PlayerActionsBlock from '@/components/blocks/PlayerActions'
import BattleLog from '@/components/blocks/BattleLog'
import FighterStatsBlock from '@/components/blocks/Fighters'
import Spinner from '@/components/svg/spinner'
import { initialEnemies } from '@/data/enemies'

const initiateBuffs: any[] = []
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
    showComTurn: false,
    turnCt: 0,
    currentTurn: '',
  })
  const playerStore = useStore((state: any) => state.player);
  const createPlayerStore = useStore(state => state.createPlayer);
  const [player, setPlayer] = useState(playerStore);
  const [enemy, setEnemy] = useState<Enemy>(initialEnemies);
  const [score, setScore] = useState(0);
  const router = useRouter();
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>();
  const [showPlayerActionBlock, setShowPlayerActionBlock] = useState(true);

  const [currentEvent, setCurrentEvent] = useState(0);
  const [currentEnemy, setCurrentEnemy] = useState('');
  const [loot, setLoot] = useState({});

  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [showCreateCharacterScreen, setShowCreateCharacterScreen] = useState(false);
  const [showFightScreen, setShowFightScreen] = useState(false);
  const [showLootScreen, setShowLootScreen] = useState(false);
  const [showIngameMenu, setShowIngameMenu] = useState(false);
  const [showEndGameScreen, setShowEndGameScreen] = useState(false);
  const [showHighScoresScreen, setShowHighScoresScreen] = useState(false);
  const [isStartGame, setIsStartGame] = useState(false);
  const [isContinueGame, setIsContinueGame] = useState(false);
  const [saveGame, setSaveGame] = useState(null);

  useEffect(() => {
    if (playerStore) {
      setPlayer(playerStore)
    }
  }, [playerStore]);
  useEffect(() => {
    getBattleData()
  }, []);
  // useEffect(() => {
  //   if (audioPlayer.current) {
  //     audioPlayer.current.volume = 0.5;
  //   }
  // }, [audioPlayer]);


  useEffect(() => {
    if (player && enemy) {
      if (enemy.hasOwnProperty('type') && player.hasOwnProperty('type')) {

        checkWinCondition(player, enemy)
      }
    }
  }, [enemy, player]);

  useEffect(() => {
    if (isPlayerTurn) {
      setShowPlayerActionBlock(true);

    } else {
      setShowPlayerActionBlock(false)
    }
    if (isPlayerTurn !== undefined && enemy) {
      checkWinCondition(player, enemy)
    }
    if (isPlayerTurn !== undefined && !isPlayerTurn && enemy && enemy.stats.hp > 0) {
      handleAtkButtonClick('com', 'player')
    }
  }, [isPlayerTurn])

  const handleReady = () => {

    setState(prev => ({
      ...prev,
      intrOpacity: 0,
      mainOpacity: 1,
      display: 'none',
      showReadyPopup: false,
      showBattleScreen: true,
    }))
    setShowPlayerActionBlock(true);
    setShowPlayerActionBlock(true);
  }

  const getEvent = () => {
    // let id = 0;
    let id = Game.getEvent(currentEvent);
    setCurrentEvent(id);

    // let id  = 1
    if (id === 0) {
      getBattleData()
    } else if (id === 1) {
      getLootData()
    } else if (id === 2) {
      // getShopData()
    }
  }

  const getBattleData = () => {
    const getEnemy = Object.assign({}, Game.getEnemy(currentEnemy, player.level))
    if (getEnemy) {
      setCurrentEnemy(getEnemy.key);
      setEnemy(getEnemy)
      setShowPlayerActionBlock(true)
    }

    onShowFightScreen()
  }
  const onShowFightScreen = () => {
    setShowWelcomeScreen(false);
    setShowFightScreen(true);
    setShowLootScreen(false);
  }

  const getLootData = () => {
    const lootItem = Game.getLootItem()
    setLoot(lootItem);
    // onShowLootScreen()
    router.push('/loot')
  }

  const updateScore = (_score: number) => {
    const newScore = score + _score;
    setScore(newScore);
  }

  const handleEndturn = (atkerType: string) => {

    if (atkerType === 'player') {
      const _calculateInfo = Game.calculateBuffDuration(player)
      if (_calculateInfo._combatLog !== '') {
        setState(prev => ({
          ...prev,
          battleLogs: [...state.battleLogs, _calculateInfo._combatLog],
        }))
        setPlayer({ ...player, buffs: _calculateInfo._buffs, buffStats: _calculateInfo._buffStats })
      }
    }

    setIsPlayerTurn(!isPlayerTurn);
  }

  const renderFighters = () => {
    return (
      <>
        <FighterStatsBlock player={player} com={enemy} />
      </>
    )
  }

  const showComTurn = () => {
    const displayCombatLog = {
      display: 'flex',
      opacity: '0.1'
    }
    setState(prev => ({
      ...prev,
      displayCombatLog,
      showComTurn: true
    }))
  }

  const hideComTurn = () => {
    const displayCombatLog = {
      display: 'none'
    }
    setState(prev => ({
      ...prev,
      displayCombatLog,
      showComTurn: false
    }))
  }

  const checkWinCondition = (player: Player, enemy: Enemy) => {
    let winStatus = Game.winCondition(player, enemy)

    // if (winStatus.status === 1 && attacker === 'player') {
    //     // showComTurn()
    //     // setTimeout(() => {
    //     //     hideComTurn()
    //     //     handleAtkButtonClick('com', 'player')
    //     // }, 1000)
    // }
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
      setPlayer(afterAtk.attacker);
      setEnemy(afterAtk.target as Enemy);
    } else {
      setPlayer(afterAtk.target);
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
  const handleNextBtnClick = () => {
    const _player = { ...player };
    const playerExp = player.exp + enemy.xp;
    _player.exp = playerExp;
    _player.buffs = { ...initiateBuffs };
    if (playerExp >= player.levelExp) {
      const nextLvl = Game.calculateLvlFromExp(playerExp);
      const newLevelExp = Game.calculateCurrentLvlExp(Math.floor(nextLvl) + 1);
      _player.level = Math.floor(nextLvl) + 1;
      _player.exp = playerExp - player.levelExp;
      _player.levelExp = newLevelExp;
    }
    if (_player.stats.hp > 0) {
      updateScore(enemy.score);
    }
    const newPlayerData = createPlayerStore(_player);
    setPlayer(newPlayerData);
    setState(prevState => ({ ...prevState, showNextBtn: false }));
    getEvent();
  }

  return (
    <div className='battle-screen w-full h-full'>
      <audio id='audioPlayer' ref={audioPlayer} src="/music/dungeon_theme_ost.mp3" autoPlay loop />
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
              <motion.div className="w-[calc(100vw-800px)] h-full m-auto p-6"
                key={'main-content'}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                {player !== null && renderFighters()}
                {showPlayerActionBlock.toString()}
                {showPlayerActionBlock
                  ? <PlayerActionsBlock
                    handleAtkButtonClick={handleAtkButtonClick}
                    handleSkillBtnClick={handleSkillBtnClick}
                    showComTurn={state.showComTurn}
                    player={player}
                  />
                  : <Spinner size="4rem" color="#ffffff" />}
                <BattleLog battleLogs={state.battleLogs} />
                {
                  state.showNextBtn &&
                  <button className="btn bg-green w-200" style={{ margin: 'auto' }} onClick={handleNextBtnClick}>Next</button>
                }
              </motion.div>
            }
          </AnimatePresence>
        </div>
      }
    </div>
  )
}

export default BattleScreen

// </div>