/* ================= 永久模式（悠閒經營） =================
   標題頁「🌱 永久模式」：跳過準備期，直接住進有頂樓的家。
   - 不會死：生命、飽腹、水分最低停在 25；沒有屍潮、沒有 100 天結局
   - 開局給基本物資＋夠用的材料，每天早上門口有補給箱
   - 主要玩：廚藝、農藝、藥師、加工、牧場升級；頂樓直接整理好 */
const isForever = () => !!(S && S.mods && S.mods.forever);
const FOREVER_KIT = { rice: 4, can: 8, biscuit: 6, noodle: 8, water: 6, barrel: 2, board: 40, metal: 20, plastic: 20, glass: 10, diesel: 6, medkit: 3, pills: 4,
  microwave: 1, freezer: 1, gen: 1, battery: 2, solar: 1, lightbox: 1, pot: 6, fert: 2, door: 1,
  tomato: 3, straw: 2, yam: 2, cabbage: 2, scallion: 2, chili: 2, corn: 2, basil: 2, sprout: 2, pumpkin: 2, taro: 2, peanut: 2, cane: 2, tea: 2,
  mint: 2, aloe: 2, mugwort: 2, honeys: 1, ginger: 2, hen: 2, rabbit: 2, bees: 1 };
Object.assign(ACT, {
  foreverStart() {
    commitRun();
    J.setup = Object.assign({}, J.setup || {}, { mods: Object.assign({}, (J.setup || {}).mods || {}, { forever: true }) });
    newRun();
    J.setup.mods = Object.assign({}, J.setup.mods); delete J.setup.mods.forever; saveJournal();
    S.mods = Object.assign({}, S.mods || {}, { forever: true });
    for (const [k, q] of Object.entries(FOREVER_KIT)) if (ITEMS[k]) S.home[k] = (S.home[k] || 0) + q;
    S.t = OUTBREAK; S.loc = 'home';
    ACT.wait();
    const sv = S.sv; if (!sv) return;
    sv.endless = true; sv.power = Math.max(sv.power, 10);
    W().roof.built = true;
    slog('🌱 永久模式：這裡很安全，不用擔心屍潮和餓死。慢慢種菜、煮飯、養動物吧。頂樓已經整理好了。', true);
    render();
  }
});
// 不會死、數值有底線
const _hurtF = hurt;
hurt = function (v, why) { _hurtF(v, why); if (isForever() && S.sv) S.sv.hp = Math.max(25, S.sv.hp); };
const _checkDeathF = checkDeath;
checkDeath = function () { if (isForever() && S.sv) { const sv = S.sv; sv.hp = Math.max(25, sv.hp); return false; } return _checkDeathF(); };
const _passF = passHours;
passHours = function (h) { _passF(h); if (isForever() && S.sv && S.phase === 'survive') { const sv = S.sv; sv.hp = Math.max(25, sv.hp); sv.sat = Math.max(25, sv.sat); sv.hyd = Math.max(25, sv.hyd); sv.mor = Math.max(20, sv.mor); } };
// 沒有屍潮
const _hordeMulF = hordeMul;
hordeMul = function () { return isForever() ? 0 : _hordeMulF(); };
const _siegeStartF = siegeStart;
siegeStart = function () { if (isForever()) { S.sv.siege = { d: S.sv.day, done: true, z: [], fx: [], kills: 0, n: 0, p: 1 }; return; } _siegeStartF(); };
// 每天早上補給箱
const _nightF = night;
night = function (watch) {
  const d0 = S.sv && S.sv.day;
  if (isForever() && S.sv) { const sv = S.sv; sv.hp = Math.max(25, sv.hp); }
  _nightF(watch);
  if (!isForever() || !S.sv || S.phase !== 'survive' || S.sv.day === d0) return;
  const sv = S.sv, box = [];
  sv.hp = Math.max(25, sv.hp); sv.sat = Math.max(25, sv.sat); sv.hyd = Math.max(25, sv.hyd); sv.mor = Math.max(20, sv.mor); if (sv.hyg != null) sv.hyg = Math.max(25, sv.hyg); sv.sick = 0; if (sv.inj) { sv.inj.inf = 0; sv.inj.frac = 0; }
  const add = (k, n) => { sv.st[k] = (sv.st[k] || 0) + n; box.push(ITEMS[k].n.replace(/（.*）/, '') + '×' + n); };
  if ((sv.st.wu || 0) < 20) { sv.st.wu = (sv.st.wu || 0) + 10; box.push('飲用水×10'); }
  if (Object.keys(FOOD).reduce((a, k) => a + sv_has(k), 0) < 8) { add('can', 3); add('rice', 1); }
  if ((sv.st.board || 0) < 10) add('board', 5);
  if ((sv.st.metal || 0) < 5) add('metal', 3);
  if ((sv.st.plastic || 0) < 5) add('plastic', 3);
  if ((sv.st.diesel || 0) < 2) add('diesel', 2);
  if (sv.day % 3 === 0) { const seeds = Object.keys(SEED_OUT).concat(Object.keys(HERBS)); add(seeds[Math.floor(rnd() * seeds.length)], 2); }
  if (sv.day % 7 === 0) { const r = ['hen', 'rabbit', 'bees'][Math.floor(rnd() * 3)]; add(r, 1); }
  const t = '📦 門口的補給箱：' + box.join('、') + '。';
  if (UI.morning && UI.morning.day === sv.day) UI.morning.extra = (UI.morning.extra || []).concat([t]); else slog(t);
};
// 不會進結局
const _finishF = finishRun;
finishRun = function (res) { if (isForever() && S.sv && !res.ending) { S.sv.hp = Math.max(25, S.sv.hp); return; } _finishF(res); };
// 標題頁按鈕
const _viewTitleF = viewTitle;
viewTitle = function () {
  return _viewTitleF().replace('<p class="meta" style="text-align:center;margin:14px 0 24px"><a href="classic.html"',
    '<div class="forever-card"><b>🌱 永久模式</b><span>不會死、沒有屍潮、物資夠用、沒有天數限制。專心升級廚藝、農場、牧場。</span><button class="btn" data-a="foreverStart">開始永久模式</button></div><p class="meta" style="text-align:center;margin:14px 0 24px"><a href="classic.html"');
};
// 狀態提示
const _rtPanelF = rtPanel;
rtPanel = function () {
  if (!isForever()) return _rtPanelF();
  const fm = typeof F === 'function' ? F() : null, ch = typeof chefLv === 'function' ? chefLv() : 1;
  const lv = fm ? ' · 🍳 Lv.' + ch + ' · 🌾 Lv.' + lvOfK('farm') + ' · 🌿 Lv.' + lvOfK('herb') + ' · 🫙 Lv.' + lvOfK('proc') + ' · 🐇 Lv.' + lvOfK('ranch') : '';
  return '<div class="forever-bar">🌱 永久模式' + lv + '</div>' + _rtPanelF();
};

const _tidyQF = tidyQuest;
tidyQuest = function () { if (!isForever()) return _tidyQF(); const g = typeof goalState === 'function' ? GOALS.find(G => !goalState()[G.id]) : null; return '<div class="tq-1">🌱 永久模式 · 第 <b>' + S.sv.day + '</b> 天</div>' + (g ? '<div class="tq-2">🎯 ' + g.n + '</div>' : ''); };
