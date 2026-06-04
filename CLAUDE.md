# CLAUDE.md — Ben's Lunchbox

Guidance for any Claude session working on this repo. Keep it short; the code is small.

## What this is

A single-page, **static** site (no build step, no framework) showing a feed of Ben's
lunchboxes. Plain `index.html` + `style.css` + `app.js`, content driven by `boxes.json`,
photos in `images/`. Deployed via GitHub Pages from the repo **root** on branch `main`.

## The #1 recurring task: "add these photos"

When the user drops one or more lunchbox photos in the chat and asks to add them:

1. **Get the real bytes.** Uploaded images are usually NOT on the filesystem, but they
   ARE embedded (base64) in the session transcript JSONL at
   `~/.claude/projects/-home-user-temp/*.jsonl`. Parse the latest file, pull `image`
   blocks (`source.data` / `source.media_type`), decode, and save into `images/`.
   De-dupe by md5 (the same photo is sometimes re-sent).
2. **Name by date:** `images/YYYY-MM-DD.jpeg` (use `.jpg`/`.png` to match the actual bytes).
3. **Append one object per box to `boxes.json`** (newest sorts first automatically):
   ```json
   {
     "id": "2026-06-12",
     "image": "images/2026-06-12.jpeg",
     "title": "LOUD GAME-FLAVORED NAME",
     "date": "2026-06-12",
     "ingredients": ["read off the photo, keep names straight"],
     "note": "one cheeky line — punk/gamer energy, marker font"
   }
   ```
   Read ingredients off the photo unless the user specifies them. Titles/notes can be
   playful; ingredient names stay literal/legible.
4. **Use the ORIGINAL photos** — do not regenerate or replace them with art. Framing,
   cropping, and borders are done non-destructively in CSS (`.post__img`), never by
   editing the bytes. If a box needs re-centering, tweak `object-position`.
5. **Verify** before pushing: `python3 -m http.server` + a headless screenshot
   (`/opt/pw-browsers/.../headless_shell --headless --screenshot=...`) at desktop
   (~1200px) and mobile (~430px) widths. Confirm the real photos render.
6. **Commit + push to `main`** (this is the user's explicit, standing preference for this
   repo). The live page updates automatically. Do NOT open a PR unless asked.

## Style / aesthetic (don't drift)

Instagram feed × neon-arcade × punk/metal — dark, high-contrast, but elegant, clean, fun.
**Not** Minecraft / pixel.

- Base: near-black `#0c0c0f`; neon accents — magenta `#ff2d6f`, lime `#c8ff32`, cyan `#20e3ff`.
- Fonts (Google): **Anton** (heavy display, headings/title), **Inter** (body — keep
  ingredient text legible), **Permanent Marker** (cheeky notes only).
- Photos are the hero: 4:5 cover crop, rounded frame, hover zoom + neon glow.
- Touches: scrolling marquee strip, slapped-on auto-emoji sticker, acid-lime "LOADED" tag,
  glowing lightbox. Tasteful — readability first.
- Auto-emoji per post comes from the FIRST ingredient via `EMOJI_MAP` in `app.js`; extend
  that list for new foods (fallback is 🍱).

## Conventions

- Data model stays decoupled: adding a box = drop image + append to `boxes.json`, never
  hand-edit generated HTML.
- Mobile-first; grid is 1 col → 2 → 3 by width.
- Keep it dependency-free (fonts via CDN are the only external thing).
- Missing/broken images fall back to `images/placeholder.svg`.

## Deploy / hosting

- Repo is **public**. GitHub Pages must be enabled once in repo Settings
  (Source: Deploy from a branch → `main` / root). That toggle is not scriptable from here;
  if the live URL 403/404s, remind the user to flip it.
- Live URL: https://nimrodtalmon.github.io/temp/
