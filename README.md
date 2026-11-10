# Digital Cookbook

A home recipe book that doubles as a showcase of what HTML alone can do.

**The one rule:** the site is pure HTML. No CSS (not even a `style` attribute), no JavaScript, no build step. Every visual and interactive effect comes from HTML elements and attributes, including old presentational ones that browsers still honour.

Live at [html.sandyfletcher.ca](https://html.sandyfletcher.ca/).

---

## How the HTML is used

### Page foundations
- **`<!DOCTYPE html>`, `lang`, `charset`, viewport `<meta>`**: standards mode, correct language for screen readers, UTF-8 for fractions (½ ⅓ ¾), accents (Niçoise, Bánh Mì) and emoji, and proper scaling on phones.
- **Favicon** through `<link rel="icon">`. The path is relative so it also works when the file is opened from disk.
- **Share previews**:
  - `<meta name="description">` plus Open Graph tags (`og:title`, `og:description`, `og:image` with width and height, `og:url`) and `twitter:card`, so links render as cards in chats and social apps.
  - `images/share.jpg` is a 1200×630 crop made for this purpose.
- **`<meta name="theme-color">`** tints the browser's address bar brown on phones that support it.

### Colour and type without CSS
- **`<body>` attributes**:
  - `bgcolor` sets the page colour.
  - `link`, `vlink` and `alink` set link colours.
  - `background` tiles the tablecloth image behind everything.
- **`<font face size color>`** handles every typeface, size and colour. Font stacks such as `"Georgia, serif"` fall back the same way CSS stacks do.
- **`<b>`, `<i>`, `<tt>`, `<small>`** give weight, slant, monospace and size changes.
- **`<center>`** centres blocks. Table and cell `align` / `valign` handle the rest.

### Layout from tables
- **Nested tables build frames.** An outer table with a dark `bgcolor` and `cellpadding="4"` wraps an inner table in a lighter colour, which reads as a thick border. The header, nav and section bars all use this.
- **`cellpadding` / `cellspacing`** stand in for padding and margins. The nav's values are tuned (`6`/`3`) so all six columns fit a 360px-wide phone.
- **Percentage `width`s** (`97%` for the header and nav, `100%` for the section bars) make the layout fluid. The narrower header block is deliberate: it gives the top of the page an indent.

### Responsive photos with no media queries
- Photos are inline `<img>`s at `width="160"`. Inline content wraps, so four photos sit in one row on wide screens and fold into 2×2 on phones. Rows of two stay centred because they're inside `<center>`.
- `hspace` / `vspace` give the gutters, and `border="2"` gives the frame.
- **`width` + `height` on every image** reserve space before it loads, so the page doesn't jump.
- **`loading="lazy"`** means photos inside closed recipes aren't downloaded until the recipe is opened.
- **Image files are WebP, 320×320**: twice the display size, so they stay sharp on high-density screens, at about 10–35 KB each. Location metadata (EXIF/GPS) is stripped during conversion; see *Adding photos* below.

### Semantic structure
- **`<header>`, `<nav>`, `<main>`, `<section id>`, `<article id>`, `<footer>`, `<address>`** give the page a real outline for screen readers and search engines.
- **Site title:** `<font role="heading" aria-level="1">`. A real `<h1>` adds built-in margins that can't be removed without CSS and pushed the subtitle away. The ARIA role gives assistive technology the same heading with zero visual change.
- **Section bars are real `<h2>`s.** Each is wrapped in `<font size="1"><small>`. Heading margins scale with the heading's own font size, so shrinking the inherited size shrinks the margins. The visible text keeps its own `<font size="6">`, and the bar's `cellpadding` is set to `0` to compensate. The result is within a pixel of the original look.
- Recipe titles stay as plain `<summary>` text. A heading inside `<summary>` pushes the ▶ marker onto its own line, and only CSS can fix that.

### Interactivity without JavaScript
- **`<details>` / `<summary>`**: every recipe is a native accordion, and several can be open at once.
- **Fragment links**: the nav links jump to `<section id>`s, and every recipe has an `<article id>` (for example `#banana-bread`) that can be linked to.
- **Auto-opening a closed recipe**: when a link targets an element *inside* a closed `<details>`, current Chromium browsers (Chrome, Edge) open it automatically. Other browsers may only scroll there.
  - The Niçoise recipe links to `#steam-boiled-recipe`, an id on the first `<br>` inside the egg recipe, so the egg recipe opens at its start.
  - Targeting the `<article>` itself scrolls but leaves the recipe closed.
- **`href="#top"`** in the footer returns to the top of the page. Browsers support `#top` with no matching id.
- **`<abbr title>`** shows metric conversions on hover (`1 lb` → `~450g`). Limitation: phones have no hover.
- **`title` attributes** add tooltips to the nav and other links.

### Links without visible underlines
Links can't drop their underline without CSS, but the underline is drawn in the **link's** colour (the `<body link>` value) while the text can be recoloured with an inner `<font color>`. The link colour (`#EADDCA`) is set to match the backgrounds the links sit on. The nav cells and in-text links therefore show coloured text with an underline that blends in.

### Motion
- **Nested `<marquee>`s** make the bouncing kitchenware:
  - An outer `direction="right" behavior="alternate"` marquee moves left and right.
  - Inside it, a `direction="down" behavior="alternate"` marquee moves up and down.
  - Together they give the diagonal bounce of the old DVD logo.
  - Two pairs run in half-width cells at different `scrollamount`s, so the icons move independently.
- The bounce strip has `aria-hidden="true"` so screen readers skip the decoration.
- **Caveat:** marquees can't be paused without JavaScript, so motion is kept decorative and the important text (the staples note) sits still.

### Recipe anatomy
Each recipe follows `templaterecipe.html`:
1. **Tip box** (optional): a single-cell table with `bgcolor`. Only used when a tip doesn't fit naturally into the steps.
2. **Ingredients**: `<fieldset>` with a centred `<legend>`. The letter-spaced heading is done by hand with spaces and `&nbsp;`.
3. **Steps**: a two-column table, gold numerals in the left cell. A table rather than `<ol>` because list numbers can't be coloured without CSS.
4. **Photos**: 2 or 4 per recipe, as described above.
5. **Source button**: `images/view-original-recipe.png` (680×80, displayed at 340×40) inside a link with `target="_blank"`.

### Sources and link longevity
- **Web recipes** link to the original page. Strip tracking parameters (`?utm_…`, `gclid`, and so on) first.
- **Book recipes** link to Open Library by ISBN: `https://openlibrary.org/isbn/<ISBN-10 or ISBN-13>`. Open Library redirects that to its permanent record for the book, so the link outlives any shop listing. Use the ISBN of the edition you own; it's on the copyright page or the barcode.
- **Checking links**: run the [W3C Link Checker](https://validator.w3.org/checklink) against the live site now and then. It also checks that `#fragment` links point at ids that exist.

### Graphics made for the site
- `images/tablecloth.webp`:
  - A 640×640 gingham tile in the site's palette, with faint linen noise and a few marks: coffee ring, part of a pot ring, a tomato splash, an oil smudge, crumbs and herb flecks.
  - Marks crossing an edge continue on the opposite side, so the tile repeats without seams.
  - At 640px it repeats about twice across a desktop screen.
- `images/view-original-recipe.png`: the source button.

---

## Workflow notes

### Adding a recipe
Copy `templaterecipe.html` into the right `<section>`. Then:
- Give the `<article>` a lowercase, hyphenated `id` taken from the title, e.g. `id="banana-bread"`.
- Fill in the content and use `<abbr title="~metric">` for imperial measurements.
- Delete the tip box if there's no real tip.

### Adding photos
Shoot square, then convert to 320px WebP with location data removed. With ImageMagick 7 (on Windows use `magick`; ImageMagick 6 uses `convert`):

```
magick input.jpg -auto-orient -strip -resize 320x320 -quality 82 output.webp
```

`-auto-orient` must come before `-strip`, otherwise phone photos can end up sideways. Don't commit the original JPGs.

---

## TODO

- [ ] **Republish as a fresh repository** to drop all earlier history, including the full-size photos that contained GPS coordinates:
  - [ ] In a new folder, copy only the current files (no `.git`, no `.jpg` photos, no `preview-*.html`).
  - [ ] Check the copy: `index.html`, `CNAME`, `README.md`, `images/` (WebP photos, `chef.ico`, `share.jpg`, `tablecloth.webp`, `view-original-recipe.png`), plus `templaterecipe.html` / `thorough.html` while they're still needed.
  - [ ] Delete the old GitHub repository. Force-pushing a fresh branch isn't enough, because old commits can stay reachable by their hash.
  - [ ] Create a new repository, `git init`, commit, push, re-enable GitHub Pages, and confirm the custom domain.
  - [ ] Check for forks of the old repository. Deleting it doesn't remove forks.
- [ ] **Move recipes over from `thorough.html`** into the standard format, then delete `thorough.html`.
- [ ] Decide whether `templaterecipe.html` stays (outside the published site) or goes once migration is done.
- [ ] **Replace placeholder photos**, which still load from placehold.co:
  - Recipes: tofu bánh mì, potato salad, roasted tomato (2 of 4), pineapple guacamole, butter chicken, pepper pulled pork, firecracker shrimp, banana bread.
  - Once these are gone, the site has no outside dependencies.
- [ ] **Braised pot roast photos**: the page points to `images/potroast/*.jpg`, which don't exist.
- [ ] **Replace placeholder tips** (LLM-written) with real ones, or remove the box.
- [ ] **Add sources** where they exist: crusty no-knead, potato salad, roasted tomato, pineapple guacamole, butter chicken, braised pot roast, firecracker shrimp, banana bread (book: use Open Library).
- [ ] **Tofu bánh mì category**: it currently sits under EGGS. Consider renaming the section "EGGS & TOFU", which matches the source book's chapter.
- [ ] **Metric conversions on phones**: `<abbr>` only works on hover. Options:
  - Show the conversion inline in `<small>`.
  - Use the HTML `popover` attribute, which works on tap but shows the browser's default button look.
- [ ] Delete `preview-bounce.html`, `preview-filmstrip.html`, `preview-tablecloth.html` and the unused `images/tablecloth.png`.
- [ ] **GitHub Pages renders `README.md`** into a page on the live site by default. If that's unwanted, add an empty `.nojekyll` file (the README is then served as plain text) or keep the README out of the published branch.
- [ ] Run the W3C Link Checker on the live site after republishing.
- [ ] Ideas to consider:
  - Ingredient checklists with `<label><input type="checkbox">`, which keep their ticks with no JavaScript.
  - `<meter>` for difficulty.
  - An image map (`<map>` / `<area>`) somewhere playful.
