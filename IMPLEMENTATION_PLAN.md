# Grocery Manager — Implementation Plan
**Stack:** Vite + React 18 + TypeScript (strict) + Poppins + #0D0D0D/#BDFF32
**Architecture:** Multi-agent · Orchestrator → UI / DATA / AI / WEBHOOK / QA

---

## Phase 1 — Foundation (Day 1–2)

### 1.1 Project bootstrap
- [ ] `npm create vite@latest` → React + TypeScript template
- [ ] Install deps: no UI library needed (pure CSS design system)
- [ ] Configure `vite.config.ts`: path alias `@/*` → `src/*`
- [ ] Configure `tsconfig.json`: strict mode, `baseUrl`, `paths`
- [ ] Add Poppins via Google Fonts import in `src/styles/globals.css`
- [ ] Copy final `globals.css` (v2) into place

### 1.2 Type definitions (`src/types/index.ts`) ✅
All types already scaffolded:
- `GroceryCategory`, `PantryItem`, `ShoppingItem`, `MealPlan`
- `OrderPayload`, `OrderResult`, `ModalState`, `AgentContext`

### 1.3 Seed data (`src/data/constants.ts`) ✅
- `INIT_PANTRY`, `INIT_SHOPPING`, `INIT_MEALS`
- `CATEGORIES` map with category colour tokens
- `getExpiryBadgeClass()`, `fireToast()`

**Milestone:** `npm run dev` shows blank white shell with bottom nav ✓

---

## Phase 2 — State Layer (Day 2)

### 2.1 Central store (`src/hooks/useGroceryStore.ts`) ✅
All state + actions already scaffolded — wire up and verify:

| Action | Description |
|--------|-------------|
| `addPantryItem` | Adds to pantry, checks for duplicates |
| `removePantryItem` | Removes by id |
| `movePantryToShopping` | Copies expiring items to shopping list |
| `addShoppingItems` | Bulk insert from AI response |
| `toggleShoppingItem` | Checks/unchecks, moves to "in cart" |
| `clearCheckedItems` | Removes all checked from shopping list |

**Derived state to verify:** `pendingItems`, `checkedItems`, `expiringCount`, `plannedMealsCount`

**Milestone:** All state mutations work in isolation via unit tests ✓

---

## Phase 3 — UI Components (Day 3–5)

Build order: **simple → composite → tabs → modal**

### 3.1 Atoms
- [ ] `Icons.tsx` — PantryIcon, ShoppingIcon, MealsIcon, AgentIcon (inline SVG, stroke-based)
- [ ] `CatDot` — 8px coloured circle from category token
- [ ] `CheckCircle` — 26px circle, done state with lime checkmark

### 3.2 Item Row (core pattern)
```
[CatDot] [ItemInfo: name + detail] [ItemRight: expiry + category]
```
- White card, 18px radius, 12px padding, 64px min-height
- Swipe left → delete (red reveal), swipe right → move to shopping (green reveal)
- `onTouchStart/Move/End` gesture handling in `SwipeRow.tsx` ✅

### 3.3 Tab-level components (each in `src/components/`)

#### PantryTab ✅
- Header: "Pantry" + item count subtitle
- Outline tab row: All / Produce / Dairy / Meat / Bakery / Frozen / Pantry / Household
- Sections: "Expiring soon" → "All items"
- Item rows with expiry colour (green/yellow/red)
- Add row (bottom, outside scroll area)
- Empty state when no items

#### ShoppingTab ✅
- Header: "Shopping" + "X to buy · Y in cart"
- Sections: "To buy" (unchecked) / "In cart" (checked, dimmed 0.45 opacity)
- Check circle tap → toggleShoppingItem
- "Clear" action on "In cart" section head
- Add row

#### MealsTab ✅
- Header: "Meal Plan" + "X of 7 days planned this week"
- AI Banner: black card, lime CTA button, pulsing dot
- 7-day grid (2 columns): planned = black card + lime day label; empty = white card
- Tap on day → SheetModal (meal input)
- "Generate Shopping List" → calls `claude.ts` → `addShoppingItems`

#### AgentTab ✅
- Header: "Order Agent"
- Black agent card: webhook URL input, schedule chips (Mon/Wed/Fri/Sun/Daily)
- Payload preview card: dot + name + qty
- "Send Order" CTA → calls `webhook.ts`

### 3.4 SheetModal ✅
- Bottom sheet with handle, slide-up animation
- Modes: `add-pantry`, `add-shopping`, `edit-meal`
- Overlay click → dismiss

**Milestone:** All 4 tabs render with real state, swipe gestures work ✓

---

## Phase 4 — Services (Day 5–6)

### 4.1 Claude API (`src/services/claude.ts`) ✅
```
POST https://api.anthropic.com/v1/messages
Model: claude-sonnet-4-20250514
Header: anthropic-dangerous-direct-browser-access: true
Env: VITE_ANTHROPIC_API_KEY
```
- Input: meal plan textarea string
- System: `MEAL_PLAN_SYSTEM_PROMPT` (JSON-only, <400 tokens)
- Output: parsed `ShoppingItem[]`, strips markdown fences
- Error: returns `{ error: string }`, shows toast

### 4.2 Webhook (`src/services/webhook.ts`) ✅
- Builds `OrderPayload` from current shopping list
- POST with 10s timeout
- Retry once on 5xx (500ms delay), no retry on 4xx
- Returns `OrderResult { success, message, timestamp }`

### 4.3 Environment setup
Create `.env.local`:
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```
Add `.env.local` to `.gitignore` (already should be).

**Milestone:** AI generates a shopping list from a meal plan ✓

---

## Phase 5 — Polish & Production (Day 7)

### 5.1 Responsive / safe areas
- [ ] `padding-top: calc(var(--safe-top) + 8px)` on all headers
- [ ] `padding-bottom: calc(80px + var(--safe-bottom))` on `.app`
- [ ] Test at 375px (iPhone SE) and 390px (iPhone 15)

### 5.2 Animations
- [ ] Item enter: `animation: item-enter 0.15s ease forwards` with stagger
- [ ] Check circle: spring scale on check (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
- [ ] Sheet: `slideup 0.3s cubic-bezier(0.32, 0.72, 0, 1)`
- [ ] Toast: fade + translateY(-10px → 0)
- [ ] AI dot: `ai-pulse` 2s loop

### 5.3 Accessibility
- [ ] All interactive elements have `aria-label`
- [ ] Bottom nav uses `aria-current="page"` on active tab
- [ ] `role="status" aria-live="polite"` on toast
- [ ] Sheet overlay: `role="dialog"` + focus trap
- [ ] Input font size ≥ 15px (prevents iOS auto-zoom)

### 5.4 Error states
- [ ] AI API error → toast "Claude is unavailable, try again"
- [ ] Webhook 4xx → toast with status code
- [ ] Webhook 5xx (after retry) → toast "Server error, retrying..."
- [ ] Network offline → toast "No internet connection"

### 5.5 Build
```bash
npm run typecheck   # zero errors
npm run build       # dist/ with no warnings
```

**Milestone:** Zero TypeScript errors, builds clean ✓

---

## File Map

```
src/
├── types/
│   └── index.ts            ✅ All types defined
├── data/
│   └── constants.ts        ✅ Seed data + helpers
├── hooks/
│   └── useGroceryStore.ts  ✅ Central state
├── services/
│   ├── claude.ts           ✅ Anthropic API
│   └── webhook.ts          ✅ Order dispatch
├── prompts/
│   └── mealPlanPrompt.ts   ✅ System + user prompt
├── components/
│   ├── Icons.tsx           ✅ Nav icons
│   ├── SwipeRow.tsx        ✅ Touch swipe gesture
│   ├── SheetModal.tsx      ✅ Bottom sheet
│   ├── PantryTab.tsx       🔧 Needs v2 CSS class updates
│   ├── ShoppingTab.tsx     🔧 Needs v2 CSS class updates
│   ├── MealsTab.tsx        🔧 Needs v2 CSS class updates
│   └── AgentTab.tsx        🔧 Needs v2 CSS class updates
├── styles/
│   └── globals.css         ✅ v2 — Poppins, #0D0D0D/#BDFF32
├── App.tsx                 ✅ Shell + routing
└── main.tsx                ✅ Entry point

design/
├── design-preview.html     ✅ v2 — 4 screen mockups
├── style-guide.html        ✅ v2 — with light/dark toggle
└── figma-component-library-prompt.md
```

---

## Next Immediate Steps

1. **Update the 4 tab components** to use v2 CSS classes (`cat-dot`, `item-right`, `tab`, `tab-row`, `agent-card`, etc.) — replacing the old `item-icon`, `badge`, `stat-pill` patterns
2. **Wire `useGroceryStore`** into each tab and verify all state actions
3. **Test the Claude service** with a real API key
4. **Run `npm run dev`** and QA all 4 tabs on a mobile viewport

---

## Key Constraints

| Rule | Value |
|------|-------|
| Min touch target | 44×44px |
| Min input font | 15px (iOS zoom prevention) |
| Primary viewport | 390px (iPhone 15) |
| Max content width | 430px |
| Height unit | `100dvh` (not `100vh`) |
| Bottom padding | `calc(80px + env(safe-area-inset-bottom))` |
| Lime accent usage | Sparse — only active state, AI elements, CTA |
