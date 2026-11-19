/* ================= 故事：對話、同伴分工、收音機劇情、自動日記 ================= */
const ZOE_LINES = [
  '我叫 Zoe，住你隔壁三年了，第一次跟你說話竟然是這樣。',
  '我是大學生，讀植物系。如果我們都活下來，我教你種番茄。',
  '昨晚我聽到樓下有人在敲門，敲了一整夜，後來就沒聲音了。',
  '你那邊的收音機還有訊號嗎？我這邊只剩雜訊。',
  '我發現水龍頭流出來的水有怪味，那天之前就有了。',
  '我開始覺得，我們可能撐得過去。'
];
const MGR_LINES = [
  '謝了，兄弟。貨車的門被卡死了，我一個人出不去。',
  '我在這家超市做了十二年，倉庫的鑰匙我閉著眼都摸得到。',
  '那天早上，有一批淨水廠的貨車來過，司機都戴著防毒面具。',
  '腳好一點了。等我能走，我欠你的一定還。'
];
const RADIO = {
  2: '……市府呼籲民眾待在室內，不要飲用自來水，等候進一步通知……',
  5: '……自來水即日起全面停止供應。重複，自來水停止供應……',
  9: '……軍方在北區設立臨時檢疫站，目前不開放民眾前往……',
  14: '……一名自稱科技公司員工的男子在頻道上大喊「是淨水計畫」，訊號隨即中斷……',
  20: '……氣象單位警告，強烈寒流預計兩天後抵達……',
  27: '……仍在播報的電台已經剩下三家。如果你聽得到，請不要放棄……',
  33: '……業餘無線電：西區有一群倖存者用無人機互相交換物資，頻道 7……',
  38: '……長時間降雨將持續一週以上，請注意屋頂與積水……',
  45: '……軍方證實已掌握感染源頭，相關單位正在調查一家本地科技公司……',
  55: '……救援行動正在規劃中。重複，救援行動正在規劃中……',
  70: '……第一批直升機已經在東區降落，接走了四十二名倖存者……',
  85: '……救援名單持續更新中。請在屋頂留下明顯標記……',
  98: '……兩天後，救援直升機將抵達你所在的區域。撐住……'
};
const ALLY_ROLES = {
  zoe: { n: 'Zoe', roles: { farm: ['照顧作物', '作物產量 +30%'], guard: ['輪流守夜', '屍潮傷害 -20%'] } },
  mgr: { n: '倉庫經理', roles: { trade: ['負責交易', '每天多 1 筆交易'], fix: ['修補防線', '每晚防線 +20'] } }
};
const ALLY_FOOD = ['sausage', 'can', 'biscuit', 'noodle', 'rice_c', 'mushroom', 'tomato_p', 'veg', 'soup'];

function allyOn(k, role) { const sv = S && S.sv; return !!(sv && sv.allies && sv.allies[k] === role && sv.allyFed && sv.allyFed[k]); }

// 救下的人搬進來住：每天要吃 1 份、喝 1 份水
function m8Morning(nd) {
  const sv = S.sv;
  sv.allies = sv.allies || {}; sv.allyFed = sv.allyFed || {};
  if (sv.zoe.state === 'saved' && sv.allies.zoe === undefined) { sv.allies.zoe = 'farm'; slog('Zoe 搬過來一起住了。她可以照顧作物或幫忙守夜（到「行動」的其他倖存者設定）。', true); }
  if (sv.mgr.state === 'saved' && sv.allies.mgr === undefined) { sv.allies.mgr = 'trade'; slog('倉庫經理在附近的倉庫落腳，用無線電跟你保持聯絡，可以幫忙交易或修防線。', true); }
  for (const k of Object.keys(sv.allies)) {
    const food = ALLY_FOOD.reduce((a, f) => a + sv_has(f), 0);
    const water = nd <= 5 || sv.st.wu >= 1;
    if (food >= 1 && water) {
      takeFrom(ALLY_FOOD, 1); if (nd > 5) sv.st.wu -= 1;
      sv.allyFed[k] = true;
    } else {
      sv.allyFed[k] = false; sv.mor = clamp(sv.mor - 5);
      slog(ALLY_ROLES[k].n + '今天沒東西吃，沒力氣幫忙。', true);
    }
  }
  if (RADIO[nd]) slog('收音機：' + RADIO[nd]);
}
Object.assign(SACT, {
  allyRole(v) {
    const [k, role] = String(v).split(':');
    const sv = S.sv;
    if (!sv.allies || sv.allies[k] === undefined || !ALLY_ROLES[k].roles[role]) return;
    sv.allies[k] = role;
    slog(ALLY_ROLES[k].n + '改成「' + ALLY_ROLES[k].roles[role][0] + '」。');
    render();
  }
});
function viewAllies() {
  const sv = S.sv;
  if (!sv.allies) return '';
  let h = '';
  for (const [k, role] of Object.entries(sv.allies)) {
    const A = ALLY_ROLES[k];
    h += '<div class="item"><div><div class="nm">' + A.n + (sv.allyFed && sv.allyFed[k] ? '<span class="tag green">今天有吃</span>' : '<span class="tag red">餓著</span>') + '</div><div class="meta">每天早上吃 1 份食物、喝 1 份水 · ' + A.roles[role][1] + '</div>' +
      '<div class="setrow" style="margin-top:4px">' + Object.entries(A.roles).map(([r, x]) => '<button class="pill' + (role === r ? ' on' : '') + '" data-a="allyRole" data-v="' + k + ':' + r + '">' + x[0] + '</button>').join('') + '</div></div></div>';
  }
  return h;
}

// 對話：在原本的動作後面補一句
const _zoeAct = SACT.zoe, _dropAct = SACT.airdrop;
SACT.zoe = function () {
  const z = S.sv.zoe, before = z.given;
  _zoeAct();
  if (z.given > before && z.state === 'asking') { slog('Zoe：「' + ZOE_LINES[Math.min(ZOE_LINES.length - 1, z.given - 1)] + '」'); render(); }
};
SACT.airdrop = function () {
  const m = S.sv.mgr, before = m.fed;
  _dropAct();
  if (m.fed > before && m.state === 'feeding') { slog('無線電裡的倉庫經理：「' + MGR_LINES[Math.min(MGR_LINES.length - 1, m.fed - 1)] + '」'); render(); }
};

/* ---------- 自動日記 ---------- */
function writeDiary(d) {
  const sv = S.sv;
  sv.diary = sv.diary || [];
  const today = sv.chron.filter(c => c.d === '第 ' + d + ' 天').map(c => c.txt);
  const pickLine = arr => arr[Math.floor(rnd() * arr.length)];
  let t;
  if (today.some(x => x.includes('突破防線'))) t = pickLine(['牠們衝進來了。我躲在浴室裡，聽著外面的聲音直到天亮。', '門被撞開的那一刻，我以為結束了。還沒。']);
  else if (today.some(x => x.includes('屍潮') || x.includes('屍群（'))) t = pickLine(['屍潮來了又走。門還在，我也還在。', '整夜都是撞門聲。天亮時外面安靜得可怕。']);
  else if (today.some(x => x.includes('救下'))) t = '今天不只救了自己。';
  else if (today.some(x => x.includes('寒潮來了'))) t = '冷得骨頭都在痛。窗戶結了一層霜。';
  else if (today.some(x => x.includes('陰雨'))) t = '雨一直下。太陽能板上積滿了水。';
  else if (today.some(x => x.includes('真相碎片'))) t = '我好像知道了一些不該知道的事。';
  else if (sv.hp < 35) t = pickLine(['傷口一直在痛。我不知道還能撐多久。', '今天幾乎下不了床。']);
  else if (sv.sat < 20) t = '好餓。我開始數剩下的食物，數了三次。';
  else if (sv.hyd < 20) t = '嘴唇裂開了。今天只敢喝一小口。';
  else if (inCold(d)) t = pickLine(['又是冷的一天。抱著棉被聽收音機。', '呼出的氣都是白的。', '手指凍到拿不穩筆。', '把所有衣服都穿上了，還是冷。', '窗外一片白，安靜得像另一個世界。']);
  else if (sv.mor > 70) t = pickLine(['今天還不錯，甚至笑了一下。', '番茄長出新芽了，這讓我很開心。', '把家裡整理了一遍，感覺像以前的週末。']);
  else if (sv.mor < 25) t = pickLine(['好安靜。安靜到我開始跟自己說話。', '我想念街上的吵鬧聲。']);
  else t = pickLine(['平靜的一天。平靜得讓人不安。', '把能做的都做了，明天再說。', '外面偶爾有拖著腳走路的聲音。', '數了數存糧，還夠。', '翻到以前的照片，看了很久。', '對面那棟樓的燈今天沒亮。', '練習用一隻手開罐頭。', '收音機裡有人在唱歌，跑調了，但很好聽。', '今天的晚霞是橘紅色的。', '想起以前抱怨通勤，現在覺得好奢侈。'])
  sv.diary.push({ d, t });
  if (sv.diary.length > 150) sv.diary.shift();
}
function viewDiary(list, open) {
  if (!list || !list.length) return '';
  const rev = list.slice().reverse();
  return '<details class="guide"' + (open ? ' open' : '') + '><summary>日記（' + list.length + ' 篇）</summary><ul class="diary">' +
    rev.map(e => '<li><span class="num">第 ' + e.d + ' 天</span><span class="hand">' + esc(e.t) + '</span></li>').join('') + '</ul></details>';
}
