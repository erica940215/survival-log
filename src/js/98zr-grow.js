/* ================= 🌟 成長路線：循序漸進解鎖的進階玩法 =================
   五個階段，前一階段開夠了才會出現下一階段。全部放在「🌟 成長」視窗。 */

/* ===== 新物品 ===== */
const GR_ITEMS = {
  dark_dish: ['黑暗料理', 'food', 0.3], tomato_omelet: ['番茄歐姆蛋', 'food', 0.3], honey_yam: ['蜜地瓜', 'food', 0.3], ginger_fish: ['薑絲魚片', 'food', 0.3],
  scallion_cake: ['蔥油餅', 'food', 0.2], taro_ball: ['芋圓', 'food', 0.2], corn_chowder: ['玉米濃湯', 'food', 0.4], rabbit_3cup: ['三杯兔', 'food', 0.4],
  chili_fish: ['剁椒魚', 'food', 0.3], cheese_corn: ['起司焗玉米', 'food', 0.3], pumpkin_fried: ['南瓜炒飯', 'food', 0.4], shrimp_egg: ['蝦仁炒蛋', 'food', 0.3],
  ruby: ['紅寶石番茄種子', 'farm', 0.05], ruby_p: ['紅寶石番茄', 'food', 0.2], gpump: ['巨無霸南瓜種子', 'farm', 0.05], gpump_p: ['巨無霸南瓜', 'food', 1.5],
  pyam: ['紫心地瓜種子', 'farm', 0.05], pyam_p: ['紫心地瓜', 'food', 0.3], rcorn: ['彩虹玉米種子', 'farm', 0.05], rcorn_p: ['彩虹玉米', 'food', 0.3],
  jcab: ['翡翠高麗菜種子', 'farm', 0.05], jcab_p: ['翡翠高麗菜', 'food', 0.5], gtom: ['黃金番茄種子', 'farm', 0.05], gtom_p: ['黃金番茄', 'food', 0.2],
  fry: ['魚苗', 'farm', 0.1], shrimp: ['蝦子', 'food', 0.2], clay: ['黏土', 'mat', 1], bowl: ['陶碗', 'mat', 0.5], plate: ['陶盤', 'mat', 0.5],
  jar: ['陶甕', 'mat', 2], fineplate: ['金邊瓷盤', 'mat', 0.5], mulb_l: ['桑葉', 'mat', 0.1], cocoon: ['蠶繭', 'mat', 0.05], cloth: ['絲布', 'mat', 0.3],
  quilt: ['蠶絲被', 'mat', 2], shirt: ['絲綢襯衫', 'mat', 0.3]
};
for (const [k, [n, cat, w]] of Object.entries(GR_ITEMS)) ITEMS[k] = { n, cat, w, note: '' };
Object.assign(FOOD, {
  dark_dish: { sat: 10, mor: -3 }, tomato_omelet: { sat: 35, mor: 9, dish: true }, honey_yam: { sat: 35, mor: 12, dish: true }, ginger_fish: { sat: 40, mor: 10, dish: true, warm: true },
  scallion_cake: { sat: 30, mor: 9, dish: true }, taro_ball: { sat: 25, mor: 15, dish: true }, corn_chowder: { sat: 45, mor: 12, dish: true, warm: true }, rabbit_3cup: { sat: 50, mor: 15, dish: true },
  chili_fish: { sat: 45, mor: 13, dish: true }, cheese_corn: { sat: 40, mor: 14, dish: true }, pumpkin_fried: { sat: 55, mor: 12, dish: true }, shrimp_egg: { sat: 40, mor: 14, dish: true },
  ruby_p: { sat: 15, mor: 8 }, gpump_p: { sat: 60, mor: 6 }, pyam_p: { sat: 40, mor: 6 }, rcorn_p: { sat: 40, mor: 8 }, jcab_p: { sat: 35, mor: 6 }, gtom_p: { sat: 18, mor: 12 }, shrimp: { sat: 15, mor: 4 }
});
Object.assign(SEED_OUT, { ruby: 'ruby_p', gpump: 'gpump_p', pyam: 'pyam_p', rcorn: 'rcorn_p', jcab: 'jcab_p', gtom: 'gtom_p' });
Object.assign(CROP_F, { ruby_p: 1, gpump_p: 1.4, pyam_p: 1.1, rcorn_p: 1.1, jcab_p: 1.1, gtom_p: 1.2 });
Object.assign(CROP_COL, { ruby_p: '#c8102e', gpump_p: '#f08a24', pyam_p: '#8a4ac0', rcorn_p: '#e04ab0', jcab_p: '#3ac08a', gtom_p: '#f0c020' });
Object.assign(ITEM_EMO, { dark_dish: '🫠', tomato_omelet: '🍳', honey_yam: '🍠', ginger_fish: '🐟', scallion_cake: '🫓', taro_ball: '🍡', corn_chowder: '🥣', rabbit_3cup: '🍲', chili_fish: '🌶️', cheese_corn: '🌽', pumpkin_fried: '🍛', shrimp_egg: '🍤',
  ruby: '🌱', ruby_p: '🍅', gpump: '🌱', gpump_p: '🎃', pyam: '🌱', pyam_p: '🍠', rcorn: '🌱', rcorn_p: '🌽', jcab: '🌱', jcab_p: '🥬', gtom: '🌱', gtom_p: '🟡',
  fry: '🐠', shrimp: '🦐', clay: '🟤', bowl: '🥣', plate: '🍽️', jar: '🏺', fineplate: '🍽️', mulb_l: '🍃', cocoon: '🥚', cloth: '🧵', quilt: '🛌', shirt: '👔' });
Object.assign(FRESH_LIFE, { shrimp: 2 });
Object.assign(MARKET, { fry: [10, 1, 3], clay: [6, 1, 2] });
Object.assign(LV_T, { pot: [0, 4, 10, 18, 30], nm: [0, 30, 80, 160, 300] });
Object.assign(LV_N, { pot: ['', '玩土的', '陶藝學徒', '陶藝師', '窯燒大師', '人間國寶'], nm: ['', '路邊攤', '人氣攤', '排隊攤', '夜市招牌', '夜市傳說'] });

/* ===== 狀態 ===== */
function GR() {
  const fm = F(); for (const k of ['pot', 'nm']) if (fm.xp[k] == null) fm.xp[k] = 0;
  if (!fm.gr) fm.gr = { ul: {}, soil: 70, cookN: {}, plated: {}, hyb: null, crossbed: false, pond: false, fish: [], shrimp: false, hydro: false,
    silk: { trees: 0, house: false, worms: 0, age: 0, loom: false }, reviews: [], nmDay: 0, staff: [], cands: [], candDay: -9,
    furn: {}, deco: {}, line: {}, wk: null, master: null, contest: {}, stats: { exc: 0, orders: 0, coin: 0, cook: 0, harvest: 0, fish: 0, made: 0 }, lastBrew: null };
  return fm.gr;
}
const grOn = k => !!(S.sv && S.sv.w && S.sv.w.fm && S.sv.w.fm.gr && S.sv.w.fm.gr.ul[k]);
const addIt = (k, n) => { if (n > 0) sv_addFresh(k, n); };
const season = d => Math.floor(((d || S.sv.day) - 1) / 10) % 4;
const SEASON_N = ['春', '夏', '秋', '冬'], SEASON_IC = ['🌸', '☀️', '🍁', '❄️'];
const SEASON_CROP = [['cabbage_p', 'scallion_p', 'straw_p', 'rape_p', 'jcab_p', 'tea_p'], ['corn_p', 'tomato_p', 'cane_p', 'chili_p', 'basil_p', 'ruby_p', 'gtom_p', 'rcorn_p'], ['pumpkin_p', 'taro_p', 'peanut_p', 'yam_p', 'gpump_p', 'pyam_p', 'wheat_p'], ['cabbage_p', 'sprout_p', 'scallion_p', 'yam_p', 'wheat_p']];
const CROPS = () => [...new Set(Object.values(SEED_OUT))];

/* ===== 解鎖路線 ===== */
const anyLv5 = () => chefLv() >= 5 || ['farm', 'herb', 'proc', 'ranch', 'brew', 'bake', 'shop', 'pot'].some(k => LV_T[k] && lvOfK(k) >= 5);
const cdxHasExcDish = () => Object.keys(DISHES).concat(Object.keys(LAB)).some(k => J.cdx && J.cdx[k] === 2);
const GROW = [
  // 第一階段：起步
  { k: 'lab', t: 1, ic: '🧪', n: '食譜研發', g: 'kitchen', c: () => chefLv() >= 2, txt: '廚師 Lv.2' },
  { k: 'soil', t: 1, ic: '🟫', n: '土壤肥力', g: 'field', c: () => lvOfK('farm') >= 2, txt: '種植 Lv.2' },
  { k: 'season', t: 1, ic: '🌸', n: '四季作物', g: 'field', c: () => S.sv.day >= 5, txt: '撐到第 5 天' },
  { k: 'review', t: 1, ic: '⭐', n: '客人評價', g: 'biz', c: () => bzOpenTab('shop'), txt: '小店開張' },
  // 第二階段：成長
  { k: 'sig', t: 2, ic: '👑', n: '招牌菜', g: 'kitchen', c: () => Object.values(GR().cookN).some(n => n >= 5), txt: '同一道料理煮 5 次' },
  { k: 'plate', t: 2, ic: '🍽️', n: '擺盤', g: 'kitchen', c: () => cdxHasExcDish(), txt: '做出第一道極品料理' },
  { k: 'hybrid', t: 2, ic: '🧬', n: '雜交作物', g: 'field', c: () => lvOfK('farm') >= 3, txt: '種植 Lv.3' },
  { k: 'fish', t: 2, ic: '🐟', n: '魚池與水耕', g: 'ind', c: () => lvOfK('ranch') >= 2, txt: '養殖 Lv.2' },
  { k: 'weekly', t: 2, ic: '🎯', n: '每週挑戰', g: 'goal', c: () => S.sv.day >= 7, txt: '撐到第 7 天' },
  // 第三階段：專業
  { k: 'pottery', t: 3, ic: '🏺', n: '陶藝窯', g: 'ind', c: () => BZ().kiln && lvOfK('bake') >= 2, txt: '蓋好磚窯、烘焙 Lv.2' },
  { k: 'silk', t: 3, ic: '🐛', n: '養蠶織布', g: 'ind', c: () => lvOfK('farm') >= 3 && S.sv.day >= 15, txt: '種植 Lv.3、第 15 天' },
  { k: 'night', t: 3, ic: '🏮', n: '夜市擺攤', g: 'biz', c: () => BZ().rep >= 30, txt: '聲望 30' },
  { k: 'bigorder', t: 3, ic: '🔥', n: '限時大訂單', g: 'biz', c: () => BZ().rep >= 25, txt: '聲望 25' },
  { k: 'furn', t: 3, ic: '🛋️', n: '家具升級', g: 'home', c: () => S.sv.day >= 15, txt: '撐到第 15 天' },
  // 第四階段：老闆
  { k: 'staff', t: 4, ic: '🧑‍🍳', n: '員工', g: 'biz', c: () => BZ().rep >= 40 || (S.sv.zoe && S.sv.zoe.state === 'saved') || (S.sv.mgr && S.sv.mgr.state === 'saved'), txt: '聲望 40，或救下一位倖存者' },
  { k: 'deco', t: 4, ic: '🖼️', n: '裝潢主題', g: 'home', c: () => Object.values(GR().furn).reduce((a, b) => a + b - 1, 0) >= 3, txt: '家具升級 3 次' },
  { k: 'line', t: 4, ic: '⚙️', n: '自動化產線', g: 'home', c: () => Object.keys(BZ().res).length >= 3, txt: '研究完成 3 項' },
  // 第五階段：大師
  { k: 'master', t: 5, ic: '🎓', n: '大師稱號', g: 'goal', c: () => anyLv5(), txt: '任一技能 Lv.5' },
  { k: 'contest', t: 5, ic: '🏆', n: '品評會', g: 'goal', c: () => S.sv.day >= 30, txt: '撐到第 30 天' }
];
const TIER_N = ['', '起步', '成長', '專業', '老闆', '大師'], TIER_NEED = [0, 0, 2, 4, 4, 2];
function tierOpen(t) { if (t === 1) return bizAllowed(); return tierOpen(t - 1) && GROW.filter(g => g.t === t - 1 && grOn(g.k)).length >= TIER_NEED[t]; }
function growCheck() {
  if (!S.sv || S.phase !== 'survive') return [];
  const gr = GR(), out = [];
  for (const g of GROW) if (!gr.ul[g.k] && tierOpen(g.t) && g.c()) { gr.ul[g.k] = S.sv.day; out.push('🌟 解鎖新玩法：' + g.ic + ' ' + g.n + '！'); }
  return out;
}

/* ===== 1. 食譜研發 ===== */
const LAB = {
  tomato_omelet:    { ing: ['egg', 'tomato_p'], q: 2, hint: '最家常的紅黃配' },
  honey_yam:     { ing: ['honey', 'yam_p'], q: 2, hint: '甜上加甜的根莖' },
  ginger_fish:   { ing: ['fish', 'ginger_l'], q: 2, hint: '去腥要靠辛香葉' },
  scallion_cake: { ing: ['flour', 'scallion_p'], q: 3, hint: '麵粉加綠綠的' },
  corn_chowder:  { ing: ['corn_p', 'goat_milk'], q: 2, hint: '黃色的加白色的奶' },
  cheese_corn:   { ing: ['cheese', 'corn_p'], q: 2, hint: '牽絲的玉米' },
  chili_fish:    { ing: ['chili_p', 'fish'], q: 2, hint: '辣的魚' },
  shrimp_egg:    { ing: ['egg', 'shrimp'], q: 2, hint: '池子裡的加雞下的' },
  taro_ball:     { ing: ['sugar', 'taro_p', 'yam_p'], q: 4, hint: '三種材料：兩種根莖加甜的' },
  rabbit_3cup:     { ing: ['basil_p', 'ginger_l', 'rabbit_m'], q: 2, hint: '三種材料：肉、香料、辛香葉' },
  pumpkin_fried: { ing: ['egg', 'pumpkin_p', 'rice'], q: 3, hint: '三種材料：橘色的、白米、蛋' }
};
const LAB_POOL = () => [...new Set(CROPS().concat(['egg', 'honey', 'fish', 'shrimp', 'rabbit_m', 'goat_milk', 'cheese', 'flour', 'sugar', 'rice', 'ginger_l', 'duck_egg', 'mint_l']))].filter(k => ITEMS[k] && sv_has(k) > 0);
function labBook() { if (!J.labBook) J.labBook = {}; return J.labBook; }
function labQual(k, n) {
  const lv = chefLv(), Q = BZ().qual[k] || (BZ().qual[k] = [0, 0]); let g = 0, e = 0;
  for (let i = 0; i < n; i++) { const r = rnd(); if (r < 0.04 + 0.03 * lv + (RES('qlamp') ? 0.04 : 0)) e++; else if (r < 0.2 + 0.06 * lv) g++; }
  Q[0] += g; Q[1] += e; [g, e] = grPromote(k, n - g - e, g, e); codexMark(k, e ? 2 : g ? 1 : 0); return [g, e];
}
Object.assign(SACT, {
  labPick(k) { const s = UI.labSel || (UI.labSel = []); const i = s.indexOf(k); if (i >= 0) s.splice(i, 1); else if (s.length < 3) s.push(k); render(); },
  labTry() {
    const sv = S.sv, sel = (UI.labSel || []).slice().sort(); if (sel.length < 2) { slog('至少放兩種材料。'); render(); return; }
    if (!canAct(1, 5)) { slog('時間或體力不夠。'); render(); return; }
    if (!sel.every(k => sv_has(k) > 0)) return;
    sel.forEach(k => sv_take(k, 1));
    const hit = Object.entries(LAB).find(([, L]) => L.ing.slice().sort().join('+') === sel.join('+'));
    sv.sta -= 5; UI.labFx = performance.now();
    if (hit) {
      const [k, L] = hit, nw = !labBook()[k]; labBook()[k] = true; saveJournal();
      sv.st[k] = (sv.st[k] || 0) + L.q; const [g, e] = labQual(k, L.q); chefGain(k, 2); grCook(k);
      slog((nw ? '🧪 研發成功！發現新菜「' + ITEMS[k].n + '」，記進食譜本。' : '又做了一次' + ITEMS[k].n + '。') + ' ×' + L.q + (e ? '，極品 ' + e : '') + (g ? '，優良 ' + g : ''), nw);
      sfx(nw ? 'ach' : 'pop'); UI.labHit = k;
    } else { sv.st.dark_dish = (sv.st.dark_dish || 0) + 1; slog('🫠 失敗了……鍋子裡冒出一團說不出顏色的東西（黑暗料理 ×1）。'); UI.labHit = 'dark_dish'; }
    UI.labSel = []; passHours(1); render();
  },
  labCook(k) {
    const L = LAB[k], sv = S.sv; if (!L || !labBook()[k] || !L.ing.every(m => sv_has(m) > 0)) return;
    UI.labSel = L.ing.slice(); SACT.labTry();
  }
});

/* ===== 2. 招牌菜（同一道煮 10 次） ===== */
function grCook(k) { const gr = GR(); gr.cookN[k] = (gr.cookN[k] || 0) + 1; gr.stats.cook++; if (gr.cookN[k] === 10 && grOn('sig')) slog('👑 「' + ITEMS[k].n + '」成為你的招牌菜！品質更容易好，客人也會指名。', true); }
const isSig = k => grOn('sig') && (GR().cookN[k] || 0) >= 10;
const _cookxGr = SACT.cookx;
SACT.cookx = function (k) { const had = S.sv ? sv_has(k) : 0; _cookxGr(k); if (S.sv && DISHES[k] && sv_has(k) > had) grCook(k); };
// 品質加成：招牌菜、陶瓷餐具、廚神
function grPromote(k, normal, g, e) {
  const Q = BZ().qual[k] || (BZ().qual[k] = [0, 0]), gr = GR(); let p = 0;
  if (FOOD[k] && FOOD[k].dish) {
    if (isSig(k)) p += 0.2;
    p += Math.min(8, (sv_has('bowl') + sv_has('plate') + sv_has('fineplate') * 2)) * 0.015;
    if (decoDone('forest') && Object.values(SEED_OUT).includes(k)) p += 0.05;
    if (gr.master === 'chef') p = 1;
  }
  if (Object.values(SEED_OUT).includes(k) && decoDone('forest')) p += 0.05;
  let up = 0; for (let i = 0; i < normal; i++) if (rnd() < p) up++;
  Q[0] += up; return [g + up, e];
}
const _qRollGr = qRoll;
qRoll = function (k, n) { const [g, e] = _qRollGr(k, n); if (!S.sv || !S.sv.w || !S.sv.w.fm || !S.sv.w.fm.gr) return [g, e]; return grPromote(k, n - g - e, g, e); };
const _wantGr = wantPool;
wantPool = function () { const L = _wantGr(); if (S.sv && S.sv.w && S.sv.w.fm && S.sv.w.fm.gr) for (const [k, n] of Object.entries(GR().cookN)) if (n >= 10 && grOn('sig')) L.push(k, k, k); return L; };
const _valGr = valOf;
valOf = function (k) { return Math.round(_valGr(k) * (S.sv && S.sv.w && S.sv.w.fm && S.sv.w.fm.gr && isSig(k) ? 1.25 : 1)); };

/* ===== 3. 擺盤 ===== */
const PLATES = { none: ['原本的碗', 0], plate: ['陶盤', 15], fineplate: ['金邊瓷盤', 30] };
const GARN = { none: ['不放', 0], basil_p: ['九層塔', 10], scallion_p: ['蔥花', 8], mint_l: ['薄荷葉', 12], chili_p: ['辣椒絲', 8] };
Object.assign(SACT, {
  plSet(v) { const [a, b] = v.split(':'); if (a === 'p') UI.plP = b; else if (a === 'g') UI.plG = b; else UI.plD = b; render(); },
  plDo() {
    const k = UI.plD, gr = GR(), pl = UI.plP || 'none', ga = UI.plG || 'none'; if (!k) return;
    const free = qOf(k)[1] - (gr.plated[k] || 0); if (free <= 0) { slog('沒有還沒擺盤的極品' + ITEMS[k].n + '。'); render(); return; }
    if (pl !== 'none' && sv_has(pl) <= 0) { slog('沒有' + PLATES[pl][0] + '。'); render(); return; }
    if (ga !== 'none') { if (sv_has(ga) <= 0) { slog('沒有' + GARN[ga][0] + '。'); render(); return; } sv_take(ga, 1); }
    const score = 40 + PLATES[pl][1] + GARN[ga][1] + Math.floor(rnd() * 25);
    gr.plated[k] = (gr.plated[k] || 0) + 1; UI.plScore = score; UI.plFx = performance.now();
    slog('🍽️ 擺盤完成：' + ITEMS[k].n + '（' + score + ' 分）' + (score >= 85 ? '，漂亮得像餐廳！' : '') + '賣出時價格 ×' + (1.3 + score / 200).toFixed(2) + '。'); sfx('pop'); render();
  }
});
// 賣出／服務時若是擺盤過的極品 → 加價
for (const a of ['bzSell', 'bzServe']) {
  const f = SACT[a];
  SACT[a] = function (v) {
    const bz = BZ(), k = a === 'bzSell' ? v : (bz.cust[Number(v)] || {}).want, gr = GR(), c0 = bz.coin, q1 = k ? qOf(k)[1] : 0;
    f(v);
    if (k && (gr.plated[k] || 0) > 0 && qOf(k)[1] < q1) { gr.plated[k]--; const add = Math.round((bz.coin - c0) * 0.5); bz.coin += add; slog('擺盤的極品料理多賣了 ' + add + ' 瓶蓋。'); }
    if (k && gr.plated[k] > qOf(k)[1]) gr.plated[k] = qOf(k)[1];
  };
}

/* ===== 4. 土壤、季節（每晚收成後處理） ===== */
Object.assign(SACT, {
  soilFert() { const gr = GR(); if (sv_has('fert') <= 0) return; sv_take('fert', 1); gr.soil = Math.min(100, gr.soil + 25); slog('把肥料翻進土裡，肥力 +25。'); render(); },
  soilRest() { const gr = GR(), sv = S.sv; if (!canAct(2, 10)) return; gr.soil = Math.min(100, gr.soil + 10); sv.sta -= 10; slog('鬆土、翻土、拌進落葉，肥力 +10。'); passHours(2); render(); }
});

/* ===== 5. 雜交作物 ===== */
const HYB = {
  'straw_p+tomato_p': 'ruby', 'corn_p+pumpkin_p': 'gpump', 'taro_p+yam_p': 'pyam', 'chili_p+corn_p': 'rcorn', 'cabbage_p+scallion_p': 'jcab', 'honey+tomato_p': 'gtom'
};
Object.assign(SACT, {
  hyBuild() { const gr = GR(); if (gr.crossbed) return; if (!payN({ board: 4, fert: 1, pot: 2 })) { slog('雜交苗床要木板 4、肥料 1、花盆 2。'); render(); return; } gr.crossbed = true; slog('做好雜交苗床。'); sfx('fix'); render(); },
  hySet(v) { const [i, k] = v.split(':'); const s = UI.hySel || (UI.hySel = []); s[Number(i)] = k; render(); },
  hyGo() {
    const gr = GR(), sv = S.sv, s = (UI.hySel || []).filter(Boolean); if (!gr.crossbed || gr.hyb || s.length < 2 || s[0] === s[1]) return;
    if (!s.every(k => sv_has(k) >= 3)) { slog('兩種各要 3 個。'); render(); return; }
    s.forEach(k => sv_take(k, 3)); const key = s.slice().sort().join('+');
    gr.hyb = { a: s[0], b: s[1], out: HYB[key] || null, ready: sv.day + 3 };
    slog('把' + ITEMS[s[0]].n + '和' + ITEMS[s[1]].n + '的花粉互相授粉，3 天後看結果。'); UI.hySel = []; render();
  }
});

/* ===== 6. 魚池、蝦籠、水耕 ===== */
Object.assign(SACT, {
  fiBuild(k) {
    const gr = GR(), C = { pond: { board: 6, plastic: 4, metal: 2 }, shrimp: { metal: 2, plastic: 2 }, hydro: { plastic: 4, metal: 2, pot: 2 } }[k];
    if (!C || gr[k]) return; if (!payN(C)) { slog('材料不夠：' + needTxt(C).replace(/<[^>]+>/g, '')); render(); return; }
    gr[k] = true; if (k === 'pond') { for (let i = 0; i < 3; i++) gr.fish.push({ age: 0 }); slog('魚池挖好了，放進 3 尾魚苗。'); } else slog('蓋好' + { shrimp: '蝦籠', hydro: '水耕架' }[k] + '。');
    sfx('fix'); render();
  },
  fiFry() { const gr = GR(); if (!gr.pond || sv_has('fry') <= 0 || gr.fish.length >= 10) return; const n = Math.min(sv_has('fry'), 10 - gr.fish.length); sv_take('fry', n); for (let i = 0; i < n; i++) gr.fish.push({ age: 0 }); slog('放了 ' + n + ' 尾魚苗進池子。'); render(); },
  fiCatch() {
    const gr = GR(), sv = S.sv, big = gr.fish.filter(f => f.age >= 5); if (!big.length) return; if (!canAct(1, 5)) return;
    gr.fish = gr.fish.filter(f => f.age < 5); addIt('fish', big.length); gr.stats.fish += big.length; const [g, e] = qRoll('fish', big.length); codexMark('fish', e ? 2 : g ? 1 : 0);
    gainXp('ranch', big.length * 0.5); sv.sta -= 5; slog('🎣 撈起 ' + big.length + ' 尾肥美的吳郭魚' + (e ? '（極品 ' + e + '）' : '') + '。記得再放魚苗。'); passHours(1); render();
  }
});

/* ===== 7. 陶藝 ===== */
const POTS = { bowl: { lv: 1, clay: 2, d: '每個陶碗讓料理更容易優良' }, plate: { lv: 1, clay: 2, d: '擺盤用，也讓料理更容易優良' }, jar: { lv: 2, clay: 4, d: '裝潢、賣錢' }, fineplate: { lv: 3, clay: 3, glass: 1, d: '最高級的擺盤，料理加成 ×2' } };
Object.assign(SACT, {
  poDig() { const sv = S.sv; if (!canAct(1, 8)) { slog('時間或體力不夠。'); render(); return; } addIt('clay', 2 + (lvOfK('pot') >= 3 ? 1 : 0)); sv.sta -= 8; slog('在後巷的花圃挖到一些黏土。'); passHours(1); render(); },
  poMake(k) {
    const P = POTS[k], sv = S.sv; if (!P || lvOfK('pot') < P.lv || !BZ().kiln) return;
    if (sv_has('clay') < P.clay || (P.glass && sv_has('glass') < P.glass) || sv_has('board') < 1) { slog('材料不夠（每窯還要 1 塊木板當柴）。'); render(); return; }
    if (!canAct(1, 5)) return;
    sv_take('clay', P.clay); if (P.glass) sv_take('glass', P.glass); sv_take('board', 1);
    const n = rnd() < 0.15 ? 0 : (lvOfK('pot') >= 4 ? 2 : 1); sv.sta -= 5; gainXp('pot', P.lv + 1); UI.poFx = performance.now();
    if (!n) slog('💥 窯裡傳來一聲脆響……破掉了。陶藝就是這樣。'); else { addIt(k, n); slog('🏺 出窯：' + ITEMS[k].n + ' ×' + n + '。'); sfx('pop'); }
    passHours(1); render();
  }
});

/* ===== 8. 養蠶織布 ===== */
Object.assign(SACT, {
  skTree() { const s = GR().silk; if (s.trees >= 4) return; if (!payN({ board: 1, fert: 1 })) { slog('種一棵桑樹要木板 1（支架）、肥料 1。'); render(); return; } s.trees++; slog('種下一棵桑樹（' + s.trees + '/4），每天長桑葉。'); render(); },
  skHouse() { const s = GR().silk; if (s.house) return; if (!payN({ board: 4, plastic: 2 })) { slog('蠶房要木板 4、塑膠 2。'); render(); return; } s.house = true; s.worms = 20; s.age = 0; slog('蠶房好了，鄰居林老師送你一盒蠶卵，孵出 20 隻蠶寶寶。'); sfx('fix'); render(); },
  skLoom() { const s = GR().silk; if (s.loom) return; if (!payN({ board: 4, metal: 2 })) { slog('織布機要木板 4、鐵片 2。'); render(); return; } s.loom = true; slog('組好一台老式織布機。'); sfx('fix'); render(); },
  skWeave() { const sv = S.sv; if (!GR().silk.loom || sv_has('cocoon') < 3 || !canAct(1, 6)) return; sv_take('cocoon', 3); addIt('cloth', 1); sv.sta -= 6; gainXp('proc', 1); UI.skFx = performance.now(); slog('🧵 喀噠喀噠，蠶繭 3 個織成 1 匹絲布。'); passHours(1); render(); },
  skSew(k) { const need = { quilt: 3, shirt: 2 }[k]; if (!need || sv_has('cloth') < need || !canAct(1, 4)) return; sv_take('cloth', need); addIt(k, 1); S.sv.sta -= 4; slog('縫好一件' + ITEMS[k].n + (k === 'quilt' ? '。冷天晚上蓋著，心態不會掉。' : '，很好賣。')); passHours(1); render(); }
});

/* ===== 9. 夜市 ===== */
const isNM = () => S.sv.day % 7 === 0;
Object.assign(SACT, {
  nmPick(k) { const s = UI.nmSel || (UI.nmSel = []); const i = s.indexOf(k); if (i >= 0) s.splice(i, 1); else if (s.length < 4) s.push(k); render(); },
  nmGo() {
    const sv = S.sv, gr = GR(), bz = BZ(), sel = (UI.nmSel || []).filter(k => sv_has(k) > 0);
    if (!isNM() || gr.nmDay === sv.day || !sel.length) return;
    if (sv.hour < 16) { slog('夜市 16:00 才開。'); render(); return; }
    if (!canAct(4, 15)) { slog('擺攤要 4 小時、體力 15。'); render(); return; }
    const lv = lvOfK('nm'), crowd = 6 + lv * 4 + Math.round((revAvg() - 3) * 3) + staffBonus('nm');
    let coin = 0, sold = 0; const by = {};
    for (let i = 0; i < crowd; i++) { const k = sel[Math.floor(rnd() * sel.length)]; if (sv_has(k) <= 0) continue; const t = takeBest(k); const c = Math.round(valOf(k) * qMul[t] * 1.3 * (gr.master === 'shop' ? 1.3 : 1)); coin += c; sold++; by[k] = (by[k] || 0) + 1; }
    bz.coin += coin; bz.rep += Math.ceil(sold / 4); gainXp('nm', sold * 2 + coin / 10); gr.stats.coin += coin; gr.nmDay = sv.day; sv.sta -= 15; UI.nmFx = performance.now();
    slog('🏮 夜市擺攤！' + crowd + ' 位客人經過，賣出 ' + sold + ' 份（' + Object.entries(by).map(([k, n]) => ITEMS[k].n + '×' + n).join('、') + '），賺了 ' + coin + ' 瓶蓋、聲望 +' + Math.ceil(sold / 4) + '。', true); sfx('buy');
    UI.nmSel = []; passHours(4); render();
  }
});

/* ===== 10. 評價 ===== */
const REV_TXT = { 5: ['太好吃了，明天還要來！', '老闆是天才吧', '末日裡吃到這個，我哭了', '五星，沒得挑'], 4: ['好吃，價格也實在', '很不錯，會再來', '份量剛好'], 3: ['還可以', '普普通通', '能填飽肚子'], 2: ['等了一天沒買到', '架上都空了', '有點失望'], 1: ['根本沒開門', '白跑一趟'] };
function addRev(n, who) { const gr = GR(), L = REV_TXT[n]; gr.reviews.unshift({ n, who, t: L[Math.floor(rnd() * L.length)], d: S.sv.day }); gr.reviews = gr.reviews.slice(0, 12); }
function revAvg() { const R = (S.sv.w.fm.gr || {}).reviews || []; return R.length ? R.reduce((a, r) => a + r.n, 0) / R.length : 3.5; }
const _serveRev = SACT.bzServe;
SACT.bzServe = function (i) { const bz = BZ(), c = bz.cust[Number(i)], was = c && c.done; _serveRev(i); if (c && !was && c.done && grOn('review')) addRev(Math.min(5, 3 + (c.t || 0) + (isSig(c.want) ? 1 : 0) - (rnd() < 0.2 ? 1 : 0)), c.n); };

/* ===== 11. 員工 ===== */
const STAFF_N = ['阿凱', '小美', '老周', '阿芬', '志明', '春嬌', '阿德', '小琪', '阿草', '大熊'];
const JOBS = { shop: ['🏪', '顧店', '每天早上自動招呼客人'], farm: ['🌾', '種田', '肥力回復、種植經驗'], brew: ['🍶', '顧酒窖', '酒桶熟成變快'], nm: ['🏮', '夜市', '夜市客人變多'], ranch: ['🐔', '牧場', '每天多撿雞蛋'] };
const staffBonus = job => GR().staff.filter(s => s.job === job).reduce((a, s) => a + s.s, 0);
Object.assign(SACT, {
  stHire(i) { const gr = GR(), bz = BZ(), c = gr.cands[Number(i)]; if (!c || gr.staff.length >= 3 || bz.coin < 30) return; bz.coin -= 30; gr.cands.splice(Number(i), 1); c.job = c.best; gr.staff.push(c); slog('👋 ' + c.n + '加入了！先安排他去「' + JOBS[c.job][1] + '」。日薪 ' + (3 + c.s * 2) + ' 瓶蓋。'); sfx('ach'); render(); },
  stJob(v) { const [i, j] = v.split(':'), s = GR().staff[Number(i)]; if (s && JOBS[j]) { s.job = j; render(); } },
  stFire(i) { const gr = GR(), s = gr.staff[Number(i)]; if (!s) return; gr.staff.splice(Number(i), 1); slog(s.n + '收拾東西離開了。'); render(); }
});

/* ===== 12. 家具升級 ===== */
const FURN_FX = { bed: '每晚多回精力', bedroom: '每晚多回精力', toilet: '每天衛生 +', freezer: '冷凍的食物更耐放（每天心態 +）', microwave: '料理品質 +', bench: '做東西更省體力（每天心態 +）', workshop: '每天心態 +', lightbox: '收成 +10%／級', greenhouse: '收成 +10%／級', potrack: '收成 +10%／級', storage: '每天心態 +', shelf: '每天心態 +', gen: '每天心態 +', heater: '冷天心態 +' };
const furnCost = lv => lv === 1 ? { board: 4, metal: 2 } : { board: 6, metal: 4, glass: 1 };
const furnCoin = lv => lv === 1 ? 20 : 60;
function placedKinds() { const sv = S.sv; return [...new Set(isoObjects().filter(o => sv.place[o.id] && FURN_FX[o.k]).map(o => o.k))]; }
Object.assign(SACT, {
  fuUp(k) { const gr = GR(), lv = gr.furn[k] || 1, bz = BZ(); if (lv >= 3) return; if (bz.coin < furnCoin(lv)) { slog('瓶蓋不夠。'); render(); return; } if (!payN(furnCost(lv))) { slog('材料不夠。'); render(); return; } bz.coin -= furnCoin(lv); gr.furn[k] = lv + 1; slog('✨ ' + ISO[k].n + '升到 ' + '★'.repeat(lv + 1) + '！' + FURN_FX[k] + '。'); sfx('ach'); render(); }
});

/* ===== 13. 裝潢主題 ===== */
const DECO = {
  retro:  { n: '復古台式', fx: '每天心態 +3', p: { tile: ['花磚地板', { clay: 4 }, 20], chair: ['紅色塑膠椅', { plastic: 3 }, 10], cooker: ['大同電鍋', { metal: 3 }, 30], cal: ['撕的日曆', { board: 1 }, 10] } },
  zen:    { n: '日式和風', fx: '每天早上精力 +10', p: { tatami: ['榻榻米', { board: 4, cloth: 1 }, 20], lamp: ['和紙燈', { cloth: 1, candle: 1 }, 15], vase: ['陶甕擺飾', { jar: 1 }, 10], bonsai: ['盆景', { pot: 1, mint_l: 1 }, 15] } },
  indust: { n: '工業風', fx: '小店每天多 1 位客人', p: { pipe: ['鐵管書架', { metal: 6 }, 30], bulb: ['愛迪生燈泡', { glass: 2, cell: 1 }, 20], wall: ['清水模牆', { clay: 3 }, 20], sofa: ['絲絨沙發', { cloth: 3 }, 40] } },
  forest: { n: '森林系', fx: '作物、料理更容易優良（+5%）', p: { green: ['植物牆', { pot: 2, veg: 3 }, 20], table: ['原木桌', { board: 6 }, 20], candle: ['蜂蠟蠟燭', { candle: 2 }, 10], basket: ['桑枝籃', { mulb_l: 5 }, 10] } }
};
const decoDone = t => { const gr = S.sv && S.sv.w && S.sv.w.fm && S.sv.w.fm.gr; return !!gr && !!DECO[t] && Object.keys(DECO[t].p).every(p => gr.deco[t + '.' + p]); };
Object.assign(SACT, {
  deBuy(v) { const [t, p] = v.split('.'), P = DECO[t] && DECO[t].p[p], gr = GR(), bz = BZ(); if (!P || gr.deco[v]) return; if (bz.coin < P[2]) { slog('瓶蓋不夠。'); render(); return; } if (!payN(P[1])) { slog('材料不夠。'); render(); return; } bz.coin -= P[2]; gr.deco[v] = true; slog('🖼️ 擺上' + P[0] + '。' + (decoDone(t) ? '「' + DECO[t].n + '」整套湊齊了！' + DECO[t].fx + '。' : '')); sfx(decoDone(t) ? 'ach' : 'pop'); render(); }
});

/* ===== 14. 自動化產線 ===== */
const LINE = {
  mill:  { n: '自動磨坊', d: '每天把小麥磨成麵粉', c: { metal: 3, board: 2 }, coin: 30 },
  dry:   { n: '加工輸送帶', d: '每天把多出來（超過 8 個）的作物做成乾貨', c: { metal: 4, plastic: 3 }, coin: 40 },
  bake:  { n: '自動烤爐', d: '有麵粉、木板就每天烤一爐麵包', c: { metal: 4, glass: 1 }, coin: 50 },
  brew:  { n: '自動釀酒', d: '酒桶空了就照上一次的配方再釀', c: { metal: 3, board: 3 }, coin: 50 },
  ship:  { n: '包裝出貨機', d: '每天把超過 20 個的東西自動賣掉', c: { metal: 4, plastic: 4, cell: 1 }, coin: 60 }
};
Object.assign(SACT, {
  liBuild(k) { const L = LINE[k], gr = GR(), bz = BZ(); if (!L || gr.line[k]) return; if (bz.coin < L.coin) { slog('瓶蓋不夠。'); render(); return; } if (!payN(L.c)) { slog('材料不夠。'); render(); return; } bz.coin -= L.coin; gr.line[k] = true; slog('⚙️ 裝好' + L.n + '：' + L.d + '。'); sfx('fix'); render(); }
});
const _brewLine = SACT.bzBrew;
SACT.bzBrew = function (k) { const n = BZ().vats.length; _brewLine(k); if (BZ().vats.length > n) GR().lastBrew = k; };

/* ===== 15. 每週挑戰 ===== */
const WK_POOL = [
  { k: 'exc', n: '做出 {g} 個極品', g: [3, 6, 10] }, { k: 'orders', n: '完成 {g} 張訂單', g: [3, 5, 8] }, { k: 'coin', n: '賺 {g} 瓶蓋', g: [150, 300, 600] },
  { k: 'cook', n: '煮 {g} 次料理', g: [8, 15, 25] }, { k: 'harvest', n: '收成 {g} 個作物', g: [20, 40, 70] }, { k: 'made', n: '做出 {g} 件東西', g: [25, 50, 90] }, { k: 'fish', n: '撈 {g} 尾魚', g: [4, 8, 14] }
];
function wkNew() {
  const gr = GR(), sv = S.sv, wk = Math.floor((sv.day - 1) / 7), lvl = Math.min(2, Math.floor(wk / 3));
  const pool = WK_POOL.filter(p => p.k !== 'fish' || grOn('fish')).slice(); const list = [];
  while (list.length < 3 && pool.length) { const p = pool.splice(Math.floor(rnd() * pool.length), 1)[0]; list.push({ k: p.k, n: p.n.replace('{g}', p.g[lvl]), goal: p.g[lvl], base: gr.stats[p.k] || 0, done: false }); }
  gr.wk = { wk, list, until: wk * 7 + 7 };
}
const wkProg = c => Math.min(c.goal, (GR().stats[c.k] || 0) - c.base);
function wkCheck() {
  const gr = GR(), out = []; if (!gr.wk) return out;
  for (const c of gr.wk.list) if (!c.done && wkProg(c) >= c.goal) {
    c.done = true; const seeds = ['ruby', 'gpump', 'pyam', 'rcorn', 'jcab', 'gtom'], s = seeds[Math.floor(rnd() * seeds.length)];
    S.sv.st[s] = (S.sv.st[s] || 0) + 2; BZ().coin += 40; out.push('🎯 每週挑戰完成：' + c.n + '！獎勵 ' + ITEMS[s].n + ' ×2、40 瓶蓋。');
    if (gr.wk.list.every(x => x.done)) { BZ().coin += 100; S.sv.st.fineplate = (S.sv.st.fineplate || 0) + 1; out.push('🎯 本週三項全破！額外 100 瓶蓋、金邊瓷盤 ×1。'); }
  }
  return out;
}
// 統計：極品數、做出數
const _cdxGr = codexMark;
codexMark = function (k, q) { _cdxGr(k, q); if (S.sv && S.sv.w && S.sv.w.fm && S.sv.w.fm.gr) { const st = GR().stats; st.made++; if (q === 2) st.exc++; } };
const _orderGr = SACT.bzOrder;
SACT.bzOrder = function (id) { const o = BZ().orders.find(x => x.id === id), was = o && o.done; _orderGr(id); if (o && !was && o.done) GR().stats.orders++; };

/* ===== 16. 大師稱號 ===== */
const MASTERS = {
  chef: ['料理之神', '料理至少都是優良', () => chefLv() >= 5], farm: ['神農', '收成多一半', () => lvOfK('farm') >= 5], brew: ['酒仙', '開桶時品質全部升一級', () => lvOfK('brew') >= 5],
  bake: ['甜點之神', '每爐多 2 個', () => lvOfK('bake') >= 5], ranch: ['牧神', '雞蛋、鴨蛋、羊奶、蜂蜜 ×1.3', () => lvOfK('ranch') >= 5], shop: ['商業鬼才', '賣東西多賺 30%', () => lvOfK('shop') >= 5], proc: ['加工大師', '加工每批多 1 個', () => lvOfK('proc') >= 5]
};
Object.assign(SACT, { msPick(k) { const gr = GR(); if (gr.master || !MASTERS[k] || !MASTERS[k][2]()) return; gr.master = k; slog('🎓 你獲得了稱號「' + MASTERS[k][0] + '」！' + MASTERS[k][1] + '。', true); sfx('ach'); render(); } });
const _tapMs = SACT.bzTap;
SACT.bzTap = function (i) { const v = BZ().vats[Number(i)], q0 = v ? qOf(v.k).slice() : null, h0 = v ? sv_has(v.k) : 0; _tapMs(i); if (v && GR().master === 'brew' && sv_has(v.k) > h0) { const Q = BZ().qual[v.k], n = sv_has(v.k) - h0, g = Q[0] - q0[0], e = Q[1] - q0[1], nor = n - g - e; Q[1] += g; Q[0] += nor - g; } };
const _bakeMs = SACT.bzBake;
SACT.bzBake = function (k) { const h0 = S.sv ? sv_has(k) : 0; _bakeMs(k); if (S.sv && sv_has(k) > h0 && GR().master === 'bake') addIt(k, 2); };
// 商業鬼才：所有經營賺的瓶蓋 +30%，順便記錄賺了多少（每週挑戰用）
for (const a of ['bzSell', 'bzServe', 'bzOrder']) { const f = SACT[a]; SACT[a] = function (v) { const bz = BZ(), c0 = bz.coin; f(v); const d = bz.coin - c0; if (d > 0) { const gr = GR(); if (gr.master === 'shop') { const add = Math.round(d * 0.3); bz.coin += add; } gr.stats.coin += bz.coin - c0; } }; }

/* ===== 17. 品評會 ===== */
const ctId = () => Math.floor(S.sv.day / 30);
const ctOpen = () => S.sv.day >= 30 && S.sv.day % 30 <= 2 && !GR().contest[ctId()];
const CT_CAT = { crop: ['🥬 作物組', k => Object.values(SEED_OUT).includes(k)], dish: ['🍳 料理組', k => FOOD[k] && FOOD[k].dish], drink: ['🍶 飲品與加工組', k => !!(BREWS[k] || PROC[k] || BAKES[k])] };
function ctScore(k) { const q = qOf(k), t = q[1] ? 2 : q[0] ? 1 : 0; return Math.round(valOf(k) * 2.5 + t * 25 + (isSig(k) ? 10 : 0) + ((GR().plated[k] || 0) ? 15 : 0) + rnd() * 20); }
Object.assign(SACT, {
  ctSet(v) { const [c, k] = v.split(':'); UI.ct = UI.ct || {}; UI.ct[c] = k; render(); },
  ctGo() {
    const gr = GR(), sel = UI.ct || {}, id = ctId(); if (!ctOpen()) return;
    const res = []; let coin = 0;
    for (const c of Object.keys(CT_CAT)) { const k = sel[c]; if (!k || sv_has(k) <= 0) continue; const me = ctScore(k), rivals = [0, 1, 2].map(() => Math.round(35 + id * 8 + rnd() * 45)); const place = 1 + rivals.filter(r => r > me).length;
      takeBest(k); const medal = ['', '🥇', '🥈', '🥉', '🎗️'][place]; res.push(CT_CAT[c][0] + '：' + ITEMS[k].n + ' ' + me + ' 分 → ' + medal + (place === 1 ? '冠軍' : '第 ' + place + ' 名')); coin += [0, 150, 80, 40, 10][place];
      if (place <= 3) { if (!J.trophies) J.trophies = []; J.trophies.push({ m: place, c, k, d: S.sv.day }); } }
    if (!res.length) { slog('每一組至少選一樣東西參賽。'); render(); return; }
    gr.contest[id] = res; BZ().coin += coin; BZ().rep += Math.round(coin / 20); saveJournal(); UI.ctFx = performance.now();
    slog('🏆 第 ' + id + ' 屆品評會結果：' + res.join('；') + '。獎金 ' + coin + ' 瓶蓋！', true); sfx('ach'); render();
  }
});

/* ===== 每晚：收成加成、魚、蠶、員工、產線、評價、解鎖 ===== */
const _nightGr = night;
night = function (watch) {
  const ok = S && S.sv && S.phase === 'survive', d0 = ok && S.sv.day;
  const snap = {}; if (ok) for (const k of CROPS().concat(['egg', 'duck_egg', 'goat_milk', 'honey'], Object.keys(PROC))) snap[k] = sv_has(k);
  const unserved = ok && S.sv.w && S.sv.w.fm && S.sv.w.fm.bz ? S.sv.w.fm.bz.cust.filter(c => !c.done).length : 0;
  _nightGr(watch);
  if (!ok || !S.sv || S.phase !== 'survive' || S.sv.day === d0) return;
  const ex = growNight(snap, unserved);
  if (UI.morning && UI.morning.day === S.sv.day) UI.morning.extra = (UI.morning.extra || []).concat(ex); else ex.forEach(t => slog(t));
};
function growNight(snap, unserved) {
  const sv = S.sv, gr = GR(), bz = BZ(), ex = [];
  // 收成：土壤、季節、家具、神農
  let harv = 0; const crops = {};
  for (const k of CROPS()) { const d = sv_has(k) - (snap[k] || 0); if (d > 0) { crops[k] = d; harv += d; } }
  gr.stats.harvest += harv;
  if (harv) {
    let bonus = 0, lost = 0; const fu = Math.max(gr.furn.lightbox || 1, gr.furn.greenhouse || 1, gr.furn.potrack || 1) - 1;
    for (const [k, d] of Object.entries(crops)) {
      let m = 0;
      if (grOn('soil')) { if (gr.soil >= 80) m += 0.25; else if (gr.soil < 30) m -= 0.3; }
      if (grOn('season') && SEASON_CROP[season()].includes(k)) m += 0.3;
      m += fu * 0.1; if (gr.master === 'farm') m += 0.5;
      const n = Math.floor(d * Math.abs(m) + rnd()); if (m > 0 && n > 0) { addIt(k, n); bonus += n; } else if (m < 0 && n > 0) { sv_take(k, Math.min(n, d)); lost += n; }
      if (grOn('soil')) gr.soil += ['peanut_p', 'sprout_p'].includes(k) ? d * 1.5 : -d * 1.2;
    }
    gr.soil = Math.max(0, Math.min(100, gr.soil));
    if (bonus) ex.push('🌾 ' + (grOn('season') ? SEASON_IC[season()] + '當季、' : '') + '好土加成，多收了 ' + bonus + ' 個作物。');
    if (lost) ex.push('🟫 土太貧瘠，少收了 ' + lost + ' 個。該施肥了（肥力 ' + Math.round(gr.soil) + '）。');
  }
  // 牧神、加工大師
  if (gr.master === 'ranch') for (const k of ['egg', 'duck_egg', 'goat_milk', 'honey']) { const d = sv_has(k) - (snap[k] || 0); if (d > 0) addIt(k, Math.round(d * 0.3 + rnd() * 0.5)); }
  if (gr.master === 'proc') for (const k of Object.keys(PROC)) if (sv_has(k) > (snap[k] || 0)) addIt(k, 1);
  // 季節更換
  if (grOn('season') && (sv.day - 1) % 10 === 0) ex.push(SEASON_IC[season()] + ' 進入' + SEASON_N[season()] + '天了。當季作物：' + SEASON_CROP[season()].filter(k => ITEMS[k]).slice(0, 5).map(k => ITEMS[k].n).join('、') + '……');
  // 雜交
  if (gr.hyb && sv.day >= gr.hyb.ready) { const h = gr.hyb; gr.hyb = null; if (h.out) { const n = 2 + (rnd() < 0.3 ? 1 : 0); addIt(h.out, n); gainXp('farm', 3); ex.push('🧬 雜交成功！得到 ' + ITEMS[h.out].n + ' ×' + n + '，可以拿去種。'); } else { addIt(h.a.replace('_p', ''), 1); ex.push('🧬 這兩種合不來，只收回一包普通種子。（' + ITEMS[h.a].n + '＋' + ITEMS[h.b].n + '）'); } }
  // 魚池
  if (gr.pond && gr.fish.length) {
    const need = Math.ceil(gr.fish.length / 3); let fed = RES('feeder') ? need : 0;
    for (const g of ['corn_p', 'wheat_p', 'veg_dry', 'veg', 'cabbage_p', 'sprout_p']) while (fed < need && sv_has(g) > 0) { sv_take(g, 1); fed++; }
    if (fed >= need) gr.fish.forEach(f => f.age++); else ex.push('🐟 魚飼料不夠，魚今天沒長大。');
    if (gr.shrimp && gr.fish.length >= 3) { const n = 1 + (rnd() < 0.4 ? 1 : 0); addIt('shrimp', n); ex.push('🦐 蝦籠裡有 ' + n + ' 隻蝦。'); }
    if (gr.hydro) { const n = 1 + Math.floor(gr.fish.length / 3); addIt('veg', n); ex.push('💧 水耕架長出 ' + n + ' 份青菜（魚池的水是肥料）。'); }
    const big = gr.fish.filter(f => f.age >= 5).length; if (big) ex.push('🐟 池子裡有 ' + big + ' 尾魚可以撈了。');
  }
  // 蠶
  const sk = gr.silk;
  if (sk.trees) addIt('mulb_l', sk.trees * 2);
  if (sk.house && sk.worms) { const need = Math.ceil(sk.worms / 10); if (sv_has('mulb_l') >= need) { sv_take('mulb_l', need); sk.age++; if (sk.age >= 6) { const n = Math.floor(sk.worms / 4); addIt('cocoon', n); sk.age = 0; ex.push('🐛 蠶寶寶結繭了！收 ' + n + ' 個蠶繭，飛出的蛾又產下新的卵。'); } } else ex.push('🐛 桑葉不夠，蠶寶寶餓著。'); }
  // 蠶絲被、裝潢
  if (sv_has('quilt') > 0 && inCold(sv.day)) { sv.mor = clamp(sv.mor + 4); ex.push('🛌 蓋著蠶絲被，寒夜也睡得暖。'); }
  if (decoDone('retro')) sv.mor = clamp(sv.mor + 3);
  if (decoDone('zen')) sv.sta = clamp(sv.sta + 10);
  if (decoDone('indust') && bz.cust) { const c = CUSTOMERS[Math.floor(rnd() * CUSTOMERS.length)], pool = wantPool(); bz.cust.push({ ic: c[0], n: c[1], want: pool[Math.floor(rnd() * pool.length)] }); }
  // 家具
  for (const [k, lv] of Object.entries(gr.furn)) { if (lv < 2) continue; const u = lv - 1;
    if (k === 'bed' || k === 'bedroom') sv.sta = clamp(sv.sta + 5 * u); else if (k === 'toilet') sv.hyg = clamp((sv.hyg || 0) + 5 * u); else if (k === 'heater') { if (inCold(sv.day)) sv.mor = clamp(sv.mor + 2 * u); } else if (!['lightbox', 'greenhouse', 'potrack', 'microwave'].includes(k)) sv.mor = clamp(sv.mor + u); }
  // 評價：昨天沒招呼到的客人
  if (grOn('review')) { if (unserved && rnd() < 0.4) addRev(rnd() < 0.6 ? 2 : 1, '沒買到的客人'); const a = revAvg(); if (bz.cust) { if (a >= 4.3) { const c = CUSTOMERS[Math.floor(rnd() * CUSTOMERS.length)], pool = wantPool(); bz.cust.push({ ic: c[0], n: c[1], want: pool[Math.floor(rnd() * pool.length)] }, { ic: '🧑‍💼', n: '看評價來的', want: pool[Math.floor(rnd() * pool.length)] }); ex.push('⭐ 評價很好（' + a.toFixed(1) + ' 星），多了 2 位客人。'); } else if (a < 2.8 && bz.cust.length > 1) { bz.cust.pop(); ex.push('⭐ 評價不好（' + a.toFixed(1) + ' 星），少了 1 位客人。'); } } }
  // 員工
  if (gr.staff.length) {
    let wage = 0; for (const s of gr.staff) wage += 3 + s.s * 2;
    if (bz.coin >= wage) { bz.coin -= wage; } else { const s = gr.staff.pop(); ex.push('💸 付不出薪水，' + s.n + '走了。'); }
    for (const s of gr.staff) {
      if (s.job === 'farm') { gr.soil = Math.min(100, gr.soil + 3 * s.s); gainXp('farm', s.s * 0.5); }
      if (s.job === 'brew') bz.vats.forEach(v => { v.start -= s.s >= 2 ? 1 : 0.5; });
      if (s.job === 'ranch' && W().roof && W().roof.hens) addIt('egg', s.s);
      if (s.job === 'shop') { let n = 1 + s.s; bz.cust.forEach((c, i) => { if (n > 0 && !c.done && sv_has(c.want) > 0) { SACT.bzServe(i); n--; } }); }
    }
    ex.push('🧑‍🍳 員工上工：' + gr.staff.map(s => s.n + JOBS[s.job][0]).join('、') + '（薪水 ' + wage + ' 瓶蓋）。');
  }
  if (grOn('staff') && sv.day - gr.candDay >= 5) { gr.candDay = sv.day; gr.cands = [0, 1, 2].map(() => { const ks = Object.keys(JOBS); return { n: STAFF_N[Math.floor(rnd() * STAFF_N.length)], s: 1 + Math.floor(rnd() * 3), best: ks[Math.floor(rnd() * ks.length)] }; }); }
  // 產線
  const L = gr.line;
  if (L.mill) { const n = Math.floor(sv_has('wheat_p') / 2); if (n) { sv_take('wheat_p', n * 2); addIt('flour', n * 2); ex.push('⚙️ 自動磨坊：麵粉 +' + n * 2 + '。'); } }
  if (L.dry) { let t = 0; for (const k of CROPS()) { const over = sv_has(k) - 8; if (over >= 2) { const n = Math.floor(over / 2); sv_take(k, n * 2); const out = k === 'yam_p' ? 'yam_dry' : ['straw_p', 'ruby_p', 'gtom_p'].includes(k) ? 'fruit_dry' : 'veg_dry'; addIt(out, n); qRoll(out, n); t += n; } } if (t) ex.push('⚙️ 加工輸送帶：多的作物做成 ' + t + ' 份乾貨。'); }
  if (L.bake && bz.kiln && sv_has('flour') >= 2 && sv_has('board') >= 1) { sv_take('flour', 2); sv_take('board', 1); addIt('bread', 4); qRoll('bread', 4); gainXp('bake', 1); ex.push('⚙️ 自動烤爐：出爐 4 個麵包。'); }
  if (L.brew && gr.lastBrew) { const B = BREWS[gr.lastBrew]; let n = 0; while (bz.vats.length < vatMax() && Object.entries(B.need).every(([m, c]) => sv_has(m) >= c)) { for (const [m, c] of Object.entries(B.need)) sv_take(m, c); bz.vats.push({ k: gr.lastBrew, start: sv.day }); n++; } if (n) ex.push('⚙️ 自動釀酒：又釀了 ' + n + ' 桶' + ITEMS[gr.lastBrew].n + '。'); }
  if (L.ship) { let c = 0; for (const k of Object.keys(ITEMS)) { if (['wu', 'water', 'board', 'metal', 'diesel', 'cell'].includes(k) || ITEMS[k].cat === 'equip') continue; const over = sv_has(k) - 20; if (over > 0) { for (let i = 0; i < over; i++) { const t = takeBest(k); c += Math.round(valOf(k) * qMul[t] * 0.8); } } } if (c) { bz.coin += c; gr.stats.coin += c; ex.push('⚙️ 包裝出貨機：把多的東西賣掉，+' + c + ' 瓶蓋。'); } }
  // 大訂單
  if (grOn('bigorder') && !bz.orders.some(o => o.big && !o.done && o.until >= sv.day) && rnd() < 0.3) {
    const pool = Object.keys(DISHES).filter(k => !DISHES[k].fest).concat(Object.keys(labBook())).filter(k => FOOD[k] && chefLv() >= ((DISHES[k] || {}).lv || 1)), k = pool[Math.floor(rnd() * pool.length)], qty = 10 + Math.floor(rnd() * 3) * 5;
    const who = ['🔥 社區食堂', '🔥 軍方補給站', '🔥 避難所', '🔥 婚禮外燴'][Math.floor(rnd() * 4)];
    bz.orders.push({ id: 'big' + sv.day, who, k, qty, need: 0, until: sv.day + 3, coin: Math.round(valOf(k) * qty * 3), rep: 15, big: true });
    ex.push(who + '下了大訂單：' + ITEMS[k].n + ' ×' + qty + '，3 天內交！');
  }
  // 每週挑戰
  if (grOn('weekly')) { if (!gr.wk || Math.floor((sv.day - 1) / 7) !== gr.wk.wk) { gr.wk && ex.push('🎯 新的一週，挑戰換新了。'); wkNew(); } ex.push(...wkCheck()); }
  if (grOn('night') && isNM()) ex.push('🏮 今天是夜市日！16:00 以後可以去擺攤。');
  if (grOn('contest') && ctOpen()) ex.push('🏆 品評會開始報名了（3 天內）！');
  ex.push(...growCheck());
  return ex;
}
