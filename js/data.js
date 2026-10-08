/* GaariHaat sample stock. Source of truth: ../data-cars.md. Prices in taka. Order = "newest first" on Browse. */

const INSPECTORS = {
  rafiq: { name: 'Md. Rafiqul Islam', role: 'Senior Inspector', initials: 'RI' },
  nusrat: { name: 'Nusrat Jahan', role: 'Documents Officer', initials: 'NJ' }
};

const CARS = [
  {
    id: 'toyota-axio-2019', make: 'Toyota', model: 'Axio Hybrid G', year: 2019,
    body: 'Sedan', condition: 'Reconditioned', status: 'available',
    price: 2485000, km: 38240, colour: 'Attitude Black',
    engine: '1500cc petrol hybrid', engineShort: '1500cc hybrid', gearbox: 'CVT automatic', drive: 'Front-wheel drive', seats: 5, fuel: 'Hybrid',
    imported: 2026,
    auction: { grade: '4.5', interior: 'B', house: 'USS Tokyo', lot: '41872', date: '9 Jun 2026', km: 38110, damage: 'Rear bumper: U1 (small scratch)' },
    extras: 'Smart key, reverse camera, cruise control',
    physicalNote: 'Engine, hybrid battery (92% health), gearbox, AC, brakes, suspension and test drive passed. Paint-depth meter found one repainted panel: rear bumper.',
    partsNote: 'Rear bumper repainted for a small scratch shown on the auction sheet. Nothing replaced.',
    noteShort: 'rear bumper repainted',
    inspected: '28 Sep 2026', papersChecked: '27 Sep 2026',
    summary: 'One-panel repaint, clean auction sheet, hybrid battery tested at 92% health.',
    chassis: 'NKE165-7218446', engineNo: '1NZ-X419283',
    photo: 'assets/cars/01-toyota-axio.jpg'
  },
  {
    id: 'byd-sealion-5-2026', make: 'BYD', model: 'Sealion 5 DM-i', year: 2026,
    body: 'SUV', condition: 'Brand new', status: 'available', launchPrice: true,
    price: 4790000, km: 0, colour: 'Snow White',
    engine: '1500cc petrol + electric motor (DM-i)', engineShort: 'Plug-in hybrid 1500cc', gearbox: 'E-CVT automatic', drive: 'Front-wheel drive', seats: 5, fuel: 'Plug-in hybrid',
    range: 'Up to 1,000 km combined (BYD figure)', rangeShort: '1,000 km range', charging: 'Home AC charging and DC fast charging',
    warranty: '6 years or 1,50,000 km', warrantyShort: '6 yr / 1.5 lakh km', battery: '8 years or 1,60,000 km', batteryShort: '8 yr / 1.6 lakh km', motor: '8 years or 1,50,000 km',
    freeServices: '3 (1,000 / 5,000 / 10,000 km)', built: 'CBU, imported from China', importer: 'BYD Bangladesh',
    delivery: 'In stock, ready 7 days after you pay the rest', deliveryShort: 'In stock · 7 days', inStock: true,
    colours: 'Snow White, Harbour Grey, Cosmos Black',
    inspected: '1 Oct 2026',
    summary: 'Family SUV with an 8-year battery warranty and a 1,000 km combined range.',
    chassis: 'LGXCH6CD2T0093516', engineNo: 'BYD472QC-2614087',
    photo: 'assets/cars/09-byd-sealion-5.jpg'
  },
  {
    id: 'toyota-aqua-2018', make: 'Toyota', model: 'Aqua G', year: 2018,
    body: 'Hatchback', condition: 'Reconditioned', status: 'available',
    price: 1745000, km: 52870, colour: 'Blue Metallic',
    engine: '1500cc petrol hybrid', engineShort: '1500cc hybrid', gearbox: 'CVT automatic', drive: 'Front-wheel drive', seats: 5, fuel: 'Hybrid',
    imported: 2026,
    auction: { grade: '4.5', interior: 'A', house: 'JU Gifu', lot: '10388', date: '18 Jun 2026', km: 52690, damage: 'None marked' },
    extras: 'Push start, LED headlights, climate control',
    physicalNote: null, partsNote: null, noteShort: null,
    inspected: '2 Oct 2026', papersChecked: '1 Oct 2026',
    summary: 'Cheapest way into a recon hybrid; grade A interior, no repairs.',
    chassis: 'NHP10-6731905', engineNo: '1NZ-X504716',
    photo: 'assets/cars/03-toyota-aqua.jpg'
  },
  {
    id: 'honda-vezel-2018', make: 'Honda', model: 'Vezel Hybrid Z', year: 2018,
    body: 'SUV', condition: 'Reconditioned', status: 'available',
    price: 3195000, km: 41030, colour: 'Alabaster Silver',
    engine: '1500cc petrol hybrid', engineShort: '1500cc hybrid', gearbox: '7-speed dual-clutch automatic', drive: 'Front-wheel drive', seats: 5, fuel: 'Hybrid',
    imported: 2026,
    auction: { grade: '4', interior: 'B', house: 'USS Nagoya', lot: '63154', date: '14 Jul 2026', km: 40870, damage: 'Front left fender: A1 (small dent)' },
    extras: 'Honda Sensing, LED headlights, half-leather seats',
    physicalNote: 'Engine, hybrid battery, gearbox, AC, brakes, suspension and test drive passed. Paint-depth meter found one repainted panel: front left fender.',
    partsNote: 'Front left fender: small dent repaired and repainted in Japan, shown on the auction sheet. Nothing replaced.',
    noteShort: 'front left fender repaired and repainted',
    inspected: '30 Sep 2026', papersChecked: '29 Sep 2026',
    summary: 'Top Z trim with Honda Sensing; one honest repair, shown in the photos.',
    chassis: 'RU3-1307722', engineNo: 'LEB-5418830',
    photo: 'assets/cars/05-honda-vezel.jpg'
  },
  {
    id: 'mg-zs-2026', make: 'MG', model: 'ZS 1.5', year: 2026,
    body: 'SUV', condition: 'Brand new', status: 'available', launchPrice: true,
    price: 2650000, km: 0, colour: 'Arctic White',
    engine: '1500cc petrol', engineShort: '1.5 petrol', gearbox: 'CVT automatic', drive: 'Front-wheel drive', seats: 5, fuel: 'Petrol',
    warranty: '3 years or 1,00,000 km', warrantyShort: '3 yr / 1 lakh km',
    freeServices: '3 (1,000 / 5,000 / 10,000 km)', built: 'CBU, fully imported', importer: 'MG Bangladesh',
    delivery: 'In stock, ready 7 days after you pay the rest', deliveryShort: 'In stock · 7 days', inStock: true,
    colours: 'Arctic White, Dynamic Red, Black Pearl',
    inspected: '2 Oct 2026',
    summary: 'The cheapest brand new SUV in stock, priced like a recon Vezel.',
    chassis: 'LSJA24U63TG047159', engineNo: '15S4C-3318620',
    photo: 'assets/cars/11-mg-zs.jpg'
  },
  {
    id: 'toyota-hiace-2016', make: 'Toyota', model: 'Hiace Commuter', year: 2016, seatsLabel: '12 seats',
    body: 'Microbus', condition: 'Used', status: 'available',
    price: 2940000, km: 96320, colour: 'White',
    engine: '3000cc diesel', engineShort: '3000cc diesel', gearbox: '5-speed manual', drive: 'Rear-wheel drive', seats: 12, fuel: 'Diesel',
    registered: 2017, regNo: 'Dhaka Metro-CHA', owners: 1, ownerNote: 'a tour operator',
    taxToken: 'Valid to Jun 2027', fitness: 'Valid to Mar 2027',
    extras: 'Roof AC ducts, high roof, 12 fabric seats',
    physicalNote: 'Engine, gearbox, AC, brakes, suspension and test drive passed. All four tyres are new.',
    partsNote: 'Clutch plate and pressure plate, all four tyres and the AC compressor replaced by the previous owner, with receipts.',
    noteShort: 'clutch, tyres and AC compressor replaced',
    inspected: '26 Sep 2026', papersChecked: '25 Sep 2026',
    summary: 'One-owner tour microbus, service records match the odometer.',
    chassis: 'KDH223-8031146', engineNo: '1KD-2847751',
    photo: 'assets/cars/07-toyota-hiace.jpg'
  },
  {
    id: 'byd-seal-5-2026', make: 'BYD', model: 'Seal 5 DM-i', year: 2026,
    body: 'Sedan', condition: 'Brand new', status: 'available', launchPrice: true,
    price: 3890000, km: 0, colour: 'Arctic Blue',
    engine: '1500cc petrol + electric motor (DM-i)', engineShort: 'Plug-in hybrid 1500cc', gearbox: 'E-CVT automatic', drive: 'Front-wheel drive', seats: 5, fuel: 'Plug-in hybrid',
    charging: 'Home AC charging and DC fast charging',
    warranty: '6 years or 1,50,000 km', warrantyShort: '6 yr / 1.5 lakh km', battery: '8 years or 1,60,000 km', batteryShort: '8 yr / 1.6 lakh km',
    freeServices: '3 (1,000 / 5,000 / 10,000 km)', built: 'CBU, imported from China', importer: 'BYD Bangladesh',
    delivery: 'In stock, ready 7 days after you pay the rest', deliveryShort: 'In stock · 7 days', inStock: true,
    colours: 'Arctic Blue, Snow White, Cosmos Black',
    inspected: '1 Oct 2026',
    summary: 'Plug-in hybrid sedan; charge at home for the city, petrol for the highway.',
    chassis: 'LGXCE4CB5T0118274', engineNo: 'BYD472QC-2610453',
    photo: 'assets/cars/08-byd-seal-5.jpg'
  },
  {
    id: 'honda-accord-2026', make: 'Honda', model: 'Accord 1.5 Turbo', year: 2026,
    body: 'Sedan', condition: 'Brand new', status: 'available',
    price: 4195000, km: 0, colour: 'Lunar Silver',
    engine: '1500cc turbo petrol', engineShort: '1.5 turbo petrol', gearbox: 'CVT automatic', drive: 'Front-wheel drive', seats: 5, fuel: 'Petrol',
    warranty: '3 years or 1,00,000 km', warrantyShort: '3 yr / 1 lakh km',
    freeServices: '3 (1,000 / 5,000 / 10,000 km)', built: 'CBU, fully imported', importer: 'the Honda importer',
    delivery: '4 to 6 weeks, ordered from the importer in your colour', deliveryShort: '4 to 6 weeks', inStock: false,
    colours: 'Lunar Silver, Platinum White Pearl, Crystal Black Pearl',
    inspected: '3 Oct 2026',
    summary: 'The executive sedan; ordered to your colour, delivered in about a month.',
    chassis: '1HGCY1F30TA024718', engineNo: 'L15CA-1207735',
    photo: 'assets/cars/10-honda-accord.jpg'
  },
  {
    id: 'toyota-premio-2018', make: 'Toyota', model: 'Premio F EX', year: 2018,
    body: 'Sedan', condition: 'Reconditioned', status: 'reserved', daysLeft: 4, reservedUntil: '11 Oct',
    price: 3675000, km: 45610, colour: 'Super White',
    engine: '1500cc petrol', engineShort: '1500cc petrol', gearbox: 'CVT automatic', drive: 'Front-wheel drive', seats: 5, fuel: 'Petrol',
    imported: 2026,
    auction: { grade: '4', interior: 'B', house: 'TAA Kinki', lot: '22609', date: '2 Jul 2026', km: 45480, damage: 'Windscreen: chip marked' },
    extras: 'Full Japan service book, LED headlights, reverse camera',
    physicalNote: 'Engine, gearbox, AC, brakes, suspension and test drive passed.',
    partsNote: 'Front brake pads replaced; windscreen replaced after a stone chip shown on the auction sheet.',
    noteShort: 'windscreen and brake pads replaced',
    inspected: '24 Sep 2026', papersChecked: '23 Sep 2026',
    summary: 'Family sedan with full Japan service book; two wear parts replaced before listing.',
    chassis: 'NZT260-3194027', engineNo: '1NZ-X377518',
    photo: 'assets/cars/02-toyota-premio.jpg'
  },
  {
    id: 'toyota-noah-2017', make: 'Toyota', model: 'Noah Si', year: 2017, seatsLabel: '8 seats',
    body: 'MPV', condition: 'Reconditioned', status: 'reserved', daysLeft: 2, reservedUntil: '9 Oct',
    price: 3340000, km: 49780, colour: 'White Pearl',
    engine: '2000cc petrol', engineShort: '2000cc petrol', gearbox: 'CVT automatic', drive: 'Front-wheel drive', seats: 8, fuel: 'Petrol',
    imported: 2026,
    auction: { grade: '4', interior: 'B', house: 'USS Yokohama', lot: '77031', date: '25 Jun 2026', km: 49610, damage: 'None marked' },
    extras: 'Twin power sliding doors, 8 seats, reverse camera',
    physicalNote: 'Engine, gearbox, AC, brakes, suspension and test drive passed. Both sliding doors now open and close smoothly.',
    partsNote: 'Both sliding-door rollers replaced at the showroom before listing.',
    noteShort: 'sliding-door rollers replaced',
    inspected: '22 Sep 2026', papersChecked: '21 Sep 2026',
    summary: 'Twin power sliding doors, 8 seats; the family-and-office favourite.',
    chassis: 'ZRR80-0349157', engineNo: '3ZR-B662094',
    photo: 'assets/cars/06-toyota-noah.jpg'
  },
  {
    id: 'honda-fit-2015', make: 'Honda', model: 'Fit 13G', year: 2015,
    body: 'Hatchback', condition: 'Used', status: 'sold', soldOn: '3 Oct 2026',
    price: 1290000, km: 78450, colour: 'Lunar Silver',
    engine: '1300cc petrol', engineShort: '1300cc petrol', gearbox: 'CVT automatic', drive: 'Front-wheel drive', seats: 5, fuel: 'Petrol',
    registered: 2016, regNo: 'Dhaka Metro-GA', owners: 2,
    taxToken: 'Valid to 2027', fitness: 'Valid to 2027',
    extras: 'Reverse camera, Bluetooth audio',
    physicalNote: 'Engine, gearbox, AC, brakes, suspension and test drive passed.',
    partsNote: 'CVT fluid and filter changed; rear shock absorbers and left mirror replaced.',
    noteShort: 'CVT service, rear shocks and left mirror',
    inspected: '15 Sep 2026', papersChecked: '14 Sep 2026',
    summary: 'City runabout, papers and tax token valid to 2027.',
    chassis: 'GK3-1129384', engineNo: 'L13B-2283615',
    photo: 'assets/cars/04-honda-fit.jpg'
  }
];

const BODY_LABELS = { Sedan: 'Sedan', Hatchback: 'Hatchback', SUV: 'SUV', MPV: 'Microbus / MPV' };

/* filters shared by Home search and Browse. body 'MPV' means Microbus or MPV */
const BUDGETS = {
  'under-20': { label: 'Under ৳20 lakh', min: 0, max: 2000000 },
  '20-35': { label: '৳20 to 35 lakh', min: 2000000, max: 3500000 },
  'over-35': { label: 'Over ৳35 lakh', min: 3500000, max: Infinity }
};
function matchCar(car, f = {}) {
  if (f.body) {
    if (f.body === 'MPV' ? !['MPV', 'Microbus'].includes(car.body) : car.body !== f.body) return false;
  }
  if (f.condition && car.condition !== f.condition) return false;
  if (f.budget && BUDGETS[f.budget]) {
    const b = BUDGETS[f.budget];
    if (car.price < b.min || car.price >= b.max) return false;
  }
  return true;
}
function findCar(id) { return CARS.find(c => c.id === id); }
function bodySlug(car) { return ['MPV', 'Microbus'].includes(car.body) ? 'MPV' : car.body; }

/* the checks shown on a car's page, built from its data */
function inspectionChecks(car) {
  const nf = n => Number(n).toLocaleString('en-IN') + ' km';
  if (car.condition === 'Brand new') {
    return [
      { title: 'Importer papers', detail: `Bill of entry, customs clearance and ${car.importer} invoice match this car.` },
      { title: 'VIN and engine number', detail: 'Read on the car, photographed, and matched to the importer papers.' },
      { title: 'Zero km and factory condition', detail: 'Odometer reads under 15 km (moving it into the showroom). No paint work, nothing replaced.' }
    ];
  }
  const recon = car.condition === 'Reconditioned';
  const a = car.auction;
  return [
    { title: 'Papers', detail: recon
      ? 'Import papers and customs clearance match the car. No loan or dispute on it.'
      : `BRTA registration (${car.regNo}), ownership papers, tax token and fitness match the car. No loan or dispute on it.` },
    { title: 'Chassis and engine numbers match the papers', detail: `Both numbers read on the car, photographed, and matched to the ${recon ? 'import' : 'registration'} papers.` },
    recon
      ? { title: 'Auction sheet', detail: `${a.house}, lot ${a.lot}, grade ${a.grade}, interior ${a.interior}. Matches the auction house record.` }
      : { title: 'Auction sheet', detail: `Not applicable: this car has been registered in Bangladesh since ${car.registered}, so its history is in the BRTA papers instead.`, na: true },
    { title: 'Mileage', detail: recon
      ? `${nf(car.km)} on the odometer. Auction sheet showed ${nf(a.km)} in ${a.date.split(' ').slice(1).join(' ')}; the difference is the drive from port to showroom.`
      : `${nf(car.km)} on the odometer, matching the service records${car.ownerNote ? ' kept by ' + car.ownerNote : ''}.` },
    { title: 'Physical inspection', detail: car.physicalNote || 'Engine, gearbox, AC, brakes, suspension and test drive passed. No repaint found on any panel.', note: !!(car.physicalNote && /repaint/i.test(car.physicalNote)) },
    { title: 'Parts changed or repaired', detail: car.partsNote || 'Nothing changed or repaired.', note: !!car.partsNote }
  ];
}
/* one repair can show in two checks (paint found + part repaired), so count issues, not rows */
function noteCount(car) { return car.noteShort ? 1 : 0; }
