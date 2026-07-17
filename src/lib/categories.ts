export const CATEGORIES = [
  { id: "travel", label: "Travel & places", hint: "Trips, cities, stays" },
  { id: "tech", label: "Tech & products", hint: "Gadgets, tools, gear" },
  { id: "lifestyle", label: "Lifestyle", hint: "Everyday upgrades" },
  { id: "health", label: "Health & fitness", hint: "Body, mind, habits" },
  { id: "learning", label: "Learning", hint: "Courses, books, skills" },
  { id: "home", label: "Home", hint: "Space and comfort" },
  { id: "experiences", label: "Experiences", hint: "Events, food, culture" },
  { id: "other", label: "Other", hint: "Anything else" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? (id || "Other");
}
