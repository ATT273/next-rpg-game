"use client";

import { StageConfigTypes } from "@/data/run-config";
import { cn } from "@/lib/utils";
import { StageConfig } from "@/types/game";
import { Anvil, Skull, Store, Triangle } from "lucide-react";
import React from "react";
import useTimelineStore from "@/store/timeline-store";

const ITEM_GAP = 100;
const ICON_MAP = {
  [StageConfigTypes.battle]: Skull,
  [StageConfigTypes.forge]: Anvil,
  [StageConfigTypes.shop]: Store,
};

const activeColor = "#228B22";
const passedColor = "#D3D3D3";
const defaultColor = "#1a1a1a";
const bossColor = "#b81616";

const TimelineItem = ({ stage, index }: { stage: StageConfig; index: number }) => {
  const Icon = ICON_MAP[stage.type];
  const size = stage.isBoss ? 50 : 25;
  const currentStage = useTimelineStore((state) => state.currentStage);
  const isPassed = currentStage > index;
  const iconStroke = stage.isBoss ? bossColor : isPassed ? passedColor : defaultColor;

  return (
    <div
      className={cn(
        "absolute size-8 rounded-full top-1/2 left-1 -translate-y-1/2 -translate-x-1/2 bg-white flex flex-col items-center justify-center",
      )}
      style={{
        left: `${index * ITEM_GAP}px`,
      }}
    >
      {currentStage === index && (
        <Triangle
          className="absolute -top-4 left-1/2 -translate-x-1/2 rotate-180"
          fill={activeColor}
          stroke={activeColor}
          size={15}
        />
      )}
      <Icon size={size} stroke={iconStroke} />
    </div>
  );
};

export default TimelineItem;
