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
import EventCard from "./_components/EventCard";

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
    <div className="flex flex-col gap-8 justify-center items-center w-full h-full">
      <h2 className="text-2xl font-semibold">Choose your path</h2>
      <div className="flex flex-col w-full px-4 md:px-0 md:w-auto md:flex-row gap-6 justify-center items-center bg-gray-100">
        <AnimatePresence>
          <EventCard
            key="shop-event"
            title={shop?.name || ""}
            image={shop?.image || ""}
            description={shop?.quotes}
            handleOnClick={() => onSelectShop(shop?.id)}
          />
          <EventCard
            key="battle-event"
            title={enemy?.name || ""}
            image={enemy?.image || ""}
            description={enemy?.description}
            handleOnClick={() => onSelectBattle(enemy?.key || "")}
          />
          {/* TODO: new feature */}
          {/* <motion.div
          key="event-3"
          id="event-3"
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.5, zIndex: 10 }}
          className="relative w-[200px] h-[300px] border p-4 cursor-pointer bg-white  rounded-xl"
          >
          Event 3
          </motion.div> */}
        </AnimatePresence>
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
    </div>
  );
};

export default SelectEvents;
