/* ================= 俯視視角：由上往下看的房間（預設） ================= */
const camTop = () => UIS.cam !== 'iso';
const TOPW = 56, TD = 46, TZ = 0.72, TWALL = 74, TML = 64, TMT = 16;
function topProj(f) { const ox = TML, oy = TMT + TWALL; return (x, y, z) => [ox + x * TOPW, oy + y * TD - (z || 0) * TZ]; }
function sceneSize(f) {
  const F = ISO_FLOORS[f];
  if (camTop()) return { w: TML * 2 + F.w * TOPW, h: TMT + TWALL + F.h * TD + 30 };
  return { w: (F.w + F.h) * IW + 40, h: WALL + 18 + (F.w + F.h) * IH + 26 };
}
function topSVG() {
  const sv = S.sv, objs = isoSync();
  const I = UI.iso = UI.iso || {};
  if (!I.floor || !sv.floors.includes(I.floor)) I.floor = '1F';
  const f = I.floor, F = ISO_FLOORS[f], P = topProj(f), Z = sceneSize(f);
  const dark = f === 'B1';
  const x0 = P(0, 0)[0], x1 = P(F.w, 0)[0], y0 = P(0, 0)[1], y1 = P(0, F.h)[1];
  let s = '';
  // 牆：後牆、左右側牆（往外斜一點，做出深度）
  const wallC = dark ? '#575b62' : '#e7dcc4', wallSide = dark ? '#4a4e55' : '#d8cbb0', trim = dark ? '#3a3e44' : '#8a6a46';
  s += '<polygon points="' + [[x0, y0], [x1, y0], [x1, y0 - TWALL], [x0, y0 - TWALL]].map(p => p.join(',')).join(' ') + '" fill="' + wallC + '" stroke="' + INK + '" stroke-width="1.2"/>';
  s += '<rect x="' + x0 + '" y="' + (y0 - 16) + '" width="' + (x1 - x0) + '" height="16" fill="' + trim + '" opacity="0.55"/>';
  s += '<polygon points="' + [[x0, y0], [x0 - 18, y0 - 10], [x0 - 18, y1 + 6], [x0, y1]].map(p => p.join(',')).join(' ') + '" fill="' + wallSide + '" stroke="' + INK + '" stroke-width="1.2"/>';
  s += '<polygon points="' + [[x1, y0], [x1 + 18, y0 - 10], [x1 + 18, y1 + 6], [x1, y1]].map(p => p.join(',')).join(' ') + '" fill="' + wallSide + '" stroke="' + INK + '" stroke-width="1.2"/>';
  // 窗（後牆、左牆）與門（左牆）
  for (const x of ISO_WIN[f].y0) { const a = P(x + 0.18, 0), b = P(x + 0.82, 0); s += '<rect x="' + a[0] + '" y="' + (y0 - TWALL + 12) + '" width="' + (b[0] - a[0]) + '" height="' + (TWALL - 34) + '" fill="#bcd6ea" stroke="' + INK + '" stroke-width="1.2"/><line x1="' + (a[0] + b[0]) / 2 + '" y1="' + (y0 - TWALL + 12) + '" x2="' + (a[0] + b[0]) / 2 + '" y2="' + (y0 - 22) + '" stroke="' + INK + '" stroke-width="1"/>'; }
  for (const y of ISO_WIN[f].x0) { const a = P(0, y + 0.2), b = P(0, y + 0.8); s += '<polygon points="' + [[x0 - 3, a[1] - 4], [x0 - 15, a[1] - 11], [x0 - 15, b[1] - 8], [x0 - 3, b[1]]].map(p => p.join(',')).join(' ') + '" fill="#bcd6ea" stroke="' + INK + '" stroke-width="1"/>'; }
  if (f === ISO_DOOR.f) { const a = P(0, ISO_DOOR.at + 0.1), b = P(0, ISO_DOOR.at + 0.9); const ratio = sv.def / sv.defMax; s += '<polygon data-a="rtObj" data-v="DOOR" style="cursor:pointer" points="' + [[x0 - 1, a[1]], [x0 - 16, a[1] - 9], [x0 - 16, b[1] - 6], [x0 - 1, b[1]]].map(p => p.join(',')).join(' ') + '" fill="' + (ratio > 0.7 ? '#2f6b3f' : ratio > 0.35 ? '#a8661a' : RED) + '" stroke="' + INK + '" stroke-width="1.2"/>'; }
  // 地板
  const occ = occupied(f, I.moving ? I.sel : null);
  for (let y = 0; y < F.h; y++) for (let x = 0; x < F.w; x++) {
    const a = P(x, y), fill = dark ? ((x + y) % 2 ? '#3d4249' : '#43484f') : ((x + y) % 2 ? '#e9dcc0' : '#f1e6cd');
    s += '<rect data-a="isoTile" data-v="' + f + ',' + x + ',' + y + '" x="' + a[0] + '" y="' + a[1] + '" width="' + TOPW + '" height="' + TD + '" fill="' + (I.moving && !occ.has(x + ',' + y) ? 'rgba(236,210,122,0.6)' : fill) + '" stroke="' + (dark ? '#2a2e33' : '#d6c6a6') + '" stroke-width="1"/>';
    if (isWindow(f, x, y) && !dark) s += '<rect x="' + (a[0] + 8) + '" y="' + (a[1] + 6) + '" width="' + (TOPW - 16) + '" height="' + (TD - 14) + '" rx="10" fill="rgba(255,236,160,0.45)" pointer-events="none"/>';
  }
  // 地毯（一樓客廳）
  if (f === '1F') { const a = P(2.1, 2.2), b = P(3.9, 3.8); s += '<ellipse cx="' + (a[0] + b[0]) / 2 + '" cy="' + (a[1] + b[1]) / 2 + '" rx="' + (b[0] - a[0]) / 2 + '" ry="' + (b[1] - a[1]) / 2 + '" fill="#9b6b5a" opacity="0.35" pointer-events="none"/>'; }
  // 物件（由後往前）
  const here = objs.map(o => ({ o, p: sv.place[o.id] })).filter(it => it.p && it.p.f === f);
  const dims = it => { const D = ISO[it.o.k]; return { D, w: it.p.r ? D.d : D.w, d: it.p.r ? D.w : D.d }; };
  here.sort((a, b) => (a.p.y + dims(a).d) - (b.p.y + dims(b).d) || a.p.x - b.p.x);
  const shade = (c, k) => { const n = parseInt(c.slice(1), 16); return 'rgb(' + Math.round(((n >> 16) & 255) * k) + ',' + Math.round(((n >> 8) & 255) * k) + ',' + Math.round((n & 255) * k) + ')'; };
  for (const it of here) {
    const { o, p } = it, { D, w, d } = dims(it), h = D.h * 1.15, sel = I.sel === o.id;
    const tl = P(p.x + 0.06, p.y + 0.06, h), br = P(p.x + w - 0.06, p.y + d - 0.06, h), fb = P(p.x + w - 0.06, p.y + d - 0.06, 0);
    let g = '<g data-a="isoObj" data-v="' + o.id + '" style="cursor:pointer' + (I.moving ? ';pointer-events:none;opacity:' + (sel ? 0.35 : 1) : '') + '">';
    g += '<ellipse cx="' + (tl[0] + br[0]) / 2 + '" cy="' + (fb[1] - 2) + '" rx="' + (br[0] - tl[0]) / 2 + '" ry="6" fill="rgba(0,0,0,0.18)"/>';
    if (ISO_ASSETS[o.k]) {
      const iw = br[0] - tl[0], ih = fb[1] - tl[1] + 10;
      g += '<image href="' + ISO_ASSETS[o.k] + '" x="' + tl[0] + '" y="' + (fb[1] - ih) + '" width="' + iw + '" height="' + ih + '" preserveAspectRatio="xMidYMax meet"/>';
    } else {
      g += '<rect x="' + tl[0] + '" y="' + br[1] + '" width="' + (br[0] - tl[0]) + '" height="' + (fb[1] - br[1]) + '" fill="' + shade(D.c, 0.72) + '" stroke="' + INK + '" stroke-width="1"/>';
      const art = typeof topArt === 'function' ? topArt(o.k, tl[0], tl[1], br[0] - tl[0], br[1] - tl[1], p.r) : null;
      if (art) {
        g += topFront(o.k, tl[0], br[1], br[0] - tl[0], fb[1] - br[1]) + art;
      } else {
        g += '<rect x="' + tl[0] + '" y="' + tl[1] + '" width="' + (br[0] - tl[0]) + '" height="' + (br[1] - tl[1]) + '" rx="3" fill="' + D.c + '" stroke="' + INK + '" stroke-width="1"/>';
        g += '<text x="' + (tl[0] + br[0]) / 2 + '" y="' + ((tl[1] + br[1]) / 2 + 4) + '" font-size="11" text-anchor="middle" fill="#1d2733" font-family="Noto Sans TC, sans-serif" pointer-events="none">' + D.n.slice(0, 3) + '</text>';
      }
    }
    if (sel) g += '<rect x="' + (tl[0] - 3) + '" y="' + (tl[1] - 3) + '" width="' + (br[0] - tl[0] + 6) + '" height="' + (fb[1] - tl[1] + 6) + '" rx="4" fill="none" stroke="' + RED + '" stroke-width="2.5" stroke-dasharray="5 3" pointer-events="none"/>';
    s += g + '</g>';
  }
  return '<div class="iso top"><svg viewBox="0 0 ' + Z.w + ' ' + Z.h + '" role="img" aria-label="' + F.n + '">' + s + '</svg></div>';
}
Object.assign(SACT, { cam(v) { UIS.cam = v === 'iso' ? 'iso' : 'top'; saveUI(); render(); } });
function viewCamPick() {
  return '<div class="setrow" style="margin-top:6px"><span>視角</span><button class="pill' + (camTop() ? ' on' : '') + '" data-a="cam" data-v="top">俯視</button><button class="pill' + (!camTop() ? ' on' : '') + '" data-a="cam" data-v="iso">等角</button></div>';
}
