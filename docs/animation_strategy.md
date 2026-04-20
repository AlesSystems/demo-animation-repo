# Animation Strategy — Ales B2B Hardware Platform

> **Version:** 1.0  
> **Last Updated:** 2026-04-20  
> **Author:** Architecture Team  
> **Related:** [Architecture](./architecture.md) · [Tech Stack](./tech_stack.md)

---

## Table of Contents

1. [Vision & Philosophy](#vision--philosophy)
2. [Animation Library Ecosystem](#animation-library-ecosystem)
3. [Homepage Scroll Journey](#homepage-scroll-journey)
4. [Section-by-Section Choreography](#section-by-section-choreography)
5. [Page Transition System](#page-transition-system)
6. [3D Product Experiences](#3d-product-experiences)
7. [Micro-Interactions & Details](#micro-interactions--details)
8. [Performance Architecture](#performance-architecture)
9. [Responsive Animation Strategy](#responsive-animation-strategy)
10. [Accessibility & Reduced Motion](#accessibility--reduced-motion)
11. [Implementation Guidelines](#implementation-guidelines)

---

## Vision & Philosophy

### The Goal

Ales is not selling commodity hardware — it is selling **trust, authority, and technological sophistication** to TRNC enterprise decision-makers. The website must communicate:

> *"This company operates at a level of precision and quality that matches the enterprise hardware they sell."*

Every animation serves a **narrative purpose**. We are not adding motion for decoration — we are building a cinematic experience where scroll becomes a storytelling medium. The visitor doesn't just browse products; they experience a carefully choreographed journey from **intrigue** → **revelation** → **trust** → **action**.

### Design References

The animation quality bar is set by:
- **Apple product pages** — hardware reveals timed to scroll, dramatic lighting transitions
- **Linear.app** — clean, purposeful micro-interactions that feel engineered
- **Porsche Digital** — cinematic scroll storytelling for premium products
- **Basement Studio** — aggressive 3D and scroll-driven experimentation

### Core Animation Principles

| Principle | Description |
|---|---|
| **Purposeful Motion** | Every animation communicates something — hierarchy, relationship, or narrative |
| **Scroll as Timeline** | The user's scroll becomes the playhead of a cinematic sequence |
| **Reveal, Don't Load** | Content appears to be *unveiled* rather than *loaded* — dramatic reveals over pop-ins |
| **Consistent Easing** | A unified easing language across all animations (see easing system below) |
| **Performance First** | Never sacrifice frame rate for visual complexity — 60fps is non-negotiable |
| **Progressive Complexity** | Simple fades on low-end devices, full cinematic on high-end |

---

## Animation Library Ecosystem

### Library Roles & Responsibilities

```
┌─────────────────────────────────────────────────────────────┐
│                    SCROLL FOUNDATION                         │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    LENIS                               │  │
│  │  Smooth scrolling engine — owns the scroll event      │  │
│  │  Provides normalized scroll position to all systems   │  │
│  │  Enables inertia-based momentum scrolling             │  │
│  └───────────────────────┬───────────────────────────────┘  │
│                          │ scroll position                   │
│            ┌─────────────┼──────────────┐                   │
│            ▼             ▼              ▼                    │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │    GSAP     │ │   FRAMER     │ │   THREE.JS /         │ │
│  │  ScrollTrig │ │   MOTION     │ │   REACT THREE FIBER  │ │
│  │             │ │              │ │                      │ │
│  │ Macro scroll│ │ Component    │ │ 3D product renders   │ │
│  │ sequences:  │ │ animations:  │ │ WebGL scenes:        │ │
│  │ - Pinning   │ │ - Mount/     │ │ - Camera orbits      │ │
│  │ - Parallax  │ │   unmount    │ │ - Material shifts     │ │
│  │ - Timeline  │ │ - Layout     │ │ - Lighting changes    │ │
│  │   scrubbing │ │ - Hover/tap  │ │ - Particle effects   │ │
│  │ - Staggered │ │ - Page       │ │                      │ │
│  │   reveals   │ │   transitions│ │                      │ │
│  └─────────────┘ └──────────────┘ └──────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  HYPERFRAMES                           │  │
│  │  Frame-by-frame animation control for complex         │  │
│  │  sequences — cinematic transitions, morphing effects  │  │
│  │  Integrates alongside GSAP for granular keyframe      │  │
│  │  orchestration and advanced visual effects             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Why This Combination?

| Library | Purpose | Why Not Alternatives |
|---|---|---|
| **Lenis** | Smooth scroll engine | Native CSS `scroll-behavior: smooth` lacks momentum, inertia, and precise position control. Locomotive Scroll is heavier and less maintained. |
| **GSAP + ScrollTrigger** | Scroll-driven choreography | Unmatched timeline control and scroll-scrubbing precision. No pure-CSS or Framer Motion equivalent for complex multi-element scroll sequences. |
| **Framer Motion** | React component animations | Native React API (`motion.div`), layout animations, `AnimatePresence` for route transitions. Better DX than raw GSAP for component-level work. |
| **Three.js / R3F** | 3D product visualization | Industry standard for WebGL. R3F provides React declarative API. No viable alternative at this quality level. |
| **Hyperframes** | Frame-by-frame animation control | Provides granular keyframe orchestration for cinematic transitions that require precise frame-level timing beyond GSAP's timeline model. Excellent for morphing effects and complex visual sequences. |

### Integration Architecture

```tsx
// Lenis ↔ GSAP ScrollTrigger Integration
// Lenis provides the scroll, GSAP responds to it

import Lenis from '@studio-freight/lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Lenis feeds its scroll position to GSAP's ScrollTrigger
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);

// GSAP's ticker drives Lenis's RAF loop
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

---

## Homepage Scroll Journey

### The Narrative Arc

The homepage is structured as a **cinematic scroll experience** with five distinct acts. The total scroll length is approximately **5–7x the viewport height**, giving ample room for dramatic pacing.

```
SCROLL POSITION    SECTION                    EMOTIONAL ARC
═══════════════    ═══════════════════════    ════════════════════

   0vh ─┬─        ┌─────────────────────┐
        │         │                     │    INTRIGUE
        │         │   ACT 1: HERO       │    "What is this?"
        │         │   Cinematic Intro    │    Dark, mysterious,
        │         │   (Pinned 2x vh)    │    premium feel
   200vh─┤         └─────────────────────┘
        │         ┌─────────────────────┐
        │         │                     │    REVELATION
        │         │   ACT 2: PRODUCTS   │    "This is impressive"
        │         │   Hardware Reveals   │    Products emerge from
        │         │   (3 sequences)     │    darkness, rotate,
        │         │                     │    show detail
   400vh─┤         └─────────────────────┘
        │         ┌─────────────────────┐
        │         │                     │    AUTHORITY
        │         │   ACT 3: TRNC       │    "They understand
        │         │   Enterprise Trust   │     our market"
        │         │                     │    Local presence,
        │         │                     │    partnerships
   500vh─┤         └─────────────────────┘
        │         ┌─────────────────────┐
        │         │                     │    CONFIDENCE
        │         │   ACT 4: PROOF      │    "Others trust them"
        │         │   Stats & Partners   │    Numbers, logos,
        │         │                     │    testimonials
   600vh─┤         └─────────────────────┘
        │         ┌─────────────────────┐
        │         │                     │    ACTION
        │         │   ACT 5: CTA        │    "I should contact
        │         │   Enterprise        │     them"
        │         │   Call-to-Action    │    Clear next step
   700vh─┘         └─────────────────────┘
```

---

## Section-by-Section Choreography

### ACT 1: Hero Sequence (0vh – 200vh)

**Concept:** A dark, premium opening that immediately communicates "this is not a typical hardware store." The hero section is **pinned for 2x viewport heights**, meaning the user scrolls through 200vh while the section stays fixed — the scroll progress drives the animation timeline.

**Scroll Timeline:**

```
Progress: 0% ──────────────────────────────────── 100%

0%    Background: Deep black/dark navy
      Logo mark: Invisible
      
10%   A subtle grid pattern fades in (very low opacity)
      Gives depth to the dark space
      
20%   "ALES" wordmark begins character-by-character reveal
      Each letter materializes with a subtle light sweep
      Typography: Large, premium sans-serif (e.g., Satoshi, General Sans)

35%   Tagline fades in below: "Enterprise Hardware for Northern Cyprus"
      Subtle parallax offset from the main title
      
50%   Camera "pulls back" (scale animation on container)
      Revealing the full composition
      A faint, atmospheric light source appears (top-right gradient)

65%   Hardware silhouettes begin to emerge from the darkness
      Three shapes: camera, access point, laptop
      Only edges are visible — backlit effect
      
80%   The silhouettes gain definition — materials become visible
      Subtle rotation suggests 3D (even if 2D with perspective transforms)
      
90%   Color accent appears — brand color highlight on key edges
      
100%  Section begins to unpin
      Smooth transition into Act 2 via opacity crossfade
```

**Technical Implementation:**

```tsx
// Hero scroll timeline (GSAP ScrollTrigger)
const heroTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top top",
    end: "+=200%",         // 2x viewport height of scroll
    pin: true,             // Pin the section
    scrub: 1,              // Smooth scrubbing (1s smoothing)
    anticipatePin: 1,      // Prevent jump on pin
  }
});

heroTimeline
  .fromTo(".grid-pattern", { opacity: 0 }, { opacity: 0.08 }, 0.1)
  .from(".hero-letter", { 
    opacity: 0, 
    y: 40, 
    stagger: 0.05,         // Character-by-character
    ease: "power3.out" 
  }, 0.2)
  .from(".hero-tagline", { opacity: 0, y: 20 }, 0.35)
  .fromTo(".hero-container", { scale: 1.1 }, { scale: 1 }, 0.5)
  .from(".hardware-silhouette", { 
    opacity: 0, 
    filter: "brightness(0)",
    stagger: 0.1 
  }, 0.65)
  .to(".brand-accent", { opacity: 1 }, 0.9);
```

### ACT 2: Product Reveal Sequence (200vh – 400vh)

**Concept:** Three sequential product reveals — each hardware category gets a dramatic entrance. Products appear to "emerge" into view with scroll-driven rotation and lighting effects.

**Sub-sequence Structure:**

Each product reveal follows the same choreographic pattern but with unique visual treatment:

```
┌─────────────────────────────────────────────────────┐
│  PRODUCT REVEAL PATTERN (repeated 3x)               │
│                                                     │
│  Phase 1: CATEGORY TITLE (10% of sub-scroll)       │
│  ├── Category name slides in from left              │
│  ├── Subtle line draws from title to product area   │
│  └── Background shifts color temperature            │
│                                                     │
│  Phase 2: PRODUCT EMERGENCE (50% of sub-scroll)    │
│  ├── 3D model or high-res image rotates into view   │
│  ├── Dramatic lighting change (rim light effect)    │
│  ├── Key spec numbers count up (fps counter style)  │
│  └── Hyperframes controls frame-by-frame reveal     │
│                                                     │
│  Phase 3: DETAILS STAGGER (30% of sub-scroll)      │
│  ├── Feature bullets appear with staggered timing   │
│  ├── Small product thumbnails slide in              │
│  └── "Explore" CTA button animates in              │
│                                                     │
│  Phase 4: TRANSITION (10% of sub-scroll)           │
│  ├── Current product scales down and shifts left    │
│  ├── Crossfade into next product category           │
│  └── Background color temperature shifts again      │
└─────────────────────────────────────────────────────┘
```

**Product-Specific Treatments:**

| Product | Visual Treatment | Key Animation |
|---|---|---|
| **Security Cameras** | Dark, surveillance aesthetic. Night-vision green accent. Camera lens reflection effect. | Lens "iris" opens to reveal the product; scan-line overlay |
| **Network Access Points** | Clean, white/blue tech aesthetic. Signal wave visualization. | Concentric signal rings pulse outward from the device |
| **Enterprise Laptops** | Sleek, professional. Keyboard detail. Screen glow. | Laptop lid opens (3D rotation on X-axis), screen illuminates |

**Spec Counter Animation:**

Key specifications animate with a number counter effect (inspired by F1 telemetry displays):

```tsx
// Number counter for specs (e.g., "4K" resolution, "WiFi 6E", "32GB RAM")
const specCounter = gsap.to(".spec-value", {
  textContent: targetValue,
  duration: 1.5,
  ease: "power2.out",
  snap: { textContent: 1 },      // Snap to integers
  scrollTrigger: {
    trigger: ".spec-section",
    start: "top 60%",
    toggleActions: "play none none reverse"
  }
});
```

### ACT 3: TRNC Enterprise Trust Section (400vh – 500vh)

**Concept:** Shift from product showcase to emotional trust-building. This section says: *"We are rooted in your market. We understand TRNC businesses."*

**Visual Treatment:**
- Background transitions to a warm, inviting palette
- Map of TRNC with animated connection points showing service coverage
- Photography of TRNC landmarks/business districts (parallax layers)

**Scroll Choreography:**

```
0%    Section enters viewport
      Warm gradient background fades in
      
20%   "Serving Northern Cyprus" headline — large, confident typography
      Text reveal animation (mask-based, bottom-to-top wipe)
      
40%   TRNC map outline draws itself (SVG path animation)
      Connection points pulse on — Lefkoşa, Girne, Gazimağusa, Güzelyurt
      Each point has a micro-label that fades in

60%   Service statistics stagger in beside the map:
      ├── "500+ Enterprise Clients"
      ├── "12 Years of Service"
      ├── "24/7 Local Support"
      └── Numbers use the counter animation from Act 2

80%   Partner logos carousel — trusted brands slide in
      Subtle infinite scroll marquee effect
      
100%  Smooth transition to Act 4
```

**SVG Map Path Animation:**

```tsx
// TRNC map outline draws itself
gsap.fromTo(".trnc-map path", 
  { strokeDashoffset: pathLength },
  { 
    strokeDashoffset: 0,
    duration: 2,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: ".trust-section",
      start: "top 50%",
      toggleActions: "play none none reverse"
    }
  }
);
```

### ACT 4: Social Proof & Stats (500vh – 600vh)

**Concept:** Quantitative proof — large numbers, partner logos, and testimonials that build confidence.

**Animations:**
- **Counter stats** — large numbers count up as they enter viewport (same pattern as Act 2 specs)
- **Testimonial cards** — stagger in with subtle rotation and shadow changes
- **Partner logo wall** — logos fade in with staggered timing, arranged in a grid with subtle hover magnification

### ACT 5: Enterprise CTA (600vh – 700vh)

**Concept:** Clear, compelling call-to-action with a final animation flourish.

**Choreography:**
- Section enters with a dramatic background shift (dark again, full-circle from hero)
- Headline: "Ready to Equip Your Enterprise?" — large text reveal
- Two CTA buttons animate in with a subtle bounce:
  - **"Request a Quote"** (primary — filled, animated border glow)
  - **"Schedule a Consultation"** (secondary — outlined)
- Subtle particle effect or ambient animation in the background to maintain visual interest

---

## Page Transition System

### Approach: Framer Motion AnimatePresence

All route changes within the marketing site use coordinated exit/enter animations:

```
CURRENT PAGE                         NEXT PAGE
┌──────────────┐                    ┌──────────────┐
│              │   ──── EXIT ───>   │              │
│  Content     │   Fade out +       │  Content     │
│  fades out   │   slide up         │  fades in    │
│              │                    │              │
└──────────────┘   <── ENTER ───    └──────────────┘
                   Fade in +
                   slide down
```

**Transition Variants:**

```tsx
const pageTransitionVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
    filter: "blur(4px)" 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.1, 0.25, 1]  // Custom cubic-bezier
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    filter: "blur(4px)",
    transition: { 
      duration: 0.3 
    }
  }
};
```

### Scroll Position Management

On route change:
1. Lenis scrolls to top with a smooth animation (not instant `scrollTo(0)`)
2. Exit animation plays on current page
3. Enter animation plays on new page
4. GSAP ScrollTrigger instances are refreshed for new page content

---

## 3D Product Experiences

### Technology: React Three Fiber (R3F)

3D scenes are used for:
1. **Homepage product reveals** (Act 2) — products rotate as user scrolls
2. **Product detail pages** — interactive 3D viewer (orbit controls)

### Implementation Strategy

```tsx
// Lazy-loaded 3D scene with suspense
const ProductScene = lazy(() => import('./ProductScene'));

function ProductReveal3D({ modelUrl }) {
  return (
    <Suspense fallback={<ProductImageFallback />}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}                    // Cap pixel ratio for performance
        performance={{ min: 0.5 }}       // R3F adaptive performance
      >
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} intensity={0.8} />
        <ScrollLinkedModel url={modelUrl} />
        <Environment preset="studio" />
      </Canvas>
    </Suspense>
  );
}
```

### Scroll-Linked 3D Rotation

```tsx
function ScrollLinkedModel({ url }) {
  const { scrollYProgress } = useScroll();
  const ref = useRef();
  const { scene } = useGLTF(url);

  useFrame(() => {
    // Rotation driven by scroll position
    const progress = scrollYProgress.get();
    ref.current.rotation.y = progress * Math.PI * 2;  // Full rotation
    ref.current.rotation.x = Math.sin(progress * Math.PI) * 0.3;
  });

  return <primitive ref={ref} object={scene} />;
}
```

### 3D Performance Guidelines

| Guideline | Target |
|---|---|
| **Polygon count** | < 50K triangles per model |
| **Texture resolution** | 1024x1024 max (with compression) |
| **Model format** | `.glb` with Draco compression |
| **Canvas DPR** | Capped at 2x (even on 3x displays) |
| **Adaptive quality** | R3F `<PerformanceMonitor>` drops quality if FPS < 50 |
| **Fallback** | Static high-res image if WebGL unavailable |

---

## Micro-Interactions & Details

### Easing System

All animations use a consistent easing vocabulary:

```typescript
export const EASING = {
  // Primary ease — used for most reveals and entrances
  smooth: [0.25, 0.1, 0.25, 1.0],        // CSS ease equivalent
  
  // Dramatic entrance — for hero elements and key reveals
  dramatic: [0.16, 1, 0.3, 1],            // Strong overshoot
  
  // Subtle exit — for elements leaving the viewport
  exit: [0.4, 0, 1, 1],                   // Ease-in (accelerate out)
  
  // Bounce — for CTAs and interactive elements
  bounce: [0.34, 1.56, 0.64, 1],          // Subtle bounce overshoot
  
  // Linear — for continuous animations (marquee, loading)
  linear: [0, 0, 1, 1],
} as const;
```

### Button Interactions

```
Idle ──── Hover ──── Press ──── Release
 │         │          │          │
 │    Scale 1.02  Scale 0.98  Scale 1.0
 │    Glow +0.1   Glow -0.1   Glow 0
 │    Shadow ↑    Shadow ↓    Shadow reset
```

### Navigation

- **Navbar:** Backdrop blur increases on scroll; becomes more opaque
- **Active link:** Underline draws from left to right (0.3s)
- **Mobile menu:** Full-screen overlay with staggered link entrance

### Cursor Effects (Desktop)

- Custom cursor that changes shape based on context:
  - **Default:** Small dot with trailing circle
  - **Hovering link:** Dot expands, label appears ("View", "Explore")
  - **Hovering 3D:** Dot becomes orbit icon, suggesting interaction
  - **Dragging:** Dot becomes grab cursor

---

## Performance Architecture

### The 60fps Contract

Every animation must maintain **60fps** (16.67ms per frame budget). This is the non-negotiable performance floor.

### Performance Rules

| Rule | Implementation |
|---|---|
| **Compositor-only properties** | Animate only `transform` and `opacity` where possible. Never animate `width`, `height`, `top`, `left`, `margin`, `padding`. |
| **`will-change` management** | Apply `will-change: transform` only when animation is about to start; remove after completion. Never leave it permanently. |
| **Layer promotion** | Use `transform: translateZ(0)` or `contain: layout style paint` sparingly to promote elements to GPU layers. |
| **Batch DOM reads/writes** | GSAP handles this internally. For custom animations, use `requestAnimationFrame` and batch reads before writes. |
| **Throttle scroll handlers** | Lenis provides 60fps-capped scroll events. Never add raw `scroll` event listeners. |
| **Offscreen cleanup** | GSAP ScrollTrigger's `onLeave` kills animations when sections are far from viewport. |

### Code Splitting for Animation Libraries

```javascript
// Animation libraries are NOT in the initial bundle
// They load on-demand based on scroll position

// Lenis — loads immediately (needed for scroll)
import Lenis from '@studio-freight/lenis';  // ~8KB gzipped

// GSAP — loads when first scroll-triggered section approaches
const gsapModule = await import('gsap');           // ~24KB gzipped
const scrollTrigger = await import('gsap/ScrollTrigger');  // ~12KB

// Three.js — loads only when 3D section is near viewport
const threeModule = await import('three');          // ~150KB gzipped
const r3fModule = await import('@react-three/fiber');

// Hyperframes — loads alongside GSAP for advanced sequences
const hyperframes = await import('hyperframes');    // Loaded with GSAP
```

### Performance Monitoring

```typescript
// Real-time FPS monitoring during development
if (process.env.NODE_ENV === 'development') {
  const stats = new Stats();
  document.body.appendChild(stats.dom);
  
  gsap.ticker.add(() => {
    stats.begin();
    // ... animation frame
    stats.end();
  });
}

// Production: Report animation performance to analytics
function reportAnimationPerf(sectionName: string, avgFps: number) {
  if (avgFps < 55) {
    analytics.track('animation_jank', {
      section: sectionName,
      fps: avgFps,
      device: navigator.userAgent,
    });
  }
}
```

### Device-Based Quality Tiers

```typescript
type QualityTier = 'high' | 'medium' | 'low';

function detectQualityTier(): QualityTier {
  const gpu = getGPUInfo();                    // WebGL renderer string
  const cores = navigator.hardwareConcurrency;  // CPU cores
  const memory = (navigator as any).deviceMemory;  // RAM (approximate)
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  if (isMobile && (cores <= 4 || memory <= 4)) return 'low';
  if (isMobile || cores <= 4) return 'medium';
  return 'high';
}

// Quality-tier-specific animation configs
const QUALITY_CONFIGS: Record<QualityTier, AnimationConfig> = {
  high: {
    enable3D: true,
    particleCount: 200,
    shadowQuality: 'high',
    textureResolution: 1024,
    enableBlur: true,
    enableParallaxLayers: 5,
  },
  medium: {
    enable3D: true,
    particleCount: 50,
    shadowQuality: 'low',
    textureResolution: 512,
    enableBlur: true,
    enableParallaxLayers: 3,
  },
  low: {
    enable3D: false,              // Use static images instead
    particleCount: 0,
    shadowQuality: 'none',
    textureResolution: 256,
    enableBlur: false,            // CSS blur is expensive on mobile
    enableParallaxLayers: 1,      // Minimal parallax
  },
};
```

---

## Responsive Animation Strategy

### Breakpoint-Based Animation Adaptation

| Breakpoint | Animation Approach |
|---|---|
| **Desktop (≥1280px)** | Full cinematic experience — all animations, 3D, parallax, custom cursor |
| **Tablet (768–1279px)** | Reduced parallax layers (3→1), 3D remains but at lower quality, no custom cursor |
| **Mobile (< 768px)** | Simplified reveals (fade + slide only), no 3D (static images), no pinning, shorter scroll sequences |

### Mobile-Specific Adjustments

1. **No ScrollTrigger pinning on mobile** — pinning conflicts with mobile browser address bar behavior and causes jarring jumps. Replace with standard scroll-triggered fade-in reveals.

2. **Touch-friendly interactions** — replace hover effects with tap feedback; no custom cursor.

3. **Reduced scroll length** — mobile homepage scroll is ~3x viewport (vs. 7x desktop) to prevent fatigue.

4. **3D → Image fallback** — Three.js canvas is replaced with high-quality product photography on mobile. The 3D experience is reserved for desktop where GPU is reliable.

```tsx
function ProductShowcase() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  if (isMobile) {
    return <ProductImageCarousel />;     // Swipeable image gallery
  }
  
  return <ProductScene3D />;             // Full Three.js experience
}
```

---

## Accessibility & Reduced Motion

### `prefers-reduced-motion` Support

All animations respect the user's motion preferences:

```tsx
function useAnimationConfig() {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return {
      // Replace all motion with simple crossfades
      reveal: { opacity: [0, 1], duration: 0.3 },
      scroll: { enabled: false },      // Disable scroll-driven animations
      parallax: { enabled: false },    // No parallax
      threeD: { enabled: false },      // Static images only
      transitions: { type: 'crossfade', duration: 0.2 },
    };
  }
  
  return fullAnimationConfig;
}
```

### Additional Accessibility Measures

| Measure | Implementation |
|---|---|
| **Focus management** | Animated elements maintain focus order; no focus trapping during animations |
| **ARIA live regions** | Dynamic content changes (counters, reveals) announced to screen readers |
| **Keyboard navigation** | All interactive elements accessible via keyboard; animations don't block tab flow |
| **Color contrast** | Animated color transitions never pass through a state with < 4.5:1 contrast ratio |
| **Seizure safety** | No flashing animations > 3 times per second per WCAG 2.3.1 |

---

## Implementation Guidelines

### File Organization

```
lib/animations/
├── gsap-config.ts          # GSAP plugin registration and defaults
├── scroll-triggers.ts      # Reusable ScrollTrigger factory functions
├── variants.ts             # Framer Motion variant definitions
├── easing.ts               # Easing constants (shared across GSAP + FM)
├── quality-tiers.ts        # Device detection and quality configs
└── hyperframes-config.ts   # Hyperframes setup and sequence definitions

components/animations/
├── SmoothScroll.tsx         # Lenis provider component
├── ScrollReveal.tsx         # Generic scroll-triggered reveal wrapper
├── ParallaxLayer.tsx        # Parallax background element
├── PageTransition.tsx       # Framer Motion route transition
├── TextReveal.tsx           # Character/word reveal animation
├── CounterAnimation.tsx     # Number counting animation
└── CursorFollower.tsx       # Custom cursor (desktop only)
```

### Animation Component Pattern

Every animation component should follow this pattern:

```tsx
'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-left' | 'stagger';
  delay?: number;
}

export function ScrollReveal({ children, animation = 'fade-up', delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    if (prefersReducedMotion || !ref.current) return;

    const ctx = gsap.context(() => {
      // Animation setup using ScrollTrigger
      // Uses quality tier to determine complexity
    }, ref);

    return () => ctx.revert();  // Cleanup on unmount
  }, [prefersReducedMotion, isMobile]);

  return (
    <div ref={ref} style={prefersReducedMotion ? {} : { opacity: 0 }}>
      {children}
    </div>
  );
}
```

### Key Principles for Developers

1. **Always clean up.** Every `useEffect` that creates GSAP animations must return `ctx.revert()`.
2. **Never animate layout properties.** Stick to `transform` and `opacity`.
3. **Test on real devices.** Chrome DevTools throttling does not accurately simulate mobile GPU limitations.
4. **Profile before shipping.** Use Chrome Performance tab to verify no frames exceed 16ms.
5. **Progressive enhancement.** The site must be usable with JavaScript disabled — animations are enhancement, not content.

---

*This document is the creative and technical blueprint for all animations on the Ales platform. All animation work should reference this strategy for consistency and performance compliance.*
