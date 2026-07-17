import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAiStatus } from "@/lib/ai/client";
import { isDemoOwner, SELF_HOST_HINT } from "@/lib/demo-access";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export type Capabilities = {
  cloudSync: boolean;
  ai: boolean;
  isOwner: boolean;
  selfHostHint: string;
};

export async function GET() {
  const { userId } = await auth();
  const owner = isDemoOwner(userId);
  const aiConfigured = getAiStatus().enabled;

  const body: Capabilities = {
    isOwner: owner,
    cloudSync: owner && isSupabaseAdminConfigured(),
    ai: owner && aiConfigured,
    selfHostHint: SELF_HOST_HINT,
  };

  return NextResponse.json(body);
}
