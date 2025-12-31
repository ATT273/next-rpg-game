import { MAX_LEVEL } from "@/data/classes";
import {
  SkillLevel,
  SkillTreeNode as SkillTreeNodeType,
  SkillDefinition,
} from "@/types/player";
import useSkill from "@/hooks/use-skill";

const SkillTreeNode = ({
  skill,
  skillLevelData,
  onItemSelect,
  onItemUndoSelect,
}: {
  skill: SkillTreeNodeType;
  skillLevelData: SkillLevel;
  onItemSelect: (key: string) => void;
  onItemUndoSelect: (key: string) => void;
}) => {
  const { getSkillProgression } = useSkill();
  const isUnlocked = !skill.parent
    ? true
    : skillLevelData[skill.parent].level > 0;
  const currentLvl = skillLevelData[skill.key].level;

  // Get skill progression data for tooltip
  const progression = getSkillProgression(
    skill.data as unknown as SkillDefinition,
    currentLvl
  );

  return (
    <div className="relative flex flex-col gap-4">
      <div className="bg-white p-2 relative ">
        <div
          className={`
                relative size-16 border peer cursor-pointer
                ${isUnlocked ? "bg-white" : "bg-gray-300"}
              `}
          onClick={() => {
            if (isUnlocked) onItemSelect(skill.key);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            onItemUndoSelect(skill.key);
          }}
        >
          {skill.data.name} -{currentLvl}
          <div className="absolute bottom-0 left-0 flex gap-2 justify-center h-2 w-full">
            {Array.from({ length: MAX_LEVEL }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-1 ${
                  currentLvl >= index + 1 ? "bg-amber-600" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="absolute top-full left-0 mt-2 peer-hover:opacity-100 opacity-0 border border-slate-300 shadow-lg bg-white p-3 w-[280px] pointer-events-none rounded-md z-30">
          <p className="font-semibold mb-2">
            {skill.data.name} {currentLvl > 0 && `(Level ${currentLvl})`}
          </p>
          <p className="text-sm text-slate-600 mb-2">
            {skill.data.description}
          </p>

          {/* Current Level Stats */}
          {progression.current && (
            <div className="text-xs space-y-1 mb-2">
              <p className="font-semibold text-slate-700">Current Level:</p>
              <p>
                <span className="font-medium">Type:</span>{" "}
                {progression.current.type || "N/A"}
              </p>
              <p>
                <span className="font-medium">Cost:</span>{" "}
                {progression.current.cost} MP
              </p>
              <p>
                <span className="font-medium">Target:</span>{" "}
                {progression.current.target}
              </p>
              <p>
                <span className="font-medium">Effects:</span>{" "}
                {progression.current.effects
                  .map((e) => `${e.stats}: ${e.value}`)
                  .join(", ")}
              </p>
              {progression.current.amplified && (
                <p>
                  <span className="font-medium">Amplified:</span>{" "}
                  {progression.current.amplified}
                </p>
              )}
              <p>
                <span className="font-medium">Duration:</span>{" "}
                {progression.current.duration === false
                  ? "Instant"
                  : progression.current.duration}
              </p>
            </div>
          )}

          {/* Next Level Preview */}
          {progression.hasNextLevel && progression.next && (
            <div className="text-xs space-y-1 border-t pt-2 border-slate-200">
              <p className="font-semibold text-green-700">
                Next Level ({currentLvl + 1}):
              </p>
              <p className="text-green-600">
                <span className="font-medium">Cost:</span>{" "}
                {progression.next.cost} MP
                {progression.current && (
                  <span className="text-xs ml-1">
                    (+{progression.next.cost - progression.current.cost})
                  </span>
                )}
              </p>
              <p className="text-green-600">
                <span className="font-medium">Effects:</span>{" "}
                {progression.next.effects
                  .map((e, idx) => {
                    const diff = progression.current
                      ? e.value - progression.current.effects[idx].value
                      : 0;
                    return `${e.stats}: ${e.value}${
                      diff !== 0 ? ` (+${diff})` : ""
                    }`;
                  })
                  .join(", ")}
              </p>
              {progression.next.amplified && (
                <p className="text-green-600">
                  <span className="font-medium">Amplified:</span>{" "}
                  {progression.next.amplified}
                  {progression.current?.amplified && (
                    <span className="text-xs ml-1">
                      (+
                      {progression.next.amplified -
                        progression.current.amplified}
                      )
                    </span>
                  )}
                </p>
              )}
            </div>
          )}

          {/* Max Level Indicator */}
          {!progression.hasNextLevel && currentLvl > 0 && (
            <div className="text-xs border-t pt-2 border-slate-200">
              <p className="font-semibold text-amber-600">MAX LEVEL</p>
            </div>
          )}
        </div>
      </div>
      {skill.children && skill.children.length > 0 && (
        <>
          <div className="flex gap-4">
            {skill.children.map((child) => (
              <SkillTreeNode
                key={child.key}
                skill={child}
                skillLevelData={skillLevelData}
                onItemSelect={onItemSelect}
                onItemUndoSelect={onItemUndoSelect}
              />
            ))}
          </div>
          <div className="absolute top-0 left-1/2 h-full w-[1px] bg-slate-900 -z-10" />
        </>
      )}
    </div>
  );
};

export default SkillTreeNode;
