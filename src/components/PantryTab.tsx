import { useState } from "react";
import type { PantryItem, ModalState } from "@/types";
import { CATEGORIES, CAT_COLOR, CAT_LABEL, getExpiryClass, isExpiringSoon } from "@/data/constants";
import { SwipeRow } from "@/components/SwipeRow";

interface PantryTabProps {
  pantry: PantryItem[];
  setPantry: React.Dispatch<React.SetStateAction<PantryItem[]>>;
  showToast: (msg: string) => void;
  setModal: React.Dispatch<React.SetStateAction<ModalState | null>>;
}

export function PantryTab({ pantry, setPantry, showToast, setModal }: PantryTabProps) {
  const [filter, setFilter] = useState<string>("All");
  const [newItem, setNewItem] = useState("");

  const filtered = filter === "All" ? pantry : pantry.filter((i) => i.category === filter);
  const expiring = filtered.filter((i) => isExpiringSoon(i.expiry));
  const rest = filtered.filter((i) => !isExpiringSoon(i.expiry));

  const add = () => {
    if (!newItem.trim()) return;
    setPantry((p) => [
      ...p,
      {
        id: Date.now(),
        name: newItem.trim(),
        category: "🥫 Pantry",
        qty: 1,
        unit: "pcs",
        expiry: "Apr 30",
        addedBy: "David",
      },
    ]);
    setNewItem("");
    showToast("Added to pantry");
  };

  const remove = (id: number) => {
    setPantry((p) => p.filter((i) => i.id !== id));
    showToast("Removed");
  };

  return (
    <>
      {/* ── Header ── */}
      <div className="header">
        <div className="header-title">Pantry</div>
        <div className="header-sub">
          <strong>{pantry.length} items</strong>
          {expiring.length > 0 && ` · ${expiring.length} expiring soon`}
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <div className="tab-row" role="tablist" aria-label="Filter by category">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={filter === c}
            className={`tab ${filter === c ? "active" : "inactive"}`}
            onClick={() => setFilter(c as string)}
          >
            {c === "All" ? "All" : CAT_LABEL[c as keyof typeof CAT_LABEL]}
          </button>
        ))}
      </div>

      {/* ── List ── */}
      <div className="scroll-area" role="list" aria-label="Pantry items">
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🥡</div>
            <div className="empty-state-title">No items here</div>
            <div className="empty-state-sub">Add items using the field below</div>
          </div>
        )}

        {expiring.length > 0 && (
          <div className="section-head">
            <span className="section-label">Expiring soon</span>
          </div>
        )}

        {expiring.map((item) => (
          <SwipeRow
            key={item.id}
            onSwipeLeft={() => remove(item.id)}
            onSwipeRight={null}
            rightLabel="Delete"
          >
            <div
              className="item-row item-enter"
              role="listitem"
              onClick={() => setModal({ type: "pantryItem", data: item })}
              aria-label={`${item.name}, ${item.qty} ${item.unit}, expires ${item.expiry}`}
            >
              <div
                className="cat-dot"
                style={{ background: CAT_COLOR[item.category] }}
                aria-hidden="true"
              />
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-detail">
                  {item.qty} {item.unit} · {item.addedBy}
                </div>
              </div>
              <div className="item-right">
                <span
                  className={`item-expiry ${getExpiryClass(item.expiry)}`}
                  aria-label={`Expires ${item.expiry}`}
                >
                  {item.expiry}
                </span>
                <span className="item-cat-tag">{CAT_LABEL[item.category]}</span>
              </div>
            </div>
          </SwipeRow>
        ))}

        {rest.length > 0 && (
          <div className="section-head">
            <span className="section-label">
              {expiring.length > 0 ? "All items" : "Items"}
            </span>
          </div>
        )}

        {rest.map((item) => (
          <SwipeRow
            key={item.id}
            onSwipeLeft={() => remove(item.id)}
            onSwipeRight={null}
            rightLabel="Delete"
          >
            <div
              className="item-row item-enter"
              role="listitem"
              onClick={() => setModal({ type: "pantryItem", data: item })}
              aria-label={`${item.name}, ${item.qty} ${item.unit}, expires ${item.expiry}`}
            >
              <div
                className="cat-dot"
                style={{ background: CAT_COLOR[item.category] }}
                aria-hidden="true"
              />
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-detail">
                  {item.qty} {item.unit} · {item.addedBy}
                </div>
              </div>
              <div className="item-right">
                <span
                  className={`item-expiry ${getExpiryClass(item.expiry)}`}
                  aria-label={`Expires ${item.expiry}`}
                >
                  {item.expiry}
                </span>
                <span className="item-cat-tag">{CAT_LABEL[item.category]}</span>
              </div>
            </div>
          </SwipeRow>
        ))}
      </div>

      {/* ── Add Row ── */}
      <div className="add-row">
        <input
          className="add-input"
          placeholder="Add item to pantry…"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          aria-label="New pantry item name"
        />
        <button className="add-btn" onClick={add} aria-label="Add item to pantry">
          Add
        </button>
      </div>
    </>
  );
}
