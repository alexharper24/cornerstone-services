# CLAUDE.md — Cornerstone Services website

Static site for Cornerstone Services (Stephen Williams), painting and small
drywall in Warsaw, Indiana. Plain HTML/CSS/JS, no build step, GitHub Pages.

The root rules in `C:\Git_Repos\CLAUDE.md` and
`.claude/guides/static-sites.md` apply. This file is only what is specific
to this repo.

---

## The thing that has bitten twice

**Bump `?v=` on `style.css` / `main.js` in the same commit that changes the
file.** On 2026-09-05 a commit changed `style.css` and left the buster at
`v=12`. GitHub Pages serves `max-age=600`, so browsers that had already
fetched the previous deploy kept it: new HTML, old CSS, and the painting
page's flanking layout collapsed into a stack for anyone with a warm cache.
It looked like a CSS bug and was not. If only HTML changed, do **not** bump,
because that forces every returning visitor to re-download 50 KB for nothing.

Current: `style.css?v=26`, `main.js?v=13`.

## Never lazy-load a `.flip-back` image

`.flip-face.flip-back` is `backface-visibility:hidden`, so the browser never
counts it visible and a `loading="lazy"` image there is never fetched. The
flip then reveals a permanently blank panel. Measured: `complete:false,
naturalWidth:0` a full 1.5 s after the flip. Both faces of a before/after
pair load eagerly on purpose.

## `width`/`height` attributes fight `aspect-ratio`

They apply as presentational hints, and a hint of `height:900px` beats
`aspect-ratio`, which only computes a height when height is `auto`. Any image
with both needs an explicit `height:auto`. Without it the recent-work cards
rendered 1180 px tall at a 0.47 aspect instead of 3/2.

## Raw camera drops

Photos arrive in `img/` with spaces in the filename ("deck before.jpg"), 5-6
MB each. `.gitignore` catches anything in `img/` with a space, so they cannot
be committed by accident. Resize to 1200 px wide, quality 72, progressive,
name `work-<subject>-<before|after>.jpg`, and move the original to the repo's
parent folder (outside git) alongside the others.

Gallery images carry `-480` and `-800` variants for `srcset`. If you add a
new gallery photo, generate both or the `srcset` will reference files that do
not exist.

## Copy comes from Cornerstone's own words

When describing a job, use Stephen's language from his own posts, not a guess
from the photograph. The deck was called "repainted" on the site until his
Facebook tags (`#decking #stainingwood`) showed it was **stained**. Same for
the playground restoration, which is a real service he advertises and which
does not appear anywhere else on the site.

His Facebook feed renders posts as skeleton placeholders that resolve a
second or two later. Scrolling fast and reading the DOM reports one post when
there are five. Wait for each to render.

## Fonts are self-hosted

`fonts/` holds the latin subset. There is no `fonts.googleapis.com` request
anywhere and the site makes **zero** external requests, which the privacy
policy states as fact. Work Sans is a single variable file with a weight
range: Google serves the identical file for 400/500/600/700, so four copies
is 150 KB of waste.

## Still pending

1. **The estimate form does not work.** `contact.html` posts to
   `YOUR_FORM_ID`. Sign up at formspree.io, set the notification email to
   cornerstone22022@gmail.com, replace the placeholder, and send one test
   (Formspree needs a one-time confirmation click on the first submission).
2. **No custom domain.** Canonicals, OG URLs, sitemap and the schema `@id`
   all point at `alexharper24.github.io/cornerstone-services/`. All of them
   change together when a domain is bought.
3. **No drywall or remodel photography.** Every real job photo is painting or
   staining, so the two stock tiles on the homepage and services page stay
   stock until Stephen sends some.
4. **Google Business Profile** is not set up. For a local trade it is the
   thing that makes the phone ring, and it is quoted into the build.
