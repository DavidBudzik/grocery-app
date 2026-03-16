import { useState } from "react";
import type { ShoppingItem } from "@/types";
import { CAT_LABEL } from "@/data/constants";
import { SwipeRow } from "@/components/SwipeRow";
import { CheckIcon } from "@/components/Icons";

interface ShoppingTabProps {
  shopping: ShoppingItem[];
  setShopping: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  showToast: (msg: string) => void;
}

export function ShoppingTab({ shopping, setShopping, showToast }: ShoppingTabProps) {
  const [newItem, setNewItem] = useState("");

  const pending = shopping.filter((i) => !i.checked);
  const done = shopping.filter((i) => i.checked);

  const toggle = (id: number) =>
    setShopping((s) => s.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));

  const remove = (id: number) => {
    setShopping((s) => s.filter((i) => i.id !== id));
    showToast("Removed");
  };

  const add = () => {
    if (!newItem.trim()) return;
    setShopping((s) => [
      ...s,
      {
        id: Date.now(),
        name: newItem.trim(),
        category: "🥫 Pantry",
        qty: 1,
        unit: "pcs",
        checked: false,
        addedBy: "David",
      },
    ]);
    setNewItem("");
    showToast("Added");
  };

  const clearDone = () => {
    setShopping((s) => s.filter((i) => !i.checked));
    showToast("Cleared");
  };

  return (
    <>
      {/* ── Header ── */}
      <div className="header">
        <div className="header-title">Shopping</div>
        <div className="header-sub">
          <strong>{pending.length} to buy</strong>
          {done.length > 0 && ` · ${done.length} in cart`}
        </div>
      </div>

      {/* ── List ── */}
      <div className="scroll-area">
        {shopping.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <div className="empty-state-title">List is empty</div>
            <div className="empty-state-sub">
              Add items below or generate from your meal plan
            </div>
          </div>
        )}

        {pending.length > 0 && (
          <>
            <div className="section-head">
              <span className="section-label">To buy</span>
            </div>

            {pending.map((item) => (
              <SwipeRow
                key={item.id}
                onSwipeLeft={() => remove(item.id)}
                onSwipeRight={() => toggle(item.id)}
                leftLabel="Done"
                rightLabel="Delete"
              >
                <div
                  className="item-row item-enter"
                  role="listitem"
                  aria-label={`${item.name}, ${item.qty} ${item.unit}`}
                >
                  <button
                    className="check-btn"
                    onClick={(e) => { e.stopPropagation(); toggle(item.id); }}
                    aria-label={`Mark ${item.name} as done`}
                    aria-pressed={false}
                  />
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-detail">
                      {item.qty} {item.unit} · {item.addedBy}
                    </div>
                  </div>
                  <span className="item-cat-tag">{CAT_LABEL[item.category]}</span>
                </div>
              </SwipeRow>
            ))}
          </>
        )}

        {done.length > 0 && (
          <>
            <div className="section-head">
              <span className="section-label">In cart</span>
              <button
                className="section-action"
                onClick={clearDone}
                aria-label="Clear all checked items"
              >
                Clear
              </button>
            </div>

            {done.map((item) => (
              <SwipeRow
                key={item.id}
                onSwipeLeft={() => remove(item.id)}
                rightLabel="Delete"
              >
                <div className="item-row" style={{ opacity: 0.45 }} role="listitem">
                  <button
                    className="check-btn checked"
                    onClick={(e) => { e.stopPropagation(); toggle(item.id); }}
                    aria-label={`Unmark ${item.name}`}
                    aria-pressed={true}
                  >
                    <CheckIcon />
                  </button>
                  <div className="item-info">
                    <div className="item-name checked">{item.name}</div>
                    <div className="item-detail">{item.qty} {item.unit}</div>
                  </div>
                </div>
              </SwipeRow>
            ))}
          </>
        )}
      </div>

      {/* ── Add Row ── */}
      <div className="add-row">
        <input
          className="add-input"
          placeholder="Add item…"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          aria-label="New shopping item name"
        />
        <button className="add-btn" onClick={add} aria-label="Add to list">
          Add
        </button>
      </div>
    </>
  );
}
