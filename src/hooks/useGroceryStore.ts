import { useState, useCallback } from "react";
import type { PantryItem, ShoppingItem, MealPlan } from "@/types";
import {
  INIT_PANTRY,
  INIT_SHOPPING,
  INIT_MEALS,
  fireToast,
} from "@/data/constants";

/**
 * Central state store for the grocery app.
 * Owns pantry, shopping, meals, and toast state.
 * All state lives here; props drill down to components.
 */
export function useGroceryStore() {
  const [pantry, setPantry] = useState<PantryItem[]>(INIT_PANTRY);
  const [shopping, setShopping] = useState<ShoppingItem[]>(INIT_SHOPPING);
  const [meals, setMeals] = useState<MealPlan>(INIT_MEALS);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = useCallback((msg: string) => {
    fireToast(setToastMsg, msg);
  }, []);

  // ── Pantry Actions ───────────────────────────────────────────────────────

  const addPantryItem = useCallback(
    (item: Omit<PantryItem, "id">) => {
      setPantry((p) => [...p, { ...item, id: Date.now() }]);
    },
    []
  );

  const removePantryItem = useCallback((id: number) => {
    setPantry((p) => p.filter((i) => i.id !== id));
  }, []);

  const movePantryToShopping = useCallback((item: PantryItem) => {
    setShopping((s) => [
      ...s,
      {
        id: Date.now(),
        name: item.name,
        category: item.category,
        qty: item.qty,
        unit: item.unit,
        checked: false,
        addedBy: item.addedBy,
      },
    ]);
    setPantry((p) => p.filter((i) => i.id !== item.id));
  }, []);

  // ── Shopping Actions ─────────────────────────────────────────────────────

  const addShoppingItem = useCallback(
    (item: Omit<ShoppingItem, "id">) => {
      setShopping((s) => [...s, { ...item, id: Date.now() }]);
    },
    []
  );

  const addShoppingItems = useCallback(
    (items: Omit<ShoppingItem, "id">[]) => {
      setShopping((s) => {
        const existing = s.map((x) => x.name.toLowerCase());
        const fresh = items
          .filter((x) => !existing.includes(x.name.toLowerCase()))
          .map((item, idx) => ({ ...item, id: Date.now() + idx }));
        return [...s, ...fresh];
      });
    },
    []
  );

  const removeShoppingItem = useCallback((id: number) => {
    setShopping((s) => s.filter((i) => i.id !== id));
  }, []);

  const toggleShoppingItem = useCallback((id: number) => {
    setShopping((s) =>
      s.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  }, []);

  const clearCheckedItems = useCallback(() => {
    setShopping((s) => s.filter((i) => !i.checked));
  }, []);

  // ── Derived State ────────────────────────────────────────────────────────

  const pendingItems = shopping.filter((i) => !i.checked);
  const checkedItems = shopping.filter((i) => i.checked);
  const expiringCount = pantry.filter((i) =>
    ["Mar 15", "Mar 16", "Mar 17", "Mar 18"].includes(i.expiry)
  ).length;
  const plannedMealsCount = Object.values(meals).filter(Boolean).length;

  return {
    // State
    pantry,
    setPantry,
    shopping,
    setShopping,
    meals,
    setMeals,
    toastMsg,

    // Actions
    showToast,
    addPantryItem,
    removePantryItem,
    movePantryToShopping,
    addShoppingItem,
    addShoppingItems,
    removeShoppingItem,
    toggleShoppingItem,
    clearCheckedItems,

    // Derived
    pendingItems,
    checkedItems,
    expiringCount,
    plannedMealsCount,
  };
}
