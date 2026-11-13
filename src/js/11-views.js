/* ================= 畫面 ================= */
function render() {
  if (!S) { $app.innerHTML = viewTitle(); return; }
  if (S.phase === 'survive') { renderSurvive(); return; }
  if (S.phase === 'end') { $app.innerHTML = viewEnd(); return; }
  const left = OUTBREAK - S.t;
  const cap = capacity(), w = carried();
  const store = STORES[S.loc];
  let body = '';
  if (UI.tab === 'here') body = viewHere();
  else if (UI.tab === 'map') body = viewMap();
  else if (UI.tab === 'inv') body = viewInv();
  else body = viewJournal(false);
  body = tip(UI.tab === 'map' ? 'map' : 'prep') + body;
  $app.innerHTML =
    '<header class="status"><div class="status-in">' +
      '<div class="stamp' + (left <= 60 ? ' urgent' : '') + '"><div class="lbl">距離爆發</div><div class="big">' + dur(left) + '</div></div>' +
      '<div class="meters">' +
        '<div class="row"><span><span class="k">時間</span> <b class="num">' + clock(S.t) + '</b></span><span><span class="k">現金</span> <b class="num">' + money(S.money) + '</b></span></div>' +
        '<div class="row"><span class="k">' + (S.car ? '背包＋車廂' : '背包') + '</span><span class="num">' + kg(w) + ' / ' + cap + 'kg</span></div>' +
        '<div class="bar' + (w >= cap - 0.01 ? ' full' : '') + '"><i style="width:' + Math.min(100, w / cap * 100) + '%"></i></div>' +
      '</div></div></header>' +
    '<main class="wrap">' +
      '<div class="ticker">' + S.log.slice(0, 3).map(l => '<p class="' + (l.alert ? 'alert' : '') + '">' + esc(l.txt) + '</p>').join('') + '</div>' +
      (UI.tab === 'here' ? sceneSVG(S.loc) : '') +
      '<div class="place"><h2>' + esc(store.n) + '</h2><span class="sub">' + (store.closes ? (isOpen(S.loc, S.t) ? '營業到 ' + clock(store.closes) : '已關門') : '') + '</span></div>' +
      body +
    '</main>' +
    '<nav class="tabs" role="tablist">' +
      tabBtn('here', '這裡') + tabBtn('map', '地圖') + tabBtn('inv', '物資') + tabBtn('journal', '日誌') +
    '</nav>';
}
function tabBtn(id, label) { return '<button role="tab" aria-selected="' + (UI.tab === id) + '" data-a="tab" data-v="' + id + '">' + label + '</button>'; }

function viewHere() {
  const id = S.loc, st = STORES[id];
  let h = '<p class="sub" style="margin:0 0 10px;color:var(--muted)">' + esc(st.desc) + '</p>';
  if (id === 'home') {
    h += '<div class="cat">收舊家具的阿姨</div><div class="sheet">' +
      FURNITURE.map(f => '<div class="item"><div><div class="nm">' + f.n + '</div><div class="meta">賣掉要 5 分鐘</div></div>' +
        '<div class="price">' + money(f.p) + '</div><div class="ctrl"><button class="btn ghost" data-a="sell" data-v="' + f.id + '"' + (S.sold[f.id] ? ' disabled' : '') + '>' + (S.sold[f.id] ? '已賣出' : '賣掉') + '</button></div></div>').join('') +
      '</div>';
    h += '<div class="cat">手機</div><div class="sheet"><div class="item"><div><div class="nm">快速貸款</div><div class="meta">一次 $500，不花時間</div></div><div class="price">+$500</div>' +
      '<div class="ctrl"><button class="btn ghost" data-a="loan"' + (S.loan ? ' disabled' : '') + '>' + (S.loan ? '已借' : '借錢') + '</button></div></div></div>';
    h += '<div class="row-btns"><button class="btn red" data-a="wait">鎖門，直接等到 18:00</button></div>';
    return h;
  }
  if (id === 'cars') {
    const open = isOpen('cars', S.t);
    h += '<div class="sheet"><div class="item"><div><div class="nm">二手小車</div><div class="meta">移動時間約減半 · 後車廂 +80kg · 買賣各花 10 分鐘</div></div><div class="price">' + (S.car ? '+$450' : '$500') + '</div><div class="ctrl">' +
      (S.car ? '<button class="btn ghost" data-a="sellCar"' + (open ? '' : ' disabled') + '>賣回車行</button>'
             : '<button class="btn" data-a="buyCar"' + (open && S.money >= 500 ? '' : ' disabled') + '>買下</button>') +
      '</div></div></div>';
    return h;
  }
  const open = isOpen(id, S.t);
  if (!open) return h + '<p class="empty">已經關門了。去別的地方吧。</p>';
  const items = Object.keys(st.items);
  for (const cat of CAT_ORDER) {
    const ks = items.filter(k => ITEMS[k].cat === cat);
    if (!ks.length) continue;
    h += '<div class="cat">' + CAT_NAMES[cat] + '</div><div class="sheet">';
    for (const k of ks) {
      const it = ITEMS[k], p = price(id, k), base = st.items[k][0], stock = S.stock[id][k];
      const q = UI.qty[k] || 1;
      const blocked = stock <= 0 || (it.cat === 'equip' && !deliveryOk());
      const pcls = p === 0 ? 'free' : p > base ? 'up' : '';
      h += '<div class="item"><div><div class="nm">' + it.n +
        (stock <= 0 ? '<span class="tag red">售完</span>' : '') +
        (it.cat === 'equip' && !deliveryOk() ? '<span class="tag red">送不到</span>' : '') +
        '</div><div class="meta">' + it.note + (it.w ? ' · ' + kg(it.w) : '') + ' · 剩 ' + stock + '</div></div>' +
        '<div class="price ' + pcls + '">' + (p === 0 ? '免費' : money(p)) + '</div>' +
        '<div class="ctrl"><span class="step"><button data-a="qty" data-v="' + k + ':-1" aria-label="減少">−</button><input class="qty-in" type="number" inputmode="numeric" min="1" max="99" id="qty-' + k + '" data-qty="' + k + '" value="' + q + '" aria-label="' + it.n + ' 數量"><button data-a="qty" data-v="' + k + ':1" aria-label="增加">＋</button></span>' +
        '<button class="btn ghost" data-a="qty" data-v="' + k + ':max">全部</button>' +
        '<button class="btn" data-a="buy" data-v="' + k + '"' + (blocked ? ' disabled' : '') + '>' + (p === 0 ? '拿' : '買') + '</button></div></div>';
    }
    h += '</div>';
  }
  h += '<p class="empty">每次結帳花 2 分鐘。按「全部」會在錢、庫存、負重允許內買到最多。</p>';
  return h;
}

function viewMap() {
  const pts = STORE_ORDER.map(id => ({ id, x: 70 + (STORES[id].x + 3) * 62, y: 40 + (STORES[id].y + 1) * 52 }));
  const cur = pts.find(p => p.id === S.loc) || pts[0];
  let svg = '<svg viewBox="0 0 640 300" role="img" aria-label="城市地圖">';
  for (const p of pts) if (p.id !== S.loc) svg += '<line x1="' + cur.x + '" y1="' + cur.y + '" x2="' + p.x + '" y2="' + p.y + '" stroke="#1d2733" stroke-opacity="0.18" stroke-dasharray="4 5"/>';
  for (const p of pts) {
    const here = p.id === S.loc, closed = STORES[p.id].closes && !isOpen(p.id, S.t);
    svg += '<g><circle cx="' + p.x + '" cy="' + p.y + '" r="' + (here ? 11 : 8) + '" fill="' + (here ? '#b8322a' : closed ? '#c6c1b2' : '#1d2733') + '"/>' +
      '<text x="' + p.x + '" y="' + (['conv', 'pharm', 'mart', 'farm'].includes(p.id) ? p.y + 32 : p.y - 18) + '" text-anchor="middle" font-size="21" font-family="LXGW WenKai TC, serif" fill="#1d2733">' + STORES[p.id].n + '</text></g>';
  }
  svg += '</svg>';
  let h = '<div class="sheet map">' + svg + '</div><div class="cat">前往</div><div class="sheet">';
  const dests = STORE_ORDER.filter(id => id !== S.loc).map(id => ({ id, tt: travelTime(S.loc, id) })).sort((a, b) => a.tt - b.tt);
  for (const d of dests) {
    const arrive = S.t + d.tt, st = STORES[d.id];
    const late = arrive >= OUTBREAK;
    const backHome = d.id === 'home' ? 0 : travelTime(d.id, 'home');
    const closed = st.closes && arrive >= st.closes;
    let meta = d.tt + ' 分鐘 · ' + clock(arrive) + ' 抵達';
    if (late) meta += ' · <b>到之前就爆發了</b>';
    else if (closed) meta += ' · <b>到時已關門</b>';
    else if (d.id !== 'home' && arrive + backHome >= OUTBREAK) meta += ' · <b>來不及回家</b>';
    else if (d.id !== 'home') meta += ' · 回家 ' + backHome + ' 分';
    const known = J.stores[d.id] && st.items ? '<div class="meta">日誌：' + Object.keys(st.items).map(k => ITEMS[k].n).join('、') + '</div>' : '';
    h += '<div class="dest"><div><b>' + st.n + '</b><div class="meta">' + meta + '</div>' + known + '</div>' +
      '<button class="btn' + (late ? ' red' : '') + '" data-a="go" data-v="' + d.id + '">前往</button></div>';
  }
  h += '</div>';
  if (S.car) h += '<p class="empty">開車中：移動時間約減半。</p>';
  return h;
}

function summarize(bag) {
  const g = k => bag[k] || 0;
  return {
    meals: g('rice') * 8 + g('biscuit') * 3 + g('sausage') + g('noodle') + g('can') * 1.5 + g('veg') * 2 + g('choco') * 0.5,
    water: g('water') * 3 + g('barrel') * 5,
    def: 10 + g('door') * 60 + Math.min(g('window'), 2) * 30 + g('board') * 4 + g('metal') * 6 + g('glass') * 3,
    power: (g('gen') ? g('diesel') * 6 : 0) + g('battery') * 10
  };
}
function bagList(bag) {
  const ks = Object.keys(bag);
  if (!ks.length) return '<p class="empty">空的。</p>';
  return '<div class="sheet">' + CAT_ORDER.flatMap(c => ks.filter(k => ITEMS[k].cat === c)).map(k =>
    '<div class="item"><div><div class="nm">' + ITEMS[k].n + '</div><div class="meta">' + ITEMS[k].note + '</div></div><div class="price">×' + bag[k] + '</div></div>').join('') + '</div>';
}
function viewInv() {
  const all = {};
  for (const [k, q] of Object.entries(S.home)) add(all, k, q);
  const sm = summarize(S.home);
  let h = '<div class="cat">家裡（爆發時算這些）</div>' +
    '<div class="kv"><div><div class="k">食物</div><div class="v' + (sm.meals < 20 ? ' bad' : '') + '">' + Math.round(sm.meals) + ' 餐</div></div>' +
    '<div><div class="k">飲水</div><div class="v' + (sm.water < 10 ? ' bad' : '') + '">' + sm.water + ' 天</div></div>' +
    '<div><div class="k">防禦值</div><div class="v' + (sm.def < 40 ? ' bad' : '') + '">' + sm.def + '</div></div>' +
    '<div><div class="k">備用電力</div><div class="v">' + sm.power + ' 度</div></div></div>' +
    bagList(S.home) +
    '<div class="cat">身上（回家才會卸下）</div>' + bagList(S.carry);
  return h;
}

function viewJournal(outside) {
  let h = '';
  const evs = EVENTS.filter(e => !e.silentJournal && J.events[e.id]);
  h += '<div class="cat">記下的事件</div>';
  h += evs.length ? '<ul class="list note">' + evs.map(e => '<li>' + esc(e.txt) + '</li>').join('') + '</ul>' : '<p class="empty">還沒有。經歷過的事會記在這裡，下一輪就能提前準備。</p>';
  const tips = [];
  if (J.hordesSeen) tips.push('屍潮時程：' + HORDES.slice(0, J.hordesSeen).map(x => '第 ' + x[0] + ' 天（' + x[1] + '）').join('、') + (J.hordesSeen < HORDES.length ? '……之後更強' : ''));
  if (J.tips.coldKnown) tips.push('第 ' + COLD[0] + '–' + COLD[1] + ' 天有寒潮，沒取暖每天掉血。');
  if (J.tips.rainKnown) tips.push('第 40 天後有連日陰雨，太陽能靠不住。');
  if (J.tips.water) tips.push('水撐不久：一箱只夠 3 天，而且很重。');
  if (J.tips.food) tips.push('食物要算到「每天 2 餐」，種菜可以補後期。');
  if (J.tips.horde) tips.push('防禦值要跟得上屍潮強度，大門和防彈窗最有效。');
  if (J.tips.outside) tips.push('18:00 前一定要在家，地圖會標出「來不及回家」。');
  if (J.tips.ambush) tips.push('外出時注意暴露值，天黑後漲兩倍，七八成就該回家。');
  h += '<div class="cat">生存心得</div>';
  h += tips.length ? '<ul class="list note">' + tips.map(t => '<li>' + esc(t) + '</li>').join('') + '</ul>' : '<p class="empty">死過一次就會有心得。</p>';
  const known = STORE_ORDER.filter(id => J.stores[id] && STORES[id].items);
  if (known.length) {
    h += '<div class="cat">去過的店</div><ul class="list">' + known.map(id => '<li><b>' + STORES[id].n + '</b>：' + Object.keys(STORES[id].items).map(k => ITEMS[k].n).join('、') + '</li>').join('') + '</ul>';
  }
  const ek = Object.keys(ENDINGS);
  h += '<div class="cat">結局（' + ek.filter(k => J.endings && J.endings[k]).length + '/' + ek.length + '）</div><ul class="list">' + ek.map(k => '<li>' + (J.endings && J.endings[k] ? '<b>' + ENDINGS[k].n + '</b>：' + ENDINGS[k].d : '？？？') + '</li>').join('') + '</ul>';
  const ck = Object.keys(CLUES).filter(k => J.clues && J.clues[k]);
  if (ck.length) h += '<div class="cat">真相碎片（' + ck.length + '/3）</div><ul class="list note">' + ck.map(k => '<li>' + esc(CLUES[k]) + '</li>').join('') + '</ul><p class="empty">同一輪裡集齊 3 片，才能在第 100 天揭開真相。</p>';
  if (J.best) h += '<p class="empty">最佳紀錄：撐了 ' + J.best + ' 天。</p>';
  const rk = Object.keys(RECIPES).filter(k => J.recipes[k]);
  if (rk.length) h += '<div class="cat">抄下的圖紙</div><ul class="list">' + rk.map(k => '<li><b>' + RECIPES[k].n + '</b>：' + Object.entries(RECIPES[k].need).map(([m, q]) => ITEMS[m].n + '×' + q).join('、') + '</li>').join('') + '</ul>';
  if (J.runs.length) {
    h += '<div class="cat">過去的輪迴</div><ul class="timeline">' + J.runs.map(r => '<li><span class="d">第 ' + r.n + ' 輪</span><span>撐了 <b class="num">' + r.days + '</b> 天 · ' + esc(r.cause) + '</span></li>').join('') + '</ul>';
  }
  if (outside) h += viewUpgrades();
  else h += '<p class="empty">規劃點數 ' + J.pp + ' 點，可以在輪與輪之間使用。</p>';
  h += viewCodex();
  h += viewGuide();
  h += '<div class="row-btns"><button class="btn ghost" data-a="sound">音效：' + (J.sound === false ? '關' : '開') + '</button></div>';
  h += '<div class="dev"><label><input type="checkbox" id="devmode" data-a="dev"' + (J.dev ? ' checked' : '') + '> 開發者模式</label>';
  if (J.dev) {
    h += '<div class="row-btns">' + (S && S.phase === 'play' ? '<button class="btn ghost" data-a="devMoney">+$1000</button><button class="btn ghost" data-a="devTime">時間倒回 60 分</button>' : '') +
      '<button class="btn ghost" data-a="devPP">+10 規劃點數</button><button class="btn ghost" data-a="devReset">清空日誌</button></div>';
  }
  h += '</div>';
  return h;
}

function viewUpgrades() {
  return '<div class="cat">規劃點數：<span class="num">' + J.pp + '</span> 點</div><div class="sheet">' + UPGRADES.map(u => {
    const lv = J.upg[u.id];
    return '<div class="upg"><div><b>' + u.n + '</b> <span class="tag">Lv ' + lv + '/' + u.max + '</span><div class="meta" style="font-size:12.5px;color:var(--muted)">' + u.d + ' · ' + u.cost + ' 點</div></div>' +
      '<button class="btn ghost" data-a="upg" data-v="' + u.id + '"' + (lv >= u.max || J.pp < u.cost ? ' disabled' : '') + '>' + (lv >= u.max ? '已滿' : '升級') + '</button></div>';
  }).join('') + '</div>';
}

function viewTitle() {
  const n = J.runs.length;
  return '<main class="wrap"><section class="hero"><h1>生存日誌<br><span>還剩 10 小時</span></h1>' +
    '<p class="note">你死過一次。醒來時，時間回到早上 08:00。<br>18:00，屍群會淹沒整座城市。用手上的錢、腳程和背包，把家變成能撐下去的堡壘。</p>' +
    (J.saveOverNote ? '<p class="alert-line">上一個存檔的復活用完了。這是新的存檔，但日誌還記得一切。</p>' : '') +
    '<p class="hand" style="font-size:17px">' + CHARS[J.char || 'neighbor'].n + ' · 存檔 #' + J.save.no + ' · 剩 ' + J.save.revivals + ' 次復活' + (J.save.wins ? ' · 已撐過 100 天 ' + J.save.wins + ' 次' : '') + '</p>' +
    (SAVED ? viewResume() : '<div class="row-btns"><button class="btn red" data-a="start" style="font-size:18px;padding:10px 22px">' + (n ? '開始第 ' + (n + 1) + ' 輪' : '開始') + '</button></div>') +
    '<p class="empty">準備期 10 小時，爆發後一天一天守家，目標撐過 100 天。死掉可以花規劃點數回溯到前幾天，或用掉 1 次復活回到 08:00 重來。</p></section>' +
    viewChars() + viewJournal(true) + '</main>';
}

function viewEnd() {
  const r = S.result;
  let h = '<main class="wrap">' + (r.days < 100 ? tip('death') : '') + '<section class="hero"><p class="hand" style="color:var(--stamp);font-size:18px;margin:0">' + (r.days >= 100 ? '倖存' : '這一輪結束了') + '</p>' +
    '<div class="result-big">' + r.days + '<small>天</small></div><p class="note">' + esc(r.cause) + '</p>' +
    (r.ending ? '<div class="sheet" style="padding:12px"><div class="hand" style="font-size:22px;color:var(--stamp)">結局「' + ENDINGS[r.ending].n + '」</div><p class="note" style="margin:6px 0 0">' + ENDINGS[r.ending].d + '</p></div>' : '') +
    '<p>這輪會得到 <b class="num">' + r.pp + '</b> 點規劃點數' + (r.committed ? '（已入帳）' : '（離開這個畫面時入帳）') + '。</p></section>';
  if (r.stats) {
    h += '<div class="kv"><div><div class="k">食物</div><div class="v">' + Math.round(r.stats.meals) + ' 餐</div></div>' +
      '<div><div class="k">飲水</div><div class="v">' + r.stats.waterDays + ' 天</div></div>' +
      '<div><div class="k">開局防禦</div><div class="v">' + r.stats.def + '</div></div>' +
      '<div><div class="k">備用電力</div><div class="v">' + r.stats.power + ' 度' + (r.stats.solar ? ' + 太陽能' : '') + '</div></div></div>';
  }
  h += '<div class="cat">這一輪的紀錄</div><ul class="timeline">' + r.timeline.map(e => '<li class="' + e.cls + '"><span class="d">' + e.d + '</span><span>' + esc(e.txt) + '</span></li>').join('') + '</ul>';
  const won = r.days >= 100;
  if (!won && !r.committed && S.snaps && S.snaps.length) {
    h += '<div class="cat">翻開日誌，回到過去（每次 ' + REWIND_COST + ' 點規劃點數，不用掉復活）</div><div class="sheet">' +
      S.snaps.map((sn, i) => ({ sn, i })).reverse().map(({ sn, i }) => '<div class="item"><div><div class="nm">回到第 ' + sn.day + ' 天早上</div><div class="meta">保留那天早上的一切</div></div>' +
        '<button class="btn ghost" data-a="rewind" data-v="' + i + '"' + (J.pp < REWIND_COST ? ' disabled' : '') + '>回溯</button></div>').join('') + '</div>' +
      '<p class="empty">目前規劃點數 ' + J.pp + ' 點（這輪的點數要離開畫面後才入帳）。</p>';
  }
  if (r.canEndless && !r.committed) h += '<div class="row-btns"><button class="btn" data-a="endless">留下來：進入無盡模式</button></div><p class="empty">第 100 天後每 7 天一波屍潮，每波強度 +40。死掉也算通關，不會用掉復活。</p>';
  const left = J.save.revivals - (won || r.committed ? 0 : 1);
  h += '<div class="row-btns"><button class="btn red" data-a="start">' + (won ? '開始新的一輪' : left >= 0 ? '重生：回到 08:00（剩 ' + left + ' 次復活）' : '存檔結束，開新存檔') + '</button><button class="btn ghost" data-a="menu">回到日誌</button></div>';
  if (!won && left < 0) h += '<p class="empty">復活用完了。開新存檔時規劃點數和升級會歸零，但日誌裡的事件、心得和圖紙會留著。</p>';
  h += viewUpgrades() + '</main>';
  return h;
}
