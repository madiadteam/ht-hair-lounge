# Deploy to GoDaddy

## Prerequisites
- GoDaddy hosting account credentials (client-provided)
- Domain pointed to GoDaddy hosting (TBD)

## Method 1 — cPanel File Manager (recommended)

1. GoDaddy → My Products → Hosting → Manage
2. Launch cPanel → File Manager
3. Navigate to `public_html/`
4. **First deploy only:** delete any default files in `public_html/` (default `index.html`, `cgi-bin/` placeholder, etc.). Keep `public_html/` itself.
5. From local machine, zip the **contents** of `public/`:
   ```bash
   cd ~/Projects/ht-hair-lounge/public
   zip -r ../ht-hair-lounge.zip . -x ".*"
   ```
6. In File Manager → Upload → select `ht-hair-lounge.zip`
7. Right-click the uploaded zip → Extract → confirm extraction path is `public_html/`
8. Delete the zip after extraction
9. Verify: visit the domain in browser

## Method 2 — FTP

1. cPanel → FTP Accounts → get host, username, password
2. Use FileZilla (or any FTP client)
3. Connect, navigate to remote `public_html/`
4. Upload contents of local `public/` to remote `public_html/`
5. (For updates) upload only changed files

## Post-Deploy Checklist

- [ ] Homepage loads at root URL
- [ ] `/es/` and `/vi/` accessible
- [ ] Language switcher works on all 3 versions
- [ ] Favicon shows in browser tab
- [ ] OG preview renders correctly when sharing URL in:
  - [ ] Facebook Sharing Debugger
  - [ ] Telegram (paste link in any chat)
  - [ ] iMessage / SMS preview
- [ ] Mobile layout at 320×568 not clipped
- [ ] No 404 on assets (open DevTools → Network → reload)
- [ ] All `<title>` tags unique per language
- [ ] `apple-touch-icon.png` returns 200 (iOS bookmark icon)
- [ ] `hreflang` tags present in `<head>` of all 3 pages

## Updating after first deploy

For small content edits — edit locally → upload only the changed file(s) via File Manager (drag & drop replaces).

For larger changes — re-run the zip + extract workflow, but rename the local zip with a date so you can rollback:
```bash
zip -r ../ht-hair-lounge-$(date +%Y%m%d).zip . -x ".*"
```

## Common gotchas
- **Permissions:** GoDaddy default is 755 for folders, 644 for files. cPanel extraction preserves this.
- **`.htaccess` conflicts:** If client has existing `.htaccess` rules, do NOT overwrite blindly. Inspect first.
- **Cache:** GoDaddy may cache aggressively. After deploy, hard-refresh with `Cmd+Shift+R` and append `?v=2` to URL to verify changes shipped.
- **Trailing slash on directories:** GoDaddy serves `/es/` → `/es/index.html` automatically. No extra config needed.
