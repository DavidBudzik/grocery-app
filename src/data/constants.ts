import type { GroceryCategory, PantryItem, ShoppingItem, MealPlan } from "@/types";

// ── Categories ─────────────────────────────────────────────────────────────

export const CATEGORIES: GroceryCategory[] = [
  "🥦 Produce",
  "🥛 Dairy",
  "🥩 Meat",
  "🍞 Bakery",
  "🥫 Pantry",
  "🧴 Household",
  "🧊 Frozen",
];

/** Legacy bg map — kept for SheetModal compat. Use CAT_COLOR for v2 dots. */
export const CAT_BG: Record<GroceryCategory, string> = {
  "🥦 Produce":    "#e8f5e9",
  "🥛 Dairy":      "#e3f2fd",
  "🥩 Meat":       "#fce4ec",
  "🍞 Bakery":     "#fff8e1",
  "🥫 Pantry":     "#fff3e0",
  "🧴 Household":  "#f3e5f5",
  "🧊 Frozen":     "#e0f7fa",
};

/** v2 category dot colours (8px circle). */
export const CAT_COLOR: Record<GroceryCategory, string> = {
  "🥦 Produce":    "#22C55E",
  "🥛 Dairy":      "#F59E0B",
  "🥩 Meat":       "#EF4444",
  "🍞 Bakery":     "#8B5CF6",
  "🥫 Pantry":     "#F97316",
  "🧴 Household":  "#6B7280",
  "🧊 Frozen":     "#3B82F6",
};

/** Short display names (no emoji) for category tabs/tags. */
export const CAT_LABEL: Record<GroceryCategory, string> = {
  "🥦 Produce":    "Produce",
  "🥛 Dairy":      "Dairy",
  "🥩 Meat":       "Meat",
  "🍞 Bakery":     "Bakery",
  "🥫 Pantry":     "Pantry",
  "🧴 Household":  "Household",
  "🧊 Frozen":     "Frozen",
};

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type Day = (typeof DAYS)[number];

export const SCHEDULE_DAYS = ["Monday", "Wednesday", "Friday", "Sunday", "Daily"] as const;

// ── Seed Data ──────────────────────────────────────────────────────────────

export const INIT_PANTRY: PantryItem[] = [
  { id: 1, name: "Whole Milk",       category: "🥛 Dairy",   qty: 2,   unit: "L",      expiry: "Mar 18", addedBy: "David" },
  { id: 2, name: "Sourdough Bread",  category: "🍞 Bakery",  qty: 1,   unit: "loaf",   expiry: "Mar 16", addedBy: "Sarah" },
  { id: 3, name: "Cherry Tomatoes",  category: "🥦 Produce", qty: 500, unit: "g",      expiry: "Mar 20", addedBy: "David" },
  { id: 4, name: "Chicken Breast",   category: "🥩 Meat",    qty: 800, unit: "g",      expiry: "Mar 17", addedBy: "Sarah" },
  { id: 5, name: "Olive Oil",        category: "🥫 Pantry",  qty: 1,   unit: "bottle", expiry: "Dec 25", addedBy: "David" },
  { id: 6, name: "Greek Yogurt",     category: "🥛 Dairy",   qty: 3,   unit: "cups",   expiry: "Mar 22", addedBy: "Sarah" },
];

export const INIT_SHOPPING: ShoppingItem[] = [
  { id: 1, name: "Avocados",    category: "🥦 Produce", qty: 3,   unit: "pcs", checked: false, addedBy: "David" },
  { id: 2, name: "Feta Cheese", category: "🥛 Dairy",   qty: 200, unit: "g",   checked: false, addedBy: "Sarah" },
  { id: 3, name: "Pasta Penne", category: "🥫 Pantry",  qty: 500, unit: "g",   checked: true,  addedBy: "David" },
  { id: 4, name: "Spinach",     category: "🥦 Produce", qty: 1,   unit: "bag", checked: false, addedBy: "Sarah" },
];

export const INIT_MEALS: MealPlan = {
  Mon: "Grilled Chicken Salad",
  Tue: "",
  Wed: "Pasta Arrabbiata",
  Thu: "",
  Fri: "Salmon with Veggies",
  Sat: "Homemade Pizza",
  Sun: "",
};

// ── Helpers ────────────────────────────────────────────────────────────────

/** Returns expiry CSS class for v2 text-colour style. Today = Mar 16. */
export function getExpiryClass(expiry: string): string {
  if (expiry === "Mar 15" || expiry === "Mar 16") return "exp-warn";
  if (expiry === "Mar 17" || expiry === "Mar 18" || expiry === "Mar 19") return "exp-soon";
  return "exp-ok";
}

/** True if the item is expiring within ~3 days (for section grouping). */
export function isExpiringSoon(expiry: string): boolean {
  return ["Mar 15", "Mar 16", "Mar 17", "Mar 18"].includes(expiry);
}

/** Legacy — kept so SheetModal compiles without change. */
export function getExpiryBadgeClass(expiry: string): string {
  if (expiry === "Mar 15" || expiry === "Mar 16") return "badge-red";
  if (expiry === "Mar 17" || expiry === "Mar 18") return "badge-orange";
  return "badge-green";
}

/** Shows a toast for 2.6 seconds then clears it. */
let _toastTimer: ReturnType<typeof setTimeout> | undefined;
export function fireToast(setter: (msg: string) => void, msg: string): void {
  setter(msg);
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => setter(""), 2600);
}
