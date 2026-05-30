#!/usr/bin/env python3
"""
Generate brand photos for H&T Hair Lounge via Vertex AI Nano Banana.
Each slot can attach reference images (logo + product photos) so the model
preserves real salon brand details — logo, lavender/rose product packaging,
and palette — in the generated scene.

Outputs go to public/assets/img/<slot>.jpg.

Prompts follow Nano Banana methodology (subject + style + lighting + composition + mood + palette).
Brand palette: deep wine #2e1b24, cream #fbf6f4, blush rose #db8aa5, gold #cba36a.

Usage:
  python3 scripts/generate-photos.py           # all slots
  python3 scripts/generate-photos.py hero-bg   # just one slot
  python3 scripts/generate-photos.py hero-bg about-img   # subset
"""

import base64
import io
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from urllib import request as urlrequest, error as urlerror
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "assets" / "img"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROJECT = "project-1274a9d3-02c3-4187-8f9"
REGION = "us-central1"
MODEL = "gemini-2.5-flash-image"
ENDPOINT = (
    f"https://{REGION}-aiplatform.googleapis.com/v1/projects/{PROJECT}/locations/"
    f"{REGION}/publishers/google/models/{MODEL}:generateContent"
)

REFS_DIR = ROOT / "references"
LOGO_PINK = REFS_DIR / "Logo" / "c8561c1a-0ae6-422f-bf6a-f661089b0e6e.jpeg"
PROD_LAVENDER_CLEAN = REFS_DIR / "H&T Products" / "Products  (43 of 1).jpg"
PROD_LAVENDER_ROSE_DUO = REFS_DIR / "H&T Products" / "Products  (10 of 41).jpg"

BRAND_ANCHOR = (
    "BRAND REFERENCE INPUTS (attached above): the pink-and-wine circular H&T "
    "Hair Lounge logo (woman silhouette with flowing hair), and the H&T "
    "Lavender Shampoo bottle (geometric faceted purple plastic with a clear "
    "crystal-cut cap and white pump nozzle). These are the salon's real brand "
    "assets — preserve them exactly when they appear: SAME logo artwork, SAME "
    "bottle shape and lavender purple color, SAME label layout. Derive the "
    "scene's overall palette from these references (lavender purple, blush "
    "rose, cream, with deep wine accents and warm gold highlights). "
)

PROMPTS = {
    "hero-bg": {
        "aspect": "16:9",
        "refs": [LOGO_PINK, PROD_LAVENDER_CLEAN],
        "text": (
            BRAND_ANCHOR
            + "Cinematic photograph of a woman receiving a Japanese head spa ritual. "
            "Her head rests in a wide porcelain spa basin; warm water cascades from a "
            "copper pitcher held by a stylist's caring hands. Soft steam rises. Eyes "
            "gently closed, only the side of her face faintly visible. On a small "
            "shelf in the soft-focus background sits the exact H&T Lavender Shampoo "
            "bottle from the reference (lavender purple, geometric facets, crystal cap). "
            "On the wall above, a subtle round plaque carries the exact pink-and-wine "
            "H&T Hair Lounge logo from the reference. "
            "Lighting: warm directional golden light from upper-right, soft rim on "
            "water droplets and on the bottle's crystal cap. "
            "Mood: serene, restorative, intimate luxury, almost meditative. "
            "Composition: wide horizontal frame, head positioned center-right, "
            "negative space on the left for hero text overlay. Subject does not face camera. "
            "Style: photorealistic editorial spa photography, shallow depth of field, "
            "magazine quality. No text, no captions, no watermark in the frame."
        ),
    },
    "about-img": {
        "aspect": "3:4",
        "refs": [LOGO_PINK, PROD_LAVENDER_CLEAN],
        "text": (
            BRAND_ANCHOR
            + "Editorial close-up photograph of skilled hands gently massaging warm "
            "oil into the scalp of a reclining client with long dark hair. Hands "
            "center-frame, fingers separating strands. Hint of cream linen towel "
            "beneath, a small white ceramic bowl of warm oil at the edge of frame. "
            "On a side ledge in the background sits the exact H&T Lavender Shampoo "
            "bottle from the reference (lavender, faceted, crystal cap), slightly "
            "out of focus but identifiable. "
            "Lighting: directional warm pendant from above-right, soft shadows pool "
            "below, gentle daylight fills shadows. "
            "Mood: tender care, focused craftsmanship, calm devotion. "
            "Composition: vertical 4:5 portrait frame, hands and scalp centered, "
            "top-down angle. No faces visible. "
            "Style: photorealistic, magazine quality, intimate editorial. "
            "No text, no captions, no watermark."
        ),
    },
    "gal1-treatment-room": {
        "aspect": "3:4",
        "refs": [LOGO_PINK, PROD_LAVENDER_CLEAN],
        "text": (
            BRAND_ANCHOR
            + "Interior photograph of a Japanese-inspired head spa treatment room at "
            "H&T Hair Lounge. Single wooden recliner upholstered in cream linen, "
            "soft white pendant lamp glowing warm overhead, small side table holding "
            "a white ceramic bowl and folded muslin towels. On a small open shelf to "
            "the side, the exact H&T Lavender Shampoo bottle from the reference is "
            "displayed (lavender, faceted, crystal cap). A single potted fern in the "
            "corner. Polished wide-plank wooden floor catches the lamp glow. Walls "
            "cream with a deep wine accent panel behind the chair; on the wine panel, "
            "the exact pink-and-wine H&T Hair Lounge logo from the reference appears "
            "as a small framed plaque. "
            "Lighting: warm tungsten pendant, gentle natural daylight from a window "
            "on the left, soft shadows. "
            "Mood: serene, refined minimalism, sanctuary-like calm. "
            "Composition: tall vertical frame, chair centered, viewer entering the "
            "space. No people. "
            "Style: photorealistic interior design magazine photography. "
            "No text overlay other than the logo plaque, no watermark."
        ),
    },
    "gal2-head-bath-ritual": {
        "aspect": "16:9",
        "refs": [LOGO_PINK, PROD_LAVENDER_CLEAN],
        "text": (
            BRAND_ANCHOR
            + "Cinematic overhead photograph of the Japanese head bath ritual at H&T "
            "Hair Lounge. The client's long dark hair floats in warm water inside a "
            "wide porcelain basin; the surface is scattered with cream and blush rose "
            "petals. Two stylist hands cradle the back of the head from below; warm "
            "water droplets catch the light. At the edge of frame sits the exact H&T "
            "Lavender Shampoo bottle from the reference, slightly tilted as if just used. "
            "Lighting: soft directional from top-right, water surface reflects warm tones. "
            "Mood: ritualistic, deeply peaceful, restorative. "
            "Composition: wide horizontal frame, overhead angle, basin filling most "
            "of the frame. No faces shown. "
            "Style: photorealistic editorial style, slight motion blur on water surface. "
            "No text, no watermark."
        ),
    },
    "gal3-detail-products": {
        "aspect": "1:1",
        "refs": [PROD_LAVENDER_ROSE_DUO],
        "text": (
            "BRAND REFERENCE INPUT (attached above): the actual H&T Hair Lounge "
            "Lavender Shampoo bottle and Rose Shampoo bottle side-by-side. Preserve "
            "BOTH bottles exactly — same geometric faceted shape, same crystal-cut "
            "caps, same labels with the H&T logo and the '98% NATURAL PLANT ESSENCE' "
            "callout, same lavender purple and peach-rose colors. Do NOT alter the "
            "bottles' shape, color, label artwork, or wording in any way. "
            "Re-stage them as an editorial product still life: both bottles standing "
            "on a smooth cream marble counter, a small sprig of fresh lavender to the "
            "left and a single fresh rose to the right matching the bottles. "
            "Lighting: soft natural side light from the right, gentle highlight on "
            "the crystal caps, soft cream backdrop with subtle deep-wine shadow at "
            "the base of frame. "
            "Mood: refined, natural, premium beauty editorial. "
            "Composition: square 1:1 frame, both bottles centered with minimal "
            "negative space, eye-level angle. "
            "Style: photorealistic product photography for a luxury magazine. "
            "No additional text in the scene."
        ),
    },
    "gal4-lounge-interior": {
        "aspect": "1:1",
        "refs": [LOGO_PINK, PROD_LAVENDER_CLEAN],
        "text": (
            BRAND_ANCHOR
            + "Photograph of the H&T Hair Lounge reception lounge waiting area. "
            "Single cream linen armchair, small round marble side table holding a "
            "white porcelain teacup of jasmine tea, a tiny lavender bouquet in a "
            "small ceramic vase. Woven jute rug underneath. Tall floor lamp in deep "
            "wine. Wall behind the chair painted deep burgundy; mounted on it, the "
            "exact pink-and-wine H&T Hair Lounge logo from the reference appears as "
            "a backlit circular sign about 50cm wide. Opposing wall in cream with a "
            "small framed botanical print. A low shelf below the logo sign displays "
            "the exact H&T Lavender Shampoo bottle from the reference. "
            "Lighting: soft daylight through a tall window off-frame left, warm floor "
            "lamp accent. "
            "Mood: hospitable, calm, refined, welcoming. "
            "Composition: square 1:1 frame, mid-distance, slight 3/4 angle on the "
            "chair. No people. "
            "Style: photorealistic interior design photography. No text other than the logo."
        ),
    },
    "gal5-happy-client-result": {
        "aspect": "16:9",
        "refs": [LOGO_PINK, PROD_LAVENDER_CLEAN],
        "text": (
            BRAND_ANCHOR
            + "Editorial photograph of a woman with healthy glossy dark hair sitting "
            "upright with eyes gently closed, a soft smile of post-spa serenity, head "
            "turned three-quarters away from camera. Hair freshly styled, falling "
            "smoothly. She wears a cream linen robe. To her side on a small marble "
            "ledge sits the exact H&T Lavender Shampoo bottle from the reference, "
            "softly out of focus. "
            "Lighting: warm golden natural side light from window-right, soft rim on hair. "
            "Mood: radiant calm, quiet satisfaction, restored. "
            "Composition: wide horizontal frame, subject positioned left, soft "
            "cream-pink background to the right with negative space. Avoid direct "
            "camera gaze. "
            "Style: photorealistic editorial portrait, magazine quality. No text, no watermark."
        ),
    },
    "gal6-scalp-massage": {
        "aspect": "1:1",
        "refs": [LOGO_PINK, PROD_LAVENDER_CLEAN],
        "text": (
            BRAND_ANCHOR
            + "Overhead photograph of skilled fingertips kneading the scalp of a "
            "client with dark hair lying on a cream-toweled headrest. Hands "
            "center-frame, slight motion in the fingers. Hint of the exact H&T "
            "Lavender Shampoo bottle from the reference at the edge of frame, softly "
            "out of focus on a marble ledge. "
            "Lighting: single warm pendant from upper-left, soft shadows under hands. "
            "Mood: focused therapy, gentle expertise, restorative touch. "
            "Composition: square 1:1 overhead frame, top-down angle. No face visible. "
            "Style: photorealistic editorial spa photography. No text, no watermark."
        ),
    },
    "map-img": {
        "aspect": "1:1",
        "refs": [LOGO_PINK],
        "text": (
            "BRAND REFERENCE INPUT (attached above): the pink-and-wine circular H&T "
            "Hair Lounge logo. Preserve its exact artwork when it appears in the map. "
            "Aesthetic stylized minimalist map illustration of a small section of "
            "Sandy Springs in Atlanta showing Powers Ferry Road as the main artery. "
            "Soft cream background, deep burgundy road lines drawn clean and thin, a "
            "single blush rose marker pin at the salon location — the marker is the "
            "exact pink-and-wine H&T Hair Lounge logo from the reference, rendered as "
            "a small circular badge with a slim wine stem pointing down to the road. "
            "Light suggestion of nearby tree shapes and a small creek line in "
            "champagne gold. "
            "Style: hand-drawn vector aesthetic in the spirit of fashion-magazine "
            "destination maps, two-color minimal palette plus accents. No photographic "
            "elements, no realistic textures. "
            "Composition: square 1:1, marker pin centered. Only the H&T logo appears "
            "as a label; no other text in the map."
        ),
    },
}


def get_token(force_refresh: bool = False) -> str:
    """Call ~/.claude/scripts/vertex-token.sh (cached 55min in /tmp).
    If force_refresh, delete the cache first so a brand-new token is minted."""
    if force_refresh:
        try:
            Path("/tmp/vertex_access_token").unlink()
        except FileNotFoundError:
            pass
    home = Path.home()
    script = home / ".claude" / "scripts" / "vertex-token.sh"
    out = subprocess.run(["bash", str(script)], capture_output=True, text=True, check=True)
    return out.stdout.strip()


def encode_ref(path: Path, max_side: int = 1024) -> dict:
    """Read a reference image, downsize to <= max_side, return Vertex AI inlineData part."""
    if not path.exists():
        raise FileNotFoundError(f"reference image missing: {path}")
    img = Image.open(path).convert("RGB")
    w, h = img.size
    if max(w, h) > max_side:
        scale = max_side / max(w, h)
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=88, optimize=True)
    data = base64.b64encode(buf.getvalue()).decode("ascii")
    return {"inlineData": {"mimeType": "image/jpeg", "data": data}}


def post_with_retry(body_bytes: bytes, token: str, slot: str) -> dict:
    """POST to Nano Banana. Retry on 401 (refresh token) + on connection reset (back off)."""
    last_exc = None
    for attempt in (1, 2, 3):
        try:
            req = urlrequest.Request(
                ENDPOINT,
                data=body_bytes,
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                },
                method="POST",
            )
            with urlrequest.urlopen(req, timeout=240) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urlerror.HTTPError as e:
            last_exc = e
            if e.code == 401 and attempt < 3:
                print(f"[{slot}] 401 — refreshing token (attempt {attempt})", flush=True)
                token = get_token(force_refresh=True)
                time.sleep(2)
                continue
            raise
        except (urlerror.URLError, ConnectionResetError) as e:
            last_exc = e
            if attempt < 3:
                wait = 4 * attempt
                print(f"[{slot}] connection error — backing off {wait}s (attempt {attempt}): {e}", flush=True)
                time.sleep(wait)
                continue
            raise
    raise RuntimeError(f"[{slot}] exhausted retries: {last_exc}")


def generate_one(slot: str, spec: dict, token: str) -> Path:
    """Call Nano Banana for a single slot, save JPEG, return path."""
    parts = [encode_ref(Path(p)) for p in spec.get("refs", [])]
    parts.append({"text": spec["text"]})

    body = {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {
            "responseModalities": ["IMAGE", "TEXT"],
            "imageConfig": {"aspectRatio": spec.get("aspect", "1:1")},
        },
    }
    body_bytes = json.dumps(body).encode("utf-8")
    print(f"[{slot}] requesting ({spec.get('aspect')}, {len(spec.get('refs', []))} refs)...", flush=True)
    data = post_with_retry(body_bytes, token, slot)

    cand_parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    inline_b64 = None
    for p in cand_parts:
        inline = p.get("inlineData") or p.get("inline_data")
        if inline and inline.get("data"):
            inline_b64 = inline["data"]
            break
    if not inline_b64:
        sample = json.dumps(data)[:500]
        raise RuntimeError(f"[{slot}] no inline image data in response: {sample}")

    png_bytes = base64.b64decode(inline_b64)
    img = Image.open(io.BytesIO(png_bytes)).convert("RGB")
    out_path = OUT_DIR / f"{slot}.jpg"
    img.save(out_path, "JPEG", quality=86, optimize=True, progressive=True)
    size_kb = out_path.stat().st_size // 1024
    print(f"[{slot}] saved {out_path.relative_to(ROOT)} ({img.size[0]}x{img.size[1]}, {size_kb} KB)")
    return out_path


def main() -> int:
    selected = sys.argv[1:] or list(PROMPTS.keys())
    unknown = [s for s in selected if s not in PROMPTS]
    if unknown:
        print(f"ERROR unknown slot(s): {unknown}\navailable: {list(PROMPTS.keys())}")
        return 2

    token = get_token(force_refresh=True)
    print(f"Token acquired ({len(token)} chars). Generating {len(selected)} image(s) into {OUT_DIR}")
    for i, slot in enumerate(selected):
        try:
            generate_one(slot, PROMPTS[slot], token)
        except Exception as exc:
            print(f"[{slot}] FAILED: {exc}")
        if i < len(selected) - 1:
            time.sleep(3)  # jitter between requests to avoid quota / rate spikes
    return 0


if __name__ == "__main__":
    sys.exit(main())
