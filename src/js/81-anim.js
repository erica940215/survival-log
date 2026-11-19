/* ================= 動畫（移動、出門、換日）與程式合成的背景音樂 ================= */
const reduceMotion = () => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
function animOverlay() {
  const a = UI.anim;
  if (!a || reduceMotion()) return '';
  const el = Date.now() - a.ts, life = a.kind === 'day' ? 2200 : 1500;
  if (el > life) { UI.anim = null; return ''; }
  const delay = 'animation-delay:-' + el + 'ms';
  if (a.kind === 'travel' || a.kind === 'out') {
    const label = a.kind === 'travel' ? (S.car ? '開車' : '走路') + '前往 ' + STORES[a.to].n + ' · ' + a.min + ' 分鐘' : '出門前往 ' + LOCS[a.to].n;
    const from = a.kind === 'travel' ? STORES[a.from].n : '家';
    const to = a.kind === 'travel' ? STORES[a.to].n : LOCS[a.to].n;
    return '<div class="anim travel" style="' + delay + '"><svg viewBox="0 0 300 70" aria-hidden="true">' +
      '<line x1="30" y1="40" x2="270" y2="40" stroke="#1d2733" stroke-width="2" stroke-dasharray="5 6"/>' +
      '<circle cx="30" cy="40" r="6" fill="#1d2733"/><circle cx="270" cy="40" r="6" fill="#b8322a"/>' +
      '<g class="walker" style="' + delay + '"><circle cx="0" cy="26" r="5" fill="#1d2733"/><path d="M0 31 L0 44 M0 44 L-5 54 M0 44 L5 54 M0 35 L-6 41 M0 35 L6 41" stroke="#1d2733" stroke-width="2.2" stroke-linecap="round"/></g>' +
      '<text x="30" y="66" font-size="12" text-anchor="middle" fill="#5f6873">' + esc(from) + '</text><text x="270" y="66" font-size="12" text-anchor="middle" fill="#5f6873">' + esc(to) + '</text></svg>' +
      '<p>' + esc(label) + '</p></div>';
  }
  if (a.kind === 'day') {
    return '<div class="anim day" style="' + delay + '"><div class="hand big">第 ' + a.day + ' 天</div>' + (a.line ? '<p class="hand">' + esc(a.line) + '</p>' : '') + '</div>';
  }
  return '';
}
const _renderWithSave = render;
render = function () { _renderWithSave(); const o = animOverlay(); if (o) $app.insertAdjacentHTML('beforeend', o); };

const _goAnim = ACT.go;
ACT.go = function (dest) {
  const from = S && S.loc, t0 = S && S.t;
  _goAnim(dest);
  if (S && S.phase === 'play' && S.loc === dest && from !== dest) { UI.anim = { kind: 'travel', from, to: dest, min: S.t - t0, ts: Date.now() }; render(); }
};
const _goOutAnim = SACT.goOut;
SACT.goOut = function (loc) {
  _goOutAnim(loc);
  if (S && S.sv && S.sv.out && S.sv.out.loc === loc) { UI.anim = { kind: 'out', to: loc, ts: Date.now() }; render(); }
};
for (const k of ['sleep', 'watch']) {
  const base = SACT[k];
  SACT[k] = function () {
    const d0 = S.sv && S.sv.day;
    base();
    if (S && S.phase === 'survive' && S.sv.day > d0) {
      const last = S.sv.diary && S.sv.diary[S.sv.diary.length - 1];
      UI.anim = { kind: 'day', day: S.sv.day, line: last ? last.t : '', ts: Date.now() };
      render();
    }
  };
}

/* ---------- 背景音樂：準備期緊張的脈動、白天安靜的和聲、屍潮夜低沉的嗡鳴 ---------- */
const MUS = { timer: null, next: 0, bar: 0, master: null };
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
function musicMood() {
  if (!S) return 'calm';
  if (S.phase === 'play') return 'tense';
  if (S.phase === 'survive') return hordeOn(S.sv.day) ? 'dark' : 'calm';
  return 'calm';
}
function note(f, t, len, wave, vol, attack) {
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = wave; o.frequency.setValueAtTime(f, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + (attack || 0.02));
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  o.connect(g).connect(MUS.master); o.start(t); o.stop(t + len + 0.05);
}
const CALM = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];
const PENTA = [69, 72, 74, 76, 79, 81];
function scheduleBar(t, mood) {
  if (mood === 'calm') {
    const ch = CALM[MUS.bar % 4];
    ch.forEach(m => note(hz(m), t, 4.2, 'sine', 0.22, 1.2));
    note(hz(ch[0] - 12), t, 4.2, 'triangle', 0.18, 0.8);
    if (MUS.bar % 2 === 0) note(hz(PENTA[Math.floor(Math.random() * PENTA.length)]), t + 1 + Math.random() * 2, 1.6, 'sine', 0.08, 0.05);
    return 4;
  }
  if (mood === 'tense') {
    for (let i = 0; i < 4; i++) note(hz(33 + (MUS.bar % 4 === 3 && i > 1 ? 1 : 0)), t + i * 0.5, 0.35, 'triangle', 0.35, 0.01);
    for (let i = 0; i < 8; i++) note(2400, t + i * 0.25, 0.04, 'square', i % 2 ? 0.015 : 0.03, 0.002);
    if (MUS.bar % 2 === 0) note(hz(64 + (MUS.bar % 4)), t + 1.5, 0.45, 'sine', 0.06, 0.02);
    return 2;
  }
  // dark
  note(hz(29), t, 4.3, 'sawtooth', 0.12, 1.5);
  note(hz(41), t, 4.3, 'sine', 0.2, 1.5);
  if (MUS.bar % 2 === 1) { note(hz(64), t + 2, 1.8, 'sine', 0.05, 0.4); note(hz(65), t + 2.1, 1.8, 'sine', 0.04, 0.4); }
  return 4;
}
function musicTick() {
  if (J.music !== true || !AC) { musicStop(); return; }
  const now = AC.currentTime;
  if (MUS.next < now) MUS.next = now + 0.05;
  while (MUS.next < now + 0.6) { MUS.next += scheduleBar(MUS.next, musicMood()); MUS.bar++; }
}
function musicStart() {
  try {
    if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    if (!MUS.master) {
      MUS.master = AC.createGain(); MUS.master.gain.value = 0.18;
      const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
      MUS.master.connect(lp).connect(AC.destination);
    }
    if (!MUS.timer) { MUS.next = 0; MUS.timer = setInterval(musicTick, 200); musicTick(); }
  } catch (e) {}
}
function musicStop() { if (MUS.timer) { clearInterval(MUS.timer); MUS.timer = null; } }
const _sfxBase = sfx;
sfx = function (type) { _sfxBase(type); if (J.music === true && !MUS.timer) musicStart(); };
Object.assign(ACT, {
  music() { J.music = J.music !== true; saveJournal(); if (J.music) musicStart(); else musicStop(); render(); }
});
