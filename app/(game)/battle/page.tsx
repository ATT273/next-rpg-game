"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";
import { Enemy } from "@/types/enemy";
import { ActionType, BuffCounter, Player } from "@/types/player";
import PopUp from "@/components/shared/popup";
import FighterStatsBlock from "@/components/blocks/Fighters";
import { initialEnemies } from "@/data/enemies";
import { ACTION_DELAY, ROUND_DELAY, SKILL_TARGET, WIN_CONDITION_STATUS } from "@/data/data";
import useGame from "@/hooks/use-game";
import { delay } from "@/utils";
import BattleProvider from "./_components/battle-provider";
import { Bug } from "lucide-react";

const BattleScreen = () => {
  const audioPlayer = useRef<HTMLAudioElement>(null);

  const {
    getEnemy,
    calculateBuff,
    winCondition,
    normalAttack,
    skillUsing,
    calculateCurrentLvlExp,
    calculateLvlFromExp,
  } = useGame();
  const { player: playerStore, selectedEnemy, updatePlayer, setScore } = useStore();
  const [player, setPlayer] = useState<Player>(playerStore);
  const [enemy, setEnemy] = useState<Enemy>(initialEnemies);
  const [state, setState] = useState({
    display: "block",
    intrOpacity: 1,
    mainOpacity: 0,
    comKey: "",
    battleLogs: ["Start!!!"],
    displayCombatLog: {
      display: "none",
    },
    showReadyPopup: true,
    showBattleScreen: false,
    showNextBtn: false,
    initState: {},
    turnCt: 0,
    currentTurn: "",
  });

  const [currentTurn, setCurrentTurn] = useState<{
    player: number;
    enemy: number;
  }>({ player: 0, enemy: 0 });
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>();
  const [buffCounter, setBuffCounter] = useState<BuffCounter>({});
  const [actions, setActions] = useState<(ActionType | null)[]>([]);
  const actionIndex = useMemo(() => {
    return !state.showNextBtn ? actions.length - 1 : -1;
  }, [actions, state.showNextBtn]);
  const router = useRouter();

  useEffect(() => {
    if (playerStore.name) {
      setPlayer(playerStore);
    }
  }, [playerStore]);

  useEffect(() => {
    if (selectedEnemy) {
      const _enemy = Object.assign({}, getEnemy(selectedEnemy));
      if (_enemy) {
        setEnemy(_enemy);
      }
    }
  }, [selectedEnemy]);
  // useEffect(() => {
  //   if (audioPlayer.current) {
  //     audioPlayer.current.volume = 0.5;
  //   }
  // }, [audioPlayer]);

  useEffect(() => {
    if (player.name && enemy.key && state.showBattleScreen) {
      if (currentTurn.player === 0) {
        // Choose first attacker
        async () => {
          await delay(500);
        };
        setIsPlayerTurn(player.stats.spd >= enemy.stats.spd);
      }
    }
  }, [enemy, player, state]);

  useEffect(() => {
    if (isPlayerTurn === undefined) return;
    if (isPlayerTurn) {
      setCurrentTurn((prev) => ({ ...prev, player: prev.player + 1 }));
      playerTurn();
    } else {
      setCurrentTurn((prev) => ({ ...prev, enemy: prev.enemy + 1 }));
      enemyTurn();
    }
  }, [isPlayerTurn]);

  const playerTurn = async () => {
    let _player = { ...player } as Player;
    let _enemy = { ...enemy } as Enemy;
    // Player normal attack
    // debugger;
    const afterAtk = await normalAttack(_player, _enemy);
    _player = { ...(afterAtk.attacker as Player) };
    _enemy = { ...(afterAtk.target as Enemy) };
    await updateState({
      player: _player,
      enemy: _enemy,
      battlelog: afterAtk.combatLog,
      actionLogs: afterAtk.actions,
    });
    await delay(ACTION_DELAY);
    if (await checkWinCondition(_player, _enemy)) return;
    //  PLayer use skill
    const skill = _player.skills[0];
    if (_player.stats.mp >= _player.skills[0].cost) {
      const isNewCasted = buffCounter[skill.key] ? false : true;
      const afterUsingSkill = await skillUsing(_player, _enemy, skill, isNewCasted);
      _player = { ...afterUsingSkill.attacker };
      _enemy = { ...afterUsingSkill.target };
      let newBuff: { duration: number; turnCasted: number } | undefined;
      if (skill.target === SKILL_TARGET.SELF) {
        newBuff = {
          duration: !isNaN(Number(skill.duration)) ? Number(skill.duration) : 0,
          turnCasted: currentTurn.player,
        };
      }
      await updateState({
        player: { ..._player },
        enemy: _enemy,
        battlelog: afterUsingSkill.combatLog,
        buffCounters: isNewCasted
          ? ({
              ...buffCounter,
              [skill.key]: newBuff,
            } as BuffCounter)
          : undefined,
        actionLogs: afterUsingSkill.actions,
      });
      await delay(ACTION_DELAY);
      if (await checkWinCondition(_player, _enemy)) return;
    }
    handleEndturn("player");
  };
  const enemyTurn = async () => {
    let _player = { ...player } as Player;
    let _enemy = { ...enemy } as Enemy;
    const afterAtk = await normalAttack(_enemy, _player);

    _player = { ...(afterAtk.target as Player) };
    _enemy = { ...(afterAtk.attacker as Enemy) };
    await updateState({
      player: { ...player },
      enemy: enemy,
      battlelog: afterAtk.combatLog,
      actionLogs: afterAtk.actions,
    });
    await delay(ACTION_DELAY);
    if (await checkWinCondition(_player, _enemy)) return;

    if (_player.buffStats.length > 0) {
      await buffCalculation(_player, _enemy);
    }
    handleEndturn("enemy");
  };

  const buffCalculation = async (player: Player, enemy: Enemy) => {
    const { player: _player, buffCounter: _counter, combatLog } = await calculateBuff(player, buffCounter);
    await updateState({
      player: _player,
      enemy: enemy,
      buffCounters: _counter,
      battlelog: combatLog,
    });
    await delay(ACTION_DELAY);
  };

  const updateState = async ({
    player,
    enemy,
    battlelog,
    buffCounters,
    actionLogs,
  }: {
    player: Player;
    enemy: Enemy;
    battlelog?: string;
    buffCounters?: BuffCounter;
    actionLogs?: (ActionType | null)[];
  }) => {
    if (buffCounters) {
      setBuffCounter({
        ...buffCounters,
      });
    }
    if (battlelog) {
      setState((prev) => ({
        ...prev,
        battleLogs: [...prev.battleLogs, battlelog],
      }));
    }
    if (actionLogs) {
      setActions((prev) => [...prev, ...actionLogs]);
      // setActionIndex((prev) => actions.length + 1);
    }
    setPlayer(player);
    setEnemy(enemy);
    return true;
  };

  const handleReady = () => {
    setState((prev) => ({
      ...prev,
      intrOpacity: 0,
      mainOpacity: 1,
      display: "none",
      showReadyPopup: false,
      showBattleScreen: true,
    }));
  };

  const handleEndturn = async (atkerType: string) => {
    await delay(ROUND_DELAY);
    setIsPlayerTurn(!isPlayerTurn);
  };

  const checkWinCondition = async (player: Player, enemy: Enemy) => {
    let winStatus = await winCondition(player, enemy);
    if (winStatus.status === WIN_CONDITION_STATUS.WIN || winStatus.status === WIN_CONDITION_STATUS.LOSE) {
      setState((prev) => ({
        ...prev,
        battleLogs: [...prev.battleLogs, winStatus.message],
        showNextBtn: true,
      }));
      return true;
    }
    return false;
  };

  const handleEndMatch = () => {
    const _player = { ...player };
    _player.buffStats = [];
    _player.exp = player.exp + enemy.xp;
    _player.gold = player.gold + enemy.gold;
    if (player.exp + enemy.xp >= player.levelExp) {
      const nextLvl = calculateLvlFromExp(player.exp + enemy.xp);
      const newLevelExp = calculateCurrentLvlExp(Math.floor(nextLvl) + 1);
      _player.level = Math.floor(nextLvl) + 1;
      _player.exp = player.exp + enemy.xp - player.levelExp;
      _player.levelExp = newLevelExp;
    }
    if (_player.stats.hp > 0) {
      setScore(enemy.score);
    }
    updatePlayer(_player);
    setState((prevState) => ({ ...prevState, showNextBtn: false }));
    router.push("/select-event");
  };

  const showDebug = () => {
    const debugInfo = {
      player: player,
      enemy: enemy,
      buffCounter: buffCounter,
      actions: actions,
      battleLogs: state.battleLogs,
    };
    console.log("DEBUG INFO:", debugInfo);
  };
  return (
    <BattleProvider
      actions={actions}
      actionIndex={actionIndex}
      player={player}
      enemy={enemy}
      currentTurn={currentTurn}
      isPlayerTurn={isPlayerTurn}
      battleLogs={state.battleLogs}
    >
      <div className="w-full h-full text-slate-900">
        {/* <audio id='audioPlayer' ref={audioPlayer} src="/music/dungeon_theme_ost.mp3" autoPlay loop /> */}
        {player && enemy && (
          <div className="fight-screen w-full h-full">
            <AnimatePresence>
              {state.showReadyPopup && enemy.key && (
                <motion.div
                  className="container"
                  key={"container"}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PopUp
                    title={"Ready for the battle"}
                    content={`${player.name} vs ${enemy.name}`}
                    display={state.display}
                    size={"big"}
                    renderButtons={true}
                    renderInfo={true}
                    handleReady={handleReady}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {state.showBattleScreen && (
                <motion.div
                  className="w-[calc(100vw-800px)] h-full m-auto p-6"
                  key={"main-content"}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {player !== null && <FighterStatsBlock />}
                  <div className="w-full text-center p-2 mt-6">
                    <button onClick={showDebug} className="bg-violet-700 text-white p-2 rounded-md">
                      <Bug />
                    </button>
                  </div>
                  {state.showNextBtn && (
                    <div className="w-full text-center p-2 mt-6">
                      <button
                        className="bg-stone-700 w-1/4 p-2 text-white rounded-lg"
                        style={{ margin: "auto" }}
                        onClick={handleEndMatch}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </BattleProvider>
  );
};

export default BattleScreen;
