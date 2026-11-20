/* ================= 種植與廚師系統 =================
   新作物 7 種（地瓜、高麗菜、蔥、辣椒、玉米、九層塔、豆芽），每種成熟天數不同。
   微波爐變成廚房：13 道料理，要用自己種的、外面撿的食材組合。
   廚藝 Lv.1–5：煮越多越熟練，等級高解鎖新菜、料理更飽、有機會多做一份。
   吃的變化：換換口味心態 +3、連吃同一道會膩；寒流時吃熱菜身體暖起來。 */

Object.assign(ITEMS, {
  yam:        { n: '地瓜苗', cat: 'farm', w: 0.1, note: '一份種 2 株 · 長得快、耐放' },
  cabbage:    { n: '高麗菜種子', cat: 'farm', w: 0.05, note: '一包種 2 株' },
  scallion:   { n: '蔥苗', cat: 'farm', w: 0.05, note: '一份種 2 株 · 4 天就能收' },
  chili:      { n: '辣椒種子', cat: 'farm', w: 0.05, note: '一包種 2 株 · 做辣菜' },
  corn:       { n: '玉米種子', cat: 'farm', w: 0.05, note: '一包種 2 株 · 長得慢、很飽' },
  basil:      { n: '九層塔種子', cat: 'farm', w: 0.05, note: '一包種 2 株 · 三杯必備' },
  sprout:     { n: '綠豆（發豆芽）', cat: 'farm', w: 0.1, note: '一包種 2 盆 · 2 天就能收' },
  yam_p:      { n: '地瓜', cat: 'food', w: 0.3, note: '自己種的 · 放得久' },
  cabbage_p:  { n: '高麗菜', cat: 'food', w: 0.5, note: '自己種的' },
  scallion_p: { n: '蔥', cat: 'food', w: 0.05, note: '自己種的 · 炒菜爆香' },
  chili_p:    { n: '辣椒', cat: 'food', w: 0.05, note: '自己種的 · 做辣菜、醃菜' },
  corn_p:     { n: '玉米', cat: 'food', w: 0.3, note: '自己種的' },
  basil_p:    { n: '九層塔', cat: 'food', w: 0.05, note: '自己種的 · 很香' },
  sprout_p:   { n: '豆芽菜', cat: 'food', w: 0.1, note: '自己發的' },
  // 料理
  yam_roast:  { n: '烤地瓜', cat: 'food', w: 0.3, note: '自己煮的' },
  cabbage_fry:{ n: '炒高麗菜', cat: 'food', w: 0.3, note: '自己煮的' },
  tomato_soup:{ n: '番茄湯', cat: 'food', w: 0.3, note: '自己煮的' },
  fried_rice: { n: '罐頭炒飯', cat: 'food', w: 0.3, note: '自己煮的' },
  pickle:     { n: '台式泡菜', cat: 'food', w: 0.2, note: '自己醃的 · 不會壞' },
  corn_soup:  { n: '玉米濃湯', cat: 'food', w: 0.3, note: '自己煮的' },
  yam_congee: { n: '地瓜粥', cat: 'food', w: 0.3, note: '自己煮的' },
  sprout_noodle: { n: '豆芽炒麵', cat: 'food', w: 0.3, note: '自己煮的' },
  spicy_ham:  { n: '辣炒火腿', cat: 'food', w: 0.3, note: '自己煮的 · 熱菜' },
  jam:        { n: '草莓果醬', cat: 'food', w: 0.2, note: '自己熬的 · 不會壞' },
  three_cup:  { n: '三杯菇', cat: 'food', w: 0.3, note: '自己煮的 · 熱菜' },
  mala_pot:   { n: '麻辣鍋', cat: 'food', w: 0.6, note: '自己煮的 · 熱菜' },
  banquet:    { n: '家常大餐', cat: 'food', w: 0.8, note: '主廚的拿手菜' }
});
Object.assign(SEED_OUT, { yam: 'yam_p', cabbage: 'cabbage_p', scallion: 'scallion_p', chili: 'chili_p', corn: 'corn_p', basil: 'basil_p', sprout: 'sprout_p' });
const CROP_F = { yam_p: 0.8, cabbage_p: 0.9, scallion_p: 0.5, chili_p: 0.8, corn_p: 1.2, basil_p: 0.5, sprout_p: 0.3 };
function growDaysOf(k) { return Math.max(2, Math.round(growDays() * (CROP_F[k] || 1))); }

Object.assign(FOOD, {
  yam_p: { sat: 30 }, cabbage_p: { sat: 25, mor: 2 }, scallion_p: { sat: 4, mor: 1 }, chili_p: { sat: 3, mor: 2 }, corn_p: { sat: 30, mor: 3 }, basil_p: { sat: 2, mor: 3 }, sprout_p: { sat: 12 },
  yam_roast: { sat: 35, mor: 5, dish: true }, cabbage_fry: { sat: 35, mor: 7, dish: true }, tomato_soup: { sat: 28, mor: 6, dish: true }, fried_rice: { sat: 45, mor: 8, dish: true },
  pickle: { sat: 18, mor: 4, dish: true }, corn_soup: { sat: 40, mor: 9, dish: true, warm: true }, yam_congee: { sat: 30, mor: 6, dish: true, warm: true }, sprout_noodle: { sat: 50, mor: 8, dish: true },
  spicy_ham: { sat: 40, mor: 10, dish: true, warm: true }, jam: { sat: 20, mor: 10, dish: true }, three_cup: { sat: 45, mor: 16, dish: true, warm: true },
  mala_pot: { sat: 130, mor: 22, dish: true, warm: true }, banquet: { sat: 70, mor: 20, dish: true }
});
FOOD.soup.warm = true; FOOD.hotpot.warm = true;
Object.assign(FRESH_LIFE, {
  yam_p: 8, cabbage_p: 5, scallion_p: 3, chili_p: 6, corn_p: 4, basil_p: 2, sprout_p: 2,
  yam_roast: 2, cabbage_fry: 2, tomato_soup: 2, fried_rice: 2, corn_soup: 2, yam_congee: 2, sprout_noodle: 1, spicy_ham: 2, three_cup: 1, mala_pot: 1, banquet: 1
});
// 前期農貿市場買得到；外出也撿得到
Object.assign(STORES.farm.items, { yam: [10, 6], cabbage: [10, 6], scallion: [6, 6], chili: [8, 6], corn: [12, 5], basil: [8, 5], sprout: [6, 8] });
const _seedLoot = { smarket: [['scallion', 1, 2, 8], ['corn', 1, 1, 6], ['sprout', 1, 2, 8]], school: [['basil', 1, 1, 10], ['sprout', 1, 2, 10], ['yam', 1, 1, 6]], hardware: [['cabbage', 1, 1, 8], ['chili', 1, 1, 8], ['yam', 1, 1, 8]] };
for (const [loc, add] of Object.entries(_seedLoot)) if (LOCS[loc]) for (const c of LOCS[loc].cont) if (Array.isArray(c.loot)) c.loot.push(...add.slice(0, 2));

/* ---------- 料理 ---------- */
const DISHES = {
  yam_roast:     { lv: 1, need: { yam_p: 1 }, q: 2, power: 0.3 },
  tomato_soup:   { lv: 1, need: { tomato_p: 2, wu: 1 }, q: 3, power: 0.3 },
  cabbage_fry:   { lv: 1, need: { cabbage_p: 1, scallion_p: 1 }, q: 2, power: 0.3 },
  fried_rice:    { lv: 1, need: { rice_c: 2, can: 1, scallion_p: 1 }, q: 3, power: 0.3 },
  pickle:        { lv: 2, need: { cabbage_p: 2, chili_p: 1 }, q: 4, power: 0 },
  corn_soup:     { lv: 2, need: { corn_p: 1, can: 1, wu: 1 }, q: 3, power: 0.3 },
  yam_congee:    { lv: 2, need: { rice: 1, yam_p: 1, wu: 2 }, q: 6, power: 0.4 },
  sprout_noodle: { lv: 2, need: { noodle: 2, sprout_p: 2 }, q: 2, power: 0.3 },
  spicy_ham:     { lv: 3, need: { sausage: 2, chili_p: 1, scallion_p: 1 }, q: 2, power: 0.3 },
  jam:           { lv: 3, need: { straw_p: 3 }, q: 3, power: 0.4 },
  three_cup:     { lv: 4, need: { mushroom: 2, basil_p: 1, alcohol: 1 }, q: 2, power: 0.3 },
  mala_pot:      { lv: 4, need: { chili_p: 2, sausage: 1, cabbage_p: 1, mushroom: 1 }, q: 1, power: 0.5 },
  banquet:       { lv: 5, need: { corn_p: 1, cabbage_p: 1, tomato_p: 1, can: 1, rice_c: 2 }, q: 3, power: 0.6 }
};
for (const [k, D] of Object.entries(DISHES)) COOKS[k] = { n: ITEMS[k].n, d: Object.entries(D.need).map(([m, n]) => (m === 'wu' ? '水' : ITEMS[m].n.replace(/（.*）/, '')) + '×' + n).join('、') + ' → ' + D.q + ' 份', power: D.power };

const CHEF_LV = [0, 4, 10, 20, 35];
const CHEF_TITLE = ['', '學徒', '家常廚師', '巷口名廚', '料理達人', '末日主廚'];
function chefState() { const sv = S.sv; if (!sv.chef) sv.chef = { xp: 0, made: {} }; return sv.chef; }
function chefLv() { const xp = chefState().xp; let lv = 1; for (let i = 1; i < CHEF_LV.length; i++) if (xp >= CHEF_LV[i]) lv = i + 1; return lv; }
const haveIng = m => m === 'wu' ? (S.sv.st.wu || 0) : sv_has(m);
function dishOk(k) {
  const sv = S.sv, D = DISHES[k];
  return !!D && chefLv() >= D.lv && !!sv.st.microwave && sv.power >= D.power && Object.entries(D.need).every(([m, n]) => haveIng(m) >= n) && canAct(1, staCost(5));
}
function chefGain(k, xp) {
  const C = chefState(), lv0 = chefLv();
  C.xp += xp; C.made[k] = (C.made[k] || 0) + 1;
  const lv = chefLv();
  if (lv > lv0) {
    slog('廚藝升到 Lv.' + lv + '「' + CHEF_TITLE[lv] + '」！' + (lv === 3 ? '料理有機會多做一份。' : lv === 5 ? '你的菜吃了心情特別好。' : '學會新的菜。'), true);
    sfx('ach');
    if (typeof evState === 'function' && typeof rtState === 'function') { const rt = rtState(), E = evState(); E.fx = (E.fx || []).concat([{ x: rt.pos.x, y: rt.pos.y - 1.1, txt: '🍳 廚藝 Lv.' + lv, col: '#ecd27a', t0: performance.now() }]); }
  }
}
const _cookxChef = SACT.cookx;
SACT.cookx = function (k) {
  const sv = S.sv;
  if (!DISHES[k]) { const h0 = sv.hour; _cookxChef(k); if (S.sv && S.sv.hour !== h0) chefGain(k, 1); return; }
  if (!dishOk(k)) { slog('現在煮不了' + ITEMS[k].n + '（' + (chefLv() < DISHES[k].lv ? '廚藝 Lv.' + DISHES[k].lv + ' 才會' : '材料、電或體力不夠') + '）。'); render(); return; }
  const D = DISHES[k];
  for (const [m, n] of Object.entries(D.need)) { if (m === 'wu') sv.st.wu -= n; else sv_take(m, n); }
  let q = D.q; const lucky = chefLv() >= 3 && rnd() < 0.25; if (lucky) q++;
  sv_addFresh(k, q);
  sv.power -= D.power; sv.sta -= staCost(5);
  slog('做了' + ITEMS[k].n + ' ×' + q + (lucky ? '（做得特別成功，多一份！）' : '') + '。');
  chefGain(k, D.lv);
  passHours(1); render();
};

/* ---------- 吃：廚藝加成、換換口味、熱菜 ---------- */
const _eatChef = SACT.eat;
SACT.eat = function (k) {
  const sv = S.sv, f = FOOD[k]; if (!f || sv_has(k) <= 0) return _eatChef(k);
  const satB = sv.sat;
  _eatChef(k);
  if (!S.sv || sv_has(k) === undefined) return;
  const lv = chefLv(); let notes = [];
  if (f.dish) {
    const extra = Math.round(f.sat * 0.06 * (lv - 1)); if (extra > 0) { sv.sat = clamp(sv.sat + extra); }
    if (lv >= 5) { sv.mor = clamp(sv.mor + 3); }
    const last = sv.meals || [];
    if (last.length >= 3 && last.slice(-3).every(x => x === k)) { sv.mor = clamp(sv.mor - 3); notes.push('又是這個……心態 -3'); }
    else if (!last.slice(-3).includes(k)) { sv.mor = clamp(sv.mor + 3); notes.push('換換口味，心態 +3'); }
    sv.meals = last.concat([k]).slice(-6);
  }
  if (f.warm && inCold(sv.day)) { sv.hp = clamp(sv.hp + 3); sv.mor = clamp(sv.mor + 5); notes.push('熱騰騰的，身體暖起來了'); }
  if (notes.length) slog(notes.join('；') + '。');
};

/* ---------- 廚房視窗（點微波爐） ---------- */
Object.assign(SACT, { mCook(k) { doNow(UI.rtSel, 'cookx', k, '煮' + ITEMS[k].n); } });
function kitchenHTML() {
  const sv = S.sv, C = chefState(), lv = chefLv(), next = CHEF_LV[lv] != null ? CHEF_LV[lv] : null;
  let h = '<div class="kc-head"><b>🍳 廚藝 Lv.' + lv + '「' + CHEF_TITLE[lv] + '」</b><span>' + (next != null ? '經驗 ' + C.xp + ' / ' + next : '已滿級') + '</span><div class="bar"><i style="width:' + (next != null ? Math.min(100, (C.xp - CHEF_LV[lv - 1]) / (next - CHEF_LV[lv - 1]) * 100) : 100) + '%;background:#ecd27a"></i></div>' +
    '<span class="meta">電 ' + sv.power.toFixed(1) + ' 度 · 每道菜 1 小時' + (lv >= 3 ? ' · 有機會多做一份' : '') + '</span></div>';
  h += '<div class="kc-grid">';
  const card = k => {
    const D = DISHES[k], f = FOOD[k], locked = lv < D.lv, ok = dishOk(k);
    const ing = Object.entries(D.need).map(([m, n]) => { const have = haveIng(m); return '<span class="kc-ing ' + (have >= n ? 'ok' : 'no') + '">' + itemIc(m) + (m === 'wu' ? '水' : ITEMS[m].n.replace(/（.*）/, '')) + ' ' + Math.min(have, 99) + '/' + n + '</span>'; }).join('');
    return '<div class="kc-card' + (locked ? ' locked' : '') + '"><div class="kc-t">' + itemIc(k) + '<b>' + ITEMS[k].n + '</b>' + (C.made[k] ? '<span class="kc-made">做過 ' + C.made[k] + ' 次</span>' : '') + '</div>' +
      (locked ? '<div class="meta">🔒 廚藝 Lv.' + D.lv + ' 解鎖</div>' :
        '<div class="kc-ings">' + ing + '</div><div class="meta">→ ' + D.q + ' 份 · 飽足 ' + f.sat + ' · 心態 +' + (f.mor || 0) + (f.warm ? ' · 🔥熱菜' : '') + (FRESH_LIFE[k] ? '' : ' · 不會壞') + (D.power ? ' · ' + D.power + ' 度電' : '') + '</div>' +
        '<button class="btn kc-go" data-a="mCook" data-v="' + k + '"' + (ok ? '' : ' disabled') + '>煮</button>') + '</div>';
  };
  for (const k of Object.keys(DISHES).sort((a, b) => DISHES[a].lv - DISHES[b].lv)) h += card(k);
  h += '</div>';
  // 原本的三道（煮飯、蔬菜湯、火鍋）
  const old = { rice: (sv.st.rice || 0) > 0, soup: vegPool() >= 1 && sv.st.wu >= 1, hotpot: hotpotPool() >= 2 };
  h += '<div class="kc-basic">' + ['rice', 'soup', 'hotpot'].map(k => '<button class="btn ghost" data-a="mCook" data-v="' + k + '"' + (old[k] && sv.power >= COOKS[k].power && canAct(1, staCost(5)) ? '' : ' disabled') + '>' + COOKS[k].n + '<small>' + COOKS[k].d + '</small></button>').join('') + '</div>';
  return h;
}
