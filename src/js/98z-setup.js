/* ================= 開局設定畫面（整合版） ================= */
viewSetup = function () {
  const s = runSetup();
  const pill = (act, v, label, on) => '<button class="pill' + (on ? ' on' : '') + '" data-a="' + act + '" data-v="' + v + '">' + label + '</button>';
  let h = '<div class="cat">開局設定</div><div class="sheet" style="padding:10px 12px">';
  h += '<div class="setrow"><span>模式</span>' + pill('setMode', 'normal', '一般', s.mode === 'normal') + pill('setMode', 'daily', '每日挑戰', s.mode === 'daily') + pill('setMode', 'seed', '種子', s.mode === 'seed') + '</div>';
  if (s.mode === 'daily') {
    const best = J.daily && J.daily[todayKey()];
    h += '<p class="meta">今天（' + todayKey() + '）的挑戰：事件、天災、圖紙、屍潮種類每個人都一樣。普通難度、角色固定為鄰居、不套用升級，也不會用掉復活。' + (best != null ? '今天最佳：' + best + ' 天。' : '') + '</p>';
  } else if (s.mode === 'seed') {
    const code = s.seed || '', best = J.daily && J.daily['S:' + code];
    h += '<div class="setrow"><span>種子</span><input id="seed-in" class="seed-in" maxlength="12" value="' + esc(code) + '" placeholder="例如 ABC123"><button class="pill" data-a="seedRandom">隨機</button></div>' +
      '<p class="meta">輸入朋友給你的種子碼，或按「隨機」產生一組分享出去。同一組種子碼，事件、天災、圖紙、屍潮都一樣。普通難度、角色固定、不套用升級、不用掉復活。' + (best != null ? '這組最佳：' + best + ' 天。' : '') + '</p>';
  } else {
    h += '<div class="setrow"><span>難度</span>' + Object.entries(DIFFS).map(([k, d]) => pill('setDiff', k, d.n, s.diff === k)).join('') + '</div><p class="meta">' + DIFFS[s.diff].d + '</p>';
    h += '<div class="setrow"><span>挑戰</span>' + Object.entries(MODS).map(([k, m]) => pill('setMod', k, m.n, !!s.mods[k])).join('') + '</div>';
    const on = Object.keys(MODS).filter(k => s.mods[k]);
    h += '<p class="meta">' + (on.length ? on.map(k => MODS[k].d).join('；') + '。撐過 100 天有專屬成就。' : '可以加上限制條件挑戰自己，撐過 100 天有專屬成就。') + '</p>';
  }
  h += viewStylePick() + '<p class="meta">台灣場景只換地名和物品名稱，玩法一樣。</p>';
  return h + '</div>';
};
// 換日動畫只在守家時出現
const _animOverlayFinal = animOverlay;
animOverlay = function () { if (UI.anim && UI.anim.kind === 'day' && (!S || S.phase !== 'survive')) { UI.anim = null; return ''; } return _animOverlayFinal(); };

/* ================= 素材替換：場景插圖、背景音樂（有列在這裡才會用檔案） ================= */
const SCENE_ASSETS = {};   // 例：{ mart: 'assets/scenes/mart.png', school: 'assets/scenes/school.png' }
if (typeof SPR === 'object') for (const k of Object.keys(SPR)) if (k.startsWith('scene_')) SCENE_ASSETS[k.slice(6)] = SPR[k];
const MUSIC_ASSETS = {};   // 例：{ tense: 'assets/music/tense.mp3', calm: 'assets/music/calm.mp3', dark: 'assets/music/dark.mp3' }
const _sceneAsset = sceneSVG;
sceneSVG = function (kind) {
  if (SCENE_ASSETS[kind]) return '<div class="scene"><img src="' + SCENE_ASSETS[kind] + '" alt="" style="width:100%;height:auto;display:block;border-radius:8px"></div>';
  return _sceneAsset(kind);
};
let MUS_AUDIO = null, MUS_AUDIO_MOOD = '';
const _musicTickAsset = musicTick;
musicTick = function () {
  const mood = musicMood();
  if (J.music === true && MUSIC_ASSETS[mood]) {
    if (MUS_AUDIO_MOOD !== mood) {
      if (MUS_AUDIO) MUS_AUDIO.pause();
      MUS_AUDIO = new Audio(MUSIC_ASSETS[mood]); MUS_AUDIO.loop = true; MUS_AUDIO.volume = 0.5; MUS_AUDIO_MOOD = mood;
      MUS_AUDIO.play().catch(() => {});
    }
    return;
  }
  if (MUS_AUDIO) { MUS_AUDIO.pause(); MUS_AUDIO = null; MUS_AUDIO_MOOD = ''; }
  _musicTickAsset();
};
const _musicStopAsset = musicStop;
musicStop = function () { if (MUS_AUDIO) { MUS_AUDIO.pause(); MUS_AUDIO = null; MUS_AUDIO_MOOD = ''; } _musicStopAsset(); };
