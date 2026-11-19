/* ================= 準備期深化：隱藏物資、報攤情報、NPC 支線、新地點與道具 ================= */
Object.assign(ITEMS, {
  pkg:     { n: '包裹', cat: 'mat', w: 5, note: '便利店店員託你送去藥局' },
  coffee:  { n: '罐裝咖啡', cat: 'med', w: 0.3, note: '喝了體力 +25' },
  vitamin: { n: '維他命', cat: 'med', w: 0.1, note: '心態 +10' },
  cell:    { n: '乾電池組', cat: 'power', w: 0.5, note: '直接充 1 度電' },
  gasmask: { n: '防毒面具', cat: 'equip', w: 0, note: '外出暴露值 -15%' },
  shelf:   { n: '置物架', cat: 'equip', w: 0, note: '倉庫 +20 格' }
});
STORES.news = { n: '報攤', x: -1, y: 1, closes: 480, desc: '老闆什麼都聽說過一點。買過的情報會記在日誌裡，以後每一輪都用得到。' };
STORES.gas = { n: '加油站', x: 2, y: -2, closes: 570, desc: '柴油比工具店貴一點，但不用排隊。', items: { diesel: [48, 6], coffee: [8, 10], choco: [6, 10], water: [14, 4], cell: [12, 6] } };
STORES.pharm.items.vitamin = [10, 5];
STORE_ORDER.push('news', 'gas');

const STASHES = [
  { id: 'home_tank', loc: 'home', n: '頂樓水塔', from: 0, until: 600, items: { water: 2 }, hint: '頂樓水塔可以裝 2 箱水' },
  { id: 'tool_diesel', loc: 'tool', n: '後巷的柴油桶', from: 0, until: 180, items: { diesel: 1 }, hint: '工具店後巷 11:00 前有一桶沒人領的柴油' },
  { id: 'conv_box', loc: 'conv', n: '店後的紙箱', from: 0, until: 300, items: { sausage: 10, noodle: 6 }, hint: '便利店後面 13:00 前有一箱過期沒退的貨' },
  { id: 'mart_corner', loc: 'mart', n: '倉庫角落的米', from: 152, until: 210, items: { rice: 2 }, hint: '搶購潮時（10:32–11:30）超市倉庫角落有 2 袋米' },
  { id: 'pharm_desk', loc: 'pharm', n: '櫃台下的急救包', from: 0, until: 360, items: { medkit: 2 }, hint: '藥局櫃台下 14:00 前藏著 2 個急救包' },
  { id: 'farm_stall', loc: 'farm', n: '攤位底下的種子', from: 0, until: 600, items: { tomato: 2, straw: 1, fert: 1 }, hint: '農貿市場攤位底下有種子和肥料' },
  { id: 'cars_trunk', loc: 'cars', n: '報廢車的後車廂', from: 0, until: 540, items: { metal: 3, board: 2 }, hint: '車行報廢車的後車廂有鐵片和木板' },
  { id: 'reno_model', loc: 'reno', n: '樣品屋的材料', from: 0, until: 480, items: { plastic: 4, glass: 2 }, hint: '裝修公司樣品屋 16:00 前有剩下的材料' },
  { id: 'gas_store', loc: 'gas', n: '加油站倉庫', from: 0, until: 570, items: { diesel: 1, coffee: 4 }, hint: '加油站倉庫有一桶柴油和咖啡' },
  { id: 'news_back', loc: 'news', n: '報攤後面的紙箱', from: 0, until: 480, items: { choco: 5, cell: 2 }, hint: '報攤後面有巧克力和乾電池' }
];
const INTEL = [
  { id: 'hordes', n: '屍潮時程', p: 60, d: '前 6 波屍潮的日子和強度', apply: () => { J.hordesSeen = Math.max(J.hordesSeen || 0, 6); } },
  { id: 'weather', n: '天氣預報', p: 40, d: '寒潮和陰雨的日期', apply: () => { J.tips.coldKnown = true; J.tips.rainKnown = true; } },
  { id: 'events', n: '今天的動向', p: 50, d: '準備期所有定時事件', apply: () => { for (const e of EVENTS) if (!e.silentJournal) J.events[e.id] = true; } },
  { id: 'stash', n: '藏匿點傳聞', p: 80, d: '3 個你還不知道的藏匿點', apply: () => { J.stashes = J.stashes || {}; STASHES.filter(s => !J.stashes[s.id]).slice(0, 3).forEach(s => { J.stashes[s.id] = true; }); } },
  { id: 'drone', n: '無人機的下落', p: 30, d: '哪裡找得到無人機', apply: () => { J.tips.droneKnown = true; } },
  { id: 'truth', n: '科技公司的傳聞', p: 100, d: '真相碎片可能藏在哪', apply: () => { J.tips.truthLoc = true; } }
];

function stashAt(loc) { return STASHES.find(s => s.loc === loc); }
function takeStash(s) {
  const room = capacity() - carried();
  const w = Object.entries(s.items).reduce((a, [k, q]) => a + ITEMS[k].w * q, 0);
  if (w > room + 1e-9) { log('找到' + s.n + '，但背包裝不下（需要 ' + kg(w) + '），先回家卸貨再來。', true); return false; }
  for (const [k, q] of Object.entries(s.items)) add(S.carry, k, q);
  S.taken = S.taken || {}; S.taken[s.id] = true;
  log('拿到' + s.n + '：' + Object.entries(s.items).map(([k, q]) => ITEMS[k].n + '×' + q).join('、') + '。', true);
  return true;
}
Object.assign(ACT, {
  look() {
    if (!S || S.phase !== 'play') return;
    const s = stashAt(S.loc);
    advance(10);
    J.stashes = J.stashes || {};
    if (!s || (S.taken && S.taken[s.id])) log('四處看了看，沒發現什麼。');
    else if (S.t < s.from) { log('好像有什麼……但現在還不是時候（' + clock(s.from) + ' 之後再來）。'); J.stashes[s.id] = true; }
    else if (S.t >= s.until) { log('有被翻過的痕跡，來晚了。日誌記下：' + s.hint + '。'); J.stashes[s.id] = true; }
    else { J.stashes[s.id] = true; takeStash(s); }
    saveJournal(); checkOutbreak(); render();
  },
  stash(id) {
    const s = STASHES.find(x => x.id === id);
    if (!s || S.phase !== 'play' || S.loc !== s.loc || (S.taken && S.taken[id]) || S.t < s.from || S.t >= s.until) return;
    advance(5);
    takeStash(s); checkOutbreak(); render();
  },
  intel(id) {
    const it = INTEL.find(x => x.id === id);
    J.intel = J.intel || {};
    if (!it || S.loc !== 'news' || !isOpen('news', S.t) || J.intel[id] || S.money < it.p) return;
    S.money -= it.p; J.intel[id] = true; it.apply(); saveJournal();
    log('跟報攤老闆買了「' + it.n + '」，記進日誌了。');
    advance(5); checkOutbreak(); render();
  },
  npc(v) {
    S.q = S.q || {};
    const q = S.q;
    if (v === 'oldman' && S.loc === 'mart' && !q.oldman) { q.oldman = true; S.money += 100; log('超市的阿伯：「年輕人，這個拿去，多買點罐頭。」他塞給你 $100。', true); advance(2); }
    else if (v === 'clerk' && S.loc === 'conv' && !q.clerk) {
      if (capacity() - carried() < 5) { log('背包放不下包裹（5kg）。'); render(); return; }
      q.clerk = 'carry'; add(S.carry, 'pkg', 1); log('便利店店員：「幫我把這箱藥送去藥局好嗎？我走不開。」你接下包裹。'); advance(2);
    }
    else if (v === 'deliver' && S.loc === 'pharm' && q.clerk === 'carry' && S.carry.pkg) {
      add(S.carry, 'pkg', -1); q.clerk = 'done'; S.pharmDisc = true; add(S.carry, 'medkit', 2);
      log('藥師收下包裹：「是小陳託的？這兩個急救包送你，今天買藥算你八折。」', true); advance(2);
    }
    else if (v === 'dealer' && S.loc === 'cars' && !q.dealer) { q.dealer = 'ask'; log('車行老闆：「幫我從工具店帶 2 片鐵片來修車，車錢算你便宜 $150。」'); advance(2); }
    else if (v === 'dealerGive' && S.loc === 'cars' && q.dealer === 'ask' && (S.carry.metal || 0) >= 2) {
      add(S.carry, 'metal', -2); q.dealer = 'done';
      if (S.car) { S.money += 150; log('老闆：「謝啦！車錢退你 $150。」', true); } else log('老闆：「謝啦！車子算你 $350。」', true);
      advance(2);
    }
    else if (v === 'zoe' && S.loc === 'home' && !q.zoe) { q.zoe = true; log('你敲了隔壁的門。一個女生探出頭：「我叫 Zoe……你也覺得今天水的味道怪怪的嗎？」', true); advance(5); }
    else if (v === 'zoeWater' && S.loc === 'home' && q.zoe && (S.zoePrep || 0) < 3 && (S.home.water || 0) >= 1) {
      add(S.home, 'water', -1); S.zoePrep = (S.zoePrep || 0) + 1;
      log('你分了一箱水給 Zoe。她愣了一下：「你……知道會發生什麼事？」（' + S.zoePrep + '/3）'); advance(3);
    }
    else return;
    checkOutbreak(); render();
  }
});
// 車價、藥局折扣
function carPrice() { return 500 - (S.q && S.q.dealer === 'done' ? 150 : 0); }
const _priceBase = price;
price = function (store, k) { const p = _priceBase(store, k); return store === 'pharm' && S.pharmDisc ? Math.round(p * 0.8) : p; };

function prepExtras() {
  const id = S.loc;
  J.stashes = J.stashes || {}; S.q = S.q || {};
  const q = S.q;
  let h = '';
  // NPC
  const npc = [];
  if (id === 'mart' && !q.oldman) npc.push(['超市的阿伯', '看起來想跟你說話', '聊聊', 'oldman', true]);
  if (id === 'conv' && !q.clerk) npc.push(['店員小陳', '一臉著急，手上抱著一個箱子', '問問看', 'clerk', true]);
  if (id === 'pharm' && q.clerk === 'carry') npc.push(['藥師', '把小陳的包裹交給她', '交給她', 'deliver', !!S.carry.pkg]);
  if (id === 'cars' && !q.dealer) npc.push(['車行老闆', '在修一台車，好像缺材料', '問問看', 'dealer', true]);
  if (id === 'cars' && q.dealer === 'ask') npc.push(['車行老闆', '要 2 片鐵片（你身上有 ' + (S.carry.metal || 0) + '）', '交給他', 'dealerGive', (S.carry.metal || 0) >= 2]);
  if (id === 'home' && !q.zoe) npc.push(['隔壁鄰居', '你從來沒跟她說過話', '敲門', 'zoe', true]);
  if (id === 'home' && q.zoe && (S.zoePrep || 0) < 3) npc.push(['Zoe', '分她一箱瓶裝水（家裡有 ' + (S.home.water || 0) + ' 箱）· 爆發後她會記得你 · ' + (S.zoePrep || 0) + '/3', '分她', 'zoeWater', (S.home.water || 0) >= 1]);
  if (npc.length) h += '<div class="cat">人</div><div class="sheet">' + npc.map(([n, d, b, v, ok]) => '<div class="item"><div><div class="nm">' + n + '</div><div class="meta">' + d + '</div></div><button class="btn" data-a="npc" data-v="' + v + '"' + (ok && S.phase === 'play' ? '' : ' disabled') + '>' + b + '</button></div>').join('') + '</div>';
  // 藏匿點
  const s = stashAt(id);
  if (s) {
    const taken = S.taken && S.taken[s.id];
    if (J.stashes[s.id]) {
      const open = S.t >= s.from && S.t < s.until;
      h += '<div class="cat">日誌記得的藏匿點</div><div class="sheet"><div class="item"><div><div class="nm">' + s.n + (taken ? '<span class="tag green">拿過了</span>' : '') + '</div><div class="meta">' + s.hint + ' · 5 分鐘</div></div>' +
        '<button class="btn" data-a="stash" data-v="' + s.id + '"' + (!taken && open ? '' : ' disabled') + '>' + (taken ? '已拿' : open ? '拿' : S.t < s.from ? clock(s.from) + ' 後' : '來晚了') + '</button></div></div>';
    } else h += '<div class="row-btns"><button class="btn ghost" data-a="look">四處看看（10 分鐘）</button></div>';
  } else h += '<div class="row-btns"><button class="btn ghost" data-a="look">四處看看（10 分鐘）</button></div>';
  return h;
}
function viewNews() {
  J.intel = J.intel || {};
  const open = isOpen('news', S.t);
  let h = '<p class="sub" style="margin:0 0 10px;color:var(--muted)">' + esc(STORES.news.desc) + '</p>';
  if (!open) return h + '<p class="empty">報攤收了。</p>' + prepExtras();
  h += '<div class="cat">情報</div><div class="sheet">' + INTEL.map(it => '<div class="item"><div><div class="nm">' + it.n + (J.intel[it.id] ? '<span class="tag green">日誌已記</span>' : '') + '</div><div class="meta">' + it.d + ' · 5 分鐘</div></div>' +
    '<button class="btn" data-a="intel" data-v="' + it.id + '"' + (J.intel[it.id] || S.money < it.p ? ' disabled' : '') + '>' + (J.intel[it.id] ? '已買' : money(it.p)) + '</button></div>').join('') + '</div>';
  return h + prepExtras();
}
const _viewHereBase = viewHere;
viewHere = function () {
  if (S.loc === 'news') return viewNews();
  const base = _viewHereBase();
  // 把人和藏匿點放在店家說明下面
  const cut = base.indexOf('</p>') + 4;
  return base.slice(0, cut) + prepExtras() + base.slice(cut);
};
function viewIntelJournal() {
  J.intel = J.intel || {}; J.stashes = J.stashes || {};
  const lines = [];
  if (J.tips && J.tips.droneKnown) lines.push('無人機在學校的教師辦公室。');
  if (J.tips && J.tips.truthLoc) lines.push('真相碎片：學校實驗室（探索等級 2）、科技公司機房、醫院上鎖的房間（探索等級 4）。');
  const st = STASHES.filter(s => J.stashes[s.id]);
  let h = '';
  if (lines.length) h += '<div class="cat">情報</div><ul class="list note">' + lines.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
  h += '<div class="cat">藏匿點（' + st.length + '/' + STASHES.length + '）</div>' + (st.length ? '<ul class="list">' + st.map(s => '<li><b>' + STORES[s.loc].n + '</b>：' + esc(s.hint) + '</li>').join('') + '</ul>' : '<p class="empty">在每個地點「四處看看」，或到報攤買傳聞。</p>');
  return h;
}
const _viewJournalBase = viewJournal;
viewJournal = function (outside) { return viewIntelJournal() + _viewJournalBase(outside); };
