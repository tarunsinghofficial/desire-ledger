/** Clerk user ids allowed to use this deploy's cloud sync + AI. */

export const REPO_URL = "https://github.com/tarunsinghofficial/desire-ledger";

export const SELF_HOST_HINT =
  "Cloud sync and AI on this demo are limited to the owner. Deploy your own instance with your Clerk, Supabase, and AI keys to unlock them.";

export function parseOwnerIds(
  raw: string | undefined = process.env.DEMO_OWNER_USER_IDS,
): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export function isDemoOwner(userId: string | null | undefined): boolean {
  if (!userId) return false;
  const owners = parseOwnerIds();
  if (owners.length === 0) return false;
  return owners.includes(userId);
}
