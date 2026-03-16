// ── Nav Icons ──────────────────────────────────────────────────────────────

interface IconProps {
  active?: boolean;
}

const ic = (active: boolean | undefined) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: active ? "#FF3B30" : "#cccccc",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function PantryIcon({ active }: IconProps) {
  return (
    <svg {...ic(active)} aria-label="Pantry">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

export function ShoppingIcon({ active }: IconProps) {
  return (
    <svg {...ic(active)} aria-label="Shopping">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

export function MealsIcon({ active }: IconProps) {
  return (
    <svg {...ic(active)} aria-label="Meals">
      <path d="M18 8h1a4 4 0 010 8h-1" />
      <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  );
}

export function AgentIcon({ active }: IconProps) {
  return (
    <svg {...ic(active)} aria-label="Agent">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6l3 3 5-5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
