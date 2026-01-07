import { useState } from "react";
import { motion } from "framer-motion";
import { IShopItem } from "@/types/shop";
import Image from "next/image";
import { Check, X } from "lucide-react";

interface Props {
  item: IShopItem;
  playerGold: number;
  onItemSelect: (item: IShopItem) => void;
  onItemRemove: (item: IShopItem) => void;
}
const ItemBlock = ({ item, onItemSelect, onItemRemove, playerGold }: Props) => {
  const [itemSelected, setItemSelected] = useState<boolean>(false);

  const renderStats = (item: IShopItem) => {
    let stats = [];
    for (const stat in item.stats) {
      if (item.stats.hasOwnProperty(stat)) {
        stats.push(
          <p key={stat}>{`${stat}: ${
            item.stats[stat as keyof typeof item.stats]
          }`}</p>
        );
      }
    }
    return stats;
  };

  return (
    <motion.div
      key={item.key}
      id={item.key}
      transition={{ duration: 0.1 }}
      whileHover={{ scale: 1.2, boxShadow: "1px 1px 10px #ccc" }}
      className="w-[200px] border p-4 bg-white flex flex-col gap-2 items-center justify-start rounded-xl"
      onClick={() => {}}
    >
      <div key={item.key} className="flex flex-col gap-2">
        <div className="item-img w-[150px] h-[150px] overflow-hidden bg-white p-2 box-content">
          {item.image && (
            <Image
              src={item.image}
              alt={item.name}
              width={300}
              height={300}
              className="object-cover  w-[150px] h-[150px]"
            />
          )}
        </div>
        <div className="item-detail">
          <p>{item.name.toUpperCase()}</p>
          <p>{`price: ${item.price}`}</p>
          <div className="h-[50px] overflow-y-auto">{renderStats(item)}</div>
        </div>
        <div className="flex gap-2 justify-center items-center">
          {itemSelected ? (
            <button
              className={`border p-2 w-200 rounded-md border-red-400`}
              onClick={() => {
                setItemSelected(false);
                onItemRemove(item);
              }}
            >
              <X className="text-red-500" />
            </button>
          ) : (
            <button
              className={`border p-2 w-200 rounded-md bg-slate-900 ${
                item.price > playerGold ? "bg-slate-300" : ""
              }`}
              onClick={() => {
                setItemSelected(true);
                onItemSelect(item);
              }}
              disabled={item.price > playerGold}
            >
              <Check className="text-white" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ItemBlock;
