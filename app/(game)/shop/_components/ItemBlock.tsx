import { useState } from "react";
import { motion } from "framer-motion";
import { IShopItem } from "@/types/shop";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { DEFAULT_BUTTON_CLASSES } from "@/constants/css.constants";
import ItemInfoPanel from "./ItemInfoPanel";

interface Props {
  item: IShopItem;
  playerGold: number;
  onItemSelect: (item: IShopItem) => void;
  onItemRemove: (item: IShopItem) => void;
}
const ItemBlock = ({ item, onItemSelect, onItemRemove, playerGold }: Props) => {
  const [itemSelected, setItemSelected] = useState<boolean>(false);

  return (
    <motion.div
      key={item.key}
      id={item.key}
      transition={{ duration: 0.1 }}
      whileHover={{ scale: 1.1, boxShadow: "1px 1px 10px #ccc", borderColor: "#05df72" }}
      className="relative w-full md:w-50 border p-4 bg-white flex flex-col gap-2 items-center justify-start rounded-xl group z-10 hover:z-20"
      onClick={() => {}}
    >
      <div key={item.key} className="flex flex-row md:flex-col gap-2">
        <div className="size-20 md:size-37.5 overflow-hidden bg-white p-2 box-content">
          {item.image && (
            <Image src={item.image} alt={item.name} width={300} height={300} className="object-cover size-37.5" />
          )}
        </div>
        <div className="h-20">
          <p>{item.name.toUpperCase()}</p>
          <p>{`price: ${item.price}`}</p>
        </div>
        <div className="flex gap-2 justify-center items-center">
          {itemSelected ? (
            <button
              className={`${DEFAULT_BUTTON_CLASSES} border p-2 rounded-md border-red-400`}
              onClick={() => {
                setItemSelected(false);
                onItemRemove(item);
              }}
            >
              <X className="text-red-500" />
            </button>
          ) : (
            <button
              className={`${DEFAULT_BUTTON_CLASSES} border p-2 rounded-md bg-slate-900 ${
                item.price > playerGold ? "bg-slate-300" : ""
              }`}
              onClick={() => {
                setItemSelected(true);
                onItemSelect(item);
              }}
              // disabled={item.price > playerGold}
            >
              <Check className="text-white" />
            </button>
          )}
        </div>
      </div>
      <div className="absolute top-0 -right-4 translate-x-full w-full h-full p-2 border border-slate-700 bg-slate-300/90 rounded-xl hidden group-hover:block z-100">
        <ItemInfoPanel item={item} />
      </div>
    </motion.div>
  );
};

export default ItemBlock;
