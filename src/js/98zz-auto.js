/* ================= 🤖 自動化中心：等級越高解鎖越多，每天早上自動做 ================= */
const AUTOS = [
  { k: 'feed', ic: '🐔', n: '自動餵雞', d: '雞飼料不夠時自動倒米或菜葉', lv: ['ranch', 2] },
  { k: 'water', ic: '💧', n: '自動澆菜', d: '早上自動用水澆頂樓菜圃（每 4 株 1 份水）', lv: ['farm', 2] },
  { k: 'plant', ic: '🌱', n: '自動播種', d: '有空位就照種植小幫手的建議種下去', lv: ['farm', 3] },
  { k: 'herb', ic: '🌿', n: '自動補種草藥', d: '草藥圃有空就補種', lv: ['herb', 3] },
  { k: 'cook', ic: '🍳', n: '自動廚房', d: '每天自動煮幾道材料夠的料理（廚師越高煮越多）', lv: ['chef', 3] },
  { k: 'proc', ic: '🫙', n: '自動加工', d: '曬架、燻爐、醃漬罐空著就把多的材料放進去', lv: ['proc', 3] },
  { k: 'bake', ic: '🍞', n: '自動烘焙', d: '小麥自動磨粉，有麵粉就烤一爐麵包', lv: ['bake', 3] },
  { k: 'serve', ic: '🧑', n: '自動招呼客人', d: '店裡有客人要的東西就自動賣', lv: ['shop', 3] },
  { k: 'fish', ic: '🎣', n: '自動撈魚與出欄', d: '魚長大自動撈、豬長大自動出欄、自動補放魚苗', lv: ['ranch', 3] },
  { k: 'fert', ic: '🟫', n: '自動施肥', d: '田的肥力低於 60 自動施肥', lv: ['farm', 4] },
  { k: 'care', ic: '🧹', n: '自動照顧動物', d: '每天打掃、給點心，動物心情維持在好的狀態', lv: ['ranch', 4] },
  { k: 'tap', ic: '🍶', n: '自動開桶', d: '酒放到品質最好時自動開桶', lv: ['brew', 4] },
  { k: 'order', ic: '📌', n: '自動交訂單', d: '訂單一湊齊就自動交貨', lv: ['shop', 4] },
  { k: 'plate', ic: '🍽️', n: '自動擺盤', d: '極品料理自動用最好的盤子擺盤', lv: ['chef', 5] },
  { k: 'sell', ic: '💰', n: '智慧出售', d: '行情 ×1.2 以上、而且庫存超過 15 個的東西自動賣掉一半', lv: ['home', 5] },
  { k: 'contract', ic: '📝', n: '合約自動備貨', d: '合約缺貨時，自動先煮或拿替代品補上', lv: ['home', 7] }
];
const LVN = { ranch: '養殖', farm: '種植', herb: '草藥', chef: '廚師', proc: '加工', bake: '烘焙', shop: '小店', brew: '釀造', home: '家園' };
const lvNow = s => s === 'chef' ? chefLv() : s === 'home' ? homeLv() : lvOfK(s);
const autoOpen = A => lvNow(A.lv[0]) >= A.lv[1];
const AU = () => { const g = G4(); if (!g.auto) g.auto = {}; return g.auto; };
const autoOn = k => { const A = AUTOS.find(x => x.k === k); return !!A && autoOpen(A) && AU()[k] !== false; };
Object.assign(SACT, { auTog(k) { const a = AU(); a[k] = a[k] === false; render(); }, auAll(v) { const a = AU(); for (const A of AUTOS) a[A.k] = v === 'on'; render(); } });
function quiet(fn) { const s0 = slog, r0 = render; slog = () => {}; render = () => {}; try { return fn(); } catch (e) { return 0; } finally { slog = s0; render = r0; } }

function runAutos() {
  const sv = S.sv, out = []; if (!hasG3()) return out; const g = G4(), fm = F(), R = W().roof || {}, bz = BZ();
  const say = (A, t) => out.push(A.ic + ' ' + t);
  const A = k => AUTOS.find(x => x.k === k);
  if (autoOn('feed') && R.coop && R.hens && R.feed < R.hens * 2) { const f0 = R.feed; quiet(() => { SACT.roofFeed(); if (R.feed < R.hens * 2) SACT.roofFeed(); }); if (R.feed > f0) say(A('feed'), '補了 ' + Math.round(R.feed - f0) + ' 份雞飼料'); }
  if (autoOn('water') && typeof needWater === 'function' && needWater()) { const n = Math.max(1, Math.ceil(greenPlants().length / 4)); if (sv.day <= 5 || (sv.st.wu || 0) >= n) { if (sv.day > 5) sv.st.wu -= n; fm.wateredDay = sv.day; say(A('water'), '澆好菜圃'); } }
  if (autoOn('fish') && hasGr()) { const gr = GR(); const big = gr.fish.filter(f => f.age >= 5); if (big.length) { gr.fish = gr.fish.filter(f => f.age < 5); addIt('fish', big.length); qRoll('fish', big.length); gr.stats.fish += big.length; say(A('fish'), '撈了 ' + big.length + ' 尾魚'); }
    if (gr.pond && gr.fish.length < 10 && sv_has('fry') > 0) { const n = Math.min(sv_has('fry'), 10 - gr.fish.length); sv_take('fry', n); for (let i = 0; i < n; i++) gr.fish.push({ age: 0 }); }
    const pigs = g.pigs.filter(p => p.age >= 15).length; if (pigs) { quiet(() => SACT.baSell()); say(A('fish'), pigs + ' 頭豬出欄'); } }
  if (autoOn('care') && g.mood < 80) { g.mood = Math.min(100, g.mood + 18); say(A('care'), '照顧動物（心情 ' + Math.round(g.mood) + '）'); }
  if (autoOn('fert') && grOn('soil') && GR().soil < 60 && sv_has('fert') > 0) { sv_take('fert', 1); GR().soil = Math.min(100, GR().soil + 25); say(A('fert'), '施肥（肥力 ' + Math.round(GR().soil) + '）'); }
  if (autoOn('plant')) { let n = 0, guard = 30; while (freeSlots() > 0 && guard-- > 0) { const P = plantAdvice(), p = P.have[0]; if (!p) break; const s = paSeed(p), sl = slots(), free = freeSlots(); if (!(sv.st[s] > 0)) break; sv.st[s]--; if (!sv.st[s]) delete sv.st[s]; for (let i = 0; i < Math.min(2, free); i++) { const cnt = t => sv.plants.filter(x => x.slot === t).length; sv.plants.push({ k: p, slot: cnt('light') < sl.light ? 'light' : cnt('green') < sl.green ? 'green' : 'pot', age: 0 }); n++; } } if (n) say(A('plant'), '種了 ' + n + ' 株'); }
  if (autoOn('herb') && fm.herbBeds) { let n = 0; for (const h of Object.keys(HERBS)) while (sv_has(h) > 0 && fm.herbs.length < fm.herbBeds * 3) { quiet(() => SACT.hbPlant(h)); n++; if (n > 9) break; } if (n) say(A('herb'), '補種 ' + n + ' 株草藥'); }
  if (autoOn('cook')) { let n = 0; const max = chefLv() - 1; const made = {};
    for (const [k, D] of Object.entries(DISHES)) { if (n >= max) break; if (D.fest || chefLv() < D.lv || (D.stove && stoveLv() < D.stove)) continue; if (!Object.entries(D.need).every(([m, c]) => (m === 'wu' ? (sv.st.wu || 0) + (sv.day <= 5 ? 99 : 0) : sv_has(m)) >= c)) continue;
      for (const [m, c] of Object.entries(D.need)) { if (m === 'wu') { if (sv.day > 5) sv.st.wu -= c; } else sv_take(m, c); } const q = D.q + (stoveLv() >= 3 ? 1 : 0); addIt(k, q); qRoll(k, q); chefGain(k, 1); grCook(k); made[ITEMS[k].n] = q; n++; }
    if (n) say(A('cook'), '煮了 ' + Object.entries(made).map(([a, b]) => a + '×' + b).join('、')); }
  if (autoOn('proc')) { let n = 0; for (const [k, P] of Object.entries(PROC)) { if (!fm[P.at]) continue; const used = fm.batches.filter(b => b.at === P.at).length; if (used >= PROC_SLOTS[P.at]) continue; const need = procNeed(k); if (!need || !Object.entries(need).every(([m, c]) => sv_has(m) >= c + 4)) continue; quiet(() => SACT.pcStart(k)); n++; } if (n) say(A('proc'), '放進 ' + n + ' 批加工'); }
  if (autoOn('bake') && bz.kiln) { let t = ''; if (bz.mill && sv_has('wheat_p') >= 2) { const m = Math.floor(sv_has('wheat_p') / 2); sv_take('wheat_p', m * 2); addIt('flour', m * 2); t += '磨了 ' + m * 2 + ' 袋麵粉 '; } if (sv_has('flour') >= 2 && sv_has('board') >= 1) { sv_take('flour', 2); sv_take('board', 1); addIt('bread', 4); qRoll('bread', 4); gainXp('bake', 1); t += '烤了 4 個麵包'; } if (t) say(A('bake'), t); }
  if (autoOn('tap')) { let n = 0; for (let i = bz.vats.length - 1; i >= 0; i--) { const v = bz.vats[i]; if (sv.day - v.start >= BREWS[v.k].min + 3) { quiet(() => SACT.bzTap(i)); n++; } } if (n) say(A('tap'), '開了 ' + n + ' 桶酒'); }
  if (autoOn('contract') && g.con) { const O = CONTRACTS[g.con.i], have = O.need().reduce((a, k) => a + sv_has(k), 0); if (have < O.q && g.con.i === 0) { quiet(() => { for (const k of Object.keys(DISHES)) if (dishOk(k)) { SACT.cookx(k); break; } }); say(A('contract'), '先幫合約備了料理'); } }
  if (autoOn('order')) { let n = 0; for (const o of bz.orders.slice()) if (!o.done && o.until >= sv.day && canFill(o)) { quiet(() => SACT.bzOrder(o.id)); n++; } if (n) say(A('order'), '交了 ' + n + ' 張訂單'); }
  if (autoOn('serve')) { let n = 0; bz.cust.forEach((c, i) => { if (!c.done && sv_has(c.want) > 0) { quiet(() => SACT.bzServe(i)); n++; } }); if (n) say(A('serve'), '招呼了 ' + n + ' 位客人'); }
  if (autoOn('plate') && grOn('plate')) { let n = 0; const gr = GR(); for (const d of Object.keys(FOOD)) { if (!FOOD[d].dish) continue; while (qOf(d)[1] - (gr.plated[d] || 0) > 0 && n < 8) { UI.plD = d; UI.plP = sv_has('fineplate') ? 'fineplate' : sv_has('plate') ? 'plate' : 'none'; UI.plG = ['mint_l', 'basil_p', 'scallion_p'].find(x => sv_has(x) > 0) || 'none'; quiet(() => SACT.plDo()); n++; } } UI.plD = null; if (n) say(A('plate'), '擺盤 ' + n + ' 道'); }
  if (autoOn('sell') && grOn('market')) { let c = 0; for (const [k, p] of Object.entries(g.mkt)) { if (p < 1.2 || !ITEMS[k] || sv_has(k) <= 15) continue; const n = Math.floor(sv_has(k) / 2); for (let i = 0; i < n; i++) { const t = takeBest(k); c += Math.round(valOf(k) * qMul[t]); } } if (c) { bz.coin += c; GR().stats.coin += c; say(A('sell'), '趁行情好賣了一批，+' + c + ' 瓶蓋'); } }
  return out;
}
// 解鎖通知＋每天早上跑
const _nightAuto = night;
night = function (watch) {
  const d0 = S && S.sv && S.sv.day; _nightAuto(watch);
  if (!S || !S.sv || S.phase !== 'survive' || S.sv.day === d0 || !hasG3()) return;
  const g = G4(), ex = []; if (!g.autoSeen) g.autoSeen = {};
  for (const A of AUTOS) if (autoOpen(A) && !g.autoSeen[A.k]) { g.autoSeen[A.k] = S.sv.day; ex.push('🤖 解鎖自動化：' + A.ic + ' ' + A.n + '（已自動開啟，可在「🌟 成長 → 家園 → 自動化中心」關掉）'); }
  const r = runAutos(); if (r.length) ex.push('🤖 自動化報告：' + r.join('；'));
  if (UI.morning && UI.morning.day === S.sv.day) UI.morning.extra = (UI.morning.extra || []).concat(ex); else ex.forEach(t => slog(t));
};

/* ===== 畫面 ===== */
GROW.push({ k: 'auto', t: 1, ic: '🤖', n: '自動化中心', g: 'home', c: () => AUTOS.some(autoOpen), txt: '任一技能到解鎖等級（最低：種植 Lv.2 或養殖 Lv.2）' });
GR_INTRO.auto = ['技能等級越高，解鎖越多自動化，每天早上自動幫你做。', '解鎖時預設打開，不想要的可以在這裡關掉。', '自動化不花時間和體力，但會用掉材料。'];
const _grBodyAuto = grBody;
grBody = function (k) {
  if (k !== 'auto') return _grBodyAuto(k);
  const on = AUTOS.filter(a => autoOn(a.k)).length, open = AUTOS.filter(autoOpen).length;
  let h = '<p class="meta">已解鎖 ' + open + '/' + AUTOS.length + ' · 運作中 ' + on + '　<button class="gr-chip" data-a="auAll" data-v="on">全開</button> <button class="gr-chip" data-a="auAll" data-v="off">全關</button></p>';
  for (const A of AUTOS) { const op = autoOpen(A), o = autoOn(A.k); h += '<div class="wm-row au-row' + (op ? '' : ' locked') + '"><div><b>' + A.ic + ' ' + A.n + '</b><div class="meta">' + A.d + (op ? '' : ' · 🔒 ' + LVN[A.lv[0]] + ' Lv.' + A.lv[1] + '（現在 Lv.' + lvNow(A.lv[0]) + '）') + '</div></div>' + (op ? '<button class="au-sw' + (o ? ' on' : '') + '" data-a="auTog" data-v="' + A.k + '" aria-label="' + A.n + '"><i></i></button>' : '') + '</div>'; }
  return h;
};
const _grSceneAuto = grScene;
grScene = function (k, now) {
  if (k !== 'auto') return _grSceneAuto(k, now);
  const t = now / 1000, act = AUTOS.filter(a => autoOn(a.k)); let s = '<rect width="330" height="96" fill="#26303c"/><rect y="74" width="330" height="22" fill="#1a2028"/>';
  act.slice(0, 8).forEach((A, i) => { const x = 20 + i * 39, y = 58 - Math.abs(Math.sin(t * 3 + i)) * 6; s += '<g transform="translate(' + x + ' ' + y.toFixed(1) + ')"><rect x="-12" y="-6" width="24" height="20" rx="5" fill="#8ab0c8"/><circle cx="-5" cy="2" r="2.5" fill="#1d2733"/><circle cx="5" cy="2" r="2.5" fill="#1d2733"/><line x1="0" y1="-6" x2="0" y2="-12" stroke="#8ab0c8" stroke-width="2"/><circle cx="0" cy="-13" r="2.5" fill="' + (Math.sin(t * 6 + i) > 0 ? '#6ac04a' : '#ecd27a') + '"/><text x="0" y="30" text-anchor="middle" font-size="12">' + A.ic + '</text></g>'; });
  if (!act.length) s += '<text x="165" y="50" text-anchor="middle" font-size="11" fill="#9ab">還沒有自動化在運作</text>';
  return grSVG(s);
};
// 房間裡的小機器人
const _wxLayerAuto = wxLayer;
wxLayer = function () { let s = _wxLayerAuto(); if (!hasG3()) return s; const n = Math.min(4, Math.ceil(AUTOS.filter(a => autoOn(a.k)).length / 3)); for (let i = 0; i < n; i++) s += '<span class="wx-bot" style="animation-delay:-' + (i * 3.5) + 's;top:' + (55 + i * 9) + '%">🤖</span>'; return s; };

/* ===== 平衡：永久模式（非挑戰版）心態、生命每晚回復 ===== */
const _nightBal = night;
night = function (watch) {
  const d0 = S && S.sv && S.sv.day; _nightBal(watch);
  if (!S || !S.sv || S.phase !== 'survive' || S.sv.day === d0 || !isForever() || (S.mods && S.mods.fHard)) return;
  const sv = S.sv, hl = hasG3() ? homeLv() : 1;
  sv.mor = clamp(Math.max(35, sv.mor + 4 + hl)); sv.hp = clamp(sv.hp + 15);
};
// 心態低的時候提示怎麼補
const _ntListBal = ntList;
ntList = function () { const L = _ntListBal(); const i = L.findIndex(n => /^心態/.test(n.t)); if (i >= 0) L[i].sub = '吃料理、開燈、聽音樂台、摸狗或貓、辦桌都會回心態'; return L; };
