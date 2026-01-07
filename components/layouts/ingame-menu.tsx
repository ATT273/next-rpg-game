"use client";
import useStore from "@/store/store";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const IngameMenu = () => {
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
    <>
      <div className="cursor-pointer " onClick={() => setOpen(true)}>
        Menu
      </div>
      <div
        className={`
        absolute top-0 right-0 w-dvw h-dvh bg-stone-500/50
        ${open ? "block" : "hidden"}
      `}
      >
        {open && (
          <AnimatePresence>
            <motion.div
              className="absolute top-0 right-0 md:w-100 flex flex-col justify-center items-center gap-1 text-white"
              key={"menu"}
              animate={{ height: "auto", opacity: 1 }}
              initial={{ height: 0, opacity: 0 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="p-3 w-full bg-stone-700  text-center cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Resume
              </div>
              <div
                className="p-3 w-full bg-stone-700  text-center cursor-pointer"
                onClick={handleSaveGame}
              >
                Save Game
              </div>
              <div
                className="p-3 w-full bg-stone-700 text-center cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  router.push("/");
                }}
              >
                Exit
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
};

export default IngameMenu;
