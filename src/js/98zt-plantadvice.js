/* ================= 🌱 種植小幫手：現在最缺什麼、適合種什麼 ================= */
const SEED_WHERE = k => STORES.farm && STORES.farm.items[k] ? '農貿市場' : MARKET[k] ? '小店市集' : SEED_OUT[k] && ['ruby', 'gpump', 'pyam', 'rcorn', 'jcab', 'gtom'].includes(k) ? '雜交苗床、每週挑戰' : '外出搜刮';
const paSeed = p => Object.keys(SEED_OUT).find(s => SEED_OUT[s] === p);
function plantAdvice() {
  const sv = S.sv, need = [], score = {}, why = {};
  const add = (p, n, w) => { if (!paSeed(p)) return; score[p] = (score[p] || 0) + n; (why[p] = why[p] || []); if (w && !why[p].includes(w)) why[p].push(w); };
  // 1. 存糧
  const food = Object.keys(FOOD).reduce((a, k) => a + sv_has(k) * Math.max(0, FOOD[k].sat || 0), 0), days = food / 60;
  const hungry = !isForever() && days < 3;
  if (hungry) need.push(['🍚', '存糧只夠 ' + days.toFixed(1) + ' 天', '先種長得快、吃了飽的']);
  // 2. 料理缺材料：會煮的菜裡，只差作物的
  const shortDish = {};
  for (const [d, D] of Object.entries(DISHES)) { if (D.fest || chefLv() < D.lv) continue; for (const [m, n] of Object.entries(D.need)) if (paSeed(m) && haveIng(m) < n) { (shortDish[m] = shortDish[m] || []).push(ITEMS[d].n); } }
  if (typeof LAB === 'object' && typeof labBook === 'function' && grOn('lab')) for (const [d, L] of Object.entries(LAB)) if (labBook()[d]) for (const m of L.ing) if (paSeed(m) && sv_has(m) < 1) (shortDish[m] = shortDish[m] || []).push(ITEMS[d].n);
  for (const [m, ds] of Object.entries(shortDish)) add(m, 6 + ds.length * 2, '做' + ds.slice(0, 2).join('、') + (ds.length > 2 ? '等 ' + ds.length + ' 道' : '') + '要用');
  const topShort = Object.entries(shortDish).sort((a, b) => b[1].length - a[1].length)[0];
  if (topShort) need.push(['🍳', '料理最缺：' + ITEMS[topShort[0]].n, topShort[1].length + ' 道菜卡在少它（' + topShort[1].slice(0, 3).join('、') + '）']);
  // 3. 訂單、客人
  if (S.sv.w && S.sv.w.fm && S.sv.w.fm.bz) {
    const bz = BZ();
    for (const o of bz.orders.filter(o => !o.done && o.until >= sv.day)) {
      const lack = o.qty - sv_has(o.k); if (lack <= 0) continue;
      if (paSeed(o.k)) { add(o.k, 10 + lack * 2, '訂單要 ' + o.qty + ' 個'); need.push(['📌', o.who + '要' + ITEMS[o.k].n, '還差 ' + lack + ' 個，剩 ' + (o.until - sv.day + 1) + ' 天']); }
      else if (DISHES[o.k]) for (const m of Object.keys(DISHES[o.k].need)) if (paSeed(m)) add(m, 8, '訂單的' + ITEMS[o.k].n + '要用');
    }
    for (const c of bz.cust.filter(c => !c.done)) if (paSeed(c.want) && sv_has(c.want) <= 0) add(c.want, 4, '客人想買');
  }
  // 4. 季節、土壤
  const se = typeof season === 'function' ? season() : null;
  if (se != null) for (const p of SEASON_CROP[se]) add(p, grOn('season') ? 6 : 2, SEASON_IC[se] + '當季' + (grOn('season') ? '（+30%）' : ''));
  if (grOn('soil') && GR().soil < 40) { need.push(['🟫', '田的肥力只剩 ' + Math.round(GR().soil), '種花生或豆芽可以養土']); add('peanut_p', 9, '養土（輪作）'); add('sprout_p', 9, '養土（輪作）'); }
  // 5. 餓的時候：長得快、飽足高
  for (const p of CROPS()) {
    const g = growDaysOf(p), f = FOOD[p] ? FOOD[p].sat : 0;
    if (hungry) add(p, Math.max(0, 8 - g) * 2 + f / 8, g <= 3 ? g + ' 天就能收' : f >= 30 ? '吃一個飽足 +' + f : '');
    else add(p, 0);
    if (bzOpenTab && S.sv.w && S.sv.w.fm && S.sv.w.fm.bz && valOf(p) >= 8) add(p, valOf(p) / 3, '好賣（一個 🪙' + valOf(p) + '）');
  }
  // 6. 已經種很多的扣分
  const growing = {}; (sv.plants || []).forEach(pl => { growing[pl.k] = (growing[pl.k] || 0) + 1; });
  for (const [p, n] of Object.entries(growing)) if (score[p] != null) { score[p] -= n * 3; why[p].push('已經種了 ' + n + ' 株'); }
  const ranked = Object.keys(score).filter(p => paSeed(p)).sort((a, b) => score[b] - score[a]);
  const have = ranked.filter(p => sv.st[paSeed(p)] > 0).slice(0, 3);
  const want = ranked.filter(p => !(sv.st[paSeed(p)] > 0) && score[p] >= 8).slice(0, 2);
  if (!need.length) need.push(['✅', '現在沒有特別缺的', '可以種當季、好賣的，或試試新作物']);
  return { need: need.slice(0, 3), have, want, why, growing };
}
function plantAdviceHTML(compact) {
  const A = plantAdvice(), sv = S.sv, free = freeSlots();
  let h = '<div class="pa-box"><div class="pa-h">🌱 種植小幫手</div>';
  h += '<div class="pa-need">' + A.need.map(n => '<div><span>' + n[0] + '</span><b>' + n[1] + '</b><i>' + n[2] + '</i></div>').join('') + '</div>';
  if (A.have.length) h += '<div class="pa-sub">👍 建議種（你有種子）</div>' + A.have.map((p, i) => { const s = paSeed(p); return '<div class="pa-pick' + (i === 0 ? ' top' : '') + '">' + itemIc(p) + '<div><b>' + (i === 0 ? '🥇 ' : '') + ITEMS[p].n.replace(/（.*）/, '') + '</b><span class="meta">種子 ' + sv.st[s] + ' · ' + growDaysOf(p) + ' 天收成</span><div class="pa-tags">' + (A.why[p] || []).filter(Boolean).slice(0, 3).map(w => '<em>' + w + '</em>').join('') + '</div></div><button class="btn" data-a="plant" data-v="' + s + '"' + (free > 0 && canAct(1, 5) ? '' : ' disabled') + '>種</button></div>'; }).join('');
  else h += '<p class="meta">你現在沒有種子。</p>';
  if (A.want.length) h += '<div class="pa-sub">🛒 很需要但沒種子</div>' + A.want.map(p => '<div class="pa-want">' + itemIc(p) + '<b>' + ITEMS[paSeed(p)].n + '</b><span class="meta">' + (A.why[p] || []).filter(Boolean).slice(0, 2).join('、') + ' · 去' + SEED_WHERE(paSeed(p)) + '</span></div>').join('');
  if (free <= 0) h += '<p class="meta">⚠️ 種植位滿了，收成後才能再種；或多做花盆、蓋菜圃。</p>';
  return h + '</div>';
}
// 掛到種植箱／溫室／花盆架的視窗
const _objModalPA = objModal;
objModal = function () {
  const h = _objModalPA(); const sel = UI.rtSel; if (!sel || sel === 'DOOR') return h;
  const o = isoObjects().find(x => x.id === sel); if (!o || !['lightbox', 'greenhouse', 'potrack'].includes(o.k)) return h;
  const box = plantAdviceHTML();
  return h.includes('<div class="macts">') ? h.replace('<div class="macts">', box + '<div class="macts">') : h.replace('<div class="row-btns" style="margin-top:10px">', box + '<div class="row-btns" style="margin-top:10px">');
};
// 掛到頂樓農場的田地分頁
const _farmModalPA = farmModal;
farmModal = function () { const h = _farmModalPA(); if ((UI.fmTab || 'field') !== 'field' || !roofOk()) return h; return h.replace(/(<p class="meta">種植位：)/, plantAdviceHTML() + '$1'); };
// 種植的建議也加進「現在可以」
const _sugPA = suggestRaw;
suggestRaw = function () {
  const L = _sugPA(); if (!S.sv || freeSlots() <= 0) return L;
  const A = plantAdvice(); if (!A.have.length) return L;
  const p = A.have[0], w = (A.why[p] || []).filter(Boolean)[0];
  const i = L.findIndex(x => x.label === '種東西'); if (i >= 0) { L[i].label = '種' + ITEMS[p].n.replace(/（.*）/, ''); L[i].why = w || L[i].why; }
  return L;
};
