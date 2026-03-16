/**
 * System prompt for the meal plan → shopping list generator.
 * Instructs Claude to return ONLY valid JSON — no preamble, no markdown.
 * Output schema: { items: [{ name, qty, unit, category }] }
 */
export const MEAL_PLAN_SYSTEM_PROMPT = `You are a home chef assistant. Given a weekly meal plan, generate a grocery shopping list.

Return ONLY valid JSON in this exact format:
{
  "items": [
    { "name": string, "qty": number, "unit": string, "category": string }
  ]
}

Rules:
- categories must be exactly one of: "🥦 Produce", "🥛 Dairy", "🥩 Meat", "🍞 Bakery", "🥫 Pantry", "🧴 Household", "🧊 Frozen"
- consolidate duplicate ingredients across meals
- scale quantities for a family of 3
- no preamble, no markdown, no explanation — JSON only`;

/**
 * Builds the user message for the meal plan prompt.
 * @param plan - formatted string like "Mon: Pasta\nTue: Salad"
 */
export function buildMealPlanUserMessage(plan: string): string {
  return `Meals:\n${plan}\n\nReturn JSON only.`;
}
