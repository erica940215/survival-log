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
  if (S && S.phase === 'play' && UI.prepChkOpen == null) UI.prepChkOpen = true;
  _prepChkNb();
  const el = document.querySelector('.prep-chk'); if (!el) return;
  el.querySelectorAll('div.no').forEach(d => { const k = Object.keys(BUY_AT).find(x => d.textContent.includes(x)); if (k) d.insertAdjacentHTML('beforeend', '<em>→ ' + BUY_AT[k] + '</em>'); });
};
