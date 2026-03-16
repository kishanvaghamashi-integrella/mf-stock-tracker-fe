# Project Guidelines

## Core Stack

- **Framework:** React + TypeScript + Vite
- **Routing:** `react-router-dom`
- **Styling:** Tailwind CSS v4 alongside `styled-components`
- **Charts:** `recharts`
- **State Management:** React Context API (e.g., `GlobalProvider`)

## Architecture & Code Style

- Group files by functional category in `src/` (`components/`, `pages/`, `context/`, `hooks/`, `utils/`).
- Use Functional Components with React Hooks.
- TypeScript is strongly encouraged (avoid `any` where possible, use proper interfaces/types).

## Build and Execute

- Development server: `npm run dev`
- Build project: `npm run build`
- Install dependencies: `npm install`

## Conventions

- **Styled Components Separation:** Custom `styled-components` for any React component should NOT be defined within the main component file. For every component, create a separate `[ComponentName].styled.tsx` file (e.g., `Dashboard.styled.tsx`) alongside it and export them, keeping the main component file clean.
- Tailwind CSS utility classes should be used for simple layout, positioning, and common styling. Use `styled-components` for specific component styling or complex custom logic.
- **Notifications/Toasts:** For success, error, or loading notifications resulting from operations (like API calls), always use the reusable `showToast` utility from `src/utils/toast.ts` (which wraps `react-hot-toast`). Avoid manual inline error text states unless specifically required for field-level form validation.
- **Responsive & Mobile-First:** Every page and component must be designed mobile-first. Start with the smallest viewport and scale up using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`). No fixed pixel widths that would break on small screens. Use fluid widths (`w-full`, `max-w-*`), flexible grids (`grid`, `flex`, `flex-wrap`), and ensure touch targets are at least 44×44px.

## Dark Mode & Theming

The app supports light and dark modes. Dark mode uses warm charcoal tones (not harsh pure black) to be easy on the eyes.

### Theme System

- **ThemeContext:** `src/context/ThemeContext.tsx` — provides `theme: "light" | "dark"` and `toggleTheme`. Persists to `localStorage` and respects `prefers-color-scheme` on first visit.
- **ThemeToggle component:** `src/components/ThemeToggle.tsx` — ready-to-use toggle button (Sun/Moon icon). Include it in page headers.
- **CSS Variables:** Defined in `src/index.css` under `:root` (light) and `.dark` (dark).
- **Tailwind dark variant:** Configured with `@custom-variant dark (&:where(.dark, .dark *))` — use `dark:` prefix in Tailwind classes.

### Color Palette

| Token               | Light     | Dark      |
| ------------------- | --------- | --------- |
| `--bg-page`         | `#f8fafc` | `#1c1917` |
| `--bg-surface`      | `#ffffff` | `#28251f` |
| `--bg-subtle`       | `#f1f5f9` | `#322f28` |
| `--text-default`    | `#0f172a` | `#f0ece4` |
| `--text-muted`      | `#64748b` | `#9c9589` |
| `--text-subtle`     | `#334155` | `#ccc6bb` |
| `--border-default`  | `#cbd5e1` | `#3d3a34` |
| `--border-strong`   | `#94a3b8` | `#57534e` |
| `--accent-primary`  | `#2563eb` | `#5b8cfa` |
| `--accent-hover`    | `#1d4ed8` | `#7aa3fb` |
| `--accent-disabled` | `#93c5fd` | `#2d3a5a` |
| `--chart-stroke`    | `#3b82f6` | `#5b8cfa` |
| `--chart-grid`      | `#e2e8f0` | `#3d3a34` |
| `--chart-tick`      | `#64748b` | `#9c9589` |

### Rules for Every New Component

1. **Styled-components:** Always use `var(--token-name)` instead of hardcoded hex colors.

   ```tsx
   // ✅ correct
   const Card = styled.div`
     background: var(--bg-surface);
     color: var(--text-default);
     border: 1px solid var(--border-default);
   `;
   // ❌ wrong
   const Card = styled.div`
     background: white;
     color: #0f172a;
   `;
   ```

2. **Tailwind classes:** For any color-carrying utility, add a `dark:` variant or switch to a CSS-variable-based inline style.

   ```tsx
   // ✅ correct — CSS variable approach
   <p style={{ color: "var(--text-muted)" }}>...</p>

   // ✅ also correct — Tailwind dark: variant
   <p className="text-slate-500 dark:text-[#9c9589]">...</p>
   ```

3. **Recharts:** Since recharts takes raw color strings, read the current theme via `useTheme()` and pass the appropriate palette value:

   ```tsx
   const { theme } = useTheme();
   const isDark = theme === "dark";
   <Line stroke={isDark ? "#5b8cfa" : "#3b82f6"} />
   <CartesianGrid stroke={isDark ? "#3d3a34" : "#e2e8f0"} />
   ```

4. **NEVER use `bg-slate-*`, `text-slate-*`, `bg-white`, etc.** without a corresponding dark mode override when those are the sole color source. Prefer CSS variables for anything theme-sensitive.

## Data Pages (Assets, Portfolio, Transactions, etc.)

Every page that lists data for a module must follow this pattern:

- **Table view:** Display records in a `<table>` inside a `TableContainer` (rounded surface card with `overflow-x: auto` for mobile). Columns should be concise; use a badge/pill for enum fields like `instrument_type`.
- **Pagination:** Use limit/offset-based pagination. Default page size is 20 (max 200). Show a "X–Y of Z" count on the left and Previous / Page N of M / Next controls on the right. Disable Previous on the first page and Next on the last.
- **Add button:** A primary "Add [Entity]" button in the page header opens a dialog for creating a new record.
- **Edit & Delete actions:** Each row has an edit icon (Pencil) and a delete icon (Trash2) in an Actions column. The edit icon re-opens the same create dialog pre-filled with the record's data. The delete icon opens a compact confirmation dialog before performing the DELETE request.
- **Reuse dialog:** A single dialog component handles both create and update by checking whether `editingEntity` is null. Pass the entity data into the form on open, and reset to empty on close.
- **Loading & empty states:** While fetching, show a centred "Loading…" message in the table body. When the list is empty, show a helpful empty-state message.
- **All API calls** use `showToast` for success, error, and (where appropriate) loading feedback — never inline error text.

