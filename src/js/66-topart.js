/* ================= 俯視美術：每樣東西從上往下看的樣子 =================
   topArt(k, x, y, W, H) 畫在物件頂面（x,y 左上，W×H）；
   topFront(k, x, y, W, H) 畫在物件正面（看得到的那一面）。 */
const TA = {
  r: (x, y, w, h, f, rx, ex) => '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + Math.max(0, w).toFixed(1) + '" height="' + Math.max(0, h).toFixed(1) + '"' + (rx ? ' rx="' + rx + '"' : '') + ' fill="' + f + '"' + (ex || ' stroke="#1d2733" stroke-width="0.8"') + '/>',
  c: (x, y, r, f, ex) => '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + f + '"' + (ex || ' stroke="#1d2733" stroke-width="0.8"') + '/>',
  e: (x, y, rx, ry, f, ex) => '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + rx.toFixed(1) + '" ry="' + ry.toFixed(1) + '" fill="' + f + '"' + (ex || ' stroke="#1d2733" stroke-width="0.8"') + '/>',
  l: (x1, y1, x2, y2, s, w) => '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="' + (s || '#1d2733') + '" stroke-width="' + (w || 1) + '" stroke-linecap="round"/>',
  p: (d, f, ex) => '<path d="' + d + '" fill="' + (f || 'none') + '"' + (ex || ' stroke="#1d2733" stroke-width="0.8"') + '/>'
};
function topSprout(x, y, s, col) {
  return TA.p('M' + x + ' ' + y + ' q -' + 3 * s + ' -' + 3 * s + ' -' + 5 * s + ' -' + 1 * s + ' M' + x + ' ' + y + ' q ' + 3 * s + ' -' + 3 * s + ' ' + 5 * s + ' -' + 1 * s, 'none', ' stroke="' + (col || '#3f8a3f') + '" stroke-width="' + (1.6 * s) + '" stroke-linecap="round"') + TA.c(x, y, 1.2 * s, col || '#4e9d4e', ' stroke="none"');
}
function topArt(k, x, y, W, H, rot) {
  const { r, c, e, l, p } = TA, cx = x + W / 2, cy = y + H / 2, m = Math.min(W, H);
  let s = '';
  switch (k) {
    case 'bed': case 'bedroom': {
      const blank = k === 'bed' ? '#5c7fa8' : '#c46d7e', blank2 = k === 'bed' ? '#4a6a90' : '#a95668';
      s += r(x, y, W, H, '#8a6a46', 4);
      s += r(x + 3, y + 3, W - 6, H - 6, '#f4efe4', 3);
      const pw = Math.min(W, H) * 0.42;
      if (W >= H) {
        s += r(x + 6, y + 6, pw, H - 12, '#ffffff', 5);
        if (k === 'bedroom') s += l(x + 6 + pw / 2 - 0.5, y + 8, x + 6 + pw / 2 - 0.5, y + H - 8, '#ddd', 1);
        s += r(x + W * 0.36, y + 3, W * 0.64 - 3, H - 6, blank, 3);
        s += r(x + W * 0.36, y + 3, 7, H - 6, '#e8e2d4', 2);
        s += l(x + W * 0.55, y + 6, x + W * 0.62, y + H - 6, blank2, 1.4) + l(x + W * 0.78, y + 6, x + W * 0.72, y + H - 6, blank2, 1.4);
      } else {
        s += r(x + 6, y + 6, W - 12, pw, '#ffffff', 5);
        s += r(x + 3, y + H * 0.36, W - 6, H * 0.64 - 3, blank, 3);
      }
      break;
    }
    case 'toilet':
      s += r(x + W * 0.22, y + 2, W * 0.56, H * 0.28, '#f6f8fa', 3);
      s += r(x + W * 0.44, y + 4, W * 0.12, 3, '#9aa7b4', 1);
      s += e(cx, y + H * 0.64, W * 0.3, H * 0.32, '#f6f8fa');
      s += e(cx, y + H * 0.66, W * 0.18, H * 0.2, '#bfe0ee');
      break;
    case 'bench': case 'workshop':
      s += r(x, y, W, H, k === 'bench' ? '#b48a5c' : '#6e5c4a', 2);
      for (let i = 1; i < 4; i++) s += l(x + 2, y + H * i / 4, x + W - 2, y + H * i / 4, k === 'bench' ? '#946c42' : '#5a4a3a', 0.8);
      if (k === 'workshop') for (let i = 0; i < 9; i++) for (let j = 0; j < 3; j++) s += c(x + 6 + i * (W - 12) / 8, y + 5 + j * (H - 10) / 2, 0.8, '#3a3028', ' stroke="none"');
      // 鐵鎚
      s += r(x + W * 0.12, y + H * 0.3, W * 0.2, 3.5, '#7a5a3a', 1) + r(x + W * 0.1, y + H * 0.2, 5, H * 0.3, '#5d6b7a', 1);
      // 鋸子
      s += p('M' + (x + W * 0.42) + ' ' + (y + H * 0.7) + ' l ' + W * 0.22 + ' -' + H * 0.4 + ' l 4 3 l -' + (W * 0.2) + ' ' + H * 0.42 + 'z', '#c8cdd2');
      s += r(x + W * 0.4, y + H * 0.62, 7, 5, '#b8322a', 1.5);
      // 扳手、螺絲
      s += l(x + W * 0.74, y + H * 0.25, x + W * 0.9, y + H * 0.7, '#8a96a3', 3) + c(x + W * 0.74, y + H * 0.25, 3, '#8a96a3');
      s += c(x + W * 0.66, y + H * 0.78, 1.2, '#444', ' stroke="none"') + c(x + W * 0.7, y + H * 0.82, 1.2, '#444', ' stroke="none"');
      break;
    case 'freezer':
      s += r(x, y, W, H, '#eef5fa', 4);
      s += r(x + 4, y + 4, W - 8, H - 8, '#dcebf4', 3);
      s += r(cx - W * 0.22, y + H - 9, W * 0.44, 3.5, '#8aa2b4', 1.5);
      s += l(x + 8, y + 9, x + 14, y + 15, '#ffffff', 1.4) + l(x + 14, y + 9, x + 8, y + 15, '#ffffff', 1.4) + l(x + 11, y + 8, x + 11, y + 16, '#ffffff', 1.4);
      break;
    case 'microwave':
      s += r(x, y, W, H, '#cfd3d6', 3);
      for (let i = 0; i < 5; i++) s += l(x + W * 0.6 + i * 3, y + 5, x + W * 0.6 + i * 3, y + H - 5, '#9aa0a6', 1);
      s += r(x + 5, y + 5, W * 0.45, H - 10, '#b9bec2', 2);
      break;
    case 'gen':
      s += r(x, y, W, H, '#e08a4a', 4);
      s += r(x + 4, y + 4, W * 0.55, H - 8, '#3b3f45', 3);
      s += c(x + 4 + W * 0.275, cy, m * 0.26, '#565c64') + c(x + 4 + W * 0.275, cy, m * 0.1, '#2a2d31');
      s += c(x + W * 0.78, y + H * 0.3, 4, '#2a2d31') + r(x + W * 0.7, y + H * 0.58, W * 0.2, 5, '#c8cdd2', 2);
      s += r(x + W * 0.66, y + 2, 4, H * 0.3, '#5d6b7a', 1);
      break;
    case 'battery': case 'powerroom':
      s += r(x, y, W, H, k === 'battery' ? '#5f7f99' : '#4d5862', 3);
      s += r(x + W * 0.2, y + H * 0.2, W * 0.6, H * 0.6, '#2c3a46', 2);
      if (k === 'battery') { for (let i = 0; i < 4; i++) s += r(x + W * 0.26 + i * W * 0.13, y + H * 0.3, W * 0.1, H * 0.4, i < 3 ? '#6fd18a' : '#3c4c58', 1, ' stroke="none"'); }
      else for (let i = 0; i < 4; i++) s += r(x + W * 0.26 + i * W * 0.13, y + H * 0.32, W * 0.08, H * 0.36, i % 2 ? '#ecd27a' : '#e8edf2', 1, ' stroke="none"');
      break;
    case 'ac':
      s += r(x, y, W, H, '#f2f5f8', 6);
      s += c(cx, cy, m * 0.34, '#dfe5ea');
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.4; s += l(cx, cy, cx + Math.cos(a) * m * 0.3, cy + Math.sin(a) * m * 0.3, '#9aa7b4', 2.4); }
      s += c(cx, cy, 2.4, '#5d6b7a');
      break;
    case 'heater':
      s += r(x, y, W, H, '#7d3a2e', 4);
      s += r(x + 5, y + 5, W - 10, H - 10, '#3a1c16', 3);
      for (let i = 0; i < 4; i++) s += l(x + 8, y + 8 + i * (H - 16) / 3, x + W - 8, y + 8 + i * (H - 16) / 3, '#f08a3a', 1.8);
      break;
    case 'lightbox': case 'greenhouse': {
      s += r(x, y, W, H, k === 'lightbox' ? '#6b5a48' : '#cfeedd', 3);
      if (k === 'greenhouse') { s += r(x + 3, y + 3, W - 6, H - 6, '#e9f8ef', 2); s += l(cx, y + 2, cx, y + H - 2, '#9cc9ae', 1); }
      s += r(x + 4, y + 5, W - 8, H - 10, '#5a3e2a', 2);
      const n = Math.max(2, Math.round(W / 14));
      for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) s += topSprout(x + 8 + i * (W - 16) / (n - 1), y + H * (0.42 + j * 0.3), 1, '#4e9d4e');
      if (k === 'lightbox') s += r(x + 2, y + 1, W - 4, 3, '#c98cf0', 1.5, ' stroke="none" opacity="0.9"');
      break;
    }
    case 'potrack':
      s += r(x, y, W, H, '#a37d55', 2);
      for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const px = x + W * (0.28 + i * 0.44), py = y + H * (0.3 + j * 0.42); s += c(px, py, m * 0.17, '#c46a3a') + c(px, py, m * 0.12, '#5a3e2a', ' stroke="none"') + topSprout(px, py + 2, 0.8); }
      break;
    case 'pedal':
      s += e(cx, cy, W * 0.14, H * 0.42, '#2a2d31');
      s += r(cx - 3, y + H * 0.25, 6, H * 0.5, '#5d6b7a', 2);
      s += e(cx, y + H * 0.66, W * 0.13, H * 0.09, '#222');
      s += l(x + W * 0.22, y + H * 0.2, x + W * 0.78, y + H * 0.2, '#3a3f45', 3);
      s += r(x + W * 0.28, y + H * 0.8, W * 0.44, 4, '#ecd27a', 2);
      break;
    case 'juicer':
      s += r(x + 3, y + 3, W - 6, H - 6, '#f6c650', 6);
      s += c(cx, cy, m * 0.3, '#fff3c4') + c(cx, cy, m * 0.12, '#f2a33a');
      break;
    case 'brewer':
      s += c(x + W * 0.38, y + H * 0.42, m * 0.3, '#9c7350') + c(x + W * 0.38, y + H * 0.42, m * 0.22, 'none', ' stroke="#5a3e2a" stroke-width="1.6"');
      s += c(x + W * 0.38, y + H * 0.42, m * 0.06, '#5a3e2a');
      s += p('M' + (x + W * 0.62) + ' ' + (y + H * 0.42) + ' q ' + W * 0.2 + ' 0 ' + W * 0.2 + ' ' + H * 0.3, 'none', ' stroke="#c7783a" stroke-width="3" stroke-linecap="round"');
      s += r(x + W * 0.68, y + H * 0.72, W * 0.22, H * 0.18, '#7aa7c7', 2);
      break;
    case 'refinery':
      s += r(x, y, W, H, '#5b5f68', 3);
      s += c(x + W * 0.25, cy, m * 0.32, '#8a919c') + c(x + W * 0.25, cy, m * 0.16, '#3b3f45');
      s += c(x + W * 0.62, cy, m * 0.26, '#8a919c') + c(x + W * 0.62, cy, m * 0.1, '#3b3f45');
      s += l(x + W * 0.25 + m * 0.32, cy - 3, x + W * 0.62 - m * 0.26, cy - 3, '#c7783a', 3);
      s += r(x + W * 0.84, y + 4, 6, H - 8, '#e0b13a', 2);
      break;
    case 'radar':
      s += r(x + 4, y + 4, W - 8, H - 8, '#3e6455', 3);
      s += c(cx, cy, m * 0.36, '#d8e2dc');
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; s += l(cx, cy, cx + Math.cos(a) * m * 0.34, cy + Math.sin(a) * m * 0.34, '#9fb4a8', 0.8); }
      s += c(cx, cy, 3, '#4f7d6a') + c(cx + m * 0.18, cy - m * 0.12, 1.8, '#ff6b5a', ' stroke="none"');
      break;
    case 'bot_farm': case 'bot_fix': case 'bot_cook': {
      const col = { bot_farm: '#9fc3e0', bot_fix: '#e0b39f', bot_cook: '#e0d59f' }[k];
      s += c(cx, cy, m * 0.4, col) + c(cx, cy, m * 0.28, '#f3f0e6');
      s += r(cx - m * 0.2, cy - m * 0.08, m * 0.4, m * 0.14, '#1d2733', 3);
      s += c(cx - m * 0.08, cy - 0.5, 1.6, '#6ff0ff', ' stroke="none"') + c(cx + m * 0.08, cy - 0.5, 1.6, '#6ff0ff', ' stroke="none"');
      break;
    }
    case 'shelf': case 'storage': {
      s += r(x, y, W, H, k === 'shelf' ? '#b89a6a' : '#8f7350', 2);
      const n = k === 'shelf' ? 2 : 4;
      const box = ['#c9a36a', '#7aa7c7', '#d36b5a', '#8fbf6a', '#e0c25a'];
      for (let i = 0; i < n; i++) {
        const bx = x + 4 + i * (W - 8) / n, bw = (W - 8) / n - 3;
        s += r(bx, y + 4, bw, H * 0.42, box[i % 5], 1.5);
        s += r(bx + 1, y + H * 0.52, bw - 2, H * 0.36, box[(i + 2) % 5], 1.5);
        s += l(bx + 2, y + 4 + H * 0.21, bx + bw - 2, y + 4 + H * 0.21, 'rgba(0,0,0,0.25)', 1);
      }
      break;
    }
    default:
      return null;
  }
  return s;
}
// 正面細節
function topFront(k, x, y, W, H) {
  if (H < 6) return '';
  const { r, l, c } = TA;
  switch (k) {
    case 'microwave': return r(x + 4, y + 2, W * 0.6, H - 4, '#2f3a44', 1.5) + c(x + W * 0.82, y + H / 2, 1.8, '#46d16a', ' stroke="none"');
    case 'freezer': return l(x + 4, y + 3, x + W - 4, y + 3, '#a9bccb', 1);
    case 'battery': return r(x + W / 2 - 5, y + 2, 10, Math.max(2, H - 4), '#2c3a46', 1.5);
    case 'storage': case 'shelf': return l(x + W / 2, y + 1, x + W / 2, y + H - 1, 'rgba(0,0,0,0.35)', 1) + c(x + W / 2 - 3, y + H / 2, 1.3, '#ecd27a', ' stroke="none"') + c(x + W / 2 + 3, y + H / 2, 1.3, '#ecd27a', ' stroke="none"');
    case 'gen': return r(x + 4, y + 2, W * 0.3, H - 4, '#3b3f45', 1);
    case 'heater': return r(x + 5, y + 2, W - 10, H - 4, '#f08a3a', 1.5, ' stroke="none" opacity="0.7"');
    default: return '';
  }
}

/* ---------- 自訂角色／殭屍圖（assets/top/，經 tools/sprites.js 內嵌成 SPR） ---------- */
const hasSpr = k => typeof SPR === 'object' && !!SPR[k];
// 腳底在 (0,0)，往上長 h；flip=往右看（原圖面向左）
function sprImg(k, h, flip, ex) {
  const w = k.endsWith('_dead') ? h * 1.6 : h;
  return '<image href="' + SPR[k] + '" x="' + (-w / 2).toFixed(1) + '" y="' + (-h).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" preserveAspectRatio="xMidYMax meet"' + (flip ? ' transform="scale(-1 1)"' : '') + (ex || '') + '/>';
}
