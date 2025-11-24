import { ActionType } from "@/types/player";
import { motion } from "framer-motion";
import { ACTION_ICONS } from "@/data/icon-data";
const ActionBlock = ({ actions }: { actions: ActionType }) => {
  // Check if this is a multi-effect skill
  if (actions?.effects && actions.effects.length > 0) {
    return (
      <motion.div
        className=""
        key={"player-action"}
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: 50, opacity: 0 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-1">
          {actions.effects.map((effect, index) => (
            <div
              key={index}
              className="flex items-center justify-center px-2 py-2 rounded shadow-lg bg-white gap-2 text-center text-2xl"
            >
              {ACTION_ICONS[effect.type as keyof typeof ACTION_ICONS]}
              <p>{effect.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Single effect action
  return (
    <motion.div
      className="px-2 py-2 rounded shadow-lg bg-white"
      key={"player-action"}
      animate={{ y: 0, opacity: 1 }}
      initial={{ y: 50, opacity: 0 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center gap-2 text-center text-2xl">
        {ACTION_ICONS[actions?.type as keyof typeof ACTION_ICONS]}
        <p>{actions?.value}</p>
      </div>
    </motion.div>
  );
};

export default ActionBlock;
