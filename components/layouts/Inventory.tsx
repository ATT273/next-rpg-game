"use client";

import { IShopItem } from "@/types/shop";
import Image from "next/image";
import React, { useState } from "react";
import { Ellipsis } from "lucide-react";

function InventoryBlock({
  itemIndex,
  item,
  onItemUsed,
  onItemDropped,
  onHover,
}: {
  itemIndex?: number;
  item: IShopItem;
  onItemUsed?: (itemKey: string) => void;
  onItemDropped?: (itemKey: string) => void;
  onHover: (item: IShopItem | null) => void;
}) {
  const [isShowItemMenu, setIsShowItemMenu] = useState(false);
  const handleMenuBtnClick = () => {
    setIsShowItemMenu(!isShowItemMenu);
  };

  const handleUseItem = () => {
    setIsShowItemMenu(!isShowItemMenu);
    if (onItemUsed) onItemUsed(item.key);
  };

  const handleDropItem = () => {
    setIsShowItemMenu(!isShowItemMenu);
    if (onItemDropped) onItemDropped(item.key);
  };

  return (
    <div
      className="relative group border-2 border-stone-800"
      onMouseEnter={() => onHover(item)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onHover(item)}
    >
      <div className="size-16 overflow-hidden">
        <Image src={item.image} alt={item.key} width={300} height={300} className="item-thumb" />
      </div>
      {item.qty > 1 && <div className="item-qty">{item.qty}</div>}
      <div
        className="absolute top-0 right-0 block lg:hidden group-hover:block rounded-sm bg-stone-300 cursor-pointer"
        onClick={handleMenuBtnClick}
      >
        <Ellipsis className="size-4" />
      </div>
      {isShowItemMenu && (
        <ul className="absolute top-5  w-20 bg-stone-300 p-1 rounded-md cursor-pointer">
          {item.isConsumable && <li onClick={handleUseItem}>Use item</li>}
          <li onClick={handleDropItem}>Drop item</li>
        </ul>
      )}
    </div>
  );
}

export default InventoryBlock;
