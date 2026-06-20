import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import NameForm from "./NameForm";
import ClassesSelection from "./ClassesSelection";
import BounusStatsPointScreen from "./BounusStatsPointScreen";
import { useCreateCharacterContext } from "./CreateCharacterProvider";
import useGameStore from "@/store/store";
import { useRouter } from "next/navigation";

const PageContent = () => {
  const {
    step,
    creatingPlayer,
    handleUpdatePlayer,
    handlePrevStep,
    handleNextStep,
  } = useCreateCharacterContext();
  const router = useRouter();
  const { createPlayer } = useGameStore();
  
  useEffect(() => {
    if (creatingPlayer && step === 3) {
      createPlayer(creatingPlayer);
      router.push("/select-event");
    }
  }, [creatingPlayer]);

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <AnimatePresence>
        {step === 1 && <NameForm />}
        {step === 2 && (
          <ClassesSelection handleUpdateClassData={handleUpdatePlayer} />
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
    </div>
  );
};

export default PageContent;
