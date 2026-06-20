import { classes } from "@/data/classes";
import { SkillDefinition } from "@/types/player";
import { createContext, useContext, useMemo } from "react";

type ShopContextType = {
  selectedShop: number | null;
  allSkillsArray: SkillDefinition[];
  allSkillsMap: Record<string, SkillDefinition>;
};
const ShopContext = createContext<ShopContextType | null>(null);

const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const allSkills = useMemo(() => {
    const skillsArray: SkillDefinition[] = Object.values(classes).flatMap((cls) => cls.skills as SkillDefinition[]);
    return skillsArray || [];
  }, [classes]);

  const allSkillsMap = useMemo(() => {
    const map: Record<string, SkillDefinition> = {};
    allSkills.forEach((skill) => {
      map[skill.key] = skill;
    });
    return map || {};
  }, [allSkills]);

  return (
    <ShopContext.Provider value={{ selectedShop: null, allSkillsArray: allSkills, allSkillsMap: allSkillsMap }}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;
export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShopContext must be used within a ShopProvider");
  }
  return context;
};
