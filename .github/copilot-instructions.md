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
