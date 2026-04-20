# System Architecture — Ales B2B Hardware Platform

> **Version:** 1.0  
> **Last Updated:** 2026-04-20  
> **Author:** Architecture Team  

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [High-Level System Diagram](#high-level-system-diagram)
4. [Application Layer Architecture](#application-layer-architecture)
5. [Component Structure](#component-structure)
6. [Routing Strategy](#routing-strategy)
7. [Data Fetching Strategy](#data-fetching-strategy)
8. [Animation Architecture](#animation-architecture)
9. [Performance Architecture](#performance-architecture)
10. [Deployment Architecture](#deployment-architecture)
11. [Security Considerations](#security-considerations)

---

## Overview

The Ales platform is a B2B e-commerce web application designed to showcase and sell enterprise hardware — security cameras, network access points, and enterprise laptops — to organizations in the Turkish Republic of Northern Cyprus (TRNC).

The application is built on **Next.js 14+ (App Router)** with a heavy emphasis on cinematic, scroll-driven animations that establish brand authority and trust with enterprise decision-makers. The architecture must balance two competing demands:

1. **Visual spectacle** — Hollywood-level animations, 3D product reveals, and seamless transitions
2. **Enterprise performance** — fast load times, SEO-friendliness, and reliability on varying corporate networks in the TRNC region

---

## Architecture Principles

| Principle | Rationale |
|---|---|
| **Server-First Rendering** | Maximize SEO and initial load performance; critical for B2B discovery |
| **Progressive Enhancement** | Core product information accessible without JavaScript; animations layer on top |
| **Animation Isolation** | Animation logic separated from business logic to prevent coupling |
| **Edge-Optimized Delivery** | Static assets and pages cached at the edge closest to TRNC |
| **Type Safety** | Full TypeScript coverage to manage complexity of animation state + business logic |
| **Component Composition** | Small, focused components composed into complex animated sections |

---

## High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                              │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  React    │  │  Animation   │  │  3D       │  │  State        │  │
│  │  UI Layer │  │  Engine      │  │  Canvas   │  │  Management   │  │
│  │          │  │  (GSAP/FM)   │  │  (R3F)    │  │  (Zustand)    │  │
│  └────┬─────┘  └──────┬───────┘  └─────┬────┘  └───────┬───────┘  │
│       └────────────────┴────────────────┴───────────────┘          │
│                              │                                      │
└──────────────────────────────┼──────────────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────┼──────────────────────────────────────┐
│                        NEXT.JS SERVER                               │
│  ┌───────────────┐  ┌───────┴────────┐  ┌──────────────────────┐  │
│  │  App Router   │  │  API Routes /  │  │  Middleware           │  │
│  │  (Pages/      │  │  Server        │  │  (i18n, auth,        │  │
│  │   Layouts)    │  │  Actions       │  │   geo-redirect)      │  │
│  └───────┬───────┘  └───────┬────────┘  └──────────────────────┘  │
│          │                  │                                       │
│  ┌───────┴──────────────────┴────────────────────────────────────┐ │
│  │                    DATA LAYER                                  │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐ │ │
│  │  │  Headless   │  │  Product     │  │  Form / Quote        │ │ │
│  │  │  CMS        │  │  Database    │  │  Submissions         │ │ │
│  │  │  (Sanity)   │  │  (Postgres)  │  │  (Server Actions)    │ │ │
│  │  └─────────────┘  └──────────────┘  └──────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                        INFRASTRUCTURE                               │
│  ┌──────────────┐  ┌────────┴───────┐  ┌────────────────────────┐ │
│  │  Vercel Edge  │  │  CDN / Asset  │  │  Object Storage       │ │
│  │  Network     │  │  Delivery     │  │  (3D Models, Media)   │ │
│  └──────────────┘  └───────────────┘  └────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

---

## Application Layer Architecture

### Next.js App Router Structure

The application uses the **App Router** (introduced in Next.js 13+) for its native support of:
- **React Server Components (RSC)** — render product data on the server, ship zero JS for static content
- **Streaming** — progressive rendering of heavy animation sections
- **Layouts** — persistent navigation and smooth scroll context across routes
- **Route Groups** — organize marketing pages vs. enterprise portal

### Directory Structure

```
src/
├── app/
│   ├── (marketing)/              # Route group: public-facing pages
│   │   ├── layout.tsx            # Marketing layout (smooth scroll wrapper, nav)
│   │   ├── page.tsx              # Homepage — cinematic animations
│   │   ├── products/
│   │   │   ├── page.tsx          # Product catalog listing
│   │   │   ├── [category]/
│   │   │   │   ├── page.tsx      # Category page (cameras, APs, laptops)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # Individual product detail
│   │   ├── about/
│   │   │   └── page.tsx          # Company story, TRNC presence
│   │   ├── contact/
│   │   │   └── page.tsx          # Contact form, consultation booking
│   │   └── quote/
│   │       └── page.tsx          # Enterprise quote request flow
│   │
│   ├── (portal)/                 # Route group: authenticated enterprise portal
│   │   ├── layout.tsx            # Portal layout (sidebar, no heavy animations)
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Client dashboard
│   │   ├── orders/
│   │   │   └── page.tsx          # Order history
│   │   └── support/
│   │       └── page.tsx          # Support tickets
│   │
│   ├── api/                      # API routes
│   │   ├── quote/
│   │   │   └── route.ts          # Quote submission endpoint
│   │   ├── products/
│   │   │   └── route.ts          # Product search / filter API
│   │   └── contact/
│   │       └── route.ts          # Contact form submission
│   │
│   ├── layout.tsx                # Root layout (fonts, metadata, providers)
│   ├── not-found.tsx             # Custom 404 with animation
│   └── globals.css               # Tailwind base + custom properties
│
├── components/
│   ├── ui/                       # Base UI primitives (Button, Card, Input)
│   ├── layout/                   # Navbar, Footer, Sidebar
│   ├── animations/               # Animation wrapper components
│   │   ├── ScrollReveal.tsx      # GSAP ScrollTrigger wrapper
│   │   ├── PageTransition.tsx    # Framer Motion page transitions
│   │   ├── ParallaxLayer.tsx     # Parallax background elements
│   │   ├── TextReveal.tsx        # Character-by-character text animation
│   │   └── SmoothScroll.tsx      # Lenis scroll provider
│   ├── sections/                 # Homepage sections
│   │   ├── Hero.tsx              # Cinematic hero with 3D elements
│   │   ├── ProductReveal.tsx     # Scroll-triggered product showcase
│   │   ├── TrustSection.tsx      # Enterprise trust / TRNC section
│   │   └── CTASection.tsx        # Call-to-action with animation
│   └── products/                 # Product-specific components
│       ├── ProductCard.tsx
│       ├── ProductGrid.tsx
│       ├── ProductViewer3D.tsx   # Three.js product viewer
│       └── SpecTable.tsx
│
├── lib/
│   ├── animations/               # Animation utilities and configs
│   │   ├── gsap-config.ts        # GSAP plugin registration
│   │   ├── scroll-triggers.ts    # Reusable scroll trigger definitions
│   │   └── variants.ts           # Framer Motion animation variants
│   ├── api/                      # API client functions
│   ├── cms/                      # CMS client (Sanity/Contentful)
│   └── utils/                    # General utilities
│
├── hooks/
│   ├── useScrollProgress.ts      # Track scroll position (0-1)
│   ├── useInView.ts              # Intersection observer hook
│   ├── useMediaQuery.ts          # Responsive animation switching
│   └── useReducedMotion.ts       # Respect prefers-reduced-motion
│
├── stores/
│   └── ui-store.ts               # Zustand store (loading state, nav, theme)
│
├── types/
│   ├── product.ts                # Product data types
│   ├── quote.ts                  # Quote request types
│   └── animation.ts              # Animation config types
│
└── styles/
    ├── animations.css            # Complex keyframe animations
    └── fonts.css                 # Font-face declarations
```

---

## Component Structure

### Component Classification

Components are organized by their **rendering strategy** and **animation role**:

| Type | Rendering | Animation Role | Example |
|---|---|---|---|
| **Server Components** | RSC (default) | None — pure data display | `ProductGrid`, `SpecTable`, `Footer` |
| **Client Wrappers** | `"use client"` | Animation orchestration | `ScrollReveal`, `PageTransition` |
| **Hybrid Sections** | Server shell + Client islands | Server renders content, client animates | `Hero`, `ProductReveal` |
| **Canvas Components** | Client only | Full WebGL/3D | `ProductViewer3D` |

### Composition Pattern

The key architectural pattern is **Server Content + Client Animation Wrapper**:

```tsx
// Server Component — fetches data, renders static HTML
async function ProductShowcase() {
  const products = await getProducts();
  return (
    <ScrollReveal animation="stagger-up">  {/* Client wrapper */}
      <div className="grid grid-cols-3 gap-8">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />  {/* Server component */}
        ))}
      </div>
    </ScrollReveal>
  );
}
```

This ensures:
- Product data is **fetched and rendered on the server** (SEO, performance)
- Animation logic is **client-only** and adds no payload until hydration
- If JavaScript fails, content is still visible (progressive enhancement)

---

## Routing Strategy

### Marketing Pages (Static-First)

| Route | Strategy | Revalidation | Notes |
|---|---|---|---|
| `/` (Homepage) | **SSG** | On-demand (ISR) | Animations are client-side; HTML is static shell |
| `/products` | **SSG** | Every 1 hour (ISR) | Product catalog changes infrequently |
| `/products/[category]` | **SSG** | Every 1 hour (ISR) | 3 categories: cameras, access-points, laptops |
| `/products/[category]/[slug]` | **SSG** | Every 1 hour (ISR) | `generateStaticParams` for all products |
| `/about` | **SSG** | On-demand | Rarely changes |
| `/contact` | **SSG** | Static | Form submission via Server Action |
| `/quote` | **SSG** | Static | Multi-step form, all client-side logic |

### Portal Pages (Dynamic)

| Route | Strategy | Auth | Notes |
|---|---|---|---|
| `/dashboard` | **SSR** | Required | Personalized content |
| `/orders` | **SSR** | Required | Real-time order data |
| `/support` | **SSR** | Required | Ticket status |

### Route Transitions

Page transitions use **Framer Motion's `AnimatePresence`** wrapped at the layout level:

```tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }) {
  return (
    <SmoothScrollProvider>
      <Navbar />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
    </SmoothScrollProvider>
  );
}
```

---

## Data Fetching Strategy

### Decision Matrix: SSG vs SSR

```
                    ┌─────────────────────────────────┐
                    │   Does the page need             │
                    │   per-request personalization?    │
                    └───────────┬─────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                   YES                   NO
                    │                     │
              ┌─────┴─────┐       ┌──────┴──────┐
              │    SSR     │       │ Does data   │
              │ (Portal)  │       │ change      │
              └───────────┘       │ frequently? │
                                  └──────┬──────┘
                                         │
                               ┌─────────┴─────────┐
                               │                   │
                              YES                  NO
                               │                   │
                        ┌──────┴──────┐     ┌──────┴──────┐
                        │  ISR with   │     │  Pure SSG   │
                        │  revalidate │     │  (build)    │
                        └─────────────┘     └─────────────┘
```

### Product Data Flow

1. **Build Time:** `generateStaticParams` pre-renders all product pages
2. **CMS Webhook:** On product update, triggers ISR revalidation via `revalidatePath`
3. **Client-Side:** Product filters/search use SWR or React Query for instant UI updates
4. **3D Assets:** Loaded lazily per-product via suspense boundaries

### CMS Integration (Sanity)

```
Sanity Studio (CMS) ──webhook──> Next.js API Route ──> revalidatePath()
       │                                                      │
       └──── GROQ queries ────> Server Components ──> Static HTML
```

**Why Sanity:**
- Real-time preview for content editors
- GROQ query language is powerful for product relationships
- Image CDN with automatic optimization
- Portable Text for rich product descriptions

---

## Animation Architecture

> **Detailed animation choreography is documented in [`animation_strategy.md`](./animation_strategy.md).**

### Architectural Boundaries

```
┌─────────────────────────────────────────────────────┐
│                ANIMATION LAYER                       │
│                                                     │
│  ┌─────────────┐  ┌──────────┐  ┌───────────────┐ │
│  │  GSAP +      │  │  Framer  │  │  Three.js /   │ │
│  │  ScrollTrigger│  │  Motion  │  │  React Three  │ │
│  │              │  │          │  │  Fiber        │ │
│  │  Scroll-     │  │  Component│  │  3D Product   │ │
│  │  driven      │  │  mount/   │  │  Renders      │ │
│  │  sequences   │  │  unmount  │  │               │ │
│  └──────┬───────┘  └────┬─────┘  └───────┬───────┘ │
│         │               │                │          │
│  ┌──────┴───────────────┴────────────────┴───────┐ │
│  │           Lenis Smooth Scroll Engine           │ │
│  │     (provides normalized scroll position)      │ │
│  └────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────┐
│               REACT COMPONENT TREE                   │
│  Server Components provide HTML structure            │
│  Client Components add animation behavior            │
└─────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **Lenis owns the scroll** — All scroll events flow through Lenis, not the native browser scroll. This provides the buttery-smooth scroll feel and consistent scroll position values for GSAP and Framer Motion.

2. **GSAP for orchestration, Framer Motion for components** — GSAP ScrollTrigger handles the macro scroll journey (section pinning, parallax, reveal sequencing). Framer Motion handles micro-animations (button hovers, layout changes, page transitions).

3. **Animation configs are data** — Animation timelines, easing curves, and trigger points are defined as typed config objects in `lib/animations/`, not inline in components. This makes them testable and maintainable.

4. **Reduced motion support** — The `useReducedMotion` hook globally disables complex animations when the user has `prefers-reduced-motion: reduce` set, replacing them with simple fade-ins.

---

## Performance Architecture

### Performance Budget

| Metric | Target | Strategy |
|---|---|---|
| **LCP** | < 2.5s | SSG + edge caching + preloaded hero assets |
| **FID** | < 100ms | Minimal main-thread JS; animations on compositor |
| **CLS** | < 0.1 | Fixed dimensions for animation containers |
| **TTI** | < 3.5s | Code splitting; defer animation JS |
| **JS Bundle** | < 200KB (initial) | Dynamic imports for GSAP, Three.js |

### Code Splitting Strategy

```
Initial Load (< 200KB gzipped):
├── Next.js runtime
├── React
├── Tailwind (purged)
├── Lenis (smooth scroll — needed immediately)
└── Framer Motion (core — page transitions)

Lazy Loaded (on scroll / interaction):
├── GSAP + ScrollTrigger (when first scroll section enters viewport)
├── Three.js + R3F (when 3D section approaches viewport)
├── Product detail components
└── Portal / dashboard modules
```

### Image & Asset Strategy

| Asset Type | Strategy |
|---|---|
| Product photos | `next/image` with Sanity CDN, AVIF/WebP, responsive `sizes` |
| 3D models | `.glb` format, Draco compressed, loaded via `useGLTF` with suspense |
| Hero video/sequence | Preloaded poster image; video streams progressively |
| Icons | Inline SVGs (Lucide React) — no icon font |
| Fonts | `next/font` with `display: swap`, subset for Turkish characters |

---

## Deployment Architecture

### Recommended: Vercel

```
┌────────────────────────────────────────────────┐
│                 VERCEL PLATFORM                  │
│                                                  │
│  ┌──────────────┐    ┌───────────────────────┐  │
│  │  Edge Network │    │  Serverless Functions │  │
│  │  (CDN)        │    │  (API Routes, SSR)    │  │
│  │               │    │                       │  │
│  │  Static pages │    │  Quote submissions    │  │
│  │  Assets (JS,  │    │  Product search API   │  │
│  │  CSS, images) │    │  Auth (portal)        │  │
│  └──────┬────────┘    └───────────┬───────────┘  │
│         │                        │               │
│  ┌──────┴────────────────────────┴────────────┐  │
│  │            Vercel Edge Middleware           │  │
│  │  - Locale detection (TR/EN)                │  │
│  │  - Geo-based redirects                     │  │
│  │  - Bot detection                           │  │
│  └────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
         │                        │
    ┌────┴────┐            ┌──────┴──────┐
    │ Sanity  │            │  PostgreSQL │
    │ CMS     │            │  (Neon /    │
    │ (CDN)   │            │   Supabase) │
    └─────────┘            └─────────────┘
```

### Why Vercel for TRNC Market

1. **Edge Network** — Vercel has edge nodes in Istanbul, providing the lowest latency to TRNC users
2. **ISR Support** — Native incremental static regeneration for product pages
3. **Zero-Config** — Next.js-optimized deployment pipeline
4. **Preview Deployments** — Every PR gets a preview URL for stakeholder review
5. **Analytics** — Built-in Web Vitals monitoring

### Alternative: Self-Hosted (Docker)

For organizations preferring on-premise or custom infrastructure:

```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

Deploy behind **Nginx** with:
- Brotli/gzip compression
- Cache headers for static assets (1 year)
- Reverse proxy to Next.js server
- SSL termination (Let's Encrypt)

---

## Security Considerations

| Area | Approach |
|---|---|
| **Authentication** | NextAuth.js with credentials provider for portal; optional SSO for enterprise |
| **CSRF Protection** | Built-in with Next.js Server Actions |
| **Rate Limiting** | Middleware-based rate limiting on API routes (quote submissions) |
| **Input Validation** | Zod schemas for all form submissions (quote, contact) |
| **Content Security Policy** | Strict CSP headers; allowlist for CDN, analytics, CMS |
| **3D Asset Integrity** | Subresource integrity for externally loaded 3D models |
| **Environment Variables** | All secrets in Vercel env vars; never in client bundle |

---

## Cross-References

- **[Animation Strategy](./animation_strategy.md)** — Detailed animation choreography and performance plan
- **[Tech Stack](./tech_stack.md)** — Complete library and tooling decisions
- **[Business Requirements](./business_requirements.md)** — User flows and business context
- **[Roadmap](./ROADMAP.md)** — Implementation phases and timeline

---

*This document is maintained by the Ales development team and should be updated as architectural decisions evolve.*
