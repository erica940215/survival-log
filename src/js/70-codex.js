/* ================= 生存圖鑑與成就 ================= */
const ACHS = [
  ['day1', '第一夜', '撐過爆發後第 1 天', () => S.sv && S.sv.day >= 2],
  ['week', '一週', '撐過 7 天', () => S.sv && S.sv.day >= 8],
  ['d30', '一個月', '撐過 30 天', () => S.sv && S.sv.day >= 31],
  ['d50', '半程', '撐過 50 天', () => S.sv && S.sv.day >= 51],
  ['d100', '百日倖存', '撐過 100 天', () => S.sv && S.sv.day >= 101],
  ['d120', '不肯走', '無盡模式撐到第 120 天', () => S.sv && S.sv.endless && S.sv.day >= 120],
  ['rich', '變賣家當', '準備期現金超過 $2,000', () => S.phase === 'play' && S.money >= 2000],
  ['free', '趁亂', '搶購潮時免費拿 10 件東西', () => (S.freeTaken || 0) >= 10],
  ['car', '有車階級', '準備期買下二手車', () => !!S.car],
  ['horde10', '堡壘', '經歷 10 波屍潮', () => S.sv && S.sv.hordesSeen >= 10],
  ['dog5', '最好的朋友', '狗升到 5 級', () => S.sv && S.sv.dog && dogLv() >= 5],
  ['zoe', '隔壁的人', '救下 Zoe', () => S.sv && S.sv.zoe.state === 'saved'],
  ['mgr', '貨車裡的人', '救下倉庫經理', () => S.sv && S.sv.mgr.state === 'saved'],
  ['truth', '水裡有東西', '同一輪集齊 3 片真相碎片', () => S.sv && S.sv.clues && S.sv.clues.length >= 3],
  ['allend', '所有的結局', '收集全部 4 種結局', () => Object.keys(ENDINGS).every(k => J.endings && J.endings[k])],
  ['robots', '自動化', '三種機器人都做出來', () => S.sv && ROBOTS.every(k => S.sv.st[k] > 0)],
  ['floors', '三層樓', '擴建二樓和地下室', () => S.sv && S.sv.floors && S.sv.floors.length >= 3],
  ['trader', '空中市集', '一輪內交易 50 次', () => S.sv && S.sv.trades >= 50],
  ['explorer', '老練拾荒者', '探索等級 4', () => S.sv && expLevel(S.sv.xp) >= 4],
  ['craft20', '巧手', '一輪內製作 20 件', () => S.sv && (S.sv.crafted || 0) >= 20],
  ['rewind', '再來一次', '回溯過去一次', () => J.stats && J.stats.rewinds >= 1],
  ['chars', '眾生相', '解鎖全部 5 個角色', () => Object.keys(CHARS).every(k => J.chars[k])]
];

function trackCodex() {
  if (!S) return;
  let changed = false;
  J.seen = J.seen || {}; J.ach = J.ach || {};
  const mark = bag => { for (const k of Object.keys(bag || {})) if (ITEMS[k] && !J.seen[k]) { J.seen[k] = true; changed = true; } };
  mark(S.carry); mark(S.home);
  if (S.sv) { mark(S.sv.st); for (const f of S.sv.fresh) if (!J.seen[f.k]) { J.seen[f.k] = true; changed = true; } if (S.sv.out) mark(S.sv.out.bag); }
  for (const [id, n, , cond] of ACHS) {
    if (J.ach[id]) continue;
    let ok = false; try { ok = cond(); } catch (e) {}
    if (ok) {
      J.ach[id] = true; changed = true;
      const msg = '成就達成：「' + n + '」';
      if (S.sv && S.phase === 'survive') slog(msg, true); else if (S.log) log(msg, true);
      if (typeof sfx === 'function') sfx('ach');
    }
  }
  if (changed) saveJournal();
}

function viewCodex() {
  J.seen = J.seen || {}; J.ach = J.ach || {};
  const keys = Object.keys(ITEMS).filter(k => k !== 'wu');
  const seen = keys.filter(k => J.seen[k]).length;
  let h = '<details class="guide"><summary>生存圖鑑（' + seen + '/' + keys.length + '）</summary>';
  for (const c of CAT_ORDER) {
    const ks = keys.filter(k => ITEMS[k].cat === c);
    if (!ks.length) continue;
    h += '<div class="cat" style="font-size:14px">' + CAT_NAMES[c] + '</div><ul class="list">' + ks.map(k => '<li>' + (J.seen[k] ? '<b>' + ITEMS[k].n + '</b>：' + ITEMS[k].note : '<span style="color:var(--muted)">？？？</span>') + '</li>').join('') + '</ul>';
  }
  h += '</details>';
  const got = ACHS.filter(a => J.ach[a[0]]).length;
  h += '<details class="guide"><summary>成就（' + got + '/' + ACHS.length + '）</summary><ul class="list">' +
    ACHS.map(([id, n, d]) => '<li>' + (J.ach[id] ? '<b>' + n + '</b>：' + d : '<span style="color:var(--muted)">？？？ · ' + d + '</span>') + '</li>').join('') + '</ul></details>';
  return h;
}
