"use client";

import { SHOP_EVENT } from "@/data/data";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IShopItem } from "@/types/shop";
import ItemBlock from "./_components/item-block";
import { Swords } from "lucide-react";
import shops from "@/data/shop";
import UseGame from "@/hooks/use-game";
import { getRandomThree } from "@/utils";
import { toast } from "sonner";

const Shop = () => {
  const router = useRouter();
  const { updatePlayer, setCurrentEvent, selectedShop, player } = useStore();
  const [shopItems, setShopItems] = useState<IShopItem[]>([]);
  const [shopName, setShopName] = useState<string>("");
  const [cart, setCart] = useState<IShopItem[]>([]);
  const [playerGold, setPlayerGold] = useState<number>(player.gold || 0);
  const { getBonusStats } = UseGame();
  useEffect(() => {
    setCurrentEvent(SHOP_EVENT);
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

  const buyItem = (item: IShopItem) => {
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
      const bonusStats = getBonusStats(newItems);
      updatePlayer({
        ...player,
        items: newItems,
        gold: playerGold,
        bonusStats,
      });
    }
    // router.push("/battle");
  };
  return (
    <div className="w-full h-full relative">
      <div className="w-[40rem] m-auto absolute p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-4 justify-center items-center mb-[80px]">
          <div className="text-2xl font-bold mb-6">{shopName}</div>
          <div className="flex gap-4 justify-center items-center">
            {shopItems.map((item, index) => {
              return item ? (
                <ItemBlock
                  key={index}
                  item={item}
                  onItemSelect={buyItem}
                  onItemRemove={removeItem}
                  playerGold={player.gold}
                />
              ) : null;
            })}
          </div>
        </div>
        <button
          className="w-full flex gap-2 items-center justify-center text-md bg-green-400 p-2"
          onClick={handleCloseShop}
        >
          <Swords className="size-5" /> To battle
        </button>
      </div>
    </div>
  );
};

export default Shop;
