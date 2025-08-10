"use client";

import React, { useEffect, useState } from "react";
import useStore from "@/store/store";
import CharacterStats from "../blocks/CharacterStats";
import { initialPlayer } from "@/data/data";
import { usePathname } from "next/navigation";

const LeftSideBar = () => {
  const gameState = useStore((state: any) => state);
  const playerStore = useStore((state: any) => state.player);
  const [player, setPlayer] = useState(initialPlayer);
  const pathName = usePathname();

  useEffect(() => {
    if (pathName === "/battle") {
      setPlayer(playerStore);
    }
  }, [playerStore]);
  return (
    <div className="character-detail__sidebar absolute top-0 left-0 md:w-[25rem] h-full p-3 z-10 bg-gray-100">
      {playerStore.name && <CharacterStats />}
    </div>
  );
};

export default LeftSideBar;
