#!/usr/bin/env python3
"""
Generate favicon, apple-touch-icon, and OG cover from the brand logo PNG.
Outputs land at public/ root (sibling to index.html).
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
LOGO_SRC = ROOT / "public" / "assets" / "17c80a78-eadf-4836-870f-eaa70ed4ea8a.png"
PUBLIC = ROOT / "public"

# Brand palette (mirrors index.html :root vars)
WINE = (46, 27, 36)       # --plum-deep approx (#2e1b24)
CREAM = (251, 246, 244)   # --cream approx
ROSE = (219, 138, 165)    # --accent
GOLD = (203, 163, 106)    # --gold approx

def load_logo():
    img = Image.open(LOGO_SRC).convert("RGBA")
    print(f"Source logo: {img.size} mode={img.mode}")
    return img

def trim_alpha(img):
    """Crop transparent borders so the logo fills its frame."""
    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img

def fit_within(img, max_w, max_h):
    """Scale (preserving aspect ratio) so it fits inside (max_w, max_h)."""
    w, h = img.size
    scale = min(max_w / w, max_h / h)
    new_size = (int(w * scale), int(h * scale))
    return img.resize(new_size, Image.LANCZOS)

def square_canvas(logo, size, bg):
    """Center the logo on a square canvas of (size, size, bg)."""
    canvas = Image.new("RGBA", (size, size), bg + (255,))
    fitted = fit_within(logo, int(size * 0.78), int(size * 0.78))
    x = (size - fitted.width) // 2
    y = (size - fitted.height) // 2
    canvas.paste(fitted, (x, y), fitted)
    return canvas.convert("RGB")

# --- main ---
logo = trim_alpha(load_logo())
print(f"Trimmed logo: {logo.size}")

# Favicon ICO + PNGs (cream bg so logo reads on light browsers)
fav_sizes = [16, 32, 48]
fav_imgs = [square_canvas(logo, s, CREAM) for s in fav_sizes]
fav_imgs[0].save(
    PUBLIC / "favicon.ico",
    format="ICO",
    sizes=[(s, s) for s in fav_sizes],
    append_images=fav_imgs[1:],
)
print(f"Wrote favicon.ico ({'+'.join(str(s) for s in fav_sizes)})")

for s in (16, 32):
    square_canvas(logo, s, CREAM).save(PUBLIC / f"favicon-{s}x{s}.png", "PNG")
print("Wrote favicon-16x16.png + favicon-32x32.png")

# Apple touch icon — iOS adds rounded mask itself, so use cream bg + logo
apple = square_canvas(logo, 180, CREAM)
apple.save(PUBLIC / "apple-touch-icon.png", "PNG")
print(f"Wrote apple-touch-icon.png ({apple.size})")

# OG cover — 1200x630 deep wine bg with logo centered + tagline + URL footer
og = Image.new("RGB", (1200, 630), WINE)
draw = ImageDraw.Draw(og)

# Logo at top-center
og_logo = fit_within(logo, 360, 360)
og.paste(og_logo, ((1200 - og_logo.width) // 2, 80), og_logo if og_logo.mode == "RGBA" else None)

# Try to find a serif on macOS
def pick_font(candidates, size):
    for path in candidates:
        if Path(path).exists():
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    return ImageFont.load_default()

serif = pick_font([
    "/System/Library/Fonts/Supplemental/Georgia.ttf",
    "/System/Library/Fonts/NewYork.ttf",
    "/Library/Fonts/Georgia.ttf",
], 40)
sans = pick_font([
    "/System/Library/Fonts/Supplemental/Avenir Next.ttc",
    "/System/Library/Fonts/Helvetica.ttc",
], 22)

tagline = "Japanese-Inspired Head Spa · Sandy Springs, Atlanta"
footer = "hthairlounge.com  ·  (470) 640-8801"

def draw_centered(text, font, y, color):
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    draw.text(((1200 - w) // 2, y), text, font=font, fill=color)

draw_centered(tagline, serif, 470, ROSE)
draw_centered(footer, sans, 540, GOLD)

og.save(PUBLIC / "og-default.jpg", "JPEG", quality=88, optimize=True)
print(f"Wrote og-default.jpg ({og.size}, {(PUBLIC / 'og-default.jpg').stat().st_size // 1024} KB)")

print("Done.")
