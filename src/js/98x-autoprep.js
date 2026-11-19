/* ================= 一鍵籌備（開發用） =================
   用遊戲本身的規則（ACT.go / ACT.buy …）自動跑一條「最划算」的採購路線：
   借錢＋賣家具 → 買車 → 超市免費搶購（10:32–11:30）→ 回家卸貨
   → 裝修公司（大門、微波爐、太陽能、儲電站）→ 工具店 → 藥局 → 農貿 → 回家。
   每一站都會檢查「到得了、還開著、來得及回家」，不夠錢就自動縮量。 */
function autoPrep() {
  if (!S || S.phase !== 'play') return;
  const realRender = render, realScroll = window.scrollTo;
  render = function () {}; window.scrollTo = function () {};
  const steps = [];
  try {
    log('[開發] 一鍵籌備開始。');
    const back = d => travelTime(d, 'home') + 12;
    const canGo = (d, stay) => {
      if (S.loc === d) return isOpen(d, S.t);
      const arr = S.t + travelTime(S.loc, d);
      return isOpen(d, arr) && arr + (stay || 20) + back(d) < OUTBREAK - 5;
    };
    const go = d => { if (S.loc === d) return true; if (!canGo(d)) return false; ACT.go(d); steps.push(STORES[d].n); return S.loc === d; };
    const roomFor = k => ITEMS[k].cat === 'equip' ? 99 : Math.floor((capacity() - carried() + 1e-9) / Math.max(ITEMS[k].w, 0.01));
    const buy = (k, n, reserve) => {
      if (!STORES[S.loc].items || !STORES[S.loc].items[k] || !isOpen(S.loc, S.t)) return 0;
      const p = price(S.loc, k);
      let q = Math.min(n, S.stock[S.loc][k], roomFor(k));
      if (p > 0) q = Math.min(q, Math.floor((S.money - (reserve || 0)) / p));
      if (q <= 0) return 0;
      if (ITEMS[k].cat === 'equip' && !deliveryOk()) return 0;
      UI.qty[k] = Math.min(99, q);
      const before = (S.home[k] || 0) + (S.carry[k] || 0);
      ACT.buy(k);
      return (S.home[k] || 0) + (S.carry[k] || 0) - before;
    };
    const has = k => (S.home[k] || 0) + (S.carry[k] || 0);

    // 1. 家：貸款＋賣家具
    if (S.loc === 'home') {
      ACT.loan();
      for (const f of FURNITURE) if (!S.sold[f.id]) ACT.sell(f.id);
    }
    // 2. 車：移動時間減半＋80kg 車廂，最划算的投資
    if (!S.car && !(S.mods && S.mods.noCar) && S.money >= carPrice() + 700 && canGo('cars', 15)) { go('cars'); ACT.buyCar(); }
    // 3. 超市：免費時段就盡量搶；不是免費就買便宜的
    if (go('mart')) {
      if (S.t < 152) { /* 太早到：等到搶購潮 */ advance(152 - S.t); }
      if (typeof ACT.npc === 'function' && !(S.q && S.q.oldman)) try { ACT.npc('oldman'); } catch (e) {}
      const free = price('mart', 'water') === 0;
      const rs = free ? 0 : 650;
      buy('water', 8, rs); buy('rice', 6, rs); buy('can', 12, rs); buy('biscuit', 10, rs);
      buy('sausage', 20, rs); buy('noodle', 20, rs);
      go('home');
    }
    // 4. 裝修公司：大門最優先，其次電力
    if (deliveryOk() && go('reno')) {
      buy('door', 1, 250); buy('microwave', 1, 200); buy('solar', 1, 260); buy('battery', 1, 220); buy('solar', 1, 420);
      if (!has('solar')) { buy('gen', 1, 260); }
    }
    // 5. 工具店：儲水桶、防禦材料、發電機用柴油
    if (go('tool')) {
      buy('barrel', 3, 120);
      if (has('gen')) buy('diesel', 3, 120);
      buy('board', 6, 110); buy('metal', 3, 110); buy('glass', 2, 110);
    }
    if (carried() > capacity() * 0.75 && S.loc !== 'home') go('home');
    // 6. 藥局
    if (go('pharm')) { buy('medkit', 3, 60); buy('pills', 6, 50); }
    // 7. 農貿：番茄＋花盆，長期食物來源
    if (go('farm')) { buy('pot', 4, 20); buy('tomato', 3, 10); buy('fert', 1, 0); buy('veg', 4, 0); }
    // 8. 剩錢再回便利店補水
    if (S.money >= 40 && carried() + 6 <= capacity() && go('conv')) buy('water', 4, 0);
    go('home');
    if (S.loc !== 'home' && S.t + travelTime(S.loc, 'home') < OUTBREAK) ACT.go('home');
    log('[開發] 一鍵籌備完成：' + (steps.length ? steps.join(' → ') : '只在家處理') + '。剩 ' + money(S.money) + '。', true);
  } catch (e) {
    console.error(e);
    log('[開發] 一鍵籌備中斷：' + e.message, true);
  } finally {
    render = realRender; window.scrollTo = realScroll;
    UI.anim = null; UI.tab = 'here';
    render();
  }
}
Object.assign(ACT, { autoPrep });

const _viewHereAuto = viewHere;
viewHere = function () {
  const h = _viewHereAuto();
  if (S.loc !== 'home' || S.t > 60) return h;
  return '<div class="sheet" style="margin-bottom:12px;border-style:dashed"><div class="item"><div><div class="nm">⚡ 一鍵籌備 <span class="meta">（開發用）</span></div>' +
    '<div class="meta">自動跑最划算路線：貸款賣家具 → 買車 → 超市免費搶購 → 大門／電力 → 建材 → 藥 → 種子 → 回家</div></div>' +
    '<div class="ctrl"><button class="btn red" data-a="autoPrep">執行</button></div></div></div>' + h;
};
