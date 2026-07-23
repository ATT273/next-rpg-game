"use client";

import { DEFAULT_BUTTON_CLASSES } from "@/constants/css.constants";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop, Button } from "@headlessui/react";
import { useState } from "react";
import { toast } from "sonner";
import { IInventoryItem } from "@/types/player";
import { validateForgeItems } from "@/hooks/use-game";
import ForgeResult from "./ForgeResult";
import ItemsSelection from "./ItemsSelection";

interface ForgeItemDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const ForgeItemDialog = ({ isOpen, setIsOpen }: ForgeItemDialogProps) => {
  const [itemsToForge, setItemsToForge] = useState<IInventoryItem[]>([]);
  const [forgeResult, setForgeResult] = useState<{ forgedItem: IInventoryItem; sourceItem: IInventoryItem }>();
  const [showForgeResult, setShowForgeResult] = useState<boolean>(false);

  const onSelectItemToForge = (item: IInventoryItem) => {
    const { goodToForge, message } = validateForgeItems({ itemsInForgeSlot: itemsToForge, selectedItem: item });
    if (!goodToForge) {
      toast.error(message);
      return;
    }
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

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50" as="div">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 bg-white p-12 shadow-lg rounded-md">
          <DialogTitle className="font-bold text-lg text-center">Upgrade Your Item</DialogTitle>
          <p className="text-zinc-500">
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
              <Button
                className={`${DEFAULT_BUTTON_CLASSES} px-6 py-2 bg-slate-900 text-white rounded-md`}
                onClick={() => setIsOpen(false)}
              >
                Done
              </Button>
            ) : (
              <Button
                className={`${DEFAULT_BUTTON_CLASSES} px-6 py-2 border border-zinc-500`}
                onClick={backToItemsSelection}
              >
                Back
              </Button>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ForgeItemDialog;
