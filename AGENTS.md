# AGENTS.md - POS FrontEnd

## Commands
- `npm run dev` - Vite dev server (port 5173)
- `npm run build` - tsc + Vite build (run before committing)
- `npm run lint` - ESLint
- No test framework installed

## Project
React 19 + TypeScript + Vite 8 SPA. Point of Sale for Argentina. Backend is a separate repo (`POS-BackEnd`) running FastAPI + MongoDB.

## Architecture
- **State**: Zustand stores persisted to localStorage (`pos-auth`, `cash-store`)
- **Server state**: React Query (30s stale, no retry on 4xx, no retry on mutations)
- **HTTP**: Axios instance in `src/api/api.ts` with Bearer token interceptor, auto-logout on 401
- **Routing**: React Router v7, lazy-loaded pages, three guards in `src/router/index.tsx`: `RequireAuth`, `RequireAdmin`, `RequireGuest`
- **Error handling**: Custom `ApiError` class with Spanish error messages in `src/api/errors.ts`
- **Styling**: Tailwind CSS v4 - uses `@import 'tailwindcss'` in CSS (not old `@tailwind` directives), dark theme only
- **No form libraries** - native HTML inputs

## File Conventions
- `*.service.ts` - pure HTTP functions (one per resource)
- `*.queries.ts` - React Query hooks
- `*.type.ts` - TypeScript interfaces
- Components: PascalCase in `components/` subdirectories
- Pages: mixed casing in `src/pages/` (e.g. `Cash/`, `Sales/` vs `products/`, `categories/`)

## Gotchas
- `.env` required with `VITE_API_URL` (not committed)
- `src/store/useCashStore..ts` has double dot in filename - watch imports
- No path aliases - use relative imports everywhere
- Tailwind v4 with `@tailwindcss/postcss` plugin - not the old PostCSS `tailwindcss` plugin
