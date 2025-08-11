"use client";

import useStore from "@/store/store";
import CharacterStats from "../blocks/CharacterStats";

const LeftSideBar = () => {
  const playerStore = useStore((state: any) => state.player);

  return (
    <div className="character-detail__sidebar absolute top-0 left-0 md:w-[25rem] h-full p-3 z-10 bg-gray-100">
      {playerStore.name && <CharacterStats />}
    </div>
  );
};

export default LeftSideBar;
