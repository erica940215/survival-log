/* ================= PWA：只在 GitHub Pages 上啟用（可加到主畫面、離線玩） ================= */
(function setupPWA() {
  try {
    if (!/github\.io$/.test(location.hostname)) return;
    const add = (rel, href, extra) => { const l = document.createElement('link'); l.rel = rel; l.href = href; if (extra) Object.assign(l, extra); document.head.appendChild(l); };
    add('manifest', 'manifest.webmanifest');
    add('apple-touch-icon', 'apple-touch-icon.png');
    const m = document.createElement('meta'); m.name = 'theme-color'; m.content = '#1d2733'; document.head.appendChild(m);
    const a = document.createElement('meta'); a.name = 'apple-mobile-web-app-capable'; a.content = 'yes'; document.head.appendChild(a);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  } catch (e) {}
})();
