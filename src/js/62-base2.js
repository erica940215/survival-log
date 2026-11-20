/* ================= 格子倉庫與可點擊的據點 ================= */
const STACK = { food: 10, water: 20, power: 4, mat: 10, med: 10, farm: 20 };
const STACK_ONE = { rice: 5, diesel: 2, matpack: 5, pkg: 1 };
const stackOf = k => STACK_ONE[k] || STACK[ITEMS[k].cat] || 10;
function storedUnits() {
  const sv = S.sv, u = {};
  for (const [k, q] of Object.entries(sv.st)) if (k !== 'wu' && ITEMS[k] && ITEMS[k].cat !== 'equip' && q > 0) u[k] = (u[k] || 0) + q;
  for (const f of sv.fresh) u[f.k] = (u[f.k] || 0) + f.q;
  return u;
}
// 倉庫改成「格」：每格放一疊（食物 10、材料 10、柴油 2、米 5……）
storeCap = function () { return 40 + roomN('storage') * 30 + (S.sv.st.shelf || 0) * 20; };
storeWeight = function () { return Object.entries(storedUnits()).reduce((a, [k, q]) => a + Math.ceil(q / stackOf(k)), 0); };
function fitUnits(k, q) {
  if (k === 'wu' || !ITEMS[k] || ITEMS[k].cat === 'equip') return q;
  const cur = storedUnits()[k] || 0, st = stackOf(k);
  const partial = cur ? Math.ceil(cur / st) * st - cur : 0;
  return Math.max(0, Math.min(q, partial + Math.max(0, storeCap() - storeWeight()) * st));
}
RECIPES.shelf = { n: '置物架', need: { board: 4, metal: 1 }, h: 2, out: { shelf: 1 }, base: true, d: '倉庫 +20 格' };

// 房間位置：一樓 0–2、二樓 3–5、地下室 6–8
const FLOOR_OF = ['1F', '1F', '1F', '2F', '2F', '2F', 'B1', 'B1', 'B1'];
function normRooms() {
  const sv = S.sv;
  if (!sv.rooms || sv.rooms.length !== 9) { const old = (sv.rooms || []).filter(Boolean); sv.rooms = Array(9).fill(null); old.forEach((r, i) => { sv.rooms[i] = r; }); }
}
const slotOpen = i => S.sv.floors.includes(FLOOR_OF[i]);
function freeSlotIndex() {
  normRooms();
  if (UI.roomSel != null && slotOpen(UI.roomSel) && !S.sv.rooms[UI.roomSel]) return UI.roomSel;
  return S.sv.rooms.findIndex((r, i) => !r && slotOpen(i));
}
roomSlots = function () { return S.sv.floors.length * 3; };
SACT.buildRoom = function (k) {
  const sv = S.sv, r = ROOMS[k];
  normRooms();
  const slot = freeSlotIndex();
  if (!r || slot < 0 || !Object.entries(r.need).every(([m, n]) => (sv.st[m] || 0) >= n) || !canAct(r.h, staCost(15))) return;
  for (const [m, n] of Object.entries(r.need)) { sv.st[m] -= n; if (!sv.st[m]) delete sv.st[m]; }
  sv.rooms[slot] = k; sv.sta -= staCost(15);
  UI.roomSel = slot;
  slog('在' + ({ '1F': '一樓', '2F': '二樓', 'B1': '地下室' })[FLOOR_OF[slot]] + '蓋好了' + r.n + '：' + r.d + '。');
  passHours(r.h); render();
};
Object.assign(SACT, {
  roomTap(v) { normRooms(); UI.roomSel = Number(v); UI.tab = 'base'; render(); window.scrollTo(0, 0); },
  roomClose() { UI.roomSel = null; render(); },
  demolish(v) {
    const sv = S.sv, i = Number(v); normRooms();
    const k = sv.rooms[i];
    if (!k || !canAct(1)) return;
    for (const [m, n] of Object.entries(ROOMS[k].need)) { const back = Math.floor(n / 2); if (back) sv.st[m] = (sv.st[m] || 0) + back; }
    sv.rooms[i] = null;
    slog('拆掉了' + ROOMS[k].n + '，回收一半材料。');
    passHours(1); render();
  },
  gridSel(k) { UI.gridSel = UI.gridSel === k ? null : k; render(); }
});
function viewRoomPanel() {
  if (UI.roomSel == null || !S.sv) return '';
  normRooms();
  const sv = S.sv, i = UI.roomSel, k = sv.rooms[i];
  const fl = ({ '1F': '一樓', '2F': '二樓', 'B1': '地下室' })[FLOOR_OF[i]];
  let h = '<div class="roompanel"><div class="slot-h"><b class="hand" style="font-size:18px">' + fl + ' 第 ' + (i % 3 + 1) + ' 間</b><button class="btn ghost" data-a="roomClose" style="margin-left:auto">關閉</button></div>';
  if (!slotOpen(i)) h += '<p class="meta">這層還沒擴建。</p>';
  else if (k) {
    const go = { workshop: ['到工作台', 'act'], storage: ['看倉庫', 'store'], greenhouse: ['看作物', 'base'], bedroom: ['去睡覺', 'act'], powerroom: ['看電力', 'base'] }[k];
    h += '<p><b>' + ROOMS[k].n + '</b>：' + ROOMS[k].d + '</p><div class="row-btns" style="margin:4px 0">' +
      (go ? '<button class="btn" data-a="tab" data-v="' + go[1] + '">' + go[0] + '</button>' : '') +
      '<button class="btn ghost" data-a="demolish" data-v="' + i + '"' + (canAct(1) ? '' : ' disabled') + '>拆除（回收一半材料，1 小時）</button></div>';
  } else {
    const st = sv.st;
    h += '<p class="meta">空房間。要蓋什麼？</p><div class="sheet">' + Object.entries(ROOMS).map(([rk, r]) => {
      const ok = Object.entries(r.need).every(([m, n]) => (st[m] || 0) >= n) && canAct(r.h, staCost(15));
      return actRow(r.n, r.d + ' · ' + Object.entries(r.need).map(([m, n]) => ITEMS[m].n + ' ' + (st[m] || 0) + '/' + n).join('、') + ' · ' + r.h + ' 小時', '蓋', 'buildRoom', rk, ok);
    }).join('') + '</div>';
  }
  return h + '</div>';
}
function viewGrid() {
  const u = storedUnits(), cap = storeCap(), cells = [];
  for (const c of CAT_ORDER) for (const [k, q] of Object.entries(u)) {
    if (ITEMS[k].cat !== c) continue;
    let left = q; const s = stackOf(k);
    while (left > 0) { cells.push({ k, q: Math.min(s, left) }); left -= s; }
  }
  const used = cells.length;
  let h = '<div class="cat">倉庫 ' + used + ' / ' + cap + ' 格</div><p class="meta">儲藏室 +30 格、置物架 +20 格（工作台做）。滿了的話，外出帶回來的東西會放不下。點格子看說明。</p><div class="grid">';
  const colors = { food: '#f4d9a0', water: '#bcd6ea', power: '#e8b9a6', mat: '#d6d0c2', med: '#f0b8b8', farm: '#c6dfb5' };
  for (let i = 0; i < Math.max(cap, used); i++) {
    const c = cells[i];
    if (c) h += '<button class="cell' + (UI.gridSel === c.k ? ' sel' : '') + (i >= cap ? ' over' : '') + '" data-a="gridSel" data-v="' + c.k + '" style="background:' + (colors[ITEMS[c.k].cat] || '#ddd') + '" title="' + esc(ITEMS[c.k].n) + '">' + itemIc(c.k, 'cell-ic') + '<span>' + esc(ITEMS[c.k].n.replace(/（.*）/, '').slice(0, 2)) + '</span><b>' + c.q + '</b></button>';
    else h += '<span class="cell empty"></span>';
  }
  h += '</div>';
  if (UI.gridSel && ITEMS[UI.gridSel]) h += '<p class="meta"><b>' + ITEMS[UI.gridSel].n + '</b> ×' + (u[UI.gridSel] || 0) + '：' + ITEMS[UI.gridSel].note + '（每格 ' + stackOf(UI.gridSel) + ' 個）</p>';
  return h;
}
