import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { runAiAction } from "@/lib/ai/client";
import { isDemoOwner, SELF_HOST_HINT } from "@/lib/demo-access";
import type { AiAction, Desire } from "@/lib/types";

const ACTIONS: AiAction[] = [
  "expand_spark",
  "buy_timing",
  "growth_thesis",
  "usage_prompt",
  "future_unlock",
  "impulse_check",
];

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  if (!isDemoOwner(userId)) {
    return NextResponse.json(
      {
        error: SELF_HOST_HINT,
        code: "DEMO_OWNER_REQUIRED",
      },
      { status: 403 },
    );
  }

  try {
    const body = (await request.json()) as {
      action?: AiAction;
      desire?: Partial<Desire>;
      extra?: string;
    };

    if (!body.action || !ACTIONS.includes(body.action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const result = await runAiAction(
      body.action,
      body.desire ?? {},
      body.extra,
    );
    return NextResponse.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
