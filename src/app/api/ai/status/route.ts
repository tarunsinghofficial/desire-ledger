import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAiStatus } from "@/lib/ai/client";
import { isDemoOwner } from "@/lib/demo-access";

export async function GET() {
  const { userId } = await auth();
  const base = getAiStatus();

  if (!isDemoOwner(userId)) {
    return NextResponse.json({
      ...base,
      enabled: false,
      label: "AI (self-host)",
    });
  }

  return NextResponse.json(base);
}
