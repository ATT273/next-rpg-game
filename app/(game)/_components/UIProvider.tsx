"use client";

import { createContext, useContext, useState } from "react";

type UIContextType = {
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  setShowLeftSidebar: (show: boolean) => void;
  setShowRightSidebar: (show: boolean) => void;
};
const UIContext = createContext<UIContextType | null>(null);

const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  return (
    <UIContext.Provider
      value={{
        showLeftSidebar,
        showRightSidebar,
        setShowLeftSidebar,
        setShowRightSidebar,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUIContext must be used within a UIProvider");
  }
  return context;
};

export default UIProvider;
