// 把 src/ 的檔案合成單一 index.html：node build.js
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'src');
const tpl = fs.readFileSync(path.join(dir, 'template.html'), 'utf8');
const css = fs.readFileSync(path.join(dir, 'style.css'), 'utf8');
const js = fs.readdirSync(path.join(dir, 'js')).filter(f => f.endsWith('.js')).sort()
  .map(f => '// ---- ' + f + ' ----\n' + fs.readFileSync(path.join(dir, 'js', f), 'utf8')).join('\n');
const out = tpl.replace('/*__CSS__*/', () => css.trimEnd()).replace('/*__JS__*/', () => js.trimEnd());
fs.writeFileSync(path.join(__dirname, 'index.html'), out);
console.log('index.html 已產生（' + out.length + ' 字元）');
