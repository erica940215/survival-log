/* ================= 體驗與紀錄：深色模式、字體、生涯統計、種子分享、日記圖片、行動排程 ================= */
const UIKEY = 'survival-log-ui';
let UIS = { dark: false, font: 'm' };
try { Object.assign(UIS, JSON.parse(localStorage.getItem(UIKEY) || '{}')); } catch (e) {}
function applyUI() {
  document.documentElement.setAttribute('data-dark', UIS.dark ? '1' : '0');
  document.body.style.zoom = { s: '0.92', m: '1', l: '1.12' }[UIS.font] || '1';
}
function saveUI() { try { localStorage.setItem(UIKEY, JSON.stringify(UIS)); } catch (e) {} applyUI(); }
Object.assign(ACT, {
  dark() { UIS.dark = !UIS.dark; saveUI(); render(); },
  font(v) { UIS.font = v; saveUI(); render(); }
});
function viewUIPrefs() {
  const pill = (a, v, l, on) => '<button class="pill' + (on ? ' on' : '') + '" data-a="' + a + '" data-v="' + v + '">' + l + '</button>';
  return '<div class="cat">顯示</div><div class="setrow"><span>主題</span>' + pill('dark', '', UIS.dark ? '深色' : '淺色', UIS.dark) + '</div>' +
    '<div class="setrow"><span>字體</span>' + pill('font', 's', '小', UIS.font === 's') + pill('font', 'm', '中', UIS.font === 'm') + pill('font', 'l', '大', UIS.font === 'l') + '</div>';
}

/* ---------- 生涯統計 ---------- */
const _commitStats = commitRun;
commitRun = function () {
  const res = S && S.result;
  if (res && !res.committed) {
    const c = J.career = J.career || { runs: 0, days: 0, hordes: 0, kills: 0, trades: 0, crafted: 0, searches: 0, deaths: {} };
    c.runs++; c.days += res.days;
    if (S.sv) { c.hordes += S.sv.hordesSeen || 0; c.kills += S.sv.kills || 0; c.trades += S.sv.trades || 0; c.crafted += S.sv.crafted || 0; c.searches += S.sv.xp || 0; }
    if (res.days < 100) c.deaths[res.cause] = (c.deaths[res.cause] || 0) + 1;
    c.best = Math.max(c.best || 0, res.days);
  }
  _commitStats();
};
function viewCareer() {
  const c = J.career;
  if (!c || !c.runs) return '';
  const top = Object.entries(c.deaths || {}).sort((a, b) => b[1] - a[1]).slice(0, 3);
  return '<details class="guide"><summary>生涯統計</summary><div class="kv">' +
    [['玩過', c.runs + ' 輪'], ['總共撐了', c.days + ' 天'], ['平均', Math.round(c.days / c.runs) + ' 天'], ['最佳', (c.best || 0) + ' 天'], ['經歷屍潮', c.hordes + ' 波'], ['外出殺敵', c.kills + ' 隻'], ['搜刮', c.searches + ' 處'], ['交易', c.trades + ' 次'], ['製作', c.crafted + ' 件']].map(([k, v]) => '<div><div class="k">' + k + '</div><div class="v" style="font-size:16px">' + v + '</div></div>').join('') +
    '</div>' + (top.length ? '<p class="meta">最常的死因：' + top.map(([k, n]) => esc(k) + '（' + n + ' 次）').join('、') + '</p>' : '') + '</details>';
}

/* ---------- 種子挑戰（自訂或分享） ---------- */
const _viewSetupSeed = viewSetup;
viewSetup = function () {
  let h = _viewSetupSeed();
  const s = runSetup(), on = (J.setup || {}).mode === 'seed';
  const pill = '<button class="pill' + (on ? ' on' : '') + '" data-a="setMode" data-v="seed">種子</button>';
  h = h.replace('每日挑戰</button>', '每日挑戰</button>' + pill);
  if (on) {
    const code = (J.setup && J.setup.seed) || '';
    const best = J.daily && J.daily['S:' + code];
    h = h.replace(/<p class="meta">(今天|多 |原本|少 )[^]*?<\/p>/, '');
    const box = '<div class="setrow"><span>種子</span><input id="seed-in" class="seed-in" maxlength="12" value="' + esc(code) + '" placeholder="例如 ABC123"><button class="pill" data-a="seedRandom">隨機</button></div>' +
      '<p class="meta">輸入朋友給你的種子碼，或按「隨機」產生一組分享出去。同一組種子碼，事件、天災、圖紙、屍潮都一樣。普通難度、角色固定、不套用升級、不用掉復活。' + (best != null ? '這組最佳：' + best + ' 天。' : '') + '</p>';
    const i = h.indexOf('<div class="setrow"><span>場景');
    h = i > 0 ? h.slice(0, i) + box + h.slice(i) : h + box;
  }
  return h;
};
const _runSetupSeed = runSetup;
runSetup = function () { const s = _runSetupSeed(); const raw = J.setup || {}; if (raw.mode === 'seed') { s.mode = 'seed'; s.seed = raw.seed || ''; } return s; };
Object.assign(ACT, {
  seedRandom() { const c = Math.random().toString(36).slice(2, 8).toUpperCase(); J.setup = Object.assign(runSetup(), { mode: 'seed', seed: c }); saveJournal(); render(); }
});
$app.addEventListener('input', e => {
  if (e.target.id === 'seed-in') { const v = e.target.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12); J.setup = Object.assign(runSetup(), { mode: 'seed', seed: v }); saveJournal(); }
});
const _startSeed = ACT.start;
ACT.start = function () { const s = runSetup(); if (s.mode === 'seed' && !s.seed) { J.setup = Object.assign(s, { seed: Math.random().toString(36).slice(2, 8).toUpperCase() }); saveJournal(); } _startSeed(); };

/* ---------- 日記做成圖片（長按可存到相簿） ---------- */
function diaryImage() {
  const sv = S.sv, r = S.result;
  const list = (sv && sv.diary) || [];
  const W = 720, lineH = 34, pick = list.length > 24 ? list.slice(0, 4).concat([{ d: '…', t: '……' }], list.slice(-19)) : list;
  const H = 260 + pick.length * lineH + 80;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#f3f0e6'; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(60,90,120,0.09)'; for (let x = 0; x < W; x += 24) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y < H; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  const font = (s, w) => (w || '') + ' ' + s + 'px "LXGW WenKai TC", "Kaiti TC", serif';
  g.fillStyle = '#b8322a'; g.font = font(22); g.fillText('生存日誌', 40, 56);
  g.fillStyle = '#1d2733'; g.font = font(64, '700'); g.fillText(r.days + ' 天', 40, 136);
  g.font = font(24); g.fillText(r.cause + (r.ending ? '　結局「' + ENDINGS[r.ending].n + '」' : ''), 40, 180);
  g.fillStyle = '#5f6873'; g.font = font(18); g.fillText(CHARS[S.char || 'neighbor'].n + ' · ' + DIFFS[S.diff || 'normal'].n + (S.daily ? ' · ' + (S.daily.startsWith('S:') ? '種子 ' + S.daily.slice(2) : '每日挑戰 ' + S.daily) : ''), 40, 214);
  g.strokeStyle = '#1d2733'; g.beginPath(); g.moveTo(40, 232); g.lineTo(W - 40, 232); g.stroke();
  pick.forEach((e, i) => {
    const y = 270 + i * lineH;
    g.fillStyle = '#8a8f96'; g.font = font(16); g.fillText(e.d === '…' ? '' : '第 ' + e.d + ' 天', 40, y);
    g.fillStyle = '#1d2733'; g.font = font(20);
    let t = e.t; while (g.measureText(t).width > W - 190 && t.length > 2) t = t.slice(0, -2) + '…';
    g.fillText(t, 150, y);
  });
  return c.toDataURL('image/png');
}
Object.assign(ACT, { diaryImg() { try { UI.diaryImg = diaryImage(); } catch (e) { UI.diaryImg = ''; } render(); } });
const _viewEndUX = viewEnd;
viewEnd = function () {
  let h = _viewEndUX();
  const r = S.result;
  let add = '<div class="row-btns"><button class="btn ghost" data-a="diaryImg">把這輪做成一張圖</button></div>';
  if (UI.diaryImg) add += '<p class="meta">長按圖片可以存到相簿或分享。</p><img class="diary-img" src="' + UI.diaryImg + '" alt="這一輪的日記">';
  if (S.daily && S.daily.startsWith('S:')) add += '<p class="meta">這局的種子碼：<b class="num">' + esc(S.daily.slice(2)) + '</b>，傳給朋友就能玩一模一樣的開局。</p>';
  const i = h.indexOf('<div class="cat">這一輪的紀錄</div>');
  return i > 0 ? h.slice(0, i) + add + h.slice(i) : h + add;
};
const _startDiary = ACT.start, _menuDiary = ACT.menu;
ACT.start = function () { UI.diaryImg = null; _startDiary(); };
ACT.menu = function () { UI.diaryImg = null; _menuDiary(); };

/* ---------- 行動排程：先排好，再一次執行 ---------- */
const QUEUEABLE = ['cookx', 'reinforce', 'gen', 'pedal', 'plant', 'rest', 'craft', 'wash', 'refine', 'brew', 'juice', 'buildRoom', 'drinkFull', 'eatFull'];
function queueIntercept(a, v) {
  if (!UI.qmode || !S || S.phase !== 'survive' || !QUEUEABLE.includes(a)) return false;
  UI.queue = UI.queue || [];
  if (UI.queue.length < 12) UI.queue.push([a, v]);
  render(); return true;
}
const QNAME = { cookx: v => COOKS[v] ? COOKS[v].n : '煮', reinforce: v => '加固（' + ITEMS[v].n + '）', gen: () => '開發電機', pedal: () => '踩發電機', plant: v => '種' + ITEMS[v].n, rest: () => '休息', craft: v => '做' + RECIPES[v].n, wash: () => '清理', refine: () => '精煉', brew: () => '釀酒', juice: () => '榨汁', buildRoom: v => '蓋' + ROOMS[v].n, drinkFull: () => '喝到滿', eatFull: () => '吃到飽' };
Object.assign(SACT, {
  qmode() { UI.qmode = !UI.qmode; if (!UI.qmode) UI.queue = []; render(); },
  qdel(i) { UI.queue.splice(Number(i), 1); render(); },
  qrun() {
    const q = (UI.queue || []).slice(); UI.queue = []; UI.qmode = false;
    let done = 0;
    for (const [a, v] of q) {
      if (S.phase !== 'survive' || !S.sv || S.sv.out) break;
      const before = JSON.stringify([S.sv.hour, S.sv.sat, S.sv.hyd, S.sv.def, S.sv.power]);
      SACT[a](v);
      if (JSON.stringify([S.sv.hour, S.sv.sat, S.sv.hyd, S.sv.def, S.sv.power]) !== before) done++;
    }
    slog('排程執行完畢：完成 ' + done + '/' + q.length + ' 項' + (done < q.length ? '（有些因為時間、體力或材料不夠沒做）' : '') + '。');
    render();
  }
});
function viewQueue() {
  const sv = S.sv;
  if (sv.out) return '';
  let h = '<div class="qbar"><button class="btn' + (UI.qmode ? ' red' : ' ghost') + '" data-a="qmode">' + (UI.qmode ? '取消排程' : '排程模式') + '</button>';
  if (UI.qmode) h += '<span class="meta">點下面的「做事」按鈕加入排程（最多 12 項）</span>';
  h += '</div>';
  if (UI.qmode && UI.queue && UI.queue.length) {
    h += '<div class="sheet">' + UI.queue.map(([a, v], i) => '<div class="item"><div><div class="nm">' + (i + 1) + '. ' + (QNAME[a] ? QNAME[a](v) : a) + '</div></div><button class="btn ghost" data-a="qdel" data-v="' + i + '">移除</button></div>').join('') + '</div>' +
      '<div class="row-btns"><button class="btn red" data-a="qrun">執行 ' + UI.queue.length + ' 項</button></div>';
  }
  return h;
}

/* ---------- 掛進畫面 ---------- */
const _renderUX = render;
render = function () { applyStyle(); _renderUX(); };
const _viewActsUX = viewActs;
viewActs = function () { const h = _viewActsUX(); return S.sv.out ? h : viewQueue() + h; };
const _viewJournalUX = viewJournal;
viewJournal = function (outside) {
  const h = _viewJournalUX(outside);
  const i = h.indexOf('<details class="guide"><summary>生存圖鑑');
  const extra = viewCareer();
  const withCareer = i >= 0 ? h.slice(0, i) + extra + h.slice(i) : h + extra;
  const j = withCareer.indexOf('<div class="dev">');
  return j >= 0 ? withCareer.slice(0, j) + viewUIPrefs() + withCareer.slice(j) : withCareer + viewUIPrefs();
};
const _sceneUX = sceneSVG;
sceneSVG = function (kind) {
  if (kind !== 'nightmkt') return _sceneUX(kind);
  const b = [60, 150, 240].map(x => '<path d="M' + x + ' 58 L' + (x + 70) + ' 58 L' + (x + 62) + ' 44 L' + (x + 8) + ' 44 Z" fill="' + RED + '" opacity="0.8" stroke="' + INK + '" stroke-width="1.4"/>' + rc(x + 4, 58, 62, 60, PAPER) + '<circle cx="' + (x + 35) + '" cy="36" r="6" fill="' + TAPE + '" stroke="' + INK + '"/>').join('') + ln(40, 30, 320, 30, 1) + tx(180, 20, '夜市', 15);
  return '<div class="scene"><svg viewBox="0 -12 360 134" role="img" aria-label="夜市">' + b + ln(0, 118, 360, 118, 1.6) + '</svg></div>';
};
applyUI();
