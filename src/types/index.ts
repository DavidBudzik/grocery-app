// ── Agent System Types ─────────────────────────────────────────────────────

export type AgentId = "UI" | "DATA" | "AI" | "WEBHOOK" | "QA" | "ORCHESTRATOR";

// ── Domain Types ───────────────────────────────────────────────────────────

export type GroceryCategory =
  | "🥦 Produce"
  | "🥛 Dairy"
  | "🥩 Meat"
  | "🍞 Bakery"
  | "🥫 Pantry"
  | "🧴 Household"
  | "🧊 Frozen";

export type FamilyMember = "David" | "Sarah" | "Kids";

export type ScheduleDay = "Monday" | "Wednesday" | "Friday" | "Sunday" | "Daily";

// ── Data Models ────────────────────────────────────────────────────────────

export interface PantryItem {
  id: number;
  name: string;
  category: GroceryCategory;
  qty: number;
  unit: string;
  expiry: string; // "Mar 18" format
  addedBy: FamilyMember;
}

export interface ShoppingItem {
  id: number;
  name: string;
  category: GroceryCategory;
  qty: number;
  unit: string;
  checked: boolean;
  addedBy: FamilyMember | "AI ✨";
}

export interface MealPlan {
  [day: string]: string;
}

// ── Webhook / Order Types ──────────────────────────────────────────────────

export interface OrderItem {
  name: string;
  qty: number;
  unit: string;
  category: GroceryCategory;
}

export interface OrderPayload {
  version: "1.0";
  timestamp: string;
  schedule: ScheduleDay;
  household: string;
  items: OrderItem[];
  total_items: number;
  metadata: {
    generated_by: "manual" | "scheduled";
    meal_plan_linked: boolean;
  };
}

export interface OrderResult {
  success: boolean;
  statusCode: number;
  timestamp: string;
  error?: string;
}

export interface LogEntry {
  t: string;
  msg: string;
  type: "ok" | "err" | "";
}

// ── AI / Claude Types ──────────────────────────────────────────────────────

export interface GeneratedShoppingItem {
  name: string;
  qty: number;
  unit: string;
  category: GroceryCategory;
}

export interface MealPlanResponse {
  items: GeneratedShoppingItem[];
}

// ── Modal / Sheet Types ────────────────────────────────────────────────────

export type ModalType = "pantryItem";

export interface ModalState {
  type: ModalType;
  data: PantryItem;
}

// ── Agent Context Types (from AGENTS.md) ──────────────────────────────────

export interface AgentContext {
  task: string;
  agentId: AgentId;
  files: string[];
  inputContract: Record<string, unknown>;
  outputContract: Record<string, unknown>;
  constraints: string[];
  priority: "low" | "medium" | "high";
  handoffTo?: AgentId;
}

export interface AgentHandoff {
  from: AgentId;
  to: AgentId;
  completedTask: string;
  artifacts: {
    files: string[];
    types?: string[];
    components?: string[];
  };
  notes: string;
}
