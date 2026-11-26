/* ================= 🔔 提醒系統：通知中心、紅點、今日待辦、睡前／出門檢查、出發清單 ================= */
const NT_CAT = { live: '❤️ 生存', night: '🌙 晚上', farm: '🌾 種植農場', cook: '🍳 料理加工', biz: '🏪 經營成長', out: '🎒 外出', near: '🎯 快解鎖了' };
const NT_LV = { r: 0, y: 1, g: 2 };
const hasFm = () => !!(S.sv && S.sv.w && S.sv.w.fm);
const hasBz = () => hasFm() && !!S.sv.w.fm.bz;
const hasGr = () => hasFm() && !!S.sv.w.fm.gr;
function ntList() {
  if (!S || S.phase !== 'survive' || !S.sv) return [];
  const sv = S.sv, st = sv.st, L = [], off = UIS.ntOff || {};
  const P = (lv, cat, ic, t, sub, go, badge) => { if (!off[cat]) L.push({ lv, cat, ic, t, sub: sub || '', go, badge }); };
  if (sv.out) {
    const o = sv.out;
    if (o.exp >= 70) P('r', 'out', '🧟', '暴露值 ' + Math.round(o.exp) + '%', '快被包圍了，趕快回家', { a: 'otExit' });
    else if (o.exp >= 50) P('y', 'out', '👀', '暴露值 ' + Math.round(o.exp) + '%', '再翻幾間就該撤了');
    if (typeof outWeight === 'function' && outWeight() >= bagCap() * 0.95) P('y', 'out', '🎒', '背包滿了', '丟掉便宜的東西，或回家');
    if (sv.hour >= 17) P('y', 'out', '🌇', '天快黑了', '晚上在外面很危險', { a: 'otExit' });
    if (sv.hp < 40) P('r', 'out', '❤️', '生命只剩 ' + Math.round(sv.hp), '別硬撐，回家治療', { a: 'otExit' });
    return L.sort((a, b) => NT_LV[a.lv] - NT_LV[b.lv]);
  }
  // ===== 生存 =====
  const SN = [['hp', '生命', '❤️', { a: 'medOpen' }], ['sat', '飽足', '🍚', { a: 'eatPick' }], ['hyd', '水分', '💧', { a: 'rtQuick', v: 'drinkFull' }], ['sta', '精力', '😪', { a: 'rtQuick', v: 'sleep' }], ['mor', '心態', '😞', { a: 'medOpen' }], ['hyg', '衛生', '🧼', { a: 'verb', v: 'wash' }]];
  for (const [k, n, ic, go] of SN) { const v = sv[k]; if (v == null) continue; if (v < 20) P('r', 'live', ic, n + '只剩 ' + Math.round(v), '馬上處理', go); else if (v < 30) P('y', 'live', ic, n + '偏低（' + Math.round(v) + '）', '快到危險線了', go); }
  if (sv.sick) P('r', 'live', '🤒', '生病了', '吃止痛藥、退燒藥或薑茶', { a: 'medOpen' });
  if (sv.inj && sv.inj.inf) P('r', 'live', '🩹', '傷口感染', '每天掉生命，要抗生素或蘆薈膏', { a: 'medOpen' });
  else if (sv.hyg != null && sv.hyg < 25) P('y', 'live', '🦠', '太髒了，可能感染', '洗澡或用肥皂', { a: 'verb', v: 'wash' });
  const rot = (sv.fresh || []).filter(f => f.life <= 1.01).reduce((a, f) => a + f.q, 0);
  if (rot) P('y', 'live', '🥬', rot + ' 份新鮮食物明天會壞', '先吃掉、煮掉，或做成乾貨', { a: 'eatPick' });
  if (!isForever()) {
    if (sv.day >= 3 && sv.day <= 5) P(sv.day === 5 ? 'r' : 'y', 'live', '🚰', (6 - sv.day) + ' 天後停水', '現在有 ' + (st.wu || 0) + ' 份水，要開始存水、做雨水收集', { a: 'verb', v: 'craft' });
    if (sv.day + 1 === COLD[0]) P('y', 'live', '🥶', '明天寒潮開始', '準備暖爐、熱的食物、蠶絲被');
    if (typeof disasterDays === 'function' && disasterDays().ty.includes(sv.day + 1)) P('y', 'live', '🌀', '明天颱風', '太陽能停擺、一樓可能淹水，東西搬上樓');
    const hz = hordeOn(sv.day + 1); if (hz) P('y', 'live', '🧟', '明晚屍潮', '今天先加固大門、做燃燒瓶', { a: 'verb', v: 'door' });
  }
  // ===== 晚上 =====
  if (sv.hour >= 19 || sv.hour < 6) {
    for (const w of sleepWarnings()) P(/突破|危險|掉血/.test(w) ? 'r' : 'y', 'night', '🌙', w.replace(/。$/, ''), '睡前處理');
    if (!sv.light && sv.power >= 0.2 && typeof isDark === 'function' && isDark(sv.hour)) P('g', 'night', '💡', '還沒開燈', '開燈心態會慢慢回升', { a: 'lightSw' });
  }
  // ===== 種植農場 =====
  const seeds = Object.keys(SEED_OUT).filter(k => st[k] > 0);
  if (freeSlots() > 0 && seeds.length) { const A = plantAdvice(); P('g', 'farm', '🌱', '有 ' + freeSlots() + ' 個空位可以種', A.have[0] ? '建議種' + ITEMS[A.have[0]].n.replace(/（.*）/, '') : '', { open: ['lightbox', 'potrack', 'greenhouse'] }); }
  if (hasFm()) {
    const fm = F();
    if (typeof needWater === 'function' && needWater()) P('y', 'farm', '💧', '菜圃還沒澆水', '沒澆的話今天不長', { a: 'fmOpen' }, 'farm');
    const pest = (sv.plants || []).filter(p => p.pest).length; if (pest) P('r', 'farm', '🐛', pest + ' 株作物長蟲', '3 天不處理會死', { a: 'fmOpen' }, 'farm');
    if (fm.rabbits && !fm.rabbitFed && !fm.feeder) P('y', 'farm', '🐇', '兔子沒吃飽', '準備菜葉、玉米、小麥', { a: 'fmOpen' }, 'farm');
    if (hasGr() && grOn('soil') && GR().soil < 30) P('y', 'farm', '🟫', '田的肥力只剩 ' + Math.round(GR().soil), '施肥或種花生、豆芽', { a: 'grGoX', v: 'soil' }, 'grow');
    if (hasGr() && GR().pond && GR().fish.some(f => f.age >= 5)) P('g', 'farm', '🐟', '魚可以撈了', '', { a: 'grGoX', v: 'fish' }, 'grow');
  }
  // ===== 料理 =====
  const made = (sv.chef && sv.chef.made) || {};
  const newDish = Object.keys(DISHES).filter(k => !DISHES[k].fest && chefLv() >= DISHES[k].lv && !made[k] && Object.entries(DISHES[k].need).every(([m, n]) => haveIng(m) >= n));
  if (newDish.length && st.microwave) P('g', 'cook', '🍳', '可以煮新菜：' + newDish.slice(0, 2).map(k => ITEMS[k].n).join('、'), '材料剛好湊齊', { open: ['microwave'] });
  if (hasGr() && grOn('lab')) { const can = Object.entries(LAB).filter(([d, Lb]) => labBook()[d] && Lb.ing.every(m => sv_has(m) > 0)); if (!Object.keys(labBook()).length && LAB_POOL().length >= 2) P('g', 'cook', '🧪', '試試食譜研發', '把材料丟進鍋子亂配看看', { a: 'grGoX', v: 'lab' }, 'grow'); }
  if (hasGr() && grOn('plate')) { const ex = Object.keys(FOOD).filter(d => FOOD[d].dish && qOf(d)[1] - (GR().plated[d] || 0) > 0); if (ex.length) P('g', 'cook', '🍽️', '有 ' + ex.length + ' 種極品料理可以擺盤', '擺盤後多賣 50%', { a: 'grGoX', v: 'plate' }, 'grow'); }
  // ===== 經營成長 =====
  if (hasBz() && bizAllowed()) {
    const bz = BZ();
    const fill = bz.orders.filter(o => !o.done && o.until >= sv.day && canFill(o)); if (fill.length) P('g', 'biz', '📌', fill.length + ' 張訂單可以交', fill.map(o => ITEMS[o.k].n).slice(0, 2).join('、'), { a: 'bzGoX', v: 'order' }, 'biz');
    const due = bz.orders.filter(o => !o.done && o.until === sv.day && !canFill(o)); if (due.length) P('y', 'biz', '⏰', due.length + ' 張訂單今天到期', '還差：' + due.map(o => ITEMS[o.k].n + ' ' + Math.max(0, o.qty - sv_has(o.k))).join('、'), { a: 'bzGoX', v: 'order' }, 'biz');
    const cus = bz.cust.filter(c => !c.done && sv_has(c.want) > 0); if (cus.length && bzOpenTab('shop')) P('g', 'biz', '🧑', cus.length + ' 位客人等你招呼', '店裡有他們要的東西', { a: 'bzGoX', v: 'shop' }, 'biz');
    const vat = bz.vats.filter(v => sv.day - v.start >= BREWS[v.k].min); if (vat.length) P('g', 'biz', '🍶', vat.length + ' 桶酒可以開了', '放久一點品質更好', { a: 'bzGoX', v: 'brew' }, 'biz');
    if (hasGr()) {
      const gr = GR();
      if (gr.staff.length) { const wage = gr.staff.reduce((a, s) => a + 3 + s.s * 2, 0); if (bz.coin < wage * 2) P('y', 'biz', '💸', '瓶蓋只夠付 ' + Math.floor(bz.coin / wage) + ' 天薪水', '付不出來員工會走', { a: 'bzGoX', v: 'shop' }, 'biz'); }
      if (grOn('night') && isNM() && gr.nmDay !== sv.day) P(sv.hour >= 16 ? 'g' : 'y', 'biz', '🏮', '今天是夜市日', sv.hour >= 16 ? '可以出攤了' : '16:00 以後出攤，先準備要賣的', { a: 'grGoX', v: 'night' }, 'grow');
      if (grOn('contest') && ctOpen()) P('g', 'biz', '🏆', '品評會報名中', '3 天內，挑最好的參賽', { a: 'grGoX', v: 'contest' }, 'grow');
      if (gr.wk) for (const c of gr.wk.list) if (!c.done && wkProg(c) >= c.goal * 0.75) P('g', 'near', '🎯', '每週挑戰快完成：' + c.n, wkProg(c) + '/' + c.goal, { a: 'grGoX', v: 'weekly' }, 'grow');
      // 快解鎖了
      const near = [];
      const mx = Math.max(0, ...Object.values(gr.cookN)); if (!grOn('sig') && tierOpen(2) && mx >= 3 && mx < 5) near.push(['👑', '再煮 ' + (5 - mx) + ' 次同一道料理', '解鎖招牌菜']);
      for (const [k, r] of [['bigorder', 25], ['night', 30], ['staff', 40]]) { const g = GROW.find(x => x.k === k); if (!grOn(k) && tierOpen(g.t) && bz.rep >= r - 6 && bz.rep < r) near.push([g.ic, '聲望還差 ' + (r - bz.rep), '解鎖' + g.n]); }
      for (const [ic, t, s] of near) P('g', 'near', ic, t, s, { a: 'grGoX', v: 'route' }, 'grow');
      const fresh = GROW.find(g => gr.ul[g.k] && sv.day - gr.ul[g.k] <= 1 && !(J.grSeen || {})[g.k]); if (fresh) P('g', 'biz', '🌟', '新玩法：' + fresh.n, '去看看怎麼玩', { a: 'grGoX', v: fresh.k }, 'grow');
    }
  }
  return L.sort((a, b) => NT_LV[a.lv] - NT_LV[b.lv]);
}
let _ntCache = null, _ntAt = 0;
function nts() { const now = performance.now(); if (!_ntCache || now - _ntAt > 700) { _ntCache = ntList(); _ntAt = now; } return _ntCache; }
const ntDirty = () => { _ntCache = null; };
Object.assign(SACT, {
  ntOpen() { UI.wm = 'notif'; UI.rtSel = null; UI.verbs = false; ntDirty(); render(); },
  ntGo(i) {
    const n = nts()[Number(i)]; if (!n || !n.go) return; UI.wm = null; const g = n.go;
    if (g.open) { const id = placedId(g.open); if (id) { openObj(id); return; } slog('家裡還沒有可以做這件事的家具。'); render(); return; }
    if (SACT[g.a]) SACT[g.a](g.v); else render();
  },
  ntTog(c) { UIS.ntOff = UIS.ntOff || {}; UIS.ntOff[c] = !UIS.ntOff[c]; saveUI(); ntDirty(); render(); },
  bzGoX(t) { UI.bzTab = t; SACT.bzOpen(); },
  grGoX(k) { UI.wm = 'grow'; if (k === 'route') { UI.grTab = 'route'; render(); return; } SACT.grGo(k); }
});
function ntModal() {
  const L = nts(), off = UIS.ntOff || {};
  let h = '<div class="rt-modal" data-a="wmClose"><div class="rt-mbox wm-box" data-a="noop"><div class="rt-mh"><span class="rt-mic">🔔</span><div><b>通知中心</b><div class="meta">點一下直接去處理 · 開著時時間暫停</div></div><button class="btn ghost" data-a="wmClose" style="margin-left:auto">關閉</button></div>';
  if (!L.length) h += '<p class="nt-empty">✅ 目前沒有要處理的事，做你想做的吧！</p>';
  const grp = { r: '🔴 危險', y: '🟡 該處理了', g: '🟢 好消息' };
  for (const lv of ['r', 'y', 'g']) { const items = L.map((n, i) => [n, i]).filter(([n]) => n.lv === lv); if (!items.length) continue; h += '<div class="nt-g nt-' + lv + '">' + grp[lv] + '</div>' + items.map(([n, i]) => '<button class="nt-row nt-' + lv + '"' + (n.go ? ' data-a="ntGo" data-v="' + i + '"' : ' data-a="noop"') + '><span class="nt-ic">' + n.ic + '</span><span class="nt-tx"><b>' + n.t + '</b>' + (n.sub ? '<i>' + n.sub + '</i>' : '') + '</span><span class="nt-cat">' + NT_CAT[n.cat].split(' ')[1] + (n.go ? ' ›' : '') + '</span></button>').join(''); }
  h += '<details class="guide"><summary>⚙️ 要顯示哪些提醒</summary><div class="gr-chips">' + Object.entries(NT_CAT).map(([c, n]) => '<button class="gr-chip' + (off[c] ? '' : ' on') + '" data-a="ntTog" data-v="' + c + '">' + n + '</button>').join('') + '</div></details>';
  return h + '</div></div>';
}
const _wmHTMLNt = wmHTML;
wmHTML = function () { if (UI.wm === 'notif') return ntModal(); if (UI.wm === 'sleepchk') return sleepChkModal(); return _wmHTMLNt(); };

/* ===== 鈴鐺＋紅點 ===== */
function ntBadges() { const b = {}; for (const n of nts()) if (n.badge) b[n.badge] = (b[n.badge] || 0) + 1; return b; }
const dot = n => n ? '<i class="nt-dot">' + n + '</i>' : '';
const _rtPanelNt = rtPanel;
rtPanel = function () {
  const b = ntBadges(); let h = _rtPanelNt();
  h = h.replace('data-a="bzOpen">🏪 經營', 'data-a="bzOpen">🏪 經營' + dot(b.biz)).replace('data-a="grOpenHub">🌟 成長', 'data-a="grOpenHub">🌟 成長' + dot(b.grow)).replace('data-a="fmOpen">🌾 農場', 'data-a="fmOpen">🌾 農場' + dot(b.farm));
  return h;
};
const _renderNt = render;
render = function () {
  _renderNt();
  const old = document.querySelector('.nt-bell'); if (old) old.remove();
  const tt = document.querySelector('.nt-toastwrap');
  if (!S || S.phase !== 'survive' || !S.sv) { prepChk(); return; }
  const L = nts(), r = L.filter(n => n.lv === 'r').length, all = L.length;
  $app.insertAdjacentHTML('beforeend', '<button class="nt-bell' + (r ? ' hot' : '') + '" data-a="ntOpen" aria-label="通知中心">🔔' + (all ? '<i class="nt-dot' + (r ? '' : ' y') + '">' + all + '</i>' : '') + '</button>');
  statCross();
};
// 狀態掉破 30／20 時跳小提示（只跳一次）
function statCross() {
  const sv = S.sv, m = UI.ntMark || (UI.ntMark = {});
  for (const [k, n] of [['hp', '生命'], ['sat', '飽足'], ['hyd', '水分'], ['sta', '精力'], ['mor', '心態']]) {
    const v = sv[k]; if (v == null) continue; const band = v < 20 ? 2 : v < 30 ? 1 : 0;
    if (m[k] != null && band > m[k]) ntToast((band === 2 ? '🔴 ' : '🟡 ') + n + '掉到 ' + Math.round(v) + '！' + (band === 2 ? '馬上處理' : '該補一下了'), band === 2 ? 'r' : 'y');
    m[k] = band;
  }
}
function ntToast(t, lv) {
  let w = document.querySelector('.nt-toastwrap'); if (!w) { w = document.createElement('div'); w.className = 'nt-toastwrap'; document.body.appendChild(w); }
  const d = document.createElement('div'); d.className = 'nt-toast nt-' + (lv || 'y'); d.textContent = t; w.appendChild(d);
  setTimeout(() => { d.classList.add('out'); setTimeout(() => d.remove(), 400); }, 3200);
}

/* ===== 早上：今日待辦放最上面 ===== */
const _nightNt = night;
night = function (watch) {
  const d0 = S && S.sv && S.sv.day; _nightNt(watch);
  if (!S || !S.sv || S.phase !== 'survive' || S.sv.day === d0) return;
  ntDirty(); UI.ntMark = {};
  const todo = ntList().filter(n => n.cat !== 'night').slice(0, 6);
  const m = UI.morning; if (!m || m.day !== S.sv.day) return;
  const ex = m.extra || [], hi = ex.filter(t => /^(🏮|🏆|🌸|☀️|🍁|❄️|🌟)/.test(t)), rest = ex.filter(t => !hi.includes(t));
  m.extra = hi.concat(rest); m.todo = todo;
};
const _mcNt = morningCard;
morningCard = function () {
  let h = _mcNt(); const m = UI.morning; if (!h || !m || !m.todo || !m.todo.length) return h;
  const box = '<div class="nt-todo"><b>📋 今日待辦</b>' + m.todo.map(n => '<div class="nt-' + n.lv + '"><span>' + n.ic + '</span>' + n.t + (n.sub ? '<i>' + n.sub + '</i>' : '') + '</div>').join('') + '</div>';
  const i = h.lastIndexOf('<button'); return i > 0 ? h.slice(0, i) + box + h.slice(i) : h + box;
};

/* ===== 睡前總檢查 ===== */
function sleepChecks() {
  const sv = S.sv, L = sleepWarnings().map(w => ['r', w]);
  if (hasFm() && typeof needWater === 'function' && needWater()) L.push(['y', '菜圃還沒澆水，明天不會長']);
  if (hasBz() && bizAllowed()) { const bz = BZ(); const due = bz.orders.filter(o => !o.done && o.until === sv.day); if (due.length) L.push(['y', due.length + ' 張訂單今天到期' + (due.some(canFill) ? '，現在就能交！' : '')]); const cus = bz.cust.filter(c => !c.done && sv_has(c.want) > 0).length; if (cus) L.push(['g', cus + ' 位客人還沒招呼（明天就走了）']); }
  if (hasGr() && grOn('night') && isNM() && GR().nmDay !== sv.day && sv.hour < 21) L.push(['g', '今天夜市還沒去']);
  const rot = (sv.fresh || []).filter(f => f.life <= 1.01).reduce((a, f) => a + f.q, 0); if (rot) L.push(['y', rot + ' 份新鮮食物過了今晚就壞']);
  return L;
}
function sleepChkModal() {
  const L = sleepChecks(), sv = S.sv;
  return '<div class="rt-modal" data-a="wmClose"><div class="rt-mbox" data-a="noop"><div class="rt-mh"><span class="rt-mic">🌙</span><div><b>睡前檢查</b><div class="meta">防線 ' + Math.round(sv.def) + ' · 電 ' + (Math.round(sv.power * 10) / 10) + ' 度 · 水 ' + (sv.st.wu || 0) + ' 份</div></div></div>' +
    '<div class="nt-chk">' + L.map(([lv, t]) => '<div class="nt-' + lv + '">' + ({ r: '⚠️', y: '🟡', g: '🟢' }[lv]) + ' ' + esc(t) + '</div>').join('') + '</div>' +
    '<div class="row-btns" style="margin-top:10px"><button class="btn ghost" data-a="wmClose">先不睡，去處理</button><button class="btn red" data-a="sleepGo">還是要睡</button></div>' +
    '<label class="meta nt-off"><input type="checkbox" data-a="ntSleepOff"' + (UIS.ntSleepOff ? ' checked' : '') + '> 以後不要問我</label></div></div>';
}
const _rtQuickNt = SACT.rtQuick;
SACT.rtQuick = function (v) { if (v === 'sleep' && needSleepChk()) { UI.wm = 'sleepchk'; UI.sleepVia = ['rtQuick', v]; render(); return; } return _rtQuickNt(v); };
const _rtDoNt = SACT.rtDo;
SACT.rtDo = function (i) { const sel = UI.rtSel, o = sel && sel !== 'DOOR' && isoObjects().find(x => x.id === sel), acts = o ? rtActions(o.k) : [], x = acts[Number(i)]; if (x && x.a === 'sleep' && needSleepChk()) { UI.wm = 'sleepchk'; UI.sleepVia = ['rtDo', i]; UI.sleepSel = sel; render(); return; } return _rtDoNt(i); };
function needSleepChk() { return !UIS.ntSleepOff && !UI.sleepOk && S.sv && !S.sv.out && sleepChecks().length > 0; }
Object.assign(SACT, {
  sleepGo() { const v = UI.sleepVia || ['rtQuick', 'sleep']; UI.wm = null; UI.sleepOk = true; if (v[0] === 'rtDo') UI.rtSel = UI.sleepSel; try { SACT[v[0]](v[1]); } finally { UI.sleepOk = false; } },
  ntSleepOff() { UIS.ntSleepOff = !UIS.ntSleepOff; saveUI(); render(); }
});

/* ===== 出門前檢查（外出面板最上面） ===== */
const _viewOutNt = viewOutside;
viewOutside = function () {
  const h = _viewOutNt(), sv = S.sv; if (sv.out) return h;
  const L = [];
  if (sv.sta < 30) L.push(['r', '精力只剩 ' + Math.round(sv.sta) + '，走不了多遠']);
  if (sv.hp < 50) L.push(['r', '生命只剩 ' + Math.round(sv.hp) + '，遇到殭屍很危險']);
  if (sv.hour >= 15) L.push(['y', '已經 ' + sv.hour + ':00，天黑前要回來']);
  if (sv.sat < 40 || sv.hyd < 40) L.push(['y', '先吃飽喝足再出門']);
  if (hordeOn(sv.day)) L.push(['r', '今晚屍潮！出門會來不及加固']);
  if (!L.length) L.push(['g', '狀態不錯，可以出門']);
  return '<div class="nt-chk nt-outchk"><b>🎒 出門前檢查</b>' + L.map(([lv, t]) => '<div class="nt-' + lv + '">' + ({ r: '⚠️', y: '🟡', g: '✅' }[lv]) + ' ' + t + '</div>').join('') + '</div>' + h;
};

/* ===== 準備期：出發清單 ===== */
function prepChk() {
  const old = document.querySelector('.prep-chk'); if (old) old.remove();
  if (!S || S.phase !== 'play' || !S.home) return;
  const q = k => (S.home[k] || 0) + ((S.carry || {})[k] || 0);
  const food = Object.keys(FOOD).reduce((a, k) => a + q(k) * (FOOD[k].sat || 0), 0) / 60;
  const water = q('water') * 2 + q('wu');
  const doorM = q('board') + q('metal') + q('sandbag');
  const power = q('gen') + q('solar') + q('pedal');
  const meds = q('medkit') + q('pills') + q('antib');
  const seeds = Object.keys(SEED_OUT).reduce((a, k) => a + q(k), 0) + q('lightbox') + q('pot');
  const C = [
    ['🍚', '食物夠 10 天', food >= 10, Math.floor(food) + ' 天'], ['💧', '水夠 10 天', water >= 20, water + ' 份'], ['🚪', '加固材料 6 個以上', doorM >= 6, doorM + ' 個'],
    ['⚡', '有發電設備', power > 0, power ? '有' : '沒有'], ['💊', '藥品 2 個以上', meds >= 2, meds + ' 個'], ['🌱', '有種子或種植箱', seeds > 0, seeds ? '有' : '沒有']
  ];
  const ok = C.filter(c => c[2]).length, t = S.t;
  const late = t >= 420 && t < 480 ? '<div class="nt-y">⏰ 15:00 了，大型設備 16:00 後就不送了</div>' : '';
  const poor = S.money < 300 && ok < 6 ? '<div class="nt-y">💰 錢快花完了，還缺：' + C.filter(c => !c[2]).map(c => c[1].replace(/ .*/, '')).join('、') + '</div>' : '';
  $app.insertAdjacentHTML('beforeend', '<details class="prep-chk"' + (UI.prepChkOpen ? ' open' : '') + '><summary data-a="prepChkTog">📋 出發清單 ' + ok + '/' + C.length + (ok < C.length ? ' ⚠️' : ' ✅') + '</summary>' + C.map(c => '<div class="' + (c[2] ? 'ok' : 'no') + '">' + (c[2] ? '✅' : '⬜') + ' ' + c[0] + ' ' + c[1] + '<i>' + c[3] + '</i></div>').join('') + late + poor + '</details>');
}
SACT.prepChkTog = function () { UI.prepChkOpen = !UI.prepChkOpen; };
if (ACT && !ACT.prepChkTog) ACT.prepChkTog = function () { UI.prepChkOpen = !UI.prepChkOpen; render(); };
