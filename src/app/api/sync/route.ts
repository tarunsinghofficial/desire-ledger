import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  createAdminClient,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/admin";
import {
  decisionToRemote,
  desireToRemote,
  journalToRemote,
  remoteToDecision,
  remoteToDesire,
  remoteToJournal,
} from "@/lib/sync-map";
import type { Decision, Desire, JournalEntry } from "@/lib/types";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      {
        error: "Cloud sync isn’t available right now. Try again later.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as {
      desires?: Desire[];
      journalEntries?: JournalEntry[];
      decisions?: Decision[];
    };

    const supabase = createAdminClient();
    let pushed = 0;

    if (body.desires?.length) {
      const { error } = await supabase
        .from("desires")
        .upsert(body.desires.map((d) => desireToRemote(d, userId)));
      if (error) throw error;
      pushed += body.desires.length;
    }

    if (body.journalEntries?.length) {
      const { error } = await supabase
        .from("journal_entries")
        .upsert(body.journalEntries.map((j) => journalToRemote(j, userId)));
      if (error) throw error;
      pushed += body.journalEntries.length;
    }

    if (body.decisions?.length) {
      const { error } = await supabase
        .from("decisions")
        .upsert(body.decisions.map((d) => decisionToRemote(d, userId)));
      if (error) throw error;
      pushed += body.decisions.length;
    }

    const [{ data: desires, error: dErr }, { data: journal, error: jErr }, { data: decisions, error: cErr }] =
      await Promise.all([
        supabase.from("desires").select("*").eq("clerk_user_id", userId),
        supabase
          .from("journal_entries")
          .select("*")
          .eq("clerk_user_id", userId),
        supabase.from("decisions").select("*").eq("clerk_user_id", userId),
      ]);

    if (dErr) throw dErr;
    if (jErr) throw jErr;
    if (cErr) throw cErr;

    return NextResponse.json({
      pushed,
      desires: (desires ?? []).map((r) =>
        remoteToDesire(r as Record<string, unknown>, userId),
      ),
      journalEntries: (journal ?? []).map((r) =>
        remoteToJournal(r as Record<string, unknown>, userId),
      ),
      decisions: (decisions ?? []).map((r) =>
        remoteToDecision(r as Record<string, unknown>, userId),
      ),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
