# Copilot Instructions for Erp-Frontend

## Project Overview
This is a Next.js (App Router) ERP frontend, organized for modularity and scalability. It uses TypeScript, React, and custom UI components. The codebase is structured for feature isolation and maintainability.

## Key Architectural Patterns
- **Feature-based structure:** Main features are under `src/app/(main)/features/`, each with its own components, services, and types.
- **UI Library:** Shared UI components are in `src/components/ui/`. Use these for consistent design and behavior.
- **Form Handling:** Forms use `react-hook-form` and `yup` for validation. See `employee-form.tsx` for advanced patterns (conditional fields, schema composition).
- **Service Layer:** API calls are abstracted in service files (e.g., `services/employee-service.ts`). Always use these for backend communication.
- **Type Safety:** Types are defined per feature (e.g., `types/employee.ts`). Always import types from these files for data models.
- **Config Files:** App-wide constants and config are in `src/config/`.

## Developer Workflows
- **Build:** `npm run build` (Next.js standard)
- **Dev:** `npm run dev` (hot reload)
- **Lint:** `npm run lint` (uses custom ESLint config in `eslint.config.mjs`)
- **Format:** `npm run format` (if configured)
- **Test:** No test scripts found; add tests under `src/` if needed.
- **Debug:** Use browser/Next.js dev tools. Console logs are common for debugging (see `employee-form.tsx`).

## Project-Specific Conventions
- **App Router:** All routing is file-based under `src/app/`. Avoid legacy `pages/` patterns.
- **State Management:** Local state via React hooks; global state (if any) is under `src/core/store/`.
- **Error Handling:** Use `ApiError` and `toast` for user feedback on API errors.
- **Conditional UI:** Use form `watch` for dynamic field rendering (see `isUser` in `employee-form.tsx`).
- **Icons:** Use `lucide-react` for icons, often passed as props in role definitions.

## Integration Points
- **API:** All backend calls go through service files. Never call fetch/axios directly in components.
- **External Libraries:**
  - `react-hook-form`, `yup` for forms
  - `lucide-react` for icons
  - `sonner` for notifications
  - Custom UI components for all inputs, dialogs, etc.

## Examples
- **Employee Form:** See `src/app/(main)/features/employees/components/employee-form.tsx` for:
  - Conditional rendering based on form state
  - Schema-driven validation
  - Service-based API calls
  - Custom UI integration

## How to Extend
- Add new features under `src/app/(main)/features/`
- Add shared UI in `src/components/ui/`
- Add new API services in `services/` per feature
- Define types in `types/` per feature

---
For questions or unclear patterns, check the feature's README or ask for clarification.
