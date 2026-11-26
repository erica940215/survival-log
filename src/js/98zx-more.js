/* ================= 第三波：世界生命感、料理／種植／經營進化、長期循環、操作體驗 ================= */
const G3 = () => { const gr = GR(); if (!gr.g3) gr.g3 = { stove: 1, zone: 'none', pests: {}, shopUp: {}, regs: {}, deliv: null, hist: [], farm2: false, sets: [] }; return gr.g3; };
const hasG3 = () => hasGr();

/* ===== 新物品 ===== */
Object.assign(ITEMS, {
  giant_pumpkin: { n: '巨大南瓜', cat: 'food', w: 8, note: '品評會的寶' }, giant_cabbage: { n: '巨大高麗菜', cat: 'food', w: 5, note: '' }, giant_tomato: { n: '巨大番茄', cat: 'food', w: 2, note: '' }, giant_corn: { n: '巨大玉米', cat: 'food', w: 2, note: '' },
  wok_beef: { n: '快炒三杯雞蛋', cat: 'food', w: 0.3, note: '' }, bbq_corn: { n: '炭烤玉米', cat: 'food', w: 0.3, note: '' }, gas_stew: { n: '紅燒南瓜', cat: 'food', w: 0.4, note: '' }, wok_noodle: { n: '大火炒麵', cat: 'food', w: 0.4, note: '' }
});
Object.assign(FOOD, {
  giant_pumpkin: { sat: 150, mor: 15 }, giant_cabbage: { sat: 90, mor: 10 }, giant_tomato: { sat: 50, mor: 15 }, giant_corn: { sat: 70, mor: 12 },
  wok_beef: { sat: 45, mor: 16, dish: true }, bbq_corn: { sat: 40, mor: 14, dish: true }, gas_stew: { sat: 50, mor: 14, dish: true, warm: true }, wok_noodle: { sat: 60, mor: 15, dish: true }
});
Object.assign(ITEM_EMO, { giant_pumpkin: '🎃', giant_cabbage: '🥬', giant_tomato: '🍅', giant_corn: '🌽', wok_beef: '🥘', bbq_corn: '🌽', gas_stew: '🍲', wok_noodle: '🍜' });
const GIANT = { pumpkin_p: 'giant_pumpkin', cabbage_p: 'giant_cabbage', tomato_p: 'giant_tomato', corn_p: 'giant_corn', gpump_p: 'giant_pumpkin', jcab_p: 'giant_cabbage', ruby_p: 'giant_tomato', rcorn_p: 'giant_corn' };

/* ===== 1. 世界生命感：天氣、光影、髒亂 ===== */
function wxLayer() {
  const sv = S.sv, h = sv.hour, out = [];
  const rain = typeof inRain === 'function' && inRain(sv.day), cold = inCold(sv.day), ty = typeof disasterDays === 'function' && disasterDays().ty.includes(sv.day);
  if (rain || ty) out.push('<div class="wx wx-rain' + (ty ? ' hard' : '') + '"></div>');
  if (cold) out.push('<div class="wx wx-frost"></div>');
  if (h >= 7 && h <= 17) { const p = (h - 7) / 10; out.push('<div class="wx wx-sun" style="left:' + (8 + p * 60).toFixed(0) + '%;opacity:' + (0.10 + Math.sin(p * Math.PI) * 0.12).toFixed(2) + '"></div>'); }
  if (h >= 17 && h <= 18) out.push('<div class="wx wx-dusk"></div>');
  if (sv.hyg != null && sv.hyg < 45) { const n = Math.ceil((45 - sv.hyg) / 7); for (let i = 0; i < n; i++) out.push('<span class="wx-junk" style="left:' + (18 + (i * 37) % 64) + '%;top:' + (38 + (i * 23) % 46) + '%">' + ['🗑️', '🥫', '📰', '🦴', '🧻'][i % 5] + '</span>'); if (sv.hyg < 30) out.push('<span class="wx-fly">🪰</span><span class="wx-fly f2">🪰</span>'); }
  if (sv.hyg >= 90) out.push('<span class="wx-clean">✨</span>');
  return out.join('');
}
const _renderWx = render;
render = function () {
  _renderWx();
  const w = document.querySelector('.rt-wrap:not(.ot)'); if (!w || !S || !S.sv || S.phase !== 'survive') return;
  w.insertAdjacentHTML('beforeend', '<div class="wx-box">' + wxLayer() + '</div>');
  w.classList.toggle('wx-shake', typeof disasterDays === 'function' && disasterDays().ty.includes(S.sv.day) && S.sv.hour >= 18);
};
// 頂樓動物會動
const _roofSVGg3 = roofSVG;
roofSVG = function () {
  let s = _roofSVGg3(); const R = W().roof, fm = F(); let a = '';
  for (let i = 0; i < (R.hens || 0); i++) a += '<text x="' + (30 + i * 22) + '" y="155" font-size="14">🐔<animateTransform attributeName="transform" type="translate" values="0 0;' + (8 + i * 3) + ' 0;' + (8 + i * 3) + ' 2;0 0" dur="' + (3 + i) + 's" repeatCount="indefinite"/></text>';
  for (let i = 0; i < Math.min(4, fm.rabbits || 0); i++) a += '<text x="' + (200 + i * 18) + '" y="162" font-size="13">🐇<animateTransform attributeName="transform" type="translate" values="0 0;6 -8;12 0;6 0;0 0" dur="' + (2.2 + i * 0.4) + 's" repeatCount="indefinite"/></text>';
  if (fm.hive || R.hive) for (let i = 0; i < 3; i++) a += '<text font-size="9">🐝<animateMotion dur="' + (4 + i) + 's" repeatCount="indefinite" path="M' + (250 + i * 6) + ' 80 q30 -30 50 0 q-20 30 -50 0"/></text>';
  return a ? s.replace(/<\/svg>\s*$/, a + '</svg>') : s;
};

/* ===== 2. 廚具升級 ===== */
const STOVES = [null, { n: '微波爐', ic: '📦' }, { n: '瓦斯爐', ic: '🔥', c: { metal: 4, diesel: 1 }, coin: 40, d: '料理更容易優良 +3%，解鎖紅燒南瓜' }, { n: '炭烤爐', ic: '🍢', c: { metal: 6, board: 6, clay: 4 }, coin: 90, d: '再 +3%，解鎖炭烤玉米、每道多 1 份' }, { n: '中式快炒爐', ic: '🥘', c: { metal: 8, glass: 2, cell: 2 }, coin: 180, d: '再 +3%，解鎖快炒料理、大火炒麵' }];
Object.assign(DISHES, {
  gas_stew: { lv: 2, need: { pumpkin_p: 1, soy: 1 }, q: 3, power: 0.2, stove: 2 },
  bbq_corn: { lv: 2, need: { corn_p: 2, honey: 1 }, q: 3, power: 0, stove: 3 },
  wok_beef: { lv: 3, need: { egg: 2, basil_p: 1, chili_p: 1 }, q: 2, power: 0.3, stove: 4 },
  wok_noodle: { lv: 3, need: { flour: 2, cabbage_p: 1, egg: 1 }, q: 3, power: 0.3, stove: 4 }
});
const stoveLv = () => hasG3() ? G3().stove : 1;
const _dishOkG3 = dishOk;
dishOk = function (k) { const D = DISHES[k]; if (D && D.stove && stoveLv() < D.stove) return false; return _dishOkG3(k); };
Object.assign(SACT, { stUp() { const g = G3(), N = STOVES[g.stove + 1], bz = BZ(); if (!N) return; if (bz.coin < N.coin) { slog('瓶蓋不夠。'); render(); return; } if (!payN(N.c)) { slog('材料不夠：' + needTxt(N.c).replace(/<[^>]+>/g, '')); render(); return; } bz.coin -= N.coin; g.stove++; slog('🔥 廚房升級成' + N.n + '！' + N.d + '。', true); sfx('ach'); render(); } });
const _kitchenG3 = kitchenHTML;
kitchenHTML = function () {
  let h = _kitchenG3(); if (!hasG3()) return h;
  const g = G3(), N = STOVES[g.stove + 1];
  const head = '<div class="g3-stove">' + STOVES[g.stove].ic + ' <b>' + STOVES[g.stove].n + '</b>' + (N ? '<span class="meta">下一級：' + N.n + ' · ' + needTxt(N.c) + '、🪙 ' + N.coin + '</span><button class="btn ghost" data-a="stUp">升級</button>' : '<span class="meta">已經是最高級廚具</span>') + '</div>';
  const lock = Object.keys(DISHES).filter(k => DISHES[k].stove && stoveLv() < DISHES[k].stove).map(k => ITEMS[k].n + '（' + STOVES[DISHES[k].stove].n + '）');
  return head + h + (lock.length ? '<p class="meta">🔒 換更好的廚具才能做：' + lock.join('、') + '</p>' : '');
};

/* ===== 3. 新鮮食材加成 ===== */
const _qRollG3 = qRoll;
qRoll = function (k, n) {
  const [g, e] = _qRollG3(k, n); if (!hasG3() || !FOOD[k] || !FOOD[k].dish) return [g, e];
  let p = (stoveLv() - 1) * 0.03;
  const D = DISHES[k]; if (D && (S.sv.fresh || []).some(f => D.need[f.k] && f.life >= (FRESH_LIFE[f.k] || 9) - 1)) p += 0.15;
  const Q = BZ().qual[k]; let up = 0, ex = 0; for (let i = 0; i < n - g - e; i++) { const r = rnd(); if (r < p * 0.3) ex++; else if (r < p) up++; }
  Q[0] += up; Q[1] += ex; return [g + up, e + ex];
};
const _cookxG3 = SACT.cookx;
SACT.cookx = function (k) { const h0 = S.sv ? sv_has(k) : 0; _cookxG3(k); if (S.sv && DISHES[k] && sv_has(k) > h0 && stoveLv() >= 3) addIt(k, 1); };

/* ===== 4. 種植：溫室溫控、授粉、病蟲害、巨大作物 ===== */
const ZONES = { none: ['不調整', []], cool: ['❄️ 涼爽', ['cabbage_p', 'scallion_p', 'straw_p', 'rape_p', 'jcab_p', 'sprout_p', 'tea_p']], warm: ['☀️ 溫暖', ['tomato_p', 'chili_p', 'corn_p', 'basil_p', 'ruby_p', 'gtom_p', 'rcorn_p', 'cane_p']], wet: ['💧 潮濕', ['taro_p', 'yam_p', 'pumpkin_p', 'gpump_p', 'pyam_p', 'peanut_p', 'wheat_p']] };
const FLOWER = ['straw_p', 'pumpkin_p', 'tomato_p', 'chili_p', 'ruby_p', 'gtom_p', 'gpump_p', 'corn_p'];
const PESTS = { aphid: ['🪲 蚜蟲', '葉子背面一堆綠色小蟲', '驅蟲香、手抓'], worm: ['🐛 菜蟲', '葉子被啃出洞', '手抓最有效'], mildew: ['🍂 白粉病', '葉子上一層白粉', '剪掉病葉、保持通風（翻土）'], rot: ['🥀 根腐病', '整株軟掉', '少澆水、施肥補強'] };
SACT.zoneSet = function (v) { if (ZONES[v]) { G3().zone = v; slog('溫室調成' + ZONES[v][0] + '。'); render(); } };

/* ===== 5. 經營：店面升級、熟客、外送、套餐、季節菜單 ===== */
const SHOPUP = {
  sign: ['🪧 木頭招牌', '每天多 1 位客人', { board: 3 }, 30], seats: ['🪑 內用座位', '客人可以內用，每份多付 20%', { board: 6, metal: 2 }, 60],
  fridge: ['🧊 展示冷藏櫃', '新鮮食物在店裡不會壞（賣價 +10%）', { metal: 4, glass: 2, cell: 1 }, 80], neon: ['🌈 霓虹燈', '晚上也有客人（再多 2 位）', { glass: 3, cell: 2 }, 120]
};
const REGS = [{ n: '修車的老王', ic: '🧔', fav: 'dish', t: '愛吃熱炒' }, { n: '護理師小林', ic: '👩‍⚕️', fav: 'soup', t: '愛喝湯' }, { n: '放學的阿弟', ic: '👦', fav: 'sweet', t: '愛吃甜的' }, { n: '阿嬤', ic: '👵', fav: 'veg', t: '愛吃青菜' }, { n: '健身哥', ic: '💪', fav: 'egg', t: '愛吃蛋白質' }];
const favOk = (f, k) => f === 'dish' ? !!(FOOD[k] && FOOD[k].dish) : f === 'soup' ? /soup|stew|chowder|congee/.test(k) : f === 'sweet' ? ['honey_yam', 'taro_ball', 'egg_tart', 'yam_ball', 'mooncake', 'jam', 'fruit_dry', 'straw_p'].includes(k) : f === 'veg' ? Object.values(SEED_OUT).includes(k) || k === 'veg' : ['egg', 'duck_egg', 'tomato_omelet', 'shrimp_egg', 'salted_egg', 'tea_egg', 'rabbit_m', 'fish'].includes(k);
const SET_SOUP = k => /soup|stew|chowder|congee/.test(k) && sv_has(k) > 0;
const SET_DRINK = k => (BREWS[k] || ['juice', 'black_tea', 'mint_tea', 'ginger_tea', 'goat_milk', 'cane_juice', 'kombucha'].includes(k)) && sv_has(k) > 0;
function setPick() { const ks = Object.keys(ITEMS).filter(k => sv_has(k) > 0); const main = ks.find(k => FOOD[k] && FOOD[k].dish && !SET_SOUP(k)), soup = ks.find(SET_SOUP), drink = ks.find(SET_DRINK); return main && soup && drink ? [main, soup, drink] : null; }
const inSeasonDish = k => { const D = DISHES[k] || (typeof LAB === 'object' && LAB[k] ? { need: Object.fromEntries(LAB[k].ing.map(m => [m, 1])) } : null); return !!D && grOn('season') && Object.keys(D.need).some(m => SEASON_CROP[season()].includes(m)); };
const _valG3 = valOf;
valOf = function (k) { let v = _valG3(k); if (hasG3()) { if (inSeasonDish(k)) v *= 1.3; if (G3().shopUp.fridge && FRESH_LIFE[k]) v *= 1.1; } return Math.round(v); };
Object.assign(SACT, {
  suBuy(k) { const U = SHOPUP[k], g = G3(), bz = BZ(); if (!U || g.shopUp[k]) return; if (bz.coin < U[3]) { slog('瓶蓋不夠。'); render(); return; } if (!payN(U[2])) { slog('材料不夠。'); render(); return; } bz.coin -= U[3]; g.shopUp[k] = true; slog('🏪 店面升級：' + U[0] + '！' + U[1] + '。'); sfx('ach'); render(); },
  setServe(i) { const g = G3(), c = g.sets[Number(i)], P = setPick(); if (!c || c.done || !P) return; let coin = 0; for (const k of P) { const t = takeBest(k); coin += valOf(k) * qMul[t]; } coin = Math.round(coin * 1.4 * (g.shopUp.seats ? 1.2 : 1)); c.done = true; c.got = P; BZ().coin += coin; BZ().rep += 3; GR().stats.coin += coin; gainXp('shop', 3); slog('🍱 ' + c.n + '點了套餐：' + P.map(k => ITEMS[k].n).join('＋') + '，付了 ' + coin + ' 瓶蓋！'); sfx('buy'); render(); },
  dlvGo(v) {
    const g = G3(), [k, q] = v.split(':'), n = Number(q), sv = S.sv; if (g.deliv || sv_has(k) < n) return;
    const staff = GR().staff.length > 0; if (!staff && !canAct(3, 12)) { slog('自己送要 3 小時、體力 12。'); render(); return; }
    let val = 0; for (let i = 0; i < n; i++) { const t = takeBest(k); val += valOf(k) * qMul[t]; }
    g.deliv = { k, n, val: Math.round(val * 1.8), day: sv.day + 1, who: staff ? GR().staff[0].n : '你' };
    if (!staff) { sv.sta -= 12; passHours(3); slog('🛵 你騎著腳踏車把 ' + n + ' 份' + ITEMS[k].n + '送去東區避難所，明天結帳。'); } else slog('🛵 ' + g.deliv.who + '出發外送 ' + n + ' 份' + ITEMS[k].n + '，明天回來。');
    render();
  }
});
const _serveG3 = SACT.bzServe;
SACT.bzServe = function (i) {
  const bz = BZ(), c = bz.cust[Number(i)], was = c && c.done, c0 = bz.coin; _serveG3(i);
  if (!c || was || !c.done || !hasG3()) return; const g = G3();
  if (g.shopUp.seats) { const add = Math.round((bz.coin - c0) * 0.2); bz.coin += add; }
  if (c.reg != null) { const R = REGS[c.reg], a = (g.regs[c.reg] = (g.regs[c.reg] || 0) + (favOk(R.fav, c.want) ? 2 : 1)); if (a >= 5 && !(g.regs['g' + c.reg])) { g.regs['g' + c.reg] = 1; const gift = ['fert', 'gtom', 'fineplate', 'honey', 'cell'][c.reg]; addIt(gift, 1); slog('💝 ' + R.n + '跟你變熟了，送你一個' + ITEMS[gift].n + '！'); } if (a >= 12 && g.regs['g' + c.reg] === 1) { g.regs['g' + c.reg] = 2; BZ().coin += 80; slog('💝 ' + R.n + '說你是他在末日裡最喜歡的店，包了 80 瓶蓋紅包。', true); } }
};

/* ===== 6. 長期：統計、年度、傳承、徽章、第二塊地、每日禮物 ===== */
const BADGES = [
  ['🌾', '作物收藏家', () => CROPS().every(k => J.cdx && J.cdx[k] != null)], ['🍳', '料理大全', () => Object.keys(DISHES).filter(k => !DISHES[k].fest).every(k => J.cdx && J.cdx[k] != null)],
  ['📖', '食譜研究家', () => Object.keys(LAB).every(k => (J.labBook || {})[k])], ['✨', '極品之手', () => Object.values(J.cdx || {}).filter(q => q === 2).length >= 30],
  ['🏆', '冠軍', () => (J.trophies || []).some(t => t.m === 1)], ['🎃', '巨人農夫', () => ['giant_pumpkin', 'giant_cabbage', 'giant_tomato', 'giant_corn'].every(k => J.cdx && J.cdx[k] != null)],
  ['💝', '人氣老闆', () => hasG3() && REGS.every((r, i) => (G3().regs[i] || 0) >= 5)]
];
Object.assign(SACT, {
  f2Buy() { const g = G3(), bz = BZ(); if (g.farm2 || !isForever()) return; if (bz.coin < 400) { slog('要 400 瓶蓋。'); render(); return; } if (!payN({ board: 20, metal: 8 })) { slog('要木板 20、鐵片 8 整理隔壁。'); render(); return; } bz.coin -= 400; g.farm2 = true; slog('🏡 買下隔壁的空屋，整理成第二塊農地！多 8 個種植位，每天自己長一些作物。', true); sfx('ach'); render(); }
});
const _slotsG3 = slots;
slots = function () { const s = _slotsG3(); if (S.sv && S.sv.w && S.sv.w.fm && S.sv.w.fm.gr && S.sv.w.fm.gr.g3 && S.sv.w.fm.gr.g3.farm2) s.green += 8; return s; };
// 每日登入禮物（永久模式，按真實日期）
function loginGift() {
  if (!isForever() || !S.sv) return; const today = new Date().toISOString().slice(0, 10), L = J.login || (J.login = { last: '', streak: 0 }); if (L.last === today) return;
  const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10); L.streak = L.last === y ? L.streak + 1 : 1; L.last = today;
  const n = Math.min(7, L.streak), gifts = [['fert', 1], ['wheat', 2], ['fry', 3], ['clay', 3], ['honey', 1], ['cell', 1], ['gtom', 1]];
  const [k, q] = gifts[(n - 1) % gifts.length]; addIt(k, q); if (S.sv.w && S.sv.w.fm && S.sv.w.fm.bz) BZ().coin += 10 * n; saveJournal();
  if (typeof ntToast === 'function') ntToast('🎁 連續第 ' + L.streak + ' 天上線：' + ITEMS[k].n + ' ×' + q + (S.sv.w.fm && S.sv.w.fm.bz ? '、' + 10 * n + ' 瓶蓋' : ''), 'g');
  slog('🎁 今天的上線禮物：' + ITEMS[k].n + ' ×' + q + '（連續 ' + L.streak + ' 天）。');
}
const _renderGift = render;
render = function () { _renderGift(); if (S && S.phase === 'survive' && !UI.__gift) { UI.__gift = true; setTimeout(() => { try { loginGift(); } catch (e) {} }, 800); } };
// 傳承：結束時留一樣東西給下一輪
const HEIR_OK = k => ITEMS[k] && (SEED_OUT[k] || ['fineplate', 'quilt', 'medkit', 'gen', 'solar', 'honey', 'fert', 'jar', 'bowl', 'plate'].includes(k));
const _viewEndG3 = viewEnd;
viewEnd = function () {
  if (!S.runId) S.runId = Date.now(); let h = _viewEndG3(); const sv = S.sv; if (!sv || !sv.st) return h;
  const opts = Object.keys(sv.st).filter(k => sv.st[k] > 0 && HEIR_OK(k)).slice(0, 12);
  const pick = J.heir && J.heir.from === S.runId ? J.heir : null;
  const box = '<div class="sheet heir"><b>🎁 傳承：留一樣東西給下一輪</b>' + (pick ? '<p class="note">已留下：' + ITEMS[pick.k].n + ' ×' + pick.q + '。下一輪開始會出現在家裡。</p>' : '<p class="note">選一樣，下一輪生存期一開始就會有。</p><div class="gr-chips">' + opts.map(k => '<button class="gr-chip" data-a="heirPick" data-v="' + k + '">' + itemIc(k) + ITEMS[k].n + '</button>').join('') + (opts.length ? '' : '<span class="meta">沒有可以傳承的東西</span>') + '</div>') + '</div>';
  const i = h.lastIndexOf('</main>'); return i > 0 ? h.slice(0, i) + box + h.slice(i) : h + box;
};
ACT.heirPick = function (k) { const sv = S.sv; if (!sv || !HEIR_OK(k)) return; J.heir = { k, q: Math.min(sv.st[k], SEED_OUT[k] ? 3 : 1), from: S.runId }; saveJournal(); render(); };
const _startSvG3 = startSurvive;
startSurvive = function () { _startSvG3(); if (!S.runId) S.runId = Date.now(); const H = J.heir; if (H && H.from !== S.runId && S.sv) { S.sv.st[H.k] = (S.sv.st[H.k] || 0) + H.q; slog('🎁 上一輪留下來的' + ITEMS[H.k].n + ' ×' + H.q + '，就放在桌上。', true); J.heir = null; saveJournal(); } };

/* ===== 每晚：收成加成（溫室、授粉、巨大作物）、病蟲、熟客、套餐、外送、第二塊地、統計、年度 ===== */
const _nightG3 = night;
night = function (watch) {
  const ok = S && S.sv && S.phase === 'survive' && hasG3(), d0 = ok && S.sv.day, snap = {};
  if (ok) for (const k of CROPS()) snap[k] = sv_has(k);
  const coin0 = ok && S.sv.w.fm.bz ? BZ().coin : 0, st0 = ok ? Object.assign({}, GR().stats) : null;
  _nightG3(watch);
  if (!ok || !S.sv || S.phase !== 'survive' || S.sv.day === d0) return;
  const sv = S.sv, g = G3(), gr = GR(), bz = BZ(), ex = [];
  let zb = 0, pb = 0; const hives = (F().hives || 0) + (W().roof && W().roof.hive ? 1 : 0);
  for (const k of CROPS()) { const d = sv_has(k) - (snap[k] || 0); if (d <= 0) continue;
    if (ZONES[g.zone][1].includes(k)) { const n = Math.floor(d * 0.2 + rnd()); if (n) { addIt(k, n); zb += n; } }
    if (hives && FLOWER.includes(k)) { const n = Math.floor(d * 0.08 * hives + rnd() * 0.6); if (n) { addIt(k, n); pb += n; } }
    if (GIANT[k]) for (let i = 0; i < d; i++) if (rnd() < 0.03) { sv_take(k, 1); addIt(GIANT[k], 1); codexMark(GIANT[k], 1); ex.push('🎉 長出一顆' + ITEMS[GIANT[k]].n + '！快拿去品評會。'); }
  }
  if (zb) ex.push('🌡️ 溫室調成' + ZONES[g.zone][0] + '，多收 ' + zb + ' 個。'); if (pb) ex.push('🐝 蜜蜂幫忙授粉，花果類多收 ' + pb + ' 個。');
  if (bz.cust && bizAllowed()) {
    const pool = wantPool(), extra = (g.shopUp.sign ? 1 : 0) + (g.shopUp.neon ? 2 : 0);
    for (let i = 0; i < extra; i++) { const c = CUSTOMERS[Math.floor(rnd() * CUSTOMERS.length)]; bz.cust.push({ ic: c[0], n: c[1], want: pool[Math.floor(rnd() * pool.length)] }); }
    if (bzOpenTab('shop') && rnd() < 0.7) { const ri = Math.floor(rnd() * REGS.length), R = REGS[ri], fav = pool.filter(k => favOk(R.fav, k)); bz.cust.unshift({ ic: R.ic, n: R.n + '（熟客）', want: fav.length ? fav[Math.floor(rnd() * fav.length)] : pool[0], reg: ri }); }
    g.sets = lvOfK('shop') >= 2 ? [{ n: ['上班族', '一家三口', '外地旅人'][Math.floor(rnd() * 3)] }] : [];
  }
  if (g.deliv && sv.day >= g.deliv.day) { const D = g.deliv, r = rnd(); g.deliv = null; let c = D.val; if (r < 0.12) { c = Math.round(c / 2); ex.push('🛵 外送途中遇到殭屍，' + D.who + '丟了一半貨，只收到 ' + c + ' 瓶蓋。'); } else if (r < 0.3) { c = Math.round(c * 1.3); ex.push('🛵 避難所的人很感動，多給小費！外送收入 ' + c + ' 瓶蓋。'); } else ex.push('🛵 外送完成，收入 ' + c + ' 瓶蓋。'); bz.coin += c; gr.stats.coin += c; bz.rep += 2; }
  if (g.farm2) { const cs = CROPS().filter(k => SEASON_CROP[season()].includes(k)), k = cs[Math.floor(rnd() * cs.length)] || 'veg', n = 2 + Math.floor(rnd() * 3); addIt(k, n); ex.push('🏡 隔壁農地收成：' + ITEMS[k].n + ' ×' + n + '。'); }
  const s1 = gr.stats; g.hist.push({ d: sv.day - 1, harvest: s1.harvest - st0.harvest, coin: Math.max(0, bz.coin - coin0), exc: s1.exc - st0.exc, cook: s1.cook - st0.cook }); g.hist = g.hist.slice(-120);
  if (isForever() && (sv.day - 1) % 120 === 0 && sv.day > 1) {
    const yr = (sv.day - 1) / 120, H = g.hist, sum = f => H.reduce((a, x) => a + (x[f] || 0), 0), score = sum('harvest') / 6 + sum('coin') / 60 + sum('exc') * 2 + (J.trophies || []).length * 10;
    const grade = score >= 300 ? 'S' : score >= 180 ? 'A' : score >= 90 ? 'B' : 'C'; (J.years || (J.years = [])).push({ yr, grade, h: sum('harvest'), c: sum('coin'), e: sum('exc') }); saveJournal();
    ex.unshift('🎆 第 ' + yr + ' 年結算：收成 ' + sum('harvest') + '、營收 ' + sum('coin') + '、極品 ' + sum('exc') + ' → 年度評價 ' + grade + '！');
  }
  for (const b of BADGES) { const id = b[1]; if (!(J.badges || {})[id] && b[2]()) { (J.badges || (J.badges = {}))[id] = sv.day; saveJournal(); ex.push('🏅 獲得收藏徽章：' + b[0] + ' ' + id + '！'); } }
  if (UI.morning && UI.morning.day === sv.day) UI.morning.extra = (UI.morning.extra || []).concat(ex); else ex.forEach(t => slog(t));
};

/* ===== 7. 一鍵批次 ===== */
Object.assign(SACT, {
  batchPlant() {
    const sv = S.sv; let n = 0, guard = 40;
    while (freeSlots() > 0 && guard-- > 0) { const A = plantAdvice(), p = A.have[0]; if (!p) break; const s = paSeed(p), f0 = freeSlots(); if (!canAct(1, 5)) break; SACT.plant(s); if (freeSlots() >= f0) break; n++; }
    slog(n ? '🌱 一口氣種了 ' + n + ' 次。' : '沒辦法再種了（沒種子、沒空位或沒體力）。'); render();
  },
  batchCook(k) { let n = 0; while (n < 5 && dishOk(k)) { const h0 = sv_has(k); SACT.cookx(k); if (sv_has(k) <= h0) break; n++; } slog(n ? '🍳 連續煮了 ' + n + ' 次' + ITEMS[k].n + '。' : '材料、時間或體力不夠。'); render(); },
  batchDeliver() {
    const bz = BZ(); let o = 0, c = 0;
    for (const x of bz.orders.slice()) if (!x.done && x.until >= S.sv.day && canFill(x)) { SACT.bzOrder(x.id); o++; }
    bz.cust.forEach((cu, i) => { if (!cu.done && sv_has(cu.want) > 0) { SACT.bzServe(i); c++; } });
    slog(o || c ? '📦 一鍵出貨：交了 ' + o + ' 張訂單、招呼 ' + c + ' 位客人。' : '現在沒有能交的訂單或客人。'); render();
  }
});
const _paHTMLG3 = plantAdviceHTML;
plantAdviceHTML = function () { const h = _paHTMLG3(); return freeSlots() > 1 && Object.keys(SEED_OUT).some(k => S.sv.st[k] > 0) ? h.replace(/<\/div>$/, '<button class="btn" data-a="batchPlant" style="width:100%;margin-top:6px">🌱 照建議一次種滿（' + freeSlots() + ' 個空位）</button></div>') : h; };
const _kitchenBatch = kitchenHTML;
kitchenHTML = function () { const h = _kitchenBatch(); const ks = Object.keys(DISHES).filter(k => dishOk(k)).slice(0, 6); return ks.length ? h + '<div class="cat">⚡ 一次煮 5 份</div><div class="gr-chips">' + ks.map(k => '<button class="gr-chip" data-a="batchCook" data-v="' + k + '">' + itemIc(k) + ITEMS[k].n + ' ×5</button>').join('') + '</div>' : h; };

/* ===== 8. 自訂快捷列（橫向右側） ===== */
const QB_ALL = { eat: ['🍚', '吃', 'rtQuick', 'eatFull'], drink: ['💧', '喝', 'rtQuick', 'drinkFull'], med: ['💊', '藥箱', 'medOpen'], out: ['🎒', '外出', 'lsOut'], sleep: ['🛏️', '睡覺', 'rtQuick', 'sleep', 'red'], verbs: ['🧭', '我想要', 'verbsOpen'], farm: ['🌾', '農場', 'fmOpen'], biz: ['🏪', '經營', 'bzOpen'], grow: ['🌟', '成長', 'grOpenHub'], cook: ['🍳', '煮飯', 'qbCook'], ship: ['📦', '一鍵出貨', 'batchDeliver'] };
const QB_DEF = ['eat', 'drink', 'med', 'out', 'sleep', 'verbs'];
SACT.qbCook = function () { const id = placedId(['microwave']); if (id) openObj(id); };
SACT.qbOpen = function () { UI.wm = 'qb'; render(); };
SACT.qbTog = function (k) { const L = (UIS.qb || QB_DEF).slice(), i = L.indexOf(k); if (i >= 0) L.splice(i, 1); else if (L.length < 7) L.push(k); UIS.qb = L; saveUI(); render(); };
SACT.qbReset = function () { UIS.qb = null; saveUI(); render(); };
const _lsRightQb = lsRight;
lsRight = function () {
  const sv = S.sv, sg = typeof siegeOf === 'function' && siegeOf(); if (!UIS.qb || sv.out || (sg && !sg.done)) return _lsRightQb().replace('☰<span>選單</span>', '☰<span>選單</span>');
  const need = typeof medUseful === 'function' && medUseful().length > 0;
  return UIS.qb.filter(k => QB_ALL[k]).map(k => { const Q = QB_ALL[k]; return '<button class="ls-btn' + (Q[4] ? ' ' + Q[4] : '') + (k === 'med' && need ? ' glow' : '') + '" data-a="' + Q[2] + '"' + (Q[3] ? ' data-v="' + Q[3] + '"' : '') + '>' + Q[0] + '<span>' + Q[1] + '</span>' + (k === 'med' && need ? '<i class="ls-dot"></i>' : '') + '</button>'; }).join('') + '<button class="ls-btn menu" data-a="lsMenu" data-v="open">☰<span>選單</span></button>';
};
if (!SACT.verbsOpen) SACT.verbsOpen = function () { UI.verbs = true; render(); };
function qbModal() { const L = UIS.qb || QB_DEF; return '<div class="rt-modal" data-a="wmClose"><div class="rt-mbox" data-a="noop"><div class="rt-mh"><span class="rt-mic">⚙️</span><div><b>自訂右側按鈕</b><div class="meta">最多 7 個，依點選順序排列（選單固定在最下面）</div></div></div><div class="gr-chips">' + Object.entries(QB_ALL).map(([k, Q]) => '<button class="gr-chip' + (L.includes(k) ? ' on' : '') + '" data-a="qbTog" data-v="' + k + '">' + Q[0] + ' ' + Q[1] + (L.includes(k) ? ' ' + (L.indexOf(k) + 1) : '') + '</button>').join('') + '</div><div class="row-btns"><button class="btn ghost" data-a="qbReset">恢復預設</button><button class="btn" data-a="wmClose">完成</button></div></div></div>'; }
const _wmHTMLG3 = wmHTML;
wmHTML = function () { return UI.wm === 'qb' ? qbModal() : _wmHTMLG3(); };
const _rtPanelG3 = rtPanel;
rtPanel = function () { return _rtPanelG3().replace('<div class="wm-chips">', '<div class="wm-chips"><button class="pill" data-a="qbOpen">⚙️ 按鈕</button>'); };

/* ===== 9. 成長視窗新增：廚具、溫室、病蟲害、店面、熟客、套餐、外送、統計、徽章、年度、第二塊地 ===== */
GROW.push(
  { k: 'stove', t: 2, ic: '🔥', n: '廚具升級', g: 'kitchen', c: () => chefLv() >= 3, txt: '廚師 Lv.3' },
  { k: 'zone', t: 2, ic: '🌡️', n: '溫室溫控與授粉', g: 'field', c: () => lvOfK('farm') >= 2 && S.sv.day >= 6, txt: '種植 Lv.2、第 6 天' },
  { k: 'shopup', t: 2, ic: '🪧', n: '店面升級與熟客', g: 'biz', c: () => lvOfK('shop') >= 2, txt: '小店 Lv.2' },
  { k: 'deliv', t: 3, ic: '🛵', n: '外送與套餐', g: 'biz', c: () => BZ().rep >= 20, txt: '聲望 20' },
  { k: 'stats', t: 1, ic: '📈', n: '統計圖表', g: 'goal', c: () => S.sv.day >= 4, txt: '撐到第 4 天' },
  { k: 'badge', t: 1, ic: '🏅', n: '收藏徽章', g: 'goal', c: () => S.sv.day >= 3, txt: '撐到第 3 天' },
  { k: 'farm2', t: 4, ic: '🏡', n: '第二塊農地', g: 'home', c: () => isForever() && lvOfK('farm') >= 4, txt: '永久模式、種植 Lv.4' }
);
Object.assign(GR_INTRO, {
  stove: ['廚具一路升級：微波爐 → 瓦斯爐 → 炭烤爐 → 中式快炒爐。', '每級料理更容易優良，還會解鎖新菜。'],
  zone: ['把溫室調成涼爽、溫暖或潮濕，適合的作物多收 20%。', '蜂箱越多，花果類（番茄、草莓、南瓜…）產量越高。'],
  shopup: ['用瓶蓋和材料升級店面：招牌、內用座位、冷藏櫃、霓虹燈。', '熟客會常常來，買到他喜歡的東西好感度加倍，熟了會送禮。'],
  deliv: ['套餐：主菜＋湯＋飲料一起賣，價格 ×1.4。', '外送：把料理送到避難所，隔天結帳，價格 ×1.8；有員工就派員工去。', '當季食材做的料理價格 ×1.3。'],
  stats: ['每天的收成、營收、極品、煮菜次數都會記錄成圖表。', '永久模式每 120 天是一年，年底會結算年度評價。'],
  badge: ['完成各種收藏目標拿徽章，跨輪保留。'],
  farm2: ['買下隔壁空屋當第二塊地：多 8 個種植位，每天自己長出當季作物。']
});
function chartSVG(H, f, col) {
  const W = 300, Hh = 70, v = H.map(x => x[f] || 0), mx = Math.max(1, ...v); if (v.length < 2) return '<p class="meta">再玩幾天就有圖表了。</p>';
  const pts = v.map((y, i) => (10 + i * (W - 20) / (v.length - 1)).toFixed(1) + ',' + (Hh - 8 - y / mx * (Hh - 18)).toFixed(1)).join(' ');
  return '<svg viewBox="0 0 ' + W + ' ' + Hh + '" class="g3-chart"><polyline points="' + pts + '" fill="none" stroke="' + col + '" stroke-width="2.2" stroke-linejoin="round"/><text x="' + (W - 6) + '" y="12" text-anchor="end" font-size="10" fill="' + col + '">最高 ' + Math.round(mx) + '</text></svg>';
}
const _grBodyG3 = grBody;
grBody = function (k) {
  if (!['stove', 'zone', 'pest', 'shopup', 'deliv', 'stats', 'badge', 'farm2'].includes(k)) return _grBodyG3(k);
  const g = G3(), sv = S.sv, bz = BZ(); let h = '';
  if (k === 'stove') { h += STOVES.slice(1).map((s, i) => row(s.ic + ' ' + s.n + (g.stove === i + 1 ? ' ✅ 現在' : g.stove > i + 1 ? ' ✅' : ''), s.d || '基本款', g.stove === i && STOVES[i + 1] ? bt('stUp', null, '升級（' + needTxt(s.c).replace(/<[^>]+>/g, '') + '、🪙' + s.coin + '）', bz.coin >= s.coin) : '')).join(''); }
  if (k === 'zone') { h += '<div class="gr-chips">' + Object.entries(ZONES).map(([z, Z]) => chip('zoneSet', z, Z[0], g.zone === z)).join('') + '</div>' + (g.zone !== 'none' ? '<p class="meta">適合：' + ZONES[g.zone][1].filter(c => ITEMS[c]).map(c => ITEMS[c].n).join('、') + '（收成 +20%）</p>' : '') + row('🐝 授粉', '蜂箱 ' + ((F().hives || 0) + (W().roof && W().roof.hive ? 1 : 0)) + ' 個 · 每個讓花果類多 8%：' + FLOWER.filter(c => ITEMS[c]).map(c => ITEMS[c].n).slice(0, 6).join('、')); }
  if (k === 'pest') h += Object.entries(PESTS).map(([p, P]) => g.pests[p] ? row(P[0], '症狀：' + P[1] + ' · 處理：' + P[2]) : row('❓ ？？？', '還沒遇過')).join('');
  if (k === 'shopup') { h += Object.entries(SHOPUP).map(([u, U]) => row((g.shopUp[u] ? '✅ ' : '') + U[0], U[1] + (g.shopUp[u] ? '' : ' · ' + needTxt(U[2]) + '、🪙 ' + U[3]), g.shopUp[u] ? '' : bt('suBuy', u, '升級', bz.coin >= U[3]))).join('') + '<div class="cat">💝 熟客</div>' + REGS.map((R, i) => { const a = g.regs[i] || 0; return row(R.ic + ' ' + R.n, R.t + ' · 好感 ' + '❤️'.repeat(Math.min(6, Math.ceil(a / 2))) + (a ? '' : '（還沒來過）') + (a >= 12 ? ' · 摯友' : a >= 5 ? ' · 熟了' : '')); }).join(''); }
  if (k === 'deliv') {
    const P = setPick();
    h += '<div class="cat">🍱 套餐客人</div>' + (g.sets.length ? g.sets.map((c, i) => row(c.n + (c.done ? ' ✓' : ''), c.done ? c.got.map(x => ITEMS[x].n).join('＋') : P ? '會配：' + P.map(x => ITEMS[x].n).join('＋') + '（×1.4）' : '缺：' + ['主菜', '湯', '飲料'].filter((_, j) => !(j === 0 ? Object.keys(ITEMS).some(x => sv_has(x) > 0 && FOOD[x] && FOOD[x].dish && !SET_SOUP(x)) : j === 1 ? Object.keys(ITEMS).some(SET_SOUP) : Object.keys(ITEMS).some(SET_DRINK))).join('、'), c.done ? '' : bt('setServe', i, '出餐', !!P))).join('') : '<p class="meta">小店 Lv.2 後，每天早上會有套餐客人。</p>');
    h += '<div class="cat">🛵 外送（價格 ×1.8，隔天結帳）</div>';
    if (g.deliv) h += row('外送中：' + ITEMS[g.deliv.k].n + ' ×' + g.deliv.n, g.deliv.who + '送貨中，預計收 ' + g.deliv.val + ' 瓶蓋');
    else { const ds = Object.keys(ITEMS).filter(x => FOOD[x] && FOOD[x].dish && sv_has(x) >= 3).slice(0, 8); h += ds.length ? ds.map(x => row(itemIc(x) + ITEMS[x].n + ' · 有 ' + sv_has(x), (inSeasonDish(x) ? '🌸 當季 ×1.3 · ' : '') + '一次送 3 份' + (GR().staff.length ? '（派員工）' : '（自己送：3 小時）'), bt('dlvGo', x + ':3', '送', true))).join('') : '<p class="meta">要有 3 份以上同一道料理才能外送。</p>'; }
  }
  if (k === 'stats') { const H = g.hist.slice(-30); h += '<div class="cat">🌾 每天收成</div>' + chartSVG(H, 'harvest', '#6ac04a') + '<div class="cat">🪙 每天營收</div>' + chartSVG(H, 'coin', '#ecd27a') + '<div class="cat">✨ 每天極品</div>' + chartSVG(H, 'exc', '#e07ab0') + '<div class="cat">🍳 每天煮菜</div>' + chartSVG(H, 'cook', '#7ab0e0') + ((J.years || []).length ? '<div class="cat">🎆 年度評價</div>' + J.years.map(y => row('第 ' + y.yr + ' 年 · ' + y.grade, '收成 ' + y.h + '、營收 ' + y.c + '、極品 ' + y.e)).join('') : '<p class="meta">永久模式每 120 天結算一次年度評價。</p>'); }
  if (k === 'badge') h += '<div class="g3-badges">' + BADGES.map(b => { const got = (J.badges || {})[b[1]]; return '<div class="' + (got ? 'on' : '') + '"><span>' + b[0] + '</span><b>' + b[1] + '</b></div>'; }).join('') + '</div><p class="meta">徽章跨輪保留。</p>';
  if (k === 'farm2') h += g.farm2 ? row('🏡 隔壁農地', '多 8 個種植位，每天自己收成當季作物') : row('買下隔壁空屋', '🪙 400、' + needTxt({ board: 20, metal: 8 }), bt('f2Buy', null, '買', bz.coin >= 400));
  return h;
};
const _grSceneG3 = grScene;
grScene = function (k, now) {
  const t = now / 1000, g = hasG3() ? G3() : null;
  if (k === 'stove') { const lv = g.stove, fire = lv >= 2; let s = '<rect width="330" height="96" fill="#4a3a30"/><rect x="100" y="40" width="130" height="50" rx="4" fill="#666"/>' + (fire ? [0, 1, 2, 3, 4].map(i => '<path d="M' + (125 + i * 20) + ' 40 q-6 -' + (12 + Math.sin(t * 8 + i) * 5).toFixed(1) + ' 0 -' + (20 + Math.sin(t * 6 + i) * 6).toFixed(1) + ' q6 8 0 20" fill="' + (lv >= 4 ? '#4ab0ff' : '#f08a24') + '"/>').join('') : '') + '<ellipse cx="165" cy="30" rx="' + (lv >= 4 ? 48 : 40) + '" ry="10" fill="#333"/><text x="165" y="76" text-anchor="middle" font-size="12" fill="#fff">' + STOVES[lv].ic + ' ' + STOVES[lv].n + '</text>'; return grSVG(s, 96, '#4a3a30'); }
  if (k === 'zone') { const z = g.zone, bg = { none: '#cfe3b5', cool: '#cfe6f6', warm: '#f6e0a8', wet: '#b8dcc8' }[z]; let s = '<rect width="330" height="96" fill="' + bg + '"/><path d="M20 90 V30 L165 6 L310 30 V90z" fill="#fff" opacity="0.35" stroke="#8ab"/>'; for (let i = 0; i < 6; i++) s += '<path d="M' + (50 + i * 45) + ' 88 q-6 -18 0 -26 q6 8 0 26" fill="#4a9a3a"/>'; for (let i = 0; i < 3; i++) s += '<text font-size="10">🐝<animateMotion dur="' + (5 + i) + 's" repeatCount="indefinite" path="M' + (60 + i * 80) + ' 60 q30 -30 60 0 q-30 30 -60 0"/></text>'; if (z === 'wet') for (let i = 0; i < 8; i++) { const p = (t * 0.6 + i / 8) % 1; s += '<circle cx="' + (30 + i * 37) + '" cy="' + (20 + p * 60) + '" r="1.5" fill="#5a9ac0"/>'; } s += '<text x="12" y="20" font-size="12" font-weight="800">' + ZONES[z][0] + '</text>'; return grSVG(s, 96, bg); }
  if (k === 'shopup') { const u = g.shopUp; let s = '<rect width="330" height="96" fill="#3a4a5a"/><rect y="70" width="330" height="26" fill="#8a5a3a"/>' + (u.sign ? '<rect x="120" y="6" width="90" height="20" rx="3" fill="#c9a274"/><text x="165" y="20" text-anchor="middle" font-size="11" font-weight="800" fill="#3a2a1a">自家小店</text>' : '') + (u.neon ? '<text x="290" y="30" font-size="13" font-weight="900" fill="#ff6ad5" opacity="' + (0.6 + Math.sin(t * 5) * 0.4).toFixed(2) + '">OPEN</text>' : '') + (u.seats ? [0, 1, 2].map(i => '<text x="' + (30 + i * 40) + '" y="68" font-size="20">🪑</text>').join('') : '') + (u.fridge ? '<rect x="250" y="34" width="50" height="36" fill="#cfe6f6" stroke="#8ab"/>' : ''); REGS.forEach((R, i) => { const a = g.regs[i] || 0; if (a) s += '<text x="' + (150 + i * 22) + '" y="' + (62 - Math.abs(Math.sin(t * 2 + i)) * 4).toFixed(1) + '" font-size="18">' + R.ic + '</text>'; }); return grSVG(s); }
  if (k === 'deliv') { const p = (t * 0.15) % 1; let s = '<rect width="330" height="96" fill="#9ab8c8"/><rect y="70" width="330" height="26" fill="#555"/><line x1="0" y1="83" x2="330" y2="83" stroke="#ddd" stroke-dasharray="12 10"/><text x="300" y="66" font-size="26">🏚️</text><text x="6" y="66" font-size="26">🏠</text>' + (g.deliv ? '<text x="' + (30 + p * 250).toFixed(0) + '" y="78" font-size="22">🛵</text>' : '') + '<text x="165" y="30" text-anchor="middle" font-size="22">🍱</text>'; return grSVG(s, 96, '#9ab8c8'); }
  if (k === 'pest' || k === 'stats' || k === 'badge') return '';
  if (k === 'farm2') { let s = '<rect width="330" height="96" fill="#a9c98a"/><rect x="20" y="20" width="120" height="66" fill="' + (g.farm2 ? '#8a6a4a' : '#bbb') + '"/>'; if (g.farm2) for (let i = 0; i < 8; i++) s += '<path d="M' + (32 + (i % 4) * 28) + ' ' + (44 + Math.floor(i / 4) * 26) + ' q-5 -12 0 -16 q5 4 0 16" fill="#4a9a3a"/>'; s += '<text x="230" y="64" text-anchor="middle" font-size="40">' + (g.farm2 ? '🏡' : '🏚️') + '</text>'; return grSVG(s, 96, '#a9c98a'); }
  return _grSceneG3(k, now);
};
// 通知中心：一鍵出貨
const _ntListG3 = ntList;
ntList = function () { const L = _ntListG3(); const n = L.filter(x => /訂單可以交|客人等你招呼/.test(x.t)).length; if (n >= 2) L.splice(L.findIndex(x => x.lv === 'g'), 0, { lv: 'g', cat: 'biz', ic: '📦', t: '一鍵出貨', sub: '把能交的訂單和客人一次處理完', go: { a: 'batchDeliver' }, badge: 'biz' }); return L; };
