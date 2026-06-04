/* ===========================================================
   Ben's Lunchbox Gallery — vanilla JS, no build step.
   Renders cards from boxes.json (newest first) and wires
   up a simple lightbox. Add a box = edit boxes.json only.
   =========================================================== */

(function () {
  "use strict";

  var gallery = document.getElementById("gallery");
  var statusEl = document.getElementById("status");

  // Fallback art shown if a photo is missing / fails to load.
  var FALLBACK_IMG = "images/placeholder.svg";

  /* --- Auto emoji from the first ingredient -------------------------------
     Each entry: [substring-to-match, emoji]. First match wins (case-insensitive).
     Falls back to the bento box. Extend this list freely. */
  var EMOJI_MAP = [
    ["falafel", "🧆"],
    ["pita", "🫓"],
    ["bread", "🍞"],
    ["bagel", "🥯"],
    ["wrap", "🌯"],
    ["tortilla", "🌮"],
    ["rice", "🍚"],
    ["noodle", "🍜"],
    ["pasta", "🍝"],
    ["tahini", "🥣"],
    ["hummus", "🥣"],
    ["sauce", "🥣"],
    ["carrot", "🥕"],
    ["tomato", "🍅"],
    ["cucumber", "🥒"],
    ["pepper", "🫑"],
    ["broccoli", "🥦"],
    ["corn", "🌽"],
    ["potato", "🥔"],
    ["egg", "🥚"],
    ["cheese", "🧀"],
    ["chicken", "🍗"],
    ["meat", "🍖"],
    ["fish", "🐟"],
    ["apple", "🍎"],
    ["banana", "🍌"],
    ["grape", "🍇"],
    ["strawberr", "🍓"],
    ["berry", "🫐"],
    ["orange", "🍊"],
    ["melon", "🍉"],
    ["cookie", "🍪"],
    ["choc", "🍫"],
    ["cake", "🍰"],
    ["pretzel", "🥨"],
    ["nut", "🥜"],
    ["pizza", "🍕"]
  ];

  function emojiFor(ingredient) {
    var text = String(ingredient || "").toLowerCase();
    for (var i = 0; i < EMOJI_MAP.length; i++) {
      if (text.indexOf(EMOJI_MAP[i][0]) !== -1) return EMOJI_MAP[i][1];
    }
    return "🍱";
  }

  /* --- Tiny DOM helpers ---------------------------------------------------- */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text; // textContent => safe against HTML injection
    return node;
  }

  function ingredientList(ingredients, className) {
    var ul = el("ul", className);
    (ingredients || []).forEach(function (ing) {
      ul.appendChild(el("li", null, ing));
    });
    return ul;
  }

  /* --- Lightbox ------------------------------------------------------------ */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightbox-img");
  var lbTitle = document.getElementById("lightbox-title");
  var lbIngredients = document.getElementById("lightbox-ingredients");
  var lbNote = document.getElementById("lightbox-note");
  var lastFocused = null;

  function openLightbox(box) {
    lastFocused = document.activeElement;
    lbImg.src = box.image || FALLBACK_IMG;
    lbImg.alt = box.title || "Lunchbox photo";
    lbImg.onerror = function () { this.onerror = null; this.src = FALLBACK_IMG; };
    lbTitle.textContent = box.title || "Lunchbox";

    lbIngredients.innerHTML = "";
    (box.ingredients || []).forEach(function (ing) {
      lbIngredients.appendChild(el("li", null, ing));
    });

    lbNote.textContent = box.note || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    var closeBtn = lightbox.querySelector(".lightbox__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  lightbox.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-close")) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  /* --- Card ---------------------------------------------------------------- */
  function buildCard(box) {
    var card = el("button", "card");
    card.type = "button";
    card.setAttribute("aria-label", "Open " + (box.title || "lunchbox"));

    var frame = el("div", "card__frame");

    var img = el("img", "card__img");
    img.src = box.image || FALLBACK_IMG;
    img.alt = box.title || "Lunchbox photo";
    img.loading = "lazy";
    img.onerror = function () { this.onerror = null; this.src = FALLBACK_IMG; };
    frame.appendChild(img);

    var icon = el("div", "card__icon", emojiFor((box.ingredients || [])[0]));
    icon.setAttribute("aria-hidden", "true");
    frame.appendChild(icon);

    card.appendChild(frame);

    var body = el("div", "card__body");
    body.appendChild(el("h2", "card__title", box.title || "Lunchbox"));
    body.appendChild(ingredientList(box.ingredients, "card__ingredients"));
    if (box.note) body.appendChild(el("p", "card__note", box.note));
    card.appendChild(body);

    card.addEventListener("click", function () { openLightbox(box); });
    return card;
  }

  /* --- Sort newest first --------------------------------------------------- */
  function byNewest(a, b) {
    var da = a.date || a.id || "";
    var db = b.date || b.id || "";
    return db < da ? -1 : db > da ? 1 : 0;
  }

  /* --- Load & render ------------------------------------------------------- */
  fetch("boxes.json", { cache: "no-cache" })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (boxes) {
      if (statusEl) statusEl.remove();
      if (!Array.isArray(boxes) || boxes.length === 0) {
        gallery.appendChild(el("p", "gallery__status", "No boxes yet — add one to boxes.json!"));
        return;
      }
      boxes.slice().sort(byNewest).forEach(function (box) {
        gallery.appendChild(buildCard(box));
      });
    })
    .catch(function (err) {
      if (statusEl) {
        statusEl.className = "gallery__status gallery__status--error";
        statusEl.textContent = "Couldn't load boxes.json (" + err.message + "). If you opened this file directly, serve it over http (see README).";
      }
    });
})();
