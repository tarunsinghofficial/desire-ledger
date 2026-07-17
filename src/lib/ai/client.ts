import type { AiAction, Desire } from "../types";
import { completeGemini } from "./gemini";
import { completeGroq } from "./groq";
import { buildPrompt, extractJson } from "./prompts";

export type AiProvider = "gemini" | "groq";

export type AiStatus = {
  enabled: boolean;
  provider: AiProvider | null;
  model: string | null;
  label: string;
};

function envFlag(name: string): boolean {
  const raw = (process.env[name] ?? "").trim().toLowerCase();
  return raw === "true" || raw === "1" || raw === "yes" || raw === "on";
}

export function getAiStatus(): AiStatus {
  const useGroq = envFlag("USE_GROQ");
  const useGemini = envFlag("USE_GEMINI");

  if (useGroq && useGemini) {
    return {
      enabled: false,
      provider: null,
      model: null,
      label: "AI off",
    };
  }

  if (useGroq) {
    const hasKey = Boolean(process.env.GROQ_API_KEY?.trim());
    return {
      enabled: hasKey,
      provider: "groq",
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      label: hasKey ? "AI on" : "AI off",
    };
  }

  if (useGemini) {
    const hasKey = Boolean(process.env.GEMINI_API_KEY?.trim());
    return {
      enabled: hasKey,
      provider: "gemini",
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
      label: hasKey ? "AI on" : "AI off",
    };
  }

  return {
    enabled: false,
    provider: null,
    model: null,
    label: "AI off",
  };
}

export function getAiConfig(): {
  provider: AiProvider;
  model: string;
} {
  const status = getAiStatus();
  if (!status.enabled || !status.provider || !status.model) {
    throw new Error(
      status.label ||
        "No AI provider enabled. Set USE_GROQ=true or USE_GEMINI=true in .env.",
    );
  }
  return { provider: status.provider, model: status.model };
}

export async function runAiAction(
  action: AiAction,
  desire: Partial<Desire>,
  extra?: string,
): Promise<unknown> {
  const { provider, model } = getAiConfig();
  const { system, user } = buildPrompt(action, desire, extra);
  const text =
    provider === "gemini"
      ? await completeGemini(system, user, model)
      : await completeGroq(system, user, model);
  return extractJson(text);
}
