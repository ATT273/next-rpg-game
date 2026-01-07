"use client";

import { useState, useEffect, useMemo } from "react";
import { classes, classKeys, MAX_LEVEL, skillLevel } from "@/data/classes";
import Image from "next/image";
import LeftCaret from "@/svg/caret-left.svg";
import RightCaret from "@/svg/caret-right.svg";
import { motion } from "framer-motion";
import { SkillLevel, SkillTreeNode as SkillTreeNodeType, Skills, Stats, SkillDefinition } from "@/types/player";
import useGame from "@/hooks/use-game";
import useSkill from "@/hooks/use-skill";
import { useCreateCharacterContext, MAX_SKILL_POINTS } from "./CreateCharacterProvider";
import BasicStats from "./BasicStats";
import useStore from "@/store/store";
import SkillTreeDialog from "@/components/dialogs/SkillTreeDialog";

const ClassesSelection = ({
  handleUpdateClassData,
}: {
  handleUpdateClassData: ({ plClass, stats, skills }: { plClass?: string; stats?: Stats; skills?: Skills[] }) => void;
}) => {
  const { errors, creatingPlayer, skillPoints, setSkillPoints, handleNextStep } = useCreateCharacterContext();
  const { player, setSkillLevelData, skillLevelData } = useStore();

  const [activeClass, setActiveClass] = useState(0);
  const [xValue, setXValue] = useState("");
  const [currentSkillTree, setCurrentSkillTree] = useState<SkillTreeNodeType[]>([]);
  const [tempSkillLevelData, setTempSkillLevelData] = useState<SkillLevel>(skillLevelData);
  const [isOpen, setIsOpen] = useState(false);
  const { buildSkillTree } = useGame();
  const { convertSkillsToRuntime } = useSkill();

  const skillsTree: Map<string, SkillTreeNodeType[]> = useMemo(() => {
    const tree = new Map();
    classKeys.forEach((key) => {
      const classSkill = buildSkillTree(classes[key as keyof typeof classes].skills as SkillDefinition[]);

      tree.set(key, classSkill);
    });
    return tree;
  }, [classes]);

  useEffect(() => {
    setTempSkillLevelData(skillLevel);
  }, []);
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
    const currentLvl = tempSkillLevelData[key].level;
    if (currentLvl < MAX_LEVEL) {
      const _skillLevel = {
        ...tempSkillLevelData,
        [key]: {
          ...tempSkillLevelData[key],
          level: tempSkillLevelData[key].level + 1,
        },
      };
      setTempSkillLevelData(_skillLevel);
    }
  };

  const handleDecreaseLevel = (key: string) => {
    if (skillPoints === MAX_SKILL_POINTS) return;

    setSkillPoints(skillPoints + 1);
    const currentLvl = tempSkillLevelData[key].level;
    if (currentLvl > 0) {
      const _skillLevel = {
        ...tempSkillLevelData,
        [key]: {
          ...tempSkillLevelData[key],
          level: tempSkillLevelData[key].level - 1,
        },
      };
      setTempSkillLevelData(_skillLevel);
    }
  };

  const handleCloseSkillDialog = () => {
    setTempSkillLevelData(skillLevel);
    setSkillPoints(MAX_SKILL_POINTS);
    setIsOpen(false);
  };

  const handleConfirmSkillelection = () => {
    const _skillLevelData = tempSkillLevelData;
    const selectedClass = classes[classKeys[activeClass] as keyof typeof classes];
    setSkillLevelData(_skillLevelData);
    // Convert skill definitions to runtime skills with selected levels
    const runtimeSkills = convertSkillsToRuntime(selectedClass.skills as SkillDefinition[], _skillLevelData);

    handleUpdateClassData({
      plClass: selectedClass.key,
      stats: selectedClass.stats,
      skills: runtimeSkills,
    });
    setIsOpen(false);
  };

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
            <motion.div className="relative flex flex-nowrap " animate={{ x: xValue }}>
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
                <Image src={LeftCaret} alt="prev" width={50} height={50} className="cursor-pointer" />
              </span>
              <span className="next-class h-[50px]" onClick={handleNextClass}>
                <Image src={RightCaret} alt="next" width={50} height={50} className="cursor-pointer" />
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
                        <span className="text-slate-500">Target:</span> {skill.target}
                      </p>
                      <p>
                        <span className="text-slate-500">Effects:</span>{" "}
                        {skill.effects.map((effect) => effect.stats + ": " + effect.value).join(", ")}
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
            <button className="px-6 py-2 bg-slate-600 text-white rounded-lg" onClick={() => setIsOpen(true)}>
              {creatingPlayer.skills.length > 0 ? "Change skill" : "Select skill"}
            </button>
          </div>
          <SkillTreeDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            skillPoints={skillPoints}
            currentSkillTree={currentSkillTree}
            skillLevelData={tempSkillLevelData}
            handleCloseSkillDialog={handleCloseSkillDialog}
            handleConfirmSkillelection={handleConfirmSkillelection}
            handleDecreaseLevel={handleDecreaseLevel}
            handleIncreaseLevel={handleIncreaseLevel}
          />
        </div>
      </div>
      <p className="text-red-500 text-center">{errors.error}</p>
      <div className="flex gap-2 justify-center">
        <button type="submit" className="btn bg-green text-xl rounded-md" onClick={handleNextStep}>
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default ClassesSelection;
