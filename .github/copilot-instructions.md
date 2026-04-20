# Copilot Instructions — Ales B2B Hardware Platform

Ales is a cinematic, Awwwards-caliber B2B web platform for a hardware reseller (security cameras, network access points, enterprise laptops) operating in the Turkish Republic of Northern Cyprus (TRNC). The site is a **trust-building and lead-generation asset**, not an e-commerce storefront. Its primary conversion goal is enterprise quote requests.

---

## Commands

```bash
npm run dev        # Start development server at localhost:3000
npm run build      # Production build
npm start          # Start production server
npm run lint       # ESLint
npm run type-check # TypeScript type checking
```

---

## Architecture

### Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ with App Router (RSC, ISR, Streaming) |
| Language | TypeScript 5+ |
| Styling | Tailwind CSS + CSS Modules |
| Smooth Scroll | Lenis (`@studio-freight/lenis`) |
| Scroll-Driven Animation | GSAP + ScrollTrigger |
| Component Animation | Framer Motion |
| Frame-by-Frame Animation | Hyperframes |
| 3D / WebGL | React Three Fiber (Three.js) |
| State | Zustand (UI state) + TanStack Query (async data) |
| CMS | Sanity |
| Database | PostgreSQL |
| Deployment | Vercel (edge-optimized) |

### Routing

Two route groups separate concerns:

- **`(marketing)/`** — Public-facing pages, SSG/ISR, cinematic animations. Includes homepage, product catalog (`/products/[category]/[slug]`), `/about`, `/contact`, `/quote`.
- **`(portal)/`** — Authenticated enterprise portal (dashboard, orders, support), SSR, minimal animations.

### Animation Library Roles

Each library has a distinct, non-overlapping role:

```
Lenis → owns the scroll event; provides normalized scroll position to all other systems
  ├── GSAP + ScrollTrigger → macro scroll sequences: pinning, parallax, timeline scrubbing, staggered reveals
  ├── Framer Motion → component-level animations: mount/unmount, layout, hover, page transitions
  ├── Hyperframes → standalone HTML-based video compositions: product promo videos, cinematic title cards,
  │                  animated overlays, scene sequences rendered to MP4/WebM
  └── React Three Fiber → WebGL 3D scenes: product model orbits, lighting, particles
```

Lenis and GSAP are wired together — Lenis feeds its scroll position into ScrollTrigger:

```ts
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
```

### Component Pattern

The core architectural pattern is **Server Content + Client Animation Wrapper**. Server Components fetch and render data; thin Client Components wrap them to apply animations:

```tsx
// Server Component renders static HTML with product data (SEO, performance)
async function ProductShowcase() {
  const products = await getProducts();
  return (
    <ScrollReveal animation="stagger-up">   {/* "use client" wrapper */}
      <div className="grid grid-cols-3 gap-8">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </ScrollReveal>
  );
}
```

Reusable animation wrappers live in `src/components/animations/` (`ScrollReveal`, `PageTransition`, `ParallaxLayer`, `TextReveal`, `SmoothScroll`).

### Data Flow

- Product catalog: Sanity CMS → `src/lib/cms/` → Server Components → ISR pages
- Quote submission: Client form → Server Action → API route `/api/quote/` → CRM/email
- UI state: Zustand store at `src/stores/ui-store.ts` (loading state, nav, theme)

---

## Key Conventions

### GSAP Plugin Registration

Always guard GSAP plugin registration with a `typeof window !== 'undefined'` check (GSAP's `ScrollTrigger` references browser globals and breaks during Next.js static builds):

```ts
// src/lib/animations/gsap-config.ts
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
```

Never import ScrollTrigger at module evaluation time in any file that might be executed server-side.

### GSAP Cleanup in React

Always return a cleanup function from `useEffect` that kills GSAP timelines and ScrollTrigger instances. React 18 Strict Mode double-invokes effects — without cleanup, two active triggers bind to the same element:

```ts
useEffect(() => {
  const tl = gsap.timeline({ scrollTrigger: { ... } });
  return () => {
    tl.kill();
    tl.scrollTrigger?.kill();
  };
}, []);
```

### Lenis on Mobile Safari / bfcache

Re-initialize Lenis on `pageshow` when `event.persisted === true` (back-forward cache restore on iOS Safari). See `src/lib/lenis.ts` and `ERR-002` in `docs/ERROR.md`.

### Tailwind vs CSS Modules

- Use **Tailwind** for layout, spacing, color, and typography.
- Use **CSS Modules** (`src/styles/animations.css`) for complex multi-step `@keyframes` (clip-path reveals, blur cascades, canvas overlays). Never use runtime CSS-in-JS.

### Design Tokens

Animation easing curves, durations, and brand colors are defined once as design tokens and shared across GSAP defaults, Framer Motion variants, and Tailwind config. Do not hardcode easing strings like `"power3.out"` in component files — reference the tokens from `src/lib/animations/variants.ts`.

### Homepage Scroll Structure

The homepage is a 5-act cinematic sequence totaling ~5–7× viewport height. Scroll acts:
1. **Hero (0–200vh)** — Pinned section, dark reveal of the Ales wordmark and hardware silhouettes
2. **Product Reveals (200–400vh)** — Three sequential hardware category reveals with Hyperframes frame control
3. **TRNC Trust (400–500vh)** — Local enterprise presence, partner logos, certifications
4. **Proof (500–600vh)** — Stats, client logos, testimonials
5. **CTA (600–700vh)** — Enterprise call-to-action

### Localization

Turkish is the primary language; English is secondary. TRNC-specific formatting requirements:
- Dates: `DD.MM.YYYY`
- Numbers: `.` as thousands separator, `,` as decimal — e.g., `1.250,00 ₺`
- All pricing must display `KDV Dahil` / `KDV Hariç` (VAT included/excluded)
- Adopt a **quote-only pricing model** — never display static product prices; pricing leads to a sales engagement
- Turkish copy must use formal register (formal *siz* form)

---

## HyperFrames

HyperFrames is an HTML-based video composition framework used for product promo videos, cinematic title cards, animated overlays, and any standalone video content for the Ales platform. **HTML is the source of truth for video.** A composition is an HTML file with `data-*` attributes for timing, a GSAP timeline for animation, and CSS for appearance.

Skills documentation lives in `.agents/skills/hyperframes/` and `.agents/skills/hyperframes-cli/`. Read the relevant reference files when working on a composition.

### CLI Workflow

```bash
npx hyperframes init my-video           # scaffold new project (interactive)
npx hyperframes init my-video --non-interactive  # skip prompts (CI/agents)
npx hyperframes lint                    # catch structural errors before preview
npx hyperframes preview                 # hot-reload studio at localhost:3002
npx hyperframes render                  # output MP4
npx hyperframes render --quality draft  # fast iteration render
npx hyperframes render --fps 60 --quality high  # final delivery
npx hyperframes validate                # WCAG contrast audit + structure check
npx hyperframes doctor                  # diagnose environment (Chrome, FFmpeg, Node)
```

**Always lint before preview.** Catches missing `data-composition-id`, overlapping tracks, and unregistered timelines early.

### Visual Identity Gate (Hard Gate)

Before writing any composition HTML, a visual identity must be defined. Check in order:

1. `DESIGN.md` exists in the project → use its exact colors, fonts, motion rules, and "What NOT to Do" constraints.
2. `visual-style.md` exists → apply its `style_prompt_full` and structured fields.
3. User named a style → read `.agents/skills/hyperframes/visual-styles.md` for the 8 named presets, then generate a minimal `DESIGN.md`.
4. None of the above → ask 3 questions before writing HTML: mood, light/dark canvas, brand colors/fonts/references.

For the Ales platform, the default palette category is **Dark / Premium** (see `.agents/skills/hyperframes/palettes/dark-premium.md`) — tech, cinematic, luxury products. Never reach for `#333`, `#3b82f6`, or Roboto without checking a palette file.

### Composition Structure

**Top-level (standalone) composition — no `<template>` wrapper:**

```html
<div id="comp-1" data-composition-id="my-video" data-start="0" data-duration="60" data-width="1920" data-height="1080">
  <video id="el-1" data-start="0" data-duration="10" data-track-index="0" src="clip.mp4" muted playsinline></video>
  <audio id="el-2" data-start="0" data-duration="30" data-track-index="2" src="track.mp3"></audio>

  <script>
    const tl = gsap.timeline({ paused: true });
    window.__timelines["my-video"] = tl;
  </script>
</div>
```

**Sub-composition (loaded via `data-composition-src`) — requires `<template>` wrapper:**

```html
<template id="my-comp-template">
  <div data-composition-id="my-comp" data-width="1920" data-height="1080">
    <style>[data-composition-id="my-comp"] { /* scoped styles */ }</style>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      window.__timelines["my-comp"] = tl;
    </script>
  </div>
</template>
```

Load in root: `<div id="el-5" data-composition-id="my-comp" data-composition-src="compositions/my-comp.html" data-start="0" data-track-index="3"></div>`

### Data Attributes

| Attribute | Required | Notes |
|---|---|---|
| `id` | Yes | Unique identifier |
| `data-start` | Yes | Seconds or clip ID reference (`"el-1"`, `"intro + 2"`) |
| `data-duration` | Yes (img/div/compositions) | Video/audio defaults to media duration |
| `data-track-index` | Yes | Integer; same-track clips cannot overlap |
| `data-media-start` | No | Trim offset into source (seconds) |
| `data-volume` | No | 0–1, default 1 |

`data-track-index` does **not** affect visual layering — use CSS `z-index`.

Video must always be `muted playsinline`. Audio is always a separate `<audio>` element — never use a video element for audio.

### Timeline Contract (Non-Negotiable)

- All timelines start `{ paused: true }` — the player controls playback
- Every timeline must be registered: `window.__timelines["<composition-id>"] = tl`
- The framework auto-nests sub-timelines — do **not** manually add them
- Duration comes from `data-duration`, not GSAP timeline length
- Never create empty tweens to pad duration
- Never use `repeat: -1` — always calculate finite repeats: `Math.ceil(duration / cycleDuration) - 1`
- Timeline construction must be **synchronous** — never inside `async`/`await`, `setTimeout`, or Promises
- Never use `gsap.set()` on clip elements from later scenes (they don't exist at page load); use `tl.set(selector, vars, timePosition)` inside the timeline at or after the clip's `data-start` time

### Layout Before Animation

Build the **end-state first** (fully entered, correctly placed) as static HTML+CSS before adding any GSAP. This catches overlaps and layout bugs before they're hidden by opacity/transform animations.

1. Identify the **hero frame** for each scene — the moment when the most elements are simultaneously visible.
2. Write static CSS for that frame. The `.scene-content` container MUST use `width: 100%; height: 100%; padding: Npx; box-sizing: border-box; display: flex; flex-direction: column;`. Use padding to push content inward — **never** `position: absolute; top: Npx` on content containers (reserve `position: absolute` for decoratives only).
3. Add entrances with `gsap.from()` — animate FROM offscreen/invisible TO the CSS position.
4. Add exits with `gsap.to()` — animate TO offscreen/invisible FROM the CSS position.

### Scene Transitions (Non-Negotiable)

Every multi-scene composition must follow all of these rules:

1. **Always use transitions between scenes.** No jump cuts, no exceptions.
2. **Always use entrance animations on every element.** Every element animates IN via `gsap.from()`. No element may appear fully-formed.
3. **Never use exit animations except on the final scene.** No `gsap.to()` animating opacity to 0 or moving elements offscreen before a transition. The transition IS the exit — the outgoing scene's content must be fully visible when the transition fires.
4. **Final scene only** may fade elements out (e.g., fade to black).

Transition reference: `.agents/skills/hyperframes/references/transitions.md` and `references/transitions/catalog.md`.

### Animation Guardrails

- Offset the first animation 0.1–0.3s (never at t=0)
- Vary eases across entrance tweens — at least 3 different eases per scene; no more than 2 tweens with the same ease in a scene
- Vary durations deliberately — the slowest scene should be 3× slower than the fastest
- Vary entrance directions — not every element from `y: 30`; use left, right, scale, opacity-only, letter-spacing
- Use `.out` eases for entrances, `.in` for exits, `.inOut` for position-to-position
- No `Math.random()`, `Date.now()`, or time-based logic — use a seeded PRNG (mulberry32) if pseudo-random values are needed
- Only animate visual properties (`opacity`, `x`, `y`, `scale`, `rotation`, `color`, etc.) — never animate `visibility`, `display`, or call `video.play()`/`audio.play()`
- Never animate the same property on the same element from multiple timelines simultaneously
- Never use `<br>` in content text — use `max-width` for wrapping instead
- Avoid full-screen linear gradients on dark backgrounds (H.264 banding) — use radial glows or localized glow instead
- Minimum sizes for rendered video: 60px+ headlines, 20px+ body text, 16px+ data labels
- Use `font-variant-numeric: tabular-nums` on number columns

### Scene Structure (Build / Breathe / Resolve)

Every scene has three phases:
- **Build (0–30%)** — elements enter with staggered entrances; don't dump everything at once
- **Breathe (30–70%)** — content visible, alive with one ambient motion (breathing scale, slow drift, etc.)
- **Resolve (70–100%)** — transition fires or decisive end; exits are faster than entrances

### Quality Checks

After authoring, always run:

```bash
npx hyperframes lint        # structural errors
npx hyperframes validate    # WCAG AA contrast audit (5 screenshots, text contrast ratios)
```

For new compositions or significant animation changes, also run the animation map:

```bash
node .agents/skills/hyperframes/scripts/animation-map.mjs <composition-dir> \
  --out <composition-dir>/.hyperframes/anim-map
```

The animation map outputs a JSON with per-tween summaries, ASCII Gantt chart, stagger detection, dead zones (>1s with no animation), element lifecycles, and flags (`offscreen`, `collision`, `invisible`, `paced-fast`, `paced-slow`). Fix or justify every flag.

### Available Reference Files

Load these on demand from `.agents/skills/hyperframes/references/`:

| File | Read when |
|---|---|
| `transitions.md` + `transitions/catalog.md` | Any multi-scene composition |
| `motion-principles.md` | Choreographing GSAP animations |
| `typography.md` | Every composition (all compositions have text) |
| `css-patterns.md` | Adding text emphasis: highlight, circle, burst, scribble |
| `captions.md` | Text synced to audio |
| `audio-reactive.md` | Visuals that respond to music or voice |
| `dynamic-techniques.md` | Karaoke, clip-path, slam, scatter, elastic, 3D captions |
| `tts.md` | Generating narration/voiceover |

Style presets: `.agents/skills/hyperframes/visual-styles.md` (8 named presets: Swiss Pulse, Velvet Standard, Deconstructed, Maximalist Type, Data Drift, Soft Signal, Folk Frequency, Shadow Cut).

GSAP patterns for HyperFrames: `.agents/skills/gsap/SKILL.md`.

---

### Error Logging

Log every error encountered during implementation to `docs/ERROR.md` using the `ERR-NNN` format defined in that file. This includes build errors, runtime errors, animation/performance issues, and dependency conflicts. Do not skip "minor" issues.

### Performance Targets

- LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms
- 60fps is non-negotiable on animation-heavy pages
- Use `will-change` intentionally; profile GPU layers before shipping
- Always implement `prefers-reduced-motion` support via the `useReducedMotion` hook (`src/hooks/useReducedMotion.ts`)

### Accessibility

- WCAG 2.1 AA compliance is required
- All animations must be disabled or reduced when `prefers-reduced-motion: reduce` is set
- Portal pages must support keyboard navigation and ARIA labeling

## Important Notes

- Be concise and clear when providing information to user about implementation or error faced.
- Do not create documents in base directory.
- For complex tasks, use sub-agents to implement the tasks parallel with accuracy.
- For sub-agents, use sonnet 4.6 as a default agent if not another model specifically mentioned.
- Do not get confused if there are different changes on different modules. Team is working in this team so agents work on different modules at the same time simultaneously.
- If you see sudden changes in the codebase, do not revert as different agents are running paralelly for same or different modules at the same time. 

## When completing tasks:

1. Analyze repository structure
2. Use relevant skills from .github/skills (if exists)
3. If have any questions or uncertanity, just ask developer to clarify.

## After implementation finish:

- Write short summary text in console to inform developer what to expect from that implementation.
- Provide guidance on how to test the current phase and inform user if manual approach is needed
- Ensure .github\workflows\ci.yml test will pass as soon as I push to github.

## About Errors:
- Before implementing, check ERRORS.md for known failure patterns 
related to project. List any that apply before writing code.
- After fixed a bug. Now:
  1. State the root cause in one sentence
  2. Write the generalized rule that prevents this class of error
  3. Append it to ERRORS.md, can be found in each module specifically.
  4. Check if copilot-instructions.md needs updating
- Do not just fix the symptom. Identify: (a) why this happened, (b) where else in the codebase this same assumption might be wrong, (c) what rule would have prevented it.