import { DEFAULT_BUTTON_CLASSES } from "@/constants/css.constants";
import React, { useEffect, useState } from "react";

const intro = {
  transition: "all 500ms ease-out",
};

const defaultSize = {
  width: "100px",
  height: "100px",
};

const bigSize = {
  width: "300px",
  height: "200px",
};
const PopUp = (props: any) => {
  const { display, title, renderButtons, renderInfo, size } = props;
  const [popupSize, setPopupSize] = useState(bigSize);
  useEffect(() => {
    if (size === "big") {
      setPopupSize(bigSize);
    } else {
      setPopupSize(defaultSize);
    }
  }, [size]);

  const renderPopUpButtons = () => {
    return (
      <div>
        <button className={`${DEFAULT_BUTTON_CLASSES} p-2`} onClick={handleReady}>
          READY!
        </button>
      </div>
    );
  };

  const renderPopUpInfo = () => {
    const { content } = props;
    return (
      <div>
        <div className="font-semibold text-lg">{content}</div>
      </div>
    );
  };

  const handleReady = () => {
    props.handleReady();
  };
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 shadow-md"
      style={{ ...intro, ...popupSize, display: display }}
    >
      <div className="flex flex-col justify-center items-center p-5 gap-5">
        <h3 className="font-bold text-xl">{title}</h3>
        <div className="flex flex-col gap-3 justify-center items-center">
          {renderInfo && renderPopUpInfo()}
          {renderButtons && renderPopUpButtons()}
        </div>
      </div>
    </div>
  );
};

export default PopUp;
