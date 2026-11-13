/* ================= M5：外出、交易、救援、角色 ================= */
const CHARS = {
  neighbor: { n: '鄰居', d: '一般人，沒有特別能力。' },
  student:  { n: '大學生', d: '開局就會園藝、廚藝天賦，初始資金多 $100。', how: '救下隔壁的 Zoe（連續幫她 7 次）' },
  manager:  { n: '倉庫經理', d: '背包 +15kg，無人機交易每次多拿 1 個。', how: '第 18 天後在廢棄超市的貨車裡找到他，空投食物給他 5 天' }
};
const LOCS = {
  smarket:  { n: '廢棄超市', lv: 1, trip: 1, cont: ['收銀台', '零食貨架', '罐頭區', '倉庫', '冷藏櫃', '飲料區'],
              loot: [['can', 1, 3, 30], ['biscuit', 1, 2, 20], ['sausage', 2, 4, 20], ['wu', 2, 4, 25], ['plastic', 1, 2, 10], ['choco', 1, 3, 15]] },
  school:   { n: '學校', lv: 1, trip: 1, cont: ['教室', '保健室', '福利社', '教師辦公室', '實驗室', '體育器材室'],
              loot: [['plastic', 1, 3, 25], ['board', 1, 2, 20], ['medkit', 1, 1, 10], ['pills', 1, 2, 15], ['noodle', 1, 3, 15], ['glass', 1, 2, 15]] },
  hardware: { n: '五金行廢墟', lv: 1, trip: 1, cont: ['門口貨架', '五金區', '建材堆', '後院', '油料櫃', '工作室'],
              loot: [['metal', 1, 2, 30], ['board', 1, 3, 30], ['glass', 1, 2, 20], ['diesel', 1, 1, 10], ['plastic', 1, 2, 10]] },
  hospital: { n: '醫院', lv: 2, trip: 2, cont: ['掛號櫃台', '藥局', '病房', '護理站', '急診室', '倉庫'],
              loot: [['medkit', 1, 2, 30], ['pills', 1, 3, 30], ['metal', 1, 1, 10], ['plastic', 1, 2, 10], ['wu', 1, 3, 20]] },
  tech:     { n: '科技公司', lv: 3, trip: 2, cont: ['大廳', '辦公區', '機房', '研發室', '倉儲', '頂樓'],
              loot: [['metal', 1, 3, 25], ['plastic', 2, 3, 25], ['glass', 1, 2, 15], ['diesel', 1, 2, 15], ['solar', 1, 1, 5]] }
};
const LOCKED_LOOT = [['bp', 1, 1, 40], ['diesel', 2, 2, 25], ['medkit', 2, 2, 20], ['metal', 3, 4, 15]];
const ZOE_WANTS = ['wu', 'can', 'sausage', 'biscuit', 'pills', 'noodle', 'veg', 'choco'];
const TRADES = [
  { give: ['juice', 2], get: ['diesel', 1], min: 5 }, { give: ['juice', 1], get: ['metal', 2] }, { give: ['juice', 1], get: ['plastic', 2] },
  { give: ['can', 2], get: ['board', 2] }, { give: ['mushroom', 3], get: ['plastic', 2] }, { give: ['pills', 1], get: ['glass', 3] },
  { give: ['sausage', 4], get: ['wu', 3] }, { give: ['tomato_p', 3], get: ['metal', 1] }, { give: ['biscuit', 1], get: ['board', 2] },
  { give: ['straw_p', 2], get: ['medkit', 1] }, { give: ['juice', 3], get: ['glass', 4] }
];
const EXP_LV = [0, 8, 20, 40];
const expLevel = xp => EXP_LV.filter(t => xp >= t).length;
const pick = a => a[Math.floor(Math.random() * a.length)];
function rollLoot(table) {
  const total = table.reduce((a, r) => a + r[3], 0);
  let x = Math.random() * total;
  for (const r of table) { x -= r[3]; if (x <= 0) return [r[0], r[1] + Math.floor(Math.random() * (r[2] - r[1] + 1))]; }
  return [table[0][0], table[0][1]];
}
const outW = k => k === 'wu' ? 1 : k === 'bp' ? 0 : ITEMS[k].w;
function bagCap() { return BASE_BAG + J.upg.bag * 5 + (S.char === 'manager' ? 15 : 0); }

function m5Init(sv) {
  sv.xp = 0; sv.trades = 0; sv.out = null;
  sv.locs = {};
  for (const k of Object.keys(LOCS)) sv.locs[k] = { done: [] };
  sv.zoe = { state: 'wait', given: 0, miss: 0, want: null, today: false };
  sv.mgr = { state: 'none', fed: 0, miss: 0, today: false };
  sv.offers = [];
  if (S.char === 'student') { sv.talents.green = true; sv.talents.chef = true; }
}

function newOffers() {
  const sv = S.sv;
  if (!(sv.st.drone > 0)) { sv.offers = []; return; }
  const pool = TRADES.filter(t => !t.min || sv.trades >= t.min);
  const out = [];
  while (out.length < 3 && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  sv.offers = out.map(t => ({ give: t.give, get: [t.get[0], t.get[1] + (S.char === 'manager' ? 1 : 0)], done: false }));
}

// 每天早上：Zoe、倉庫經理、補貨、交易
function m5Morning(nd) {
  const sv = S.sv, z = sv.zoe, m = sv.mgr;
  if (z.state === 'wait' && nd >= 2) { z.state = 'asking'; z.want = pick(ZOE_WANTS); slog('隔壁的 Zoe 敲牆：「拜託，可以分我一點' + ITEMS[z.want].n + '嗎？」', true); chron(nd, '鄰居 Zoe 開始向你求助。'); }
  else if (z.state === 'asking') {
    if (z.today) z.miss = 0; else z.miss++;
    z.today = false;
    if (z.miss >= 3) { z.state = 'gone'; slog('隔壁再也沒有聲音了。', true); chron(nd, '你沒再幫 Zoe，她不見了。', 'bad'); }
    else { z.want = pick(ZOE_WANTS); slog('Zoe 今天想要：' + ITEMS[z.want].n + '。'); }
  }
  if (m.state === 'feeding') {
    if (m.today) m.miss = 0; else m.miss++;
    m.today = false;
    if (m.miss >= 3) { m.state = 'gone'; chron(nd, '貨車裡的倉庫經理沒撐下去。', 'bad'); }
  }
  if (nd % 7 === 0) { for (const k of Object.keys(sv.locs)) sv.locs[k].done = sv.locs[k].done.slice(2); slog('外面的地方又被翻動過，可能有新的東西。'); }
  newOffers();
}

Object.assign(SACT, {
  goOut(loc) {
    const sv = S.sv, L = LOCS[loc];
    if (!L || sv.out || expLevel(sv.xp) < L.lv || !canAct(L.trip, staCost(10))) return;
    if (L.noise && !(sv.st.noise > 0)) { slog('那裡屍群太多，要先做一個噪音器引開。'); render(); return; }
    if (L.noise) { sv.st.noise--; if (!sv.st.noise) delete sv.st.noise; }
    let radar = false;
    if (sv.st.radar > 0 && sv.power >= 1) { sv.power -= 1; radar = true; }
    sv.sta -= staCost(10);
    const conts = L.cont.map((n, i) => ({ n, i }));
    if (expLevel(sv.xp) >= 4) conts.push({ n: '上鎖的房間', i: 'lock' });
    if (loc === 'smarket' && sv.day >= 18 && expLevel(sv.xp) >= 2 && sv.mgr.state === 'none') conts.push({ n: '貨車駕駛座', i: 'truck' });
    sv.out = { loc, exp: 0, bag: {}, conts, radar };
    if (radar) slog('雷達開著，耗電 1 度。');
    slog('你帶上背包，悄悄出門前往' + L.n + '（' + L.trip + ' 小時）。');
    passHours(L.trip); render(); window.scrollTo(0, 0);
  },
  search(i) {
    const sv = S.sv, o = sv.out;
    if (!o || S.phase !== 'survive') return;
    const key = String(i), Lst = sv.locs[o.loc];
    if (Lst.done.includes(key) || !canAct(1, staCost(5))) return;
    const lv = expLevel(sv.xp);
    let exp = 20 - lv * 2 + Math.floor(Math.random() * 11) - 5;
    if (sv.hour >= 18) exp *= 2;
    exp *= expMul();
    if (o.loc === 'hospital') { J.stats = J.stats || {}; J.stats.hosp = (J.stats.hosp || 0) + 1; if (J.stats.hosp >= 5 && !J.chars.nurse) { J.chars.nurse = true; slog('你對醫院越來越熟了。（解鎖角色：護理師）', true); } saveJournal(); }
    o.exp += exp; sv.sta -= staCost(5); sv.xp += 1;
    Lst.done.push(key);
    let found = [];
    if (key === 'truck') {
      sv.mgr.state = 'feeding'; sv.mgr.today = true;
      slog('貨車駕駛座裡有個受傷的男人，自稱倉庫經理。他需要有人每天空投食物。', true);
      chron(sv.day, '在廢棄超市的貨車裡找到倉庫經理。');
    } else if ((o.loc === 'school' && key === '4' && expLevel(sv.xp) >= 2 && !sv.clues.includes('lab')) || (o.loc === 'tech' && key === '2' && !sv.clues.includes('server')) || (o.loc === 'hospital' && key === 'lock' && !sv.clues.includes('rec'))) {
      const c = o.loc === 'school' ? 'lab' : o.loc === 'tech' ? 'server' : 'rec';
      sv.clues.push(c); J.clues[c] = true; saveJournal();
      slog('你找到一條線索：' + CLUES[c], true);
      chron(sv.day, '找到真相碎片（' + sv.clues.length + '/3）。');
      found.push('真相碎片');
    } else if (key === '3' && o.loc === 'school' && !(sv.st.drone > 0) && !o.bag.drone) {
      o.bag.drone = 1; found.push('教學無人機');
    } else {
      const rolls = key === 'lock' ? 1 : 1 + (Math.random() < 0.35 + lootBonus() ? 1 : 0);
      for (let r = 0; r < rolls; r++) {
        const [k, q] = rollLoot(key === 'lock' ? LOCKED_LOOT : LOCS[o.loc].loot);
        const room = bagCap() - outWeight();
        const fit = outW(k) > 0 ? Math.min(q, Math.floor(room / outW(k))) : q;
        if (fit <= 0) { found.push(ITEMS[k] ? ITEMS[k].n + '（背包滿了，帶不走）' : '東西（帶不走）'); continue; }
        o.bag[k] = (o.bag[k] || 0) + fit;
        found.push((k === 'bp' ? '一張圖紙' : ITEMS[k].n) + ' ×' + fit);
      }
    }
    if (found.length) slog('搜了' + o.conts.find(c => String(c.i) === key).n + '：' + found.join('、') + '。');
    else if (key !== 'truck') slog('什麼都沒找到。');
    const before = expLevel(sv.xp - 1), after = expLevel(sv.xp);
    if (after > before) slog('探索等級升到 ' + after + '！' + (after === 2 ? '可以去醫院了。' : after === 3 ? '可以去科技公司了。' : '能打開上鎖的房間了。'), true);
    passHours(1);
    if (S.phase === 'survive' && o.exp >= 100) ambush();
    render();
  },
  goHome() {
    const sv = S.sv, o = sv.out;
    if (!o) return;
    const trip = LOCS[o.loc].trip;
    bringHome(o.bag);
    sv.out = null;
    passHours(trip);
    if (sv.hour > LAST_HOUR) sv.hour = LAST_HOUR;
    render(); window.scrollTo(0, 0);
  },
  zoe() {
    const sv = S.sv, z = sv.zoe;
    if (z.state !== 'asking' || z.today || sv_has(z.want) < 1 && !(z.want === 'wu' && sv.st.wu >= 1)) return;
    if (z.want === 'wu') sv.st.wu -= 1; else sv_take(z.want, 1);
    z.today = true; z.given++; sv.mor = clamp(sv.mor + 5);
    if (z.given >= 7) {
      z.state = 'saved';
      sv.st.fert = (sv.st.fert || 0) + 2; sv.st.tomato = (sv.st.tomato || 0) + 2;
      if (!J.chars.student) { J.chars.student = true; saveJournal(); }
      slog('Zoe 撐過來了！她送你肥料和種子，還說下次換她來幫你。（解鎖角色：大學生）', true);
      chron(sv.day, '救下 Zoe，解鎖大學生。', 'good');
    } else slog('你把' + ITEMS[z.want].n + '從牆洞遞過去。Zoe：「謝謝……」（' + z.given + '/7）');
    render();
  },
  airdrop() {
    const sv = S.sv, m = sv.mgr;
    if (m.state !== 'feeding' || m.today || !(sv.st.drone > 0)) return;
    const foods = ['biscuit', 'can', 'sausage', 'noodle', 'choco', 'veg', 'tomato_p', 'straw_p', 'mushroom', 'juice'];
    if (foods.reduce((a, k) => a + sv_has(k), 0) < 2) { slog('能空投的食物不夠 2 份。'); render(); return; }
    takeFrom(foods, 2);
    m.today = true; m.fed++;
    if (m.fed >= 5) {
      m.state = 'saved';
      sv.st.metal = (sv.st.metal || 0) + 4; sv.st.diesel = (sv.st.diesel || 0) + 1;
      if (!J.chars.manager) { J.chars.manager = true; saveJournal(); }
      slog('倉庫經理靠自己走到安全區了，臨走前用無人機回送鐵片和柴油。（解鎖角色：倉庫經理）', true);
      chron(sv.day, '救下倉庫經理，解鎖角色。', 'good');
    } else slog('無人機把 2 份食物空投到貨車（' + m.fed + '/5）。');
    render();
  },
  trade(i) {
    const sv = S.sv, o = sv.offers[Number(i)];
    if (!o || o.done || !(sv.st.drone > 0)) return;
    const [gk, gq] = o.give;
    if (sv_has(gk) < gq) return;
    sv_take(gk, gq);
    const [k, q] = o.get;
    if (k === 'wu') sv.st.wu += q; else sv.st[k] = (sv.st[k] || 0) + q;
    o.done = true; sv.trades++;
    slog('無人機交易：' + ITEMS[gk].n + '×' + gq + ' 換到 ' + ITEMS[k].n + '×' + q + '。' + (sv.trades === 5 ? '對方開始願意用柴油交換了。' : ''));
    render();
  },
  juice() {
    const sv = S.sv;
    if (!(sv.st.juicer > 0) || vegPool() < 2 || !canAct(1, staCost(3))) return;
    takeFrom(VEGGIES, 2); sv.st.juice = (sv.st.juice || 0) + 1; sv.sta -= staCost(3);
    slog('榨了一瓶果汁。很適合拿去交易。');
    passHours(1); render();
  },
  pickChar(k) { if (!J.chars[k]) return; J.char = k; saveJournal(); render(); }
});

function outWeight() { const o = S.sv.out; return o ? Object.entries(o.bag).reduce((a, [k, q]) => a + outW(k) * q, 0) : 0; }
function bringHome(bag) {
  const sv = S.sv, got = [];
  for (const [k, q] of Object.entries(bag)) {
    if (k === 'bp') {
      for (let i = 0; i < q; i++) {
        const locked = Object.keys(RECIPES).filter(r => !RECIPES[r].base && !sv.recipes.includes(r));
        if (locked.length) { const r = pick(locked); sv.recipes.push(r); J.recipes[r] = true; saveJournal(); got.push('圖紙「' + RECIPES[r].n + '」'); }
        else { sv.st.plastic = (sv.st.plastic || 0) + 2; got.push('塑膠×2（圖紙都有了）'); }
      }
      continue;
    }
    let fit = q;
    if (k !== 'wu' && ITEMS[k].cat !== 'equip' && ITEMS[k].w > 0) fit = Math.max(0, Math.min(q, Math.floor((storeCap() - storeWeight()) / ITEMS[k].w)));
    if (fit < q) got.push(ITEMS[k].n + '×' + (q - fit) + '（倉庫放不下，丟在門口）');
    if (!fit) continue;
    if (k === 'wu') sv.st.wu += fit; else sv.st[k] = (sv.st[k] || 0) + fit;
    got.push(ITEMS[k].n + '×' + fit);
  }
  slog(got.length ? '平安回家，帶回 ' + got.join('、') + '。' : '空手回家。');
  if (bag.drone) newOffers();
}
function ambush() {
  const sv = S.sv, o = sv.out;
  hurt(20, 'ambush'); sv.mor = clamp(sv.mor - 10);
  for (const k of Object.keys(o.bag)) { o.bag[k] = Math.floor(o.bag[k] / 2); if (!o.bag[k]) delete o.bag[k]; }
  slog('動靜太大，被屍群包圍了！你丟下一半的東西逃回家，生命 -20。', true);
  chron(sv.day, '在' + LOCS[o.loc].n + '被屍群包圍，負傷逃回。', 'bad');
  if (checkDeath()) return;
  bringHome(o.bag);
  sv.out = null;
  passHours(LOCS[o.loc].trip);
}

function viewOut() {
  const sv = S.sv, o = sv.out, L = LOCS[o.loc], Lst = sv.locs[o.loc];
  const w = outWeight(), cap = bagCap();
  let h = sceneSVG(o.loc) + '<div class="place"><h2>' + L.n + '</h2><span class="sub">探索等級 ' + expLevel(sv.xp) + '</span></div>';
  h += '<div class="cat">暴露值</div><div class="bar' + (o.exp >= 70 ? ' full' : '') + '" style="height:12px"><i style="width:' + Math.min(100, o.exp) + '%"></i></div>' +
    '<p class="empty">' + Math.round(o.exp) + '% · 滿 100% 會被屍群包圍，丟掉一半東西、生命 -20。' + (sv.hour >= 18 ? '<b style="color:var(--stamp)">天黑了，暴露值漲兩倍。</b>' : '') + '</p>';
  h += '<div class="cat">可以搜的地方（每處 1 小時）</div><div class="sheet">';
  for (const c of o.conts) {
    const done = Lst.done.includes(String(c.i));
    h += actRow(c.n + (c.i === 'lock' ? '<span class="tag amber">稀有</span>' : c.i === 'truck' ? '<span class="tag red">有人？</span>' : ''), done ? '已經搜過' : '暴露值約 +' + (20 - expLevel(sv.xp) * 2) + '% · 體力 -' + staCost(5), done ? '空' : '搜', 'search', String(c.i), !done && canAct(1, staCost(5)));
  }
  h += '</div>';
  h += '<div class="cat">背包 ' + kg(w) + ' / ' + cap + 'kg</div>';
  const items = Object.entries(o.bag);
  h += items.length ? '<div class="sheet">' + items.map(([k, q]) => '<div class="item"><div><div class="nm">' + (k === 'bp' ? '圖紙' : ITEMS[k].n) + '</div></div><div class="price">×' + q + '</div></div>').join('') + '</div>' : '<p class="empty">還沒找到東西。</p>';
  h += '<div class="row-btns"><button class="btn red" data-a="goHome">回家（' + L.trip + ' 小時）</button></div>';
  return h;
}

function viewOutside() {
  const sv = S.sv, lv = expLevel(sv.xp);
  let h = '<div class="cat">外出搜刮（探索等級 ' + lv + '，經驗 ' + sv.xp + (lv < 4 ? '/' + EXP_LV[lv] : '') + '）</div><div class="sheet">';
  for (const [k, L] of Object.entries(LOCS)) {
    const left = L.cont.length - sv.locs[k].done.filter(x => /^\d$/.test(x)).length;
    const locked = lv < L.lv;
    const noNoise = L.noise && !(sv.st.noise > 0);
    h += actRow(L.n, locked ? '探索等級 ' + L.lv + ' 才能去' : '單程 ' + L.trip + ' 小時 · 還有 ' + left + ' 處沒搜 · 體力 -' + staCost(10) + (L.noise ? ' · 要用 1 個噪音器（有 ' + (sv.st.noise || 0) + '）' : '') + (sv.st.radar > 0 ? ' · 雷達' + (sv.power >= 1 ? '可用' : '沒電') : ''), '出門', 'goOut', k, !locked && !noNoise && canAct(L.trip + 1, staCost(10)));
  }
  h += '</div>';
  if (hordeOn(sv.day)) h += '<p class="empty">今晚有屍潮，記得留時間回家準備。</p>';
  // 鄰居
  const z = sv.zoe;
  let soc = '';
  if (z.state === 'asking') {
    const have = z.want === 'wu' ? sv.st.wu >= 1 : sv_has(z.want) >= 1;
    soc += actRow('幫隔壁的 Zoe', z.today ? '今天已經給過了（' + z.given + '/7）' : '她想要：' + ITEMS[z.want].n + ' · 已幫 ' + z.given + '/7 · 連續 3 天沒幫她就會不見', '給她', 'zoe', '', !z.today && have);
  }
  const m = sv.mgr;
  if (m.state === 'feeding') soc += actRow('空投給倉庫經理', m.today ? '今天已經空投過（' + m.fed + '/5）' : '用無人機送 2 份食物 · ' + m.fed + '/5' + (sv.st.drone ? '' : ' · <b style="color:var(--stamp)">需要無人機</b>'), '空投', 'airdrop', '', !m.today && sv.st.drone > 0);
  soc += viewExtraSocial();
  if (soc) h += '<div class="cat">其他倖存者</div><div class="sheet">' + soc + '</div>';
  // 交易
  h += '<div class="cat">無人機交易</div>';
  if (!(sv.st.drone > 0)) h += '<p class="empty">沒有無人機。聽說學校的教師辦公室有一台教學用的。</p>';
  else {
    h += '<div class="sheet">' + (sv.offers.length ? sv.offers.map((o, i) => actRow(ITEMS[o.give[0]].n + '×' + o.give[1] + ' → ' + ITEMS[o.get[0]].n + '×' + o.get[1], o.done ? '已完成' : '你有 ' + (o.give[0] === 'wu' ? sv.st.wu : sv_has(o.give[0])) + ' 個', o.done ? '完成' : '交換', 'trade', String(i), !o.done && sv_has(o.give[0]) >= o.give[1])).join('') : '<p class="empty">今天沒有人回應，明天再試。</p>') + '</div>';
    h += '<p class="empty">每天早上換一批。已完成 ' + sv.trades + ' 次交易' + (sv.trades < 5 ? '，滿 5 次後對方願意給柴油。' : '。') + '</p>';
  }
  if (sv.st.juicer > 0) h += '<div class="sheet">' + actRow('榨果汁', '2 份蔬果 → 1 瓶果汁 · 1 小時 · 交易的熱門貨', '榨', 'juice', '', vegPool() >= 2 && canAct(1, staCost(3))) + '</div>';
  return h;
}

function viewChars() {
  const cur = J.char || 'neighbor';
  return '<div class="cat">角色</div><div class="sheet">' + Object.entries(CHARS).map(([k, c]) => {
    const open = J.chars[k];
    return '<div class="item"><div><div class="nm">' + (open ? c.n : '？？？') + (cur === k ? '<span class="tag green">使用中</span>' : '') + '</div><div class="meta">' + (open ? c.d : '解鎖方法：' + c.how) + '</div></div>' +
      '<button class="btn ghost" data-a="pickChar" data-v="' + k + '"' + (!open || cur === k ? ' disabled' : '') + '>選</button></div>';
  }).join('') + '</div>';
}
