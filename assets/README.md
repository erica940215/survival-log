# 素材規格

把素材放進這個資料夾，跟我說一聲，我會把檔名登記進程式（`src/js/63-iso.js` 的 `ISO_ASSETS`、`src/js/98z-setup.js` 的 `SCENE_ASSETS`、`MUSIC_ASSETS`）。沒有提供的部分會繼續用程式畫的版本，所以可以一次給一部分。

## 一、2.5D 據點物件（最優先）

- 格式：PNG，**透明背景**。
- 視角：等角（isometric）2:1，也就是地板格子是寬:高 = 2:1 的菱形，物件朝左前方。
- 尺寸：1 格的地板菱形寬 **128 px**、高 64 px。
  - 1×1 的物件：圖寬 **128 px**，高約 160 px（可以更矮，不要更寬）。
  - 2×1 的物件：圖寬 **192 px**，高約 240 px。2 格長的物件畫「長邊沿著右下方延伸」那個方向，轉向時程式會左右翻轉。
- 錨點：物件的**底部對齊圖片底邊**，左右置中。圖片上方留透明空間沒關係。
- 檔名：`assets/iso/obj_<代號>.png`

| 代號 | 名稱 | 佔地 |
| --- | --- | --- |
| bed | 床 | 2×1 |
| toilet | 馬桶 | 1×1 |
| bench | 工作台 | 2×1 |
| freezer | 冰櫃 | 1×1 |
| microwave | 微波爐 | 1×1 |
| gen | 柴油發電機 | 2×1 |
| battery | 儲電站 | 1×1 |
| ac | 冷氣 | 1×1 |
| heater | 暖爐 | 1×1 |
| lightbox | 植物燈種植箱 | 2×1 |
| pedal | 人力發電機 | 1×1 |
| juicer | 榨汁機 | 1×1 |
| brewer | 釀酒機 | 1×1 |
| refinery | 精煉機 | 2×1 |
| radar | 雷達 | 1×1 |
| bot_farm | 澆水機器人 | 1×1 |
| bot_fix | 修理機器人 | 1×1 |
| bot_cook | 料理機器人 | 1×1 |
| shelf | 置物架 | 1×1 |
| potrack | 花盆架 | 1×1 |
| storage | 大儲物櫃 | 2×1 |
| greenhouse | 溫室架 | 2×1 |
| workshop | 工具牆 | 2×1 |
| bedroom | 好床 | 2×1 |
| powerroom | 配電盤 | 1×1 |

地板與牆（可選）：

| 檔名 | 內容 | 尺寸 |
| --- | --- | --- |
| assets/iso/floor.png | 一樓、二樓地板（一格） | 128×64 |
| assets/iso/floorB1.png | 地下室地板（一格） | 128×64 |
| assets/iso/wallL.png | 左後方的牆（一整面，不含窗） | 自由，會被拉伸 |
| assets/iso/wallR.png | 右後方的牆（一整面，不含窗） | 自由，會被拉伸 |

## 二、地點插圖

- 格式：PNG 或 JPG，**橫向 16:6**（例如 1080×405），不透明背景也可以。
- 檔名：`assets/scenes/<代號>.png`

準備期：home（家）、conv（便利店）、pharm（藥局）、mart（超市）、tool（工具店）、reno（裝修公司）、farm（農貿市場）、cars（車行）、news（報攤）、gas（加油站）、nightmkt（夜市）

外出：smarket（廢棄超市）、school（學校）、hardware（五金行廢墟）、hospital（醫院）、tech（科技公司）、residential（住宅區）、subway（地鐵站）、police（警察局）

## 三、背景音樂

- 格式：MP3，可以無縫循環最好，每首 **1–2 分鐘、2 MB 以內**。
- 檔名：
  - `assets/music/tense.mp3`：準備期（緊張、倒數感）
  - `assets/music/calm.mp3`：爆發後的白天（安靜、孤單）
  - `assets/music/dark.mp3`：屍潮夜（低沉、壓迫）

## 注意

- 請只提供你有權使用的素材（自己畫的、AI 產生的、或授權允許的免費素材）。
- 檔案越大，網頁開越慢。圖片建議每張 300 KB 以內，總共 10 MB 以內。
