/* ================= 版面整理 =================
   行動分頁重新排版（直式、橫屏選單裡都適用）：
   頂部：一行最新訊息（點了看日誌）＋小小的「橫放」提示
   房間：左上角資訊縮成兩行
   下面依序：狀態條 → 資源一行 → 四個大按鈕 → 頂樓／鄰居／無線電／收藏 → 提醒（合併成一張）
   → 植物、全部行動清單、⚙️ 設定（都收起來） */
Object.assign(SACT, { tkLog() { UI.tab = 'journal'; UI.lsMenu = document.body.classList.contains('ls') ? true : UI.lsMenu; render(); window.scrollTo(0, 0); } });

function tidyQuest() {
  const sv = S.sv, hz = hordeOn(sv.day), z = sv.zoe || {};
  const ev = hz ? '🧟 今晚' + HTYPES[hordeType(sv.day)].n : hordeOn(sv.day + 1) ? '⚠️ 明晚屍潮' : '今天平安';
  const g = typeof goalState === 'function' ? GOALS.find(G => !goalState()[G.id]) : null;
  return '<div class="tq-1"><b>第 ' + sv.day + '</b>/100 天 · ' + ev + '</div>' +
    (z.state === 'asking' ? '<div class="tq-2">隔壁女孩想要 <b>' + ITEMS[z.want].n + '</b>（' + z.given + '/7）</div>' : '') +
    (g ? '<div class="tq-2">🎯 ' + g.n + '</div>' : '');
}
function tidyAct(main) {
  if (!main) return;
  // 橫放提示：縮小
  const hint = main.querySelector(':scope > .ls-hint'); if (hint) hint.classList.add('slim');
  // 最新訊息：一行
  const tk = main.querySelector(':scope > .ticker');
  if (tk) { tk.classList.add('tk-one'); tk.setAttribute('data-a', 'tkLog'); const first = tk.querySelector('p'); if (first) tk.innerHTML = '<span class="tk-ic">📜</span>' + first.outerHTML + '<span class="tk-more">日誌 ›</span>'; }
  // 房間左上資訊
  const q = document.querySelector('.rt-wrap:not(.ot) .rt-q'); if (q) { q.classList.add('tq'); q.innerHTML = tidyQuest(); }
  // 資源列：拿掉重複的衛生
  const chips = main.querySelector(':scope > .chips'); if (chips) chips.querySelectorAll('span').forEach(s => { if (/^衛生/.test(s.textContent.trim())) s.remove(); });
  // 說明文字拿掉
  main.querySelectorAll(':scope > p.meta').forEach(p => { if (/^點家裡的東西/.test(p.textContent)) p.remove(); });
  // 四個大按鈕放前面
  const quick = [...main.querySelectorAll(':scope > .row-btns')].find(r => r.querySelector('[data-a="rtQuick"]'));
  const anchor = chips || main.querySelector(':scope > .rt-stats');
  if (quick) { quick.classList.add('quick4'); if (anchor) anchor.after(quick); }
  const wm = main.querySelector(':scope > .wm-chips'); if (wm && (quick || anchor)) (quick || anchor).after(wm);
  // 提醒合併成一張
  const warns = [...main.querySelectorAll(':scope > .sg-warn, :scope > .warnbox')].filter(w => !w.querySelector('[data-a="enc"]') && (w.classList.contains('sg-warn') || w.querySelector('li')));
  if (warns.length) {
    const box = document.createElement('div'); box.className = 'alerts';
    let items = '';
    for (const w of warns) {
      if (w.classList.contains('warnbox')) w.querySelectorAll('li').forEach(li => { items += '<li>🌙 ' + li.innerHTML + '</li>'; });
      else items += '<li>' + w.innerHTML + '</li>';
      w.remove();
    }
    box.innerHTML = '<div class="al-h">提醒</div><ul>' + items + '</ul>';
    (wm || quick || anchor || main.firstChild).after(box);
  }
  // 設定收起來
  const sets = [...main.querySelectorAll(':scope > .setrow')];
  const modeRow = [...main.querySelectorAll(':scope > .row-btns')].find(r => r.querySelector('[data-a="rtMode"]'));
  if (sets.length || modeRow) {
    const d = document.createElement('details'); d.className = 'guide settings-d'; d.innerHTML = '<summary>⚙️ 畫面與操作設定</summary>';
    for (const s of sets) d.appendChild(s); if (modeRow) d.appendChild(modeRow);
    if (UI.setOpen) d.open = true;
    d.addEventListener('toggle', () => { UI.setOpen = d.open; });
    main.appendChild(d);
  }
  // 橫屏：版面設定也收進去
  const lsSet = document.querySelector('.ls-drawer > .setrow'); const sd = main.querySelector(':scope > .settings-d'); if (lsSet && sd) sd.appendChild(lsSet);
  // 全部行動清單改名
  main.querySelectorAll(':scope > details.guide > summary').forEach(s => { if (s.textContent === '全部行動（選單）') s.textContent = '📋 全部行動清單'; });
}
const _renderTidy = render;
render = function () {
  _renderTidy();
  if (!S || S.phase !== 'survive' || !rtOn()) return;
  // 外出遇到殭屍／倖存者：選項做成跳出視窗，不會被收起來或擋住
  const o = S.sv && S.sv.out;
  if (o && o.enc) {
    const box = [...document.querySelectorAll('.warnbox')].find(w => w.querySelector('[data-a="enc"]'));
    if (box) { const html = box.innerHTML; box.remove(); $app.insertAdjacentHTML('beforeend', '<div class="rt-modal enc-modal"><div class="rt-mbox enc-box"><div class="rt-mh"><span class="rt-mic">' + (o.enc.t === 'z' ? '🧟' : '🧍') + '</span><div><b>' + (o.enc.t === 'z' ? '遇到殭屍了！' : '遇到其他倖存者') + '</b><div class="meta">先決定怎麼做，才能繼續行動</div></div></div>' + html + '</div></div>'); }
    return;
  }
  if (UI.tab !== 'act' || (S.sv && S.sv.out)) return;
  tidyAct(document.querySelector('main.wrap'));
};
