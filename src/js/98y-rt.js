/* ================= 即時版守家：時間流動、角色走動、點設備做事 ================= */
// 1 倍速：遊戲 1 小時 = 現實 30 秒
const RT_SPEEDS = [0, 1, 3, 8];
const RT_MIN_PER_SEC = 2;
const rtOn = () => UIS.rt !== false;
const rtActive = () => rtOn() && S && S.phase === 'survive' && S.sv && !S.sv.out && UI.tab === 'act';
function rtState() {
  const sv = S.sv;
  if (!sv.rt) sv.rt = { frac: 0, task: null, queue: [], path: [] };
  if (!sv.rt.pos) { const t = objTile('bed|bedroom'); sv.rt.pos = t ? { f: t.f, x: t.x, y: Math.min(t.y, ISO_FLOORS[t.f].h - 0.5) } : { f: '1F', x: 3, y: 3 }; }
  return sv.rt;
}
if (UIS.speed == null) UIS.speed = 1;

/* ---------- 每個東西能做什麼 ---------- */
function rtActions(k) {
  const sv = S.sv, st = sv.st, hz = hordeOn(sv.day), A = [];
  const add = (label, a, v, h, ok, note) => A.push({ label, a, v, h, ok: ok !== false, note: note || '' });
  if (k === 'gen') add('發電（燒 1 桶柴油，+6 度）', 'gen', '', 1, st.diesel > 0, '柴油 ' + (st.diesel || 0) + ' 桶');
  if (k === 'pedal') add('踩發電機（+1.5 度）', 'pedal', '', 1, sv.sta >= staCost(20));
  if (k === 'microwave' || (k === 'bench' && !st.microwave)) {
    if (st.microwave) for (const c of Object.keys(COOKS)) add('煮' + COOKS[c].n, 'cookx', c, 1, sv.power >= COOKS[c].power, COOKS[c].d);
    else add('沒有微波爐，不能煮', '', '', 0, false);
  }
  if (k === 'bench' || k === 'workshop') for (const r of knownRecipes()) { const R = RECIPES[r]; add('做' + R.n, 'craft', r, craftHours(R.h), canCraft(r) && !(R.defLv && defLv() < R.defLv), Object.entries(R.need).map(([m, n]) => ITEMS[m].n + (st[m] || 0) + '/' + n).join(' ')); }
  if (k === 'bed' || k === 'bedroom') { add('休息（心態 +12）', 'rest', '', 1); add(hz ? '睡覺（今晚屍潮）' : '睡覺到明天 08:00', 'sleep', '', 0); if (hz) add('守夜（屍潮傷害 -40%）', 'watch', '', 0); }
  if (k === 'toilet') add('清理身體和廁所（衛生 +35）', 'wash', '', 1, sv.day <= 5 || st.wu >= 1);
  if (['lightbox', 'greenhouse', 'potrack'].includes(k)) for (const s of ['tomato', 'straw', 'rape']) if (st[s]) add('種' + ITEMS[s].n, 'plant', s, 1, freeSlots() > 0);
  if (k === 'freezer') { add('吃到飽', 'eatFull', '', 0, sv.sat < 85); add('喝到滿', 'drinkFull', '', 0, sv.hyd < 85); }
  if (k === 'refinery') add('精煉柴油', 'refine', '', 2);
  if (k === 'brewer') add('釀酒', 'brew', '', 2);
  if (k === 'juicer') add('榨果汁', 'juice', '', 1);
  if (['freezer', 'lightbox', 'ac', 'bot_farm', 'bot_fix', 'bot_cook'].includes(k)) add((sv.dev[k] ? '關掉' : '打開') + ITEMS[k].n, 'toggle', k, 0);
  if (k === 'storage' || k === 'shelf') add('打開倉庫', 'TAB', 'store', 0);
  if (k === 'DOOR') {
    for (const m of ['metal', 'board', 'glass']) if (st[m]) add('用' + ITEMS[m].n + '加固（+' + REINFORCE[m] + '）', 'reinforce', m, 1, !sv.sick && sv.def < sv.defMax * 1.5, '剩 ' + st[m]);
    add('外出搜刮', 'TAB', 'out', 0);
    if (hz) add('在門口守夜', 'watch', '', 0);
  }
  return A;
}
const RT_SPOT = { eatFull: 'freezer|microwave|bench', drinkFull: 'freezer|toilet|bench', sleep: 'bed|bedroom', watch: 'DOOR', rest: 'bed|bedroom' };

/* ---------- 尋路 ---------- */
function rtWalkable(f) {
  const F = ISO_FLOORS[f], occ = occupied(f), ok = new Set();
  for (let y = 0; y < F.h; y++) for (let x = 0; x < F.w; x++) if (!occ.has(x + ',' + y)) ok.add(x + ',' + y);
  return ok;
}
function rtGoalTiles(target) {
  if (target === 'DOOR') return { f: '1F', tiles: [[0, 4], [1, 4], [0, 3]] };
  const sv = S.sv;
  let obj = null;
  for (const kk of String(target).split('|')) { obj = isoObjects().find(q => (q.k === kk || q.id === kk) && sv.place[q.id]); if (obj) break; }
  if (!obj) return null;
  const p = sv.place[obj.id], fp = footprint(obj, p), ok = rtWalkable(p.f), tiles = [];
  for (const [x, y] of fp) for (const [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) { const k = (x + dx) + ',' + (y + dy); if (ok.has(k)) tiles.push([x + dx, y + dy]); }
  return { f: p.f, tiles, obj };
}
function rtPath(f, from, goals) {
  const ok = rtWalkable(f), start = [Math.floor(from.x), Math.floor(from.y)], key = t => t[0] + ',' + t[1];
  const goalSet = new Set(goals.map(key));
  if (goalSet.has(key(start))) return [];
  const prev = new Map([[key(start), null]]), q = [start];
  while (q.length) {
    const c = q.shift();
    if (goalSet.has(key(c))) { const path = []; let k = key(c); while (k && k !== key(start)) { const [x, y] = k.split(',').map(Number); path.unshift({ x: x + 0.5, y: y + 0.5 }); k = prev.get(k); } return path; }
    for (const [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) { const n = [c[0] + dx, c[1] + dy], nk = key(n); if (!ok.has(nk) || prev.has(nk)) continue; prev.set(nk, key(c)); q.push(n); }
  }
  return goals.length ? [{ x: goals[0][0] + 0.5, y: goals[0][1] + 0.5 }] : [];
}

/* ---------- 下指令 ---------- */
function rtOrder(where, a, v, h, label) {
  const rt = rtState();
  if (a === 'TAB') { if (v === 'out') { UI.rtSel = null; UI.rtOut = true; render(); return; } UI.tab = v; render(); return; }
  if (!a) return;
  if (rt.queue.length >= 6) { slog('排太多事了，先等一下。'); render(); return; }
  rt.queue.push({ where, a, v, h, label });
  UI.rtSel = null;
  if (!rt.task) rtNext();
  render();
}
function rtNext() {
  const rt = rtState();
  rt.task = rt.queue.shift() || null;
  rt.path = [];
  if (!rt.task) return;
  const g = rtGoalTiles(rt.task.where);
  if (!g) { rt.task.p = 0; return; }
  if (g.f !== rt.pos.f) { const F = ISO_FLOORS[g.f], ok = rtWalkable(g.f); let spot = [F.w - 1, F.h - 1]; for (const k of ok) { spot = k.split(',').map(Number); break; } rt.pos = { f: g.f, x: spot[0] + 0.5, y: spot[1] + 0.5 }; slog('你走到' + ISO_FLOORS[g.f].n + '。'); }
  UI.iso = Object.assign(UI.iso || {}, { floor: g.f });
  rt.path = rtPath(g.f, rt.pos, g.tiles);
  rt.task.p = 0;
}
function rtFinish() {
  const rt = rtState(), t = rt.task;
  rt.task = null;
  if (!t) return;
  const fn = SACT[t.a];
  if (fn) {
    const h0 = S.sv.hour, d0 = S.sv.day;
    fn(t.v);
    if (t.h > 0 && S.phase === 'survive' && S.sv.hour === h0 && S.sv.day === d0) slog('「' + t.label + '」沒做成（時間、體力或材料不夠）。');
    if (S.phase === 'survive' && S.sv.day > d0) { rt.frac = 0; rt.queue = []; }
  }
  if (S.phase === 'survive') rtNext();
}

/* ---------- 時間流動 ---------- */
let RT_LAST = 0, RT_SAVE = 0;
function rtTick(now) {
  requestAnimationFrame(rtTick);
  const dt = RT_LAST ? Math.min(0.25, (now - RT_LAST) / 1000) : 0; RT_LAST = now;
  if (!rtActive() || document.querySelector('.anim.day')) return;
  const sv = S.sv, rt = rtState(), sp = RT_SPEEDS[UIS.speed] || 0;
  if (!sp) return;
  let full = false;
  // 走路
  if (rt.path && rt.path.length) {
    let step = dt * 2.6 * Math.min(sp, 3);
    while (step > 0 && rt.path.length) {
      const n = rt.path[0], dx = n.x - rt.pos.x, dy = n.y - rt.pos.y, dist = Math.hypot(dx, dy);
      if (dist <= step) { rt.pos.x = n.x; rt.pos.y = n.y; rt.path.shift(); step -= dist; }
      else { rt.pos.x += dx / dist * step; rt.pos.y += dy / dist * step; step = 0; }
    }
    if (!rt.path.length && rt.task && !rt.task.h) { rtFinish(); full = true; }
  }
  const gh = dt * RT_MIN_PER_SEC * sp / 60;
  if (rt.task && !(rt.path && rt.path.length)) {
    if (!rt.task.h) { rtFinish(); full = true; }
    else { rt.task.p += gh / rt.task.h; if (rt.task.p >= 1) { rtFinish(); full = true; } }
  } else {
    rt.frac += gh;
    if (rt.frac >= 1) {
      rt.frac -= 1;
      if (sv.hour >= LAST_HOUR) { if (!rt.task && !rt.queue.some(q => q.a === 'sleep' || q.a === 'watch')) { slog('已經半夜了，你拖著腳步走回床上。', true); rtOrder(hordeOn(sv.day) ? 'DOOR' : 'bed|bedroom', hordeOn(sv.day) ? 'watch' : 'sleep', '', 0, '睡覺'); } }
      else { passHours(1); full = true; }
    }
  }
  if (full || S.phase !== 'survive') { render(); return; }
  rtPaint();
  if (now - RT_SAVE > 3000) { RT_SAVE = now; persistRun(); }
}
requestAnimationFrame(rtTick);

/* ---------- 每一格畫面只更新會動的東西 ---------- */
function rtClockText() {
  const sv = S.sv, rt = rtState();
  const h = sv.hour + (rt.task && rt.task.h && !(rt.path && rt.path.length) ? rt.task.p * rt.task.h : rt.frac);
  const hh = Math.floor(h), mm = Math.floor((h - hh) * 60);
  return { txt: String(hh % 24).padStart(2, '0') + ':' + String(mm).padStart(2, '0'), deg: (h % 24) / 24 * 360 };
}
function rtPaint() {
  const sv = S.sv, rt = rtState();
  const c = rtClockText();
  const el = document.getElementById('rt-clock'); if (el) el.textContent = c.txt;
  const hand = document.getElementById('rt-hand'); if (hand) hand.setAttribute('transform', 'rotate(' + c.deg.toFixed(1) + ' 30 30)');
  const ch = document.getElementById('iso-char');
  const f = (UI.iso && UI.iso.floor) || '1F';
  if (ch && rt.pos.f === f) {
    const P = isoProj(f), q = P(rt.pos.x, rt.pos.y, 0);
    ch.style.transition = 'none';
    ch.style.transform = 'translate(' + q[0].toFixed(1) + 'px,' + q[1].toFixed(1) + 'px)';
    const bar = document.getElementById('rt-bar');
    if (bar) { bar.setAttribute('transform', 'translate(' + q[0].toFixed(1) + ' ' + (q[1] - 46).toFixed(1) + ')'); const fill = document.getElementById('rt-bar-fill'); if (fill) fill.setAttribute('width', (Math.min(1, (rt.task && rt.task.p) || 0) * 40).toFixed(1)); bar.style.display = rt.task && rt.task.h && !(rt.path && rt.path.length) ? '' : 'none'; }
  }
  const tp = document.getElementById('rt-taskp'); if (tp && rt.task) tp.style.width = Math.round(Math.min(1, rt.task.p || 0) * 100) + '%';
  const ts = document.getElementById('rt-taskstate'); if (ts && rt.task) ts.textContent = rt.path && rt.path.length ? '（走過去中）' : rt.task.h ? '（做事中 ' + Math.round((rt.task.p || 0) * 100) + '%）' : '';
}

/* ---------- 場景與 HUD ---------- */
function rtScene() {
  const sv = S.sv, rt = rtState();
  if (!UI.iso) UI.iso = {};
  if (!UI.iso.floor || !sv.floors.includes(UI.iso.floor)) UI.iso.floor = rt.pos.f;
  UI.cpos = rt.pos; UI.walk = null;
  const f = UI.iso.floor, P = isoProj(f);
  let svg = isoSVG().replace('<div class="iso">', '<div class="iso rt">').replace(/data-a="isoObj"/g, 'data-a="rtObj"').replace(/data-a="isoTile"/g, 'data-a="rtTile"');
  let add = '';
  // 門可以點
  if (f === '1F') { const y = ISO_DOOR.at; add += '<polygon data-a="rtObj" data-v="DOOR" points="' + [P(0, y + 0.1, 0), P(0, y + 0.9, 0), P(0, y + 0.9, 50), P(0, y + 0.1, 50)].map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ') + '" fill="transparent" style="cursor:pointer"/>'; }
  // 設備頭上的狀態
  const label = (o, txt, col) => { const p = sv.place[o.id]; const D = ISO[o.k], w = p.r ? D.d : D.w, d = p.r ? D.w : D.d; const q = P(p.x + w / 2, p.y + d / 2, D.h + 16); return '<text x="' + q[0].toFixed(1) + '" y="' + q[1].toFixed(1) + '" text-anchor="middle" font-size="10" font-weight="700" fill="' + (col || '#f3f0e6') + '" stroke="#1d2733" stroke-width="2.6" paint-order="stroke" pointer-events="none">' + txt + '</text>'; };
  const powered = sv.powered || {};
  const taskObj = rt.task && rtGoalTiles(rt.task.where);
  for (const o of isoObjects()) {
    const p = sv.place[o.id]; if (!p || p.f !== f) continue;
    if (taskObj && taskObj.obj && taskObj.obj.id === o.id && rt.task.h) add += label(o, rt.task.label + '中…', '#ecd27a');
    else if (['freezer', 'lightbox', 'ac', 'bot_farm', 'bot_fix', 'bot_cook'].includes(o.k) && sv.dev[o.k] && powered[o.k] === false) add += label(o, '⚡ 沒電', '#ff7b6e');
    else if (['lightbox', 'greenhouse', 'potrack'].includes(o.k)) { const pl = (sv.plants || []).find(x => x.age < growDays()); if (pl) add += label(o, (growDays() - pl.age) + ' 天後成熟'); }
  }
  // 進度條
  add += '<g id="rt-bar" style="display:none" pointer-events="none"><rect x="-21" y="-4" width="42" height="8" rx="3" fill="#1d2733"/><rect id="rt-bar-fill" x="-20" y="-3" width="0" height="6" rx="2" fill="#ecd27a"/></g>';
  svg = svg.replace('</svg></div>', add + '</svg></div>');
  const c = rtClockText(), wx = inCold(sv.day) ? '寒潮' : inRain(sv.day) ? '陰雨' : (typeof isTyphoon === 'function' && isTyphoon(sv.day)) ? '颱風' : '晴';
  const z = sv.zoe || {}, hz = hordeOn(sv.day);
  const quest = '<div class="rt-q"><div class="rt-qh">主線</div><div>生存進度 <b>' + sv.day + '</b>/100 天</div>' +
    (z.state === 'asking' ? '<div>救助隔壁的女孩：想要<b>' + ITEMS[z.want].n + '</b>（' + z.given + '/7）</div>' : '') +
    '<div class="rt-qh">事件</div><div>' + (hz ? '今晚' + HTYPES[hordeType(sv.day)].n + '（強度 ' + hz[1] + '）' : hordeOn(sv.day + 1) ? '明晚有屍潮' : '今天沒有屍潮') + '</div></div>';
  const clock = '<div class="rt-c"><div class="rt-day">DAY ' + sv.day + '</div><svg viewBox="0 0 60 60" width="46" height="46"><circle cx="30" cy="30" r="27" fill="#20262e" stroke="#ecd27a" stroke-width="2"/><path d="M30 30 L30 6" id="rt-hand" stroke="#f3f0e6" stroke-width="2.5" stroke-linecap="round" transform="rotate(' + c.deg.toFixed(1) + ' 30 30)"/><circle cx="30" cy="30" r="2.5" fill="#ecd27a"/></svg><div id="rt-clock" class="rt-time">' + c.txt + '</div><div class="rt-wx">' + wx + '</div></div>';
  const floors = '<div class="rt-floors">' + ['2F', '1F', 'B1'].filter(x => sv.floors.includes(x)).map(x => '<button class="' + (x === f ? 'on' : '') + '" data-a="isoFloor" data-v="' + x + '">' + ISO_FLOORS[x].n + (rt.pos.f === x ? ' ●' : '') + '</button>').join('') + '</div>';
  const speeds = '<div class="rt-sp">' + ['暫停', '▶', '▶▶', '▶▶▶'].map((t, i) => '<button class="' + (UIS.speed === i ? 'on' : '') + '" data-a="rtSpeed" data-v="' + i + '">' + t + '</button>').join('') + '</div>';
  const bar = (n, v, max, warn, col) => '<div class="rt-st"><span>' + n + '</span><div class="bar' + (v <= warn ? ' full' : '') + '"><i style="width:' + clamp(v / max * 100) + '%;background:' + col + '"></i></div><b class="num">' + Math.round(v) + '</b></div>';
  const tags = [];
  if (sv.sat >= 80) tags.push(['飽足', 'g']); if (sv.sick) tags.push(['生病', 'r']); if (sv.inj && sv.inj.inf) tags.push(['感染', 'r']); if (sv.inj && sv.inj.frac) tags.push(['骨折', 'r']);
  if (sv.mor >= 70) tags.push(['神清氣爽', 'g']); if (sv.hyg != null && sv.hyg < 30) tags.push(['髒', 'r']); if (inCold(sv.day) && !heated()) tags.push(['好冷', 'r']);
  const stats = '<div class="rt-stats">' + (tags.length ? '<div class="rt-tags">' + tags.map(([t, c]) => '<span class="' + c + '">' + t + '</span>').join('') + '</div>' : '') +
    bar('飽腹', sv.sat, 100, 20, '#e0a85a') + bar('水分', sv.hyd, 100, 20, '#6fb3e0') + bar('心態', sv.mor, 100, 20, '#d97ab8') + bar('精力', sv.sta, 100, 15, '#e6c84f') + bar('生命', sv.hp, 100, 30, '#6fc48a') + bar('衛生', sv.hyg == null ? 80 : sv.hyg, 100, 30, '#9aa7b4') + '</div>';
  return '<div class="rt-wrap">' + svg + quest + clock + floors + speeds + '</div>' + stats;
}
function rtPanel() {
  const sv = S.sv, rt = rtState();
  let h = '';
  if (rt.task) h += '<div class="rt-task"><div><b>' + esc(rt.task.label) + '</b><span id="rt-taskstate">' + (rt.path && rt.path.length ? '（走過去中）' : rt.task.h ? '（' + rt.task.h + ' 小時）' : '') + '</span></div><div class="bar"><i id="rt-taskp" style="width:' + Math.round((rt.task.p || 0) * 100) + '%"></i></div>' +
    (rt.queue.length ? '<div class="meta">接下來：' + rt.queue.map((q, i) => esc(q.label) + ' <button class="x" data-a="rtDrop" data-v="' + i + '">×</button>').join('、') + '</div>' : '') + '<button class="btn ghost" data-a="rtCancel">取消</button></div>';
  if (UI.rtSel) {
    const k = UI.rtSel === 'DOOR' ? 'DOOR' : (isoObjects().find(o => o.id === UI.rtSel) || {}).k;
    const acts = k ? rtActions(k) : [];
    h += '<div class="roompanel"><div class="slot-h"><b>' + (k === 'DOOR' ? '大門（防線 ' + Math.round(sv.def) + '/' + sv.defMax + '）' : ISO[k].n) + '</b><button class="btn ghost" data-a="rtSelClose" style="margin-left:auto">關閉</button></div>' +
      (acts.length ? '<div class="sheet">' + acts.map((x, i) => actRow(x.label, (x.h ? x.h + ' 小時' : '馬上') + (x.note ? ' · ' + x.note : ''), '做', 'rtDo', String(i), x.ok)).join('') + '</div>' : '<p class="meta">這個東西沒有可以做的事。</p>') + '</div>';
  } else h += '<p class="meta" style="margin:8px 0">點家裡的東西選要做什麼，角色會走過去做；點地板就走過去。可以一次排好幾件事。</p>';
  if (UI.rtOut) h += '<div class="roompanel"><div class="slot-h"><b>外出搜刮</b><button class="btn ghost" data-a="rtOutClose" style="margin-left:auto">關閉</button></div>' + viewOutside() + '</div>';
  h += '<div class="row-btns"><button class="btn" data-a="rtQuick" data-v="eatFull">吃到飽</button><button class="btn" data-a="rtQuick" data-v="drinkFull">喝到滿</button><button class="btn" data-a="rtQuick" data-v="out">外出</button><button class="btn red" data-a="rtQuick" data-v="sleep">去睡覺</button></div>';
  const pl = sv.plants || [];
  if (pl.length) h += '<details class="guide"><summary>家中植物（' + pl.length + '）</summary><ul class="list">' + pl.map(p => '<li>' + ITEMS[p.k].n + '：' + (p.age < growDays() ? '還要 ' + (growDays() - p.age) + ' 天' : '成熟，持續收成') + '</li>').join('') + '</ul></details>';
  h += viewSleepWarn();
  h += '<details class="guide"><summary>全部行動（選單）</summary>' + _viewActsRT() + '</details>';
  h += '<div class="row-btns"><button class="btn ghost" data-a="rtMode">切換成選單模式</button></div>';
  return h;
}
Object.assign(SACT, {
  rtObj(v) { UI.rtSel = v; UI.rtOut = false; render(); },
  rtSelClose() { UI.rtSel = null; render(); },
  rtOutClose() { UI.rtOut = false; render(); },
  rtDo(i) {
    const k = UI.rtSel === 'DOOR' ? 'DOOR' : (isoObjects().find(o => o.id === UI.rtSel) || {}).k;
    const x = k && rtActions(k)[Number(i)]; if (!x || !x.ok) return;
    const where = k === 'DOOR' ? 'DOOR' : UI.rtSel;
    rtOrder(where, x.a, x.v, x.h, x.label.replace(/（.*）/, ''));
  },
  rtTile(v) {
    const [f, x, y] = String(v).split(','), rt = rtState();
    UI.rtSel = null;
    if (rt.task) { render(); return; }
    if (rt.pos.f !== f) { rt.pos = { f, x: Number(x) + 0.5, y: Number(y) + 0.5 }; render(); return; }
    rt.path = rtPath(f, rt.pos, [[Number(x), Number(y)]]);
    render();
  },
  rtSpeed(v) { UIS.speed = Number(v); saveUI(); render(); },
  rtCancel() { const rt = rtState(); rt.task = null; rt.queue = []; rt.path = []; render(); },
  rtDrop(i) { rtState().queue.splice(Number(i), 1); render(); },
  rtQuick(v) {
    if (v === 'out') { UI.rtOut = true; UI.rtSel = null; render(); return; }
    const hz = hordeOn(S.sv.day);
    if (v === 'sleep') return rtOrder(hz ? 'DOOR' : 'bed|bedroom', 'sleep', '', 0, '睡覺');
    rtOrder(RT_SPOT[v], v, '', 0, v === 'eatFull' ? '吃東西' : '喝水');
  },
  rtMode() { UIS.rt = !rtOn(); saveUI(); render(); }
});

// 掛進行動分頁
const _viewActsRT = viewActs;
viewActs = function () { if (!rtOn() || S.sv.out) return _viewActsRT(); return rtPanel(); };
const _isoLiveRT = isoLive;
isoLive = function () { return rtOn() ? rtScene() : _isoLiveRT(); };
// 選單模式裡也能切回即時
const _viewActsMenuNote = viewActs;
viewActs = function () { const h = _viewActsMenuNote(); return !rtOn() && !S.sv.out ? '<div class="row-btns"><button class="btn" data-a="rtMode">切換成即時模式</button></div>' + h : h; };

// 即時模式的行動分頁不顯示上方的狀態列（數值改到場景下面）
const _renderRT = render;
render = function () {
  _renderRT();
  const hd = document.querySelector('.status');
  if (hd) hd.style.display = rtOn() && S && S.phase === 'survive' && S.sv && !S.sv.out && UI.tab === 'act' ? 'none' : '';
};
