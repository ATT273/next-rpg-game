"use client";

import React from "react";
import { RunConfig } from "@/data/run-config";
import TimelineItem from "./TimelineItem";
import { usePathname } from "next/navigation";
import useTimelineStore from "@/store/timeline-store";

const hiddenInPaths = ["create-character", "high-score", "battle", "game-over"];
const RunTimeline = () => {
  const stages = RunConfig.stages;
  const pathName = usePathname();
  const firstPath = pathName.split("/")[1];
  const { stageData } = useTimelineStore();

  if (hiddenInPaths.includes(firstPath)) return null;
  if (!stageData) return null;

  return (
    <div className="absolute left-1/2 top-24 bg-green-400 -translate-x-1/2 w-225">
      {stages.map((stage, index) => {
        return <TimelineItem key={`${stage.type}-${index}`} stage={stage} index={index} />;
      })}
      <div className="h-1 w-full bg-gray-400" />
    </div>
  );
};

export default RunTimeline;
