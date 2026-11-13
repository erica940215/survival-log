/* ================= 日誌（跨輪保存） ================= */
const JKEY = 'survival-log-m1-journal';
function freshJournal() { return { runs: [], events: {}, stores: {}, tips: {}, hordesSeen: 0, pp: 0, upg: { time: 0, money: 0, bag: 0 }, dev: false, save: { no: 1, revivals: 3, wins: 0 }, recipes: {}, chars: { neighbor: true }, char: 'neighbor', endings: {}, clues: {}, best: 0 }; }
function loadJournal() {
  try { const raw = localStorage.getItem(JKEY); if (raw) return Object.assign(freshJournal(), JSON.parse(raw)); } catch (e) {}
  return freshJournal();
}
function saveJournal() { try { localStorage.setItem(JKEY, JSON.stringify(J)); } catch (e) {} }

let J = loadJournal();
let S = null;     // 這一輪的狀態
let UI = { tab: 'here', qty: {} };
