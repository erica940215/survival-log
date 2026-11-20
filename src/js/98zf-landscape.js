/* ================= 橫屏版面 =================
   手機橫放時（生存階段）：中間房間占滿高度，左邊狀態、右邊大按鈕，
   原本下面的東西收進「☰ 選單」抽屜（開著時間暫停）。
   直拿時照舊，並在上方提示「橫放更好玩」（可關掉）。
   設定：UIS.ls = 'auto'（預設）| 'off' */
if (!UIS.ls) UIS.ls = 'auto';
const LS_MQ = window.matchMedia ? window.matchMedia('(orientation: landscape) and (max-height: 620px)') : null;
const isLandscape = () => !!(LS_MQ && LS_MQ.matches);
const lsOn = () => UIS.ls !== 'off' && isLandscape() && S && S.phase === 'survive';

Object.assign(SACT, {
  lsMenu(v) {
    UI.lsMenu = v === 'close' ? false : v === 'open' ? true : !UI.lsMenu;
    if (!UI.lsMenu) { if (UI.tab !== 'act') UI.tab = 'act'; UI.rtOut = false; }
    render();
  },
  lsOut() { UI.tab = 'act'; UI.rtOut = true; UI.lsMenu = true; render(); },
  lsHintHide() { UI.lsHintHide = true; render(); },
  lsMode(v) { UIS.ls = v === 'off' ? 'off' : 'auto'; saveUI(); render(); }
});

function lsRight() {
  const sv = S.sv, sg = typeof siegeOf === 'function' && siegeOf();
  const B = (a, v, t, cls, dis) => '<button class="ls-btn' + (cls ? ' ' + cls : '') + '" data-a="' + a + '"' + (v ? ' data-v="' + v + '"' : '') + (dis ? ' disabled' : '') + '>' + t + '</button>';
  let h = '';
  if (sv.out) h += B('otExit', '', '🏠<span>回家</span>', 'go');
  else if (sg && !sg.done) h += B('sgMolo', '', '🔥<span>燃燒瓶 ' + (sv.st.molotov || 0) + '</span>', 'red', !(sv.st.molotov > 0)) + B('sgSkip', '', '🌙<span>守到天亮</span>');
  else h += B('rtQuick', 'eatFull', '🍚<span>吃</span>') + B('rtQuick', 'drinkFull', '💧<span>喝</span>') + B('lsOut', '', '🎒<span>外出</span>') + B('rtQuick', 'sleep', '🛏️<span>睡覺</span>', 'red');
  h += B('lsMenu', 'open', '☰<span>選單</span>', 'menu');
  return h;
}

const _renderLS = render;
render = function () {
  _renderLS();
  const app = $app, on = lsOn();
  document.body.classList.toggle('ls', on);
  if (!on) {
    // 直拿：提示橫放
    if (S && S.phase === 'survive' && UIS.ls !== 'off' && !UI.lsHintHide && !isLandscape() && window.innerWidth < 700) {
      const main = app.querySelector('main.wrap');
      if (main) main.insertAdjacentHTML('afterbegin', '<div class="ls-hint"><span>📱↻ 把手機橫放，房間更大、操作更像原作</span><button data-a="lsHintHide" aria-label="關閉">✕</button></div>');
    }
    return;
  }
  const main = app.querySelector('main.wrap'), header = app.querySelector('header.status'), nav = app.querySelector('nav.tabs');
  // 舞台
  const stage = document.createElement('div'); stage.className = 'ls-stage';
  stage.innerHTML = '<div class="ls-left"></div><div class="ls-center"></div><div class="ls-right">' + lsRight() + '</div>';
  const left = stage.querySelector('.ls-left'), center = stage.querySelector('.ls-center');
  const wrap = main && main.querySelector('.rt-wrap');
  if (wrap) center.appendChild(wrap); else center.innerHTML = '<div class="ls-pause">選單開著，時間暫停中<br><button class="btn" data-a="lsMenu" data-v="close">回到房間</button></div>';
  const banner = main && main.querySelector('.ot-banner'); if (banner) left.appendChild(banner);
  const tick = main && main.querySelector('.ticker'); if (tick) { tick.classList.add('ls-tick'); left.appendChild(tick); }
  const stats = main && main.querySelector('.rt-stats'); if (stats) left.appendChild(stats);
  else if (S.sv) left.insertAdjacentHTML('beforeend', '<div class="rt-stats">' + [['生命', S.sv.hp], ['飽腹', S.sv.sat], ['水分', S.sv.hyd], ['精力', S.sv.sta], ['心態', S.sv.mor]].map(([n, v]) => '<div class="rt-st"><span>' + n + '</span><div class="bar"><i style="width:' + clamp(v) + '%"></i></div><b class="num">' + Math.round(v) + '</b></div>').join('') + '</div>');
  // 屍潮、敲門、搬家等提示卡浮在房間下方
  if (main && !UI.lsMenu) { const cards = main.querySelectorAll('.sg-box'); if (cards.length) { const fl = document.createElement('div'); fl.className = 'ls-float'; cards.forEach(c => fl.appendChild(c)); center.appendChild(fl); } }
  // 抽屜：原本整頁內容
  const drawer = document.createElement('div'); drawer.className = 'ls-drawer' + (UI.lsMenu ? ' open' : '');
  drawer.innerHTML = '<div class="ls-dh"><b>選單</b><span class="meta">開著時時間暫停</span><button class="btn ghost" data-a="lsMenu" data-v="close">關閉 ✕</button></div>';
  for (const el of [header, main, nav]) if (el) drawer.appendChild(el);
  drawer.insertAdjacentHTML('beforeend', '<div class="setrow" style="margin:10px 12px 70px"><span>版面</span><button class="pill' + (UIS.ls !== 'off' ? ' on' : '') + '" data-a="lsMode" data-v="auto">橫放自動切換</button><button class="pill' + (UIS.ls === 'off' ? ' on' : '') + '" data-a="lsMode" data-v="off">一律直式</button></div>');
  app.insertBefore(stage, app.firstChild);
  app.appendChild(drawer);
  if (UI.lsMenu) app.insertAdjacentHTML('beforeend', '<div class="ls-scrim" data-a="lsMenu" data-v="close"></div>');
};
// 選單開著時暫停時間
const _rtActiveLS = rtActive;
rtActive = function () { return _rtActiveLS() && !(lsOn() && UI.lsMenu); };
const _otOnLS = otOn;
otOn = function () { return _otOnLS() && !(lsOn() && UI.lsMenu); };
// 轉向就重畫
let LS_LAST = null;
function lsCheck() { const k = lsOn() + ':' + isLandscape(); if (k !== LS_LAST) { LS_LAST = k; if (S) render(); } }
if (LS_MQ && LS_MQ.addEventListener) LS_MQ.addEventListener('change', lsCheck);
window.addEventListener('resize', () => setTimeout(lsCheck, 80));
