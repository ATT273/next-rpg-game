import { IShopItem } from "@/types/shop";
import { useSkillContext } from "../../_components/SkillProvider";
import { ChevronRight } from "lucide-react";

interface Props {
  item: IShopItem;
}

const ItemInfoPanel = ({ item }: Props) => {
  const { allSkillsMap } = useSkillContext();
  const renderStats = (item: IShopItem) => {
    let stats = [];
    for (const stat in item.stats) {
      if (item.stats.hasOwnProperty(stat)) {
        stats.push(
          <div className="pl-2 flex gap-1 items-center" key={stat}>
            <ChevronRight className="size-4 pt-1" /> <p>{`${stat}: ${item.stats[stat as keyof typeof item.stats]}`}</p>
          </div>,
        );
      }
    }
    return stats;
  };

  return (
    <div>
      <p className="font-semibold text-xl">{item.name}</p>
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
              <li key={skill} className="flex gap-1 items-center">
                {" "}
                <ChevronRight className="size-4 pt-1" /> {allSkillsMap[skill]?.name || skill}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-2 italic">{item.description}</p>
    </div>
  );
};

export default ItemInfoPanel;
