/* ================= 家裡更有生活感 =================
   1. 角色會自言自語（餓、渴、髒、累、半夜、屍潮夜）
   2. 目標清單（左上，完成打勾、心態 +5）
   3. 狗跟著你走，點牠摸頭
   4. 天黑要開燈（耗電），不開燈只看得到身邊
   5. 長按家具直接搬家
   6. 狗可以換成自己的圖（SCENE_ASSETS.top.dog）*/

/* ---------- 6. 自訂素材 ---------- */
const TOP_ASSETS = Object.assign({ dog: null }, (typeof SCENE_ASSETS === 'object' && SCENE_ASSETS.top) || {});

/* ---------- 1. 自言自語 ---------- */
function sayLines() {
  const sv = S.sv, L = [];
  if (sv.sat < 25) L.push('肚子好餓……', '想吃熱騰騰的飯');
  if (sv.hyd < 25) L.push('好渴……', '喉嚨好乾');
  if (sv.hyg != null && sv.hyg < 30) L.push('好想洗澡……', '身上好臭');
  if (sv.sta < 20) L.push('好累，想躺一下', '腿好痠');
  if (sv.mor < 30) L.push('還要撐多久……', '好想家人');
  if (sv.hp < 40) L.push('傷口好痛', '要找藥了');
  if (sv.hour >= 22) L.push('該睡了……', '好睏');
  if (hordeOn(sv.day)) L.push('今晚會很難熬', '門夠不夠堅固？');
  if (inCold(sv.day)) L.push('好冷……');
  if (inRain(sv.day)) L.push('雨一直下');
  if ((sv.broken || {}) && Object.keys(sv.broken || {}).length) L.push('那台東西得修一修');
  if (!L.length) L.push('今天也要活下去', '外面好安靜', '要不要出去找點東西？', '嗯……來整理一下', '想念以前的日子', '收音機今天會不會有消息');
  return L;
}
function say(txt, ms) { const rt = rtState(); rt.say = { txt, until: performance.now() + (ms || 3500) }; }

/* ---------- 2. 目標清單 ---------- */
const GOALS = [
  { id: 'look', n: '查看冰櫃或櫃子' },
  { id: 'eat', n: '吃一頓飯' },
  { id: 'gen', n: '發一次電' },
  { id: 'reinforce', n: '加固大門' },
  { id: 'plant', n: '種下種子' },
  { id: 'out', n: '第一次外出搜刮', chk: sv => sv.xp > 0 },
  { id: 'horde', n: '撐過第一次屍潮', chk: sv => sv.htSurv && Object.keys(sv.htSurv).length > 0 },
  { id: 'evRepair', n: '修好故障的設備' },
  { id: 'kill', n: '打倒 5 隻殭屍', chk: sv => (sv.kills || 0) >= 5 },
  { id: 'day7', n: '活過第 7 天', chk: sv => sv.day >= 7 },
  { id: 'zoe', n: '幫隔壁的 Zoe 一次', chk: sv => sv.zoe && sv.zoe.given > 0 },
  { id: 'day30', n: '活過第 30 天', chk: sv => sv.day >= 30 }
];
function goalState() { const sv = S.sv; if (!sv.goals) sv.goals = {}; return sv.goals; }
function goalDone(id) {
  const g = goalState(); if (g[id]) return;
  const G = GOALS.find(x => x.id === id); if (!G) return;
  g[id] = true; S.sv.mor = clamp(S.sv.mor + 5);
  slog('目標完成：「' + G.n + '」心態 +5。'); sfx('ach');
  if (typeof evState === 'function') { const E = evState(), rt = rtState(); E.fx = (E.fx || []).concat([{ x: rt.pos.x, y: rt.pos.y - 0.4, txt: '☑ ' + G.n, col: '#7cc191', t0: performance.now() }]); }
}
function goalCheck() { const sv = S.sv, g = goalState(); for (const G of GOALS) if (!g[G.id] && G.chk && G.chk(sv)) goalDone(G.id); }
for (const k of ['eat', 'eatFull', 'gen', 'pedal', 'reinforce', 'plant', 'evRepair']) {
  const f = SACT[k]; if (!f) continue;
  SACT[k] = function (v) { const sv = S.sv, h = sv.hour, d = sv.day, l = sv.log[0]; f(v); if (S.phase === 'survive' && (sv.hour !== h || sv.day !== d || sv.log[0] !== l)) goalDone(k === 'eatFull' ? 'eat' : k === 'pedal' ? 'gen' : k); };
}
function goalHTML() {
  const g = goalState(), left = GOALS.filter(G => !g[G.id]).slice(0, 1), done = GOALS.filter(G => g[G.id]).length;
  if (!left.length) return '';
  return '<div class="rt-qh">目標（' + done + '/' + GOALS.length + '）</div>' + left.map(G => '<div class="rt-goal">☐ ' + G.n + '</div>').join('');
}
// 殭屍擊倒數
const _siegeHitG = siegeHit;
siegeHit = function (id) { const sg = siegeOf(), k0 = sg ? sg.kills : 0; _siegeHitG(id); const sg2 = siegeOf(); if (sg2 && sg2.kills > k0) S.sv.kills = (S.sv.kills || 0) + (sg2.kills - k0); };

/* ---------- 3. 狗 ---------- */
const hasDog = () => S.sv.dog && S.sv.dog.state === 'pet';
function dogState() { const rt = rtState(); if (!rt.dog) rt.dog = { x: rt.pos.x + 0.6, y: rt.pos.y + 0.3, f: rt.pos.f, pet: -99 }; return rt.dog; }
Object.assign(SACT, {
  petDog() {
    const sv = S.sv, d = dogState(); if (!hasDog()) return;
    const now = performance.now(); d.heart = now;
    if (sv.hour !== d.pet) { d.pet = sv.hour; sv.mor = clamp(sv.mor + 4); sv.dog.xp = (sv.dog.xp || 0) + 0.3; say('乖狗狗～', 2000); slog('摸了摸狗的頭，牠搖著尾巴。心態 +4。'); }
    else say('牠舔了舔你的手', 1800);
    sfx('pop');
  }
});

/* ---------- 4. 燈 ---------- */
const isDark = h => h >= 19 || h < 6;
Object.assign(SACT, {
  lightSw() {
    const sv = S.sv;
    if (!sv.light && sv.power < 0.2) { slog('沒電了，燈打不開。'); say('沒電……', 1800); render(); return; }
    sv.light = !sv.light; sfx('click'); slog(sv.light ? '打開燈，房間亮了起來（每小時 0.1 度電）。' : '關燈了。'); render();
  }
});

/* ---------- 每一格 ---------- */
let LF_SAY = 0, LF_HOUR = null;
function lifeTick(now) {
  requestAnimationFrame(lifeTick);
  if (!rtActive() || document.querySelector('.anim.day')) return;
  const sv = S.sv, rt = rtState(), sp = RT_SPEEDS[UIS.speed] || 0;
  // 每小時：燈耗電、夜裡有燈心態 +1、檢查目標
  const hk = sv.day * 100 + sv.hour;
  if (LF_HOUR !== hk) {
    if (LF_HOUR != null && hk > LF_HOUR) {
      if (sv.light) { if (sv.power >= 0.1) { sv.power = Math.max(0, sv.power - 0.1); if (isDark(sv.hour)) sv.mor = clamp(sv.mor + 1); } else { sv.light = false; slog('沒電了，燈熄了。', true); } }
      if (isDark(sv.hour) && !sv.light && sv.hour === 19) say('天黑了，開個燈吧', 3000);
    }
    LF_HOUR = hk; goalCheck();
  }
  // 自言自語
  if (sp && now - LF_SAY > 22000 / Math.min(sp, 3) && !(rt.say && rt.say.until > now)) {
    LF_SAY = now; if (rnd() < 0.7) { const L = sayLines(); say(L[Math.floor(rnd() * L.length)]); }
  }
  // 狗跟著走
  if (hasDog()) {
    const d = dogState();
    if (d.f !== rt.pos.f) { d.f = rt.pos.f; d.x = rt.pos.x + 0.6; d.y = rt.pos.y; }
    const tx = rt.pos.x + 0.7, ty = rt.pos.y + 0.35, dx = tx - d.x, dy = ty - d.y, dist = Math.hypot(dx, dy);
    if (dist > 0.35) { const st = Math.min(dist - 0.3, 0.016 * 2.4 * Math.max(1, Math.min(sp || 1, 3)) * (dist > 2 ? 2 : 1)); d.x += dx / dist * st; d.y += dy / dist * st; d.moving = true; } else d.moving = false;
    d.face = dx >= 0 ? 1 : -1;
  }
  const g = document.getElementById('lf-layer'); if (g) g.innerHTML = lifeLayer(now);
  charFrame(now);
}
requestAnimationFrame(lifeTick);
// 角色動作圖：走路兩張輪流、做事、站著；往右走時翻面
let CF_LAST = { x: null };
function charFrame(now) {
  const img = document.getElementById('char-img'); if (!img) return;
  const rt = rtState(), walking = rt.path && rt.path.length;
  if (CF_LAST.x != null && Math.abs(rt.pos.x - CF_LAST.x) > 0.001) rt.face = rt.pos.x > CF_LAST.x ? 1 : -1;
  CF_LAST.x = rt.pos.x;
  const k = walking ? (Math.floor(now / 200) % 2 ? 'char_walk1' : 'char_walk2') : ((rt.task && rt.task.h) || (rt.workUntil && now < rt.workUntil)) ? 'char_work' : 'char_idle';
  const flip = rt.face === 1;
  if (k !== img.dataset.k) { img.setAttribute('href', SPR[k]); img.dataset.k = k; }
  if (flip !== (img.dataset.flip === '1')) { if (flip) img.setAttribute('transform', 'scale(-1 1)'); else img.removeAttribute('transform'); img.dataset.flip = flip ? '1' : '0'; }
}

function lifeLayer(now) {
  const sv = S.sv, rt = rtState(), f = (UI.iso && UI.iso.floor) || '1F', P = isoProj(f), Z = sceneSize(f);
  now = now || performance.now();
  let s = '';
  // 燈光：沒開燈的晚上只看得到身邊
  if (isDark(sv.hour) && f !== 'B1') {
    if (sv.light) s += '<rect x="0" y="0" width="' + Z.w + '" height="' + Z.h + '" fill="#ffe2a0" opacity="0.32" style="mix-blend-mode:screen" pointer-events="none"/>';
    else if (rt.pos.f === f) { const q = P(rt.pos.x, rt.pos.y, 0); s += '<defs><radialGradient id="lf-dark" gradientUnits="userSpaceOnUse" cx="' + q[0].toFixed(1) + '" cy="' + (q[1] - 12).toFixed(1) + '" r="120"><stop offset="0.35" stop-color="#05070a" stop-opacity="0"/><stop offset="1" stop-color="#05070a" stop-opacity="0.72"/></radialGradient></defs><rect x="0" y="0" width="' + Z.w + '" height="' + Z.h + '" fill="url(#lf-dark)" pointer-events="none"/>'; }
    else s += '<rect x="0" y="0" width="' + Z.w + '" height="' + Z.h + '" fill="#05070a" opacity="0.6" pointer-events="none"/>';
  }
  // 電燈開關（門旁的牆上）
  if (f === '1F' || f === '2F') {
    const a = P(ISO_FLOORS[f].w - 0.75, 0, 0), y = a[1] - TWALL + 30;
    s += '<g data-lsw="1" style="cursor:pointer"><rect x="' + (a[0] - 4) + '" y="' + (y - 4) + '" width="24" height="30" fill="transparent"/><rect x="' + a[0] + '" y="' + y + '" width="16" height="22" rx="3" fill="#f3f0e6" stroke="#1d2733" stroke-width="1.2"/><rect x="' + (a[0] + 5) + '" y="' + (y + (sv.light ? 4 : 11)) + '" width="6" height="7" rx="1.5" fill="' + (sv.light ? '#ecd27a' : '#5d6b7a') + '"/>' + (isDark(sv.hour) && !sv.light ? '<circle cx="' + (a[0] + 8) + '" cy="' + (y - 7) + '" r="4" fill="#ecd27a" opacity="' + (0.5 + Math.sin(now / 300) * 0.4).toFixed(2) + '"/>' : '') + '</g>';
  }
  // 狗
  if (hasDog()) {
    const d = dogState();
    if (d.f === f) {
      const q = P(d.x, d.y, 0), wag = Math.sin(now / (d.moving ? 90 : 160)) * 4, step = d.moving ? Math.abs(Math.sin(now / 110)) * 1.5 : 0;
      s += '<g transform="translate(' + q[0].toFixed(1) + ' ' + (q[1] - step).toFixed(1) + ') scale(' + (d.face || 1) + ' 1)" data-dog="1" style="cursor:pointer">' +
        (TOP_ASSETS.dog ? '<image href="' + TOP_ASSETS.dog + '" x="-14" y="-22" width="28" height="24"/>' :
        '<ellipse cy="2" rx="10" ry="3" fill="rgba(0,0,0,0.2)"/><ellipse cx="0" cy="-6" rx="9" ry="5.5" fill="#a0764a" stroke="#1d2733" stroke-width="0.9"/><circle cx="9" cy="-11" r="4.5" fill="#a0764a" stroke="#1d2733" stroke-width="0.9"/><path d="M7 -15 l-1 -4 l3 2z" fill="#7a5a3a"/><circle cx="10.5" cy="-11.5" r="0.9" fill="#111"/><circle cx="13" cy="-10" r="1" fill="#2a1a1a"/>' +
        '<path d="M-9 -7 q -4 ' + (-4 + wag).toFixed(1) + ' -6 ' + (-8 + wag).toFixed(1) + '" stroke="#a0764a" stroke-width="2.4" fill="none" stroke-linecap="round"/><rect x="-6" y="-2" width="2.4" height="4" fill="#7a5a3a"/><rect x="4" y="-2" width="2.4" height="4" fill="#7a5a3a"/>') +
        '<circle cx="0" cy="-8" r="15" fill="transparent"/></g>';
      if (d.heart && now - d.heart < 1200) { const k = (now - d.heart) / 1200; s += '<text x="' + q[0].toFixed(1) + '" y="' + (q[1] - 24 - k * 16).toFixed(1) + '" text-anchor="middle" font-size="13" opacity="' + (1 - k).toFixed(2) + '" pointer-events="none">❤️</text>'; }
    }
  }
  // 對話泡泡
  if (rt.say && rt.say.until > now && rt.pos.f === f) {
    const q = P(rt.pos.x, rt.pos.y, 0), t = rt.say.txt, w = Math.max(40, t.length * 11 + 14), op = Math.min(1, (rt.say.until - now) / 400);
    const x = Math.max(4, Math.min(Z.w - w - 4, q[0] - w / 2)), up = !(q[1] - 78 < Z.h * 0.38 && x < Z.w * 0.6), y = up ? q[1] - 78 : q[1] + 10;
    s += '<g opacity="' + op.toFixed(2) + '" pointer-events="none"><rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w + '" height="20" rx="8" fill="#fffdf6" stroke="#1d2733" stroke-width="1.1"/>' + (up ? '<path d="M' + (q[0] - 4).toFixed(1) + ' ' + (y + 19.5).toFixed(1) + ' l4 6 l4 -6z" fill="#fffdf6" stroke="#1d2733" stroke-width="1.1" stroke-linejoin="round"/><rect x="' + (q[0] - 4.5).toFixed(1) + '" y="' + (y + 18).toFixed(1) + '" width="9" height="2.4" fill="#fffdf6"/>' : '') + '<text x="' + (x + w / 2).toFixed(1) + '" y="' + (y + 14).toFixed(1) + '" text-anchor="middle" font-size="11" fill="#1d2733" font-family="Noto Sans TC, sans-serif">' + esc(t) + '</text></g>';
  }
  // 搬家中提示
  if (UI.iso && UI.iso.moving && UI.iso.sel) s += '<rect x="0" y="0" width="' + Z.w + '" height="18" fill="#ecd27a" opacity="0.92" pointer-events="none"/><text x="' + Z.w / 2 + '" y="13" text-anchor="middle" font-size="11" font-weight="700" fill="#1d2733" pointer-events="none">搬家中：點亮起來的空地放下</text>';
  return s;
}
document.addEventListener('pointerdown', e => {
  if (!e.target.closest) return;
  if (e.target.closest('[data-dog]')) { e.preventDefault(); e.stopPropagation(); SACT.petDog(); return; }
  if (e.target.closest('[data-lsw]')) { e.preventDefault(); e.stopPropagation(); SACT.lightSw(); }
}, true);

/* ---------- 5. 長按搬家 ---------- */
let LP_T = null, LP_FIRED = false;
document.addEventListener('pointerdown', e => {
  LP_FIRED = false;
  const t = e.target.closest && e.target.closest('[data-a="rtObj"]');
  if (!t || !rtActive() || t.getAttribute('data-v') === 'DOOR') return;
  const id = t.getAttribute('data-v'), o = isoObjects().find(q => q.id === id);
  if (!o || (ISO[o.k] && ISO[o.k].fixed && ['bed', 'toilet'].includes(o.k) && false)) return;
  LP_FIRED = false; clearTimeout(LP_T);
  LP_T = setTimeout(() => {
    LP_FIRED = true;
    UI.rtSel = null; UI.iso = Object.assign(UI.iso || {}, { sel: id, moving: true });
    if (navigator.vibrate) try { navigator.vibrate(30); } catch (er) {}
    say('搬到哪裡好呢', 2000); sfx('pop'); render();
  }, 550);
}, true);
['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => document.addEventListener(ev, () => clearTimeout(LP_T), true));
document.addEventListener('pointermove', e => { if (Math.abs(e.movementX) + Math.abs(e.movementY) > 6) clearTimeout(LP_T); }, true);
document.addEventListener('click', e => { if (LP_FIRED) { LP_FIRED = false; e.stopPropagation(); e.preventDefault(); } }, true);
const _rtTileMove = SACT.rtTile;
SACT.rtTile = function (v) {
  const I = UI.iso || {};
  if (I.moving && I.sel) { SACT.isoTile(v); if (!UI.iso.moving) { UI.iso.sel = null; sfx('fix'); } return; }
  _rtTileMove(v);
};
const _rtObjMove = SACT.rtObj;
SACT.rtObj = function (v) {
  const I = UI.iso || {};
  if (I.moving && I.sel) { if (v === I.sel) { UI.iso.moving = false; UI.iso.sel = null; render(); } return; }
  if (v !== 'DOOR' && (!UI.lookOnce || !UI.lookOnce[v])) { const o = isoObjects().find(q => q.id === v); if (o && ['freezer', 'storage', 'shelf'].includes(o.k)) goalDone('look'); }
  _rtObjMove(v);
};
Object.assign(SACT, { moveCancel() { if (UI.iso) { UI.iso.moving = false; UI.iso.sel = null; } render(); }, moveRot() { SACT.isoRotate(); } });

/* ---------- 掛進場景與面板 ---------- */
const _rtSceneLife = rtScene;
rtScene = function () {
  let h = _rtSceneLife();
  h = h.replace('</svg></div>', '<g id="lf-layer">' + lifeLayer() + '</g></svg></div>');
  const gh = goalHTML();
  if (gh) h = h.replace(/(<div class="rt-q">[\s\S]*?)(<\/div><div class="rt-c">)/, (m, a, b) => a + gh + b);
  return h;
};
const _rtPanelLife = rtPanel;
rtPanel = function () {
  const I = UI.iso || {};
  let h = '';
  if (I.moving && I.sel) { const o = isoObjects().find(q => q.id === I.sel); h += '<div class="sg-box" style="border-color:#c9a94a;background:rgba(236,210,122,0.12)"><div class="sg-h"><b style="color:inherit">搬家：' + (o ? ISO[o.k].n : '') + '</b></div><p class="meta">點亮起來的空地放下。長按其他家具可以換一件搬。</p><div class="row-btns"><button class="btn ghost" data-a="moveRot">轉向</button><button class="btn ghost" data-a="moveCancel">不搬了</button></div></div>'; }
  return h + _rtPanelLife();
};
