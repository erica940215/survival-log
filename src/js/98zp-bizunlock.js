/* ===== 經營中心：逐步解鎖＋新手介紹 ===== */
const BZ_UNLOCK = {
  order:    { need: () => true, txt: '一開始就有' },
  codex:    { need: () => true, txt: '一開始就有' },
  shop:     { need: () => S.sv.day >= 2 || BZ().rep >= 3, txt: '第 2 天，或聲望 3' },
  brew:     { need: () => S.sv.day >= 4 || chefLv() >= 2, txt: '第 4 天，或廚師 Lv.2' },
  bake:     { need: () => S.sv.day >= 6 || lvOfK('farm') >= 2, txt: '第 6 天，或種植 Lv.2' },
  breed:    { need: () => S.sv.day >= 8 || lvOfK('ranch') >= 2, txt: '第 8 天，或養殖 Lv.2' },
  research: { need: () => S.sv.day >= 10 || BZ().rep >= 10, txt: '第 10 天，或聲望 10' }
};
const BZ_NAME = { order: '📌 訂單板', shop: '🏪 自家小店', brew: '🍶 釀造坊', bake: '🍞 烘焙坊', research: '🔬 研究桌', codex: '📖 圖鑑', breed: '🐣 育種' };
const BZ_INTRO = {
  welcome: ['歡迎來到經營中心', ['把種的、煮的、養的東西變成瓶蓋和聲望。', '每個分頁會隨天數或等級慢慢解鎖，鎖住的分頁會寫解鎖條件。', '做出來的東西有機率是 ★優良、★★極品：更好吃、更值錢。']],
  order: ['📌 訂單板', ['鄰居每天會貼新訂單，3 天內交貨。', '看清楚要什麼、要幾個，備齊後按「交貨」。', '標 ★ 的訂單要優良以上，報酬比較高。']],
  shop: ['🏪 自家小店', ['每天早上有客人上門，頭上泡泡是他想買的東西。', '有貨就按「賣給他」，品質越好小費越多、聲望越高。', '下方的市集可以用瓶蓋買種子、動物、材料。']],
  brew: ['🍶 釀造坊', ['先用木板 3、鐵片 1 做酒桶。', '把材料倒進桶裡，過了最少天數就能開桶。', '放越久越容易出極品；醬油、醋、米酒煮菜時會多做一份。']],
  bake: ['🍞 烘焙坊', ['先蓋石磨和磚窯。到市集或農貿市場買小麥種子種在田裡。', '小麥 2 → 石磨 → 麵粉 2。', '麵粉加材料丟進磚窯，每爐燒 1 塊木板。']],
  research: ['🔬 研究桌', ['用材料加瓶蓋研究新設備。', '先研究前面的，後面的才會亮起來。', '推薦先研究「自動餵食器」和「品質燈」。']],
  codex: ['📖 圖鑑', ['每做出一種新東西就會記錄下來。', '做出極品的那格會變金色。', '收集完一整頁送 100 瓶蓋，而且跨輪保留。']],
  breed: ['🐣 育種', ['同種動物有兩隻以上就能配種（每天一次）。', '有機會升血統星等（產量變多），或出現新特性。', '蓋鴨池、羊圈，再到市集買鴨子、山羊放進去。']]
};
const bzOpenTab = k => BZ_UNLOCK[k].need();
function bzSeen() { if (!J.bzSeen) J.bzSeen = {}; return J.bzSeen; }

const _bizModalU = bizModal;
bizModal = function () {
  let tab = UI.bzTab || 'order';
  if (!bzOpenTab(tab)) UI.bzTab = tab = 'order';
  let h = _bizModalU();
  // 鎖住的分頁變灰並顯示條件
  for (const k of Object.keys(BZ_UNLOCK)) if (!bzOpenTab(k)) h = h.replace('<button class="" data-a="bzTab" data-v="' + k + '">', '<button class="locked" data-a="bzLocked" data-v="' + k + '">🔒 ');
  h = h.replace('<div class="fm-tabs bz-tabs">', '<div class="fm-tabs bz-tabs">') + '<button class="btn ghost bz-help" data-a="bzHelp">❓ 這頁怎麼玩</button>';
  // 新手介紹
  const seen = bzSeen(), show = UI.bzIntro || (!seen.welcome ? 'welcome' : !seen[tab] ? tab : null);
  if (show) { const [t, L] = BZ_INTRO[show]; h += '<div class="bz-intro"><div class="bz-ibox"><b>' + t + '</b><ol>' + L.map(x => '<li>' + x + '</li>').join('') + '</ol>' + (show === 'welcome' ? '<div class="bz-ul">' + Object.keys(BZ_UNLOCK).map(k => '<span class="' + (bzOpenTab(k) ? 'on' : '') + '">' + BZ_NAME[k] + '<i>' + (bzOpenTab(k) ? '已開放' : BZ_UNLOCK[k].txt) + '</i></span>').join('') + '</div>' : '') + '<button class="btn" data-a="bzIntroOk" data-v="' + show + '">知道了</button></div></div>'; }
  return h;
};
Object.assign(SACT, {
  bzLocked(k) { slog('🔒 ' + BZ_NAME[k] + '還沒開放：' + BZ_UNLOCK[k].txt + '。'); render(); },
  bzIntroOk(k) { bzSeen()[k] = true; UI.bzIntro = null; saveJournal(); render(); },
  bzHelp() { UI.bzIntro = UI.bzTab || 'order'; render(); }
});
// 早上檢查新解鎖
const _bizNightU = bizNight;
bizNight = function () {
  const ex = _bizNightU(), bz = BZ(); if (!bz.ul) bz.ul = {};
  for (const k of Object.keys(BZ_UNLOCK)) if (!bz.ul[k] && bzOpenTab(k)) { bz.ul[k] = true; if (!['order', 'codex'].includes(k)) ex.push('🔓 經營中心解鎖了「' + BZ_NAME[k] + '」！'); }
  return ex;
};
// 第一次進主畫面時提示有經營中心
const _sugBizU = suggestRaw;
suggestRaw = function () { const L = _sugBizU(); if (S.sv && !bzSeen().welcome && S.sv.day >= 1) { L.push({ pri: 40, ic: '🏪', label: '看看經營中心', why: '接訂單、開小店賺瓶蓋', bz: true }); return L.sort((a, b) => b.pri - a.pri).slice(0, 3); } return L; };
/* 永久模式隨時可用；一般生存要「每天吃喝都夠」才開放 */
function bizNeeds() {
  const sv = S.sv, food = Object.keys(FOOD).reduce((a, k) => a + sv_has(k) * (FOOD[k].sat || 0), 0), wu = sv.st.wu || 0;
  return [
    ['存糧夠吃 3 天', food >= 180, Math.round(food / 60 * 10) / 10 + ' 天'],
    ['存水夠喝 3 天', sv.day <= 5 || wu >= 9, sv.day <= 5 ? '自來水還沒停' : wu + ' 份'],
    ['身體沒有危險', sv.hp >= 40 && sv.sat >= 30 && sv.hyd >= 30, '生命 ' + Math.round(sv.hp) + '、飽足 ' + Math.round(sv.sat) + '、水分 ' + Math.round(sv.hyd)],
    ['今晚沒有屍潮', !(typeof hordeOn === 'function' && hordeOn()), '']
  ];
}
function bizAllowed() { return isForever() || bizNeeds().every(n => n[1]); }
const _rtPanelOnlyF = rtPanel;
rtPanel = function () { const h = _rtPanelOnlyF(); return bizAllowed() ? h : h.replace('<button class="pill" data-a="bzOpen">🏪 經營</button>', '<button class="pill locked" data-a="bzWhy">🔒 經營</button>'); };
const _bzOpenOnlyF = SACT.bzOpen;
SACT.bzOpen = function () { if (!bizAllowed()) return SACT.bzWhy(); return _bzOpenOnlyF(); };
SACT.bzWhy = function () { UI.wm = 'bzwhy'; render(); };
SACT.bzWhyClose = function () { UI.wm = null; render(); };
const _wmHTMLWhy = wmHTML;
wmHTML = function () {
  if (UI.wm === 'biz' && !bizAllowed()) { UI.wm = null; slog('生活又不穩了，經營中心先暫停。'); }
  if (UI.wm !== 'bzwhy') return _wmHTMLWhy();
  return '<div class="bz-intro" data-a="bzWhyClose"><div class="bz-ibox" data-a="noop"><b>🔒 經營中心還沒開</b><p class="meta">先把生活顧好，每天吃喝都夠了，才有餘力做生意。</p><div class="bz-ul" style="grid-template-columns:1fr">' + bizNeeds().map(n => '<span class="' + (n[1] ? 'on' : '') + '">' + (n[1] ? '✅ ' : '⬜ ') + n[0] + '<i>' + n[2] + '</i></span>').join('') + '</div><button class="btn" data-a="bzWhyClose">知道了</button></div></div>';
};
const _sugOnlyF = suggestRaw;
suggestRaw = function () { const L = _sugOnlyF(); return bizAllowed() ? L : L.filter(s => !s.bz); };
const _bizNightOnlyF = bizNight;
bizNight = function () {
  const ok = bizAllowed(), bz = BZ(), ex = ok ? _bizNightOnlyF() : [];
  if (ok && !bz.opened) { bz.opened = true; if (!isForever()) ex.push('🏪 生活穩定下來了！經營中心開放，可以接訂單、開小店。'); }
  if (!ok && bz.opened && !isForever()) { bz.cust = []; ex.push('存糧或水不夠了，今天店先不開。'); }
  return ex;
};
