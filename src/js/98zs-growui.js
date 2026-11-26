/* ================= 🌟 成長視窗 UI ================= */
const GR_TABS = [['route', '🗺️ 路線'], ['kitchen', '🧪 廚房'], ['field', '🌱 田園'], ['ind', '🐟 產業'], ['biz', '🏮 生意'], ['home', '🏡 家園'], ['goal', '🏆 目標']];
const GR_INTRO = {
  lab: ['把 2～3 種材料丟進鍋子試試看。', '配對了就發現新菜，永遠記在食譜本裡；失敗會變成黑暗料理。', '每道新菜都有提示，猜猜看要放什麼。'],
  soil: ['田越種越貧瘠，肥力低於 30 會少收、高於 80 會多收。', '施肥、翻土可以補肥力。', '種花生、豆芽是「輪作」，收成時反而會養土。'],
  season: ['每 10 天換一個季節：春、夏、秋、冬。', '種當季作物，收成多 30%。'],
  review: ['招呼過的客人會留評價，品質越好星星越多。', '沒招呼到的客人會留負評。', '平均 4.3 星以上，隔天多 2 位客人；太低會少客人。'],
  sig: ['同一道料理煮滿 10 次就變成招牌菜。', '招牌菜更容易優良、價格 ×1.25，客人也常指名要。'],
  plate: ['極品料理可以擺盤：選盤子和裝飾。', '擺盤過的極品賣出時多賺 50%。', '陶盤、金邊瓷盤在陶藝窯做。'],
  hybrid: ['先做雜交苗床，再選兩種作物各 3 個來授粉。', '3 天後看結果，組合對了會得到新品種種子。', '提示：顏色相近、季節相同的比較合得來。'],
  fish: ['挖魚池，每天餵玉米、小麥或菜，5 天後就能撈魚。', '蝦籠和水耕架要魚池有魚才會產出。', '魚苗在小店市集買。'],
  weekly: ['每週三個挑戰，自動計算進度。', '完成拿稀有的雜交種子；三項全破還有大獎。'],
  pottery: ['挖黏土 → 用磚窯燒成碗、盤、甕。', '家裡的陶碗、陶盤越多，料理越容易優良。', '偶爾會燒壞，這就是陶藝。'],
  silk: ['種桑樹 → 蓋蠶房 → 蠶寶寶吃桑葉 6 天結繭。', '蠶繭 3 個用織布機織成絲布。', '絲布可以縫蠶絲被（冬天保暖）或襯衫（很好賣）。'],
  night: ['每 7 天一次夜市日，16:00 以後可以擺攤。', '選最多 4 樣帶去，人潮會依評價和攤位等級變多。'],
  bigorder: ['偶爾有大單位下大訂單：一次要 10～20 份。', '3 天內交，報酬是平常的好幾倍。在訂單板交貨。'],
  furn: ['家裡的家具可以升到 ★★★。', '床多回精力、馬桶補衛生、種植箱多收成……'],
  staff: ['每 5 天會有新的應徵者，各有擅長。', '最多 3 位員工，每天付薪水，付不出來會走人。'],
  deco: ['四種裝潢主題，每套 4 件。', '湊齊整套才有效果。'],
  line: ['買機器讓工作自動完成，每天晚上自己跑。', '小麥自動磨粉、多的作物自動做乾貨、自動烤麵包、自動釀酒、自動出貨。'],
  master: ['任一技能練到 Lv.5 就能選稱號。', '只能選一個，想清楚。'],
  contest: ['每 30 天舉辦一次（開放 3 天）。', '作物、料理、飲品三組各送一樣，品質、擺盤、招牌都會加分。', '前三名的獎盃會永遠留在獎盃櫃。']
};
const GR_SCENE_BG = ['#cfe3b5', '#f2d38a', '#e6a65a', '#cfe0ee'];
function grSVG(inner, h, bg) { return '<svg viewBox="0 0 330 ' + (h || 96) + '" class="fm-svg gr-svg"><rect width="330" height="' + (h || 96) + '" rx="8" fill="' + (bg || '#2a3340') + '"/>' + inner + '</svg>'; }
const ic = (k, x, y, s) => svgIc(k, x, y, s || 22);
function grScene(k, now) {
  const gr = GR(), sv = S.sv, t = now / 1000;
  if (k === 'lab') { const hot = UI.labFx && now - UI.labFx < 2500, sel = UI.labSel || []; let s = '<rect x="0" y="70" width="330" height="26" fill="#6a4a30"/><ellipse cx="165" cy="64" rx="48" ry="12" fill="#3a3a3a"/><path d="M117 64 q0 30 48 30 q48 0 48 -30z" fill="#555"/><ellipse cx="165" cy="64" rx="44" ry="9" fill="' + (hot ? '#f0b040' : '#8a7a5a') + '"/>';
    sel.forEach((m, i) => { s += ic(m, 135 + i * 30, 30 + Math.sin(t * 3 + i) * 4, 24); });
    for (let i = 0; i < 4; i++) { const p = ((t * 0.7) + i / 4) % 1; s += '<circle cx="' + (140 + i * 16 + Math.sin(p * 6) * 4) + '" cy="' + (58 - p * 40) + '" r="' + (3 + p * 5) + '" fill="#fff" opacity="' + (0.5 * (1 - p)).toFixed(2) + '"/>'; }
    if (UI.labHit && hot) s += ic(UI.labHit, 270, 44, 36) + '<text x="270" y="18" text-anchor="middle" font-size="11" fill="#ecd27a">' + (UI.labHit === 'dark_dish' ? '失敗…' : '成功！') + '</text>';
    return grSVG(s, 96, '#3a2e28'); }
  if (k === 'plate') { const p = UI.plP || 'none', g = UI.plG || 'none', d = UI.plD, sc = UI.plScore; let s = '<rect width="330" height="96" fill="#efe6d4"/><ellipse cx="165" cy="52" rx="62" ry="34" fill="' + (p === 'fineplate' ? '#fff' : p === 'plate' ? '#c9895a' : '#ddd') + '" stroke="' + (p === 'fineplate' ? '#d4a83a' : '#999') + '" stroke-width="' + (p === 'fineplate' ? 4 : 1.5) + '"/><ellipse cx="165" cy="52" rx="44" ry="22" fill="none" stroke="#0001"/>' + (d ? ic(d, 165, 50, 40) : '<text x="165" y="56" text-anchor="middle" font-size="11" fill="#888">選一道極品料理</text>');
    if (g !== 'none') for (let i = 0; i < 5; i++) s += ic(g, 120 + i * 22, 74 + (i % 2) * 4, 12);
    if (sc && UI.plFx && now - UI.plFx < 4000) s += '<text x="290" y="40" text-anchor="middle" font-size="22" font-weight="900" fill="#d6322a">' + sc + '</text><text x="290" y="58" text-anchor="middle" font-size="10" fill="#7a5a3a">分</text>';
    return grSVG(s, 96, '#efe6d4'); }
  if (k === 'sig') { const top = Object.entries(gr.cookN).sort((a, b) => b[1] - a[1]).slice(0, 5); let s = ''; top.forEach(([d, n], i) => { const x = 35 + i * 65, sig = n >= 10; s += '<rect x="' + (x - 28) + '" y="10" width="56" height="76" rx="6" fill="' + (sig ? '#3a2e10' : '#2e3642') + '" stroke="' + (sig ? '#ecd27a' : '#455') + '"/>' + ic(d, x, 38, 30) + '<rect x="' + (x - 22) + '" y="64" width="44" height="6" rx="3" fill="#455"/><rect x="' + (x - 22) + '" y="64" width="' + Math.min(44, n * 4.4) + '" height="6" rx="3" fill="#ecd27a"/><text x="' + x + '" y="82" text-anchor="middle" font-size="9" fill="#ccc">' + Math.min(n, 10) + '/10</text>' + (sig ? '<text x="' + x + '" y="20" text-anchor="middle" font-size="12">👑</text>' : ''); }); if (!top.length) s += '<text x="165" y="52" text-anchor="middle" font-size="11" fill="#9ab">還沒煮過料理</text>'; return grSVG(s); }
  if (k === 'soil') { const f = gr.soil, col = f >= 80 ? '#3a2a18' : f >= 30 ? '#6a4a2a' : '#a08a6a'; let s = '<rect y="0" width="330" height="34" fill="#bfe0f0"/><rect y="34" width="330" height="62" fill="' + col + '"/>'; for (let i = 0; i < 9; i++) s += '<path d="M' + (20 + i * 36) + ' 34 q-4 -14 0 -22 q6 10 0 22" fill="' + (f >= 30 ? '#4a9a3a' : '#9a9a4a') + '"/>'; const worms = Math.floor(f / 25); for (let i = 0; i < worms; i++) s += '<path d="M' + (40 + i * 70 + Math.sin(t + i) * 8) + ' ' + (60 + i % 2 * 14) + ' q6 -6 12 0 q6 6 12 0" stroke="#e08a8a" stroke-width="3" fill="none" stroke-linecap="round"/>'; s += '<rect x="230" y="70" width="90" height="14" rx="7" fill="#0005"/><rect x="230" y="70" width="' + (f * 0.9) + '" height="14" rx="7" fill="' + (f >= 80 ? '#6ac04a' : f >= 30 ? '#c0a040' : '#c05040') + '"/><text x="275" y="81" text-anchor="middle" font-size="10" fill="#fff" font-weight="700">肥力 ' + Math.round(f) + '</text>'; return grSVG(s, 96, col); }
  if (k === 'season') { const se = season(), lc = ['#f4a6c8', '#3a9a3a', '#e07a2a', '#e8f0f8'][se]; let s = '<rect width="330" height="96" fill="' + GR_SCENE_BG[se] + '"/><rect x="155" y="40" width="14" height="56" fill="#6a4a2a"/><circle cx="162" cy="34" r="34" fill="' + lc + '"/><circle cx="140" cy="46" r="20" fill="' + lc + '"/><circle cx="186" cy="46" r="20" fill="' + lc + '"/>';
    for (let i = 0; i < 10; i++) { const p = ((t * 0.15) + i / 10) % 1, x = (i * 37 + p * 60) % 330; s += se === 3 ? '<circle cx="' + x + '" cy="' + (p * 96) + '" r="2.5" fill="#fff"/>' : se === 0 || se === 2 ? '<ellipse cx="' + x + '" cy="' + (p * 96) + '" rx="3" ry="2" fill="' + lc + '" transform="rotate(' + (p * 360) + ' ' + x + ' ' + (p * 96) + ')"/>' : ''; }
    s += '<text x="20" y="28" font-size="22">' + SEASON_IC[se] + '</text><text x="50" y="27" font-size="14" font-weight="800" fill="#333">' + SEASON_N[se] + '天 · 還有 ' + (10 - (sv.day - 1) % 10) + ' 天</text>';
    SEASON_CROP[se].filter(c => ITEMS[c]).slice(0, 5).forEach((c, i) => { s += ic(c, 230 + (i % 3) * 30, 60 + Math.floor(i / 3) * 26, 22); }); return grSVG(s, 96, GR_SCENE_BG[se]); }
  if (k === 'hybrid') { const h = gr.hyb; let s = '<rect y="60" width="330" height="36" fill="#6a4a2a"/>' + (gr.crossbed ? '<rect x="80" y="50" width="170" height="18" rx="4" fill="#8a6a4a"/>' : '<text x="165" y="40" text-anchor="middle" font-size="11" fill="#ddd">先做雜交苗床</text>');
    if (h) { s += ic(h.a, 115, 34, 28) + ic(h.b, 215, 34, 28); for (let i = 0; i < 6; i++) { const p = ((t * 0.5) + i / 6) % 1; s += '<circle cx="' + (125 + p * 80) + '" cy="' + (28 - Math.sin(p * 3.14) * 18) + '" r="2" fill="#f0e060"/>'; } s += '<text x="165" y="88" text-anchor="middle" font-size="10" fill="#fff">還要 ' + Math.max(0, h.ready - sv.day) + ' 天</text>'; }
    else { const sel = UI.hySel || []; if (sel[0]) s += ic(sel[0], 115, 34, 28); if (sel[1]) s += ic(sel[1], 215, 34, 28); if (sel[0] || sel[1]) s += '<text x="165" y="40" text-anchor="middle" font-size="18" fill="#fff">✕</text>'; }
    return grSVG(s, 96, '#9ac8e0'); }
  if (k === 'fish') { let s = '<rect width="330" height="96" fill="#7ab86a"/>' + (gr.pond ? '<ellipse cx="120" cy="52" rx="105" ry="38" fill="#3a7ab0" stroke="#5a5a4a" stroke-width="5"/>' : '<text x="120" y="52" text-anchor="middle" font-size="11">（還沒挖魚池）</text>');
    gr.fish.forEach((f, i) => { const a = t * 0.6 + i * 1.7, x = 120 + Math.cos(a) * (60 - i * 4), y = 52 + Math.sin(a * 1.3) * 22, sz = 6 + Math.min(f.age, 5) * 2; s += '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + (Math.sin(a) > 0 ? -1 : 1) + ' 1)"><ellipse rx="' + sz + '" ry="' + (sz * 0.5) + '" fill="' + (f.age >= 5 ? '#f0a040' : '#c8d8e0') + '"/><path d="M' + sz + ' 0 l' + sz * 0.6 + ' -' + sz * 0.4 + ' v' + sz * 0.8 + 'z" fill="' + (f.age >= 5 ? '#f0a040' : '#c8d8e0') + '"/></g>'; });
    if (gr.shrimp) s += '<rect x="190" y="70" width="26" height="16" rx="3" fill="none" stroke="#aaa" stroke-width="1.5"/><text x="203" y="83" text-anchor="middle" font-size="11">🦐</text>';
    if (gr.hydro) { s += '<rect x="245" y="14" width="74" height="74" fill="#ccc" opacity="0.8"/>'; for (let r = 0; r < 3; r++) { s += '<rect x="248" y="' + (30 + r * 22) + '" width="68" height="5" fill="#5a8ac0"/>'; for (let c = 0; c < 4; c++) s += '<path d="M' + (255 + c * 17) + ' ' + (30 + r * 22) + ' q-5 -12 0 -14 q5 2 0 14" fill="#4ac04a"/>'; } }
    return grSVG(s, 96, '#7ab86a'); }
  if (k === 'pottery') { const spin = t * 6; let s = '<rect width="330" height="96" fill="#d8c4a8"/><ellipse cx="90" cy="76" rx="50" ry="10" fill="#6a5a4a"/><g transform="translate(90 60)"><path d="M-18 14 q-6 -20 4 -34 h28 q10 14 4 34z" fill="#b07a52"/>' + [0, 1, 2].map(i => '<line x1="' + (Math.sin(spin + i * 2) * 14) + '" y1="-18" x2="' + (Math.sin(spin + i * 2) * 16) + '" y2="12" stroke="#8a5a3a" stroke-width="1"/>').join('') + '</g>';
    s += '<rect x="170" y="20" width="150" height="5" fill="#6a4a2a"/><rect x="170" y="56" width="150" height="5" fill="#6a4a2a"/>'; let x = 182; for (const p of ['bowl', 'plate', 'jar', 'fineplate']) { const n = Math.min(3, sv_has(p)); for (let i = 0; i < n; i++) { s += ic(p, x, p === 'jar' ? 40 : 46, 20); x += 22; } }
    if (UI.poFx && now - UI.poFx < 2000) s += '<circle cx="90" cy="40" r="' + ((now - UI.poFx) / 40) + '" fill="#f08a3a" opacity="' + (1 - (now - UI.poFx) / 2000).toFixed(2) + '"/>';
    return grSVG(s, 96, '#d8c4a8'); }
  if (k === 'silk') { const sk = gr.silk; let s = '<rect width="330" height="96" fill="#e8efd8"/>'; for (let i = 0; i < sk.trees; i++) s += '<rect x="' + (20 + i * 26) + '" y="44" width="6" height="40" fill="#6a4a2a"/><circle cx="' + (23 + i * 26) + '" cy="38" r="14" fill="#4a9a3a"/>';
    if (sk.house) { s += '<rect x="130" y="30" width="100" height="56" fill="#f4ead8" stroke="#a08a6a"/>'; for (let i = 0; i < Math.min(12, sk.worms / 2); i++) { const x = 140 + (i % 6) * 15, y = 46 + Math.floor(i / 6) * 22, w = Math.sin(t * 4 + i) * 2; s += '<path d="M' + x + ' ' + y + ' q3 ' + (-3 + w) + ' 6 0 q3 ' + (3 - w) + ' 6 0" stroke="#f8f8f0" stroke-width="4" stroke-linecap="round" fill="none"/>'; } s += '<rect x="130" y="80" width="' + (100 * sk.age / 6) + '" height="6" fill="#ecd27a"/>'; }
    if (sk.loom) { const sh = Math.sin(t * 3) * 25; s += '<rect x="250" y="30" width="70" height="50" fill="none" stroke="#6a4a2a" stroke-width="3"/>'; for (let i = 0; i < 8; i++) s += '<line x1="' + (256 + i * 8) + '" y1="32" x2="' + (256 + i * 8) + '" y2="78" stroke="#d8c8f0"/>'; s += '<rect x="' + (278 + sh) + '" y="52" width="14" height="6" rx="2" fill="#8a5a3a"/>'; }
    return grSVG(s, 96, '#e8efd8'); }
  if (k === 'night') { let s = '<rect width="330" height="96" fill="#1a1530"/>'; for (let i = 0; i < 9; i++) s += '<line x1="' + (i * 40) + '" y1="8" x2="' + (i * 40 + 40) + '" y2="8" stroke="#555"/><ellipse cx="' + (20 + i * 40) + '" cy="16" rx="8" ry="10" fill="#d6322a" opacity="' + (0.75 + Math.sin(t * 2 + i) * 0.25).toFixed(2) + '"/><ellipse cx="' + (20 + i * 40) + '" cy="16" rx="12" ry="14" fill="#f0a040" opacity="0.15"/>';
    s += '<rect x="110" y="50" width="110" height="34" fill="#a0522d"/><rect x="104" y="40" width="122" height="10" fill="#f0e0b0"/><text x="165" y="48" text-anchor="middle" font-size="8" font-weight="800" fill="#a0322a">' + LV_N.nm[lvOfK('nm')] + '</text>';
    (UI.nmSel || []).forEach((k, i) => { s += ic(k, 128 + i * 24, 62, 18); });
    const hot = UI.nmFx && now - UI.nmFx < 5000; const crowd = hot ? 10 : isNM() ? 5 : 1; for (let i = 0; i < crowd; i++) { const x = (i * 47 + t * (i % 2 ? 20 : -20)) % 360 - 15; s += '<text x="' + x.toFixed(0) + '" y="92" font-size="16">' + ['🧑', '👩', '🧒', '👴', '👧', '🧔'][i % 6] + '</text>'; }
    return grSVG(s, 96, '#1a1530'); }
  if (k === 'review') { const R = gr.reviews.slice(0, 3); let s = ''; R.forEach((r, i) => { const x = 8 + i * 108; s += '<rect x="' + x + '" y="10" width="102" height="76" rx="6" fill="#fdf8ec"/><text x="' + (x + 8) + '" y="28" font-size="11" fill="#e0a020">' + '★'.repeat(r.n) + '<tspan fill="#ccc">' + '★'.repeat(5 - r.n) + '</tspan></text><foreignObject x="' + (x + 6) + '" y="32" width="92" height="40"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:10px;color:#3a2a1a;line-height:1.3">' + r.t + '</div></foreignObject><text x="' + (x + 8) + '" y="80" font-size="8.5" fill="#999">— ' + r.who + '</text>'; }); if (!R.length) s += '<text x="165" y="52" text-anchor="middle" font-size="11" fill="#9ab">還沒有評價</text>'; s += '<text x="322" y="92" text-anchor="end" font-size="10" fill="#ecd27a">平均 ' + revAvg().toFixed(1) + ' ★</text>'; return grSVG(s); }
  if (k === 'staff') { let s = ''; gr.staff.forEach((st, i) => { const x = 55 + i * 110, b = Math.abs(Math.sin(t * 3 + i)) * 4; s += '<rect x="' + (x - 48) + '" y="8" width="96" height="80" rx="8" fill="#2e3642"/><text x="' + x + '" y="' + (44 - b) + '" text-anchor="middle" font-size="26">🧑‍🔧</text><text x="' + (x + 24) + '" y="34" font-size="16">' + JOBS[st.job][0] + '</text><text x="' + x + '" y="66" text-anchor="middle" font-size="11" fill="#fff">' + st.n + '</text><text x="' + x + '" y="80" text-anchor="middle" font-size="10" fill="#ecd27a">' + '★'.repeat(st.s) + '</text>'; }); if (!gr.staff.length) s += '<text x="165" y="52" text-anchor="middle" font-size="11" fill="#9ab">還沒有員工</text>'; return grSVG(s); }
  if (k === 'furn') { const ks = placedKinds().slice(0, 6); let s = ''; ks.forEach((f, i) => { const x = 30 + i * 54, lv = gr.furn[f] || 1, img = typeof SPR === 'object' && SPR['obj_' + f]; s += (lv >= 3 ? '<circle cx="' + x + '" cy="44" r="' + (24 + Math.sin(t * 3) * 2) + '" fill="#ecd27a" opacity="0.25"/>' : '') + (img ? '<image href="' + img + '" x="' + (x - 22) + '" y="20" width="44" height="44"/>' : '<text x="' + x + '" y="52" text-anchor="middle" font-size="26">' + (OBJ_IC[f] || '📦') + '</text>') + '<text x="' + x + '" y="80" text-anchor="middle" font-size="11" fill="#ecd27a">' + '★'.repeat(lv) + '</text>'; }); return grSVG(s); }
  if (k === 'deco') { let s = '<rect x="10" y="8" width="310" height="80" fill="#e8dcc8"/><rect x="10" y="60" width="310" height="28" fill="#c8a880"/>'; let x = 24; for (const [tk, T] of Object.entries(DECO)) for (const p of Object.keys(T.p)) if (gr.deco[tk + '.' + p]) { s += '<text x="' + x + '" y="' + (50 + (x % 3) * 8) + '" font-size="18">' + { retro: '🪑', zen: '🏮', indust: '💡', forest: '🪴' }[tk] + '</text>'; x += 20; } if (x === 24) s += '<text x="165" y="44" text-anchor="middle" font-size="11" fill="#7a6a5a">空蕩蕩的房間</text>'; return grSVG(s, 96, '#e8dcc8'); }
  if (k === 'line') { const L = gr.line, ks = Object.keys(LINE); let s = '<rect x="0" y="54" width="330" height="14" fill="#444"/>'; for (let i = 0; i < 22; i++) s += '<line x1="' + ((i * 16 + t * 30) % 340 - 5) + '" y1="54" x2="' + ((i * 16 + t * 30) % 340 - 9) + '" y2="68" stroke="#666" stroke-width="2"/>';
    ks.forEach((k, i) => { const x = 33 + i * 66, on = L[k]; s += '<rect x="' + (x - 24) + '" y="14" width="48" height="40" rx="4" fill="' + (on ? '#5a6a7a' : '#2a3038') + '" stroke="' + (on ? '#ecd27a' : '#444') + '"/><text x="' + x + '" y="40" text-anchor="middle" font-size="16" opacity="' + (on ? 1 : 0.3) + '">' + { mill: '🌾', dry: '🍠', bake: '🍞', brew: '🍶', ship: '📦' }[k] + '</text><text x="' + x + '" y="84" text-anchor="middle" font-size="8.5" fill="' + (on ? '#ecd27a' : '#667') + '">' + LINE[k].n + '</text>'; });
    if (Object.keys(L).length) for (let i = 0; i < 5; i++) { const p = ((t * 0.12) + i / 5) % 1; s += ic(['wheat_p', 'flour', 'veg_dry', 'bread', 'rice_wine'][i], p * 330, 56, 14); }
    return grSVG(s); }
  if (k === 'weekly') { const W = gr.wk; let s = '<rect x="10" y="8" width="310" height="80" rx="6" fill="#fdf8ec"/>'; if (W) W.list.forEach((c, i) => { const y = 26 + i * 22, p = wkProg(c) / c.goal; s += '<text x="22" y="' + (y + 4) + '" font-size="11" fill="#3a2a1a">' + (c.done ? '✅' : '⬜') + ' ' + c.n + '</text><rect x="210" y="' + (y - 6) + '" width="100" height="10" rx="5" fill="#e0d4c0"/><rect x="210" y="' + (y - 6) + '" width="' + (100 * p) + '" height="10" rx="5" fill="' + (c.done ? '#6ac04a' : '#e0a020') + '"/>'; }); return grSVG(s); }
  if (k === 'master') { let s = ''; Object.entries(MASTERS).forEach(([mk, M], i) => { const x = 25 + i * 47, on = gr.master === mk, can = M[2](); s += '<circle cx="' + x + '" cy="40" r="' + (on ? 20 + Math.sin(t * 3) : 18) + '" fill="' + (on ? '#ecd27a' : can ? '#3e5a70' : '#2a3038') + '"/><text x="' + x + '" y="46" text-anchor="middle" font-size="16">' + { chef: '👨‍🍳', farm: '🌾', brew: '🍶', bake: '🍞', ranch: '🐄', shop: '💰', proc: '⚗️' }[mk] + '</text><text x="' + x + '" y="78" text-anchor="middle" font-size="8.5" fill="' + (on ? '#ecd27a' : '#9ab') + '">' + M[0] + '</text>'; }); return grSVG(s); }
  if (k === 'contest') { const T = (J.trophies || []).slice(-8); let s = '<rect x="10" y="62" width="310" height="8" fill="#6a4a2a"/><rect x="10" y="30" width="310" height="6" fill="#6a4a2a"/>'; T.forEach((tr, i) => { s += '<text x="' + (28 + i * 38) + '" y="58" text-anchor="middle" font-size="22">' + ['', '🏆', '🥈', '🥉'][tr.m] + '</text>'; }); if (!T.length) s += '<text x="165" y="54" text-anchor="middle" font-size="11" fill="#9ab">獎盃櫃還是空的</text>'; s += '<text x="165" y="88" text-anchor="middle" font-size="10" fill="#ecd27a">' + (ctOpen() ? '🏆 品評會報名中！' : '下一屆：第 ' + (Math.floor(sv.day / 30) + 1) * 30 + ' 天') + '</text>'; return grSVG(s); }
  return '';
}
const row = (title, meta, btn) => '<div class="wm-row"><div><b>' + title + '</b><div class="meta">' + meta + '</div></div>' + (btn || '') + '</div>';
const bt = (a, v, t, ok, ghost) => '<button class="btn' + (ghost ? ' ghost' : '') + '" data-a="' + a + '"' + (v != null ? ' data-v="' + v + '"' : '') + (ok ? '' : ' disabled') + '>' + t + '</button>';
const chip = (a, v, t, on) => '<button class="gr-chip' + (on ? ' on' : '') + '" data-a="' + a + '" data-v="' + v + '">' + t + '</button>';
function grBody(k) {
  const gr = GR(), sv = S.sv, bz = BZ(); let h = '';
  if (k === 'lab') {
    const pool = LAB_POOL(), sel = UI.labSel || [];
    h += '<div class="gr-chips">' + pool.map(m => chip('labPick', m, itemIc(m) + ITEMS[m].n.replace(/（.*）/, '') + ' ' + sv_has(m), sel.includes(m))).join('') + '</div>';
    h += bt('labTry', null, '🧪 下鍋試試（' + sel.length + '/3 · 1 小時）', sel.length >= 2) + '<div class="cat">📖 食譜本（' + Object.keys(labBook()).length + '/' + Object.keys(LAB).length + '）</div>';
    for (const [d, L] of Object.entries(LAB)) h += labBook()[d] ? row(itemIc(d) + ITEMS[d].n + ' ×' + L.q, L.ing.map(m => ITEMS[m].n).join(' + ') + ' · 煮過 ' + (gr.cookN[d] || 0) + ' 次' + (isSig(d) ? ' 👑' : ''), bt('labCook', d, '煮', L.ing.every(m => sv_has(m) > 0))) : row('❓ ？？？', '提示：' + L.hint);
  }
  if (k === 'sig') { const ks = Object.entries(gr.cookN).sort((a, b) => b[1] - a[1]); h += ks.length ? ks.slice(0, 10).map(([d, n]) => row(itemIc(d) + ITEMS[d].n + (n >= 10 ? ' 👑' : ''), n >= 10 ? '招牌菜：品質加成、售價 ×1.25、客人指名' : '再煮 ' + (10 - n) + ' 次變成招牌菜')).join('') : '<p class="meta">還沒煮過料理。</p>'; }
  if (k === 'plate') {
    const ds = Object.keys(FOOD).filter(d => FOOD[d].dish && qOf(d)[1] - (gr.plated[d] || 0) > 0);
    h += '<div class="cat">1. 選料理（沒擺盤的極品）</div><div class="gr-chips">' + (ds.length ? ds.map(d => chip('plSet', 'd:' + d, itemIc(d) + ITEMS[d].n + ' ' + (qOf(d)[1] - (gr.plated[d] || 0)), UI.plD === d)).join('') : '<span class="meta">沒有極品料理</span>') + '</div>';
    h += '<div class="cat">2. 選盤子</div><div class="gr-chips">' + Object.entries(PLATES).map(([p, P]) => chip('plSet', 'p:' + p, P[0] + (p !== 'none' ? ' ' + sv_has(p) : '') + ' +' + P[1], (UI.plP || 'none') === p)).join('') + '</div>';
    h += '<div class="cat">3. 選裝飾</div><div class="gr-chips">' + Object.entries(GARN).map(([g, G]) => chip('plSet', 'g:' + g, G[0] + (g !== 'none' ? ' ' + sv_has(g) : '') + ' +' + G[1], (UI.plG || 'none') === g)).join('') + '</div>' + bt('plDo', null, '🍽️ 擺盤', !!UI.plD && ds.includes(UI.plD));
  }
  if (k === 'soil') h += row('肥力 ' + Math.round(gr.soil) + '/100', gr.soil >= 80 ? '肥沃：收成 +25%' : gr.soil < 30 ? '貧瘠：收成 -30%' : '普通', '') + row('施肥', '肥料 1 → 肥力 +25 · 有 ' + sv_has('fert'), bt('soilFert', null, '施肥', sv_has('fert') > 0)) + row('翻土', '2 小時、體力 10 → 肥力 +10', bt('soilRest', null, '翻土', canAct(2, 10))) + '<p class="meta">花生、豆芽收成時會養土（輪作）。員工種田也會補肥力。</p>';
  if (k === 'season') h += '<p class="meta">當季作物收成 +30%。每 10 天換季，按季節輪著種最划算。</p>' + [0, 1, 2, 3].map(s => row(SEASON_IC[s] + ' ' + SEASON_N[s] + (s === season() ? '（現在）' : ''), SEASON_CROP[s].filter(c => ITEMS[c]).map(c => ITEMS[c].n).join('、'))).join('');
  if (k === 'hybrid') {
    if (!gr.crossbed) h += row('做雜交苗床', needTxt({ board: 4, fert: 1, pot: 2 }), bt('hyBuild', null, '做', true));
    else if (gr.hyb) h += row('授粉中：' + ITEMS[gr.hyb.a].n + ' ✕ ' + ITEMS[gr.hyb.b].n, '還要 ' + Math.max(0, gr.hyb.ready - sv.day) + ' 天');
    else { const ok = CROPS().concat(['honey']).filter(c => ITEMS[c] && sv_has(c) >= 3), s = UI.hySel || [];
      h += '<div class="cat">父本（各要 3 個）</div><div class="gr-chips">' + ok.map(c => chip('hySet', '0:' + c, itemIc(c) + ITEMS[c].n, s[0] === c)).join('') + '</div><div class="cat">母本</div><div class="gr-chips">' + ok.map(c => chip('hySet', '1:' + c, itemIc(c) + ITEMS[c].n, s[1] === c)).join('') + '</div>' + bt('hyGo', null, '🧬 授粉（3 天）', s[0] && s[1] && s[0] !== s[1]); }
    h += '<div class="cat">已知的新品種</div>' + Object.values(HYB).map(o => row(itemIc(o) + (J.cdx && J.cdx[SEED_OUT[o]] != null || sv_has(o) ? ITEMS[o].n : '？？？'), J.cdx && J.cdx[SEED_OUT[o]] != null ? '種出來是 ' + ITEMS[SEED_OUT[o]].n : '還沒試出來')).join('');
  }
  if (k === 'fish') {
    if (!gr.pond) h += row('挖魚池', needTxt({ board: 6, plastic: 4, metal: 2 }) + ' · 送 3 尾魚苗', bt('fiBuild', 'pond', '挖', true));
    else { const big = gr.fish.filter(f => f.age >= 5).length; h += row('🐟 魚 ' + gr.fish.length + '/10', '可以撈 ' + big + ' 尾 · 每 3 尾每天吃 1 份玉米／小麥／菜', bt('fiCatch', null, '撈魚', big > 0)) + row('放魚苗', '有 ' + sv_has('fry') + ' 尾（小店市集買）', bt('fiFry', null, '放', sv_has('fry') > 0 && gr.fish.length < 10, true));
      if (!gr.shrimp) h += row('蝦籠', needTxt({ metal: 2, plastic: 2 }) + ' · 池裡 3 尾魚以上，每天抓到蝦', bt('fiBuild', 'shrimp', '做', true));
      if (!gr.hydro) h += row('水耕架', needTxt({ plastic: 4, metal: 2, pot: 2 }) + ' · 每天長青菜，魚越多長越多', bt('fiBuild', 'hydro', '做', true)); }
  }
  if (k === 'pottery') { h += lvBar('pot') + row('挖黏土', '1 小時、體力 8 · 有 ' + sv_has('clay'), bt('poDig', null, '挖', canAct(1, 8))); for (const [p, P] of Object.entries(POTS)) h += row(itemIc(p) + ITEMS[p].n + ' · 有 ' + sv_has(p), lvOfK('pot') < P.lv ? '🔒 陶藝 Lv.' + P.lv : '黏土 ' + P.clay + (P.glass ? '、玻璃 ' + P.glass : '') + '、木板 1 · ' + P.d, bt('poMake', p, '燒', lvOfK('pot') >= P.lv && sv_has('clay') >= P.clay)); }
  if (k === 'silk') { const s = gr.silk; h += row('🌳 桑樹 ' + s.trees + '/4', '每棵每天 2 片桑葉 · 有 ' + sv_has('mulb_l') + ' 片', s.trees < 4 ? bt('skTree', null, '種一棵', true) : '');
    h += s.house ? row('🐛 蠶寶寶 ' + s.worms + ' 隻', '第 ' + s.age + '/6 天結繭 · 每 10 隻每天吃 1 片', '') : row('蠶房', needTxt({ board: 4, plastic: 2 }), bt('skHouse', null, '蓋', true));
    h += s.loom ? row('🧵 織布', '蠶繭 3 → 絲布 1 · 有蠶繭 ' + sv_has('cocoon') + '、絲布 ' + sv_has('cloth'), bt('skWeave', null, '織', sv_has('cocoon') >= 3)) + row(itemIc('quilt') + '蠶絲被', '絲布 3 · 冷天每晚心態 +4', bt('skSew', 'quilt', '縫', sv_has('cloth') >= 3)) + row(itemIc('shirt') + '絲綢襯衫', '絲布 2 · 很好賣', bt('skSew', 'shirt', '縫', sv_has('cloth') >= 2)) : row('織布機', needTxt({ board: 4, metal: 2 }), bt('skLoom', null, '做', true)); }
  if (k === 'review') h += gr.reviews.length ? gr.reviews.map(r => row('<span style="color:#e0a020">' + '★'.repeat(r.n) + '</span> ' + r.who, '「' + r.t + '」· 第 ' + r.d + ' 天')).join('') : '<p class="meta">招呼客人後就會有評價。</p>';
  if (k === 'night') { const open = isNM(), done = gr.nmDay === sv.day; h += lvBar('nm') + '<p class="meta">' + (open ? (done ? '今天已經擺過攤了。' : '今天是夜市日！16:00 以後出攤（4 小時、體力 15）。') : '下次夜市：第 ' + (Math.floor(sv.day / 7) + 1) * 7 + ' 天。') + '</p>';
    const foods = Object.keys(ITEMS).filter(m => sv_has(m) > 0 && (FOOD[m] || ['shirt', 'jar', 'candle', 'quilt'].includes(m)) && m !== 'dark_dish'), sel = UI.nmSel || [];
    h += '<div class="cat">帶去賣的（最多 4 樣）</div><div class="gr-chips">' + foods.map(m => chip('nmPick', m, itemIc(m) + ITEMS[m].n + ' ' + sv_has(m), sel.includes(m))).join('') + '</div>' + bt('nmGo', null, '🏮 出攤', open && !done && sel.length > 0 && sv.hour >= 16); }
  if (k === 'bigorder') { const o = bz.orders.filter(x => x.big); h += o.length ? o.map(x => row(x.who + '：' + ITEMS[x.k].n + ' ×' + x.qty + (x.done ? ' ✅' : ''), x.done ? '完成' : '有 ' + sv_has(x.k) + ' · 剩 ' + Math.max(0, x.until - sv.day + 1) + ' 天 · 🪙 ' + x.coin + ' ⭐ ' + x.rep, x.done ? '' : bt('bzOrder', x.id, '交貨', canFill(x)))).join('') : '<p class="meta">還沒有大訂單，每天早上有機會出現。</p>'; }
  if (k === 'staff') { h += gr.staff.map((s, i) => row(s.n + ' ' + '★'.repeat(s.s) + ' · ' + JOBS[s.job][0] + JOBS[s.job][1], '日薪 ' + (3 + s.s * 2) + ' · ' + JOBS[s.job][2] + '<div class="gr-chips">' + Object.entries(JOBS).map(([j, J0]) => chip('stJob', i + ':' + j, J0[0] + J0[1], s.job === j)).join('') + '</div>', bt('stFire', i, '解雇', true, true))).join('');
    h += '<div class="cat">應徵者（每 5 天換一批）</div>' + (gr.cands.length ? gr.cands.map((c, i) => row(c.n + ' ' + '★'.repeat(c.s), '擅長' + JOBS[c.best][1] + ' · 簽約金 30 · 日薪 ' + (3 + c.s * 2), bt('stHire', i, '雇用', gr.staff.length < 3 && bz.coin >= 30))).join('') : '<p class="meta">明天早上會有人來應徵。</p>'); }
  if (k === 'furn') { const ks = placedKinds(); h += ks.length ? ks.map(f => { const lv = gr.furn[f] || 1; return row((OBJ_IC[f] || '') + ' ' + ISO[f].n + ' <span style="color:#ecd27a">' + '★'.repeat(lv) + '</span>', FURN_FX[f] + (lv < 3 ? ' · 升級：' + needTxt(furnCost(lv)) + '、🪙 ' + furnCoin(lv) : ' · 已滿級'), lv < 3 ? bt('fuUp', f, '升級', bz.coin >= furnCoin(lv)) : ''); }).join('') : '<p class="meta">家裡還沒有可以升級的家具。</p>'; }
  if (k === 'deco') for (const [t, T] of Object.entries(DECO)) { h += '<div class="cat">' + T.n + (decoDone(t) ? ' ✅ ' : ' · ') + T.fx + '</div>'; for (const [p, P] of Object.entries(T.p)) h += row((gr.deco[t + '.' + p] ? '✅ ' : '') + P[0], gr.deco[t + '.' + p] ? '已擺上' : needTxt(P[1]) + '、🪙 ' + P[2], gr.deco[t + '.' + p] ? '' : bt('deBuy', t + '.' + p, '擺', bz.coin >= P[2])); }
  if (k === 'line') for (const [l, L] of Object.entries(LINE)) h += row((gr.line[l] ? '✅ ' : '') + L.n, L.d + (gr.line[l] ? '' : ' · ' + needTxt(L.c) + '、🪙 ' + L.coin), gr.line[l] ? '' : bt('liBuild', l, '裝', bz.coin >= L.coin));
  if (k === 'weekly') { if (!gr.wk) wkNew(); h += gr.wk.list.map(c => row((c.done ? '✅ ' : '') + c.n, wkProg(c) + '/' + c.goal + ' · 獎勵：稀有種子 ×2、40 瓶蓋')).join('') + '<p class="meta">第 ' + (gr.wk.wk + 1) + ' 週 · 還剩 ' + (gr.wk.until - sv.day + 1) + ' 天 · 三項全破送 100 瓶蓋和金邊瓷盤</p>'; }
  if (k === 'master') h += gr.master ? '<p>你的稱號：<b style="color:#ecd27a">' + MASTERS[gr.master][0] + '</b> — ' + MASTERS[gr.master][1] + '</p>' : Object.entries(MASTERS).map(([m, M]) => row(M[0], M[1] + (M[2]() ? '' : ' · 🔒 這項技能要 Lv.5'), bt('msPick', m, '選這個', M[2]()))).join('');
  if (k === 'contest') { if (ctOpen()) { h += '<p class="meta">三組各選一樣，品質、擺盤、招牌菜都會加分。送出後東西會交給評審。</p>'; for (const [c, C] of Object.entries(CT_CAT)) { const its = Object.keys(ITEMS).filter(m => sv_has(m) > 0 && C[1](m)).sort((a, b) => (qOf(b)[1] * 2 + qOf(b)[0]) - (qOf(a)[1] * 2 + qOf(a)[0])).slice(0, 10); h += '<div class="cat">' + C[0] + '</div><div class="gr-chips">' + (its.length ? its.map(m => chip('ctSet', c + ':' + m, itemIc(m) + ITEMS[m].n + (qOf(m)[1] ? ' ★★' : qOf(m)[0] ? ' ★' : ''), (UI.ct || {})[c] === m)).join('') : '<span class="meta">沒有可以參賽的</span>') + '</div>'; } h += bt('ctGo', null, '🏆 送出參賽', true); }
    else h += '<p class="meta">' + (gr.contest[ctId()] ? '這一屆已經參加過了：' + gr.contest[ctId()].join('；') : '下一屆在第 ' + (Math.floor(sv.day / 30) + 1) * 30 + ' 天。') + '</p>';
    h += '<div class="cat">獎盃櫃（跨輪保留）</div>' + ((J.trophies || []).length ? (J.trophies || []).slice(-10).reverse().map(tr => row(['', '🏆 冠軍', '🥈 亞軍', '🥉 季軍'][tr.m] + ' · ' + CT_CAT[tr.c][0], ITEMS[tr.k].n + ' · 第 ' + tr.d + ' 天')).join('') : '<p class="meta">還沒有獎盃。</p>'); }
  return h;
}
function growModal() {
  const gr = GR(), tab = UI.grTab || 'route', now = performance.now();
  let h = '<div class="bz-top"><span>' + SEASON_IC[season()] + ' ' + SEASON_N[season()] + '天</span><span>🪙 ' + BZ().coin + '</span><span>⭐ ' + BZ().rep + '</span><span>已解鎖 ' + Object.keys(gr.ul).length + '/' + GROW.length + '</span></div>';
  h += '<div class="fm-tabs bz-tabs">' + GR_TABS.map(([k, t]) => { const has = k === 'route' || GROW.some(g => g.g === k && grOn(g.k)); return '<button class="' + (k === tab ? 'on' : has ? '' : 'locked') + '" data-a="grTab" data-v="' + k + '">' + (has ? '' : '🔒 ') + t + '</button>'; }).join('') + '</div>';
  if (tab === 'route') {
    for (let t = 1; t <= 5; t++) { const open = tierOpen(t), gs = GROW.filter(g => g.t === t), got = gs.filter(g => grOn(g.k)).length;
      h += '<div class="gr-tier' + (open ? '' : ' off') + '"><div class="gr-th"><b>第 ' + t + ' 階段 · ' + TIER_N[t] + '</b><span>' + got + '/' + gs.length + (open ? '' : ' · 🔒 ' + (t === 1 ? '經營中心開放後' : '上一階段解鎖 ' + TIER_NEED[t] + ' 項')) + '</span></div><div class="gr-nodes">' +
        gs.map(g => { const on = grOn(g.k), ok = open && g.c(); return '<button class="gr-node' + (on ? ' on' : ok ? ' ready' : '') + '" data-a="grGo" data-v="' + g.k + '"><span>' + (on || open ? g.ic : '❔') + '</span><b>' + (on || open ? g.n : '？？？') + '</b><i>' + (on ? '已解鎖' : open ? g.txt : '') + '</i></button>'; }).join('') + '</div></div>'; }
  } else {
    for (const g of GROW.filter(x => x.g === tab)) {
      if (!grOn(g.k)) { h += '<div class="gr-sec locked"><div class="gr-sh">' + g.ic + ' ' + g.n + '<span>🔒 ' + (tierOpen(g.t) ? g.txt : '先解鎖第 ' + (g.t - 1) + ' 階段') + '</span></div></div>'; continue; }
      const open = UI.grOpen === g.k || (UI.grOpen == null && GROW.filter(x => x.g === tab && grOn(x.k))[0] === g);
      h += '<div class="gr-sec' + (open ? ' open' : '') + '"><div class="gr-sh" data-a="grSec" data-v="' + g.k + '">' + g.ic + ' ' + g.n + '<span>' + (open ? '▾' : '▸') + '</span></div>' + (open ? '<div id="gr-scene-' + g.k + '" class="gr-scene">' + grScene(g.k, now) + '</div>' + grBody(g.k) + '<button class="btn ghost bz-help" data-a="grHelp" data-v="' + g.k + '">❓ 怎麼玩</button>' : '') + '</div>';
    }
  }
  const seen = J.grSeen || (J.grSeen = {}), show = UI.grIntro || (tab !== 'route' && UI.grOpenK && grOn(UI.grOpenK) && !seen[UI.grOpenK] ? UI.grOpenK : !seen.welcome ? 'welcome' : null);
  if (show) { const g = GROW.find(x => x.k === show), L = show === 'welcome' ? ['這裡是長期目標：越玩越多新玩法。', '共五個階段，每階段解鎖夠多項，下一階段才會出現。', '「🗺️ 路線」看得到每項的解鎖條件，達成後早上會通知。'] : GR_INTRO[show];
    h += '<div class="bz-intro"><div class="bz-ibox"><b>' + (g ? g.ic + ' ' + g.n : '🌟 成長路線') + '</b><ol>' + L.map(x => '<li>' + x + '</li>').join('') + '</ol><button class="btn" data-a="grIntroOk" data-v="' + show + '">知道了</button></div></div>'; }
  return h;
}
Object.assign(SACT, {
  grOpenHub() { if (!bizAllowed()) return SACT.bzWhy(); UI.wm = 'grow'; UI.rtSel = null; UI.verbs = false; render(); },
  grTab(v) { UI.grTab = v; UI.grOpen = null; const f = GROW.find(g => g.g === v && grOn(g.k)); UI.grOpenK = f && f.k; render(); },
  grSec(k) { UI.grOpen = UI.grOpen === k ? '' : k; UI.grOpenK = k; render(); },
  grGo(k) { const g = GROW.find(x => x.k === k); if (!g || !grOn(k)) { if (g) slog('🔒 ' + g.n + '：' + (tierOpen(g.t) ? g.txt : '先解鎖第 ' + (g.t - 1) + ' 階段') + '。'); render(); return; } UI.grTab = g.g; UI.grOpen = k; UI.grOpenK = k; render(); },
  grIntroOk(k) { (J.grSeen || (J.grSeen = {}))[k] = true; UI.grIntro = null; saveJournal(); render(); },
  grHelp(k) { UI.grIntro = k; render(); }
});
const _wmHTMLGr = wmHTML;
wmHTML = function () {
  if (UI.wm !== 'grow') return _wmHTMLGr();
  if (!bizAllowed()) { UI.wm = null; return _wmHTMLGr(); }
  return '<div class="rt-modal" data-a="wmClose"><div class="rt-mbox wm-box fm-box" data-a="noop"><div class="rt-mh"><div><b>🌟 成長</b></div><button class="btn ghost" data-a="wmClose" style="margin-left:auto">關閉</button></div>' + growModal() + '</div></div>';
};
function grTick(now) { requestAnimationFrame(grTick); if (UI.wm !== 'grow' || !S || !S.sv) return; document.querySelectorAll('[id^=gr-scene-]').forEach(el => { el.innerHTML = grScene(el.id.slice(9), now); }); }
requestAnimationFrame(grTick);
// 入口：經營旁邊的按鈕、我想要、建議
const _rtPanelGr = rtPanel;
rtPanel = function () { return _rtPanelGr().replace('<button class="pill" data-a="bzOpen">🏪 經營</button>', '<button class="pill" data-a="bzOpen">🏪 經營</button><button class="pill" data-a="grOpenHub">🌟 成長</button>'); };
VERBS.splice(8, 0, { k: 'grow', ic: '🌟', n: '成長（研發、魚池、陶藝、夜市、員工…）', kw: '成長 解鎖 研發 食譜 新菜 擺盤 土壤 肥力 季節 雜交 魚 蝦 水耕 陶 碗 盤 蠶 布 夜市 擺攤 評價 員工 家具 升級 裝潢 自動 產線 挑戰 稱號 大師 比賽 品評 獎盃' });
const _verbGr = SACT.verb;
SACT.verb = function (k) { if (k === 'grow') { UI.verbs = false; return SACT.grOpenHub(); } return _verbGr(k); };
const _sugGr = suggestRaw;
suggestRaw = function () {
  const L = _sugGr(); if (!S.sv || !S.sv.w || !S.sv.w.fm || !S.sv.w.fm.gr || !bizAllowed()) return L;
  const gr = GR(), sv = S.sv;
  if (grOn('night') && isNM() && gr.nmDay !== sv.day && sv.hour >= 16 && sv.hour <= 18) L.push({ pri: 58, ic: '🏮', label: '去夜市擺攤', why: '今天是夜市日', gr: 'night' });
  if (grOn('contest') && ctOpen()) L.push({ pri: 64, ic: '🏆', label: '報名品評會', why: '3 天內報名', gr: 'contest' });
  if (gr.pond && gr.fish.some(f => f.age >= 5)) L.push({ pri: 36, ic: '🐟', label: '撈魚', why: '魚長大了', gr: 'fish' });
  const fresh = GROW.find(g => gr.ul[g.k] === sv.day && !(J.grSeen || {})[g.k]); if (fresh) L.push({ pri: 60, ic: fresh.ic, label: '看看新玩法', why: fresh.n + '解鎖了', gr: fresh.k });
  return L.sort((a, b) => b.pri - a.pri).slice(0, 3);
};
const _sugDoGr = SACT.sugDo;
SACT.sugDo = function (i) { const s = suggest()[Number(i)]; if (s && s.gr) { UI.wm = 'grow'; SACT.grGo(s.gr); return; } return _sugDoGr(i); };
// 家具星星：房間裡升級過的家具上方顯示
const _lifeLayerGr = lifeLayer;
lifeLayer = function (now) {
  let s = _lifeLayerGr(now); const sv = S.sv; if (!sv || !sv.w || !sv.w.fm || !sv.w.fm.gr) return s;
  const fu = sv.w.fm.gr.furn, f = (UI.iso && UI.iso.floor) || '1F', P = isoProj(f);
  for (const o of isoObjects()) { const lv = fu[o.k] || 1, p = sv.place[o.id]; if (lv < 2 || !p || p.f !== f) continue; const c = objCenter(o.id); if (!c) continue; const q = P(c.x + 0.4, c.y - (ISO[o.k].d || 1) / 2, 0); s += '<text pointer-events="none" x="' + q[0].toFixed(1) + '" y="' + (q[1] - 2).toFixed(1) + '" font-size="8" fill="#ecd27a" stroke="#1d2733" stroke-width="2" paint-order="stroke">' + '★'.repeat(lv) + '</text>'; }
  return s;
};
// 一開始就檢查一次解鎖（讀檔、永久模式開局）
const _renderGrChk = render;
render = function () { if (S && S.sv && S.phase === 'survive' && S.sv.w && S.sv.w.fm && bizAllowed() && !UI.__grChk) { UI.__grChk = true; const o = growCheck(); o.forEach(t => slog(t)); UI.__grChk = false; } _renderGrChk(); };
