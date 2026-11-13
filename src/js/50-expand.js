/* ================= 擴充：據點擴建、加工、防禦等級、熟練度、結局、無盡 ================= */
const ROOMS = {
  storage:    { n: '儲藏室', need: { board: 3, plastic: 1 }, h: 2, d: '倉庫容量 +150kg' },
  greenhouse: { n: '溫室', need: { glass: 4, board: 2 }, h: 3, d: '4 個不用電的種植格，產量和種植箱一樣' },
  workshop:   { n: '工坊', need: { metal: 3, board: 2 }, h: 3, d: '製作時間 -1 小時（最少 1 小時）' },
  bedroom:    { n: '臥室', need: { board: 4 }, h: 2, d: '睡覺體力 +10，每天心態 +3' },
  powerroom:  { n: '發電室', need: { metal: 2, plastic: 2 }, h: 2, d: '發電機、太陽能、人力發電多 20%' }
};
const FLOORS = {
  '2F': { n: '二樓', need: { board: 6, metal: 4 }, h: 4 },
  'B1': { n: '地下室', need: { metal: 6, board: 4 }, h: 4 }
};
const DEF_LV = [0, 10, 30, 60];
const CRAFT_LV = [0, 5, 12];
const lvOf = (v, t) => t.filter(x => v >= x).length;
const CLUES = {
  lab: '學校實驗室的筆記：「自來水檢驗異常，含有未知菌株，已通報市府……沒有回音。」',
  server: '科技公司機房的伺服器還在跑，日誌寫著：「淨水計畫 B 階段：投放完成。」',
  rec: '醫院檔案室的錄音筆：「第一批病人都住在同一個供水區。科技公司的人把病歷全部帶走了。」'
};
const ENDINGS = {
  dawn: { n: '黎明', d: '你、Zoe 和倉庫經理一起把證據交給軍方。科技公司高層被逮捕，城市開始重建。' },
  truth: { n: '真相', d: '你用無線電把證據送出去。新聞終於報導了災難的真相，但你是獨自一人等到救援。' },
  community: { n: '街坊', d: '你們從互相求助變成一個小小的社區。救援直升機來時，你們一起離開。' },
  alone: { n: '獨自倖存', d: '一百天後，救援直升機的聲音從遠方傳來。你活下來了，但不知道這一切為什麼會發生。' }
};

function m6Init(sv) {
  sv.floors = ['1F']; sv.rooms = []; sv.defXp = 0; sv.crafted = 0; sv.clues = []; sv.endless = false;
}
const roomN = k => (S.sv.rooms || []).filter(r => r === k).length;
const defLv = () => lvOf(S.sv.defXp || 0, DEF_LV);
const craftLv = () => lvOf(S.sv.crafted || 0, CRAFT_LV);
const powerMul = () => roomN('powerroom') ? 1.2 : 1;
function storeCap() { return 200 + roomN('storage') * 150; }
function storeWeight() { const st = S.sv.st; return Object.entries(st).reduce((a, [k, q]) => a + (k === 'wu' || !ITEMS[k] || ITEMS[k].cat === 'equip' ? 0 : ITEMS[k].w * q), 0); }
function craftHours(h) { return Math.max(1, h - (roomN('workshop') ? 1 : 0) - (craftLv() >= 3 ? 1 : 0)); }
function craftSta(h) { return Math.round(staCost(8 * h) * (craftLv() >= 2 ? 0.75 : 1)); }
function roomSlots() { return S.sv.floors.length * 3; }

Object.assign(SACT, {
  buildFloor(k) {
    const sv = S.sv, f = FLOORS[k];
    if (!f || sv.floors.includes(k) || !Object.entries(f.need).every(([m, n]) => (sv.st[m] || 0) >= n) || !canAct(f.h, staCost(30))) return;
    for (const [m, n] of Object.entries(f.need)) { sv.st[m] -= n; if (!sv.st[m]) delete sv.st[m]; }
    sv.floors.push(k); sv.sta -= staCost(30);
    slog('花了 ' + f.h + ' 小時打通了' + f.n + '，多了 3 個房間位置。', true);
    chron(sv.day, '擴建' + f.n + '。', 'good');
    passHours(f.h); render();
  },
  buildRoom(k) {
    const sv = S.sv, r = ROOMS[k];
    if (!r || sv.rooms.length >= roomSlots() || !Object.entries(r.need).every(([m, n]) => (sv.st[m] || 0) >= n) || !canAct(r.h, staCost(15))) return;
    for (const [m, n] of Object.entries(r.need)) { sv.st[m] -= n; if (!sv.st[m]) delete sv.st[m]; }
    sv.rooms.push(k); sv.sta -= staCost(15);
    slog('蓋好了' + r.n + '：' + r.d + '。');
    passHours(r.h); render();
  },
  brew() {
    const sv = S.sv;
    const fruits = ['tomato_p', 'straw_p'];
    if (!(sv.st.brewer > 0) || fruits.reduce((a, k) => a + sv_has(k), 0) < 3 || !canAct(2, staCost(5))) return;
    takeFrom(fruits, 3); sv.st.alcohol = (sv.st.alcohol || 0) + 1; sv.sta -= staCost(5);
    slog('釀出一瓶高度酒。可以拿來做燃燒瓶。');
    passHours(2); render();
  },
  endless() {
    if (!S.result || !S.result.canEndless) return;
    S.sv.endless = true; S.phase = 'survive'; S.result = null;
    slog('你決定留下來。屍潮還會一波比一波強，看你能撐多久。', true);
    chron(S.sv.day, '進入無盡模式。');
    render(); window.scrollTo(0, 0);
  }
});

function pickEnding(sv) {
  const saved = (sv.zoe.state === 'saved' ? 1 : 0) + (sv.mgr.state === 'saved' ? 1 : 0);
  const truth = sv.clues.length >= 3;
  if (truth && saved >= 2) return 'dawn';
  if (truth) return 'truth';
  if (saved >= 1) return 'community';
  return 'alone';
}

function viewBuild() {
  const sv = S.sv, st = sv.st;
  const has = need => Object.entries(need).every(([m, n]) => (st[m] || 0) >= n);
  const needTxt = need => Object.entries(need).map(([m, n]) => ITEMS[m].n + ' ' + (st[m] || 0) + '/' + n).join('、');
  let h = '<div class="cat">據點擴建（' + sv.floors.map(f => f === '1F' ? '一樓' : FLOORS[f].n).join('、') + '）</div>';
  h += '<p class="empty">房間 ' + sv.rooms.length + '/' + roomSlots() + '：' + (sv.rooms.length ? sv.rooms.map(r => ROOMS[r].n).join('、') : '還沒蓋') + ' · 倉庫 ' + Math.round(storeWeight()) + '/' + storeCap() + 'kg</p><div class="sheet">';
  for (const [k, f] of Object.entries(FLOORS)) if (!sv.floors.includes(k)) h += actRow('擴建' + f.n, '+3 個房間位置 · ' + needTxt(f.need) + ' · ' + f.h + ' 小時 · 體力 -' + staCost(30), '擴建', 'buildFloor', k, has(f.need) && canAct(f.h, staCost(30)));
  for (const [k, r] of Object.entries(ROOMS)) h += actRow('蓋' + r.n + (roomN(k) ? '<span class="tag green">已有 ' + roomN(k) + '</span>' : ''), r.d + ' · ' + needTxt(r.need) + ' · ' + r.h + ' 小時', '蓋', 'buildRoom', k, sv.rooms.length < roomSlots() && has(r.need) && canAct(r.h, staCost(15)));
  h += '</div>';
  return h;
}
