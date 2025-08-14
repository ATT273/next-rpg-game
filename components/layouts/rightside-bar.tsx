"use client";
import IngameMenu from "./ingame-menu";

const RightSideBar = () => {
  return (
    <div className="absolute top-0 right-0 md:w-[25rem] h-full z-10 bg-gray-100">
      Game Wiki
      <IngameMenu />
    </div>
  );
};

export default RightSideBar;
