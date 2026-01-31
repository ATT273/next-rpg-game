"use client";

import useStore from "@/store/store";
import CharacterStats from "./CharacterStats";
import { useUIContext } from "@/app/(game)/_components/UIProvider";

const LeftSideBar = () => {
  const { showLeftSidebar } = useUIContext();
  const playerStore = useStore((state: any) => state.player);

  return (
    <div
      className={`absolute top-12 left-0 w-full md:w-100 h-[calc(100%-50px)] p-2 z-10 duration-500 bg-neutral-100 shadow-md
        ${showLeftSidebar ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {playerStore.name && <CharacterStats />}
    </div>
  );
};

export default LeftSideBar;
