"use client";

import { useState, useEffect, useMemo } from "react";
import { classes, classKeys, MAX_LEVEL, skillLevel } from "@/data/classes";
import Image from "next/image";
import { motion } from "framer-motion";
import { SkillLevel, SkillTreeNode as SkillTreeNodeType, Skills, Stats, SkillDefinition } from "@/types/player";
import { buildSkillTree } from "@/hooks/use-game";
import useSkill from "@/hooks/use-skill";
import { useCreateCharacterContext, MAX_SKILL_POINTS } from "./CreateCharacterProvider";
import BasicStats from "./BasicStats";
import useGameStore from "@/store/store";
import SkillTreeDialog from "@/components/dialogs/SkillTreeDialog";
import { Button } from "@headlessui/react";
import { DEFAULT_BUTTON_CLASSES } from "@/constants/css.constants";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StaticImageData } from "@/types/file";

const ClassesSelection = ({
  handleUpdateClassData,
}: {
  handleUpdateClassData: ({
    plClass,
    stats,
    skills,
    image,
  }: {
    plClass?: string;
    stats?: Stats;
    skills?: Skills[];
    image?: StaticImageData;
  }) => void;
}) => {
  const { errors, creatingPlayer, skillPoints, setSkillPoints, handleNextStep } = useCreateCharacterContext();
  const { setSkillLevelData, skillLevelData } = useGameStore();
  const [currentSkillTree, setCurrentSkillTree] = useState<SkillTreeNodeType[]>([]);
  const [tempSkillLevelData, setTempSkillLevelData] = useState<SkillLevel>(skillLevelData);
  const [isOpen, setIsOpen] = useState(false);
  const { convertSkillsToRuntime } = useSkill();
  // Slider
  const [loaded, setLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
        setSkillPoints(MAX_SKILL_POINTS);
      },
      created() {
        setLoaded(true);
      },
    },
    [
      // add plugins here
    ],
  );

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
      plClass: classes[classKeys[currentSlide] as keyof typeof classes].key,
      stats: {
        ...classes[classKeys[currentSlide] as keyof typeof classes].stats,
      },
      skills: [],
    });
  }, [currentSlide]);

  useEffect(() => {
    setSkillLevelData(skillLevel);
  }, [skillLevel]);

  useEffect(() => {
    setCurrentSkillTree(skillsTree.get(classKeys[currentSlide]) || []);
  }, [skillsTree, currentSlide]);

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

  const handleConfirmSkillSelection = () => {
    const _skillLevelData = tempSkillLevelData;
    const selectedClass = classes[classKeys[currentSlide] as keyof typeof classes];
    setSkillLevelData(_skillLevelData);
    // Convert skill definitions to runtime skills with selected levels
    const runtimeSkills = convertSkillsToRuntime(selectedClass.skills as SkillDefinition[], _skillLevelData);

    handleUpdateClassData({
      plClass: selectedClass.key,
      stats: selectedClass.stats,
      skills: runtimeSkills,
      image: selectedClass.image,
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
        <div className="relative max-w-88 m-auto mb-5 overflow-hidden">
          <div ref={sliderRef} className="keen-slider bg-red-400">
            <motion.div className="relative flex flex-nowrap ">
              {classKeys.map((key, index) => (
                <Image
                  key={key}
                  src={classes[key as keyof typeof classes].image}
                  alt={classes[key as keyof typeof classes].key}
                  height={350}
                  className="grayscale keen-slider__slide"
                />
              ))}
            </motion.div>
          </div>
          {loaded && instanceRef.current && (
            <>
              <Button
                className={`absolute top-1/2 left-0 -translate-y-1/2 translate-x-1 cursor-pointer text-neutral-50 ${
                  currentSlide === 0 ? "text-neutral-500" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  instanceRef.current?.prev();
                }}
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="size-10" />
              </Button>
              <Button
                className={`absolute top-1/2 right-0 -translate-y-1/2 -translate-x-1 cursor-pointer text-neutral-50 ${
                  currentSlide === instanceRef.current.track.details.slides.length - 1 ? "text-neutral-500" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  instanceRef.current?.next();
                }}
                disabled={currentSlide === instanceRef.current.track.details.slides.length - 1}
              >
                <ChevronRight className="size-10" />
              </Button>
            </>
          )}
        </div>
        <div className="flex flex-col gap-2 justify-center items-center text-slate-900 mb-4">
          <BasicStats activeClass={currentSlide} />
          {creatingPlayer.skills.length > 0 ? (
            <div className="p-4 w-2/3 md:w-1/3 text-left border-2 border-slate-600 rounded-md">
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
            <div className="p-4 w-1/3 text-center border-2 border-slate-600 rounded-md text-gray-500">
              No skills selected
            </div>
          )}
          <Button
            className={`${DEFAULT_BUTTON_CLASSES} text-lg text-neutral-500 hover:text-neutral-900`}
            onClick={() => setIsOpen(true)}
          >
            {creatingPlayer.skills.length > 0 ? "Change skill" : "Select skill"}
          </Button>
        </div>
        <SkillTreeDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          skillPoints={skillPoints}
          currentSkillTree={currentSkillTree}
          skillLevelData={tempSkillLevelData}
          handleCloseSkillDialog={handleCloseSkillDialog}
          handleConfirmSkillSelection={handleConfirmSkillSelection}
          handleDecreaseLevel={handleDecreaseLevel}
          handleIncreaseLevel={handleIncreaseLevel}
        />
      </div>
      <p className="text-red-500 text-center">{errors.error}</p>
      <div className="flex gap-2 justify-center">
        <Button
          type="submit"
          className={`${DEFAULT_BUTTON_CLASSES} px-4 py-2 text-xl bg-neutral-200 hover:bg-neutral-300 rounded-md`}
          onClick={handleNextStep}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
};

export default ClassesSelection;
