# Swoveralls Theme Overhaul — Claude Code Project Context

## Project Summary

We are rebuilding the Swoveralls Shopify theme from scratch. The existing theme (v1.8.0) has accumulated significant tech debt — 53 CSS files, jQuery-based JS, 139 Replo page-builder files, 13+ third-party app integrations, and generic commit history. Rather than cleaning it up, we're starting fresh with a modern foundation based on Shopify's Dawn theme.

## Current Status

- **Phase 0 (Discovery)** — In progress. Waiting on a meeting with Kyle to finalize which custom features are must-haves vs. what gets dropped, and which of the 13+ third-party apps are still actively used.
- The full project plan is in `PROJECT_PLAN.md`.

## Key Decisions Made

- **New theme from scratch** over cleaning up the existing theme — the integration complexity is manageable since most apps are store-level, not theme-level.
- **Dawn-based** — start from Shopify's official Dawn reference theme, strip it down, and customize.
- **No jQuery** — all new JS should be vanilla JS / web components.
- **Design token system** — centralized CSS custom properties for colors, typography, spacing, breakpoints.

## Existing Theme — Key Files to Reference

When porting features from the old theme, these are the important files:

- **Custom features:** `global.js` (team selector), `cart.js` (4,500+ lines cart logic), `product.js` (variant selection, image zoom, size guides)
- **Styles:** `base.css` (core framework), `custom.css`, 53 component/section CSS files
- **Settings:** `settings_schema.json` (451 lines, 13 sections, 55+ settings)
- **Brand fonts:** BryantPro (headings), Gotham (body), Apercu and Vinyl (accents) — 15 font files
- **Brand colors:** Navy `#28334A`, Blue accent `#334FB4`, Off-white `#f5f6f8`, Black `#121212`
- **AI-generated blocks:** 20+ files named `ai_gen_block_*.liquid` in `blocks/` — review before porting

## Third-Party Apps in Current Theme

Junip (reviews), Yotpo (reviews), Algolia (search), Rivo (loyalty), Purple Dot (personalization), Hubbox (shipping), Dynamatic (upsells), AfterSell (post-purchase), Kiwi (size charts), Klaviyo (email), Triple Whale / Elevar / Hyros / Instant Pixel (analytics), Replo (page builder)

**Status of each app TBD after Kyle meeting.**

## Development Guidelines

- Build one section at a time (header, product grid, cart drawer, etc.) as focused tasks
- Each section should be self-contained: Liquid template + scoped CSS + JS (if needed)
- Use Shopify's image CDN with responsive srcset/sizes and lazy loading
- Target 90+ Lighthouse mobile score, < 2.5s LCP, < 0.1 CLS
- All templates should include proper ARIA attributes and semantic HTML
- Commit after each section is complete for clear checkpoints

## Repository Structure

This repo currently contains the **old theme** files. As we build the new theme, the old files serve as reference for porting custom features. The new theme will eventually replace them.
