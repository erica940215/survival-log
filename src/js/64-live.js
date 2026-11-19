/* ================= 生動化：家裡的角色、動畫、光線、天氣 ================= */
const isoProj = f => { if (camTop()) return topProj(f); const F = ISO_FLOORS[f]; const ox = F.h * IW + 20, oy = WALL + 18; return (x, y, z) => [ox + (x - y) * IW, oy + (x + y) * IH - (z || 0)]; };
function objTile(k) {
  const sv = S.sv; if (!sv || !sv.place) return null;
  const ks = k.split('|');
  for (const kk of ks) {
    const o = isoObjects().find(q => q.k === kk && sv.place[q.id]);
    if (o) { const p = sv.place[o.id], D = ISO[o.k], w = p.r ? D.d : D.w, d = p.r ? D.w : D.d; return { f: p.f, x: p.x + w / 2, y: p.y + d + 0.55, o }; }
  }
  return null;
}
const DOOR_SPOT = { f: '1F', x: 0.6, y: 4.5 };
// 動作會讓角色走到哪裡
const WALK_TO = { gen: 'gen', pedal: 'pedal', cookx: 'microwave|bench', craft: 'bench|workshop', reinforce: 'DOOR', rest: 'bed|bedroom', wash: 'toilet', plant: 'lightbox|greenhouse|potrack', refine: 'refinery', brew: 'brewer', juice: 'juicer', buildRoom: 'bench', eatFull: 'freezer|microwave|bench', drinkFull: 'toilet|freezer', toggle: 'ARG', isoUse: 'SEL', useItem: 'bed', cure: 'bed', heal: 'bed', demolish: 'bench' };
function liveStats() { const sv = S.sv; return { power: sv.power, def: sv.def, sat: sv.sat, hyd: sv.hyd, hyg: sv.hyg || 0, mor: sv.mor, sta: sv.sta, hp: sv.hp }; }
const STAT_NAME = { power: '電', def: '防線', sat: '飽足', hyd: '水分', hyg: '衛生', mor: '心態', sta: '體力', hp: '生命' };
for (const [act, where] of Object.entries(WALK_TO)) {
  const base = SACT[act]; if (!base) continue;
  SACT[act] = function (v) {
    if (!S.sv || S.sv.out) return base.apply(this, arguments);
    const before = liveStats(), h0 = S.sv.hour;
    let target = null;
    if (where === 'DOOR') target = DOOR_SPOT;
    else if (where === 'ARG') target = objTile(v);
    else if (where === 'SEL') { const o = UI.iso && UI.iso.sel && isoObjects().find(q => q.id === UI.iso.sel); target = o ? objTile(o.k) : null; }
    else target = objTile(where);
    const from = UI.cpos ? Object.assign({}, UI.cpos) : null;
    base.apply(this, arguments);
    if (S.phase !== 'survive' || !S.sv) return;
    const after = liveStats();
    const diffs = Object.keys(after).map(k => [k, k === 'power' ? Math.round((after[k] - before[k]) * 10) / 10 : Math.round(after[k] - before[k])]).filter(([k, d]) => d !== 0 && Math.abs(d) >= (k === 'power' ? 0.1 : 2) && !((k === 'sat' || k === 'hyd') && S.sv.hour > h0 && Math.abs(d) < 5));
    const good = diffs.filter(([, d]) => d > 0).concat(diffs.filter(([k, d]) => d < 0 && k !== 'sta'));
    if (target) {
      UI.cpos = { f: target.f, x: target.x, y: target.y };
      UI.walk = { from: from && from.f === target.f ? from : null, ts: Date.now(), label: good.slice(0, 2).map(([k, d]) => (d > 0 ? '+' : '') + d + ' ' + STAT_NAME[k]).join('  '), act };
      if (UI.iso) UI.iso.floor = target.f; else UI.iso = { floor: target.f };
      render();
    }
  };
}

// 每次畫 2.5D 房子時加上活的東西
const _isoSVGLive = isoSVG;
isoSVG = function () {
  const html = _isoSVGLive();
  const sv = S.sv, I = UI.iso || {}, f = I.floor || '1F', F = ISO_FLOORS[f], P = isoProj(f);
  const pt = a => a.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ');
  const anim = !reduceMotion();
  let s = '';
  const d = sv.day, hr = sv.hour, cold = inCold(d), rain = inRain(d), ty = typeof isTyphoon === 'function' && isTyphoon(d);
  // 窗外天氣
  if (f !== 'B1') {
    const wins = ISO_WIN[f].y0.map(x => [x, 0, 'y']).concat(ISO_WIN[f].x0.map(y => [0, y, 'x']));
    for (const [wx, wy, side] of wins) {
      let c = side === 'y' ? P(wx + 0.5, 0, 36) : P(0, wy + 0.5, 36);
      if (camTop()) { const o = P(0, 0); c = side === 'y' ? [P(wx + 0.5, 0)[0], o[1] - TWALL + 30] : [o[0] - 9, P(0, wy + 0.5)[1] - 4]; }
      const big = camTop() && side === 'y' ? 14 : 9;
      if (hr >= 20 || hr < 6) s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + big + '" fill="#1c2a44" opacity="0.55"/>';
      if (rain || ty) for (let i = 0; i < (ty ? 4 : 2); i++) s += '<line class="' + (anim ? 'lv-rain' : '') + '" x1="' + (c[0] - 6 + i * 4) + '" y1="' + (c[1] - 10) + '" x2="' + (c[0] - 8 + i * 4) + '" y2="' + (c[1] - 4) + '" stroke="#5f86b0" stroke-width="1.2" style="animation-delay:' + (i * 0.17) + 's"/>';
      if (cold) for (let i = 0; i < 3; i++) s += '<circle class="' + (anim ? 'lv-snow' : '') + '" cx="' + (c[0] - 6 + i * 6) + '" cy="' + (c[1] - 8) + '" r="1.4" fill="#fff" style="animation-delay:' + (i * 0.4) + 's"/>';
      if (!rain && !ty && !cold && hr >= 8 && hr < 17) s += '<circle cx="' + (c[0] + 3) + '" cy="' + (c[1] - 5) + '" r="3" fill="#f6d36b" opacity="0.8"/>';
    }
  }
  // 作物：種植設備上長出葉子
  const grow = ['lightbox', 'greenhouse', 'potrack'];
  const plants = sv.plants || [];
  let pi = 0;
  for (const o of isoObjects()) {
    const p = sv.place[o.id]; if (!p || p.f !== f || !grow.includes(o.k)) continue;
    const D = ISO[o.k], w = p.r ? D.d : D.w, dd = p.r ? D.w : D.d;
    const n = o.k === 'potrack' ? 2 : 4;
    for (let i = 0; i < n && pi < plants.length; i++, pi++) {
      const pl = plants[pi], g = Math.min(1, (pl.age + 1) / 8);
      const c = P(p.x + (i % 2 + 0.5) * w / 2, p.y + (Math.floor(i / 2) % 2 + 0.5) * dd / 2, D.h);
      const col = g >= 1 ? (pl.k === 'tomato_p' ? '#c94a3a' : pl.k === 'straw_p' ? '#d8506a' : '#c8a63a') : '#4f9a4f';
      s += '<g class="' + (anim ? 'lv-sway' : '') + '" style="transform-origin:' + c[0] + 'px ' + c[1] + 'px"><path d="M' + c[0] + ' ' + c[1] + ' q -3 ' + (-8 * g) + ' -6 ' + (-10 * g) + ' M' + c[0] + ' ' + c[1] + ' q 3 ' + (-8 * g) + ' 6 ' + (-11 * g) + '" stroke="#3f8a3f" stroke-width="1.6" fill="none"/>' + (g >= 1 ? '<circle cx="' + c[0] + '" cy="' + (c[1] - 9) + '" r="2.4" fill="' + col + '"/>' : '') + '</g>';
    }
  }
  // 機器運轉：有電的設備亮綠燈；剛發電的發電機冒煙
  const powered = sv.powered || {};
  for (const o of isoObjects()) {
    const p = sv.place[o.id]; if (!p || p.f !== f) continue;
    const D = ISO[o.k], w = p.r ? D.d : D.w, dd = p.r ? D.w : D.d;
    const on = (['freezer', 'lightbox', 'bot_farm', 'bot_fix', 'bot_cook', 'ac'].includes(o.k) && powered[o.k] && sv.dev[o.k]) || o.k === 'battery' && sv.power > 0;
    if (on) { const c = P(p.x + w, p.y + dd * 0.5, D.h * 0.6); s += '<circle class="' + (anim ? 'lv-led' : '') + '" cx="' + (c[0] - 4) + '" cy="' + c[1] + '" r="2.2" fill="#46d16a"/>'; }
    if (o.k === 'lightbox' && on) { const c = P(p.x + w / 2, p.y + dd / 2, D.h + 10); s += '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="22" ry="6" fill="#c77dff" opacity="0.25"/>'; }
    if (o.k === 'gen' && UI.walk && UI.walk.act === 'gen' && Date.now() - UI.walk.ts < 6000) {
      const c = P(p.x + w * 0.3, p.y + dd * 0.3, D.h + 4);
      for (let i = 0; i < 3; i++) s += '<circle class="' + (anim ? 'lv-smoke' : '') + '" cx="' + c[0] + '" cy="' + c[1] + '" r="' + (4 + i) + '" fill="#8a8f96" opacity="0.5" style="animation-delay:' + (i * 0.45) + 's"/>';
    }
  }
  // 屍潮夜：門外的屍群
  const hz = hordeOn(d);
  if (hz && f === '1F' && hr >= 17) {
    const n = Math.min(5, 1 + Math.floor(hz[1] / 60));
    for (let i = 0; i < n; i++) { const c = P(-0.9 - (i % 2) * 0.5, 3.6 + i * 0.35, 0); s += '<g class="' + (anim ? 'lv-zbob' : '') + '" style="animation-delay:' + (i * 0.3) + 's">' + zombie(c[0], c[1], 0.75) + '</g>'; }
  }
  // 狗
  if (sv.dog && sv.dog.state === 'pet' && f === '1F') { const c = P(3.3, 3.6, 0); s += '<g class="' + (anim ? 'lv-dog' : '') + '"><ellipse cx="' + c[0] + '" cy="' + (c[1] - 5) + '" rx="8" ry="4.5" fill="#7a5a3a"/><circle cx="' + (c[0] + 8) + '" cy="' + (c[1] - 10) + '" r="4" fill="#7a5a3a"/><path d="M' + (c[0] - 8) + ' ' + (c[1] - 7) + ' l -4 -4" stroke="#7a5a3a" stroke-width="2" class="' + (anim ? 'lv-tail' : '') + '"/></g>'; }
  // 角色
  if (!UI.cpos) { const t = objTile('bed|bedroom'); UI.cpos = t ? { f: t.f, x: t.x, y: t.y } : { f: '1F', x: 3, y: 3 }; }
  const cp = UI.cpos;
  if (cp.f === f) {
    const to = P(cp.x, cp.y, 0);
    const w = UI.walk, fresh = w && Date.now() - w.ts < 1200;
    const from = fresh && w.from ? P(w.from.x, w.from.y, 0) : to;
    const sleeping = hr >= LAST_HOUR;
    s += '<g id="iso-char" data-to="' + to[0].toFixed(1) + ',' + to[1].toFixed(1) + '" data-from="' + from[0].toFixed(1) + ',' + from[1].toFixed(1) + '" style="transform:translate(' + (fresh ? from : to)[0].toFixed(1) + 'px,' + (fresh ? from : to)[1].toFixed(1) + 'px)" pointer-events="none">' +
      '<ellipse cx="0" cy="0" rx="7" ry="3" fill="rgba(0,0,0,0.18)"/>' +
      '<g transform="scale(1.4)"><g class="' + (anim ? 'lv-bob' : '') + '"><rect x="-4.5" y="-17" width="9" height="12" rx="3" fill="#3b5b8a" stroke="#1d2733" stroke-width="1"/><circle cx="0" cy="-22" r="5" fill="#f1d3b3" stroke="#1d2733" stroke-width="1"/><path d="M-5 -24 q5 -6 10 0" fill="#2b2b2b"/>' +
      '<rect x="-4" y="-6" width="3" height="6" fill="#2a3442"/><rect x="1" y="-6" width="3" height="6" fill="#2a3442"/></g></g>' +
      (sleeping ? '<text class="' + (anim ? 'lv-z' : '') + '" x="8" y="-28" font-size="10" fill="#5f6873">z z</text>' : '') + '</g>';
    if (w && w.label && Date.now() - w.ts < 2600) s += '<text class="' + (anim ? 'lv-float' : '') + '" x="' + to[0].toFixed(1) + '" y="' + (to[1] - 44).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#1d2733" stroke="#f3f0e6" stroke-width="3" paint-order="stroke">' + esc(w.label) + '</text>';
  }
  // 日夜光線
  const { w: width, h: height } = sceneSize(f);
  let tint = '';
  if (f === 'B1') tint = 'rgba(20,24,32,0.18)';
  else if (hr >= 20 || hr < 6) tint = 'rgba(18,28,60,0.32)';
  else if (hr >= 17) tint = 'rgba(230,120,40,0.14)';
  if (ty) tint = 'rgba(40,50,70,0.25)';
  if (tint) s += '<rect x="0" y="0" width="' + width + '" height="' + height + '" fill="' + tint + '" pointer-events="none"/>';
  if ((hr >= 20 || hr < 6) && f !== 'B1') { const c = P(2.5, 2, 0); s += '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="90" ry="45" fill="rgba(255,214,120,0.22)" pointer-events="none"/>'; }
  return html.replace('</svg></div>', s + '</svg></div>');
};

// 畫完後讓角色真的走過去
const _renderLive = render;
render = function () {
  _renderLive();
  const el = document.getElementById('iso-char');
  if (!el || !UI.walk || Date.now() - UI.walk.ts > 1200 || reduceMotion()) return;
  const [tx, ty] = el.getAttribute('data-to').split(',');
  requestAnimationFrame(() => { el.style.transition = 'transform 0.9s ease-in-out'; el.style.transform = 'translate(' + tx + 'px,' + ty + 'px)'; });
};

// 行動分頁也顯示活的房子（點東西會跳到據點分頁）
function isoLive() {
  const svg = isoSVG();
  return svg.replace('<div class="iso">', '<div class="iso live">').replace(/data-a="isoObj"/g, 'data-a="isoJump"').replace(/data-a="isoTile"[^>]*?(?=points)/g, '');
}
SACT.isoJump = function (id) { UI.tab = 'base'; UI.iso = Object.assign(UI.iso || {}, { sel: id, moving: false }); render(); window.scrollTo(0, 0); };

// 外出：角色在場景裡，暴露值越高屍群越近
const _viewOutLive = viewOut;
viewOut = function () {
  const h = _viewOutLive(), o = S.sv.out; if (!o) return h;
  const anim = !reduceMotion();
  const searched = S.sv.locs[o.loc] ? S.sv.locs[o.loc].done.length : 0;
  const cx = 70 + Math.min(6, searched) * 34;
  let add = '<g class="' + (anim ? 'lv-bob' : '') + '" transform="translate(' + cx + ' 118) scale(1.35)"><rect x="-4.5" y="-17" width="9" height="12" rx="3" fill="#3b5b8a" stroke="#1d2733"/><circle cx="0" cy="-22" r="5" fill="#f1d3b3" stroke="#1d2733"/><rect x="-4" y="-6" width="3" height="6" fill="#2a3442"/><rect x="1" y="-6" width="3" height="6" fill="#2a3442"/><path d="M4 -16 l10 -2" stroke="#7a5a3a" stroke-width="2.5"/></g>';
  const zn = Math.min(5, Math.floor(o.exp / 22));
  for (let i = 0; i < zn; i++) add += '<g class="' + (anim ? 'lv-zbob' : '') + '" style="animation-delay:' + (i * 0.25) + 's">' + zombie(352 - i * (14 + o.exp / 12), 118, 0.85) + '</g>';
  if (o.enc && o.enc.t === 'z') for (let i = 0; i < o.enc.n; i++) add += zombie(cx + 30 + i * 16, 118, 0.95);
  return h.replace('</svg></div>', add + '</svg></div>');
};
// 準備期：角色站在店門口
const _sceneLive = sceneSVG;
sceneSVG = function (kind) {
  const h = _sceneLive(kind);
  if (!S || S.phase !== 'play' || h.indexOf('<svg') < 0) return h;
  const add = '<g class="' + (reduceMotion() ? '' : 'lv-bob') + '" transform="translate(332 118) scale(1.35)"><rect x="-4.5" y="-17" width="9" height="12" rx="3" fill="#3b5b8a" stroke="#1d2733"/><circle cx="0" cy="-22" r="5" fill="#f1d3b3" stroke="#1d2733"/><rect x="-4" y="-6" width="3" height="6" fill="#2a3442"/><rect x="1" y="-6" width="3" height="6" fill="#2a3442"/>' + (S.car ? '' : '<rect x="4" y="-16" width="6" height="9" rx="2" fill="#b8322a" stroke="#1d2733"/>') + '</g>';
  return h.replace('</svg></div>', add + '</svg></div>');
};
