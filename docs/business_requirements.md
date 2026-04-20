# Business Requirements Document

**Project:** Ales — Enterprise Hardware B2B Web Platform  
**Company:** Ales  
**Document Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2025

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Target Audience Analysis](#2-target-audience-analysis)
3. [Key User Flows](#3-key-user-flows)
4. [Product Categories](#4-product-categories)
5. [Localization & Compliance](#5-localization--compliance)
6. [Success Metrics / KPIs](#6-success-metrics--kpis)

---

## 1. Executive Summary

Ales is a B2B hardware reseller operating exclusively in the Turkish Republic of Northern Cyprus (TRNC), supplying enterprise-grade security cameras, network access points, and business laptops to organizations across the region. The company serves government agencies, universities, private enterprises, and SMBs — markets that have historically been underserved by trusted, locally-present hardware vendors.

This document defines the business requirements for Ales's Next.js web platform — a cinematic, Awwwards-caliber digital presence designed to establish credibility, drive inbound enterprise inquiries, and streamline the quote and procurement workflow for B2B clients.

The website is not an e-commerce storefront. It is a trust-building and lead-generation asset. Its primary commercial goal is to convert enterprise visitors into qualified quote requests, ultimately feeding the offline sales and procurement process that characterizes B2B hardware deals in the TRNC market.

---

## 2. Target Audience Analysis

### 2.1 Primary Audience Segments

| Segment | Description | Size Estimate |
|---|---|---|
| Government & Public Sector | Ministries, municipalities, state universities, law enforcement | Small, high-value |
| Higher Education | TRNC universities and research institutions | Medium |
| Private Enterprise | Banks, telecoms, retail chains, logistics companies | Medium–Large |
| SMBs | Professional services firms, hospitality, retail SMBs | Large, lower-value per deal |

### 2.2 Decision Makers & Stakeholders

Enterprise hardware procurement in the TRNC typically involves multiple stakeholders across the buying journey:

- **IT Directors / CIOs** — Evaluate technical specifications, compatibility, warranty terms, and vendor reliability. Primary technical gatekeepers.
- **Procurement Officers / CFOs** — Assess pricing, bulk discounts, payment terms, and total cost of ownership (TCO).
- **C-Suite Executives (CEO, COO)** — Final sign-off on significant capital expenditure. Influenced by brand perception and vendor reputation.
- **Facilities / Security Managers** — Involved in physical security camera deployments and network infrastructure decisions.

### 2.3 Audience Pain Points

The TRNC's geographic and political isolation creates a distinct set of procurement challenges that Ales is uniquely positioned to address:

- **Limited local supplier ecosystem.** Enterprise-grade hardware typically requires import through Turkey or indirect channels, leading to longer lead times and fragmented after-sales support.
- **Lack of local expertise and post-sale service.** Organizations struggle to find vendors who can provide installation guidance, firmware support, and warranty service without cross-border logistics.
- **Trust deficit with foreign vendors.** Decision makers are cautious about committing to overseas vendors for critical infrastructure (surveillance, networking) without local accountability.
- **Language and regulatory friction.** Most enterprise hardware vendors do not provide Turkish-language documentation, invoices, or support channels compliant with TRNC business norms.
- **Opaque pricing for bulk orders.** Enterprise clients require custom quotes for volume purchasing — a need not met by standard retail interfaces.

### 2.4 Why a Cinematic Website Matters for B2B Trust

In the TRNC B2B landscape, website quality is a direct proxy for company credibility. Decision makers researching vendors will benchmark Ales against international competitors with polished digital presences. A visually sophisticated, high-performance website signals:

- **Investment in professionalism** — A company that invests in its brand is more likely to invest in post-sale support.
- **Enterprise readiness** — Cinematic design and smooth UX communicate that Ales operates at an enterprise level, not as an informal reseller.
- **Competitive differentiation** — Most local competitors rely on static, outdated websites. A world-class web experience immediately positions Ales as the premium choice.
- **First impression in a relationship-driven market** — TRNC business culture relies heavily on trust and relationship. The website is often the first impression before a sales call; it must be impeccable.

---

## 3. Key User Flows

### 3.1 Product Discovery

The product discovery flow accommodates both exploratory browsing and directed research by technically-informed users.

**Entry Points:**
- Homepage hero → Category landing pages
- Direct navigation via header menu
- Search (product name, model number, category)
- Partner/certification badge links

**Flow Steps:**

```
Homepage
  └── Category Page (Cameras / Access Points / Laptops)
        └── Product Listing (filterable by specs, use case, brand)
              └── Product Detail Page
                    ├── Full technical specifications
                    ├── Use case highlights (e.g., "Ideal for campus surveillance")
                    ├── Related products / accessories
                    ├── Downloadable datasheets (PDF)
                    └── CTA: "Request a Quote" / "Contact Sales"
```

**Key Requirements:**
- Filter products by category, brand, key specs (resolution, WiFi standard, RAM, etc.)
- Side-by-side product comparison (up to 3 models)
- Downloadable spec sheets in Turkish and English
- High-resolution product imagery with 360° view where available
- Availability indicator (in-stock, lead time estimate)

---

### 3.2 Enterprise Quote Request

The quote request flow is the primary conversion goal of the platform. It must accommodate complex, multi-line bulk orders with optional custom configuration.

**Flow Steps:**

```
Product Detail Page / Quote Builder
  └── Step 1: Product Selection
        └── Add products to quote basket (quantities, variants)
  └── Step 2: Organisation Details
        └── Company name, sector, contact person, role, phone, email
  └── Step 3: Requirements & Notes
        └── Delivery timeline, installation requirements, special configuration notes
  └── Step 4: Review & Submit
        └── Summary of items, quantities, contact info
        └── Submit → Confirmation screen + email notification
  └── Internal: CRM/email notification to Ales sales team
```

**Key Requirements:**
- Quote basket persists across sessions (localStorage or account-based)
- Multi-line quote support (multiple product SKUs in a single request)
- Field validation with Turkish and English error messages
- Confirmation email sent to the requester in Turkish
- Integration with internal CRM or email-based workflow for the Ales sales team
- Optional: Allow account-holders to view past quote requests

---

### 3.3 Account Management — Enterprise Client Portal

Returning enterprise clients require a lightweight portal to manage their ongoing relationship with Ales.

**Features:**

| Feature | Description |
|---|---|
| Order History | View past orders, delivery status, invoice downloads |
| Quote History | Track submitted quote requests and their status |
| Support Tickets | Submit and track hardware support or warranty cases |
| Saved Products | Bookmark products for future procurement cycles |
| Account Details | Manage company profile, billing address, contact users |

**Key Requirements:**
- Secure login (email + password; optional SSO for larger enterprise accounts)
- Role-based access within an organization (admin, viewer)
- All portal content available in Turkish and English
- Mobile-responsive portal interface

---

### 3.4 Content & Trust Building

Trust signals are critical conversion drivers in B2B. The platform must surface credibility content throughout the user journey, not only on a dedicated page.

**Content Types:**

- **Case Studies:** Detailed project write-ups showcasing Ales deployments (e.g., "Network Infrastructure Upgrade — Eastern Mediterranean University"). Include challenge, solution, products used, and outcome.
- **Partner & Brand Logos:** Authorized reseller badges for hardware brands carried by Ales.
- **Certifications:** Industry and vendor certifications held by Ales staff or the company.
- **Client Testimonials:** Attributed quotes from IT directors or procurement officers at named organizations (with permission).
- **Press / Awards:** Any local media coverage, industry recognition, or awards.

**Placement Strategy:**
- Homepage: Partner logos, headline KPIs (e.g., "200+ enterprise deployments")
- Category pages: Relevant case study teaser
- Product pages: Client testimonials relevant to that product category
- Quote flow: Trust bar ("Trusted by 50+ TRNC organisations") to reduce drop-off

---

## 4. Product Categories

### 4.1 Security Cameras

Ales offers a curated portfolio of professional-grade surveillance solutions suited to TRNC enterprise environments.

| Sub-Category | Key Features | Target Use Case |
|---|---|---|
| Indoor Fixed Cameras | Full HD / 4K, PoE, wide-angle | Offices, retail interiors, lobbies |
| Outdoor Fixed Cameras | Weatherproof (IP66+), IR night vision, vandal-resistant | Building perimeters, car parks |
| PTZ Cameras | Pan-tilt-zoom, auto-tracking, long-range | Campuses, large facilities, warehouses |
| AI-Powered Cameras | Facial recognition, object detection, license plate recognition | High-security facilities, border/access control |
| Network Video Recorders (NVR) | Centralised recording, remote monitoring | Bundled with camera deployments |

**Business Notes:**
- Cameras are frequently sold as complete systems (cameras + NVR + cabling + installation), which should be reflected in quote flow options.
- AI-powered surveillance products may require additional regulatory consideration under TRNC data privacy norms.

---

### 4.2 Network Access Points

Enterprise wireless infrastructure for organisations requiring reliable, high-density connectivity.

| Sub-Category | Key Features | Target Use Case |
|---|---|---|
| Indoor APs (WiFi 6) | 802.11ax, multi-user MIMO, PoE | Offices, classrooms, meeting rooms |
| Indoor APs (WiFi 6E) | 6 GHz band support, ultra-low latency | High-density environments, auditoria |
| Outdoor APs | Weatherproof, extended range, mesh support | Campuses, open facilities, public spaces |
| Cloud-Managed APs | Centralised cloud dashboard, remote provisioning | Multi-site enterprise deployments |
| Controllers & Switches | PoE switches, wireless LAN controllers | Infrastructure backbone |

**Business Notes:**
- Enterprise APs are typically sold in multi-unit deployments requiring site surveys and configuration. Quote requests for APs should prompt for deployment scale (number of units, floor area).

---

### 4.3 Enterprise Laptops

Business-class and ruggedized laptops for organisational procurement.

| Sub-Category | Key Features | Target Use Case |
|---|---|---|
| Business Laptops | Intel/AMD enterprise CPUs, vPro support, TPM, long battery life | Office workers, management |
| Thin & Light Ultrabooks | Compact form factor, premium build | Executives, mobile professionals |
| Ruggedized Laptops | MIL-STD certified, drop/dust/water resistance | Field operations, industrial use |
| Mobile Workstations | Dedicated GPU, high RAM, ISV certifications | Engineering, CAD/CAM, data analysis |

**Business Notes:**
- Laptops are typically procured in bulk (10–500+ units). Quote flow should support quantity-based pricing tiers.
- Pre-configuration options (OS image, software bundle) are a common enterprise requirement and should be capturable in the quote notes field.

---

## 5. Localization & Compliance

### 5.1 Language Support

| Language | Role | Coverage |
|---|---|---|
| Turkish | Primary | All UI, product content, legal pages, emails, error messages, support |
| English | Secondary | All UI, product content, technical datasheets — for international procurement officers and expatriate decision makers |

**Implementation Notes:**
- Default language determined by browser locale; user can toggle manually via header language switcher.
- All transactional emails (quote confirmation, account notifications) sent in the user's selected language.
- Turkish content must use formal register (formal *siz* form) appropriate for B2B communication.
- Date formats: `DD.MM.YYYY` (Turkish standard).
- Number formats: `.` as thousands separator, `,` as decimal (Turkish standard) — e.g., `1.250,00 ₺`.

---

### 5.2 TRNC-Specific Business Practices

- **Payment Terms:** Enterprise hardware deals in the TRNC commonly involve proforma invoice → bank transfer workflows. The platform should not imply instant online payment; instead, the quote flow leads to a sales engagement that will produce a proforma.
- **VAT:** TRNC applies KDV (Katma Değer Vergisi). Displayed pricing (where shown) must indicate whether VAT is included or excluded, with clear labelling (`KDV Dahil` / `KDV Hariç`).
- **Business Registration:** Ales must display its TRNC business registration number and registered address in the website footer and legal pages, as is standard practice and a legal requirement for commercial websites operating in the TRNC.
- **Import Documentation:** Enterprises in regulated sectors (government, banking) may require specific import/customs documentation. The quote notes field should allow clients to specify documentation requirements.

---

### 5.3 Currency

- **Primary Currency:** Turkish Lira (TRY / ₺)
- Indicative pricing, if displayed, must be in TRY.
- Due to exchange rate volatility, product pricing should either be omitted from public pages (quote-only model) or clearly marked as subject to change with a reference date.
- **Recommended Approach:** Adopt a quote-only pricing model to avoid stale prices and to encourage direct sales engagement — a standard B2B practice for the TRNC market.

---

### 5.4 Data Privacy

- The TRNC does not currently have a fully codified data protection law equivalent to EU GDPR; however, best practices should be followed given Ales's enterprise clientele and potential exposure to Turkish KVKK (Kişisel Verilerin Korunması Kanunu) for clients with cross-border operations.
- **Required policies:**
  - Privacy Policy (Gizlilik Politikası) — how contact and account data is collected, stored, and used.
  - Cookie Notice / Consent Banner — for analytics and marketing cookies.
  - Data Retention Policy — for quote requests, account data, and support tickets.
- Personal data collected via the quote form (name, company, email, phone) must be stored securely and used only for sales follow-up purposes.
- AI-powered camera products that involve biometric data (facial recognition) must include appropriate advisory notices given sensitivity under emerging privacy frameworks.

---

### 5.5 Local Business Registration & Compliance

| Requirement | Detail |
|---|---|
| Business Registration Number | Displayed in footer and Terms & Conditions page |
| Registered Address | Full TRNC address visible on Contact and Legal pages |
| Tax Identification | TRNC tax number displayed on all commercial documents |
| Terms & Conditions | Turkish-language T&Cs governing quote, sale, warranty, and returns |
| Warranty Policy | Clearly defined per product category; localised service and support process |

---

## 6. Success Metrics / KPIs

The following KPIs define success for the Ales web platform at launch and through its first year of operation. Targets should be reviewed quarterly against actuals.

### 6.1 Conversion & Lead Generation

| KPI | Definition | Target (Year 1) |
|---|---|---|
| Quote Request Conversion Rate | % of unique sessions that result in a submitted quote request | ≥ 3% |
| Quote-to-Sales Engagement Rate | % of submitted quotes that result in a sales call or meeting | ≥ 40% |
| Lead Quality Score | Average deal size of quotes submitted (tracked by sales team) | ≥ ₺50,000 avg |
| Contact Form Completion Rate | % of users who begin the quote form and complete it | ≥ 60% |

---

### 6.2 Engagement & Content Performance

| KPI | Definition | Target (Year 1) |
|---|---|---|
| Average Session Duration | Mean time users spend on the site per session | ≥ 3 minutes |
| Product Page Engagement Rate | % of product page visits that include spec sheet download or quote CTA click | ≥ 25% |
| Pages per Session | Average number of pages viewed per session | ≥ 4 |
| Case Study Read Rate | % of case study page visitors who read >75% of content (scroll depth) | ≥ 50% |
| Product Comparison Usage | % of sessions that use the product comparison feature | ≥ 10% |

---

### 6.3 Retention & Loyalty

| KPI | Definition | Target (Year 1) |
|---|---|---|
| Return Visitor Rate | % of monthly sessions from users who have visited before | ≥ 20% |
| Enterprise Portal Login Rate | % of active enterprise accounts that log in at least once per quarter | ≥ 70% |
| Support Ticket Resolution Time | Average time from ticket submission to resolution (tracked via portal) | ≤ 48 hours |

---

### 6.4 Technical & Experience Quality

| KPI | Definition | Target |
|---|---|---|
| Core Web Vitals (LCP) | Largest Contentful Paint | ≤ 2.5s |
| Core Web Vitals (CLS) | Cumulative Layout Shift | ≤ 0.1 |
| Core Web Vitals (INP) | Interaction to Next Paint | ≤ 200ms |
| Mobile Usability Score | Google Search Console mobile usability — no errors | 100% |
| Uptime | Platform availability | ≥ 99.9% |

---

*Document prepared for internal use by the Ales product and development team. All figures marked as targets are indicative and subject to revision following launch data review.*
