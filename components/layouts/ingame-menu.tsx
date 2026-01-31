"use client";
import useStore from "@/store/store";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUIContext } from "@/app/(game)/_components/UIProvider";

const IngameMenu = () => {
  const { showLeftSidebar, showRightSidebar, setShowLeftSidebar, setShowRightSidebar } = useUIContext();
  const { player } = useStore();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSaveGame = () => {
    const _saveGame = {
      player,
    };

    localStorage.setItem("rpg_game", JSON.stringify(_saveGame));
    toast.info("Game is saved");
  };

  return (
    <div className="flex flex-col h-full gap-2">
      <div
        className="p-3 w-full text-center cursor-pointer hover:bg-neutral-100"
        onClick={() => {
          setShowRightSidebar(!showRightSidebar);
          setOpen(false);
        }}
      >
        Resume
      </div>
      <div className="p-3 w-full text-center cursor-pointer hover:bg-neutral-100" onClick={handleSaveGame}>
        Save Game
      </div>
      <div
        className="p-3 w-full text-center cursor-pointer hover:bg-neutral-100"
        onClick={() => {
          setOpen(false);
          router.push("/");
        }}
      >
        Exit
      </div>
    </div>
  );
};

export default IngameMenu;
