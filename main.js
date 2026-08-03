/* =========================================================
   Cornerstone Services — main.js
   Mobile nav drawer · scroll reveal · gallery filter · form
   ========================================================= */

/* ---------- Mobile nav drawer ---------- */
(function () {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  // Overlay must be a TRUE sibling of the drawer (append to its actual parent),
  // and sit below the drawer's z-index.
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  links.parentElement.appendChild(overlay);

  const setMenu = (open) => {
    links.classList.toggle('open', open);
    toggle.classList.toggle('active', open);
    overlay.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  overlay.addEventListener('click', () => setMenu(false));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
})();

/* ---------- Scroll reveal (with fail-safes so content is never stuck hidden) ---------- */
(function () {
  const items = [].slice.call(document.querySelectorAll('.reveal'));
  if (!items.length) return;
  const show = el => el.classList.add('in');

  // Reduced-motion or no IntersectionObserver: just show everything.
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(show);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  items.forEach(el => io.observe(el));

  // Reveal anything already in view right away (don't wait to scroll for above-the-fold content).
  const revealInView = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    items.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.95 && r.bottom > 0) show(el);
    });
  };
  requestAnimationFrame(revealInView);
  window.addEventListener('load', () => setTimeout(revealInView, 150));
  // Ultimate safety net: if anything is somehow still hidden, show it.
  setTimeout(() => items.forEach(show), 2500);
})();

/* ---------- Gallery filter ---------- */
(function () {
  const filters = document.querySelectorAll('.gallery-filters button');
  const items = document.querySelectorAll('.gallery .g-item');
  if (!filters.length || !items.length) return;
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      items.forEach(it => {
        it.style.display = (f === 'all' || it.dataset.cat === f) ? '' : 'none';
      });
    });
  });
})();

/* ---------- Estimate form (Formspree AJAX) ---------- */
(function () {
  const form = document.getElementById('estimateForm');
  const thanks = document.getElementById('formThanks');
  if (!form) return;
  const btn = form.querySelector('button[type="submit"]');

  function showError(t) {
    const prev = form.querySelector('.form-error');
    if (prev) prev.remove();
    const d = document.createElement('div');
    d.className = 'form-error';
    d.textContent = t;
    form.querySelector('.submit-row').after(d);
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const prev = form.querySelector('.form-error');
    if (prev) prev.remove();

    // Guard: form not yet connected to a Formspree ID.
    if (form.action.includes('YOUR_FORM_ID')) {
      return showError("This form isn't connected yet. Please call or text Stephen at (574) 377-0573, or email cornerstone22022@gmail.com.");
    }

    const original = btn.textContent;
    btn.classList.add('is-sending');
    btn.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.hidden = true;
        thanks.hidden = false;
        thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
        form.reset();
      } else {
        const d = await res.json().catch(() => ({}));
        showError(((d.errors && d.errors.map(x => x.message).join(', ')) ||
          "Something went wrong.") + " Please try again, or call/text (574) 377-0573.");
      }
    } catch {
      showError("Couldn't reach the server. Check your connection and try again, or call/text (574) 377-0573.");
    } finally {
      btn.classList.remove('is-sending');
      btn.textContent = original;
    }
  });
})();

/* ---------- Before/After flip cards (button flips; image still expands) ---------- */
(function () {
  const toggles = [].slice.call(document.querySelectorAll('.flip-toggle'));
  toggles.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();               // don't trigger the image lightbox
      const card = btn.closest('.flip-card');
      if (card) card.classList.toggle('flipped');
    });
  });
})();

/* ---------- Gallery lightbox (single image or multi-photo album, with nav) ---------- */
(function () {
  const tiles = [].slice.call(document.querySelectorAll('.gallery .g-item'));
  if (!tiles.length) return;
  let box, imgEl, capEl, countEl, items = [], idx = 0;

  function build() {
    box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML =
      '<button class="lightbox-close" aria-label="Close">✕</button>' +
      '<button class="lightbox-nav prev" aria-label="Previous photo">‹</button>' +
      '<button class="lightbox-nav next" aria-label="Next photo">›</button>' +
      '<img alt=""><div class="cap"></div><div class="lightbox-count"></div>';
    document.body.appendChild(box);
    imgEl = box.querySelector('img');
    capEl = box.querySelector('.cap');
    countEl = box.querySelector('.lightbox-count');
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lightbox-close')) close();
    });
    box.querySelector('.prev').addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
    box.querySelector('.next').addEventListener('click', function (e) { e.stopPropagation(); step(1); });
  }
  function render() {
    const it = items[idx];
    imgEl.src = it.src; imgEl.alt = it.alt || '';
    capEl.textContent = it.cap || '';
    countEl.textContent = items.length > 1 ? (idx + 1) + ' / ' + items.length : '';
    box.classList.toggle('single', items.length < 2);
  }
  function step(d) { idx = (idx + d + items.length) % items.length; render(); }
  function open(list, start) {
    if (!box) build();
    items = list; idx = start || 0; render();
    box.classList.add('open'); document.body.style.overflow = 'hidden';
  }
  function close() { if (box) { box.classList.remove('open'); document.body.style.overflow = ''; } }

  tiles.forEach(function (tile) {
    const tileImgs = [].slice.call(tile.querySelectorAll('img'));
    if (!tileImgs.length) return;
    const fc = tile.querySelector('figcaption');
    const cap = fc ? fc.textContent : '';
    const isAlbum = tile.classList.contains('album');
    const list = tileImgs.map(function (im) {
      const face = im.closest('.flip-face');
      const faceCap = face ? (face.querySelector('.flip-badge') ? face.querySelector('.flip-badge').textContent : '') : cap;
      return { src: im.currentSrc || im.src, alt: im.alt, cap: faceCap };
    });
    tileImgs.forEach(function (im, i) {
      im.addEventListener('click', function () {
        if (im.closest('.flip-face')) open([list[i]], 0);   // flip face: just that photo
        else if (isAlbum) open(list, i);                     // album: browse the whole set
        else open([list[i]], 0);                             // single tile
      });
    });
  });

  document.addEventListener('keydown', function (e) {
    if (!box || !box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
  });
})();

/* ---------- Footer year ---------- */
(function () {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
