/* ================= 在地化：颱風、地震、夜市、台灣場景 ================= */
Object.assign(ITEMS, {
  friedchk: { n: '鹹酥雞', cat: 'food', w: 0.5, note: '飽足 40 · 心態 +8' },
  bubble:   { n: '珍珠奶茶', cat: 'food', w: 0.6, note: '飽足 15 · 心態 +15' }
});
Object.assign(FOOD, { friedchk: { sat: 40, mor: 8 }, bubble: { sat: 15, mor: 15 } });
EAT_ORDER.push('friedchk', 'bubble');
STORES.nightmkt = { n: '夜市', x: -2, y: 1, opens: 480, closes: 600, desc: '16:00 才開。吃的便宜又好吃，心情會好一點。', items: { friedchk: [7, 10], bubble: [6, 10], sausage: [3, 20], veg: [6, 8] } };
STORE_ORDER.push('nightmkt');
const _isOpenBase = isOpen;
isOpen = function (store, t) { const st = STORES[store]; return _isOpenBase(store, t) && !(st.opens && t < st.opens); };

// 颱風（兩次，每次兩天）與地震（一次）的日子，每輪固定、每日挑戰相同
function disasterDays() {
  const sv = S.sv;
  if (!sv.natural) {
    const t1 = 12 + Math.floor(rndAt('ty1') * 8), t2 = 55 + Math.floor(rndAt('ty2') * 10), q = 30 + Math.floor(rndAt('eq') * 50);
    sv.natural = { ty: [t1, t1 + 1, t2, t2 + 1], eq: q };
  }
  return sv.natural;
}
function isTyphoon(d) { return !!(S && S.sv && disasterDays().ty.includes(d)); }
const _m8Local = m8Morning;
m8Morning = function (nd) {
  const sv = S.sv, st = sv.st, N = disasterDays();
  if (N.ty.includes(nd + 1) && !N.ty.includes(nd)) slog('收音機：颱風明天登陸，請做好防颱準備。地下室小心淹水。', true);
  if (N.ty.includes(nd)) {
    const first = !N.ty.includes(nd - 1);
    if (first) chron(nd, '颱風登陸。', 'bad');
    sv.def = Math.max(0, sv.def - 30);
    if (st.rain) { st.wu += st.rain * 4; slog('颱風帶來大量雨水，收集器裝了 ' + st.rain * 4 + ' 份水。'); }
    slog('颱風天：狂風暴雨，太陽能完全不發電，防線被吹壞 30。', true);
    sv.mor = clamp(sv.mor - 4);
    if (first && sv.floors.includes('B1')) {
      const keys = Object.keys(st).filter(k => k !== 'wu' && ITEMS[k] && ITEMS[k].cat !== 'equip' && st[k] > 0);
      const lost = [];
      for (let i = 0; i < 3 && keys.length; i++) { const k = keys.splice(Math.floor(rnd() * keys.length), 1)[0]; const n = Math.ceil(st[k] * 0.3); st[k] -= n; if (!st[k]) delete st[k]; lost.push(ITEMS[k].n + '×' + n); }
      if (lost.length) { slog('地下室淹水，泡壞了 ' + lost.join('、') + '。', true); chron(nd, '地下室淹水，損失 ' + lost.join('、') + '。', 'bad'); }
    }
  }
  if (nd === N.eq) {
    const lose = Math.round(sv.def * 0.3); sv.def -= lose;
    sv.mor = clamp(sv.mor - 10);
    for (const t of sv.traps) t.uses = Math.max(1, t.uses - 1);
    let msg = '大地震！防線 -' + lose + '，陷阱受損。';
    if (typeof normRooms === 'function') normRooms();
    const built = sv.rooms.map((r, i) => r ? i : -1).filter(i => i >= 0);
    if (built.length && rnd() < 0.25) { const i = built[Math.floor(rnd() * built.length)]; msg += ROOMS[sv.rooms[i]].n + '倒塌了。'; sv.rooms[i] = null; }
    slog(msg, true); chron(nd, msg, 'bad');
  }
  _m8Local(nd);
};
const _swLocal = sleepWarnings;
sleepWarnings = function () { const w = _swLocal(); if (S.sv && disasterDays().ty.includes(S.sv.day + 1)) w.push('明天颱風，太陽能不會發電，有地下室的話東西可能泡水。'); return w; };

/* ---------- 台灣場景：只換名稱和說明，玩法不變 ---------- */
const TW = {
  stores: { home: ['老公寓', '五樓公寓，樓下就是巷口。門口有收舊家具的阿姨。爆發後會停電，用電要自己想辦法。'], conv: ['巷口超商', '24 小時開，什麼都有一點，價格偏貴。'], pharm: ['藥局', '藥師認識你，醫療用品只有這裡買得到。'], mart: ['量販店', '便宜量大。電視說今天可能會有搶購潮。'], tool: ['五金行', '建材和柴油。老闆說柴油只剩這些。'], reno: ['系統櫃裝潢行', '大型設備都在這。16:00 前下單才送得到。'], farm: ['傳統市場', '種子和新鮮蔬菜。阿桑會多送你一把蔥。'], cars: ['機車行', '一台二手機車 $500，不要了可以 $450 賣回。'], news: ['廟口', '廟公什麼都聽說過一點。買過的消息會記在日誌裡。'], gas: ['加油站', '柴油比五金行貴一點，但不用排隊。'], nightmkt: ['夜市', '16:00 才開。鹹酥雞和珍奶，吃了心情會好一點。'] },
  items: { sausage: '香腸', noodle: '泡麵', biscuit: '蘇打餅乾', can: '肉醬罐頭', veg: '高麗菜', water: '礦泉水（一箱）', rice: '米（一包）', choco: '黑糖糕' },
  locs: { smarket: '廢棄量販店', residential: '透天厝社區', subway: '捷運站', police: '派出所', hardware: '五金行廢墟', school: '國小', hospital: '醫院', tech: '科技園區' }
};
const ORIG = { stores: {}, items: {}, locs: {} };
function applyStyle() {
  const tw = J.style === 'tw';
  for (const [k, [n, d]] of Object.entries(TW.stores)) { if (!STORES[k]) continue; if (!ORIG.stores[k]) ORIG.stores[k] = [STORES[k].n, STORES[k].desc]; STORES[k].n = tw ? n : ORIG.stores[k][0]; STORES[k].desc = tw ? d : ORIG.stores[k][1]; }
  for (const [k, n] of Object.entries(TW.items)) { if (!ITEMS[k]) continue; if (!ORIG.items[k]) ORIG.items[k] = ITEMS[k].n; ITEMS[k].n = tw ? n : ORIG.items[k]; }
  for (const [k, n] of Object.entries(TW.locs)) { if (!LOCS[k]) continue; if (!ORIG.locs[k]) ORIG.locs[k] = LOCS[k].n; LOCS[k].n = tw ? n : ORIG.locs[k]; }
}
Object.assign(ACT, { style(v) { J.style = v === 'tw' ? 'tw' : 'normal'; saveJournal(); applyStyle(); render(); } });
function viewStylePick() {
  const tw = J.style === 'tw';
  return '<div class="setrow"><span>場景</span><button class="pill' + (!tw ? ' on' : '') + '" data-a="style" data-v="normal">一般</button><button class="pill' + (tw ? ' on' : '') + '" data-a="style" data-v="tw">台灣</button></div>';
}
const _viewSetupLocal = viewSetup;
viewSetup = function () { const h = _viewSetupLocal(); const i = h.lastIndexOf('</div>'); return h.slice(0, i) + viewStylePick() + h.slice(i); };
