/* Reserve flow in focus mode. Steps by URL: review → pay → (failed) → confirmed → schedule → slip. Figma 16:696 to 18:929.
   Demo: no real payment. Any 16-digit card works; a number ending 0002 shows the declined screen. Bookings live in this browser only. */

const STEPS = ['Review', 'Pay', 'Schedule', 'Slip'];
const SLOTS = ['11 am to 1 pm', '1 to 3 pm', '3 to 5 pm', '5 to 7 pm', '7 to 9 pm', '9 to 11 pm'];

function stepper(current, center = false) {
  return `<ol class="stepper${center ? ' center' : ''}" aria-label="Progress">${STEPS.map((s, i) => {
    const state = i < current ? 'done' : i === current ? 'current' : '';
    return `<li class="${state}"${state === 'current' ? ' aria-current="step"' : ''}><span class="step-dot">${i < current ? icon('check', 14) : i + 1}</span><span class="step-label">${s}</span></li>`;
  }).join('')}</ol>`;
}
function go(params) { location.href = `reserve.html?${new URLSearchParams(params)}`; }
function shortName(car) { return car.model.split(' ')[0]; }
function refundLine(until) { return `${fmtDay(until)}, 11:59 pm`; }

function inspectedLine(car) {
  const who = car.condition === 'Brand new' ? INSPECTORS.nusrat : INSPECTORS.rafiq;
  const n = noteCount(car);
  const total = inspectionChecks(car).length;
  return `Inspected ${car.inspected} by ${who.name} · ${total} of ${total} passed${n ? ` · ${n} note${n > 1 ? 's' : ''}` : ''}`;
}
function carFacts(car) {
  return car.condition === 'Brand new' ? `Brand new · ${car.colour} · ${car.deliveryShort}` : `${km(car.km)} · ${car.colour} · ${car.condition === 'Used' ? 'Registered ' + car.registered : 'Unregistered'}`;
}

/* ---------- 1. review ---------- */
function reviewStep(root, car, user) {
  const until = addDays(new Date(), 7);
  root.innerHTML = `<div class="flow">
    ${stepper(0)}
    <h1 class="flow-title">Check before you pay</h1>
    <p class="flow-sub">Reserving as ${esc(user.name)} · ${esc(user.phone)}</p>
    <div class="flow-grid">
      <div class="flow-col">
        <section class="box car-line">
          <img src="${car.photo}" alt="${carName(car)}">
          <div>
            <div class="badge-row">${conditionBadge(car)}${statusBadge(car)}</div>
            <h2>${carName(car)}</h2>
            <p>${carFacts(car)}</p>
            <p class="meta">${inspectedLine(car)}</p>
          </div>
        </section>
        <section class="box">
          <h2 class="box-title">What happens when you pay 5%</h2>
          <ol class="num-list">
            <li>The ${shortName(car)} is held for you until ${fmtDay(until)}. Other buyers see it as Reserved.</li>
            <li>You see the ${car.condition === 'Brand new' ? 'VIN' : 'chassis'} and engine numbers and get your booking slip.</li>
            <li>You pick a time to see the car at the Tejgaon showroom and pay the rest there.</li>
            <li>Changed your mind? Cancel before ${until.getDate()} ${MONTHS[until.getMonth()]} and get ${taka(advance(car))} back to the same card or account within 3 days.</li>
          </ol>
        </section>
      </div>
      <aside class="box" aria-labelledby="amount-title">
        <h2 class="box-title" id="amount-title">Amount</h2>
        <div class="amount-row"><span>Car price</span><strong>${taka(car.price)}</strong></div>
        <div class="amount-row big"><span>Pay now: 5% advance</span><strong>${taka(advance(car))}</strong></div>
        <div class="amount-row"><span>Pay at the showroom</span><strong>${taka(car.price - advance(car))}</strong></div>
        <div class="divider"></div>
        <p class="note-box">${icon('shield-check', 18)}<span>Fully refundable until ${refundLine(until)}, for any reason. Money back to the same card or account within 3 days.</span></p>
        <form id="agree-form" novalidate>
          <label class="check-agree"><input type="checkbox" id="agree" required><span>I have read the <a href="how-we-verify.html#refund" target="_blank">refund policy</a> and the <a href="car.html?id=${car.id}#inspection" target="_blank">inspection report</a>.</span></label>
          <p class="field-error" id="agree-err" hidden>${icon('alert', 14)}Tick the box to confirm you have read both.</p>
          <div class="box-actions">
            <button class="btn btn-primary btn-l btn-block" type="submit">Continue to payment ${icon('arrow-right', 18)}</button>
            <a class="btn btn-ghost" href="car.html?id=${car.id}">Back to the car</a>
          </div>
        </form>
      </aside>
    </div>
  </div>`;
  root.querySelector('#agree-form').addEventListener('submit', e => {
    e.preventDefault();
    if (!root.querySelector('#agree').checked) { root.querySelector('#agree-err').hidden = false; root.querySelector('#agree').focus(); return; }
    go({ id: car.id, step: 'pay' });
  });
}

/* ---------- 2. pay ---------- */
function payStep(root, car, user, tab = 'card') {
  const until = addDays(new Date(), 7);
  const bankRef = `GH-${String(Date.now()).slice(-6)}`;
  root.innerHTML = `<div class="flow">
    ${stepper(1)}
    <h1 class="flow-title">Pay the 5% advance</h1>
    <p class="flow-sub">${taka(advance(car))} to hold the ${carName(car)} until ${fmtDay(until)}</p>
    <div class="flow-grid">
      <div class="flow-col">
        <p class="demo-note">${icon('info', 16)}<span><strong>Demo site: no real payment is taken.</strong> Type any 16 digits, for example 4242 4242 4242 4242. A card number ending in 0002 shows what a declined payment looks like. Never enter a real card here.</span></p>
        <div class="tabs" role="tablist" aria-label="Payment method">
          <button type="button" role="tab" id="tab-card" aria-controls="panel-card" aria-selected="${tab === 'card'}">Debit or credit card</button>
          <button type="button" role="tab" id="tab-bank" aria-controls="panel-bank" aria-selected="${tab === 'bank'}">Bank transfer</button>
        </div>
        <form class="box" id="panel-card" role="tabpanel" aria-labelledby="tab-card" novalidate${tab === 'card' ? '' : ' hidden'}>
          <div class="field"><label for="cname">Name on card</label><input id="cname" autocomplete="off" value="${esc(user.name.toUpperCase())}"></div>
          <div class="field"><label for="cnum">Card number</label><input id="cnum" inputmode="numeric" autocomplete="off" placeholder="1234 1234 1234 1234" maxlength="19" aria-describedby="cnum-err"><p class="field-error" id="cnum-err" hidden></p></div>
          <div class="field-row">
            <div class="field"><label for="cexp">Expiry</label><input id="cexp" inputmode="numeric" autocomplete="off" placeholder="MM / YY" maxlength="7" aria-describedby="cexp-err"><p class="field-error" id="cexp-err" hidden></p></div>
            <div class="field"><label for="ccvc">CVC</label><input id="ccvc" inputmode="numeric" autocomplete="off" placeholder="3 digits on the back" maxlength="3" aria-describedby="ccvc-err"><p class="field-error" id="ccvc-err" hidden></p></div>
          </div>
          <p class="lock-line">${icon('lock', 16)}Visa and Mastercard from any Bangladeshi bank. Your bank may ask for an OTP. GaariHaat never sees or stores your full card number.</p>
        </form>
        <form class="box" id="panel-bank" role="tabpanel" aria-labelledby="tab-bank" novalidate${tab === 'bank' ? '' : ' hidden'}>
          <h2 class="box-title">Send ${taka(advance(car))} from your bank app</h2>
          <dl class="bank-details">
            <div class="kv"><dt>Account name</dt><dd>GaariHaat Ltd</dd></div>
            <div class="kv"><dt>Bank and branch</dt><dd>Demo Bank, Tejgaon branch</dd></div>
            <div class="kv"><dt>Account number</dt><dd>0000 0000 0000 (demo)</dd></div>
            <div class="kv"><dt>Write this as the reference</dt><dd>${bankRef}</dd></div>
          </dl>
          <div class="field" style="margin-top:var(--space-comfortable)"><label for="btxn">Your bank's transaction ID</label><input id="btxn" autocomplete="off" placeholder="From your bank's SMS or app" aria-describedby="btxn-err"><p class="field-error" id="btxn-err" hidden></p></div>
          <p class="lock-line">${icon('clock', 16)}We match bank transfers within 2 hours, 11 am to 12 midnight. The car is held for you while we check.</p>
        </form>
      </div>
      <aside class="box">
        <div class="car-mini"><img src="${car.photo}" alt=""><div><strong>${carName(car)}</strong><span>${taka(car.price)}</span></div></div>
        <div class="divider" style="margin-top:var(--space-base)"></div>
        <div class="amount-row big"><span>Pay now: 5% advance</span><strong>${taka(advance(car))}</strong></div>
        <div class="amount-row"><span>Pay at the showroom</span><strong>${taka(car.price - advance(car))}</strong></div>
        <div class="box-actions">
          <button class="btn btn-primary btn-l btn-block" type="button" id="pay">${tab === 'card' ? `Pay ${taka(advance(car))} ${icon('lock', 18)}` : `I have sent ${taka(advance(car))} ${icon('arrow-right', 18)}`}</button>
          <a class="btn btn-ghost" href="reserve.html?id=${car.id}">Back to review</a>
        </div>
        <p class="muted-small">Refundable until ${refundLine(until)}. Back to this ${tab === 'card' ? 'card' : 'account'} within 3 days.</p>
      </aside>
    </div>
  </div>`;

  root.querySelectorAll('[role="tab"]').forEach(t => t.addEventListener('click', () => payStep(root, car, user, t.id === 'tab-bank' ? 'bank' : 'card')));
  const num = root.querySelector('#cnum'), exp = root.querySelector('#cexp'), cvc = root.querySelector('#ccvc');
  num.addEventListener('input', () => { num.value = num.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '); });
  exp.addEventListener('input', () => { const d = exp.value.replace(/\D/g, '').slice(0, 4); exp.value = d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d; });
  cvc.addEventListener('input', () => { cvc.value = cvc.value.replace(/\D/g, ''); });

  function setErr(input, msg) {
    const p = root.querySelector(`#${input.id}-err`);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    p.hidden = !msg; p.innerHTML = msg ? `${icon('alert', 14)}${msg}` : '';
    return !msg;
  }

  root.querySelector('#pay').addEventListener('click', () => {
    const btn = root.querySelector('#pay');
    if (tab === 'bank') {
      const t = root.querySelector('#btxn');
      if (!setErr(t, t.value.trim().length < 6 ? 'Type the transaction ID from your bank, at least 6 characters.' : '')) return t.focus();
      return process(btn, () => finish('Bank transfer', t.value.trim().toUpperCase()));
    }
    const digits = num.value.replace(/\D/g, '');
    const [mm, yy] = exp.value.split(' / ').map(Number);
    const now = new Date(); const expOk = mm >= 1 && mm <= 12 && yy && (2000 + yy > now.getFullYear() || (2000 + yy === now.getFullYear() && mm >= now.getMonth() + 1));
    const ok = [
      setErr(num, digits.length !== 16 ? 'Card number should be 16 digits.' : ''),
      setErr(exp, !expOk ? 'Check the expiry date, written as MM / YY.' : ''),
      setErr(cvc, cvc.value.length !== 3 ? 'The CVC is the 3 digits on the back.' : '')
    ];
    if (ok.includes(false)) return root.querySelector('[aria-invalid="true"]').focus();
    const brand = digits[0] === '5' ? 'Mastercard' : 'Visa';
    if (digits.endsWith('0002')) return process(btn, () => go({ id: car.id, step: 'failed', card: `${brand} ending ${digits.slice(-4)}` }));
    process(btn, () => finish(`${brand} ending ${digits.slice(-4)}`, `TXN ${String(Math.floor(10000000 + Math.random() * 89999999))}`));
  });

  function process(btn, then) {
    btn.setAttribute('aria-busy', 'true');
    btn.innerHTML = '<span class="spinner" aria-hidden="true"></span>Processing, do not close this page';
    setTimeout(then, 1600);
  }
  function finish(method, txn) {
    const paid = new Date();
    const until = addDays(paid, 7); until.setHours(23, 59, 0, 0);
    const yymm = `${String(paid.getFullYear()).slice(2)}${String(paid.getMonth() + 1).padStart(2, '0')}`;
    const id = `GH-${yymm}-${String(Math.floor(1000 + Math.random() * 8999))}`;
    const list = getBookings();
    list.unshift({ id, carId: car.id, status: 'active', method, txn, paidAt: paid.toISOString(), refundUntil: until.toISOString(), visit: null, name: user.name, phone: user.phone });
    saveBookings(list);
    location.replace(`reserve.html?${new URLSearchParams({ id: car.id, step: 'confirmed', b: id })}`);
  }
}

/* ---------- payment failed (Figma 46:1210) ---------- */
function failedStep(root, car) {
  const card = qs('card') || 'your card';
  root.innerHTML = `<div class="flow">
    ${stepper(1)}
    <div class="success-head">
      <span class="success-icon failed-icon">${icon('x', 28)}</span>
      <div>
        <h1 class="flow-title">Your bank declined the payment</h1>
        <p class="flow-sub">No money was taken from ${esc(card)}. The ${carName(car)} is not reserved yet, so another buyer could still reserve it.</p>
      </div>
    </div>
    <div class="flow-grid">
      <section class="box">
        <h2 class="box-title">The three usual reasons</h2>
        <ol class="num-list">
          <li>The card is not turned on for online payments. Your bank app usually has a switch for this.</li>
          <li>The daily limit is lower than ${taka(advance(car))}. Ask your bank to raise it for today, or pay by bank transfer.</li>
          <li>The OTP from your bank timed out. Try again and enter it within 3 minutes.</li>
        </ol>
        <p class="note-box note-error" style="margin-top:var(--space-comfortable)">${icon('alert', 18)}<span>If you see money leave your account anyway, do not pay again. Call us on 01700-000000 (demo number); a held amount is released by your bank within 3 days.</span></p>
      </section>
      <aside class="box">
        <div class="car-mini"><img src="${car.photo}" alt=""><div><strong>${carName(car)}</strong><span>5% advance ${taka(advance(car))}</span></div></div>
        <div class="box-actions" style="margin-top:var(--space-comfortable)">
          <a class="btn btn-primary btn-l btn-block" href="reserve.html?id=${car.id}&step=pay">Try the card again ${icon('arrow-right', 18)}</a>
          <a class="btn btn-secondary btn-l btn-block" href="reserve.html?id=${car.id}&step=pay&tab=bank">Pay by bank transfer instead</a>
          <a class="btn btn-ghost" href="tel:01700000000">${icon('phone', 18)}Call the showroom</a>
        </div>
      </aside>
    </div>
  </div>`;
}

/* ---------- 3a. confirmed ---------- */
function confirmedStep(root, car, b) {
  const paid = new Date(b.paidAt), until = new Date(b.refundUntil);
  const isNew = car.condition === 'Brand new';
  root.innerHTML = `<div class="flow">
    ${stepper(2)}
    <div class="success-head">
      <span class="success-icon">${icon('check', 30)}</span>
      <div>
        <h1 class="flow-title">The ${shortName(car)} is reserved for you until ${fmtDay(until)}</h1>
        <p class="flow-sub">${b.method === 'Bank transfer'
          ? `We have your bank transfer reference ${esc(b.txn)}. We match it within 2 hours and send an SMS to ${esc(b.phone)}; the car is held for you meanwhile.`
          : `We received ${taka(advance(car))} from your ${esc(b.method)} on ${fmtDate(paid)}, ${fmtTime(paid)}. A copy is on its way by SMS to ${esc(b.phone)}.`}</p>
      </div>
    </div>
    <div class="flow-grid">
      <section class="box numbers">
        <h2 class="box-title" style="display:flex;gap:8px;align-items:center">${icon('shield-check', 22)}Now visible to you: the numbers on the car</h2>
        <dl>
          <div class="kv"><dt>${isNew ? 'VIN' : 'Chassis number'}</dt><dd>${car.chassis}</dd></div>
          <div class="kv"><dt>Engine number</dt><dd>${car.engineNo}</dd></div>
        </dl>
        <p class="muted-small" style="font-size:var(--font-size-small)">Match both numbers on the car at the showroom before you pay the rest. They are also on your booking slip.</p>
      </section>
      <aside class="box">
        <dl>
          <div class="kv"><dt>Booking ID</dt><dd>${b.id}</dd></div>
          <div class="kv"><dt>Advance paid</dt><dd>${taka(advance(car))}</dd></div>
          <div class="kv"><dt>Pay at the showroom</dt><dd>${taka(car.price - advance(car))}</dd></div>
          <div class="kv"><dt>Refund available until</dt><dd>${refundLine(until)}</dd></div>
        </dl>
        <div class="box-actions">
          <a class="btn btn-primary btn-l btn-block" href="reserve.html?id=${car.id}&step=schedule&b=${b.id}">Pick a time to see the car ${icon('calendar', 18)}</a>
          <a class="btn btn-ghost" href="bookings.html">I will choose a time later</a>
        </div>
      </aside>
    </div>
  </div>`;
}

/* ---------- 3b. schedule ---------- */
function scheduleStep(root, car, b) {
  const until = new Date(b.refundUntil);
  const days = [];
  for (let d = addDays(new Date(), 1); d <= until; d = addDays(d, 1)) days.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  let pick = b.visit ? { day: b.visit.day, slot: b.visit.slot } : { day: null, slot: null };
  const fullSlot = (dayIdx, slot) => (dayIdx === 2 && slot === 4) || (dayIdx === 4 && slot === 3); // two busy evenings, so full slots are shown
  const changing = !!b.visit;

  function draw() {
    const dayIdx = days.findIndex(d => d.toISOString() === pick.day);
    const whenText = pick.day && pick.slot !== null ? `${fmtDay(new Date(pick.day))}, ${SLOTS[pick.slot]}` : 'Pick a day and a time';
    root.innerHTML = `<div class="flow">
      ${changing ? '' : stepper(2)}
      <h1 class="flow-title">${changing ? 'Change your visit' : 'When do you want to see the car?'}</h1>
      <p class="flow-sub">Tejgaon showroom, open every day 11 am to 12 midnight. Any day before your reservation ends on ${fmtDay(until)}.</p>
      <div class="flow-grid">
        <section class="box">
          <h2 class="label-strong" id="day-label">Day</h2>
          <div class="chip-btns" role="group" aria-labelledby="day-label">${days.map((d, i) => `<button type="button" class="chip-btn" data-day="${d.toISOString()}" aria-pressed="${pick.day === d.toISOString()}">${pick.day === d.toISOString() ? icon('check', 16) : ''}${fmtDay(d)}</button>`).join('')}</div>
          <h2 class="label-strong" id="time-label">Time</h2>
          <div class="chip-btns" role="group" aria-labelledby="time-label">${SLOTS.map((s, i) => {
            const full = dayIdx >= 0 && fullSlot(dayIdx, i);
            return `<button type="button" class="chip-btn" data-slot="${i}" aria-pressed="${pick.slot === i && !full}"${full ? ' disabled' : ''}>${pick.slot === i && !full ? icon('check', 16) : ''}${s}${full ? ' · full' : ''}</button>`;
          }).join('')}</div>
          <p class="muted-small" style="margin:0;font-size:var(--font-size-small)">Each slot is two hours so a staff member can walk you through the car and the papers. Full slots already have two visits booked.</p>
        </section>
        <aside class="box">
          <h2 class="box-title">Your visit</h2>
          <dl>
            <div class="kv"><dt>Car</dt><dd>${carName(car)}</dd></div>
            <div class="kv"><dt>When</dt><dd>${whenText}</dd></div>
            <div class="kv"><dt>Where</dt><dd>Tejgaon Industrial Area, Dhaka</dd></div>
          </dl>
          <div class="bring"><strong>Bring with you</strong><ul>
            <li>${icon('check', 16)}Your NID</li>
            <li>${icon('check', 16)}The booking slip (on your phone is fine)</li>
            <li>${icon('check', 16)}How you will pay the remaining ${taka(car.price - advance(car))}</li>
          </ul></div>
          <p class="field-error" id="pick-err" hidden>${icon('alert', 14)}Pick both a day and a time first.</p>
          <div class="box-actions">
            <button class="btn btn-primary btn-l btn-block" type="button" id="confirm">${changing ? 'Save the new time' : 'Confirm visit'} ${icon('check', 18)}</button>
            ${changing ? '<a class="btn btn-ghost" href="bookings.html">Keep the old time</a>' : ''}
          </div>
          <p class="muted-small">You can change the time from My bookings, up to 2 hours before.</p>
        </aside>
      </div>
    </div>`;
    root.querySelectorAll('[data-day]').forEach(el => el.addEventListener('click', () => {
      pick.day = el.dataset.day;
      if (pick.slot !== null && fullSlot(days.findIndex(d => d.toISOString() === pick.day), pick.slot)) pick.slot = null;
      draw(); root.querySelector(`[data-day="${pick.day}"]`).focus();
    }));
    root.querySelectorAll('[data-slot]').forEach(el => el.addEventListener('click', () => { pick.slot = Number(el.dataset.slot); draw(); root.querySelector(`[data-slot="${pick.slot}"]`).focus(); }));
    root.querySelector('#confirm').addEventListener('click', () => {
      if (!pick.day || pick.slot === null) { root.querySelector('#pick-err').hidden = false; return; }
      updateBooking(b.id, { visit: { day: pick.day, slot: pick.slot } });
      location.replace(changing ? 'bookings.html?done=visit' : `reserve.html?id=${car.id}&step=slip&b=${b.id}`);
    });
  }
  draw();
}

/* ---------- 4. slip ---------- */
function slipStep(root, car, b) {
  const paid = new Date(b.paidAt), until = new Date(b.refundUntil);
  const visit = b.visit ? `${fmtDate(new Date(b.visit.day))}, ${SLOTS[b.visit.slot]}` : 'Not picked yet';
  const isNew = car.condition === 'Brand new';
  const refunded = b.status === 'refunded';
  root.innerHTML = `<div class="flow flow-narrow">
    ${refunded ? '' : stepper(3, true)}
    <div class="slip-head">
      <div>
        <h1 class="flow-title">Your booking slip</h1>
        <p class="flow-sub">${b.visit ? `Visit confirmed for ${fmtDay(new Date(b.visit.day))}, ${SLOTS[b.visit.slot]}.` : 'Pick a visit time from My bookings when you are ready.'}</p>
      </div>
      <div class="slip-actions">
        <button class="btn btn-primary btn-l" type="button" id="print">Download slip (PDF) ${icon('download', 18)}</button>
        <a class="btn btn-secondary btn-l" href="bookings.html">Go to My bookings</a>
      </div>
    </div>
    <article class="slip" aria-label="Booking slip ${b.id}">
      <div class="slip-top">
        <div class="slip-brand"><span class="logo-mark">G</span><div><strong>GaariHaat booking slip</strong><span>Tejgaon Industrial Area, Dhaka · 01700-000000</span></div></div>
        <div class="slip-id"><span class="label">Booking ID</span><strong>${b.id}</strong></div>
      </div>
      <p class="slip-band${refunded ? ' is-refunded' : ''}">${icon(refunded ? 'refund' : 'shield-check', 18)}${refunded ? 'Cancelled and refunded. This slip is no longer valid.' : `Reserved · fully refundable until ${fmtDate(until)}, 11:59 pm`}</p>
      <div class="slip-grid">
        <div><span class="label">Buyer</span><strong>${esc(b.name)}<br>${esc(b.phone)}</strong></div>
        <div><span class="label">Car</span><strong>${carName(car)}<br>${car.colour} · ${car.condition}</strong></div>
        <div><span class="label">${isNew ? 'VIN' : 'Chassis number'}</span><strong class="mono">${car.chassis}</strong></div>
        <div><span class="label">Engine number</span><strong class="mono">${car.engineNo}</strong></div>
        <div><span class="label">Visit</span><strong>${visit}<br>Tejgaon showroom</strong></div>
        <div><span class="label">Bring</span><strong>Your NID and this slip</strong></div>
      </div>
      <div class="slip-money">
        <div class="amount-row"><span>Car price</span><strong>${taka(car.price)}</strong></div>
        <div class="amount-row"><span>Advance paid, ${esc(b.method)}, ${fmtDate(paid)}, ${fmtTime(paid)}</span><strong>${taka(advance(car))}</strong></div>
        <div class="amount-row"><span>Transaction reference</span><strong>${esc(b.txn)}</strong></div>
        <div class="amount-row big"><span>To pay at the showroom</span><strong>${taka(car.price - advance(car))}</strong></div>
      </div>
      <p class="slip-foot">${icon('info', 16)}<span>At the showroom, check that the ${isNew ? 'VIN' : 'chassis'} and engine numbers on the car match this slip before you pay the rest. If they do not, do not pay, and your advance is refunded in full.</span></p>
    </article>
  </div>`;
  root.querySelector('#print').addEventListener('click', () => window.print());
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('flow-root');
  const car = findCar(qs('id'));
  const step = qs('step') || 'review';
  const user = getUser();
  if (!car) { location.replace('browse.html'); return; }
  if (!user) { location.replace(`login.html?id=${car.id}`); return; }

  const b = qs('b') ? getBooking(qs('b')) : null;
  const titles = { review: 'Check before you pay', pay: 'Pay the 5% advance', failed: 'Payment declined', confirmed: 'Reserved', schedule: 'Pick a visit time', slip: 'Booking slip' };
  document.title = `${titles[step] || 'Reserve'} · ${carName(car)} · GaariHaat`;

  if (['confirmed', 'schedule', 'slip'].includes(step)) {
    if (!b || b.carId !== car.id) { location.replace('bookings.html'); return; }
    if (step === 'confirmed') return confirmedStep(root, car, b);
    if (step === 'schedule') return scheduleStep(root, car, b);
    return slipStep(root, car, b);
  }
  /* review, pay, failed only for a car someone can still reserve */
  const mine = myActiveBooking(car.id);
  if (mine) { location.replace(`reserve.html?id=${car.id}&step=slip&b=${mine.id}`); return; }
  if (car.status !== 'available') { location.replace(`car.html?id=${car.id}`); return; }
  if (step === 'pay') return payStep(root, car, user, qs('tab') === 'bank' ? 'bank' : 'card');
  if (step === 'failed') return failedStep(root, car);
  reviewStep(root, car, user);
});
