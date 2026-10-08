/* Home: featured cards and live count on the hero search button. */
document.addEventListener('DOMContentLoaded', () => {
  const featured = ['toyota-axio-2019', 'honda-vezel-2018', 'byd-sealion-5-2026', 'toyota-noah-2017'];
  document.getElementById('featured').innerHTML = featured.map(id => carCard(findCar(id))).join('');

  const form = document.querySelector('.hero-search');
  const count = document.getElementById('search-count');
  const update = () => {
    const f = Object.fromEntries(new FormData(form));
    const n = CARS.filter(c => matchCar(c, f)).length;
    count.textContent = n === 0 ? 'No cars match' : `Show ${n} car${n === 1 ? '' : 's'}`;
  };
  form.addEventListener('change', update);
  /* drop empty fields so the Browse URL stays clean */
  form.addEventListener('submit', () => form.querySelectorAll('select').forEach(s => { s.disabled = !s.value; }));
  window.addEventListener('pageshow', () => form.querySelectorAll('select').forEach(s => { s.disabled = false; }));
});
