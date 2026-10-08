/* Log in with phone + OTP (Figma 45:1120, 45:1160, 45:1208). Demo: no SMS is sent; any 6 digits work, 000000 shows the error state. */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('flow-root');
  const car = findCar(qs('id'));
  const next = () => location.replace(car ? `reserve.html?id=${car.id}` : 'bookings.html');
  if (getUser()) return next();

  let phone = '', name = '', tries = 3, timer;
  const carBox = car ? `<div class="login-car"><img src="${car.photo}" alt=""><div><strong>Reserving: ${carName(car)}</strong><span>5% advance ${taka(advance(car))} · refundable for 7 days</span></div></div>` : '';
  const demo = `<p class="demo-note">${icon('info', 16)}<span><strong>Demo site:</strong> no SMS is sent. Any 6-digit code works; 000000 shows what a wrong code looks like.</span></p>`;
  const pretty = p => `${p.slice(0, 5)} ${p.slice(5)}`;

  function phoneStep(err = {}) {
    clearInterval(timer);
    root.innerHTML = `<div class="flow flow-narrow"><form class="login-card" novalidate>
      ${carBox}
      <h1>Log in to reserve</h1>
      <p class="flow-sub">We send a 6-digit code to your phone. No password, and browsing never needs a login.</p>
      <div class="field">
        <label for="name">Your name</label>
        <input id="name" name="name" autocomplete="name" value="${esc(name)}" placeholder="As on your NID"${err.name ? ' aria-invalid="true" aria-describedby="name-err"' : ''}>
        ${err.name ? `<p class="field-error" id="name-err">${icon('alert', 14)}${err.name}</p>` : ''}
      </div>
      <div class="field">
        <label for="phone">Mobile number</label>
        <div class="phone-input"><span>+88</span><input id="phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="13" value="${esc(phone)}" placeholder="01712 345678"${err.phone ? ' aria-invalid="true" aria-describedby="phone-err"' : ''}></div>
        ${err.phone ? `<p class="field-error" id="phone-err">${icon('alert', 14)}${err.phone}</p>` : '<p class="hint">Bangladeshi mobile, 11 digits starting with 01</p>'}
      </div>
      <button class="btn btn-primary btn-l btn-block" type="submit">Send the code ${icon('arrow-right', 18)}</button>
      ${demo}
    </form></div>`;
    const form = root.querySelector('form');
    const first = err.phone && !err.name ? form.phone : form.name;
    first.focus();
    first.setSelectionRange(first.value.length, first.value.length); /* caret at the end, so fixing a number adds digits in the right place */
    form.addEventListener('submit', e => {
      e.preventDefault();
      name = form.name.value.trim();
      phone = form.phone.value.replace(/\D/g, '');
      const errors = {};
      if (name.length < 2) errors.name = 'Write your name so the showroom knows who is coming.';
      if (!/^01[3-9]\d{8}$/.test(phone)) errors.phone = 'That does not look like a Bangladeshi mobile. It should be 11 digits and start with 01.';
      if (Object.keys(errors).length) return phoneStep(errors);
      otpStep();
    });
  }

  function otpStep(error = false) {
    root.innerHTML = `<div class="flow flow-narrow"><form class="login-card" novalidate>
      ${carBox}
      <h1>${error ? 'That code is not right' : 'Enter the 6-digit code'}</h1>
      <p class="flow-sub">Sent to ${pretty(phone)} <button type="button" class="link-btn" id="change">Change number</button></p>
      <fieldset style="border:0;margin:0;padding:0">
        <legend class="sr-only">6-digit code</legend>
        <div class="otp${error ? ' is-error' : ''}">${Array.from({ length: 6 }, (_, i) => `<input inputmode="numeric" maxlength="6" autocomplete="${i ? 'off' : 'one-time-code'}" aria-label="Digit ${i + 1}">`).join('')}</div>
      </fieldset>
      ${error
        ? `<p class="field-error" role="alert">${icon('alert', 14)}Check the SMS and try again. ${tries} ${tries === 1 ? 'try' : 'tries'} left.</p>
           <p class="note-box note-subtle" style="margin-top:var(--space-base)">${icon('phone', 16)}<span>Not getting the code? Call the showroom on 01700-000000 (demo number) and we will reserve the car for you on the phone.</span></p>`
        : `<p class="otp-meta" id="resend">Code sent. Resend in 0:45.</p>`}
      <button class="btn btn-primary btn-l btn-block" type="submit">Verify and continue ${icon('arrow-right', 18)}</button>
      ${demo}
    </form></div>`;
    const form = root.querySelector('form');
    const boxes = [...root.querySelectorAll('.otp input')];
    boxes[0].focus();
    boxes.forEach((b, i) => {
      b.addEventListener('input', () => {
        const digits = b.value.replace(/\D/g, '');
        if (digits.length > 1) {
          digits.split('').slice(0, 6 - i).forEach((d, j) => { boxes[i + j].value = d; });
          boxes[Math.min(i + digits.length, 5)].focus();
        } else {
          b.value = digits;
          if (digits && i < 5) boxes[i + 1].focus();
        }
        if (boxes.every(x => x.value)) form.requestSubmit();
      });
      b.addEventListener('keydown', e => { if (e.key === 'Backspace' && !b.value && i) boxes[i - 1].focus(); });
    });
    root.querySelector('#change').addEventListener('click', () => phoneStep());

    clearInterval(timer);
    let left = 45;
    const resend = root.querySelector('#resend');
    if (resend) timer = setInterval(() => {
      left--;
      if (left > 0) { resend.textContent = `Code sent. Resend in 0:${String(left).padStart(2, '0')}.`; return; }
      clearInterval(timer);
      resend.innerHTML = 'Did not get it? <button type="button" class="link-btn">Resend the code</button>';
      resend.querySelector('button').addEventListener('click', () => otpStep());
    }, 1000);

    form.addEventListener('submit', e => {
      e.preventDefault();
      const code = boxes.map(b => b.value).join('');
      if (code.length < 6) { boxes.find(b => !b.value).focus(); return; }
      if (code === '000000') { tries = Math.max(1, tries - 1); return otpStep(true); }
      clearInterval(timer);
      store('gh-user', { name, phone: pretty(phone) });
      seedHistory();
      next();
    });
  }

  phoneStep();
});

/* a past, refunded booking so My bookings shows both states (Figma 47:1264) */
function seedHistory() {
  const list = getBookings();
  if (list.some(b => b.id === 'GH-2609-0212')) return;
  list.push({ id: 'GH-2609-0212', carId: 'honda-fit-2015', status: 'refunded', method: 'Visa ending 4821', paidAt: '2026-09-22T19:10:00', refundedAt: '2026-09-24T11:00:00', note: 'you cancelled on day 2' });
  saveBookings(list);
}
