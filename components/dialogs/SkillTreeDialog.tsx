import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { SkillLevel, SkillTreeNode as SkillTreeNodeType, Skills, Stats, SkillDefinition } from "@/types/player";
import { useMemo } from "react";
import { skillLevel } from "@/data/classes";
import SkillTreeNode from "@/app/(game)/create-character/_components/SkillTreeNode";
import useStore from "@/store/store";

interface SkillTreeDialogProps {
  isOpen: boolean;
  skillPoints: number;
  currentSkillTree: SkillTreeNodeType[];
  skillLevelData: SkillLevel;
  setIsOpen: (open: boolean) => void;
  handleCloseSkillDialog: () => void;
  handleConfirmSkillelection: () => void;
  handleDecreaseLevel: (key: string) => void;
  handleIncreaseLevel: (key: string) => void;
}

const SkillTreeDialog = ({
  isOpen,
  skillPoints,
  currentSkillTree,
  skillLevelData,
  setIsOpen,
  handleCloseSkillDialog,
  handleConfirmSkillelection,
  handleIncreaseLevel,
  handleDecreaseLevel,
}: SkillTreeDialogProps) => {
  // const { skillLevelData } = useStore();
  const renderSkillsTree = useMemo(() => {
    if (currentSkillTree.length === 0 || !skillLevel) return null;
    return (
      <div className="relative flex gap-4 z-20">
        {currentSkillTree.map((skill) => {
          return (
            <SkillTreeNode
              key={skill.key}
              skill={skill}
              skillLevelData={skillLevelData}
              onItemSelect={handleIncreaseLevel}
              onItemUndoSelect={handleDecreaseLevel}
            />
          );
        })}
      </div>
    );
  }, [currentSkillTree, skillLevel, skillLevelData, skillPoints]);

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50" as="div">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 bg-white p-12 shadow-lg rounded-md">
          <DialogTitle className="font-bold">Skills tree</DialogTitle>
          <div>Your skill points: {skillPoints}</div>
          <div>{renderSkillsTree}</div>
          <div className="w-full flex gap-4 justify-center">
            <button className="px-6 py-2 border border-slate-600 rounded-md" onClick={handleCloseSkillDialog}>
              Close
            </button>
            <button className="px-6 py-2 bg-slate-900 text-white rounded-md" onClick={handleConfirmSkillelection}>
              Done
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default SkillTreeDialog;
