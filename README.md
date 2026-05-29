# H&T Hair Lounge Website

Static HTML/CSS/JS website for H&T Hair Lounge — a hair salon in Georgia, US.

## Tech
- Static HTML5 + CSS3 + vanilla JavaScript
- Trilingual: English (root) / Spanish (`/es/`) / Vietnamese (`/vi/`)
- Hosting: GoDaddy (client account)

## Quick Start

```bash
# Open EN homepage locally
open public/index.html

# Or serve with a local dev server
cd public && python3 -m http.server 8000
# → http://localhost:8000
```

## Structure

```
ht-hair-lounge/
├── public/                  # Production-ready site (this is what deploys)
│   ├── index.html           # English (default)
│   ├── es/index.html        # Spanish
│   ├── vi/index.html        # Vietnamese
│   ├── assets/{css,js,img,fonts}/
│   └── favicon.ico, apple-touch-icon.png, og-default.jpg
├── src/
│   └── _original/           # Original design reference (not deployed)
├── docs/
│   ├── deploy-godaddy.md    # How to deploy
│   ├── social-channels.md   # Social plan (skeleton)
│   └── content-strategy.md  # Content strategy (skeleton)
└── CLAUDE.md                # Project context for Claude Code
```

## Deploy

1. Zip the **contents** of `public/`:
   ```bash
   cd public && zip -r ../ht-hair-lounge.zip . -x ".*"
   ```
2. Log into GoDaddy → Hosting → cPanel → File Manager
3. Navigate to `public_html/`, upload + extract the zip
4. Verify in browser

Full guide: [`docs/deploy-godaddy.md`](docs/deploy-godaddy.md)

## Maintained by
MADIAD — info@madiad.com
