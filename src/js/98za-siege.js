/* ================= 看得到的屍潮（即時模式） =================
   屍潮夜 21:00 起，殭屍從大門外和窗外湧上來撞門。
   點殭屍可以隔著門窗打（耗精力）、丟燃燒瓶、去門口加固。
   打倒越多，當晚真正結算的屍潮傷害越低（最多 -60%）。結束後自動守夜睡覺。 */
const SIEGE_HOUR = 21, SIEGE_LEN = 1.5; // 遊戲小時

/* ---------- 額外音效 ---------- */
const _sfxBaseSg = sfx;
sfx = function (type) {
  if (!['hit', 'bash', 'fire', 'knock', 'squeak', 'groan', 'pop', 'fix', 'eat'].includes(type)) return _sfxBaseSg(type);
  if (J.sound === false) return;
  try {
    if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    const t0 = AC.currentTime;
    const tone = (f, st, len, wave, vol, f2) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = wave || 'sine'; o.frequency.setValueAtTime(f, t0 + st); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + st + len); g.gain.setValueAtTime(0.0001, t0 + st); g.gain.exponentialRampToValueAtTime(vol || 0.08, t0 + st + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + st + len); o.connect(g).connect(AC.destination); o.start(t0 + st); o.stop(t0 + st + len + 0.02); };
    const noise = (st, len, vol, hp) => { const n = Math.floor(AC.sampleRate * len), buf = AC.createBuffer(1, n, AC.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n); const src = AC.createBufferSource(), g = AC.createGain(), fl = AC.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = hp || 900; src.buffer = buf; g.gain.value = vol || 0.12; src.connect(fl).connect(g).connect(AC.destination); src.start(t0 + st); };
    if (type === 'hit') { noise(0, 0.12, 0.2, 1800); tone(140, 0, 0.12, 'square', 0.05, 70); }
    else if (type === 'bash') { noise(0, 0.18, 0.18, 380); tone(70, 0, 0.18, 'sine', 0.12, 45); }
    else if (type === 'fire') { noise(0, 0.6, 0.18, 2400); tone(300, 0, 0.3, 'sawtooth', 0.04, 90); }
    else if (type === 'knock') { [0, 0.18, 0.36].forEach(s => { noise(s, 0.06, 0.25, 600); tone(180, s, 0.06, 'sine', 0.08); }); }
    else if (type === 'squeak') { tone(2400, 0, 0.06, 'square', 0.03, 3200); tone(2600, 0.1, 0.05, 'square', 0.03, 3400); }
    else if (type === 'groan') tone(110, 0, 0.7, 'sawtooth', 0.035, 80);
    else if (type === 'pop') tone(520, 0, 0.09, 'triangle', 0.06, 900);
    else if (type === 'fix') { noise(0, 0.05, 0.15, 3000); noise(0.15, 0.05, 0.15, 3000); }
    else if (type === 'eat') { noise(0, 0.05, 0.08, 1200); noise(0.12, 0.05, 0.08, 1200); }
  } catch (e) {}
};

/* ---------- 屍潮狀態 ---------- */
function siegeOf() { const sv = S && S.sv; return sv && sv.siege && sv.siege.d === sv.day ? sv.siege : null; }
const siegeMulNow = sg => sg && sg.n ? 1 - 0.6 * sg.kills / sg.n : 1;
// 真正結算時，打倒的殭屍會降低傷害
const _hordeMulSiege = hordeMul;
hordeMul = function () { const sg = siegeOf(); return _hordeMulSiege() * (sg && sg.done ? siegeMulNow(sg) : 1); };

function siegeStart() {
  const sv = S.sv, hz = hordeOn(sv.day), rt = rtState();
  const n = Math.max(5, Math.min(16, Math.round(hz[1] / 6)));
  sv.siege = { d: sv.day, p: 0, n, kills: 0, spawned: 0, z: [], fx: [], id: 0, done: false };
  if (UIS.speed > 1) { UIS.speed = 1; saveUI(); }
  rt.queue = rt.queue.filter(q => q.a === 'reinforce');
  if (rt.task && rt.task.a !== 'reinforce') rt.task = null;
  UI.iso = Object.assign(UI.iso || {}, { floor: '1F' });
  UI.rtSel = null; UI.rtOut = false;
  if (rt.pos.f === '1F' && !rt.task) { const g = rtGoalTiles('DOOR'); rt.path = rtPath('1F', rt.pos, g.tiles); }
  slog('外面傳來此起彼落的嘶吼——' + HTYPES[hordeType(sv.day)].n + '來了！點殭屍可以隔著門窗打，撐到牠們退去。', true);
  sfx('groan');
  render();
}
function siegeSpawn(sg) {
  const win = ISO_WIN['1F'], door = ISO_DOOR.at;
  const spots = [];
  for (let i = 0; i < 3; i++) spots.push({ kind: 'door', tx: -0.55 - (i % 2) * 0.35, ty: door + 0.25 + i * 0.25 });
  for (const x of win.y0) spots.push({ kind: 'win', tx: x + 0.5, ty: -0.35 });
  for (const y of win.x0) spots.push({ kind: 'win', tx: -0.55, ty: y + 0.5 });
  const s = spots[sg.spawned % spots.length], fast = hordeType(S.sv.day) === 'fast', heavy = hordeType(S.sv.day) === 'heavy';
  const z = { id: ++sg.id, kind: s.kind, tx: s.tx + (rnd() - 0.5) * 0.2, ty: s.ty + (rnd() - 0.5) * 0.15, hp: heavy ? 3 : 2, st: 'walk', t: 0, sp: fast ? 1.4 : 0.6 };
  if (s.kind === 'door') { z.x = -1.6; z.y = z.ty + (rnd() - 0.5); } else { z.x = z.tx; z.y = z.ty; z.st = 'rise'; }
  sg.z.push(z); sg.spawned++;
}
function siegeEnd() {
  const sg = siegeOf(); if (!sg || sg.done) return;
  sg.done = true;
  const rt = rtState(); rt.task = null; rt.queue = []; rt.path = [];
  slog('剩下的殭屍慢慢散去。你打倒了 ' + sg.kills + '/' + sg.n + ' 隻' + (sg.kills ? '，屍潮傷害 -' + Math.round(60 * sg.kills / sg.n) + '%' : '') + '。你靠在門邊守到天亮。', true);
  SACT.watch();
}

/* ---------- 每一格 ---------- */
let SG_LAST = 0, SG_GROAN = 0;
function siegeTick(now) {
  requestAnimationFrame(siegeTick);
  const dt = SG_LAST ? Math.min(0.25, (now - SG_LAST) / 1000) : 0; SG_LAST = now;
  if (!rtActive() || document.querySelector('.anim.day')) return;
  const sv = S.sv, sp = RT_SPEEDS[UIS.speed] || 0;
  if (!sp) return;
  let sg = siegeOf();
  if (!sg) { if (hordeOn(sv.day) && sv.hour >= SIEGE_HOUR && sv.hour < LAST_HOUR) siegeStart(); return; }
  if (sg.done) return;
  const gdt = dt * sp;
  sg.p += gdt * RT_MIN_PER_SEC / 60 / SIEGE_LEN;
  // 前 60% 時間陸續出現
  while (sg.spawned < sg.n && sg.spawned < Math.ceil(sg.n * Math.min(1, sg.p / 0.6 + 0.08))) siegeSpawn(sg);
  for (const z of sg.z) {
    z.t += gdt;
    if (z.st === 'walk') { const dx = z.tx - z.x, dy = z.ty - z.y, d = Math.hypot(dx, dy), st = z.sp * gdt; if (d <= st) { z.x = z.tx; z.y = z.ty; z.st = 'bash'; z.t = 0; } else { z.x += dx / d * st; z.y += dy / d * st; } }
    else if (z.st === 'rise' && z.t > 0.8) { z.st = 'bash'; z.t = 0; }
    else if (z.st === 'bash' && z.t > 1.1 + (z.id % 3) * 0.25) { z.t = 0; z.hitAt = now; if (z.kind === 'door') { sg.bash = now; sfx('bash'); } }
  }
  sg.z = sg.z.filter(z => z.st !== 'dead' || now - z.deadAt < 900);
  sg.fx = sg.fx.filter(f => now - f.t0 < 900);
  if (now - SG_GROAN > 4000 && sg.z.some(z => z.st !== 'dead')) { SG_GROAN = now; sfx('groan'); }
  const alive = sg.z.filter(z => z.st !== 'dead').length;
  if (sg.p >= 1 || (sg.spawned >= sg.n && !alive)) { siegeEnd(); return; }
  siegePaint(now);
}
requestAnimationFrame(siegeTick);

/* ---------- 畫面 ---------- */
function zombieSVG(z, P, now) {
  const q = P(z.x, z.y, 0);
  const dead = z.st === 'dead', rise = z.st === 'rise';
  const shake = z.st === 'bash' && z.hitAt && now - z.hitAt < 160 ? (z.kind === 'door' ? -3 : 0) : 0;
  const op = dead ? Math.max(0, 1 - (now - z.deadAt) / 900) : rise ? Math.min(1, z.t / 0.8) : 1;
  const bob = Math.sin(now / 180 + z.id) * 1.2;
  const flash = z.hurtAt && now - z.hurtAt < 140;
  return '<g transform="translate(' + (q[0] + shake).toFixed(1) + ' ' + (q[1] + bob).toFixed(1) + ')' + (dead && !hasSpr('zombie_dead') ? ' rotate(80)' : '') + '" opacity="' + op.toFixed(2) + '">' + (dead && hasSpr('zombie_dead') ? sprImg('zombie_dead', 26) : '') +
    '<ellipse cx="0" cy="2" rx="9" ry="3.5" fill="rgba(0,0,0,0.25)"/>' +
    (hasSpr('zombie_walk') ? (dead ? '' : sprImg(z.st === 'bash' ? 'zombie_bash' : 'zombie_walk', 54, z.kind === 'door' && z.st === 'walk', flash ? ' style="filter:brightness(2.2)"' : '')) :
    '<rect x="-6" y="-16" width="12" height="15" rx="4" fill="' + (flash ? '#fff' : '#5e7258') + '" stroke="#1d2733" stroke-width="1"/>' +
    '<path d="M-5 -13 l 9 -2 M5 -10 l 8 -1" stroke="#7d8f73" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="0" cy="-21" r="6" fill="' + (flash ? '#fff' : '#8fa37f') + '" stroke="#1d2733" stroke-width="1"/>' +
    '<circle cx="-2.2" cy="-21.5" r="1.3" fill="#d6322a"/><circle cx="2.2" cy="-21.5" r="1.3" fill="#d6322a"/>' +
    '<path d="M-2.5 -18 h5" stroke="#3a2a2a" stroke-width="1"/>') +
    '<rect x="-8" y="' + (hasSpr('zombie_walk') ? -60 : -29) + '" width="16" height="3" rx="1.5" fill="#1d2733" opacity="' + (dead ? 0 : 0.85) + '"/><rect x="-7.5" y="' + (hasSpr('zombie_walk') ? -59.5 : -28.5) + '" width="' + (15 * z.hp / (hordeType(S.sv.day) === 'heavy' ? 3 : 2)).toFixed(1) + '" height="2" rx="1" fill="#d6322a" opacity="' + (dead ? 0 : 1) + '"/>' +
    '<circle cx="0" cy="' + (hasSpr('zombie_walk') ? -26 : -14) + '" r="' + (hasSpr('zombie_walk') ? 24 : 15) + '" fill="transparent" data-z="' + z.id + '" style="cursor:crosshair"/></g>';
}
function siegeLayer(now) {
  const sg = siegeOf(); if (!sg || sg.done) return '';
  const f = (UI.iso && UI.iso.floor) || '1F'; if (f !== '1F') return '';
  const P = isoProj('1F'), Z = sceneSize('1F');
  now = now || performance.now();
  let s = '<rect x="0" y="0" width="' + Z.w + '" height="' + Z.h + '" fill="url(#sg-vig)" pointer-events="none"/>';
  // 門被撞
  if (sg.bash && now - sg.bash < 200) { const a = P(0, ISO_DOOR.at), b = P(0, ISO_DOOR.at + 1); s += '<rect x="' + (a[0] - 18) + '" y="' + a[1] + '" width="20" height="' + (b[1] - a[1]) + '" fill="#ff5a3a" opacity="0.35" pointer-events="none"/>'; }
  for (const z of [...sg.z].sort((a, b) => a.y - b.y)) s += zombieSVG(z, P, now);
  for (const fx of sg.fx) {
    const k = (now - fx.t0) / 900;
    if (fx.kind === 'fire') s += '<g pointer-events="none" opacity="' + (1 - k).toFixed(2) + '"><circle cx="' + fx.x + '" cy="' + fx.y + '" r="' + (12 + k * 30).toFixed(1) + '" fill="#f59a3a" opacity="0.55"/><circle cx="' + fx.x + '" cy="' + fx.y + '" r="' + (6 + k * 16).toFixed(1) + '" fill="#ffd36a"/></g>';
    else s += '<text x="' + fx.x + '" y="' + (fx.y - k * 18).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="800" fill="' + (fx.col || '#ffd36a') + '" stroke="#1d2733" stroke-width="2.4" paint-order="stroke" opacity="' + (1 - k).toFixed(2) + '" pointer-events="none">' + fx.txt + '</text>';
  }
  return s;
}
function siegePaint(now) {
  const g = document.getElementById('sg-layer'); if (!g) return;
  g.innerHTML = siegeLayer(now);
  const sg = siegeOf(), bar = document.getElementById('sg-p');
  if (bar && sg) bar.style.width = Math.round(Math.min(1, sg.p) * 100) + '%';
  const k = document.getElementById('sg-k'); if (k && sg) k.textContent = sg.kills + '/' + sg.n;
}

/* ---------- 互動 ---------- */
function siegeHit(id) {
  const sg = siegeOf(); if (!sg || sg.done) return;
  const sv = S.sv, z = sg.z.find(q => q.id === id && q.st !== 'dead'); if (!z) return;
  const now = performance.now();
  if (sg.cd && now - sg.cd < 350) return;
  if (sv.sta < 2) { siegeFx(z, '沒力氣', '#9aa7b4'); return; }
  sg.cd = now; sv.sta = Math.max(0, sv.sta - 2);
  z.hp -= S.char === 'veteran' ? 2 : 1; z.hurtAt = now; sfx('hit');
  if (z.hp <= 0) { z.st = 'dead'; z.deadAt = now; sg.kills++; siegeFx(z, '擊倒！', '#ffd36a'); if (sv.dog && sv.dog.state === 'pet') sv.dog.xp = (sv.dog.xp || 0) + 0.2; }
  else siegeFx(z, '-1', '#ff8a6a');
  siegePaint(now);
}
function siegeFx(z, txt, col) { const sg = siegeOf(), q = isoProj('1F')(z.x, z.y, 0); sg.fx.push({ x: q[0], y: q[1] - 34, txt, col, t0: performance.now() }); }
Object.assign(SACT, {
  sgMolo() {
    const sg = siegeOf(), sv = S.sv; if (!sg || sg.done || !(sv.st.molotov > 0)) return;
    sv.st.molotov--; if (!sv.st.molotov) delete sv.st.molotov;
    const now = performance.now(), live = sg.z.filter(z => z.st !== 'dead').sort((a, b) => (a.kind === 'door' ? 0 : 1) - (b.kind === 'door' ? 0 : 1)).slice(0, 3);
    const P = isoProj('1F'), c = P(-0.7, ISO_DOOR.at + 0.5, 0);
    sg.fx.push({ kind: 'fire', x: c[0], y: c[1] - 8, t0: now });
    for (const z of live) { z.st = 'dead'; z.deadAt = now; sg.kills++; }
    sfx('fire'); slog('你從門縫丟出燃燒瓶，燒倒 ' + live.length + ' 隻。');
    render();
  },
  sgSkip() { siegeEnd(); }
});
// 點殭屍：用 pointerdown，殭屍每格都在動
document.addEventListener('pointerdown', e => {
  const t = e.target.closest && e.target.closest('[data-z]');
  if (!t) return;
  e.preventDefault(); e.stopPropagation();
  siegeHit(Number(t.getAttribute('data-z')));
}, true);

// 掛進場景與面板
const _rtSceneSiege = rtScene;
rtScene = function () {
  let h = _rtSceneSiege();
  const sg = siegeOf();
  if (sg && !sg.done) {
    h = h.replace('<svg viewBox=', '<svg class="sg-on" viewBox=');
    h = h.replace(/(<svg class="sg-on"[^>]*>)/, '$1<defs><radialGradient id="sg-vig" cx="50%" cy="50%" r="70%"><stop offset="60%" stop-color="#7a0f0f" stop-opacity="0"/><stop offset="100%" stop-color="#7a0f0f" stop-opacity="0.45"/></radialGradient></defs>');
    h = h.replace('</svg></div>', '<g id="sg-layer">' + siegeLayer() + '</g></svg></div>');
  }
  return h;
};
const _rtPanelSiege = rtPanel;
rtPanel = function () {
  const sg = siegeOf(), sv = S.sv;
  if (!sg || sg.done) {
    const hz = hordeOn(sv.day);
    const note = hz && sv.hour < SIEGE_HOUR ? '<div class="sg-warn">今晚 ' + SIEGE_HOUR + ':00 ' + HTYPES[hordeType(sv.day)].n + '會來。醒著的話可以在門口跟牠們打；先睡的話就直接結算（沒守夜）。</div>' : '';
    return note + _rtPanelSiege();
  }
  return '<div class="sg-box"><div class="sg-h"><b>屍潮來襲</b><span>打倒 <b id="sg-k">' + sg.kills + '/' + sg.n + '</b>（每隻 -' + Math.round(60 / sg.n) + '% 傷害）</span></div>' +
    '<div class="bar"><i id="sg-p" style="width:' + Math.round(sg.p * 100) + '%"></i></div>' +
    '<p class="meta">點畫面上的殭屍隔著門窗打（每下 2 精力，精力 ' + Math.round(sv.sta) + '）。點大門可以加固。</p>' +
    '<div class="row-btns"><button class="btn red" data-a="sgMolo"' + (sv.st.molotov > 0 ? '' : ' disabled') + '>丟燃燒瓶（' + (sv.st.molotov || 0) + '）</button><button class="btn ghost" data-a="sgSkip">直接守到天亮</button></div></div>' + _rtPanelSiege();
};
