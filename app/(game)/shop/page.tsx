"use client";

import useGameStore from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IShopItem } from "@/types/shop";
import ItemBlock from "./_components/ItemBlock";
import { Swords } from "lucide-react";
import { getRandomThree } from "@/utils";
import useShop from "@/hooks/use-shop";
import { toast } from "sonner";
import useSkill from "@/hooks/use-skill";
import { SkillDefinition } from "@/types/player";
import { DEFAULT_BUTTON_CLASSES } from "@/constants/css.constants";
import { classes } from "@/data/classes";
import SkillProvider from "../_components/SkillProvider";

const Shop = () => {
  const router = useRouter();
  const { updatePlayer, setSkillLevelData, selectedShop, player } = useGameStore();
  const [shopItems, setShopItems] = useState<IShopItem[]>([]);
  const [shopName, setShopName] = useState<string>("");
  const [cart, setCart] = useState<IShopItem[]>([]);
  const [playerGold, setPlayerGold] = useState<number>(player.gold || 0);
  const { convertSkillsToRuntime } = useSkill();
  const { resolveShopItems, getShop } = useShop();

  const allSkills = useMemo(() => {
    const skillsArray: SkillDefinition[] = Object.values(classes).flatMap((cls) => cls.skills as SkillDefinition[]);
    return skillsArray;
  }, [classes]);

  useEffect(() => {
    getShopItems();
  }, []);

  useEffect(() => {
    if (player.name) {
      setPlayerGold(player.gold);
    }
  }, [player]);

  useEffect(() => {
    if (selectedShop > 0) {
      getShopItems();
    }
  }, [selectedShop]);

  const getShopItems = () => {
    const allItems = resolveShopItems(selectedShop);
    if (allItems.length > 0) {
      const _shop = getShop(selectedShop);
      if (_shop) setShopName(_shop.name);
      const randomIndexes = getRandomThree(0, allItems.length - 1);
      setShopItems(randomIndexes ? randomIndexes.map((i) => allItems[i]) : allItems);
    }
  };

  const addToCart = (item: IShopItem) => {
    if (player.items.length >= 6) {
      toast.error("Please remove 1 item in your inventory first");
    }
    setCart([...cart, item]);
    setPlayerGold((prev) => prev - item.price);
  };

  const removeItem = (item: IShopItem) => {
    setCart((prev) => prev.filter((cItem) => cItem.key !== item.key));
    setPlayerGold((prev) => prev + item.price);
  };
  const handleCloseShop = () => {
    if (cart.length > 0) {
      // Read fresh state to avoid stale closure
      const freshPlayer = useGameStore.getState().player;
      const freshSkillLevelData = useGameStore.getState().skillLevelData;

      const createInventoryItems = cart.map((item) => ({
        ...item,
        instanceId: new Date().getTime(),
      }));
      const newItems = [...freshPlayer.items, ...createInventoryItems];

      // Create a Set of existing skill keys for O(1) lookup
      const existingSkillKeys = new Set(freshPlayer.skills.map((s) => s.key));

      // Collect all new unique skill keys from cart items
      const newSkillKeys = cart.flatMap((item) => item.skills).filter((key) => !existingSkillKeys.has(key));

      // Build updated skillLevelData with new skills initialized at level 1
      const updatedSkillLevelData = { ...freshSkillLevelData };
      newSkillKeys.forEach((key) => {
        updatedSkillLevelData[key] = { key, level: 1 };
      });

      // Look up SkillDefinition objects and convert using the updated level data
      const newSkillDefs = allSkills.filter((skill) => newSkillKeys.includes(skill.key));
      const runtimeSkills = convertSkillsToRuntime(newSkillDefs, updatedSkillLevelData);
      setSkillLevelData(updatedSkillLevelData);
      updatePlayer({
        ...freshPlayer,
        items: newItems,
        skills: [...freshPlayer.skills, ...runtimeSkills],
        gold: playerGold,
      });
    }
    router.push("/select-event");
  };
  return (
    <SkillProvider>
      <div className="w-full h-full relative">
        <div className="flex flex-col items-center w-160 m-auto absolute p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col gap-4 justify-center items-center mb-20">
            <div className="text-2xl font-bold mb-6">{shopName}</div>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              {shopItems.map((item, index) => {
                return item ? (
                  <ItemBlock
                    key={index}
                    item={item}
                    onItemSelect={addToCart}
                    onItemRemove={removeItem}
                    playerGold={player.gold}
                  />
                ) : null;
              })}
            </div>
          </div>
          <button
            className={`${DEFAULT_BUTTON_CLASSES} w-2/3 md:w-full flex gap-2 items-center justify-center text-md bg-green-400 p-2`}
            onClick={handleCloseShop}
          >
            <Swords className="size-5" /> To battle
          </button>
        </div>
      </div>
    </SkillProvider>
  );
};

export default Shop;
