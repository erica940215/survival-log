/* ================= 新手流程改善 ================= */

/* 1. 新玩家預設開自動吃喝（還沒設定過的才改） */
try { if (!localStorage.getItem('survival-log-autoeat-set')) { UIS.autoEat = true; UIS.autoDrink = true; localStorage.setItem('survival-log-autoeat-set', '1'); saveUI(); } } catch (e) {}

/* 2. 標題畫面最上面放大按鈕：繼續／一般／永久 */
const _viewTitleNb = viewTitle;
viewTitle = function () {
  const h = _viewTitleNb(), cont = typeof SAVED !== 'undefined' && SAVED && SAVED.S;
  const quick = '<div class="nb-quick">' + (cont ? '<button class="btn nb-big" data-a="resume">▶ 繼續上次（第 ' + (SAVED.S.sv ? SAVED.S.sv.day + ' 天' : '準備期') + '）</button>' : '') +
    '<button class="btn nb-big red" data-a="nbStart">⚔️ 一般模式<small>10 小時準備，撐 100 天</small></button>' +
    '<button class="btn nb-big green" data-a="foreverStart">🌱 永久模式<small>不會死，專心種田、煮菜、經營</small></button>' +
    '<p class="meta">第一次玩？推薦先玩<b>永久模式</b>熟悉操作，再挑戰一般模式。</p></div>';
  const i = h.indexOf('<div class="cat">存檔欄位</div>');
  return i >= 0 ? h.slice(0, i) + quick + h.slice(i) : quick + h;
};
ACT.nbStart = function () { ACT.start(); };
if (!ACT.resume) ACT.resume = function () { const b = document.querySelector('[data-a=continue],[data-a=loadRun],[data-a=cont]'); if (b) b.click(); };

/* 3. 一般模式：經營、成長第 3 天才出現，避免新手第一天就被分心 */
const _bizAllowedNb = bizAllowed;
bizAllowed = function () { if (!isForever() && S && S.sv && S.sv.day < 3) return false; return _bizAllowedNb(); };
const _bizNightNb = bizNight;
bizNight = function () { const ex = _bizNightNb(); return (J.bzSeen && J.bzSeen.welcome) ? ex : ex.filter(t => !/店先不開|經營中心先暫停/.test(t)); };

/* 4. 永久模式新手任務 */
const FQ = [
  { n: '在種植箱種下第一株菜', ok: () => (S.sv.plants || []).length > 0, go: { open: ['lightbox', 'potrack', 'greenhouse'] }, tip: '點種植箱，照「種植小幫手」的建議種' },
  { n: '用微波爐煮第一道料理', ok: () => (chefState().xp || 0) > 0, go: { open: ['microwave'] }, tip: '點微波爐，選一道材料夠的菜' },
  { n: '到頂樓蓋雞舍、放兩隻母雞', ok: () => !!(W().roof && W().roof.coop && W().roof.hens), go: { wm: 'roof' }, tip: '頂樓 → 蓋雞舍 → 放母雞，每天撿蛋' },
  { n: '在農場種一株草藥', ok: () => F().herbs.length > 0 || (F().xp.herb || 0) > 0, go: { a: 'fmOpen', tab: 'herb' }, tip: '農場 → 藥草 → 先蓋草藥圃再種' },
  { n: '養兔子', ok: () => F().rabbits > 0, go: { a: 'fmOpen', tab: 'ranch' }, tip: '農場 → 牧場 → 蓋兔籠，放兔子' },
  { n: '打開經營中心看看', ok: () => !!(J.bzSeen && J.bzSeen.welcome), go: { a: 'bzOpen' }, tip: '接訂單、開小店，用作物和料理賺瓶蓋' },
  { n: '交出第一張訂單', ok: () => !!(S.sv.w.fm.bz && S.sv.w.fm.bz.orders.some(o => o.done)), go: { a: 'bzGoX', v: 'order' }, tip: '備齊訂單要的東西，按交貨' },
  { n: '睡一覺，看看早上的待辦', ok: () => S.sv.day >= 2, go: { a: 'rtQuick', v: 'sleep' }, tip: '早報會列出今天最該做的事' },
  { n: '打開「🌟 成長」看解鎖路線', ok: () => !!(J.grSeen && J.grSeen.welcome), go: { a: 'grOpenHub' }, tip: '越玩越多新玩法，條件都寫在路線裡' }
];
function fqNext() { if (!isForever() || !S.sv || !S.sv.w) return null; for (let i = 0; i < FQ.length; i++) { try { if (!FQ[i].ok()) return i; } catch (e) { return i; } } return null; }
const _tidyQNb = tidyQuest;
tidyQuest = function () {
  const i = fqNext(); if (i == null) return _tidyQNb();
  return '<div class="tq-1">🌱 永久模式 · 第 <b>' + S.sv.day + '</b> 天 · 新手任務 ' + (i + 1) + '/' + FQ.length + '</div><div class="tq-2 fq" data-a="fqGo">🎯 ' + FQ[i].n + ' <span>›</span></div>';
};
SACT.fqGo = function () {
  const i = fqNext(); if (i == null) return; const g = FQ[i].go;
  slog('💡 ' + FQ[i].tip + '。');
  if (g.open) { const id = placedId(g.open); if (id) { openObj(id); return; } }
  if (g.wm) { SACT.wmOpen(g.wm); return; }
  if (g.tab) UI.fmTab = g.tab;
  if (SACT[g.a]) SACT[g.a](g.v); else render();
};
// 完成任務時跳一下
let _fqLast = null;
const _renderFq = render;
render = function () {
  _renderFq();
  if (!S || S.phase !== 'survive' || !isForever()) return;
  const i = fqNext(); if (_fqLast != null && i !== _fqLast && typeof ntToast === 'function') ntToast('✅ 新手任務完成：' + FQ[_fqLast].n + (i != null ? '　下一步：' + FQ[i].n : '　全部完成！'), 'g');
  _fqLast = i;
};

/* 5. 準備期清單：寫去哪裡買，第一次自動打開 */
const BUY_AT = { '食物': '特價超市（10:32 搶購潮免費）、社區便利店', '水': '特價超市、社區便利店', '加固': '工具店（木板、鐵片）、裝修公司（大門）', '有發電': '裝修公司（發電機、太陽能板）', '藥品': '藥局', '有種子': '農貿市場' };
const _prepChkNb = prepChk;
prepChk = function () {
  if (S && S.phase === 'play' && UI.prepChkOpen == null) UI.prepChkOpen = window.innerHeight >= 560;
  _prepChkNb();
  const el = document.querySelector('.prep-chk'); if (!el) return;
  el.querySelectorAll('div.no').forEach(d => { const k = Object.keys(BUY_AT).find(x => d.textContent.includes(x)); if (k) d.insertAdjacentHTML('beforeend', '<em>→ ' + BUY_AT[k] + '</em>'); });
};

/* 6. 永久模式中級任務：做完新手任務後，引導到成長路線第 2、3 階段 */
const FQ_BASIC = FQ.length;
FQ.push(
  { n: '廚師練到 Lv.2', ok: () => chefLv() >= 2, go: { open: ['microwave'] }, tip: '多煮幾道料理就會升級，升級後解鎖「食譜研發」' },
  { n: '用食譜研發發現一道新菜', ok: () => Object.keys(J.labBook || {}).length > 0, go: { a: 'grGoX', v: 'lab' }, tip: '成長 → 廚房 → 食譜研發，看提示猜材料' },
  { n: '種植練到 Lv.2', ok: () => lvOfK('farm') >= 2, go: { a: 'fmOpen', tab: 'field' }, tip: '收成會拿經驗，升級後解鎖「土壤肥力」' },
  { n: '招待一位小店客人', ok: () => !!(S.sv.w.fm.bz && (S.sv.w.fm.bz.cust.some(c => c.done) || (S.sv.w.fm.gr && S.sv.w.fm.gr.reviews.length))), go: { a: 'bzGoX', v: 'shop' }, tip: '經營 → 小店，客人頭上是他想買的東西' },
  { n: '同一道料理煮 5 次', ok: () => !!(S.sv.w.fm.gr && Object.values(S.sv.w.fm.gr.cookN).some(n => n >= 5)), go: { open: ['microwave'] }, tip: '挑一道最拿手的一直煮，會解鎖「招牌菜」' },
  { n: '做出一道極品料理', ok: () => cdxHasExcDish(), go: { open: ['microwave'] }, tip: '廚師等級越高越容易極品，做出來就能「擺盤」' },
  { n: '養殖練到 Lv.2', ok: () => lvOfK('ranch') >= 2, go: { wm: 'roof' }, tip: '每天撿蛋、養兔子、採蜂蜜都有經驗，升級後解鎖「魚池」' },
  { n: '挖好魚池', ok: () => !!(S.sv.w.fm.gr && S.sv.w.fm.gr.pond), go: { a: 'grGoX', v: 'fish' }, tip: '成長 → 產業 → 魚池，魚苗在小店市集買' },
  { n: '完成一項每週挑戰', ok: () => !!(S.sv.w.fm.gr && S.sv.w.fm.gr.wk && S.sv.w.fm.gr.wk.list.some(c => c.done)), go: { a: 'grGoX', v: 'weekly' }, tip: '第 7 天後解鎖，獎勵是稀有雜交種子' },
  { n: '解鎖成長路線第 3 階段', ok: () => tierOpen(3), go: { a: 'grGoX', v: 'route' }, tip: '第 2 階段解鎖 4 項就會打開：陶藝、養蠶、夜市……' }
);
const _tidyQNb2 = tidyQuest;
tidyQuest = function () {
  const i = fqNext(); if (i == null || !isForever()) return _tidyQNb2();
  const mid = i >= FQ_BASIC, k = mid ? i - FQ_BASIC + 1 : i + 1, n = mid ? FQ.length - FQ_BASIC : FQ_BASIC;
  return '<div class="tq-1">🌱 永久模式 · 第 <b>' + S.sv.day + '</b> 天 · ' + (mid ? '中級' : '新手') + '任務 ' + k + '/' + n + '</div><div class="tq-2 fq" data-a="fqGo">🎯 ' + FQ[i].n + ' <span>›</span></div>';
};
// 新手任務全部完成時提示接下來的中級任務
const _renderFq2 = render;
let _fqBasicDone = null;
render = function () { _renderFq2(); if (!S || S.phase !== 'survive' || !isForever()) return; const i = fqNext(), d = i == null || i >= FQ_BASIC; if (_fqBasicDone === false && d && typeof ntToast === 'function') ntToast('🎉 新手任務全部完成！接下來是中級任務，帶你解鎖更多玩法。', 'g'); _fqBasicDone = d; };

/* 7. 一般模式新手保護：第一輪、或準備期幾乎沒準備，第一次屍潮（第 3 天）只剩 4 成強度 */
const _startSurviveNb = startSurvive;
startSurvive = function () {
  _startSurviveNb();
  const sv = S.sv; if (!sv || isForever()) return;
  const food = Object.keys(FOOD).reduce((a, k) => a + sv_has(k) * (FOOD[k].sat || 0), 0) / 60;
  const mats = (sv.st.board || 0) + (sv.st.metal || 0);
  const first = !(J.runs && J.runs.length);
  if (first || food < 5 || mats < 3) { sv.shield = first ? 'first' : 'weak'; slog('🛡️ 新手保護：' + (first ? '第一次玩' : '這次準備得不太夠') + '，第一次屍潮（第 3 天晚上）會比較弱。好好利用這幾天加固大門！', true); }
};
const _hordeMulShield = hordeMul;
hordeMul = function () { const sv = S && S.sv; return _hordeMulShield() * (sv && sv.shield && sv.day <= 3 ? 0.4 : 1); };
const _tidyQShield = tidyQuest;
tidyQuest = function () { const h = _tidyQShield(), sv = S.sv; return sv.shield && sv.day <= 3 && !isForever() ? h + '<div class="tq-2">🛡️ 新手保護中：第 3 天屍潮只剩 4 成強度</div>' : h; };

/* 8. 換畫面（標題 → 準備期 → 生存）時捲回最上面 */
let _phaseNb = null;
const _renderTop = render;
render = function () { _renderTop(); const ph = S ? S.phase : 'title'; if (ph !== _phaseNb) { _phaseNb = ph; try { window.scrollTo(0, 0); } catch (e) {} } };
