import type {
  Decision,
  Desire,
  JournalEntry,
  LifecycleStage,
  PurchaseChannel,
} from "./types";

export function desireToRemote(d: Desire, userId: string) {
  return {
    id: d.id,
    clerk_user_id: userId,
    title: d.title,
    essence: d.essence,
    category: d.category,
    tags: d.tags,
    cover_mood: d.coverMood,
    stage: d.stage,
    why: d.why,
    growth_thesis: d.growthThesis,
    life_areas: d.lifeAreas,
    buy_window_start: d.buyWindowStart,
    buy_window_end: d.buyWindowEnd,
    not_before: d.notBefore,
    urgency: d.urgency,
    blockers: d.blockers,
    est_cost: d.estCost,
    currency: d.currency,
    budget_source: d.budgetSource,
    wait_vs_buy: d.waitVsBuy,
    purchased_at: d.purchasedAt,
    channel: d.channel,
    price_paid: d.pricePaid,
    receipt_notes: d.receiptNotes,
    usage_now: d.usageNow,
    usage_frequency: d.usageFrequency,
    rituals: d.rituals,
    friction: d.friction,
    unlocks_next: d.unlocksNext,
    dependent_desire_ids: d.dependentDesireIds,
    sunset_criteria: d.sunsetCriteria,
    focus: d.focus,
    deleted_at: d.deletedAt,
    created_at: d.createdAt,
    updated_at: d.updatedAt,
  };
}

export function remoteToDesire(
  r: Record<string, unknown>,
  userId: string,
): Desire {
  return {
    id: String(r.id),
    userId,
    title: String(r.title ?? ""),
    essence: String(r.essence ?? ""),
    category: String(r.category ?? "other"),
    tags: (r.tags as string[]) ?? [],
    coverMood: String(r.cover_mood ?? "forest"),
    stage: (r.stage as LifecycleStage) ?? "spark",
    why: String(r.why ?? ""),
    growthThesis: String(r.growth_thesis ?? ""),
    lifeAreas: (r.life_areas as string[]) ?? [],
    buyWindowStart: (r.buy_window_start as string | null) ?? null,
    buyWindowEnd: (r.buy_window_end as string | null) ?? null,
    notBefore: (r.not_before as string | null) ?? null,
    urgency: Number(r.urgency ?? 3),
    blockers: String(r.blockers ?? ""),
    estCost: r.est_cost == null ? null : Number(r.est_cost),
    currency: String(r.currency ?? "INR"),
    budgetSource: String(r.budget_source ?? ""),
    waitVsBuy: String(r.wait_vs_buy ?? ""),
    purchasedAt: (r.purchased_at as string | null) ?? null,
    channel: (r.channel as PurchaseChannel) ?? "",
    pricePaid: r.price_paid == null ? null : Number(r.price_paid),
    receiptNotes: String(r.receipt_notes ?? ""),
    usageNow: String(r.usage_now ?? ""),
    usageFrequency: String(r.usage_frequency ?? ""),
    rituals: String(r.rituals ?? ""),
    friction: String(r.friction ?? ""),
    unlocksNext: String(r.unlocks_next ?? ""),
    dependentDesireIds: ((r.dependent_desire_ids as string[]) ?? []).map(String),
    sunsetCriteria: String(r.sunset_criteria ?? ""),
    focus: Boolean(r.focus),
    dirty: false,
    deletedAt: (r.deleted_at as string | null) ?? null,
    createdAt: String(r.created_at ?? new Date().toISOString()),
    updatedAt: String(r.updated_at ?? new Date().toISOString()),
    syncedAt: new Date().toISOString(),
  };
}

export function journalToRemote(j: JournalEntry, userId: string) {
  return {
    id: j.id,
    clerk_user_id: userId,
    desire_id: j.desireId,
    body: j.body,
    prompt: j.prompt,
    deleted_at: j.deletedAt,
    created_at: j.createdAt,
    updated_at: j.updatedAt,
  };
}

export function remoteToJournal(
  r: Record<string, unknown>,
  userId: string,
): JournalEntry {
  return {
    id: String(r.id),
    userId,
    desireId: String(r.desire_id),
    body: String(r.body ?? ""),
    prompt: String(r.prompt ?? ""),
    createdAt: String(r.created_at ?? new Date().toISOString()),
    updatedAt: String(r.updated_at ?? new Date().toISOString()),
    dirty: false,
    deletedAt: (r.deleted_at as string | null) ?? null,
    syncedAt: new Date().toISOString(),
  };
}

export function decisionToRemote(d: Decision, userId: string) {
  return {
    id: d.id,
    clerk_user_id: userId,
    desire_id: d.desireId,
    kind: d.kind,
    note: d.note,
    deleted_at: d.deletedAt,
    created_at: d.createdAt,
    updated_at: d.updatedAt,
  };
}

export function remoteToDecision(
  r: Record<string, unknown>,
  userId: string,
): Decision {
  return {
    id: String(r.id),
    userId,
    desireId: String(r.desire_id),
    kind: r.kind as Decision["kind"],
    note: String(r.note ?? ""),
    createdAt: String(r.created_at ?? new Date().toISOString()),
    updatedAt: String(r.updated_at ?? new Date().toISOString()),
    dirty: false,
    deletedAt: (r.deleted_at as string | null) ?? null,
    syncedAt: new Date().toISOString(),
  };
}
