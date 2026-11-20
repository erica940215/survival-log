// 把 assets/top/*.webp 轉成內嵌的 data URI（src/js/03-sprites.js），單一 HTML 也能帶著圖走
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'assets', 'top');
const out = {};
for (const f of fs.readdirSync(dir).filter(f => /\.(webp|png)$/.test(f)).sort()) {
  const k = f.replace(/\.(webp|png)$/, ''), ext = f.endsWith('.png') ? 'png' : 'webp';
  out[k] = 'data:image/' + ext + ';base64,' + fs.readFileSync(path.join(dir, f)).toString('base64');
}
fs.writeFileSync(path.join(__dirname, '..', 'src', 'js', '03-sprites.js'),
  '/* 自動產生：node tools/sprites.js（來源 assets/top/） */\nconst SPR = ' + JSON.stringify(out, null, 0).replace(/","/g, '",\n  "') + ';\n');
console.log(Object.keys(out).join(', '));
