"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_BUTTON_CLASSES } from "@/constants/css.constants";
import { IInventoryItem } from "@/types/player";
import useGame from "@/hooks/use-game";
import useTimelineStore from "@/store/timeline-store";
import ForgeResult from "@/components/dialogs/forge-item-dialog/ForgeResult";
import ItemsSelection from "@/components/dialogs/forge-item-dialog/ItemsSelection";

const ForgeSection = () => {
  const router = useRouter();
  const { getStageData } = useGame();
  const { setCurrentStage, setStageData } = useTimelineStore();
  const currentStage = useTimelineStore((state) => state.currentStage);

  const [itemsToForge, setItemsToForge] = useState<IInventoryItem[]>([]);
  const [forgeResult, setForgeResult] = useState<{ forgedItem: IInventoryItem; sourceItem: IInventoryItem }>();
  const [showForgeResult, setShowForgeResult] = useState<boolean>(false);

  const onSelectItemToForge = (item: IInventoryItem) => {
    setItemsToForge((prev) => [...prev, item]);
  };

  const onRemoveForgeItem = (id: number) => {
    const newItems = itemsToForge.filter((item) => item.instanceId !== id);
    setItemsToForge(newItems);
  };

  const onItemForged = (forgedItem: IInventoryItem, sourceItem: IInventoryItem) => {
    setForgeResult({ forgedItem, sourceItem });
    setShowForgeResult(true);
  };

  const backToItemsSelection = () => {
    setShowForgeResult(false);
    setItemsToForge([]);
  };

  const handleDone = () => {
    const newStage = currentStage + 1;
    const stageData = getStageData(newStage);
    setCurrentStage(newStage);
    setStageData(stageData);
    router.push("/select-event");
  };

  return (
    <div className="max-w-lg w-full flex flex-col gap-4 justify-center items-center p-12 rounded-md">
      <p className="text-zinc-500 text-lg text-center">
        Forge 2 copies of same item with same rarity into 1 with higher rarity with a cost of 10G
      </p>
      {!showForgeResult && (
        <ItemsSelection
          itemsToForge={itemsToForge}
          onItemForged={onItemForged}
          onRemoveForgeItem={onRemoveForgeItem}
          onSelectItemToForge={onSelectItemToForge}
        />
      )}
      {forgeResult && showForgeResult && (
        <ForgeResult forgedItem={forgeResult.forgedItem} currentItem={forgeResult.sourceItem} />
      )}
      <div className="w-full flex gap-4 justify-center">
        {!showForgeResult ? (
          <button
            className={`${DEFAULT_BUTTON_CLASSES} px-6 py-2 bg-slate-900 text-white rounded-md`}
            onClick={handleDone}
          >
            Done
          </button>
        ) : (
          <button
            className={`${DEFAULT_BUTTON_CLASSES} px-6 py-2 border border-zinc-500`}
            onClick={backToItemsSelection}
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default ForgeSection;
