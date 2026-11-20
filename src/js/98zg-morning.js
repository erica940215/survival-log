/* ================= 入睡動畫＋早晨報告 =================
   睡覺／守夜時：角色躺下、畫面慢慢變暗（約 1 秒）才換天。
   天亮後跳出「第 N 天早上」卡片：昨晚發生的事、數值變化、多了少了什麼東西。 */
function invSnap() {
  const sv = S.sv, m = {};
  for (const [k, q] of Object.entries(sv.st)) if (q > 0) m[k] = (m[k] || 0) + q;
  for (const f of sv.fresh) m[f.k] = (m[f.k] || 0) + f.q;
  return m;
}
function svSnap() { const sv = S.sv; return { day: sv.day, hp: sv.hp, sat: sv.sat, hyd: sv.hyd, mor: sv.mor, sta: sv.sta, def: sv.def, power: sv.power, inv: invSnap(), log0: sv.log[0] }; }

const _nightMorning = night;
night = function (watch) {
  const a = S && S.sv ? svSnap() : null;
  _nightMorning(watch);
  if (!a || S.phase !== 'survive' || !S.sv || S.sv.day === a.day) return;
  const sv = S.sv, b = svSnap();
  const logs = []; for (const l of sv.log) { if (l === a.log0) break; logs.push(l); }
  const diff = {};
  for (const k of new Set([...Object.keys(a.inv), ...Object.keys(b.inv)])) { const d = (b.inv[k] || 0) - (a.inv[k] || 0); if (d && ITEMS[k]) diff[k] = d; }
  UI.morning = { day: sv.day, watch: !!watch, logs: logs.reverse().slice(-7), d: { hp: b.hp - a.hp, mor: b.mor - a.mor, def: b.def - a.def, power: b.power - a.power, sat: b.sat - a.sat, hyd: b.hyd - a.hyd }, items: diff, t0: Date.now() };
};
function morningCard() {
  const M = UI.morning; if (!M || !S.sv) return '';
  const sv = S.sv, hz = hordeOn(M.day - 1), wx = typeof weatherOf === 'function' ? weatherOf(M.day) : '';
  const num = v => (v > 0 ? '+' : '') + (Math.abs(v) < 10 && v % 1 ? v.toFixed(1) : Math.round(v));
  const chip = (n, v, good) => Math.abs(v) < 0.5 ? '' : '<span class="mc-chip ' + ((v > 0) === good ? 'up' : 'down') + '">' + n + ' ' + num(v) + '</span>';
  const chips = chip('生命', M.d.hp, true) + chip('心態', M.d.mor, true) + chip('防線', M.d.def, true) + chip('電', M.d.power, true);
  const its = Object.entries(M.items).sort((x, y) => y[1] - x[1]);
  const itemsH = its.length ? '<div class="mc-items">' + its.slice(0, 10).map(([k, d]) => '<span class="mc-it ' + (d > 0 ? 'up' : 'down') + '">' + itemIc(k) + ITEMS[k].n.replace(/（.*）/, '') + ' ' + (d > 0 ? '+' : '') + d + '</span>').join('') + '</div>' : '';
  const lines = M.logs.filter(l => !/^目標完成|^成就達成/.test(l.txt)).map(l => '<li' + (l.alert ? ' class="al"' : '') + '>' + esc(l.txt) + '</li>').join('');
  const mood = sv.hp < 30 ? '你醒來時渾身痠痛。' : sv.mor < 30 ? '又是灰濛濛的一天。' : hz ? '你撐過了昨晚。' : '天亮了，又多活了一天。';
  return '<div class="mc-wrap" data-a="morningOk"><div class="mc-card" data-a="noop">' +
    '<div class="mc-h"><span class="mc-sun">☀️</span><div><b>第 ' + M.day + ' 天 · 早上 08:00</b><div class="meta">' + mood + (wx ? ' · ' + wx : '') + '</div></div></div>' +
    (hz ? '<div class="mc-horde">' + (M.watch ? '🧟 昨晚屍潮——你守在門邊' : '🧟 昨晚屍潮——你睡著了，沒有守夜') + '</div>' : '') +
    (chips ? '<div class="mc-chips">' + chips + '</div>' : '') + itemsH +
    (lines ? '<ul class="mc-log">' + lines + '</ul>' : '') +
    '<button class="btn mc-go" data-a="morningOk">開始新的一天</button></div></div>';
}
Object.assign(SACT, { morningOk() { UI.morning = null; render(); } });
// 報告開著時時間不走
const _rtActiveMorning = rtActive;
rtActive = function () { return _rtActiveMorning() && !UI.morning && !UI.sleepFade; };

// 入睡動畫
for (const k of ['sleep', 'watch']) {
  const f = SACT[k]; if (!f) continue;
  SACT[k] = function (v) {
    if (UI.sleepFade || !rtOn() || !S || S.phase !== 'survive' || (S.sv && S.sv.out)) return f(v);
    if (k === 'sleep' && typeof canAct === 'function' && S.sv.hour < 18 && !hordeOn(S.sv.day) && false) return f(v);
    UI.sleepFade = true; UI.rtSel = null;
    const rt = rtState(); rt.workA = 'sleep'; rt.workUntil = performance.now() + 1500; rt.path = []; rt.task = null;
    const g = typeof rtGoalTiles === 'function' && rtGoalTiles(k === 'watch' ? 'DOOR' : 'bed|bedroom');
    if (g && g.tiles && g.tiles.length) rt.pos = { f: g.f, x: g.tiles[0][0] + 0.5, y: g.tiles[0][1] + 0.5 };
    render();
    document.body.insertAdjacentHTML('beforeend', '<div class="sleep-fade"><span>' + (k === 'watch' ? '👀 守夜中…' : '💤') + '</span></div>');
    sfx('sleep');
    setTimeout(() => { UI.sleepFade = false; document.querySelectorAll('.sleep-fade').forEach(e => e.remove()); f(v); }, 1150);
  };
}
const _renderMorning = render;
render = function () {
  _renderMorning();
  if (UI.morning && S && S.phase === 'survive') $app.insertAdjacentHTML('beforeend', morningCard());
  else if (UI.morning && (!S || S.phase !== 'survive')) UI.morning = null;
};
