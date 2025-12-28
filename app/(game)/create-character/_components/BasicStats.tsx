import { classes, classKeys } from "@/data/classes";
const BasicStats = ({ activeClass }: { activeClass: number }) => {
  return (
    <div className="class-stats flex gap-6 text-xl">
      <div>
        <p>
          <span className="font-semibold">Hp:</span>{" "}
          {classes[classKeys[activeClass] as keyof typeof classes].stats.hp}
        </p>
      </div>
      <div>
        <p>
          <span className="font-semibold">Atk:</span>{" "}
          {classes[classKeys[activeClass] as keyof typeof classes].stats.atk}
        </p>
      </div>
      <div>
        <p>
          <span className="font-semibold">Def:</span>{" "}
          {classes[classKeys[activeClass] as keyof typeof classes].stats.def}
        </p>
      </div>
      <div>
        <p>
          <span className="font-semibold">Int:</span>{" "}
          {classes[classKeys[activeClass] as keyof typeof classes].stats.int}
        </p>
      </div>
      <div>
        <p>
          <span className="font-semibold">Spd:</span>{" "}
          {classes[classKeys[activeClass] as keyof typeof classes].stats.spd}
        </p>
      </div>
    </div>
  );
};

export default BasicStats;
