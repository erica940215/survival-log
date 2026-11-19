/* ================= 開局設定：難度、每日挑戰、挑戰條件；可重現的亂數 ================= */
const DIFFS = {
  easy:   { n: '簡單', d: '多 $300、物價 -10%、屍潮 -25%、狀態掉得慢', money: 300, price: 0.9, horde: 0.75, decay: 0.8 },
  normal: { n: '普通', d: '原本的平衡', money: 0, price: 1, horde: 1, decay: 1 },
  hard:   { n: '困難', d: '少 $200、物價 +15%、屍潮 +30%、狀態掉得快', money: -200, price: 1.15, horde: 1.3, decay: 1.15 }
};
const MODS = {
  noCar:    { n: '不能買車', d: '準備期只能用走的' },
  noRewind: { n: '不能回溯', d: '死了就只能用復活' },
  noOut:    { n: '足不出戶', d: '爆發後不能外出搜刮' }
};
function runSetup() { const s = J.setup || {}; return { diff: DIFFS[s.diff] ? s.diff : 'normal', mode: s.mode === 'daily' ? 'daily' : 'normal', mods: s.mods || {} }; }
const D_ = () => DIFFS[(S && S.diff) || 'normal'];
const diffHorde = () => D_().horde;
const diffDecay = () => D_().decay;
function todayKey() { const d = new Date(); return d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0'); }
function seedOf(str) { let h = 2166136261; for (const c of String(str)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
// 這一輪的亂數（存在 S.rng，續玩時不會變）
function rnd() {
  if (!S || S.rng == null) return Math.random();
  S.rng = (S.rng + 0x6D2B79F5) >>> 0;
  let t = S.rng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
// 每日挑戰：同一個日期、同一個標籤一定得到同一個數字
function rndAt(tag) {
  if (!S || !S.daily) return rnd();
  let t = seedOf(S.daily + ':' + tag);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function viewSetup() {
  const s = runSetup();
  const pill = (act, v, label, on) => '<button class="pill' + (on ? ' on' : '') + '" data-a="' + act + '" data-v="' + v + '">' + label + '</button>';
  let h = '<div class="cat">開局設定</div><div class="sheet" style="padding:10px 12px">';
  h += '<div class="setrow"><span>模式</span>' + pill('setMode', 'normal', '一般', s.mode === 'normal') + pill('setMode', 'daily', '每日挑戰', s.mode === 'daily') + '</div>';
  if (s.mode === 'daily') {
    const best = J.daily && J.daily[todayKey()];
    h += '<p class="meta">今天（' + todayKey() + '）的挑戰：事件、天災、圖紙、屍潮種類每個人都一樣。普通難度、角色固定為鄰居、不套用升級，也不會用掉復活。' + (best != null ? '今天最佳：' + best + ' 天。' : '') + '</p>';
  } else {
    h += '<div class="setrow"><span>難度</span>' + Object.entries(DIFFS).map(([k, d]) => pill('setDiff', k, d.n, s.diff === k)).join('') + '</div><p class="meta">' + DIFFS[s.diff].d + '</p>';
    h += '<div class="setrow"><span>挑戰</span>' + Object.entries(MODS).map(([k, m]) => pill('setMod', k, m.n, !!s.mods[k])).join('') + '</div>';
    const on = Object.keys(MODS).filter(k => s.mods[k]);
    h += '<p class="meta">' + (on.length ? on.map(k => MODS[k].d).join('；') + '。撐過 100 天有專屬成就。' : '可以加上限制條件挑戰自己，撐過 100 天有專屬成就。') + '</p>';
  }
  h += '</div>';
  return h;
}
Object.assign(ACT, {
  setMode(v) { J.setup = Object.assign(runSetup(), { mode: v }); saveJournal(); render(); },
  setDiff(v) { if (!DIFFS[v]) return; J.setup = Object.assign(runSetup(), { diff: v }); saveJournal(); render(); },
  setMod(v) { if (!MODS[v]) return; const s = runSetup(); s.mods = Object.assign({}, s.mods); s.mods[v] = !s.mods[v]; J.setup = s; saveJournal(); render(); }
});
