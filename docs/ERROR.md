# ERROR.md — Ales Error Log

> **Living Document** — Updated by AI agents and developers whenever errors are encountered and resolved.

---

## How to Use This Document

1. **Adding a new entry:** Copy the [Error Entry Template](#error-entry-template) below, assign the next sequential `ERR-` number, fill in all fields, and append it under the correct [category section](#error-categories).
2. **Updating an existing entry:** Change the `Status` field and append any follow-up notes beneath the original entry.
3. **AI agents:** When you encounter or fix an error during implementation, add or update an entry here in the same commit/change set. Do not skip entries for "minor" issues — all errors are worth tracking.
4. **Required fields:** All fields in the template are required. Use `N/A` only if a field genuinely does not apply.

---

## Summary Table

Quick reference — update counts whenever entries are added or resolved.

| Category                        | Total | Resolved | In Progress | Workaround Applied |
|---------------------------------|-------|----------|-------------|--------------------|
| Build Errors                    | 1     | 1        | 0           | 0                  |
| Runtime Errors                  | 1     | 0        | 0           | 1                  |
| Animation / Performance Issues  | 1     | 1        | 0           | 0                  |
| Styling / Layout Issues         | 0     | 0        | 0           | 0                  |
| API / Data Fetching Errors      | 0     | 0        | 0           | 0                  |
| Deployment Issues               | 0     | 0        | 0           | 0                  |
| Dependency / Compatibility Issues | 0   | 0        | 0           | 0                  |
| **TOTAL**                       | **3** | **2**    | **0**       | **1**              |

---

## Error Entry Template

Copy this block and fill in every field when logging a new error.

```markdown
### ERR-[NUMBER]: [Short Description]

- **Date:** YYYY-MM-DD
- **Component/Area:** [e.g., Homepage Hero Animation, Product Page, Build Process]
- **Severity:** Critical / High / Medium / Low
- **Error Message:**
  ```
  exact error message or stack trace snippet
  ```
- **Root Cause:** Brief explanation of what caused the error.
- **Fix Applied:** What was done to resolve it.
- **Files Modified:**
  - `path/to/file.tsx`
- **Status:** Resolved / In Progress / Workaround Applied
- **Reported By:** [Agent name or developer name]
```

---

## Error Categories

---

### 🔨 Build Errors

Errors that prevent the Next.js application from compiling or building successfully.

---

#### ERR-001: GSAP Plugin Import Fails During Next.js Static Build *(Example)*

- **Date:** 2025-01-01
- **Component/Area:** Build Process — GSAP ScrollTrigger plugin registration
- **Severity:** Critical
- **Error Message:**
  ```
  ReferenceError: self is not defined
    at node_modules/gsap/ScrollTrigger.js:1:...
  ```
- **Root Cause:** GSAP's `ScrollTrigger` plugin references the browser global `self` at module evaluation time. During Next.js static generation (`next build`), this code runs in a Node.js context where `self` is undefined.
- **Fix Applied:** Wrapped the GSAP plugin registration inside a `useEffect` hook so it only executes client-side. Also added a dynamic import guard: `if (typeof window !== 'undefined')` before calling `gsap.registerPlugin(ScrollTrigger)`.
- **Files Modified:**
  - `src/lib/gsap.ts`
  - `src/components/hero/HeroAnimation.tsx`
- **Status:** Resolved
- **Reported By:** Example Entry

---

### ⚡ Runtime Errors

Errors that occur while the application is running in the browser or on the server.

---

#### ERR-002: Lenis Smooth Scroll Breaks on Mobile Safari *(Example)*

- **Date:** 2025-01-01
- **Component/Area:** Global Layout — Lenis smooth scroll initialization
- **Severity:** High
- **Error Message:**
  ```
  TypeError: Cannot read properties of undefined (reading 'addEventListener')
  at Lenis.init (lenis.min.js:1:...)
  ```
- **Root Cause:** Lenis calls `document.documentElement.addEventListener` during initialization. On certain versions of Mobile Safari (iOS 15 and below), the `touchstart` passive event listener conflicts with Lenis's internal scroll hijacking, causing the element reference to be lost mid-init when the page is loaded via a back-forward cache (bfcache) restore.
- **Fix Applied:** Added a `pageshow` event listener that re-initialises Lenis when `event.persisted === true` (bfcache restore). Also set `{ passive: true }` explicitly on Lenis touch event listeners via the `eventsTarget` option.
- **Files Modified:**
  - `src/lib/lenis.ts`
  - `src/app/layout.tsx`
- **Status:** Workaround Applied
- **Reported By:** Example Entry

---

### 🎬 Animation / Performance Issues

Errors and degradations related to GSAP, Framer Motion, Lenis, Three.js, or general rendering performance.

---

#### ERR-003: GSAP ScrollTrigger Triggers Twice in React Strict Mode *(Example)*

- **Date:** 2025-01-01
- **Component/Area:** Homepage Hero Animation — ScrollTrigger setup in `useEffect`
- **Severity:** Medium
- **Error Message:**
  ```
  [No thrown error — symptom: animation fires twice, timeline jumps on first scroll interaction in development mode]
  ```
- **Root Cause:** React 18 Strict Mode intentionally double-invokes `useEffect` (mount → unmount → remount) in development to surface side-effect bugs. The `ScrollTrigger` instance created in the first mount was not fully cleaned up before the second mount, leaving two active triggers bound to the same element.
- **Fix Applied:** Returned a cleanup function from `useEffect` that calls `scrollTriggerInstance.kill()` and `timeline.kill()`. Verified cleanup is idempotent so it is safe to call multiple times.
- **Files Modified:**
  - `src/components/hero/HeroAnimation.tsx`
- **Status:** Resolved
- **Reported By:** Example Entry

---

### 🎨 Styling / Layout Issues

CSS, Tailwind, or layout-related errors, including visual regressions caused by animation library style injections.

---

*No entries yet.*

---

### 🔗 API / Data Fetching Errors

Errors in Next.js Route Handlers, Server Actions, `fetch` calls, or third-party API integrations.

---

*No entries yet.*

---

### 🚀 Deployment Issues

Errors encountered during Vercel (or other platform) deployments, environment variable misconfigurations, or edge runtime incompatibilities.

---

*No entries yet.*

---

### 📦 Dependency / Compatibility Issues

Version conflicts, peer dependency warnings that cause breakage, or incompatibilities between libraries (e.g., GSAP + Framer Motion fighting over transforms).

---

*No entries yet.*

---

*Last updated: 2025-07-15*
