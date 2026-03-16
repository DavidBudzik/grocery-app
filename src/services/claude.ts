/**
 * Claude AI Service
 * All Anthropic API calls route through this file.
 * Components never call the API directly.
 *
 * Model: claude-sonnet-4-20250514
 * Max tokens: 1000 (standard) | 2000 (extended for meal planning)
 */

import type { GeneratedShoppingItem, MealPlanResponse } from "@/types";
import {
  MEAL_PLAN_SYSTEM_PROMPT,
  buildMealPlanUserMessage,
} from "@/prompts/mealPlanPrompt";

const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

// ── Helpers ────────────────────────────────────────────────────────────────

function getApiKey(): string {
  return import.meta.env.VITE_ANTHROPIC_API_KEY ?? "";
}

function stripJsonFences(text: string): string {
  return text.replace(/```json|```/g, "").trim();
}

// ── Types ──────────────────────────────────────────────────────────────────

interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

interface ClaudeRequestBody {
  model: string;
  max_tokens: number;
  system: string;
  messages: ClaudeMessage[];
}

interface ClaudeResponse {
  content?: Array<{ type: string; text?: string }>;
  error?: { message: string };
}

// ── Core Fetch ─────────────────────────────────────────────────────────────

async function callClaude(body: ClaudeRequestBody): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("VITE_ANTHROPIC_API_KEY is not set in your .env file");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      // Direct browser calls require the beta header to bypass CORS restrictions
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify(body),
  });

  const data: ClaudeResponse = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message ?? `HTTP ${res.status}`);
  }

  const text = data.content?.find((b) => b.type === "text")?.text ?? "";
  return text;
}

// ── Feature: Meal Plan → Shopping List ────────────────────────────────────

export interface GenerateShoppingListResult {
  success: boolean;
  items: GeneratedShoppingItem[];
  error?: string;
}

/**
 * Given a formatted meal plan string, asks Claude to produce a shopping list.
 * @param plan - "Mon: Grilled Chicken\nWed: Pasta" style string
 */
export async function generateShoppingList(
  plan: string
): Promise<GenerateShoppingListResult> {
  try {
    const text = await callClaude({
      model: MODEL,
      max_tokens: 2000,
      system: MEAL_PLAN_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildMealPlanUserMessage(plan) }],
    });

    const parsed: MealPlanResponse = JSON.parse(stripJsonFences(text));

    if (!Array.isArray(parsed.items)) {
      throw new Error("Response missing items array");
    }

    return { success: true, items: parsed.items };
  } catch (err) {
    console.error("[claude.ts] generateShoppingList failed:", err);
    return {
      success: false,
      items: [],
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}
