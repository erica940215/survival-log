/* ================= 即時外出：走進建築，一間一間翻 =================
   外出時畫面變成那個地點的平面圖：上下各三個房間，中間走廊，左邊是出口。
   點房間 → 角色走過去 → 進度條搜 1 小時（真正結算用 SACT.search）。
   走廊有殭屍晃來晃去，靠太近會被發現（暴露值 +12），點牠可以打。
   天黑後只剩手電筒照得到的範圍。點出口回家。 */
const OT = { W: 9, H: 8, T: 40, ML: 26, MT: 12 };
const OT_ROOMS = [[0, 0], [3, 0], [6, 0], [0, 5], [3, 5], [6, 5]];
const OT_CONT_ART = ['shelf', 'storage', 'freezer', 'bench', 'shelf', 'storage'];
function otArtFor(n, idx) {
  if (/冷藏|冰|飲料/.test(n)) return 'freezer';
  if (/倉|儲|器材|油料/.test(n)) return 'storage';
  if (/櫃台|辦公|工作|研發|護理|掛號|實驗|教室/.test(n)) return 'bench';
  if (/機房|頂樓/.test(n)) return 'battery';
  if (/病房|保健/.test(n)) return 'bed';
  if (/建材|後院/.test(n)) return 'workshop';
  return OT_CONT_ART[idx] || 'shelf';
}
const OT_FLOOR = { smarket: ['#efe3c8', '#e6d6b4'], school: ['#dfe9d6', '#d2dfc6'], hardware: ['#e3d6c4', '#d6c6ae'], hospital: ['#e4eef3', '#d5e3ea'], tech: ['#dfe2e8', '#d0d4dc'] };
const otOn = () => rtOn() && S && S.phase === 'survive' && S.sv && S.sv.out && UI.tab === 'act';
const otP = (x, y) => [OT.ML + x * OT.T, OT.MT + y * OT.T];

function otState() {
  const o = S.sv.out;
  if (!o.rt) {
    o.rt = { pos: { x: 0.5, y: 3.5 }, path: [], task: null, frac: 0, z: [], zid: 0, fx: [], seen: {} };
    const n = 1 + Math.floor(o.exp / 35) + (S.sv.hour >= 18 ? 1 : 0) + (LOCS[o.loc].lv >= 2 ? 1 : 0);
    for (let i = 0; i < Math.min(4, n); i++) otAddZ(o.rt);
  }
  return o.rt;
}
function otAddZ(rt) { rt.z.push({ id: ++rt.zid, x: 3 + rnd() * 5.5, y: 3.2 + rnd() * 0.6, dir: rnd() < 0.5 ? -1 : 1, hp: 2, st: 'walk', sp: 0.25 + rnd() * 0.25 }); }
// 每個搜刮點在哪
function otSpot(c, idx) {
  if (idx < 6) { const [rx, ry] = OT_ROOMS[idx]; return { x: rx + 1.5, y: ry + (ry === 0 ? 1.2 : 1.8), door: { x: rx + 1.5, y: ry === 0 ? 3 : 5 } }; }
  return { x: 8.2, y: idx === 6 ? 3.3 : 4.7, door: { x: 7.6, y: idx === 6 ? 3.4 : 4.6 } };
}
function otPathTo(dest) {
  const rt = otState(), p = rt.pos, pts = [];
  const corrY = Math.max(3.3, Math.min(4.7, p.y));
  if (p.y < 3 || p.y > 5) pts.push({ x: Math.floor(p.x / 3) * 3 + 1.5, y: p.y < 3 ? 2.6 : 5.4 }, { x: Math.floor(p.x / 3) * 3 + 1.5, y: 4 });
  else pts.push({ x: p.x, y: corrY });
  if (dest.door) { pts.push({ x: dest.door.x, y: 4 }); pts.push({ x: dest.x, y: dest.y }); }
  else pts.push({ x: dest.x, y: dest.y });
  return pts;
}

/* ---------- 指令 ---------- */
Object.assign(SACT, {
  otGo(i) {
    const sv = S.sv, o = sv.out; if (!o || o.enc) return;
    const idx = o.conts.findIndex(c => String(c.i) === String(i)); if (idx < 0) return;
    if (sv.locs[o.loc].done.includes(String(i))) { slog('這裡已經搜過了。'); render(); return; }
    const rt = otState(), sp = otSpot(o.conts[idx], idx);
    rt.task = { i: String(i), n: o.conts[idx].n, p: 0 }; rt.path = otPathTo(sp);
    render();
  },
  otExit() {
    const o = S.sv.out; if (!o || (o.enc && o.enc.t === 'z')) return;
    const rt = otState(); rt.task = { i: 'EXIT', n: '回家', p: 0 }; rt.path = otPathTo({ x: 0.3, y: 3.6 });
    render();
  },
  otCancel() { const rt = otState(); rt.task = null; rt.path = []; render(); }
});
function otFinish() {
  const rt = otState(), t = rt.task; rt.task = null; rt.path = [];
  if (!t) return;
  if (t.i === 'EXIT') { SACT.goHome(); return; }
  sfx('pop');
  const sv = S.sv, before = Object.assign({}, sv.out.bag);
  SACT.search(t.i);
  const o = S.sv.out;
  if (o) {
    const got = Object.entries(o.bag).filter(([k, q]) => q > (before[k] || 0)).map(([k, q]) => (k === 'bp' ? '圖紙' : ITEMS[k].n) + '+' + (q - (before[k] || 0)));
    const sp = otSpot(null, o.conts.findIndex(c => String(c.i) === t.i));
    o.rt.fx.push({ x: sp.x, y: sp.y, txt: got.length ? got.slice(0, 2).join(' ') : '空空的', col: got.length ? '#ecd27a' : '#9aa7b4', t0: performance.now() });
    if (o.enc && o.enc.t === 'z') { for (let k = 0; k < o.enc.n; k++) o.rt.z.push({ id: ++o.rt.zid, x: Math.min(8.5, rt.pos.x + 0.8 + k * 0.4), y: Math.min(7.5, rt.pos.y + 0.3), dir: -1, hp: 2, st: 'chase', sp: 0.5, enc: true }); }
  }
}

/* ---------- 每一格 ---------- */
let OT_LAST = 0;
function otTick(now) {
  requestAnimationFrame(otTick);
  const dt = OT_LAST ? Math.min(0.25, (now - OT_LAST) / 1000) : 0; OT_LAST = now;
  if (!otOn()) return;
  const sv = S.sv, o = sv.out, rt = otState(), sp = RT_SPEEDS[UIS.speed] || 0;
  if (!o.enc && rt.z.some(z => z.enc)) rt.z = rt.z.filter(z => !z.enc);
  if (!sp || o.enc) { otPaint(now); return; }
  let full = false;
  // 走路
  if (rt.path.length) {
    let step = dt * 2.4 * Math.min(sp, 3);
    while (step > 0 && rt.path.length) {
      const n = rt.path[0], dx = n.x - rt.pos.x, dy = n.y - rt.pos.y, d = Math.hypot(dx, dy);
      if (d <= step) { rt.pos.x = n.x; rt.pos.y = n.y; rt.path.shift(); step -= d; } else { rt.pos.x += dx / d * step; rt.pos.y += dy / d * step; step = 0; }
    }
    if (!rt.path.length && rt.task && rt.task.i === 'EXIT') { otFinish(); render(); return; }
  }
  const gh = dt * RT_MIN_PER_SEC * sp / 60;
  if (rt.task && !rt.path.length) {
    rt.task.p += gh;
    if (rt.task.p >= 1) { otFinish(); full = true; }
  } else {
    rt.frac += gh;
    if (rt.frac >= 1) {
      rt.frac -= 1;
      if (sv.hour + LOCS[o.loc].trip >= LAST_HOUR) { slog('天快亮不起來了——再不走就回不了家！你只好往回走。', true); SACT.otExit(); }
      else { passHours(1); full = true; }
    }
  }
  // 殭屍
  const night = sv.hour >= 18;
  for (const z of rt.z) {
    if (z.st === 'dead') continue;
    const dx = rt.pos.x - z.x, dy = rt.pos.y - z.y, d = Math.hypot(dx, dy);
    const sense = night ? 2.2 : 1.5;
    if (d < sense || z.st === 'chase') { z.st = 'chase'; if (d > 0.45) { z.x += dx / d * z.sp * 1.4 * dt * Math.min(sp, 3); z.y += dy / d * z.sp * 1.4 * dt * Math.min(sp, 3); } }
    else { z.x += z.dir * z.sp * dt * Math.min(sp, 3); if (z.x < 2 || z.x > 8.6) z.dir *= -1; }
    if (d < 0.7 && (!rt.seen[z.id] || now - rt.seen[z.id] > 6000)) {
      rt.seen[z.id] = now; o.exp += 12; sfx('groan');
      rt.fx.push({ x: rt.pos.x, y: rt.pos.y, txt: '被發現！暴露 +12', col: '#ff7b6e', t0: now });
      slog('殭屍發現你了，暴露值 +12。', true);
      if (o.exp >= 100) { ambush(); render(); return; }
      full = true;
    }
  }
  rt.fx = rt.fx.filter(f => now - f.t0 < 1400);
  if (full) { render(); return; }
  otPaint(now);
}
requestAnimationFrame(otTick);

/* ---------- 畫面 ---------- */
function otStatic() {
  const sv = S.sv, o = sv.out, Lst = sv.locs[o.loc], fl = OT_FLOOR[o.loc] || OT_FLOOR.smarket;
  const Wp = OT.ML * 2 + OT.W * OT.T, Hp = OT.MT * 2 + OT.H * OT.T;
  let s = '<rect x="0" y="0" width="' + Wp + '" height="' + Hp + '" fill="#2a2f36"/>';
  // 地板
  for (let y = 0; y < OT.H; y++) for (let x = 0; x < OT.W; x++) { const a = otP(x, y), corr = y >= 3 && y < 5; s += '<rect x="' + a[0] + '" y="' + a[1] + '" width="' + OT.T + '" height="' + OT.T + '" fill="' + (corr ? ((x + y) % 2 ? '#cfc8bb' : '#d8d1c4') : fl[(x + y) % 2]) + '" stroke="rgba(0,0,0,0.06)"/>'; }
  // 出口
  const ex = otP(0, 3);
  s += '<g data-a="otExit" style="cursor:pointer"><rect x="' + (ex[0] - 22) + '" y="' + ex[1] + '" width="24" height="' + OT.T * 2 + '" fill="#2f6b3f" stroke="#1d2733" stroke-width="1.2"/><text x="' + (ex[0] - 10) + '" y="' + (ex[1] + OT.T) + '" fill="#f3f0e6" font-size="10" font-weight="700" text-anchor="middle" writing-mode="tb">出口</text></g>';
  // 房間
  o.conts.forEach((c, idx) => {
    const done = Lst.done.includes(String(c.i)), sp = otSpot(c, idx);
    if (idx < 6) {
      const [rx, ry] = OT_ROOMS[idx], a = otP(rx, ry), b = otP(rx + 3, ry + 3), d1 = otP(rx + 1, ry === 0 ? 3 : 5), d2 = otP(rx + 2, ry === 0 ? 3 : 5);
      s += '<g data-a="otGo" data-v="' + c.i + '" style="cursor:pointer">';
      s += '<rect x="' + a[0] + '" y="' + a[1] + '" width="' + (b[0] - a[0]) + '" height="' + (b[1] - a[1]) + '" fill="transparent"/>';
      // 牆（門口留空）
      const wy = ry === 0 ? b[1] : a[1];
      s += '<path d="M' + a[0] + ' ' + a[1] + ' H' + b[0] + ' V' + b[1] + ' H' + a[0] + ' Z" fill="none" stroke="#3a3f45" stroke-width="5"/>';
      s += '<line x1="' + (d1[0] + 4) + '" y1="' + wy + '" x2="' + (d2[0] - 4) + '" y2="' + wy + '" stroke="' + fl[0] + '" stroke-width="7"/>';
      const cw = OT.T * 1.6, ch = OT.T * 0.75, cx = otP(sp.x, sp.y)[0] - cw / 2, cy = otP(sp.x, sp.y)[1] - ch / 2;
      const art = topArt(otArtFor(c.n, idx), cx, cy, cw, ch);
      s += '<g opacity="' + (done ? 0.4 : 1) + '">' + (art || '') + '</g>';
      s += '<text x="' + (a[0] + b[0]) / 2 + '" y="' + (ry === 0 ? a[1] + 16 : b[1] - 8) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#3a3028" font-family="Noto Sans TC, sans-serif">' + esc(c.n) + (done ? '（空）' : '') + '</text>';
      if (c.i === 'lock' || c.i === 'truck') s += '<text x="' + (a[0] + b[0]) / 2 + '" y="' + (a[1] + b[1]) / 2 + '" font-size="18" text-anchor="middle">' + (c.i === 'lock' ? '🔒' : '🚚') + '</text>';
      s += '</g>';
    } else {
      const q = otP(sp.x, sp.y);
      s += '<g data-a="otGo" data-v="' + c.i + '" style="cursor:pointer"><rect x="' + (q[0] - 20) + '" y="' + (q[1] - 16) + '" width="40" height="32" rx="5" fill="' + (done ? '#8a8f96' : c.i === 'lock' ? '#a8661a' : '#5d6b7a') + '" stroke="#1d2733"/><text x="' + q[0] + '" y="' + (q[1] + 5) + '" font-size="14" text-anchor="middle">' + (c.i === 'lock' ? '🔒' : '🚚') + '</text></g>';
    }
  });
  return { s, Wp, Hp };
}
function otDyn(now) {
  const sv = S.sv, o = sv.out, rt = otState();
  now = now || performance.now();
  let s = '';
  // 殭屍
  for (const z of rt.z) {
    const q = otP(z.x, z.y), dead = z.st === 'dead';
    if (dead && now - z.deadAt > 900) continue;
    const flash = z.hurtAt && now - z.hurtAt < 140, bob = Math.sin(now / 200 + z.id) * 1.2;
    s += '<g transform="translate(' + q[0].toFixed(1) + ' ' + (q[1] + bob).toFixed(1) + ')' + (dead ? ' rotate(80)' : '') + '" opacity="' + (dead ? Math.max(0, 1 - (now - z.deadAt) / 900).toFixed(2) : 1) + '">' +
      '<ellipse cy="2" rx="8" ry="3" fill="rgba(0,0,0,0.25)"/><rect x="-5.5" y="-15" width="11" height="14" rx="4" fill="' + (flash ? '#fff' : '#5e7258') + '" stroke="#1d2733"/><path d="M' + (z.dir > 0 ? '4 -12 l8 -1' : '-4 -12 l-8 -1') + '" stroke="#7d8f73" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cy="-19" r="5.5" fill="' + (flash ? '#fff' : '#8fa37f') + '" stroke="#1d2733"/><circle cx="-2" cy="-19.5" r="1.2" fill="#d6322a"/><circle cx="2" cy="-19.5" r="1.2" fill="#d6322a"/>' +
      (z.st === 'chase' && !dead ? '<text y="-30" text-anchor="middle" font-size="11" font-weight="800" fill="#ff5a3a" stroke="#1d2733" stroke-width="2" paint-order="stroke">!</text>' : '') +
      '<circle cy="-12" r="14" fill="transparent" data-oz="' + z.id + '" style="cursor:crosshair"/></g>';
  }
  // 角色
  const q = otP(rt.pos.x, rt.pos.y), walking = rt.path.length > 0;
  s += '<g transform="translate(' + q[0].toFixed(1) + ' ' + q[1].toFixed(1) + ')" pointer-events="none"><ellipse cy="2" rx="8" ry="3" fill="rgba(0,0,0,0.25)"/>' +
    '<g transform="translate(0 ' + (walking ? Math.abs(Math.sin(now / 120)) * -2 : 0).toFixed(1) + ')"><rect x="-5" y="-16" width="10" height="13" rx="3" fill="#3b5b8a" stroke="#1d2733"/><rect x="-4.5" y="-14" width="9" height="8" rx="2" fill="#8a6a46" opacity="0.8"/><circle cy="-21" r="5.5" fill="#f1d3b3" stroke="#1d2733"/><path d="M-5.5 -23 q5.5 -6 11 0" fill="#2b2b2b"/></g></g>';
  // 進度條
  if (rt.task && !walking && rt.task.i !== 'EXIT') s += '<g transform="translate(' + q[0].toFixed(1) + ' ' + (q[1] - 36).toFixed(1) + ')" pointer-events="none"><rect x="-21" y="-4" width="42" height="8" rx="3" fill="#1d2733"/><rect x="-20" y="-3" width="' + (Math.min(1, rt.task.p) * 40).toFixed(1) + '" height="6" rx="2" fill="#ecd27a"/><text y="-8" text-anchor="middle" font-size="10" font-weight="700" fill="#f3f0e6" stroke="#1d2733" stroke-width="2.4" paint-order="stroke">翻找中…</text></g>';
  // 天黑：手電筒
  if (sv.hour >= 18 || LOCS[o.loc].lv >= 3) {
    const Wp = OT.ML * 2 + OT.W * OT.T, Hp = OT.MT * 2 + OT.H * OT.T;
    s += '<defs><radialGradient id="ot-torch" gradientUnits="userSpaceOnUse" cx="' + q[0].toFixed(1) + '" cy="' + (q[1] - 10).toFixed(1) + '" r="' + (sv.hour >= 18 ? 95 : 140) + '"><stop offset="0.45" stop-color="#05070a" stop-opacity="0"/><stop offset="1" stop-color="#05070a" stop-opacity="' + (sv.hour >= 18 ? 0.88 : 0.55) + '"/></radialGradient></defs><rect x="0" y="0" width="' + Wp + '" height="' + Hp + '" fill="url(#ot-torch)" pointer-events="none"/>';
  }
  for (const f of rt.fx) {
    const k = (now - f.t0) / 1400, p = otP(f.x, f.y);
    s += '<text x="' + p[0].toFixed(1) + '" y="' + (p[1] - 30 - k * 20).toFixed(1) + '" text-anchor="middle" font-size="11.5" font-weight="800" fill="' + f.col + '" stroke="#1d2733" stroke-width="2.4" paint-order="stroke" opacity="' + (1 - k).toFixed(2) + '" pointer-events="none">' + esc(f.txt) + '</text>';
  }
  return s;
}
function otPaint(now) {
  const g = document.getElementById('ot-layer'); if (g) g.innerHTML = otDyn(now);
  const rt = S.sv.out && S.sv.out.rt, c = document.getElementById('rt-clock');
  if (c && rt) { const h = S.sv.hour + (rt.task && !rt.path.length ? rt.task.p : rt.frac); c.textContent = String(Math.floor(h) % 24).padStart(2, '0') + ':' + String(Math.floor((h % 1) * 60)).padStart(2, '0'); }
}
function otScene() {
  const sv = S.sv, o = sv.out, st = otStatic();
  const speeds = '<div class="rt-sp">' + ['暫停', '▶', '▶▶', '▶▶▶'].map((t, i) => '<button class="' + (UIS.speed === i ? 'on' : '') + '" data-a="rtSpeed" data-v="' + i + '">' + t + '</button>').join('') + '</div>';
  const hud = '<div class="rt-c"><div class="rt-day">DAY ' + sv.day + '</div><div id="rt-clock" class="rt-time">' + String(sv.hour).padStart(2, '0') + ':00</div><div class="rt-wx">' + LOCS[o.loc].n + '</div></div>';
  const exp = '<div class="rt-q"><div class="rt-qh">暴露值</div><div class="bar' + (o.exp >= 70 ? ' full' : '') + '" style="width:120px"><i style="width:' + Math.min(100, o.exp) + '%"></i></div><div>' + Math.round(o.exp) + '% · 背包 ' + kg(outWeight()) + '/' + bagCap() + 'kg</div></div>';
  const bar = (n, v, col) => '<div class="rt-st"><span>' + n + '</span><div class="bar' + (v <= 20 ? ' full' : '') + '"><i style="width:' + clamp(v) + '%;background:' + col + '"></i></div><b class="num">' + Math.round(v) + '</b></div>';
  const stats = '<div class="rt-stats">' + bar('生命', sv.hp, '#6fc48a') + bar('精力', sv.sta, '#e6c84f') + bar('飽腹', sv.sat, '#e0a85a') + bar('水分', sv.hyd, '#6fb3e0') + '</div>';
  return '<div class="rt-wrap ot"><div class="iso top"><svg viewBox="0 0 ' + st.Wp + ' ' + st.Hp + '" role="img" aria-label="' + LOCS[o.loc].n + '">' + st.s + '<g id="ot-layer">' + otDyn() + '</g></svg></div>' + exp + hud + speeds + '</div>' + stats;
}
// 打殭屍
document.addEventListener('pointerdown', e => {
  const t = e.target.closest && e.target.closest('[data-oz]'); if (!t || !S || !S.sv || !S.sv.out) return;
  e.preventDefault(); e.stopPropagation();
  const sv = S.sv, rt = otState(), z = rt.z.find(q => q.id === Number(t.getAttribute('data-oz')) && q.st !== 'dead'); if (!z) return;
  const now = performance.now();
  if (Math.hypot(z.x - rt.pos.x, z.y - rt.pos.y) > 1.6) { rt.fx.push({ x: z.x, y: z.y, txt: '太遠了', col: '#9aa7b4', t0: now }); return; }
  if (sv.sta < 3) { rt.fx.push({ x: z.x, y: z.y, txt: '沒力氣', col: '#9aa7b4', t0: now }); return; }
  sv.sta -= 3; z.hp -= (typeof weapon === 'function' && weapon()) || S.char === 'veteran' ? 2 : 1; z.hurtAt = now; sfx('hit');
  if (typeof weapon === 'function' && weapon() && typeof wearWeapon === 'function') { try { wearWeapon(); } catch (er) {} }
  if (z.hp <= 0) { z.st = 'dead'; z.deadAt = now; sv.kills = (sv.kills || 0) + 1; rt.fx.push({ x: z.x, y: z.y, txt: '擊倒！', col: '#ffd36a', t0: now }); sv.out.exp += 3; }
  else { rt.fx.push({ x: z.x, y: z.y, txt: '-1', col: '#ff8a6a', t0: now }); }
  otPaint(now);
}, true);

// 外出畫面：即時地圖取代原本的插圖和清單
const _viewOutOT = viewOut;
viewOut = function () {
  let h = _viewOutOT();
  if (!rtOn() || !S.sv.out) return h;
  const i = h.indexOf('<div class="scene">'), j = h.indexOf('</svg></div>', i);
  if (i >= 0 && j > i) h = h.slice(0, i) + h.slice(j + 12);
  h = h.replace(/data-a="search"/g, 'data-a="otGo"');
  const rt = otState();
  const task = rt.task ? '<div class="rt-task"><div><b>' + esc(rt.task.n) + '</b><span>' + (rt.path.length ? '（走過去中）' : rt.task.i === 'EXIT' ? '' : '（翻找中）') + '</span></div><button class="btn ghost" data-a="otCancel">取消</button></div>' : '<p class="meta" style="margin:8px 0">點房間，角色會走過去翻找（每處 1 小時）。走廊上的殭屍靠太近會發現你，可以點牠打（要走近一點）。點左邊綠色出口回家。</p>';
  return otScene() + task + h;
};
// 外出時也不顯示上方狀態列
const _renderOT = render;
render = function () { _renderOT(); const hd = document.querySelector('.status'); if (hd && otOn()) hd.style.display = 'none'; };

// 標題頁：舊版（文字版）入口
const _viewTitleClassic = viewTitle;
viewTitle = function () {
  return _viewTitleClassic().replace(/<\/main>\s*$/, '') + '<p class="meta" style="text-align:center;margin:14px 0 24px"><a href="classic.html" style="color:inherit">切換到舊版（文字版）</a> · 兩版共用存檔</p>' + (/<\/main>\s*$/.test(_viewTitleClassic()) ? '</main>' : '');
};
