# Ben's Lunchbox — Daily Drops 🍱⚡

A tiny, **static** webpage that shows off the lunchboxes we pack for Ben (age 10),
styled like an Instagram feed crossed with a neon-arcade gig poster — dark, punk,
high-contrast, but clean and fun. Each post = a real photo + what's inside.

- **No build step, no framework.** Just `index.html`, `style.css`, `app.js`.
- Content lives in **`boxes.json`** — adding a box never touches the HTML.
- Mobile-first feed, responsive grid, tap a post for an enlarged view.

---

## Add a new box (under a minute)

1. **Drop the photo** into `images/` (`.jpeg`, `.jpg`, or `.png`).
   Naming it by date keeps things tidy, e.g. `images/2026-06-10.jpeg`.
2. **Append one object** to the array in `boxes.json`:

   ```json
   {
     "id": "2026-06-10",
     "image": "images/2026-06-10.jpeg",
     "title": "Mighty Mac Attack",
     "date": "2026-06-10",
     "ingredients": [
       "Mac & cheese",
       "Cherry tomatoes",
       "Apple slices"
     ],
     "note": "Optional cheeky one-liner"
   }
   ```

3. Save. Reload the page. Done — the newest box shows up first automatically.

### Field reference

| Field         | Required | What it does                                                        |
|---------------|----------|---------------------------------------------------------------------|
| `id`          | yes      | Unique key (a date string works great).                             |
| `image`       | yes      | Path to the photo, relative to the site root.                       |
| `title`       | yes      | Post heading (heavy display font). Loud names encouraged.           |
| `date`        | yes      | `YYYY-MM-DD`. Used to sort **newest first** (not shown on the post).|
| `ingredients` | yes      | Array of strings. Rendered as rounded "patch" tags.                 |
| `note`        | no       | Optional cheeky one-liner (marker font) under the ingredients.      |

The little **emoji sticker** on each photo is picked **automatically** from the first
ingredient (e.g. falafel → 🧆, wrap → 🌯, pecan → 🥜). To add or tweak mappings, edit the
`EMOJI_MAP` list near the top of `app.js`. Unknown ingredients fall back to 🍱.

If an image is missing or fails to load, the post shows `images/placeholder.svg`
instead, so the feed never looks broken.

---

## Design notes

- **Type:** [Anton](https://fonts.google.com/specimen/Anton) (heavy poster display) for
  headings, [Inter](https://fonts.google.com/specimen/Inter) for body so ingredient text
  stays legible, and [Permanent Marker](https://fonts.google.com/specimen/Permanent+Marker)
  for the cheeky notes. Loaded from Google Fonts.
- **Palette:** near-black base with neon punk accents — hot magenta `#ff2d6f`,
  acid lime `#c8ff32`, electric cyan `#20e3ff`.
- Photos are the heroes (Instagram-style 4:5 crop via CSS — the **original files are used
  as-is**; framing/borders are done non-destructively in `style.css`). Tweak the crop with
  `.post__img { object-position }` if a box needs re-centering.

---

## Run it locally

Because the page uses `fetch("boxes.json")`, opening `index.html` straight from the
file system (`file://`) is blocked by the browser. Serve it over HTTP instead:

```bash
# from the project folder — pick whichever you have
python3 -m http.server 8000     #  → http://localhost:8000
npx serve .
```

---

## Deploy to GitHub Pages

This repo serves from the **repository root**.

1. Push to GitHub (the `main` branch).
2. Repo **Settings → Pages**.
3. **Source:** *Deploy from a branch*. **Branch:** `main`, **Folder:** `/ (root)`.
4. Save. After a minute your feed is live at:
   `https://<your-username>.github.io/<repo-name>/`

> Prefer serving from `/docs`? Move `index.html`, `style.css`, `app.js`, `boxes.json`,
> and `images/` into a `docs/` folder and pick **Folder: /docs** in step 3.

No build, no CI — GitHub Pages serves the static files directly.

---

## Project structure

```
/
├── index.html      # markup + lightbox shell
├── style.css       # the look — feed × neon arcade × punk
├── app.js          # fetches boxes.json, renders posts, runs the lightbox
├── boxes.json      # the content — edit this to add boxes
├── images/         # lunchbox photos (+ fallback placeholder)
└── README.md
```

Eat loud. ⚡
