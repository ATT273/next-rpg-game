"use client";
import { useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import useGameStore from "@/store/store";
import { useRouter } from "next/navigation";
import { Bug } from "lucide-react";
import useTimelineStore from "@/store/timeline-store";
import EnemyPickingSection from "./_components/battle/EnemyPickingSection";
import ShopSection from "./_components/shop/ShopSection";
import ForgeSection from "./_components/forge/ForgeSection";
import { RunConfig } from "@/data/run-config";
import Link from "next/link";

const APP_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT;

const SelectEvents = () => {
  const router = useRouter();

  const { currentStage, stageData, setStageData } = useTimelineStore();
  const { player } = useGameStore();

  const mainTitle = useMemo(() => {
    if (stageData?.type == "battle") return "Choose your opponent";
    if (stageData?.type === "shop") return "Buy what you need";
    if (stageData?.type === "forge") return "Upgrade your item";
    return "";
  }, [stageData]);

  useEffect(() => {
    const stage = RunConfig.stages[currentStage];
    if (stage) setStageData(stage);
  }, [currentStage]);

  const onSelectBattle = () => {
    router.push("/battle");
  };

  const onSelectShop = () => {
    router.push("/shop");
  };

  const debugInfo = () => {
    console.log("👤 Player Info:", player);
    console.log("📍 Stage Data:", stageData);
  };

  const renderContent = () => {
    if (stageData?.type === "battle") {
      return <EnemyPickingSection onSelect={onSelectBattle} />;
    }
    if (stageData?.type === "shop") {
      return <ShopSection />;
    }
    if (stageData?.type === "forge") {
      return <ForgeSection />;
    }
    // fallback: stageData not set yet (end of Run)
    // TODO: Create a select-new-run screen after defeat the boss.
    // NOTE: This is for demo stage only
    return (
      <div className="flex flex-col gap-3 justify-center">
        <h2 className="text-3xl font-semibold text-center">End of demo</h2>
        <p className="text-xl">
          You can{" "}
          <Link href={"/"} className="underline font-semibold">
            start a new run{" "}
          </Link>{" "}
          here{" "}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center w-full h-full">
      <h2 className="text-2xl font-semibold">{mainTitle}</h2>
      <div className="flex flex-col w-full px-4 md:px-0 md:w-auto md:flex-row gap-6 justify-center items-center">
        <AnimatePresence>{renderContent()}</AnimatePresence>
      </div>
      {APP_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-20">
          <button
            title="debug"
            className="size-8 rounded-full bg-violet-700 text-white flex items-center justify-center"
            onClick={debugInfo}
          >
            <Bug className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectEvents;
