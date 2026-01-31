import { Enemy } from "@/types/enemy";
import { ActionType, Player } from "@/types/player";
import { createContext } from "react";

export interface IBattleContext {
  actions: (ActionType | null)[];
  actionIndex: number;
  player: Player;
  enemy: Enemy;
  currentTurn: { player: number; enemy: number };
  isPlayerTurn: boolean | undefined;
  battleLogs: string[];
}
export const BattleContext = createContext<IBattleContext | {}>({} as IBattleContext);
const BattleProvider = ({
  actions,
  actionIndex,
  player,
  enemy,
  currentTurn,
  isPlayerTurn,
  battleLogs,
  children,
}: { children: React.ReactNode } & IBattleContext) => {
  return (
    <BattleContext.Provider
      value={{
        actions: actions || [],
        actionIndex,
        player,
        enemy,
        currentTurn,
        isPlayerTurn,
        battleLogs,
      }}
    >
      {children}
    </BattleContext.Provider>
  );
};

export default BattleProvider;
