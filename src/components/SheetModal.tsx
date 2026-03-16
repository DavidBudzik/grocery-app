import type { ModalState, PantryItem, ShoppingItem } from "@/types";
import { CAT_COLOR, CAT_LABEL, getExpiryClass } from "@/data/constants";

interface SheetModalProps {
  modal: ModalState;
  setModal: React.Dispatch<React.SetStateAction<ModalState | null>>;
  pantry: PantryItem[];
  setPantry: React.Dispatch<React.SetStateAction<PantryItem[]>>;
  shopping: ShoppingItem[];
  setShopping: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  showToast: (msg: string) => void;
}

export function SheetModal({
  modal,
  setModal,
  setPantry,
  setShopping,
  showToast,
}: SheetModalProps) {
  const close = () => setModal(null);
  const { type, data } = modal;

  if (type === "pantryItem") {
    const remove = () => {
      setPantry((p) => p.filter((i) => i.id !== data.id));
      showToast("Removed");
      close();
    };

    const moveToShopping = () => {
      setShopping((s) => [
        ...s,
        {
          id: Date.now(),
          name: data.name,
          category: data.category,
          qty: data.qty,
          unit: data.unit,
          checked: false,
          addedBy: data.addedBy,
        },
      ]);
      setPantry((p) => p.filter((i) => i.id !== data.id));
      showToast("Moved to shopping");
      close();
    };

    return (
      <div
        className="sheet-overlay"
        onClick={close}
        role="dialog"
        aria-modal="true"
        aria-label={`${data.name} details`}
      >
        <div className="sheet" onClick={(e) => e.stopPropagation()}>
          <div className="sheet-handle" aria-hidden="true" />

          {/* ── Item header ── */}
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 22 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: CAT_COLOR[data.category] + "22",
                border: `2px solid ${CAT_COLOR[data.category]}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: CAT_COLOR[data.category],
                }}
              />
            </div>
            <div>
              <div className="sheet-title" style={{ marginBottom: 2 }}>
                {data.name}
              </div>
              <div style={{ fontSize: 12, color: "#aaa", fontWeight: 500 }}>
                {CAT_LABEL[data.category]} · {data.addedBy}
              </div>
            </div>
          </div>

          {/* ── Detail rows ── */}
          <div
            style={{
              background: "#F7F7F7",
              borderRadius: 16,
              padding: "4px 0",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 18px",
                borderBottom: "1px solid #EFEFEF",
              }}
            >
              <span style={{ fontSize: 13, color: "#aaa", fontWeight: 500 }}>Quantity</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>
                {data.qty} {data.unit}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 18px",
              }}
            >
              <span style={{ fontSize: 13, color: "#aaa", fontWeight: 500 }}>Best before</span>
              <span
                className={`item-expiry ${getExpiryClass(data.expiry)}`}
                aria-label={`Expires ${data.expiry}`}
              >
                {data.expiry}
              </span>
            </div>
          </div>

          {/* ── Actions ── */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn btn-ghost"
              style={{ flex: 1 }}
              onClick={moveToShopping}
              aria-label={`Move ${data.name} to shopping list`}
            >
              Move to Shopping
            </button>
            <button
              className="btn btn-danger"
              onClick={remove}
              aria-label={`Remove ${data.name} from pantry`}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
