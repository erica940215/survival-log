/* ================= 存檔續玩 ================= */
// 進行中的一輪每次畫面更新都存進瀏覽器；關掉網頁再打開可以繼續。
let SAVED = null;
function persistRun() {
  try {
    if (S && !(S.phase === 'end' && S.result && S.result.committed)) localStorage.setItem(rkeyOf(SLOT), JSON.stringify({ S, UI }));
    else localStorage.removeItem(rkeyOf(SLOT));
  } catch (e) {}
}
function loadSavedRun() {
  try { const raw = localStorage.getItem(rkeyOf(SLOT)); if (raw) { const d = JSON.parse(raw); if (d && d.S) return d; } } catch (e) {}
  return null;
}
function savedLabel(d) {
  const s = d.S;
  if (s.phase === 'play') return '準備期 ' + clock(s.t) + '，距離爆發 ' + dur(OUTBREAK - s.t);
  if (s.phase === 'survive') return '爆發後第 ' + s.sv.day + ' 天 ' + String(s.sv.hour).padStart(2, '0') + ':00' + (s.sv.out ? '（外出中）' : '');
  return '這一輪剛結束，還沒選擇下一步';
}
const _renderBase = render;
render = function () { trackCodex(); _renderBase(); persistRun(); };

Object.assign(ACT, {
  resume() { if (!SAVED) return; S = SAVED.S; UI = SAVED.UI || { tab: 'here', qty: {} }; SAVED = null; render(); window.scrollTo(0, 0); },
  abandon() {
    if (!SAVED) return;
    S = SAVED.S; UI = SAVED.UI || { tab: 'here', qty: {} }; SAVED = null;
    if (S.phase === 'play') finishRun({ days: 0, cause: '你放棄了這一輪。', causeKey: '', timeline: [{ d: '準備期', txt: '你放棄了這一輪。', cls: 'bad' }], stats: null });
    else if (S.phase === 'survive') SACT.giveup();
    commitRun();
    S = null; render();
  }
});
function viewResume() {
  if (!SAVED) return '';
  return '<div class="sheet" style="padding:12px;margin:0 0 14px;border-color:var(--stamp)"><div class="hand" style="font-size:20px">上一輪還沒結束</div>' +
    '<p style="margin:4px 0 10px">' + esc(savedLabel(SAVED)) + '</p><div class="row-btns" style="margin:0"><button class="btn red" data-a="resume">繼續</button>' +
    '<button class="btn ghost" data-a="abandon">放棄這一輪</button></div><p class="empty" style="padding:6px 0 0">放棄等於這一輪死亡，會用掉 1 次復活。</p></div>';
}
