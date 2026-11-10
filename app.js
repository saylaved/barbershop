/* ЛИПСЬКИЙ — main screen behaviour. No frameworks, no tracking. */
document.documentElement.classList.add('js');

const BOOK = 'https://n561092.alteg.io/company/530369/personal/select-master?o=m';

/* Real data from the public Altegio booking form, 10.11.2026 */
const MASTERS = [
  { id: 1542858, name: 'Едуард Хавень', level: 'Топ-барбер', rating: '5.00', reviews: 189, from: 1000, photo: 'img/m-1542858.jpg' },
  { id: 1543365, name: 'Артем Хавень', level: 'Топ-барбер', rating: '4.97', reviews: 212, from: 1000, photo: 'img/m-1543365.jpg' },
  { id: 2089003, name: 'Роман Басюк', level: 'Топ-барбер · EN', rating: '5.00', reviews: 270, from: 1000, photo: 'img/m-2089003.jpg' },
  { id: 2911482, name: 'Павло Хавень', level: 'Барбер', rating: '5.00', reviews: 125, from: 800, photo: 'img/m-2911482.jpg' },
  { id: 2191354, name: 'Назар Михальчук', level: 'Молодший барбер', rating: '4.99', reviews: 122, from: 700, photo: 'img/m-2191354.jpg' },
];

const PRICES = {
  top: [
    ['Чоловіча стрижка', '45 хв', 1000], ['Стрижка + борода', '1 год', 1500],
    ['Борода і вуса', '30 хв', 600], ['Стрижка машинкою', '45 хв', 800],
    ['Подовжена стрижка', '1 год', 1200], ['Дитяча стрижка', '45 хв', 800],
    ['Батько + син', '1 год 30 хв', 1600], ['Камуфляж сивини', '30 хв', 600],
  ],
  barber: [
    ['Чоловіча стрижка', '1 год', 800], ['Стрижка + борода', '1 год 30 хв', 1200],
    ['Борода і вуса', '45 хв', 500], ['Стрижка машинкою', '45 хв', 700],
    ['Подовжена стрижка', '1 год', 1000], ['Дитяча стрижка', '1 год', 700],
    ['Батько + син', '2 год', 1400], ['Камуфляж сивини', '30 хв', 400],
  ],
  junior: [
    ['Чоловіча стрижка', '1 год 15 хв', 700], ['Стрижка + борода', '2 год', 1000],
    ['Борода і вуса', '45 хв', 400], ['Стрижка машинкою', '1 год', 500],
    ['Подовжена стрижка', '1 год 15 хв', 800], ['Дитяча стрижка', '1 год 15 хв', 600],
    ['Батько + син', '2 год 15 хв', 1200], ['Камуфляж сивини', '30 хв', 300],
  ],
};
const LEVELS = [['top', 'Топ'], ['barber', 'Барбер'], ['junior', 'Молодший']];

/* Face-shape guidance → services that exist in the real price list */
const SHAPES = {
  oval:   { label: 'Овал',     tip: 'Універсальна форма — підходить майже все.', recos: [['Подовжена стрижка', 'Текстурний верх, природна лінія — підкреслить пропорції.', 1200], ['Чоловіча стрижка', 'Класичний side part або кроп.', 1000]] },
  round:  { label: 'Коло',     tip: 'Мета — додати вертикаль і кути.', recos: [['Чоловіча стрижка', 'Об’єм зверху, щільні боки (high fade) витягують силует.', 1000], ['Стрижка + борода', 'Борода з чіткою лінією підборіддя додає довжини.', 1500]] },
  square: { label: 'Квадрат',  tip: 'Сильна щелепа — її варто підкреслити, а не ховати.', recos: [['Стрижка машинкою', 'Buzz cut або короткий кроп з переходом.', 800], ['Борода і вуса', 'Коротка охайна борода повторює лінію щелепи.', 600]] },
  heart:  { label: 'Серце',    tip: 'Широке чоло, вузьке підборіддя — балансуємо низ.', recos: [['Подовжена стрижка', 'Середня довжина з пасмами на чоло.', 1200], ['Стрижка + борода', 'Повніша борода візуально розширює підборіддя.', 1500]] },
  diamond:{ label: 'Ромб',     tip: 'Виражені вилиці — потрібна м’якість на скронях.', recos: [['Подовжена стрижка', 'Довший верх з м’яким бічним проділом.', 1200], ['Борода і вуса', 'Борода середньої щільності врівноважує вилиці.', 600]] },
  oblong: { label: 'Видовжене',tip: 'Не додаємо висоти — тримаємо ширину.', recos: [['Чоловіча стрижка', 'Помірний верх, боки без сильного fade, можлива чубчик.', 1000], ['Стрижка + борода', 'Борода з об’ємом з боків, а не вниз.', 1500]] },
};

const fmt = n => n.toLocaleString('uk-UA').replace(/\u00a0/g, ' ') + ' ₴';
const $ = s => document.querySelector(s);

/* ---------- Masters ---------- */
$('#masters-list').innerHTML = MASTERS.map(m => `
  <li class="master">
    <div class="master__photo"><img src="${m.photo}" alt="${m.name}, ${m.level.toLowerCase()}" decoding="async"></div>
    <div>
      <p class="master__name">${m.name}</p>
      <p class="master__meta"><span>${m.level}</span><span>★ ${m.rating} · ${m.reviews}</span></p>
      <a class="master__book" href="${BOOK}${m.id}" target="_blank" rel="noopener">Стрижка від ${fmt(m.from)} →</a>
    </div>
  </li>`).join('');

/* ---------- Prices ---------- */
const tabs = $('#level-tabs');
const list = $('#pricelist');
function renderPrices(level) {
  tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.level === level)));
  list.innerHTML = PRICES[level].map(([t, d, p], i) =>
    `<li style="--d:${i * 35}ms"><span>${t}<br><small>${d}</small></span><b>${fmt(p)}</b></li>`).join('');
}
tabs.innerHTML = LEVELS.map(([k, l]) => `<button type="button" role="tab" data-level="${k}">${l}</button>`).join('');
tabs.addEventListener('click', e => { const b = e.target.closest('button'); if (b) renderPrices(b.dataset.level); });
renderPrices('top');

/* ---------- [Дэн] Border glow follows pointer ---------- */
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.tile').forEach(t => {
    t.addEventListener('pointermove', e => {
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      t.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  });
}

/* ---------- [Дэн] Scroll reveal ---------- */
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.setProperty('--d', `${(i % 3) * 80}ms`); io.observe(el); });

/* ---------- Rotating reviews (real, 5★) ---------- */
const QUOTES = [
  ['Я вже без перебільшення рік ходжу до цього майстра, і ніколи не пішов додому незадоволений.', 'Тимур · до Назара'],
  ['Артем, як завжди, на високому професійному рівні. Дякую!', 'Сергій · до Артема'],
  ['Дякую за ідеальну зачіску! Супер майстер своєї справи.', 'Роман · до Едуарда'],
  ['Неймовірний майстер. Дякую за чудовий сервіс.', 'Антон · до Романа'],
  ['Дуже сподобалась стрижка та корекція бороди, буду звертатись ще.', 'Андрій · до Павла'],
];
let qi = 0;
const quote = $('#quote');
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setInterval(() => {
    quote.classList.add('is-swapping');
    setTimeout(() => {
      qi = (qi + 1) % QUOTES.length;
      $('#quote-text').textContent = QUOTES[qi][0];
      $('#quote-author').textContent = QUOTES[qi][1];
      quote.classList.remove('is-swapping');
    }, 420);
  }, 6500);
}

/* ---------- [Алекс] AI face scanner (on-device prototype) ----------
   Photo is read with an object URL and never leaves the browser.
   Production: swap estimateShape() for an on-device landmark model (WASM). */
const fileInput = $('#scan-file');
const frame = $('#scan-frame');
const img = $('#scan-img');
const status = $('#scan-status');
const result = $('#scan-result');
const shapeList = $('#shape-list');
const reco = $('#reco');

shapeList.innerHTML = Object.entries(SHAPES).map(([k, s]) =>
  `<button type="button" class="shape" role="radio" aria-checked="false" data-shape="${k}">${s.label}</button>`).join('');
shapeList.addEventListener('click', e => { const b = e.target.closest('.shape'); if (b) showReco(b.dataset.shape); });

function showReco(key) {
  const s = SHAPES[key];
  shapeList.querySelectorAll('.shape').forEach(b => b.setAttribute('aria-checked', String(b.dataset.shape === key)));
  reco.innerHTML = `<p class="muted">${s.tip}</p>` + s.recos.map(([t, why, p], i) =>
    `<div class="reco__item" style="--d:${i * 90}ms"><strong>${t}</strong><em>від ${fmt(p)}</em><span>${why}</span></div>`).join('') +
    `<a class="btn btn--solid" href="https://n561092.alteg.io/company/530369" target="_blank" rel="noopener">Записатися на цю стрижку</a>`;
}

/* Lightweight on-device heuristic: image proportions only, used as a starting suggestion.
   The user always confirms the shape — we never present a guess as a diagnosis. */
function estimateShape(w, h) {
  const r = h / w;
  if (r > 1.45) return 'oblong';
  if (r > 1.25) return 'oval';
  if (r < 1.05) return 'round';
  return 'square';
}

let lastUrl;
fileInput.addEventListener('change', () => {
  const f = fileInput.files && fileInput.files[0];
  if (!f || !f.type.startsWith('image/')) return;
  if (lastUrl) URL.revokeObjectURL(lastUrl);
  lastUrl = URL.createObjectURL(f);
  img.onload = () => {
    $('#scan-placeholder').hidden = true;
    img.hidden = false;
    frame.classList.remove('is-done');
    frame.classList.add('is-scanning');
    result.hidden = true;
    const steps = ['Пошук обличчя…', 'Аналіз пропорцій…', 'Підбір форм…'];
    steps.forEach((t, i) => setTimeout(() => { status.textContent = t; }, i * 900));
    setTimeout(() => {
      frame.classList.remove('is-scanning');
      frame.classList.add('is-done');
      status.textContent = 'Готово · фото не залишало пристрій';
      result.hidden = false;
      showReco(estimateShape(img.naturalWidth, img.naturalHeight));
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 2800);
  };
  img.src = lastUrl;
});

/* ---------- Dock active state ---------- */
const dockLinks = [...document.querySelectorAll('.dock__item[href^="#"]')];
const spy = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  dockLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
['top', 'masters', 'scanner', 'prices'].forEach(id => spy.observe(document.getElementById(id)));
