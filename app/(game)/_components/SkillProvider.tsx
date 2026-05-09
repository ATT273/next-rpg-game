import { classes } from "@/data/classes";
import { SkillDefinition } from "@/types/player";
import { createContext, useContext, useMemo } from "react";

type SkillContextType = {
  selectedShop: number | null;
  allSkillsArray: SkillDefinition[];
  allSkillsMap: Record<string, SkillDefinition>;
};
const SkillContext = createContext<SkillContextType | null>(null);

const SkillProvider = ({ children }: { children: React.ReactNode }) => {
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
    <SkillContext.Provider value={{ selectedShop: null, allSkillsArray: allSkills, allSkillsMap: allSkillsMap }}>
      {children}
    </SkillContext.Provider>
  );
};

export default SkillProvider;
export const useSkillContext = () => {
  const context = useContext(SkillContext);
  if (!context) {
    throw new Error("useSkillContext must be used within a SkillProvider");
  }
  return context;
};
