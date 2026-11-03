# Styling Paradigms Assignment

This repository contains the complete implementation for **Styling Paradigms**, separated into two focused exercises demonstrating modern CSS methodologies: **Utility-First CSS (Tailwind CSS)** and **Type-Safe Zero-Runtime CSS (Vanilla Extract)**.

---

## Repository Structure

```
07-styling-paradigms-assignment/
├── README.md                           # Main documentation & verification report
├── exercise-1-tailwind/                # Exercise 1: Responsive Product Dashboard
│   ├── package.json
│   ├── vite.config.ts                  # Vite + @tailwindcss/vite integration
│   ├── src/
│   │   ├── index.css                   # Tailwind v4 @theme directive & design tokens
│   │   ├── types/
│   │   │   └── product.ts              # Product TypeScript interfaces
│   │   ├── data/
│   │   │   └── products.ts             # Inventory dataset with stock states
│   │   ├── components/
│   │   │   ├── Header.tsx              # Sticky header with search, filters, actions
│   │   │   ├── Sidebar.tsx             # Responsive sidebar (desktop drawer + mobile bar)
│   │   │   ├── ProductCard.tsx         # Reusable card with hover/focus/disabled states
│   │   │   └── ProductGrid.tsx         # 1-col (sm), 2-col (md), 3-col (lg) responsive grid
│   │   ├── App.tsx                     # Dashboard container with live token tester
│   │   └── main.tsx
└── exercise-2-vanilla-extract/         # Exercise 2: Type-Safe Component Library
    ├── package.json
    ├── vite.config.ts                  # Vite + @vanilla-extract/vite-plugin
    ├── src/
    │   ├── theme/
    │   │   ├── contract.css.ts         # createThemeContract (typed schema)
    │   │   └── theme.css.ts            # createTheme (Light & Dark theme token mappings)
    │   ├── components/
    │   │   ├── Button/
    │   │   │   ├── Button.tsx          # Strongly typed component with variant/size props
    │   │   │   └── Button.css.ts       # style() & styleVariants() with hover/focus/disabled
    │   │   ├── Card/
    │   │   │   ├── Card.tsx            # Composable Card, Header, Title, Body, Footer
    │   │   │   └── Card.css.ts         # Base styles, responsive media queries, elevation
    │   │   └── Badge/
    │   │       ├── Badge.tsx           # Badge component
    │   │       └── Badge.css.ts        # styleVariants() for success, warning, error, brand
    │   ├── App.tsx                     # Interactive component showcase & theme switcher
    │   ├── App.css.ts                  # Showcase layout styles
    │   ├── global.css.ts               # Global CSS resets and body typography
    │   └── main.tsx
```

---

## Exercise 1: Responsive Product Dashboard (Tailwind CSS)

### Overview
Exercise 1 delivers a responsive product inventory dashboard built with **Tailwind CSS v4** using pure utility composition without custom component CSS classes.

### Key Requirements Implemented
1. **Utility-First Styling**: All layouts, spacing, colors, borders, and typography are composed directly via Tailwind utility classes.
2. **Professional Dark Obsidian Theme**: Engineered with a deep obsidian palette (`#090d16`), dark glassmorphic surfaces (`#0f172a`), crisp structural borders (`#1e293b`), and cyber cyan accents (`#06b6d4`).
3. **Responsive Breakpoints without JavaScript**:
   * **Small screens (`< 768px`)**: Single column (`grid-cols-1`).
   * **Medium screens (`≥ 768px`)**: Two columns (`md:grid-cols-2`).
   * **Large screens (`≥ 1024px`)**: Three columns (`lg:grid-cols-3`).
   * Handled purely via Tailwind's responsive prefixes without any `useState` or window resize event listeners.
4. **Adaptive Navigation / Sidebar**:
   * **Desktop (`md:flex`)**: Vertical sidebar with brand header, telemetry meters, and system sector buttons.
   * **Mobile (`md:hidden`)**: Fixed frosted-glass bottom navigation bar with thumb-friendly controls.
5. **State-Based Styling**:
   * **Hover**: `hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/25 transition-all`
   * **Focus**: `focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-canvas`
   * **Disabled**: `disabled:opacity-40 disabled:cursor-not-allowed` (demonstrated on out-of-stock backorder items).
6. **Configured Design Tokens**:
   Defined using the modern Tailwind v4 `@theme` directive in `src/index.css`:
   * `--color-brand`: `#06b6d4` (Cyber Cyan)
   * `--color-brand-hover`: `#0891b2`
   * `--color-canvas`: `#090d16` (Deep Obsidian)
   * `--color-surface`: `#0f172a` (Slate 900)
   * `--color-surface-elevated`: `#162032` (Slate 800)
   * `--color-border-subtle`: `#1e293b`
   * `--color-content-title`: `#f8fafc`
   * `--color-content-body`: `#94a3b8`
   * `--color-content-muted`: `#64748b`
   * `--spacing-card-p`: `1.5rem`
   * `--spacing-dash-gap`: `1.75rem`
   * `--radius-card`: `1.125rem`
   * `--radius-action`: `0.625rem`
7. **Live Design Token Tester**:
   The dashboard includes an interactive theme token switcher in the header to verify that updating `--color-brand` dynamically updates buttons, active pills, and focus rings consistently across the entire application.

---

## Exercise 2: Type-Safe Component Library (Vanilla Extract)

### Overview
Exercise 2 implements a reusable component library (`Button`, `Card`, `Badge`) using **Vanilla Extract**. All styles are authored in dedicated `.css.ts` files, providing complete TypeScript safety, compile-time validation, and emitting **100% static CSS at build-time** with **zero runtime CSS-in-JS library overhead**.

### Key Requirements Implemented
1. **Design Token Contract & Themes**:
   * `contract.css.ts` defines a strict theme contract via `createThemeContract`, ensuring both Light and Dark modes implement identical keys for colors, spacing, typography, radii, and shadows.
   * `theme.css.ts` implements `lightTheme` and `darkTheme` without runtime recalculations.
2. **Reusable `Button` Component**:
   * **Base Styles**: Centered inline-flex layout, font weight, transitions, unitless border-radius (`borderRadius: 8`), and focus rings.
   * **Variants** (`styleVariants`): `primary`, `secondary`, `danger`.
   * **Sizes** (`styleVariants`): `sm` (small), `md` (medium), `lg` (large).
   * **States**: `:hover`, `:focus-visible`, `:disabled` with opacity, cursor, and pointer-events handling.
   * **Props**: Type-safe props interface (`variant`, `size`, `fullWidth`, `disabled`).
3. **Reusable `Card` Component**:
   * Built with composable subcomponents: `Card`, `CardHeader`, `CardTitle`, `CardSubtitle`, `CardBody`, and `CardFooter`.
   * Uses theme tokens for consistent surface colors, borders, and shadows.
   * **Responsive Padding**: Employs `@media screen and (min-width: 768px)` to smoothly scale internal padding from `space.md` to `space.lg`.
   * **Variants**: `elevated`, `flat`, `outlined`.
4. **Reusable `Badge` Component**:
   * Variants (`styleVariants`): `success`, `warning`, `error`, `brand`.
   * Maps directly to semantic status tokens in the theme contract.
5. **Separation of Concerns**:
   * Styles are defined strictly in `.css.ts` files (`Button.css.ts`, `Card.css.ts`, `Badge.css.ts`, `App.css.ts`), keeping component JSX declarative and clean.
6. **Zero-Runtime Verification**:
   * Running `npm run build` generates a standalone static `.css` file in `dist/assets/`, proving that styles are extracted at build-time and the browser receives static CSS without any client runtime style injection.

---

## Verification Matrix

| Verification Item | Exercise 1 (Tailwind CSS) | Exercise 2 (Vanilla Extract) |
| :--- | :--- | :--- |
| **Component Rendering** | Header, Sidebar, ProductCard, ProductGrid render cleanly. | Button, Card, Badge render correctly across all states. |
| **Responsive Grid** | 1 col (mobile), 2 cols (tablet `md:`), 3 cols (desktop `lg:`). | Responsive Card grid and responsive padding media queries. |
| **State Variants** | Hover, active, focus rings, disabled out-of-stock buttons. | Hover, active scale, `:focus-visible` rings, `:disabled` opacity/cursor. |
| **Design Tokens** | Configured via `@theme` (`--color-brand`, `--radius-card`, etc.). | Configured via `createThemeContract` & `createTheme` (Light/Dark). |
| **No Manual JS Layouts**| Handled purely via CSS utilities (no window resize listeners). | Handled purely via static CSS media queries. |
| **Static Build Output**| `dist/assets/*.css` emitted at build time. | `dist/assets/*.css` emitted with zero runtime library footprint. |
| **TypeScript Type Safety**| Strict TS interfaces for products and component props. | 100% type-checked styles, token contracts, and variant props. |

---

## How to Run & Verify

### Exercise 1: Tailwind CSS Dashboard
```bash
# Navigate to Exercise 1
cd 07-styling-paradigms-assignment/exercise-1-tailwind

# Run development server
npm run dev

# Run linting check
npm run lint

# Build for production and inspect static CSS output
npm run build
```

### Exercise 2: Vanilla Extract Component Library
```bash
# Navigate to Exercise 2
cd 07-styling-paradigms-assignment/exercise-2-vanilla-extract

# Run development server
npm run dev

# Run linting check
npm run lint

# Build for production and inspect static CSS output
npm run build
```

