"use client";
import { useUIContext } from "@/app/(game)/_components/UIProvider";
import IngameMenu from "./ingame-menu";

const RightSideBar = () => {
  const { showRightSidebar } = useUIContext();
  return (
    <div
      className={`absolute top-12 right-0 w-full md:w-100 h-[calc(100%-50px)] z-10 duration-500 shadow-md bg-neutral-100 pointer-events-auto
        ${showRightSidebar ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <IngameMenu />
    </div>
  );
};

export default RightSideBar;
