# Swoveralls Theme Rebuild — Project Plan

## Overview

This plan outlines the approach for building a new, high-performing Shopify theme for Swoveralls using Claude Code as the primary development tool. The goal is to replace the existing theme (v1.8.0) with a clean, modern foundation while preserving the custom features that drive the business.

---

## Phase 0: Discovery & Requirements (Pre-Build)

**Goal:** Finalize what carries forward vs. what gets dropped.

### Action Items (for Kyle meeting)
- [ ] Audit current custom features and classify as **must-have**, **nice-to-have**, or **drop**:
  - Team selector / favorite teams functionality
  - Discount banner system (sitewide + per-product)
  - Release calendar page
  - Corporate gifting page & form
  - Size guide integration (Kiwi app or custom?)
  - Product comparison tables
  - Mix & match / BOGO product templates
  - Comfort coach waitlist
  - Drop-a-hint page
  - 24-hour marketplace collection
- [ ] Confirm which third-party apps are still actively used vs. can be removed:
  - **Reviews:** Junip? Yotpo? Both? (current theme has both)
  - **Search:** Algolia (currently toggle-able) — keep or use native Shopify search?
  - **Loyalty:** Rivo — still active?
  - **Shipping:** Hubbox / UPS Access Point — still needed?
  - **Personalization:** Purple Dot — still active?
  - **Upsells:** Dynamatic, AfterSell — keep?
  - **Analytics:** Triple Whale, Elevar, Hyros, Instant Pixel — which are current?
- [ ] Confirm Replo usage — are those 139 pages still needed, or can landing pages be rebuilt natively?
- [ ] Gather brand assets: updated logo files, brand colors, typography preferences, photography direction
- [ ] Identify top 5-10 competitor or aspirational sites for design reference

### Deliverable
A prioritized feature list and app inventory that scopes the rest of the project.

---

## Phase 1: Theme Foundation

**Goal:** Set up a clean, performant base theme with a solid design token system.

### 1.1 Start from Shopify Dawn (or Skeleton)
- Use Shopify's Dawn theme as the starting point — it's the official reference theme with modern architecture (no jQuery, vanilla JS, web components, CSS custom properties)
- Strip it down to essentials rather than building from zero

### 1.2 Design Token System
Claude Code will help build a comprehensive token system in a central location:

```
tokens/
  colors.css        — brand palette, semantic colors, surface/text pairs
  typography.css    — font families, size scale, line heights, weights
  spacing.css       — consistent spacing scale (4px base)
  breakpoints.css   — responsive breakpoints
  elevation.css     — shadows, borders
  animation.css     — transition durations, easing curves
```

**Brand tokens to define (confirm with Kyle):**
- Primary: Navy (`#28334A`) — keep or refresh?
- Accent: Blue (`#334FB4`) — keep or refresh?
- Background: Off-white (`#f5f6f8`) — keep or refresh?
- Typography: BryantPro (headings) + Gotham (body) — keep or switch?
- Font scale: establish a consistent modular scale

### 1.3 Base Layout & Global Components
- Header / navigation (mega menu vs. drawer — confirm preference)
- Footer
- Announcement bar / discount banner
- Page width system (current: 1200px or 1600px toggle)
- Grid system

### How Claude Code Helps in Phase 1
- **Scaffolding:** Generate the full token CSS system with proper custom property naming
- **Dawn customization:** Strip and modify Dawn's base templates to match Swoveralls brand
- **Settings schema:** Build `settings_schema.json` with only the settings you actually need (current one has accumulated cruft)
- **Code review:** Audit each file as it's created for performance and accessibility

---

## Phase 2: Core Commerce Pages

**Goal:** Build the pages that drive revenue.

### 2.1 Product Page (PDP)
- Product image gallery (responsive, fast-loading)
- Variant selector (color swatches, size selector)
- Add to cart with dynamic pricing
- Size guide integration
- Product description / tabs
- App block slots for: reviews (Junip), upsells, recommendations

### 2.2 Collection Page (PLP)
- Product grid with responsive layout
- Filtering & sorting (native Shopify or Algolia — based on Phase 0 decision)
- Pagination (infinite scroll or paginated)
- Collection header / description

### 2.3 Cart
- Slide-out cart drawer (current site uses this)
- Line item management
- Discount code input
- Upsell / cross-sell slot

### 2.4 Search
- Predictive search with product thumbnails
- Search results page

### How Claude Code Helps in Phase 2
- **Component generation:** Build each section/block as self-contained Liquid + CSS + JS
- **Porting custom logic:** Selectively migrate must-have features (team selector, discount logic) from old theme — Claude Code can read the old implementation and rewrite it in modern patterns
- **Performance:** Ensure images use Shopify's image CDN with proper srcset/sizes, lazy loading, and modern formats
- **Accessibility:** ARIA labels, keyboard navigation, focus management on interactive elements

---

## Phase 3: Supporting Pages & Features

**Goal:** Build out the rest of the site experience.

### 3.1 Homepage
- Hero banner / slideshow
- Featured collections
- Brand story section
- Social proof (reviews, press logos)
- Email capture (Klaviyo integration)

### 3.2 Custom Pages (based on Phase 0 must-have list)
- Release calendar
- Corporate gifting
- Our story / about
- Contact
- Loyalty rewards (Rivo landing page)
- Any other confirmed must-haves

### 3.3 Customer Account Pages
- Login / register
- Order history
- Address management
- Account preferences (team preferences if team selector is kept)

### 3.4 Utility Pages
- 404 page
- Password page (for store maintenance)
- Gift card page

### How Claude Code Helps in Phase 3
- **Bulk page creation:** Generate multiple page templates quickly with consistent structure
- **Form handling:** Build custom forms (corporate gifting, waitlists) with proper validation
- **Liquid logic:** Complex conditional rendering, metafield integration, dynamic content

---

## Phase 4: Third-Party App Integration

**Goal:** Re-enable all confirmed app frontends in the new theme.

### 4.1 App Blocks & Embeds
For each confirmed app from Phase 0:
1. Check if the app supports App Blocks (theme customizer drag-and-drop)
2. If yes: enable in customizer, no code needed
3. If no: add required Liquid snippets to appropriate templates

### 4.2 Expected Integration Work
| App | Integration Type | Effort |
|-----|-----------------|--------|
| Junip (reviews) | App block | Low — enable in customizer |
| Rivo (loyalty) | App embed + custom page | Medium — page template + embed |
| Algolia (search) | Custom Liquid + JS | High — if keeping, requires template work |
| Klaviyo (email) | App embed | Low — enable in customizer |
| Analytics (TW, Elevar) | App embed / script | Low — enable in customizer |
| Hubbox (shipping) | Custom integration | Medium — needs checkout/cart hooks |
| Dynamatic (upsells) | App block | Low — enable in customizer |

### How Claude Code Helps in Phase 4
- **Snippet migration:** For apps needing manual Liquid integration, Claude Code can read the old theme's implementation and port it to the new theme's structure
- **Testing guidance:** Generate checklists for verifying each integration works correctly

---

## Phase 5: Performance Optimization & QA

**Goal:** Ensure the new theme is fast, accessible, and bug-free before launch.

### 5.1 Performance Targets
- **Largest Contentful Paint (LCP):** < 2.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- **First Input Delay (FID):** < 100ms
- **Total page weight:** < 1MB on homepage (excluding third-party app scripts)
- **Lighthouse score:** 90+ on mobile

### 5.2 Performance Checklist
- [ ] All images use Shopify CDN with responsive srcset
- [ ] CSS is scoped per-section (only loads what's needed per page)
- [ ] No jQuery dependency
- [ ] JavaScript is deferred / loaded async where possible
- [ ] Fonts use `font-display: swap` with proper preloading
- [ ] Critical CSS is inlined for above-the-fold content
- [ ] Third-party scripts are loaded asynchronously

### 5.3 QA Checklist
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Mobile responsive testing (iPhone, Android, tablet)
- [ ] Checkout flow end-to-end
- [ ] All app integrations verified
- [ ] Accessibility audit (screen reader, keyboard nav)
- [ ] SEO: meta tags, structured data, canonical URLs
- [ ] 301 redirects for any changed URLs

### How Claude Code Helps in Phase 5
- **CSS audit:** Identify unused CSS, duplicated rules, and optimization opportunities
- **Accessibility fixes:** Scan templates for missing ARIA attributes, contrast issues, semantic HTML problems
- **Structured data:** Generate JSON-LD for products, collections, breadcrumbs
- **Code review:** Final pass on all files for security, performance, and best practices

---

## Phase 6: Launch

**Goal:** Safely transition from old theme to new theme.

### 6.1 Pre-Launch
- [ ] Full QA pass on staging (Shopify theme preview)
- [ ] Stakeholder sign-off (Kyle + team)
- [ ] Backup current live theme
- [ ] Confirm all app integrations are enabled in new theme
- [ ] Test discount codes and promotions

### 6.2 Launch Day
- [ ] Publish new theme during low-traffic window
- [ ] Monitor analytics for anomalies (conversion rate, bounce rate, page speed)
- [ ] Keep old theme as backup (do not delete for 30 days)

### 6.3 Post-Launch
- [ ] Monitor Core Web Vitals for 1-2 weeks
- [ ] Address any reported issues
- [ ] Clean up: remove old theme files from repo, archive old theme in Shopify

---

## Working with Claude Code — Best Practices

### Development Workflow
1. **One section at a time** — Build each section (header, product grid, cart drawer, etc.) as a focused task. Give Claude Code the requirements and let it generate the full Liquid + CSS + JS for that section.
2. **Reference the old theme** — When porting features, point Claude Code to the specific file in the old theme and ask it to rewrite it with modern patterns.
3. **Iterate in the repo** — Keep all work in version control. Commit after each section is complete so you have clear checkpoints.
4. **Test as you go** — Use Shopify's theme preview to test each section before moving on.

### What Claude Code Is Best At
- **Generating Shopify Liquid templates** — sections, blocks, snippets with proper schema definitions
- **Writing clean, scoped CSS** — component-level styles with design tokens
- **JavaScript components** — vanilla JS web components, event handling, cart interactions
- **Porting logic** — reading old code and rewriting it in a new architecture
- **Settings schema** — building the JSON configuration for theme customizer controls
- **Performance optimization** — image handling, lazy loading, critical CSS
- **Accessibility** — ARIA attributes, semantic HTML, focus management
- **Bulk operations** — generating multiple similar templates or making consistent changes across files

### What Needs Human Judgment
- Visual design decisions (colors, layout, spacing, brand feel)
- Which features to keep vs. drop
- App selection and prioritization
- Business logic and promotional strategy
- Final QA and user acceptance testing

---

## Estimated Phase Breakdown

| Phase | Description | Dependency |
|-------|-------------|------------|
| Phase 0 | Discovery & requirements | Kyle meeting |
| Phase 1 | Theme foundation | Phase 0 complete |
| Phase 2 | Core commerce pages | Phase 1 complete |
| Phase 3 | Supporting pages & features | Phase 1 complete (can parallel with Phase 2) |
| Phase 4 | App integrations | Phase 2 complete (app blocks need pages to live on) |
| Phase 5 | Performance & QA | Phases 2-4 complete |
| Phase 6 | Launch | Phase 5 complete + stakeholder sign-off |

> **Note:** Phases 2 and 3 can run in parallel since they build independent page types on the same foundation.

---

## Next Steps

1. Meet with Kyle — use Phase 0 checklists to drive the conversation
2. Finalize feature list and app inventory
3. Begin Phase 1 in this repo on the development branch
