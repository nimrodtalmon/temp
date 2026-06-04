# ⛏ Ben's Lunchbox Gallery 🍱

A tiny, fun, **static** webpage that shows off the lunchboxes we pack for Ben (age 10).
Minecraft / pixel-game aesthetic. Each box = a photo + what's inside.

- **No build step, no framework.** Just `index.html`, `style.css`, `app.js`.
- Content lives in **`boxes.json`** — adding a box never touches the HTML.
- Mobile-first, responsive grid, tap a card for an enlarged view.

---

## Add a new box (under a minute)

1. **Drop the photo** into `images/` (`.jpeg`, `.jpg`, `.png`, or a pixel-art `.svg`).
   Naming it by date keeps things tidy, e.g. `images/2026-06-10.jpeg`.
2. **Append one object** to the array in `boxes.json`:

   ```json
   {
     "id": "2026-06-10",
     "image": "images/2026-06-10.jpeg",
     "title": "Mighty Mac Mineshaft",
     "date": "2026-06-10",
     "ingredients": [
       "Mac & cheese",
       "Cherry tomatoes",
       "Apple slices"
     ],
     "note": "Optional one-liner, e.g. '+10 Crunch'"
   }
   ```

3. Save. Reload the page. Done — the newest box shows up first automatically.

### Field reference

| Field         | Required | What it does                                                        |
|---------------|----------|---------------------------------------------------------------------|
| `id`          | yes      | Unique key (a date string works great).                             |
| `image`       | yes      | Path to the photo, relative to the site root.                       |
| `title`       | yes      | Card heading (pixel font). Game-flavored names encouraged.          |
| `date`        | yes      | `YYYY-MM-DD`. Used to sort **newest first** (not shown on the card).|
| `ingredients` | yes      | Array of strings. Rendered as inventory-slot tags.                  |
| `note`        | no       | Optional cheeky one-liner under the ingredients.                    |

The little **emoji badge** on each card is picked **automatically** from the first
ingredient (e.g. falafel → 🧆, carrot → 🥕). To add or tweak mappings, edit the
`EMOJI_MAP` list near the top of `app.js`. Unknown ingredients fall back to 🍱.

If an image is missing or fails to load, the card shows `images/placeholder.svg`
instead, so the gallery never looks broken.

---

## The seed image

`boxes.json` ships with one example: **"Falafel Pita Power-Up"**.

Its image is a hand-made **pixel-art rendition** (`images/2026-06-04.svg`) of the real
lunchbox, so the page looks finished on first load and stays on-theme.

**To use the real photo instead:** drop the JPEG at `images/2026-06-04.jpeg` and change
that entry's `"image"` back to `"images/2026-06-04.jpeg"`. That's the only edit needed.

---

## Run it locally

Because the page uses `fetch("boxes.json")`, opening `index.html` straight from the
file system (`file://`) is blocked by the browser. Serve it over HTTP instead:

```bash
# from the project folder — pick whichever you have
python3 -m http.server 8000
#  → open http://localhost:8000
```

```bash
npx serve .
```

---

## Deploy to GitHub Pages

This repo is set up to serve from the **repository root**.

1. Push to GitHub (the `main` branch).
2. Repo **Settings → Pages**.
3. **Source:** *Deploy from a branch*. **Branch:** `main`, **Folder:** `/ (root)`.
4. Save. After a minute your gallery is live at:
   `https://<your-username>.github.io/<repo-name>/`

> Prefer serving from `/docs`? Move `index.html`, `style.css`, `app.js`, `boxes.json`,
> and `images/` into a `docs/` folder and pick **Folder: /docs** in step 3.

No build, no CI — GitHub Pages serves the static files directly.

---

## Project structure

```
/
├── index.html      # markup + lightbox shell
├── style.css       # pixel/Minecraft styling (dark game-UI theme)
├── app.js          # fetches boxes.json, renders cards, runs the lightbox
├── boxes.json      # the content — edit this to add boxes
├── images/         # lunchbox photos (+ placeholder + seed art)
└── README.md
```

Eat well, mine on. ⛏
