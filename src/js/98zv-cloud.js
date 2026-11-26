/* ================= ☁️ 雲端存檔（Supabase，透過 Claude 的 Supabase 連接器） =================
   存的是跟「匯出存檔碼」一樣的 SLOG1 碼。表：public.survival_saves（slot 1~3）。 */
const CLOUD_PROJECT = 'pujvupwghochfklrgvtq';
const CL = { mcp: undefined, st: 'idle', msg: '', list: null, last: 0, busy: false, lastDay: null };
async function clMcp() {
  if (CL.mcp !== undefined) return CL.mcp;
  try { CL.mcp = (window.claude && window.claude.use) ? await window.claude.use('mcp') : null; } catch (e) { CL.mcp = null; }
  return CL.mcp;
}
function clText(p) {
  if (p == null) return '';
  if (typeof p === 'string') return p;
  if (typeof p.result === 'string') return p.result;
  if (Array.isArray(p.content)) return p.content.map(c => c.text || '').join('\n');
  return JSON.stringify(p);
}
function clRows(p) {
  let t = clText(p);
  const m = t.match(/<untrusted-data-[^>]+>\s*([\s\S]*?)\s*<\/untrusted-data/);
  if (m) t = m[1];
  else { const i = t.indexOf('['), j = t.lastIndexOf(']'); if (i >= 0 && j > i) t = t.slice(i, j + 1); }
  try { const r = JSON.parse(t); return Array.isArray(r) ? r : []; } catch (e) { return []; }
}
async function clSql(q) {
  const m = await clMcp(); if (!m) throw Object.assign(new Error('這裡連不到雲端（要在 Claude 裡打開遊戲，並允許使用 Supabase 連接器）。'), { code: 'nomcp' });
  const r = await m.callTool('Supabase', 'execute_sql', { project_id: CLOUD_PROJECT, query: q });
  return clRows(r && r.payload !== undefined ? r.payload : r);
}
const clSafe = s => /^SLOG1:[A-Za-z0-9+/=]+$/.test(s);
/* ===== 玩家檔案 ===== */
const PL_KEY = 'survival-log-player', OWN_KEY = 'survival-log-owner';
let PL = null; try { PL = JSON.parse(localStorage.getItem(PL_KEY) || 'null'); } catch (e) {}
const sq = v => "'" + String(v).replace(/'/g, "''") + "'";
const plWho = () => PL ? '(select id from public.survival_players where id = ' + Number(PL.id) + ' and token = ' + sq(PL.tok) + ')' : 'null';
const nameOk = n => /^[A-Za-z0-9_\u4e00-\u9fff]{2,16}$/.test(n);
function clearLocal() { for (const n of [1, 2, 3]) { localStorage.removeItem(jkeyOf(n)); localStorage.removeItem(rkeyOf(n)); } J = loadJournal(); SAVED = loadSavedRun(); }
async function upAll(quiet) { for (const n of [1, 2, 3]) if (encodeSave(n)) await cloudUp(n, true); }
async function downAll() {
  const r = await clSql('select slot, code from public.survival_saves where player_id = ' + plWho() + ';');
  for (const row of r) if (clSafe(row.code)) { const d = decodeSave(row.code); if (d.j) localStorage.setItem(jkeyOf(row.slot), JSON.stringify(d.j)); if (d.r) localStorage.setItem(rkeyOf(row.slot), JSON.stringify(d.r)); }
  J = loadJournal(); SAVED = loadSavedRun(); return r.length;
}
async function plEnter(row, isNew) {
  const owner = localStorage.getItem(OWN_KEY);
  if (owner && owner !== String(row.id) && PL && String(PL.id) === owner) await upAll(true);
  const keepLocal = !owner || owner === String(row.id);
  PL = { id: row.id, name: row.name, tok: row.token }; localStorage.setItem(PL_KEY, JSON.stringify(PL));
  if (!keepLocal) clearLocal();
  localStorage.setItem(OWN_KEY, String(row.id));
  if (keepLocal) { await upAll(true); }
  const n = await downAll();
  UI.plMsg = ''; UI.plSkip = false; CL.list = null; CL.msg = (isNew ? '🎉 歡迎，' : '👋 歡迎回來，') + row.name + '！' + (n ? '已載入你雲端的 ' + n + ' 個存檔。' : ''); render();
}
Object.assign(ACT, {
  plLogin(v) {
    const name = (document.getElementById('pl-name') || {}).value || '', pw = (document.getElementById('pl-pw') || {}).value || '', reg = v === 'reg';
    if (!nameOk(name.trim())) { UI.plMsg = '帳號要 2～16 個字（中英文、數字、底線）。'; render(); return; }
    if (pw.length < 4) { UI.plMsg = '密碼至少 4 個字。'; render(); return; }
    UI.plMsg = reg ? '註冊中……' : '登入中……'; UI.plName = name.trim(); render();
    const tok = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');
    const q = reg
      ? 'insert into public.survival_players (name, pw_hash, token, last_login) values (' + sq(name.trim()) + ', crypt(' + sq(pw) + ", gen_salt('bf')), " + sq(tok) + ', now()) on conflict (name) do nothing returning id, name, token;'
      : 'update public.survival_players set token = ' + sq(tok) + ', last_login = now() where name = ' + sq(name.trim()) + ' and pw_hash = crypt(' + sq(pw) + ', pw_hash) returning id, name, token;';
    clSql(q).then(r => { if (!r.length) { UI.plMsg = reg ? '這個帳號已經有人用了，換一個，或直接登入。' : '帳號或密碼不對。'; render(); return; } return plEnter(r[0], reg); })
      .catch(e => { UI.plMsg = '連線失敗：' + e.message; render(); });
  },
  plLogout() {
    const done = () => { UI.plMsg = ''; clearLocal(); localStorage.removeItem(OWN_KEY); localStorage.removeItem(PL_KEY); PL = null; CL.list = null; CL.msg = '已登出，這台裝置的存檔已清空（都在雲端）。'; render(); };
    UI.plMsg = '登出前先把存檔傳上雲端……'; render();
    upAll(true).then(() => clSql('update public.survival_players set token = null where id = ' + Number(PL.id) + ' and token = ' + sq(PL.tok) + ';')).then(done, done);
  },
  plSkip() { UI.plSkip = true; render(); }, plShow() { UI.plSkip = false; render(); }
});
function clInfo(n) { try { const r = JSON.parse(localStorage.getItem(rkeyOf(n)) || 'null'); const s = r && r.S; return s ? { day: s.sv ? s.sv.day : 0, mode: s.mods && s.mods.forever ? 'forever' : 'normal' } : { day: 0, mode: '' }; } catch (e) { return { day: 0, mode: '' }; } }
async function cloudUp(n, quiet) {
  if (!PL) return;
  if (CL.busy) return; const code = encodeSave(n); if (!code || !clSafe(code)) { if (!quiet) { CL.msg = '存檔 ' + n + ' 是空的，沒東西可以上傳。'; render(); } return; }
  CL.busy = true; CL.st = 'up'; if (!quiet) render();
  try {
    const inf = clInfo(n);
    await clSql("insert into public.survival_saves (player_id, slot, code, day, mode, updated_at) select " + plWho() + ", " + Number(n) + ", '" + code + "', " + Number(inf.day || 0) + ", '" + (inf.mode === 'forever' ? 'forever' : 'normal') + "', now() where " + plWho() + " is not null on conflict (player_id, slot) do update set code = excluded.code, day = excluded.day, mode = excluded.mode, updated_at = now();");
    CL.st = 'ok'; CL.last = Date.now(); CL.msg = '☁️ 存檔 ' + n + ' 已上傳（' + new Date().toTimeString().slice(0, 5) + '）'; CL.list = null;
  } catch (e) { CL.st = 'err'; CL.msg = '上傳失敗：' + (e.code === 'nomcp' ? e.message : (e.message || '連不上雲端')); }
  CL.busy = false; render();
}
async function cloudList() {
  try { CL.list = await clSql('select slot, day, mode, updated_at from public.survival_saves where player_id = ' + plWho() + ' order by slot;'); CL.st = CL.st === 'err' ? 'idle' : CL.st; }
  catch (e) { CL.list = []; CL.st = 'err'; CL.msg = e.message; }
  render();
}
async function cloudDown(n) {
  if (CL.busy) return; CL.busy = true; CL.msg = '下載中……'; render();
  try {
    const r = await clSql('select code from public.survival_saves where player_id = ' + plWho() + ' and slot = ' + Number(n) + ';');
    if (!r.length || !clSafe(r[0].code)) throw new Error('雲端沒有存檔 ' + n + '。');
    const d = decodeSave(r[0].code);
    if (d.j) localStorage.setItem(jkeyOf(n), JSON.stringify(d.j)); else localStorage.removeItem(jkeyOf(n));
    if (d.r) localStorage.setItem(rkeyOf(n), JSON.stringify(d.r)); else localStorage.removeItem(rkeyOf(n));
    if (n === SLOT) { J = loadJournal(); SAVED = loadSavedRun(); }
    CL.msg = '✅ 已把雲端的存檔 ' + n + ' 下載到這台裝置。'; CL.st = 'ok';
  } catch (e) { CL.msg = '下載失敗：' + e.message; CL.st = 'err'; }
  CL.busy = false; render();
}
Object.assign(ACT, {
  clUp(v) { cloudUp(Number(v)); }, clDown(v) { UI.clConfirm = Number(v); render(); },
  clDownOk(v) { UI.clConfirm = null; cloudDown(Number(v)); }, clCancel() { UI.clConfirm = null; render(); },
  clRefresh() { CL.list = null; cloudList(); }
});
Object.assign(SACT, { clUpNow() { if (typeof persistRun === 'function') persistRun(); cloudUp(SLOT); } });

/* 標題畫面：雲端存檔面板 */
const _viewTitleCl = viewTitle;
viewTitle = function () {
  const h = _viewTitleCl();
  let p = '<div class="cl-box">';
  if (!PL) {
    if (UI.plSkip) p += '<div class="cl-h"><b>👤 沒有登入</b><button class="btn ghost" data-a="plShow">登入／註冊</button></div><p class="meta">存檔只在這台裝置。登入後可以雲端備份、換裝置接著玩。</p>';
    else p += '<div class="cl-h"><b>👤 玩家登入</b></div><p class="meta">每個玩家有自己的存檔，存在雲端，換裝置登入就能接著玩。</p>' +
      '<div class="pl-form"><input id="pl-name" placeholder="帳號（2～16 字）" autocomplete="username" value="' + esc(UI.plName || '') + '"><input id="pl-pw" type="password" placeholder="密碼（至少 4 字）" autocomplete="current-password"></div>' +
      '<div class="row-btns"><button class="btn" data-a="plLogin" data-v="in">登入</button><button class="btn ghost" data-a="plLogin" data-v="reg">註冊新玩家</button><button class="btn ghost" data-a="plSkip">先不登入</button></div>' +
      (UI.plMsg ? '<p class="meta cl-msg">' + esc(UI.plMsg) + '</p>' : '') + (CL.msg ? '<p class="meta cl-msg">' + esc(CL.msg) + '</p>' : '') +
      (localStorage.getItem(OWN_KEY) ? '' : '<p class="meta">第一次登入時，這台裝置現有的存檔會歸到你的帳號。</p>');
  } else {
    if (CL.list === null && CL.st !== 'listing') { CL.st = 'listing'; setTimeout(cloudList, 0); }
    const L = CL.list || [], byS = {}; L.forEach(r => { byS[r.slot] = r; });
    p += '<div class="cl-h"><b>👤 ' + esc(PL.name) + ' 的雲端存檔</b><span class="cl-btns"><button class="btn ghost" data-a="clRefresh">重新整理</button><button class="btn ghost" data-a="plLogout">登出</button></span></div>';
    if (CL.list === null) p += '<p class="meta">讀取雲端中……</p>';
    else for (const n of [1, 2, 3]) {
      const c = byS[n], loc = clInfo(n), t = c ? new Date(c.updated_at) : null, newer = c && loc.day < (c.day || 0);
      p += '<div class="cl-row"><div><b>存檔 ' + n + '</b><span class="meta">本機：' + (loc.day ? '第 ' + loc.day + ' 天' : '空的') + ' · 雲端：' + (c ? '第 ' + (c.day || 0) + ' 天' + (c.mode === 'forever' ? '（永久）' : '') + ' · ' + (t.getMonth() + 1) + '/' + t.getDate() + ' ' + t.toTimeString().slice(0, 5) : '沒有') + '</span>' + (newer ? '<span class="cl-new">雲端比較新</span>' : '') + '</div><div class="cl-btns">' +
        '<button class="btn ghost" data-a="clUp" data-v="' + n + '"' + (encodeSave(n) ? '' : ' disabled') + '>⬆ 上傳</button><button class="btn' + (newer ? '' : ' ghost') + '" data-a="clDown" data-v="' + n + '"' + (c ? '' : ' disabled') + '>⬇ 下載</button></div></div>';
      if (UI.clConfirm === n) p += '<div class="cl-confirm">⚠️ 會用雲端的存檔<b>覆蓋</b>這台裝置的存檔 ' + n + '，確定嗎？<div class="row-btns"><button class="btn red" data-a="clDownOk" data-v="' + n + '">確定下載</button><button class="btn ghost" data-a="clCancel">取消</button></div></div>';
    }
    if (UI.plMsg) p += '<p class="meta cl-msg">' + esc(UI.plMsg) + '</p>';
    if (CL.msg) p += '<p class="meta cl-msg' + (CL.st === 'err' ? ' err' : '') + '">' + esc(CL.msg) + '</p>';
    p += '<p class="meta">玩的時候每天早上、每 5 分鐘自動上傳。登出會先上傳，再清空這台裝置的存檔。</p>';
  }
  p += '</div>';
  const i = h.indexOf('<div class="cat">開局設定</div>');
  return i >= 0 ? h.slice(0, i) + p + h.slice(i) : h + p;
};

/* 遊戲中：自動上傳＋狀態按鈕 */
setInterval(() => { if (PL && S && S.phase === 'survive' && S.sv && Date.now() - CL.last > 5 * 60 * 1000 && CL.st !== 'err') cloudUp(SLOT, true); }, 60 * 1000);
const _nightCl = night;
night = function (w) { const d0 = S && S.sv && S.sv.day; _nightCl(w); if (S && S.sv && S.sv.day !== d0) setTimeout(() => { if (typeof persistRun === 'function') persistRun(); cloudUp(SLOT, true); }, 1500); };
const _rtPanelCl = rtPanel;
rtPanel = function () {
  if (!PL) return _rtPanelCl();
  const ic = CL.busy ? '⏳' : CL.st === 'err' ? '⚠️' : CL.last ? '☁️' : '☁️';
  const t = CL.last ? new Date(CL.last).toTimeString().slice(0, 5) : '未同步';
  return _rtPanelCl().replace('<div class="wm-chips">', '<div class="wm-chips"><button class="pill cl-pill' + (CL.st === 'err' ? ' err' : '') + '" data-a="clUpNow" title="' + esc(CL.msg || '') + '">' + ic + ' ' + (CL.st === 'err' ? '同步失敗' : t) + '</button>');
};
