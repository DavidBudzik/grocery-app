import { useState } from "react";
import type { ModalState } from "@/types";
import { useGroceryStore } from "@/hooks/useGroceryStore";
import { PantryTab } from "@/components/PantryTab";
import { ShoppingTab } from "@/components/ShoppingTab";
import { MealsTab } from "@/components/MealsTab";
import { AgentTab } from "@/components/AgentTab";
import { SheetModal } from "@/components/SheetModal";
import { PantryIcon, ShoppingIcon, MealsIcon, AgentIcon } from "@/components/Icons";

// ── Tab Definition ─────────────────────────────────────────────────────────

type TabId = "pantry" | "shopping" | "meals" | "agent";

const TABS: Array<{
  id: TabId;
  label: string;
  Icon: React.FC<{ active?: boolean }>;
}> = [
  { id: "pantry",   label: "Pantry",   Icon: PantryIcon },
  { id: "shopping", label: "Shopping", Icon: ShoppingIcon },
  { id: "meals",    label: "Meals",    Icon: MealsIcon },
  { id: "agent",    label: "Agent",    Icon: AgentIcon },
];

// ── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState<TabId>("pantry");
  const [modal, setModal] = useState<ModalState | null>(null);

  const store = useGroceryStore();

  return (
    <div className="app">
      {/* Toast */}
      {store.toastMsg && (
        <div className="toast" role="status" aria-live="polite">
          {store.toastMsg}
        </div>
      )}

      {/* Tab Content */}
      {tab === "pantry" && (
        <PantryTab
          pantry={store.pantry}
          setPantry={store.setPantry}
          showToast={store.showToast}
          setModal={setModal}
        />
      )}
      {tab === "shopping" && (
        <ShoppingTab
          shopping={store.shopping}
          setShopping={store.setShopping}
          showToast={store.showToast}
        />
      )}
      {tab === "meals" && (
        <MealsTab
          meals={store.meals}
          setMeals={store.setMeals}
          setShopping={store.setShopping}
          showToast={store.showToast}
        />
      )}
      {tab === "agent" && (
        <AgentTab
          shopping={store.shopping}
          showToast={store.showToast}
        />
      )}

      {/* Sheet Modal */}
      {modal && (
        <SheetModal
          modal={modal}
          setModal={setModal}
          pantry={store.pantry}
          setPantry={store.setPantry}
          shopping={store.shopping}
          setShopping={store.setShopping}
          showToast={store.showToast}
        />
      )}

      {/* Bottom Navigation */}
      <nav className="bottom-nav" aria-label="Main navigation">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`nav-item ${tab === id ? "active" : ""}`}
            onClick={() => setTab(id)}
            aria-label={label}
            aria-current={tab === id ? "page" : undefined}
          >
            <div className="nav-icon">
              <Icon active={tab === id} />
            </div>
            <span className="nav-label">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
