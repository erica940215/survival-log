/* ================= 世界擴充 =================
   頂樓（雞舍、魚菜共生、雨棚、觀星椅）、收藏牆、橘貓、公寓鄰居、無線電、
   夢境與回憶、台灣節日、梅雨與颱風淹水。 */

/* ===== 物品、料理、配方 ===== */
Object.assign(ITEMS, {
  hen:       { n: '母雞', cat: 'farm', w: 2, note: '放進頂樓雞舍 · 每天下 1 顆蛋（要飼料）' },
  egg:       { n: '雞蛋', cat: 'food', w: 0.06, note: '自家雞下的' },
  fish:      { n: '吳郭魚', cat: 'food', w: 0.5, note: '魚菜共生養的' },
  radio_set: { n: '收音機', cat: 'equip', w: 1, note: '修好的收音機 · 可以轉頻道' },
  flare:     { n: '信號彈', cat: 'mat', w: 0.3, note: '在頂樓發射，讓直升機看到' },
  sandbag:   { n: '沙包', cat: 'mat', w: 3, note: '颱風前堆在門口防淹水' },
  tomato_egg:{ n: '番茄炒蛋', cat: 'food', w: 0.3, note: '自己煮的' },
  egg_rice:  { n: '蛋炒飯', cat: 'food', w: 0.3, note: '自己煮的' },
  tea_egg:   { n: '茶葉蛋', cat: 'food', w: 0.2, note: '自己滷的 · 放得久' },
  grill_fish:{ n: '烤魚', cat: 'food', w: 0.3, note: '自己煮的' },
  fish_soup: { n: '鮮魚湯', cat: 'food', w: 0.4, note: '自己煮的 · 熱菜' },
  zongzi:    { n: '粽子', cat: 'food', w: 0.3, note: '端午節包的' },
  tangyuan:  { n: '湯圓', cat: 'food', w: 0.3, note: '冬至煮的 · 熱的' }
});
Object.assign(FOOD, {
  egg: { sat: 15 }, fish: { sat: 25 },
  tomato_egg: { sat: 38, mor: 8, dish: true }, egg_rice: { sat: 45, mor: 8, dish: true }, tea_egg: { sat: 20, mor: 5, dish: true },
  grill_fish: { sat: 40, mor: 9, dish: true }, fish_soup: { sat: 45, mor: 12, dish: true, warm: true },
  zongzi: { sat: 45, mor: 15, dish: true }, tangyuan: { sat: 30, mor: 15, dish: true, warm: true }
});
Object.assign(FRESH_LIFE, { egg: 6, fish: 2, tomato_egg: 2, egg_rice: 2, tea_egg: 4, grill_fish: 1, fish_soup: 1, zongzi: 3, tangyuan: 1 });
Object.assign(DISHES, {
  tomato_egg: { lv: 1, need: { egg: 2, tomato_p: 1 }, q: 2, power: 0.3 },
  egg_rice:   { lv: 1, need: { rice_c: 2, egg: 1, scallion_p: 1 }, q: 3, power: 0.3 },
  tea_egg:    { lv: 2, need: { egg: 3, wu: 1 }, q: 3, power: 0.4 },
  grill_fish: { lv: 2, need: { fish: 1, scallion_p: 1 }, q: 2, power: 0.3 },
  fish_soup:  { lv: 3, need: { fish: 1, wu: 2, basil_p: 1 }, q: 3, power: 0.4 },
  zongzi:     { lv: 1, need: { rice: 1, sausage: 1 }, q: 3, power: 0.4, fest: 'duanwu' },
  tangyuan:   { lv: 1, need: { rice: 1, wu: 1 }, q: 4, power: 0.3, fest: 'winter' }
});
for (const k of ['tomato_egg', 'egg_rice', 'tea_egg', 'grill_fish', 'fish_soup', 'zongzi', 'tangyuan']) { const D = DISHES[k]; COOKS[k] = { n: ITEMS[k].n, d: Object.entries(D.need).map(([m, n]) => (m === 'wu' ? '水' : ITEMS[m].n.replace(/（.*）/, '')) + '×' + n).join('、') + ' → ' + D.q + ' 份', power: D.power }; }
Object.assign(ITEM_EMO, { hen: '🐔', egg: '🥚', fish: '🐟', radio_set: '📻', flare: '🧨', sandbag: '🧱', tomato_egg: '🍳', egg_rice: '🍳', tea_egg: '🥚', grill_fish: '🐟', fish_soup: '🍲', zongzi: '🍙', tangyuan: '🍡' });
Object.assign(RECIPES, {
  radio_fix: { n: '修好收音機', need: { metal: 1, plastic: 2 }, h: 2, out: { radio_set: 1 }, base: true, d: '可以轉頻道收聽廣播' },
  flare:     { n: '信號彈', need: { alcohol: 1, plastic: 1, metal: 1 }, h: 1, out: { flare: 1 }, base: true, d: '頂樓發射，讓直升機看到你' },
  sandbag:   { n: '沙包', need: { plastic: 2, board: 1 }, h: 1, out: { sandbag: 1 }, base: true, d: '颱風前堆在門口，防止淹水' }
});
Object.assign(STORES.farm.items, { hen: [80, 3] });
if (LOCS.school) for (const c of LOCS.school.cont) if (Array.isArray(c.loot)) { c.loot.push(['hen', 1, 1, 3]); break; }
// 有節日限定的菜，只有那天（前後一天）煮得出來
const _dishOkFest = dishOk;
dishOk = function (k) { const D = DISHES[k]; if (D && D.fest && festToday() !== D.fest) return false; return _dishOkFest(k); };
const _kitchenFest = kitchenHTML;
kitchenHTML = function () {
  const saved = {}; for (const [k, D] of Object.entries(DISHES)) if (D.fest && festToday() !== D.fest) { saved[k] = D; delete DISHES[k]; }
  const h = _kitchenFest(); Object.assign(DISHES, saved); return h;
};

/* ===== 共用 ===== */
const W = () => {
  const sv = S.sv;
  if (!sv.w) sv.w = { roof: { built: false, coop: false, hens: 0, feed: 0, fish: false, fishAcc: 0, shelter: false, chair: false, star: 0 }, coll: [], cat: { st: 'none', seen: 0, fed: 0, pet: -1 }, nb: {}, radio: { day: {}, prog: {}, sis: false }, dream: { i: 0, faced: 0 }, notes: [] };
  return sv.w;
};
function wmNote(txt) { W().notes.push(txt); }
function endEarly(e, cause) {
  const sv = S.sv;
  chron(sv.day, '結局「' + ENDINGS[e].n + '」：' + ENDINGS[e].d, 'good');
  J.endings[e] = true; saveJournal();
  UI.wm = null;
  finishRun({ days: sv.day, cause, causeKey: '', timeline: sv.chron, stats: null, hordesSeen: sv.hordesSeen, coldSeen: sv.coldSeen, rainSeen: sv.rainSeen, ending: e, canEndless: false });
  render();
}
Object.assign(ENDINGS, {
  heli: { n: '直升機', d: '信號彈在夜空炸開。螺旋槳的聲音越來越近，你抓著繩梯，看著住了好久的屋頂越來越小。' },
  boat: { n: '海星號', d: '你帶著柴油和食物趕到港口，老船長咧嘴一笑。船駛離岸邊時，城市在霧裡慢慢消失。' },
  reunion: { n: '重逢', d: '你照著妹妹在無線電裡說的位置一路走過去。門打開的那一刻，你們抱在一起哭了很久。' }
});
function useTime(h, sta) { if (!canAct(h, sta || 0)) return false; S.sv.sta -= sta || 0; passHours(h); return true; }
function payNeed(need) { const st = S.sv.st; if (!Object.entries(need).every(([m, n]) => (st[m] || 0) >= n)) return false; for (const [m, n] of Object.entries(need)) { st[m] -= n; if (!st[m]) delete st[m]; } return true; }
const needTxt = need => Object.entries(need).map(([m, n]) => itemIc(m) + ITEMS[m].n.replace(/（.*）/, '') + '×' + n + '<small>（有 ' + (S.sv.st[m] || 0) + '）</small>').join(' ');

/* ===== 節日 ===== */
const FEST = { 12: 'duanwu', 38: 'midautumn', 62: 'winter', 80: 'newyear' };
const FEST_N = { duanwu: '端午節', midautumn: '中秋節', winter: '冬至', newyear: '除夕' };
const FEST_TIP = { duanwu: '可以用米和火腿腸包粽子（廚房）。', midautumn: '有頂樓的話，可以上去烤肉賞月。', winter: '可以煮湯圓（廚房）。', newyear: '今晚吃頓好的（心態 +15 以上的料理）就是年夜飯，不然會很想家。' };
function festToday() { const d = S.sv.day; for (const [k, v] of Object.entries(FEST)) { const n = Number(k); if (d >= n && d <= n + 1) return v; } return null; }

/* ===== 頂樓 ===== */
const ROOF_PARTS = {
  coop:    { n: '雞舍', need: { board: 6, metal: 2 }, d: '放母雞進去，每天下蛋' },
  fish:    { n: '魚菜共生', need: { barrel: 1, plastic: 3, metal: 1 }, d: '每 3 天一條魚，種植位 +2（每天 0.3 度電）' },
  shelter: { n: '雨棚', need: { board: 4, plastic: 2 }, d: '下雨天多接 4 份水' },
  chair:   { n: '觀星椅', need: { board: 2 }, d: '晚上 8 點後上來看星星，心態 +12' }
};
const _slotsRoof = slots;
slots = function () { const s = _slotsRoof(); if (S.sv && S.sv.w && S.sv.w.roof.fish) s.green += 2; return s; };
Object.assign(SACT, {
  roofBuild() { const R = W().roof; if (R.built) return; if (!canAct(3, 15)) { slog('時間或體力不夠。'); render(); return; } if (!payNeed({ board: 6, metal: 4 })) { slog('要木板 6、鐵片 4 才能把頂樓整理出來。'); render(); return; } R.built = true; slog('你清掉頂樓的雜物、補好欄杆。這裡可以種東西、養雞，晚上還看得到星星。', true); useTime(3, 15); render(); },
  roofMake(k) { const R = W().roof, P = ROOF_PARTS[k]; if (!P || R[k] || !R.built) return; if (!canAct(2, 10)) { slog('時間或體力不夠。'); render(); return; } if (!payNeed(P.need)) { slog('材料不夠：' + P.n + '。'); render(); return; } R[k] = true; slog('在頂樓做好了' + P.n + '。'); sfx('fix'); useTime(2, 10); render(); },
  roofHen() { const R = W().roof, st = S.sv.st; if (!R.coop || !(st.hen > 0) || R.hens >= 4) return; const n = Math.min(st.hen, 4 - R.hens); st.hen -= n; if (!st.hen) delete st.hen; R.hens += n; slog('把 ' + n + ' 隻母雞放進雞舍，咕咕咕。'); render(); },
  roofFeed() { const R = W().roof, sv = S.sv; if (sv.st.rice > 0) { sv.st.rice--; if (!sv.st.rice) delete sv.st.rice; R.feed += 10; slog('倒了一袋米當飼料（夠雞吃 10 天份）。'); } else if (vegPool() >= 2) { takeFrom(VEGGIES, 2); R.feed += 3; slog('拿菜葉餵雞（3 天份）。'); } else slog('沒有米或菜可以餵雞。'); render(); },
  roofStar() {
    const sv = S.sv, R = W().roof; if (!R.chair || R.star === sv.day || sv.hour < 20) return;
    if (inRain(sv.day)) { slog('下雨了，看不到星星。'); render(); return; }
    R.star = sv.day; const pal = (sv.dog && sv.dog.state === 'pet') || W().cat.st === 'pet';
    sv.mor = clamp(sv.mor + 12 + (pal ? 4 : 0)); slog('你躺在頂樓的椅子上看星星' + (pal ? '，毛小孩窩在旁邊' : '') + '。城市一片漆黑，星星反而特別亮。心態 +' + (12 + (pal ? 4 : 0)) + '。');
    useTime(1, 0); render();
  },
  roofBbq() {
    const sv = S.sv, R = W().roof; if (!R.built || festToday() !== 'midautumn' || R.bbq === sv.day) return;
    if (!(sv_has('sausage') >= 2)) { slog('烤肉至少要 2 根火腿腸。'); render(); return; }
    sv_take('sausage', 2); R.bbq = sv.day; sv.sat = clamp(sv.sat + 40); sv.mor = clamp(sv.mor + 22);
    const guests = Object.values(W().nb).filter(n => n.home).length; if (guests) sv.mor = clamp(sv.mor + 5);
    slog('中秋節，你在頂樓烤火腿腸' + (guests ? '，和室友們一起' : '') + '。月亮很圓。飽足 +40、心態 +' + (22 + (guests ? 5 : 0)) + '。', true);
    useTime(1, 0); render();
  },
  roofFlare() {
    const sv = S.sv, R = W().roof, Rd = W().radio;
    if (!R.built || !(sv.st.flare > 0) || !Rd.heli || sv.day < Rd.heli || sv.hour < 19) return;
    sv.st.flare--; endEarly('heli', '第 ' + sv.day + ' 天夜裡，你在頂樓發射信號彈，被直升機接走了。');
  }
});
function roofSVG() {
  const R = W().roof, sv = S.sv, night = sv.hour >= 19 || sv.hour < 6;
  let s = '<svg viewBox="0 0 320 170" class="roof-svg"><rect width="320" height="170" fill="' + (night ? '#141a26' : '#9cc7e6') + '"/>';
  const bgk = night ? 'b_roof_night' : 'b_roof_day';
  if (typeof SPR === 'object' && SPR[bgk] && R.built) { s += '<image href="' + SPR[bgk] + '" x="0" y="0" width="320" height="170" preserveAspectRatio="xMidYMid slice"/>'; s += roofObjs(R); return s + '</svg>'; }
  if (night) for (let i = 0; i < 28; i++) s += '<circle cx="' + ((i * 97) % 320) + '" cy="' + ((i * 53) % 60 + 4) + '" r="' + (i % 3 ? 0.8 : 1.4) + '" fill="#fff" opacity="0.8"/>';
  else s += '<circle cx="270" cy="26" r="14" fill="#ffe08a"/>';
  s += '<rect x="0" y="70" width="320" height="100" fill="#a9a196"/>';
  for (let x = 0; x < 320; x += 40) for (let y = 70; y < 170; y += 25) s += '<rect x="' + x + '" y="' + y + '" width="40" height="25" fill="none" stroke="#968e83" stroke-width="1"/>';
  s += '<rect x="0" y="64" width="320" height="8" fill="#6d665d"/>';
  if (!R.built) return s + '<rect x="40" y="95" width="60" height="30" fill="#7b6a55"/><rect x="180" y="110" width="80" height="20" fill="#6a5f52"/><text x="160" y="160" text-anchor="middle" font-size="12" fill="#2b2b2b">堆滿雜物的頂樓</text></svg>';
  if (R.coop && !(typeof SPR === 'object' && SPR.b_coop)) { s += '<polygon points="20,110 60,88 100,110" fill="#a0522d"/><rect x="28" y="110" width="64" height="40" fill="#c9a27a" stroke="#5a3e2a"/><rect x="52" y="124" width="16" height="26" fill="#5a3e2a"/>'; for (let i = 0; i < R.hens; i++) s += '<g transform="translate(' + (34 + i * 16) + ' 160)"><ellipse rx="7" ry="5" fill="#fff" stroke="#5a3e2a"/><circle cx="6" cy="-4" r="3" fill="#fff" stroke="#5a3e2a"/><path d="M6 -8 l1 -3 l2 3z" fill="#d6322a"/></g>'; }
  if (R.fish && !(typeof SPR === 'object' && SPR.b_fishtank)) s += '<rect x="120" y="96" width="70" height="34" rx="4" fill="#5f9fd0" stroke="#2b4a66"/><rect x="120" y="86" width="70" height="12" fill="#6a9e52"/><path d="M140 112 q6 -5 12 0 q-6 5 -12 0z M160 120 q6 -5 12 0 q-6 5 -12 0z" fill="#f0a35a"/>';
  if (R.shelter && !(typeof SPR === 'object' && SPR.b_shelter)) s += '<rect x="210" y="80" width="90" height="10" fill="#d6322a"/><rect x="210" y="80" width="90" height="10" fill="url(#stripe)"/><rect x="214" y="90" width="3" height="40" fill="#555"/><rect x="293" y="90" width="3" height="40" fill="#555"/><rect x="240" y="120" width="30" height="20" fill="#3b6fa8"/>';
  if (R.chair && !(typeof SPR === 'object' && SPR.b_starchair)) s += '<rect x="226" y="146" width="44" height="8" rx="3" fill="#b07a4a"/><rect x="262" y="134" width="8" height="14" fill="#b07a4a"/>';
  if (typeof bImg === 'function') { if (R.coop) s += bImg('coop', 12, 72, 96, 84); if (R.fish) s += bImg('fishtank', 112, 70, 90, 66); if (R.shelter) s += bImg('shelter', 206, 64, 102, 78); if (R.chair) s += bImg('starchair', 222, 112, 60, 50); if (R.coop) for (let i = 0; i < R.hens; i++) s += '<g transform="translate(' + (30 + i * 18) + ' 162)"><ellipse rx="7" ry="5" fill="#fff" stroke="#5a3e2a"/><circle cx="6" cy="-4" r="3" fill="#fff" stroke="#5a3e2a"/><path d="M6 -8 l1 -3 l2 3z" fill="#d6322a"/></g>'; }
  return s + '<defs><pattern id="stripe" width="12" height="10" patternUnits="userSpaceOnUse"><rect width="6" height="10" fill="#fff" opacity="0.6"/></pattern></defs></svg>';
}
function roofObjs(R) {
  let s = '';
  if (R.coop) s += bImg('coop', 20, 92, 76, 66); if (R.fish) s += bImg('fishtank', 108, 96, 78, 58); if (R.shelter) s += bImg('shelter', 196, 86, 82, 64); if (R.chair) s += bImg('starchair', 262, 112, 54, 48);
  for (let i = 0; i < (R.hens || 0); i++) s += typeof SPR === 'object' && SPR.hen ? '<image href="' + SPR.hen + '" x="' + (22 + i * 18) + '" y="146" width="22" height="22"/>' : '';
  return s;
}
function roofModal() {
  const R = W().roof, sv = S.sv;
  let h = roofSVG();
  if (!R.built) return h + '<p>頂樓堆滿雜物。整理好可以放雞舍、魚菜共生、雨棚和觀星椅。</p><div class="wm-row"><span>' + needTxt({ board: 6, metal: 4 }) + ' · 3 小時</span><button class="btn" data-a="roofBuild">整理頂樓</button></div>';
  h += '<div class="wm-list">';
  for (const [k, P] of Object.entries(ROOF_PARTS)) h += '<div class="wm-row"><div><b>' + P.n + '</b>' + (R[k] ? ' <span class="tag">已建</span>' : '') + '<div class="meta">' + P.d + '</div>' + (R[k] ? '' : '<div class="meta">' + needTxt(P.need) + ' · 2 小時</div>') + '</div>' + (R[k] ? '' : '<button class="btn" data-a="roofMake" data-v="' + k + '">蓋</button>') + '</div>';
  h += '</div>';
  if (R.coop) h += '<div class="wm-row"><div><b>🐔 雞 ' + R.hens + '/4 隻</b><div class="meta">飼料剩 ' + Math.floor(R.feed) + ' 份（一隻一天吃 1 份）</div></div><div class="row-btns">' + (sv.st.hen > 0 && R.hens < 4 ? '<button class="btn" data-a="roofHen">放雞進去</button>' : '') + '<button class="btn ghost" data-a="roofFeed">餵飼料</button></div></div>';
  if (R.chair) h += '<div class="wm-row"><div><b>🌌 看星星</b><div class="meta">' + (R.star === sv.day ? '今晚看過了' : sv.hour < 20 ? '晚上 8 點以後' : inRain(sv.day) ? '下雨了' : '心態 +12，1 小時') + '</div></div><button class="btn" data-a="roofStar"' + (R.star !== sv.day && sv.hour >= 20 && !inRain(sv.day) ? '' : ' disabled') + '>看星星</button></div>';
  if (festToday() === 'midautumn') h += '<div class="wm-row fest"><div><b>🥮 中秋烤肉</b><div class="meta">火腿腸×2 · 飽足 +40、心態 +22</div></div><button class="btn" data-a="roofBbq"' + (R.bbq === sv.day ? ' disabled' : '') + '>烤肉</button></div>';
  const Rd = W().radio; if (Rd.heli && sv.day >= Rd.heli) h += '<div class="wm-row fest"><div><b>🚁 發射信號彈</b><div class="meta">軍方說會在晚上巡航 · 要有信號彈（工作台做）· 晚上 7 點後</div></div><button class="btn red" data-a="roofFlare"' + (sv.st.flare > 0 && sv.hour >= 19 ? '' : ' disabled') + '>發射</button></div>';
  return h;
}

/* ===== 收藏牆 ===== */
const COLL = [
  { k: 'c1', set: '漫畫', n: '《末日小廚》第 1 集', t: '封面被雨淋濕了，主角拿著鍋鏟對抗喪屍。' },
  { k: 'c2', set: '漫畫', n: '《末日小廚》第 2 集', t: '主角在超市屋頂種番茄。好像在哪看過這場景。' },
  { k: 'c3', set: '漫畫', n: '《末日小廚》第 3 集', t: '最後一頁被撕掉了，只剩一句「明天也要好好吃飯」。' },
  { k: 'c4', set: '漫畫', n: '《末日小廚》完結篇', t: '主角開了一家小麵店。全城的倖存者都來排隊。' },
  { k: 'p1', set: '老照片', n: '全家福', t: '一家四口在夜市前比 YA，背景是射氣球的攤位。' },
  { k: 'p2', set: '老照片', n: '畢業照', t: '一整排藍色制服。有人在後面偷偷比了兔耳朵。' },
  { k: 'p3', set: '老照片', n: '海邊', t: '墾丁的夕陽，背面寫著「下次還要再來」。' },
  { k: 'p4', set: '老照片', n: '阿嬤的生日', t: '蛋糕上插著 8 跟 0 的蠟燭，阿嬤笑得眼睛都不見了。' },
  { k: 't1', set: '錄音帶', n: '〈海邊的卡帶〉A 面', t: '標籤是手寫的，旁邊畫了一隻小鯨魚。' },
  { k: 't2', set: '錄音帶', n: '〈海邊的卡帶〉B 面', t: '錄到一半有人笑出來，背景有海浪聲。' },
  { k: 't3', set: '錄音帶', n: '學校廣播社', t: '「各位同學早安，今天的天氣是……」' },
  { k: 't4', set: '錄音帶', n: '爸爸的留言', t: '「冰箱裡有滷肉，熱一下就能吃。早點睡。」' },
  { k: 'a1', set: '紀念品', n: '班際拔河冠軍獎狀', t: '一年八班。冠軍。' },
  { k: 'a2', set: '紀念品', n: '捷運悠遊卡', t: '餘額 87 元，卡套上貼著貓咪貼紙。' },
  { k: 'a3', set: '紀念品', n: '夜市彈珠台獎品', t: '一隻有點醜的塑膠恐龍，卻被好好收在盒子裡。' },
  { k: 'a4', set: '紀念品', n: '平安符', t: '媽祖廟求的。紅色的布已經洗到褪色。' }
];
const COLL_SETS = ['漫畫', '老照片', '錄音帶', '紀念品'];
function collAdd(k, why) {
  const w = W(); if (w.coll.includes(k)) return;
  const c = COLL.find(x => x.k === k); w.coll.push(k); S.sv.mor = clamp(S.sv.mor + 2);
  slog((why || '撿到收藏品') + '：' + c.n + '。帶回家掛在牆上（心態 +2）。', true);
  const set = COLL.filter(x => x.set === c.set);
  if (set.every(x => w.coll.includes(x.k))) { S.sv.mor = clamp(S.sv.mor + 15); slog('收集完一整套「' + c.set + '」！心態 +15，之後每天心態 +1。', true); sfx('ach'); }
}
function collRandom() { const left = COLL.filter(c => !W().coll.includes(c.k)); return left.length ? left[Math.floor(rnd() * left.length)].k : null; }
const _searchColl = SACT.search;
SACT.search = function (i) {
  const had = S.sv && S.sv.out;
  _searchColl(i);
  if (had && S.sv && S.sv.out && rnd() < 0.14) { const k = collRandom(); if (k) collAdd(k, '翻到一樣有紀念價值的東西'); }
};
function collModal() {
  const w = W();
  let h = '<p class="meta">外出翻找時有機會撿到。收集完一整套：心態 +15，之後每天心態 +1。（' + w.coll.length + '/' + COLL.length + '）</p>';
  for (const set of COLL_SETS) {
    const items = COLL.filter(c => c.set === set), got = items.filter(c => w.coll.includes(c.k)).length;
    h += '<div class="cat">' + set + '（' + got + '/4）' + (got === 4 ? ' ✨' : '') + '</div><div class="coll-grid">' + items.map(c => w.coll.includes(c.k) ? '<div class="coll on"><b>' + c.n + '</b><span>' + c.t + '</span></div>' : '<div class="coll"><b>？？？</b><span>還沒找到</span></div>').join('') + '</div>';
  }
  return h;
}

/* ===== 橘貓 ===== */
Object.assign(SACT, {
  catFeed() {
    const sv = S.sv, C = W().cat; const k = ['fish', 'can', 'sausage'].find(x => sv_has(x) > 0);
    if (!k) { slog('沒有魚、罐頭或火腿腸可以給牠。'); render(); return; }
    sv_take(k, 1);
    if (C.st === 'visit') { C.st = 'pet'; C.fed = sv.day; sv.mor = clamp(sv.mor + 10); slog('你給了牠一點' + ITEMS[k].n + '。橘貓吃完舔舔爪子，直接跳進屋裡，不走了。心態 +10。', true); sfx('ach'); }
    else { C.fed = sv.day; slog('餵了橘貓' + ITEMS[k].n + '，牠呼嚕呼嚕的。'); }
    UI.wm = null; render();
  },
  catPet() { const sv = S.sv, C = W().cat; if (C.st !== 'pet') { UI.wm = 'cat'; render(); return; } const rt = rtState(); C.heart = performance.now(); if (C.pet !== sv.hour) { C.pet = sv.hour; sv.mor = clamp(sv.mor + 3); if (typeof say === 'function') say('喵～', 1500); } }
});

/* ===== 鄰居 ===== */
const NB = {
  wang: { n: '王阿姨', fl: '3 樓', ic: '👵', col: '#c46d7e', meet: 2, wants: ['pills', 'medkit', 'vitamin', 'soup'], intro: '3 樓的王阿姨拄著拐杖來敲門：「少年仔，有沒有多的藥？阿姨的膝蓋好痛。」', job: 'cook', talk: ['阿姨以前在市場賣滷味，說等這一切結束要請你吃。', '阿姨教你怎麼把剩飯變成好吃的粥。', '阿姨說她兒子在台中，不知道還好不好。'] },
  chen: { n: '陳家兄妹', fl: '4 樓', ic: '🧒', col: '#5c7fa8', meet: 4, wants: ['biscuit', 'choco', 'juice', 'bubble'], intro: '4 樓的小兄妹怯生生地站在門口，哥哥牽著妹妹：「請問……有沒有吃的？」', job: 'farm', talk: ['妹妹畫了一張你跟狗狗的畫送你。', '哥哥說他想當太空人，現在想當農夫。', '兄妹倆在比賽誰比較會澆花。'] },
  jie: { n: '阿傑', fl: '5 樓', ic: '🧔', col: '#6a8a4a', meet: 6, wants: ['can', 'sausage', 'alcohol', 'diesel'], intro: '5 樓的阿傑叼著沒點的菸靠在門邊：「我以前修車的。有酒嗎？有的話，我幫你修東西。」', job: 'fix', risky: true, talk: ['阿傑說他看過一台還能動的貨車，就停在高架橋下。', '阿傑喝了酒，講起他以前的車隊。', '阿傑教你怎麼不用鑰匙發動機車。'] },
  lin: { n: '林老師', fl: '6 樓', ic: '👨‍🏫', col: '#8a6a46', meet: 9, wants: ['noodle', 'coffee', 'cell', 'tea_egg'], intro: '6 樓的林老師推了推眼鏡：「我是附近國中的理化老師。你家的燈……是用發電機嗎？」', job: 'guard', talk: ['林老師幫你算出屍潮大概的間隔。', '林老師說殭屍怕強光，晚上守夜時可以試試。', '林老師在寫一本日記，說要留給以後的人看。'] }
};
const NB_JOBS = { cook: '煮飯（每天早上用現有食材煮一道菜）', farm: '種田（作物收成 +25%）', guard: '守夜（屍潮傷害 -20%）', fix: '修理（每天修好故障設備、防線 +15）' };
const nbOf = k => { const w = W(); if (!w.nb[k]) w.nb[k] = { rel: 25, met: false, talk: 0, home: false, job: NB[k].job, gone: false }; return w.nb[k]; };
Object.assign(SACT, {
  nbGive(v) {
    const [k, it] = String(v).split(':'), N = nbOf(k), sv = S.sv; if (!N.met || N.gone || sv_has(it) <= 0) return;
    sv_take(it, 1); const want = NB[k].wants.includes(it); N.rel = Math.min(100, N.rel + (want ? 14 : 6));
    slog('送了' + ITEMS[it].n + '給' + NB[k].n + '。' + (want ? '對方眼睛一亮，連聲道謝。' : '對方客氣地收下了。') + '（好感 ' + N.rel + '）'); render();
  },
  nbTalk(k) {
    const N = nbOf(k), sv = S.sv; if (!N.met || N.gone || N.talk === sv.day) return;
    if (!canAct(1, 0)) { slog('時間不夠。'); render(); return; }
    N.talk = sv.day; N.rel = Math.min(100, N.rel + 4); sv.mor = clamp(sv.mor + 4);
    const T = NB[k].talk; slog('和' + NB[k].n + '聊了一會兒。' + T[Math.floor(rnd() * T.length)] + '心態 +4。'); useTime(1, 0); render();
  },
  nbInvite(k) { const N = nbOf(k); if (N.rel < 60 || N.home || N.gone) return; N.home = true; slog(NB[k].n + '搬進來了！可以幫忙' + NB_JOBS[N.job].replace(/（.*）/, '') + '。每天會吃 1 份食物、喝 1 份水。', true); sfx('ach'); render(); },
  nbJob(v) { const [k, j] = String(v).split(':'); const N = nbOf(k); if (!N.home || !NB_JOBS[j]) return; N.job = j; slog(NB[k].n + '改去負責' + NB_JOBS[j].replace(/（.*）/, '') + '。'); render(); },
  nbKick(k) { const N = nbOf(k); if (!N.home) return; N.home = false; N.rel = Math.max(0, N.rel - 30); slog('你請' + NB[k].n + '搬回樓上。氣氛有點尷尬。'); render(); }
});
const nbHome = j => Object.entries(W().nb).filter(([k, N]) => N.home && (!j || N.job === j)).map(([k]) => k);
const _hordeMulNb = hordeMul;
hordeMul = function () { return _hordeMulNb() * (S.sv && S.sv.w && nbHome('guard').length ? 0.8 : 1); };
function nbModal() {
  const sv = S.sv; let h = '';
  const met = Object.keys(NB).filter(k => nbOf(k).met);
  if (!met.length) return '<p>還沒認識樓上的鄰居。過幾天也許會有人來敲門。</p>';
  for (const k of met) {
    const N = nbOf(k), D = NB[k];
    h += '<div class="nb-card' + (N.gone ? ' gone' : '') + '"><div class="nb-h"><span class="nb-ic" style="background:' + D.col + '">' + (typeof SPR === 'object' && SPR['nb_' + k] ? '<img src="' + SPR['nb_' + k] + '" alt="">' : D.ic) + '</span><div><b>' + D.n + '</b> <span class="meta">' + (N.home ? '🏠 住在你家' : D.fl) + '</span><div class="bar"><i style="width:' + N.rel + '%;background:' + (N.rel >= 60 ? '#7cc191' : N.rel >= 30 ? '#e0a85a' : '#d9564a') + '"></i></div><span class="meta">好感 ' + N.rel + '</span></div></div>';
    if (N.gone) { h += '<p class="meta">' + (N.thief ? '偷了你的東西後就不見了。' : '已經離開了。') + '</p></div>'; continue; }
    const gifts = D.wants.filter(it => sv_has(it) > 0);
    h += '<div class="meta">想要：' + D.wants.map(it => itemIc(it) + ITEMS[it].n.replace(/（.*）/, '')).join('、') + '</div><div class="row-btns">' +
      gifts.map(it => '<button class="btn ghost" data-a="nbGive" data-v="' + k + ':' + it + '">送' + ITEMS[it].n.replace(/（.*）/, '') + '</button>').join('') +
      '<button class="btn ghost" data-a="nbTalk" data-v="' + k + '"' + (N.talk === sv.day ? ' disabled' : '') + '>聊天（1 小時）</button>' +
      (!N.home && N.rel >= 60 ? '<button class="btn" data-a="nbInvite" data-v="' + k + '">邀請入住</button>' : '') +
      (N.home ? '<button class="btn ghost" data-a="nbKick" data-v="' + k + '">請他搬走</button>' : '') + '</div>';
    if (N.home) h += '<div class="nb-jobs">' + Object.entries(NB_JOBS).map(([j, d]) => '<button class="pill' + (N.job === j ? ' on' : '') + '" data-a="nbJob" data-v="' + k + ':' + j + '" title="' + d + '">' + d.replace(/（.*）/, '') + '</button>').join('') + '</div><p class="meta">' + NB_JOBS[N.job] + '</p>';
    else if (N.rel < 60) h += '<p class="meta">好感到 60 可以邀請入住。</p>';
    h += '</div>';
  }
  return h;
}

/* ===== 無線電 ===== */
const RADIO_CH = {
  music: { f: '105.3', n: '深夜音樂台', msg: () => ['電台在放〈小幸運〉，你跟著哼。', '主持人說：「不管你在哪裡，今晚也要好好睡。」', '一首老台語歌，你想起阿公。'] },
  mil:   { f: '87.5', n: '軍方廣播', msg: d => d < 20 ? ['「……所有倖存者請待在室內，不要靠近水源……」', '「……軍方正在清理北區，請保持收聽……」'] : ['「……直升機每晚巡航，看到信號彈就會降落接應。請在頂樓發射……」', '「……重複：頂樓、信號彈、晚上七點以後……」'] },
  ming:  { f: '92.1', n: '倖存者阿明', msg: () => ['「喂喂？有人嗎？我是阿明，在對面那棟。我們來交換東西吧！」'] },
  boat:  { f: '101.7', n: '海星號', msg: d => d < 25 ? ['（雜訊）……海……星……'] : ['「這裡是漁船海星號。我們在港口，還能載一個人。帶 3 桶柴油、10 份食物來，就出發。」'] },
  sis:   { f: '99.9', n: '？？？', msg: () => ['「……哥？是你嗎？我在南邊的國小避難所，大家都很好。我等你。」'] }
};
const MING_TRADES = [[{ can: 2 }, { medkit: 1 }], [{ diesel: 1 }, { wu: 5 }], [{ board: 3 }, { can: 2 }], [{ choco: 2 }, { pills: 2 }], [{ metal: 2 }, { cell: 1 }], [{ sausage: 3 }, { alcohol: 1 }], [{ plastic: 3 }, { biscuit: 2 }]];
const radioOk = () => (S.sv.st.radio_set || 0) > 0;
Object.assign(SACT, {
  radioTune(k) { UI.radioCh = k; render(); },
  radioListen(k) {
    const sv = S.sv, R = W().radio, C = RADIO_CH[k]; if (!radioOk() || R.day[k] === sv.day) return;
    R.day[k] = sv.day; R.prog[k] = (R.prog[k] || 0) + 1;
    const M = C.msg(sv.day); slog('📻 ' + C.f + ' ' + C.n + '：' + M[(R.prog[k] - 1) % M.length]);
    if (k === 'music') sv.mor = clamp(sv.mor + 6);
    if (k === 'mil' && sv.day >= 20 && !R.heli) { R.heli = sv.day + 5; slog('你記下來了：第 ' + R.heli + ' 天起，晚上 7 點後在頂樓發射信號彈，直升機就會來。', true); }
    render();
  },
  radioTrade() {
    const sv = S.sv, R = W().radio; if (!radioOk() || R.tradeDay === sv.day) return;
    const [give, get] = MING_TRADES[sv.day % MING_TRADES.length];
    if (!Object.entries(give).every(([m, n]) => (m === 'wu' ? sv.st.wu || 0 : sv.st[m] || 0) >= n)) { slog('東西不夠，交易不成。'); render(); return; }
    for (const [m, n] of Object.entries(give)) { sv.st[m] -= n; if (!sv.st[m]) delete sv.st[m]; }
    for (const [m, n] of Object.entries(get)) sv.st[m] = (sv.st[m] || 0) + n;
    R.tradeDay = sv.day; slog('約在兩棟樓中間的巷子交換。阿明留下了' + Object.entries(get).map(([m, n]) => ITEMS[m].n + '×' + n).join('、') + '。'); render();
  },
  radioBoat() {
    const sv = S.sv; if (sv.day < 25 || (sv.st.diesel || 0) < 3) return;
    const foods = Object.keys(FOOD).reduce((a, k) => a + sv_has(k), 0); if (foods < 10) { slog('食物不夠 10 份。'); render(); return; }
    endEarly('boat', '第 ' + sv.day + ' 天，你帶著柴油和食物趕到港口，搭上了海星號。');
  },
  radioSis() {
    const sv = S.sv, R = W().radio; if (!R.sis || sv.day < 30) return;
    const foods = Object.keys(FOOD).reduce((a, k) => a + sv_has(k), 0);
    if (foods < 6 || (sv.st.wu || 0) < 6) { slog('路很遠，至少要帶 6 份食物、6 份水。'); render(); return; }
    endEarly('reunion', '第 ' + sv.day + ' 天，你出發去南邊的國小，找到了妹妹。');
  }
});
function radioModal() {
  const sv = S.sv, R = W().radio;
  if (!radioOk()) return '<p>家裡的收音機壞了。在工作台用 1 個鐵片、2 個塑膠就能修好（「修好收音機」）。</p>';
  const chs = Object.keys(RADIO_CH).filter(k => k !== 'sis' || R.sis), cur = UI.radioCh && chs.includes(UI.radioCh) ? UI.radioCh : chs[0];
  let h = '<div class="radio-dial">' + chs.map(k => '<button class="radio-f' + (k === cur ? ' on' : '') + '" data-a="radioTune" data-v="' + k + '"><b>' + RADIO_CH[k].f + '</b><span>' + RADIO_CH[k].n + '</span></button>').join('') + '</div>';
  const C = RADIO_CH[cur], heard = R.day[cur] === sv.day;
  h += '<div class="radio-box"><div class="meta">' + C.f + ' MHz · ' + C.n + '</div><p>' + (heard ? '今天聽過了。明天再收聽看看。' : '沙沙沙……') + '</p><button class="btn" data-a="radioListen" data-v="' + cur + '"' + (heard ? ' disabled' : '') + '>收聽</button></div>';
  if (cur === 'ming') { const [give, get] = MING_TRADES[sv.day % MING_TRADES.length]; h += '<div class="wm-row"><div><b>今天的交易</b><div class="meta">給 ' + needTxt(give) + ' → 換 ' + Object.entries(get).map(([m, n]) => itemIc(m) + ITEMS[m].n + '×' + n).join('、') + '</div></div><button class="btn" data-a="radioTrade"' + (R.tradeDay === sv.day ? ' disabled' : '') + '>交換</button></div>'; }
  if (cur === 'mil' && R.heli) h += '<p class="meta">🚁 第 ' + R.heli + ' 天起，晚上 7 點後到頂樓發射信號彈（頂樓要先整理好、信號彈在工作台做）。</p>';
  if (cur === 'boat' && sv.day >= 25) h += '<div class="wm-row"><div><b>🚢 出發去港口</b><div class="meta">要 3 桶柴油、10 份食物 · 這輪就此結束（結局）</div></div><button class="btn red" data-a="radioBoat"' + ((sv.st.diesel || 0) >= 3 ? '' : ' disabled') + '>出發</button></div>';
  if (cur === 'sis' && R.sis) h += '<div class="wm-row"><div><b>👧 出發去找妹妹</b><div class="meta">第 30 天以後 · 要 6 份食物、6 份水 · 這輪就此結束（結局）</div></div><button class="btn red" data-a="radioSis"' + (sv.day >= 30 ? '' : ' disabled') + '>出發</button></div>';
  return h;
}

/* ===== 夢境 ===== */
const DREAMS = [
  { t: '你夢到小時候的夜市。有人牽著你的手，手很小、很暖。', q: '要看清楚那個人是誰嗎？' },
  { t: '夢裡下著大雨，你在公車站等人。手機一直響，你卻不敢接。', q: '要接起電話嗎？' },
  { t: '你夢到家裡的餐桌。四張椅子，只有你一個人坐著。', q: '要去找其他人嗎？' },
  { t: '你夢到爆發那天早上。妹妹說要去南部參加營隊，你只說了「喔」。', q: '要回想你們最後說了什麼嗎？' },
  { t: '夢裡你在一間教室，黑板上寫著一串數字，粉筆灰一直往下掉。', q: '要看清楚那串數字嗎？' },
  { t: '你夢到妹妹在收音機前面，對著麥克風說話，可是你聽不到聲音。', q: '要靠近一點聽嗎？' },
  { t: '你夢到海邊。那張照片背面的字慢慢浮出來：「下次還要再來」。', q: '要答應她嗎？' },
  { t: '最後一個夢。妹妹轉過頭，清清楚楚地說：「哥，99.9。我等你。」', q: '要記住嗎？' }
];
Object.assign(SACT, {
  dreamPick(v) {
    const D = W().dream, M = UI.morning; if (!M || M.dream == null || M.dreamDone) return;
    const sv = S.sv;
    if (v === 'face') { D.faced++; sv.mor = clamp(sv.mor - 3); } else sv.mor = clamp(sv.mor + 2);
    D.i = M.dream + 1; M.dreamDone = v;
    if (D.i >= DREAMS.length) {
      if (D.faced >= 5) { W().radio.sis = true; slog('你醒來，記得清清楚楚：99.9。妹妹還活著。（無線電多了一個頻道）', true); M.dreamEnd = '你記住了。收音機轉到 99.9，也許能聽到她的聲音。'; }
      else { sv.mor = clamp(sv.mor + 10); M.dreamEnd = '那些夢慢慢淡了。你決定先好好活下去。心態 +10。'; }
    }
    render();
  }
});
const _morningCardW = morningCard;
morningCard = function () {
  let h = _morningCardW(); const M = UI.morning; if (!h || !M) return h;
  let add = '';
  if (M.extra && M.extra.length) add += '<ul class="mc-log">' + M.extra.map(t => '<li>' + esc(t) + '</li>').join('') + '</ul>';
  if (M.fest) add += '<div class="mc-fest">🏮 今天是<b>' + FEST_N[M.fest] + '</b>！' + FEST_TIP[M.fest] + '</div>';
  if (M.dream != null) {
    const D = DREAMS[M.dream];
    add += '<div class="mc-dream"><b>💭 昨晚的夢</b><p>' + D.t + '</p>' + (M.dreamDone ? '<p class="meta">' + (M.dreamDone === 'face' ? '你選擇面對。心裡一陣刺痛（心態 -3），但記憶清楚了一點。' : '你翻身繼續睡（心態 +2）。') + (M.dreamEnd ? '<br>' + M.dreamEnd : '') + '</p>' : '<p class="meta">' + D.q + '</p><div class="row-btns"><button class="btn" data-a="dreamPick" data-v="face">面對</button><button class="btn ghost" data-a="dreamPick" data-v="avoid">逃避</button></div>') + '</div>';
  }
  return h.replace('<button class="btn mc-go"', add + '<button class="btn mc-go"');
};

/* ===== 每天早上結算 ===== */
const _nightWorld = night;
night = function (watch) {
  const sv0 = S && S.sv; if (!sv0) return _nightWorld(watch);
  const d0 = sv0.day, ty = typeof isTyphoon === 'function' && isTyphoon(d0), rain = inRain(d0);
  // 颱風夜淹水
  if (ty && S.phase === 'survive') {
    const w = W();
    if (w.sandDay === d0) slog('颱風夜，雨水灌到門口，還好沙包擋住了。');
    else {
      const lost = [];
      for (const k of Object.keys(sv0.st)) { const I = ITEMS[k]; if (!I || !['food', 'mat', 'farm'].includes(I.cat) || !(sv0.st[k] >= 2)) continue; const n = Math.floor(sv0.st[k] * 0.2); if (n > 0) { sv0.st[k] -= n; lost.push(I.n.replace(/（.*）/, '') + '×' + n); } }
      sv0.hyg = Math.max(0, (sv0.hyg == null ? 80 : sv0.hyg) - 10);
      slog('颱風夜水淹進一樓！泡壞了' + (lost.slice(0, 5).join('、') || '一些東西') + '，衛生 -10。下次記得先堆沙包。', true);
    }
  }
  _nightWorld(watch);
  if (!S.sv || S.phase !== 'survive' || S.sv.day === d0) return;
  const sv = S.sv, w = W(), d = sv.day, ex = [];
  // 頂樓
  const R = w.roof;
  if (R.coop && R.hens) { const lay = Math.min(R.hens, Math.floor(R.feed)); if (lay > 0) { R.feed -= lay; sv_addFresh('egg', lay); ex.push('雞舍裡撿到 ' + lay + ' 顆蛋。'); } else ex.push('雞沒飼料，今天沒下蛋。'); }
  if (R.fish) { if (sv.power >= 0.3) { sv.power -= 0.3; R.fishAcc += 0.34; if (R.fishAcc >= 1) { R.fishAcc -= 1; sv_addFresh('fish', 1); ex.push('魚菜共生撈到一條吳郭魚。'); } } else ex.push('沒電了，魚池的幫浦停了。'); }
  if (R.shelter && rain) { sv.st.wu = (sv.st.wu || 0) + 4; ex.push('頂樓雨棚多接了 4 份水。'); }
  // 收藏整套：每天心態 +1
  const sets = COLL_SETS.filter(s => COLL.filter(c => c.set === s).every(c => w.coll.includes(c.k))).length; if (sets) sv.mor = clamp(sv.mor + sets);
  // 梅雨：新鮮作物發霉更快
  if (rain) { let m = 0; for (const f of sv.fresh) if (!FOOD[f.k] || !FOOD[f.k].dish) { if (rnd() < 0.25) { f.life--; m++; } } if (m) ex.push('梅雨季太潮濕，有些蔬菜發霉得更快。'); }
  // 貓
  const C = w.cat;
  if (C.st === 'none' && d >= 5 && rnd() < 0.2) { C.st = 'visit'; C.seen = d; ex.push('窗台上蹲著一隻橘貓，盯著你看。（點牠可以餵）'); }
  else if (C.st === 'visit' && d - C.seen >= 3) { C.st = 'none'; ex.push('那隻橘貓好幾天沒來了。'); }
  else if (C.st === 'pet') {
    if (d - (C.fed || 0) >= 2) { const k = ['fish', 'can', 'sausage', 'egg'].find(x => sv_has(x) > 0); if (k) { sv_take(k, 1); C.fed = d; } else { sv.mor = clamp(sv.mor - 2); ex.push('橘貓餓得一直喵喵叫（心態 -2）。'); } }
    if (d % 3 === 0) { if (rnd() < 0.15) { const k = collRandom(); if (k) collAdd(k, '橘貓叼回來一樣東西'); } else { const g = ['plastic', 'biscuit', 'pills', 'cell', 'sausage'][Math.floor(rnd() * 5)]; sv.st[g] = (sv.st[g] || 0) + 1; ex.push('橘貓叼回來一個' + ITEMS[g].n + '。'); } }
  }
  // 鄰居
  for (const [k, D] of Object.entries(NB)) {
    const N = nbOf(k); if (N.gone) continue;
    if (!N.met && d >= D.meet) { N.met = true; ex.push(D.intro); continue; }
    if (!N.met) continue;
    if (N.home) {
      const food = Object.keys(FOOD).filter(f => sv_has(f) > 0).sort((a, b) => FOOD[a].sat - FOOD[b].sat)[0];
      const okF = !!food, okW = (sv.st.wu || 0) >= 1;
      if (okF) sv_take(food, 1); if (okW) sv.st.wu -= 1;
      if (!okF || !okW) { N.rel -= 15; ex.push(D.n + '今天沒東西吃喝，臉色很難看（好感 -15）。'); if (N.rel < 30) { N.home = false; ex.push(D.n + '收拾東西搬回樓上了。'); } continue; }
      N.rel = Math.min(100, N.rel + 1);
      if (N.job === 'cook') { const dk = Object.keys(DISHES).find(x => { const Q = DISHES[x]; return !Q.fest && chefLv() >= Q.lv && Object.entries(Q.need).every(([m, n]) => haveIng(m) >= n); }); if (dk && sv.st.microwave) { for (const [m, n] of Object.entries(DISHES[dk].need)) { if (m === 'wu') sv.st.wu -= n; else sv_take(m, n); } sv_addFresh(dk, DISHES[dk].q); chefGain(dk, 1); ex.push(D.n + '煮了' + ITEMS[dk].n + ' ×' + DISHES[dk].q + '。'); } }
      if (N.job === 'farm') { const ripe = sv.plants.filter(p => p.age >= growDaysOf(p.k)); if (ripe.length && rnd() < 0.6) { const p = ripe[Math.floor(rnd() * ripe.length)]; sv_addFresh(p.k, 1); ex.push(D.n + '細心照顧作物，多收了 1 個' + ITEMS[p.k].n + '。'); } }
      if (N.job === 'fix') { const br = Object.keys(sv.broken || {}); if (br.length) { delete sv.broken[br[0]]; ex.push(D.n + '修好了' + ITEMS[br[0]].n + '。'); } sv.def = Math.min(sv.defMax, sv.def + 15); }
    } else {
      N.rel = Math.max(0, N.rel - 1);
      if (D.risky && N.rel < 15 && rnd() < 0.15) {
        const take = Object.keys(sv.st).filter(x => ITEMS[x] && ['food', 'mat'].includes(ITEMS[x].cat) && sv.st[x] > 0).slice(0, 3);
        for (const x of take) { const n = Math.min(sv.st[x], 2); sv.st[x] -= n; if (!sv.st[x]) delete sv.st[x]; }
        N.gone = true; N.thief = true; ex.push('半夜有人撬開你家的窗……早上發現少了東西。阿傑也不見了。');
      }
    }
  }
  // 節日
  const fest = FEST[d] ? FEST[d] : null;
  if (FEST[d - 1] === 'newyear' && !w.nyFeast) { sv.mor = clamp(sv.mor - 10); ex.push('除夕夜沒有吃年夜飯，你一直想起家裡的圓桌（心態 -10）。'); }
  // 夢
  let dream = null;
  if (w.dream.i < DREAMS.length && w.dream.last !== d - 1 && rnd() < 0.35) { dream = w.dream.i; w.dream.last = d; }
  if (UI.morning && UI.morning.day === d) { UI.morning.extra = ex; UI.morning.fest = fest; if (dream != null) UI.morning.dream = dream; }
  else ex.forEach(t => slog(t));
};
// 除夕：當天吃了心態 +15 以上的料理就算年夜飯
const _eatNY = SACT.eat;
SACT.eat = function (k) {
  _eatNY(k);
  if (S.sv && festToday() === 'newyear' && FEST[S.sv.day] === 'newyear' && FOOD[k] && FOOD[k].dish && (FOOD[k].mor || 0) >= 15 && !W().nyFeast) { W().nyFeast = true; S.sv.mor = clamp(S.sv.mor + 15); slog('這頓就是你的年夜飯了。新年快樂。心態 +15。', true); }
};
// 颱風前堆沙包
Object.assign(SACT, {
  sandbag() { const sv = S.sv, w = W(); if (!(sv.st.sandbag > 0)) { slog('沒有沙包。工作台可以用塑膠 2、木板 1 做。'); render(); return; } if (!canAct(1, 6)) return; sv.st.sandbag--; if (!sv.st.sandbag) delete sv.st.sandbag; w.sandDay = sv.day; slog('把沙包堆在門口和排水孔旁邊。'); useTime(1, 6); render(); }
});

/* ===== 視窗、面板、場景 ===== */
Object.assign(SACT, { wmOpen(v) { UI.wm = v; UI.rtSel = null; render(); }, wmClose() { UI.wm = null; render(); } });
function wmHTML() {
  const t = { roof: '🏙️ 頂樓', nbr: '👥 公寓鄰居', radio: '📻 無線電', coll: '🖼️ 收藏牆', cat: '🐈 橘貓' }[UI.wm];
  let body = UI.wm === 'roof' ? roofModal() : UI.wm === 'nbr' ? nbModal() : UI.wm === 'radio' ? radioModal() : UI.wm === 'coll' ? collModal() : UI.wm === 'cat' ? (W().cat.st === 'visit' ? '<p>一隻瘦瘦的橘貓蹲在窗台上，尾巴繞著腳。看起來很餓。</p><button class="btn" data-a="catFeed">給牠吃的（魚／罐頭／火腿腸）</button>' : '<p>橘貓窩在你家了。會自己抓老鼠，偶爾叼東西回來。點牠可以摸。</p><button class="btn ghost" data-a="catFeed">餵牠</button>') : '';
  return '<div class="rt-modal" data-a="wmClose"><div class="rt-mbox wm-box" data-a="noop"><div class="rt-mh"><div><b>' + t + '</b></div><button class="btn ghost" data-a="wmClose" style="margin-left:auto">關閉</button></div>' + body + '</div></div>';
}
const _renderWorld = render;
render = function () {
  _renderWorld();
  if (UI.wm && S && S.phase === 'survive' && S.sv && !S.sv.out) $app.insertAdjacentHTML('beforeend', wmHTML());
  else if (UI.wm && (!S || S.phase !== 'survive')) UI.wm = null;
};
const _rtActiveWorld = rtActive;
rtActive = function () { return _rtActiveWorld() && !UI.wm; };
const _rtPanelWorld = rtPanel;
rtPanel = function () {
  const sv = S.sv, w = W(), R = w.roof;
  const chips = [['roof', '🏙️ 頂樓'], ['nbr', '👥 鄰居' + (Object.values(w.nb).filter(n => n.home).length ? '（' + Object.values(w.nb).filter(n => n.home).length + '）' : '')], ['radio', '📻 無線電'], ['coll', '🖼️ 收藏 ' + w.coll.length + '/' + COLL.length]];
  let h = '<div class="wm-chips">' + chips.map(([k, t]) => '<button class="pill" data-a="wmOpen" data-v="' + k + '">' + t + '</button>').join('') + '</div>';
  const f = festToday(); if (f) h += '<div class="sg-warn" style="border-color:#c9a94a;background:rgba(236,210,122,0.12)">🏮 ' + FEST_N[f] + '：' + FEST_TIP[f] + '</div>';
  if (typeof isTyphoon === 'function' && (isTyphoon(sv.day) || isTyphoon(sv.day + 1)) && w.sandDay !== sv.day) h += '<div class="sg-warn">🌀 ' + (isTyphoon(sv.day) ? '今晚' : '明天') + '颱風！一樓會淹水，' + (isTyphoon(sv.day) ? '' : '明天') + '在門口堆沙包可以擋住。<button class="btn" data-a="sandbag" style="margin-left:6px"' + (isTyphoon(sv.day) && sv.st.sandbag > 0 ? '' : ' disabled') + '>堆沙包（有 ' + (sv.st.sandbag || 0) + '）</button></div>';
  return h + _rtPanelWorld();
};
// 場景：貓、室友、收藏框
const _lifeLayerW = lifeLayer;
lifeLayer = function (now) {
  now = now || performance.now();
  let s = _lifeLayerW(now);
  const sv = S.sv, w = W(), rt = rtState(), f = (UI.iso && UI.iso.floor) || '1F', P = isoProj(f);
  if (f !== '1F') return s;
  // 收藏框（後牆兩扇窗中間）
  if (w.coll.length) { const a = P(2.6, 0, 0), y = a[1] - TWALL + 18; s += '<g data-coll="1" style="cursor:pointer">'; for (let i = 0; i < Math.min(6, w.coll.length); i++) s += '<rect x="' + (a[0] + (i % 3) * 15) + '" y="' + (y + Math.floor(i / 3) * 17) + '" width="12" height="14" fill="' + ['#e8d9b0', '#c9b48a', '#d6c6a6'][i % 3] + '" stroke="#5a3e2a" stroke-width="1.2"/>'; s += '<rect x="' + (a[0] - 4) + '" y="' + (y - 4) + '" width="52" height="42" fill="transparent"/></g>'; }
  // 室友：站在負責的東西旁邊
  const spot = { cook: 'microwave', farm: 'lightbox|potrack', guard: 'DOOR', fix: 'bench|workshop' };
  let i = 0;
  for (const k of nbHome()) {
    const D = NB[k], N = nbOf(k), oc = typeof objCenter === 'function' && objCenter(spot[N.job]) || { x: 3 + i, y: 3 };
    const q = P(Math.max(0.6, Math.min(5.4, oc.x + 0.6 + i * 0.2)), Math.min(4.6, oc.y + 0.9), 0), bob = Math.sin(now / 400 + i) * 1;
    s += '<g data-nb="' + k + '" style="cursor:pointer" transform="translate(' + q[0].toFixed(1) + ' ' + (q[1] + bob).toFixed(1) + ')"><ellipse cy="1" rx="9" ry="3" fill="rgba(0,0,0,0.25)"/><rect x="-6" y="-20" width="12" height="16" rx="4" fill="' + D.col + '" stroke="#1d2733"/><rect x="-5" y="-5" width="4" height="6" fill="#3a3f45"/><rect x="1" y="-5" width="4" height="6" fill="#3a3f45"/><circle cy="-26" r="7" fill="#f1d3b3" stroke="#1d2733"/><text y="-23" text-anchor="middle" font-size="9">' + D.ic + '</text><circle cy="-14" r="16" fill="transparent"/></g>';
    i++;
  }
  // 貓：拜訪時蹲在窗台；養了會到處走、晚上睡床上
  const C = w.cat;
  if (C.st === 'visit') { const x = ISO_WIN['1F'].y0[0] || 1, a = P(x + 0.5, 0, 0); s += catSVG(a[0], a[1] - TWALL + 46, now, false, 1) .replace('<g ', '<g data-cat="1" style="cursor:pointer" '); }
  else if (C.st === 'pet') {
    if (!C.p) C.p = { x: 2, y: 3 };
    const night = sv.hour >= 22 || sv.hour < 6;
    if (night) { const b = typeof objCenter === 'function' && objCenter('bed|bedroom'); if (b) C.t = { x: b.x + 0.3, y: b.y }; }
    else if (!C.t || Math.hypot(C.t.x - C.p.x, C.t.y - C.p.y) < 0.1) { if (Math.random() < 0.006) { const ok = [...rtWalkable('1F')]; const t = ok[Math.floor(Math.random() * ok.length)]; if (t) { const [x, y] = t.split(',').map(Number); C.t = { x: x + 0.5, y: y + 0.5 }; } } }
    let moving = false;
    if (C.t) { const dx = C.t.x - C.p.x, dy = C.t.y - C.p.y, dd = Math.hypot(dx, dy); if (dd > 0.05) { const st = Math.min(dd, 0.02); C.p.x += dx / dd * st; C.p.y += dy / dd * st; moving = true; C.face = dx >= 0 ? 1 : -1; } }
    const q = P(C.p.x, C.p.y, 0);
    s += catSVG(q[0], q[1], now, moving, C.face || 1, night && !moving).replace('<g ', '<g data-cat="1" style="cursor:pointer" ');
    if (C.heart && now - C.heart < 1200) { const k = (now - C.heart) / 1200; s += '<text x="' + q[0].toFixed(1) + '" y="' + (q[1] - 22 - k * 14).toFixed(1) + '" text-anchor="middle" font-size="12" opacity="' + (1 - k).toFixed(2) + '" pointer-events="none">💛</text>'; }
  }
  return s;
};
function catSVG(x, y, now, moving, face, sleep) {
  if (hasSpr('cat_idle')) { const k = sleep && hasSpr('cat_sleep') ? 'cat_sleep' : moving && hasSpr('cat_walk') && Math.floor(now / 160) % 2 ? 'cat_walk' : 'cat_idle'; return '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + (face || 1) + ' 1)"><ellipse cy="1" rx="9" ry="2.5" fill="rgba(0,0,0,0.2)"/>' + sprImg(k, sleep ? 30 : 20) + '<circle r="13" cy="-8" fill="transparent"/></g>'; }
  const tail = Math.sin(now / (moving ? 120 : 380)) * 4, step = moving ? Math.abs(Math.sin(now / 110)) * 1.2 : 0;
  if (sleep) return '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"><ellipse rx="9" ry="5.5" cy="-4" fill="#e39a4a" stroke="#1d2733" stroke-width="0.9"/><path d="M-4 -8 q4 -3 8 0" stroke="#b86e2a" stroke-width="1.2" fill="none"/><circle cx="7" cy="-6" r="3.5" fill="#e39a4a" stroke="#1d2733" stroke-width="0.8"/><text x="9" y="-14" font-size="8" fill="#cfd6e0">z</text><circle r="12" cy="-4" fill="transparent"/></g>';
  return '<g transform="translate(' + x.toFixed(1) + ' ' + (y - step).toFixed(1) + ') scale(' + face + ' 1)"><ellipse cy="1" rx="8" ry="2.5" fill="rgba(0,0,0,0.2)"/><ellipse cx="-1" cy="-6" rx="7.5" ry="4.5" fill="#e39a4a" stroke="#1d2733" stroke-width="0.9"/><path d="M-3 -9 v6 M0 -10 v6" stroke="#b86e2a" stroke-width="1.1"/><circle cx="6" cy="-10" r="4" fill="#e39a4a" stroke="#1d2733" stroke-width="0.9"/><path d="M3.5 -13 l1 -3.5 l2 3z M7 -13.5 l1.5 -3 l1 3.5z" fill="#e39a4a" stroke="#1d2733" stroke-width="0.7"/><circle cx="7.5" cy="-10.5" r="0.8" fill="#111"/><path d="M-8 -7 q-5 ' + (-3 + tail).toFixed(1) + ' -4 ' + (-9 + tail).toFixed(1) + '" stroke="#e39a4a" stroke-width="2.4" fill="none" stroke-linecap="round"/><rect x="-6" y="-2.5" width="2" height="3.5" fill="#c97f38"/><rect x="2" y="-2.5" width="2" height="3.5" fill="#c97f38"/><circle r="12" cy="-6" fill="transparent"/></g>';
}
document.addEventListener('pointerdown', e => {
  if (!e.target.closest || !S || !S.sv) return;
  const c = e.target.closest('[data-cat]'), n = e.target.closest('[data-nb]'), co = e.target.closest('[data-coll]');
  if (c) { e.preventDefault(); e.stopPropagation(); SACT.catPet(); return; }
  if (n) { e.preventDefault(); e.stopPropagation(); UI.wm = 'nbr'; render(); return; }
  if (co) { e.preventDefault(); e.stopPropagation(); UI.wm = 'coll'; render(); }
}, true);
// 有貓：老鼠一出現就被抓
const _evSpawnCat = evSpawn;
evSpawn = function () {
  _evSpawnCat();
  const E = evState(), r = E.list.find(e => e.k === 'rat' && !e.gone);
  if (r && S.sv.w && S.sv.w.cat.st === 'pet') { r.gone = true; slog('老鼠才探出頭，橘貓就撲上去叼走了。'); }
};
