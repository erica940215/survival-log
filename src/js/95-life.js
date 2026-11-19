/* ================= 噪音、衛生、傷病 ================= */
Object.assign(ITEMS, {
  soap:   { n: '肥皂', cat: 'med', w: 0.2, note: '衛生 +40，不用水' },
  antib:  { n: '抗生素', cat: 'med', w: 0.1, note: '治好感染' },
  splint: { n: '夾板', cat: 'med', w: 0.5, note: '骨折剩 2 天就好' }
});
STORES.conv.items.soap = [6, 8];
STORES.pharm.items.antib = [30, 3];
LOCS.hospital.loot.push(['antib', 1, 1, 15]);
LOCS.residential.loot.push(['soap', 1, 2, 10]);
RECIPES.splint = { n: '夾板', need: { board: 1, pills: 1 }, h: 1, out: { splint: 1 }, base: true, d: '骨折剩 2 天就好' };

function lifeInit() {
  const sv = S.sv;
  if (sv.noise == null) sv.noise = 0;
  if (sv.hyg == null) sv.hyg = 80;
  if (!sv.inj) sv.inj = { frac: 0, inf: 0 };
}
const noiseLevel = () => (S && S.sv && S.sv.noise) || 0;
function addNoise(v) { lifeInit(); S.sv.noise = Math.min(150, S.sv.noise + v); }

// 會發出聲音的動作（真的有做才算：時間有往前走）
const NOISY = { gen: 15, pedal: 3, craft: 6, reinforce: 8, buildRoom: 12, buildFloor: 15, refine: 10, brew: 4, cookx: 2, demolish: 10 };
for (const [k, v] of Object.entries(NOISY)) {
  const base = SACT[k];
  if (!base) continue;
  SACT[k] = function (...a) { const h0 = S.sv && S.sv.hour; base.apply(this, a); if (S.sv && S.sv.hour > h0) addNoise(v); };
}
// 噪音讓屍潮變大（今晚的預估也會算進去）
const _htm = hordeTypeMul;
hordeTypeMul = function (d, watch) { return _htm(d, watch) * (1 + noiseLevel() / 250); };

// 早上：被吵來的屍群、衛生、傷病
const _m8 = m8Morning;
m8Morning = function (nd) {
  lifeInit();
  const sv = S.sv, st = sv.st;
  const last = nd - 1;
  if (!hordeOn(last) && sv.noise > 60 && rnd() < (sv.noise - 60) / 80) {
    const dmg = Math.round(40 + sv.noise);
    sv.def -= dmg;
    if (sv.def < 0) { const h = Math.round(-sv.def * 0.25 + 8); sv.def = 0; hurt(h, 'horde'); chron(last, '噪音引來一小群屍群，防線被突破，受傷 ' + h + '。', 'bad'); slog('昨晚的噪音把屍群引來了！防線被突破。', true); }
    else { chron(last, '噪音引來一小群屍群，防線 -' + dmg + '。', 'bad'); slog('昨晚的噪音引來一小群屍群，防線 -' + dmg + '。', true); }
  }
  sv.noise = Math.round(sv.noise * 0.6);
  // 衛生
  sv.hyg = clamp(sv.hyg - 6);
  st.fert = (st.fert || 0) + 1;
  if (sv.hyg < 30) { sv.mor = clamp(sv.mor - 3); if (!sv.inj.inf && rnd() < 0.15) { sv.inj.inf = 1; slog('太久沒清理，傷口感染了。需要抗生素。', true); chron(nd, '感染了。', 'bad'); } }
  // 傷病
  if (sv.inj.inf) { hurt(3, 'other'); sv.mor = clamp(sv.mor - 2); }
  if (sv.inj.frac > 0) { sv.inj.frac--; if (!sv.inj.frac) slog('骨折好了，可以出門了。', true); }
  _m8(nd);
};
// 屍潮突破時可能骨折
for (const k of ['sleep', 'watch']) {
  const base = SACT[k];
  SACT[k] = function () {
    const sv = S.sv, d0 = sv && sv.day, n0 = sv ? sv.chron.length : 0;
    base();
    if (S.phase === 'survive' && S.sv.day > d0 && S.sv.chron.slice(n0).some(c => c.txt.includes('突破防線') && !c.txt.includes('噪音'))) {
      lifeInit();
      if (rnd() < 0.35 && !S.sv.inj.frac) { S.sv.inj.frac = 6; slog('混亂中你摔斷了手臂。骨折 6 天內不能出門，做夾板可以好得快。', true); chron(d0, '骨折了。', 'bad'); render(); }
    }
  };
}
const _ambush = ambush;
ambush = function () { _ambush(); if (S.phase === 'survive') { lifeInit(); if (!S.sv.inj.inf && rnd() < 0.4) { S.sv.inj.inf = 1; slog('逃跑時被抓傷，傷口感染了。', true); } } };
const _goOutLife = SACT.goOut;
SACT.goOut = function (loc) { lifeInit(); if (S.sv.inj.frac > 0) { slog('骨折還沒好，出不了門（還要 ' + S.sv.inj.frac + ' 天）。'); render(); return; } _goOutLife(loc); };

Object.assign(SACT, {
  wash() {
    const sv = S.sv; lifeInit();
    const tap = sv.day <= 5;
    if (!canAct(1) || (!tap && sv.st.wu < 1)) return;
    if (!tap) sv.st.wu -= 1;
    sv.hyg = clamp(sv.hyg + 35); sv.mor = clamp(sv.mor + 3);
    slog('用一份水擦洗身體、清了廁所。衛生 +35。');
    passHours(1); render();
  },
  cure(k) {
    const sv = S.sv; lifeInit();
    if (!(sv.st[k] > 0)) return;
    if (k === 'soap') sv.hyg = clamp(sv.hyg + 40);
    else if (k === 'antib') { if (!sv.inj.inf) return; sv.inj.inf = 0; }
    else if (k === 'splint') { if (!sv.inj.frac) return; sv.inj.frac = Math.min(sv.inj.frac, 2); }
    sv.st[k]--; if (!sv.st[k]) delete sv.st[k];
    slog('用了' + ITEMS[k].n + '。' + (k === 'antib' ? '感染好了。' : k === 'splint' ? '骨折剩 ' + sv.inj.frac + ' 天。' : '衛生 +40。'));
    render();
  }
});
function viewLife() {
  lifeInit();
  const sv = S.sv, st = sv.st;
  let h = '';
  const inj = [];
  if (sv.inj.frac) inj.push('骨折（還要 ' + sv.inj.frac + ' 天，不能出門）');
  if (sv.inj.inf) inj.push('感染（每天 -3 生命，需要抗生素）');
  if (inj.length) h += '<p class="alert-line">' + inj.join('；') + '</p>';
  h += '<div class="cat">衛生與傷病</div><div class="sheet">';
  h += actRow('清理身體和廁所', '衛生 ' + Math.round(sv.hyg) + ' → +35 · ' + (sv.day <= 5 ? '自來水還沒停' : '用 1 份水') + ' · 1 小時 · 衛生低於 30 會開始感染、心情變差', '清理', 'wash', '', canAct(1) && (sv.day <= 5 || st.wu >= 1) && sv.hyg < 100);
  if (st.soap) h += actRow('肥皂 ×' + st.soap, '衛生 +40，不用水、不花時間', '用', 'cure', 'soap', sv.hyg < 100);
  if (st.antib) h += actRow('抗生素 ×' + st.antib, '治好感染', '吃', 'cure', 'antib', !!sv.inj.inf);
  if (st.splint) h += actRow('夾板 ×' + st.splint, '骨折剩 2 天就好', '固定', 'cure', 'splint', sv.inj.frac > 2);
  return h + '</div><p class="meta">馬桶每天產出 1 份肥料。噪音 ' + noiseLevel() + '：發電、施工、加固都會吵，超過 60 晚上可能引來屍群，屍潮夜也會更大。</p>';
}
const _viewUsableLife = viewUsable;
viewUsable = function () { return viewLife() + _viewUsableLife(); };
const _swLife = sleepWarnings;
sleepWarnings = function () {
  const w = _swLife(), sv = S.sv;
  lifeInit();
  if (sv.noise > 60 && !hordeOn(sv.day)) w.push('今天噪音 ' + sv.noise + '，晚上可能引來屍群。');
  if (sv.hyg < 30) w.push('衛生只有 ' + Math.round(sv.hyg) + '，容易感染。');
  if (sv.inj.inf) w.push('感染還沒治，每天會掉血。');
  return w;
};
