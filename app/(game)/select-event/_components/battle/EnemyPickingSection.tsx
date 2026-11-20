"use client";
import React, { useEffect, useState } from "react";
import useEnemy from "@/hooks/use-enemy";
import useGameStore from "@/store/store";
import { Enemy } from "@/types/enemy";
import EventCard from "../EventCard";
import useTimelineStore from "@/store/timeline-store";

interface Props {
  onSelect: () => void;
}

const EnemyPickingSection = ({ onSelect }: Props) => {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const { player, selectEnemy } = useGameStore();
  const { getRandomEnemies, getRandomBoss } = useEnemy();
  const stageData = useTimelineStore((state) => state.stageData);

  useEffect(() => {
    if (stageData?.isBoss) {
      const boss = getRandomBoss(player.level);
      if (boss) setEnemies([boss]);
    } else {
      const picked = getRandomEnemies(player.level, 3);
      setEnemies(picked);
    }
  }, []);

  const handleSelect = (enemy: Enemy) => {
    selectEnemy(enemy.key);
    onSelect();
  };

  return (
    <>
      {enemies.map((enemy) => (
        <EventCard
          key={enemy.key}
          title={enemy.name}
          image={enemy.image}
          description={enemy.description}
          handleOnClick={() => handleSelect(enemy)}
        />
      ))}
    </>
  );
};

export default EnemyPickingSection;
