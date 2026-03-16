/**
 * Webhook / Order Service
 * Handles dispatch of shopping list payloads to external ordering agents.
 *
 * Rules:
 * - POST with Content-Type: application/json
 * - Only unchecked items in payload
 * - 1 retry on network failure (500ms delay)
 * - No retry on 4xx — surface immediately
 * - 10 second timeout
 * - Logs ring buffer capped at 10 entries
 */

import type { ShoppingItem, ScheduleDay, OrderPayload, OrderResult } from "@/types";

interface WebhookConfig {
  url: string;
  schedule: ScheduleDay;
}

const TIMEOUT_MS = 10_000;
const RETRY_DELAY_MS = 500;

// ── Helpers ────────────────────────────────────────────────────────────────

function buildPayload(
  items: ShoppingItem[],
  config: WebhookConfig
): OrderPayload {
  return {
    version: "1.0",
    timestamp: new Date().toISOString(),
    schedule: config.schedule,
    household: "Family Grocery",
    items: items.map(({ name, qty, unit, category }) => ({ name, qty, unit, category })),
    total_items: items.length,
    metadata: {
      generated_by: "manual",
      meal_plan_linked: false,
    },
  };
}

async function postWithTimeout(url: string, payload: OrderPayload): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

// ── Main Export ────────────────────────────────────────────────────────────

/**
 * Dispatches the order payload to the configured webhook endpoint.
 * Retries once on network failure. Never retries on 4xx.
 */
export async function dispatchOrder(
  items: ShoppingItem[],
  config: WebhookConfig
): Promise<OrderResult> {
  if (items.length === 0) {
    return {
      success: false,
      statusCode: 0,
      timestamp: new Date().toISOString(),
      error: "Cannot dispatch an empty order",
    };
  }

  const payload = buildPayload(items, config);
  let lastError: string | undefined;
  let attempt = 0;

  while (attempt < 2) {
    try {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      }

      const res = await postWithTimeout(config.url, payload);

      if (res.ok) {
        return {
          success: true,
          statusCode: res.status,
          timestamp: new Date().toISOString(),
        };
      }

      // 4xx — don't retry
      if (res.status >= 400 && res.status < 500) {
        return {
          success: false,
          statusCode: res.status,
          timestamp: new Date().toISOString(),
          error: `Client error ${res.status} — check your endpoint URL`,
        };
      }

      // 5xx — allow one retry
      lastError = `Server error ${res.status}`;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        lastError = "Request timed out after 10 seconds";
        break; // don't retry on timeout
      }
      lastError = err instanceof Error ? err.message : "Network error";
    }

    attempt++;
  }

  return {
    success: false,
    statusCode: 0,
    timestamp: new Date().toISOString(),
    error: lastError ?? "Unknown error",
  };
}
