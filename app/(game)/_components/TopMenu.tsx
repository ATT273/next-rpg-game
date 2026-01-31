"use client";
import { Button } from "@headlessui/react";
import { useUIContext } from "./UIProvider";
import LeftSideBar from "@/components/layouts/LeftSizebar";
import RightSideBar from "@/components/layouts/RightSizebar";
import { BookMarked, Menu, UserRound } from "lucide-react";
import { DEFAULT_BUTTON_CLASSES } from "@/constants/css.constants";

const TopMenu = () => {
  const { showLeftSidebar, showRightSidebar, setShowLeftSidebar, setShowRightSidebar } = useUIContext();
  return (
    <div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="relative flex justify-between items-center px-4 h-12 bg-gray-300 z-10">
          <div>
            <Button
              className={DEFAULT_BUTTON_CLASSES}
              onClick={() => {
                setShowLeftSidebar(!showLeftSidebar);
              }}
            >
              <UserRound />
            </Button>
          </div>
          <div className="flex gap-2">
            {/* TODO: Update wiki in the future */}
            {/* <Button className={DEFAULT_BUTTON_CLASSES}>
              <BookMarked />
            </Button> */}
            <Button
              className={DEFAULT_BUTTON_CLASSES}
              onClick={() => {
                console.log("click menu");
                setShowRightSidebar(!showRightSidebar);
              }}
            >
              <Menu />
            </Button>
          </div>
        </div>
        <LeftSideBar />
        <RightSideBar />
      </div>
    </div>
  );
};

export default TopMenu;
