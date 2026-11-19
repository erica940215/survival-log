/* ================= 操作便利：一鍵吃喝、睡前警告、每日小結 ================= */
const EAT_ORDER = ['hotpot', 'soup', 'rice_c', 'veg', 'tomato_p', 'straw_p', 'mushroom', 'sausage', 'noodle', 'can', 'biscuit', 'choco', 'juice'];
function foodPortions() { return Object.keys(FOOD).reduce((a, k) => a + sv_has(k) * FOOD[k].sat / 25, 0) + (S.sv.st.rice || 0) * 8; }
function nextFood() {
  const sv = S.sv;
  // 先吃快壞的新鮮食物，再照順序吃料理、一般食物
  const fresh = sv.fresh.filter(f => FOOD[f.k]).sort((a, b) => a.life - b.life);
  if (fresh.length && fresh[0].life <= 1.01) return fresh[0].k;
  return EAT_ORDER.find(k => k !== 'juice' && sv_has(k) > 0) || (sv_has('juice') > 0 ? 'juice' : null);
}
Object.assign(SACT, {
  eatFull() {
    const sv = S.sv; let n = 0, gain = 0; const before = sv.sat;
    while (sv.sat < 85 && n < 20) {
      const k = nextFood(); if (!k) break;
      sv_take(k, 1);
      const f = FOOD[k], g = Math.round(f.sat * (f.dish && hasT('chef') ? 1.2 : 1));
      sv.sat = clamp(sv.sat + g); if (f.mor) sv.mor = clamp(sv.mor + f.mor); n++;
    }
    slog(n ? '吃了 ' + n + ' 份東西，飽足 ' + Math.round(before) + ' → ' + Math.round(sv.sat) + '。' : '沒有能直接吃的東西了。');
    render();
  },
  drinkFull() {
    const sv = S.sv, tap = sv.day <= 5; let n = 0; const before = sv.hyd;
    while (sv.hyd < 85 && (tap || sv.st.wu >= 1) && n < 10) { if (!tap) sv.st.wu -= 1; sv.hyd = clamp(sv.hyd + 30); n++; }
    slog(n ? (tap ? '喝了 ' + n + ' 杯自來水' : '喝了 ' + n + ' 份水') + '，水分 ' + Math.round(before) + ' → ' + Math.round(sv.hyd) + '。' : '沒有水了。');
    render();
  }
});

// 今晚屍潮大概會打掉多少防線（不含隨機與守夜時的修補）
function hordeForecast(watch) {
  const sv = S.sv, hz = hordeOn(sv.day);
  if (!hz) return null;
  let dmg = hz[1] * 4 * (watch ? 0.6 : 1) * hordeMul() * (typeof hordeTypeMul === 'function' ? hordeTypeMul(sv.day, watch) : 1) * diffHorde();
  let trap = 0, power = sv.power;
  for (const t of sv.traps) { const T = TRAPS[t.k]; if (T.power) { if (power < T.power) continue; power -= T.power; } trap += T.dmg * (hasT('traps') ? 1.15 : 1) * (1 + (defLv() - 1) * 0.05) * (typeof trapTypeMul === 'function' ? trapTypeMul(sv.day, t.k) : 1); }
  if (watch) trap += Math.min(3, sv.st.molotov || 0) * 120 * moloMul(sv.day);
  return Math.max(0, dmg - trap);
}
function sleepWarnings() {
  const sv = S.sv, st = sv.st, w = [];
  const waterDays = sv.day <= 5 ? 99 : st.wu / 2;
  if (waterDays < 2) w.push('水只剩 ' + st.wu + ' 份，大約撐 ' + Math.max(0, Math.floor(waterDays)) + ' 天。');
  const fd = foodPortions() / 3.5;
  if (fd < 2) w.push('食物大約只夠 ' + Math.max(0, Math.floor(fd)) + ' 天。');
  if (sv.sat < 30) w.push('飽足很低，睡前先吃點東西。');
  if (sv.hyd < 30) w.push('水分很低，睡前先喝水。');
  const f = hordeForecast(false);
  if (f !== null && f > sv.def) w.push('今晚屍潮預估造成 ' + Math.round(f) + ' 傷害，防線只有 ' + Math.round(sv.def) + '，會被突破。' + (hordeForecast(true) <= sv.def ? '守夜擋得住。' : '守夜也很危險，先加固。'));
  if (inCold(sv.day) && !heated()) w.push('寒潮中沒有取暖，今晚會掉血。');
  const cold = inCold(sv.day), rain = inRain(sv.day);
  const need = (st.ac > 0 && sv.dev.ac && cold ? 1.5 : 0) + (st.freezer > 0 && sv.dev.freezer ? 1 : 0) + (st.lightbox > 0 && sv.dev.lightbox ? st.lightbox : 0) + ROBOTS.reduce((a, k) => a + (st[k] > 0 && sv.dev[k] ? 0.5 : 0), 0);
  const have = sv.power + (st.solar || 0) * 1.5 * powerMul() * (rain ? 0.1 : cold ? 0.6 : 1);
  if (need > 0 && have < need) w.push('電不夠：設備要 ' + need + ' 度，只有約 ' + (Math.round(have * 10) / 10) + ' 度，有些設備會停。');
  return w;
}
function viewSleepWarn() {
  const w = sleepWarnings();
  return w.length ? '<div class="warnbox"><b>睡前注意</b><ul>' + w.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div>' : '';
}

// 每日小結：跟前一天早上比
function dayMark() { const sv = S.sv; return { hp: sv.hp, def: sv.def, wu: sv.st.wu, food: foodPortions(), power: sv.power, mor: sv.mor }; }
function morningSummary(nd) {
  const sv = S.sv, a = sv.mark, b = dayMark();
  sv.mark = b;
  if (!a) return;
  const d = (x, y, unit, dec) => { const v = Math.round((y - x) * (dec ? 10 : 1)) / (dec ? 10 : 1); return (v > 0 ? '+' : '') + v + (unit || ''); };
  sv.summary = { day: nd - 1, items: [['生命', d(a.hp, b.hp)], ['水', d(a.wu, b.wu, ' 份')], ['食物', d(a.food, b.food, ' 份')], ['防線', d(a.def, b.def)], ['電', d(a.power, b.power, ' 度', true)], ['心態', d(a.mor, b.mor)]] };
}
function viewSummary() {
  const s = S.sv.summary;
  if (!s || s.day !== S.sv.day - 1 || S.sv.hour > 12) return '';
  return '<div class="summary"><span class="hand">第 ' + s.day + ' 天小結</span>' + s.items.map(([k, v]) => '<span>' + k + ' <b class="' + (v.startsWith('-') ? 'neg' : v.startsWith('+') ? 'pos' : '') + '">' + v + '</b></span>').join('') + '</div>';
}
