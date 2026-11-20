import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import NameForm from "./NameForm";
import ClassesSelection from "./ClassesSelection";
import BounusStatsPointScreen from "./BounusStatsPointScreen";
import { useCreateCharacterContext } from "./CreateCharacterProvider";
import useGameStore from "@/store/store";
import { useRouter } from "next/navigation";
import useTimelineStore from "@/store/timeline-store";
import { getStageData } from "@/hooks/use-game";
import { Stats } from "@/types/player";

const PageContent = () => {
  const { step, creatingPlayer, handleUpdatePlayer, handlePrevStep } = useCreateCharacterContext();
  const router = useRouter();
  const { createPlayer } = useGameStore();
  const { setCurrentStage, setStageData } = useTimelineStore();
  const handleCreatePlayer = (finalStats: Stats) => {
    createPlayer({ ...creatingPlayer, stats: finalStats });
    const stageData = getStageData(0);
    setCurrentStage(0);
    setStageData(stageData);

    router.push("/select-event");
  };

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <AnimatePresence>
        {step === 1 && <NameForm />}
        {step === 2 && <ClassesSelection handleUpdateClassData={handleUpdatePlayer} />}
        {step === 3 && (
          <div className="character-stats">
            <BounusStatsPointScreen
              selectedClass={creatingPlayer.plClass}
              handleUpdateStats={handleUpdatePlayer}
              handleCreatePlayer={handleCreatePlayer}
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
