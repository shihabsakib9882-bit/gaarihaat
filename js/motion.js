/* GaariHaat motion, built from ui-ux-pro-max GSAP presets (Scroll Reveal, Stagger List) capped by principles/design-taste.md:
   150ms default, never past 300ms per animation. Transform and opacity only. Every move says something:
   the page arrives, checks get ticked, results answer a filter, a reservation lands. Reduced motion = final state, no movement. */
(function () {
  if (!window.gsap) return; /* CDN failed: the site still works, it just does not move */
  gsap.registerPlugin(ScrollTrigger);
  const EASE = 'power2.out';
  const D = 0.3;          /* longest single animation */
  const STAGGER = 0.05;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* CSS hover transitions on transform would smear GSAP's frames, so they pause while GSAP owns the element */
  const lock = els => els.forEach(e => e.classList.add('no-tr'));
  const unlock = els => els.forEach(e => e.classList.remove('no-tr'));
  function guarded(els, vars) {
    return { ...vars, onStart() { lock(els); }, onComplete() { unlock(els); } };
  }
  function guardTimeline(tl, sel) {
    const els = $$(sel);
    lock(els);
    tl.eventCallback('onComplete', () => unlock(els));
  }

  /* fade up as a group enters the viewport, once; small offset so it reads as arriving, not sliding */
  function reveal(targets, opts = {}) {
    const els = typeof targets === 'string' ? $$(targets) : [].concat(targets).filter(Boolean);
    if (!els.length) return;
    ScrollTrigger.batch(els, {
      start: 'top 90%',
      once: true,
      onEnter: batch => gsap.from(batch, guarded(batch, { opacity: 0, y: opts.y ?? 16, duration: D, ease: EASE, stagger: opts.stagger ?? STAGGER, clearProps: 'transform,opacity' }))
    });
  }

  /* inspection rows: the row arrives, then its tick lands, one check after another */
  function tickChecks(list) {
    if (!list) return;
    const rows = $$('.check-row', list);
    ScrollTrigger.create({
      trigger: list, start: 'top 80%', once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.from(rows, { opacity: 0, y: 12, duration: 0.25, ease: EASE, stagger: 0.07, clearProps: 'transform,opacity' })
          .from(rows.map(r => $('.check-icon', r)), { scale: 0.4, opacity: 0, duration: 0.25, ease: 'back.out(2)', stagger: 0.07, clearProps: 'transform,opacity' }, 0.1)
          .from(rows.map(r => $('.check-result', r)), { opacity: 0, x: -6, duration: 0.2, ease: EASE, stagger: 0.07, clearProps: 'transform,opacity' }, 0.15);
      }
    });
  }

  function home() {
    if (!$('.hero')) return;
    const tl = gsap.timeline({ defaults: { ease: EASE, duration: D } });
    const mobile = matchMedia('(max-width: 767px)').matches;
    tl.from('.hero-card', { opacity: 0, scale: 0.985, duration: D, clearProps: 'transform' })
      .from($$('.hero-panel > *'), { opacity: 0, y: 14, stagger: 0.06 }, 0.1);
    if (!mobile) {
      /* the proof card and pins arrive after the promise: first the claim, then the evidence */
      tl.from('.hero-proof', { opacity: 0, y: -10 }, 0.35)
        .from('.pin-dot', { scale: 0, duration: 0.25, ease: 'back.out(2.2)', stagger: 0.12 }, 0.45)
        .from('.pin-label', { opacity: 0, x: -8, duration: 0.2, stagger: 0.12 }, 0.55)
        .from('.hero-search', { opacity: 0, y: 20 }, 0.3);
    } else {
      tl.from(['.hero-chip', '.hero-photo .hero-eyebrow'], { opacity: 0, y: 8, stagger: 0.08 }, 0.2)
        .from(['.hero-search', '.hero-mobile-stats'], { opacity: 0, y: 14, stagger: 0.08 }, 0.3);
    }

    reveal('.section-head');
    reveal('#featured .car-card', { stagger: 0.07 });
    reveal('.bento .tile', { stagger: 0.06 });
    reveal('.check-list li', { y: 8, stagger: 0.04 });
    reveal('.steps li', { stagger: 0.08 });
    reveal('.showroom');
  }

  function browse() {
    if (!$('#results')) return;
    gsap.from(['.page-title', '.page-top > .lead', '.filters', '.results-bar'], { opacity: 0, y: 12, duration: D, ease: EASE, stagger: 0.05, clearProps: 'transform,opacity' });
    reveal('#results .car-card', { stagger: 0.05 });
    /* a filter change answers with the new results rising in, fast, so it never feels like waiting */
    document.addEventListener('gh:results', () => {
      const cards = $$('#results .car-card');
      gsap.fromTo(cards, { opacity: 0, y: 10 }, guarded(cards, { opacity: 1, y: 0, duration: 0.22, ease: EASE, stagger: 0.03, clearProps: 'transform,opacity', overwrite: true }));
    });
  }

  function car() {
    if (!$('.detail-top')) return;
    const tl = gsap.timeline({ defaults: { ease: EASE, duration: D } });
    tl.from('.detail-photo img', { scale: 1.04, duration: D })
      .from('.detail-photo', { opacity: 0, duration: 0.2 }, 0)
      .from($$('.detail-buy > *'), { opacity: 0, y: 12, stagger: 0.05 }, 0.08)
      .from('.fact', { opacity: 0, y: 10, stagger: 0.05 }, 0.15)
      .from('.inspect-summary .icon', { scale: 0.4, duration: 0.25, ease: 'back.out(2)' }, 0.35);
    guardTimeline(tl, '.detail-buy > *, .detail-photo img');
    tickChecks($('.check-rows'));
    reveal('.panel', { stagger: 0.08 });
    $$('.panel').forEach(p => reveal($$('.kv', p), { y: 6, stagger: 0.03 }));
    reveal('#similar .car-card', { stagger: 0.07 });
    const bar = $('.sticky-reserve');
    if (bar) gsap.from(bar, { yPercent: 100, duration: D, ease: EASE, delay: 0.4, clearProps: 'transform' });
  }

  function verify() {
    if (!$('.verify-hero')) return;
    gsap.from([...$$('.verify-hero .h1, .verify-hero .lead'), ...$$('.person')], { opacity: 0, y: 14, duration: D, ease: EASE, stagger: 0.07, clearProps: 'transform,opacity' });
    reveal('.checks-table tbody tr', { stagger: 0.06 });
    reveal('.check-name b', { y: 0, stagger: 0.06 });
    reveal('.promise-block');
    reveal('.refund-rules .panel', { stagger: 0.07 });
  }

  /* flow pages: one calm arrival per screen; the success moments get a little more */
  function flow() {
    const root = $('#flow-root');
    if (!root) return;
    const first = root.firstElementChild;
    if (!first) return;
    gsap.from(first.children, { opacity: 0, y: 12, duration: 0.25, ease: EASE, stagger: 0.05, clearProps: 'transform,opacity' });
    const success = $('.success-icon:not(.failed-icon)');
    if (success) {
      gsap.from(success, { scale: 0.5, duration: D, ease: 'back.out(2.2)', delay: 0.1, clearProps: 'transform' });
      /* the chassis and engine numbers were hidden until now: they arrive last, on purpose */
      gsap.from($$('.numbers .kv dd'), { opacity: 0, x: 10, duration: 0.25, ease: EASE, stagger: 0.12, delay: 0.3, clearProps: 'transform,opacity' });
    }
    const failed = $('.failed-icon');
    if (failed) gsap.fromTo(failed, { x: -4 }, { x: 0, duration: 0.3, ease: 'elastic.out(4, 0.3)', delay: 0.1, clearProps: 'transform' });
    const slip = $('.slip');
    if (slip) gsap.from(slip, { opacity: 0, y: 24, duration: D, ease: EASE, delay: 0.1, clearProps: 'transform,opacity' });
  }

  function bookings() {
    if (!$('#bookings-root')) return;
    gsap.from($$('#bookings-root > *'), { opacity: 0, y: 12, duration: 0.25, ease: EASE, stagger: 0.06, clearProps: 'transform,opacity' });
  }

  /* header gets a hairline shadow once the page scrolls under it */
  function header() {
    const h = $('.site-header');
    if (!h) return;
    ScrollTrigger.create({ start: 8, onToggle: s => h.classList.toggle('is-scrolled', s.isActive) });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      header(); home(); browse(); car(); verify(); flow(); bookings();
    });
  });
})();
