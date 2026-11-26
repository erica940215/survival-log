/* ================= 第四波：家園等級、果樹、田地與灌溉升級、動物長大與心情、牛豬、行情、合約、分店、宴席、醬料熟成、里程碑、挑戰永久模式 ================= */
const G4 = () => { const g = G3(); if (!g.g4) g.g4 = { soilT: 1, irr: 1, trees: [], young: [], mood: 60, barn: false, cows: 0, sty: false, pigs: [], mkt: {}, mktDay: 0, con: null, branches: [], feastDay: -99, sauce: {}, setName: '', mile: {} }; return g.g4; };

/* ===== 新物品 ===== */
const G4_IT = {
  mango_s: ['芒果樹苗', 'farm', 1], lychee_s: ['荔枝樹苗', 'farm', 1], orange_s: ['柳丁樹苗', 'farm', 1], wax_s: ['蓮霧樹苗', 'farm', 1],
  mango: ['芒果', 'food', 0.3], lychee: ['荔枝', 'food', 0.1], orange: ['柳丁', 'food', 0.2], wax_apple: ['蓮霧', 'food', 0.2],
  cow_milk: ['牛奶', 'food', 1], butter: ['奶油', 'food', 0.2], pork: ['豬肉', 'food', 0.5], braised_pork: ['滷肉飯', 'food', 0.4], cow: ['乳牛', 'farm', 50], piglet: ['小豬', 'farm', 10]
};
for (const [k, [n, cat, w]] of Object.entries(G4_IT)) ITEMS[k] = { n, cat, w, note: '' };
Object.assign(FOOD, { mango: { sat: 15, mor: 12 }, lychee: { sat: 10, mor: 12 }, orange: { sat: 12, mor: 8 }, wax_apple: { sat: 12, mor: 9 }, cow_milk: { sat: 20, mor: 3 }, butter: { sat: 25, mor: 6 }, pork: { sat: 35, mor: 4 }, braised_pork: { sat: 60, mor: 18, dish: true } });
Object.assign(ITEM_EMO, { mango_s: '🌳', lychee_s: '🌳', orange_s: '🌳', wax_s: '🌳', mango: '🥭', lychee: '🍒', orange: '🍊', wax_apple: '🍎', cow_milk: '🥛', butter: '🧈', pork: '🥩', braised_pork: '🍚', cow: '🐄', piglet: '🐖' });
Object.assign(FRESH_LIFE, { mango: 4, lychee: 3, orange: 6, wax_apple: 3, cow_milk: 3, pork: 2 });
Object.assign(PROC, { butter: { at: 'jars', need: { cow_milk: 3 }, q: 2, days: 2 } });
Object.assign(DISHES, { braised_pork: { lv: 3, need: { pork: 1, rice: 1, soy: 1 }, q: 3, power: 0.3 } });
Object.assign(MARKET, { mango_s: [40, 2], lychee_s: [40, 2], orange_s: [35, 2], wax_s: [35, 2], cow: [200, 3], piglet: [60, 2] });
const TREES = { mango_s: { out: 'mango', se: 1 }, lychee_s: { out: 'lychee', se: 1 }, orange_s: { out: 'orange', se: 3 }, wax_s: { out: 'wax_apple', se: 0 } };
const SAUCE_K = ['soy', 'vinegar', 'chili_sauce', 'scallion_oil', 'peanut_paste', 'rice_wine'];

/* ===== 家園等級 ===== */
function homeScore() {
  if (!hasG3()) return 0; const gr = GR(), g = G3(), g4 = G4(), sv = S.sv;
  return Object.values(gr.furn).reduce((a, b) => a + (b - 1) * 2, 0) + Object.keys(gr.deco).length * 2 + Object.keys(g.shopUp).length * 3 + (g.stove - 1) * 3 + (g.farm2 ? 8 : 0) +
    (g4.soilT - 1) * 3 + (g4.irr - 1) * 3 + g4.trees.length * 2 + (g4.barn ? 4 : 0) + (g4.sty ? 3 : 0) + Object.keys(gr.line).length * 3 + (sv.rooms || []).length * 3 + (F().beds || 0) * 2 + (gr.pond ? 3 : 0);
}
const HOME_T = [0, 10, 25, 45, 70, 100, 140, 190, 250, 320];
const HOME_N = ['', '破舊小公寓', '整齊的家', '溫馨小窩', '生活據點', '小型農莊', '城市綠洲', '倖存者之家', '末日莊園', '傳說中的家'];
const HOME_DECO = ['', '', '🪴 盆栽', '🖼️ 掛畫', '🕰️ 老時鐘', '🐠 魚缸', '🎐 風鈴', '🏮 燈籠串', '🎹 鋼琴', '🏆 金色獎盃'];
const homeLv = () => { const s = homeScore(); let l = 1; HOME_T.forEach((t, i) => { if (i && s >= t) l = i; }); return Math.max(1, l); };

/* ===== 動作 ===== */
Object.assign(SACT, {
  trPlant(k) { const g = G4(); if (!TREES[k] || sv_has(k) <= 0 || g.trees.length >= 6 + (G3().farm2 ? 4 : 0)) return; sv_take(k, 1); g.trees.push({ k, age: 0 }); slog('🌳 種下一棵' + ITEMS[k].n.replace('樹苗', '樹') + '。果樹要長 8 天才開始結果，越老結越多。'); render(); },
  soUp() { const g = G4(), C = [null, null, { fert: 4, board: 4 }, { fert: 8, clay: 6, honey: 1 }][g.soilT + 1], coin = [0, 0, 60, 150][g.soilT + 1]; if (!C) return; if (BZ().coin < coin || !payN(C)) { slog('材料或瓶蓋不夠。'); render(); return; } BZ().coin -= coin; g.soilT++; slog('🟫 田地升級成' + ['', '普通土', '培養土', '黑金土'][g.soilT] + '！收成和品質都變好。'); sfx('ach'); render(); },
  irUp() { const g = G4(), C = [null, null, { plastic: 6, barrel: 1 }, { plastic: 4, metal: 4, cell: 1 }][g.irr + 1], coin = [0, 0, 40, 100][g.irr + 1]; if (!C) return; if (BZ().coin < coin || !payN(C)) { slog('材料或瓶蓋不夠。'); render(); return; } BZ().coin -= coin; g.irr++; if (g.irr >= 3) F().sprinkle = true; slog('💧 灌溉升級成' + ['', '提水桶', '滴灌', '自動噴灑'][g.irr] + '！' + (g.irr === 2 ? '每天早上自動用水澆菜。' : '再也不用澆水了。')); sfx('ach'); render(); },
  anClean() { const sv = S.sv, g = G4(); if (!canAct(1, 6)) { slog('時間或體力不夠。'); render(); return; } g.mood = Math.min(100, g.mood + 20); sv.sta -= 6; slog('🧹 把雞舍、兔籠打掃乾淨，動物們心情變好了。'); passHours(1); render(); },
  anTreat() { const g = G4(), f = ['mango', 'lychee', 'orange', 'wax_apple', 'straw_p', 'corn_p', 'pumpkin_p'].find(k => sv_has(k) > 0); if (!f) { slog('沒有水果或玉米可以當點心。'); render(); return; } sv_take(f, 1); g.mood = Math.min(100, g.mood + 12); slog('🍎 拿' + ITEMS[f].n + '給動物當點心，牠們開心地圍過來。'); render(); },
  baBuild(k) { const g = G4(), C = k === 'barn' ? { board: 12, metal: 6 } : { board: 8, clay: 4 }; if (g[k]) return; if (!payN(C)) { slog('材料不夠：' + needTxt(C).replace(/<[^>]+>/g, '')); render(); return; } g[k] = true; slog(k === 'barn' ? '🐄 牛棚蓋好了，去市集買乳牛。' : '🐖 豬圈蓋好了，去市集買小豬。'); sfx('fix'); render(); },
  baAdd(k) { const g = G4(), sv = S.sv; if (k === 'cow' && g.barn && sv_has('cow') > 0 && g.cows < 3) { sv_take('cow', 1); g.cows++; slog('乳牛住進牛棚，哞～'); } if (k === 'piglet' && g.sty && sv_has('piglet') > 0 && g.pigs.length < 4) { sv_take('piglet', 1); g.pigs.push({ age: 0 }); slog('小豬住進豬圈，會吃廚餘長大。'); } render(); },
  baSell() { const g = G4(), big = g.pigs.filter(p => p.age >= 15); if (!big.length) return; g.pigs = g.pigs.filter(p => p.age < 15); addIt('pork', big.length * 6); gainXp('ranch', big.length * 3); slog('🐖 ' + big.length + ' 頭豬長大了，處理成 ' + big.length * 6 + ' 份豬肉。'); render(); },
  coSign(i) { const g = G4(), O = CONTRACTS[Number(i)]; if (g.con || !O) return; g.con = { i: Number(i), strikes: 0, days: 0 }; slog('📝 跟' + O.n + '簽了供應合約：每天' + O.d + '，每天 🪙' + O.pay + '。'); render(); },
  coEnd() { const g = G4(); if (!g.con) return; slog('📝 解除了跟' + CONTRACTS[g.con.i].n + '的合約。'); g.con = null; render(); },
  brOpen() { const g = G4(), bz = BZ(), gr = GR(); if (g.branches.length >= 3) return; const free = gr.staff.find(s => !g.branches.some(b => b.who === s.n)); if (!free) { slog('要有一位沒派去分店的員工。'); render(); return; } if (bz.coin < 500) { slog('開分店要 500 瓶蓋。'); render(); return; } bz.coin -= 500; const loc = ['東區避難所', '河濱營地', '舊學校據點'][g.branches.length]; g.branches.push({ loc, who: free.n, day: S.sv.day }); slog('🏬 在' + loc + '開了分店，' + free.n + '去顧店，每天會回傳收入。', true); sfx('ach'); render(); },
  feast() {
    const g = G4(), sv = S.sv; if (sv.day - g.feastDay < 7) return; const ds = Object.keys(FOOD).filter(k => FOOD[k].dish && sv_has(k) > 0).slice(0, 6); if (ds.length < 6) { slog('辦桌要 6 道不同的料理。'); render(); return; }
    if (!canAct(3, 10)) { slog('辦桌要 3 小時。'); render(); return; } let q = 0; ds.forEach(k => { q += qOf(k)[1] ? 2 : qOf(k)[0] ? 1 : 0; takeBest(k); });
    g.feastDay = sv.day; sv.mor = clamp(sv.mor + 30); const rep = 10 + q * 2, coin = 50 + q * 15; BZ().rep += rep; BZ().coin += coin; sv.sta -= 10; UI.feFx = performance.now();
    slog('🎉 辦了一桌：' + ds.map(k => ITEMS[k].n).join('、') + '！鄰居們吃得好開心，心態 +30、聲望 +' + rep + '，大家湊了 ' + coin + ' 瓶蓋紅包。', true); sfx('ach'); passHours(3); render();
  },
  setNameSet() { const el = document.getElementById('set-name'); const v = el ? el.value.trim().slice(0, 12) : ''; G4().setName = v; slog(v ? '🍱 招牌套餐取名叫「' + v + '」，掛在店門口了。' : '拿掉套餐名稱。'); render(); },
  fhTog() { UIS.fHard = !UIS.fHard; saveUI(); render(); }
});
const CONTRACTS = [
  { n: '東區避難所', d: '送 3 份料理', need: () => Object.keys(FOOD).filter(k => FOOD[k].dish), q: 3, pay: 60 },
  { n: '河濱營地', d: '送 5 個蔬果', need: () => CROPS().concat(['mango', 'lychee', 'orange', 'wax_apple']), q: 5, pay: 35 },
  { n: '舊學校據點', d: '送 4 份蛋奶', need: () => ['egg', 'duck_egg', 'goat_milk', 'cow_milk', 'cheese', 'butter'], q: 4, pay: 45 }
];
// 套餐名稱：價格 +10%
const _setServeG4 = SACT.setServe;
SACT.setServe = function (i) { const bz = BZ(), c0 = bz.coin; _setServeG4(i); if (hasG3() && G4().setName && bz.coin > c0) { const add = Math.round((bz.coin - c0) * 0.1); bz.coin += add; } };

/* ===== 市場行情 ===== */
function mktRoll() {
  const g = G4(), sv = S.sv; if (g.mktDay === sv.day) return; g.mktDay = sv.day;
  for (const k of Object.keys(FOOD)) { const p = g.mkt[k] || 1, drift = (rnd() - 0.5) * 0.25 + (1 - p) * 0.15; g.mkt[k] = Math.max(0.6, Math.min(1.8, p + drift)); }
  const hot = Object.keys(g.mkt).filter(k => ITEMS[k]).sort(() => rnd() - 0.5)[0]; if (hot) g.mkt[hot] = 1.8;
}
const mktOf = k => hasG3() && grOn('market') ? (G4().mkt[k] || 1) : 1;
const _valG4 = valOf;
valOf = function (k) { return Math.max(1, Math.round(_valG4(k) * mktOf(k))); };

/* ===== 每晚 ===== */
const _nightG4 = night;
night = function (watch) {
  const ok = S && S.sv && S.phase === 'survive' && hasG3(), d0 = ok && S.sv.day, snap = {};
  const PRODS = ['egg', 'honey', 'rabbit_m', 'duck_egg', 'goat_milk'];
  if (ok) for (const k of CROPS().concat(PRODS)) snap[k] = sv_has(k);
  _nightG4(watch);
  if (!ok || !S.sv || S.phase !== 'survive' || S.sv.day === d0) return;
  const sv = S.sv, g = G4(), gr = GR(), bz = BZ(), fm = F(), R = W().roof || {}, ex = [];
  // 田地等級、灌溉
  if (g.soilT > 1) { let n = 0; for (const k of CROPS()) { const d = sv_has(k) - (snap[k] || 0); if (d > 0) { const b = Math.floor(d * (g.soilT === 3 ? 0.25 : 0.1) + rnd()); if (b) { addIt(k, b); n += b; } } } if (n) ex.push('🟫 ' + ['', '', '培養土', '黑金土'][g.soilT] + '多長了 ' + n + ' 個作物。'); }
  if (g.irr === 2 && typeof greenPlants === 'function' && greenPlants().length && fm.wateredDay !== sv.day) { const n = Math.max(1, Math.ceil(greenPlants().length / 8)); if (sv.day <= 5 || (sv.st.wu || 0) >= n) { if (sv.day > 5) sv.st.wu -= n; fm.wateredDay = sv.day; ex.push('💧 滴灌自動澆好水了（用了 ' + (sv.day <= 5 ? 0 : n) + ' 份水）。'); } else ex.push('💧 滴灌沒水了，記得補水。'); }
  // 果樹
  const se = season();
  for (const t of g.trees) { t.age++; const T = TREES[t.k]; if (t.age >= 8 && t.age % 3 === 0) { const n = 1 + Math.floor(t.age / 10) + (T.se === se ? 2 : 0); addIt(T.out, n); codexMark(T.out, 0); qRoll(T.out, n); } }
  const ripe = g.trees.filter(t => t.age >= 8 && t.age % 3 === 0).length; if (ripe) ex.push('🌳 ' + ripe + ' 棵果樹結果了。');
  // 動物心情、長大
  const hasAnimals = (R.hens || 0) + (fm.rabbits || 0) + g.cows + g.pigs.length > 0;
  if (hasAnimals) {
    g.mood = Math.max(0, Math.min(100, g.mood - 5 + (fm.rabbitFed || fm.feeder ? 2 : 0) + (sv.hyg > 60 ? 2 : 0)));
    const mul = 0.8 + g.mood / 200; let d = 0;
    for (const k of PRODS) { const got = sv_has(k) - (snap[k] || 0); if (got > 0) { const n = Math.round(got * (mul - 1)); if (n > 0) { addIt(k, n); d += n; } else if (n < 0) sv_take(k, Math.min(-n, got)); } }
    if (g.mood >= 75 && d) ex.push('💕 動物們心情很好，多產了 ' + d + ' 份。'); else if (g.mood < 35) ex.push('😿 動物們心情不好（' + Math.round(g.mood) + '），產量變少。打掃或給點心吧。');
    if ((R.hens || 0) >= 2 && rnd() < 0.12 && g.young.length < 4) { g.young.push({ sp: 'hen', age: 0 }); ex.push('🐣 雞舍裡孵出一隻小雞！'); }
    if ((fm.rabbits || 0) >= 2 && rnd() < 0.08 && g.young.length < 4) { g.young.push({ sp: 'rabbit', age: 0 }); ex.push('🐰 兔籠裡多了一隻小兔子！'); }
    g.young.forEach(y => y.age++); const grown = g.young.filter(y => y.age >= 5); g.young = g.young.filter(y => y.age < 5);
    for (const y of grown) { if (y.sp === 'hen') R.hens = Math.min(6, (R.hens || 0) + 1); else fm.rabbits = Math.min(10, (fm.rabbits || 0) + 1); ex.push(y.sp === 'hen' ? '🐔 小雞長大成母雞了。' : '🐇 小兔子長大了。'); }
  }
  // 牛、豬
  if (g.cows) { const n = Math.round(g.cows * 2 * (0.8 + g.mood / 200)); addIt('cow_milk', n); qRoll('cow_milk', n); ex.push('🐄 擠了 ' + n + ' 瓶牛奶。'); }
  if (g.pigs.length) { const scraps = ['dark_dish', 'veg', 'veg_dry', 'cabbage_p', 'yam_p', 'corn_p', 'wheat_p']; let fed = 0; for (const s of scraps) while (fed < g.pigs.length && sv_has(s) > 0) { sv_take(s, 1); fed++; } g.pigs.forEach((p, i) => { if (i < fed) p.age++; }); if (fed < g.pigs.length) ex.push('🐖 廚餘不夠，有豬沒吃飽。'); const big = g.pigs.filter(p => p.age >= 15).length; if (big) ex.push('🐖 有 ' + big + ' 頭豬長大了，可以出欄。'); }
  // 醬料熟成
  for (const k of SAUCE_K) g.sauce[k] = sv_has(k) > 0 ? (g.sauce[k] || 0) + 1 : 0;
  // 行情
  if (grOn('market')) { mktRoll(); const up = Object.entries(g.mkt).filter(([k]) => ITEMS[k]).sort((a, b) => b[1] - a[1]).slice(0, 2); ex.push('📈 今日行情：' + up.map(([k, p]) => ITEMS[k].n + ' ×' + p.toFixed(1)).join('、') + ' 最搶手。'); }
  // 合約
  if (g.con) { const O = CONTRACTS[g.con.i], pool = O.need(); let left = O.q; for (const k of pool) while (left > 0 && sv_has(k) > 0) { takeBest(k); left--; }
    if (left === 0) { bz.coin += O.pay; gr.stats.coin += O.pay; g.con.days++; g.con.strikes = 0; ex.push('📝 合約送貨完成（' + O.n + '），+' + O.pay + ' 瓶蓋。'); }
    else { g.con.strikes++; bz.rep = Math.max(0, bz.rep - 5); ex.push('📝 合約斷貨！' + O.n + '很不滿，聲望 -5（' + g.con.strikes + '/3）。'); if (g.con.strikes >= 3) { ex.push('📝 ' + O.n + '終止了合約。'); g.con = null; } } }
  // 分店
  if (g.branches.length) { let c = 0; for (const b of g.branches) { const v = 30 + lvOfK('shop') * 10 + Math.floor(rnd() * 20); c += v; } if (rnd() < 0.08) { c = Math.round(c / 2); ex.push('🏬 有分店遇到屍群騷擾，今天營收減半。'); } bz.coin += c; gr.stats.coin += c; ex.push('🏬 ' + g.branches.length + ' 間分店回傳營收 ' + c + ' 瓶蓋。'); }
  // 里程碑
  const ST = gr.stats; for (const [id, f, goal, ic, n] of MILES) { if (!g.mile[id] && (ST[f] || 0) >= goal) { g.mile[id] = sv.day; ex.push('🎖️ 里程碑達成：' + n + '！家裡多了一個' + ic + '紀念擺設。'); } }
  // 家園升級
  const hl = homeLv(); if (hl > (g.homeLv || 1)) { g.homeLv = hl; ex.push('🏠 家園升到 Lv.' + hl + '「' + HOME_N[hl] + '」！' + (HOME_DECO[hl] ? '解鎖擺設：' + HOME_DECO[hl] + '。' : '')); }
  if (UI.morning && UI.morning.day === sv.day) UI.morning.extra = (UI.morning.extra || []).concat(ex); else ex.forEach(t => slog(t));
};
const MILES = [['h1', 'harvest', 300, '🧺', '累積收成 300'], ['h2', 'harvest', 1000, '🌾', '累積收成 1000'], ['c1', 'coin', 3000, '💰', '累積營收 3000'], ['c2', 'coin', 10000, '🏦', '累積營收 10000'], ['e1', 'exc', 30, '✨', '極品 30 個'], ['e2', 'exc', 100, '👑', '極品 100 個'], ['k1', 'cook', 100, '🍳', '煮菜 100 次'], ['k2', 'cook', 500, '🧑‍🍳', '煮菜 500 次'], ['o1', 'orders', 30, '📌', '訂單 30 張']];

// 醬料熟成 ＆ 田地品質：料理／作物品質加成
const _qRollG4 = qRoll;
qRoll = function (k, n) {
  const [g, e] = _qRollG4(k, n); if (!hasG3()) return [g, e]; const g4 = G4(); let p = 0;
  const D = DISHES[k]; if (D && Object.keys(D.need).some(m => SAUCE_K.includes(m) && (g4.sauce[m] || 0) >= 7)) p += 0.12;
  if (Object.values(SEED_OUT).includes(k)) p += (g4.soilT - 1) * 0.05;
  if (!p) return [g, e]; const Q = BZ().qual[k] || (BZ().qual[k] = [0, 0]); let up = 0; for (let i = 0; i < n - g - e; i++) if (rnd() < p) up++; Q[0] += up; return [g + up, e];
};

/* ===== 挑戰版永久模式 ===== */
const _foreverStartG4 = ACT.foreverStart;
ACT.foreverStart = function () { _foreverStartG4(); if (S && S.mods && UIS.fHard) { S.mods.fHard = true; slog('⚔️ 挑戰版永久模式：偶爾會有小規模屍潮和天災，但還是不會餓死。'); render(); } };
const _hordeMulG4 = hordeMul;
hordeMul = function () { if (S && S.mods && S.mods.fHard && S.mods.forever) { const sv = S.sv; return sv && sv.day % 9 === 0 ? 0.3 : 0; } return _hordeMulG4(); };
const _viewTitleG4 = viewTitle;
viewTitle = function () { const h = _viewTitleG4(); return h.replace('<button class="btn nb-big green" data-a="foreverStart">', '<button class="btn ghost nb-hard' + (UIS.fHard ? ' on' : '') + '" data-a="fhTog">' + (UIS.fHard ? '☑' : '☐') + ' 永久模式加一點挑戰（偶爾小屍潮、天災）</button><button class="btn nb-big green" data-a="foreverStart">'); };
if (!ACT.fhTog) ACT.fhTog = SACT.fhTog;

/* ===== 房間：產線輸送帶、家園擺設、里程碑紀念品 ===== */
const _wxLayerG4 = wxLayer;
wxLayer = function () {
  let s = _wxLayerG4(); if (!hasG3()) return s; const gr = GR(), g = G4();
  if (Object.keys(gr.line).length) s += '<div class="wx-belt">' + ['🌾', '🍞', '🥫', '🍶', '📦'].map((e, i) => '<span style="animation-delay:-' + i * 1.6 + 's">' + e + '</span>').join('') + '</div>';
  const decos = HOME_DECO.slice(2, homeLv() + 1).concat(MILES.filter(m => g.mile[m[0]]).map(m => m[3])).slice(0, 10);
  s += decos.map((d, i) => '<span class="wx-deco" style="left:' + (6 + i * 9) + '%">' + d.split(' ')[0] + '</span>').join('');
  return s;
};

/* ===== 頂樓：小動物、心情愛心 ===== */
const _roofSVGG4 = roofSVG;
roofSVG = function () {
  let s = _roofSVGG4(); if (!hasG3()) return s; const g = G4(); let a = '';
  g.young.forEach((y, i) => { a += '<text x="' + (60 + i * 26) + '" y="165" font-size="' + (9 + y.age) + '">' + (y.sp === 'hen' ? '🐥' : '🐰') + '<animateTransform attributeName="transform" type="translate" values="0 0;4 -3;8 0;0 0" dur="1.6s" repeatCount="indefinite"/></text>'; });
  if (g.mood >= 70) for (let i = 0; i < 3; i++) a += '<text x="' + (40 + i * 60) + '" y="135" font-size="10" opacity="0">💕<animate attributeName="opacity" values="0;1;0" dur="2.4s" begin="' + i * 0.8 + 's" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 0;0 -18" dur="2.4s" begin="' + i * 0.8 + 's" repeatCount="indefinite"/></text>';
  if (g.cows) a += '<text x="250" y="150" font-size="18">' + '🐄'.repeat(g.cows) + '</text>';
  if (g.pigs.length) a += '<text x="180" y="166" font-size="14">' + '🐖'.repeat(g.pigs.length) + '</text>';
  g.trees.slice(0, 6).forEach((t, i) => { a += '<text x="' + (150 + i * 18) + '" y="130" font-size="' + (12 + Math.min(10, t.age)) + '">🌳</text>'; });
  return a ? s.replace(/<\/svg>\s*$/, a + '</svg>') : s;
};

/* ===== 成長視窗 ===== */
GROW.push(
  { k: 'homelv', t: 1, ic: '🏠', n: '家園等級', g: 'home', c: () => S.sv.day >= 2, txt: '撐到第 2 天' },
  { k: 'milestone', t: 1, ic: '🎖️', n: '里程碑', g: 'goal', c: () => S.sv.day >= 2, txt: '撐到第 2 天' },
  { k: 'irrig', t: 1, ic: '💧', n: '灌溉系統', g: 'field', c: () => (F().beds || 0) > 0, txt: '蓋好頂樓菜圃' },
  { k: 'animals', t: 1, ic: '🐣', n: '動物長大與心情', g: 'ind', c: () => (W().roof && W().roof.hens > 0) || F().rabbits > 0, txt: '養了雞或兔子' },
  { k: 'orchard', t: 2, ic: '🌳', n: '果樹', g: 'field', c: () => lvOfK('farm') >= 2, txt: '種植 Lv.2' },
  { k: 'soilup', t: 2, ic: '🟫', n: '田地升級', g: 'field', c: () => grOn('soil'), txt: '先解鎖土壤肥力' },
  { k: 'sauce', t: 2, ic: '🫙', n: '醬料熟成', g: 'kitchen', c: () => SAUCE_K.some(k => sv_has(k) > 0), txt: '有任何一種醬料' },
  { k: 'feast', t: 2, ic: '🎉', n: '辦桌宴席', g: 'kitchen', c: () => Object.keys(DISHES).filter(k => J.cdx && J.cdx[k] != null).length >= 6, txt: '做過 6 種料理' },
  { k: 'market', t: 2, ic: '📈', n: '市場行情', g: 'biz', c: () => bzOpenTab('shop'), txt: '小店開張' },
  { k: 'barn', t: 3, ic: '🐄', n: '牛棚與豬圈', g: 'ind', c: () => lvOfK('ranch') >= 3, txt: '養殖 Lv.3' },
  { k: 'contract', t: 3, ic: '📝', n: '供應合約', g: 'biz', c: () => BZ().rep >= 35, txt: '聲望 35' },
  { k: 'branch', t: 4, ic: '🏬', n: '連鎖分店', g: 'biz', c: () => BZ().rep >= 80 && GR().staff.length > 0, txt: '聲望 80、有員工' }
);
Object.assign(GR_INTRO, {
  homelv: ['家具升級、房間、裝潢、田地、果樹……全部加總成家園分數。', '每升一級家園外觀變好，房間裡多一個擺設。'],
  milestone: ['累積收成、營收、極品、煮菜次數到一定數量就達成里程碑。', '每個里程碑都會在家裡留下一個紀念擺設。'],
  irrig: ['提水桶 → 滴灌（每天早上自動用水澆）→ 自動噴灑（完全不用澆）。'],
  animals: ['雞、兔子會自己生小寶寶，5 天後長大。', '動物有心情：打掃、給點心會變好；心情好產量高，心情差產量低。'],
  orchard: ['種一次，8 天後開始每 3 天結果，越老結越多。', '當季的果樹結得特別多。樹苗在小店市集買。'],
  soilup: ['普通土 → 培養土 → 黑金土。', '收成更多，作物也更容易優良。'],
  sauce: ['醬油、醋、辣椒醬、蔥油、花生醬、米酒放在家裡會慢慢熟成。', '放滿 7 天的老醬拿來做菜，品質更好。'],
  feast: ['湊齊 6 道不同料理辦一桌，請整棟鄰居吃飯。', '心態 +30、聲望大漲、還有紅包。每 7 天可以辦一次，料理品質越好收得越多。'],
  market: ['每天每種東西的價格都在變，搶手的可以賣到 1.8 倍。', '早報會告訴你今天什麼最搶手，便宜時囤、貴時賣。'],
  barn: ['牛棚：乳牛每天產牛奶，可以做奶油。', '豬圈：小豬吃廚餘和菜葉，15 天長大可以出欄。'],
  contract: ['跟避難所簽長期合約，每天自動送貨、固定收入。', '斷貨會扣聲望，連續 3 天斷貨合約就沒了。'],
  branch: ['派一位員工去其他據點開分店，每天自動回傳營收。', '最多 3 間，每間 500 瓶蓋。']
});
const _grBodyG4 = grBody;
grBody = function (k) {
  const K = ['homelv', 'milestone', 'irrig', 'animals', 'orchard', 'soilup', 'sauce', 'feast', 'market', 'barn', 'contract', 'branch'];
  let h = _grBodyG4(k); if (k === 'deliv') h += '<div class="cat">🍱 招牌套餐名稱（價格 +10%）</div><div class="pl-form"><input id="set-name" maxlength="12" placeholder="例如：末日豪華便當" value="' + esc(G4().setName || '') + '"></div>' + bt('setNameSet', null, '掛上招牌', true);
  if (!K.includes(k)) return h;
  const g = G4(), sv = S.sv, bz = BZ(); h = '';
  if (k === 'homelv') { const s = homeScore(), l = homeLv(); h += row('🏠 Lv.' + l + '「' + HOME_N[l] + '」', '家園分數 ' + s + (HOME_T[l + 1] ? ' · 下一級 ' + HOME_T[l + 1] : ' · 已滿級')) + '<div class="cat">已解鎖的擺設</div><p>' + (HOME_DECO.slice(2, l + 1).join('、') || '還沒有') + '</p><p class="meta">加分：家具升級、裝潢、店面、廚具、房間、菜圃、田地、灌溉、果樹、牛棚豬圈、產線、魚池、第二塊地。</p>'; }
  if (k === 'milestone') h += MILES.map(m => row((g.mile[m[0]] ? '✅ ' + m[3] + ' ' : '⬜ ') + m[4], Math.min(GR().stats[m[1]] || 0, m[2]) + '/' + m[2])).join('');
  if (k === 'irrig') { const N = ['', '🪣 提水桶', '💧 滴灌', '🚿 自動噴灑']; h += [1, 2, 3].map(i => row(N[i] + (g.irr === i ? '（現在）' : g.irr > i ? ' ✅' : ''), ['', '每天自己澆', '每天早上自動用水澆', '完全不用澆水'][i] + (g.irr === i - 1 ? ' · ' + needTxt([null, null, { plastic: 6, barrel: 1 }, { plastic: 4, metal: 4, cell: 1 }][i]) + '、🪙 ' + [0, 0, 40, 100][i] : ''), g.irr === i - 1 ? bt('irUp', null, '升級', true) : '')).join(''); }
  if (k === 'animals') h += row('心情 ' + Math.round(g.mood) + '/100', g.mood >= 75 ? '💕 很開心：產量 +' + Math.round((g.mood / 200 - 0.2) * 100) + '%' : g.mood < 35 ? '😿 不開心：產量變少' : '普通') + row('🧹 打掃', '1 小時 · 心情 +20', bt('anClean', null, '打掃', canAct(1, 6))) + row('🍎 給點心', '水果或玉米 1 個 · 心情 +12', bt('anTreat', null, '給', true)) + (g.young.length ? '<div class="cat">小寶寶</div>' + g.young.map(y => row((y.sp === 'hen' ? '🐥 小雞' : '🐰 小兔'), '第 ' + y.age + '/5 天')).join('') : '<p class="meta">雞兩隻以上、兔子兩隻以上，偶爾會生寶寶。</p>');
  if (k === 'orchard') { const cap = 6 + (G3().farm2 ? 4 : 0); h += '<p class="meta">果樹 ' + g.trees.length + '/' + cap + '</p>' + g.trees.map(t => row('🌳 ' + ITEMS[t.k].n.replace('樹苗', '樹'), '樹齡 ' + t.age + ' 天 · ' + (t.age < 8 ? '還要 ' + (8 - t.age) + ' 天開始結果' : '每 3 天結 ' + (1 + Math.floor(t.age / 10)) + ' 個') + (TREES[t.k].se === season() ? ' · 🌸當季加倍' : ''))).join('') + Object.keys(TREES).map(s => row(itemIc(TREES[s].out) + ITEMS[s].n + ' · 有 ' + sv_has(s), SEASON_IC[TREES[s].se] + SEASON_N[TREES[s].se] + '季盛產 · 市集 🪙' + MARKET[s][0], bt('trPlant', s, '種', sv_has(s) > 0 && g.trees.length < cap))).join(''); }
  if (k === 'soilup') { const N = ['', '普通土', '培養土', '黑金土']; h += [1, 2, 3].map(i => row(N[i] + (g.soilT === i ? '（現在）' : g.soilT > i ? ' ✅' : ''), ['', '基本', '收成 +10%、優良 +5%', '收成 +25%、優良 +10%'][i] + (g.soilT === i - 1 ? ' · ' + needTxt([null, null, { fert: 4, board: 4 }, { fert: 8, clay: 6, honey: 1 }][i]) + '、🪙 ' + [0, 0, 60, 150][i] : ''), g.soilT === i - 1 ? bt('soUp', null, '升級', true) : '')).join(''); }
  if (k === 'sauce') h += SAUCE_K.filter(s => ITEMS[s]).map(s => row(itemIc(s) + ITEMS[s].n + ' · 有 ' + sv_has(s), sv_has(s) ? '熟成 ' + (g.sauce[s] || 0) + '/7 天' + ((g.sauce[s] || 0) >= 7 ? ' ✨ 老醬：用它做菜品質更好' : '') : '家裡沒有')).join('');
  if (k === 'feast') { const ds = Object.keys(FOOD).filter(x => FOOD[x].dish && sv_has(x) > 0), wait = 7 - (sv.day - g.feastDay); h += '<p>有 ' + ds.length + '/6 種料理：' + ds.slice(0, 6).map(x => ITEMS[x].n).join('、') + '</p>' + (wait > 0 ? '<p class="meta">還要 ' + wait + ' 天才能再辦。</p>' : '') + bt('feast', null, '🎉 辦一桌（3 小時）', ds.length >= 6 && wait <= 0); }
  if (k === 'market') { mktRoll(); const L = Object.entries(g.mkt).filter(([x]) => ITEMS[x] && sv_has(x) > 0).sort((a, b) => b[1] - a[1]); h += '<p class="meta">你有的東西今天的行情（1.0 是正常價）：</p>' + (L.length ? L.slice(0, 12).map(([x, p]) => row(itemIc(x) + ITEMS[x].n + ' · 有 ' + sv_has(x), '<span style="color:' + (p >= 1.2 ? '#6ac04a' : p <= 0.85 ? '#e06a5a' : 'inherit') + '">×' + p.toFixed(2) + (p >= 1.4 ? ' 🔥 搶手' : p <= 0.8 ? ' 便宜，先別賣' : '') + '</span> · 一個 🪙' + valOf(x))).join('') : '<p class="meta">沒有可以看行情的東西。</p>'); }
  if (k === 'barn') { h += g.barn ? row('🐄 乳牛 ' + g.cows + '/3', '每頭每天 2 瓶牛奶（心情影響）· 牛奶 3 → 奶油（醃漬罐）', bt('baAdd', 'cow', '放乳牛（' + sv_has('cow') + '）', sv_has('cow') > 0 && g.cows < 3, true)) : row('蓋牛棚', needTxt({ board: 12, metal: 6 }), bt('baBuild', 'barn', '蓋', true));
    h += g.sty ? row('🐖 豬 ' + g.pigs.length + '/4', g.pigs.map(p => p.age + '/15 天').join('、') + ' · 吃廚餘、菜葉、黑暗料理', bt('baAdd', 'piglet', '放小豬（' + sv_has('piglet') + '）', sv_has('piglet') > 0 && g.pigs.length < 4, true)) + row('出欄', '長大的豬每頭 6 份豬肉（可做滷肉飯）', bt('baSell', null, '出欄', g.pigs.some(p => p.age >= 15))) : row('蓋豬圈', needTxt({ board: 8, clay: 4 }), bt('baBuild', 'sty', '蓋', true)); h += '<p class="meta">乳牛、小豬在小店市集買。</p>'; }
  if (k === 'contract') h += g.con ? row('📝 ' + CONTRACTS[g.con.i].n, CONTRACTS[g.con.i].d + ' · 每天 🪙' + CONTRACTS[g.con.i].pay + ' · 已送 ' + g.con.days + ' 天 · 斷貨 ' + g.con.strikes + '/3', bt('coEnd', null, '解約', true, true)) : CONTRACTS.map((O, i) => row(O.n, O.d + ' · 每天 🪙' + O.pay + ' · 斷貨 3 次就解約', bt('coSign', i, '簽約', true))).join('');
  if (k === 'branch') h += g.branches.map(b => row('🏬 ' + b.loc, b.who + '顧店 · 第 ' + b.day + ' 天開幕')).join('') + (g.branches.length < 3 ? row('開新分店', '🪙 500 · 派一位員工去顧', bt('brOpen', null, '開店', bz.coin >= 500)) : '');
  return h;
};
const _grSceneG4 = grScene;
grScene = function (k, now) {
  const t = now / 1000; if (!hasG3()) return _grSceneG4(k, now); const g = G4();
  if (k === 'homelv') { const l = homeLv(), fl = Math.min(4, 1 + Math.floor(l / 3)); let s = '<rect width="330" height="96" fill="#bfe0f0"/><rect y="84" width="330" height="12" fill="#7ab86a"/>'; for (let i = 0; i < fl; i++) s += '<rect x="120" y="' + (70 - i * 18) + '" width="90" height="18" fill="' + ['#d8c4a8', '#e8d4b8', '#c9b896', '#f0e0c0'][i] + '" stroke="#7a6a5a"/>' + [0, 1, 2].map(j => '<rect x="' + (130 + j * 26) + '" y="' + (74 - i * 18) + '" width="12" height="9" fill="' + (l >= 4 ? '#ffe08a' : '#8ab') + '"/>').join(''); s += '<polygon points="112,' + (70 - fl * 18 + 18) + ' 165,' + (52 - fl * 18 + 18) + ' 218,' + (70 - fl * 18 + 18) + '" fill="#a0522d"/>'; if (l >= 5) s += '<text x="60" y="84" font-size="22">🌳</text><text x="240" y="84" font-size="20">🌻</text>'; if (l >= 7) s += '<text x="270" y="84" font-size="18">🐄</text>'; s += '<text x="10" y="18" font-size="12" font-weight="800" fill="#1d2733">Lv.' + l + ' ' + HOME_N[l] + '</text>'; return grSVG(s, 96, '#bfe0f0'); }
  if (k === 'orchard') { let s = '<rect width="330" height="96" fill="' + GR_SCENE_BG[season()] + '"/><rect y="80" width="330" height="16" fill="#7ab86a"/>'; g.trees.forEach((tr, i) => { const x = 30 + i * 30, sz = 14 + Math.min(16, tr.age); s += '<rect x="' + (x - 2) + '" y="' + (80 - sz) + '" width="4" height="' + sz + '" fill="#6a4a2a"/><circle cx="' + x + '" cy="' + (80 - sz) + '" r="' + (sz * 0.6) + '" fill="#3a9a3a"/>' + (tr.age >= 8 ? [0, 1, 2].map(j => '<text x="' + (x - 8 + j * 6) + '" y="' + (84 - sz + j * 3) + '" font-size="7">' + ITEM_EMO[TREES[tr.k].out] + '</text>').join('') : ''); }); if (!g.trees.length) s += '<text x="165" y="50" text-anchor="middle" font-size="11">還沒種果樹</text>'; return grSVG(s, 96, GR_SCENE_BG[season()]); }
  if (k === 'animals') { let s = '<rect width="330" height="96" fill="#cfe3b5"/>'; const hens = (W().roof && W().roof.hens) || 0, rb = F().rabbits || 0; for (let i = 0; i < hens; i++) s += '<text x="' + (30 + i * 28 + Math.sin(t * 2 + i) * 6).toFixed(0) + '" y="70" font-size="20">🐔</text>'; for (let i = 0; i < Math.min(5, rb); i++) s += '<text x="' + (180 + i * 26) + '" y="' + (72 - Math.abs(Math.sin(t * 3 + i)) * 8).toFixed(0) + '" font-size="18">🐇</text>'; g.young.forEach((y, i) => { s += '<text x="' + (40 + i * 30) + '" y="90" font-size="' + (10 + y.age) + '">' + (y.sp === 'hen' ? '🐥' : '🐰') + '</text>'; }); if (g.mood >= 70) for (let i = 0; i < 4; i++) { const p = (t * 0.4 + i / 4) % 1; s += '<text x="' + (40 + i * 70) + '" y="' + (50 - p * 30) + '" font-size="10" opacity="' + (1 - p).toFixed(2) + '">💕</text>'; } s += '<rect x="10" y="8" width="100" height="10" rx="5" fill="#0002"/><rect x="10" y="8" width="' + g.mood + '" height="10" rx="5" fill="' + (g.mood >= 70 ? '#e07ab0' : g.mood < 35 ? '#999' : '#e0a020') + '"/>'; return grSVG(s, 96, '#cfe3b5'); }
  if (k === 'barn') { let s = '<rect width="330" height="96" fill="#d8e8b8"/><rect x="20" y="30" width="130" height="56" fill="' + (g.barn ? '#b0503a' : '#bbb') + '"/><polygon points="12,30 85,8 158,30" fill="#7a3a2a"/>' + '<text x="40" y="76" font-size="22">' + '🐄'.repeat(g.cows) + '</text><rect x="190" y="50" width="120" height="36" fill="' + (g.sty ? '#c9a274' : '#bbb') + '"/>'; g.pigs.forEach((p, i) => { s += '<text x="' + (196 + i * 28) + '" y="80" font-size="' + (12 + p.age / 2) + '">🐖</text>'; }); return grSVG(s, 96, '#d8e8b8'); }
  if (k === 'feast') { const hot = UI.feFx && now - UI.feFx < 6000; let s = '<rect width="330" height="96" fill="#8a2a2a"/><ellipse cx="165" cy="60" rx="130" ry="26" fill="#d6322a"/><ellipse cx="165" cy="56" rx="122" ry="22" fill="#e8c8a0"/>'; const ds = Object.keys(FOOD).filter(x => FOOD[x].dish && sv_has(x) > 0).slice(0, 6); ds.forEach((d, i) => { s += ic(d, 70 + i * 38, 54, 22); }); if (hot) for (let i = 0; i < 10; i++) { const p = ((now - UI.feFx) / 3000 + i / 10) % 1; s += '<text x="' + (20 + i * 32) + '" y="' + (p * 96) + '" font-size="12">🎊</text>'; } s += '<text x="10" y="18" font-size="12" fill="#ffe08a">🏮 辦桌</text>'; return grSVG(s, 96, '#8a2a2a'); }
  if (k === 'market') { let s = '<rect width="330" height="96" fill="#1e2a36"/>'; const L = Object.entries(g.mkt).filter(([x]) => ITEMS[x]).sort((a, b) => b[1] - a[1]).slice(0, 8); L.forEach(([x, p], i) => { const hh = (p - 0.5) * 50; s += '<rect x="' + (20 + i * 38) + '" y="' + (80 - hh) + '" width="24" height="' + hh + '" rx="3" fill="' + (p >= 1.2 ? '#6ac04a' : p <= 0.85 ? '#e06a5a' : '#8ab') + '"/>' + ic(x, 32 + i * 38, 90, 12); }); return grSVG(s); }
  if (k === 'branch') { let s = '<rect width="330" height="96" fill="#9ab8c8"/>'; [0, 1, 2].forEach(i => { const b = g.branches[i]; s += '<rect x="' + (20 + i * 105) + '" y="30" width="80" height="50" fill="' + (b ? '#c9a274' : '#ddd') + '" stroke="#7a6a5a"/><text x="' + (60 + i * 105) + '" y="62" text-anchor="middle" font-size="20">' + (b ? '🏬' : '➕') + '</text>' + (b ? '<text x="' + (60 + i * 105) + '" y="24" text-anchor="middle" font-size="9" fill="#1d2733">' + b.loc + '</text>' : ''); }); return grSVG(s, 96, '#9ab8c8'); }
  if (['milestone', 'irrig', 'soilup', 'sauce', 'contract'].includes(k)) return '';
  return _grSceneG4(k, now);
};
// 永久模式（沒選挑戰）不會有颱風
const _disG4 = disasterDays;
disasterDays = function () { const d = _disG4(); if (S && S.mods && S.mods.forever && !S.mods.fHard) return Object.assign({}, d, { ty: [] }); return d; };
// 通知：動物心情差、豬可以出欄、合約快斷
const _ntListG4 = ntList;
ntList = function () {
  const L = _ntListG4(); if (!hasG3() || !S.sv || S.sv.out) return L; const g = G4(), off = UIS.ntOff || {};
  if (!off.farm && grOn('animals') && g.mood < 35) L.push({ lv: 'y', cat: 'farm', ic: '😿', t: '動物心情不好（' + Math.round(g.mood) + '）', sub: '打掃或給點心，產量才會回來', go: { a: 'grGoX', v: 'animals' }, badge: 'grow' });
  if (!off.farm && g.pigs.some(p => p.age >= 15)) L.push({ lv: 'g', cat: 'farm', ic: '🐖', t: '豬可以出欄了', sub: '', go: { a: 'grGoX', v: 'barn' }, badge: 'grow' });
  if (!off.biz && g.con && g.con.strikes >= 1) L.push({ lv: 'y', cat: 'biz', ic: '📝', t: '合約已斷貨 ' + g.con.strikes + ' 次', sub: '今晚要備好：' + CONTRACTS[g.con.i].d, go: { a: 'grGoX', v: 'contract' }, badge: 'grow' });
  return L.sort((a, b) => NT_LV[a.lv] - NT_LV[b.lv]);
};
