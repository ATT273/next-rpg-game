import { RunConfigType } from "@/types/game";

export const RunConfig: RunConfigType = {
  id: "beginner-run",
  name: "The beginning",
  minLevel: 1,
  stages: [
    {
      type: "battle",
      isBoss: false,
    },
    {
      type: "battle",
      isBoss: false,
    },
    {
      type: "shop",
      shopId: 1,
    },
    {
      type: "battle",
      isBoss: false,
    },
    {
      type: "battle",
      isBoss: false,
    },
    {
      type: "forge",
    },
    {
      type: "battle",
      isBoss: false,
    },
    {
      type: "battle",
      isBoss: false,
    },
    {
      type: "shop",
      shopId: 1,
    },
    {
      type: "battle",
      isBoss: true,
    },
  ],
};

export const StageConfigTypes = {
  battle: "battle",
  shop: "shop",
  forge: "forge",
} as const;

