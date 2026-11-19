/* ================= 存檔匯出／匯入 ================= */
function encodeSave(n) {
  let j = null, r = null;
  try { j = JSON.parse(localStorage.getItem(jkeyOf(n)) || 'null'); r = JSON.parse(localStorage.getItem(rkeyOf(n)) || 'null'); } catch (e) {}
  if (!j && !r) return '';
  const json = JSON.stringify({ v: 1, j, r });
  return 'SLOG1:' + btoa(unescape(encodeURIComponent(json)));
}
function decodeSave(code) {
  const c = String(code || '').trim();
  if (!c.startsWith('SLOG1:')) throw new Error('這不是生存日誌的存檔碼（開頭應該是 SLOG1:）。');
  let d;
  try { d = JSON.parse(decodeURIComponent(escape(atob(c.slice(6))))); } catch (e) { throw new Error('存檔碼不完整，可能少複製了一段。'); }
  if (!d || (!d.j && !d.r)) throw new Error('存檔碼裡沒有資料。');
  return d;
}
function viewBackup(n) {
  if (UI.exportSlot === n) {
    const code = encodeSave(n);
    return '<div class="backup"><p class="meta">把這串存檔碼存起來（例如貼到記事本或傳給自己），之後可以匯入回來，或在另一台裝置匯入。</p>' +
      '<textarea id="export-code" readonly rows="4">' + esc(code) + '</textarea><div class="row-btns" style="margin:6px 0 0">' +
      '<button class="btn" data-a="copySave">複製</button><button class="btn ghost" data-a="backupClose">關閉</button></div>' +
      (UI.copyMsg ? '<p class="meta">' + esc(UI.copyMsg) + '</p>' : '') + '</div>';
  }
  if (UI.importSlot === n) {
    return '<div class="backup"><p class="meta">貼上存檔碼，會<b>覆蓋</b>存檔 ' + n + ' 原本的內容。</p>' +
      '<textarea id="import-code" rows="4" placeholder="SLOG1:..."></textarea><div class="row-btns" style="margin:6px 0 0">' +
      '<button class="btn red" data-a="importSave" data-v="' + n + '">匯入到存檔 ' + n + '</button><button class="btn ghost" data-a="backupClose">取消</button></div>' +
      (UI.importMsg ? '<p class="meta" style="color:var(--stamp)">' + esc(UI.importMsg) + '</p>' : '') + '</div>';
  }
  return '';
}
Object.assign(ACT, {
  exportSave(v) { UI.exportSlot = Number(v); UI.importSlot = null; UI.copyMsg = ''; render(); },
  importOpen(v) { UI.importSlot = Number(v); UI.exportSlot = null; UI.importMsg = ''; render(); },
  backupClose() { UI.exportSlot = null; UI.importSlot = null; UI.copyMsg = ''; UI.importMsg = ''; render(); },
  copySave() {
    const el = document.getElementById('export-code');
    if (!el) return;
    el.focus(); el.select();
    const done = ok => { UI.copyMsg = ok ? '已複製。' : '沒辦法自動複製，請長按文字框全選後複製。'; render(); };
    try { navigator.clipboard.writeText(el.value).then(() => done(true), () => done(false)); } catch (e) { done(false); }
  },
  importSave(v) {
    const n = Number(v), el = document.getElementById('import-code');
    if (S || !el) return;
    try {
      const d = decodeSave(el.value);
      if (d.j) localStorage.setItem(jkeyOf(n), JSON.stringify(d.j)); else localStorage.removeItem(jkeyOf(n));
      if (d.r) localStorage.setItem(rkeyOf(n), JSON.stringify(d.r)); else localStorage.removeItem(rkeyOf(n));
      if (n === SLOT) { J = loadJournal(); SAVED = loadSavedRun(); }
      UI.importSlot = null; UI.importMsg = '';
      render();
    } catch (e) { UI.importMsg = e.message; render(); }
  }
});
