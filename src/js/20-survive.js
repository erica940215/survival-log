/* ================= M2：爆發後守家生存 ================= */
const FOOD = {
  rice_c: { sat: 25, dish: true }, biscuit: { sat: 75 }, sausage: { sat: 25 }, noodle: { sat: 25 }, can: { sat: 38 },
  veg: { sat: 50, mor: 3 }, choco: { sat: 12, mor: 10 }, tomato_p: { sat: 15, mor: 3 }, straw_p: { sat: 15, mor: 6 }, mushroom: { sat: 20 },
  soup: { sat: 40, mor: 5, dish: true }, hotpot: { sat: 100, mor: 12, dish: true }, juice: { sat: 10, mor: 8 }
};
const FRESH_LIFE = { veg: 5, rice_c: 2, tomato_p: 3, straw_p: 3, mushroom: 3, soup: 2, hotpot: 1 };
const REINFORCE = { board: 40, metal: 70, glass: 20 };
const LAST_HOUR = 24;
const inCold = d => d >= COLD[0] && d <= COLD[1];
const inRain = d => RAIN.some(r => d >= r[0] && d <= r[1]);
const hordeOn = d => d > 100 ? ((d - 100) % 7 === 0 ? [d, 320 + (d - 100) / 7 * 40] : undefined) : HORDES.find(x => x[0] === d);
function hordeSize(str) { return str < 60 ? '小規模' : str < 150 ? '中規模' : '大規模'; }

function startSurvive() {
  const st = {};
  for (const [k, q] of Object.entries(S.home)) st[k] = q;
  st.wu = (st.water || 0) * 6 + (st.barrel || 0) * 10;
  delete st.water;
  const fresh = [];
  if (st.veg) { fresh.push({ k: 'veg', q: st.veg, life: FRESH_LIFE.veg }); delete st.veg; }
  const defMax = 120 + (st.door || 0) * 480 + Math.min(st.window || 0, 2) * 120;
  S.phase = 'survive';
  S.sv = {
    day: 1, hour: 18, hp: 100, sat: 70, hyd: 70, sta: 70, mor: 60,
    power: Math.min(3 + (st.battery || 0) * 10, (st.battery || 0) * 10),
    def: defMax, defMax, st, fresh,
    dev: { freezer: true, lightbox: true, ac: false },
    plants: [], farmAcc: 0, mushAcc: 0,
    log: [], chron: [], lastHurt: '', hordesSeen: 0, coldSeen: false, rainSeen: false, rainAcc: 0
  };
  UI = { tab: 'act', qty: {} };
  slog('18:00，尖叫聲從街上傳來。你鎖上門，這裡就是你的堡壘了。', true);
  chron(0, '爆發。防線耐久 ' + defMax + '，水 ' + st.wu + ' 份。');
  if (hordeOn(1)) slog('收音機：今晚有屍潮。', true);
  m4Init(S.sv);
  m5Init(S.sv);
  m6Init(S.sv);
  m7Init(S.sv);
  S.snaps = [];
  snapshot();
}

function slog(txt, alert) { if (alert && typeof sfx === 'function') sfx('alert'); const sv = S.sv; sv.log.unshift({ txt, alert: !!alert }); sv.log = sv.log.slice(0, 30); }
function chron(d, txt, cls) { S.sv.chron.push({ d: d ? '第 ' + d + ' 天' : '爆發', txt, cls: cls || '' }); }
function sv_has(k) { const sv = S.sv; return (sv.st[k] || 0) + sv.fresh.filter(f => f.k === k).reduce((a, f) => a + f.q, 0); }
function sv_take(k, n) {
  const sv = S.sv;
  const batches = sv.fresh.filter(f => f.k === k).sort((a, b) => a.life - b.life);
  for (const b of batches) { const t = Math.min(b.q, n); b.q -= t; n -= t; if (n <= 0) break; }
  sv.fresh = sv.fresh.filter(f => f.q > 0);
  if (n > 0) { sv.st[k] = (sv.st[k] || 0) - n; if (sv.st[k] <= 0) delete sv.st[k]; }
}
function sv_addFresh(k, q) { if (q <= 0) return; if (!FRESH_LIFE[k]) { S.sv.st[k] = (S.sv.st[k] || 0) + q; return; } S.sv.fresh.push({ k, q, life: FRESH_LIFE[k] }); }
const clamp = v => Math.max(0, Math.min(100, v));
function powerCap() { return 3 + (S.sv.st.battery || 0) * 10; }
function slots() { const st = S.sv.st; return { light: (st.lightbox || 0) * 4, green: (S.sv.rooms || []).filter(r => r === 'greenhouse').length * 4, pot: st.pot || 0 }; }
function heated() { const sv = S.sv; return (sv.dev.ac && (sv.st.ac || 0) > 0 && sv.power > 0) || ((sv.st.heater || 0) > 0 && (sv.st.board || 0) > 0); }

function hurt(v, why) { const sv = S.sv; sv.hp -= v; if (v > 0) sv.lastHurt = why; }

// 醒著的時間流逝
function passHours(n) {
  const sv = S.sv;
  for (let i = 0; i < n; i++) {
    sv.hour++;
    sv.sat = clamp(sv.sat - 2.2);
    sv.hyd = clamp(sv.hyd - 2.6);
    sv.mor = clamp(sv.mor - 0.3);
    if (sv.sat <= 0) hurt(2, 'food');
    if (sv.hyd <= 0) hurt(4, 'water');
    if (inCold(sv.day) && !heated()) hurt(hasT('warm') ? 0.3 : 0.6, 'cold');
  }
  checkDeath();
}

function checkDeath() {
  const sv = S.sv;
  if (sv.hp > 0 || S.phase !== 'survive') return false;
  const map = { water: ['缺水，撐不下去了。', 'water'], food: ['斷糧，餓到撐不下去。', 'food'], horde: ['屍群破門而入。', 'horde'], cold: ['在寒潮中失溫。', 'cold'], ambush: ['外出時被屍群包圍，沒能逃回家。', 'ambush'] };
  const m = map[sv.lastHurt] || ['撐不下去了。', 'other'];
  chron(sv.day, m[0], 'bad');
  finishRun({ days: sv.day - 1, cause: m[0], causeKey: m[1], timeline: sv.chron, stats: null, hordesSeen: sv.hordesSeen, coldSeen: sv.coldSeen, rainSeen: sv.rainSeen });
  return true;
}

function canAct(hours, sta) {
  const sv = S.sv;
  if (S.phase !== 'survive') return false;
  if (sv.hour + hours > LAST_HOUR) return false;
  if (sta && sv.sta < sta) return false;
  return true;
}

const SACT = {
  eat(k) {
    const sv = S.sv, f = FOOD[k];
    if (!f || sv_has(k) <= 0) return;
    sv_take(k, 1);
    const gain = Math.round(f.sat * (f.dish && hasT('chef') ? 1.2 : 1));
    sv.sat = clamp(sv.sat + gain); if (f.mor) sv.mor = clamp(sv.mor + f.mor);
    slog('吃了' + ITEMS[k].n + '，飽足 +' + gain + '。');
    render();
  },
  drink() {
    const sv = S.sv;
    const tap = sv.day <= 5;
    if (sv.st.wu < 1 && !tap) return;
    if (!tap) sv.st.wu -= 1;
    sv.hyd = clamp(sv.hyd + 30);
    slog(tap ? '自來水還沒停，喝了一杯。水分 +30。' : '喝了一份水，水分 +30。'); render();
  },
  cook() {
    const sv = S.sv;
    if (!canAct(1, 5) || !(sv.st.microwave > 0) || !(sv.st.rice > 0) || sv.power < 0.3) return;
    sv.st.rice -= 1; if (!sv.st.rice) delete sv.st.rice;
    sv.power -= 0.3; sv.sta -= 5; sv_addFresh('rice_c', 8);
    slog('用微波爐煮了一袋米，得到 8 份熟飯（2 天內要吃完）。');
    passHours(1); render();
  },
  reinforce(k) {
    const sv = S.sv;
    if (sv.sick) { slog('生病中，沒力氣加固。'); render(); return; }
    if (!canAct(1, staCost(12)) || !(sv.st[k] > 0) || sv.def >= sv.defMax * 1.5) return;
    sv.st[k] -= 1; if (!sv.st[k]) delete sv.st[k];
    const add = REINFORCE[k];
    sv.def = Math.min(sv.defMax * 1.5, sv.def + add); sv.sta -= staCost(12);
    slog('用' + ITEMS[k].n + '加固防線，耐久 +' + add + '。');
    passHours(1); render();
  },
  gen() {
    const sv = S.sv;
    if (!canAct(1) || !(sv.st.gen > 0) || !(sv.st.diesel > 0)) return;
    const cap = powerCap();
    if (sv.power >= cap) { slog('電已經存滿了。'); render(); return; }
    sv.st.diesel -= 1; if (!sv.st.diesel) delete sv.st.diesel;
    const before = sv.power; sv.power = Math.min(cap, sv.power + 6 * powerMul());
    slog('發電機轟轟作響，燒掉一桶柴油，電力 +' + (Math.round((sv.power - before) * 10) / 10) + ' 度' + (sv.power - before < 6 * powerMul() - 0.01 ? '（存不下的浪費了）' : '') + '。');
    passHours(1); render();
  },
  pedal() {
    const sv = S.sv;
    if (!canAct(1, staCost(20)) || !(sv.st.pedal > 0)) return;
    sv.sta -= staCost(20); sv.power = Math.min(powerCap(), sv.power + 1.5 * powerMul());
    slog('踩了一小時人力發電機，電力 +1.5 度。');
    passHours(1); render();
  },
  plant(k) {
    const sv = S.sv;
    if (!canAct(1, 5) || !(sv.st[k] > 0)) return;
    const s = slots();
    const free = freeSlots();
    if (free <= 0) { slog('沒有空的盆位了。'); render(); return; }
    sv.st[k] -= 1; if (!sv.st[k]) delete sv.st[k];
    const n = Math.min(2, free);
    for (let i = 0; i < n; i++) {
      const cnt = t => sv.plants.filter(p => p.slot === t).length;
      const slot = cnt('light') < s.light ? 'light' : cnt('green') < s.green ? 'green' : 'pot';
      sv.plants.push({ k: SEED_OUT[k], slot, age: 0 });
    }
    sv.sta -= 5;
    slog('種下' + ITEMS[k].n + '，' + n + ' 株。大約 8 天後開始收成。');
    passHours(1); render();
  },
  rest() {
    const sv = S.sv;
    if (!canAct(1)) return;
    sv.mor = clamp(sv.mor + 12); sv.sta = clamp(sv.sta + 5);
    slog('翻了翻舊漫畫，聽了一會兒收音機。心態 +12。');
    passHours(1); render();
  },
  heal(k) {
    const sv = S.sv;
    if (!(sv.st[k] > 0) || (sv.hp >= 100 && !(k === 'pills' && sv.sick))) return;
    sv.st[k] -= 1; if (!sv.st[k]) delete sv.st[k];
    const v = k === 'medkit' ? (S.char === 'nurse' ? 52 : 35) : 10;
    sv.hp = Math.min(100, sv.hp + v); if (k === 'pills') { sv.mor = clamp(sv.mor + 3); if (sv.sick) { sv.sick = 0; slog('病好了。'); } }
    slog('用了' + ITEMS[k].n + '，生命 +' + v + '。'); render();
  },
  toggle(k) { const sv = S.sv; sv.dev[k] = !sv.dev[k]; slog((sv.dev[k] ? '打開' : '關掉') + ITEMS[k].n + '（睡前結算耗電）。'); render(); },
  sleep() { night(false); },
  watch() { night(true); },
  giveup() { const sv = S.sv; sv.lastHurt = 'other'; chron(sv.day, '你放棄了這一輪。', 'bad'); finishRun({ days: sv.day - 1, cause: '你放棄了這一輪。', causeKey: '', timeline: sv.chron, stats: null, hordesSeen: sv.hordesSeen, coldSeen: sv.coldSeen, rainSeen: sv.rainSeen }); render(); }
};

function night(watch) {
  const sv = S.sv, d = sv.day, st = sv.st;
  if (S.phase !== 'survive') return;
  const cold = inCold(d), rain = inRain(d);
  const cap = powerCap();

  // 1. 白天太陽能入帳
  const solar = (st.solar || 0) * 1.5 * powerMul() * (rain ? 0.1 : cold ? 0.6 : 1);
  if (solar > 0) sv.power = Math.min(cap, sv.power + solar);

  // 2. 設備耗電（冷氣 > 冰櫃 > 種植箱）
  const devs = [['ac', cold ? 1.5 : 0], ['freezer', 1], ['lightbox', (st.lightbox || 0) * 1], ['bot_fix', 0.5], ['bot_farm', 0.5], ['bot_cook', 0.5]];
  sv.powered = {};
  for (const [k, need] of devs) {
    if (!(st[k] > 0) || !sv.dev[k] || need <= 0) { sv.powered[k] = false; continue; }
    if (sv.power >= need) { sv.power -= need; sv.powered[k] = true; }
    else { sv.powered[k] = false; slog('電不夠，' + ITEMS[k].n + '停了。', true); }
  }
  sv.acOn = !!sv.powered.ac;
  sv.heaterOn = false;
  if (cold && !sv.acOn && (st.heater || 0) > 0 && (st.board || 0) > 0) { st.board--; if (!st.board) delete st.board; sv.heaterOn = true; slog('暖爐燒掉 1 片木板。'); }
  const warmNight = sv.acOn || sv.heaterOn;

  // 3. 雨水
  if (st.rain) { sv.rainAcc += st.rain * (rain ? 2 : 0.25); const w = Math.floor(sv.rainAcc); if (w > 0) { st.wu += w; sv.rainAcc -= w; slog('雨水收集器裝了 ' + w + ' 份水。'); } }

  // 4. 屍潮
  const hz = hordeOn(d);
  if (hz) {
    sv.hordesSeen++;
    let dmg = hz[1] * 4 * (watch ? 0.6 : 1) * hordeMul();
    let trapKill = 0;
    for (const t of sv.traps) {
      const T = TRAPS[t.k];
      if (T.power) { if (sv.power >= T.power) sv.power -= T.power; else { slog(T.n + '沒電，沒有啟動。', true); continue; } }
      trapKill += T.dmg * (hasT('traps') ? 1.15 : 1) * (1 + (defLv() - 1) * 0.05); t.uses--;
    }
    sv.traps = sv.traps.filter(t => t.uses > 0);
    let molo = 0;
    if (watch) while (molo < 3 && (st.molotov || 0) > 0) { st.molotov--; if (!st.molotov) delete st.molotov; trapKill += 120; molo++; }
    if (molo) slog('你從窗口丟出 ' + molo + ' 瓶燃燒瓶。');
    if (trapKill) dmg = Math.max(0, dmg - trapKill);
    const dlBefore = defLv();
    sv.defXp = (sv.defXp || 0) + hz[1] / 10;
    if (defLv() > dlBefore) slog('防禦等級升到 ' + defLv() + ' 級！' + (defLv() === 2 ? '可以做電擊陷阱了。' : defLv() === 4 ? '可以做電鋸陷阱了。' : ''), true);
    let used = 0;
    if (watch) {
      for (const m of ['metal', 'board', 'glass']) {
        while (used < 3 && st[m] > 0 && dmg > sv.def * 0.5) { st[m]--; if (!st[m]) delete st[m]; sv.def += REINFORCE[m]; used++; }
      }
    }
    sv.def -= dmg;
    if (sv.def >= 0) {
      sv.sp += 10;
      if (sv.dog && sv.dog.state === 'pet') sv.dog.xp += 2;
      chron(d, '屍潮（強度 ' + hz[1] + '）' + (trapKill ? '，陷阱擋下 ' + Math.round(trapKill) : '') + (watch ? '，你守了一夜' + (used ? '、邊打邊修用掉 ' + used + ' 份材料' : '') : '') + '。防線剩 ' + Math.round(sv.def) + '。', 'good');
      slog('屍潮退去了，防線剩 ' + Math.round(sv.def) + '。', true);
    } else {
      const over = -sv.def; sv.def = 0;
      const h = Math.round((over * 0.25 + 15) * (hasT('tough') ? 0.7 : 1));
      hurt(h, 'horde'); sv.mor = clamp(sv.mor - 20);
      chron(d, '屍潮（強度 ' + hz[1] + '）突破防線，你受傷 ' + h + '。', 'bad');
      slog('防線被突破了！生命 -' + h + '。', true);
    }
  }

  if (robotOn('bot_fix') && sv.def < sv.defMax * 1.5) { sv.def = Math.min(sv.defMax * 1.5, sv.def + 25); slog('修理機器人連夜把防線補了 25。'); }
  // 5. 睡眠
  const hoursLeft = Math.max(0, LAST_HOUR - sv.hour);
  for (let i = 0; i < hoursLeft; i++) {
    sv.sat = clamp(sv.sat - 1.1); sv.hyd = clamp(sv.hyd - 1.5);
    if (sv.sat <= 0) hurt(1, 'food');
    if (sv.hyd <= 0) hurt(2, 'water');
    if (cold && !warmNight) hurt(hasT('warm') ? 0.25 : 0.5, 'cold');
  }
  sv.sat = clamp(sv.sat - 10);
  sv.hyd = clamp(sv.hyd - 14);
  if (watch) sv.sta = clamp(sv.sta + 15);
  else sv.sta = clamp(sv.sta + (55 + (roomN('bedroom') ? 10 : 0) + (sv.mor > 50 ? 15 : 0) - (sv.mor < 20 ? 20 : 0)) * (sv.sick ? 0.5 : 1));
  if (sv.sat <= 0) hurt(10, 'food');
  if (sv.hyd <= 0) hurt(20, 'water');
  if (cold && !warmNight) hurt(hasT('warm') ? 3 : 6, 'cold');
  if (sv.sat > 30 && sv.hyd > 30 && !hz) sv.hp = Math.min(100, sv.hp + 5);
  if (checkDeath()) { render(); return; }

  // 6. 新的一天
  sv.day++; sv.hour = 8;
  const nd = sv.day;
  sv.mor = clamp(sv.mor - 4 + (roomN('bedroom') ? 3 : 0));
  sv.sp += 1;
  if (sv.sick > 0) { sv.sick--; if (!sv.sick) slog('病好了。'); }

  // 腐壞
  const frozen = sv.powered.freezer;
  for (const f of sv.fresh) f.life -= frozen ? 0.2 : 1;
  const spoiled = sv.fresh.filter(f => f.life <= 0);
  if (spoiled.length) slog(spoiled.map(f => ITEMS[f.k].n + '×' + f.q).join('、') + ' 壞掉了。', true);
  sv.fresh = sv.fresh.filter(f => f.life > 0);

  // 作物
  const fert = (st.fert || 0) > 0 ? 1.5 : 1;
  const harvest = {};
  for (const p of sv.plants) {
    p.age++;
    if (p.age < growDays()) continue;
    if (p.slot === 'light' && !sv.powered.lightbox) continue;
    const rate = (p.slot === 'pot' ? 0.5 : 1) * (hasT('green') ? 1.3 : 1) * (robotOn('bot_farm') ? 1.25 : 1);
    p.acc = (p.acc || 0) + rate * fert;
    const got = Math.floor(p.acc); p.acc -= got;
    if (got) harvest[p.k] = (harvest[p.k] || 0) + got;
  }
  if (st.mush && nd >= 6 && nd < 46) { sv.mushAcc += st.mush * 0.5; const g = Math.floor(sv.mushAcc); if (g) { harvest.mushroom = (harvest.mushroom || 0) + g; sv.mushAcc -= g; } }
  const hv = Object.entries(harvest);
  if (hv.length) { for (const [k, q] of hv) sv_addFresh(k, q); slog('收成：' + hv.map(([k, q]) => ITEMS[k].n + '×' + q).join('、') + '。'); }

  // 天氣與廣播
  if (nd === COLD[0] - 1) slog('收音機：明天開始會有強烈寒流，請準備取暖設備。', true);
  if (nd === COLD[0]) { sv.coldSeen = true; chron(nd, '寒潮來了，沒取暖會一直掉血。'); slog('寒潮來了！氣溫驟降。' + (st.ac ? '到「據點」把冷氣打開取暖。' : ''), true); }
  if (nd === COLD[1] + 1) chron(nd, '寒潮過去了。', 'good');
  if (RAIN.some(r => nd === r[0])) { sv.rainSeen = true; chron(nd, '連日陰雨，太陽能幾乎不發電。'); slog('外面下起連綿大雨。', true); }
  const tonight = hordeOn(nd), tomorrow = hordeOn(nd + 1);
  if (tonight) slog('收音機：今晚有' + hordeSize(tonight[1]) + '屍潮（強度 ' + tonight[1] + '）。', true);
  else if (tomorrow) slog('收音機：明晚會有' + hordeSize(tomorrow[1]) + '屍潮。');
  morningDisaster(nd);
  m5Morning(nd);
  m7Morning(nd);
  slog('第 ' + nd + ' 天早上。');
  if (nd <= 100) snapshot();

  if (nd > 100 && !sv.endless) {
    const e = pickEnding(sv);
    chron(100, '結局「' + ENDINGS[e].n + '」：' + ENDINGS[e].d, 'good');
    J.endings[e] = true; saveJournal();
    finishRun({ days: 100, cause: '你撐過了 100 天。', causeKey: '', timeline: sv.chron, stats: null, hordesSeen: sv.hordesSeen, coldSeen: sv.coldSeen, rainSeen: sv.rainSeen, ending: e, canEndless: true });
  }
  UI.tab = 'act';
  render();
  window.scrollTo(0, 0);
}

/* ---------- M2 畫面 ---------- */
function meter(label, v, warn) {
  return '<div class="m"><span class="k">' + label + '</span><div class="bar' + (v <= warn ? ' full' : '') + '"><i style="width:' + clamp(v) + '%"></i></div><span class="num">' + Math.round(v) + '</span></div>';
}
function renderSurvive() {
  const sv = S.sv;
  const tonight = hordeOn(sv.day);
  let body = UI.tab === 'base' ? viewBase() : UI.tab === 'store' ? viewStore() : UI.tab === 'journal' ? viewJournal(false) : viewActs();
  body = tip(sv.out && UI.tab === 'act' ? 'out' : UI.tab === 'base' ? 'base' : 'survive') + body;
  $app.innerHTML =
    '<header class="status"><div class="status-in">' +
      '<div class="stamp' + (tonight ? ' urgent' : '') + '"><div class="lbl">' + (tonight ? '今晚屍潮' : '倖存') + '</div><div class="big">第' + sv.day + '天</div><div class="lbl num">' + String(sv.hour).padStart(2, '0') + ':00</div></div>' +
      '<div class="meters sv">' + meter('生命', sv.hp, 30) + meter('飽足', sv.sat, 20) + meter('水分', sv.hyd, 20) + meter('體力', sv.sta, 15) + meter('心態', sv.mor, 20) + '</div>' +
    '</div></header>' +
    '<main class="wrap">' +
      '<div class="ticker">' + sv.log.slice(0, 3).map(l => '<p class="' + (l.alert ? 'alert' : '') + '">' + esc(l.txt) + '</p>').join('') + '</div>' +
      ((UI.tab === 'act' || UI.tab === 'base') && !sv.out ? houseSVG() : '') +
      '<div class="chips"><span>防線 <b class="num">' + Math.round(sv.def) + '</b>/' + sv.defMax + '</span><span>電 <b class="num">' + (Math.round(sv.power * 10) / 10) + '</b>/' + powerCap() + ' 度</span><span>水 <b class="num">' + sv.st.wu + '</b> 份</span>' +
        (inCold(sv.day) ? '<span class="tag red">寒潮</span>' : '') + (inRain(sv.day) ? '<span class="tag amber">陰雨</span>' : '') + '</div>' +
      body +
    '</main>' +
    '<nav class="tabs" role="tablist">' + tabBtn('act', '行動') + tabBtn('base', '據點') + tabBtn('store', '倉庫') + tabBtn('journal', '日誌') + '</nav>';
}

function actRow(name, meta, btn, act, v, ok) {
  return '<div class="item"><div><div class="nm">' + name + '</div><div class="meta">' + meta + '</div></div>' +
    '<button class="btn" data-a="' + act + '"' + (v ? ' data-v="' + v + '"' : '') + (ok ? '' : ' disabled') + '>' + btn + '</button></div>';
}
function viewActs() {
  const sv = S.sv, st = sv.st;
  if (sv.out) return viewOut();
  const late = sv.hour >= LAST_HOUR;
  let h = sv.sick ? '<p class="alert-line">生病中（剩 ' + sv.sick + ' 天）：體力回得慢、不能加固。止痛藥可以治好。</p>' : '';
  if (!st.microwave && st.rice) h += '<p class="empty">米要用微波爐煮，你家沒有。</p>';
  // 吃喝
  const foods = Object.keys(FOOD).filter(k => sv_has(k) > 0);
  h += '<div class="cat">吃喝（不花時間）</div><div class="sheet">';
  h += actRow('喝水', sv.day <= 5 ? '自來水還沒停（第 5 天後停水）· 不用消耗存水' : '水分 +30 · 剩 ' + st.wu + ' 份', '喝', 'drink', '', (st.wu >= 1 || sv.day <= 5) && sv.hyd < 100);
  if (!foods.length) h += '<p class="empty">沒有能直接吃的東西了' + (st.rice ? '（米要先煮）' : '') + '。</p>';
  for (const k of foods) {
    const fr = sv.fresh.filter(f => f.k === k);
    const life = fr.length ? Math.min(...fr.map(f => f.life)) : null;
    h += actRow(ITEMS[k].n + ' ×' + sv_has(k), '飽足 +' + FOOD[k].sat + (FOOD[k].mor ? ' · 心態 +' + FOOD[k].mor : '') + (life !== null ? ' · 最快 ' + Math.ceil(life) + ' 天後壞' : ''), '吃', 'eat', k, sv.sat < 100);
  }
  h += '</div>';
  // 工作
  h += '<div class="cat">做事（每項 1 小時）</div><div class="sheet">';
  for (const m of ['metal', 'board', 'glass']) if (st[m]) h += actRow('用' + ITEMS[m].n + '加固', '防線 +' + REINFORCE[m] + ' · 剩 ' + st[m] + ' · 體力 -' + staCost(12) + ' · 上限 ' + Math.round(sv.defMax * 1.5), '加固', 'reinforce', m, !sv.sick && canAct(1, staCost(12)) && sv.def < sv.defMax * 1.5);
  if (st.gen) h += actRow('開發電機', '燒 1 桶柴油 → 電 +6 · 剩 ' + (st.diesel || 0) + ' 桶', '發電', 'gen', '', canAct(1) && st.diesel > 0);
  if (st.pedal) h += actRow('踩人力發電機', '電 +1.5 · 體力 -' + staCost(20), '踩', 'pedal', '', canAct(1, staCost(20)));
  for (const k of ['tomato', 'straw', 'rape']) if (st[k]) h += actRow('種' + ITEMS[k].n, '一包種 2 株 · 盆位 ' + freeSlots() + ' 個空 · 體力 -5', '種', 'plant', k, canAct(1, 5) && freeSlots() > 0);
  h += actRow('休息、聽收音機', '心態 +12 · 體力 +5', '休息', 'rest', '', canAct(1));
  h += '</div>';
  h += viewOutside();
  h += viewCraft();
  if (st.medkit || st.pills) {
    h += '<div class="cat">治療</div><div class="sheet">';
    if (st.medkit) h += actRow('急救包 ×' + st.medkit, '生命 +35', '用', 'heal', 'medkit', sv.hp < 100);
    if (st.pills) h += actRow('止痛藥 ×' + st.pills, '生命 +10 · 心態 +3', '用', 'heal', 'pills', sv.hp < 100);
    h += '</div>';
  }
  // 睡覺
  const hz = hordeOn(sv.day);
  h += '<div class="cat">結束這一天</div><div class="sheet">';
  if (late) h += '<p class="empty">已經半夜了，只能睡覺。</p>';
  h += actRow('睡覺到明天 08:00', '體力大幅回復 · 睡前結算太陽能、設備耗電' + (hz ? ' · <b style="color:var(--stamp)">今晚屍潮（強度 ' + hz[1] + '）</b>' : ''), '睡覺', 'sleep', '', true);
  if (hz) h += actRow('守夜', '屍潮傷害 -40%，邊打邊用材料修（最多 3 份）· 體力只回 15', '守夜', 'watch', '', true);
  h += '</div>';
  h += '<div class="row-btns"><button class="btn ghost" data-a="giveup">放棄這一輪</button></div>';
  return h;
}
function freeSlots() { const s = slots(); return s.light + s.green + s.pot - S.sv.plants.length; }

function viewBase() {
  const sv = S.sv, st = sv.st;
  const cold = inCold(sv.day);
  let h = '<div class="cat">防線</div><div class="sheet"><div class="item"><div><div class="nm">耐久 ' + Math.round(sv.def) + ' / ' + sv.defMax + '</div><div class="meta">加固最多到 ' + Math.round(sv.defMax * 1.5) + '。屍潮傷害約為強度 ×4。防禦等級 ' + defLv() + '（經驗 ' + Math.round(sv.defXp || 0) + (defLv() < 4 ? '/' + DEF_LV[defLv()] : '') + '），每級陷阱傷害 +5%。</div></div><div></div>' +
    '<div class="ctrl" style="justify-content:stretch"><div class="bar" style="flex:1"><i style="width:' + Math.min(100, sv.def / (sv.defMax * 1.5) * 100) + '%"></i></div></div></div></div>';
  const next = HORDES.find(x => x[0] >= sv.day);
  if (next && J.hordesSeen > HORDES.indexOf(next)) h += '<p class="empty">日誌：下一波屍潮在第 ' + next[0] + ' 天，強度 ' + next[1] + '。</p>';
  h += viewTraps();
  h += '<div class="cat">電力與設備</div><div class="sheet">';
  h += '<div class="item"><div><div class="nm">存電 ' + (Math.round(sv.power * 10) / 10) + ' / ' + powerCap() + ' 度</div><div class="meta">太陽能板 ' + (st.solar || 0) + ' 片（晴天每片 1.5 度/天）· 儲電站 ' + (st.battery || 0) + ' 台</div></div><div></div></div>';
  const devs = [['freezer', '1 度/天 · 新鮮食物壞得慢 5 倍'], ['lightbox', ((st.lightbox || 0) * 1) + ' 度/天 · 沒電作物不長'], ['ac', '寒潮期間 1.5 度/天 · 取暖'], ['bot_farm', '0.5 度/天 · 作物 6 天成熟、產量 +25%'], ['bot_fix', '0.5 度/天 · 每晚修防線 +25'], ['bot_cook', '0.5 度/天 · 早上自動煮飯']];
  let any = false;
  for (const [k, d] of devs) {
    if (!(st[k] > 0)) continue; any = true;
    h += '<div class="item"><div><div class="nm">' + ITEMS[k].n + (sv.dev[k] ? '<span class="tag green">開</span>' : '<span class="tag">關</span>') + '</div><div class="meta">' + d + '</div></div>' +
      '<button class="btn ghost" data-a="toggle" data-v="' + k + '">' + (sv.dev[k] ? '關掉' : '打開') + '</button></div>';
  }
  if (!any) h += '<p class="empty">沒有用電設備。</p>';
  h += '</div>';
  if (cold) h += '<p class="empty">寒潮中：' + (st.ac || st.heater ? '冷氣要開著且有電，或有暖爐和木板，才算有取暖。' : '沒有取暖設備，醒著每小時掉 0.6 生命、每晚掉 6。') + '</p>';
  h += '<div class="cat">作物</div>';
  const s = slots();
  h += '<p class="empty">盆位：種植箱 ' + s.light + ' 格、溫室 ' + s.green + ' 格、花盆 ' + s.pot + ' 格，已種 ' + sv.plants.length + ' 株。' + ((st.mush || 0) ? '菌包 ' + st.mush + ' 包（第 6–45 天出菇）。' : '') + '</p>';
  if (sv.plants.length) h += '<div class="sheet">' + sv.plants.map(p => '<div class="item"><div><div class="nm">' + ITEMS[p.k].n + '<span class="tag">' + ({ light: '種植箱', green: '溫室', pot: '花盆' }[p.slot]) + '</span></div><div class="meta">' + (p.age < growDays() ? '還要 ' + (growDays() - p.age) + ' 天成熟' : '已成熟，' + ({ light: '有電每天收 1 個', green: '每天收 1 個', pot: '每 2 天收 1 個' }[p.slot])) + '</div></div><div></div></div>').join('') + '</div>';
  h += viewBuild();
  h += viewTalents();
  return h;
}

function viewStore() {
  const sv = S.sv;
  const all = Object.keys(sv.st).filter(k => k !== 'wu' && ITEMS[k] && sv.st[k] > 0);
  let h = '<div class="cat">新鮮食物</div>';
  h += sv.fresh.length ? '<div class="sheet">' + sv.fresh.slice().sort((a, b) => a.life - b.life).map(f => '<div class="item"><div><div class="nm">' + ITEMS[f.k].n + '</div><div class="meta">' + Math.ceil(f.life) + ' 天後壞（冰櫃有電時壞得慢）</div></div><div class="price">×' + f.q + '</div></div>').join('') + '</div>' : '<p class="empty">沒有。</p>';
  h += '<div class="cat">庫存</div>';
  h += all.length ? '<div class="sheet">' + CAT_ORDER.flatMap(c => all.filter(k => ITEMS[k].cat === c)).map(k => '<div class="item"><div><div class="nm">' + ITEMS[k].n + '</div><div class="meta">' + ITEMS[k].note + '</div></div><div class="price">×' + sv.st[k] + '</div></div>').join('') + '</div>' : '<p class="empty">空的。</p>';
  return h;
}
