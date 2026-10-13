const CONFIG = {
  inicioNamoro: '2026-07-15T00:00:00-03:00',
  partida: '2026-09-26T00:00:00-03:00',
  chegada: '2026-11-22T15:30:00-03:00',
  origem: { nome: 'Cape Town', lat: -33.9249, lng: 18.4241 },
  destino: { nome: 'Mozi ❤️', lat: -21.7878, lng: -46.5613 },
};

const FOTOS = [
  'beijo', 'selfie-noite', 'pikachu', 'sol', 'juntinhos', 'espelho',
  'noite', 'bone', 'por-do-sol', 'careta', 'oculos', 'rua',
  'rosa', 'flamengo', 'passeio', 'espelho-2', 'primeira',
];

const $ = (sel, root = document) => root.querySelector(sel);
const pad = (n) => String(n).padStart(2, '0');
const fmt = (n) => n.toLocaleString('pt-BR');

const inicio = new Date(CONFIG.inicioNamoro);
const partida = new Date(CONFIG.partida);
const chegada = new Date(CONFIG.chegada);

/* ---------- Abertura ---------- */
$('#open-btn').addEventListener('click', (e) => {
  $('#envelope').classList.add('open');
  burstHearts(e.clientX, e.clientY, 14);
  setTimeout(() => {
    $('#intro').classList.add('hidden');
    document.body.classList.remove('locked');
    startFloatingHearts();
  }, 650);
});

/* ---------- Corações ---------- */
function spawnFloatingHeart() {
  const h = document.createElement('span');
  h.className = 'float-heart';
  h.textContent = Math.random() < 0.8 ? '❤' : '♡';
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = 12 + Math.random() * 22 + 'px';
  h.style.animationDuration = 7 + Math.random() * 6 + 's';
  h.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
  h.style.setProperty('--rot', (Math.random() * 80 - 40) + 'deg');
  $('#hearts-layer').appendChild(h);
  h.addEventListener('animationend', () => h.remove());
}

function startFloatingHearts() {
  for (let i = 0; i < 18; i++) setTimeout(spawnFloatingHeart, i * 180);
  setInterval(spawnFloatingHeart, 3500);
}

function burstHearts(x, y, count = 10) {
  for (let i = 0; i < count; i++) {
    const h = document.createElement('span');
    h.className = 'burst-heart';
    h.textContent = '❤';
    const angle = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 90;
    h.style.left = x + 'px';
    h.style.top = y + 'px';
    h.style.fontSize = 14 + Math.random() * 18 + 'px';
    h.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    h.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    document.body.appendChild(h);
    h.addEventListener('animationend', () => h.remove());
  }
}

/* ---------- Contadores ---------- */
function setUnits(root, values) {
  for (const [unit, value] of Object.entries(values)) {
    const el = root.querySelector(`[data-unit="${unit}"]`);
    if (el) el.textContent = unit === 'months' || unit === 'days' ? value : pad(value);
  }
}

function tickTogether() {
  const now = new Date();
  let months = (now.getFullYear() - inicio.getFullYear()) * 12 + (now.getMonth() - inicio.getMonth());
  const anchor = new Date(inicio);
  anchor.setMonth(inicio.getMonth() + months);
  if (anchor > now) {
    months--;
    anchor.setMonth(anchor.getMonth() - 1);
  }
  let s = Math.max(0, Math.floor((now - anchor) / 1000));
  const days = Math.floor(s / 86400); s %= 86400;
  const hours = Math.floor(s / 3600); s %= 3600;
  setUnits($('#together-counter'), { months: Math.max(0, months), days, hours, minutes: Math.floor(s / 60), seconds: s % 60 });
}

function tickCountdown() {
  const now = new Date();
  const box = $('#countdown');
  let s = Math.floor((chegada - now) / 1000);
  if (s <= 0) {
    $('.countdown-box .eyebrow').textContent = 'cheguei, Mozi!';
    setUnits(box, { days: 0, hours: 0, minutes: 0, seconds: 0 });
  } else {
    const days = Math.floor(s / 86400); s %= 86400;
    const hours = Math.floor(s / 3600); s %= 3600;
    setUnits(box, { days, hours, minutes: Math.floor(s / 60), seconds: s % 60 });
  }

  const fim = Math.min(now, chegada);
  $('#saudade-count').textContent = fmt(Math.max(0, Math.floor((fim - partida) / 1000)));
}

function tick() {
  tickTogether();
  tickCountdown();
}
tick();
setInterval(tick, 1000);

/* ---------- Galeria ---------- */
const gallery = $('#gallery');
for (const file of FOTOS) {
  const fig = document.createElement('figure');
  fig.className = 'reveal';
  fig.style.setProperty('--tilt', (Math.random() * 4 - 2).toFixed(1) + 'deg');
  fig.innerHTML = `<img src="img/${file}.jpg" alt="Nós dois" loading="lazy">`;
  fig.addEventListener('click', () => openLightbox(`img/${file}.jpg`));
  gallery.appendChild(fig);
}

const lightbox = $('#lightbox');
function openLightbox(src) {
  $('img', lightbox).src = src;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}
lightbox.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

/* ---------- Amão x Amontão ---------- */
let placar = 0;
let apertos = 0;

function bump(el, value) {
  el.textContent = fmt(value);
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
}

function amar(e, outro) {
  placar++;
  apertos++;
  bump(e.currentTarget.querySelector('.score'), placar);
  burstHearts(e.clientX, e.clientY, 6);
  setTimeout(() => {
    bump($(`${outro} .score`), placar);
    const r = $(outro).getBoundingClientRect();
    burstHearts(r.left + r.width / 2, r.top + r.height / 2, 6);
  }, 300);
  if (apertos >= 5) $('#battle-verdict').textContent = 'Tá sempre igual, que coisa né';
}

$('#btn-amao').addEventListener('click', (e) => amar(e, '#btn-amontao'));
$('#btn-amontao').addEventListener('click', (e) => amar(e, '#btn-amao'));

/* ---------- Mapa ---------- */
const toRad = (d) => (d * Math.PI) / 180;
const toDeg = (r) => (r * 180) / Math.PI;

function distanciaKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function greatCircle(a, b, steps = 120) {
  const φ1 = toRad(a.lat), λ1 = toRad(a.lng), φ2 = toRad(b.lat), λ2 = toRad(b.lng);
  const d = 2 * Math.asin(Math.sqrt(Math.sin((φ2 - φ1) / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2));
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    pts.push([toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))), toDeg(Math.atan2(y, x))]);
  }
  return pts;
}

function progressoViagem() {
  const p = (Date.now() - partida) / (chegada - partida);
  return Math.min(1, Math.max(0, p));
}

$('#km').textContent = fmt(Math.round(distanciaKm(CONFIG.origem, CONFIG.destino)));

const rota = greatCircle(CONFIG.origem, CONFIG.destino);

const map = L.map('map', {
  scrollWheelZoom: false,
  dragging: !L.Browser.mobile,
  tap: false,
  zoomSnap: 0.25,
  attributionControl: true,
});

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri',
  maxZoom: 10,
  minZoom: 1,
}).addTo(map);

const enquadrar = () => map.fitBounds(L.latLngBounds(rota), { paddingTopLeft: [70, 50], paddingBottomRight: [90, 50] });
enquadrar();
window.addEventListener('resize', enquadrar);

L.polyline(rota, { color: '#c1121f', weight: 3, opacity: 0.5, dashArray: '6 8' }).addTo(map);
const feito = L.polyline([], { color: '#c1121f', weight: 4 }).addTo(map);

L.circleMarker([CONFIG.origem.lat, CONFIG.origem.lng], { radius: 6, color: '#fff', weight: 2, fillColor: '#8a0c16', fillOpacity: 1 })
  .addTo(map)
  .bindTooltip(CONFIG.origem.nome, { permanent: true, direction: 'right', className: 'city-label', offset: [8, 0] });

L.marker([CONFIG.destino.lat, CONFIG.destino.lng], {
  icon: L.divIcon({
    className: '',
    html: '<div style="font-size:30px;line-height:1;animation:beat 1.2s infinite;color:#c1121f">❤</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 18],
  }),
})
  .addTo(map)
  .bindTooltip(CONFIG.destino.nome, { permanent: true, direction: 'left', className: 'city-label', offset: [-14, 0] });

const aviao = L.marker(rota[0], {
  icon: L.divIcon({
    className: 'plane-icon',
    html: '<div class="plane-rot"><svg width="38" height="38" viewBox="0 0 24 24"><path fill="#c1121f" stroke="#fff" stroke-width=".8" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg></div>',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  }),
  zIndexOffset: 1000,
}).addTo(map);

function posicionarAviao(t) {
  const exato = t * (rota.length - 1);
  const i = Math.min(rota.length - 2, Math.floor(exato));
  const f = exato - i;
  const [a, b] = [rota[i], rota[i + 1]];
  const pos = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  aviao.setLatLng(pos);
  feito.setLatLngs([...rota.slice(0, i + 1), pos]);

  const p1 = map.project(a, 0);
  const p2 = map.project(b, 0);
  const ang = toDeg(Math.atan2(p2.x - p1.x, -(p2.y - p1.y)));
  const rot = aviao.getElement()?.querySelector('.plane-rot');
  if (rot) rot.style.transform = `rotate(${ang}deg)`;
}

let animando = false;
function voar(de, para, duracao, fim) {
  animando = true;
  const t0 = performance.now();
  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
  function frame(now) {
    const k = Math.min(1, (now - t0) / duracao);
    posicionarAviao(de + (para - de) * ease(k));
    if (k < 1) requestAnimationFrame(frame);
    else {
      animando = false;
      fim?.();
    }
  }
  requestAnimationFrame(frame);
}

function atualizarProgresso() {
  const p = progressoViagem();
  $('#progress-fill').style.width = (p * 100).toFixed(1) + '%';
  $('#progress-pct').textContent = Math.floor(p * 100) + '%';
  return p;
}

posicionarAviao(0);
atualizarProgresso();
setInterval(() => {
  const p = atualizarProgresso();
  if (!animando) posicionarAviao(p);
}, 60000);

let mapaAnimado = false;
new IntersectionObserver((entries, obs) => {
  if (!entries[0].isIntersecting || mapaAnimado) return;
  mapaAnimado = true;
  obs.disconnect();
  map.invalidateSize();
  enquadrar();
  const p = atualizarProgresso();
  setTimeout(() => voar(0, p, 2500), 400);
}, { threshold: 0.4 }).observe($('#map'));

$('#fly-btn').addEventListener('click', () => {
  if (animando) return;
  const btn = $('#fly-btn');
  btn.disabled = true;
  const atual = progressoViagem();
  voar(atual, 1, 3500, () => {
    const pt = map.latLngToContainerPoint([CONFIG.destino.lat, CONFIG.destino.lng]);
    const r = $('#map').getBoundingClientRect();
    burstHearts(r.left + pt.x, r.top + pt.y, 22);
    btn.textContent = 'Logo logo, de verdade ❤️';
    setTimeout(() => {
      voar(1, atual, 2000, () => {
        btn.disabled = false;
        btn.textContent = 'Me leva pra casa ✈️';
      });
    }, 2500);
  });
});

/* ---------- Animações de entrada ---------- */
const revealObs = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  }
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));
