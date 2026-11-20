/* ================= 農場與工坊（全部可視化） =================
   在頂樓打開「🌾 農場」，五個分頁，每個都有自己的畫面：
   田地：農藝等級、澆水、蟲害、加溫燈、自動灑水、留種、新作物、頂樓菜圃
   藥草：草藥圃、5 種草藥、6 種藥方（藥師等級）
   牧場：雞、兔子（會繁殖）、蜂箱（蜂蜜、蜂蠟蠟燭）、蚯蚓箱
   加工：曬架、煙燻爐、醃漬缸，放進去等幾天就好（加工等級），醬料讓料理多一份
   循環：堆肥桶（快壞的食物自動變肥料）、雨水過濾塔（下雨存乾淨的水） */

/* ===== 物品 ===== */
const NEW_ITEMS = {
  pumpkin: ['南瓜種子', 'farm', 0.05], taro: ['芋頭種苗', 'farm', 0.1], peanut: ['花生種子', 'farm', 0.05], cane: ['甘蔗苗', 'farm', 0.2], tea: ['茶苗', 'farm', 0.1],
  pumpkin_p: ['南瓜', 'food', 1], taro_p: ['芋頭', 'food', 0.4], peanut_p: ['花生', 'food', 0.1], cane_p: ['甘蔗', 'food', 0.5], tea_p: ['茶葉', 'mat', 0.05],
  mint: ['薄荷苗', 'farm', 0.05], aloe: ['蘆薈苗', 'farm', 0.1], mugwort: ['艾草苗', 'farm', 0.05], honeys: ['金銀花苗', 'farm', 0.05], ginger: ['薑種', 'farm', 0.1],
  mint_l: ['薄荷葉', 'mat', 0.02], aloe_l: ['蘆薈葉', 'mat', 0.1], mugwort_l: ['艾草', 'mat', 0.02], honeys_l: ['金銀花', 'mat', 0.02], ginger_l: ['薑', 'mat', 0.05],
  mint_tea: ['薄荷茶', 'med', 0.2], aloe_gel: ['蘆薈膏', 'med', 0.1], repel: ['驅蟲香', 'mat', 0.05], ginger_tea: ['薑湯', 'med', 0.2], fever: ['退燒草藥', 'med', 0.05], herb_kit: ['草藥急救包', 'med', 0.3],
  rabbit: ['兔子', 'farm', 1.5], bees: ['蜂群', 'farm', 0.5], rabbit_m: ['兔肉', 'food', 0.5], honey: ['蜂蜜', 'food', 0.3], wax: ['蜂蠟', 'mat', 0.1], candle: ['蠟燭', 'mat', 0.1],
  yam_dry: ['地瓜乾', 'food', 0.1], fruit_dry: ['果乾', 'food', 0.1], veg_dry: ['菜乾', 'food', 0.1], smoked_fish: ['燻魚', 'food', 0.3], smoked_egg: ['燻蛋', 'food', 0.06], smoked_meat: ['燻兔肉', 'food', 0.4],
  sugar: ['黑糖', 'mat', 0.2], chili_sauce: ['辣椒醬', 'mat', 0.2], scallion_oil: ['蔥油醬', 'mat', 0.2], peanut_paste: ['花生醬', 'mat', 0.2],
  pumpkin_soup: ['南瓜濃湯', 'food', 0.4], taro_cake: ['芋頭糕', 'food', 0.3], peanut_soup: ['花生湯', 'food', 0.3], black_tea: ['古早味紅茶', 'food', 0.2], rabbit_stew: ['燉兔肉', 'food', 0.5]
};
for (const [k, [n, cat, w]] of Object.entries(NEW_ITEMS)) ITEMS[k] = { n, cat, w, note: '' };
Object.assign(SEED_OUT, { pumpkin: 'pumpkin_p', taro: 'taro_p', peanut: 'peanut_p', cane: 'cane_p', tea: 'tea_p' });
Object.assign(CROP_F, { pumpkin_p: 1.3, taro_p: 1.1, peanut_p: 1, cane_p: 1.2, tea_p: 0.9 });
Object.assign(FOOD, {
  pumpkin_p: { sat: 40 }, taro_p: { sat: 35 }, peanut_p: { sat: 20, mor: 2 }, cane_p: { sat: 10, mor: 6 },
  rabbit_m: { sat: 30 }, honey: { sat: 15, mor: 10 }, yam_dry: { sat: 25, mor: 3 }, fruit_dry: { sat: 15, mor: 8 }, veg_dry: { sat: 20 }, smoked_fish: { sat: 35, mor: 5 }, smoked_egg: { sat: 18, mor: 4 }, smoked_meat: { sat: 40, mor: 6 },
  pumpkin_soup: { sat: 45, mor: 10, dish: true, warm: true }, taro_cake: { sat: 50, mor: 9, dish: true }, peanut_soup: { sat: 35, mor: 12, dish: true, warm: true }, black_tea: { sat: 5, mor: 14, dish: true }, rabbit_stew: { sat: 70, mor: 14, dish: true, warm: true }
});
Object.assign(FRESH_LIFE, { pumpkin_p: 10, taro_p: 8, peanut_p: 12, cane_p: 6, rabbit_m: 2, pumpkin_soup: 2, taro_cake: 2, peanut_soup: 2, black_tea: 1, rabbit_stew: 1 });
Object.assign(DISHES, {
  pumpkin_soup: { lv: 2, need: { pumpkin_p: 1, wu: 1 }, q: 3, power: 0.3 },
  taro_cake:    { lv: 3, need: { taro_p: 1, rice: 1 }, q: 4, power: 0.4 },
  peanut_soup:  { lv: 2, need: { peanut_p: 2, sugar: 1, wu: 1 }, q: 3, power: 0.3 },
  black_tea:    { lv: 1, need: { tea_p: 1, sugar: 1, wu: 1 }, q: 3, power: 0.2 },
  rabbit_stew:  { lv: 3, need: { rabbit_m: 1, taro_p: 1, ginger_l: 1 }, q: 2, power: 0.5 }
});
for (const k of ['pumpkin_soup', 'taro_cake', 'peanut_soup', 'black_tea', 'rabbit_stew']) { const D = DISHES[k]; COOKS[k] = { n: ITEMS[k].n, d: Object.entries(D.need).map(([m, n]) => (m === 'wu' ? '水' : ITEMS[m].n) + '×' + n).join('、') + ' → ' + D.q + ' 份', power: D.power }; }
Object.assign(ITEM_EMO, { pumpkin: '🌱', taro: '🌱', peanut: '🌱', cane: '🌱', tea: '🌱', pumpkin_p: '🎃', taro_p: '🟣', peanut_p: '🥜', cane_p: '🎋', tea_p: '🍃', mint: '🌿', aloe: '🌵', mugwort: '🌿', honeys: '🌼', ginger: '🫚', mint_l: '🌿', aloe_l: '🌵', mugwort_l: '🌿', honeys_l: '🌼', ginger_l: '🫚', mint_tea: '🍵', aloe_gel: '🧴', repel: '🕯️', ginger_tea: '🫖', fever: '💊', herb_kit: '🩹', rabbit: '🐇', bees: '🐝', rabbit_m: '🥩', honey: '🍯', wax: '🟨', candle: '🕯️', yam_dry: '🍠', fruit_dry: '🍓', veg_dry: '🥬', smoked_fish: '🐟', smoked_egg: '🥚', smoked_meat: '🍖', sugar: '🟫', chili_sauce: '🌶️', scallion_oil: '🧅', peanut_paste: '🥜', pumpkin_soup: '🎃', taro_cake: '🍰', peanut_soup: '🥣', black_tea: '🧋', rabbit_stew: '🍲' });
Object.assign(STORES.farm.items, { pumpkin: [12, 5], taro: [10, 5], peanut: [8, 6], cane: [10, 4], tea: [15, 4], mint: [8, 4], aloe: [10, 4], mugwort: [8, 4], honeys: [12, 3], ginger: [8, 5], rabbit: [60, 4], bees: [90, 2] });
if (LOCS.school) for (const c of LOCS.school.cont) if (Array.isArray(c.loot)) { c.loot.push(['mint', 1, 1, 6], ['aloe', 1, 1, 6]); break; }
if (LOCS.hospital) for (const c of LOCS.hospital.cont) if (Array.isArray(c.loot)) { c.loot.push(['honeys', 1, 1, 6], ['ginger', 1, 2, 8]); break; }
if (LOCS.smarket) for (const c of LOCS.smarket.cont) if (Array.isArray(c.loot)) { c.loot.push(['peanut', 1, 2, 6], ['tea', 1, 1, 4]); break; }

/* ===== 狀態 ===== */
const LV_T = { farm: [0, 6, 15, 30, 50], herb: [0, 4, 10, 18, 30], proc: [0, 4, 10, 18, 30], ranch: [0, 5, 12, 22, 36] };
const LV_N = { farm: ['', '新手農夫', '菜園主人', '老農', '農藝師', '末日農神'], herb: ['', '採藥人', '草藥學徒', '藥師', '老藥師', '神農'], proc: ['', '幫手', '巧手', '老師傅', '職人', '匠人'], ranch: ['', '飼主', '牧童', '牧場主', '畜牧達人', '萬獸之王'] };
function F() {
  const w = W();
  if (!w.fm) w.fm = { xp: { farm: 0, herb: 0, proc: 0, ranch: 0 }, beds: 0, lamp: false, sprinkle: false, wateredDay: 0, herbBeds: 0, herbs: [], hutch: false, rabbits: 0, rabbitAcc: 0, hive: false, hives: 0, honeyAcc: 0, worm: false, dryer: false, smoker: false, jars: false, batches: [], bin: false, compost: 0, tower: false, tank: 0 };
  return w.fm;
}
function lvOfK(k) { const xp = F().xp[k]; let lv = 1; LV_T[k].forEach((t, i) => { if (i && xp >= t) lv = i + 1; }); return lv; }
function gainXp(k, n) {
  const fm = F(), l0 = lvOfK(k); fm.xp[k] += n; const l1 = lvOfK(k);
  if (l1 > l0) { slog({ farm: '🌾 農藝', herb: '🌿 藥師', proc: '🫙 加工', ranch: '🐇 牧場' }[k] + '升到 Lv.' + l1 + '「' + LV_N[k][l1] + '」！', true); sfx('ach'); }
}
const roofOk = () => W().roof.built;
// 農藝讓作物長得快
const _growLvF = growDaysOf;
growDaysOf = function (k) { const base = _growLvF(k); if (!S || !S.sv || !S.sv.w || !S.sv.w.fm) return base; return Math.max(2, Math.round(base * (1 - 0.06 * (lvOfK('farm') - 1)))); };
// 頂樓菜圃：每座 +4 個種植位
const _slotsFarm = slots;
slots = function () { const s = _slotsFarm(); if (S.sv && S.sv.w && S.sv.w.fm) s.green += S.sv.w.fm.beds * 4; return s; };

/* ===== 建造 ===== */
const FARM_BUILD = {
  beds:     { tab: 'field', n: '頂樓菜圃', need: { board: 4, plastic: 1 }, max: 3, d: '每座 +4 個種植位' },
  lamp:     { tab: 'field', n: '加溫燈', need: { metal: 2, glass: 1 }, d: '寒流時作物照樣長（每天 0.5 度電）' },
  sprinkle: { tab: 'field', n: '自動灑水', need: { plastic: 3, metal: 1, barrel: 1 }, d: '不用每天澆水（每天 0.2 度電）' },
  herbBeds: { tab: 'herb', n: '草藥圃', need: { board: 3 }, max: 2, d: '每座種 3 株草藥' },
  hutch:    { tab: 'ranch', n: '兔籠', need: { board: 4, metal: 1 }, d: '養兔子，兩隻以上會生小兔子' },
  hive:     { tab: 'ranch', n: '蜂箱', need: { board: 3 }, d: '放進蜂群，有花有菜就產蜂蜜和蜂蠟' },
  worm:     { tab: 'ranch', n: '蚯蚓箱', need: { plastic: 2, board: 1 }, d: '堆肥速度加倍' },
  dryer:    { tab: 'proc', n: '曬架', need: { board: 3 }, d: '曬地瓜乾、果乾、菜乾、黑糖（下雨天不會乾）' },
  smoker:   { tab: 'proc', n: '煙燻爐', need: { metal: 3, board: 1 }, d: '燻魚、燻蛋、燻兔肉（每批燒 1 塊木板）' },
  jars:     { tab: 'proc', n: '醃漬缸', need: { glass: 2 }, d: '辣椒醬、蔥油醬、花生醬' },
  bin:      { tab: 'cycle', n: '堆肥桶', need: { board: 2 }, d: '快壞的食物自動丟進來，滿了變肥料' },
  tower:    { tab: 'cycle', n: '雨水過濾塔', need: { barrel: 1, plastic: 2, glass: 1 }, d: '下雨天存乾淨的水（最多 20 份）' }
};
function payN(need) { const st = S.sv.st; if (!Object.entries(need).every(([m, n]) => (st[m] || 0) >= n)) return false; for (const [m, n] of Object.entries(need)) { st[m] -= n; if (!st[m]) delete st[m]; } return true; }
Object.assign(SACT, {
  fmBuild(k) {
    const fm = F(), B = FARM_BUILD[k]; if (!B || !roofOk()) return;
    if (B.max ? fm[k] >= B.max : fm[k]) return;
    if (!canAct(2, 10)) { slog('時間或體力不夠。'); render(); return; }
    if (!payN(B.need)) { slog('材料不夠：' + B.n + '。'); render(); return; }
    if (B.max) fm[k]++; else fm[k] = true;
    slog('在頂樓做好了' + B.n + '。'); sfx('fix'); S.sv.sta -= 10; passHours(2); render();
  },
  fmTab(v) { UI.fmTab = v; render(); },
  fmOpen() { UI.wm = 'farm'; UI.fmTab = UI.fmTab || 'field'; UI.rtSel = null; render(); }
});

/* ===== 田地：澆水、蟲害 ===== */
const greenPlants = () => S.sv.plants.filter(p => p.slot === 'green');
const needWater = () => greenPlants().length > 0 && !F().sprinkle && F().wateredDay !== S.sv.day;
Object.assign(SACT, {
  fmWater() {
    const sv = S.sv, fm = F(); if (!needWater()) return;
    const n = Math.max(1, Math.ceil(greenPlants().length / 4));
    const fromTank = Math.min(fm.tank, n); fm.tank -= fromTank;
    const rest = n - fromTank; if (rest > 0) { if ((sv.st.wu || 0) < rest && sv.day > 5) { fm.tank += fromTank; slog('水不夠，澆不了（要 ' + n + ' 份）。'); render(); return; } if (sv.day > 5) sv.st.wu -= rest; }
    fm.wateredDay = sv.day; sv.sta = Math.max(0, sv.sta - 2); gainXp('farm', 0.5);
    slog('澆了水（用掉 ' + n + ' 份' + (fromTank ? '，其中 ' + fromTank + ' 份來自過濾塔' : '') + '）。作物今天會好好長。'); render();
  },
  fmPest(i) {
    const sv = S.sv, p = sv.plants[Number(i)]; if (!p || !p.pest) return;
    if (sv.st.repel > 0) { sv.st.repel--; if (!sv.st.repel) delete sv.st.repel; p.pest = 0; slog('點了驅蟲香，蟲子都跑了。'); render(); return; }
    if (!canAct(1, 5)) return; p.pest = 0; sv.sta -= 5; slog('你蹲在菜圃裡一隻一隻抓蟲。'); passHours(1); render();
  }
});

/* ===== 藥草 ===== */
const HERBS = { mint: { out: 'mint_l', d: 4 }, aloe: { out: 'aloe_l', d: 6 }, mugwort: { out: 'mugwort_l', d: 5 }, honeys: { out: 'honeys_l', d: 7 }, ginger: { out: 'ginger_l', d: 6 } };
const REMEDY = {
  mint_tea:   { lv: 1, need: { mint_l: 2 }, wu: 1, d: '心態 +8、精力 +10' },
  repel:      { lv: 1, need: { mugwort_l: 2 }, d: '除掉菜圃的蟲' },
  aloe_gel:   { lv: 2, need: { aloe_l: 2 }, d: '生命 +15，治好感染' },
  ginger_tea: { lv: 2, need: { ginger_l: 1 }, wu: 1, d: '生命 +5、心態 +6，治好生病（熱的）' },
  fever:      { lv: 3, need: { honeys_l: 2, ginger_l: 1 }, d: '治好生病，生命 +10' },
  herb_kit:   { lv: 4, need: { aloe_l: 2, mugwort_l: 1, honeys_l: 1, plastic: 1 }, d: '做出一個急救包' }
};
Object.assign(SACT, {
  hbPlant(k) {
    const sv = S.sv, fm = F(); if (!HERBS[k] || !(sv.st[k] > 0) || fm.herbs.length >= fm.herbBeds * 3) return;
    sv.st[k]--; if (!sv.st[k]) delete sv.st[k]; fm.herbs.push({ k, age: 0, acc: 0 }); gainXp('herb', 1);
    slog('在草藥圃種下' + ITEMS[k].n + '，大約 ' + HERBS[k].d + ' 天後可以採。'); render();
  },
  hbMake(k) {
    const sv = S.sv, R = REMEDY[k]; if (!R || lvOfK('herb') < R.lv) return;
    if (R.wu && (sv.st.wu || 0) < R.wu && sv.day > 5) { slog('要 ' + R.wu + ' 份水。'); render(); return; }
    if (!payN(R.need)) { slog('材料不夠。'); render(); return; }
    if (R.wu && sv.day > 5) sv.st.wu -= R.wu;
    if (k === 'herb_kit') sv.st.medkit = (sv.st.medkit || 0) + 1; else sv.st[k] = (sv.st[k] || 0) + (lvOfK('herb') >= 3 && k !== 'repel' ? 2 : 1);
    gainXp('herb', R.lv); slog('調製好' + ITEMS[k === 'herb_kit' ? 'medkit' : k].n + '。'); sfx('pop'); render();
  },
  hbUse(k) {
    const sv = S.sv; if (!(sv.st[k] > 0)) return; const p = 1 + 0.1 * (lvOfK('herb') - 1);
    sv.st[k]--; if (!sv.st[k]) delete sv.st[k];
    if (k === 'mint_tea') { sv.mor = clamp(sv.mor + 8 * p); sv.sta = clamp(sv.sta + 10 * p); }
    if (k === 'aloe_gel') { sv.hp = clamp(sv.hp + 15 * p); if (sv.inj) sv.inj.inf = 0; }
    if (k === 'ginger_tea') { sv.hp = clamp(sv.hp + 5 * p); sv.mor = clamp(sv.mor + 6 * p); if (sv.sick) sv.sick = 0; }
    if (k === 'fever') { sv.hp = clamp(sv.hp + 10 * p); if (sv.sick) sv.sick = 0; }
    slog('用了' + ITEMS[k].n + '。' + REMEDY[k].d.replace(/，?做出.*/, '') + '。'); render();
  }
});

/* ===== 牧場 ===== */
Object.assign(SACT, {
  rcAdd(k) {
    const sv = S.sv, fm = F();
    if (k === 'rabbit' && fm.hutch && sv.st.rabbit > 0 && fm.rabbits < 8) { const n = Math.min(sv.st.rabbit, 8 - fm.rabbits); sv.st.rabbit -= n; if (!sv.st.rabbit) delete sv.st.rabbit; fm.rabbits += n; gainXp('ranch', n); slog('放了 ' + n + ' 隻兔子進兔籠。'); }
    if (k === 'bees' && fm.hive && sv.st.bees > 0 && fm.hives < 2) { sv.st.bees--; if (!sv.st.bees) delete sv.st.bees; fm.hives++; gainXp('ranch', 2); slog('把蜂群放進蜂箱，嗡嗡嗡。'); }
    render();
  },
  rcMeat() { const fm = F(); if (fm.rabbits < 3) return; fm.rabbits--; sv_addFresh('rabbit_m', 2); S.sv.mor = clamp(S.sv.mor - 4); slog('你處理了一隻兔子。有點難過（心態 -4），但有肉了。'); render(); },
  rcPet() { const sv = S.sv, fm = F(); if (!fm.rabbits || fm.petDay === sv.day) return; fm.petDay = sv.day; sv.mor = clamp(sv.mor + 5); slog('抱了抱兔子，軟綿綿的。心態 +5。'); render(); },
  rcCandle() { const sv = S.sv; if (!(sv.st.wax > 0)) return; sv.st.wax--; if (!sv.st.wax) delete sv.st.wax; sv.st.candle = (sv.st.candle || 0) + 2; gainXp('ranch', 1); slog('用蜂蠟做了 2 根蠟燭。沒電時也能點燈。'); render(); }
});
// 沒電時用蠟燭開燈
const _lightSwF = SACT.lightSw;
SACT.lightSw = function () { const sv = S.sv; if (!sv.light && sv.power < 0.2 && sv.st.candle > 0) { sv.st.candle--; if (!sv.st.candle) delete sv.st.candle; sv.candleNight = sv.day; sv.mor = clamp(sv.mor + 2); slog('沒電了，你點起一根蠟燭。燭光暖暖的。'); render(); return; } _lightSwF(); };

/* ===== 加工 ===== */
const PROC = {
  yam_dry:      { at: 'dryer', need: { yam_p: 2 }, q: 3, days: 1 },
  fruit_dry:    { at: 'dryer', need: { straw_p: 3 }, alt: { tomato_p: 3 }, q: 3, days: 1 },
  veg_dry:      { at: 'dryer', need: { cabbage_p: 1 }, alt: { veg: 2 }, q: 3, days: 1 },
  sugar:        { at: 'dryer', need: { cane_p: 2 }, q: 2, days: 2 },
  smoked_fish:  { at: 'smoker', need: { fish: 1, board: 1 }, q: 2, days: 1 },
  smoked_egg:   { at: 'smoker', need: { egg: 3, board: 1 }, q: 3, days: 1 },
  smoked_meat:  { at: 'smoker', need: { rabbit_m: 1, board: 1 }, q: 2, days: 1 },
  chili_sauce:  { at: 'jars', need: { chili_p: 3 }, q: 3, days: 2 },
  scallion_oil: { at: 'jars', need: { scallion_p: 3 }, q: 3, days: 2 },
  peanut_paste: { at: 'jars', need: { peanut_p: 3 }, q: 3, days: 2 }
};
const PROC_SLOTS = { dryer: 3, smoker: 2, jars: 3 };
const SAUCES = ['chili_sauce', 'scallion_oil', 'peanut_paste'];
function procNeed(k) { const P = PROC[k]; if (Object.entries(P.need).every(([m, n]) => sv_has(m) >= n)) return P.need; if (P.alt && Object.entries(P.alt).every(([m, n]) => sv_has(m) >= n)) return P.alt; return null; }
Object.assign(SACT, {
  pcStart(k) {
    const sv = S.sv, fm = F(), P = PROC[k]; if (!P || !fm[P.at]) return;
    if (fm.batches.filter(b => b.at === P.at).length >= PROC_SLOTS[P.at]) { slog('這台已經放滿了。'); render(); return; }
    const need = procNeed(k); if (!need) { slog('材料不夠。'); render(); return; }
    for (const [m, n] of Object.entries(need)) sv_take(m, n);
    const days = Math.max(1, P.days - (lvOfK('proc') >= 4 ? 1 : 0));
    fm.batches.push({ k, at: P.at, ready: sv.day + days, q: P.q + (lvOfK('proc') >= 3 ? 1 : 0) });
    slog('把材料放進' + FARM_BUILD[P.at].n + '，' + days + ' 天後就好。'); sfx('pop'); render();
  }
});
// 煮料理時有醬料就加一匙：多做一份
const _cookSauce = SACT.cookx;
SACT.cookx = function (k) {
  const sv = S.sv, D = typeof DISHES === 'object' && DISHES[k]; const before = D ? sv_has(k) : 0;
  _cookSauce(k);
  if (D && S.sv && sv_has(k) > before) { const s = SAUCES.find(x => sv.st[x] > 0); if (s) { sv.st[s]--; if (!sv.st[s]) delete sv.st[s]; sv_addFresh(k, 1); slog('加了一匙' + ITEMS[s].n + '，香味讓你多做了一份。'); } }
};

/* ===== 每天早上 ===== */
const _nightFarm = night;
night = function (watch) {
  const sv0 = S && S.sv; if (!sv0 || !sv0.w) return _nightFarm(watch);
  const fm = F(), d0 = sv0.day, cold = inCold(d0);
  // 堆肥：快壞的食物先丟進堆肥桶
  if (fm.bin) { let n = 0; sv0.fresh = sv0.fresh.filter(f => { if (f.life <= 1.01 && !(sv0.powered && sv0.powered.freezer)) { n += f.q; return false; } return true; }); if (n) { fm.compost += n * 0.5 * (fm.worm ? 2 : 1); slog('快壞的食物 ' + n + ' 份丟進堆肥桶。'); } }
  // 沒澆水、太冷、有蟲：不長；有蟲的不收成
  const pests = [];
  for (const p of sv0.plants) {
    const green = p.slot === 'green';
    const dry = green && !fm.sprinkle && fm.wateredDay !== d0;
    const chilly = green && cold && !(fm.lamp && sv0.power >= 0.5);
    if (dry || chilly || p.pest) p.age--;
    if (p.pest) pests.push(p);
  }
  const keepPests = pests.slice(); sv0.plants = sv0.plants.filter(p => !p.pest);
  const crops = Object.values(SEED_OUT), inv0 = {}; for (const k of crops) inv0[k] = sv_has(k);
  _nightFarm(watch);
  if (S.sv) S.sv.plants.push(...keepPests);
  if (!S.sv || S.phase !== 'survive' || S.sv.day === d0) return;
  const sv = S.sv, ex = [];
  // 收成：經驗、豐收、留種
  let hv = 0; const seedBack = [];
  for (const k of crops) { const g = sv_has(k) - inv0[k]; if (g > 0) { hv += g; const lv = lvOfK('farm');
    if (rnd() < 0.1 * lv) { sv_addFresh(k, 1); ex.push('🌟 ' + ITEMS[k].n + '長得特別好（極品），多收 1 個。'); }
    const seed = Object.keys(SEED_OUT).find(s => SEED_OUT[s] === k); if (seed && rnd() < 0.2 + 0.05 * lv) { sv.st[seed] = (sv.st[seed] || 0) + 1; seedBack.push(ITEMS[seed].n); } } }
  if (hv) gainXp('farm', hv);
  if (seedBack.length) ex.push('留下了種子：' + seedBack.join('、') + '。');
  // 設備耗電
  if (fm.lamp && cold) { if (sv.power >= 0.5) sv.power -= 0.5; else ex.push('沒電，加溫燈沒開。'); }
  if (fm.sprinkle) { if (sv.power >= 0.2) sv.power -= 0.2; else { fm.wateredDay = -1; ex.push('沒電，自動灑水停了。'); } }
  // 蟲害
  for (const p of sv.plants) if (p.pest) { p.pest++; if (p.pest > 3) { p.dead = true; ex.push('🐛 一株' + ITEMS[p.k].n + '被蟲吃光了。'); } }
  sv.plants = sv.plants.filter(p => !p.dead);
  const gp = sv.plants.filter(p => p.slot === 'green'); if (roofOk() && gp.length >= 4 && rnd() < 0.15) { const p = gp[Math.floor(rnd() * gp.length)]; if (!p.pest) { p.pest = 1; ex.push('🐛 菜圃裡的' + ITEMS[p.k].n + '長蟲了！（抓蟲或點驅蟲香）'); } }
  // 草藥
  for (const h of fm.herbs) { h.age++; if (h.age >= HERBS[h.k].d) { h.acc += 0.5 * (1 + 0.1 * (lvOfK('herb') - 1)); if (h.acc >= 1) { h.acc -= 1; sv.st[HERBS[h.k].out] = (sv.st[HERBS[h.k].out] || 0) + 1; gainXp('herb', 0.5); } } }
  // 牧場
  const greens = ['veg', 'cabbage_p', 'veg_dry', 'yam_p', 'sprout_p', 'peanut_p'];
  if (fm.rabbits) {
    const need = Math.ceil(fm.rabbits / 2); let fed = 0; for (const g of greens) while (fed < need && sv_has(g) > 0) { sv_take(g, 1); fed++; }
    fm.rabbitFed = fed >= need;
    if (fm.rabbitFed) { fm.compost += fm.rabbits * 0.3; gainXp('ranch', 0.5); if (fm.rabbits >= 2 && fm.rabbits < 8) { fm.rabbitAcc += 0.2 * (1 + 0.1 * lvOfK('ranch')); if (fm.rabbitAcc >= 1) { fm.rabbitAcc -= 1; fm.rabbits++; ex.push('🐇 兔籠裡多了一隻小兔子！'); } } }
    else ex.push('兔子沒吃飽（要菜葉、地瓜、花生），今天不長大。');
  }
  if (fm.hives) { const flowers = sv.plants.length + fm.herbs.length; if (flowers >= 3) { fm.honeyAcc += fm.hives * 0.34 * (1 + 0.1 * (lvOfK('ranch') - 1)); if (fm.honeyAcc >= 1) { const n = Math.floor(fm.honeyAcc); fm.honeyAcc -= n; sv.st.honey = (sv.st.honey || 0) + n; sv.st.wax = (sv.st.wax || 0) + 1; gainXp('ranch', 1); ex.push('🍯 蜂箱收了 ' + n + ' 罐蜂蜜和 1 塊蜂蠟。'); } } else ex.push('蜜蜂找不到花（菜圃和草藥圃加起來要 3 株以上）。'); }
  // 加工完成
  const done = fm.batches.filter(b => sv.day >= b.ready && !(b.at === 'dryer' && inRain(sv.day - 1)));
  for (const b of done) { sv.st[b.k] = (sv.st[b.k] || 0) + b.q; gainXp('proc', 1); ex.push('🫙 ' + FARM_BUILD[b.at].n + '：' + ITEMS[b.k].n + ' ×' + b.q + ' 好了。'); }
  fm.batches = fm.batches.filter(b => !done.includes(b));
  if (fm.batches.some(b => b.at === 'dryer') && inRain(sv.day - 1)) { fm.batches.forEach(b => { if (b.at === 'dryer') b.ready++; }); ex.push('下雨，曬架上的東西沒乾。'); }
  // 堆肥
  if (fm.bin && fm.compost >= 5) { const n = Math.floor(fm.compost / 5); fm.compost -= n * 5; sv.st.fert = (sv.st.fert || 0) + n; ex.push('♻️ 堆肥熟了，得到 ' + n + ' 包肥料（作物長得更快）。'); }
  // 過濾塔
  if (fm.tower && inRain(d0)) { const add = Math.min(6, 20 - fm.tank); if (add > 0) { fm.tank += add; ex.push('💧 過濾塔存了 ' + add + ' 份乾淨的水。'); } }
  if (UI.morning && UI.morning.day === sv.day) UI.morning.extra = (UI.morning.extra || []).concat(ex); else ex.forEach(t => slog(t));
};
Object.assign(SACT, { fmTank() { const fm = F(), sv = S.sv; if (!fm.tank) return; sv.st.wu = (sv.st.wu || 0) + fm.tank; slog('從過濾塔取了 ' + fm.tank + ' 份水。'); fm.tank = 0; render(); } });

/* ===== 畫面 ===== */
const CROP_COL = { tomato_p: '#d6322a', straw_p: '#e0446a', rape_p: '#e6c84f', yam_p: '#8a4fa0', cabbage_p: '#7cc191', scallion_p: '#4e9d4e', chili_p: '#d6322a', corn_p: '#e6c84f', basil_p: '#3f8a3f', sprout_p: '#e8e0b8', pumpkin_p: '#e08a3a', taro_p: '#9a7ab8', peanut_p: '#c9a36a', cane_p: '#9fbf6a', tea_p: '#3f7a4a' };
function plantSVG(x, y, p, now) {
  const g = Math.min(1, p.age / Math.max(1, growDaysOf(p.k))), ripe = g >= 1, sc = 0.45 + g * 0.75, col = CROP_COL[p.k] || '#d6322a';
  let s = '<g transform="translate(' + x + ' ' + y + ')">';
  s += '<ellipse rx="13" ry="5" cy="4" fill="#5a3e2a"/>';
  const sway = Math.sin(now / 900 + x) * 2;
  for (let i = -1; i <= 1; i++) s += '<path d="M0 3 q' + (i * 6 + sway) + ' ' + (-10 * sc) + ' ' + (i * 9 + sway) + ' ' + (-18 * sc) + '" stroke="#3f8a3f" stroke-width="' + (2.4 * sc + 0.6) + '" fill="none" stroke-linecap="round"/><ellipse cx="' + (i * 9 + sway) + '" cy="' + (-18 * sc) + '" rx="' + (4 * sc + 1) + '" ry="' + (2.6 * sc + 0.6) + '" fill="#4e9d4e"/>';
  if (ripe) for (let i = 0; i < 3; i++) s += '<circle cx="' + (-7 + i * 7) + '" cy="' + (-9 - (i % 2) * 6) + '" r="3.6" fill="' + col + '" stroke="#1d2733" stroke-width="0.6"/>';
  if (p.pest) s += '<text x="10" y="-14" font-size="11">🐛</text>';
  if (ripe) s += '<text x="-4" y="-26" font-size="9" fill="#ecd27a">✦</text>';
  return s + '</g>';
}
function fieldSVG(now) {
  const sv = S.sv, fm = F(), ps = sv.plants, cols = 6, rows = Math.max(2, Math.ceil(ps.length / cols)), H = 34 + rows * 44;
  let s = '<svg viewBox="0 0 330 ' + H + '" class="fm-svg"><rect width="330" height="' + H + '" fill="' + (inCold(sv.day) ? '#cfd8df' : '#8fb26a') + '"/>';
  for (let r = 0; r < rows; r++) s += '<rect x="10" y="' + (26 + r * 44) + '" width="310" height="38" rx="6" fill="#7a5a3a"/>';
  ps.forEach((p, i) => { s += plantSVG(36 + (i % cols) * 50, 52 + Math.floor(i / cols) * 44, p, now); });
  if (needWater()) s += '<text x="165" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4a7a">💧 今天還沒澆水</text>';
  else s += '<text x="165" y="18" text-anchor="middle" font-size="12" fill="#1d2733">' + (fm.sprinkle ? '🚿 自動灑水中' : '✓ 今天澆過水了') + (fm.lamp && inCold(sv.day) ? ' · 🔆 加溫燈' : '') + '</text>';
  if (fm.sprinkle) for (let i = 0; i < 8; i++) { const k = ((now / 600) + i / 8) % 1; s += '<circle cx="' + (20 + i * 40) + '" cy="' + (26 + k * (H - 30)) + '" r="1.6" fill="#7fb6dc" opacity="' + (1 - k) + '"/>'; }
  if (!ps.length) s += '<text x="165" y="70" text-anchor="middle" font-size="13" fill="#1d2733">還沒種東西</text>';
  return s + '</svg>';
}
function herbSVG(now) {
  const fm = F(), n = fm.herbBeds * 3; let s = '<svg viewBox="0 0 330 110" class="fm-svg"><rect width="330" height="110" fill="#b9c98a"/>';
  for (let b = 0; b < Math.max(1, fm.herbBeds); b++) s += '<rect x="' + (14 + b * 160) + '" y="30" width="146" height="60" rx="8" fill="' + (b < fm.herbBeds ? '#6a4a2e' : '#a9a196') + '" stroke="#3a2a1a" stroke-dasharray="' + (b < fm.herbBeds ? '' : '4 3') + '"/>';
  const HC = { mint: '#5fbf8a', aloe: '#7fae6a', mugwort: '#8a9f6a', honeys: '#f0d060', ginger: '#c9a36a' };
  fm.herbs.forEach((h, i) => { const x = 40 + (i % 3) * 46 + Math.floor(i / 3) * 160, y = 70, g = Math.min(1, h.age / HERBS[h.k].d), sw = Math.sin(now / 800 + i) * 2;
    s += '<g transform="translate(' + x + ' ' + y + ')">'; for (let j = 0; j < 5; j++) s += '<ellipse cx="' + ((j - 2) * 5 * (0.5 + g) + sw) + '" cy="' + (-8 - (j % 2) * 6) * (0.5 + g) + '" rx="' + (3 + g * 3) + '" ry="' + (6 + g * 4) + '" fill="' + HC[h.k] + '" transform="rotate(' + ((j - 2) * 20) + ')"/>';
    if (h.k === 'honeys' && g >= 1) s += '<circle cy="-20" r="3" fill="#fff6c0"/><circle cx="7" cy="-15" r="3" fill="#fff6c0"/>';
    s += '<text y="14" text-anchor="middle" font-size="9" fill="#2b2b2b">' + ITEMS[h.k].n.replace(/苗|種/, '') + '</text></g>'; });
  if (!fm.herbBeds) s += '<text x="165" y="20" text-anchor="middle" font-size="12" fill="#2b2b2b">先蓋草藥圃</text>';
  return s + '</svg>';
}
function ranchSVG(now) {
  const fm = F(), R = W().roof; let s = '<svg viewBox="0 0 330 140" class="fm-svg"><rect width="330" height="140" fill="#a9b98a"/>';
  // 雞
  s += '<rect x="8" y="20" width="100" height="110" rx="6" fill="' + (R.coop ? '#c9a27a' : '#bbb') + '" opacity="0.5"/><text x="58" y="16" text-anchor="middle" font-size="10">雞舍</text>';
  for (let i = 0; i < (R.hens || 0); i++) { const t = now / 1000 + i * 2, x = 30 + (i % 2) * 40 + Math.sin(t) * 10, y = 60 + Math.floor(i / 2) * 40 + Math.cos(t * 0.7) * 6; s += '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"><ellipse rx="9" ry="7" fill="#fff" stroke="#5a3e2a"/><circle cx="8" cy="-6" r="4" fill="#fff" stroke="#5a3e2a"/><path d="M8 -11 l1 -3 l2 3z" fill="#d6322a"/><path d="M12 -6 l3 1 l-3 1z" fill="#e0a83a"/></g>'; }
  // 兔子
  s += '<rect x="114" y="20" width="110" height="110" rx="6" fill="' + (fm.hutch ? '#d6c6a6' : '#bbb') + '" opacity="0.5"/><text x="169" y="16" text-anchor="middle" font-size="10">兔籠 ' + (fm.hutch ? fm.rabbits + '/8' : '（未建）') + '</text>';
  for (let i = 0; i < fm.rabbits; i++) { const t = now / 700 + i * 1.7, hop = Math.max(0, Math.sin(t * 2)) * 6, x = 130 + (i % 4) * 24 + Math.sin(t * 0.4) * 4, y = 60 + Math.floor(i / 4) * 40 - hop; s += '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"><ellipse rx="8" ry="6" fill="' + (i % 3 ? '#f3f0e6' : '#c9a36a') + '" stroke="#5a3e2a" stroke-width="0.8"/><circle cx="7" cy="-4" r="4" fill="' + (i % 3 ? '#f3f0e6' : '#c9a36a') + '" stroke="#5a3e2a" stroke-width="0.8"/><ellipse cx="6" cy="-12" rx="1.6" ry="5" fill="#f3f0e6" stroke="#5a3e2a" stroke-width="0.6"/><ellipse cx="9" cy="-11" rx="1.6" ry="5" fill="#f3f0e6" stroke="#5a3e2a" stroke-width="0.6"/><circle cx="9" cy="-4" r="0.8" fill="#111"/></g>'; }
  // 蜂箱、蚯蚓
  s += '<text x="276" y="16" text-anchor="middle" font-size="10">蜂箱 ' + (fm.hive ? fm.hives + '/2' : '（未建）') + '</text>';
  for (let h = 0; h < Math.max(1, fm.hives); h++) s += '<rect x="' + (240 + h * 40) + '" y="30" width="32" height="40" rx="3" fill="' + (fm.hives > h ? '#e0b13a' : '#ccc') + '" stroke="#5a3e2a"/><line x1="' + (240 + h * 40) + '" y1="44" x2="' + (272 + h * 40) + '" y2="44" stroke="#5a3e2a"/><line x1="' + (240 + h * 40) + '" y1="57" x2="' + (272 + h * 40) + '" y2="57" stroke="#5a3e2a"/>';
  for (let i = 0; i < fm.hives * 4; i++) { const t = now / 300 + i; s += '<circle cx="' + (256 + Math.sin(t) * 26 + (i % 2) * 30).toFixed(1) + '" cy="' + (50 + Math.cos(t * 1.3) * 18).toFixed(1) + '" r="2" fill="#2b2b2b"/>'; }
  s += '<rect x="240" y="88" width="80" height="40" rx="4" fill="' + (fm.worm ? '#7a5a3a' : '#ccc') + '"/><text x="280" y="84" text-anchor="middle" font-size="10">蚯蚓箱' + (fm.worm ? '' : '（未建）') + '</text>';
  if (fm.worm) for (let i = 0; i < 4; i++) s += '<path d="M' + (252 + i * 16) + ' ' + (110 + Math.sin(now / 400 + i) * 3) + ' q4 -5 8 0 q4 5 8 0" stroke="#d98a8a" stroke-width="2.4" fill="none"/>';
  return s + '</svg>';
}
function procSVG(now) {
  const fm = F(), sv = S.sv; let s = '<svg viewBox="0 0 330 130" class="fm-svg"><rect width="330" height="130" fill="#d6c6a6"/>';
  const slotsAt = at => fm.batches.filter(b => b.at === at);
  const zone = (x, at, n, draw) => { s += '<text x="' + (x + 48) + '" y="16" text-anchor="middle" font-size="10" font-weight="700">' + FARM_BUILD[at].n + (fm[at] ? '' : '（未建）') + '</text>'; if (!fm[at]) { s += '<rect x="' + x + '" y="24" width="96" height="96" rx="6" fill="none" stroke="#8a7a60" stroke-dasharray="4 3"/>'; return; } draw(x); slotsAt(at).forEach((b, i) => { const left = b.ready - sv.day; s += '<text x="' + (x + 8) + '" y="' + (112 - i * 13) + '" font-size="9.5">' + (ITEM_EMO[b.k] || '') + ' ' + ITEMS[b.k].n + ' · ' + (left <= 0 ? '明早好' : '剩 ' + left + ' 天') + '</text>'; }); };
  zone(8, 'dryer', 3, x => { s += '<line x1="' + x + '" y1="30" x2="' + (x + 96) + '" y2="30" stroke="#5a3e2a" stroke-width="3"/><line x1="' + x + '" y1="55" x2="' + (x + 96) + '" y2="55" stroke="#5a3e2a" stroke-width="3"/>'; slotsAt('dryer').forEach((b, i) => { for (let j = 0; j < 3; j++) s += '<rect x="' + (x + 8 + j * 28 + (i % 2) * 6) + '" y="' + (32 + Math.floor(i / 2) * 25) + '" width="14" height="' + (14 + Math.sin(now / 900 + j) * 1.5).toFixed(1) + '" rx="2" fill="' + (CROP_COL[b.k] || '#c97a3a') + '" opacity="0.85"/>'; }); if (inRain(sv.day)) s += '<text x="' + (x + 48) + '" y="80" text-anchor="middle" font-size="10" fill="#1d4a7a">🌧️ 下雨曬不乾</text>'; });
  zone(116, 'smoker', 2, x => { s += '<rect x="' + (x + 20) + '" y="30" width="56" height="60" rx="4" fill="#5d5f68" stroke="#2b2b2b"/><rect x="' + (x + 30) + '" y="70" width="36" height="14" fill="' + (slotsAt('smoker').length ? '#f08a3a' : '#3a3f45') + '"/>'; if (slotsAt('smoker').length) for (let i = 0; i < 3; i++) { const k = ((now / 1500) + i / 3) % 1; s += '<circle cx="' + (x + 48 + Math.sin(k * 6 + i) * 6) + '" cy="' + (28 - k * 20) + '" r="' + (4 + k * 6) + '" fill="#8a8f96" opacity="' + (0.6 * (1 - k)).toFixed(2) + '"/>'; } });
  zone(224, 'jars', 3, x => { for (let j = 0; j < 3; j++) { const b = slotsAt('jars')[j]; s += '<rect x="' + (x + 6 + j * 30) + '" y="40" width="24" height="34" rx="6" fill="' + (b ? (CROP_COL[PROC[b.k] && Object.keys(PROC[b.k].need)[0]] || '#c97a3a') : '#e8e0d0') + '" opacity="0.8" stroke="#5a3e2a"/><rect x="' + (x + 8 + j * 30) + '" y="34" width="20" height="7" rx="2" fill="#8a6a46"/>'; } });
  return s + '</svg>';
}
function cycleSVG(now) {
  const fm = F(); let s = '<svg viewBox="0 0 330 120" class="fm-svg"><rect width="330" height="120" fill="#c9d6c0"/>';
  // 堆肥桶
  const c = Math.min(1, (fm.compost % 5) / 5);
  s += '<text x="60" y="14" text-anchor="middle" font-size="10" font-weight="700">堆肥桶' + (fm.bin ? '' : '（未建）') + '</text><rect x="30" y="22" width="60" height="80" rx="6" fill="#6a4a2e" opacity="' + (fm.bin ? 1 : 0.3) + '"/><rect x="34" y="' + (98 - 72 * c) + '" width="52" height="' + (72 * c) + '" fill="#3a2a1a"/>';
  if (fm.bin) s += '<text x="60" y="114" text-anchor="middle" font-size="9.5">' + (fm.compost % 5).toFixed(1) + '/5 → 肥料</text>';
  // 箭頭：廚餘 → 堆肥 → 肥料 → 作物
  const arrow = (x1, x2, y, t) => { const k = (now / 1200) % 1; s += '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" stroke="#5a6a50" stroke-width="2" stroke-dasharray="4 3"/><circle cx="' + (x1 + (x2 - x1) * k) + '" cy="' + y + '" r="3" fill="#ecd27a"/><text x="' + ((x1 + x2) / 2) + '" y="' + (y - 6) + '" text-anchor="middle" font-size="9">' + t + '</text>'; };
  arrow(96, 150, 50, '肥料'); s += '<text x="170" y="56" font-size="20">🌱</text>';
  // 過濾塔
  const w = fm.tank / 20;
  s += '<text x="262" y="14" text-anchor="middle" font-size="10" font-weight="700">雨水過濾塔' + (fm.tower ? '' : '（未建）') + '</text><rect x="236" y="22" width="52" height="80" rx="8" fill="#e8f0f4" stroke="#5a6a7a" opacity="' + (fm.tower ? 1 : 0.3) + '"/><rect x="240" y="' + (98 - 72 * w) + '" width="44" height="' + (72 * w) + '" rx="4" fill="#5f9fd0"/>';
  if (fm.tower) s += '<text x="262" y="114" text-anchor="middle" font-size="9.5">' + fm.tank + '/20 份</text>';
  if (inRain(S.sv.day) && fm.tower) for (let i = 0; i < 6; i++) { const k = ((now / 500) + i / 6) % 1; s += '<line x1="' + (240 + i * 8) + '" y1="' + (2 + k * 18) + '" x2="' + (238 + i * 8) + '" y2="' + (8 + k * 18) + '" stroke="#5f9fd0" stroke-width="1.4"/>'; }
  arrow(200, 236, 60, '灌溉');
  return s + '</svg>';
}
function lvBar(k) { const xp = F().xp[k], lv = lvOfK(k), T = LV_T[k], nx = T[lv]; return '<div class="fm-lv"><b>Lv.' + lv + '「' + LV_N[k][lv] + '」</b><div class="bar"><i style="width:' + (nx != null ? Math.min(100, (xp - T[lv - 1]) / (nx - T[lv - 1]) * 100) : 100) + '%;background:#ecd27a"></i></div><span class="meta">' + (nx != null ? '經驗 ' + Math.floor(xp) + '/' + nx : '滿級') + '</span></div>'; }
function buildRows(tab) {
  const fm = F(); let h = '';
  for (const [k, B] of Object.entries(FARM_BUILD)) { if (B.tab !== tab) continue; const done = B.max ? fm[k] >= B.max : fm[k]; if (done) continue;
    h += '<div class="wm-row"><div><b>蓋' + B.n + (B.max ? '（' + fm[k] + '/' + B.max + '）' : '') + '</b><div class="meta">' + B.d + '</div><div class="meta">' + needTxt(B.need) + ' · 2 小時</div></div><button class="btn" data-a="fmBuild" data-v="' + k + '">蓋</button></div>'; }
  return h;
}
function farmModal() {
  const sv = S.sv, fm = F(), tab = UI.fmTab || 'field', now = performance.now();
  const tabs = [['field', '🌾 田地'], ['herb', '🌿 藥草'], ['ranch', '🐇 牧場'], ['proc', '🫙 加工'], ['cycle', '♻️ 循環']];
  let h = '<div class="fm-tabs">' + tabs.map(([k, t]) => '<button class="' + (k === tab ? 'on' : '') + '" data-a="fmTab" data-v="' + k + '">' + t + '</button>').join('') + '</div>';
  if (!roofOk()) return h + '<p>這些都蓋在頂樓。先到「🏙️ 頂樓」把頂樓整理好（木板 6、鐵片 4）。</p><button class="btn" data-a="wmOpen" data-v="roof">去頂樓</button>';
  h += '<div id="fm-scene">' + fmScene(tab, now) + '</div>';
  if (tab === 'field') {
    h += lvBar('farm') + '<p class="meta">等級越高：長得越快、越常「極品」多收一個、越常留下種子。收成會拿經驗。</p>';
    if (needWater()) h += '<div class="wm-row fest"><div><b>💧 澆水</b><div class="meta">要 ' + Math.ceil(sv.plants.length / 4) + ' 份水' + (fm.tank ? '（先用過濾塔的 ' + fm.tank + ' 份）' : '') + ' · 沒澆的話今天不長</div></div><button class="btn" data-a="fmWater">澆水</button></div>';
    sv.plants.forEach((p, i) => { if (p.pest) h += '<div class="wm-row"><div><b>🐛 ' + ITEMS[p.k].n + '長蟲了</b><div class="meta">' + (sv.st.repel > 0 ? '有驅蟲香，馬上解決' : '抓蟲 1 小時；或用草藥圃的艾草做驅蟲香') + ' · 3 天不處理會死</div></div><button class="btn" data-a="fmPest" data-v="' + i + '">' + (sv.st.repel > 0 ? '點驅蟲香' : '抓蟲') + '</button></div>'; });
    const s = slots(), free = freeSlots();
    h += '<p class="meta">種植位：' + (s.light + s.green + s.pot) + ' 個（空 ' + free + '）· 到種植箱、花盆架或用「我想要 → 種東西」種</p>';
    const seeds = Object.keys(SEED_OUT).filter(k => sv.st[k] > 0);
    if (seeds.length && free > 0) h += '<div class="row-btns">' + seeds.map(k => '<button class="btn ghost" data-a="plant" data-v="' + k + '">種' + ITEMS[k].n.replace(/種子|苗|種苗/, '') + '（' + sv.st[k] + '）</button>').join('') + '</div>';
  } else if (tab === 'herb') {
    h += lvBar('herb');
    const free = fm.herbBeds * 3 - fm.herbs.length, hs = Object.keys(HERBS).filter(k => sv.st[k] > 0);
    if (fm.herbBeds && free > 0 && hs.length) h += '<div class="row-btns">' + hs.map(k => '<button class="btn ghost" data-a="hbPlant" data-v="' + k + '">種' + ITEMS[k].n + '（' + sv.st[k] + '）</button>').join('') + '</div>';
    else if (fm.herbBeds && !hs.length) h += '<p class="meta">沒有草藥苗。農貿市場、學校、醫院找得到。</p>';
    h += '<div class="cat">藥方</div>';
    for (const [k, R] of Object.entries(REMEDY)) { const ok = lvOfK('herb') >= R.lv && Object.entries(R.need).every(([m, n]) => (sv.st[m] || 0) >= n);
      h += '<div class="wm-row"><div><b>' + itemIc(k === 'herb_kit' ? 'medkit' : k) + ITEMS[k].n + '</b>' + (sv.st[k] ? ' <span class="tag">有 ' + sv.st[k] + '</span>' : '') + '<div class="meta">' + R.d + '</div><div class="meta">' + (lvOfK('herb') < R.lv ? '🔒 藥師 Lv.' + R.lv : needTxt(R.need) + (R.wu ? ' · 水 ' + R.wu : '')) + '</div></div><div class="row-btns"><button class="btn" data-a="hbMake" data-v="' + k + '"' + (ok ? '' : ' disabled') + '>調製</button>' + (sv.st[k] > 0 && !['repel', 'herb_kit'].includes(k) ? '<button class="btn ghost" data-a="hbUse" data-v="' + k + '">用</button>' : '') + '</div></div>'; }
  } else if (tab === 'ranch') {
    h += lvBar('ranch');
    const R = W().roof;
    if (R.coop) h += '<div class="wm-row"><div><b>🐔 雞 ' + R.hens + '/4</b><div class="meta">飼料 ' + Math.floor(R.feed) + ' 份</div></div><div class="row-btns">' + (sv.st.hen > 0 && R.hens < 4 ? '<button class="btn ghost" data-a="roofHen">放雞</button>' : '') + '<button class="btn ghost" data-a="roofFeed">餵飼料</button></div></div>';
    else h += '<p class="meta">雞舍在「🏙️ 頂樓」蓋。</p>';
    if (fm.hutch) h += '<div class="wm-row"><div><b>🐇 兔子 ' + fm.rabbits + '/8</b><div class="meta">每天吃菜葉／地瓜／花生（2 隻 1 份）· 兩隻以上會生小兔子 · ' + (fm.rabbitFed === false ? '昨天沒吃飽' : '吃得飽飽的') + '</div></div><div class="row-btns">' + (sv.st.rabbit > 0 ? '<button class="btn ghost" data-a="rcAdd" data-v="rabbit">放兔子</button>' : '') + (fm.rabbits ? '<button class="btn ghost" data-a="rcPet"' + (fm.petDay === sv.day ? ' disabled' : '') + '>抱抱</button>' : '') + (fm.rabbits >= 3 ? '<button class="btn ghost" data-a="rcMeat">處理一隻</button>' : '') + '</div></div>';
    if (fm.hive) h += '<div class="wm-row"><div><b>🐝 蜂箱 ' + fm.hives + '/2</b><div class="meta">菜圃＋草藥圃要有 3 株以上 · 約 3 天一罐蜂蜜和一塊蜂蠟</div></div><div class="row-btns">' + (sv.st.bees > 0 && fm.hives < 2 ? '<button class="btn ghost" data-a="rcAdd" data-v="bees">放蜂群</button>' : '') + (sv.st.wax > 0 ? '<button class="btn ghost" data-a="rcCandle">做蠟燭（' + sv.st.wax + '）</button>' : '') + '</div></div>';
    h += '<p class="meta">兔子、蜂群在農貿市場買。蠟燭：沒電時按燈的開關會點蠟燭。</p>';
  } else if (tab === 'proc') {
    h += lvBar('proc') + '<p class="meta">放進去等幾天，早上自動收。加工的東西不會壞。Lv.3 每批多 1 份、Lv.4 少等 1 天。煮料理時有醬料會自動加一匙、多做一份。</p>';
    for (const at of ['dryer', 'smoker', 'jars']) { if (!fm[at]) continue; const used = fm.batches.filter(b => b.at === at).length;
      h += '<div class="cat">' + FARM_BUILD[at].n + '（' + used + '/' + PROC_SLOTS[at] + '）</div>';
      for (const [k, P] of Object.entries(PROC)) { if (P.at !== at) continue; const need = procNeed(k);
        h += '<div class="wm-row"><div><b>' + itemIc(k) + ITEMS[k].n + '</b> <span class="meta">×' + P.q + ' · ' + P.days + ' 天</span><div class="meta">' + needTxt(P.need) + (P.alt ? '　或 ' + needTxt(P.alt) : '') + '</div></div><button class="btn" data-a="pcStart" data-v="' + k + '"' + (need && used < PROC_SLOTS[at] ? '' : ' disabled') + '>放進去</button></div>'; } }
  } else if (tab === 'cycle') {
    h += '<p class="meta">堆肥桶：每晚把快壞的食物自動丟進去（冰櫃開著時不會），兔子也會產肥；滿 5 變 1 包肥料，有肥料作物長快 1.5 倍。蚯蚓箱讓堆肥加倍。<br>過濾塔：下雨天存乾淨的水，澆水時先用。</p>';
    if (fm.tower && fm.tank) h += '<div class="wm-row"><div><b>💧 取水</b><div class="meta">把 ' + fm.tank + ' 份水倒進家裡的儲水</div></div><button class="btn" data-a="fmTank">取水</button></div>';
  }
  h += buildRows(tab);
  return h;
}
function fmScene(tab, now) { return tab === 'field' ? fieldSVG(now) : tab === 'herb' ? herbSVG(now) : tab === 'ranch' ? ranchSVG(now) : tab === 'proc' ? procSVG(now) : cycleSVG(now); }
// 動起來：每格重畫場景
function farmTick(now) { requestAnimationFrame(farmTick); if (UI.wm !== 'farm') return; const el = document.getElementById('fm-scene'); if (el && S && S.sv && S.sv.w && roofOk()) el.innerHTML = fmScene(UI.fmTab || 'field', now); }
requestAnimationFrame(farmTick);
// 掛進世界視窗
const _wmHTMLFarm = wmHTML;
wmHTML = function () {
  if (UI.wm !== 'farm') return _wmHTMLFarm();
  return '<div class="rt-modal" data-a="wmClose"><div class="rt-mbox wm-box fm-box" data-a="noop"><div class="rt-mh"><div><b>🌾 農場與工坊</b></div><button class="btn ghost" data-a="wmClose" style="margin-left:auto">關閉</button></div>' + farmModal() + '</div></div>';
};
const _rtPanelFarm = rtPanel;
rtPanel = function () { return _rtPanelFarm().replace('<div class="wm-chips">', '<div class="wm-chips"><button class="pill" data-a="fmOpen">🌾 農場</button>'); };
// 我想要：種東西 → 農場
VERBS.splice(5, 0, { k: 'farm', ic: '🌾', n: '農場與工坊' });
const _verbFarm = SACT.verb;
SACT.verb = function (k) { if (k === 'farm') { UI.verbs = false; return SACT.fmOpen(); } return _verbFarm(k); };
// 建議：該澆水、有蟲
const _sugFarm = suggestRaw;
suggestRaw = function () {
  const L = _sugFarm(); const sv = S.sv;
  if (sv.w && sv.w.fm) { if (needWater() && sv.hour < 20) L.push({ pri: 58, ic: '💧', label: '澆水', why: greenPlants().length + ' 株要澆', water: true }); if (sv.plants.some(p => p.pest)) L.push({ pri: 66, ic: '🐛', label: '抓蟲', why: '菜圃長蟲了', wm: 'farm' }); }
  return L.sort((a, b) => b.pri - a.pri).slice(0, 3);
};
const _sugDoFarm = SACT.sugDo;
SACT.sugDo = function (i) { const s = suggest()[Number(i)]; if (s && s.water) return SACT.fmWater(); if (s && s.wm === 'farm') { UI.fmTab = 'field'; return SACT.fmOpen(); } return _sugDoFarm(i); };
