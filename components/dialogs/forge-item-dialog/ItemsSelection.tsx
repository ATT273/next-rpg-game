"use client";

import { cn } from "@/lib/utils";
import useGameStore from "@/store/store";
import { Anvil, X } from "lucide-react";
import Image from "next/image";
import HoldButton from "@/components/shared/HoldButton";
import { IInventoryItem } from "@/types/player";
import { validateForgeItems, forgeItems, getBonusStats } from "@/hooks/use-game";
import { toast } from "sonner";
import { RARITY_DATA } from "@/constants/items.constants";

const FORGE_COST = 10;

interface ItemsSelectionProps {
  itemsToForge: IInventoryItem[];
  onRemoveForgeItem: (id: number) => void;
  onItemForged: (forgedItem: IInventoryItem, sourceItem: IInventoryItem) => void;
  onSelectItemToForge: (item: IInventoryItem) => void;
}
const ItemsSelection = ({
  itemsToForge,
  onRemoveForgeItem,
  onItemForged,
  onSelectItemToForge,
}: ItemsSelectionProps) => {
  const player = useGameStore((s) => s.player);
  const updatePlayer = useGameStore((s) => s.updatePlayer);
  const isFirstSlotOccupied = itemsToForge.length >= 1;
  const isSecondSlotOccupied = itemsToForge.length === 2;
  const canAffordForge = player.gold >= FORGE_COST;

  const handleSelectItemToForge = (item: IInventoryItem) => {
    const { goodToForge, message } = validateForgeItems({ itemsInForgeSlot: itemsToForge, selectedItem: item });
    if (!goodToForge) {
      toast.error(message);
      return;
    }
    onSelectItemToForge(item);
  };

  const handleForgeItem = () => {
    if (!canAffordForge) {
      toast.error("You don't have enough gold to forge item");
      return;
    }
    const forgeResult = forgeItems(itemsToForge, player.items);
    onItemForged(forgeResult.forgedItem, itemsToForge[0]);
    const bonusStats = getBonusStats(forgeResult.newInventory);
    updatePlayer({ ...player, items: forgeResult.newInventory, bonusStats, gold: player.gold - FORGE_COST });
  };
  return (
    <div className="w-full flex flex-col gap-4 justify-center items-center">
      <div className="flex gap-4 items-center">
        <div
          className={cn(
            "relative size-28 border-2 border-zinc-300",
            isFirstSlotOccupied && (RARITY_DATA[itemsToForge[0].rarity]?.borderColor ?? "border-amber-300")
          )}
        >
          {isFirstSlotOccupied && (
            <span
              role="button"
              className="absolute top-0 right-0 p-1 translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white border border-red-500 text-red-500"
              onClick={() => onRemoveForgeItem(itemsToForge[0].instanceId)}
            >
              <X className="size-5" />
            </span>
          )}
          {isFirstSlotOccupied && (
            <Image src={itemsToForge[0].image} alt={`${itemsToForge[0].name}-icon`} width={112} height={112} />
          )}
        </div>
        <HoldButton
          onComplete={handleForgeItem}
          holdDuration={1500}
          size={64}
          strokeColor="#1e293b"
          disabled={itemsToForge.length < 2 || !canAffordForge}
        >
          <Anvil className="size-8 text-zinc-500" />
        </HoldButton>
        <div
          className={cn(
            "relative size-28 border-2 border-zinc-300",
            isSecondSlotOccupied && (RARITY_DATA[itemsToForge[1].rarity]?.borderColor ?? "border-amber-300")
          )}
        >
          {isSecondSlotOccupied && (
            <span
              role="button"
              className="absolute top-0 right-0 p-1 translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white border border-red-500 text-red-500"
              onClick={() => onRemoveForgeItem(itemsToForge[1].instanceId)}
            >
              <X className="size-5" />
            </span>
          )}
          {isSecondSlotOccupied && (
            <Image src={itemsToForge[1].image} alt={`${itemsToForge[1].name}-icon`} width={112} height={112} />
          )}
        </div>
      </div>
      {!canAffordForge && (
        <div className="w-full">
          <p className="text-red-500 text-base">You don't have enough gold to forge item</p>
        </div>
      )}
      <div className="h-px w-full bg-zinc-300" />
      <div className="flex gap-4">
        {player.items.length > 0 ? (
          player.items.map((item) => {
            const isSelected = itemsToForge.map((i) => i.instanceId).includes(item.instanceId);
            return (
              <div
                key={item.instanceId}
                onClick={() => handleSelectItemToForge(item)}
                className={cn(
                  "cursor-pointer relative border-2",
                  RARITY_DATA[item.rarity]?.borderColor,
                  isSelected && "pointer-events-none cursor-not-allowed"
                )}
              >
                <Image
                  src={item.image}
                  alt={`${item.name}-icon`}
                  width={112}
                  height={112}
                  className={cn(isSelected && "grayscale brightness-100 opacity-70 cursor-not-allowed")}
                />
                <div className="absolute right-1 bottom-1 size-4.5 rounded-full bg-zinc-100 grid place-items-center">
                  <p className="text-sm leading-none">{item.itemLevel}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-zinc-500 text-lg">No items to forge</p>
        )}
      </div>
    </div>
  );
};

export default ItemsSelection;
