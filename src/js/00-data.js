/* ================= 資料表 ================= */
// 時間單位：遊戲內分鐘，0 = 08:00，600 = 18:00 爆發
const OUTBREAK = 600;
const BASE_BAG = 25;
const CAR_TRUNK = 80;

const ITEMS = {
  rice:     { n: '米（一袋）', cat: 'food', w: 5, meals: 8, cook: true, note: '8 餐 · 要有微波爐才能煮' },
  biscuit:  { n: '口糧餅乾', cat: 'food', w: 1, meals: 3, note: '3 餐 · 放很久' },
  sausage:  { n: '火腿腸', cat: 'food', w: 0.3, meals: 1, note: '1 餐' },
  noodle:   { n: '泡麵', cat: 'food', w: 0.3, meals: 1, note: '1 餐' },
  can:      { n: '罐頭', cat: 'food', w: 0.5, meals: 1.5, note: '1.5 餐 · 放很久' },
  veg:      { n: '新鮮蔬菜', cat: 'food', w: 1, meals: 2, perish: true, note: '2 餐 · 沒冰櫃 5 天就壞' },
  choco:    { n: '巧克力', cat: 'food', w: 0.2, meals: 0.5, note: '0.5 餐' },
  water:    { n: '瓶裝水（一箱）', cat: 'water', w: 6, waterDays: 3, note: '可喝 3 天' },
  barrel:   { n: '儲水桶', cat: 'water', w: 3, note: '回家裝滿自來水 · 5 天份' },
  rain:     { n: '雨水收集器', cat: 'water', w: 4, note: '雨天每天 2 天份 · 平常 0.25 天份' },
  diesel:   { n: '柴油（20L）', cat: 'power', w: 18, note: '發電機用 · 約 6 度電' },
  board:    { n: '木板', cat: 'mat', w: 3, def: 4, note: '防禦 +4' },
  metal:    { n: '鐵片', cat: 'mat', w: 4, def: 6, note: '防禦 +6' },
  glass:    { n: '玻璃', cat: 'mat', w: 2, def: 3, note: '做尖刺路障 · 防禦 +3' },
  plastic:  { n: '塑膠', cat: 'mat', w: 1, note: '製作材料（M4 才用得到）' },
  matpack:  { n: '隨機材料包', cat: 'mat', w: 6, note: '回家拆開：3 樣隨機材料' },
  medkit:   { n: '急救包', cat: 'med', w: 1, note: '回復 35 生命' },
  pills:    { n: '止痛藥', cat: 'med', w: 0.1, note: '回復 10 生命' },
  tomato:   { n: '番茄種子', cat: 'farm', w: 0.05, note: '一包種 2 盆' },
  straw:    { n: '草莓種子', cat: 'farm', w: 0.05, note: '一包種 2 盆' },
  mush:     { n: '菇類菌包', cat: 'farm', w: 1, note: '不用光 · 第 6 天起產出' },
  pot:      { n: '花盆', cat: 'farm', w: 2, note: '窗邊種植 1 格' },
  fert:     { n: '肥料', cat: 'farm', w: 2, note: '作物產量 ×1.5' },
  door:     { n: '鈦合金大門', cat: 'equip', w: 0, def: 60, note: '防禦 +60 · 送貨到府' },
  window:   { n: '防彈窗', cat: 'equip', w: 0, def: 30, note: '防禦 +30 · 家裡最多裝 2 扇' },
  gen:      { n: '中型柴油發電機', cat: 'equip', w: 0, note: '燒柴油發電 · 送貨到府' },
  solar:    { n: '太陽能板', cat: 'equip', w: 0, note: '晴天每天 1.5 度 · 送貨到府' },
  battery:  { n: '家用儲電站', cat: 'equip', w: 0, note: '存 10 度電 · 送貨到府' },
  freezer:  { n: '冰櫃', cat: 'equip', w: 0, note: '耗電 1 度/天 · 蔬菜不會壞' },
  microwave:{ n: '微波爐', cat: 'equip', w: 0, note: '耗電 0.5 度/天 · 才能煮米' },
  ac:       { n: '冷氣（冷暖）', cat: 'equip', w: 0, note: '寒潮時取暖 · 耗電 1.5 度/天' },
  pedal:    { n: '人力發電機', cat: 'equip', w: 0, note: '踩 1 小時 = 1.5 度電 · 很累' },
  rice_c:   { n: '熟飯', cat: 'food', w: 0.5, note: '1 份 · 2 天內要吃' },
  tomato_p: { n: '番茄', cat: 'food', w: 0.2, note: '自己種的' },
  straw_p:  { n: '草莓', cat: 'food', w: 0.1, note: '自己種的' },
  mushroom: { n: '菇', cat: 'food', w: 0.2, note: '菌包長的' },
  soup:     { n: '蔬菜湯', cat: 'food', w: 0.5, note: '料理 · 2 天內要吃' },
  hotpot:   { n: '火鍋', cat: 'food', w: 1, note: '料理 · 當天要吃' },
  heater:   { n: '暖爐', cat: 'equip', w: 0, note: '寒潮時燒木板取暖' },
  drone:    { n: '教學無人機', cat: 'equip', w: 0, note: '可以交易和空投' },
  juicer:   { n: '榨汁機', cat: 'equip', w: 0, note: '2 份蔬果榨 1 瓶果汁 · 交易好用' },
  juice:    { n: '果汁', cat: 'food', w: 0.5, note: '不會壞 · 交易熱門貨' },
  brewer:   { n: '釀酒機', cat: 'equip', w: 0, note: '3 個番茄或草莓釀 1 瓶高度酒' },
  alcohol:  { n: '高度酒', cat: 'mat', w: 1, note: '做燃燒瓶的原料' },
  molotov:  { n: '燃燒瓶', cat: 'mat', w: 1, note: '守夜時丟出，每瓶擋 120' },
  wu:       { n: '飲用水', cat: 'water', w: 0, note: '1 份 = 水分 +30' },
  lightbox: { n: '植物燈種植箱', cat: 'equip', w: 0, note: '4 格 · 耗電 1 度/天 · 產量較高' }
};
const CAT_NAMES = { food: '食物', water: '水', power: '燃料', mat: '材料', med: '醫療', farm: '種植', equip: '設備（送貨到府）' };
const CAT_ORDER = ['food', 'water', 'power', 'mat', 'med', 'farm', 'equip'];

const STORES = {
  home:  { n: '家', x: 0, y: 0, desc: '公寓三樓。門口有收舊家具的阿姨。爆發後市電會斷，用電設備要自己準備電源。' },
  conv:  { n: '社區便利店', x: 1, y: 0, closes: 690, desc: '離家最近，什麼都有一點，價格偏貴。',
           items: { sausage: [5, 15], noodle: [4, 20], biscuit: [20, 4], choco: [6, 10], water: [12, 6], microwave: [75, 1] } },
  pharm: { n: '藥局', x: 1, y: 2, closes: 570, desc: '醫療用品只有這裡買得到。',
           items: { medkit: [25, 6], pills: [8, 10] } },
  mart:  { n: '特價超市', x: 3, y: 2, closes: 690, desc: '便宜量大。收音機說今天可能會有搶購潮。',
           items: { rice: [30, 6], biscuit: [15, 10], sausage: [4, 20], noodle: [3, 20], can: [8, 12], veg: [10, 6], water: [10, 8] } },
  tool:  { n: '工具店', x: 4, y: 1, closes: 600, desc: '建材和柴油。老闆說柴油只剩這些。',
           items: { board: [15, 10], metal: [20, 8], glass: [10, 6], plastic: [8, 6], matpack: [25, 4], diesel: [40, 8], barrel: [20, 6], rain: [45, 2] } },
  reno:  { n: '裝修公司', x: 5, y: -1, closes: 540, delivery: true, desc: '大型設備都在這。16:00 前下單才送得到。',
           items: { door: [450, 1], window: [300, 2], gen: [350, 2], solar: [250, 3], battery: [200, 2], freezer: [150, 1], microwave: [60, 1], ac: [280, 1], pedal: [120, 1], juicer: [90, 1], brewer: [150, 1], board: [18, 10] } },
  farm:  { n: '農貿市場', x: -2, y: 3, closes: 600, delivery: true, desc: '種子和新鮮蔬菜。',
           items: { tomato: [10, 6], straw: [12, 6], mush: [15, 4], pot: [15, 8], fert: [8, 5], veg: [8, 10], lightbox: [120, 2], matpack: [25, 2] } },
  cars:  { n: '二手車行', x: -3, y: -1, closes: 540, desc: '一台舊小車 $500，不要了可以 $450 賣回。' }
};
const STORE_ORDER = ['home', 'conv', 'pharm', 'mart', 'tool', 'reno', 'farm', 'cars'];

const FURNITURE = [
  { id: 'sofa', n: '舊沙發', p: 120 },
  { id: 'tv', n: '電視', p: 90 },
  { id: 'wardrobe', n: '衣櫃', p: 70 },
  { id: 'desk', n: '書桌', p: 50 }
];

// 準備期事件（分鐘 = 08:00 之後）
const EVENTS = [
  { id: 'panic', at: 152, txt: '10:32 收音機廣播：市區開始搶購。特價超市店員跑光了，到 11:30 前東西可以免費拿。' },
  { id: 'panicEnd', at: 210, txt: '11:30 搶購潮後，特價超市庫存剩一半，超市和便利店的食物、水漲價 50%。' },
  { id: 'waterOut', at: 300, txt: '13:00 便利店的水被搶光了。' },
  { id: 'noDelivery', at: 480, txt: '16:00 送貨車停駛，之後在裝修公司和農貿市場買的設備送不到。' },
  { id: 'closeReno', at: 540, txt: '17:00 裝修公司、二手車行關門。' },
  { id: 'warn', at: 540, txt: '17:00 剩最後一小時，記得趕回家。', silentJournal: true }
];

// 爆發後的時程（M1 只用來估算能撐幾天）
const HORDES = [[3, 25], [7, 40], [12, 60], [18, 80], [25, 100], [32, 125], [40, 150], [50, 200], [60, 240], [75, 280], [90, 320]];
const COLD = [22, 35];
const RAIN = [[40, 48], [61, 66]];

const UPGRADES = [
  { id: 'time', n: '提早醒來', d: '準備時間 +30 分鐘', cost: 3, max: 4 },
  { id: 'money', n: '存款', d: '初始資金 +$150', cost: 3, max: 4 },
  { id: 'bag', n: '大背包', d: '背包容量 +5kg', cost: 2, max: 4 }
];
