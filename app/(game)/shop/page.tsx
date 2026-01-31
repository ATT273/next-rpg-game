"use client";

import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IShopItem } from "@/types/shop";
import ItemBlock from "./_components/ItemBlock";
import { Swords } from "lucide-react";
import shops from "@/data/shop";
import { getRandomThree } from "@/utils";
import { toast } from "sonner";
import useSkill from "@/hooks/use-skill";
import { SkillDefinition } from "@/types/player";
import { DEFAULT_BUTTON_CLASSES } from "@/constants/css.constants";

const Shop = () => {
  const router = useRouter();
  const { updatePlayer, selectedShop, player, skillLevelData } = useStore();
  const [shopItems, setShopItems] = useState<IShopItem[]>([]);
  const [shopName, setShopName] = useState<string>("");
  const [cart, setCart] = useState<IShopItem[]>([]);
  const [playerGold, setPlayerGold] = useState<number>(player.gold || 0);
  const { convertSkillsToRuntime } = useSkill();

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
    const _shop = shops.find((shop) => shop.id === selectedShop);
    if (_shop) {
      setShopName(_shop.name);
      const randomItemIndexes = getRandomThree(0, _shop.items.length - 1);

      if (randomItemIndexes) {
        const items = randomItemIndexes.map((i) => _shop.items[i]);
        setShopItems(items);
      }
    } else {
      console.log("No shop found");
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
      const newItems = [...player.items, ...cart];

      // Create a Set of existing skill keys for O(1) lookup
      const existingSkillKeys = new Set(player.skills.map((s) => s.key));

      // Collect all new unique skills from cart items
      const newSkills = cart.flatMap((item) => item.skills.filter((skill) => !existingSkillKeys.has(skill.key)));
      const runtimeSkills = convertSkillsToRuntime(newSkills as SkillDefinition[], skillLevelData);

      const newGold = playerGold;
      updatePlayer({
        ...player,
        items: newItems,
        skills: [...player.skills, ...runtimeSkills],
        gold: newGold,
      });
    }
    router.push("/select-event");
  };
  return (
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
  );
};

export default Shop;
