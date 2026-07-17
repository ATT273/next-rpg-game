export interface RunConfigType {
  id: string;
  name: string;
  stages: StageConfig[];
  minLevel: number;
}

export interface StageConfig {
  type: EncounterType;
  shopId?: number;
  isBoss?: boolean;
}

export type EncounterType = "battle" | "shop" | "forge";
