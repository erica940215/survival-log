/* ================= 2.5D 等角據點：設備和房間都是擺在地上的東西 ================= */
// 素材：放在 assets/iso/ 底下，檔名 obj_<種類>.png；有列在 ISO_ASSETS 裡才會用圖片，否則畫方塊
const ISO_ASSETS = {};          // 例：{ freezer: 'assets/iso/obj_freezer.png' }
const ISO_TILE_ASSETS = {};     // 例：{ floor: 'assets/iso/floor.png', floorB1: ..., wallL: ..., wallR: ... }

const ISO = {
  bed:        { n: '床', w: 2, d: 1, h: 18, c: '#c9b48a', fixed: true },
  toilet:     { n: '馬桶', w: 1, d: 1, h: 22, c: '#e6ecf0', fixed: true },
  bench:      { n: '工作台', w: 2, d: 1, h: 24, c: '#a7835a', fixed: true },
  freezer:    { n: '冰櫃', w: 1, d: 1, h: 38, c: '#cfe3ef' },
  microwave:  { n: '微波爐', w: 1, d: 1, h: 16, c: '#d5d5d5' },
  gen:        { n: '發電機', w: 2, d: 1, h: 28, c: '#d38b5d' },
  battery:    { n: '儲電站', w: 1, d: 1, h: 28, c: '#6f8fa8' },
  ac:         { n: '冷氣', w: 1, d: 1, h: 34, c: '#e8eef3' },
  heater:     { n: '暖爐', w: 1, d: 1, h: 24, c: '#9a4b3c' },
  lightbox:   { n: '種植箱', w: 2, d: 1, h: 22, c: '#7cbf7c' },
  pedal:      { n: '人力發電', w: 1, d: 1, h: 24, c: '#5d6b7a' },
  juicer:     { n: '榨汁機', w: 1, d: 1, h: 18, c: '#f2b134' },
  brewer:     { n: '釀酒機', w: 1, d: 1, h: 30, c: '#8c6a4f' },
  refinery:   { n: '精煉機', w: 2, d: 1, h: 34, c: '#6b6f78' },
  radar:      { n: '雷達', w: 1, d: 1, h: 32, c: '#4f7d6a' },
  bot_farm:   { n: '澆水機器人', w: 1, d: 1, h: 22, c: '#9fc3e0' },
  bot_fix:    { n: '修理機器人', w: 1, d: 1, h: 22, c: '#e0b39f' },
  bot_cook:   { n: '料理機器人', w: 1, d: 1, h: 22, c: '#e0d59f' },
  shelf:      { n: '置物架', w: 1, d: 1, h: 42, c: '#b89a6a' },
  potrack:    { n: '花盆架', w: 1, d: 1, h: 18, c: '#8fbf6a' },
  storage:    { n: '大儲物櫃', w: 2, d: 1, h: 44, c: '#a88b62', room: true },
  greenhouse: { n: '溫室架', w: 2, d: 1, h: 28, c: '#a3d9a3', room: true },
  workshop:   { n: '工具牆', w: 2, d: 1, h: 38, c: '#7d6a55', room: true },
  bedroom:    { n: '好床', w: 2, d: 1, h: 20, c: '#d9a7a7', room: true },
  powerroom:  { n: '配電盤', w: 1, d: 1, h: 40, c: '#58646f', room: true }
};
const ISO_FLOORS = { '1F': { n: '一樓', w: 6, h: 5 }, '2F': { n: '二樓', w: 6, h: 5 }, 'B1': { n: '地下室', w: 6, h: 4 } };
const ISO_WIN = { '1F': { y0: [1, 4], x0: [1, 3] }, '2F': { y0: [1, 3, 4], x0: [2] }, 'B1': { y0: [], x0: [] } };
const ISO_DOOR = { f: '1F', side: 'x0', at: 4 };

// 這一輪有哪些可以擺的東西（設備數量、房間、花盆架）
function isoObjects() {
  const sv = S.sv, st = sv.st, out = [];
  for (const k of ['bed', 'toilet', 'bench']) out.push({ id: k, k });
  for (const k of Object.keys(ISO)) {
    if (ISO[k].fixed || ISO[k].room || k === 'potrack') continue;
    for (let i = 0; i < (st[k] || 0); i++) out.push({ id: k + '#' + i, k });
  }
  for (let i = 0; i < Math.ceil((st.pot || 0) / 4); i++) out.push({ id: 'potrack#' + i, k: 'potrack' });
  if (typeof normRooms === 'function') normRooms();
  (sv.rooms || []).forEach((r, i) => { if (r && ISO[r]) out.push({ id: 'room#' + i, k: r }); });
  return out;
}
function footprint(o, p) { const D = ISO[o.k]; const w = p.r ? D.d : D.w, d = p.r ? D.w : D.d; const t = []; for (let x = 0; x < w; x++) for (let y = 0; y < d; y++) t.push([p.x + x, p.y + y]); return t; }
function occupied(f, skipId) {
  const sv = S.sv, set = new Set();
  for (const o of isoObjects()) { const p = sv.place[o.id]; if (!p || p.f !== f || o.id === skipId) continue; for (const [x, y] of footprint(o, p)) set.add(x + ',' + y); }
  return set;
}
function fits(o, p) {
  const F = ISO_FLOORS[p.f];
  if (!S.sv.floors.includes(p.f)) return false;
  const occ = occupied(p.f, o.id);
  return footprint(o, p).every(([x, y]) => x >= 0 && y >= 0 && x < F.w && y < F.h && !occ.has(x + ',' + y));
}
const FIXED_SPOT = { bed: { f: '1F', x: 4, y: 0, r: 0 }, toilet: { f: '1F', x: 5, y: 4, r: 0 }, bench: { f: '1F', x: 0, y: 2, r: 1 } };
function autoPlace(o) {
  const sv = S.sv;
  if (FIXED_SPOT[o.id] && fits(o, FIXED_SPOT[o.id])) { sv.place[o.id] = Object.assign({}, FIXED_SPOT[o.id]); return true; }
  for (const f of ['1F', '2F', 'B1']) {
    if (!sv.floors.includes(f)) continue;
    const F = ISO_FLOORS[f];
    for (let y = 0; y < F.h; y++) for (let x = 0; x < F.w; x++) for (const r of [0, 1]) {
      const p = { f, x, y, r };
      if (fits(o, p)) { sv.place[o.id] = p; return true; }
    }
  }
  return false;
}
// 新東西自動擺上去，放不下的進「還沒擺」清單；不存在的東西清掉
function isoSync() {
  const sv = S.sv;
  sv.place = sv.place || {};
  sv.tray = sv.tray || {};
  const objs = isoObjects(), ids = new Set(objs.map(o => o.id));
  for (const id of Object.keys(sv.place)) if (!ids.has(id)) delete sv.place[id];
  for (const id of Object.keys(sv.tray)) if (!ids.has(id)) delete sv.tray[id];
  for (const o of objs) {
    const p = sv.place[o.id];
    if (p && (!sv.floors.includes(p.f) || !fits(o, p))) delete sv.place[o.id];
    if (!sv.place[o.id] && !sv.tray[o.id]) { if (!autoPlace(o)) sv.tray[o.id] = true; }
  }
  return objs;
}

/* ---------- 擺放加成 ---------- */
const isWindow = (f, x, y) => { const W = ISO_WIN[f]; return (y === 0 && W.y0.includes(x)) || (x === 0 && W.x0.includes(y)); };
function placedOf(k) { const sv = S.sv; return isoObjects().filter(o => o.k === k && sv.place && sv.place[o.id]).map(o => ({ o, p: sv.place[o.id] })); }
function near(a, b, dist) {
  if (a.p.f !== b.p.f) return false;
  const A = footprint(a.o, a.p), B = footprint(b.o, b.p);
  return A.some(([x1, y1]) => B.some(([x2, y2]) => Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)) <= dist));
}
const nearWindow = it => it.p.f !== 'B1' && footprint(it.o, it.p).some(([x, y]) => isWindow(it.p.f, x, y));
function isoBonus() {
  if (!S || !S.sv || !S.sv.place) return { genQuiet: false, sleep: 0, crop: 1, cap: 0, freezer: 1, notes: [] };
  const notes = [];
  const gens = placedOf('gen'), beds = placedOf('bed').concat(placedOf('bedroom'));
  const loud = gens.concat(placedOf('refinery'), placedOf('pedal'));
  const genQuiet = gens.length > 0 && gens.every(g => g.p.f === 'B1');
  if (genQuiet) notes.push('發電機在地下室：發電的噪音減半');
  let sleep = 0;
  if (beds.length) {
    if (beds.some(b => gens.some(g => near(b, g, 1)))) { sleep = -10; notes.push('床緊貼發電機：睡覺體力 -10'); }
    else if (!beds.some(b => loud.some(l => near(b, l, 2)))) { sleep = 5; notes.push('床附近很安靜：睡覺體力 +5'); }
  }
  const grow = placedOf('lightbox').concat(placedOf('greenhouse'), placedOf('potrack'));
  const lit = grow.filter(nearWindow).length;
  const crop = grow.length ? 1 + 0.2 * lit / grow.length : 1;
  if (lit) notes.push(lit + ' 個種植設備靠窗：作物產量 +' + Math.round((crop - 1) * 100) + '%');
  const powers = gens.concat(placedOf('powerroom'));
  const cap = placedOf('battery').filter(b => powers.some(g => near(b, g, 1))).length * 5;
  if (cap) notes.push('儲電站接在發電機或配電盤旁：存電上限 +' + cap);
  const fz = placedOf('freezer');
  const freezer = fz.length && fz.every(f => f.p.f === 'B1') ? 0.5 : 1;
  if (freezer < 1) notes.push('冰櫃在地下室比較涼：耗電減半');
  return { genQuiet, sleep, crop, cap, freezer, notes };
}
const _powerCapIso = powerCap;
powerCap = function () { return _powerCapIso() + isoBonus().cap; };
const _genIso = SACT.gen;
SACT.gen = function () { const n0 = S.sv.noise || 0; _genIso(); if ((S.sv.noise || 0) > n0 && isoBonus().genQuiet) S.sv.noise -= Math.round((S.sv.noise - n0) / 2); };

/* ---------- 操作 ---------- */
Object.assign(SACT, {
  isoFloor(f) { if (!S.sv.floors.includes(f)) return; UI.iso = Object.assign(UI.iso || {}, { floor: f, moving: false }); render(); },
  isoObj(id) { UI.iso = Object.assign(UI.iso || {}, { sel: UI.iso && UI.iso.sel === id && !UI.iso.moving ? null : id, moving: false }); render(); },
  isoMove() { if (!UI.iso || !UI.iso.sel) return; UI.iso.moving = true; render(); },
  isoTile(v) {
    const [f, x, y] = String(v).split(','); const I = UI.iso || {};
    if (!I.moving || !I.sel) { if (I.sel) { I.sel = null; render(); } return; }
    const o = isoObjects().find(q => q.id === I.sel); if (!o) return;
    const cur = S.sv.place[o.id];
    const p = { f, x: Number(x), y: Number(y), r: cur ? cur.r : 0 };
    if (!fits(o, p)) { p.r = 1 - p.r; if (!fits(o, p)) { slog('那裡放不下' + ISO[o.k].n + '。'); render(); return; } }
    S.sv.place[o.id] = p; delete S.sv.tray[o.id];
    I.moving = false;
    slog('把' + ISO[o.k].n + '搬到' + ISO_FLOORS[f].n + '。');
    render();
  },
  isoRotate() {
    const I = UI.iso || {}, o = isoObjects().find(q => q.id === I.sel), p = o && S.sv.place[o.id];
    if (!p) return;
    const np = Object.assign({}, p, { r: 1 - p.r });
    if (fits(o, np)) { S.sv.place[o.id] = np; render(); } else { slog('轉不過去，旁邊有東西擋著。'); render(); }
  },
  isoStore() { const I = UI.iso || {}; if (!I.sel || ISO[(isoObjects().find(q => q.id === I.sel) || {}).k] === undefined) return; delete S.sv.place[I.sel]; S.sv.tray[I.sel] = true; I.moving = false; render(); },
  isoPlaceTray(id) { UI.iso = Object.assign(UI.iso || {}, { sel: id, moving: true }); render(); },
  isoUse() {
    const I = UI.iso || {}, o = isoObjects().find(q => q.id === I.sel); if (!o) return;
    const k = o.k;
    if (k === 'gen') return SACT.gen();
    if (k === 'pedal') return SACT.pedal();
    if (['freezer', 'lightbox', 'ac', 'bot_farm', 'bot_fix', 'bot_cook'].includes(k)) return SACT.toggle(k);
    if (k === 'toilet') return SACT.wash();
    if (k === 'bed' || k === 'bedroom') { UI.tab = 'act'; render(); return; }
    if (k === 'bench' || k === 'workshop' || k === 'juicer' || k === 'brewer' || k === 'refinery' || k === 'microwave') { UI.tab = 'act'; render(); return; }
    if (k === 'storage' || k === 'shelf') { UI.tab = 'store'; render(); return; }
  }
});

/* ---------- 畫面 ---------- */
const IW = 32, IH = 16, WALL = 64;
function isoSVG() {
  if (camTop()) return topSVG();
  const sv = S.sv, objs = isoSync();
  const I = UI.iso = UI.iso || {};
  if (!I.floor || !sv.floors.includes(I.floor)) I.floor = '1F';
  const f = I.floor, F = ISO_FLOORS[f];
  const ox = F.h * IW + 20, oy = WALL + 18;
  const P = (x, y, z) => [ox + (x - y) * IW, oy + (x + y) * IH - (z || 0)];
  const pt = a => a.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ');
  const width = (F.w + F.h) * IW + 40, height = oy + (F.w + F.h) * IH + 26;
  const dark = f === 'B1';
  let s = '';
  // 牆
  const wallC = dark ? '#5b5f66' : '#e9e2d2', wallC2 = dark ? '#4b4f56' : '#ddd5c3';
  if (ISO_TILE_ASSETS.wallR) s += '<image href="' + ISO_TILE_ASSETS.wallR + '" x="' + P(0, 0)[0] + '" y="' + (P(0, 0)[1] - WALL) + '" width="' + F.w * IW + '" height="' + (F.w * IH + WALL) + '" preserveAspectRatio="none"/>';
  else s += '<polygon points="' + pt([P(0, 0), P(F.w, 0), P(F.w, 0, WALL), P(0, 0, WALL)]) + '" fill="' + wallC + '" stroke="' + INK + '" stroke-width="1.2"/>';
  if (ISO_TILE_ASSETS.wallL) s += '<image href="' + ISO_TILE_ASSETS.wallL + '" x="' + P(0, F.h)[0] + '" y="' + (P(0, 0)[1] - WALL) + '" width="' + F.h * IW + '" height="' + (F.h * IH + WALL) + '" preserveAspectRatio="none"/>';
  else s += '<polygon points="' + pt([P(0, 0), P(0, F.h), P(0, F.h, WALL), P(0, 0, WALL)]) + '" fill="' + wallC2 + '" stroke="' + INK + '" stroke-width="1.2"/>';
  // 窗與門
  for (const x of ISO_WIN[f].y0) s += '<polygon points="' + pt([P(x + 0.2, 0, 22), P(x + 0.8, 0, 22), P(x + 0.8, 0, 50), P(x + 0.2, 0, 50)]) + '" fill="#bcd6ea" stroke="' + INK + '" stroke-width="1"/>';
  for (const y of ISO_WIN[f].x0) s += '<polygon points="' + pt([P(0, y + 0.2, 22), P(0, y + 0.8, 22), P(0, y + 0.8, 50), P(0, y + 0.2, 50)]) + '" fill="#bcd6ea" stroke="' + INK + '" stroke-width="1"/>';
  if (f === ISO_DOOR.f) { const y = ISO_DOOR.at; const ratio = sv.def / sv.defMax; s += '<polygon points="' + pt([P(0, y + 0.15, 0), P(0, y + 0.85, 0), P(0, y + 0.85, 46), P(0, y + 0.15, 46)]) + '" fill="' + (ratio > 0.7 ? '#2f6b3f' : ratio > 0.35 ? '#a8661a' : RED) + '" stroke="' + INK + '" stroke-width="1.2"/>'; }
  // 地板（可以點）
  const occ = occupied(f, I.moving ? I.sel : null);
  for (let y = 0; y < F.h; y++) for (let x = 0; x < F.w; x++) {
    const win = isWindow(f, x, y);
    const fill = ISO_TILE_ASSETS[dark ? 'floorB1' : 'floor'] ? 'transparent' : dark ? ((x + y) % 2 ? '#3d4249' : '#43484f') : ((x + y) % 2 ? '#efe6d2' : '#f6efde');
    s += '<polygon data-a="isoTile" data-v="' + f + ',' + x + ',' + y + '" points="' + pt([P(x, y), P(x + 1, y), P(x + 1, y + 1), P(x, y + 1)]) + '" fill="' + (I.moving && !occ.has(x + ',' + y) ? 'rgba(236,210,122,0.55)' : fill) + '" stroke="' + (dark ? '#2a2e33' : '#d8ccb2') + '" stroke-width="1"/>';
    if (win && !dark) s += '<polygon points="' + pt([P(x + 0.3, y + 0.3), P(x + 0.7, y + 0.3), P(x + 0.7, y + 0.7), P(x + 0.3, y + 0.7)]) + '" fill="rgba(255,236,160,0.5)" pointer-events="none"/>';
  }
  // 物件（由後往前畫）
  const here = objs.map(o => ({ o, p: sv.place[o.id] })).filter(it => it.p && it.p.f === f);
  const depth = it => { const D = ISO[it.o.k], w = it.p.r ? D.d : D.w, d = it.p.r ? D.w : D.d; return (it.p.x + w / 2) + (it.p.y + d / 2); };
  here.sort((a, b) => depth(a) - depth(b));
  for (const { o, p } of here) {
    const D = ISO[o.k], w = p.r ? D.d : D.w, d = p.r ? D.w : D.d, h = D.h, sel = I.sel === o.id;
    const shade = (c, k) => { const n = parseInt(c.slice(1), 16); const r = Math.round(((n >> 16) & 255) * k), g = Math.round(((n >> 8) & 255) * k), b = Math.round((n & 255) * k); return 'rgb(' + r + ',' + g + ',' + b + ')'; };
    let g = '<g data-a="isoObj" data-v="' + o.id + '" style="cursor:pointer' + (I.moving ? ';pointer-events:none;opacity:' + (sel ? 0.35 : 1) : '') + '">';
    if (ISO_ASSETS[o.k]) {
      const base = P(p.x + w, p.y + d), left = P(p.x, p.y + d), right = P(p.x + w, p.y);
      const iw = right[0] - left[0], ih = iw * 1.25;
      g += '<image href="' + ISO_ASSETS[o.k] + '" x="' + left[0] + '" y="' + (base[1] - ih) + '" width="' + iw + '" height="' + ih + '"' + (p.r ? ' transform="translate(' + (2 * (left[0] + iw / 2)) + ',0) scale(-1,1)"' : '') + '/>';
    } else {
      g += '<polygon points="' + pt([P(p.x, p.y + d), P(p.x + w, p.y + d), P(p.x + w, p.y + d, h), P(p.x, p.y + d, h)]) + '" fill="' + shade(D.c, 0.82) + '" stroke="' + INK + '" stroke-width="1"/>';
      g += '<polygon points="' + pt([P(p.x + w, p.y), P(p.x + w, p.y + d), P(p.x + w, p.y + d, h), P(p.x + w, p.y, h)]) + '" fill="' + shade(D.c, 0.68) + '" stroke="' + INK + '" stroke-width="1"/>';
      g += '<polygon points="' + pt([P(p.x, p.y, h), P(p.x + w, p.y, h), P(p.x + w, p.y + d, h), P(p.x, p.y + d, h)]) + '" fill="' + D.c + '" stroke="' + INK + '" stroke-width="1"/>';
      const c = P(p.x + w / 2, p.y + d / 2, h);
      g += '<text x="' + c[0] + '" y="' + (c[1] + 4) + '" font-size="10.5" text-anchor="middle" fill="#1d2733" font-family="Noto Sans TC, sans-serif" pointer-events="none">' + D.n.slice(0, 3) + '</text>';
    }
    if (sel) g += '<polygon points="' + pt([P(p.x, p.y), P(p.x + w, p.y), P(p.x + w, p.y + d), P(p.x, p.y + d)]) + '" fill="none" stroke="' + RED + '" stroke-width="2.5" stroke-dasharray="5 3" pointer-events="none"/>';
    s += g + '</g>';
  }
  return '<div class="iso"><svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' + F.n + '的擺設">' + s + '</svg></div>';
}
function viewIso() {
  const sv = S.sv, I = UI.iso || {};
  isoSync();
  let h = '<div class="setrow" style="margin-top:10px">' + ['1F', '2F', 'B1'].filter(f => sv.floors.includes(f)).map(f => '<button class="pill' + ((I.floor || '1F') === f ? ' on' : '') + '" data-a="isoFloor" data-v="' + f + '">' + ISO_FLOORS[f].n + '</button>').join('') + '</div>';
  h += isoSVG() + viewCamPick();
  const sel = I.sel && isoObjects().find(o => o.id === I.sel);
  if (sel) {
    const D = ISO[sel.k], p = sv.place[sel.id];
    const usable = { gen: '發電', pedal: '踩', freezer: '開關', lightbox: '開關', ac: '開關', bot_farm: '開關', bot_fix: '開關', bot_cook: '開關', toilet: '清理', bed: '去睡覺', bedroom: '去睡覺', bench: '去製作', workshop: '去製作', juicer: '去榨汁', brewer: '去釀酒', refinery: '去精煉', microwave: '去煮飯', storage: '看倉庫', shelf: '看倉庫' }[sel.k];
    h += '<div class="roompanel"><div class="slot-h"><b>' + D.n + '</b>' + (p ? '<span class="tag">' + ISO_FLOORS[p.f].n + '</span>' : '<span class="tag red">還沒擺</span>') + '</div>' +
      (I.moving ? '<p class="meta">點地板上亮起來的格子放下去。2 格長的東西放不下時會自動轉向。</p>' : '') +
      '<div class="row-btns" style="margin:6px 0 0">' + (usable ? '<button class="btn" data-a="isoUse">' + usable + '</button>' : '') +
      '<button class="btn ghost" data-a="isoMove">' + (I.moving ? '選位置中…' : '移動') + '</button>' + (D.w !== D.d ? '<button class="btn ghost" data-a="isoRotate">轉向</button>' : '') +
      '<button class="btn ghost" data-a="isoStore">收起來</button></div></div>';
  } else h += '<p class="meta">點東西可以移動、轉向、收起或直接使用。換樓層看其他房間。</p>';
  const tray = Object.keys(sv.tray || {});
  if (tray.length) h += '<div class="cat">還沒擺的東西</div><div class="sheet">' + tray.map(id => { const o = isoObjects().find(q => q.id === id); return o ? actRow(ISO[o.k].n, ISO[o.k].w + '×' + ISO[o.k].d + ' 格 · 沒擺的設備一樣能用，只是沒有擺放加成', '擺', 'isoPlaceTray', id, true) : ''; }).join('') + '</div>';
  const b = isoBonus();
  h += '<div class="cat">擺放效果</div>' + (b.notes.length ? '<ul class="list">' + b.notes.map(n => '<li>' + esc(n) + '</li>').join('') + '</ul>' : '<p class="empty">還沒有。發電機放地下室比較安靜、種植箱靠窗（地上有光的格子）產量高、儲電站接在發電機旁、床遠離吵的機器。</p>');
  return h;
}
// 剖面圖點房間：跳到 2.5D 據點並選取那件東西
SACT.roomTap = function (v) {
  normRooms();
  const i = Number(v), r = S.sv.rooms[i];
  UI.tab = 'base';
  UI.iso = Object.assign(UI.iso || {}, { floor: FLOOR_OF[i], sel: r ? 'room#' + i : null, moving: false });
  if (!r) UI.roomSel = i;
  render(); window.scrollTo(0, 0);
};
