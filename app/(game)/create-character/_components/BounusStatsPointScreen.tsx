"use client";

import React, { useState, useEffect } from "react";
import { Stats } from "@/types/player";
import { classes } from "@/data/classes";
import StatAdjustmentButton from "@/app/(game)/create-character/_components/StatAdjustmentButton";

const initialState: Stats = {
  hp: 100,
  mp: 100,
  maxHP: 100,
  maxMP: 100,
  atk: 0,
  def: 0,
  spd: 0,
  int: 0,
};
const BounusStatsPointScreen = ({
  selectedClass,
  handleUpdateStats,
  handlePrevStep,
}: {
  selectedClass: string;
  handleUpdateStats: (data: any) => void;
  handlePrevStep: () => void;
}) => {
  const [statsState, setStatsState] = useState<Stats>(initialState);
  const [classStats, setClassStats] = useState<Stats>(initialState);
  const [points, setPoints] = useState(5);

  useEffect(() => {
    if (selectedClass) {
      const initiateStat = {
        ...initialState,
        ...classes[selectedClass as keyof typeof classes].stats,
      };
      setStatsState(initiateStat);
      setClassStats(initiateStat);
    }
  }, [selectedClass]);

  const handleAddPoint = (type: string) => {
    const _stats: Stats = { ...statsState };
    if (type === "hp") {
      _stats[type] += 1;
      _stats["maxHP"] += 1;
    } else {
      _stats[type as keyof typeof _stats] += 1;
    }
    setStatsState(_stats);
    setPoints(points - 1);
  };

  const handleSubtractPoint = (type: string) => {
    const _stats: Stats = { ...statsState };
    if (type === "hp") {
      _stats[type] -= 1;
      _stats["maxHP"] -= 1;
    } else {
      _stats[type as keyof typeof _stats] -= 1;
    }
    setStatsState(_stats);
    setPoints(points + 1);
  };

  return (
    <div className="flex flex-col items-center">
      <h4 className="stats-note text-lg">
        You have <span className="text-red-500">{points}</span> points to assign
        to your stats
      </h4>
      {statsState ? (
        <div className="p-3 mb-5 flex flex-col gap-3">
          <div className="flex gap-5 justify-center items-center text-slate-900">
            <p className="text-xl font-bold min-w-24">Hp: {statsState.hp}</p>
            <StatAdjustmentButton
              disabledAdd={points === 0}
              showAdd={points > 0}
              showSub={statsState.hp > classStats.hp}
              handleAddPoint={() => handleAddPoint("hp")}
              handleSubtractPoint={() => handleSubtractPoint("hp")}
            />
          </div>
          <div className="flex gap-5 justify-center items-center text-slate-900">
            <p className="text-xl font-bold min-w-24">Atk: {statsState.atk}</p>
            <StatAdjustmentButton
              disabledAdd={points === 0}
              showAdd={points > 0}
              showSub={statsState.atk > classStats.atk}
              handleAddPoint={() => handleAddPoint("atk")}
              handleSubtractPoint={() => handleSubtractPoint("atk")}
            />
          </div>
          <div className="flex gap-5 justify-center items-center text-slate-900">
            <p className="text-xl font-bold min-w-24">Def: {statsState.def}</p>
            <StatAdjustmentButton
              disabledAdd={points === 0}
              showAdd={points > 0}
              showSub={statsState.def > classStats.def}
              handleAddPoint={() => handleAddPoint("def")}
              handleSubtractPoint={() => handleSubtractPoint("def")}
            />
          </div>
          <div className="flex gap-5 justify-center items-center text-slate-900">
            <p className="text-xl font-bold min-w-24">Int: {statsState.int}</p>
            <StatAdjustmentButton
              disabledAdd={points === 0}
              showAdd={points > 0}
              showSub={statsState.int > classStats.int}
              handleAddPoint={() => handleAddPoint("int")}
              handleSubtractPoint={() => handleSubtractPoint("int")}
            />
          </div>
          <div className="flex gap-5 justify-center items-center text-slate-900 text-xl font-bold">
            <p className="text-xl font-bold min-w-24">Spd: {statsState.spd}</p>
            <StatAdjustmentButton
              disabledAdd={points === 0}
              showAdd={points > 0}
              showSub={statsState.spd > classStats.spd}
              handleAddPoint={() => handleAddPoint("spd")}
              handleSubtractPoint={() => handleSubtractPoint("spd")}
            />
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className="flex gap-3">
        <button
          className="btn bg-green"
          onClick={handlePrevStep}
          style={{ marginRight: "10px" }}
        >
          Back
        </button>
        <button
          type="submit"
          className="btn bg-green"
          onClick={() => handleUpdateStats({ stats: statsState })}
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default BounusStatsPointScreen;
