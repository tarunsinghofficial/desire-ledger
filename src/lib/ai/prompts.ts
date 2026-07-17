import type { AiAction, Desire } from "../types";

export function buildPrompt(
  action: AiAction,
  desire: Partial<Desire>,
  extra?: string,
): { system: string; user: string } {
  const system =
    "You are Desire Ledger's thoughtful co-pilot. Help the user clarify intent, timing, growth, and usage of life acquisitions. Be specific, concise, and never generic self-help fluff. Reply in valid JSON only.";

  const context = JSON.stringify(
    {
      title: desire.title,
      essence: desire.essence,
      why: desire.why,
      stage: desire.stage,
      estCost: desire.estCost,
      currency: desire.currency,
      blockers: desire.blockers,
      growthThesis: desire.growthThesis,
      lifeAreas: desire.lifeAreas,
      usageNow: desire.usageNow,
      unlocksNext: desire.unlocksNext,
      buyWindowStart: desire.buyWindowStart,
      buyWindowEnd: desire.buyWindowEnd,
      urgency: desire.urgency,
    },
    null,
    2,
  );

  const schemas: Record<AiAction, string> = {
    expand_spark: `Expand this spark into structured fields. JSON keys: essence (string), why (string), category (string), tags (string[]), growthThesis (string), lifeAreas (string[]), blockers (string), waitVsBuy (string), urgency (1-5 number), suggestedStage ("spark"|"research"|"ready").`,
    buy_timing: `Suggest when to buy. JSON keys: recommendation ("wait"|"buy"|"research_more"), rationale (string), buyWindowStart (YYYY-MM-DD or null), buyWindowEnd (YYYY-MM-DD or null), notBefore (YYYY-MM-DD or null), waitVsBuy (string).`,
    growth_thesis: `Draft how this helps growth. JSON keys: growthThesis (string), lifeAreas (string[]), unlocksNext (string), sunsetCriteria (string).`,
    usage_prompt: `Write one reflective journal prompt for someone who owns/uses this. JSON keys: prompt (string), followUps (string[]).`,
    future_unlock: `Suggest what this unlocks next. JSON keys: unlocksNext (string), relatedIdeas (string[]), dependentNotes (string).`,
    impulse_check: `Devil's advocate before buying. JSON keys: verdict ("proceed"|"pause"|"skip"), risks (string[]), alternatives (string[]), note (string).`,
  };

  const user = `Action: ${action}
Desire context:
${context}
${extra ? `Extra notes: ${extra}` : ""}

Return JSON matching: ${schemas[action]}`;

  return { system, user };
}

export function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI response was not valid JSON");
    return JSON.parse(match[0]);
  }
}
