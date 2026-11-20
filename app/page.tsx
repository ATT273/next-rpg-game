"use client";

import Image from "next/image";
import OpenningBackGround from "@/public/images/background/back_ground.jpg";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useGameStore from "@/store/store";
import { Button } from "@headlessui/react";

export default function Home() {
  const [isContinueGame, setIsContinueGame] = useState(false);
  const router = useRouter();
  const { updatePlayer } = useGameStore();

  const continueGame = () => {
    router.push("/select-event");
  };

  const navigateToCreatePlayer = () => {
    localStorage.removeItem("rpg_game");
    router.push("/create-character");
  };

  useEffect(() => {
    const _saveGame = localStorage.getItem("rpg_game");
    if (_saveGame) {
      if (JSON.parse(_saveGame)) {
        const data = JSON.parse(_saveGame);
        updatePlayer(data.player);
        setIsContinueGame(true);
      }
    }
  }, []);

  return (
    <div className="relative h-full w-full">
      <Image src={OpenningBackGround} className="h-full w-full" alt="bg-img" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 text-2xl">
        {isContinueGame && (
          <Button className="bg-white rounded-md h-[3em] w-36 p-2 cursor-pointer" onClick={continueGame}>
            Continue
          </Button>
        )}
        <Button className="bg-white rounded-md h-[3em] w-36 p-2 cursor-pointer" onClick={navigateToCreatePlayer}>
          New Game
        </Button>
        {/* <Link href="/high-score">
          <Button className="bg-white rounded-md h-[3em] w-36 p-2 cursor-pointer">High scores</Button>
        </Link> */}
        {/* <a href={feedbackLink} target='_blank' className='send-feedback'>Đóng góp ý kiến</a> */}
      </div>
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-white text-xl">version 0.0.1</div>
    </div>
  );
}
