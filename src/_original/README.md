# Original Design Reference

Drop the original design file(s) from Claude into this folder.

**This folder is REFERENCE only.** Files here are NOT deployed.
Deploy target is `public/` (two levels up).

## Expected files
- `index.html` — the design HTML
- Any linked CSS, JS, image assets

## What happens next
Once the design is dropped:
1. Claude reads this design
2. Applies MADIAD website pre-flight checklist (`~/.claude/memory/feedback_website.md`)
3. Implements at `public/index.html` (EN default)
4. Builds Spanish (`public/es/`) and Vietnamese (`public/vi/`) versions
5. Adds language switcher + `hreflang` meta tags
6. Audits favicon, OG image, mobile (320×568), brand name consistency
