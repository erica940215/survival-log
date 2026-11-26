/* ================= 💊 藥箱：所有藥和道具集中一處＋我想要的搜尋 ================= */
// 每種藥：用什麼動作、治什麼、什麼時候建議用、去哪拿
const MEDS = [
  { k: 'medkit',     act: 'heal',    v: 'medkit',     d: '生命 +35',                    when: sv => sv.hp < 70,         get: '醫院、警察局；草藥圃 Lv.4 能做' },
  { k: 'pills',      act: 'heal',    v: 'pills',      d: '生命 +10、治好生病',          when: sv => sv.sick || sv.hp < 90, get: '醫院、藥局、超市' },
  { k: 'antib',      act: 'cure',    v: 'antib',      d: '治好傷口感染',                when: sv => sv.inj && sv.inj.inf, get: '醫院' },
  { k: 'splint',     act: 'cure',    v: 'splint',     d: '骨折剩 2 天就好',             when: sv => sv.inj && sv.inj.frac > 2, get: '醫院；工作台可以做' },
  { k: 'aloe_gel',   act: 'hbUse',   v: 'aloe_gel',   d: '生命 +15、治好感染',          when: sv => (sv.inj && sv.inj.inf) || sv.hp < 85, get: '草藥圃種蘆薈 → 調製' },
  { k: 'fever',      act: 'hbUse',   v: 'fever',      d: '治好生病、生命 +10',          when: sv => sv.sick,            get: '草藥圃（金銀花＋薑）調製' },
  { k: 'ginger_tea', act: 'hbUse',   v: 'ginger_tea', d: '治好生病、生命 +5、心態 +6',  when: sv => sv.sick,            get: '草藥圃種薑 → 調製' },
  { k: 'mint_tea',   act: 'hbUse',   v: 'mint_tea',   d: '心態 +8、精力 +10',           when: sv => sv.mor < 50 || sv.sta < 40, get: '草藥圃種薄荷 → 調製' },
  { k: 'vitamin',    act: 'useItem', v: 'vitamin',    d: '心態 +10',                    when: sv => sv.mor < 50,        get: '藥局、超市' },
  { k: 'coffee',     act: 'useItem', v: 'coffee',     d: '精力 +25',                    when: sv => sv.sta < 40,        get: '便利商店、地鐵站' },
  { k: 'soap',       act: 'cure',    v: 'soap',       d: '衛生 +40，不用水',            when: sv => sv.hyg != null && sv.hyg < 40, get: '超市、便利商店' }
];
function medProblems() {
  const sv = S.sv, P = [];
  if (sv.hp < 60) P.push(['❤️', '生命偏低', Math.round(sv.hp)]);
  if (sv.sick) P.push(['🤒', '生病了', '']);
  if (sv.inj && sv.inj.inf) P.push(['🩹', '傷口感染', '每天 -3 生命']);
  if (sv.inj && sv.inj.frac) P.push(['🦴', '骨折', '還要 ' + sv.inj.frac + ' 天']);
  if (sv.mor < 40) P.push(['😞', '心態低落', Math.round(sv.mor)]);
  if (sv.sta < 30) P.push(['😪', '很累', '精力 ' + Math.round(sv.sta)]);
  if (sv.hyg != null && sv.hyg < 30) P.push(['🧼', '很髒', '衛生 ' + Math.round(sv.hyg)]);
  return P;
}
const medUseful = () => MEDS.filter(m => (S.sv.st[m.k] || 0) > 0 && m.when(S.sv));
function medHTML() {
  const sv = S.sv, P = medProblems();
  let h = '<div class="rt-modal" data-a="wmClose"><div class="rt-mbox wm-box" data-a="noop"><div class="rt-mh"><span class="rt-mic">💊</span><div><b>藥箱</b><div class="meta">藥和道具都在這裡，用了不花時間</div></div><button class="btn ghost" data-a="wmClose" style="margin-left:auto">關閉</button></div>';
  h += '<div class="med-state">' + (P.length ? P.map(p => '<span class="bad">' + p[0] + ' ' + p[1] + (p[2] !== '' ? ' <i>' + p[2] + '</i>' : '') + '</span>').join('') : '<span class="ok">✅ 身體狀況良好</span>') + '</div>';
  const have = MEDS.filter(m => (sv.st[m.k] || 0) > 0), none = MEDS.filter(m => !(sv.st[m.k] > 0));
  have.sort((a, b) => (!!b.when(sv)) - (!!a.when(sv)));
  if (have.length) h += '<div class="ep-grid">' + have.map(m => { const rec = m.when(sv); return '<button class="ep-cell' + (rec ? ' rec' : '') + '" data-a="medUse" data-v="' + m.k + '">' + itemIc(m.k, 'ep-ic') + '<div class="ep-t"><b>' + ITEMS[m.k].n + '</b><span class="ep-q">×' + sv.st[m.k] + '</span></div><div class="ep-s">' + m.d + '</div><div class="ep-tags">' + (rec ? '<span class="et warn">👍 現在用得上</span>' : '') + '</div></button>'; }).join('') + '</div>';
  else h += '<p class="meta">藥箱是空的。</p>';
  h += '<details class="guide"' + (have.length ? '' : ' open') + '><summary>沒有的藥去哪拿</summary>' + none.map(m => '<div class="wm-row"><div>' + itemIc(m.k) + '<b>' + ITEMS[m.k].n + '</b><div class="meta">' + m.d + ' · ' + m.get + '</div></div></div>').join('') + '</details>';
  return h + '</div></div>';
}
Object.assign(SACT, {
  medOpen() { UI.wm = 'med'; UI.rtSel = null; UI.verbs = false; render(); },
  medUse(k) {
    const m = MEDS.find(x => x.k === k), sv = S.sv; if (!m || !(sv.st[k] > 0)) return;
    const before = sv.st[k];
    if (m.act === 'heal' && sv.hp >= 100 && !(k === 'pills' && sv.sick)) { slog('生命是滿的，先不用' + ITEMS[k].n + '。'); render(); return; }
    if (m.act === 'cure' && k === 'antib' && !(sv.inj && sv.inj.inf)) { slog('沒有感染，不用吃抗生素。'); render(); return; }
    if (m.act === 'cure' && k === 'splint' && !(sv.inj && sv.inj.frac)) { slog('沒有骨折，不用夾板。'); render(); return; }
    SACT[m.act](m.v);
    if ((sv.st[k] || 0) < before) { sfx('pop'); if (typeof statSnap === 'function') {} }
  }
});
const _wmHTMLMed = wmHTML;
wmHTML = function () { return UI.wm === 'med' ? medHTML() : _wmHTMLMed(); };

// 右側按鈕列（橫向）加 💊，有需要時發亮
const _lsRightMed = lsRight;
lsRight = function () {
  const h = _lsRightMed(); if (S.sv.out) return h;
  const need = medUseful().length > 0;
  return h.replace('<button class="ls-btn" data-a="lsOut"', '<button class="ls-btn' + (need ? ' glow' : '') + '" data-a="medOpen">💊<span>藥箱</span>' + (need ? '<i class="ls-dot"></i>' : '') + '</button><button class="ls-btn" data-a="lsOut"');
};
// 直向的快捷列也加
const _rtPanelMed = rtPanel;
rtPanel = function () { return _rtPanelMed().replace('<button class="btn" data-a="rtQuick" data-v="out">外出</button>', '<button class="btn' + (medUseful().length ? ' glow' : '') + '" data-a="medOpen">💊 藥箱</button><button class="btn" data-a="rtQuick" data-v="out">外出</button>'); };
// 建議：生病、受傷、生命低又有藥
const _sugMed = suggestRaw;
suggestRaw = function () {
  const L = _sugMed(), u = medUseful();
  if (u.length) { const m = u[0]; L.push({ pri: S.sv.hp < 40 || S.sv.sick || (S.sv.inj && S.sv.inj.inf) ? 95 : 55, ic: '💊', label: '用' + ITEMS[m.k].n, why: m.d, med: true }); }
  return L.sort((a, b) => b.pri - a.pri).slice(0, 3);
};
const _sugDoMed = SACT.sugDo;
SACT.sugDo = function (i) { const s = suggest()[Number(i)]; if (s && s.med) return SACT.medOpen(); return _sugDoMed(i); };

/* ===== 我想要：加分類＋搜尋 ===== */
VERBS.splice(2, 0, { k: 'med', ic: '💊', n: '吃藥／治療', wm: 'med', kw: '藥 治療 受傷 生病 感冒 發燒 感染 骨折 生命 血 補血 心態 咖啡 精力 累 維他命 肥皂' });
const VERB_KW = {
  eat: '吃 餓 食物 飽 料理 東西', drink: '喝 水 渴', sleep: '睡 休息 累 精力 床', cook: '煮 料理 廚師 菜 飯 微波', power: '電 發電 電力', plant: '種 種子 植物 菜',
  craft: '做 修 工作台 製作 家具 武器', door: '門 防禦 加固 屍潮 殭屍', wash: '洗 澡 髒 衛生 廁所', out: '出門 搜 外出 找 物資', roof: '頂樓 雞 蜂 菜圃 屋頂',
  nbr: '鄰居 交易 換', radio: '廣播 收音機 消息', store: '倉庫 物品 背包 有什麼', farm: '農場 田 兔 加工 醃 曬 草藥 工坊', biz: '經營 賣 錢 瓶蓋 訂單 店 釀 酒 烤 麵包 研究 圖鑑 育種'
};
const _verbsHTMLQ = verbsHTML;
verbsHTML = function () {
  let h = _verbsHTMLQ();
  h = h.replace('<div class="verb-grid">', '<input id="verb-q" class="verb-q" placeholder="🔍 打字找：例如「藥」「賣」「洗澡」" autocomplete="off"><div class="verb-grid">');
  for (const V of VERBS) { const kw = (V.kw || VERB_KW[V.k] || '') + ' ' + V.n; h = h.replace('data-a="verb" data-v="' + V.k + '"', 'data-a="verb" data-v="' + V.k + '" data-kw="' + kw + '"'); }
  return h + '';
};
const _renderVQ = render;
render = function () {
  const old = document.getElementById('verb-q'), q = old ? old.value : '';
  _renderVQ();
  const inp = document.getElementById('verb-q'); if (!inp) return;
  const f = () => { const t = inp.value.trim(); document.querySelectorAll('.verb[data-kw]').forEach(b => { b.style.display = !t || b.dataset.kw.includes(t) ? '' : 'none'; }); };
  inp.value = q; inp.oninput = f; f();
};
