/* ================= 原作補完：機器人、無人機自動化、狗、雷達、精煉、利息、噪音器、新角色 ================= */
Object.assign(ITEMS, {
  noise:     { n: '噪音器', cat: 'mat', w: 0.5, note: '引開屍群 · 去醫院、科技公司要用 1 個' },
  radar:     { n: '雷達', cat: 'equip', w: 0, note: '外出耗電 1 度：暴露值 -25%、多找到東西' },
  refinery:  { n: '精煉機', cat: 'equip', w: 0, note: '把油菜籽或作物煉成柴油' },
  rape:      { n: '油菜籽種子', cat: 'farm', w: 0.05, note: '一包種 2 株 · 收成拿去精煉' },
  rape_p:    { n: '油菜籽', cat: 'mat', w: 0.3, note: '3 個煉 1 桶柴油 · 不能吃' },
  bot_farm:  { n: '澆水機器人', cat: 'equip', w: 0, note: '耗電 0.5 度/天 · 作物 6 天成熟、產量 +25%' },
  bot_fix:   { n: '修理機器人', cat: 'equip', w: 0, note: '耗電 0.5 度/天 · 每晚自動修防線 +25' },
  bot_cook:  { n: '料理機器人', cat: 'equip', w: 0, note: '耗電 0.5 度/天 · 早上自動煮飯' },
  dauto:     { n: '無人機自動化模組', cat: 'equip', w: 0, note: '每天自動做划算的交易、自動空投' }
});
STORES.farm.items.rape = [10, 6];
LOCS.hospital.noise = true;
LOCS.tech.noise = true;
Object.assign(CHARS, {
  nurse:   { n: '護理師', d: '急救包效果 +50%，開局多 2 個急救包。', how: '累積搜醫院 5 次' },
  veteran: { n: '退伍軍人', d: '屍潮傷害 -15%，開局多 2 瓶燃燒瓶。', how: '任一輪撐到第 50 天' }
});
Object.assign(RECIPES, {
  noise:    { n: '噪音器', need: { glass: 1, plastic: 1 }, h: 1, out: { noise: 1 }, base: true, d: '去醫院、科技公司要用' },
  radar:    { n: '雷達', need: { metal: 2, plastic: 2, glass: 1 }, h: 3, out: { radar: 1 }, d: '外出暴露值 -25%，多找到東西' },
  refinery: { n: '精煉機', need: { metal: 4, plastic: 2 }, h: 3, out: { refinery: 1 }, d: '油菜籽或作物煉成柴油' },
  bot_farm: { n: '澆水機器人', need: { metal: 4, plastic: 3, glass: 1 }, h: 4, out: { bot_farm: 1 }, d: '作物 6 天成熟、產量 +25%' },
  bot_fix:  { n: '修理機器人', need: { metal: 5, plastic: 3 }, h: 4, out: { bot_fix: 1 }, d: '每晚自動修防線 +25' },
  bot_cook: { n: '料理機器人', need: { metal: 3, plastic: 3, glass: 1 }, h: 4, out: { bot_cook: 1 }, d: '早上自動煮飯' },
  dauto:    { n: '無人機自動化', need: { plastic: 2, metal: 1, glass: 1 }, h: 2, out: { dauto: 1 }, base: true, needDrone: true, d: '每天自動做划算的交易、自動空投（要先有無人機）' }
});
const SEED_OUT = { tomato: 'tomato_p', straw: 'straw_p', rape: 'rape_p' };
const ROBOTS = ['bot_farm', 'bot_fix', 'bot_cook'];
const DOG_FOOD = ['sausage', 'can', 'rice_c', 'biscuit', 'mushroom', 'noodle'];

function m7Init(sv) {
  for (const r of ROBOTS) sv.dev[r] = true;
  sv.dog = { state: 'none', xp: 0, miss: 0, today: false };
  if (S.char === 'veteran' && !sv.st.molotov) {}
}
const dogLv = () => { const d = S.sv.dog; return d && d.state === 'pet' ? Math.min(5, 1 + Math.floor(d.xp / 6)) : 0; };
const robotOn = k => !!(S.sv.st[k] > 0 && S.sv.dev[k] && S.sv.powered && S.sv.powered[k]);
const growDays = () => robotOn('bot_farm') ? 6 : 8;
function hordeMul() { return (1 - dogLv() * 0.04) * (S.char === 'veteran' ? 0.85 : 1); }
function expMul() { return (1 - dogLv() * 0.03) * (S.sv.out && S.sv.out.radar ? 0.75 : 1); }
function lootBonus() { return dogLv() * 0.06 + (S.sv.out && S.sv.out.radar ? 0.2 : 0); }

function m7Morning(nd) {
  const sv = S.sv, st = sv.st;
  // 生存點數利息
  if (sv.sp >= 200) { const i = Math.floor(sv.sp * 0.05); sv.sp += i; slog('存著的生存點數生了 ' + i + ' 點利息。'); }
  // 料理機器人
  if (robotOn('bot_cook') && !sv.fresh.some(f => f.k === 'rice_c') && st.rice > 0 && st.microwave > 0 && sv.power >= 0.3) {
    st.rice--; if (!st.rice) delete st.rice; sv.power -= 0.3; sv_addFresh('rice_c', 8);
    slog('料理機器人煮好了 8 份熟飯。');
  }
  // 狗
  const d = sv.dog;
  if (d.state === 'none' && nd >= 4 && nd <= 30 && Math.random() < 0.25) { d.state = 'stray'; slog('門口有一隻瘦巴巴的流浪狗，一直看著你。', true); }
  else if (d.state === 'stray' && Math.random() < 0.3) { d.state = 'none'; slog('流浪狗走掉了。'); }
  else if (d.state === 'pet') {
    if (d.today) { d.xp++; d.miss = 0; } else d.miss++;
    d.today = false;
    if (d.miss >= 3) { d.state = 'left'; slog('狗餓了好幾天，跑掉了。', true); chron(nd, '狗跑掉了。', 'bad'); }
  }
  // 無人機自動化
  if (st.dauto > 0 && st.drone > 0) {
    const done = [];
    sv.offers.forEach((o, i) => { if (!o.done && sv_has(o.give[0]) >= o.give[1] * 2) { SACT.trade(i); done.push(ITEMS[o.get[0]].n); } });
    if (sv.mgr.state === 'feeding' && !sv.mgr.today) SACT.airdrop();
    if (done.length) slog('無人機自動交易換到：' + done.join('、') + '。');
  }
}

Object.assign(SACT, {
  adoptDog() {
    const sv = S.sv, d = sv.dog;
    if (d.state !== 'stray' || DOG_FOOD.reduce((a, k) => a + sv_has(k), 0) < 1) return;
    takeFrom(DOG_FOOD, 1); d.state = 'pet'; d.today = true; sv.mor = clamp(sv.mor + 10);
    slog('狗吃完東西，搖著尾巴跟你進門了。你多了一個夥伴。', true);
    chron(sv.day, '收養了一隻狗。', 'good');
    render();
  },
  feedDog() {
    const sv = S.sv, d = sv.dog;
    if (d.state !== 'pet' || d.today || DOG_FOOD.reduce((a, k) => a + sv_has(k), 0) < 1) return;
    const lv = dogLv();
    takeFrom(DOG_FOOD, 1); d.today = true; sv.mor = clamp(sv.mor + 3);
    slog('餵了狗。' + (dogLv() > lv ? '狗升到 ' + dogLv() + ' 級了！' : ''));
    render();
  },
  refine() {
    const sv = S.sv, st = sv.st;
    if (!(st.refinery > 0) || !canAct(2, staCost(8))) return;
    if ((st.rape_p || 0) >= 3) { st.rape_p -= 3; if (!st.rape_p) delete st.rape_p; }
    else if (vegPool() >= 6) takeFrom(VEGGIES, 6);
    else return;
    st.diesel = (st.diesel || 0) + 1; sv.sta -= staCost(8);
    slog('精煉出一桶柴油。');
    passHours(2); render();
  }
});

function viewExtraSocial() {
  const sv = S.sv, d = sv.dog;
  const food = DOG_FOOD.reduce((a, k) => a + sv_has(k), 0);
  if (d.state === 'stray') return actRow('門口的流浪狗', '給牠 1 份食物（火腿腸、罐頭、熟飯等）就能收養', '收養', 'adoptDog', '', food >= 1);
  if (d.state === 'pet') return actRow('狗（' + dogLv() + ' 級）', d.today ? '今天餵過了' : '每天要餵 1 份食物，3 天沒吃會跑掉 · 每級：屍潮傷害 -4%、外出暴露 -3%、多找到東西', '餵', 'feedDog', '', !d.today && food >= 1);
  return '';
}
function viewRefine() {
  const st = S.sv.st;
  if (!(st.refinery > 0)) return '';
  return '<div class="sheet">' + actRow('精煉柴油', '3 個油菜籽（或 6 份蔬果）→ 1 桶柴油 · 2 小時 · 你有油菜籽 ' + (st.rape_p || 0) + ' 個', '煉', 'refine', '', ((st.rape_p || 0) >= 3 || vegPool() >= 6) && canAct(2, staCost(8))) + '</div>';
}
