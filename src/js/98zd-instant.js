/* ================= 點了馬上做好＋彈出視窗 =================
   即時模式下：點家裡的東西跳出視窗（床：「要睡覺嗎？」、櫃子：裡面有什麼），
   選了就馬上完成（時間照樣扣），不用等進度條。外出翻找也是一點就好。
   設定可以切回「走過去慢慢做」。 */
if (UIS.instant == null) UIS.instant = true;
const instOn = () => UIS.instant !== false;

const OBJ_ASK = {
  bed: '要睡覺嗎？', bedroom: '要睡覺嗎？', toilet: '要清理一下嗎？', freezer: '要吃點什麼嗎？', microwave: '要煮什麼？',
  gen: '要發電嗎？', pedal: '要踩一下發電機嗎？', bench: '要做點什麼？', workshop: '要做點什麼？', storage: '櫃子裡有這些', shelf: '架上有這些',
  lightbox: '要種什麼？', greenhouse: '要種什麼？', potrack: '要種什麼？', DOOR: '大門', ac: '冷氣', heater: '暖爐', battery: '儲電站',
  juicer: '要榨果汁嗎？', brewer: '要釀酒嗎？', refinery: '要精煉柴油嗎？', radar: '雷達', powerroom: '配電盤'
};
const OBJ_IC = { bed: '🛏️', bedroom: '🛏️', toilet: '🚽', freezer: '🧊', microwave: '🍳', gen: '⚡', pedal: '🚲', bench: '🔨', workshop: '🔨', storage: '🗄️', shelf: '🗄️', lightbox: '🌱', greenhouse: '🌱', potrack: '🪴', DOOR: '🚪', ac: '❄️', heater: '🔥', battery: '🔋', juicer: '🧃', brewer: '🍶', refinery: '⚗️', radar: '📡', powerroom: '🔌' };

/* ---------- 馬上做 ---------- */
function doNow(where, a, v, label) {
  const sv = S.sv, rt = rtState();
  if (a === 'TAB') { UI.rtSel = null; if (v === 'out') { UI.rtOut = true; render(); return; } UI.tab = v; render(); return; }
  const fn = SACT[a]; if (!fn) return;
  // 角色直接站到那樣東西旁邊
  const g = rtGoalTiles(where);
  if (g && g.tiles && g.tiles.length) { rt.pos = { f: g.f, x: g.tiles[0][0] + 0.5, y: g.tiles[0][1] + 0.5 }; UI.iso = Object.assign(UI.iso || {}, { floor: g.f }); }
  rt.task = null; rt.queue = []; rt.path = []; rt.frac = 0;
  UI.rtSel = null;
  const h0 = sv.hour, d0 = sv.day, log0 = sv.log[0];
  rt.workA = a; rt.workUntil = performance.now() + (['eat', 'eatFull', 'drink', 'drinkFull'].includes(a) ? 1600 : a === 'rest' ? 2200 : 900);
  if (a === 'sleep' || a === 'watch') { fn(v); return; }
  fn(v);
  if (S.phase !== 'survive') return;
  const failed = S.sv.log[0] === log0 && S.sv.hour === h0 && S.sv.day === d0;
  const E = typeof evState === 'function' ? evState() : null;
  if (E && S.sv.day === d0) E.fx = (E.fx || []).concat([{ x: rt.pos.x, y: rt.pos.y, txt: failed ? '做不了' : (TASK_IC[a] || '') + ' ✓', col: failed ? '#9aa7b4' : '#ecd27a', t0: performance.now() }]);
  if (failed) slog('「' + label + '」沒做成（時間、體力或材料不夠）。');
  if (['craft', 'reinforce', 'evRepair'].includes(a)) sfx('fix'); else if (a === 'eatFull' || a === 'eat') sfx('eat'); else if (!failed) sfx('pop');
  render();
}
const _rtDoInst = SACT.rtDo;
SACT.rtDo = function (i) {
  if (!instOn()) return _rtDoInst(i);
  const k = UI.rtSel === 'DOOR' ? 'DOOR' : (isoObjects().find(o => o.id === UI.rtSel) || {}).k;
  const x = k && rtActions(k)[Number(i)]; if (!x || !x.ok) return;
  doNow(k === 'DOOR' ? 'DOOR' : UI.rtSel, x.a, x.v, x.label.replace(/（.*）/, ''));
};
const _rtQuickInst = SACT.rtQuick;
SACT.rtQuick = function (v) {
  if (!instOn() || v === 'out') return _rtQuickInst(v);
  const hz = hordeOn(S.sv.day);
  if (v === 'sleep') return doNow(hz ? 'DOOR' : 'bed|bedroom', 'sleep', '', '睡覺');
  doNow(RT_SPOT[v], v, '', v === 'eatFull' ? '吃東西' : '喝水');
};
// 櫃子／冰櫃裡直接吃、喝、用藥
Object.assign(SACT, {
  mEat(k) { const where = UI.rtSel; doNow(where, 'eat', k, '吃' + ITEMS[k].n); UI.rtSel = null; render(); },
  mDrink() { doNow(UI.rtSel, 'drink', '', '喝水'); },
  mHeal(k) { doNow(UI.rtSel, 'heal', k, '用' + ITEMS[k].n); },
  noop() {},
  instToggle() { UIS.instant = !instOn(); saveUI(); render(); }
});

/* ---------- 彈出視窗 ---------- */
function objModal() {
  const sv = S.sv, sel = UI.rtSel; if (!sel) return '';
  const k = sel === 'DOOR' ? 'DOOR' : (isoObjects().find(o => o.id === sel) || {}).k; if (!k) return '';
  const name = k === 'DOOR' ? '大門' : ISO[k].n;
  const hz = hordeOn(sv.day);
  let sub = '現在 ' + String(sv.hour).padStart(2, '0') + ':00 · 精力 ' + Math.round(sv.sta);
  if (k === 'bed' || k === 'bedroom') sub += hz ? ' · <b style="color:#b8322a">今晚有屍潮！睡著就沒辦法守夜</b>' : ' · 睡到明天 08:00';
  if (k === 'DOOR') sub = '防線 ' + Math.round(sv.def) + ' / ' + sv.defMax;
  if ((sv.broken || {})[k]) sub = '<b style="color:#b8322a">故障了，要先修</b>';
  let body = '';
  // 櫃子：看裡面有什麼，可以直接吃喝用
  if (['storage', 'shelf', 'freezer'].includes(k)) {
    const foods = Object.keys(FOOD).filter(f => sv_has(f) > 0);
    const meds = ['medkit', 'pills'].filter(m => sv.st[m] > 0);
    const water = sv.st.wu || 0, tap = sv.day <= 5;
    body += '<div class="mgrid">' + foods.map(f => '<button class="mcell" data-a="mEat" data-v="' + f + '"><b>' + itemIc(f) + ITEMS[f].n + '</b><span>×' + sv_has(f) + ' · 飽足 +' + FOOD[f].sat + '</span></button>').join('') +
      '<button class="mcell" data-a="mDrink"' + (water >= 1 || tap ? '' : ' disabled') + '><b>' + itemIc('wu') + (tap ? '自來水' : '飲用水') + '</b><span>' + (tap ? '還沒停水' : '×' + water) + ' · 水分 +30</span></button>' +
      meds.map(m => '<button class="mcell" data-a="mHeal" data-v="' + m + '"><b>' + itemIc(m) + ITEMS[m].n + '</b><span>×' + sv.st[m] + ' · 生命 +' + (m === 'medkit' ? 35 : 10) + '</span></button>').join('') + '</div>';
    if (!foods.length && !meds.length) body += '<p class="meta">沒有可以吃的東西了。</p>';
    const mats = ['board', 'metal', 'glass', 'plastic', 'diesel', 'molotov'].filter(m => sv.st[m] > 0);
    if (mats.length) body += '<p class="meta" style="margin-top:6px">材料：' + mats.map(m => ITEMS[m].n + ' ' + sv.st[m]).join('、') + '</p>';
  }
  const acts = rtActions(k);
  body += acts.length ? '<div class="macts">' + acts.map((x, i) => '<button class="btn' + (x.a === 'sleep' ? ' red' : '') + '" data-a="rtDo" data-v="' + i + '"' + (x.ok ? '' : ' disabled') + '>' + esc(x.label) + '<small>' + (x.h ? x.h + ' 小時' : '馬上') + (x.note ? ' · ' + esc(x.note) : '') + '</small></button>').join('') + '</div>' : (body ? '' : '<p class="meta">這個東西沒有可以做的事。</p>');
  return '<div class="rt-modal" data-a="rtSelClose"><div class="rt-mbox" data-a="noop"><div class="rt-mh"><span class="rt-mic">' + (OBJ_IC[k] || '📦') + '</span><div><b>' + (OBJ_ASK[k] && !['storage', 'shelf'].includes(k) && k !== 'DOOR' ? OBJ_ASK[k] : name) + '</b><div class="meta">' + (OBJ_ASK[k] && ['storage', 'shelf'].includes(k) ? name + ' · ' : '') + sub + '</div></div></div>' + body +
    '<div class="row-btns" style="margin-top:10px"><button class="btn ghost" data-a="rtSelClose">' + (k === 'bed' || k === 'bedroom' ? '還不要' : '取消') + '</button></div></div></div>';
}
// 面板不再顯示選中物件的清單（改用視窗）
const _rtPanelInst = rtPanel;
rtPanel = function () {
  const sel = UI.rtSel; UI.rtSel = null;
  let h = _rtPanelInst(); UI.rtSel = sel;
  h += '<div class="setrow" style="margin-top:6px"><span>做事方式</span><button class="pill' + (instOn() ? ' on' : '') + '" data-a="instToggle">點了馬上做好</button><button class="pill' + (!instOn() ? ' on' : '') + '" data-a="instToggle">走過去慢慢做</button></div>';
  return h;
};
const _renderInst = render;
render = function () {
  _renderInst();
  if (rtActive() && UI.rtSel) $app.insertAdjacentHTML('beforeend', objModal());
};

/* ---------- 外出：一點就翻完 ---------- */
const _otGoInst = SACT.otGo;
SACT.otGo = function (i) {
  if (!instOn()) return _otGoInst(i);
  const sv = S.sv, o = sv.out; if (!o || o.enc) return;
  const idx = o.conts.findIndex(c => String(c.i) === String(i)); if (idx < 0) return;
  if (sv.locs[o.loc].done.includes(String(i))) { slog('這裡已經搜過了。'); render(); return; }
  const rt = otState(), sp = otSpot(o.conts[idx], idx);
  rt.pos = { x: sp.x, y: sp.y + 0.35 }; rt.path = []; rt.frac = 0;
  rt.task = { i: String(i), n: o.conts[idx].n, p: 1 };
  otFinish(); render();
};
const _otExitInst = SACT.otExit;
SACT.otExit = function () {
  if (!instOn()) return _otExitInst();
  const o = S.sv.out; if (!o || (o.enc && o.enc.t === 'z')) return;
  SACT.goHome();
};
