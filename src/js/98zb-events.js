/* ================= 白天的隨機小事件＋做事動作（即時模式） =================
   每過一個遊戲小時有機會發生：有人敲門、老鼠偷吃、漏水、設備故障、窗外殭屍、收音機廣播。
   會在畫面上出現「！」，點它處理；放著不管會有小損失。
   角色做事時頭上顯示在做什麼，做完跳出「✓」。 */
const EV_TYPES = {
  knock:  { n: '有人敲門', ic: '✊', life: 2 },
  rat:    { n: '老鼠', ic: '🐀', life: 1.5 },
  leak:   { n: '漏水', ic: '💧', life: 2 },
  broke:  { n: '設備故障', ic: '🔧', life: 99 },
  walker: { n: '窗外殭屍', ic: '🧟', life: 1.5 },
  radio:  { n: '收音機廣播', ic: '📻', life: 2 }
};
const TASK_IC = { gen: '⚡', pedal: '🚲', cookx: '🍳', cook: '🍳', craft: '🔨', reinforce: '🔨', rest: '📖', wash: '🚿', plant: '🌱', refine: '⚗️', brew: '🍶', juice: '🧃', evRepair: '🔧', eatFull: '🍚', drinkFull: '💧', sleep: '💤', watch: '👀' };

function evState() {
  const sv = S.sv;
  if (!sv.ev || sv.ev.day !== sv.day) sv.ev = { day: sv.day, list: (sv.ev && sv.ev.list || []).filter(e => e.k === 'broke' && !e.gone), n: 0, lastHour: sv.hour, id: (sv.ev && sv.ev.id) || 0 };
  return sv.ev;
}
const evAlive = k => evState().list.find(e => e.k === k && !e.gone);
function evSpot(k) {
  const sv = S.sv, objs = isoObjects().filter(o => sv.place[o.id] && sv.place[o.id].f === '1F');
  const at = o => { const p = sv.place[o.id], D = ISO[o.k], w = p.r ? D.d : D.w, d = p.r ? D.w : D.d; return { x: p.x + w / 2, y: p.y + d / 2, id: o.id, k: o.k }; };
  if (k === 'knock') return { x: 0.25, y: ISO_DOOR.at + 0.5 };
  if (k === 'rat') { const o = objs.find(o => ['storage', 'shelf', 'freezer', 'bench'].includes(o.k)); const c = o ? at(o) : { x: 1, y: 1 }; return { x: c.x, y: c.y + 0.8 }; }
  if (k === 'leak') { const ok = [...rtWalkable('1F')]; const t = ok[Math.floor(rnd() * ok.length)] || '3,3'; const [x, y] = t.split(',').map(Number); return { x: x + 0.5, y: y + 0.5 }; }
  if (k === 'walker') { const w = ISO_WIN['1F'].y0; const x = w[Math.floor(rnd() * w.length)]; return { x: x + 0.5, y: -0.35 }; }
  if (k === 'radio') { const o = objs.find(o => o.k === 'bed' || o.k === 'bedroom'); const c = o ? at(o) : { x: 4, y: 1 }; return { x: c.x, y: c.y }; }
  if (k === 'broke') {
    const cand = isoObjects().filter(o => ['gen', 'freezer', 'battery', 'ac', 'lightbox', 'pedal', 'microwave'].includes(o.k) && sv.place[o.id] && !(sv.broken || {})[o.k]);
    if (!cand.length) return null;
    const o = cand[Math.floor(rnd() * cand.length)], p = sv.place[o.id], D = ISO[o.k], w = p.r ? D.d : D.w, d = p.r ? D.w : D.d;
    return { x: p.x + w / 2, y: p.y + d / 2, f: p.f, obj: o.k };
  }
  return null;
}
function evSpawn() {
  const sv = S.sv, E = evState();
  const pool = [['knock', 3], ['rat', sv.day >= 3 ? 3 : 0], ['leak', inRain(sv.day) || (typeof isTyphoon === 'function' && isTyphoon(sv.day)) ? 4 : 1], ['broke', sv.day >= 4 ? 2 : 0], ['walker', 3], ['radio', 2]]
    .filter(([k, w]) => w > 0 && !evAlive(k));
  const tot = pool.reduce((a, [, w]) => a + w, 0); if (!tot) return;
  let r = rnd() * tot, k = pool[0][0];
  for (const [kk, w] of pool) { if ((r -= w) <= 0) { k = kk; break; } }
  const at = evSpot(k); if (!at) return;
  const e = Object.assign({ id: ++E.id, k, until: sv.hour + EV_TYPES[k].life, t0: performance.now(), f: '1F', hp: 2 }, at);
  E.list.push(e); E.n++;
  if (k === 'broke') { sv.broken = sv.broken || {}; sv.broken[e.obj] = true; }
  const msg = { knock: '咚咚咚——有人在敲門。', rat: '倉庫那邊傳來窸窸窣窣的聲音……有老鼠！', leak: '天花板開始滴水了。', broke: (e.obj ? ITEMS[e.obj].n : '') + '突然冒出一陣煙，故障了！', walker: '一隻殭屍在窗外晃來晃去，盯著你看。', radio: '收音機沙沙地響了，好像有人在廣播。' }[k];
  slog(msg, k !== 'radio');
  sfx({ knock: 'knock', rat: 'squeak', leak: 'pop', broke: 'bash', walker: 'groan', radio: 'pop' }[k]);
}
function evExpire(e) {
  const sv = S.sv; e.gone = true;
  if (e.k === 'rat') { const foods = Object.keys(sv.st).filter(k => ITEMS[k] && ITEMS[k].cat === 'food' && sv.st[k] > 0); if (foods.length) { const k = foods[Math.floor(rnd() * foods.length)]; const n = Math.min(sv.st[k], 2); sv.st[k] -= n; if (!sv.st[k]) delete sv.st[k]; slog('老鼠跑了，還咬壞了 ' + ITEMS[k].n + ' ×' + n + '。', true); } }
  else if (e.k === 'leak') { sv.hyg = Math.max(0, (sv.hyg == null ? 80 : sv.hyg) - 8); slog('漏水把地板弄得一團糟，衛生 -8。'); }
  else if (e.k === 'walker') { sv.def = Math.max(0, sv.def - 8); slog('窗外那隻殭屍抓了半天窗框，防線 -8。'); }
  else if (e.k === 'knock') slog('敲門聲停了，外面的人走了。');
}

/* ---------- 處理事件 ---------- */
function evResolve(id) {
  const sv = S.sv, E = evState(), e = E.list.find(q => q.id === id && !q.gone); if (!e) return;
  const now = performance.now();
  if (e.k === 'rat') {
    if (rnd() < 0.65) { e.gone = true; sfx('hit'); sv.mor = clamp(sv.mor + 3); evFloat(e, '抓到了！', '#ffd36a'); slog('你一腳踩住老鼠，丟出窗外。心態 +3。'); }
    else { e.x = Math.max(0.5, Math.min(5.5, e.x + (rnd() - 0.5) * 2.5)); e.y = Math.max(0.5, Math.min(4.5, e.y + (rnd() - 0.5) * 2)); sfx('squeak'); evFloat(e, '溜走了', '#9aa7b4'); }
  } else if (e.k === 'leak') { e.gone = true; sv.st.wu = (sv.st.wu || 0) + 2; sfx('pop'); evFloat(e, '水 +2', '#6fb3e0'); slog('你拿水桶接了漏下來的水，飲用水 +2 份。'); }
  else if (e.k === 'walker') {
    if (sv.sta < 2) { evFloat(e, '沒力氣', '#9aa7b4'); return; }
    sv.sta -= 2; e.hp -= S.char === 'veteran' ? 2 : 1; e.hurtAt = now; sfx('hit');
    if (e.hp <= 0) { e.gone = true; sv.kills = (sv.kills || 0) + 1; evFloat(e, '擊倒！', '#ffd36a'); slog('你拿撬棍從窗縫捅倒了那隻殭屍。'); sv.mor = clamp(sv.mor + 2); } else evFloat(e, '-1', '#ff8a6a');
  } else if (e.k === 'radio') { e.gone = true; sv.mor = clamp(sv.mor + 8); sfx('pop'); evFloat(e, '心態 +8', '#d97ab8'); slog(evRadioMsg()); }
  else if (e.k === 'knock') { UI.evKnock = e.id; UI.rtSel = null; render(); return; }
  else if (e.k === 'broke') { UI.rtSel = (isoObjects().find(o => o.k === e.obj && sv.place[o.id]) || {}).id || null; render(); return; }
  render();
}
function evRadioMsg() {
  const sv = S.sv; let next = null;
  for (let d = sv.day + 1; d < sv.day + 15; d++) if (hordeOn(d)) { next = d; break; }
  const tips = ['廣播：「……倖存者請注意，' + (next ? '第 ' + next + ' 天晚上北邊有大群移動' : '最近幾天屍群活動比較少') + '……」', '廣播：「……' + (inCold(sv.day + 2) ? '兩天後寒流來襲，請準備保暖' : '未來幾天天氣穩定') + '……」', '廣播放了一首老歌，你跟著哼了起來。'];
  return tips[Math.floor(rnd() * tips.length)] + '心態 +8。';
}
function evFloat(e, txt, col) { const E = evState(); E.fx = (E.fx || []).concat([{ x: e.x, y: e.y, txt, col, t0: performance.now() }]); }
Object.assign(SACT, {
  evKnockOpen() {
    const sv = S.sv, E = evState(), e = E.list.find(q => q.id === UI.evKnock && !q.gone); UI.evKnock = null; if (!e) { render(); return; }
    e.gone = true; const r = rnd();
    if (r < 0.4) { const mats = ['board', 'metal', 'glass', 'plastic', 'diesel', 'pills']; const a = mats[Math.floor(rnd() * mats.length)]; sv.st[a] = (sv.st[a] || 0) + (a === 'diesel' ? 1 : 2); slog('門外是個背著大包的旅人，送你 ' + ITEMS[a].n + ' ×' + (a === 'diesel' ? 1 : 2) + '，說謝謝你沒拿槍指他。', true); sfx('buy'); }
    else if (r < 0.75) { UI.evBeg = true; slog('門外是個餓壞的小孩，眼巴巴看著你。'); }
    else { const h = 8 + Math.floor(rnd() * 8); hurt(h, 'horde'); sv.def = Math.max(0, sv.def - 20); slog('一開門就是一隻殭屍撲上來！你把牠推出去，受傷 ' + h + '、防線 -20。', true); sfx('bash'); checkDeath(); }
    render();
  },
  evKnockIgnore() { const E = evState(), e = E.list.find(q => q.id === UI.evKnock); if (e) e.gone = true; UI.evKnock = null; slog('你屏住呼吸裝作家裡沒人。'); render(); },
  evBegGive(k) {
    const sv = S.sv; UI.evBeg = false;
    if (k && sv_has(k) > 0) { sv_take(k, 1); sv.mor = clamp(sv.mor + 15); slog('你分了' + ITEMS[k].n + '給小孩，他說會記得你。心態 +15。', true); J.kids = (J.kids || 0) + 1; }
    else { sv.mor = clamp(sv.mor - 6); slog('你關上門。那雙眼睛一直在你腦海裡。心態 -6。'); }
    render();
  },
  evRepair(k) {
    const sv = S.sv;
    if (!canAct(1, 6) || !(sv.broken || {})[k]) return;
    const m = ['metal', 'board', 'plastic'].find(x => sv.st[x] > 0);
    if (!m) { slog('沒有材料可以修（要鐵片、木板或塑膠 1 個）。'); render(); return; }
    sv.st[m]--; if (!sv.st[m]) delete sv.st[m];
    delete sv.broken[k]; sv.sta -= 6;
    const e = evState().list.find(q => q.k === 'broke' && q.obj === k && !q.gone); if (e) e.gone = true;
    slog('用 1 個' + ITEMS[m].n + '修好了' + ITEMS[k].n + '。'); sfx('fix');
    passHours(1); render();
  }
});
// 壞掉的設備只能修
const _rtActionsEv = rtActions;
rtActions = function (k) {
  const sv = S.sv, A = _rtActionsEv(k);
  if (!(sv.broken || {})[k]) return A;
  const m = ['metal', 'board', 'plastic'].find(x => sv.st[x] > 0);
  return [{ label: '修理（用 1 個鐵片／木板／塑膠）', a: 'evRepair', v: k, h: 1, ok: !!m, note: m ? '會用掉' + ITEMS[m].n : '沒有材料' }].concat(A.map(x => Object.assign({}, x, { ok: false, note: '故障中' })));
};
// 故障的設備：發電機、儲電站不能用；睡前漏電
const _genEv = SACT.gen; SACT.gen = function () { if ((S.sv.broken || {}).gen) { slog('發電機故障了，要先修。'); render(); return; } _genEv(); };
const _pedalEv = SACT.pedal; SACT.pedal = function () { if ((S.sv.broken || {}).pedal) { slog('人力發電機壞了，要先修。'); render(); return; } _pedalEv(); };
const _nightEv = night;
night = function (watch) {
  const sv = S.sv;
  const br = Object.keys(sv.broken || {});
  if (br.length && S.phase === 'survive') { sv.power = Math.max(0, sv.power - br.length); slog('故障的' + br.map(k => ITEMS[k].n).join('、') + '漏電，電力 -' + br.length + ' 度。', true); }
  _nightEv(watch);
};

/* ---------- 每一格 ---------- */
let EV_LAST = 0;
const RT_LAST_TASK = { key: null, label: '', a: '' };
function evTick(now) {
  requestAnimationFrame(evTick);
  if (!rtActive() || document.querySelector('.anim.day')) return;
  const sv = S.sv, E = evState(), rt = rtState();
  // 每過一小時：到期、擲骰
  if (sv.hour !== E.lastHour) {
    const passed = sv.hour > E.lastHour;
    E.lastHour = sv.hour;
    if (passed) {
      for (const e of E.list) if (!e.gone && e.k !== 'broke' && sv.hour >= e.until) evExpire(e);
      const sg = typeof siegeOf === 'function' && siegeOf();
      if (!sg && sv.day >= 2 && sv.hour >= 8 && sv.hour <= 19 && E.n < 3 && rnd() < 0.22) evSpawn();
      render();
    }
  }
  // 做完事跳出 ✓
  const key = rt.task ? rt.task.where + rt.task.a + rt.task.label : null;
  if (key !== RT_LAST_TASK.key) {
    if (RT_LAST_TASK.key && RT_LAST_TASK.a) { E.fx = (E.fx || []).concat([{ x: rt.pos.x, y: rt.pos.y, txt: (TASK_IC[RT_LAST_TASK.a] || '') + ' ✓', col: '#ecd27a', t0: now }]); if (RT_LAST_TASK.a === 'eatFull') sfx('eat'); }
    RT_LAST_TASK.key = key; RT_LAST_TASK.label = rt.task ? rt.task.label : ''; RT_LAST_TASK.a = rt.task ? rt.task.a : '';
  }
  // 做事的聲音
  if (rt.task && rt.task.h && !(rt.path && rt.path.length) && (UIS.speed || 0) > 0 && now - EV_LAST > 900) {
    EV_LAST = now;
    if (['craft', 'reinforce', 'evRepair'].includes(rt.task.a)) sfx('fix');
  }
  // 老鼠亂跑
  for (const e of E.list) if (e.k === 'rat' && !e.gone && (UIS.speed || 0) > 0) { const t = now / 1000 + e.id; e.dx = Math.sin(t * 1.7) * 0.45; e.dy = Math.cos(t * 1.3) * 0.25; }
  E.fx = (E.fx || []).filter(f => now - f.t0 < 1200);
  const g = document.getElementById('ev-layer'); if (g) g.innerHTML = evLayer(now);
}
requestAnimationFrame(evTick);

function evLayer(now) {
  const sv = S.sv, E = evState(), rt = rtState(), f = (UI.iso && UI.iso.floor) || '1F', P = isoProj(f);
  now = now || performance.now();
  let s = '';
  for (const e of E.list) {
    if (e.gone || (e.f || '1F') !== f) continue;
    const q = P(e.x + (e.dx || 0), e.y + (e.dy || 0), 0), pulse = 1 + Math.sin(now / 220) * 0.08;
    if (e.k === 'rat') s += '<g transform="translate(' + q[0].toFixed(1) + ' ' + q[1].toFixed(1) + ')"><ellipse cx="0" cy="0" rx="7" ry="4" fill="#6b625a" stroke="#1d2733" stroke-width="0.8"/><circle cx="6" cy="-1" r="3" fill="#6b625a" stroke="#1d2733" stroke-width="0.8"/><circle cx="7.5" cy="-2" r="0.8" fill="#111"/><path d="M-7 0 q -6 3 -10 -2" stroke="#b07d7d" stroke-width="1.2" fill="none"/></g>';
    else if (e.k === 'leak') { const k = (now % 1100) / 1100; s += '<ellipse cx="' + q[0] + '" cy="' + q[1] + '" rx="16" ry="7" fill="#7fb6dc" opacity="0.55"/><circle cx="' + q[0] + '" cy="' + (q[1] - 40 + k * 38).toFixed(1) + '" r="2" fill="#5f9fd0"/>'; }
    else if (e.k === 'walker') { const flash = e.hurtAt && now - e.hurtAt < 140; s += '<g transform="translate(' + q[0].toFixed(1) + ' ' + (q[1] + Math.sin(now / 300) * 1.5).toFixed(1) + ')"><rect x="-6" y="-16" width="12" height="15" rx="4" fill="' + (flash ? '#fff' : '#5e7258') + '" stroke="#1d2733"/><circle cx="0" cy="-21" r="6" fill="' + (flash ? '#fff' : '#8fa37f') + '" stroke="#1d2733"/><circle cx="-2.2" cy="-21.5" r="1.3" fill="#d6322a"/><circle cx="2.2" cy="-21.5" r="1.3" fill="#d6322a"/></g>'; }
    else if (e.k === 'broke') { for (let i = 0; i < 3; i++) { const k = ((now / 1400) + i / 3) % 1; s += '<circle cx="' + (q[0] + Math.sin(k * 6 + i) * 4).toFixed(1) + '" cy="' + (q[1] - 18 - k * 26).toFixed(1) + '" r="' + (4 + k * 6).toFixed(1) + '" fill="#8a8f96" opacity="' + (0.6 * (1 - k)).toFixed(2) + '" pointer-events="none"/>'; } }
    // 「！」泡泡
    s += '<g data-ev="' + e.id + '" style="cursor:pointer" transform="translate(' + q[0].toFixed(1) + ' ' + (q[1] - (e.k === 'walker' ? 44 : 30)).toFixed(1) + ') scale(' + pulse.toFixed(3) + ')"><circle r="22" fill="transparent"/><path d="M-11 -11 h22 a3 3 0 0 1 3 3 v14 a3 3 0 0 1 -3 3 h-7 l-4 5 l-4 -5 h-7 a3 3 0 0 1 -3 -3 v-14 a3 3 0 0 1 3 -3z" fill="' + (e.k === 'radio' ? '#f3f0e6' : '#ecd27a') + '" stroke="#1d2733" stroke-width="1.2"/><text y="4" text-anchor="middle" font-size="11" font-weight="800">' + (e.k === 'radio' ? '📻' : '！') + '</text></g>';
  }
  // 角色頭上：在做什麼
  if (rt.pos.f === f && rt.task) {
    const q = P(rt.pos.x, rt.pos.y, 0), walking = rt.path && rt.path.length, ic = walking ? '🚶' : TASK_IC[rt.task.a] || '…';
    s += '<g transform="translate(' + (q[0] + 16).toFixed(1) + ' ' + (q[1] - 50 + Math.sin(now / 260) * 1.5).toFixed(1) + ')" pointer-events="none"><circle r="10" fill="#f3f0e6" stroke="#1d2733" stroke-width="1"/><text y="4" text-anchor="middle" font-size="11">' + ic + '</text></g>';
  }
  for (const fx of E.fx || []) {
    const k = (now - fx.t0) / 1200, q = P(fx.x, fx.y, 0);
    s += '<text x="' + q[0].toFixed(1) + '" y="' + (q[1] - 58 - k * 20).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="800" fill="' + fx.col + '" stroke="#1d2733" stroke-width="2.4" paint-order="stroke" opacity="' + (1 - k).toFixed(2) + '" pointer-events="none">' + fx.txt + '</text>';
  }
  return s;
}
document.addEventListener('pointerdown', e => {
  const t = e.target.closest && e.target.closest('[data-ev]');
  if (!t) return;
  e.preventDefault(); e.stopPropagation();
  evResolve(Number(t.getAttribute('data-ev')));
}, true);

const _rtSceneEv = rtScene;
rtScene = function () { return _rtSceneEv().replace('</svg></div>', '<g id="ev-layer">' + evLayer() + '</g></svg></div>'); };
const _rtPanelEv = rtPanel;
rtPanel = function () {
  const sv = S.sv;
  let h = '';
  if (UI.evKnock) h += '<div class="sg-box" style="border-color:var(--ink);background:transparent"><div class="sg-h"><b style="color:inherit">有人在敲門</b></div><p class="meta">可能是需要幫忙的人，也可能不是人。</p><div class="row-btns"><button class="btn" data-a="evKnockOpen">開門看看</button><button class="btn ghost" data-a="evKnockIgnore">裝作沒人在家</button></div></div>';
  if (UI.evBeg) {
    const gifts = ['biscuit', 'can', 'sausage', 'noodle', 'choco', 'juice'].filter(k => sv_has(k) > 0);
    h += '<div class="sg-box" style="border-color:var(--ink);background:transparent"><div class="sg-h"><b style="color:inherit">餓壞的小孩</b></div><div class="row-btns">' + gifts.map(k => '<button class="btn" data-a="evBegGive" data-v="' + k + '">給' + ITEMS[k].n + '</button>').join('') + '<button class="btn ghost" data-a="evBegGive" data-v="">關門</button></div></div>';
  }
  const live = evState().list.filter(e => !e.gone);
  if (live.length) h += '<div class="meta" style="margin:6px 0">待處理：' + live.map(e => EV_TYPES[e.k].ic + ' ' + (e.k === 'broke' ? ITEMS[e.obj].n + '故障' : EV_TYPES[e.k].n)).join('、') + '（點畫面上的「！」）</div>';
  return h + _rtPanelEv();
};
window.__evSpawn = () => evSpawn();
