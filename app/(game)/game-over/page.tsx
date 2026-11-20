"use client";
import { DEFAULT_BUTTON_CLASSES } from "@/constants/css.constants";
import { cn } from "@/lib/utils";
import useGameStore from "@/store/store";
import { useRouter } from "next/navigation";

const GameOver = () => {
  const router = useRouter();
  const score = useGameStore((state) => state.score);
  const resetPlayer = useGameStore((state) => state.resetPlayer);
  const resetScore = useGameStore((state) => state.resetScore);

  const handleRestart = () => {
    localStorage.removeItem("rpg_game");
    resetPlayer();
    resetScore();
    router.push("/");
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
      <h1 className="text-3xl font-bold mb-2">Game Over</h1>
      <p className="text-xl">Score: {score}</p>
      <button
        className={cn("w-[6em] h-[3em] rounded-md bg-slate-900 text-slate-200", DEFAULT_BUTTON_CLASSES)}
        onClick={handleRestart}
      >
        Restart
      </button>
    </div>
  );
};

export default GameOver;
