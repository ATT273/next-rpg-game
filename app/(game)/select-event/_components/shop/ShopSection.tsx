"use client";
import React, { useEffect, useMemo, useState } from "react";
import useShop from "@/hooks/use-shop";
import useGameStore from "@/store/store";
import { IShopItem } from "@/types/shop";
import { Swords } from "lucide-react";
import { toast } from "sonner";
import { getRandomThree } from "@/utils";
import { DEFAULT_BUTTON_CLASSES } from "@/constants/css.constants";
import ItemBlock from "./ItemBlock";

import useSkill from "@/hooks/use-skill";
import { SkillDefinition } from "@/types/player";
import { classes } from "@/data/classes";
import { useRouter } from "next/navigation";
import { getStageData, getBonusStats } from "@/hooks/use-game";
import useTimelineStore from "@/store/timeline-store";
import SkillProvider from "@/app/(game)/_components/SkillProvider";

const ShopSection = () => {
  const router = useRouter();
  const { updatePlayer, setSkillLevelData, selectedShop, player, selectShop } = useGameStore();
  const [shopItems, setShopItems] = useState<IShopItem[]>([]);
  const [shopName, setShopName] = useState<string>("");
  const [cart, setCart] = useState<IShopItem[]>([]);
  const [playerGold, setPlayerGold] = useState<number>(player.gold || 0);
  const { resolveShopItems, getShop, getRandomShopId } = useShop();
  const { convertSkillsToRuntime } = useSkill();
  const { setCurrentStage, setStageData } = useTimelineStore();
  const currentStage = useTimelineStore((state) => state.currentStage);

  const allSkills = useMemo(() => {
    const skillsArray: SkillDefinition[] = Object.values(classes).flatMap((cls) => cls.skills as SkillDefinition[]);
    return skillsArray;
  }, []);

  useEffect(() => {
    const shopId = getRandomShopId();
    selectShop(shopId);
  }, []);

  useEffect(() => {
    const allItems = resolveShopItems(selectedShop);
    if (allItems.length > 0) {
      const _shop = getShop(selectedShop);
      if (_shop) setShopName(_shop.name);
      const randomIndexes = getRandomThree(0, allItems.length - 1);
      setShopItems(randomIndexes ? randomIndexes.map((i) => allItems[i]) : allItems);
    }
  }, [selectedShop]);

  useEffect(() => {
    if (player.name) setPlayerGold(player.gold);
  }, [player]);

  const addToCart = (item: IShopItem) => {
    if (player.items.length >= 6) {
      toast.error("Please remove 1 item in your inventory first");
      return;
    }
    setCart((prev) => [...prev, item]);
    setPlayerGold((prev) => prev - item.price);
  };

  const removeItem = (item: IShopItem) => {
    setCart((prev) => prev.filter((cItem) => cItem.key !== item.key));
    setPlayerGold((prev) => prev + item.price);
  };

  const handleCloseShop = () => {
    if (cart.length > 0) {
      const freshPlayer = useGameStore.getState().player;

      const playerGold = freshPlayer.gold;
      const cartValue = cart.reduce((acc, cur) => {
        acc += cur.price;
        return acc;
      }, 0);

      if (cartValue > playerGold) {
        toast.error("You don't have enough gold");
        return;
      }

      const freshSkillLevelData = useGameStore.getState().skillLevelData;

      const createInventoryItems = cart.map((item) => ({
        ...item,
        instanceId: new Date().getTime(),
      }));
      const newItems = [...freshPlayer.items, ...createInventoryItems];
      const bonusStats = getBonusStats(newItems);

      const existingSkillKeys = new Set(freshPlayer.skills.map((s) => s.key));
      const newSkillKeys = cart.flatMap((item) => item.skills).filter((key) => !existingSkillKeys.has(key));

      const updatedSkillLevelData = { ...freshSkillLevelData };
      newSkillKeys.forEach((key) => {
        updatedSkillLevelData[key] = { key, level: 1 };
      });

      const newSkillDefs = allSkills.filter((skill) => newSkillKeys.includes(skill.key));
      const runtimeSkills = convertSkillsToRuntime(newSkillDefs, updatedSkillLevelData);
      setSkillLevelData(updatedSkillLevelData);
      updatePlayer({
        ...freshPlayer,
        items: newItems,
        bonusStats,
        skills: [...freshPlayer.skills, ...runtimeSkills],
        gold: playerGold,
      });
    }
    const newStage = currentStage + 1;
    const stageData = getStageData(newStage);
    setCurrentStage(newStage);
    setStageData(stageData);
    router.push("/select-event");
  };

  return (
    <SkillProvider>
      <div className="flex flex-col gap-4 justify-center items-center">
        <div className="text-2xl font-bold">{shopName}</div>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          {shopItems.map((item, index) =>
            item ? (
              <ItemBlock
                key={index}
                item={item}
                onItemSelect={addToCart}
                onItemRemove={removeItem}
                playerGold={playerGold}
              />
            ) : null,
          )}
        </div>
        <button
          className={`${DEFAULT_BUTTON_CLASSES} w-full flex gap-2 items-center justify-center text-md bg-green-400 p-2`}
          onClick={handleCloseShop}
        >
          <Swords className="size-5" /> Continue
        </button>
      </div>
    </SkillProvider>
  );
};

export default ShopSection;
