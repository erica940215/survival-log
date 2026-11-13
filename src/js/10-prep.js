/* ================= 一輪開始 ================= */
function newRun() {
  if (J.saveOverNote) { J.saveOverNote = false; saveJournal(); }
  const bonusT = J.upg.time * 30;
  const stock = {};
  for (const id of STORE_ORDER) {
    const st = STORES[id];
    if (!st.items) continue;
    stock[id] = {};
    for (const [k, v] of Object.entries(st.items)) stock[id][k] = v[1];
  }
  S = {
    phase: 'play', t: -bonusT, money: 1070 + J.upg.money * 150 + ((J.char || 'neighbor') === 'student' ? 100 : 0), loc: 'home', char: J.char || 'neighbor',
    car: false, loan: false, carry: {}, home: (J.char === 'nurse' ? { medkit: 2 } : J.char === 'veteran' ? { molotov: 2 } : {}), sold: {}, stock,
    fired: {}, log: [], seenStores: { home: true }, result: null
  };
  UI = { tab: 'here', qty: {} };
  log('你從惡夢中驚醒。這次你知道：今天 18:00，城市會被屍群淹沒。', true);
  if (bonusT) log('你提早 ' + bonusT + ' 分鐘醒來。');
  render();
}

function log(txt, alert) { if (alert && typeof sfx === 'function') sfx('alert'); S.log.unshift({ txt, alert: !!alert, t: S.t }); S.log = S.log.slice(0, 30); }

function capacity() { return BASE_BAG + J.upg.bag * 5 + (S.char === 'manager' ? 15 : 0) + (S.car ? CAR_TRUNK : 0); }
function carried() { return weightOf(S.carry); }

/* 時間推進，觸發事件 */
function advance(min) {
  const from = S.t;
  S.t += min;
  for (const ev of EVENTS) {
    if (ev.at > from && ev.at <= S.t && !S.fired[ev.id]) {
      S.fired[ev.id] = true;
      log(ev.txt, true);
      if (!ev.silentJournal && !J.events[ev.id]) { J.events[ev.id] = true; saveJournal(); }
      if (ev.id === 'panicEnd') {
        for (const k of Object.keys(S.stock.mart)) S.stock.mart[k] = Math.floor(S.stock.mart[k] / 2);
      }
      if (ev.id === 'waterOut') S.stock.conv.water = 0;
    }
  }
}

/* ================= 價格與規則 ================= */
function price(store, k) {
  const base = STORES[store].items[k][0];
  if (store === 'mart' && S.t >= 152 && S.t < 210) return 0;
  if (S.t >= 210 && (store === 'mart' || store === 'conv') && (ITEMS[k].cat === 'food' || ITEMS[k].cat === 'water')) return Math.ceil(base * 1.5);
  return base;
}
function isOpen(store, t) { const st = STORES[store]; return !st.closes || t < st.closes; }
function deliveryOk() { return S.t < 480; }

function travelTime(a, b) {
  const A = STORES[a], B = STORES[b];
  const d = Math.hypot(A.x - B.x, A.y - B.y);
  const walk = Math.round(d * 20);
  return S.car ? Math.round(walk * 0.5 + 5) : walk;
}

/* ================= 動作 ================= */
const ACT = {
  start() { commitRun(); newRun(); },
  tab(v) { UI.tab = v; render(); window.scrollTo(0, 0); },
  qty(v) {
    const [k, d] = v.split(':');
    const cur = UI.qty[k] || 1;
    UI.qty[k] = Math.max(1, Math.min(99, d === 'max' ? 99 : cur + Number(d)));
    render();
  },
  buy(k) {
    if (!S || S.phase !== 'play' || !STORES[S.loc] || !STORES[S.loc].items || !STORES[S.loc].items[k]) return;
    const store = S.loc;
    const it = ITEMS[k];
    if (!isOpen(store, S.t)) return;
    let want = UI.qty[k] || 1;
    const p = price(store, k);
    const stock = S.stock[store][k];
    want = Math.min(want, stock);
    if (p > 0) want = Math.min(want, Math.floor(S.money / p));
    if (it.cat === 'equip') {
      if (!deliveryOk()) { log('送貨車已經停駛，設備送不到了。', true); render(); return; }
    } else {
      const room = capacity() - carried();
      want = Math.min(want, it.w > 0 ? Math.floor((room + 1e-9) / it.w) : want);
    }
    if (want <= 0) {
      if (stock <= 0) log(it.n + ' 賣完了。');
      else if (p > 0 && S.money < p) log('錢不夠。');
      else log('拿不動了，先回家放東西。');
      render(); return;
    }
    S.money -= p * want;
    if (p === 0) S.freeTaken = (S.freeTaken || 0) + want;
    S.stock[store][k] -= want;
    if (it.cat === 'equip') { add(S.home, k, want); log('買了 ' + it.n + ' ×' + want + '，會送到家。'); }
    else { add(S.carry, k, want); log((p === 0 ? '搶到 ' : '買了 ') + it.n + ' ×' + want + (p ? '，花 ' + money(p * want) : '') + '。'); }
    UI.qty[k] = 1;
    advance(2);
    checkOutbreak();
    render();
  },
  go(dest) {
    if (!S || S.phase !== 'play' || !STORES[dest] || dest === S.loc) return;
    const tt = travelTime(S.loc, dest);
    log('前往 ' + STORES[dest].n + '（' + tt + ' 分鐘）。');
    advance(tt);
    if (S.t >= OUTBREAK) { S.loc = 'road'; checkOutbreak(); render(); return; }
    S.loc = dest;
    S.seenStores[dest] = true;
    if (!J.stores[dest]) { J.stores[dest] = true; saveJournal(); }
    if (dest === 'home') unload();
    if (!isOpen(dest, S.t)) log(STORES[dest].n + ' 已經關門了。', true);
    UI.tab = 'here';
    checkOutbreak();
    render();
    window.scrollTo(0, 0);
  },
  sell(id) {
    const f = FURNITURE.find(x => x.id === id);
    if (!f || S.sold[id] || S.loc !== 'home') return;
    S.sold[id] = true; S.money += f.p;
    log('把' + f.n + '賣給阿姨，拿到 ' + money(f.p) + '。');
    advance(5); checkOutbreak(); render();
  },
  loan() {
    if (S.loan) return;
    S.loan = true; S.money += 500;
    log('用手機申請快速貸款，入帳 $500。反正明天之後也沒人來討了。');
    render();
  },
  buyCar() {
    if (S.car || S.money < 500 || S.loc !== 'cars' || !isOpen('cars', S.t)) return;
    S.car = true; S.money -= 500;
    log('買下舊小車。移動時間大約減半，後車廂多 80kg。', true);
    advance(10); checkOutbreak(); render();
  },
  sellCar() {
    if (!S.car || S.loc !== 'cars' || !isOpen('cars', S.t)) return;
    if (weightOf(S.carry) > BASE_BAG + J.upg.bag * 5) { log('車上還有東西，先回家卸貨再來賣車。'); render(); return; }
    S.car = false; S.money += 450;
    log('把車賣回車行，拿回 $450。');
    advance(10); checkOutbreak(); render();
  },
  wait() {
    if (S.loc !== 'home') return;
    log('你鎖上門，等待 18:00。');
    advance(OUTBREAK - S.t);
    checkOutbreak(); render();
  },
  menu() { commitRun(); S = null; UI = { tab: 'here', qty: {} }; render(); },
  upg(id) {
    const u = UPGRADES.find(x => x.id === id);
    const lv = J.upg[id];
    if (lv >= u.max || J.pp < u.cost) return;
    J.pp -= u.cost; J.upg[id] = lv + 1; saveJournal(); render();
  },
  dev() { J.dev = !J.dev; saveJournal(); render(); },
  devMoney() { if (S) { S.money += 1000; log('[開發] +$1000'); render(); } },
  devTime() { if (S) { S.t -= 60; log('[開發] 時間倒回 60 分鐘'); render(); } },
  devPP() { J.pp += 10; saveJournal(); render(); },
  devReset() { J = freshJournal(); saveJournal(); S = null; render(); }
};

function unload() {
  const w = weightOf(S.carry);
  if (w <= 0) return;
  for (const [k, q] of Object.entries(S.carry)) {
    if (k === 'matpack') {
      const pool = ['board', 'metal', 'glass', 'plastic'];
      const got = {};
      for (let i = 0; i < q * 3; i++) { const m = pool[Math.floor(Math.random() * pool.length)]; got[m] = (got[m] || 0) + 1; add(S.home, m, 1); }
      log('拆開材料包：' + Object.entries(got).map(([m, n]) => ITEMS[m].n + '×' + n).join('、') + '。');
    } else add(S.home, k, q);
  }
  S.carry = {};
  log('回到家，卸下 ' + kg(w) + ' 物資（10 分鐘）。');
  advance(10);
}

function checkOutbreak() {
  if (S.phase !== 'play' || S.t < OUTBREAK) return;
  if (S.loc !== 'home') {
    finishRun({ days: 0, cause: '爆發時你還在外面，沒能趕回家。', causeKey: 'outside', timeline: [{ d: '18:00', txt: '屍群湧上街頭，你被困在路上。', cls: 'bad' }], stats: null });
    return;
  }
  startSurvive();
}

function finishRun(res) {
  S.phase = 'end';
  S.result = res;
  res.pp = 1 + Math.floor(res.days / 10);
  res.committed = false;
}
