"use client";

import { IInventoryItem } from "@/types/player";
import { IItemStat } from "@/types/shop";
import Image from "next/image";

interface ForgeResultProps {
  forgedItem: IInventoryItem;
  currentItem: IInventoryItem;
}

const ForgeResult = ({ forgedItem, currentItem }: ForgeResultProps) => {
  const statsKeys = forgedItem ? Object.keys(forgedItem.stats) : [];
  return (
    <div className="w-full flex flex-col gap-4 justify-center items-center">
      <div className="w-70p overflow-hidden border-3 border-amber-300">
        <Image
          src={currentItem.image}
          alt={`${currentItem.name}-icon-forge-result`}
          width={260}
          objectFit="cover"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 items-start text-xl">
        <h3 className="text-3xl font-bold w-full text-center">{forgedItem.name}</h3>
        <p>
          <span className="font-semibold">Item level: </span>
          {currentItem?.itemLevel} - <span className="text-amber-300">{forgedItem.itemLevel}</span>
        </p>
        {statsKeys.map((key) => {
          return (
            <p key={key} className="capitalize">
              <span className="font-semibold">{key}: </span> {currentItem.stats[key as keyof IItemStat]} -{" "}
              <span className="text-amber-300">{forgedItem.stats[key as keyof IItemStat]}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default ForgeResult;
