"use client";

import useGameStore from "@/store/store";
import CharacterStats from "./CharacterStats";
import { useUIContext } from "@/app/(game)/_components/UIProvider";
import SkillProvider from "@/app/(game)/_components/SkillProvider";

const LeftSideBar = () => {
  const { showLeftSidebar } = useUIContext();
  const playerStore = useGameStore((state: any) => state.player);

  return (
    <SkillProvider>
      <div
        className={`absolute top-12 left-0 w-full md:w-100 h-[calc(100%-50px)] p-2 z-10 duration-500 bg-neutral-100 shadow-md pointer-events-auto
        ${showLeftSidebar ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {playerStore.name && <CharacterStats />}
      </div>
    </SkillProvider>
  );
};

export default LeftSideBar;
