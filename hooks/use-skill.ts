import { Skills, SkillDefinition } from "@/types/player";

/**
 * Custom hook for skill-related operations
 */
const useSkill = () => {
  /**
   * Convert a SkillDefinition to a runtime Skills object at a specific level
   * @param skillDef - The skill definition from classes.ts
   * @param level - The skill level (1-3)
   * @returns Runtime skill object with values for the specified level
   */
  const getSkillAtLevel = (
    skillDef: SkillDefinition,
    level: number
  ): Skills => {
    // Level is 1-indexed in UI (1, 2, 3), but 0-indexed in arrays (0, 1, 2)
    const arrayIndex = Math.max(0, Math.min(level - 1, 2));

    return {
      key: skillDef.key,
      name: skillDef.name,
      type: skillDef.type,
      level: level,
      target: skillDef.target,
      description: skillDef.description,
      cost: skillDef.cost[arrayIndex],
      effects: skillDef.effects.map((effect) => ({
        stats: effect.stats,
        value: effect.value[arrayIndex],
      })),
      amplified: skillDef.amplified?.[arrayIndex],
      duration:
        typeof skillDef.duration === "boolean"
          ? skillDef.duration
          : Array.isArray(skillDef.duration)
          ? skillDef.duration[arrayIndex]
          : skillDef.duration,
    };
  };

  /**
   * Get all skill levels (1, 2, 3) for preview/comparison
   * @param skillDef - The skill definition
   * @returns Array of runtime skills for all levels
   */
  const getAllSkillLevels = (skillDef: SkillDefinition): Skills[] => {
    return [1, 2, 3].map((level) => getSkillAtLevel(skillDef, level));
  };

  /**
   * Get skill progression data for tooltip display
   * @param skillDef - The skill definition
   * @param currentLevel - Current skill level
   * @returns Object with current and next level data
   */
  const getSkillProgression = (
    skillDef: SkillDefinition,
    currentLevel: number
  ) => {
    const current = currentLevel > 0 ? getSkillAtLevel(skillDef, currentLevel) : null;
    const next = currentLevel < 3 ? getSkillAtLevel(skillDef, currentLevel + 1) : null;

    return {
      current,
      next,
      hasNextLevel: currentLevel < 3,
      maxLevel: 3,
    };
  };

  /**
   * Convert multiple skill definitions to runtime skills based on level data
   * @param skillDefs - Array of skill definitions
   * @param skillLevelData - Object mapping skill keys to their levels
   * @returns Array of runtime skills
   */
  const convertSkillsToRuntime = (
    skillDefs: SkillDefinition[],
    skillLevelData: Record<string, { key: string; level: number }>
  ): Skills[] => {
    return skillDefs
      .map((skillDef) => {
        const levelData = skillLevelData[skillDef.key];
        if (levelData && levelData.level > 0) {
          return getSkillAtLevel(skillDef, levelData.level);
        }
        return null;
      })
      .filter((skill): skill is Skills => skill !== null);
  };

  /**
   * Upgrade a skill to the next level
   * @param currentSkill - The current runtime skill
   * @param skillDef - The skill definition
   * @returns Upgraded skill or null if max level reached
   */
  const upgradeSkill = (
    currentSkill: Skills,
    skillDef: SkillDefinition
  ): Skills | null => {
    if (currentSkill.level >= 3) {
      return null;
    }
    return getSkillAtLevel(skillDef, currentSkill.level + 1);
  };

  /**
   * Calculate the difference between two skill levels
   * @param skillDef - The skill definition
   * @param fromLevel - Starting level
   * @param toLevel - Target level
   * @returns Object with stat differences
   */
  const getSkillLevelDiff = (
    skillDef: SkillDefinition,
    fromLevel: number,
    toLevel: number
  ) => {
    const fromArrayIndex = Math.max(0, Math.min(fromLevel - 1, 2));
    const toArrayIndex = Math.max(0, Math.min(toLevel - 1, 2));

    return {
      costDiff: skillDef.cost[toArrayIndex] - skillDef.cost[fromArrayIndex],
      effectsDiff: skillDef.effects.map((effect) => ({
        stats: effect.stats,
        valueDiff: effect.value[toArrayIndex] - effect.value[fromArrayIndex],
      })),
      amplifiedDiff: skillDef.amplified
        ? skillDef.amplified[toArrayIndex] - skillDef.amplified[fromArrayIndex]
        : 0,
    };
  };

  return {
    getSkillAtLevel,
    getAllSkillLevels,
    getSkillProgression,
    convertSkillsToRuntime,
    upgradeSkill,
    getSkillLevelDiff,
  };
};

export default useSkill;
