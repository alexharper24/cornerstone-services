# Cornerstone Services — Website

A fast, mobile-friendly static website for **Cornerstone Services** (Stephen Williams) — painting, drywall, and small remodels in Warsaw, Indiana.

## What's here

```
web/
├── index.html        Home
├── services.html     Services + work gallery
├── about.html        About Stephen / our story
├── contact.html      Free estimate form + contact info
├── style.css         All styling (change colors/fonts in one place at the top)
├── main.js           Menu, animations, gallery filter, form handling
├── sitemap.xml       For Google
├── robots.txt        For Google
├── .nojekyll         Tells GitHub Pages to serve files as-is
└── img/              Logos + favicon (add work photos here)
    └── brand/source/ Your original logo package, kept for safekeeping
```

This folder **is** the website. Upload its **contents** (so `index.html` sits at the top level) to your host.

### About `img/brand/source/`

These are the original, full-size logo files from your brand package (the primary
logo, the circle icon, the dark and green lockups, the main mark, and the brand
board). The website itself uses the smaller versions sitting directly in `img/`.

The originals are kept here on purpose so they are never lost, and so a bigger or
differently-coloured version can be made later without going back to the designer.
Nothing on the site links to them, so they do not slow any page down.

---

## ✅ Before it goes live — 3 things to finish

### 1. Turn on the estimate form (5 minutes, free)
The form is built and ready, but needs to be connected to a free service that emails you the submissions.

1. Go to **[formspree.io](https://formspree.io)** and sign up (free plan is fine).
2. Create a new form, and set the notification email to **cornerstone22022@gmail.com**.
3. Copy your form ID — it's the code in `formspree.io/f/**abcdwxyz**`.
4. In **`contact.html`**, find `YOUR_FORM_ID` and replace it with your real ID.
   (If you build the single-file preview version too, update it there as well.)
5. Submit one test request. Formspree sends a **one-time confirmation email** the first time — click it once, and after that every request lands in your inbox.

Until this is done, the form shows a friendly "call or text us" message instead of failing silently.

### 2. Pick your web address (domain)
The site currently uses a placeholder address, `cornerstonesvcs.com`, in its SEO tags. Once you register a real domain (or decide on the free `github.io` address), tell me and I'll update every page to match.

### 3. Add real photos (biggest impact for a trades site)
Right now the gallery and the "photo of Stephen" spots use branded placeholders. When you have photos:
- Drop them in the `img/` folder.
- Send them over and I'll optimize them, name them, and swap them into the gallery and About page.
Before/after painting shots do especially well.

---

## Publishing it free on GitHub Pages

1. Create a free account at [github.com](https://github.com) and a new **public** repository.
2. Upload **everything inside this `web/` folder** (Add file → Upload files) — all the HTML, `style.css`, `main.js`, and the whole `img/` folder. *(Forgetting the images is the #1 cause of broken pictures on the live site.)*
3. Go to **Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save**.
4. In ~1–2 minutes your site is live at `https://<your-username>.github.io/<repo>/`.

### Custom domain (optional)
If you register a domain, add it in **Settings → Pages → Custom domain** first, then point your domain's DNS at GitHub. I can walk you through the exact DNS records when you're ready.

---

## Get found on Google (do these after launch)

The site already includes local-SEO tags, structured data, and a sitemap. The rest happens off-site:

1. **Google Business Profile** — the single biggest lever. Free at [google.com/business](https://google.com/business). Verify "Cornerstone Services, Warsaw IN" to appear on Google Maps and local search. You can show a service area without a public home address.
2. **Google Search Console** — [search.google.com/search-console](https://search.google.com/search-console); add the site and submit `sitemap.xml` so Google indexes it quickly.
3. **Link the site** from your Facebook page and posts.
4. **Ask happy customers for Google reviews** — review count and quality are among the strongest local ranking signals.
5. Keep your **name, area, and phone number identical** everywhere (site, Facebook, Google).

---

## Making changes

Text and colors are easy to edit:
- **Colors/fonts:** the `:root` block at the top of `style.css`.
- **Wording:** open the relevant `.html` file and edit the text.

Or just send me the change and I'll take care of it and rebuild.
