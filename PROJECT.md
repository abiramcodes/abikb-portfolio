# PROJECT.md — exp staleness fix (Draft)

> Status: **Draft** — not accepted. Do not implement beyond this record until scope is accepted and a separate implementation request is made.

## Problem
- `src/pages/index.astro` hero ("Frontend engineer with {exp} years") and `src/layouts/BaseLayout.astro` meta description compute `exp` with `new Date()` in frontmatter.
- Astro static output bakes the value at build time. Deployed HTML stays frozen (4.10) until next build/deploy; `astro dev` re-renders per request so it shows current (4.11).

## Audit — every place hit by the same build-time freeze (checked 2026-11-15)
- A1 `src/pages/index.astro:8-16,32` — hero `exp` (visible; the reported bug). Duplicated `years/months` math.
- A2 `src/layouts/BaseLayout.astro:6-11,19` — meta description `exp` (same Dec 2021 start, same math, duplicated). Stale for crawlers/social cards.
- A3 `src/components/Experience.astro:25,40` — `computeDuration("Jun 2025","Present")` calls `new Date()` at build time. The "Present" tenure freezes at build date (same bug class, visible next to Deloitte duration).
- A4 `src/components/Footer.astro:8` — `new Date().getFullYear()` copyright year. Freezes at build year (minor; wrong each January until rebuild).
- No other `new Date()` / `exp` usages in `src` (grep over `*.astro` + `*.ts`).

## Proposed single source of truth (pending acceptance, not yet built)
- New `src/lib/experience.ts` (repo has no `lib/` or `utils/` yet; `src/consts.ts` holds only site strings): exports `CAREER_START`, `getExperience(now)` → `{years, months, exp}`, and the duration helper reused by `Experience.astro`.
- `index.astro` + `BaseLayout.astro` import it for the build-time fallback; hero adds the tiny client recalc importing the same module so server and client can never drift.
- `Experience.astro` and `Footer.astro` reuse it (Present-duration + year) so all four sites share one clock.

## Settled
- Record location: `PROJECT.md` at repo root (chosen by owner, 2026-11-15).

## Decisions
- [x] D1 — Fix approach: client-side recalculation. Keep build-time `exp` as fallback; add tiny inline script recomputing from Dec 2021 start date on page load and overwriting the hero value. (Settled 2026-11-15.)
- [x] D2 — Display format: keep `years.months` exactly (e.g. "4.11 years"). No copy change. (Settled 2026-11-15.)
- [x] D3 — Scope contract accepted in writing (owner "yes", 2026-11-15, wider A1–A4 boundary).

## Scope contract (accepted)
- Boundary — in scope: new `src/lib/experience.ts` single source of truth (`CAREER_START` + `getExperience` + duration helper), rewiring A1–A4 to it, hero client recalc from the same module, `years.months` format unchanged, plus this record. Out of scope: SSR/adapters, scheduled rebuilds/CI, other pages/copy.
- Done means: (1) `astro build` passes (the repo's only CI gate — `.github/workflows/deploy.yml` builds via `withastro/action` and deploys to Pages; no test gate exists), (2) no duplicated exp math remains, (3) fresh-build preview shows current values, (4) this document marked Final on explicit acceptance.
- Later stages (e.g. dynamic meta, CI schedule) stay deferred proposals; accepting this record never approves them. "Go" authorizes only this boundary.

## Implementation (done 2026-11-15, grill-me mode)
- `src/lib/experience.ts` created; A1–A4 rewired; no date math left outside the module (grep-verified).
- Verified: 12-assertion node probe passed (`/tmp/exp-check.mjs`, kept out of the repo — no test harness exists, no framework added); `pnpm build` passes; `dist/index.html` bakes `4.11 years` fallback + meta, footer bakes 2026, client bundles emitted for all three recalc scripts.
- pnpm: no deployment changes needed — sole lockfile is `pnpm-lock.yaml` so `withastro/action@v6` auto-detects pnpm; `pnpm-workspace.yaml` already allows the sharp build; scripts are manager-agnostic. `pnpm install` reports up to date against the existing lockfile.

## Unresolved
- None for code. Awaiting explicit acceptance to mark this document Final.
