/* ================= 工具 ================= */
const $app = document.getElementById('app');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const money = v => '$' + Math.round(v).toLocaleString('en-US');
const kg = v => (Math.round(v * 10) / 10) + 'kg';
function clock(t) { const m = ((480 + t) % 1440 + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
function dur(m) { m = Math.max(0, Math.round(m)); return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
function count(bag) { return Object.values(bag).reduce((a, b) => a + b, 0); }
function weightOf(bag) { return Object.entries(bag).reduce((a, [k, q]) => a + ITEMS[k].w * q, 0); }
function add(bag, k, q) { bag[k] = (bag[k] || 0) + q; if (bag[k] <= 0) delete bag[k]; }
