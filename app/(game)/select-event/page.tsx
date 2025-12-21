"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEnemy from "@/hooks/use-enemy";
import useShop from "@/hooks/use-shop";
import useStore from "@/store/store";
import { IShop } from "@/types/shop";
import { Enemy } from "@/types/enemy";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bug } from "lucide-react";

const APP_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT;
const SelectEvents = () => {
  const router = useRouter();
  const [shop, setShop] = useState<IShop>();
  const [enemy, setEnemy] = useState<Enemy>();
  const { selectEnemy, selectShop, player, selectedEnemy } = useStore();
  const { getRandomShop } = useShop();
  const { getRandomEnemy } = useEnemy();

  useEffect(() => {
    const _shop = getRandomShop();
    setShop(_shop);
    selectShop(_shop.id);
    const _enemy = getRandomEnemy(selectedEnemy, player.level);
    setEnemy(_enemy);
    selectEnemy(_enemy.key);
  }, []);

  const onSelectBattle = (key: string) => {
    selectEnemy(key);
    router.push("/battle");
  };

  const onSelectShop = (id?: number) => {
    if (!id) {
      alert("The shop has no Id");
      return;
    }
    router.push("/shop");
  };

  const debugInfo = () => {
    console.log("👤 Player Info:", player);
    console.log("🛒 Selected Shop:", shop);
    console.log("🤖 Selected Enemy:", enemy);
  };
  return (
    <div className="flex gap-6 justify-center items-center h-full m-auto bg-gray-100">
      <AnimatePresence>
        <motion.div
          key="event-1"
          id="event-1"
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.5 }}
          className="w-[200px] h-[300px] border p-4 cursor-pointer bg-white flex flex-col gap-2 items-center justify-start rounded-xl"
          onClick={() => onSelectShop(shop?.id)}
        >
          {shop && (
            <>
              <h1>{shop.name}</h1>
              <div className="w-[120px] h-[120px] relative mb-4">
                <Image src={shop.image} alt={shop.name} fill sizes="300px" />
              </div>
              <div className="text-lg text-center p-2">{shop.quotes}</div>
            </>
          )}
        </motion.div>
        <motion.div
          key="event-2"
          id="event-2"
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.5 }}
          className="w-[200px] h-[300px] border p-4 cursor-pointer bg-white flex flex-col gap-2 items-center justify-start rounded-xl"
          onClick={() => onSelectBattle(enemy?.key || "")}
        >
          {enemy && (
            <>
              <h1>{enemy.name}</h1>
              <div className="w-[120px] h-[120px] relative mb-4">
                <Image src={enemy.image} alt={enemy.name} fill sizes="300px" />
              </div>
              <div className="text-lg text-center p-2">{enemy.description}</div>
            </>
          )}
        </motion.div>
        <motion.div
          key="event-3"
          id="event-3"
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.5 }}
          className="w-[200px] h-[300px] border p-4 cursor-pointer bg-white  rounded-xl"
        >
          Event 3
        </motion.div>
      </AnimatePresence>
      {APP_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-20">
          <button
            title="debug"
            className="size-8 rounded-full bg-red-500 text-white flex items-center justify-center"
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
