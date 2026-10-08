/* Shared UI: icons, money formatting, header, footer, car card. Used by every page. */

const ICON_PATHS = {
  'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'check-circle': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'arrow-left': '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'map-pin': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  'clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  'lock': '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  'menu': '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'calendar': '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  'alert': '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  'credit-card': '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',
  'bank': '<path d="M3 21h18"/><path d="M5 21V10"/><path d="M19 21V10"/><path d="M9 21V10"/><path d="M15 21V10"/><path d="m2 10 10-6 10 6"/>',
  'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  'refund': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  'user': '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>'
};

function icon(name, size = 20, cls = '') {
  return `<svg class="icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ''}</svg>`;
}

/* ৳24,85,000 (Bangladeshi grouping) and ৳24.85 lakh */
function taka(n) { return '৳' + Number(n).toLocaleString('en-IN'); }
function lakh(n) { return '৳' + parseFloat((n / 100000).toFixed(2)) + ' lakh'; }
function advance(car) { return Math.round(car.price * 0.05); }
function carName(car) { return `${car.make} ${car.model} ${car.year}`; }
function km(n) { return Number(n).toLocaleString('en-IN') + ' km'; }

/* ---------- badges ---------- */
function conditionBadge(car) {
  const cls = car.condition === 'Brand new' ? 'badge badge-new' : 'badge badge-condition';
  return `<span class="${cls}">${car.condition}</span>`;
}
function statusBadge(car) {
  if (typeof myActiveBooking === 'function' && myActiveBooking(car.id)) return `<span class="badge badge-reserved">${icon('clock', 14)}Reserved for you</span>`;
  if (car.status === 'reserved') return `<span class="badge badge-reserved">${icon('clock', 14)}Reserved · ${car.daysLeft} days left</span>`;
  if (car.status === 'sold') return `<span class="badge badge-sold">Sold</span>`;
  return `<span class="badge badge-verified">${icon('shield-check', 14)}Verified</span>`;
}

/* ---------- car card ---------- */
function cardFacts(car) {
  if (car.condition === 'Brand new') {
    return car.inStock ? `${car.engineShort.replace(' 1500cc', '')} · ${car.rangeShort || car.warrantyShort.split(' ')[0] + '-year warranty'} · In stock`
                       : `${car.engineShort} · Delivery in ${car.deliveryShort}`;
  }
  if (car.condition === 'Used') return `${km(car.km)} · Registered ${car.registered} · ${car.owners} owner${car.owners > 1 ? 's' : ''}`;
  return `${km(car.km)} · Model ${car.year} · Unregistered`;
}
function cardFoot(car) {
  const mine = myActiveBooking(car.id);
  if (mine) return `Reserved by you until ${fmtDay(new Date(mine.refundUntil))}`;
  if (car.status === 'reserved') return `Reserved by another buyer until ${car.reservedUntil}`;
  if (car.status === 'sold') return `Sold on ${car.soldOn}`;
  return `Reserve with 5%: ${taka(advance(car))}, refundable for 7 days`;
}
function carCard(car) {
  const seats = car.seatsLabel ? ` · ${car.seatsLabel}` : '';
  const status = myActiveBooking(car.id) ? 'reserved' : car.status;
  return `
  <a class="car-card is-${status}" href="car.html?id=${car.id}">
    <div class="car-card-photo"><img src="${car.photo}" alt="${carName(car)}, ${car.colour}" loading="lazy" width="640" height="427"></div>
    <div class="car-card-body">
      <div class="badge-row">${conditionBadge(car)}${statusBadge(car)}</div>
      <h3 class="car-card-name">${carName(car)}${seats}</h3>
      <p class="car-card-facts">${cardFacts(car)}</p>
      <div class="car-card-price">
        <strong>${lakh(car.price)}</strong>
        <span>${cardFoot(car)}</span>
      </div>
    </div>
  </a>`;
}

/* ---------- account and bookings (demo: kept in this browser only) ---------- */
function store(key, value) {
  try {
    if (value === undefined) return JSON.parse(localStorage.getItem(key));
    if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(value));
  } catch (e) { return null; }
}
function getUser() { return store('gh-user'); }
function getBookings() { return store('gh-bookings') || []; }
function saveBookings(list) { store('gh-bookings', list); }
function myActiveBooking(carId) { return getBookings().find(b => b.carId === carId && b.status === 'active'); }
function getBooking(id) { return getBookings().find(b => b.id === id); }
function updateBooking(id, patch) { saveBookings(getBookings().map(b => b.id === id ? { ...b, ...patch } : b)); }

/* ---------- dates ---------- */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function fmtDay(d) { return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`; }
function fmtDate(d) { return `${fmtDay(d)} ${d.getFullYear()}`; }
function fmtTime(d) { let h = d.getHours(), m = String(d.getMinutes()).padStart(2, '0'); const ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return `${h}:${m} ${ap}`; }
/* whole calendar days between today and the last refund day */
function daysLeft(until) {
  const day = d => { const x = new Date(d); return new Date(x.getFullYear(), x.getMonth(), x.getDate()); };
  return Math.max(0, Math.round((day(until) - day(new Date())) / 86400000));
}
function qs(name) { return new URLSearchParams(location.search).get(name); }
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

/* ---------- header ---------- */
function isLoggedIn() { return !!getUser(); }

function renderHeader(active = '') {
  const el = document.getElementById('site-header');
  if (!el) return;
  const link = (href, label, key) => `<a href="${href}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`;
  const account = isLoggedIn()
    ? `<a class="btn btn-secondary btn-m" href="bookings.html">${icon('user', 18)}My bookings</a>`
    : `<a class="btn btn-secondary btn-m" href="login.html">Log in</a>`;
  el.innerHTML = `
  <div class="topnav">
    <a class="logo" href="index.html" aria-label="GaariHaat home"><span class="logo-mark">G</span>GaariHaat</a>
    <nav class="topnav-links" aria-label="Main">
      ${link('browse.html', 'Browse cars', 'browse')}
      ${link('how-we-verify.html', 'How we verify', 'verify')}
      ${link('how-we-verify.html#refund', 'Refund policy', 'refund')}
    </nav>
    <div class="topnav-right">
      <span class="topnav-showroom">${icon('map-pin', 16)}Tejgaon showroom · open 11 am to 12 midnight</span>
      ${account}
    </div>
    <button class="menu-toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">${icon('menu', 24)}</button>
  </div>
  <div class="mobile-menu" id="mobile-menu" hidden>
    ${link('browse.html', 'Browse cars', 'browse')}
    ${link('how-we-verify.html', 'How we verify', 'verify')}
    ${link('how-we-verify.html#refund', 'Refund policy', 'refund')}
    ${isLoggedIn() ? link('bookings.html', 'My bookings', 'bookings') : link('login.html', 'Log in', 'login')}
    <p class="mobile-menu-note">${icon('map-pin', 16)}Tejgaon showroom · open 11 am to 12 midnight</p>
  </div>`;
  const btn = el.querySelector('.menu-toggle');
  const menu = el.querySelector('#mobile-menu');
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    btn.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    btn.innerHTML = icon(open ? 'menu' : 'x', 24);
    menu.hidden = open;
  });
}

/* ---------- footer ---------- */
function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
  <div class="footer-inner">
    <div class="footer-brand">
      <a class="logo logo-inverse" href="index.html"><span class="logo-mark">G</span>GaariHaat</a>
      <p>Every car inspected by GaariHaat. 5% holds it, refundable for 7 days.</p>
    </div>
    <div class="footer-cols">
      <div>
        <h2 class="footer-head">Showroom</h2>
        <p>Tejgaon Industrial Area, Dhaka</p>
        <p>Open every day, 11 am to 12 midnight</p>
        <p>Call 01700-000000 (demo number)</p>
      </div>
      <div>
        <h2 class="footer-head">Buy with confidence</h2>
        <a href="how-we-verify.html">How we verify</a>
        <a href="how-we-verify.html#refund">Refund policy</a>
        <a href="bookings.html">My bookings</a>
      </div>
      <div>
        <h2 class="footer-head">About this site</h2>
        <a href="credits.html">Photo credits</a>
        <p>Demo project, cars and prices are samples</p>
      </div>
    </div>
  </div>`;
}

/* <span data-icon="check" data-size="16"></span> in HTML becomes an inline SVG */
function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => {
    el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon, Number(el.dataset.size) || 20));
    el.removeAttribute('data-icon');
  });
}

/* focus mode header for Log in and Reserve: no nav, one way out */
function renderFocusHeader() {
  const el = document.getElementById('focus-header');
  if (!el) return;
  const id = qs('id');
  const exit = id && findCar(id) ? `car.html?id=${id}` : 'index.html';
  el.innerHTML = `<div class="focus-header-inner">
    <a class="logo" href="index.html" aria-label="GaariHaat home"><span class="logo-mark">G</span>GaariHaat</a>
    <span class="focus-note">${icon('lock', 16)}${el.dataset.note || ''}</span>
    <a class="focus-exit" href="${exit}">Exit ${icon('x', 18)}</a>
  </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader(document.body.dataset.page || '');
  renderFocusHeader();
  renderFooter();
  hydrateIcons();
});
