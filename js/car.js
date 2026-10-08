/* Car detail: one template for all 11 cars. Variants come from the data: Reconditioned, Used, Brand new, Reserved, Sold, and Reserved by you. */

function reserveHref(car) {
  return getUser() ? `reserve.html?id=${car.id}` : `login.html?id=${car.id}`;
}

function quickFacts(car) {
  let tiles;
  if (car.condition === 'Brand new') {
    tiles = [['Kilometres', '0 (new)'], ['Warranty', car.warrantyShort],
      car.batteryShort ? ['Battery warranty', car.batteryShort] : ['Free services', '3 included'],
      ['Delivery', car.deliveryShort]];
  } else if (car.condition === 'Used') {
    tiles = [['Kilometres', km(car.km).replace(' km', '')], ['Registered', `${car.registered}, ${car.regNo.replace('Dhaka Metro-', 'Dhaka ')}`],
      ['Owners before', car.owners], ['Gearbox', car.gearbox.replace(' automatic', '').replace('5-speed ', '')]];
  } else {
    tiles = [['Kilometres', km(car.km).replace(' km', '')], ['Auction grade', `${car.auction.grade} · interior ${car.auction.interior}`],
      ['Engine', car.engineShort], ['Gearbox', /manual/i.test(car.gearbox) ? 'Manual' : 'Automatic']];
  }
  return tiles.map(([k, v]) => `<div class="fact"><span>${k}</span><strong>${v}</strong></div>`).join('');
}

function headline(car) {
  const seats = car.seatsLabel ? ` · ${car.seatsLabel}` : '';
  if (car.condition === 'Brand new') return `Brand new · 0 km · ${car.engineShort} · ${car.seats} seats · ${car.inStock ? 'In stock' : 'Order, ' + car.deliveryShort}`;
  if (car.condition === 'Used') return `${km(car.km)} · Registered ${car.registered} · ${car.owners} owner${car.owners > 1 ? 's' : ''} before · ${car.engine}, ${/^[A-Z]{2}/.test(car.gearbox) ? car.gearbox : car.gearbox.toLowerCase()}${seats}`;
  return `${km(car.km)} · Model ${car.year} · Unregistered · ${car.engineShort}, ${/manual/i.test(car.gearbox) ? 'manual' : 'automatic'}${seats}`;
}

function priceNote(car) {
  if (car.condition === 'Brand new') return `${taka(car.price)}${car.launchPrice ? ' launch price' : ''} · BRTA registration included`;
  if (car.condition === 'Used') return `${taka(car.price)} · registered; name transfer done at purchase`;
  return `${taka(car.price)} · BRTA registration not included`;
}

function reserveBox(car) {
  const mine = myActiveBooking(car.id);
  const call = `<a class="link-arrow call-link" href="tel:01700000000">Questions? Call the showroom ${icon('phone', 18)}</a>`;
  if (mine) {
    const until = new Date(mine.refundUntil);
    return `<div class="reserve-box">
      <p class="reserve-state reserve-state-mine">${icon('check-circle', 22)}<span><strong>You reserved this car until ${fmtDay(until)}.</strong> Refundable until then, ${daysLeft(until)} days left.</span></p>
      <a class="btn btn-primary btn-l btn-block" href="reserve.html?id=${car.id}&step=slip&b=${mine.id}">View your booking slip ${icon('arrow-right', 18)}</a>
      <a class="btn btn-ghost btn-block" href="bookings.html">Go to My bookings</a>
      ${call}
    </div>`;
  }
  if (car.status === 'reserved') {
    return `<div class="reserve-box">
      <p class="reserve-state">${icon('clock', 22)}<span><strong>Reserved by another buyer until ${car.reservedUntil}.</strong> If they do not buy it, the car comes back on the list that day with a Reserve button.</span></p>
      <a class="btn btn-secondary btn-l btn-block" href="#similar">See similar cars that are free ${icon('arrow-right', 18)}</a>
      ${call}
    </div>`;
  }
  if (car.status === 'sold') {
    return `<div class="reserve-box">
      <p class="reserve-state reserve-state-sold">${icon('info', 22)}<span><strong>Sold on ${car.soldOn}.</strong> We keep sold cars up for a while so you can see what this kind of car sells for.</span></p>
      <a class="btn btn-secondary btn-l btn-block" href="browse.html?body=${bodySlug(car)}">Browse ${BODY_LABELS[bodySlug(car)].toLowerCase()}s in stock ${icon('arrow-right', 18)}</a>
      ${call}
    </div>`;
  }
  const isNew = car.condition === 'Brand new';
  return `<div class="reserve-box">
    <a class="btn btn-primary btn-l btn-block" href="${reserveHref(car)}">Reserve with 5% · ${taka(advance(car))} ${icon('arrow-right', 18)}</a>
    <ul class="promise-list">
      <li>${icon('shield-check', 18)}Refundable for 7 days, for any reason. ${taka(advance(car))} goes back to the same card or bank account within 3 days.</li>
      <li>${icon('clock', 18)}${isNew ? (car.inStock ? 'Held for you for 7 days. Ready for delivery 7 days after you pay the rest.' : 'Ordered for you in your colour; delivery in 4 to 6 weeks. Refundable for the first 7 days.') : 'The car is held for you for 7 days. Other buyers see it as Reserved.'}</li>
      <li>${icon('lock', 18)}${isNew ? 'VIN and engine number' : 'Chassis and engine numbers'} appear on your booking slip after you reserve.</li>
    </ul>
    ${call}
  </div>`;
}

function inspectionSummary(car) {
  const who = car.condition === 'Brand new' ? INSPECTORS.nusrat : INSPECTORS.rafiq;
  const checks = inspectionChecks(car);
  const notes = noteCount(car);
  let line;
  if (car.condition === 'Brand new') line = 'Importer papers, VIN and zero km confirmed · factory condition';
  else if (car.condition === 'Used') line = `All checks passed (auction sheet not applicable to a car registered here)${notes ? ` · ${notes} note${notes > 1 ? 's' : ''}: ${car.noteShort}` : ''}`;
  else line = `${checks.length} of ${checks.length} checks passed${notes ? ` · ${notes} note${notes > 1 ? 's' : ''}: ${car.noteShort}` : ' · nothing to note'}`;
  return `<a class="inspect-summary" href="#inspection">
    ${icon('shield-check', 24)}
    <span><strong>${car.condition === 'Brand new' ? 'Checked' : 'Inspected'} ${car.inspected} by ${who.name}, ${who.role}</strong><span>${line}</span></span>
  </a>`;
}

function checkRows(car) {
  return inspectionChecks(car).map((c, i) => {
    const state = c.na ? 'na' : c.note ? 'note' : 'pass';
    const label = c.na ? 'Not applicable' : c.note ? 'Passed · note' : 'Passed';
    const ico = c.na ? 'info' : c.note ? 'alert' : 'check';
    return `<li class="check-row is-${state}">
      <span class="check-icon">${icon(ico, 18)}</span>
      <div><h3>${i + 1}. ${c.title}</h3><p>${c.detail}</p></div>
      <span class="check-result">${label}</span>
    </li>`;
  }).join('');
}

function rows(list) {
  return list.filter(([, v]) => v !== undefined && v !== null && v !== '').map(([k, v]) => `<div class="kv"><dt>${k}</dt><dd>${v}</dd></div>`).join('');
}

function leftPanel(car) {
  if (car.condition === 'Brand new') {
    return `<section class="panel" aria-labelledby="warranty-title">
      <h2 class="h3" id="warranty-title">Warranty and what is included</h2>
      <p class="panel-intro">From ${car.importer}. GaariHaat registers the car in your name before delivery.</p>
      <dl>${rows([['Vehicle warranty', car.warranty], ['Battery warranty', car.battery], ['Motor warranty', car.motor],
        ['Free services', car.freeServices], ['Built', car.built], ['Registration', 'Included in the price'], ['Colours', car.colours], ['Delivery', car.delivery]])}</dl>
    </section>`;
  }
  if (car.condition === 'Used') {
    return `<section class="panel" aria-labelledby="papers-title">
      <h2 class="h3" id="papers-title">Registration papers</h2>
      <p class="panel-intro">A used car was registered in Bangladesh, so there is no Japanese auction sheet. Its history is in the BRTA papers.</p>
      <dl>${rows([['Registered', car.registered], ['Registration', car.regNo], ['Owners before you', `${car.owners}${car.ownerNote ? ' (' + car.ownerNote + ')' : ''}`],
        ['Tax token', car.taxToken], ['Fitness certificate', car.fitness], ['Name transfer', 'Done by GaariHaat at purchase']])}</dl>
      <p class="panel-check">${icon('check', 16)}Papers checked with BRTA records by Nusrat Jahan, ${car.papersChecked}</p>
    </section>`;
  }
  const a = car.auction;
  return `<section class="panel" aria-labelledby="auction-title">
    <h2 class="h3" id="auction-title">Auction sheet</h2>
    <p class="panel-intro">The report from the Japanese auction before this car was imported. Grade ${a.grade} means ${Number(a.grade) >= 4.5 ? 'very good condition with very few marks' : 'good condition with minor marks'}; ${a.interior} is the interior grade.</p>
    <dl>${rows([['Auction house', a.house], ['Lot number', a.lot], ['Auction date', a.date], ['Overall grade', a.grade], ['Interior grade', a.interior],
      ['Mileage at auction', km(a.km)], ['Marked on the damage map', a.damage]])}</dl>
    <p class="panel-check">${icon('check', 16)}Checked against the auction house record by Nusrat Jahan, ${car.papersChecked}</p>
    <p class="panel-note">The original sheet is kept at the Tejgaon showroom; ask to see it on your visit.</p>
  </section>`;
}

function specsPanel(car) {
  const isNew = car.condition === 'Brand new';
  const list = [['Engine', car.engine], ['Gearbox', car.gearbox], ['Drive', car.drive], ['Seats', car.seats], ['Colour', car.colour], ['Model year', car.year]];
  if (isNew) list.push(['Range', car.range], ['Charging', car.charging], ['Price', car.launchPrice ? 'Launch price for the first 500 buyers' : 'Importer list price']);
  else if (car.condition === 'Reconditioned') list.push(['Imported', `${car.imported}, from Japan`], ['Registration', 'Not yet registered. You register it at purchase; cost not included.'], ['Trim extras', car.extras]);
  else list.push(['Extras', car.extras]);
  return `<section class="panel" aria-labelledby="specs-title">
    <h2 class="h3" id="specs-title">Specifications</h2>
    <dl>${rows(list)}</dl>
  </section>`;
}

function similarCars(car) {
  const others = CARS.filter(c => c.id !== car.id && c.status !== 'sold');
  const score = c => (bodySlug(c) === bodySlug(car) ? 2 : 0) + (c.condition === car.condition ? 1 : 0) + (c.status === 'available' ? 1 : 0);
  return others.sort((a, b) => score(b) - score(a)).slice(0, 4);
}

function stickyBar(car) {
  if (car.status !== 'available' || myActiveBooking(car.id)) return '';
  return `<div class="sticky-reserve" role="region" aria-label="Reserve this car">
    <div><strong>${taka(advance(car))} now</strong><span>Refundable for 7 days</span></div>
    <a class="btn btn-primary" href="${reserveHref(car)}">Reserve with 5%</a>
  </div>`;
}

function renderCar(car) {
  const name = carName(car);
  document.title = `${name} · ${lakh(car.price)} · GaariHaat`;
  const isNew = car.condition === 'Brand new';
  const mine = myActiveBooking(car.id);
  const statusCls = mine ? 'reserved' : car.status;
  const checksTitle = isNew ? 'What we checked on a new car' : 'Inspection report';
  const who = isNew ? INSPECTORS.nusrat : INSPECTORS.rafiq;
  const checksIntro = isNew
    ? `A new car has no history to inspect, so we check that it is exactly what the importer says it is. Checked ${car.inspected} by ${who.name}, ${who.role}.`
    : `Checked at the Tejgaon showroom on ${car.inspected}. Papers by Nusrat Jahan, Documents Officer; car by Md. Rafiqul Islam, Senior Inspector.`;
  const seats = car.seatsLabel ? ` · ${car.seatsLabel}` : '';

  document.getElementById('car-page').innerHTML = `
  <section class="detail-top">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a>${icon('chevron-right', 14)}<a href="browse.html?body=${bodySlug(car)}">${BODY_LABELS[bodySlug(car)]}</a>${icon('chevron-right', 14)}<span aria-current="page">${name}</span>
      </nav>
      <div class="detail-grid">
        <div class="detail-media">
          <div class="detail-photo is-${statusCls}"><img src="${car.photo}" alt="${name}, ${car.colour}" width="1280" height="853"></div>
          <div class="facts">${quickFacts(car)}</div>
        </div>
        <div class="detail-buy">
          <div class="badge-row">${conditionBadge(car)}${statusBadge(car)}</div>
          <h1 class="detail-name">${name}${seats}</h1>
          <p class="detail-headline">${headline(car)}</p>
          <p class="detail-price">${lakh(car.price)}</p>
          <p class="detail-price-note">${priceNote(car)}</p>
          ${reserveBox(car)}
          ${inspectionSummary(car)}
        </div>
      </div>
    </div>
  </section>

  <section class="section section-white" id="inspection" aria-labelledby="inspection-title">
    <div class="container">
      <div class="section-head">
        <div>
          <h2 class="h2" id="inspection-title">${checksTitle}</h2>
          <p class="section-sub">${checksIntro}</p>
        </div>
        <a class="link-arrow" href="how-we-verify.html">How we do each check ${icon('arrow-right', 18)}</a>
      </div>
      <ol class="check-rows">${checkRows(car)}</ol>
    </div>
  </section>

  <section class="section">
    <div class="container panels">
      ${leftPanel(car)}
      ${specsPanel(car)}
    </div>
  </section>

  <section class="section" id="similar" style="padding-top:0" aria-labelledby="similar-title">
    <div class="container">
      <h2 class="h2" id="similar-title" style="margin-bottom:var(--space-roomy)">Other cars in stock</h2>
      <div class="card-grid">${similarCars(car).map(carCard).join('')}</div>
    </div>
  </section>
  ${stickyBar(car)}`;
  if (stickyBar(car)) document.body.classList.add('has-sticky');
}

document.addEventListener('DOMContentLoaded', () => {
  const car = findCar(qs('id'));
  if (!car) {
    document.getElementById('car-page').innerHTML = `<div class="container page-top empty">
      <h1 class="h2">We could not find that car</h1>
      <p class="lead">The link may be old. Every car we have is on the Browse page.</p>
      <a class="btn btn-primary btn-l" href="browse.html">Browse all 11 cars ${icon('arrow-right', 18)}</a></div>`;
    return;
  }
  renderCar(car);
});
