"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClassesSelection from "./_components/ClassesSelection";
import BounusStatsPointScreen from "@/app/(game)/create-character/_components/BounusStatsPointScreen";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import { initialPlayer } from "@/data/data";

const CreateCharacter = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({ error: "" });
  const { createPlayer } = useStore();
  const [creatingPlayer, setCreatingPlayer] = useState(initialPlayer);
  const router = useRouter();

  // useEffect(() => {
  //   if (player) setCreatePlayer(player);
  // }, [player]);

  useEffect(() => {
    if (creatingPlayer && step === 3) {
      createPlayer(creatingPlayer);
      router.push("/select-event");
    }
  }, [creatingPlayer]);

  const checkErrors = () => {
    let error = false;
    switch (step) {
      case 1:
        if (creatingPlayer.name === "") {
          setErrors((prevState) => ({
            ...prevState,
            error: "Please enter your character`s name",
          }));
          error = true;
        }
        break;
      case 2:
        if (creatingPlayer.skills.length === 0) {
          setErrors((prevState) => ({
            ...prevState,
            error: "Select 1 skill to learn",
          }));
          error = true;
        }
        break;
      default:
        error = false;
        break;
    }
    return error;
  };

  const handleNextStep = () => {
    const error = checkErrors();
    if (!error) {
      setStep(step + 1);
      setErrors({ error: "" });
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleUpdatePlayer = (data: any) => {
    setCreatingPlayer((prevState) => ({ ...prevState, ...data }));
  };

  return (
    <div className="create-character-wrapper relative m-auto p-3">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 w-full">
        <h1 className="title font-bold text-3xl text-center">
          Create Your Character
        </h1>
        <div className="flex flex-col items-center justify-start w-full">
          <AnimatePresence>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="Enter your name"
                  name="name"
                  onChange={(e) => handleUpdatePlayer({ name: e.target.value })}
                  value={creatingPlayer.name}
                />
                <p className="text-red-500 text-center">{errors.error}</p>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                className="w-full"
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ClassesSelection handleUpdateClassData={handleUpdatePlayer} />
                <p className="text-red-500 text-center">{errors.error}</p>
              </motion.div>
            )}
            {step === 3 && (
              <div className="character-stats">
                <BounusStatsPointScreen
                  selectedClass={creatingPlayer.plClass}
                  handleUpdateStats={handleUpdatePlayer}
                  handlePrevStep={handlePrevStep}
                />
              </div>
            )}
          </AnimatePresence>
          <div className="skill"></div>
          <div>
            {step < 3 && (
              <button
                type="submit"
                className="btn bg-green text-xl rounded-md"
                onClick={handleNextStep}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCharacter;
