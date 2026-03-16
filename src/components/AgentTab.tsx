import { useState } from "react";
import type { ShoppingItem, ScheduleDay, LogEntry } from "@/types";
import { SCHEDULE_DAYS, CAT_COLOR } from "@/data/constants";
import { dispatchOrder } from "@/services/webhook";

interface AgentTabProps {
  shopping: ShoppingItem[];
  showToast: (msg: string) => void;
}

export function AgentTab({ shopping, showToast }: AgentTabProps) {
  const [url, setUrl] = useState("https://your-agent-endpoint.com/order");
  const [schedule, setSchedule] = useState<ScheduleDay>("Friday");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const pending = shopping.filter((i) => !i.checked);

  const addLog = (msg: string, type: LogEntry["type"] = "") => {
    const t = new Date().toLocaleTimeString();
    setLogs((l) => [...l.slice(-7), { t, msg, type }]);
  };

  const trigger = async () => {
    if (pending.length === 0) return;
    setLoading(true);
    addLog(`→ Dispatching to ${url.slice(0, 36)}…`);
    addLog(`→ ${pending.length} items in payload`);

    const result = await dispatchOrder(pending, { url, schedule });

    if (result.success) {
      addLog("✓ Order dispatched successfully", "ok");
      addLog(`✓ Scheduled: every ${schedule}`, "ok");
      showToast("Order sent!");
    } else {
      addLog(`✗ Failed: ${result.error ?? "Unknown error"}`, "err");
      showToast("Order failed");
    }

    setLoading(false);
  };

  const copy = () => {
    const payload = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      schedule,
      household: "Family Grocery",
      items: pending.map((i) => ({
        name: i.name,
        qty: i.qty,
        unit: i.unit,
        category: i.category,
      })),
      total_items: pending.length,
      metadata: { generated_by: "manual", meal_plan_linked: false },
    };
    navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
    showToast("JSON copied");
  };

  return (
    <>
      {/* ── Header ── */}
      <div className="header">
        <div className="header-title">Order Agent</div>
        <div className="header-sub">Automated grocery ordering</div>
      </div>

      <div className="scroll-area" style={{ overflowY: "auto" }}>
        {/* ── Webhook Config Card ── */}
        <div className="agent-card">
          <div className="agent-title">Webhook Endpoint</div>
          <div className="agent-sub">
            Sends your unchecked shopping list as JSON to your ordering agent on schedule.
          </div>
          <input
            className="agent-url-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            aria-label="Webhook endpoint URL"
          />

          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#444",
              textTransform: "uppercase",
              letterSpacing: "1px",
              margin: "12px 0 7px",
            }}
          >
            Schedule
          </div>

          <div className="sched-row" role="group" aria-label="Dispatch schedule">
            {SCHEDULE_DAYS.map((s) => (
              <button
                key={s}
                className={`sched-chip ${schedule === s ? "active" : ""}`}
                onClick={() => setSchedule(s as ScheduleDay)}
                aria-pressed={schedule === s}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            className="btn btn-full btn-lime"
            style={{ marginTop: 14 }}
            onClick={trigger}
            disabled={loading || pending.length === 0}
            aria-label={`Send order with ${pending.length} items`}
          >
            {loading ? "Sending…" : `Send Order · ${pending.length} items`}
          </button>
        </div>

        {/* ── Payload Preview ── */}
        <div className="payload-card">
          <div className="payload-header">
            <span className="payload-label">Payload Preview</span>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 10, padding: "4px 10px", minHeight: "auto", borderRadius: 8 }}
              onClick={copy}
              aria-label="Copy order JSON to clipboard"
            >
              Copy JSON
            </button>
          </div>

          {pending.slice(0, 4).map((item) => (
            <div key={item.id} className="payload-item">
              <div
                className="cat-dot"
                style={{ background: CAT_COLOR[item.category] ?? "#aaa" }}
                aria-hidden="true"
              />
              <span className="payload-name">{item.name}</span>
              <span className="payload-qty">
                {item.qty} {item.unit}
              </span>
            </div>
          ))}

          {pending.length > 4 && (
            <div style={{ padding: "8px 18px 12px", color: "#aaa", fontSize: 11, fontWeight: 500 }}>
              +{pending.length - 4} more items…
            </div>
          )}

          {pending.length === 0 && (
            <div style={{ padding: "20px 18px", color: "#aaa", fontSize: 12, textAlign: "center" }}>
              Shopping list is empty
            </div>
          )}
        </div>

        {/* ── Activity Log ── */}
        {logs.length > 0 && (
          <div className="log-card" aria-live="polite" aria-label="Activity log">
            <div className="log-card-header">Activity Log</div>
            {logs.map((l, i) => (
              <div key={i} className={`log-line ${l.type}`}>
                [{l.t}] {l.msg}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
