/* ================= 細節打磨 =================
   窗光隨時間、門的裂痕、作物中期、瞬移煙塵、數字飄出、低數值提醒、
   夜裡窗外黑影、狗的作息、按鈕手感、防誤觸、橫屏第一次說明、存檔小提示。 */

/* ---------- 窗光：白天暖白、傍晚橘、晚上沒有 ---------- */
function winLight(h) {
  if (h < 6 || h >= 19) return null;
  if (h < 8) return 'rgba(255,200,150,0.22)';
  if (h < 16) return 'rgba(255,244,210,0.32)';
  if (h < 18) return 'rgba(255,170,90,0.32)';
  return 'rgba(190,140,220,0.18)';
}
/* ---------- 門的裂痕 ---------- */
function doorCracks(x0, ya, yb, r) {
  const L = (pts, w) => '<polyline points="' + pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ') + '" fill="none" stroke="#1d2733" stroke-width="' + (w || 1) + '" stroke-linecap="round" opacity="0.85" pointer-events="none"/>';
  const m = (ya + yb) / 2;
  let s = L([[x0 - 4, m - 10], [x0 - 9, m - 4], [x0 - 6, m + 2], [x0 - 12, m + 9]], 1.1);
  if (r < 0.35) s += L([[x0 - 3, ya + 6], [x0 - 8, ya + 12], [x0 - 5, ya + 18]], 1) + L([[x0 - 10, yb - 14], [x0 - 14, yb - 8], [x0 - 9, yb - 3]], 1.2) + '<circle cx="' + (x0 - 7) + '" cy="' + (m + 14) + '" r="1.6" fill="#1d2733" opacity="0.8" pointer-events="none"/>';
  return s;
}
/* ---------- 作物中期：長到一半多些葉子；花盆架、溫室成熟掛紅果 ---------- */
function cropStage(k, bx, by, bw, bh, ripe) {
  const sv = S.sv, slot = k === 'lightbox' ? 'light' : k === 'potrack' ? 'pot' : 'green';
  const ps = (sv.plants || []).filter(p => k === 'greenhouse' ? true : p.slot === slot); if (!ps.length) return '';
  const g = Math.max(...ps.map(p => p.age / Math.max(1, growDaysOf(p.k))));
  if (k === 'lightbox' && ripe) return '';
  let s = '';
  const n = k === 'potrack' ? 4 : 6, sc = g >= 1 ? 1.5 : g >= 0.5 ? 1.25 : 0;
  if (!sc) return '';
  for (let i = 0; i < n; i++) {
    const cx = bx + bw * (k === 'potrack' ? (i % 2 ? 0.66 : 0.34) : 0.18 + (i % 3) * 0.32), cy = by + bh * (k === 'potrack' ? (i < 2 ? 0.3 : 0.62) : 0.32 + Math.floor(i / 3) * 0.26);
    s += topSprout(cx, cy, sc, '#3f8a3f');
    if (g >= 1 && k !== 'lightbox') s += '<circle cx="' + (cx + 3) + '" cy="' + (cy - 3) + '" r="2.6" fill="#d6322a" stroke="#1d2733" stroke-width="0.6"/>';
  }
  return '<g pointer-events="none">' + s + '</g>';
}
/* ---------- 瞬移煙塵、物件中心 ---------- */
function puff(a, b) { const rt = rtState(), t0 = performance.now(); rt.puffs = (rt.puffs || []).concat([{ x: a.x, y: a.y, f: a.f, t0, out: true }, { x: b.x, y: b.y, f: b.f, t0 }]); }
function objCenter(where) {
  if (!where || where === 'DOOR') return where === 'DOOR' ? { x: 0, y: ISO_DOOR.at + 0.5 } : null;
  const sv = S.sv, id = String(where).split('|').map(k => isoObjects().find(o => o.id === k || o.k === k)).find(Boolean);
  const p = id && sv.place[id.id]; if (!p) return null;
  const D = ISO[id.k], w = p.r ? D.d : D.w, d = p.r ? D.w : D.d; return { x: p.x + w / 2, y: p.y + d / 2 };
}
/* ---------- 數字飄出 ---------- */
function statSnap() { const sv = S.sv; return { 飽腹: sv.sat, 水分: sv.hyd, 生命: sv.hp, 心態: sv.mor, 精力: sv.sta, 衛生: sv.hyg == null ? 0 : sv.hyg, 電: sv.power, 防線: sv.def }; }
function floatStats(a, pos) {
  const b = statSnap(), E = evState(), t0 = performance.now(); let i = 0;
  for (const k of Object.keys(a)) {
    const d = b[k] - a[k]; if (Math.abs(d) < 0.5 || (k === '精力' && Math.abs(d) < 3)) continue;
    E.fx = (E.fx || []).concat([{ x: pos.x + 0.55, y: pos.y - 0.32 * (i++) - 0.1, txt: k + ' ' + (d > 0 ? '+' : '') + (Math.abs(d) < 10 && d % 1 ? d.toFixed(1) : Math.round(d)), col: d > 0 ? '#8fd6a3' : '#ff9a8c', t0: t0 + i * 90 }]);
    if (i >= 3) break;
  }
}
/* ---------- 疊在生活層上：煙塵、低血量泛紅、夜裡窗外黑影 ---------- */
const _lifeLayerP = lifeLayer;
lifeLayer = function (now) {
  now = now || performance.now();
  let s = _lifeLayerP(now);
  const sv = S.sv, rt = rtState(), f = (UI.iso && UI.iso.floor) || '1F', P = isoProj(f), Z = sceneSize(f);
  rt.puffs = (rt.puffs || []).filter(p => now - p.t0 < 520);
  for (const p of rt.puffs) {
    if (p.f !== f) continue;
    const k = (now - p.t0) / 520, q = P(p.x, p.y, 0);
    for (let i = 0; i < 5; i++) { const a = i * 1.26 + (p.out ? 0.4 : 0); s += '<circle cx="' + (q[0] + Math.cos(a) * 14 * k).toFixed(1) + '" cy="' + (q[1] - 6 + Math.sin(a) * 6 * k).toFixed(1) + '" r="' + (5 + 5 * k).toFixed(1) + '" fill="#e8e0d0" opacity="' + (0.55 * (1 - k)).toFixed(2) + '" pointer-events="none"/>'; }
  }
  // 夜裡窗外偶爾有黑影走過
  if ((sv.hour >= 19 || sv.hour < 5) && f !== 'B1') {
    const ws = ISO_WIN[f].y0, cyc = 11000, ph = (now % cyc) / cyc, wi = Math.floor(now / cyc) % Math.max(1, ws.length);
    if (ws.length && ph < 0.45) {
      const x = ws[wi], a = P(x + 0.18, 0), b = P(x + 0.82, 0), top = a[1] - TWALL + 12, h = TWALL - 34, k = ph / 0.45;
      const sx = a[0] - 14 + (b[0] - a[0] + 28) * k;
      s += '<clipPath id="wclip"><rect x="' + a[0] + '" y="' + top + '" width="' + (b[0] - a[0]) + '" height="' + h + '"/></clipPath><g clip-path="url(#wclip)" pointer-events="none" opacity="0.55"><circle cx="' + sx.toFixed(1) + '" cy="' + (top + 10 + Math.sin(now / 160) * 1.2).toFixed(1) + '" r="6" fill="#0b0d10"/><rect x="' + (sx - 7).toFixed(1) + '" y="' + (top + 15) + '" width="14" height="' + h + '" rx="5" fill="#0b0d10"/><path d="M' + (sx + 5).toFixed(1) + ' ' + (top + 20) + ' l10 -3" stroke="#0b0d10" stroke-width="4" stroke-linecap="round"/></g>';
    }
  }
  // 生命很低：畫面四周泛紅脈動
  if (sv.hp < 30) { const pulse = 0.25 + Math.sin(now / 280) * 0.12 + (30 - sv.hp) / 100; s += '<defs><radialGradient id="hp-vig" cx="50%" cy="50%" r="72%"><stop offset="55%" stop-color="#8a0f0f" stop-opacity="0"/><stop offset="100%" stop-color="#8a0f0f" stop-opacity="' + pulse.toFixed(2) + '"/></radialGradient></defs><rect x="0" y="0" width="' + Z.w + '" height="' + Z.h + '" fill="url(#hp-vig)" pointer-events="none"/>'; }
  return s;
};
/* ---------- 狗的作息：晚上睡床邊，白天偶爾自己晃 ---------- */
function dogTarget(d, rt, now) {
  const sv = S.sv, night = sv.hour >= 22 || sv.hour < 6 || (rt.workA === 'sleep' && rt.workUntil > now);
  d.sleep = false;
  if (night) {
    const b = objCenter('bed|bedroom');
    if (b) { d.sleep = true; return { x: Math.max(0.6, b.x - 1.4), y: Math.min(ISO_FLOORS[rt.pos.f].h - 0.5, b.y + 0.9) }; }
  }
  const idle = !(rt.path && rt.path.length) && !rt.task;
  if (idle && (!d.wanderUntil || now > d.wanderUntil + 9000) && Math.random() < 0.004) {
    const ok = [...rtWalkable(rt.pos.f)]; const t = ok[Math.floor(Math.random() * ok.length)];
    if (t) { const [x, y] = t.split(',').map(Number); d.wander = { x: x + 0.5, y: y + 0.5 }; d.wanderUntil = now + 5000; }
  }
  if (idle && d.wander && now < d.wanderUntil) return d.wander;
  d.wander = null;
  return { x: rt.pos.x + 0.7, y: rt.pos.y + 0.35 };
}
/* ---------- 按鈕手感：Android 輕震 ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('button, [data-a]');
  if (b && navigator.vibrate && UIS.vib !== false) try { navigator.vibrate(8); } catch (er) {}
}, true);
/* ---------- 存檔小提示 ---------- */
let SAVE_FLASH = 0, SAVE_DAY = null;
const _persistP = persistRun;
persistRun = function () {
  _persistP();
  if (!S || S.phase !== 'survive' || !S.sv) return;
  const now = Date.now();
  if (S.sv.day !== SAVE_DAY || now - SAVE_FLASH > 60000) {
    const first = SAVE_DAY === null; SAVE_DAY = S.sv.day; SAVE_FLASH = now; if (first) return;
    let el = document.getElementById('save-dot');
    if (!el) { el = document.createElement('div'); el.id = 'save-dot'; el.textContent = '💾 已存檔'; document.body.appendChild(el); }
    el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
  }
};
/* ---------- 橫屏第一次：說明 ---------- */
Object.assign(SACT, { lsCoachOk() { UIS.lsCoach = true; saveUI(); render(); } });
const _renderCoach = render;
render = function () {
  _renderCoach();
  if (document.body.classList.contains('ls') && !UIS.lsCoach && !UI.morning && !UI.lsMenu) {
    $app.insertAdjacentHTML('beforeend', '<div class="ls-coach" data-a="lsCoachOk">' +
      '<div class="cc cc-l"><b>狀態</b>生命、飽腹、水分…<br>低於 20 會閃紅</div>' +
      '<div class="cc cc-c"><b>房間</b>點家具跳出選項<br>長按家具可以搬家<br>點地板走過去</div>' +
      '<div class="cc cc-r"><b>常用動作</b>吃、喝、外出、睡覺<br><b>☰ 選單</b>據點、倉庫、日誌、設定<br>（打開時時間暫停）</div>' +
      '<button class="btn cc-ok" data-a="lsCoachOk">知道了</button></div>');
  }
};
