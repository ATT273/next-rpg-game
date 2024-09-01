'use client';

import Image from "next/image";
import OpenningBackGround from "@/public/images/background/back_ground.jpg";
import { useState } from "react";
import Link from "next/link";
export default function Home() {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentEnemy, setCurrentEnemy] = useState('');
  const [enemy, setEnemy] = useState({ type: 'com' });
  const [player, setPlayer] = useState({});
  const [loot, setLoot] = useState({});
  const [score, setScore] = useState(0);
  const [showHighScoresScreen, setShowHighScoresScreen] = useState(false);
  const [isStartGame, setIsStartGame] = useState(false);
  const [isContinueGame, setIsContinueGame] = useState(false);
  const [saveGame, setSaveGame] = useState(null);

  const startGame = () => {
    setIsStartGame(true);
    // setShowCreateCharacterScreen(true);
  }

  const showHighScores = () => {
    setShowHighScoresScreen(true);
    // setShowCreateCharacterScreen(true);
  }

  const continueGame = () => {
    setIsStartGame(true);
    setIsContinueGame(true);
  }

  const handleSaveGame = () => {
    const _saveGame = {
      player,
      enemy,
      currentEvent,
      currentEnemy,
      loot
    };

    localStorage.setItem('saveGame', JSON.stringify(_saveGame));
    alert('Save game complete');

  }

  return (
    <div className="home first-screen">
      <Image src={OpenningBackGround} className="bg_image" alt="bg-img" />
      <div className='start-btn-group'>
        {saveGame &&
          <Link href='/game'>
            <button className="btn_start btn" onClick={continueGame}>Continue</button>
          </Link>
        }
        <Link href='/create-character'>
          <button className="btn_start btn">New Game</button>
        </Link>
        <Link href='/high-score'>
          <button className="btn_start btn">High scores</button>
        </Link>
        {/* <a href={feedbackLink} target='_blank' className='send-feedback'>Đóng góp ý kiến</a> */}
      </div>
      <div className='version'>version 0.0.1</div>
    </div>
  );
}
