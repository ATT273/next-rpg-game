"use client";
import { useEffect, useMemo, useState } from "react";
import InventoryBlock from "./Inventory";
import * as _ from "lodash";
import useStore from "@/store/store";
import StatBlock from "../../app/(game)/battle/_components/StatBlock";
import { IShopItem } from "@/types/shop";
import { motion } from "framer-motion";
import { Button } from "@headlessui/react";
import SkillTreeDialog from "../dialogs/SkillTreeDialog";
import useGame from "@/hooks/use-game";
import useSkill from "@/hooks/use-skill";
import { SkillDefinition, SkillLevel, SkillTreeNode } from "@/types/player";
import { classes, MAX_LEVEL } from "@/data/classes";
import { usePathname } from "next/navigation";
import ItemInfoPanel from "@/app/(game)/shop/_components/ItemInfoPanel";

const CharacterStats = () => {
  const pathName = usePathname();
  const { updatePlayer, setSkillLevelData, skillLevelData, player: playerStore } = useStore();
  const [player, setPlayer] = useState(playerStore);
  const [hoverInfo, setHoverInfo] = useState<IShopItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentSkillTree, setCurrentSkillTree] = useState<SkillTreeNode[]>([]);
  const [skillPoints, setSkillPoints] = useState(playerStore.skillPoints);
  const [tempSkillLevelData, setTempSkillLevelData] = useState<SkillLevel>();

  const { buildSkillTree, getBonusStats } = useGame();
  const { convertSkillsToRuntime } = useSkill();

  const skillsTree: Map<string, SkillTreeNode[]> = useMemo(() => {
    const tree = new Map();
    const classSkill = buildSkillTree(classes[player.plClass as keyof typeof classes].skills as SkillDefinition[]);
    tree.set(player.plClass, classSkill);

    return tree;
  }, [classes]);

  useEffect(() => {
    if (skillsTree && skillsTree.get(player.plClass)) {
      setCurrentSkillTree(skillsTree.get(player.plClass) || []);
    }
  }, []);

  useEffect(() => {
    setPlayer(playerStore);
    setTempSkillLevelData(skillLevelData);
  }, [playerStore]);

  useEffect(() => {
    setSkillPoints(playerStore.skillPoints);
  }, [playerStore.skillPoints]);

  const handleDropItem = (key: string) => {
    const _items = [...player.items].filter((item) => item.key !== key);
    const bonusStats = getBonusStats(_items);
    updatePlayer({ ...player, items: _items, bonusStats });
    setHoverInfo(null);
  };

  const handleIncreaseLevel = (skillKey: string) => {
    if (skillPoints === 0 || !tempSkillLevelData) return;

    setSkillPoints(skillPoints - 1);
    const currentLvl = tempSkillLevelData[skillKey].level;
    if (currentLvl < MAX_LEVEL) {
      const _skillLevel = {
        ...tempSkillLevelData,
        [skillKey]: {
          ...tempSkillLevelData[skillKey],
          level: tempSkillLevelData[skillKey].level + 1,
        },
      };
      setTempSkillLevelData(_skillLevel);
    }
  };
  const handleDecreaseLevel = (skillKey: string) => {
    if (skillPoints === player.skillPoints || !tempSkillLevelData) return;

    setSkillPoints(skillPoints + 1);
    const currentLvl = tempSkillLevelData[skillKey].level;
    if (currentLvl > 0) {
      const _skillLevel = {
        ...tempSkillLevelData,
        [skillKey]: {
          ...tempSkillLevelData[skillKey],
          level: tempSkillLevelData[skillKey].level - 1,
        },
      };
      setTempSkillLevelData(_skillLevel);
    }
  };
  const handleCloseSkillDialog = () => {
    setTempSkillLevelData(skillLevelData);
    setSkillPoints(player.skillPoints);
    setIsOpen(false);
  };
  const handleConfirmSkillSelection = () => {
    if (!tempSkillLevelData) return;
    const selectedClass = classes[player.plClass as keyof typeof classes];

    // Convert skill definitions to runtime skills with selected levels
    const runtimeSkills = convertSkillsToRuntime(selectedClass.skills as SkillDefinition[], tempSkillLevelData);
    setSkillLevelData(tempSkillLevelData);
    updatePlayer({
      ...player,
      skills: runtimeSkills,
    });
    setIsOpen(false);
  };
  return (
    <>
      <div className="stats">
        <div className="player-stats">
          <div className="flex items-center justify-between item player-name">
            <p>
              <b className="text-2xl">{player.name}</b>
              {" - "}
              <span>Lvl {player.level}</span>
            </p>
            {playerStore.skillPoints > 0 && (
              <Button
                className="rounded-sm bg-emerald-300 p-1 size-8 text-white cursor-pointer hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setIsOpen(true)}
                disabled={pathName.includes("/battle")}
              >
                + {skillPoints}
              </Button>
            )}
          </div>
          <div className="pl-4">
            <p>
              <span className="font-bold">EXP:&nbsp;</span> ({player.exp}/{player.levelExp})
            </p>
            <p>
              <span className="font-bold">Gold:</span>&nbsp;{player.gold} 🪙
            </p>
          </div>
          <div className="pl-4">
            <StatBlock values={{ stats: player.stats, bonusStats: player.bonusStats }} statKey="hp" />
            <StatBlock values={{ stats: player.stats, bonusStats: player.bonusStats }} statKey="mp" />
            <StatBlock values={{ stats: player.stats, bonusStats: player.bonusStats }} statKey="atk" />
            <StatBlock values={{ stats: player.stats, bonusStats: player.bonusStats }} statKey="def" />
            <StatBlock values={{ stats: player.stats, bonusStats: player.bonusStats }} statKey="spd" />
          </div>
        </div>
      </div>
      <p className="text-bold text-lg">Inventory</p>
      <div className="flex justify-center flex-wrap w-56 gap-1">
        {Array.from({ length: 6 }, (_, i) => i).map((x) => {
          return player.items[x] ? (
            <InventoryBlock
              key={x}
              itemIndex={x}
              item={player.items[x]}
              // onItemUsed={handleUseItem}
              onItemDropped={handleDropItem}
              onHover={setHoverInfo}
            />
          ) : (
            <div key={x} className="h-16 w-16 border-2 border-stone-800" onMouseEnter={() => setHoverInfo(null)} />
          );
        })}
        {hoverInfo && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            initial={{ height: "0px", opacity: 0 }}
            exit={{ height: "auto", opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="bg-white text-stone-900 p-2 rounded-lg shadow-md">
              <ItemInfoPanel item={hoverInfo} />
            </div>
          </motion.div>
        )}
      </div>
      <SkillTreeDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        skillPoints={skillPoints}
        currentSkillTree={currentSkillTree}
        skillLevelData={tempSkillLevelData!}
        handleCloseSkillDialog={handleCloseSkillDialog}
        handleConfirmSkillSelection={handleConfirmSkillSelection}
        handleDecreaseLevel={handleDecreaseLevel}
        handleIncreaseLevel={handleIncreaseLevel}
      />
    </>
  );
};

export default CharacterStats;

const ItemInfo = ({ item }: { item: IShopItem }) => {
  return (
    <div className="bg-white text-stone-900 p-2 rounded-lg shadow-md">
      <p>
        <b>{item.name.toUpperCase()}</b>
      </p>
      <p>price: {item.price}</p>
      {Object.keys(item.stats).map((key) => {
        return <p key={key}>{`${key}: ${item.stats[key as keyof typeof item.stats]}`}</p>;
      })}
    </div>
  );
};
