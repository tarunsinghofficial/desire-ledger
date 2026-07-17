export const LIFECYCLE_STAGES = [
  "spark",
  "research",
  "ready",
  "owned",
  "in_use",
  "growing",
  "legacy",
] as const;

export type LifecycleStage = (typeof LIFECYCLE_STAGES)[number];

export const STAGE_LABELS: Record<LifecycleStage, string> = {
  spark: "Idea",
  research: "Looking",
  ready: "Ready",
  owned: "Bought",
  in_use: "Using",
  growing: "Growing",
  legacy: "Done",
};

export type PurchaseChannel = "store" | "online" | "gift" | "other" | "";

export interface Desire {
  id: string;
  userId: string;
  title: string;
  essence: string;
  category: string;
  tags: string[];
  coverMood: string;
  stage: LifecycleStage;
  why: string;
  growthThesis: string;
  lifeAreas: string[];
  buyWindowStart: string | null;
  buyWindowEnd: string | null;
  notBefore: string | null;
  urgency: number;
  blockers: string;
  estCost: number | null;
  currency: string;
  budgetSource: string;
  waitVsBuy: string;
  purchasedAt: string | null;
  channel: PurchaseChannel;
  pricePaid: number | null;
  receiptNotes: string;
  usageNow: string;
  usageFrequency: string;
  rituals: string;
  friction: string;
  unlocksNext: string;
  dependentDesireIds: string[];
  sunsetCriteria: string;
  focus: boolean;
  dirty: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  syncedAt: string | null;
}

export interface JournalEntry {
  id: string;
  userId: string;
  desireId: string;
  body: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
  dirty: boolean;
  deletedAt: string | null;
  syncedAt: string | null;
}

export type DecisionKind = "wait" | "buy" | "skip" | "impulse_check";

export interface Decision {
  id: string;
  userId: string;
  desireId: string;
  kind: DecisionKind;
  note: string;
  createdAt: string;
  updatedAt: string;
  dirty: boolean;
  deletedAt: string | null;
  syncedAt: string | null;
}

export interface LedgerExport {
  version: 1;
  exportedAt: string;
  desires: Desire[];
  journalEntries: JournalEntry[];
  decisions: Decision[];
}

export type AiAction =
  | "expand_spark"
  | "buy_timing"
  | "growth_thesis"
  | "usage_prompt"
  | "future_unlock"
  | "impulse_check";

export function emptyDesire(partial?: Partial<Desire>): Desire {
  const now = new Date().toISOString();
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `desire-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return {
    id,
    userId: "",
    title: "",
    essence: "",
    category: "other",
    tags: [],
    coverMood: "forest",
    stage: "spark",
    why: "",
    growthThesis: "",
    lifeAreas: [],
    buyWindowStart: null,
    buyWindowEnd: null,
    notBefore: null,
    urgency: 3,
    blockers: "",
    estCost: null,
    currency: "INR",
    budgetSource: "",
    waitVsBuy: "",
    purchasedAt: null,
    channel: "",
    pricePaid: null,
    receiptNotes: "",
    usageNow: "",
    usageFrequency: "",
    rituals: "",
    friction: "",
    unlocksNext: "",
    dependentDesireIds: [],
    sunsetCriteria: "",
    focus: false,
    dirty: true,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
    syncedAt: null,
    ...partial,
  };
}
