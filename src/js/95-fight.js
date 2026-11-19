/* ================= 外出遭遇戰與武器 ================= */
Object.assign(ITEMS, {
  bat:     { n: '球棒', cat: 'mat', w: 2, note: '武器 · 戰力 1 · 可用 8 次' },
  crowbar: { n: '撬棍', cat: 'mat', w: 2, note: '武器 · 戰力 2 · 可用 12 次' },
  bow:     { n: '自製弓', cat: 'mat', w: 1.5, note: '武器 · 戰力 2 · 安靜，躲藏更容易 · 可用 10 次' }
});
const WEAP = { crowbar: { p: 2, dur: 12 }, bow: { p: 2, dur: 10 }, bat: { p: 1, dur: 8 } };
Object.assign(RECIPES, {
  bat:     { n: '球棒', need: { board: 2 }, h: 1, out: { bat: 1 }, base: true, d: '武器 · 戰力 1' },
  crowbar: { n: '撬棍', need: { metal: 2 }, h: 1, out: { crowbar: 1 }, base: true, d: '武器 · 戰力 2' },
  bow:     { n: '自製弓', need: { board: 1, plastic: 2 }, h: 2, out: { bow: 1 }, base: true, d: '武器 · 戰力 2，安靜' }
});
LOCS.police.loot.push(['crowbar', 1, 1, 10]);
LOCS.hardware.loot.push(['crowbar', 1, 1, 5]);

function weapon() { const st = S.sv.st; return Object.keys(WEAP).find(k => st[k] > 0) || null; }
function wearWeapon() {
  const sv = S.sv, k = weapon(); if (!k) return;
  sv.wear = sv.wear || {};
  if (sv.wear[k] == null) sv.wear[k] = WEAP[k].dur;
  sv.wear[k]--;
  if (sv.wear[k] <= 0) { sv.st[k]--; if (!sv.st[k]) delete sv.st[k]; sv.wear[k] = null; slog(ITEMS[k].n + '壞掉了。', true); }
}
const _searchFight = SACT.search;
SACT.search = function (i) {
  const sv = S.sv;
  if (sv.out && sv.out.enc) return;
  const before = sv.out;
  _searchFight(i);
  if (S.phase === 'survive' && sv.out && sv.out === before && rnd() < 0.18) {
    const z = rnd() < 0.75;
    sv.out.enc = z ? { t: 'z', n: 1 + Math.floor(rnd() * 3) } : { t: 's' };
    slog(z ? '轉角突然冒出 ' + sv.out.enc.n + ' 隻殭屍！' : '你撞見另一個倖存者，他手上拿著東西，警戒地看著你。', true);
    render();
  }
};
const _goHomeFight = SACT.goHome;
SACT.goHome = function () { if (S.sv.out && S.sv.out.enc && S.sv.out.enc.t === 'z') return; _goHomeFight(); };
function lootOne() { const [k, q] = rollLoot(LOCS[S.sv.out.loc].loot); S.sv.out.bag[k] = (S.sv.out.bag[k] || 0) + q; return ITEMS[k].n + '×' + q; }
Object.assign(SACT, {
  enc(v) {
    const sv = S.sv, o = sv.out;
    if (!o || !o.enc) return;
    const e = o.enc, wk = weapon(), P = wk ? WEAP[wk].p : 0;
    if (e.t === 'z') {
      if (v === 'hide') {
        o.exp += 15 * expMul();
        if (rnd() < 0.7 + (wk === 'bow' ? 0.15 : 0)) slog('你屏住呼吸躲在櫃子後面，牠們走過去了。');
        else { hurt(8, 'ambush'); slog('被發現了！你推開牠們逃走，受了點傷（生命 -8）。', true); }
        o.enc = null;
      } else if (v === 'flee') {
        for (const k of Object.keys(o.bag)) { o.bag[k] = Math.floor(o.bag[k] * 0.75); if (!o.bag[k]) delete o.bag[k]; }
        o.enc = null; slog('你轉身就跑，背包掉了一些東西。'); SACT.goHome(); return;
      } else if (v === 'fight') {
        const win = rnd() < 0.35 + 0.2 * P - 0.08 * (e.n - 1);
        const loss = win ? Math.max(0, 6 * e.n - 4 * P) : 12 + 6 * e.n;
        if (loss) hurt(loss, 'ambush');
        if (wk) wearWeapon();
        sv.defXp = (sv.defXp || 0) + 2 * e.n;
        sv.kills = (sv.kills || 0) + (win ? e.n : 0);
        if (win) slog('你' + (wk ? '用' + ITEMS[wk].n : '赤手空拳') + '解決了 ' + e.n + ' 隻殭屍' + (loss ? '，生命 -' + loss : '，毫髮無傷') + '。搜到：' + lootOne() + '。', true);
        else { slog('打不過！你負傷逃開（生命 -' + loss + '）。', true); if (!sv.inj.inf && rnd() < 0.3) { sv.inj.inf = 1; slog('傷口感染了。', true); } }
        o.exp += 10; o.enc = null;
      }
    } else {
      if (v === 'trade') {
        const food = ALLY_FOOD.reduce((a, k) => a + sv_has(k), 0);
        if (food < 1) { slog('你身上沒有食物可以換。'); render(); return; }
        takeFrom(ALLY_FOOD, 1);
        const got = [lootOne(), lootOne()];
        slog('你用 1 份食物跟他換到 ' + got.join('、') + '。他點點頭離開了。'); o.enc = null;
      } else if (v === 'rob') {
        sv.mor = clamp(sv.mor - 15);
        if (rnd() < 0.5) { hurt(10, 'ambush'); slog('他反抗了，扭打中你受了傷（生命 -10）。', true); }
        slog('你搶到：' + lootOne() + '。心裡不太好受（心態 -15）。'); o.enc = null;
      } else { slog('你們互相點頭，各走各的路。'); o.enc = null; }
    }
    if (checkDeath()) { render(); return; }
    if (o.exp >= 100 && sv.out) ambush();
    render();
  }
});
function viewEnc() {
  const o = S.sv.out; if (!o || !o.enc) return '';
  const wk = weapon(), e = o.enc;
  if (e.t === 'z') {
    const P = wk ? WEAP[wk].p : 0, win = Math.round(Math.max(0, Math.min(1, 0.35 + 0.2 * P - 0.08 * (e.n - 1))) * 100);
    return '<div class="warnbox"><b>' + e.n + ' 隻殭屍擋在前面</b><p class="meta">武器：' + (wk ? ITEMS[wk].n + '（剩 ' + ((S.sv.wear && S.sv.wear[wk]) != null ? S.sv.wear[wk] : WEAP[wk].dur) + ' 次）' : '沒有（工作台可以做球棒、撬棍、弓）') + '</p><div class="row-btns" style="margin:6px 0 0">' +
      '<button class="btn" data-a="enc" data-v="hide">躲起來（暴露 +15）</button><button class="btn" data-a="enc" data-v="fight">硬打（勝率約 ' + win + '%）</button><button class="btn ghost" data-a="enc" data-v="flee">逃回家（掉 25% 東西）</button></div></div>';
  }
  return '<div class="warnbox" style="border-color:var(--ink)"><b style="color:var(--ink)">遇到一個倖存者</b><div class="row-btns" style="margin:6px 0 0">' +
    '<button class="btn" data-a="enc" data-v="trade">用 1 份食物交換</button><button class="btn ghost" data-a="enc" data-v="ignore">各走各的</button><button class="btn ghost" data-a="enc" data-v="rob">搶他的東西</button></div></div>';
}
const _viewOutFight = viewOut;
viewOut = function () { const h = _viewOutFight(); const i = h.indexOf('<div class="cat">暴露值'); return i < 0 ? viewEnc() + h : h.slice(0, i) + viewEnc() + h.slice(i); };
const _htmFight = hordeTypeMul;
hordeTypeMul = function (d, watch) { return _htmFight(d, watch) * (watch && S.sv && weapon() ? 0.95 : 1); };
