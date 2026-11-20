/* ================= 更直觀：告訴你可以做什麼 =================
   1. 💡 建議：依目前狀況列出 2–3 件最該做的事，一點就做（餓了→吃、門破了→加固、天黑→睡覺…）
   2. 🧭 我想要…：用「動詞」找事情做（吃東西、發電、種東西、做東西…），會打開對應的家具視窗；
      沒有那樣家具就告訴你要先準備什麼
   3. 家具頭上的小圖示：看得出每樣東西是做什麼的；被建議的那樣會跳動
   4. 目標箭頭：左上角目標對應的東西，上面會有一個上下跳的箭頭 */
if (UIS.badges == null) UIS.badges = true;

const VERBS = [
  { k: 'eat', ic: '🍚', n: '吃東西', objs: ['freezer', 'storage', 'shelf'], quick: 'eatFull' },
  { k: 'drink', ic: '💧', n: '喝水', quick: 'drinkFull' },
  { k: 'sleep', ic: '🛏️', n: '休息／睡覺', objs: ['bed', 'bedroom'] },
  { k: 'cook', ic: '🍳', n: '煮飯', objs: ['microwave'], need: '微波爐（便利店或裝修公司買）' },
  { k: 'power', ic: '⚡', n: '發電', objs: ['gen', 'pedal'], need: '發電機（裝修公司）或人力發電機（工作台做）' },
  { k: 'plant', ic: '🌱', n: '種東西', objs: ['lightbox', 'potrack', 'greenhouse'], need: '種植箱（農貿市場）、花盆架（工作台做）' },
  { k: 'craft', ic: '🔨', n: '做東西／修理', objs: ['bench', 'workshop'] },
  { k: 'door', ic: '🚪', n: '加固大門', objs: ['DOOR'] },
  { k: 'wash', ic: '🚿', n: '洗澡清潔', objs: ['toilet'] },
  { k: 'out', ic: '🎒', n: '外出搜刮', quick: 'out' },
  { k: 'roof', ic: '🏙️', n: '頂樓', wm: 'roof' },
  { k: 'nbr', ic: '👥', n: '找鄰居', wm: 'nbr' },
  { k: 'radio', ic: '📻', n: '聽廣播', wm: 'radio' },
  { k: 'store', ic: '🗄️', n: '看倉庫', tab: 'store' }
];
function placedId(keys) {
  if (keys.includes('DOOR')) return 'DOOR';
  const sv = S.sv; for (const k of keys) { const o = isoObjects().find(o => o.k === k && sv.place[o.id]); if (o) return o.id; }
  return null;
}
function openObj(id) { if (!id) return; const rt = rtState(); UI.rtSel = id; UI.rtOut = false; UI.verbs = false; if (id !== 'DOOR') { const p = S.sv.place[id]; if (p) UI.iso = Object.assign(UI.iso || {}, { floor: p.f }); } render(); }
Object.assign(SACT, {
  verbsOpen() { UI.verbs = true; UI.rtSel = null; render(); },
  verbsClose() { UI.verbs = false; render(); },
  verb(k) {
    const V = VERBS.find(x => x.k === k); if (!V) return;
    UI.verbs = false;
    if (V.wm) { SACT.wmOpen(V.wm); return; }
    if (V.tab) { UI.tab = V.tab; if (document.body.classList.contains('ls')) UI.lsMenu = true; render(); return; }
    if (V.k === 'out') { if (document.body.classList.contains('ls')) SACT.lsOut(); else SACT.rtQuick('out'); return; }
    const id = V.objs && placedId(V.objs);
    if (id) { openObj(id); return; }
    if (V.quick) { SACT.rtQuick(V.quick); return; }
    slog('家裡還沒有可以「' + V.n + '」的東西。需要：' + (V.need || '先準備對應的家具') + '。', true); render();
  },
  sugDo(i) {
    const s = suggest()[Number(i)]; if (!s) return;
    if (s.ev != null) { evResolve(s.ev); return; }
    if (s.quick) { SACT.rtQuick(s.quick); return; }
    if (s.wm) { SACT.wmOpen(s.wm); return; }
    if (s.open) { openObj(s.open); return; }
    if (s.a) doNow(s.where, s.a, s.v, s.actLabel || s.label);
  },
  badgesToggle() { UIS.badges = !UIS.badges; saveUI(); render(); }
});
// 找某樣家具上可以做的某個動作
function actOn(keys, a) {
  const id = placedId(keys); if (!id) return null;
  const k = id === 'DOOR' ? 'DOOR' : (isoObjects().find(o => o.id === id) || {}).k;
  const x = rtActions(k).find(x => x.a === a && x.ok); return x ? { where: id, a: x.a, v: x.v, label: x.label.replace(/（.*）/, '') } : null;
}
let SUG_C = { t: 0, k: '', v: [] };
function suggest() {
  const now = performance.now(), key = S.sv.day + ':' + S.sv.hour + ':' + Math.round(S.sv.sat) + ':' + Math.round(S.sv.hyd) + ':' + Math.round(S.sv.def) + ':' + (S.sv.log[0] && S.sv.log[0].txt);
  if (now - SUG_C.t < 600 && SUG_C.k === key) return SUG_C.v;
  SUG_C = { t: now, k: key, v: suggestRaw() }; return SUG_C.v;
}
function suggestRaw() {
  const sv = S.sv, L = [];
  const push = (pri, ic, label, why, o) => L.push(Object.assign({}, o, { pri, ic, label, why, actLabel: o && o.label }));
  const anyFood = Object.keys(FOOD).some(k => sv_has(k) > 0);
  // 畫面上的事件
  const E = typeof evState === 'function' ? evState() : null;
  if (E) for (const e of E.list) if (!e.gone) push(95, EV_TYPES[e.k].ic, '處理' + (e.k === 'broke' ? ITEMS[e.obj].n + '故障' : EV_TYPES[e.k].n), '不管會有損失', { ev: e.id });
  if (sv.sat < 40 && anyFood) push(100 - sv.sat, '🍚', '吃東西', '飽腹 ' + Math.round(sv.sat), { quick: 'eatFull' });
  if (sv.hyd < 40 && ((sv.st.wu || 0) >= 1 || sv.day <= 5)) push(100 - sv.hyd, '💧', '喝水', '水分 ' + Math.round(sv.hyd), { quick: 'drinkFull' });
  const hz = hordeOn(sv.day);
  if (hz && sv.def < sv.defMax) { const r = actOn(['DOOR'], 'reinforce'); if (r) push(90, '🚪', '加固大門', '今晚屍潮 · 防線 ' + Math.round(sv.def), r); }
  else if (sv.def < sv.defMax * 0.6) { const r = actOn(['DOOR'], 'reinforce'); if (r) push(60, '🚪', '加固大門', '防線 ' + Math.round(sv.def) + '/' + sv.defMax, r); }
  if (sv.hp < 50 && (sv.st.medkit > 0 || sv.st.pills > 0) && placedId(['storage', 'shelf', 'freezer'])) push(85, '⛑️', '治療', '生命 ' + Math.round(sv.hp), { open: placedId(['storage', 'shelf', 'freezer']) });
  if (sv.power < 2) { const g = actOn(['gen'], 'gen') || actOn(['pedal'], 'pedal'); if (g) push(70, '⚡', g.a === 'gen' ? '發電' : '踩發電機', '電只剩 ' + sv.power.toFixed(1) + ' 度', g); }
  if (sv.hyg != null && sv.hyg < 35) { const w = actOn(['toilet'], 'wash'); if (w) push(55, '🚿', '清理', '衛生 ' + Math.round(sv.hyg), w); }
  if (sv.sta < 25 && sv.hour < 21) { const r = actOn(['bed', 'bedroom'], 'rest'); if (r) push(50, '😴', '休息', '精力 ' + Math.round(sv.sta), r); }
  if (sv.mor < 35 && sv.hour < 21) { const r = actOn(['bed', 'bedroom'], 'rest'); if (r) push(45, '📖', '休息一下', '心態 ' + Math.round(sv.mor), r); }
  if (freeSlots() > 0 && Object.keys(SEED_OUT).some(s => sv.st[s] > 0)) { const id = placedId(['lightbox', 'potrack', 'greenhouse']); if (id) push(40, '🌱', '種東西', '有種子、有空位', { open: id }); }
  if (sv.st.microwave && anyFood && typeof DISHES === 'object' && Object.keys(DISHES).some(k => dishOk(k))) { const id = placedId(['microwave']); if (id) push(35, '🍳', '煮一道菜', '材料夠了', { open: id }); }
  if (sv.hour >= 21) push(sv.hour >= 23 ? 92 : 75, hz ? '🌙' : '🛏️', hz ? '守夜或睡覺' : '睡覺', '已經 ' + sv.hour + ':00', { open: placedId(hz ? ['DOOR'] : ['bed', 'bedroom']) || 'DOOR' });
  if (sv.day >= 2 && sv.hour >= 8 && sv.hour <= 14 && !hz && sv.sta >= 40) push(30, '🎒', '出門搜刮', '白天比較安全', { quick: 'out' });
  return L.sort((a, b) => b.pri - a.pri).slice(0, 3);
}
function sugHTML(cls) {
  if (!S.sv || S.sv.out) return '';
  const L = suggest(); if (!L.length) return '';
  return '<div class="sug ' + (cls || '') + '"><span class="sug-h">💡 現在可以</span>' + L.map((s, i) => '<button class="sug-b" data-a="sugDo" data-v="' + i + '"><span class="sug-ic">' + s.ic + '</span><span><b>' + s.label + '</b><small>' + s.why + '</small></span></button>').join('') + '</div>';
}
function verbsHTML() {
  return '<div class="rt-modal" data-a="verbsClose"><div class="rt-mbox" data-a="noop"><div class="rt-mh"><span class="rt-mic">🧭</span><div><b>我想要……</b><div class="meta">選一件事，會幫你打開對應的地方</div></div></div><div class="verb-grid">' +
    VERBS.map(V => { const has = !V.objs || V.quick || placedId(V.objs); return '<button class="verb' + (has ? '' : ' off') + '" data-a="verb" data-v="' + V.k + '"><span>' + V.ic + '</span><b>' + V.n + '</b></button>'; }).join('') +
    '</div><div class="row-btns" style="margin-top:10px"><button class="btn ghost" data-a="verbsClose">關閉</button></div></div></div>';
}

/* ---------- 家具小圖示、建議跳動、目標箭頭 ---------- */
const GOAL_OBJ = { look: ['freezer', 'storage', 'shelf'], eat: ['freezer', 'storage', 'shelf'], gen: ['gen', 'pedal'], reinforce: ['DOOR'], plant: ['lightbox', 'potrack', 'greenhouse'] };
const _lifeLayerGuide = lifeLayer;
lifeLayer = function (now) {
  now = now || performance.now();
  let s = _lifeLayerGuide(now);
  const sv = S.sv, f = (UI.iso && UI.iso.floor) || '1F', P = isoProj(f);
  const sugIds = new Set(suggest().map(x => x.where || x.open).filter(Boolean));
  if (UIS.badges) for (const o of isoObjects()) {
    const p = sv.place[o.id]; if (!p || p.f !== f || !OBJ_IC[o.k]) continue;
    const acts = rtActions(o.k); if (!acts.some(x => x.ok) && !['storage', 'shelf'].includes(o.k)) continue;
    const c = objCenter(o.id); if (!c) continue;
    const q = P(c.x, c.y - (ISO[o.k].d || 1) / 2, 0), hot = sugIds.has(o.id), jump = hot ? Math.abs(Math.sin(now / 220)) * -5 : 0;
    s += '<g pointer-events="none" transform="translate(' + q[0].toFixed(1) + ' ' + (q[1] - 8 + jump).toFixed(1) + ')" opacity="' + (hot ? 1 : 0.78) + '"><circle r="' + (hot ? 10 : 8) + '" fill="' + (hot ? '#ecd27a' : 'rgba(20,24,30,0.72)') + '" stroke="' + (hot ? '#1d2733' : 'rgba(255,255,255,0.5)') + '" stroke-width="1"/><text y="' + (hot ? 4 : 3.5) + '" text-anchor="middle" font-size="' + (hot ? 11 : 9.5) + '">' + OBJ_IC[o.k] + '</text></g>';
  }
  // 大門也標一下
  if (f === ISO_DOOR.f && UIS.badges) { const a = P(0, ISO_DOOR.at + 0.5, 0), hot = sugIds.has('DOOR'), jump = hot ? Math.abs(Math.sin(now / 220)) * -5 : 0; s += '<g pointer-events="none" transform="translate(' + (a[0] + 14) + ' ' + (a[1] - 24 + jump).toFixed(1) + ')" opacity="' + (hot ? 1 : 0.78) + '"><circle r="' + (hot ? 10 : 8) + '" fill="' + (hot ? '#ecd27a' : 'rgba(20,24,30,0.72)') + '" stroke="rgba(255,255,255,0.5)"/><text y="3.5" text-anchor="middle" font-size="9.5">🚪</text></g>'; }
  // 目標箭頭
  const G = typeof goalState === 'function' ? GOALS.find(x => !goalState()[x.id]) : null;
  const gid = G && GOAL_OBJ[G.id] && placedId(GOAL_OBJ[G.id]);
  if (gid) {
    const c = gid === 'DOOR' ? { x: 0.3, y: ISO_DOOR.at + 0.5 } : objCenter(gid);
    if (c && (gid === 'DOOR' ? ISO_DOOR.f : sv.place[gid].f) === f) { const q = P(c.x, c.y - 0.6, 0), b = Math.abs(Math.sin(now / 260)) * 7; s += '<g pointer-events="none" transform="translate(' + q[0].toFixed(1) + ' ' + (q[1] - 30 - b).toFixed(1) + ')"><path d="M-8 -10 h16 v8 h7 l-15 14 l-15 -14 h7z" fill="#ecd27a" stroke="#1d2733" stroke-width="1.3"/></g>'; }
  }
  return s;
};

/* ---------- 掛進畫面 ---------- */
const _renderGuide = render;
render = function () {
  _renderGuide();
  if (!S || S.phase !== 'survive' || !rtOn() || !S.sv || S.sv.out || UI.tab !== 'act') return;
  const ls = document.body.classList.contains('ls');
  if (ls) {
    const left = document.querySelector('.ls-left'); if (left && !UI.lsMenu) left.insertAdjacentHTML('beforeend', sugHTML('ls'));
    const menu = document.querySelector('.ls-right [data-a="lsMenu"]'); if (menu) menu.insertAdjacentHTML('beforebegin', '<button class="ls-btn" data-a="verbsOpen">🧭<span>我想要</span></button>');
  } else {
    const wrap = document.querySelector('main.wrap > .rt-wrap'); if (wrap) wrap.insertAdjacentHTML('afterend', sugHTML());
    const quick = document.querySelector('main.wrap > .quick4'); if (quick) quick.insertAdjacentHTML('beforeend', '');
    const wm = document.querySelector('main.wrap > .wm-chips'); if (wm) wm.insertAdjacentHTML('beforebegin', '<button class="btn verb-open" data-a="verbsOpen">🧭 我想要……（找事情做）</button>');
    const sd = document.querySelector('main.wrap > .settings-d'); if (sd) sd.insertAdjacentHTML('beforeend', '<div class="setrow"><span>家具圖示</span><button class="pill' + (UIS.badges ? ' on' : '') + '" data-a="badgesToggle">' + (UIS.badges ? '顯示中' : '已隱藏') + '</button></div>');
  }
  if (UI.verbs) $app.insertAdjacentHTML('beforeend', verbsHTML());
};
const _rtActiveGuide = rtActive;
rtActive = function () { return _rtActiveGuide() && !UI.verbs; };
