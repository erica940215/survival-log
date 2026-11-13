/* ================= 日誌（跨輪保存） ================= */
// 三個存檔欄位：每格有自己的日誌和進行中的一輪。第 1 格沿用舊的儲存名稱，舊進度不會不見。
const SLOT_KEY = 'survival-log-slot';
const jkeyOf = n => n === 1 ? 'survival-log-m1-journal' : 'survival-log-m1-journal-' + n;
const rkeyOf = n => n === 1 ? 'survival-log-run' : 'survival-log-run-' + n;
let SLOT = 1;
try { const v = Number(localStorage.getItem(SLOT_KEY)); if (v >= 1 && v <= 3) SLOT = v; } catch (e) {}
function freshJournal() { return { runs: [], events: {}, stores: {}, tips: {}, hordesSeen: 0, pp: 0, upg: { time: 0, money: 0, bag: 0 }, dev: false, save: { no: 1, revivals: 3, wins: 0 }, recipes: {}, chars: { neighbor: true }, char: 'neighbor', endings: {}, clues: {}, best: 0 }; }
function loadJournal() {
  try { const raw = localStorage.getItem(jkeyOf(SLOT)); if (raw) return Object.assign(freshJournal(), JSON.parse(raw)); } catch (e) {}
  return freshJournal();
}
function saveJournal() { try { localStorage.setItem(jkeyOf(SLOT), JSON.stringify(J)); } catch (e) {} }

let J = loadJournal();
let S = null;     // 這一輪的狀態
let UI = { tab: 'here', qty: {} };
