"use client";

import Image from "next/image";
import OpenningBackGround from "@/public/images/background/back_ground.jpg";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Game from "@/game";
import { BATTLE_EVENT, LOOT_EVENT, SHOP_EVENT } from "@/data/data";
import useStore from "@/store/store";

export default function Home() {
  const [currentEvent, setCurrentEvent] = useState(0);
  // const [player, setPlayer] = useState({});
  const [showHighScoresScreen, setShowHighScoresScreen] = useState(false);
  const [isContinueGame, setIsContinueGame] = useState(false);
  const router = useRouter();
  const { updatePlayer } = useStore();

  const getEvent = () => {
    let id = Game.getEvent(currentEvent);
    if (id === BATTLE_EVENT) {
      router.push("/battle");
    } else if (id === LOOT_EVENT) {
      router.push("/loot");
    } else if (id === SHOP_EVENT) {
      router.push("/shop");
    }
  };

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
          <button
            className="bg-white rounded-md h-[3em] w-36 p-2"
            onClick={continueGame}
          >
            Continue
          </button>
        )}
        <Link href={"/create-character"}>
          <button
            className="bg-white rounded-md h-[3em] w-36 p-2"
            onClick={navigateToCreatePlayer}
          >
            New Game
          </button>
        </Link>
        <Link href="/high-score">
          <button className="bg-white rounded-md h-[3em] w-36 p-2">
            High scores
          </button>
        </Link>
        {/* <a href={feedbackLink} target='_blank' className='send-feedback'>Đóng góp ý kiến</a> */}
      </div>
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-white text-xl">
        version 0.0.1
      </div>
    </div>
  );
}
