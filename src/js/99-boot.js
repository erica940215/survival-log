/* ================= 事件綁定 ================= */
$app.addEventListener('click', e => {
  const b = e.target.closest('[data-a]');
  if (!b || b.disabled) return;
  const a = b.getAttribute('data-a');
  sfx(a === 'buy' ? 'buy' : a === 'sleep' || a === 'watch' ? 'sleep' : 'click');
  if (ACT[a]) ACT[a](b.getAttribute('data-v'));
  else if (SACT[a]) SACT[a](b.getAttribute('data-v'));
});

// 數量直接輸入：只更新數值、不重畫，避免手機上點「買」時按鈕被重畫吃掉
function setQtyFromInput(el) {
  const k = el.getAttribute('data-qty');
  const v = Math.floor(Number(el.value));
  UI.qty[k] = Math.max(1, Math.min(99, isFinite(v) && v > 0 ? v : 1));
}
$app.addEventListener('input', e => { if (e.target.matches && e.target.matches('[data-qty]') && e.target.value !== '') setQtyFromInput(e.target); });
$app.addEventListener('change', e => { if (e.target.matches && e.target.matches('[data-qty]')) { setQtyFromInput(e.target); e.target.value = UI.qty[e.target.getAttribute('data-qty')]; } });
$app.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.matches && e.target.matches('[data-qty]')) {
    setQtyFromInput(e.target);
    const btn = $app.querySelector('[data-a="buy"][data-v="' + e.target.getAttribute('data-qty') + '"]');
    if (btn && !btn.disabled) btn.click();
  }
});

function start(data) {
  if (data && data.S) { S = data.S; UI = data.UI || { tab: 'here', qty: {} }; }
  else SAVED = loadSavedRun();
  render();
}
if (window.claude && window.claude.hot && window.claude.hot.snapshot) window.claude.hot.snapshot(() => ({ S, UI }));
if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(start);
else start((window.claude && window.claude.hot && window.claude.hot.data) || {});

// 給測試用
window.__slog = { get S() { return S; }, ACT, get SACT() { return SACT; } };
