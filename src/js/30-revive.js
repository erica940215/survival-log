/* ================= M3：死亡、回溯、復活、天賦 ================= */
const REWIND_COST = 2;
const TALENTS = {
  traps: { n: '致命陷阱', d: '陷阱傷害 +15%', cost: 20 },
  stamina: { n: '耐力', d: '做事的體力消耗 -25%', cost: 20 },
  warm: { n: '暖身', d: '寒潮傷害減半', cost: 15 },
  green: { n: '園藝', d: '作物產量 +30%', cost: 20 },
  chef: { n: '廚藝', d: '料理的飽足 +20%', cost: 15 },
  tough: { n: '強韌', d: '防線被突破時受傷 -30%', cost: 25 }
};
const hasT = k => !!(S && S.sv && S.sv.talents[k]);
const staCost = v => Math.round(v * (hasT('stamina') ? 0.75 : 1));

function snapshot() {
  if (!S.snaps) S.snaps = [];
  S.snaps.push({ day: S.sv.day, sv: JSON.stringify(S.sv) });
  if (S.snaps.length > 7) S.snaps.shift();
}

function commitRun() {
  const res = S && S.result;
  if (!res || res.committed) return;
  res.committed = true;
  J.pp += res.pp;
  J.best = Math.max(J.best || 0, res.days);
  J.runs.unshift({ n: J.runs.length + 1, days: res.days, cause: res.cause });
  J.runs = J.runs.slice(0, 20);
  if (res.causeKey) J.tips[res.causeKey] = true;
  if (res.hordesSeen > J.hordesSeen) J.hordesSeen = res.hordesSeen;
  if (res.coldSeen) J.tips.coldKnown = true;
  if (res.rainSeen) J.tips.rainKnown = true;
  if (res.days >= 50 && !J.chars.veteran) J.chars.veteran = true;
  if (res.days >= 100) J.save.wins = (J.save.wins || 0) + 1;
  else {
    J.save.revivals -= 1;
    if (J.save.revivals < 0) {
      J.save = { no: J.save.no + 1, revivals: 3, wins: 0 };
      J.pp = 0; J.upg = { time: 0, money: 0, bag: 0 };
      J.saveOverNote = true;
    }
  }
  saveJournal();
}
