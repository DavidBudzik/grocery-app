# Figma Component Library — Claude Code Prompt
## Grocery Manager · Grocerya-Inspired Design System

> **Before running:**
> 1. The file ID from your Figma link is **`JNEZ71l9Mzw4C93NJ3WOrb`** (Grocerya community file).
>    Community files are **read-only** — you must **duplicate it first** (File → Duplicate to drafts)
>    and use the new file's ID from the duplicated URL.
> 2. Add your `FIGMA_TOKEN` (personal access token) to `.env`.
> 3. Requires **Figma Professional plan or above** for the Variables API.
> 4. Replace `YOUR_FILE_ID` below with the ID of your duplicated file.

---

```
You are building a production-ready Figma component library for the Grocery Manager
mobile app inside an existing Figma file.

Design language: Grocerya-inspired — Poppins font, #0D0D0D black primary,
#BDFF32 lime-green accent, clean white surfaces, pill-shaped buttons.

FILE_ID: YOUR_FILE_ID

---

## SETUP

1. Create a new directory: `figma-lib/`
2. Run: npm init -y && npm install axios dotenv
3. Create `.env`:
   FIGMA_TOKEN=your_personal_access_token_here
   FILE_ID=YOUR_FILE_ID
4. Create three scripts:
   - figma-lib/createVariables.js   (Phase 1)
   - figma-lib/createComponents.js  (Phases 2 + 3)
   - figma-lib/index.js             (runs both in sequence)
5. Each script: require('dotenv').config()
6. Every API call: log operation name before, log created ID on success,
   log full error body on failure and continue (never crash on a single failure)
7. Print final summary: variables created | components created | failures

Base URL for all requests: https://api.figma.com/v1
Auth header: X-Figma-Token: process.env.FIGMA_TOKEN

---

## PHASE 1 — FIGMA VARIABLES  (createVariables.js)

Use POST /v1/files/:file_id/variables

### Collection 1: "Primitives"

Purpose: raw scale values — never referenced directly in components.
All variables use a single mode named "Value".

#### COLOR primitives

| Variable name            | Hex value   |
|--------------------------|-------------|
| Color/Black              | #0D0D0D     |
| Color/Lime               | #BDFF32     |
| Color/Green              | #2DB217     |
| Color/Yellow             | #EAB600     |
| Color/Red                | #EE4747     |
| Color/Grey/text          | #777777     |
| Color/Grey/accent        | #F2F2F3     |
| Color/Grey/accent2       | #CCCCCC     |
| Color/Grey/basic         | #F8F8F8     |
| Color/White              | #FFFFFF     |
| Color/Badge/lime-bg      | #EEFFB3     |
| Color/Badge/green-bg     | #E5FFE0     |
| Color/Badge/green-text   | #1A7A0A     |
| Color/Badge/yellow-bg    | #FFF3CC     |
| Color/Badge/yellow-text  | #7A5E00     |
| Color/Badge/red-bg       | #FFE5E5     |
| Color/Badge/red-text     | #C62828     |
| Color/Badge/grey-bg      | #F2F2F3     |
| Color/Nav/active-bg      | #0D0D0D     |
| Color/Nav/inactive       | #CCCCCC     |

#### FLOAT primitives

| Variable name            | Value  |
|--------------------------|--------|
| Spacing/4                | 4      |
| Spacing/8                | 8      |
| Spacing/12               | 12     |
| Spacing/16               | 16     |
| Spacing/20               | 20     |
| Spacing/24               | 24     |
| Spacing/32               | 32     |
| Spacing/48               | 48     |
| Spacing/64               | 64     |
| Radius/sm                | 8      |
| Radius/md                | 12     |
| Radius/card              | 14     |
| Radius/lg                | 18     |
| Radius/sheet             | 24     |
| Radius/pill              | 999    |
| Typography/size/xs       | 9      |
| Typography/size/sm       | 10     |
| Typography/size/body     | 11     |
| Typography/size/md       | 13     |
| Typography/size/input    | 15     |
| Typography/size/lg       | 18     |
| Typography/size/xl       | 22     |
| Typography/size/2xl      | 26     |
| Typography/size/display  | 42     |
| Typography/weight/regular  | 400  |
| Typography/weight/medium   | 500  |
| Typography/weight/semibold | 600  |
| Typography/weight/bold     | 700  |
| Typography/weight/extrabold| 800  |

#### STRING primitives

| Variable name          | Value    |
|------------------------|----------|
| Font/primary           | Poppins  |

---

### Collection 2: "Semantic"

Purpose: functional token names aliased to Primitive variable IDs.
Two modes: "Light" and "Dark".

All values must use `{ type: "VARIABLE_ALIAS", id: "<primitive_variable_id>" }`.
Do NOT hardcode hex values in the Semantic collection.

Map the following semantic tokens:

#### Color / Background

| Semantic token              | Light alias          | Dark alias           |
|-----------------------------|----------------------|----------------------|
| Color/background/app        | Color/Grey/basic     | Color/Black          |
| Color/background/surface    | Color/White          | Color/Grey/text      |
| Color/background/input      | Color/Grey/accent    | Color/Grey/text      |
| Color/background/inverse    | Color/Black          | Color/White          |

#### Color / Text

| Semantic token              | Light alias          | Dark alias           |
|-----------------------------|----------------------|----------------------|
| Color/text/primary          | Color/Black          | Color/White          |
| Color/text/secondary        | Color/Grey/text      | Color/Grey/accent    |
| Color/text/tertiary         | Color/Grey/accent2   | Color/Grey/text      |
| Color/text/inverse          | Color/White          | Color/Black          |
| Color/text/on-lime          | Color/Black          | Color/Black          |

#### Color / Brand

| Semantic token              | Light alias          | Dark alias           |
|-----------------------------|----------------------|----------------------|
| Color/brand/primary         | Color/Black          | Color/White          |
| Color/brand/accent          | Color/Lime           | Color/Lime           |
| Color/brand/accent-on-dark  | Color/Lime           | Color/Lime           |

#### Color / Status

| Semantic token              | Light alias          | Dark alias           |
|-----------------------------|----------------------|----------------------|
| Color/status/success        | Color/Green          | Color/Green          |
| Color/status/warning        | Color/Yellow         | Color/Yellow         |
| Color/status/danger         | Color/Red            | Color/Red            |

#### Color / Badge

| Semantic token              | Light alias              | Dark alias              |
|-----------------------------|--------------------------|-------------------------|
| Color/badge/lime-bg         | Color/Badge/lime-bg      | Color/Badge/lime-bg     |
| Color/badge/lime-text       | Color/Black              | Color/Black             |
| Color/badge/green-bg        | Color/Badge/green-bg     | Color/Badge/green-bg    |
| Color/badge/green-text      | Color/Badge/green-text   | Color/Badge/green-text  |
| Color/badge/yellow-bg       | Color/Badge/yellow-bg    | Color/Badge/yellow-bg   |
| Color/badge/yellow-text     | Color/Badge/yellow-text  | Color/Badge/yellow-text |
| Color/badge/red-bg          | Color/Badge/red-bg       | Color/Badge/red-bg      |
| Color/badge/red-text        | Color/Badge/red-text     | Color/Badge/red-text    |
| Color/badge/grey-bg         | Color/Badge/grey-bg      | Color/Badge/grey-bg     |
| Color/badge/grey-text       | Color/Grey/text          | Color/Grey/text         |

#### Color / Border

| Semantic token              | Light alias          | Dark alias           |
|-----------------------------|----------------------|----------------------|
| Color/border/default        | Color/Grey/accent    | Color/Grey/text      |

#### Color / Nav

| Semantic token              | Light alias          | Dark alias           |
|-----------------------------|----------------------|----------------------|
| Color/nav/active-bg         | Color/Nav/active-bg  | Color/White          |
| Color/nav/active-icon       | Color/Lime           | Color/Black          |
| Color/nav/inactive          | Color/Nav/inactive   | Color/Grey/text      |
| Color/nav/surface           | Color/White          | Color/Black          |

#### Spacing (alias Primitives 1:1)

Semantic/spacing/4 → Spacing/4
Semantic/spacing/8 → Spacing/8
Semantic/spacing/12 → Spacing/12
Semantic/spacing/16 → Spacing/16
Semantic/spacing/20 → Spacing/20
Semantic/spacing/24 → Spacing/24

#### Radius (alias Primitives 1:1)

Semantic/radius/sm      → Radius/sm
Semantic/radius/md      → Radius/md
Semantic/radius/card    → Radius/card
Semantic/radius/lg      → Radius/lg
Semantic/radius/sheet   → Radius/sheet
Semantic/radius/button  → Radius/pill

---

## PHASE 2 — PAGE STRUCTURE  (createComponents.js, part 1)

Create a new page named "🧩 Components" in the file.

POST /v1/files/:file_id/pages  (or use the mutations endpoint)

Lay out labeled section frames on an 8px grid.
Each section is a FRAME node with fills: Color/background/app (use hex #F8F8F8 for
creation since boundVariables for frame fills requires the variable IDs from Phase 1).

Section layout:
- Section frames: 1200px wide, auto height
- Horizontal gap between sections: 80px
- Vertical gap between sections: 120px
- Section label text: Poppins 11px weight 700 uppercase, color #777777

Sections to create (in order, top to bottom):

01 · Foundations
  - Color swatches: 9 swatches (60×60px each), 12px gap, labeled below
  - Type ramp: 7 text examples from Display down to Badge
  - Spacing scale: visual bar chart representation

02 · Buttons
  - All Button variants × all states (see Phase 3 specs)

03 · Form Controls
  - Input field: Default | Focus | Error | Disabled | With icon

04 · Badges & Tags
  - All badge variants (lime, green, yellow, red, grey, black)
  - Category filter chips (active, inactive)

05 · Item Cards
  - Item list card variants
  - Stat card variants

06 · Bottom Navigation
  - All 4 tabs, each in active state, plus full nav bar preview

---

## PHASE 3 — COMPONENT SPECS  (createComponents.js, part 2)

All components: type "COMPONENT", placed inside section frames from Phase 2.
All fills/strokes/radii: use boundVariables referencing Semantic variable IDs where
supported. Fall back to hex values with inline comments if not supported.

COMPONENT_SET rules:
- Every COMPONENT_SET needs ≥ 2 variant combinations
- Variant node names: "Variant=Primary, State=Default" format exactly
- Position components at explicit x/y within section frame

---

### COMPONENT 1: Button

COMPONENT_SET name: "Button"
Variant properties:
- Variant: Primary | Lime | Outline | Ghost | Danger | Disabled
- State: Default | Pressed
- Size: SM | MD | LG

Sizing:
- SM: width 80px, height 34px, padding 0 16px, font 11px, radius pill
- MD: width 120px, height 44px, padding 0 22px, font 13px, radius pill
- LG: width 200px, height 52px, padding 0 28px, font 15px, radius pill

Per-variant fills (boundVariables to Semantic IDs):
- Primary:  bg=Color/brand/primary,  text=Color/text/inverse
- Lime:     bg=Color/brand/accent,   text=Color/text/on-lime
- Outline:  bg=transparent, border 1.5px Color/brand/primary, text=Color/text/primary
- Ghost:    bg=Color/background/input, text=Color/text/primary
- Danger:   bg=Color/badge/red-bg,   text=Color/badge/red-text
- Disabled: bg=Color/background/input, text=Color/text/tertiary

Pressed state: opacity 0.75 on the fill layer

Font: Poppins, weight 700, boundVariable to Typography/weight/bold
Text alignment: center

Generate all 6 variants × 2 states × 3 sizes = 36 component nodes.
Group in COMPONENT_SET.

---

### COMPONENT 2: Input

COMPONENT_SET name: "Input"
Variant properties:
- State: Default | Focus | Error | Disabled | WithIcon

All states:
- Width: 280px, Height: 48px
- Radius: boundVariable → Semantic/radius/md (12px)
- Font: Poppins 15px (min size for iOS), weight 400

| State    | bg                          | border                      |
|----------|-----------------------------|-----------------------------|
| Default  | Color/background/input      | none                        |
| Focus    | Color/background/surface    | 1.5px Color/brand/primary   |
| Error    | Color/background/surface    | 1.5px Color/status/danger   |
| Disabled | Color/background/input      | none, opacity 0.5           |
| WithIcon | Color/background/input      | none (add 16px search icon) |

Placeholder text layer: "Search pantry…"
  - Color: Color/text/tertiary
  - Font: Poppins 15px weight 400

---

### COMPONENT 3: Badge

COMPONENT_SET name: "Badge"
Variant properties:
- Color: Lime | Green | Yellow | Red | Grey | Black

All badges:
- Height: auto (padding 4px 10px)
- Radius: boundVariable → Semantic/radius/button (pill, 999px)
- Font: Poppins 10px weight 700

| Color  | bg                     | text                    |
|--------|------------------------|-------------------------|
| Lime   | Color/badge/lime-bg    | Color/badge/lime-text   |
| Green  | Color/badge/green-bg   | Color/badge/green-text  |
| Yellow | Color/badge/yellow-bg  | Color/badge/yellow-text |
| Red    | Color/badge/red-bg     | Color/badge/red-text    |
| Grey   | Color/badge/grey-bg    | Color/badge/grey-text   |
| Black  | Color/brand/primary    | Color/brand/accent      |

---

### COMPONENT 4: Category Chip

COMPONENT_SET name: "Chip"
Variant properties:
- State: Active | Inactive

Both chips:
- Height: 34px, padding: 7px 14px
- Radius: boundVariable → Semantic/radius/button (pill)
- Font: Poppins 11px weight 600

| State    | bg                     | text                    |
|----------|------------------------|-------------------------|
| Active   | Color/brand/primary    | Color/brand/accent      |
| Inactive | Color/background/input | Color/text/secondary    |

---

### COMPONENT 5: Item Card

COMPONENT_SET name: "ItemCard"
Variant properties:
- State: Default | Checked | Highlighted

All variants:
- Width: 340px, Min-height: 60px
- Radius: boundVariable → Semantic/radius/card (14px)
- Padding: 14px 16px
- Layout: horizontal flex, gap 12px, align center

Layers inside (left to right):
1. icon-box: 44×44px, radius 12px, bg hardcoded per category (pass as constructor param)
   Contains: emoji text, font 20px, centered
2. info-group: flex column
   - name: Poppins 13px weight 600, color Color/text/primary, truncate
   - meta: Poppins 11px weight 500, color Color/text/secondary
3. badge: Badge component (right-aligned, use Lime/Yellow/Red based on expiry)

Per-state fills:
- Default:     bg=Color/background/surface
- Checked:     bg=Color/background/app, opacity 0.55 on whole card
- Highlighted: bg=Color/brand/accent (lime card — for AI-added items)

For Highlighted state: name text color=Color/text/on-lime, meta color=rgba(0,0,0,0.5)

---

### COMPONENT 6: Stat Card

COMPONENT_SET name: "StatCard"
Variant properties:
- Accent: Neutral | Warning | Success

All variants:
- Width: 100px, height: 60px
- Radius: boundVariable → Semantic/radius/card (14px)
- Padding: 12px 14px
- bg: Color/background/surface

Layers:
1. number: Poppins 20px weight 800
   - Neutral: Color/text/primary
   - Warning: Color/status/warning
   - Success: Color/status/success
2. label: Poppins 9px weight 500, Color/text/secondary, margin-top 2px

---

### COMPONENT 7: Bottom Navigation Bar

COMPONENT_SET name: "BottomNav"
Variant properties:
- Active: Pantry | Shopping | Meals | Agent

For each variant:
- Width: 390px (full iPhone width), height: 72px
- bg: Color/nav/surface (white)
- Border-top: 1px Color/border/default
- Padding: 8px 8px 14px

Contains 4 NavItem frames (each flex column, align center, gap 3px, flex 1):
- icon-container: 24×24px, radius 12px (pill for active)
- label: Poppins 9px weight 600

Active tab NavItem:
- icon-container bg: Color/nav/active-bg (black)
- icon stroke: Color/nav/active-icon (lime)
- label color: Color/nav/active-icon (lime)

Inactive tab NavItem:
- icon-container bg: transparent
- icon stroke: Color/nav/inactive (grey #ccc)
- label color: Color/nav/inactive (#ccc)

Icons (use SVG path data as rectangle placeholders in Figma — annotate icon names):
- Pantry:   rectangle 20×20px with label "pantry-icon"
- Shopping: rectangle 20×20px with label "cart-icon"
- Meals:    rectangle 20×20px with label "meals-icon"
- Agent:    rectangle 20×20px with label "agent-icon"

Generate 4 COMPONENT_SET variants (one per active tab).

---

## PHASE 4 — EXECUTION INSTRUCTIONS

1. Run createVariables.js first. Capture ALL variable IDs from the response and write
   them to figma-lib/variableIds.json so createComponents.js can import them.

2. variableIds.json format:
   {
     "primitives": { "Color/Black": "<id>", ... },
     "semantic": { "Color/text/primary": "<id>", ... }
   }

3. In createComponents.js, import variableIds.json and use semantic IDs for all
   boundVariables. If a variable ID is missing, log a warning and fall back to the
   hex value.

4. Run createComponents.js second.

5. index.js:
   const { execSync } = require('child_process');
   execSync('node figma-lib/createVariables.js', { stdio: 'inherit' });
   execSync('node figma-lib/createComponents.js', { stdio: 'inherit' });

6. Final console output:
   === SUMMARY ===
   Variables created: X / Y attempted
   Components created: X / Y attempted
   Failures: list each one
   Figma file: https://figma.com/file/YOUR_FILE_ID

---

## IMPORTANT NOTES

- Variables API requires Professional plan or above (not Figma Starter/Free)
- boundVariables is only supported on: fill color, stroke color, corner radius,
  width/height, opacity, text fontSize — not on shadows or font family strings
- For font family: set fontName.family = "Poppins" directly on text nodes
- Shadows: hardcode values in the node creation, add a comment referencing token name
- Every COMPONENT_SET must have ≥ 2 variant combinations or the API will reject it
- Components must have explicit x/y coordinates — auto-layout can be added in a
  second pass but is not required at creation time
- Page creation via REST API: POST /v1/files/:file_id/pages (returns new page ID)
  Then all component/frame nodes go to: POST /v1/files/:file_id/nodes with
  parent_id = new page ID

Start with Phase 1 (createVariables.js), confirm it runs without errors, then
proceed to Phase 2+3 (createComponents.js).
```
