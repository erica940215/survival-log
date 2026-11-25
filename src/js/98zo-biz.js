/* ================= 經營中心＋品質系統 =================
   頂樓／行動頁「🏪 經營」打開，七個分頁都有畫面：
   訂單板、自家小店、釀造坊、烘焙坊、研究桌、圖鑑、育種
   品質：做出來的東西有機會是「優良★」或「極品★★」，吃了更飽、心態更多、賣更貴。 */

/* ===== 新物品 ===== */
const BIZ_ITEMS = {
  wheat: ['小麥種子', 'farm', 0.05], wheat_p: ['小麥', 'mat', 0.3], flour: ['麵粉', 'mat', 0.3],
  bread: ['麵包', 'food', 0.2], mantou: ['饅頭', 'food', 0.2], egg_tart: ['蛋塔', 'food', 0.1], yam_ball: ['地瓜球', 'food', 0.1], pumpkin_pie: ['南瓜派', 'food', 0.4], mooncake: ['月餅', 'food', 0.2], cheese_bread: ['起司麵包', 'food', 0.2],
  rice_wine: ['米酒', 'mat', 0.5], straw_wine: ['草莓酒', 'food', 0.5], soy: ['醬油', 'mat', 0.4], vinegar: ['醋', 'mat', 0.4], cane_juice: ['甘蔗汁', 'food', 0.4], kombucha: ['紅茶菌', 'food', 0.4],
  duck: ['鴨子', 'farm', 2], goat: ['山羊', 'farm', 8], duck_egg: ['鴨蛋', 'food', 0.08], goat_milk: ['羊奶', 'food', 0.5], salted_egg: ['鹹蛋', 'food', 0.08], cheese: ['起司', 'food', 0.2]
};
for (const [k, [n, cat, w]] of Object.entries(BIZ_ITEMS)) ITEMS[k] = { n, cat, w, note: '' };
Object.assign(SEED_OUT, { wheat: 'wheat_p' }); Object.assign(CROP_F, { wheat_p: 1 });
Object.assign(FOOD, {
  bread: { sat: 30, mor: 5, dish: true }, mantou: { sat: 28, mor: 3, dish: true }, egg_tart: { sat: 18, mor: 12, dish: true }, yam_ball: { sat: 15, mor: 10, dish: true }, pumpkin_pie: { sat: 45, mor: 14, dish: true }, mooncake: { sat: 30, mor: 16, dish: true }, cheese_bread: { sat: 40, mor: 12, dish: true },
  straw_wine: { sat: 5, mor: 18 }, cane_juice: { sat: 10, mor: 8 }, kombucha: { sat: 5, mor: 12 },
  duck_egg: { sat: 18 }, goat_milk: { sat: 20, mor: 3 }, salted_egg: { sat: 20, mor: 5 }, cheese: { sat: 30, mor: 8 }
});
Object.assign(ITEM_EMO, { wheat: '🌱', wheat_p: '🌾', flour: '🥡', bread: '🍞', mantou: '🥟', egg_tart: '🥧', yam_ball: '🟠', pumpkin_pie: '🥧', mooncake: '🥮', cheese_bread: '🥐', rice_wine: '🍶', straw_wine: '🍷', soy: '🫗', vinegar: '🧂', cane_juice: '🥤', kombucha: '🫖', duck: '🦆', goat: '🐐', duck_egg: '🥚', goat_milk: '🥛', salted_egg: '🥚', cheese: '🧀' });
Object.assign(PROC, { salted_egg: { at: 'jars', need: { duck_egg: 3 }, q: 3, days: 3 }, cheese: { at: 'jars', need: { goat_milk: 3 }, q: 2, days: 3 } });
Object.assign(CROP_COL, { wheat_p: '#e0c060' });
Object.assign(STORES.farm.items, { wheat: [8, 6] });
// 醬油、醋、米酒當調味：煮菜多做一份
SAUCES.push('soy', 'vinegar', 'rice_wine');
Object.assign(LV_T, { brew: [0, 4, 10, 18, 30], bake: [0, 4, 10, 18, 30], shop: [0, 10, 30, 60, 100] });
Object.assign(LV_N, { brew: ['', '學徒', '釀酒人', '老師傅', '釀造大師', '酒仙'], bake: ['', '學徒', '麵包師', '烘焙師', '點心大師', '甜點之神'], shop: ['', '路邊攤', '巷口小店', '人氣老店', '排隊名店', '傳說名店'] });

/* ===== 狀態 ===== */
function BZ() {
  const fm = F(); for (const k of ['brew', 'bake', 'shop']) if (fm.xp[k] == null) fm.xp[k] = 0;
  if (!fm.bz) fm.bz = { coin: 30, rep: 0, orders: [], ordDay: 0, cust: [], custDay: 0, vats: [], kiln: false, mill: false, vatN: 0, res: {}, br: { hen: { s: 1, t: [] }, rabbit: { s: 1, t: [] }, duck: { s: 1, t: [] }, goat: { s: 1, t: [] } }, pond: false, pen: false, ducks: 0, goats: 0, qual: {} };
  return fm.bz;
}
const RES = (k) => !!BZ().res[k];

/* ===== 品質 ===== */
const Q_SKILL = k => DISHES[k] ? 'chef' : BAKES[k] ? 'bake' : BREWS[k] ? 'brew' : PROC[k] ? 'proc' : Object.values(SEED_OUT).includes(k) || Object.values(HERBS).some(h => h.out === k) ? 'farm' : ['egg', 'honey', 'wax', 'rabbit_m', 'duck_egg', 'goat_milk', 'fish'].includes(k) ? 'ranch' : null;
function skillLv(sk) { return sk === 'chef' ? chefLv() : lvOfK(sk); }
function qRoll(k, n) {
  const sk = Q_SKILL(k); if (!sk || n <= 0) return [0, 0];
  const lv = skillLv(sk), bonus = (RES('qlamp') ? 0.08 : 0) + (sk === 'brew' ? 0 : 0);
  const q = BZ().qual[k] || (BZ().qual[k] = [0, 0]); let g = 0, e = 0;
  for (let i = 0; i < n; i++) { const r = rnd(); if (r < 0.04 + 0.03 * lv + bonus / 2) e++; else if (r < 0.2 + 0.06 * lv + bonus) g++; }
  q[0] += g; q[1] += e; return [g, e];
}
function qFix(k) { const q = BZ().qual[k]; if (!q) return; const have = sv_has(k); while (q[0] + q[1] > have) { if (q[0] > 0) q[0]--; else q[1]--; } }
const qOf = k => { const q = (S.sv.w && S.sv.w.fm && S.sv.w.fm.bz && S.sv.w.fm.bz.qual[k]) || [0, 0]; return q; };
function qTag(k) { const q = qOf(k); return (q[0] ? '<span class="et qg">★ ' + q[0] + '</span>' : '') + (q[1] ? '<span class="et qe">★★ ' + q[1] + '</span>' : ''); }
// 追蹤產出：在主要動作前後比對庫存
const TRACK = () => Object.keys(ITEMS).filter(k => Q_SKILL(k));
function snapInv() { const m = {}; for (const k of TRACK()) m[k] = sv_has(k); return m; }
function afterInv(a, why) {
  if (!S.sv) return; const out = [];
  for (const k of TRACK()) { const d = sv_has(k) - (a[k] || 0); if (d > 0) { const [g, e] = qRoll(k, d); if (e) out.push('🌟 ' + ITEMS[k].n + ' 極品×' + e); else if (g) out.push('⭐ ' + ITEMS[k].n + ' 優良×' + g); codexMark(k, e ? 2 : g ? 1 : 0); } else if (d < 0) qFix(k); }
  return out;
}
const _cookxQ = SACT.cookx;
SACT.cookx = function (k) { const a = snapInv(); _cookxQ(k); if (!S.sv) return; const o = afterInv(a); if (o && o.length) slog(o.join('、') + '！'); if (RES('pcooker') && DISHES[k] && S.sv && sv_has(k) > (a[k] || 0)) sv_addFresh(k, 1); };
const _nightQ = night;
night = function (watch) {
  const a = S && S.sv ? snapInv() : null, d0 = S && S.sv && S.sv.day;
  _nightQ(watch);
  if (!a || !S.sv || S.phase !== 'survive' || S.sv.day === d0) return;
  const ex = afterInv(a) || [];
  ex.push(...bizNight());
  if (UI.morning && UI.morning.day === S.sv.day) UI.morning.extra = (UI.morning.extra || []).concat(ex); else ex.forEach(t => slog(t));
};
for (const k of ['pcStart']) { const f = SACT[k]; SACT[k] = function (v) { const a = snapInv(); f(v); afterInv(a); }; }
// 吃：先吃最好的
const _eatQ = SACT.eat;
SACT.eat = function (k) {
  const sv = S.sv, f = FOOD[k], q = qOf(k).slice(), had = sv_has(k);
  _eatQ(k);
  if (!S.sv || sv_has(k) >= had || !f) return;
  const Q = BZ().qual[k];
  if (q[1] > 0) { Q[1]--; sv.sat = clamp(sv.sat + Math.round(f.sat * 0.5)); sv.mor = clamp(sv.mor + 6); slog('極品的' + ITEMS[k].n + '！好吃到說不出話（飽足 +' + Math.round(f.sat * 0.5) + '、心態 +6）。'); }
  else if (q[0] > 0) { Q[0]--; sv.sat = clamp(sv.sat + Math.round(f.sat * 0.25)); sv.mor = clamp(sv.mor + 3); }
  qFix(k);
};
// 吃東西清單加上品質標籤
const _eatHTMLQ = eatHTML;
eatHTML = function () { let h = _eatHTMLQ(); return h.replace(/data-a="eatOne" data-v="([a-z_]+)"([\s\S]*?)<div class="ep-tags">/g, (m, k, mid) => 'data-a="eatOne" data-v="' + k + '"' + mid + '<div class="ep-tags">' + qTag(k)); };

/* ===== 價值、小店 ===== */
function valOf(k) { const f = FOOD[k], I = ITEMS[k]; if (!I) return 0; let v = f ? Math.round(f.sat / 6 + (f.mor || 0) / 2) + (f.dish ? 4 : 0) : I.cat === 'farm' ? 4 : I.cat === 'med' ? 10 : 3; if (BREWS[k] || ['soy', 'vinegar', 'rice_wine', 'sugar', 'chili_sauce', 'scallion_oil', 'peanut_paste'].includes(k)) v += 6; return Math.max(1, v); }
const qMul = [1, 1.5, 2.5];
function takeBest(k) { const Q = BZ().qual[k] || [0, 0]; let t = 0; if (Q[1] > 0) { Q[1]--; t = 2; } else if (Q[0] > 0) { Q[0]--; t = 1; } sv_take(k, 1); qFix(k); return t; }
function shopLv() { return lvOfK('shop'); }
const CUSTOMERS = [['🧑‍🔧', '修車的大叔'], ['👩‍🍳', '餐廳的阿姨'], ['🧒', '放學的小孩'], ['👴', '散步的阿公'], ['👩‍⚕️', '護理師'], ['🧑‍🌾', '隔壁的農夫'], ['👮', '巡邏的警察'], ['🧕', '旅行的姊姊']];
function wantPool() { const seen = Object.keys(J.cdx || {}).filter(k => FOOD[k]); const base = ['can', 'biscuit', 'noodle', 'tomato_p', 'egg', 'veg']; return seen.length >= 3 ? seen : base.concat(seen); }
Object.assign(SACT, {
  bzSell(k) { const sv = S.sv, bz = BZ(); if (sv_has(k) <= 0) return; const t = takeBest(k), c = Math.round(valOf(k) * qMul[t]); bz.coin += c; gainXp('shop', 0.5); slog('賣出' + (t ? ['', '優良', '極品'][t] : '') + ITEMS[k].n + '，+' + c + ' 枚瓶蓋。'); sfx('buy'); render(); },
  bzServe(i) {
    const sv = S.sv, bz = BZ(), c = bz.cust[Number(i)]; if (!c || c.done || sv_has(c.want) <= 0) return;
    const t = takeBest(c.want), coin = Math.round(valOf(c.want) * qMul[t] * 1.6) + (t === 2 ? 10 : t === 1 ? 4 : 0);
    c.done = true; c.t = t; bz.coin += coin; bz.rep += 1 + t; gainXp('shop', 1 + t);
    slog(c.n + '買了' + ITEMS[c.want].n + (t ? '（' + ['', '優良', '極品'][t] + '，多給小費）' : '') + '，+' + coin + ' 瓶蓋、聲望 +' + (1 + t) + '。'); sfx('buy'); render();
  },
  bzBuy(k) { const bz = BZ(), P = MARKET[k]; if (!P || bz.coin < P[0] || shopLv() < (P[1] || 1)) return; bz.coin -= P[0]; S.sv.st[k] = (S.sv.st[k] || 0) + (P[2] || 1); slog('用 ' + P[0] + ' 瓶蓋買了' + ITEMS[k].n + (P[2] > 1 ? ' ×' + P[2] : '') + '。'); render(); }
});
// 市集：[價格, 需要的店等級, 數量]
const MARKET = { board: [6, 1, 3], metal: [8, 1, 2], plastic: [5, 1, 3], glass: [8, 1, 1], diesel: [12, 1, 1], tomato: [8, 1, 2], wheat: [8, 1, 2], rice: [10, 1, 1], hen: [35, 1], rabbit: [35, 2], bees: [50, 2], duck: [45, 2], goat: [120, 3], medkit: [30, 2], cell: [15, 2], alcohol: [15, 2], mint: [10, 2], honeys: [14, 3], tea: [14, 3], sugar: [10, 3] };

/* ===== 訂單板 ===== */
const ORDER_NPC = ['王阿姨', '陳家兄妹', '阿傑', '林老師', '阿明', '超市阿伯', '老船長', 'Zoe'];
function newOrders() {
  const bz = BZ(), sv = S.sv, pool = wantPool().concat(Object.keys(DISHES).filter(k => chefLv() >= DISHES[k].lv && !DISHES[k].fest).slice(0, 8));
  while (bz.orders.filter(o => !o.done && o.until >= sv.day).length < 3) {
    const k = pool[Math.floor(rnd() * pool.length)], hard = bz.rep >= 15 && rnd() < 0.35;
    const qty = 2 + Math.floor(rnd() * (2 + shopLv())), need = hard ? 1 : 0;
    bz.orders.push({ id: sv.day + '-' + Math.floor(rnd() * 1e6), who: ORDER_NPC[Math.floor(rnd() * ORDER_NPC.length)], k, qty, need, until: sv.day + 3, coin: Math.round(valOf(k) * qty * (need ? 3.2 : 2.2)), rep: 3 + need * 3 });
  }
  bz.orders = bz.orders.filter(o => o.until >= sv.day || o.done && o.doneDay >= sv.day - 1).slice(-6);
}
function canFill(o) { if (sv_has(o.k) < o.qty) return false; if (!o.need) return true; const q = qOf(o.k); return q[0] + q[1] >= o.qty; }
Object.assign(SACT, {
  bzOrder(id) {
    const bz = BZ(), o = bz.orders.find(x => x.id === id); if (!o || o.done || !canFill(o)) return;
    for (let i = 0; i < o.qty; i++) { const Q = BZ().qual[o.k] || [0, 0]; if (o.need) { if (Q[0] > 0) Q[0]--; else Q[1]--; } sv_take(o.k, 1); } qFix(o.k);
    o.done = true; o.doneDay = S.sv.day; bz.coin += o.coin; bz.rep += o.rep; gainXp('shop', o.rep);
    const gift = ['fert', 'tomato', 'wheat', 'sugar', 'honey'][Math.floor(rnd() * 5)]; S.sv.st[gift] = (S.sv.st[gift] || 0) + 1;
    slog('📌 完成' + o.who + '的訂單！+' + o.coin + ' 瓶蓋、聲望 +' + o.rep + '，還收到一份' + ITEMS[gift].n + '。', true); sfx('ach'); render();
  }
});

/* ===== 釀造坊 ===== */
const BREWS = {
  cane_juice: { lv: 1, need: { cane_p: 2 }, q: 3, min: 1 },
  rice_wine:  { lv: 1, need: { rice: 1, sugar: 1 }, q: 3, min: 3 },
  kombucha:   { lv: 2, need: { tea_p: 1, sugar: 1 }, q: 3, min: 3 },
  vinegar:    { lv: 2, need: { rice_wine: 1 }, q: 2, min: 4 },
  soy:        { lv: 3, need: { sprout_p: 3, peanut_p: 1 }, q: 3, min: 5 },
  straw_wine: { lv: 3, need: { straw_p: 3, sugar: 1 }, q: 3, min: 5 }
};
const vatMax = () => BZ().vatN + (RES('bigvat') ? 2 : 0);
Object.assign(SACT, {
  bzVat() { const bz = BZ(); if (bz.vatN >= 4) return; if (!payN({ board: 3, metal: 1 })) { slog('做酒桶要木板 3、鐵片 1。'); render(); return; } bz.vatN++; slog('做好一個酒桶。'); sfx('fix'); render(); },
  bzBrew(k) {
    const bz = BZ(), B = BREWS[k], sv = S.sv; if (!B || lvOfK('brew') < B.lv || bz.vats.length >= vatMax()) return;
    if (!Object.entries(B.need).every(([m, n]) => sv_has(m) >= n)) { slog('材料不夠。'); render(); return; }
    for (const [m, n] of Object.entries(B.need)) sv_take(m, n);
    bz.vats.push({ k, start: sv.day }); slog('把材料倒進酒桶，開始釀' + ITEMS[k].n + '（至少 ' + B.min + ' 天，越久越好）。'); sfx('pop'); render();
  },
  bzTap(i) {
    const bz = BZ(), v = bz.vats[Number(i)], sv = S.sv; if (!v) return; const B = BREWS[v.k], age = sv.day - v.start;
    if (age < B.min) return;
    bz.vats.splice(Number(i), 1); sv.st[v.k] = (sv.st[v.k] || 0) + B.q;
    const extra = Math.min(4, age - B.min), lv = lvOfK('brew'), Q = BZ().qual[v.k] || (BZ().qual[v.k] = [0, 0]); let g = 0, e = 0;
    for (let n = 0; n < B.q; n++) { const r = rnd(); if (r < 0.04 + 0.03 * lv + 0.07 * extra) e++; else if (r < 0.2 + 0.06 * lv + 0.1 * extra) g++; }
    Q[0] += g; Q[1] += e; codexMark(v.k, e ? 2 : g ? 1 : 0); gainXp('brew', 1 + extra * 0.5);
    slog('開桶！' + ITEMS[v.k].n + ' ×' + B.q + '（陳放 ' + age + ' 天' + (e ? '，極品 ' + e : '') + (g ? '，優良 ' + g : '') + '）。'); sfx('ach'); render();
  }
});

/* ===== 烘焙坊 ===== */
const BAKES = {
  bread:        { lv: 1, need: { flour: 2 }, q: 4 },
  mantou:       { lv: 1, need: { flour: 2 }, wu: 1, q: 4 },
  yam_ball:     { lv: 2, need: { yam_p: 1, flour: 1, sugar: 1 }, q: 6 },
  egg_tart:     { lv: 2, need: { flour: 1, egg: 2, sugar: 1 }, q: 4 },
  pumpkin_pie:  { lv: 3, need: { pumpkin_p: 1, flour: 2, egg: 1 }, q: 4 },
  cheese_bread: { lv: 3, need: { flour: 2, cheese: 1 }, q: 3 },
  mooncake:     { lv: 4, need: { flour: 2, peanut_p: 2, sugar: 1, salted_egg: 1 }, q: 4 }
};
Object.assign(SACT, {
  bzBuild(k) {
    const bz = BZ(), C = { kiln: { board: 2, metal: 4, glass: 1 }, mill: { metal: 2, board: 3 }, pond: { board: 4, barrel: 1 }, pen: { board: 6, metal: 2 } }[k];
    if (!C || bz[k]) return; if (!payN(C)) { slog('材料不夠：' + needTxt(C).replace(/<[^>]+>/g, '')); render(); return; }
    bz[k] = true; slog('蓋好了' + { kiln: '磚窯', mill: '石磨', pond: '鴨池', pen: '羊圈' }[k] + '。'); sfx('fix'); render();
  },
  bzMill() { const sv = S.sv; if (!BZ().mill || sv_has('wheat_p') < 2) return; if (!canAct(1, 6)) return; sv_take('wheat_p', 2); sv.st.flour = (sv.st.flour || 0) + 2; sv.sta -= 6; slog('推著石磨，把小麥磨成 2 袋麵粉。'); passHours(1); render(); },
  bzBake(k) {
    const sv = S.sv, B = BAKES[k]; if (!B || !BZ().kiln || lvOfK('bake') < B.lv) return;
    if (!canAct(1, 5)) { slog('時間或體力不夠。'); render(); return; }
    if (!Object.entries(B.need).every(([m, n]) => sv_has(m) >= n) || (B.wu && (sv.st.wu || 0) < B.wu) || (sv.st.board || 0) < 1) { slog('材料不夠（還要 1 塊木板當柴）。'); render(); return; }
    const a = snapInv();
    for (const [m, n] of Object.entries(B.need)) sv_take(m, n); if (B.wu) sv.st.wu -= B.wu; sv.st.board--;
    sv.st[k] = (sv.st[k] || 0) + B.q + (lvOfK('bake') >= 4 ? 1 : 0); sv.sta -= 5; gainXp('bake', B.lv);
    const o = afterInv(a); slog('磚窯出爐：' + ITEMS[k].n + ' ×' + (B.q + (lvOfK('bake') >= 4 ? 1 : 0)) + '。' + (o.length ? o.join('、') : '')); sfx('pop');
    BZ().bakeFx = performance.now(); passHours(1); render();
  }
});

/* ===== 研究桌 ===== */
const RESEARCH = [
  { k: 'feeder', n: '自動餵食器', d: '兔子、鴨、羊不用每天餵', cost: { corn_p: 4, metal: 3 }, coin: 20, at: [60, 30] },
  { k: 'qlamp', n: '品質燈', d: '所有東西優良、極品機率 +8%', cost: { glass: 2, cell: 2 }, coin: 40, at: [160, 30], pre: 'feeder' },
  { k: 'dbed', n: '雙層菜圃', d: '頂樓菜圃種植位再 +4', cost: { board: 8, metal: 2 }, coin: 30, at: [60, 90] },
  { k: 'solar', n: '太陽能烘乾機', d: '下雨天曬架照樣會乾', cost: { glass: 2, metal: 2, cell: 1 }, coin: 30, at: [160, 90], pre: 'dbed' },
  { k: 'pcooker', n: '壓力鍋', d: '每道料理多一份', cost: { metal: 4, rice_c: 3 }, coin: 50, at: [260, 60], pre: 'qlamp' },
  { k: 'bigvat', n: '大酒窖', d: '釀造桶位 +2', cost: { board: 6, rice_wine: 2 }, coin: 40, at: [160, 150], pre: 'dbed' },
  { k: 'sign', n: '霓虹招牌', d: '小店每天多 2 位客人', cost: { glass: 2, cell: 2, plastic: 3 }, coin: 60, at: [260, 150], pre: 'bigvat' },
  { k: 'incub', n: '孵化器', d: '育種成功率大幅提升', cost: { egg: 4, metal: 2, cell: 1 }, coin: 50, at: [60, 150] },
  { k: 'golden', n: '黃金廚房', d: '料理有 15% 機率直接變極品', cost: { honey: 3, egg_tart: 2 }, coin: 120, at: [360, 100], pre: 'pcooker' }
];
Object.assign(SACT, {
  bzRes(k) {
    const R = RESEARCH.find(x => x.k === k), bz = BZ(); if (!R || bz.res[k] || (R.pre && !bz.res[R.pre])) return;
    if (bz.coin < R.coin || !Object.entries(R.cost).every(([m, n]) => sv_has(m) >= n)) { slog('研究材料或瓶蓋不夠。'); render(); return; }
    for (const [m, n] of Object.entries(R.cost)) sv_take(m, n); bz.coin -= R.coin; bz.res[k] = true;
    const fm = F(); if (k === 'feeder') fm.feeder = true; if (k === 'solar') fm.solarDry = true;
    slog('🔬 研究完成：' + R.n + '！' + R.d + '。', true); sfx('ach'); render();
  }
});
const _slotsRes = slots;
slots = function () { const s = _slotsRes(); if (S.sv && S.sv.w && S.sv.w.fm && S.sv.w.fm.bz && S.sv.w.fm.bz.res.dbed) s.green += S.sv.w.fm.beds * 4; return s; };
const _qRollG = qRoll;
qRoll = function (k, n) { if (RES('golden') && DISHES[k]) { let e = 0; for (let i = 0; i < n; i++) if (rnd() < 0.15) e++; if (e) { const Q = BZ().qual[k] || (BZ().qual[k] = [0, 0]); Q[1] += e; const r = _qRollG(k, n - e); return [r[0], r[1] + e]; } } return _qRollG(k, n); };

/* ===== 圖鑑 ===== */
const CODEX = () => ({
  '作物': Object.values(SEED_OUT).concat(Object.values(HERBS).map(h => h.out)),
  '料理': Object.keys(DISHES),
  '加工與釀造': Object.keys(PROC).concat(Object.keys(BREWS)),
  '烘焙': Object.keys(BAKES),
  '牧場': ['egg', 'honey', 'wax', 'rabbit_m', 'fish', 'duck_egg', 'goat_milk']
});
function codexMark(k, q) {
  if (!J.cdx) J.cdx = {}; const had = J.cdx[k];
  if (had == null || q > had) { J.cdx[k] = q; saveJournal(); if (had == null && S.sv) { const E = typeof evState === 'function' ? evState() : null; if (E && typeof rtState === 'function') { const rt = rtState(); E.fx = (E.fx || []).concat([{ x: rt.pos.x, y: rt.pos.y - 1.4, txt: '📖 新圖鑑：' + ITEMS[k].n, col: '#ecd27a', t0: performance.now() }]); } } }
  codexReward();
}
function codexReward() {
  if (!J.cdxRew) J.cdxRew = {};
  for (const [pg, ks] of Object.entries(CODEX())) { if (J.cdxRew[pg]) continue; if (ks.every(k => J.cdx && J.cdx[k] != null)) { J.cdxRew[pg] = true; saveJournal(); if (S.sv && S.sv.w) { BZ().coin += 100; slog('📖 圖鑑「' + pg + '」收集完成！獎勵 100 瓶蓋。', true); sfx('ach'); } } }
}

/* ===== 育種 ===== */
const TRAITS = { 多產: '產量 +25%', 溫和: '每天心態 +1', 巨大: '處理時多 1 份肉', 長壽: '不會生病老死（之後好用）', 金色: '產物更容易是極品' };
const SPECIES = { hen: '雞', rabbit: '兔子', duck: '鴨子', goat: '山羊' };
const countOf = sp => sp === 'hen' ? W().roof.hens || 0 : sp === 'rabbit' ? F().rabbits : sp === 'duck' ? BZ().ducks : BZ().goats;
Object.assign(SACT, {
  bzBreed(sp) {
    const bz = BZ(), b = bz.br[sp], sv = S.sv; if (countOf(sp) < 2 || b.day === sv.day) return;
    if (!canAct(1, 4)) return;
    b.day = sv.day; const ok = RES('incub') ? 0.75 : 0.45; let msg = '';
    if (rnd() < ok && b.s < 5) { b.s++; msg += SPECIES[sp] + '的血統升到 ' + '★'.repeat(b.s) + '。'; }
    if (rnd() < (RES('incub') ? 0.4 : 0.22)) { const left = Object.keys(TRAITS).filter(t => !b.t.includes(t)); if (left.length) { const t = left[Math.floor(rnd() * left.length)]; b.t.push(t); msg += '出現新特性「' + t + '」（' + TRAITS[t] + '）！'; } }
    if (!msg) msg = '這次配種沒有什麼特別的變化。';
    gainXp('ranch', 1); slog('🐣 ' + msg, !!msg); sv.sta -= 4; passHours(1); render();
  },
  bzAddAnimal(sp) { const sv = S.sv, bz = BZ(); if (sp === 'duck' && bz.pond && sv.st.duck > 0 && bz.ducks < 6) { sv.st.duck--; if (!sv.st.duck) delete sv.st.duck; bz.ducks++; slog('放一隻鴨子進鴨池，呱呱。'); } if (sp === 'goat' && bz.pen && sv.st.goat > 0 && bz.goats < 3) { sv.st.goat--; if (!sv.st.goat) delete sv.st.goat; bz.goats++; slog('山羊住進羊圈了，咩～'); } render(); }
});
function brMul(sp) { const b = BZ().br[sp]; return 1 + 0.1 * (b.s - 1) + (b.t.includes('多產') ? 0.25 : 0); }

/* ===== 每天早上 ===== */
function bizNight() {
  const sv = S.sv, bz = BZ(), ex = [];
  // 鴨、羊
  const greens = ['veg', 'cabbage_p', 'veg_dry', 'yam_p', 'sprout_p', 'peanut_p', 'wheat_p', 'corn_p'];
  const feed = n => { if (RES('feeder')) return true; let f = 0; for (const g of greens) while (f < n && sv_has(g) > 0) { sv_take(g, 1); f++; } return f >= n; };
  if (bz.ducks) { if (feed(Math.ceil(bz.ducks / 2))) { const n = Math.round(bz.ducks * 0.7 * brMul('duck')); if (n > 0) { sv.st.duck_egg = (sv.st.duck_egg || 0) + n; ex.push('🦆 鴨池撿到 ' + n + ' 顆鴨蛋。'); } } else ex.push('鴨子沒吃飽，今天沒下蛋。'); }
  if (bz.goats) { if (feed(bz.goats)) { const n = Math.round(bz.goats * brMul('goat')); sv.st.goat_milk = (sv.st.goat_milk || 0) + n; ex.push('🐐 擠了 ' + n + ' 瓶羊奶。'); } else ex.push('山羊沒吃飽，今天沒有奶。'); }
  // 雞的血統加成：多下蛋
  const R = W().roof; if (R.coop && R.hens && brMul('hen') > 1 && rnd() < brMul('hen') - 1) { sv_addFresh('egg', 1); ex.push('優良血統的母雞多下了一顆蛋。'); }
  for (const sp of Object.keys(SPECIES)) if (bz.br[sp].t.includes('溫和') && countOf(sp)) sv.mor = clamp(sv.mor + 1);
  // 新客人與訂單
  newOrders();
  const n = 2 + shopLv() + (RES('sign') ? 2 : 0), pool = wantPool();
  bz.cust = []; for (let i = 0; i < n; i++) { const c = CUSTOMERS[Math.floor(rnd() * CUSTOMERS.length)]; bz.cust.push({ ic: c[0], n: c[1], want: pool[Math.floor(rnd() * pool.length)] }); }
  if (bz.orders.some(o => !o.done && o.until === sv.day)) ex.push('📌 有訂單今天到期！');
  return ex;
}

/* ===== 畫面 ===== */
function stars(t) { return t === 2 ? '<tspan fill="#ecd27a">★★</tspan>' : t === 1 ? '<tspan fill="#ecd27a">★</tspan>' : ''; }
function svgIc(k, x, y, s) { return typeof SPR === 'object' && SPR['item_' + k] ? '<image href="' + SPR['item_' + k] + '" x="' + (x - s / 2) + '" y="' + (y - s / 2) + '" width="' + s + '" height="' + s + '"/>' : '<text x="' + x + '" y="' + (y + s * 0.3) + '" text-anchor="middle" font-size="' + s * 0.8 + '">' + (ITEM_EMO[k] || '📦') + '</text>'; }
function bizScene(tab, now) {
  const bz = BZ(), sv = S.sv;
  let s = '<svg viewBox="0 0 330 140" class="fm-svg">';
  if (tab === 'order') {
    s += '<rect width="330" height="140" fill="#b88a5a"/><rect x="10" y="10" width="310" height="120" rx="6" fill="#c9a274" stroke="#7a5a3a" stroke-width="4"/>';
    for (let i = 0; i < 60; i++) s += '<circle cx="' + (20 + (i * 53) % 300) + '" cy="' + (18 + (i * 37) % 108) + '" r="1.2" fill="#a07a50"/>';
    bz.orders.slice(-3).forEach((o, i) => { const x = 22 + i * 102, rot = [-3, 2, -1][i]; s += '<g transform="rotate(' + rot + ' ' + (x + 45) + ' 70)"><rect x="' + x + '" y="22" width="90" height="98" fill="#fdf8ec" stroke="#cbbf9f"/><circle cx="' + (x + 45) + '" cy="26" r="4" fill="#d6322a"/>' + svgIc(o.k, x + 45, 58, 34) + '<text x="' + (x + 45) + '" y="90" text-anchor="middle" font-size="10" fill="#3a2a1a">' + ITEMS[o.k].n.replace(/（.*）/, '').slice(0, 5) + ' ×' + o.qty + '</text><text x="' + (x + 45) + '" y="104" text-anchor="middle" font-size="9" fill="#7a5a3a">' + o.who + (o.need ? ' ★' : '') + '</text>' + (o.done ? '<g transform="rotate(-18 ' + (x + 45) + ' 70)"><circle cx="' + (x + 45) + '" cy="70" r="26" fill="none" stroke="#d6322a" stroke-width="3" opacity="0.85"/><text x="' + (x + 45) + '" y="76" text-anchor="middle" font-size="16" font-weight="900" fill="#d6322a" opacity="0.85">完成</text></g>' : '') + '</g>'; });
  } else if (tab === 'shop') {
    s += '<rect width="330" height="140" fill="#3a4a5a"/><rect x="0" y="0" width="330" height="26" fill="#d6322a"/>';
    for (let i = 0; i < 11; i++) s += '<path d="M' + (i * 30) + ' 26 q15 14 30 0" fill="' + (i % 2 ? '#fff' : '#d6322a') + '"/>';
    s += '<text x="165" y="18" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">' + LV_N.shop[shopLv()] + '</text>';
    if (RES('sign')) s += '<text x="290" y="58" font-size="12" font-weight="900" fill="#ff6ad5" opacity="' + (0.6 + Math.sin(now / 200) * 0.4).toFixed(2) + '">OPEN</text>';
    bz.cust.slice(0, 5).forEach((c, i) => { const x = 36 + i * 58, bob = Math.sin(now / 400 + i) * 2; s += '<g transform="translate(' + x + ' ' + (92 + bob).toFixed(1) + ')" opacity="' + (c.done ? 0.35 : 1) + '"><text y="0" text-anchor="middle" font-size="26">' + c.ic + '</text>' + (c.done ? '<text y="-30" text-anchor="middle" font-size="14">😋</text>' : '<rect x="-17" y="-52" width="34" height="28" rx="8" fill="#fff"/>' + svgIc(c.want, 0, -38, 22)) + '</g>'; });
    s += '<rect x="0" y="104" width="330" height="36" fill="#8a5a3a"/><rect x="0" y="104" width="330" height="5" fill="#b07a4a"/><text x="320" y="130" text-anchor="end" font-size="12" font-weight="800" fill="#ecd27a">🪙 ' + bz.coin + '　⭐ ' + bz.rep + '</text>';
  } else if (tab === 'brew') {
    s += '<rect width="330" height="140" fill="#4a3a2e"/><rect y="110" width="330" height="30" fill="#3a2a1e"/>';
    for (let i = 0; i < Math.max(vatMax(), 1); i++) { const x = 20 + i * 52, v = bz.vats[i];
      s += '<g transform="translate(' + x + ' 40)"><ellipse cx="22" cy="0" rx="22" ry="7" fill="' + (i < vatMax() ? '#8a5a3a' : '#5a4a3e') + '"/><rect x="0" y="0" width="44" height="64" fill="' + (i < vatMax() ? '#a06a3e' : '#5a4a3e') + '"/><rect x="0" y="14" width="44" height="4" fill="#5d5f68"/><rect x="0" y="46" width="44" height="4" fill="#5d5f68"/><ellipse cx="22" cy="64" rx="22" ry="7" fill="#7a4a2e"/>';
      if (v) { const age = sv.day - v.start, B = BREWS[v.k], ready = age >= B.min; s += svgIc(v.k, 22, 30, 22) + '<text x="22" y="-12" text-anchor="middle" font-size="9" fill="#f3f0e6">' + age + '/' + B.min + ' 天</text>' + (ready ? '<text x="22" y="-22" text-anchor="middle" font-size="10" fill="#ecd27a">' + '★'.repeat(Math.min(3, 1 + Math.floor((age - B.min) / 2))) + '</text>' : ''); for (let b = 0; b < 3; b++) { const k = ((now / 1300) + b / 3) % 1; s += '<circle cx="' + (12 + b * 10) + '" cy="' + (-2 - k * 12) + '" r="2" fill="#f3e6c0" opacity="' + (1 - k).toFixed(2) + '"/>'; } }
      s += '</g>'; }
    if (!bz.vatN) s += '<text x="165" y="70" text-anchor="middle" font-size="12" fill="#f3f0e6">先做一個酒桶</text>';
  } else if (tab === 'bake') {
    s += '<rect width="330" height="140" fill="#e8d8c0"/>';
    if (bz.kiln) { const hot = bz.bakeFx && now - bz.bakeFx < 2500; s += '<path d="M90 120 V60 q0 -45 60 -45 q60 0 60 45 V120z" fill="#b5653a" stroke="#6a3a1e" stroke-width="2"/>'; for (let i = 0; i < 8; i++) s += '<line x1="90" y1="' + (66 + i * 7) + '" x2="210" y2="' + (66 + i * 7) + '" stroke="#8a4a2a" stroke-width="0.8"/>'; s += '<path d="M120 120 V88 q0 -18 30 -18 q30 0 30 18 V120z" fill="#2a1a10"/><ellipse cx="150" cy="112" rx="' + (22 + Math.sin(now / 150) * 2).toFixed(1) + '" ry="' + (8 + Math.sin(now / 120) * 2).toFixed(1) + '" fill="#f08a3a" opacity="0.9"/><ellipse cx="150" cy="110" rx="12" ry="5" fill="#ffd36a"/>'; if (hot) for (let i = 0; i < 3; i++) { const k = ((now / 900) + i / 3) % 1; s += '<circle cx="' + (150 + Math.sin(k * 6 + i) * 8) + '" cy="' + (20 - k * 16) + '" r="' + (4 + k * 6) + '" fill="#fff" opacity="' + (0.6 * (1 - k)).toFixed(2) + '"/>'; } }
    else s += '<text x="150" y="70" text-anchor="middle" font-size="12">先蓋磚窯</text>';
    s += '<rect x="230" y="60" width="80" height="60" rx="4" fill="' + (bz.mill ? '#9a9a9a' : '#ccc') + '" opacity="' + (bz.mill ? 1 : 0.4) + '"/>' + (bz.mill ? '<g transform="rotate(' + ((now / 20) % 360).toFixed(0) + ' 270 90)"><circle cx="270" cy="90" r="22" fill="#b0b0b0" stroke="#666"/><line x1="270" y1="68" x2="270" y2="112" stroke="#666"/></g>' : '') + '<text x="270" y="134" text-anchor="middle" font-size="9">石磨' + (bz.mill ? '' : '（未建）') + '</text>';
    const baked = Object.keys(BAKES).filter(k => sv.st[k] > 0).slice(0, 3); baked.forEach((k, i) => { s += svgIc(k, 30 + i * 22, 120, 22); });
  } else if (tab === 'research') {
    s += '<rect width="330" height="140" fill="#1e2a36"/>';
    for (const R of RESEARCH) if (R.pre) { const P = RESEARCH.find(x => x.k === R.pre); s += '<line x1="' + (P.at[0] * 0.75 + 10) + '" y1="' + (P.at[1] * 0.75 + 10) + '" x2="' + (R.at[0] * 0.75 + 10) + '" y2="' + (R.at[1] * 0.75 + 10) + '" stroke="' + (RES(R.k) ? '#ecd27a' : '#3e5060') + '" stroke-width="2"/>'; }
    for (const R of RESEARCH) { const x = R.at[0] * 0.75 + 10, y = R.at[1] * 0.75 + 10, on = RES(R.k), can = !R.pre || RES(R.pre); s += '<circle cx="' + x + '" cy="' + y + '" r="' + (on ? 13 + Math.sin(now / 400) : 12) + '" fill="' + (on ? '#ecd27a' : can ? '#3e5a70' : '#2a3a48') + '" stroke="' + (on ? '#fff3c0' : '#5a7a90') + '" stroke-width="1.5"/><text x="' + x + '" y="' + (y + 24) + '" text-anchor="middle" font-size="8.5" fill="' + (on ? '#ecd27a' : '#9fb4c4') + '">' + R.n + '</text>' + (on ? '<text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-size="11">✓</text>' : ''); }
  } else if (tab === 'breed') {
    s += '<rect width="330" height="140" fill="#a9c98a"/>';
    Object.keys(SPECIES).forEach((sp, i) => { const x = 10 + i * 80, b = bz.br[sp], n = countOf(sp), ic = { hen: SPR && SPR.hen, rabbit: SPR && SPR.rabbit_idle }[sp];
      s += '<rect x="' + x + '" y="10" width="72" height="120" rx="8" fill="#fdf8ec" stroke="#7a5a3a"/>' + (ic ? '<image href="' + ic + '" x="' + (x + 12) + '" y="18" width="48" height="48"/>' : '<text x="' + (x + 36) + '" y="56" text-anchor="middle" font-size="34">' + { hen: '🐔', rabbit: '🐇', duck: '🦆', goat: '🐐' }[sp] + '</text>') + '<text x="' + (x + 36) + '" y="80" text-anchor="middle" font-size="11" font-weight="700">' + SPECIES[sp] + ' ×' + n + '</text><text x="' + (x + 36) + '" y="96" text-anchor="middle" font-size="11" fill="#c9a94a">' + '★'.repeat(b.s) + '</text>' + b.t.slice(0, 2).map((t, j) => '<text x="' + (x + 36) + '" y="' + (110 + j * 11) + '" text-anchor="middle" font-size="9" fill="#5a4a3a">' + t + '</text>').join(''); });
  }
  return s + '</svg>';
}
function bizModal() {
  const bz = BZ(), sv = S.sv, tab = UI.bzTab || 'order', now = performance.now();
  if (!bz.orders.length) newOrders();
  if (!bz.cust.length && bz.custDay !== sv.day) { bz.custDay = sv.day; const pool = wantPool(); for (let i = 0; i < 2 + shopLv(); i++) { const c = CUSTOMERS[Math.floor(rnd() * CUSTOMERS.length)]; bz.cust.push({ ic: c[0], n: c[1], want: pool[Math.floor(rnd() * pool.length)] }); } }
  const tabs = [['order', '📌 訂單'], ['shop', '🏪 小店'], ['brew', '🍶 釀造'], ['bake', '🍞 烘焙'], ['research', '🔬 研究'], ['codex', '📖 圖鑑'], ['breed', '🐣 育種']];
  let h = '<div class="bz-top"><span>🪙 瓶蓋 <b>' + bz.coin + '</b></span><span>⭐ 聲望 <b>' + bz.rep + '</b></span></div><div class="fm-tabs bz-tabs">' + tabs.map(([k, t]) => '<button class="' + (k === tab ? 'on' : '') + '" data-a="bzTab" data-v="' + k + '">' + t + '</button>').join('') + '</div>';
  if (tab !== 'codex') h += '<div id="bz-scene">' + bizScene(tab, now) + '</div>';
  const row = (title, meta, btn) => '<div class="wm-row"><div><b>' + title + '</b><div class="meta">' + meta + '</div></div>' + btn + '</div>';
  if (tab === 'order') {
    h += '<p class="meta">每天補到 3 張訂單，3 天內交。標 ★ 的要優良以上。完成拿瓶蓋、聲望和小禮物。</p>';
    for (const o of bz.orders.filter(x => !x.done && x.until >= sv.day)) { const q = qOf(o.k); h += row(itemIc(o.k) + o.who + '：' + ITEMS[o.k].n + ' ×' + o.qty + (o.need ? ' <span class="et qg">優良以上</span>' : ''), '有 ' + sv_has(o.k) + (o.need ? '（優良以上 ' + (q[0] + q[1]) + '）' : '') + ' · 剩 ' + (o.until - sv.day + 1) + ' 天 · 🪙 ' + o.coin + ' ⭐ ' + o.rep, '<button class="btn" data-a="bzOrder" data-v="' + o.id + '"' + (canFill(o) ? '' : ' disabled') + '>交貨</button>'); }
  } else if (tab === 'shop') {
    h += lvBar('shop') + '<div class="cat">今天的客人</div>';
    bz.cust.forEach((c, i) => { h += row(c.ic + ' ' + c.n + (c.done ? ' ✓' : ''), '想要 ' + itemIc(c.want) + ITEMS[c.want].n + ' · 有 ' + sv_has(c.want) + ' ' + qTag(c.want), c.done ? '' : '<button class="btn" data-a="bzServe" data-v="' + i + '"' + (sv_has(c.want) > 0 ? '' : ' disabled') + '>賣給他</button>'); });
    h += '<details class="guide"><summary>💰 櫃台：直接賣東西</summary>' + Object.keys(ITEMS).filter(k => ITEMS[k].cat !== 'equip' && sv_has(k) > 0 && !['water', 'wu', 'rain'].includes(k)).map(k => row(itemIc(k) + ITEMS[k].n + ' ×' + sv_has(k) + ' ' + qTag(k), '一個 🪙 ' + valOf(k) + '（優良 ×1.5、極品 ×2.5，先賣最好的）', '<button class="btn ghost" data-a="bzSell" data-v="' + k + '">賣 1 個</button>')).join('') + '</details>';
    h += '<details class="guide"><summary>🛒 市集：用瓶蓋買</summary>' + Object.entries(MARKET).map(([k, P]) => row(itemIc(k) + ITEMS[k].n + (P[2] > 1 ? ' ×' + P[2] : ''), '🪙 ' + P[0] + (shopLv() < (P[1] || 1) ? ' · 🔒 小店 Lv.' + P[1] : ''), '<button class="btn ghost" data-a="bzBuy" data-v="' + k + '"' + (bz.coin >= P[0] && shopLv() >= (P[1] || 1) ? '' : ' disabled') + '>買</button>')).join('') + '</details>';
  } else if (tab === 'brew') {
    h += lvBar('brew') + '<p class="meta">放進酒桶等幾天，過了最少天數就能開桶。放越久越容易優良、極品（最多多算 4 天）。米酒、醬油、醋可以當調味，煮菜多做一份。桶位 ' + bz.vats.length + '/' + vatMax() + '</p>';
    bz.vats.forEach((v, i) => { const age = sv.day - v.start, B = BREWS[v.k]; h += row(itemIc(v.k) + ITEMS[v.k].n, '已經 ' + age + ' 天（最少 ' + B.min + ' 天）', '<button class="btn" data-a="bzTap" data-v="' + i + '"' + (age >= B.min ? '' : ' disabled') + '>開桶</button>'); });
    for (const [k, B] of Object.entries(BREWS)) h += row(itemIc(k) + ITEMS[k].n + ' ×' + B.q, lvOfK('brew') < B.lv ? '🔒 釀造 Lv.' + B.lv : needTxt(B.need) + ' · 最少 ' + B.min + ' 天', '<button class="btn" data-a="bzBrew" data-v="' + k + '"' + (lvOfK('brew') >= B.lv && bz.vats.length < vatMax() && Object.entries(B.need).every(([m, n]) => sv_has(m) >= n) ? '' : ' disabled') + '>釀</button>');
    if (bz.vatN < 4) h += row('做一個酒桶（' + bz.vatN + '/4）', needTxt({ board: 3, metal: 1 }), '<button class="btn" data-a="bzVat">做</button>');
  } else if (tab === 'bake') {
    h += lvBar('bake');
    if (!bz.kiln) h += row('蓋磚窯', needTxt({ board: 2, metal: 4, glass: 1 }), '<button class="btn" data-a="bzBuild" data-v="kiln">蓋</button>');
    if (!bz.mill) h += row('蓋石磨', needTxt({ metal: 2, board: 3 }) + ' · 把小麥磨成麵粉', '<button class="btn" data-a="bzBuild" data-v="mill">蓋</button>');
    else h += row('🌾 磨麵粉', '小麥 ×2 → 麵粉 ×2 · 1 小時 · 有小麥 ' + sv_has('wheat_p') + '、麵粉 ' + (sv.st.flour || 0), '<button class="btn" data-a="bzMill"' + (sv_has('wheat_p') >= 2 ? '' : ' disabled') + '>磨</button>');
    h += '<p class="meta">小麥種子在農貿市場、市集買得到，種在田裡。每爐燒 1 塊木板、1 小時。Lv.4 每爐多 1 個。</p>';
    for (const [k, B] of Object.entries(BAKES)) h += row(itemIc(k) + ITEMS[k].n + ' ×' + B.q, lvOfK('bake') < B.lv ? '🔒 烘焙 Lv.' + B.lv : needTxt(B.need) + (B.wu ? ' · 水 ' + B.wu : ''), '<button class="btn" data-a="bzBake" data-v="' + k + '"' + (bz.kiln && lvOfK('bake') >= B.lv && Object.entries(B.need).every(([m, n]) => sv_has(m) >= n) ? '' : ' disabled') + '>烤</button>');
  } else if (tab === 'research') {
    h += '<p class="meta">用收成、料理和瓶蓋研究新設備，一路點亮科技樹。</p>';
    for (const R of RESEARCH) { const on = RES(R.k), lock = R.pre && !RES(R.pre); h += row((on ? '✅ ' : lock ? '🔒 ' : '') + R.n, R.d + (on ? '' : ' · ' + needTxt(R.cost) + ' · 🪙 ' + R.coin + (lock ? ' · 先研究「' + RESEARCH.find(x => x.k === R.pre).n + '」' : '')), on ? '' : '<button class="btn" data-a="bzRes" data-v="' + R.k + '"' + (lock ? ' disabled' : '') + '>研究</button>'); }
  } else if (tab === 'codex') {
    const C = CODEX(), cd = J.cdx || {};
    for (const [pg, ks] of Object.entries(C)) { const got = ks.filter(k => cd[k] != null).length;
      h += '<div class="cat">' + pg + '（' + got + '/' + ks.length + '）' + ((J.cdxRew || {})[pg] ? ' ✨' : ' · 收集完 🪙100') + '</div><div class="cdx-grid">' + ks.map(k => '<div class="cdx' + (cd[k] == null ? ' off' : cd[k] === 2 ? ' gold' : '') + '" title="' + ITEMS[k].n + '">' + itemIc(k, 'cdx-ic') + '<span>' + (cd[k] == null ? '？？？' : ITEMS[k].n.replace(/（.*）/, '')) + '</span>' + (cd[k] ? '<i>' + '★'.repeat(cd[k]) + '</i>' : '') + '</div>').join('') + '</div>'; }
    h += '<p class="meta">做出極品的會變金色。圖鑑跨輪保留。</p>';
  } else if (tab === 'breed') {
    h += '<p class="meta">有兩隻以上就能配種（每天一次、1 小時）：有機會升血統星等（產量 +10%／星），或出現新特性。</p>';
    for (const sp of Object.keys(SPECIES)) { const b = bz.br[sp], n = countOf(sp); h += row(SPECIES[sp] + ' ×' + n + ' <span style="color:#c9a94a">' + '★'.repeat(b.s) + '</span>', (b.t.length ? b.t.map(t => t + '（' + TRAITS[t] + '）').join('、') : '還沒有特性'), '<button class="btn" data-a="bzBreed" data-v="' + sp + '"' + (n >= 2 && b.day !== sv.day ? '' : ' disabled') + '>配種</button>'); }
    if (!bz.pond) h += row('蓋鴨池', needTxt({ board: 4, barrel: 1 }) + ' · 鴨子每天下鴨蛋（可醃鹹蛋）', '<button class="btn" data-a="bzBuild" data-v="pond">蓋</button>');
    else h += row('🦆 鴨子 ' + bz.ducks + '/6', '吃菜葉、小麥、玉米（2 隻 1 份）', '<button class="btn ghost" data-a="bzAddAnimal" data-v="duck"' + (sv.st.duck > 0 ? '' : ' disabled') + '>放鴨子（' + (sv.st.duck || 0) + '）</button>');
    if (!bz.pen) h += row('蓋羊圈', needTxt({ board: 6, metal: 2 }) + ' · 山羊每天一瓶羊奶（可做起司）', '<button class="btn" data-a="bzBuild" data-v="pen">蓋</button>');
    else h += row('🐐 山羊 ' + bz.goats + '/3', '每隻每天吃 1 份菜', '<button class="btn ghost" data-a="bzAddAnimal" data-v="goat"' + (sv.st.goat > 0 ? '' : ' disabled') + '>放山羊（' + (sv.st.goat || 0) + '）</button>');
    h += '<p class="meta">鴨子、山羊在小店的市集用瓶蓋買。</p>';
  }
  return h;
}
Object.assign(SACT, { bzTab(v) { UI.bzTab = v; render(); }, bzOpen() { UI.wm = 'biz'; UI.bzTab = UI.bzTab || 'order'; UI.rtSel = null; render(); } });
function bizTick(now) { requestAnimationFrame(bizTick); if (UI.wm !== 'biz' || !S || !S.sv) return; const el = document.getElementById('bz-scene'); if (el) el.innerHTML = bizScene(UI.bzTab || 'order', now); }
requestAnimationFrame(bizTick);
const _wmHTMLBiz = wmHTML;
wmHTML = function () { if (UI.wm !== 'biz') return _wmHTMLBiz(); return '<div class="rt-modal" data-a="wmClose"><div class="rt-mbox wm-box fm-box" data-a="noop"><div class="rt-mh"><div><b>🏪 經營中心</b></div><button class="btn ghost" data-a="wmClose" style="margin-left:auto">關閉</button></div>' + bizModal() + '</div></div>'; };
const _rtPanelBiz = rtPanel;
rtPanel = function () { return _rtPanelBiz().replace('<div class="wm-chips">', '<div class="wm-chips"><button class="pill" data-a="bzOpen">🏪 經營</button>'); };
VERBS.splice(6, 0, { k: 'biz', ic: '🏪', n: '經營（訂單、小店、釀造、烘焙）' });
const _verbBiz = SACT.verb;
SACT.verb = function (k) { if (k === 'biz') { UI.verbs = false; return SACT.bzOpen(); } return _verbBiz(k); };
// 建議：有訂單能交
const _sugBiz = suggestRaw;
suggestRaw = function () { const L = _sugBiz(); if (S.sv && S.sv.w && S.sv.w.fm && S.sv.w.fm.bz) { const o = BZ().orders.find(x => !x.done && x.until >= S.sv.day && canFill(x)); if (o) L.push({ pri: 62, ic: '📌', label: '交訂單', why: o.who + '要的' + ITEMS[o.k].n.slice(0, 4) + '夠了', bz: true }); } return L.sort((a, b) => b.pri - a.pri).slice(0, 3); };
const _sugDoBiz = SACT.sugDo;
SACT.sugDo = function (i) { const s = suggest()[Number(i)]; if (s && s.bz) { UI.bzTab = 'order'; return SACT.bzOpen(); } return _sugDoBiz(i); };
// 永久模式開局多給一些瓶蓋和小麥
if (typeof FOREVER_KIT === 'object') Object.assign(FOREVER_KIT, { wheat: 3, sugar: 2 });
