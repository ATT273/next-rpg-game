import { StageConfig } from "@/types/game";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface TimelineStore {
  currentStage: number;
  stageData: StageConfig | null | undefined;
  setStageData: (value: StageConfig | undefined) => void;
  setCurrentStage: (value: number) => void;
}
const useTimelineStore = create<TimelineStore>()((set) => ({
  currentStage: 0,
  stageData: null,
  setStageData(value) {
    set((state) => ({ ...state, stageData: value }));
  },
  setCurrentStage(value) {
    set((state) => ({ ...state, currentStage: value }));
  },
}));

export default useTimelineStore;
