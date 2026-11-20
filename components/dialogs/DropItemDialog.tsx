import { useSkillContext } from "@/app/(game)/_components/SkillProvider";
import { DEFAULT_BUTTON_CLASSES } from "@/constants/css.constants";
import { IShopItem } from "@/types/shop";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop, Button } from "@headlessui/react";
import ItemImageBlock from "../shared/ItemImageBlock";

interface DropItemDialogProps {
  item: IShopItem;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  handleLeave: () => void;
  handleTake: () => void;
}
const DropItemDialog = ({ item, isOpen, setIsOpen, handleLeave, handleTake }: DropItemDialogProps) => {
  const { allSkillsMap } = useSkillContext();

  const renderStats = (item: IShopItem) => {
    let stats = [];
    for (const stat in item.stats) {
      if (item.stats.hasOwnProperty(stat)) {
        stats.push(
          <p className="pl-2" key={stat}>
            -{`${stat}: ${item.stats[stat as keyof typeof item.stats]}`}
          </p>,
        );
      }
    }
    return stats;
  };
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50" as="div">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 bg-white p-12 shadow-lg rounded-md">
          <DialogTitle className="font-bold text-lg">Drop item</DialogTitle>
          <div className="w-full flex flex-col gap-4 justify-center items-center">
            <p>{item.name}</p>
            <ItemImageBlock item={item} />
            <div>
              <p>
                <span className="font-semibold">Price: </span>
                {item.price} 🪙
              </p>
              {Object.keys(item.stats).length > 0 && (
                <div>
                  <p>Stats: </p>
                  {renderStats(item)}
                </div>
              )}
              {item.skills.length > 0 && (
                <div>
                  <p className="font-semibold">Skills granted: </p>
                  <ul>
                    {item.skills.map((skill) => (
                      <li key={skill}> - {allSkillsMap[skill]?.name || skill}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="w-full flex gap-4 justify-center">
            <Button
              className={`${DEFAULT_BUTTON_CLASSES} px-6 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-md`}
              onClick={handleLeave}
            >
              Leave
            </Button>
            <Button
              className={`${DEFAULT_BUTTON_CLASSES} px-6 py-2 bg-slate-900 text-white rounded-md`}
              onClick={handleTake}
            >
              Take
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default DropItemDialog;
