"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import useGameStore from "@/store/store";
import { Enemy } from "@/types/enemy";
import { ActionType, Player } from "@/types/player";
import PopUp from "@/components/shared/popup";
import FighterStatsBlockPC from "./_components/FighterStatsSectionPC";
import FighterStatsBlockMobile from "./_components/FighterStatsSectionMobile";
import { initialEnemies } from "@/data/enemies";
import { ACTION_DELAY, ROUND_DELAY, WIN_CONDITION_STATUS } from "@/data/data";
import {
  getEnemy,
  calculateCurrentLvlExp,
  calculateLvlFromExp,
  takeItem,
  getStageData,
  getBonusStats,
} from "@/hooks/use-game";
import { simulateBattle } from "@/hooks/use-simulate-battle";
import { delay } from "@/utils";
import BattleProvider from "./_components/BattleProvider";
import { Bug } from "lucide-react";
import { DEFAULT_BUTTON_CLASSES } from "@/constants/css.constants";
import SkillProvider from "../_components/SkillProvider";
import useShop from "@/hooks/use-shop";
import { IShopItem } from "@/types/shop";
import DropItemDialog from "@/components/dialogs/DropItemDialog";
import { toast } from "sonner";
import useTimelineStore from "@/store/timeline-store";
import useSkill from "@/hooks/use-skill";
import { SkillDefinition } from "@/types/player";
import { classes } from "@/data/classes";
import { BattleTimeline } from "@/types/battle-timeline";

const APP_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT;
const BattleScreen = () => {
  const audioPlayer = useRef<HTMLAudioElement>(null);

  const { setCurrentStage, setStageData } = useTimelineStore();
  const currentStage = useTimelineStore((state) => state.currentStage);

  const { player: playerStore, selectedEnemy, updatePlayer, setScore, setSkillLevelData } = useGameStore();
  const { getRandomItemByRarity } = useShop();
  const { convertSkillsToRuntime } = useSkill();

  const allSkills = useMemo(() => {
    const skillsArray: SkillDefinition[] = Object.values(classes).flatMap((cls) => cls.skills as SkillDefinition[]);
    return skillsArray;
  }, []);

  const [player, setPlayer] = useState<Player>(playerStore);
  const [enemy, setEnemy] = useState<Enemy>(initialEnemies);

  // Drop Item Dialog
  const [dropItem, setDropItem] = useState<IShopItem>();
  const [isDropDialogOpen, setIsDropDialogOpen] = useState<boolean>(false);

  const [state, setState] = useState({
    display: "block",
    intrOpacity: 1,
    mainOpacity: 0,
    battleLogs: ["Start!!!"],
    showReadyPopup: true,
    showBattleScreen: false,
    showNextBtn: false,
    matchResult: "",
  });

  const [battleTimeline, setBattleTimeline] = useState<BattleTimeline>();
  const [eventCursor, setEventCursor] = useState(-1);
  const [currentTurn, setCurrentTurn] = useState<{ player: number; enemy: number }>({ player: 0, enemy: 0 });
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>();
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

  // Generate the full battle outcome once, right before playback starts
  useEffect(() => {
    if (player.name && enemy.key && state.showBattleScreen && !battleTimeline) {
      const timeline = simulateBattle(player, enemy);
      setBattleTimeline(timeline);
      setEventCursor(0);
    }
  }, [player, enemy, state.showBattleScreen, battleTimeline]);

  // Replay the generated timeline, one event at a time
  useEffect(() => {
    if (!battleTimeline || eventCursor < 0) return;
    if (eventCursor >= battleTimeline.events.length) {
      const winStatus = battleTimeline.result;
      setState((prev) => ({
        ...prev,
        battleLogs: [...prev.battleLogs, winStatus.message],
        showNextBtn: true,
        matchResult: winStatus.status,
      }));
      return;
    }

    let cancelled = false;
    const event = battleTimeline.events[eventCursor];
    const previousEvent = eventCursor > 0 ? battleTimeline.events[eventCursor - 1] : undefined;
    const isNewRound = previousEvent !== undefined && previousEvent.roundActor !== event.roundActor;

    (async () => {
      if (isNewRound) {
        await delay(ROUND_DELAY);
        if (cancelled) return;
      }

      setPlayer(event.playerSnapshot);
      setEnemy(event.enemySnapshot);
      setIsPlayerTurn(event.roundActor === "player");
      setCurrentTurn((prev) => ({ ...prev, [event.roundActor]: event.turn }));
      if (event.combatLog) {
        setState((prev) => ({ ...prev, battleLogs: [...prev.battleLogs, event.combatLog] }));
      }
      if (event.actions.length > 0) {
        setActions((prev) => [...prev, ...event.actions]);
      }

      await delay(ACTION_DELAY);
      if (cancelled) return;
      setEventCursor((prev) => prev + 1);
    })();

    return () => {
      cancelled = true;
    };
  }, [battleTimeline, eventCursor]);

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

  const handleEndMatch = () => {
    const finalEnemy = battleTimeline?.events.at(-1)?.enemySnapshot ?? enemy;
    const _player = { ...player };
    _player.buffStats = [];
    _player.exp = player.exp + finalEnemy.xp;
    _player.gold = player.gold + finalEnemy.gold;
    if (player.exp + finalEnemy.xp >= player.levelExp) {
      const nextLvl = calculateLvlFromExp(player.exp + finalEnemy.xp);
      const newLevelExp = calculateCurrentLvlExp(Math.floor(nextLvl) + 1);
      _player.level = Math.floor(nextLvl);
      _player.exp = player.exp + finalEnemy.xp - player.levelExp;
      _player.levelExp = newLevelExp;
      _player.skillPoints += 1;
    }

    if (_player.stats.hp > 0) {
      setScore(finalEnemy.score);
    }

    updatePlayer(_player);
    setState((prevState) => ({ ...prevState, showNextBtn: false }));
    const nextStage = currentStage + 1;

    setCurrentStage(nextStage);
    const nextStageData = getStageData(nextStage);
    setStageData(nextStageData);

    router.push("/select-event");
  };

  useEffect(() => {
    if (state.showNextBtn && state.matchResult === WIN_CONDITION_STATUS.WIN) {
      const finalEnemy = battleTimeline?.events.at(-1)?.enemySnapshot ?? enemy;
      const dropItem = getRandomItemByRarity(finalEnemy.dropRarity);
      setDropItem(dropItem);
      setIsDropDialogOpen(true);
    }
  }, [state.showNextBtn]);

  const handleLeaveItem = () => {
    setIsDropDialogOpen(false);
    setDropItem(undefined);
  };

  const handleTakeItem = () => {
    if (!dropItem) return;
    const _player = { ...playerStore };

    const { newInventory, message, isAdded } = takeItem(dropItem, _player.items);
    if (isAdded) {
      _player.items = newInventory;
      _player.bonusStats = getBonusStats(newInventory);

      // Grant skills carried by the item, mirroring the shop purchase flow
      const freshSkillLevelData = useGameStore.getState().skillLevelData;
      const existingSkillKeys = new Set(_player.skills.map((s) => s.key));
      const newSkillKeys = dropItem.skills.filter((key) => !existingSkillKeys.has(key));

      if (newSkillKeys.length > 0) {
        const updatedSkillLevelData = { ...freshSkillLevelData };
        newSkillKeys.forEach((key) => {
          updatedSkillLevelData[key] = { key, level: 1 };
        });

        const newSkillDefs = allSkills.filter((skill) => newSkillKeys.includes(skill.key));
        const runtimeSkills = convertSkillsToRuntime(newSkillDefs, updatedSkillLevelData);

        setSkillLevelData(updatedSkillLevelData);
        _player.skills = [..._player.skills, ...runtimeSkills];
      }

      updatePlayer(_player);
    }
    toast.info(message);
    setIsDropDialogOpen(false);
    setDropItem(undefined);
  };

  // DEBUG
  const showDebug = () => {
    const debugInfo = {
      player: player,
      enemy: enemy,
      battleTimeline: battleTimeline,
      eventCursor: eventCursor,
      actions: actions,
      battleLogs: state.battleLogs,
    };
    console.log("DEBUG INFO:", debugInfo);
  };
  return (
    <SkillProvider>
      <BattleProvider
        actions={actions}
        actionIndex={actionIndex}
        player={player}
        enemy={enemy}
        currentTurn={currentTurn}
        isPlayerTurn={isPlayerTurn}
        battleLogs={state.battleLogs}
      >
        <div className="relative w-full h-full text-slate-900 pt-12">
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
                    className="lg:w-[calc(100vw-400px)] 2xl:w-[calc(100vw-800px)] h-full m-auto px-4 py-2 md:p-6"
                    key={"main-content"}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <FighterStatsBlockPC />
                    <FighterStatsBlockMobile />
                    {state.showNextBtn && (
                      <div className="w-full text-center p-2 mt-6">
                        <button
                          className={`${DEFAULT_BUTTON_CLASSES} bg-stone-700 w-1/4 p-2 text-white rounded-lg`}
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
        {dropItem && (
          <DropItemDialog
            item={dropItem}
            isOpen={isDropDialogOpen}
            setIsOpen={setIsDropDialogOpen}
            handleLeave={handleLeaveItem}
            handleTake={handleTakeItem}
          />
        )}
        {APP_ENV === "development" && (
          <div className="fixed bottom-0 right-0 text-center p-2 mt-6">
            <button onClick={showDebug} className="bg-violet-700 text-white p-2 rounded-md">
              <Bug />
            </button>
          </div>
        )}
      </BattleProvider>
    </SkillProvider>
  );
};

export default BattleScreen;
