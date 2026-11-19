/* ================= 內容擴充：新外出地點、道具使用、新場景圖、成就 ================= */
Object.assign(LOCS, {
  residential: { n: '住宅區', lv: 1, trip: 1, cont: ['一樓住戶', '樓梯間', '頂樓加蓋', '地下停車場', '管理室', '垃圾間'],
                 loot: [['can', 1, 2, 25], ['noodle', 1, 3, 20], ['wu', 1, 3, 20], ['plastic', 1, 2, 10], ['board', 1, 2, 10], ['choco', 1, 2, 10], ['cell', 1, 1, 5]] },
  subway:      { n: '地鐵站', lv: 2, trip: 1, cont: ['售票口', '月台', '便利商店', '機房', '軌道旁', '辦公室'],
                 loot: [['wu', 2, 4, 25], ['plastic', 1, 3, 20], ['metal', 1, 2, 20], ['cell', 1, 2, 15], ['glass', 1, 2, 10], ['coffee', 1, 2, 10]] },
  police:      { n: '警察局', lv: 3, trip: 2, noise: true, cont: ['值班台', '證物室', '更衣室', '拘留室', '車庫', '裝備室'],
                 loot: [['metal', 1, 3, 25], ['medkit', 1, 2, 20], ['molotov', 1, 2, 15], ['gasmask', 1, 1, 10], ['diesel', 1, 1, 15], ['cell', 1, 2, 15]] }
});

// 道具使用
const USABLE = { coffee: ['喝', '體力 +25'], vitamin: ['吃', '心態 +10'], cell: ['裝上', '電 +1 度'] };
Object.assign(SACT, {
  useItem(k) {
    const sv = S.sv;
    if (!USABLE[k] || !(sv.st[k] > 0)) return;
    sv.st[k]--; if (!sv.st[k]) delete sv.st[k];
    if (k === 'coffee') sv.sta = clamp(sv.sta + 25);
    if (k === 'vitamin') sv.mor = clamp(sv.mor + 10);
    if (k === 'cell') sv.power = Math.min(powerCap(), sv.power + 1);
    slog('用了' + ITEMS[k].n + '：' + USABLE[k][1] + '。'); render();
  }
});
function viewUsable() {
  const st = S.sv.st, ks = Object.keys(USABLE).filter(k => st[k] > 0);
  if (!ks.length) return '';
  return '<div class="cat">道具（不花時間）</div><div class="sheet">' + ks.map(k => actRow(ITEMS[k].n + ' ×' + st[k], USABLE[k][1], USABLE[k][0], 'useItem', k, true)).join('') + '</div>';
}
const _expMulBase = expMul;
expMul = function () { return _expMulBase() * (S.sv.st.gasmask > 0 ? 0.85 : 1); };

// 新地點的場景圖
const _sceneBase = sceneSVG;
sceneSVG = function (kind) {
  let b = '';
  if (kind === 'news') b = rc(140, 50, 80, 68) + '<path d="M130 50 L230 50 L222 36 L138 36 Z" fill="' + TAPE + '" stroke="' + INK + '" stroke-width="1.6"/>' + [0, 1, 2].map(i => rc(150 + i * 22, 62, 16, 22, PAPER, INK, 1.2)).join('') + tx(180, 108, '報攤', 14) + ln(250, 118, 250, 70, 1.4) + rc(238, 54, 24, 16, PAPER, INK, 1.2);
  else if (kind === 'gas') b = rc(70, 30, 220, 14, TAPE) + ln(90, 44, 90, 118, 2) + ln(270, 44, 270, 118, 2) + [140, 200].map(x => rc(x, 74, 22, 44, PAPER) + rc(x + 5, 80, 12, 10, 'none', INK, 1)).join('') + tx(180, 24, '加油站', 15) + rc(300, 70, 46, 48, PAPER);
  else if (kind === 'residential') b = rc(60, 30, 90, 88) + rc(200, 14, 100, 104) + windows(72, 42, 3, 4, 18, 12, 8, true) + windows(214, 26, 4, 5, 16, 12, 8, true) + zombie(170, 118, 1) + zombie(330, 118, 0.9);
  else if (kind === 'subway') b = '<path d="M80 118 V80 Q180 30 280 80 V118" fill="none" stroke="' + INK + '" stroke-width="1.6"/>' + rc(150, 84, 60, 34, '#2b2f36') + tx(180, 70, '地鐵站 M', 14) + ln(100, 104, 140, 104, 1.2) + zombie(240, 118, 0.9);
  else if (kind === 'police') b = rc(80, 34, 200, 84) + sign(130, 14, 100, '警察局') + windows(96, 50, 6, 2, 20, 16, 10, true) + '<circle cx="300" cy="40" r="8" fill="#3b6fb6"/><circle cx="318" cy="40" r="8" fill="' + RED + '"/>' + zombie(40, 118, 1);
  else return _sceneBase(kind);
  return '<div class="scene"><svg viewBox="0 -12 360 134" role="img" aria-label="' + kind + '">' + b + ln(0, 118, 360, 118, 1.6) + '</svg></div>';
};

// 更多成就
ACHS.push(
  ['stash1', '眼尖', '找到第一個藏匿點', () => J.stashes && Object.keys(J.stashes).length >= 1],
  ['stashAll', '尋寶專家', '知道全部 ' + STASHES.length + ' 個藏匿點', () => J.stashes && STASHES.every(s => J.stashes[s.id])],
  ['intel1', '消息靈通', '在報攤買一次情報', () => J.intel && Object.keys(J.intel).length >= 1],
  ['intelAll', '萬事通', '買齊報攤所有情報', () => J.intel && INTEL.every(i => J.intel[i.id])],
  ['oldman', '阿伯的紅包', '收下超市阿伯的錢', () => S.q && S.q.oldman],
  ['clerk', '跑腿小弟', '幫便利店店員送完包裹', () => S.q && S.q.clerk === 'done'],
  ['dealer', '殺價高手', '幫車行老闆找到鐵片', () => S.q && S.q.dealer === 'done'],
  ['zoeprep', '敦親睦鄰', '準備期分 Zoe 三箱水', () => (S.zoePrep || 0) >= 3],
  ['visitAll', '城市漫遊', '一輪準備期走遍 ' + STORE_ORDER.length + ' 個地點', () => S.seenStores && STORE_ORDER.every(k => S.seenStores[k])],
  ['outAll', '踏遍廢墟', '一輪內搜過所有外出地點', () => S.sv && S.sv.locs && Object.keys(LOCS).every(k => S.sv.locs[k] && S.sv.locs[k].done.length)],
  ['htFast', '閃電戰', '擋下快速屍群', () => S.sv && S.sv.htSurv && S.sv.htSurv.fast],
  ['htHeavy', '鋼鐵洪流', '擋下重裝屍群', () => S.sv && S.sv.htSurv && S.sv.htSurv.heavy],
  ['htNight', '夜驚', '擋下夜行屍群', () => S.sv && S.sv.htSurv && S.sv.htSurv.night],
  ['allies2', '小隊', 'Zoe 和倉庫經理都加入', () => S.sv && S.sv.allies && S.sv.allies.zoe !== undefined && S.sv.allies.mgr !== undefined],
  ['diary60', '筆耕', '一輪寫滿 60 篇日記', () => S.sv && S.sv.diary && S.sv.diary.length >= 60],
  ['shelf2', '收納控', '做 2 個置物架', () => S.sv && (S.sv.st.shelf || 0) >= 2],
  ['gridFull', '囤積症', '倉庫用掉九成以上', () => S.sv && storeWeight() >= storeCap() * 0.9],
  ['hotpot', '火鍋派對', '煮出一鍋火鍋', () => J.seen && J.seen.hotpot],
  ['molotov5', '火力展示', '同時有 5 瓶燃燒瓶', () => S.sv && (S.sv.st.molotov || 0) >= 5],
  ['sp200', '存款', '生存點數存到 200', () => S.sv && S.sv.sp >= 200],
  ['def1000', '銅牆鐵壁', '防線耐久達到 1000', () => S.sv && S.sv.def >= 1000],
  ['power40', '電力充沛', '存電達到 40 度', () => S.sv && S.sv.power >= 40],
  ['easy100', '新手上路', '簡單難度撐過 100 天', () => S.sv && S.diff === 'easy' && S.sv.day >= 101],
  ['normal100', '老手', '普通難度撐過 100 天', () => S.sv && S.diff === 'normal' && S.sv.day >= 101],
  ['d200', '傳說', '無盡模式撐到第 200 天', () => S.sv && S.sv.day >= 200],
  ['rich3000', '大富翁', '準備期現金超過 $3,000', () => S.phase === 'play' && S.money >= 3000],
  ['dog', '收養', '收養流浪狗', () => S.sv && S.sv.dog && S.sv.dog.state === 'pet'],
  ['robot1', '第一台機器人', '做出任一種機器人', () => S.sv && ROBOTS.some(k => S.sv.st[k] > 0)],
  ['badge', '警徽', '搜過警察局', () => S.sv && S.sv.locs && S.sv.locs.police && S.sv.locs.police.done.length],
  ['underground', '地下世界', '搜過地鐵站', () => S.sv && S.sv.locs && S.sv.locs.subway && S.sv.locs.subway.done.length]
);
