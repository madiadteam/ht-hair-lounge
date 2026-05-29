---
date: 2026-05-29
project: ht-hair-lounge
status: approved
type: design-spec
---

# H&T Hair Lounge — Design Spec

## Context

Le Pham building a website + content management infrastructure for **H&T Hair Lounge**, a hair salon in Georgia, US. This is a MADIAD service client engagement.

The user provided a Claude-hosted design URL (`https://api.anthropic.com/v1/design/h/BuFzWtkE5otaFCBzHHI4Dg`) which returned HTTP 404 via WebFetch — endpoint requires authentication. User will drop design files into `src/_original/` manually.

## Decisions

| Topic | Decision | Rationale |
|---|---|---|
| Client category | MADIAD service client → Drive `03_Services/2026 - H&T Hair Lounge/` | User confirmed. Dev/deploy uses MADIAD account context. |
| Tech stack | Static HTML5 + CSS3 + vanilla JS | User selected. Matches provided design intent. No build step. Easy GoDaddy upload. |
| Hosting | GoDaddy (client-owned existing account) | Client already has hosting. Upload via cPanel File Manager or FTP. |
| Trilingual approach | **B — 3 separate directories** (`/` EN, `/es/`, `/vi/`) with `hreflang` | Best for local SEO. Hair salon in Georgia US benefits from strong Google Maps + local Search visibility. Cleaner URLs than JS lang-switcher. |
| Web languages | EN (default) + ES + VI | Georgia US has substantial Hispanic + Vietnamese communities served by H&T. |
| Facebook language | EN only | User-specified. |
| Other social languages | EN default (ES caption optional on Instagram) | Implied scope. |
| Social channels in scope | Instagram, Google Business Profile, TikTok, Facebook, YouTube Shorts | User-confirmed. |
| Social detailed plan | **Deferred** | User said "phần social sẽ xử lý cụ thể sau" — skeleton placeholder only. |
| Domain | TBD | Client to provide. Needed for absolute URLs (OG, hreflang). |
| Git init | Defer — ask before initializing | Per `feedback_project_workflow.md` A1, do not assume. |

## Architecture

### Local folder structure

```
~/Projects/ht-hair-lounge/
├── CLAUDE.md                              # Project orientation
├── README.md                              # Human-readable
├── .gitignore
├── src/
│   └── _original/                         # User drops Claude design here (REFERENCE)
│       └── README.md                      # Instructions
├── public/                                # Deploy-ready (zip this → GoDaddy)
│   ├── index.html                         # EN (TBD — implement after design drop)
│   ├── es/index.html                      # Spanish (TBD)
│   ├── vi/index.html                      # Vietnamese (TBD)
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   ├── img/
│   │   └── fonts/
│   ├── favicon.ico                        # TBD
│   ├── apple-touch-icon.png               # TBD
│   └── og-default.jpg                     # TBD
└── docs/
    ├── deploy-godaddy.md
    ├── social-channels.md                 # Skeleton
    ├── content-strategy.md                # Skeleton
    └── superpowers/specs/
        └── 2026-05-29-ht-hair-lounge-design.md  # this file
```

### Drive folder structure

To be created in `[SD] MADIAD/03_Services/2026 - H&T Hair Lounge/` per MADIAD client schema (`reference_shared_drives.md`):

```
2026 - H&T Hair Lounge/
├── 01_Brief & Scope/
├── 02_Working Files/
├── 03_Deliverables/
├── 04_Archive/
├── Brand Assets/
├── Marketing/
│   ├── Content Calendar/
│   ├── _INBOX/
│   ├── _OUTBOX/
│   └── Archive/
└── _Knowledge/                # ★ AI sync target → Supabase company="H&T Hair Lounge"
```

**MADIAD routing rule:** Finance + Legal route to `00_Company/`, NOT inside this folder:
- `00_Company/Finance/Invoices-Receivable/H&T Hair Lounge/`
- `00_Company/Legal & Contracts/Clients/H&T Hair Lounge/`

## Trilingual Implementation Pattern

### URL structure
- `https://<domain>/` → English (default)
- `https://<domain>/es/` → Spanish
- `https://<domain>/vi/` → Vietnamese

### `<head>` hreflang (on all 3 pages)
```html
<link rel="alternate" hreflang="en" href="https://<domain>/" />
<link rel="alternate" hreflang="es" href="https://<domain>/es/" />
<link rel="alternate" hreflang="vi" href="https://<domain>/vi/" />
<link rel="alternate" hreflang="x-default" href="https://<domain>/" />
```

### Language switcher
Simple nav element with 3 anchors. On click → navigate to corresponding directory. Persistent across pages.

### Font requirement
Must cover Vietnamese diacritics AND Spanish tildes. Verified options: **Inter**, **Be Vietnam Pro**, **Manrope**, **Plus Jakarta Sans** (per `feedback_website.md` §A2). Final font picked from design file once dropped.

## Implementation Sequence

1. ✅ Scaffold local folder structure (this commit)
2. ✅ Write spec doc (this file)
3. ⏳ User reviews spec
4. ⏳ Create Drive folders via `gws drive` (after user approval — shared system action)
5. ⏳ User drops original design into `src/_original/`
6. ⏳ Implement EN at `public/index.html` (1:1 with design, apply `feedback_website.md` checklist)
7. ⏳ Audit: favicon, apple-touch-icon, og-default.jpg, meta, mobile 320×568, brand name consistency
8. ⏳ Duplicate to `public/es/index.html` + `public/vi/index.html` with translations
9. ⏳ Add lang switcher in nav + `hreflang` in `<head>`
10. ⏳ Final QA against full `feedback_website.md` pre-flight
11. ⏳ User confirms domain → fill into all absolute URLs (OG, hreflang)
12. ⏳ Produce deploy zip → user uploads to GoDaddy

## Brand Discovery (added 2026-05-29 after PDF inspection)

User dropped `references/HT Hair Lounge.pdf` (75MB, 12 pages, internal title "Đổi tone màu") + 41 product photos in `references/H&T Products/`. The PDF turned out to be a **brand-assets + product-marketing deck**, not a website wireframe.

**Extracted from PDF (now treated as canonical):**

| Field | Value |
|---|---|
| Brand name | H&T Hair Lounge |
| Tagline | "Healthy scalp, healthy hair, healthy you. That's the heart of why we opened our Head Spa." |
| Domain | https://www.hthairlounge.com |
| Address | 2022 Powers Ferry Rd #260, Atlanta, GA 30339, USA |
| Phone | (470) 640-8801 |
| Positioning | Head Spa + Hair + Facial Care |
| Color palette | Multi-theme (orange / teal / pink / green / light green / light blue / dark blue / purple) — logo color adapts per product line. Site needs a primary + accent picked from these. |
| Logo asset | Embedded in PDF; rendered in 41 product photos (also in `references/H&T Products/`). Vector source TBD. |

**Product/service inventory:**

- Own brand: H&T Lavender Shampoo, H&T Rose Shampoo
- Sadoer retail line: 24K Gold Collagen Mask, Neck Masks (Hyaluronic + Centella variants), Salicylic Acid Acne Mask, Argan Hair Oil, Hyaluronic Acid Mask, Hair & Scalp Detox, Hair Shot
- Signature service: **Head Spa** (7 benefits listed on page 12)

**What the PDF does NOT contain (still TBD):**

- Web page layout / hero composition / section order
- Service prices
- Operating hours, email
- Customer reviews
- Brand voice + tone guidelines
- Service menu beyond "Head Spa" headline

## Open Items (blockers for downstream work)

- **Website wireframe** — PDF was brand reference, not web design. Decision needed: (a) wait for client wireframe, OR (b) design from scratch using brand identity above. Recommend (b) — full brand info present + 41 product photos available; a wireframe would mostly be paint-by-numbers given the assets we already have.
- **Brand primary + accent color** — pick from multi-theme palette (pink + gold most common across product line; teal also strong).
- **Operating hours + email** — need from client.
- **Service prices** — need from client (or leave a "Contact for pricing" CTA).
- **Spanish + Vietnamese translations** — need professional translation or AI-assisted with user review (once EN is implemented).
- **Logo vector source** — extract from PDF or request from client (PDF-embedded raster only at this point).
- **Social plan** — deferred per user (future phase).

## Created Resources (canonical IDs)

### GitHub repository

- URL: https://github.com/madiadteam/ht-hair-lounge
- Visibility: private
- Owner: `madiadteam`
- Default branch: `main`
- First commit: `149a3b8` — scaffold (docs, deploy guide, design spec)

### Google Drive folders

Parent: `[SD] MADIAD` (id `0AFYoFOUy4wA7Uk9PVA`) → `03_Services/` → `2026 - H&T Hair Lounge/`

| Folder | ID |
|---|---|
| 2026 - H&T Hair Lounge (parent) | `1lQILXKQFBdcR-1oOcdJaNM2UrwItmqgz` |
| 01_Brief & Scope | `1C2QTVALvvpLS3hq6S13R7PFyU_UgF-og` |
| 02_Working Files | `104IV0PK1Qrkr3rckabLntspeTu_lLT5v` |
| 03_Deliverables | `1BuAA1cSkGJzNH_vTogeIgeBZwD2gQNjq` |
| 04_Archive | `1WgSiOQT46Ak6h7HcAAVD-zpFfg9yuRyv` |
| Brand Assets | `1bsS1vgXY4nYxCYin1goRNwgMAm1raaad` |
| Marketing | `1o9kDzCP_LgXN36I2Gx6Id8Yl7Sa4ia1E` |
| Marketing/Content Calendar | `1bVyc5n1j9dStCAHDHNxaoXBcPaajIukp` |
| Marketing/_INBOX | `1V7T8L6fQ_GSjBZOIABC9sBVzIRnv6QkV` |
| Marketing/_OUTBOX | `1hl_hUpskeXCllbxWeYYb06FSoD0Uqz07` |
| Marketing/Archive | `1rjewDxpPbvqTXiC3TImUBio4HHlkfr0U` |
| _Knowledge (★ AI sync target, company="H&T Hair Lounge") | `1Vg46o1Oq4sWc8VPnH9ULufHt57yjgSMR` |

Finance + Legal (per MADIAD routing rule) will land under `00_Company/` when the first invoice / contract is created — not pre-allocated here.

## References

- `~/.claude/memory/feedback_project_workflow.md` — folder + naming rules + dev account defaults
- `~/.claude/memory/feedback_website.md` — UI/UX pre-flight checklist (UI completeness, fonts, OG, mobile, brand consistency)
- `~/.claude/memory/feedback_vn.md` — Vietnamese writing rules (for `/vi/`)
- `~/.claude/memory/reference_shared_drives.md` — MADIAD Drive schema
- `~/.claude/memory/feedback_content_platforms.md` — title/caption length specs per platform (for social phase)
- `~/.claude/memory/reference_upload_post_api.md` — MADIAD social publishing infrastructure (for social phase)
