# Ales — Technology Stack

> **Project:** Ales B2B Enterprise Website
> **Business:** Hardware sales (security cameras, network access points, enterprise laptops) to TRNC organisations
> **Goal:** Awwwards-quality, cinematic web experience that converts enterprise buyers

---

## Table of Contents

1. [Core Framework](#1-core-framework)
2. [Styling & Design System](#2-styling--design-system)
3. [Animation Libraries](#3-animation-libraries) ← *primary differentiator*
4. [State Management](#4-state-management)
5. [Data & API](#5-data--api)
6. [Performance & Optimisation](#6-performance--optimisation)
7. [Development Tools](#7-development-tools)
8. [Deployment & Infrastructure](#8-deployment--infrastructure)
9. [Library Interaction Map](#9-library-interaction-map)

---

## 1. Core Framework

### Stack Overview

| Technology | Version | Role |
|---|---|---|
| Next.js | 14+ | Full-stack React framework (App Router) |
| React | 18+ | UI rendering with concurrent features |
| TypeScript | 5+ | Type-safe development across the entire codebase |

---

### Next.js 14+ (App Router)

**Description:** Production-grade React framework with file-based routing, server rendering strategies, and built-in optimisations.

**Why chosen:**
- **React Server Components (RSC)** keep animation-heavy pages lean: static product data is rendered on the server and never ships the JS for it, leaving the client bundle budget entirely for GSAP, Framer Motion, and Three.js.
- **Streaming** renders the page shell immediately, letting above-the-fold animations start while below-the-fold content is still loading — critical for the perceived performance of cinematic entry sequences.
- **Incremental Static Regeneration (ISR)** delivers near-instant TTFB for product catalogue pages, removing network latency as a variable in animation smoothness.
- **Server Actions** provide a clean, RPC-style data layer with zero boilerplate, freeing development time to focus on experience.

**Alternatives considered:**

| Alternative | Reason rejected |
|---|---|
| Remix | Strong data story, but smaller ecosystem for the animation patterns (GSAP + R3F) we need; less mature App Router equivalent |
| Vite + React SPA | No SSR/ISR out of the box; longer TTFB directly degrades Lighthouse scores and animation start times |
| Astro | Excellent for content-heavy sites, but React hydration islands add friction when every page is animation-heavy |

---

### React 18+

**Description:** The foundational UI library; v18 introduced concurrent rendering.

**Why chosen:**
- **`useTransition` / `useDeferredValue`** let low-priority state updates (e.g., filter changes, search) yield to high-priority animation frames, preventing dropped frames during interactions.
- **Automatic batching** reduces unnecessary re-renders during rapid animation state changes (scroll position, spring values, pointer coordinates).
- **Strict Mode** double-invocation catches animation side-effects that only manifest on mount/unmount, surfacing subtle GSAP context leaks early.

---

### TypeScript 5+

**Description:** Statically typed superset of JavaScript.

**Why chosen:**
- Complex animation state — timelines with multiple stages, scroll progress values, easing curves, 3D transform matrices — is difficult to maintain without types.
- Typed GSAP timeline variables prevent entire categories of runtime errors (e.g., targeting a ref that hasn't mounted yet).
- Framer Motion's `Variants` and `AnimationControls` types enforce correct animation API usage at author time.
- Reduces cognitive load when onboarding contributors to unfamiliar animation orchestration code.

---

## 2. Styling & Design System

### Stack Overview

| Technology | Version | Role |
|---|---|---|
| Tailwind CSS | 3+ | Utility-first styling for layout & UI |
| CSS Modules | Native | Scoped, complex animation keyframes |
| Design Tokens | Custom | Brand consistency & theming |

---

### Tailwind CSS 3+

**Description:** Utility-first CSS framework with a JIT compiler.

**Why chosen:**
- Rapid iteration on layout and component styling without context-switching to a separate stylesheet.
- PurgeCSS is built-in — zero unused styles in production, keeping CSS bundle size minimal so more bandwidth budget goes to JS (critical given TRNC regional bandwidth considerations).
- `@layer utilities` lets us expose animation timing utilities (`duration-1200`, custom easing classes) as Tailwind tokens.

**Alternatives considered:** Styled Components / Emotion — runtime CSS-in-JS adds measurable overhead on paint, which interferes with 60fps animations. Rejected.

---

### CSS Modules

**Description:** File-scoped CSS with locally-scoped class names, native to Next.js.

**Why chosen:**
- Complex `@keyframes` animations (multi-step clip-path reveals, staggered blur cascades, WebGL canvas overlays) are easier to read and maintain in dedicated `.module.css` files than in Tailwind's `[]` escape-hatch syntax.
- Zero runtime overhead — compiled to static CSS at build time, unlike CSS-in-JS alternatives.
- Complements Tailwind rather than replacing it: Tailwind handles spacing/colour/layout, CSS Modules handle animation choreography.

---

### Design Tokens

**Description:** A structured set of named constants (colours, typography, spacing, easing curves) defined in JSON/JS and consumed by both Tailwind config and GSAP defaults.

**Why chosen:**
- Ensures that animation easing curves (`ease-cinematic`, `ease-spring-soft`) are defined once and shared identically between GSAP timelines, Framer Motion variants, and CSS transitions — avoiding visual inconsistency.
- Allows the brand system to be updated in a single file with changes cascading across all animation layers.
- Tokens can be exported as CSS Custom Properties, enabling real-time theming without page reload.

---

## 3. Animation Libraries

> This is the most architecturally significant section. The animation stack is the primary technical differentiator for this project. Each library is chosen for a specific domain; they are composed together rather than competing.

---

### Stack Overview

| Library | Version | Domain |
|---|---|---|
| GSAP + Plugins | 3+ (Club) | Timeline choreography, scroll-driven scenes, text reveals |
| Framer Motion | 11+ | Component-level React animations, page transitions |
| Lenis | 1+ | Smooth scroll engine |
| Three.js / React Three Fiber | Three 0.16+ / R3F 8+ | 3D product visualisations, WebGL |
| Hyperframes | Latest | Frame-by-frame animation control, enhanced visual effects |

---

### GSAP (GreenSock Animation Platform) 3+

**Description:** The industry-standard JavaScript animation engine. Sub-millisecond precision, hardware-accelerated transforms, and the most battle-tested timeline API in the browser.

**Why chosen:**
- **GSAP Timeline** enables multi-object, multi-property choreography with precise offset control — essential for sequencing the product-reveal narratives (camera pan → product materialises → spec labels animate in → CTA fades up).
- **ScrollTrigger plugin** links animation progress directly to scroll position with pin, scrub, and snap controls. This is the backbone of the "cinematic scroll" experience — sections pin while a timeline plays through, then unpin when complete.
- **SplitText plugin** (Club GSAP) splits headings into characters/words/lines for staggered reveal animations without custom DOM manipulation.
- **GSAP Context** and `gsap.matchMedia()` provide a clean way to scope animations to components and adapt them across breakpoints without memory leaks.
- Performance: GSAP uses a single rAF loop across all animations and skips ticks when there is nothing to animate — the most CPU-efficient approach available.

**Key plugins:**
- `ScrollTrigger` — scroll-driven animation engine
- `SplitText` — character/word/line text splitting
- `DrawSVG` — animated SVG stroke effects for diagrams
- `MorphSVG` — smooth SVG shape morphing for icons/illustrations
- `Flip` — layout-to-layout transitions with FLIP technique

**Alternatives considered:**

| Alternative | Reason rejected |
|---|---|
| Web Animations API (WAAPI) | No timeline orchestration, no ScrollTrigger equivalent; too low-level for complex scenes |
| Anime.js | Capable, but lacks ScrollTrigger depth; smaller community; no SplitText equivalent |
| Motion One | Lightweight and WAAPI-based; insufficient for the complexity of multi-stage scenes |

---

### Framer Motion 11+

**Description:** A production-grade React animation library with a declarative API built on native React patterns.

**Why chosen:**
- **React-native API**: `motion.div`, `variants`, `useAnimation` integrate seamlessly into RSC/client component boundaries without stepping outside React's rendering model — GSAP requires imperative refs.
- **Layout animations** (`layoutId`, `AnimateSharedLayout`) enable smooth element transitions between list and detail views (e.g., a product card expanding into a full product page) — notoriously difficult to implement manually.
- **`AnimatePresence`** handles mount/unmount animation of components — page transitions, modal entrances, toast notifications — without keeping invisible elements in the DOM.
- **`useMotionValue` + `useTransform`** enable performant pointer-tracked parallax effects (CSS `transform` only, no layout triggers) that would be boilerplate-heavy with raw JS.
- **`useScroll` + `useSpring`** pair to create smooth, spring-damped scroll-linked transforms (e.g., a sticky header that smoothly resizes on scroll).

**Relationship with GSAP:** Framer Motion handles *component-level* and *transition-level* animations (what happens when this component appears/disappears). GSAP handles *scene-level* choreography (a sequence of 12 things happening in a specific order tied to a scroll timeline). They do not compete.

**Alternatives considered:**

| Alternative | Reason rejected |
|---|---|
| React Spring | Physics-based only; no straightforward timeline/sequence API for choreographed scenes |
| AutoAnimate | Too opinionated; not suitable for custom cinematic sequences |

---

### Lenis 1+

**Description:** A lightweight (~2.5 KB gzipped) smooth scroll library that replaces native scroll with a lerp-based (linear interpolation) scroll engine.

**Why chosen for cinematic feel:**
- Native browser scroll is instantaneous — the page jumps to the new position. Lenis applies momentum and easing so the viewport *glides* to its destination, making the entire experience feel expensive and intentional.
- **GSAP ScrollTrigger integration**: Lenis feeds its scroll values directly to ScrollTrigger's `scrollerProxy`, ensuring perfect synchronisation between scroll position and animation progress — no jitter or frame desynchronisation.
- Normalises scroll velocity across devices (mouse wheel, trackpad, touch), producing consistent animation behaviour regardless of input device — critical for enterprise clients demoing on various hardware.
- Provides `onScroll` callbacks for custom scroll-velocity-based effects (e.g., motion blur that intensifies at higher scroll speeds).

**Why not native scroll:**
Native `scroll` events fire after the browser has already painted, making synchronised animation updates one frame late. Lenis's lerp loop runs inside the same rAF tick as GSAP, keeping everything in lockstep.

**Alternatives considered:**

| Alternative | Reason rejected |
|---|---|
| Locomotive Scroll | Heavier, less actively maintained, known issues with GSAP ScrollTrigger sync |
| Smooth Scrollbar | More complex API; overkill for Lenis's specific use case |
| `scroll-behavior: smooth` (CSS) | Cannot be controlled programmatically; no velocity/lerp data exposed to JS |

---

### Three.js 0.16+ / React Three Fiber 8+

**Description:** Three.js is the leading WebGL abstraction library. React Three Fiber (R3F) is a React reconciler for Three.js that lets you express 3D scenes as JSX.

**Why chosen:**
- **3D product reveals** are the flagship differentiator: enterprise security cameras and network APs rendered in real-time 3D (loaded from `.glb` / `.gltf` files), rotating in response to scroll or pointer, with cinematic lighting and material shaders — impossible with CSS/SVG alone.
- **`@react-three/drei`** provides ready-made helpers (`<OrbitControls>`, `<Environment>`, `<useGLTF>`, `<Html>`) that dramatically accelerate R3F scene development.
- **`@react-three/postprocessing`** enables cinematic post-processing effects: bloom on LEDs, depth-of-field on background objects, chromatic aberration on transitions.
- **`leva`** provides a live GUI for tweaking 3D scene parameters during development without code changes.
- R3F integrates with the React component model: 3D objects can be animated with Framer Motion values or GSAP refs, unifying the animation system.

**Relationship with other animation layers:**
- GSAP ScrollTrigger drives the camera path along a bezier curve as the user scrolls.
- Framer Motion controls DOM overlays (spec labels, CTAs) that appear on top of the 3D canvas.
- The Three.js render loop and GSAP's rAF loop are synchronised via `useFrame` (R3F) to prevent double-rAF overhead.

**Alternatives considered:**

| Alternative | Reason rejected |
|---|---|
| Babylon.js | More game-oriented API; smaller React ecosystem; less suited to web marketing use cases |
| Spline | Export-only tool; no programmatic control from JS at runtime |
| CSS 3D transforms | No real-time lighting, no PBR materials, cannot render imported 3D models |

---

### Hyperframes

**Description:** An animation framework providing enhanced visual effects and fine-grained, frame-by-frame animation control for complex sequenced visual experiences.

**Why chosen (planned integration):**
- **Frame-by-frame control** enables sprite-sheet-style animations and precise multi-frame sequences that sit outside the easing-curve model of GSAP/Framer Motion — useful for animating technical diagram steps (e.g., a network topology building itself incrementally).
- Provides additional visual effect primitives (particle trails, procedural texture effects) that complement the Three.js pipeline without requiring full custom shader authorship.
- Planned as an enhancement layer for product feature callout sequences where frame-accurate visual storytelling is required.

**Integration plan:**
- Hyperframes will be coordinated via GSAP timelines — GSAP controls *when* a Hyperframes sequence plays; Hyperframes controls *what* plays within that window.
- Usage will be isolated to dedicated animation components to contain the integration surface area.

> **Status:** Planned integration — to be evaluated and implemented in Phase 2 of the animation buildout.

---

### How the Animation Libraries Compose

```
User scrolls
     │
     ▼
  Lenis (smooth scroll engine)
     │  feeds scroll position to
     ▼
  GSAP ScrollTrigger (scroll-to-animation mapping)
     │                          │
     │ drives                   │ drives
     ▼                          ▼
  GSAP Timelines           Three.js / R3F
  (DOM choreography)       (3D product scene)
     │
     │ co-exists with
     ▼
  Framer Motion
  (component transitions,
   layout animations,
   pointer-tracked effects)
     │
     │ can trigger
     ▼
  Hyperframes
  (frame-by-frame sequences,
   technical diagram animations)
```

**Rule of thumb for the team:**
- *"Does this animation belong to the page narrative / scroll story?"* → **GSAP + ScrollTrigger**
- *"Does this animation belong to a React component appearing, leaving, or changing state?"* → **Framer Motion**
- *"Does this involve a 3D model or WebGL effect?"* → **React Three Fiber**
- *"Is this a smooth scroll experience binding everything together?"* → **Lenis**
- *"Is this a precise frame-by-frame visual sequence?"* → **Hyperframes**

---

## 4. State Management

### Stack Overview

| Technology | Version | Role |
|---|---|---|
| Zustand | 4+ | Global UI state (animation flags, active product, nav state) |
| Jotai | 2+ | Atomic state for fine-grained animation values |
| React Context | Native | Theme, locale, user preferences |

---

### Zustand 4+

**Description:** Minimalist, hook-based global state management with a flux-style store.

**Why chosen:**
- Zero boilerplate compared to Redux; store setup takes minutes.
- **Animation-friendly**: subscribing to a single slice of state (`activeSection`, `isHeroAnimationComplete`) does not trigger re-renders across unrelated components — critical for preventing frame drops during animations.
- Supports `transient subscriptions` (`subscribe` without `useStore`) for updating GSAP timelines in response to state changes without causing React re-renders at all.

---

### Jotai 2+ *(alternative/complement to Zustand)*

**Description:** Atomic state management inspired by Recoil.

**Why considered:**
- Atom-level granularity is ideal for individual animation values (e.g., `scrollVelocityAtom`, `cursorPositionAtom`) that many components read independently.
- Avoids over-fetching from a monolithic store when only one animation value changes.

**Decision:** Use **Zustand** for global application state (product selection, navigation, animation milestones) and evaluate **Jotai** for highly granular animation-specific reactive values if Zustand's selector overhead becomes measurable.

---

### React Context

**Description:** Native React context API.

**Use cases:**
- `ThemeContext` — light/dark mode toggling, which affects GSAP animation colour values and Three.js scene environment maps.
- `LocaleContext` — TRNC region may require bilingual (Turkish/English) content; locale switching should not re-trigger page animations.
- `AnimationPreferenceContext` — respects `prefers-reduced-motion` OS setting, disabling or simplifying animations site-wide.

---

## 5. Data & API

### Stack Overview

| Technology | Version | Role |
|---|---|---|
| Next.js Server Actions | 14+ | Mutations and form submissions |
| Next.js API Routes | 14+ | REST endpoints for third-party integrations |
| Sanity CMS | 3+ | Headless CMS for product catalogue (preferred) |
| Contentful | Latest | Alternative headless CMS |
| Zod | 3+ | Runtime schema validation |

---

### Next.js Server Actions & API Routes

**Why chosen:**
- Server Actions eliminate the need for a separate API layer for form submissions (contact forms, quote requests) — reduces round-trips and keeps sensitive business logic server-side.
- API Routes handle webhooks from the CMS (content revalidation triggers) and any third-party integrations (e.g., CRM sync).

---

### Sanity CMS 3+ *(preferred)*

**Description:** Structured content platform with a real-time collaborative editing studio and a powerful GROQ query language.

**Why chosen:**
- Product data (hardware specs, images, feature lists) managed by non-technical staff without touching code.
- **On-demand ISR revalidation**: when a product is updated in Sanity, a webhook triggers Next.js to revalidate only that product page — new content goes live in seconds without a full rebuild.
- Sanity's CDN serves product images globally; combined with `next/image`, this provides optimal image delivery to TRNC.
- GROQ queries are more flexible than GraphQL for the nested product-feature structures typical of hardware catalogues.

**Alternative: Contentful** — mature and enterprise-proven, but more expensive at scale and GROQ is more expressive than Contentful's query API. Revisit if the client already has a Contentful contract.

---

### Zod 3+

**Description:** TypeScript-first schema declaration and validation library.

**Why chosen:**
- Validates all external data (CMS payloads, API responses, form submissions) at the boundary before it enters the application — prevents runtime errors that could interrupt animations mid-sequence.
- Zod schemas double as TypeScript types (via `z.infer`), eliminating redundant type declarations for API shapes.

---

## 6. Performance & Optimisation

> Animation performance *is* the product. Every optimisation decision is evaluated through the lens of maintaining 60fps (ideally 120fps on supported displays).

### Stack Overview

| Technology | Role |
|---|---|
| `next/image` | Optimised image delivery |
| `next/font` | FOUT/FOUT-free font loading |
| `@next/bundle-analyzer` | Bundle size visibility |
| Lighthouse CI | Automated performance regression detection |

---

### `next/image`

- Serves WebP/AVIF automatically based on browser support — smaller payloads mean faster page load and more CPU headroom for animations.
- Lazy loads below-the-fold product images natively, preventing render-blocking image loads from competing with above-the-fold animation frames.
- `priority` prop on hero images ensures LCP is not impacted by lazy loading.

---

### `next/font`

- Downloads fonts at build time and self-hosts them — eliminates third-party DNS lookups to Google Fonts or Adobe Fonts that delay First Contentful Paint.
- `font-display: swap` with `size-adjust` prevents layout shifts during font swap, which would cause GSAP timeline elements to jump position mid-animation.

---

### `@next/bundle-analyzer`

- Visualises the client JS bundle as a treemap — essential for auditing that GSAP, Framer Motion, and R3F are not being included in Server Component bundles.
- Run before each major feature merge to catch bundle size regressions.

---

### Lighthouse CI

- Automated Lighthouse audits on every PR via GitHub Actions.
- **Performance score gate: 90+** enforced on all product pages.
- Catches regressions in LCP, TBT (Total Blocking Time), and CLS before they reach production — a CLS regression often means an animation is causing layout shifts.

---

### Additional Performance Strategies

| Strategy | Implementation |
|---|---|
| Code splitting | Dynamic `import()` for R3F canvas components (only load Three.js on pages that use it) |
| Web Workers | GSAP timeline computations offloaded where possible; physics simulations in a Worker |
| `will-change` management | Applied only at animation start, removed on completion — prevents GPU layer promotion memory waste |
| `prefers-reduced-motion` | Full animation bypass in CSS and JS; non-animated fallback for all GSAP/Framer scenes |
| Passive event listeners | All scroll/pointer listeners registered as `passive: true` to prevent scroll blocking |
| ResizeObserver debounce | GSAP ScrollTrigger refresh debounced on resize to prevent thrashing |

---

## 7. Development Tools

### Stack Overview

| Tool | Version | Role |
|---|---|---|
| ESLint | 8+ | Linting with Next.js and accessibility rules |
| Prettier | 3+ | Code formatting |
| Husky + lint-staged | Latest | Pre-commit quality gates |
| Storybook | 7+ | Isolated component & animation development |
| Vitest | 1+ | Unit and integration testing |
| Playwright | Latest | End-to-end testing |

---

### ESLint 8+

- Extends `eslint-config-next` (includes React, JSX a11y, and Next.js-specific rules).
- Custom rules: `no-gsap-outside-useEffect` (enforced via a local plugin) — prevents GSAP DOM mutations during SSR.
- `eslint-plugin-react-hooks` catches missing deps in animation hooks where stale closures cause timeline bugs.

---

### Prettier 3+

- Consistent formatting across the team; eliminates code-style discussions in PRs.
- Prettier + ESLint configured to not conflict (via `eslint-config-prettier`).

---

### Husky + lint-staged

- Pre-commit hook runs ESLint and Prettier on staged files only — fast (< 3s) so it does not interrupt developer flow.
- Pre-push hook runs `tsc --noEmit` to catch TypeScript errors before they reach CI.

---

### Storybook 7+

**Description:** Isolated component development environment.

**Why critical for this project:**
- Animation components are developed and reviewed in isolation before integration — reduces the feedback loop from days to minutes.
- Each animated component has a dedicated Story with controls for `variant`, `delay`, and `reduced-motion` to QA all animation states.
- `@storybook/addon-a11y` catches accessibility regressions introduced by animation (e.g., elements that are invisible to screen readers during animation phases).
- Storybook can be shared with the design team as a living style guide, aligning on animation timing and feel before full page integration.

---

### Vitest 1+

- Unit tests for animation utility functions (easing calculators, bezier helpers, scroll progress mappers).
- Integration tests for Zustand animation state machines.
- Significantly faster than Jest for TypeScript-heavy codebases (native ESM support, no Babel transform).

---

### Playwright

- End-to-end tests validate that page transitions fire correctly, that Three.js canvases mount without WebGL errors, and that `prefers-reduced-motion` disables animations as expected.
- Visual regression snapshots (`toHaveScreenshot`) catch unintended animation state changes.
- Tests run against real Chromium/WebKit/Firefox to surface browser-specific animation bugs.

---

## 8. Deployment & Infrastructure

### Stack Overview

| Technology | Role |
|---|---|
| Vercel | Hosting and CI/CD (recommended) |
| Vercel Edge Network | Global CDN with TRNC-proximate PoPs |
| Vercel Analytics | Performance monitoring |
| Plausible Analytics | Privacy-first usage analytics (alternative) |

---

### Vercel *(recommended)*

**Why chosen:**
- Zero-config Next.js deployment — Vercel and Next.js share the same team (Vercel created Next.js); all App Router features (PPR, Server Actions, ISR) are guaranteed to work correctly and performantly.
- **Edge Runtime** for API routes close to TRNC users — reduces TTFB for dynamic requests.
- **Preview Deployments** on every PR allow client stakeholders to review animation changes on a real URL before merge — critical for sign-off on a visually-driven project.
- One-click rollback if a deployment degrades Lighthouse scores.

**Alternative: Self-hosted (Docker + nginx)**
- Required if data sovereignty regulations in TRNC mandate on-premises hosting.
- `next start` with a custom server; ISR revalidation handled via `revalidatePath` API.
- Trade-off: loses Vercel's automatic ISR infrastructure and edge middleware; requires DevOps resource to maintain.

---

### CDN Strategy for TRNC Region

| Concern | Strategy |
|---|---|
| Latency | Vercel Edge Network has PoPs in Frankfurt and Istanbul — nearest to TRNC (~20–40ms) |
| Static assets | All JS/CSS/fonts served from CDN with immutable cache headers (`Cache-Control: public, max-age=31536000, immutable`) |
| 3D model files (`.glb`) | Served from CDN with large `max-age`; versioned by content hash |
| CMS images | Sanity CDN + `next/image` for automatic format negotiation and resizing |
| Fallback | If primary CDN PoP is unreachable, Vercel automatically routes to next-nearest PoP |

---

### Analytics

**Vercel Analytics** (primary):
- Real User Monitoring (RUM) with Core Web Vitals breakdown per page and per device — surfaces if a specific animation is causing CLS or INP regressions in the field.
- No cookie consent required under most privacy frameworks; no performance overhead on the client.

**Plausible Analytics** (optional complement):
- Privacy-first, GDPR-compliant event tracking without cookies.
- Tracks business-relevant events: product page views, "Request a Quote" clicks, brochure downloads.
- Can be self-hosted in the TRNC region if required by client data policy.

---

## 9. Library Interaction Map

```
                    ┌─────────────────────────────────────────────────────┐
                    │                    Next.js 14                        │
                    │        (RSC + Streaming + ISR + Server Actions)      │
                    └──────────────────────┬──────────────────────────────┘
                                           │
                     ┌─────────────────────┼─────────────────────┐
                     │                     │                     │
              ┌──────▼──────┐      ┌───────▼──────┐     ┌───────▼──────┐
              │   Sanity    │      │   Zustand /  │     │  Tailwind +  │
              │  (content)  │      │    Jotai     │     │ CSS Modules  │
              └─────────────┘      │   (state)    │     │  (styling)   │
                                   └───────┬──────┘     └──────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
             ┌──────▼──────┐       ┌───────▼──────┐     ┌───────▼──────┐
             │    Lenis    │       │Framer Motion │     │  React Three │
             │ (scroll     │       │(component    │     │  Fiber / R3F │
             │  engine)    │       │ animations)  │     │ (3D scenes)  │
             └──────┬──────┘       └──────────────┘     └──────────────┘
                    │
             ┌──────▼──────┐
             │    GSAP +   │
             │ScrollTrigger│
             │  SplitText  │
             └──────┬──────┘
                    │
             ┌──────▼──────┐
             │ Hyperframes │
             │(frame-by-   │
             │  frame seq) │
             └─────────────┘
```

---

## Appendix: Quick Decision Reference

| Question | Answer |
|---|---|
| What version of Node.js is required? | 20+ LTS |
| What is the minimum browser target? | Chrome 90+, Firefox 88+, Safari 15+, Edge 90+ |
| Is IE11 supported? | No |
| What is the animation performance target? | 60fps sustained; 120fps on supported displays |
| How are animations disabled for accessibility? | `prefers-reduced-motion: reduce` via CSS media query + JS check in all animation hooks |
| Who manages CMS content? | Ales non-technical staff via Sanity Studio |
| Where are 3D models sourced? | Vendor-provided `.glb` files + Blender optimisation pipeline |
| What is the target Lighthouse performance score? | ≥ 90 on all product pages |
| Where are secrets stored? | Vercel environment variables; never committed to git |

---

*Last updated: see git history — this document should be updated whenever a library is added, upgraded, or replaced.*
