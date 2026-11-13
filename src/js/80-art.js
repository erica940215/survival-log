/* ================= 插圖（筆記本手繪風 SVG）與音效 ================= */
const INK = '#1d2733', RED = '#b8322a', TAPE = '#ecd27a', PAPER = '#f3f0e6', MUTE = '#8a8f96';
const ln = (x1, y1, x2, y2, w, c) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || INK) + '" stroke-width="' + (w || 1.6) + '" stroke-linecap="round"/>';
const rc = (x, y, w, h, fill, c, sw) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + (fill || 'none') + '" stroke="' + (c || INK) + '" stroke-width="' + (sw || 1.6) + '" stroke-linejoin="round"/>';
const tx = (x, y, s, size, c, anchor) => '<text x="' + x + '" y="' + y + '" font-size="' + (size || 13) + '" fill="' + (c || INK) + '" text-anchor="' + (anchor || 'middle') + '" font-family="LXGW WenKai TC, serif">' + s + '</text>';
function windows(x, y, cols, rows, w, h, gap, broken) {
  let s = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const wx = x + c * (w + gap), wy = y + r * (h + gap);
    s += rc(wx, wy, w, h, (r + c) % 3 === 1 && !broken ? TAPE : 'none', INK, 1.2);
    if (broken && (r + c) % 2 === 0) s += ln(wx + 2, wy + 2, wx + w - 2, wy + h - 2, 1, INK) + ln(wx + w - 3, wy + 3, wx + 4, wy + h - 4, 1, INK);
  }
  return s;
}
function zombie(x, y, s) {
  s = s || 1;
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" stroke="' + MUTE + '" stroke-width="2" stroke-linecap="round" fill="none"><circle cx="0" cy="-26" r="5" fill="' + MUTE + '"/>' +
    '<path d="M0 -21 L1 -6 M1 -6 L-4 6 M1 -6 L6 5 M0 -17 L10 -15 M0 -15 L9 -11"/></g>';
}
function sign(x, y, w, label, fill) { return rc(x, y, w, 20, fill || PAPER, INK, 1.6) + tx(x + w / 2, y + 15, label, 13); }

// 準備期地點、外出地點的場景圖
function sceneSVG(kind) {
  let b = '';
  const g = ln(0, 118, 360, 118, 1.6);
  switch (kind) {
    case 'home':
      b = rc(110, 18, 140, 100) + windows(124, 30, 4, 3, 20, 16, 12) + rc(166, 92, 28, 26, PAPER) + sign(140, 2, 80, '公寓 3F') + ln(70, 118, 70, 88, 1.4) + '<circle cx="70" cy="80" r="10" fill="none" stroke="' + INK + '" stroke-width="1.4"/>';
      break;
    case 'conv':
      b = rc(100, 40, 160, 78) + '<path d="M96 40 L264 40 L256 58 L104 58 Z" fill="' + TAPE + '" stroke="' + INK + '" stroke-width="1.6"/>' + [0, 1, 2, 3, 4, 5, 6].map(i => ln(110 + i * 22, 41, 106 + i * 22, 57, 1.2)).join('') + sign(130, 18, 100, '便利店') + rc(118, 68, 60, 40, 'none', INK, 1.2) + rc(196, 68, 46, 50, PAPER);
      break;
    case 'pharm':
      b = rc(110, 34, 140, 84) + sign(140, 14, 80, '藥局') + '<path d="M172 54 h16 v14 h14 v16 h-14 v14 h-16 v-14 h-14 v-16 h14 z" fill="' + RED + '" opacity="0.85"/>' + rc(128, 80, 26, 38, PAPER);
      break;
    case 'mart':
      b = rc(60, 30, 240, 88) + sign(130, 10, 100, '特價超市', TAPE) + windows(76, 46, 6, 1, 26, 30, 10) + rc(160, 86, 40, 32, PAPER) + '<g stroke="' + INK + '" stroke-width="1.4" fill="none"><path d="M240 96 h6 l6 16 h22 l5 -12 h-30"/><circle cx="258" cy="116" r="2.5"/><circle cx="272" cy="116" r="2.5"/></g>';
      break;
    case 'tool':
      b = rc(100, 36, 160, 82) + sign(140, 16, 80, '工具店') + rc(170, 74, 34, 44, PAPER) + '<g stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"><line x1="120" y1="58" x2="146" y2="84"/><line x1="146" y1="58" x2="120" y2="84"/></g>' + rc(218, 60, 30, 26, TAPE, INK, 1.2);
      break;
    case 'reno':
      b = rc(80, 46, 150, 72) + sign(110, 26, 90, '裝修公司') + windows(96, 62, 4, 1, 22, 22, 12) + ln(270, 118, 270, 20, 2) + ln(270, 20, 330, 20, 2) + ln(320, 20, 320, 56, 1.2) + rc(310, 56, 20, 16, TAPE, INK, 1.2) + ln(270, 30, 250, 20, 1.2);
      break;
    case 'farm':
      b = [70, 160, 250].map(x => '<path d="M' + (x - 8) + ' 60 Q' + (x + 30) + ' 30 ' + (x + 68) + ' 60 Z" fill="' + TAPE + '" stroke="' + INK + '" stroke-width="1.6"/>' + ln(x + 30, 60, x + 30, 118, 1.4) + rc(x, 84, 60, 20, PAPER) + [0, 1, 2, 3].map(i => '<circle cx="' + (x + 10 + i * 13) + '" cy="80" r="5" fill="' + (i % 2 ? RED : '#2f6b3f') + '" opacity="0.8"/>').join('')).join('') + tx(180, 22, '農貿市場', 15);
      break;
    case 'cars':
      b = sign(130, 10, 100, '二手車行') + '<g stroke="' + INK + '" stroke-width="1.8" fill="none"><path d="M110 104 h140 v-20 l-24 -4 l-18 -22 h-56 l-20 26 h-22 z" fill="' + TAPE + '"/><circle cx="142" cy="108" r="10" fill="' + PAPER + '"/><circle cx="222" cy="108" r="10" fill="' + PAPER + '"/></g>' + rc(150, 62, 30, 18, PAPER, INK, 1.2) + tx(300, 70, '$500', 14, RED);
      break;
    case 'smarket':
      b = rc(60, 30, 240, 88) + sign(130, 10, 100, '超市', PAPER) + windows(76, 46, 6, 1, 26, 30, 10, true) + ln(150, 92, 210, 82, 3) + ln(150, 82, 210, 92, 3) + zombie(40, 118, 1) + zombie(320, 118, 0.9);
      break;
    case 'school':
      b = rc(70, 40, 220, 78) + '<path d="M60 40 L180 12 L300 40 Z" fill="none" stroke="' + INK + '" stroke-width="1.6"/><circle cx="180" cy="30" r="8" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="1.4"/>' + windows(86, 54, 7, 2, 20, 16, 10, true) + ln(330, 118, 330, 30, 1.6) + '<path d="M330 30 h20 l-6 6 l6 6 h-20" fill="' + RED + '" opacity="0.7"/>' + zombie(30, 118, 0.9);
      break;
    case 'hardware':
      b = '<path d="M90 118 V50 L150 40 L180 62 L230 36 L270 52 V118" fill="none" stroke="' + INK + '" stroke-width="1.6"/>' + windows(110, 70, 4, 1, 22, 20, 14, true) + ln(140, 118, 200, 96, 3) + ln(160, 118, 230, 104, 3) + tx(180, 24, '五金行（廢墟）', 14) + zombie(310, 118, 1);
      break;
    case 'hospital':
      b = rc(80, 22, 200, 96) + windows(96, 36, 6, 3, 18, 14, 13, true) + '<path d="M168 92 h24 v26 h-24 z" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="1.6"/>' + '<path d="M290 30 h8 v8 h8 v8 h-8 v8 h-8 v-8 h-8 v-8 h8 z" fill="' + RED + '"/>' + zombie(40, 118, 1) + zombie(330, 118, 1);
      break;
    case 'tech':
      b = rc(130, 6, 100, 112) + ln(180, 6, 180, -10, 1.6) + windows(142, 16, 4, 5, 14, 12, 8, true) + rc(166, 98, 28, 20, PAPER) + tx(290, 60, '科技公司', 14) + zombie(60, 118, 1) + zombie(90, 118, 0.85);
      break;
    default: return '';
  }
  return '<div class="scene"><svg viewBox="0 -12 360 134" role="img" aria-label="' + kind + '">' + b + g + '</svg></div>';
}

// 爆發後的家：樓層、房間、大門耐久、陷阱、天氣、今晚屍潮
function houseSVG() {
  const sv = S.sv, st = sv.st, d = sv.day;
  const floors = ['2F', '1F', 'B1'].filter(f => sv.floors.includes(f));
  const fh = 34, top = 116 - fh * floors.filter(f => f !== 'B1').length;
  let s = '';
  // 天氣
  if (inCold(d)) s += [30, 60, 90, 300, 330].map((x, i) => '<circle cx="' + x + '" cy="' + (14 + (i % 2) * 12) + '" r="2.4" fill="' + MUTE + '"/>').join('') + tx(56, 44, '寒潮', 12, MUTE);
  else if (inRain(d)) s += [24, 44, 64, 300, 320, 340].map(x => ln(x, 6, x - 6, 24, 1.4, MUTE)).join('') + tx(46, 44, '陰雨', 12, MUTE);
  else s += '<circle cx="40" cy="22" r="11" fill="' + TAPE + '" stroke="' + INK + '" stroke-width="1.2"/>';
  // 屋頂與太陽能
  s += '<path d="M106 ' + top + ' L180 ' + (top - 22) + ' L254 ' + top + ' Z" fill="none" stroke="' + INK + '" stroke-width="1.6"/>';
  for (let i = 0; i < Math.min(st.solar || 0, 4); i++) s += rc(150 + i * 14, top - 14 + Math.abs(1.5 - i) * 2, 11, 6, '#9fb3c8', INK, 1);
  // 樓層
  floors.forEach((f, i) => {
    const y = f === 'B1' ? 118 : top + i * fh;
    s += rc(110, y, 140, fh, f === 'B1' ? '#e3ddcd' : 'none');
    s += tx(122, y + 20, f === '1F' ? '1F' : f, 10, MUTE, 'start');
    const idx = { '1F': 0, '2F': 1, 'B1': 2 }[f];
    const rooms = sv.rooms.slice(idx * 3, idx * 3 + 3);
    rooms.forEach((r, j) => { s += tx(152 + j * 28, y + 21, ROOMS[r].n.slice(0, 2), 10.5); });
  });
  // 大門（顏色代表耐久）
  const ratio = sv.def / sv.defMax;
  const dc = ratio > 0.7 ? '#2f6b3f' : ratio > 0.35 ? '#a8661a' : RED;
  s += rc(236, 92, 12, 24, dc, INK, 1.4);
  // 陷阱
  sv.traps.slice(0, 6).forEach((t, i) => { const x = 262 + i * 12; s += t.k === 'spike' ? '<path d="M' + x + ' 118 l4 -10 l4 10" fill="none" stroke="' + INK + '" stroke-width="1.4"/>' : rc(x, 108, 9, 10, t.k === 'saw' ? RED : TAPE, INK, 1); });
  // 狗
  if (sv.dog && sv.dog.state === 'pet') s += '<g fill="' + INK + '"><ellipse cx="92" cy="112" rx="9" ry="5"/><circle cx="101" cy="106" r="4"/><rect x="85" y="113" width="2" height="5"/><rect x="96" y="113" width="2" height="5"/></g>';
  // 今晚屍潮
  const hz = hordeOn(d);
  if (hz) { const n = Math.min(6, 1 + Math.floor(hz[1] / 50)); for (let i = 0; i < n; i++) s += zombie(300 + (i % 3) * 18, 118 - Math.floor(i / 3) * 2, 0.8); s += tx(320, 72, '今晚', 12, RED); }
  s += ln(0, 118, 360, 118, 1.6);
  const h = floors.includes('B1') ? 160 : 128;
  return '<div class="scene"><svg viewBox="0 -12 360 ' + h + '" role="img" aria-label="你的據點">' + s + '</svg></div>';
}

/* ---------- 音效（WebAudio 合成，不用外部檔案） ---------- */
let AC = null;
function sfx(type) {
  if (J.sound === false) return;
  try {
    if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    const t0 = AC.currentTime;
    const tone = (f, start, len, wave, vol) => {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = wave || 'sine'; o.frequency.setValueAtTime(f, t0 + start);
      g.gain.setValueAtTime(0.0001, t0 + start); g.gain.exponentialRampToValueAtTime(vol || 0.08, t0 + start + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + start + len);
      o.connect(g).connect(AC.destination); o.start(t0 + start); o.stop(t0 + start + len + 0.02);
    };
    if (type === 'click') tone(660, 0, 0.05, 'triangle', 0.03);
    else if (type === 'buy') { tone(880, 0, 0.08, 'square', 0.04); tone(1320, 0.07, 0.12, 'square', 0.04); }
    else if (type === 'alert') { tone(220, 0, 0.25, 'sawtooth', 0.05); tone(180, 0.2, 0.3, 'sawtooth', 0.05); }
    else if (type === 'ach') [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.08, 0.18, 'triangle', 0.06));
    else if (type === 'sleep') { tone(392, 0, 0.4, 'sine', 0.05); tone(294, 0.25, 0.6, 'sine', 0.05); }
  } catch (e) {}
}
Object.assign(ACT, { sound() { J.sound = J.sound === false; saveJournal(); render(); } });
