# H&T Hair Lounge — Claude Code Orientation

## Project Overview
- **Client:** H&T Hair Lounge (Georgia, US)
- **Category:** MADIAD service client (`03_Services/2026 - H&T Hair Lounge/`)
- **Status:** Scaffolding phase, awaiting design file from user

## Tech Stack
- Static HTML5 + CSS3 + vanilla JS (no framework, no build step)
- Trilingual: 3 separate directory pattern
  - `/` → English (default)
  - `/es/` → Spanish
  - `/vi/` → Vietnamese
- Hosting: GoDaddy (client-owned existing account), upload via cPanel File Manager or FTP

## Folder Structure
- `src/_original/` — Original design file from user (REFERENCE only, NOT deployed)
- `public/` — Deploy-ready site (zip this folder → upload to GoDaddy)
- `docs/` — Project documentation
- `docs/superpowers/specs/` — Design specs from brainstorming sessions

## Drive Structure (MADIAD)
- Path: `[SD] MADIAD/03_Services/2026 - H&T Hair Lounge/`
- KB sync target: `_Knowledge/` → Supabase company="H&T Hair Lounge"
- Per MADIAD rule: Finance + Legal contracts route to `00_Company/`, NOT inside client folder

## Languages
- Web: EN + ES + VI (trilingual)
- Facebook: EN only
- Other socials (IG, TikTok, YouTube Shorts, Google Business): EN default (ES caption optional on IG)

## Social Channels (detailed plan deferred)
Instagram, Google Business Profile, TikTok, Facebook Page, YouTube Shorts.
See `docs/social-channels.md` — currently skeleton, to fill in next phase.

## Design Implementation Flow
1. User drops design files (HTML/CSS/assets) into `src/_original/`
2. Claude reads design, applies pre-flight checklists:
   - `~/.claude/memory/feedback_website.md` (UI completeness, fonts, OG, mobile)
   - `~/.claude/memory/feedback_vn.md` (VN writing rules — for /vi/ pages)
3. Implement EN at `public/index.html` (1:1 with design)
4. Audit per checklist
5. Duplicate + translate to `public/es/index.html` and `public/vi/index.html`
6. Add lang switcher + hreflang `<link>` in `<head>`

## Deploy
See `docs/deploy-godaddy.md`. Default: zip `public/` contents → upload via cPanel File Manager → extract to `public_html/`.

## Pre-flight Constraints (apply on every build)
- Fonts MUST cover Vietnamese diacritics (Inter, Be Vietnam Pro, etc.) — `feedback_website.md` §A2
- All cards in a grid must have equal-length descriptions — §A3
- No duplicate images across site — §B1
- Mobile input `font-size ≥ 16px` to prevent iOS auto-zoom — §C3
- Floating widgets: `w-[min(20rem,calc(100vw-2rem))]` + `dvh` height — §C4
- Brand name consistency across all surfaces — §B2
- Every page has `<title>`, `og:image`, `og:title`, `og:description` — §A1
- `apple-touch-icon.png` (180×180) for iOS — §A1.3

## Brand Info (extracted from `references/HT Hair Lounge.pdf`, 2026-05-29)
- **Canonical brand name:** H&T Hair Lounge
- **Tagline:** "Healthy scalp, healthy hair, healthy you. That's the heart of why we opened our Head Spa."
- **Domain:** https://www.hthairlounge.com
- **Address:** 2022 Powers Ferry Rd #260, Atlanta, GA 30339, USA
- **Phone:** (470) 640-8801
- **Positioning:** Head Spa + Hair + Facial Care
- **Logo:** present in PDF + 41 product photos in `references/H&T Products/` (adapts color per product theme)
- **Color palette:** multi-theme (orange, teal, pink, green, light green, light blue, dark blue, purple) — logo color varies per product line. Pick a primary + accent for site (TBD with client).
- **Font:** TBD (must cover Vietnamese diacritics — Inter, Be Vietnam Pro, Manrope, Plus Jakarta Sans recommended)
- **Service menu + pricing:** TBD (only Head Spa benefits hinted at on PDF page 12)
- **Hours:** TBD
- **Email:** TBD

### Product / Service Inventory (from PDF)
**Own brand (H&T):**
- H&T Lavender Shampoo (98% natural plant essence)
- H&T Rose Shampoo (clear · hydrate · strengthen · smooth)

**Third-party retail (Sadoer line):**
- 24K Gold Collagen Mask
- Hydrating & Firming Neck Mask (Hyaluronic + Centella variants)
- Salicylic Acid Acne Control Mask
- Argan Hair Oil
- Hyaluronic Acid Mask (sensitive skin)
- Hair & Scalp Detox
- Hair Shot (repair / strengthen)

**Head Spa (signature service):** 7 listed benefits on PDF page 12.

### What is still NOT in the PDF
- Website wireframe / page layout / hero copy
- Service menu prices
- Operating hours
- Customer testimonials
- Booking system reference
- Brand voice / tone guidelines

The PDF is a **brand-assets / product-marketing deck**, not a web design. To build the site, either: (a) wait for the client to provide a wireframe, or (b) design from scratch using the brand identity extracted above (Le confirms direction).

## Maintained by
MADIAD (info@madiad.com, `madiadteam` GitHub)
