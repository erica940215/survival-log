/* ================= 屍潮種類 ================= */
const HTYPES = {
  normal: { n: '一般屍群', d: '' },
  fast:   { n: '快速屍群', d: '衝得太快，陷阱只擋一半；守夜特別有效' },
  heavy:  { n: '重裝屍群', d: '專打防線（傷害 ×1.3），但怕燃燒瓶和電鋸陷阱（×1.5）' },
  night:  { n: '夜行屍群', d: '沒守夜的話傷害 ×1.3' }
};
function hordeType(d) {
  const sv = S && S.sv;
  if (!sv || !hordeOn(d)) return 'normal';
  sv.htypes = sv.htypes || {};
  if (!sv.htypes[d]) {
    const first = d === HORDES[0][0];
    const r = rndAt('ht' + d);
    sv.htypes[d] = first ? 'normal' : r < 0.4 ? 'normal' : r < 0.6 ? 'fast' : r < 0.8 ? 'heavy' : 'night';
  }
  return sv.htypes[d];
}
function hordeTypeMul(d, watch) {
  const t = hordeType(d);
  if (t === 'fast') return watch ? 0.75 : 1;
  if (t === 'heavy') return 1.3;
  if (t === 'night') return watch ? 1 : 1.3;
  return 1;
}
function trapTypeMul(d, k) {
  const t = hordeType(d);
  if (t === 'fast') return 0.5;
  if (t === 'heavy' && k === 'saw') return 1.5;
  return 1;
}
const moloMul = d => hordeType(d) === 'heavy' ? 1.5 : 1;
function hordeName(d) { const t = hordeType(d); return HTYPES[t].n + (HTYPES[t].d ? '（' + HTYPES[t].d + '）' : ''); }
