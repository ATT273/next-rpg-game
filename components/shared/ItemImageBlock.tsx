import { RARITY_DATA } from "@/constants/items.constants";
import { cn } from "@/lib/utils";
import { IShopItem } from "@/types/shop";
import Image from "next/image";
import React from "react";

interface ItemImageBlockProps {
  item: IShopItem;
  className?: string;
  width?: number;
  height?: number;
}

const ItemImageBlock = ({ item, width, height, className }: ItemImageBlockProps) => {
  return (
    <div
      className={cn(
        "size-20 md:size-37.5 overflow-hidden bg-white p-0.5 box-content border-3",
        RARITY_DATA[item.rarity]?.borderColor,
        className,
      )}
    >
      {item.image && (
        <Image
          src={item.image}
          alt={item.name}
          width={width ?? 300}
          height={height ?? 300}
          className="object-cover size-37.5"
        />
      )}
    </div>
  );
};

export default ItemImageBlock;
