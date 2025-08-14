"use client";
import React, { useEffect, useState } from "react";
import InventoryBlock from "./Inventory";
import Game from "../../game";
import * as _ from "lodash";
import useStore from "@/store/store";
import StatBlock from "./StatBlock";
import { IShopItem } from "@/types/shop";
import { motion } from "framer-motion";

const CharacterStats = () => {
  const { updatePlayer, player: playerStore } = useStore();
  const [player, setPlayer] = useState(playerStore);
  const [hoverInfo, setHoverInfo] = useState<IShopItem | null>(null);
  useEffect(() => {
    setPlayer(playerStore);
  }, [playerStore]);

  // const handleUseItem = (itemKey: string, itemIndex: number) => {
  //   const _player = _.cloneDeep(player);
  //   const selectedItem = _player.items[itemIndex];
  //   let message = "";
  //   selectedItem.stats &&
  //     Object.keys(selectedItem.stats).forEach((key) => {
  //       if (
  //         _player.stats[key as keyof typeof _player.stats] ===
  //         _player.stats[`max${key.toUpperCase()}` as keyof typeof _player.stats]
  //       )
  //         message += `Your ${key} is full. You don't need to use this \n`;
  //     });
  //   if (message !== "") return alert(message);

  //   if (selectedItem.qty === 1) {
  //     _player.items.splice(itemIndex, 1);
  //   } else if (selectedItem.qty && selectedItem.qty > 1) {
  //     _player.items[itemIndex].qty! -= 1;
  //   }
  //   _player.bonusStats = Game.getBonusStats(_player.items);
  //   const newStats = Game.consumeItem(_player, itemKey);
  //   _player.stats = { ..._player.stats, ...newStats };
  //   createPlayer(_player);
  // };

  const handleDropItem = (key: string) => {
    const _items = [...player.items].filter((item) => item.key !== key);
    const bonusStats = Game.getBonusStats(_items);
    updatePlayer({ ...player, items: _items, bonusStats });
    setHoverInfo(null);
  };

  return (
    <>
      <div className="stats">
        <div className="player-stats">
          <div className="item player-name">
            <p>
              <b className="text-2xl">{player.name}</b>
              {" - "}
              <span>Lvl {player.level}</span>
            </p>
          </div>
          <div className="pl-4">
            <p>
              <span className="font-bold">EXP:&nbsp;</span> ({player.exp}/
              {player.levelExp})
            </p>
            <p>
              <span className="font-bold">Gold:</span>&nbsp;{player.gold}
            </p>
          </div>
          <div className="pl-4">
            <StatBlock
              values={{ stats: player.stats, bonusStats: player.bonusStats }}
              statKey="hp"
            />
            <StatBlock
              values={{ stats: player.stats, bonusStats: player.bonusStats }}
              statKey="mp"
            />
            <StatBlock
              values={{ stats: player.stats, bonusStats: player.bonusStats }}
              statKey="atk"
            />
            <StatBlock
              values={{ stats: player.stats, bonusStats: player.bonusStats }}
              statKey="def"
            />
            <StatBlock
              values={{ stats: player.stats, bonusStats: player.bonusStats }}
              statKey="spd"
            />
          </div>
        </div>
      </div>
      <p className="text-bold text-lg">Inventory</p>
      <div className="flex justify-center flex-wrap w-[230px] gap-1">
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
            <div
              key={x}
              className="h-[74px] w-[74px] border-2 border-stone-800"
              onMouseEnter={() => setHoverInfo(null)}
            />
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
            <ItemInfo item={hoverInfo} />
          </motion.div>
        )}
      </div>
    </>
  );
};

export default CharacterStats;

const ItemInfo = ({ item }: { item: IShopItem }) => {
  return (
    <div className=" bg-white text-stone-900 p-2 rounded-lg shadow-md">
      <p>
        <b>{item.name.toUpperCase()}</b>
      </p>
      <p>price: {item.price}</p>
      {Object.keys(item.stats).map((key) => {
        return (
          <p key={key}>{`${key}: ${
            item.stats[key as keyof typeof item.stats]
          }`}</p>
        );
      })}
    </div>
  );
};
