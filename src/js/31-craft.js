/* ================= M4：製作、陷阱、料理、天災 ================= */
const RECIPES = {
  pot:    { n: '花盆', need: { plastic: 1 }, h: 1, out: { pot: 1 }, base: true, d: '多 1 個種植格' },
  spike:  { n: '尖刺路障', need: { glass: 2, board: 1 }, h: 1, trap: 'spike', base: true, d: '陷阱：每波擋 40，可用 3 波' },
  rainc:  { n: '雨水收集器', need: { plastic: 2, board: 1 }, h: 2, out: { rain: 1 }, d: '雨天每天 2 份水' },
  solar:  { n: '太陽能板', need: { glass: 2, metal: 2, plastic: 1 }, h: 3, out: { solar: 1 }, d: '晴天每天 1.5 度' },
  heater: { n: '暖爐', need: { metal: 2, board: 1 }, h: 2, out: { heater: 1 }, d: '寒潮時每天燒 1 片木板取暖' },
  molotov: { n: '燃燒瓶', need: { alcohol: 1, glass: 1 }, h: 1, out: { molotov: 1 }, base: true, noStudent: true, d: '守夜時自動丟出，每瓶擋 120' },
  brewer: { n: '釀酒機', need: { metal: 3, glass: 2 }, h: 2, out: { brewer: 1 }, d: '3 個番茄或草莓釀 1 瓶高度酒' },
  shock:  { n: '電擊陷阱', defLv: 2, need: { metal: 2, plastic: 1 }, h: 2, trap: 'shock', d: '陷阱：每波擋 90，屍潮夜耗電 1.5，可用 6 波' },
  saw:    { n: '電鋸陷阱', defLv: 4, need: { metal: 4, plastic: 2 }, h: 3, trap: 'saw', d: '陷阱：每波擋 220，屍潮夜耗電 3，可用 10 波' }
};
const TRAPS = { spike: { n: '尖刺路障', dmg: 40, uses: 3, power: 0 }, shock: { n: '電擊陷阱', dmg: 90, uses: 6, power: 1.5 }, saw: { n: '電鋸陷阱', dmg: 220, uses: 10, power: 3 } };
const VEGGIES = ['veg', 'tomato_p', 'mushroom', 'straw_p'];
const COOKS = {
  rice:   { n: '煮飯', d: '1 袋米 → 8 份熟飯', power: 0.3 },
  soup:   { n: '蔬菜湯', d: '1 份蔬果 + 1 份水 → 2 碗湯', power: 0.3 },
  hotpot: { n: '火鍋', d: '任 2 份蔬果/罐頭/火腿腸 → 1 鍋（飽足加倍）', power: 0.5 }
};
const DISASTERS = ['leak', 'rats', 'sick', 'surge', 'roof'];

function knownRecipes() { const sv = S.sv; return Object.keys(RECIPES).filter(k => RECIPES[k].base || sv.recipes.includes(k)); }
function canCraft(k) { const r = RECIPES[k], st = S.sv.st; return Object.entries(r.need).every(([m, n]) => (st[m] || 0) >= n); }
function hotpotPool() { return ['veg', 'tomato_p', 'mushroom', 'straw_p', 'can', 'sausage'].reduce((a, k) => a + sv_has(k), 0); }
function vegPool() { return VEGGIES.reduce((a, k) => a + sv_has(k), 0); }
function takeFrom(list, n) { for (const k of list) { const t = Math.min(sv_has(k), n); if (t) { sv_take(k, t); n -= t; } if (n <= 0) break; } }

function m4Init(sv) {
  sv.traps = []; sv.sp = 0; sv.talents = {}; sv.sick = 0;
  const locked = Object.keys(RECIPES).filter(k => !RECIPES[k].base);
  const drawn = [];
  const pool = locked.slice();
  for (let i = 0; i < 2 && pool.length; i++) drawn.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  const remembered = locked.filter(k => J.recipes[k]);
  sv.recipes = Array.from(new Set([...remembered, ...drawn]));
  const fresh = drawn.filter(k => !J.recipes[k]);
  for (const k of drawn) J.recipes[k] = true;
  saveJournal();
  if (drawn.length) slog('你在抽屜裡翻到圖紙：' + drawn.map(k => RECIPES[k].n).join('、') + (fresh.length ? '（新的，已抄進日誌）' : '') + '。');
}

Object.assign(SACT, {
  craft(k) {
    const sv = S.sv, r = RECIPES[k];
    const ch = craftHours(r.h), cs = craftSta(r.h);
    if (!r || !knownRecipes().includes(k) || !canCraft(k) || !canAct(ch, cs) || (r.defLv && defLv() < r.defLv) || (r.noStudent && S.char === 'student') || (r.needDrone && !(sv.st.drone > 0))) return;
    for (const [m, n] of Object.entries(r.need)) { sv.st[m] -= n; if (!sv.st[m]) delete sv.st[m]; }
    if (r.trap) { const t = TRAPS[r.trap]; sv.traps.push({ k: r.trap, uses: t.uses }); }
    if (r.out) for (const [o, n] of Object.entries(r.out)) sv.st[o] = (sv.st[o] || 0) + n;
    sv.sta -= cs; sv.crafted = (sv.crafted || 0) + 1;
    const lvBefore = lvOf(sv.crafted - 1, CRAFT_LV);
    slog('在工作台做好了' + r.n + '。' + (craftLv() > lvBefore ? ' 製作熟練度升到 ' + craftLv() + ' 級！' : ''));
    passHours(ch); render();
  },
  cookx(k) {
    const sv = S.sv, c = COOKS[k];
    if (!c || !canAct(1, staCost(5)) || !(sv.st.microwave > 0) || sv.power < c.power) return;
    if (k === 'rice') { if (!(sv.st.rice > 0)) return; sv.st.rice--; if (!sv.st.rice) delete sv.st.rice; sv_addFresh('rice_c', 8); }
    if (k === 'soup') { if (vegPool() < 1 || sv.st.wu < 1) return; takeFrom(VEGGIES, 1); sv.st.wu -= 1; sv_addFresh('soup', 2); }
    if (k === 'hotpot') { if (hotpotPool() < 2) return; takeFrom(['veg', 'tomato_p', 'mushroom', 'straw_p', 'sausage', 'can'], 2); sv_addFresh('hotpot', 1); }
    sv.power -= c.power; sv.sta -= staCost(5);
    slog('用微波爐做了' + c.n + '。');
    passHours(1); render();
  },
  talent(k) {
    const sv = S.sv, t = TALENTS[k];
    if (!t || sv.talents[k] || sv.sp < t.cost) return;
    sv.sp -= t.cost; sv.talents[k] = true;
    slog('學會天賦：' + t.n + '（' + t.d + '）。'); render();
  },
  rewind(i) {
    const s = S.snaps && S.snaps[Number(i)];
    if (!s || J.pp < REWIND_COST || !S.result || S.result.committed) return;
    J.pp -= REWIND_COST; J.stats = J.stats || {}; J.stats.rewinds = (J.stats.rewinds || 0) + 1; saveJournal();
    S.sv = JSON.parse(s.sv);
    S.snaps = S.snaps.slice(0, Number(i) + 1);
    S.phase = 'survive'; S.result = null;
    UI = { tab: 'act', qty: {} };
    slog('你翻開日誌，回到第 ' + s.day + ' 天早上。這次要做得不一樣。', true);
    render(); window.scrollTo(0, 0);
  }
});

// 每天早上的隨機天災
function morningDisaster(nd) {
  const sv = S.sv, st = sv.st;
  if (nd === 49) { sv.sick = 3; slog('你發燒了，渾身無力。生病時體力回得慢，也沒力氣加固防線。', true); chron(nd, '生病了，偏偏後天就是大屍潮。', 'bad'); return; }
  if (nd < 5 || Math.random() > 0.12) return;
  const k = DISASTERS[Math.floor(Math.random() * DISASTERS.length)];
  if (k === 'leak' && st.wu > 0) { const n = Math.min(st.wu, 4); st.wu -= n; slog('水管爆裂，流失了 ' + n + ' 份水。', true); chron(nd, '水管爆裂，流失 ' + n + ' 份水。', 'bad'); }
  else if (k === 'rats') {
    const pool = ['biscuit', 'sausage', 'noodle', 'can', 'rice'].filter(x => st[x] > 0);
    if (pool.length) { const x = pool[Math.floor(Math.random() * pool.length)]; const n = Math.min(st[x], 1 + Math.floor(Math.random() * 3)); st[x] -= n; if (!st[x]) delete st[x]; slog('老鼠咬壞了' + ITEMS[x].n + ' ×' + n + '。', true); chron(nd, '鼠患，損失' + ITEMS[x].n + ' ×' + n + '。', 'bad'); }
  }
  else if (k === 'sick' && !sv.sick) { sv.sick = 3; slog('你著涼生病了（3 天）。吃止痛藥可以提早好。', true); chron(nd, '生病 3 天。', 'bad'); }
  else if (k === 'surge' && sv.power > 0) { sv.power = 0; slog('電線走火跳電，存電全部歸零。', true); chron(nd, '電線走火，存電歸零。', 'bad'); }
  else if (k === 'roof' && inRain(nd)) { sv.mor = clamp(sv.mor - 10); slog('屋頂漏雨，滿地是水。心態 -10。', true); }
}

function viewCraft() {
  const sv = S.sv, st = sv.st;
  let h = '<div class="cat">工作台（熟練度 ' + craftLv() + ' 級 · 已做 ' + (sv.crafted || 0) + ' 件）</div><p class="empty">熟練度 2 級體力消耗 -25%、3 級製作時間 -1 小時。' + (roomN('workshop') ? '有工坊，時間再 -1 小時。' : '') + '</p><div class="sheet">';
  for (const k of knownRecipes()) {
    const r = RECIPES[k];
    const need = Object.entries(r.need).map(([m, n]) => ITEMS[m].n + ' ' + (st[m] || 0) + '/' + n).join('、');
    const ch = craftHours(r.h), cs = craftSta(r.h);
    const lock = r.defLv && defLv() < r.defLv ? '防禦等級 ' + r.defLv + ' 才能做' : r.noStudent && S.char === 'student' ? '大學生不會做' : r.needDrone && !(st.drone > 0) ? '要先有無人機' : (r.out && ITEMS[Object.keys(r.out)[0]].cat === 'equip' && ['radar', 'refinery', 'bot_farm', 'bot_fix', 'bot_cook', 'dauto', 'brewer'].includes(k) && st[k] > 0) ? '已經有了' : '';
    h += actRow(r.n + (r.base ? '' : '<span class="tag amber">圖紙</span>'), (lock ? '<b style="color:var(--stamp)">' + lock + '</b> · ' : '') + r.d + ' · ' + need + ' · ' + ch + ' 小時 · 體力 -' + cs, '做', 'craft', k, !lock && canCraft(k) && canAct(ch, cs));
  }
  const unknown = Object.keys(RECIPES).length - knownRecipes().length;
  h += '</div>';
  if (unknown) h += '<p class="empty">還有 ' + unknown + ' 張圖紙沒拿到。每輪開局會隨機抽 2 張，抽到過的會永久記在日誌裡。</p>';
  if (st.microwave) {
    h += '<div class="cat">廚房（1 小時）</div><div class="sheet">';
    const ok = { rice: (st.rice || 0) > 0, soup: vegPool() >= 1 && st.wu >= 1, hotpot: hotpotPool() >= 2 };
    for (const k of Object.keys(COOKS)) {
      const c = COOKS[k];
      h += actRow(c.n, c.d + ' · 耗電 ' + c.power, '煮', 'cookx', k, ok[k] && sv.power >= c.power && canAct(1, staCost(5)));
    }
    h += '</div>';
  }
  h += viewRefine();
  if (st.brewer) h += '<div class="sheet">' + actRow('釀酒', '3 個番茄或草莓 → 1 瓶高度酒 · 2 小時', '釀', 'brew', '', ['tomato_p', 'straw_p'].reduce((a, k) => a + sv_has(k), 0) >= 3 && canAct(2, staCost(5))) + '</div>';
  return h;
}

function viewTraps() {
  const sv = S.sv;
  let h = '<div class="cat">陷阱</div>';
  if (!sv.traps.length) return h + '<p class="empty">還沒有陷阱。到「行動」的工作台製作，屍潮時會先擋掉一部分傷害。</p>';
  return h + '<div class="sheet">' + sv.traps.map(t => '<div class="item"><div><div class="nm">' + TRAPS[t.k].n + '</div><div class="meta">每波擋 ' + Math.round(TRAPS[t.k].dmg * (hasT('traps') ? 1.15 : 1)) + (TRAPS[t.k].power ? ' · 屍潮夜耗電 ' + TRAPS[t.k].power : '') + '</div></div><div class="price">剩 ' + t.uses + ' 波</div></div>').join('') + '</div>';
}

function viewTalents() {
  const sv = S.sv;
  return '<div class="cat">天賦（生存點數 <span class="num">' + sv.sp + '</span>）</div><p class="empty">每撐過一天 +1，每擋下一波屍潮 +10。天賦只在這一輪有效。</p><div class="sheet">' +
    Object.entries(TALENTS).map(([k, t]) => '<div class="item"><div><div class="nm">' + t.n + (sv.talents[k] ? '<span class="tag green">已學</span>' : '') + '</div><div class="meta">' + t.d + ' · ' + t.cost + ' 點</div></div>' +
      '<button class="btn ghost" data-a="talent" data-v="' + k + '"' + (sv.talents[k] || sv.sp < t.cost ? ' disabled' : '') + '>' + (sv.talents[k] ? '已學' : '學') + '</button></div>').join('') + '</div>';
}
