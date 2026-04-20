# Ales — B2B Enterprise Hardware Platform

A cinematic, Awwwards-caliber web platform for **Ales**, a B2B hardware reseller in the Turkish Republic of Northern Cyprus (TRNC). Ales supplies enterprise-grade security cameras, network access points, and business laptops to government agencies, universities, enterprises, and SMBs.

## 🎯 Project Goal

Build a visually sophisticated, high-performance website that establishes credibility, drives inbound enterprise inquiries, and streamlines the quote and procurement workflow for B2B clients. The website is **not an e-commerce storefront** — it is a trust-building and lead-generation asset designed to convert enterprise visitors into qualified quote requests.

---

## 📋 What We Build

### Product Categories
- **Security Cameras** — Indoor/outdoor fixed, PTZ, AI-powered, NVR systems
- **Network Access Points** — WiFi 6/6E, cloud-managed infrastructure
- **Enterprise Laptops** — Business-class, ultrabooks, ruggedized, workstations

### Core Features
- **Product Discovery** — Filterable product listing, comparison tools, high-resolution imagery
- **Enterprise Quote Builder** — Multi-line quote requests with organization details and custom notes
- **Enterprise Portal** — Order history, quote tracking, support tickets, saved products
- **Content & Trust** — Case studies, certifications, partner logos, client testimonials
- **Localization** — Full Turkish and English support, TRNC-specific compliance

---

## 🏗️ Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js | 14+ | Full-stack React with App Router, RSC, ISR |
| **Language** | TypeScript | 5+ | Type-safe development |
| **Styling** | Tailwind CSS | Latest | Utility-first CSS framework |
| **Animation** | GSAP + ScrollTrigger | 3.12+ | Scroll-driven, timeline-based animations |
| **Smooth Scroll** | Lenis | Latest | High-performance scroll hijacking |
| **Motion UI** | Framer Motion | Latest | Component-level animations and transitions |
| **3D Graphics** | React Three Fiber | Latest | WebGL 3D product visualization |
| **State** | Zustand / TanStack Query | Latest | Lightweight state + async data management |
| **Deployment** | Vercel | — | Edge-optimized hosting for TRNC regions |

---

## 🎬 Animation Philosophy

Every animation serves a **narrative purpose**. The user experience is choreographed as a cinematic journey:

**Intrigue** → **Revelation** → **Trust** → **Action**

### Core Principles
- **Purposeful Motion** — Every animation communicates hierarchy, relationship, or story
- **Scroll as Timeline** — User scroll becomes the playhead of a cinematic sequence
- **Reveal, Don't Load** — Content appears *unveiled* rather than *loaded*
- **Responsive Motion** — Smooth on desktop; optimized for mobile and reduced-motion preferences
- **Performance-First** — GPU-accelerated, will-change optimized, no jank on enterprise networks

### Reference Inspirations
- Apple product pages (hardware reveal choreography)
- Linear.app (clean, engineered micro-interactions)
- Porsche Digital (cinematic scroll storytelling)
- Basement Studio (aggressive 3D scroll experimentation)

---

## 🚀 Development Phases

### Phase 1: Foundation & Setup
- Next.js + TypeScript + Tailwind scaffolding
- Design system (colors, typography, spacing, brand guidelines)
- Animation library integration (GSAP, Framer Motion, Lenis, Three.js)
- CI/CD pipeline and staging/production environments

### Phase 2: Homepage Design & Core Animations
- Full-screen cinematic hero with intro animation
- Smooth scroll implementation with Lenis
- Scroll-triggered product reveals (GSAP ScrollTrigger)
- 3D hardware showcase (Three.js / React Three Fiber)
- Enterprise trust section with logos and certifications
- Navigation with scroll-aware behavior
- Mobile responsiveness with reduced-motion support

### Phase 3: Product Pages & Catalog
- Product listing with animated filters
- Individual product detail pages with 3D model viewer
- Image gallery with smooth transitions
- Product comparison feature (side-by-side specs)
- Animated page transitions

### Phase 4: Business Features
- Enterprise quote request form with confirmation animation
- Contact page and consultation booking
- Basic client portal (order history, quote tracking)
- Newsletter signup with animated feedback
- Form validation with accessible error states

### Phase 5: Polish & Optimization
- Core Web Vitals audit (LCP ≤2.5s, CLS ≤0.1, INP ≤200ms)
- Animation performance profiling
- SEO implementation (metadata, Open Graph, structured data)
- WCAG 2.1 AA accessibility compliance
- Cross-browser and device testing
- Analytics integration

### Phase 6: Launch & Iteration
- Soft launch with select TRNC enterprise clients
- Feedback collection and iteration
- Content population (case studies, testimonials)
- Full public launch and monitoring

---

## 📊 Success Metrics (Year 1 Targets)

### Conversion & Lead Generation
- Quote request conversion rate: ≥3%
- Quote-to-sales engagement: ≥40%
- Average deal size: ≥₺50,000
- Form completion rate: ≥60%

### Engagement
- Average session duration: ≥3 minutes
- Product page engagement: ≥25%
- Pages per session: ≥4
- Case study read-through: ≥50%

### Technical & Performance
- **LCP:** ≤2.5s
- **CLS:** ≤0.1
- **INP:** ≤200ms
- **Uptime:** ≥99.9%
- **Mobile usability:** 100%

---

## 🌍 Localization & TRNC Compliance

### Languages
- **Turkish** (primary) — All UI, product content, legal pages, emails
- **English** (secondary) — All UI, technical datasheets, international stakeholders

### TRNC-Specific Requirements
- VAT (KDV) display with clear `KDV Dahil` / `KDV Hariç` labeling
- Business registration number and address displayed in footer
- Turkish date format (DD.MM.YYYY) and number formatting (. thousands, , decimal)
- Proforma invoice workflow for enterprise payments (not instant checkout)
- Quote-based pricing model (no stale public pricing)
- KVKK data privacy compliance for cross-border operations

---

## 📁 Project Structure

```
.
├── docs/                          # Comprehensive documentation
│   ├── business_requirements.md   # B2B requirements and audience analysis
│   ├── tech_stack.md              # Technology choices and rationale
│   ├── animation_strategy.md      # Animation philosophy and choreography
│   ├── architecture.md            # System design and component structure
│   ├── ROADMAP.md                 # Implementation phases
│   └── ERROR.md                   # Error tracking and resolution log
├── src/
│   ├── app/                       # Next.js App Router pages
│   ├── components/                # Reusable UI components
│   ├── lib/                       # Utilities (GSAP setup, Lenis config, etc.)
│   ├── styles/                    # Global styles and Tailwind config
│   └── types/                     # TypeScript type definitions
├── public/                        # Static assets
├── .next/                         # Build output (gitignored)
└── README.md                      # This file
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ with npm or yarn
- Git

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/AlesSystems/demo-animation-repo.git
cd demo-animation-repo

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type check
npm run type-check
```

---

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:

- **[business_requirements.md](./docs/business_requirements.md)** — Complete B2B requirements, audience analysis, user flows, and success metrics
- **[tech_stack.md](./docs/tech_stack.md)** — Technology choices, rationale, and library interaction map
- **[animation_strategy.md](./docs/animation_strategy.md)** — Animation philosophy, choreography guide, and implementation patterns
- **[architecture.md](./docs/architecture.md)** — System design, component structure, routing, and data fetching strategies
- **[ROADMAP.md](./docs/ROADMAP.md)** — Development phases and quick-win improvements
- **[ERROR.md](./docs/ERROR.md)** — Error tracking log for debugging and resolution reference

---

## 🎨 Design System

The design system is defined in:
- **Colors** — Brand palette aligned with TRNC enterprise aesthetic
- **Typography** — Professional, hierarchy-driven font scales
- **Spacing** — Consistent scale for margins, padding, and gaps
- **Animation Tokens** — Timing functions, durations, and easing curves

See `src/styles/` and design documentation for implementation details.

---

## 🔒 Security & Compliance

- **Data Privacy** — KVKK and Turkish GDPR compliance for enterprise client data
- **Form Security** — CSRF protection, input validation, secure transmission
- **Content Security** — No hardcoded secrets; environment variables for sensitive data
- **Accessibility** — WCAG 2.1 AA compliance, keyboard navigation, reduced-motion support

---

## 📞 Support & Contact

For project inquiries or technical questions:
- **Project Lead:** Architecture Team
- **Last Updated:** 2026-04-20
- **Repository:** [AlesSystems/demo-animation-repo](https://github.com/AlesSystems/demo-animation-repo)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

You are free to:
- Use this code for commercial or private purposes
- Modify and distribute the code
- Sublicense the software

With the condition that you must:
- Include a copy of the license and copyright notice

---

*Built with ❤️ for enterprise B2B hardware buyers in the TRNC.*
