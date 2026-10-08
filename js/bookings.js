/* My bookings + Refund confirm dialog (Figma 47:1264, 47:1378). */
const VISIT_SLOTS = ['11 am to 1 pm', '1 to 3 pm', '3 to 5 pm', '5 to 7 pm', '7 to 9 pm', '9 to 11 pm'];

function activeCard(b) {
  const car = findCar(b.carId);
  const until = new Date(b.refundUntil);
  const left = daysLeft(until);
  const visit = b.visit ? `${fmtDay(new Date(b.visit.day))}, ${VISIT_SLOTS[b.visit.slot]}` : 'Not picked yet';
  return `<article class="booking-card">
    <img src="${car.photo}" alt="${carName(car)}">
    <div class="booking-body">
      <div class="booking-head">
        <div>
          <span class="badge badge-reserved">${icon('clock', 14)}Reserved for you · refund available ${left} more day${left === 1 ? '' : 's'}</span>
          <h2 class="h3">${carName(car)}</h2>
        </div>
        <span class="booking-id">${b.id}</span>
      </div>
      <div class="booking-grid">
        <div><span class="label">Visit</span><strong>${visit}</strong></div>
        <div><span class="label">Advance paid</span><strong>${taka(advance(car))}</strong></div>
        <div><span class="label">Pay at showroom</span><strong>${taka(car.price - advance(car))}</strong></div>
        <div><span class="label">${car.condition === 'Brand new' ? 'VIN' : 'Chassis number'}</span><strong>${car.chassis}</strong></div>
        <div><span class="label">Engine number</span><strong>${car.engineNo}</strong></div>
        <div><span class="label">Refund until</span><strong>${fmtDay(until)}, 11:59 pm</strong></div>
      </div>
      <div class="booking-actions">
        <a class="btn btn-secondary btn-m" href="reserve.html?id=${car.id}&step=slip&b=${b.id}">View booking slip ${icon('download', 18)}</a>
        <a class="btn btn-secondary btn-m" href="reserve.html?id=${car.id}&step=schedule&b=${b.id}">${b.visit ? 'Change visit time' : 'Pick a visit time'} ${icon('calendar', 18)}</a>
        <button class="btn btn-ghost btn-m" type="button" data-refund="${b.id}">Request a refund</button>
      </div>
    </div>
  </article>`;
}

function pastRow(b) {
  const car = findCar(b.carId);
  const when = new Date(b.refundedAt);
  return `<article class="booking-past">
    <img src="${car.photo}" alt="">
    <div>
      <strong>${carName(car)} · ${b.id}</strong>
      <p>Refund of ${taka(advance(car))} to ${esc(b.method)} requested ${fmtDate(when)}${b.note ? ` · ${esc(b.note)}` : ''}</p>
    </div>
    <span class="status-text">Refunded</span>
  </article>`;
}

function render() {
  const root = document.getElementById('bookings-root');
  const user = getUser();
  if (!user) {
    root.innerHTML = `<h1 class="h1 page-title">My bookings</h1>
      <p class="lead">Log in with your phone number to see the cars you reserved, your slips and refunds.</p>
      <a class="btn btn-primary btn-l" style="margin-top:var(--space-comfortable)" href="login.html">Log in ${icon('arrow-right', 18)}</a>`;
    return;
  }
  const list = getBookings();
  const active = list.filter(b => b.status === 'active');
  const past = list.filter(b => b.status !== 'active');
  const done = qs('done');
  const flash = done === 'visit' ? 'Visit time saved. The new time is on your booking slip.'
    : done === 'refund' ? `Refund requested. The money is on its way back and should arrive by ${fmtDate(addDays(new Date(), 3))}. The car is free for other buyers again.` : '';

  root.innerHTML = `<div class="slip-head">
      <div><h1 class="h1 page-title">My bookings</h1><p class="flow-sub">${esc(user.name)} · ${esc(user.phone)}</p></div>
      <button class="btn btn-ghost btn-m" type="button" id="logout">Log out</button>
    </div>
    ${flash ? `<div class="flash" role="status">${icon('check-circle', 20)}<p>${flash}</p></div>` : ''}
    ${active.length ? active.map(activeCard).join('') : `<div class="booking-past" style="margin-top:var(--space-roomy)"><div><strong>No car reserved right now</strong><p>Every car has its own inspection report. 5% holds it for 7 days, refundable.</p></div><a class="btn btn-primary btn-m" href="browse.html">Browse cars ${icon('arrow-right', 18)}</a></div>`}
    ${past.length ? `<h2 class="h4" style="margin-top:var(--space-spacious)">Past bookings</h2>${past.map(pastRow).join('')}` : ''}`;

  root.querySelectorAll('[data-refund]').forEach(btn => btn.addEventListener('click', () => openRefund(btn.dataset.refund, btn)));
  root.querySelector('#logout').addEventListener('click', () => { store('gh-user', null); location.href = 'index.html'; });
}

function openRefund(id, opener) {
  const b = getBooking(id);
  const car = findCar(b.carId);
  const dlg = document.getElementById('refund-dialog');
  dlg.innerHTML = `<form method="dialog" class="dialog-body">
    <h2 class="h3" id="refund-title">Cancel and get ${taka(advance(car))} back?</h2>
    <p class="lead">The ${car.make} ${car.model.split(' ')[0]} stops being reserved right away and other buyers can reserve it.</p>
    <dl class="dialog-summary">
      <div class="kv"><dt>Refund amount</dt><dd>${taka(advance(car))} (the full 5%)</dd></div>
      <div class="kv"><dt>Back to</dt><dd>${esc(b.method === 'Bank transfer' ? 'The bank account you paid from' : b.method)}</dd></div>
      <div class="kv"><dt>Arrives by</dt><dd>${fmtDate(addDays(new Date(), 3))} (within 3 days)</dd></div>
      <div class="kv"><dt>Reason</dt><dd>Not needed. You do not have to tell us why.</dd></div>
    </dl>
    <div class="dialog-actions">
      <button class="btn btn-secondary btn-l" value="keep" autofocus>Keep my reservation</button>
      <button class="btn btn-primary btn-l" value="refund">Cancel and refund</button>
    </div>
  </form>`;
  dlg.onclose = () => {
    if (dlg.returnValue === 'refund') {
      updateBooking(id, { status: 'refunded', refundedAt: new Date().toISOString() });
      location.replace('bookings.html?done=refund');
    } else opener.focus();
  };
  dlg.returnValue = '';
  dlg.showModal();
}

document.addEventListener('DOMContentLoaded', render);
