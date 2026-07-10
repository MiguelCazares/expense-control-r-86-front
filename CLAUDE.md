# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Route Control Front: the Nuxt 4 SPA client for the Route Control API (see the sibling
`route-control` backend repo for the API — endpoints and payload shapes are documented
there in `API.md`). SSR is disabled (`ssr: false` in `nuxt.config.ts`); this is a
client-rendered dashboard for managing a bus fleet's buses, drivers, shifts, income,
expenses, categories and cash-flow.

## Commands

```bash
pnpm install
pnpm dev          # nuxt dev, http://localhost:3001
pnpm build
pnpm generate
pnpm preview
```

There is no lint or test script configured in this repo — don't assume `pnpm lint` or
`pnpm test` exist.

The API base URL comes from `NUXT_PUBLIC_API_BASE` (`.env`, default
`http://localhost:3000/api/v1`) — the backend must be running separately for the app to
be usable.

## Architecture

**Nuxt 4 directory conventions** apply under `app/`: `pages/` is file-based routing,
`components/` is auto-imported (flattened, no path-based prefixing — see `components.dirs`
in `nuxt.config.ts`, `pathPrefix: false`), `composables/` and `stores/` are auto-imported
per Nuxt/Pinia convention.

**API access is composable-per-resource, not a shared repository/service layer.** Each
resource has a `use<Resource>.ts` composable under `app/composables/` (`useBuses`,
`useDrivers`, `useShifts`, `useIncome`, `useExpenses`, `useCategories`, `useCashFlow`)
that wraps `$api` calls for that resource's CRUD + any custom endpoints (e.g.
`useBuses().getSummary(id, month)`). New resources should follow this same shape rather
than introducing a generic CRUD abstraction.

**Two layers wrap `$fetch`:**
- `app/plugins/api.ts` provides `$api`: injects the JWT from `useAuthStore()` as a
  Bearer header, sets `baseURL` from runtime config, and on a `401` response logs out
  and redirects to `/auth/login`.
- `app/composables/useApi.ts` provides `useApi().request<T>()`: unwraps the backend's
  JSend envelope (`{ status, data, code }`) down to just `data`. Some composables call
  `$api` directly and unwrap `res.data` inline instead of using `useApi()` — both exist
  in the codebase; follow whichever pattern the file you're editing already uses.

**Auth state** lives in `app/stores/auth.ts` (Pinia), persisted to `localStorage` under
`rc_token` / `rc_owner`, hydrated via `authStore.init()` (called from the `api` plugin
on client and again defensively in the `auth` middleware). There is no server-side
session — page guarding happens entirely client-side.

**Route protection is opt-in per page, not global.** There is no global middleware
registration; every page that needs auth calls
`definePageMeta({ middleware: 'auth' })` explicitly (`app/middleware/auth.ts`), which
redirects unauthenticated users to `/auth/login` and authenticated users away from
`/auth/*`. When adding a new protected page, remember to add this — it will not be
applied automatically.

**Layouts:** `default.vue` (sidebar + header, for authenticated app pages) and `auth.vue`
(bare, for login/register) — set explicitly per page via `definePageMeta({ layout: ... })`
when a page needs the non-default one.

**Error messages:** use `getApiErrorMessage(err, fallback)` (`app/utils/errors.ts`) to
pull a user-facing message out of a thrown `$fetch` error — it reads
`err.data.data.message` (matching the backend's JSend error envelope) and joins
array-valued validation messages.

**UI components** (`app/components/ui/`) are a small local design-system layer
(`AppButton`, `AppInput`, `AppSelect`, `AppModal`, `AppTable`, `AppPagination`,
`AppBadge`, `AppAlert`, `AppCard`) built on Tailwind — prefer these over ad-hoc markup
for form/table/modal UI. `components/shared/` holds cross-page composites
(`ConfirmDelete`, `StatCard`); `components/layout/` holds `TheHeader`/`TheSidebar`.
