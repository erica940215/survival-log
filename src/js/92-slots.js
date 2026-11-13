/* ================= 三個存檔欄位 ================= */
function slotInfo(n) {
  let j = null, r = null;
  try { const a = localStorage.getItem(jkeyOf(n)); if (a) j = JSON.parse(a); } catch (e) {}
  try { const b = localStorage.getItem(rkeyOf(n)); if (b) r = JSON.parse(b); } catch (e) {}
  if (!j && !r) return { empty: true };
  const runs = j && j.runs ? j.runs.length : 0;
  const ch = j && j.char && CHARS[j.char] ? CHARS[j.char].n : '鄰居';
  return { empty: false, runs, ch, best: (j && j.best) || 0, ach: j && j.ach ? Object.keys(j.ach).length : 0, live: r && r.S ? savedLabel(r) : '' };
}
function viewSlots() {
  let h = '<div class="cat">存檔欄位</div><div class="slots">';
  for (const n of [1, 2, 3]) {
    const s = slotInfo(n), cur = n === SLOT;
    h += '<div class="slot' + (cur ? ' cur' : '') + '"><div class="slot-h"><b>存檔 ' + n + '</b>' + (cur ? '<span class="tag green">使用中</span>' : '') + '</div>';
    if (s.empty) h += '<p class="meta">空的</p>';
    else h += '<p class="meta">' + esc(s.ch) + ' · 玩了 ' + s.runs + ' 輪' + (s.best ? ' · 最佳 ' + s.best + ' 天' : '') + ' · 成就 ' + s.ach + '</p>' + (s.live ? '<p class="meta" style="color:var(--stamp)">進行中：' + esc(s.live) + '</p>' : '');
    h += '<div class="row-btns" style="margin:6px 0 0">';
    if (!cur) h += '<button class="btn ghost" data-a="slotUse" data-v="' + n + '">' + (s.empty ? '用這格開始' : '切換到這格') + '</button>';
    if (!s.empty) {
      if (UI.delSlot === n) h += '<button class="btn red" data-a="slotDelYes" data-v="' + n + '">確定刪除</button><button class="btn ghost" data-a="slotDelNo">取消</button>';
      else h += '<button class="btn ghost" data-a="slotDel" data-v="' + n + '">刪除</button>';
    }
    h += '</div></div>';
  }
  return h + '</div>';
}
Object.assign(ACT, {
  slotUse(v) {
    const n = Number(v);
    if (S || !(n >= 1 && n <= 3) || n === SLOT) return;
    SLOT = n;
    try { localStorage.setItem(SLOT_KEY, String(n)); } catch (e) {}
    J = loadJournal(); SAVED = loadSavedRun(); UI = { tab: 'here', qty: {} };
    render(); window.scrollTo(0, 0);
  },
  slotDel(v) { UI.delSlot = Number(v); render(); },
  slotDelNo() { UI.delSlot = null; render(); },
  slotDelYes(v) {
    const n = Number(v);
    if (S || UI.delSlot !== n) return;
    try { localStorage.removeItem(jkeyOf(n)); localStorage.removeItem(rkeyOf(n)); } catch (e) {}
    UI.delSlot = null;
    if (n === SLOT) { J = freshJournal(); SAVED = null; }
    render();
  }
});
