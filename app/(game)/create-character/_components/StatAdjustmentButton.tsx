import { DEFAULT_BUTTON_CLASSES } from "@/constants/css.constants";
import React from "react";

interface Props {
  handleAddPoint: () => void;
  handleSubtractPoint: () => void;
  disabledAdd?: boolean;
  disabledSub?: boolean;
  showAdd?: boolean;
  showSub?: boolean;
}
const StatAdjustmentButton = ({
  handleAddPoint,
  handleSubtractPoint,
  disabledAdd = false,
  disabledSub = false,
  showAdd = true,
  showSub = true,
}: Props) => {
  return (
    <div className="flex gap-3">
      {showAdd ? (
        <button
          className={`${DEFAULT_BUTTON_CLASSES} bg-red-500 p-1 size-8`}
          onClick={handleAddPoint}
          disabled={disabledAdd}
        >
          +
        </button>
      ) : (
        <div className="size-8"></div>
      )}
      {showSub ? (
        <button
          className={`${DEFAULT_BUTTON_CLASSES} bg-slate-400 text-black p-1 size-8`}
          onClick={handleSubtractPoint}
          disabled={disabledSub}
        >
          -
        </button>
      ) : (
        <div className="size-8"></div>
      )}
    </div>
  );
};

export default StatAdjustmentButton;
