/* ================= 🏙️ 城市：公寓接管、街區據點、貨運、工廠、品牌、住戶、能源、水利、重建度、名聲、祭典、排程、報表 ================= */
const CT = () => { const g = G4(); if (!g.city) g.city = { floors: {}, sites: {}, routes: {}, facts: {}, brand: '', fame: 0, res: [], cands: [], candDay: -9, grid: {}, water: 0, gen: [], fest: {}, plan: {}, fin: [], out: {}, merchant: null }; return g.city; };
const cityOpen = () => hasG3() && grOn('city');

/* ===== 新物品 ===== */
Object.assign(ITEMS, { noodle_f: { n: '手工麵', cat: 'food', w: 0.3, note: '' }, pork_noodle: { n: '紅燒豬肉麵', cat: 'food', w: 0.5, note: '' }, can_home: { n: '自家罐頭', cat: 'food', w: 0.4, note: '放很久不會壞' }, cloth_wear: { n: '自家品牌衣服', cat: 'mat', w: 0.3, note: '' }, book: { n: '舊書', cat: 'mat', w: 0.3, note: '' } });
Object.assign(FOOD, { noodle_f: { sat: 25 }, pork_noodle: { sat: 70, mor: 18, dish: true, warm: true }, can_home: { sat: 40, mor: 4 } });
Object.assign(ITEM_EMO, { noodle_f: '🍜', pork_noodle: '🍜', can_home: '🥫', cloth_wear: '👕', book: '📚' });
Object.assign(DISHES, { pork_noodle: { lv: 3, need: { noodle_f: 2, pork: 1, scallion_p: 1 }, q: 3, power: 0.3 } });
const BRANDED = ['can_home', 'cloth_wear', 'noodle_f', 'rice_wine', 'bread'];

/* ===== 1. 公寓接管 ===== */
const APT_FL = ['2F', '3F', '4F', '5F', '6F', '7F'];
const FL_USE = { store: ['🗄️ 倉庫', '多的東西不會壞得那麼快（新鮮食物）'], shop: ['🔨 工坊', '工廠位 +1'], green: ['🌿 溫室', '種植位 +6'], dorm: ['🛏️ 宿舍', '住戶上限 +2'], factory: ['🏭 工廠', '工廠位 +2'] };
const flCost = n => ({ board: 6 + n * 3, metal: 3 + n * 2 });
const flCoin = n => 150 + n * 150;
/* ===== 2. 街區據點 ===== */
const SITES = {
  field: { n: '學校操場', ic: '🏫', d: '每天產小麥 4', give: { wheat_p: 4 }, cost: { board: 10 }, coin: 400 },
  mart: { n: '舊超市', ic: '🏪', d: '每天找到罐頭 2、泡麵 2', give: { can: 2, noodle: 2 }, cost: { metal: 8 }, coin: 600 },
  park: { n: '河濱公園', ic: '🌳', d: '每天產青菜 4、魚 1', give: { veg: 4, fish: 1 }, cost: { board: 8, plastic: 6 }, coin: 500 },
  gas: { n: '加油站', ic: '⛽', d: '每天柴油 1', give: { diesel: 1 }, cost: { metal: 10 }, coin: 800 },
  lib: { n: '圖書館', ic: '📚', d: '每天舊書 1（看書心態 +）、住戶學習變快', give: { book: 1 }, cost: { board: 8 }, coin: 700 }
};
/* ===== 4. 工廠 ===== */
const FACTS = {
  cannery: { n: '罐頭工廠', ic: '🥫', d: '每天把 4 個作物做成 2 罐自家罐頭', cost: { metal: 10, glass: 2 }, coin: 1000 },
  noodle: { n: '製麵廠', ic: '🍜', d: '每天麵粉 2 → 手工麵 3', cost: { metal: 6, board: 6 }, coin: 800 },
  textile: { n: '紡織廠', ic: '👕', d: '每天絲布 1 → 自家品牌衣服 2', cost: { metal: 8, board: 6 }, coin: 1200 },
  brewery: { n: '釀酒廠', ic: '🍶', d: '每天米 1＋糖 1 → 米酒 3', cost: { metal: 8, barrel: 2 }, coin: 1200 }
};
const factCap = () => { const f = CT().floors; return Object.values(f).filter(u => u === 'shop').length + Object.values(f).filter(u => u === 'factory').length * 2; };
/* ===== 7. 住戶 ===== */
const RJOB = { farmer: ['🧑‍🌾', '農夫', '每天多收作物、補肥力'], cook: ['🧑‍🍳', '廚師', '每天煮一道料理'], eng: ['🧑‍🔧', '工程師', '每天發電、修防線'], doc: ['🧑‍⚕️', '醫生', '每天回生命、心態'], craft: ['🧑‍🏭', '工匠', '每天做木板、鐵片'] };
const RNAMES = ['小芳', '阿全', '美玲', '老陳', '志豪', '雅婷', '阿國', '淑芬', '俊傑', '怡君', '阿明', '佩珊'];
const resCap = () => 1 + Object.values(CT().floors).filter(u => u === 'dorm').length * 2;
/* ===== 10. 能源 ===== */
const GENS = { panel: { n: '太陽能板陣列', ic: '🔆', d: '每天 +3 度（雨天 +1）', cost: { glass: 6, metal: 4 }, coin: 600 }, wind: { n: '風力發電機', ic: '🌬️', d: '每天 +2 度（颱風、寒潮加倍）', cost: { metal: 10 }, coin: 700 }, bio: { n: '生質能發電', ic: '♻️', d: '用堆肥發電，每天 +2 度', cost: { metal: 6, barrel: 2 }, coin: 500 }, bank: { n: '大型儲電站', ic: '🔋', d: '電池容量 +20', cost: { metal: 8, cell: 4 }, coin: 900 } };
const WATER_ST = ['沒有', '雨水收集', '過濾系統', '儲水塔', '自來水管線'];
const WATER_C = [null, [{ plastic: 6, barrel: 1 }, 200], [{ plastic: 4, metal: 4 }, 400], [{ metal: 10, board: 6 }, 800], [{ metal: 12, plastic: 10 }, 1500]];
/* ===== 14. 名聲 ===== */
const FAME_N = [[0, '無名倖存者'], [20, '街坊熟面孔'], [50, '社區好鄰居'], [100, '街區老大'], [180, '城市希望'], [300, '末日傳奇']];
const fameName = () => { const r = BZ().rep; let n = FAME_N[0][1]; for (const [t, s] of FAME_N) if (r >= t) n = s; return n; };
/* ===== 13. 重建度 ===== */
function rebuild() {
  const c = CT(), gr = GR();
  const parts = [['公寓', Object.keys(c.floors).length / APT_FL.length, 15], ['街區', Object.keys(c.sites).length / Object.keys(SITES).length, 15], ['貨運', Object.keys(c.routes).length / Object.keys(SITES).length, 10], ['工廠', Object.keys(c.facts).length / Object.keys(FACTS).length, 10], ['住戶', Math.min(1, c.res.length / 8), 15], ['能源', Object.keys(c.grid).length / Object.keys(GENS).length, 10], ['水利', c.water / 4, 10], ['家園', homeLv() / 9, 10], ['名聲', Math.min(1, BZ().rep / 300), 5]];
  return { parts, pct: Math.round(parts.reduce((a, [, v, w]) => a + Math.min(1, v) * w, 0)) };
}

/* ===== 動作 ===== */
Object.assign(SACT, {
  cityOpenHub() { UI.wm = 'city'; UI.ctTab = UI.ctTab || 'apt'; UI.rtSel = null; UI.verbs = false; render(); },
  ctTabSet(v) { UI.ctTab = v; render(); },
  flClear(f) { const c = CT(), n = Object.keys(c.floors).length, bz = BZ(); if (c.floors[f]) return; if (bz.coin < flCoin(n) || !payN(flCost(n))) { slog('材料或瓶蓋不夠。'); render(); return; } bz.coin -= flCoin(n); c.floors[f] = 'store'; slog('🏢 清出了 ' + f + ' 的空房，先當倉庫用，可以改成別的用途。'); sfx('fix'); render(); },
  flUse(v) { const [f, u] = v.split(':'), c = CT(); if (!c.floors[f] || !FL_USE[u]) return; c.floors[f] = u; slog(f + ' 改成' + FL_USE[u][0] + '。'); render(); },
  siClaim(k) { const c = CT(), S0 = SITES[k], bz = BZ(); if (c.sites[k] || !S0) return; if (bz.coin < S0.coin || !payN(S0.cost)) { slog('材料或瓶蓋不夠。'); render(); return; } bz.coin -= S0.coin; c.sites[k] = S.sv.day; slog('🚩 接管了' + S0.n + '！' + S0.d + '（開了貨運路線才能全部運回來）。', true); sfx('ach'); render(); },
  rtBuild(k) { const c = CT(), bz = BZ(); if (!c.sites[k] || c.routes[k]) return; if (bz.coin < 200 || !payN({ metal: 2, diesel: 1 })) { slog('開路線要 200 瓶蓋、鐵片 2、柴油 1。'); render(); return; } bz.coin -= 200; c.routes[k] = true; slog('🚚 ' + SITES[k].n + '的貨運路線通了，物資每天自動送回家。'); render(); },
  faBuild(k) { const c = CT(), F0 = FACTS[k], bz = BZ(); if (c.facts[k] || !F0) return; if (Object.keys(c.facts).length >= factCap()) { slog('沒有工廠位了，先把公寓某層改成工坊或工廠。'); render(); return; } if (bz.coin < F0.coin || !payN(F0.cost)) { slog('材料或瓶蓋不夠。'); render(); return; } bz.coin -= F0.coin; c.facts[k] = true; slog('🏭 ' + F0.n + '開工了！' + F0.d + '。'); sfx('fix'); render(); },
  brandSet() { const el = document.getElementById('brand-name'); const v = el ? el.value.trim().slice(0, 10) : ''; CT().brand = v; slog(v ? '🏷️ 品牌「' + v + '」誕生！工廠產品、麵包、米酒賣出時會累積品牌名氣。' : '拿掉品牌名稱。'); render(); },
  reHire(i) { const c = CT(), r = c.cands[Number(i)]; if (!r || c.res.length >= resCap()) return; c.cands.splice(Number(i), 1); r.happy = 70; r.lv = 1; c.res.push(r); slog('🏠 ' + r.n + '（' + RJOB[r.job][1] + '）搬進公寓了。'); sfx('ach'); render(); },
  reTeach(i) { const c = CT(), r = c.res[Number(i)], sv = S.sv; if (!r || r.lv >= 3) return; if (!canAct(2, 10)) { slog('教學要 2 小時、體力 10。'); render(); return; } r.xp = (r.xp || 0) + (c.sites.lib ? 2 : 1); sv.sta -= 10; if (r.xp >= r.lv * 2) { r.lv++; r.xp = 0; slog('📖 ' + r.n + '學會了！升到 Lv.' + r.lv + '，效率更高。'); } else slog('📖 教' + r.n + '做事（' + r.xp + '/' + r.lv * 2 + '）。'); passHours(2); render(); },
  reKick(i) { const c = CT(), r = c.res[Number(i)]; if (!r) return; c.res.splice(Number(i), 1); slog(r.n + '搬走了。'); render(); },
  enBuild(k) { const c = CT(), G0 = GENS[k], bz = BZ(); if (c.grid[k] || !G0) return; if (bz.coin < G0.coin || !payN(G0.cost)) { slog('材料或瓶蓋不夠。'); render(); return; } bz.coin -= G0.coin; c.grid[k] = true; slog('⚡ 蓋好' + G0.n + '：' + G0.d + '。'); sfx('fix'); render(); },
  waUp() { const c = CT(), W0 = WATER_C[c.water + 1], bz = BZ(); if (!W0) return; if (bz.coin < W0[1] || !payN(W0[0])) { slog('材料或瓶蓋不夠。'); render(); return; } bz.coin -= W0[1]; c.water++; slog('💧 水利升級：' + WATER_ST[c.water] + '。' + (c.water >= 4 ? '從此不用再擔心水了！' : '')); sfx('fix'); render(); },
  feHost() { const c = CT(), sv = S.sv, id = Math.floor((sv.day - 1) / 10); if (!feOpen() || c.fest[id]) return; if (!canAct(4, 15)) { slog('辦祭典要 4 小時、體力 15。'); render(); return; }
    const ds = Object.keys(FOOD).filter(k => FOOD[k].dish && sv_has(k) > 0); let served = 0; ds.forEach(k => { const n = Math.min(sv_has(k), 3); for (let i = 0; i < n; i++) { takeBest(k); served++; } });
    const crowd = 20 + served * 6 + c.res.length * 5 + Math.round(BZ().rep / 5), coin = crowd * 3, rep = Math.round(crowd / 6); BZ().coin += coin; BZ().rep += rep; sv.mor = clamp(sv.mor + 25); c.fest[id] = { crowd, served }; sv.sta -= 15; UI.feFx2 = performance.now();
    slog('🎆 ' + SEASON_N[season()] + '季祭典！端出 ' + served + ' 份料理，來了 ' + crowd + ' 人，收入 ' + coin + ' 瓶蓋、聲望 +' + rep + '！', true); sfx('ach'); passHours(4); render(); },
  plSetDay(v) { const [d, t] = v.split(':'); CT().plan[d] = t; render(); },
  invTidy() { const sv = S.sv, keys = Object.keys(sv.st), cat = k => ITEMS[k] ? ['food', 'farm', 'mat', 'med', 'equip'].indexOf(ITEMS[k].cat) : 9; const st = {}; keys.sort((a, b) => cat(a) - cat(b) || (lifeOf(a) || 99) - (lifeOf(b) || 99) || a.localeCompare(b)).forEach(k => { st[k] = sv.st[k]; }); sv.st = st; sv.fresh.sort((a, b) => a.life - b.life); slog('🧹 倉庫整理好了：食物在前，快壞的排最前面。'); render(); },
  mcBuy(i) { const c = CT(), m = c.merchant, it = m && m.items[Number(i)], bz = BZ(); if (!it || it.sold || bz.coin < it.p) return; bz.coin -= it.p; it.sold = true; addIt(it.k, it.q); slog('🧳 跟旅行商人買了' + ITEMS[it.k].n + ' ×' + it.q + '。'); render(); }
});
const feOpen = () => S.sv.day % 10 === 0;
// 品牌：賣出時累積名氣，價格加成
const _valCity = valOf;
valOf = function (k) { let v = _valCity(k); if (hasG3() && S.sv.w.fm.gr.g3.g4 && S.sv.w.fm.gr.g3.g4.city) { const c = CT(); if (c.brand && BRANDED.includes(k)) v *= 1 + Math.min(1, c.fame / 200); } return Math.round(v); };
// 出貨統計（財務報表）＋品牌名氣
const _takeBestCity = takeBest;
takeBest = function (k) { const t = _takeBestCity(k); if (hasG3() && S.sv.w.fm.gr.g3.g4 && S.sv.w.fm.gr.g3.g4.city) { const c = CT(); c.out[k] = (c.out[k] || 0) + 1; if (c.brand && BRANDED.includes(k)) c.fame += 0.5; } return t; };
const _pcapCity = powerCap;
powerCap = function () { return _pcapCity() + (S.sv && S.sv.w && S.sv.w.fm && S.sv.w.fm.gr && S.sv.w.fm.gr.g3 && S.sv.w.fm.gr.g3.g4 && S.sv.w.fm.gr.g3.g4.city && S.sv.w.fm.gr.g3.g4.city.grid.bank ? 20 : 0); };
const _slotsCity = slots;
slots = function () { const s = _slotsCity(); try { if (S.sv.w.fm.gr.g3.g4.city) s.green += Object.values(S.sv.w.fm.gr.g3.g4.city.floors).filter(u => u === 'green').length * 6; } catch (e) {} return s; };
const PLAN_T = { rest: ['休息', ''], cook: ['🍳 多煮料理', 'cook'], bake: ['🍞 烘焙日', 'bake'], proc: ['🫙 加工日', 'proc'], sell: ['💰 出貨日', 'sell'], plant: ['🌱 種植日', 'plant'] };
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];

/* ===== 每晚 ===== */
const _nightCity = night;
night = function (watch) {
  const ok = S && S.sv && S.phase === 'survive' && cityOpen(), d0 = ok && S.sv.day, c0 = ok ? BZ().coin : 0;
  _nightCity(watch);
  if (!ok || !S.sv || S.phase !== 'survive' || S.sv.day === d0) return;
  const sv = S.sv, c = CT(), bz = BZ(), ex = [];
  // 據點＋貨運
  for (const k of Object.keys(c.sites)) { const S0 = SITES[k], full = !!c.routes[k]; for (const [m, q] of Object.entries(S0.give)) addIt(m, full ? q : Math.floor(q / 2)); }
  if (Object.keys(c.sites).length) ex.push('🚚 據點物資送到：' + Object.keys(c.sites).map(k => SITES[k].ic + SITES[k].n + (c.routes[k] ? '' : '（沒路線，只運回一半）')).join('、'));
  if (sv_has('book') > 0) { sv_take('book', 1); sv.mor = clamp(sv.mor + 6); }
  // 工廠
  const fx = [];
  if (c.facts.cannery) { let n = 0; for (const k of CROPS()) while (n < 4 && sv_has(k) > 6) { sv_take(k, 1); n++; } if (n >= 4) { addIt('can_home', 2); qRoll('can_home', 2); fx.push('罐頭 ×2'); } }
  if (c.facts.noodle && sv_has('flour') >= 2) { sv_take('flour', 2); addIt('noodle_f', 3); qRoll('noodle_f', 3); fx.push('手工麵 ×3'); }
  if (c.facts.textile && sv_has('cloth') >= 1) { sv_take('cloth', 1); addIt('cloth_wear', 2); fx.push('衣服 ×2'); }
  if (c.facts.brewery && sv_has('rice') >= 1 && sv_has('sugar') >= 1) { sv_take('rice', 1); sv_take('sugar', 1); addIt('rice_wine', 3); qRoll('rice_wine', 3); fx.push('米酒 ×3'); }
  if (fx.length) ex.push('🏭 工廠產出：' + fx.join('、') + (c.brand ? '（品牌「' + c.brand + '」名氣 ' + Math.round(c.fame) + '）' : ''));
  // 能源
  const rain = typeof inRain === 'function' && inRain(sv.day); let pw = 0;
  if (c.grid.panel) pw += rain ? 1 : 3; if (c.grid.wind) pw += (inCold(sv.day) ? 4 : 2); if (c.grid.bio && (F().compost || 0) >= 1) { F().compost -= 1; pw += 2; }
  if (pw) { sv.power = Math.min(powerCap(), sv.power + pw); c.lastPw = pw; }
  // 水利
  if (c.water) { const w = [0, 2, 4, 7, 12][c.water]; sv.st.wu = (sv.st.wu || 0) + w; c.lastWa = w; }
  // 住戶
  if (sv.day - c.candDay >= 6) { c.candDay = sv.day; const js = Object.keys(RJOB); c.cands = [0, 1].map(() => ({ n: RNAMES[Math.floor(rnd() * RNAMES.length)], job: js[Math.floor(rnd() * js.length)] })); ex.push('🚪 有 2 位倖存者來敲門，想住進公寓。'); }
  if (c.res.length) {
    const foods = Object.keys(FOOD).filter(k => sv_has(k) > 0 && (FOOD[k].sat || 0) > 0).sort((a, b) => FOOD[a].sat - FOOD[b].sat); let fed = 0;
    for (const r of c.res) { const k = foods.find(f => sv_has(f) > 0); if (k) { takeBest(k); fed++; r.happy = Math.min(100, r.happy + (FOOD[k].dish ? 6 : 1)); } else r.happy -= 15; r.happy = Math.max(0, Math.min(100, r.happy - 3 + (homeLv() >= 5 ? 3 : 0) + (sv_has('book') ? 1 : 0))); }
    const eff = r => (r.happy >= 40 ? 1 : 0.5) * (0.6 + r.lv * 0.4);
    let work = [];
    for (const r of c.res) { const e = eff(r);
      if (r.job === 'farmer') { const k = CROPS().filter(x => sv_has(x) > 0)[0] || 'veg'; addIt(k, Math.round(2 * e)); if (hasGr()) GR().soil = Math.min(100, GR().soil + 3 * e); }
      if (r.job === 'cook') { const d = Object.keys(DISHES).find(x => !DISHES[x].fest && chefLv() >= DISHES[x].lv && Object.entries(DISHES[x].need).every(([m, q]) => m === 'wu' || sv_has(m) >= q)); if (d) { for (const [m, q] of Object.entries(DISHES[d].need)) if (m !== 'wu') sv_take(m, q); addIt(d, Math.max(1, Math.round(DISHES[d].q * e))); qRoll(d, 1); } }
      if (r.job === 'eng') { sv.power = Math.min(powerCap(), sv.power + 1.5 * e); sv.def = Math.min(sv.defMax * 1.5, sv.def + 10 * e); }
      if (r.job === 'doc') { sv.hp = clamp(sv.hp + 8 * e); sv.mor = clamp(sv.mor + 4 * e); }
      if (r.job === 'craft') { addIt('board', Math.round(2 * e)); addIt('metal', Math.round(1 * e)); }
      work.push(RJOB[r.job][0] + r.n + (r.happy < 40 ? '😞' : '')); }
    const left = c.res.filter(r => r.happy <= 0); c.res = c.res.filter(r => r.happy > 0); left.forEach(r => ex.push('😢 ' + r.n + '受不了，搬走了。'));
    ex.push('🏠 住戶上工：' + work.join('、') + (fed < c.res.length ? '（食物不夠，有人沒吃飽）' : ''));
  }
  // 排程
  const plan = c.plan[sv.day % 7]; if (plan && plan !== 'rest') { const a = PLAN_T[plan][1]; AUTO_FORCE = a; let r = []; try { r = runAutos(); } finally { AUTO_FORCE = null; } if (r.length) ex.push('🗓️ 今天是' + PLAN_T[plan][0] + '：' + r.join('；')); }
  // 旅行商人（名聲夠才來）
  if (bz.rep >= 50 && sv.day % 5 === 0) { const pool = [['gtom', 1, 120], ['fineplate', 1, 200], ['cow', 1, 160], ['cell', 3, 90], ['mango_s', 1, 30], ['honeys', 2, 40], ['quilt', 1, 250], ['goat', 1, 90]]; c.merchant = { day: sv.day, items: pool.sort(() => rnd() - 0.5).slice(0, 4).map(([k, q, p]) => ({ k, q, p })) }; ex.push('🧳 旅行商人聽說你的名聲（' + fameName() + '），帶著稀有貨物來了！今天限定。'); }
  if (feOpen()) ex.push('🎆 今天是' + SEASON_N[season()] + '季祭典日，可以在城市 → 祭典主辦！');
  // 財務
  const d = BZ().coin - c0; c.fin.push({ d: sv.day - 1, in: Math.max(0, d), out: Math.max(0, -d) }); c.fin = c.fin.slice(-28);
  // 重建度
  const rb = rebuild(); if (rb.pct >= 100 && !c.revived) { c.revived = sv.day; J.cityRevived = (J.cityRevived || 0) + 1; saveJournal(); ex.unshift('🌆 城市重建度 100%！街上又有人在走動、小孩在玩，城市復興了。這是你一手打造的。'); }
  else if (rb.pct >= (c.lastPct || 0) + 10) { c.lastPct = Math.floor(rb.pct / 10) * 10; ex.push('🏙️ 城市重建度 ' + rb.pct + '%。'); }
  if (UI.morning && UI.morning.day === sv.day) UI.morning.extra = (UI.morning.extra || []).concat(ex); else ex.forEach(t => slog(t));
};

/* ===== 畫面 ===== */
const CT_TABS = [['apt', '🏢 公寓'], ['map', '🗺️ 街區'], ['fact', '🏭 工廠'], ['res', '🧑‍🤝‍🧑 住戶'], ['energy', '⚡ 能源水利'], ['fest', '🎆 祭典'], ['plan', '🗓️ 排程'], ['fin', '📊 報表']];
function citySVG(tab, now) {
  const c = CT(), t = now / 1000;
  if (tab === 'apt') { let s = '<rect width="330" height="150" fill="#bfe0f0"/><rect y="140" width="330" height="10" fill="#7a7a7a"/>'; const fls = ['1F'].concat(APT_FL); fls.forEach((f, i) => { const y = 120 - i * 18, u = f === '1F' ? 'home' : c.floors[f]; s += '<rect x="110" y="' + y + '" width="110" height="18" fill="' + (u === 'home' ? '#e8d4b8' : u ? { store: '#c9b896', shop: '#b0a090', green: '#9ad08a', dorm: '#e0c0d0', factory: '#a0a8b8' }[u] : '#777') + '" stroke="#5a5a5a"/><text x="104" y="' + (y + 13) + '" text-anchor="end" font-size="9" fill="#333">' + f + '</text><text x="165" y="' + (y + 13) + '" text-anchor="middle" font-size="10">' + (u === 'home' ? '🏠 你家' : u ? FL_USE[u][0] : '🕸️ 空房') + '</text>'; }); s += '<polygon points="104,' + (120 - fls.length * 18 + 18) + ' 165,' + (100 - fls.length * 18 + 18) + ' 226,' + (120 - fls.length * 18 + 18) + '" fill="#a0522d"/>'; if (c.grid.panel) s += '<rect x="130" y="' + (112 - fls.length * 18 + 18) + '" width="40" height="6" fill="#2a4a8a"/>'; if (c.grid.wind) s += '<g transform="translate(270 60) rotate(' + (t * 90 % 360).toFixed(0) + ')"><path d="M0 0 L0 -22 M0 0 L19 11 M0 0 L-19 11" stroke="#fff" stroke-width="3"/></g><rect x="268" y="60" width="4" height="80" fill="#ddd"/>'; return '<svg viewBox="0 0 330 150" class="fm-svg gr-svg">' + s + '</svg>'; }
  if (tab === 'map') { const pos = { home: [165, 75], field: [60, 30], mart: [270, 30], park: [50, 120], gas: [280, 120], lib: [165, 135] }; let s = '<rect width="330" height="150" fill="#d8e0c8"/>'; for (const k of Object.keys(SITES)) { const [x, y] = pos[k], on = c.sites[k], r = c.routes[k]; s += '<line x1="165" y1="75" x2="' + x + '" y2="' + y + '" stroke="' + (r ? '#d6322a' : '#999') + '" stroke-width="' + (r ? 3 : 1.5) + '" stroke-dasharray="' + (r ? '' : '5 4') + '"/>'; if (r) { const p = (t * 0.25 + x / 300) % 1; s += '<text x="' + (165 + (x - 165) * p - 7).toFixed(0) + '" y="' + (75 + (y - 75) * p + 5).toFixed(0) + '" font-size="12">🚚</text>'; } } for (const [k, [x, y]] of Object.entries(pos)) { const on = k === 'home' || c.sites[k]; s += '<circle cx="' + x + '" cy="' + y + '" r="16" fill="' + (on ? '#fff' : '#bbb') + '" stroke="' + (on ? '#d6322a' : '#888') + '" stroke-width="2"/><text x="' + x + '" y="' + (y + 6) + '" text-anchor="middle" font-size="16">' + (k === 'home' ? '🏠' : SITES[k].ic) + '</text>'; } return '<svg viewBox="0 0 330 150" class="fm-svg gr-svg">' + s + '</svg>'; }
  if (tab === 'fact') { let s = '<rect width="330" height="96" fill="#3a3f48"/>'; Object.entries(FACTS).forEach(([k, F0], i) => { const on = c.facts[k], x = 15 + i * 80; s += '<rect x="' + x + '" y="30" width="70" height="50" fill="' + (on ? '#6a7a8a' : '#2a2f38') + '"/><rect x="' + (x + 50) + '" y="10" width="10" height="22" fill="' + (on ? '#6a7a8a' : '#2a2f38') + '"/>' + (on ? [0, 1, 2].map(j => { const p = (t * 0.5 + j / 3) % 1; return '<circle cx="' + (x + 55 + p * 8) + '" cy="' + (8 - p * 10) + '" r="' + (3 + p * 5) + '" fill="#ccc" opacity="' + (1 - p).toFixed(2) + '"/>'; }).join('') : '') + '<text x="' + (x + 35) + '" y="62" text-anchor="middle" font-size="18" opacity="' + (on ? 1 : 0.3) + '">' + F0.ic + '</text><text x="' + (x + 35) + '" y="92" text-anchor="middle" font-size="9" fill="' + (on ? '#ecd27a' : '#778') + '">' + F0.n + '</text>'; }); return grSVG(s); }
  if (tab === 'res') { let s = '<rect width="330" height="96" fill="#e8dcc8"/>'; c.res.slice(0, 8).forEach((r, i) => { const x = 25 + i * 40, b = Math.abs(Math.sin(t * 2 + i)) * 4; s += '<text x="' + x + '" y="' + (60 - b).toFixed(0) + '" text-anchor="middle" font-size="24">' + RJOB[r.job][0] + '</text><text x="' + x + '" y="78" text-anchor="middle" font-size="9">' + r.n + '</text><rect x="' + (x - 14) + '" y="84" width="28" height="4" rx="2" fill="#ccc"/><rect x="' + (x - 14) + '" y="84" width="' + (28 * r.happy / 100) + '" height="4" rx="2" fill="' + (r.happy >= 40 ? '#6ac04a' : '#e06a5a') + '"/>'; }); if (!c.res.length) s += '<text x="165" y="50" text-anchor="middle" font-size="11" fill="#7a6a5a">還沒有住戶</text>'; return grSVG(s, 96, '#e8dcc8'); }
  if (tab === 'energy') { const sv = S.sv; let s = '<rect width="330" height="96" fill="#1e2a36"/>'; const bars = [['🔆', c.grid.panel ? 3 : 0], ['🌬️', c.grid.wind ? 2 : 0], ['♻️', c.grid.bio ? 2 : 0], ['👷', c.res.filter(r => r.job === 'eng').length * 1.5], ['💧', [0, 2, 4, 7, 12][c.water] / 2]]; bars.forEach(([ic, v], i) => { s += '<rect x="' + (30 + i * 45) + '" y="' + (80 - v * 10) + '" width="26" height="' + v * 10 + '" rx="3" fill="' + (i === 4 ? '#4a9ae0' : '#ecd27a') + '"/><text x="' + (43 + i * 45) + '" y="92" text-anchor="middle" font-size="11">' + ic + '</text>'; }); s += '<text x="320" y="20" text-anchor="end" font-size="11" fill="#ecd27a">⚡ ' + (Math.round(sv.power * 10) / 10) + '/' + powerCap() + ' 度</text><text x="320" y="36" text-anchor="end" font-size="11" fill="#8ac0f0">💧 ' + (sv.st.wu || 0) + ' 份</text>'; return grSVG(s); }
  if (tab === 'fest') { const hot = UI.feFx2 && now - UI.feFx2 < 6000; let s = '<rect width="330" height="96" fill="#1a1530"/>'; for (let i = 0; i < 9; i++) s += '<ellipse cx="' + (20 + i * 37) + '" cy="14" rx="8" ry="10" fill="#d6322a" opacity="' + (0.7 + Math.sin(t * 2 + i) * 0.3).toFixed(2) + '"/>'; if (hot || feOpen()) for (let i = 0; i < 4; i++) { const p = ((t * 0.5) + i / 4) % 1; s += '<circle cx="' + (60 + i * 70) + '" cy="' + (70 - p * 50) + '" r="' + (p * 18) + '" fill="none" stroke="' + ['#ff6ad5', '#ecd27a', '#6ad0ff', '#9fe08a'][i] + '" stroke-width="2" opacity="' + (1 - p).toFixed(2) + '"/>'; } s += '<text x="165" y="86" text-anchor="middle" font-size="12" fill="#ecd27a">' + (feOpen() ? '🎆 今天是祭典日！' : '下次祭典：第 ' + (Math.floor(S.sv.day / 10) + 1) * 10 + ' 天') + '</text>'; return grSVG(s, 96, '#1a1530'); }
  return '';
}
function cityModal() {
  const c = CT(), sv = S.sv, bz = BZ(), tab = UI.ctTab || 'apt', now = performance.now(), rb = rebuild();
  let h = '<div class="bz-top"><span>🏙️ 重建度 <b>' + rb.pct + '%</b></span><span>⭐ ' + fameName() + '</span><span>🪙 ' + bz.coin + '</span></div><div class="ct-bar"><i style="width:' + rb.pct + '%"></i></div>';
  h += '<div class="fm-tabs bz-tabs">' + CT_TABS.map(([k, t]) => '<button class="' + (k === tab ? 'on' : '') + '" data-a="ctTabSet" data-v="' + k + '">' + t + '</button>').join('') + '</div><div id="ct-scene">' + citySVG(tab, now) + '</div>';
  if (tab === 'apt') { const n = Object.keys(c.floors).length; for (const f of APT_FL) { const u = c.floors[f]; h += u ? row(f + ' · ' + FL_USE[u][0], FL_USE[u][1] + '<div class="gr-chips">' + Object.entries(FL_USE).map(([k, U]) => chip('flUse', f + ':' + k, U[0], u === k)).join('') + '</div>') : row(f + ' · 🕸️ 空房', '清理：' + needTxt(flCost(n)) + '、🪙 ' + flCoin(n), bt('flClear', f, '清出來', bz.coin >= flCoin(n))); if (!u) break; } h += '<p class="meta">一層一層往上清。工廠位：' + Object.keys(c.facts).length + '/' + factCap() + ' · 住戶上限 ' + resCap() + '</p>'; }
  if (tab === 'map') for (const [k, S0] of Object.entries(SITES)) h += c.sites[k] ? row(S0.ic + ' ' + S0.n + ' ✅', S0.d + (c.routes[k] ? ' · 🚚 貨運路線通了' : ' · 沒路線只運回一半'), c.routes[k] ? '' : bt('rtBuild', k, '開路線', bz.coin >= 200)) : row(S0.ic + ' ' + S0.n, S0.d + ' · 接管：' + needTxt(S0.cost) + '、🪙 ' + S0.coin, bt('siClaim', k, '接管', bz.coin >= S0.coin));
  if (tab === 'fact') { h += '<p class="meta">工廠位 ' + Object.keys(c.facts).length + '/' + factCap() + '（在公寓把某層改成工坊 +1、工廠 +2）</p>'; for (const [k, F0] of Object.entries(FACTS)) h += row(F0.ic + ' ' + F0.n + (c.facts[k] ? ' ✅' : ''), F0.d + (c.facts[k] ? '' : ' · ' + needTxt(F0.cost) + '、🪙 ' + F0.coin), c.facts[k] ? '' : bt('faBuild', k, '蓋', bz.coin >= F0.coin && Object.keys(c.facts).length < factCap())); h += '<div class="cat">🏷️ 自家品牌</div><p class="meta">罐頭、衣服、手工麵、米酒、麵包賣得越多，品牌名氣越高，最高賣 2 倍價。名氣：' + Math.round(c.fame) + '</p><div class="pl-form"><input id="brand-name" maxlength="10" placeholder="例如：黑家好物" value="' + esc(c.brand || '') + '"></div>' + bt('brandSet', null, '登記品牌', true) + '<div class="cat">🔗 連鎖配方</div><p class="meta">小麥 → 石磨 → 麵粉 → 製麵廠 → 手工麵 → 紅燒豬肉麵（＋豬肉、蔥）。每一步都能交給自動化和工廠。</p>'; }
  if (tab === 'res') { h += '<p class="meta">住戶 ' + c.res.length + '/' + resCap() + '（在公寓蓋宿舍增加上限）。每人每天吃 1 份食物，吃料理更開心；心情低於 40 效率減半，掉到 0 會搬走。</p>'; h += c.res.map((r, i) => row(RJOB[r.job][0] + ' ' + r.n + ' · ' + RJOB[r.job][1] + ' Lv.' + r.lv, RJOB[r.job][2] + ' · 心情 ' + Math.round(r.happy), (r.lv < 3 ? bt('reTeach', i, '教他（2h）', canAct(2, 10)) : '') + bt('reKick', i, '請走', true, true))).join(''); h += '<div class="cat">🚪 來敲門的倖存者（每 6 天）</div>' + (c.cands.length ? c.cands.map((r, i) => row(RJOB[r.job][0] + ' ' + r.n + ' · ' + RJOB[r.job][1], RJOB[r.job][2], bt('reHire', i, '讓他住進來', c.res.length < resCap()))).join('') : '<p class="meta">過幾天會有人來。</p>'); }
  if (tab === 'energy') { h += '<div class="cat">⚡ 電網</div>' + Object.entries(GENS).map(([k, G0]) => row(G0.ic + ' ' + G0.n + (c.grid[k] ? ' ✅' : ''), G0.d + (c.grid[k] ? '' : ' · ' + needTxt(G0.cost) + '、🪙 ' + G0.coin), c.grid[k] ? '' : bt('enBuild', k, '蓋', bz.coin >= G0.coin))).join(''); h += '<div class="cat">💧 水利（現在：' + WATER_ST[c.water] + '，每天 +' + [0, 2, 4, 7, 12][c.water] + ' 份水）</div>' + (WATER_C[c.water + 1] ? row('升級成' + WATER_ST[c.water + 1], needTxt(WATER_C[c.water + 1][0]) + '、🪙 ' + WATER_C[c.water + 1][1], bt('waUp', null, '升級', bz.coin >= WATER_C[c.water + 1][1])) : '<p class="meta">已經接上自來水管線。</p>'); h += '<p class="meta">昨天發電 ' + (c.lastPw || 0) + ' 度、產水 ' + (c.lastWa || 0) + ' 份。</p>'; }
  if (tab === 'fest') { const id = Math.floor((sv.day - 1) / 10), done = c.fest[id]; h += '<p class="meta">每 10 天一次（換季前一天）。端出越多料理、住戶越多、聲望越高，來的人越多。</p>' + (done ? row('這一季已經辦過了', '來了 ' + done.crowd + ' 人、端出 ' + done.served + ' 份料理') : bt('feHost', null, '🎆 主辦祭典（4 小時）', feOpen() && canAct(4, 15))) + '<div class="cat">歷屆祭典</div>' + (Object.entries(c.fest).map(([k, f]) => row('第 ' + (Number(k) + 1) + ' 季', f.crowd + ' 人 · ' + f.served + ' 份料理')).join('') || '<p class="meta">還沒辦過。</p>'); if (c.merchant && c.merchant.day === sv.day) h += '<div class="cat">🧳 旅行商人（今天限定）</div>' + c.merchant.items.map((it, i) => row(itemIc(it.k) + ITEMS[it.k].n + ' ×' + it.q + (it.sold ? ' ✅' : ''), '🪙 ' + it.p, it.sold ? '' : bt('mcBuy', i, '買', bz.coin >= it.p))).join(''); }
  if (tab === 'plan') { h += '<p class="meta">一週每天指定一件事，早上會加做一次（不用另外解鎖自動化，材料要夠）。</p>'; for (let d = 0; d < 7; d++) h += row('星期' + WEEK[d] + (sv.day % 7 === d ? '（今天）' : ''), '<div class="gr-chips">' + Object.entries(PLAN_T).map(([k, P]) => chip('plSetDay', d + ':' + k, P[0], (c.plan[d] || 'rest') === k)).join('') + '</div>'); h += '<div class="cat">🧹 倉庫</div>' + bt('invTidy', null, '一鍵整理倉庫', true); }
  if (tab === 'fin') { const L = c.fin.slice(-7), inc = L.reduce((a, x) => a + x.in, 0), out = L.reduce((a, x) => a + x.out, 0); h += row('近 7 天', '收入 🪙' + inc + ' · 支出 🪙' + out + ' · 淨賺 🪙' + (inc - out)) + chartSVG(c.fin.map(x => ({ v: x.in - x.out })), 'v', '#ecd27a'); const top = Object.entries(c.out).sort((a, b) => b[1] - a[1]).slice(0, 8); h += '<div class="cat">🏆 出貨排行（累積）</div>' + (top.length ? top.map(([k, n], i) => row((i + 1) + '. ' + itemIc(k) + ITEMS[k].n, '出貨 ' + n + ' 個 · 現在一個 🪙' + valOf(k))).join('') : '<p class="meta">還沒有出貨紀錄。</p>'); h += '<div class="cat">🏙️ 重建度細項</div>' + rb.parts.map(([n, v, w]) => row(n, Math.round(Math.min(1, v) * 100) + '%（佔 ' + w + '%）')).join(''); }
  return h;
}
const _wmHTMLCity = wmHTML;
wmHTML = function () { if (UI.wm !== 'city') return _wmHTMLCity(); if (!cityOpen()) { UI.wm = null; return _wmHTMLCity(); } return '<div class="rt-modal" data-a="wmClose"><div class="rt-mbox wm-box fm-box" data-a="noop"><div class="rt-mh"><div><b>🏙️ 城市</b></div><button class="btn ghost" data-a="wmClose" style="margin-left:auto">關閉</button></div>' + cityModal() + '</div></div>'; };
function ctTick(now) { requestAnimationFrame(ctTick); if (UI.wm !== 'city' || !S || !S.sv) return; const el = document.getElementById('ct-scene'); if (el) el.innerHTML = citySVG(UI.ctTab || 'apt', now); }
requestAnimationFrame(ctTick);
const _rtPanelCity = rtPanel;
rtPanel = function () { const h = _rtPanelCity(); return cityOpen() ? h.replace('<button class="pill" data-a="grOpenHub">', '<button class="pill" data-a="cityOpenHub">🏙️ 城市</button><button class="pill" data-a="grOpenHub">') : h; };
VERBS.splice(9, 0, { k: 'city', ic: '🏙️', n: '城市（公寓、據點、工廠、住戶、能源）', kw: '城市 公寓 樓 據點 街區 貨運 工廠 罐頭 品牌 住戶 招募 能源 電 風力 太陽能 水利 自來水 祭典 商人 排程 報表 財務 整理 倉庫' });
const _verbCity = SACT.verb;
SACT.verb = function (k) { if (k === 'city') { UI.verbs = false; if (cityOpen()) return SACT.cityOpenHub(); slog('🏙️ 城市還沒解鎖：家園 Lv.3、或第 20 天、或聲望 40。'); render(); return; } return _verbCity(k); };
GROW.push({ k: 'city', t: 3, ic: '🏙️', n: '城市', g: 'home', c: () => homeLv() >= 3 || S.sv.day >= 20 || BZ().rep >= 40, txt: '家園 Lv.3、第 20 天或聲望 40' });
GR_INTRO.city = ['從一個家擴張成一座城：清出公寓空房、接管街區據點、蓋工廠、招募住戶、建電網和水利。', '所有建設加總成「城市重建度」，到 100% 城市就復興了。', '選單裡多了「🏙️ 城市」按鈕。'];
const _grBodyCity = grBody;
grBody = function (k) { if (k !== 'city') return _grBodyCity(k); const rb = rebuild(); return row('🏙️ 重建度 ' + rb.pct + '%', '名聲：' + fameName(), bt('cityOpenHub', null, '打開城市', true)); };
