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
- Ensure .github\workflows\ci.yml test will pass as soon as I push to github: Lint check and Type Check.

## About Errors:
- Before implementing, check ERRORS.md for known failure patterns 
related to project. List any that apply before writing code.
- After fixed a bug. Now:
  1. State the root cause in one sentence
  2. Write the generalized rule that prevents this class of error
  3. Append it to ERRORS.md, can be found in each module specifically.
  4. Check if copilot-instructions.md needs updating
- Do not just fix the symptom. Identify: (a) why this happened, (b) where else in the codebase this same assumption might be wrong, (c) what rule would have prevented it.