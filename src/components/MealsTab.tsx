import { useState } from "react";
import type { MealPlan, ShoppingItem } from "@/types";
import { DAYS } from "@/data/constants";
import { generateShoppingList } from "@/services/claude";

interface MealsTabProps {
  meals: MealPlan;
  setMeals: React.Dispatch<React.SetStateAction<MealPlan>>;
  setShopping: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  showToast: (msg: string) => void;
}

export function MealsTab({ meals, setMeals, setShopping, showToast }: MealsTabProps) {
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [editDay, setEditDay] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  const count = Object.values(meals).filter(Boolean).length;

  const generate = async () => {
    const plan = Object.entries(meals)
      .filter(([, v]) => v)
      .map(([d, m]) => `${d}: ${m}`)
      .join("\n");

    if (!plan) {
      showToast("Add meals first");
      return;
    }

    setLoading(true);
    setAiText("");

    const result = await generateShoppingList(plan);

    if (result.success && result.items.length > 0) {
      const items: ShoppingItem[] = result.items.map((i, idx) => ({
        id: Date.now() + idx,
        name: i.name,
        qty: i.qty,
        unit: i.unit,
        category: i.category,
        checked: false,
        addedBy: "AI ✨",
      }));

      setShopping((s) => {
        const existing = s.map((x) => x.name.toLowerCase());
        return [...s, ...items.filter((x) => !existing.includes(x.name.toLowerCase()))];
      });

      setAiText(`Added ${items.length} ingredients from ${count} planned meals.`);
      showToast(`${items.length} items added to shopping`);
    } else {
      setAiText(result.error ?? "Something went wrong — please try again.");
    }

    setLoading(false);
  };

  const openEdit = (day: string) => {
    setEditDay(day);
    setEditVal(meals[day] ?? "");
  };

  const saveEdit = () => {
    if (!editDay) return;
    setMeals((m) => ({ ...m, [editDay]: editVal }));
    setEditDay(null);
  };

  const removeEdit = () => {
    if (!editDay) return;
    setMeals((m) => ({ ...m, [editDay]: "" }));
    setEditDay(null);
  };

  return (
    <>
      {/* ── Header ── */}
      <div className="header">
        <div className="header-title">Meal Plan</div>
        <div className="header-sub">
          <strong>{count} of 7 days</strong> planned this week
        </div>
      </div>

      {/* ── AI Banner ── */}
      <div className="ai-banner" aria-live="polite" aria-label="AI Assistant">
        <div className="ai-eyebrow">
          <div className="ai-pulse" aria-hidden="true" />
          <span className="ai-tag">Claude AI</span>
        </div>

        {loading ? (
          <div className="ai-text" style={{ display: "flex", gap: 5, alignItems: "center", paddingTop: 2 }}>
            <span style={{ opacity: 0.6 }}>Generating your shopping list</span>
            <span style={{ letterSpacing: 2 }}>...</span>
          </div>
        ) : (
          <div className="ai-text">
            {aiText ||
              "Plan your meals for the week and I'll generate a complete shopping list automatically."}
          </div>
        )}

        <button
          className="btn btn-full btn-lime"
          style={{ marginTop: 14 }}
          onClick={generate}
          disabled={loading || count === 0}
          aria-label={`Generate shopping list from ${count} planned meals`}
        >
          {loading
            ? "Generating…"
            : `✦ Generate Shopping List${count > 0 ? ` (${count} meals)` : ""}`}
        </button>
      </div>

      {/* ── Weekly Grid ── */}
      <div className="scroll-area">
        <div className="section-head">
          <span className="section-label">This week · tap to plan</span>
        </div>

        <div className="meal-grid" role="list" aria-label="Weekly meal plan">
          {DAYS.map((day) => (
            <div
              key={day}
              role="listitem"
              className={`meal-card ${meals[day] ? "planned" : ""}`}
              onClick={() => openEdit(day)}
              aria-label={meals[day] ? `${day}: ${meals[day]}` : `${day}: No meal planned`}
            >
              <div className="meal-card-day">{day}</div>
              {meals[day] ? (
                <div className="meal-card-name">{meals[day]}</div>
              ) : (
                <div className="meal-card-empty">+ Add meal</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Edit Sheet ── */}
      {editDay && (
        <div
          className="sheet-overlay"
          onClick={() => setEditDay(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Edit ${editDay}'s meal`}
        >
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" aria-hidden="true" />
            <div className="sheet-title">{editDay}'s Meal</div>
            <input
              className="add-input"
              style={{ width: "100%", marginBottom: 14, borderRadius: 14 }}
              placeholder="e.g. Pasta Bolognese"
              value={editVal}
              onChange={(e) => setEditVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              autoFocus
              aria-label="Meal name"
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={saveEdit}
                aria-label="Save meal"
              >
                Save
              </button>
              {meals[editDay] && (
                <button
                  className="btn btn-danger"
                  onClick={removeEdit}
                  aria-label="Remove meal"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
