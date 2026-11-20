/* ================= 吃什麼自己選，也可以自動 =================
   按「吃」會打開食物清單：每樣食物的數量、飽足、心態、還能放幾天，點一下吃一份。
   最上面「🤖 自動吃到飽」幫你挑（先吃快壞的）；也可以開「肚子餓自動吃」「口渴自動喝」，
   飽腹低於 30／水分低於 30 時自己吃喝，不用一直盯著。 */
if (UIS.autoEat == null) UIS.autoEat = false;
if (UIS.autoDrink == null) UIS.autoDrink = false;

// 自動吃的順序：快壞的 → 自己煮的料理 → 新鮮作物 → 原本的順序 → 其他
nextFood = function () {
  const sv = S.sv;
  const fresh = sv.fresh.filter(f => FOOD[f.k] && f.q > 0).sort((a, b) => a.life - b.life);
  if (fresh.length && fresh[0].life <= 1.01) return fresh[0].k;
  const fd = fresh.filter(f => FOOD[f.k].dish); if (fd.length) return fd[0].k;
  if (fresh.length) return fresh[0].k;
  const o = EAT_ORDER.find(k => k !== 'juice' && sv_has(k) > 0); if (o) return o;
  const any = Object.keys(FOOD).filter(k => sv_has(k) > 0 && !['juice', 'jam', 'pickle', 'choco'].includes(k)).sort((a, b) => FOOD[b].sat - FOOD[a].sat)[0];
  return any || ['pickle', 'jam', 'choco', 'juice'].find(k => sv_has(k) > 0) || null;
};
function lifeOf(k) { const L = S.sv.fresh.filter(f => f.k === k && f.q > 0).map(f => f.life); return L.length ? Math.min(...L) : null; }

Object.assign(SACT, {
  eatPick() { UI.eatPick = true; UI.rtSel = null; UI.verbs = false; render(); },
  eatPickClose() { UI.eatPick = false; render(); },
  eatOne(k) {
    const sv = S.sv; if (sv_has(k) <= 0) return;
    if (sv.sat >= 100) { slog('已經吃不下了。'); render(); return; }
    const a = typeof statSnap === 'function' ? statSnap() : null;
    SACT.eat(k);
    sfx('eat');
    if (a && typeof floatStats === 'function' && typeof rtState === 'function') floatStats(a, rtState().pos);
    if (typeof rtState === 'function') { const rt = rtState(); rt.workA = 'eat'; rt.workUntil = performance.now() + 1400; }
    render();
  },
  eatAuto() { SACT.eatFull(); sfx('eat'); if (typeof rtState === 'function') { const rt = rtState(); rt.workA = 'eat'; rt.workUntil = performance.now() + 1400; } },
  drinkOne() { SACT.drink(); render(); },
  autoEatToggle() { UIS.autoEat = !UIS.autoEat; saveUI(); render(); },
  autoDrinkToggle() { UIS.autoDrink = !UIS.autoDrink; saveUI(); render(); }
});
// 「吃」改成打開清單；喝照舊一次喝滿
const _rtQuickEat = SACT.rtQuick;
SACT.rtQuick = function (v) { if (v === 'eatFull' && S.sv && !S.sv.out) return SACT.eatPick(); return _rtQuickEat(v); };
const _verbEat = SACT.verb;
SACT.verb = function (k) { if (k === 'eat') return SACT.eatPick(); return _verbEat(k); };

function eatHTML() {
  const sv = S.sv;
  const ks = Object.keys(FOOD).filter(k => sv_has(k) > 0);
  const tag = k => { const L = lifeOf(k), f = FOOD[k]; const t = []; if (L != null) t.push(L <= 1.01 ? '<span class="et warn">快壞了</span>' : '<span class="et">還能放 ' + Math.ceil(L) + ' 天</span>'); if (f.dish) t.push('<span class="et dish">料理</span>'); if (f.warm && inCold(sv.day)) t.push('<span class="et warm">🔥 熱的</span>'); return t.join(''); };
  ks.sort((a, b) => { const la = lifeOf(a), lb = lifeOf(b); const ua = la != null && la <= 1.01, ub = lb != null && lb <= 1.01; if (ua !== ub) return ua ? -1 : 1; if (!!FOOD[a].dish !== !!FOOD[b].dish) return FOOD[a].dish ? -1 : 1; return FOOD[b].sat - FOOD[a].sat; });
  const bar = (n, v, col) => '<div class="ep-bar"><span>' + n + '</span><div class="bar"><i style="width:' + clamp(v) + '%;background:' + col + '"></i></div><b class="num">' + Math.round(v) + '</b></div>';
  const tap = sv.day <= 5, water = sv.st.wu || 0;
  let h = '<div class="rt-modal" data-a="eatPickClose"><div class="rt-mbox ep-box" data-a="noop"><div class="rt-mh"><span class="rt-mic">🍚</span><div><b>要吃什麼？</b><div class="meta">吃東西不花時間，點一下吃一份</div></div><button class="btn ghost" data-a="eatPickClose" style="margin-left:auto">好了</button></div>' +
    bar('飽腹', sv.sat, '#e0a85a') + bar('水分', sv.hyd, '#6fb3e0') + bar('心態', sv.mor, '#d97ab8') +
    '<div class="ep-auto"><button class="btn" data-a="eatAuto"' + (ks.length && sv.sat < 85 ? '' : ' disabled') + '>🤖 自動吃到飽<small>先吃快壞的</small></button><button class="btn ghost" data-a="drinkOne"' + (tap || water >= 1 ? '' : ' disabled') + '>💧 喝一份水<small>' + (tap ? '還有自來水' : '剩 ' + water + ' 份') + '</small></button></div>' +
    '<div class="ep-toggles"><button class="pill' + (UIS.autoEat ? ' on' : '') + '" data-a="autoEatToggle">' + (UIS.autoEat ? '✓ ' : '') + '肚子餓自動吃</button><button class="pill' + (UIS.autoDrink ? ' on' : '') + '" data-a="autoDrinkToggle">' + (UIS.autoDrink ? '✓ ' : '') + '口渴自動喝</button></div>';
  if (!ks.length) h += '<p class="meta" style="margin:10px 0">家裡沒有能吃的東西了。出門搜刮，或是種菜、煮飯。</p>';
  else h += '<div class="ep-grid">' + ks.map(k => { const f = FOOD[k]; return '<button class="ep-cell" data-a="eatOne" data-v="' + k + '"' + (sv.sat >= 100 ? ' disabled' : '') + '>' + itemIc(k, 'ep-ic') + '<div class="ep-t"><b>' + ITEMS[k].n.replace(/（.*）/, '') + '</b><span class="ep-q">×' + sv_has(k) + '</span></div><div class="ep-s">飽足 +' + f.sat + (f.mor ? ' · 心態 +' + f.mor : '') + '</div><div class="ep-tags">' + tag(k) + '</div></button>'; }).join('') + '</div>';
  return h + '</div></div>';
}
const _renderEat = render;
render = function () {
  _renderEat();
  if (UI.eatPick && S && S.phase === 'survive' && S.sv && !S.sv.out) $app.insertAdjacentHTML('beforeend', eatHTML());
  else if (UI.eatPick && (!S || S.phase !== 'survive')) UI.eatPick = false;
};
const _rtActiveEat = rtActive;
rtActive = function () { return _rtActiveEat() && !UI.eatPick; };

// 自動吃喝：每過一個遊戲小時檢查（在家、醒著）
let AE_HOUR = null;
function autoEatTick() {
  requestAnimationFrame(autoEatTick);
  if (!S || S.phase !== 'survive' || !S.sv || S.sv.out) return;
  const sv = S.sv, k = sv.day * 100 + sv.hour; if (k === AE_HOUR) return; AE_HOUR = k;
  let did = false;
  if (UIS.autoEat && sv.sat < 30 && nextFood()) { SACT.eatFull(); did = true; }
  if (UIS.autoDrink && sv.hyd < 30 && (sv.day <= 5 || (sv.st.wu || 0) >= 1)) { SACT.drinkFull(); did = true; }
  if (did && typeof say === 'function') say('先填飽肚子', 1500);
}
requestAnimationFrame(autoEatTick);
