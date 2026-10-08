/* Browse: chip filters kept in the URL, so a filtered list can be shared or reloaded. */
document.addEventListener('DOMContentLoaded', () => {
  const groups = {
    body: [['', 'All'], ['Sedan', 'Sedan'], ['Hatchback', 'Hatchback'], ['SUV', 'SUV'], ['MPV', 'Microbus / MPV']],
    condition: [['', 'All'], ['Brand new', 'Brand new'], ['Reconditioned', 'Reconditioned'], ['Used', 'Used']],
    budget: [['', 'Any'], ...Object.entries(BUDGETS).map(([k, v]) => [k, v.label])]
  };
  const params = new URLSearchParams(location.search);
  const form = document.getElementById('filters');

  Object.entries(groups).forEach(([name, opts]) => {
    const wrap = form.querySelector(`[data-name="${name}"]`);
    const current = params.get(name) || '';
    wrap.innerHTML = opts.map(([v, label]) => `
      <label class="chip"><input type="radio" name="${name}" value="${esc(v)}"${v === current ? ' checked' : ''}><span>${icon('check', 16)}${label}</span></label>`).join('');
    if (!wrap.querySelector('input:checked')) wrap.querySelector('input').checked = true;
  });

  const sort = document.getElementById('sort');
  sort.value = params.get('sort') || 'new';

  function render() {
    const f = Object.fromEntries(new FormData(form));
    let list = CARS.filter(c => matchCar(c, f));
    /* available first, then reserved, then sold: a sold car never tops the list */
    const rank = c => ({ available: 0, reserved: 1, sold: 2 }[c.status]);
    if (sort.value === 'low') list.sort((a, b) => a.price - b.price);
    if (sort.value === 'high') list.sort((a, b) => b.price - a.price);
    list.sort((a, b) => rank(a) - rank(b));

    const reserved = list.filter(c => c.status === 'reserved').length;
    const sold = list.filter(c => c.status === 'sold').length;
    const filtered = Object.values(f).some(Boolean);
    const extra = [reserved && `${reserved} reserved`, sold && `${sold} sold`].filter(Boolean).join(', ');
    document.getElementById('results-count').innerHTML = list.length
      ? `<strong>${filtered ? `${list.length} of 11 cars` : 'Showing all 11 cars'}</strong>${extra ? ` · ${extra}. They stay on the list so you can see what moves fast.` : ''}`
      : '<strong>0 of 11 cars</strong>';
    document.getElementById('results').innerHTML = list.map(carCard).join('');
    document.getElementById('empty').hidden = list.length > 0;
    document.getElementById('end-note').hidden = list.length === 0 || filtered;

    const q = new URLSearchParams(Object.entries(f).filter(([, v]) => v));
    if (sort.value !== 'new') q.set('sort', sort.value);
    history.replaceState(null, '', q.toString() ? `?${q}` : location.pathname);
    document.dispatchEvent(new Event('gh:results'));
  }

  form.addEventListener('change', render);
  sort.addEventListener('change', render);
  document.getElementById('clear').addEventListener('click', () => {
    form.querySelectorAll('.chips').forEach(w => { w.querySelector('input').checked = true; });
    render();
  });
  render();
});
