"use client";

import { useState, useEffect, useMemo } from "react";
import { classes, classKeys, MAX_LEVEL, skillLevel } from "@/data/classes";
import Image from "next/image";
import LeftCaret from "@/svg/caret-left.svg";
import RightCaret from "@/svg/caret-right.svg";
import { motion } from "framer-motion";
import {
  SkillLevel,
  SkillTreeNode as SkillTreeNodeType,
  Skills,
  Stats,
  SkillDefinition,
} from "@/types/player";
import useGame from "@/hooks/use-game";
import useSkill from "@/hooks/use-skill";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import SkillTreeNode from "./SkillTreeNode";
import {
  useCreateCharacterContext,
  MAX_SKILL_POINTS,
} from "./CreateCharacterProvider";
import BasicStats from "./BasicStats";

const ClassesSelection = ({
  handleUpdateClassData,
}: {
  handleUpdateClassData: ({
    plClass,
    stats,
    skills,
  }: {
    plClass?: string;
    stats?: Stats;
    skills?: Skills[];
  }) => void;
}) => {
  const {
    errors,
    creatingPlayer,
    skillPoints,
    setSkillPoints,
    handleNextStep,
  } = useCreateCharacterContext();

  const [activeClass, setActiveClass] = useState(0);
  const [xValue, setXValue] = useState("");
  const [currentSkillTree, setCurrentSkillTree] = useState<SkillTreeNodeType[]>(
    []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [skillLevelData, setSkillLevelData] = useState<SkillLevel>(skillLevel);

  const { buildSkillTree } = useGame();
  const { convertSkillsToRuntime } = useSkill();

  const skillsTree: Map<string, SkillTreeNodeType[]> = useMemo(() => {
    const tree = new Map();
    classKeys.forEach((key) => {
      const classSkill = buildSkillTree(
        classes[key as keyof typeof classes].skills as SkillDefinition[]
      );

      tree.set(key, classSkill);
    });
    return tree;
  }, [classes]);

  useEffect(() => {
    handleUpdateClassData({
      plClass: classes[classKeys[activeClass] as keyof typeof classes].key,
      stats: {
        ...classes[classKeys[activeClass] as keyof typeof classes].stats,
      },
      skills: [],
    });
    const _xValue = `${-(activeClass * 350)}px`;
    setXValue(_xValue);
  }, [activeClass]);

  useEffect(() => {
    setSkillLevelData(skillLevel);
  }, [skillLevel]);

  const handlePrevClass = () => {
    if (activeClass > 0) setActiveClass(activeClass - 1);
  };

  const handleNextClass = () => {
    if (activeClass < 3) setActiveClass(activeClass + 1);
  };

  useEffect(() => {
    setCurrentSkillTree(skillsTree.get(classKeys[activeClass]) || []);
  }, [skillsTree, activeClass]);

  const handleIncreaseLevel = (key: string) => {
    if (skillPoints === 0) return;

    setSkillPoints(skillPoints - 1);
    const currentLvl = skillLevelData[key].level;
    if (currentLvl < MAX_LEVEL) {
      setSkillLevelData((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          level: prev[key].level + 1,
        },
      }));
    }
  };

  const handleDecreaseLevel = (key: string) => {
    if (skillPoints === MAX_SKILL_POINTS) return;

    setSkillPoints(skillPoints + 1);
    const currentLvl = skillLevelData[key].level;
    if (currentLvl > 0) {
      setSkillLevelData((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          level: prev[key].level - 1,
        },
      }));
    }
  };

  const handleCloseSkillDialog = () => {
    setSkillLevelData(skillLevel);
    setSkillPoints(MAX_SKILL_POINTS);
    setIsOpen(false);
  };

  const handleConfirmSkillelection = () => {
    const selectedClass =
      classes[classKeys[activeClass] as keyof typeof classes];

    // Convert skill definitions to runtime skills with selected levels
    const runtimeSkills = convertSkillsToRuntime(
      selectedClass.skills as SkillDefinition[],
      skillLevelData
    );

    handleUpdateClassData({
      plClass: selectedClass.key,
      stats: selectedClass.stats,
      skills: runtimeSkills,
    });
    setIsOpen(false);
  };
  // Render the complete skill tree
  const renderSkillsTree = useMemo(() => {
    if (currentSkillTree.length === 0 || !skillLevel) return null;
    return (
      <div className="relative flex gap-4 z-20">
        {currentSkillTree.map((skill) => {
          return (
            <SkillTreeNode
              key={skill.key}
              skill={skill}
              skillLevelData={skillLevelData}
              onItemSelect={handleIncreaseLevel}
              onItemUndoSelect={handleDecreaseLevel}
            />
          );
        })}
      </div>
    );
  }, [currentSkillTree, skillLevel, skillLevelData]);

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full">
        <div className="class-container w-full">
          <div className="class-image relative flex justify-center items-center h-full max-w-[350px] m-auto mb-5 overflow-hidden">
            <motion.div
              className="relative flex flex-nowrap "
              animate={{ x: xValue }}
            >
              {classKeys.map((key, index) => (
                <Image
                  key={key}
                  src={classes[key as keyof typeof classes].image}
                  alt={classes[key as keyof typeof classes].key}
                  height={350}
                  className="grayscale"
                />
              ))}
            </motion.div>
            <div className="arrow-group absolute flex justify-between items-center w-full z-10">
              <span className="prev-class h-[50px]" onClick={handlePrevClass}>
                <Image
                  src={LeftCaret}
                  alt="prev"
                  width={50}
                  height={50}
                  className="cursor-pointer"
                />
              </span>
              <span className="next-class h-[50px]" onClick={handleNextClass}>
                <Image
                  src={RightCaret}
                  alt="next"
                  width={50}
                  height={50}
                  className="cursor-pointer"
                />
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center text-slate-900">
            <BasicStats activeClass={activeClass} />
            {creatingPlayer.skills.length > 0 ? (
              <div className="p-4 w-full text-left border-2 border-slate-600 rounded-md">
                {creatingPlayer.skills.map((skill) => (
                  <div key={skill.key}>
                    <p className="text-lg font-bold">{skill.name}</p>
                    <p>
                      <span className="text-slate-500">Type:</span> {skill.type}
                    </p>
                    <p>
                      <span className="text-slate-500">Cost:</span> {skill.cost}
                    </p>
                    <div className="flex gap-4">
                      <p>
                        <span className="text-slate-500">Target:</span>{" "}
                        {skill.target}
                      </p>
                      <p>
                        <span className="text-slate-500">Effects:</span>{" "}
                        {skill.effects
                          .map((effect) => effect.stats + ": " + effect.value)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 w-full text-center border-2 border-slate-600 rounded-md text-gray-500">
                No skills selected
              </div>
            )}
            <button
              className="px-6 py-2 bg-slate-600 text-white rounded-lg"
              onClick={() => setIsOpen(true)}
            >
              {creatingPlayer.skills.length > 0
                ? "Change skill"
                : "Select skill"}
            </button>
          </div>
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50"
            as="div"
          >
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
              <DialogPanel className="max-w-lg space-y-4 bg-white p-12 shadow-lg rounded-md">
                <DialogTitle className="font-bold">Skills tree</DialogTitle>
                <div>Your skill points: {skillPoints}</div>
                <div>{renderSkillsTree}</div>
                <div className="w-full flex gap-4 justify-center">
                  <button
                    className="px-6 py-2 border border-slate-600 rounded-md"
                    onClick={handleCloseSkillDialog}
                  >
                    Close
                  </button>
                  <button
                    className="px-6 py-2 bg-slate-900 text-white rounded-md"
                    onClick={handleConfirmSkillelection}
                  >
                    Done
                  </button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        </div>
      </div>
      <p className="text-red-500 text-center">{errors.error}</p>
      <div className="flex gap-2 justify-center">
        <button
          type="submit"
          className="btn bg-green text-xl rounded-md"
          onClick={handleNextStep}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default ClassesSelection;
