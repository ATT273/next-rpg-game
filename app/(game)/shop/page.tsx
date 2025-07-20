"use client";

import { SHOP_EVENT } from "@/data/data";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import items from "@/data/items";
import Image from "next/image";
import { IShopItem } from "@/types/player";

const Shop = () => {
  const router = useRouter();
  const setCurrentEvent = useStore((state) => state.setCurrentEvent);
  const player = useStore((state) => state.player);
  const updatePlayer = useStore((state) => state.updatePlayer);
  const [shopItems, setShopItems] = useState<IShopItem[]>([]);
  const [cart, setCart] = useState<IShopItem[]>([]);
  const [playerGold, setPlayerGold] = useState<number>(player.gold || 0);
  useEffect(() => {
    setCurrentEvent(SHOP_EVENT);
    getShopItems();
  }, []);

  const getShopItems = () => {
    const randomIdx = Math.floor(Math.random() * items.length);
    const secondIdx =
      randomIdx !== items.length ? randomIdx + 1 : randomIdx - 1;
    const thirdIdx =
      randomIdx === 0
        ? randomIdx + 2
        : randomIdx !== items.length
        ? randomIdx - 1
        : randomIdx - 2;
    const itemsList = [items[randomIdx], items[secondIdx], items[thirdIdx]];
    setShopItems(itemsList);
  };

  const renderStats = (item: IShopItem) => {
    let stats = [];
    for (const stat in item.stats) {
      if (item.stats.hasOwnProperty(stat)) {
        stats.push(
          <p key={stat}>{`${stat}: ${
            item.stats[stat as keyof typeof item.stats]
          }`}</p>
        );
      }
    }
    return stats;
  };

  const buyItem = (item: IShopItem) => {
    setCart([...cart, item]);
    setPlayerGold((prev) => prev - item.price);
  };
  const handleCloseShop = () => {
    if (cart.length > 0) {
      const newItems = [...player.items, ...cart];
      const newGold = playerGold;
      updatePlayer({
        ...player,
        items: newItems,
        gold: newGold,
      });
    }
    router.push("/select-event");
  };
  return (
    <div className="w-full h-full relative">
      <div>Gold: {player.gold}</div>
      <div className="w-[40rem] m-auto absolute flex flex-col gap-4 justify-center items-center p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 shadow-md rounded-lg">
        <div className="text-2xl font-bold">IShopItem Shop</div>
        <div className="flex gap-4 justify-center items-center">
          {shopItems.map((item, index) => {
            return (
              <React.Fragment key={item.key}>
                <div key={item.key} className="flex flex-col gap-2">
                  <div className="item-img w-[150px] h-[150px] overflow-hidden bg-white p-2 box-content">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.image.src}
                        className="object-cover  w-[150px] h-[150px]"
                      />
                    )}
                  </div>
                  <div className="item-detail">
                    <p>{item.name.toUpperCase()}</p>
                    <p>{`price: ${item.price}`}</p>
                    <div className="h-[50px] overflow-y-auto">
                      {renderStats(item)}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center items-center">
                    <button
                      className={`bg-yellow-400 p-2 w-200 ${
                        item.price > playerGold
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => buyItem(item)}
                      disabled={item.price > playerGold}
                    >
                      Buy
                    </button>
                  </div>
                </div>
                {index !== shopItems.length - 1 && (
                  <div className="w-[1px] h-[300px] bg-slate-400"></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <button className="w-full bg-green-400 p-2" onClick={handleCloseShop}>
          Done
        </button>
      </div>
    </div>
  );
};

export default Shop;
