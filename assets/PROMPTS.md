# 生存日誌：全部素材清單與提示詞（華麗版）

這份是**完整清單**：遊戲裡每一樣看得到的東西都列在這裡，附編號、檔名代號和提示詞。
- ✅ = 已經有你的圖（想讓整體更華麗、更一致，可以用新風格重做，不重做也沒關係）
- ⬜ = 還沒有，目前用程式畫的圖或表情符號代替

圖生好直接在對話裡傳給我，說編號就好（例如「F7」）。去背、裁切、縮小、接進遊戲都由我處理。
（舊版提示詞留在 `PROMPTS-v1.md`。）

---

## 怎麼用

1. 每張都先貼對應的「風格」（A／B／C／D／E），再接那張自己的描述。
2. 背景一律純白，不用自己去背。
3. 一張圖裡有好幾個東西時，**照描述的順序排**（左到右、上到下），我會照順序切開。
4. 同一個角色或動物有好幾張時，先做第一張，再拿它當參考圖生成其他張，才會長得一樣。
5. 想更華麗：句尾加 `more ornate details, richer colors`；太花了：加 `simpler, cleaner shapes`。

---

## 五種風格（每張前面貼一種）

**風格 A：遊戲物件（角色、家具、動物、建築）**
```
Top-down 3/4 view game sprite for a cozy post-apocalyptic survival game, camera looking down from above at a slight angle so you see the top surface and a little of the front. Richly detailed hand-painted illustration, clean dark brown outlines, warm muted palette with jewel-tone accents (amber, teal, deep crimson), soft cel shading with gentle gradients, warm golden rim light, small decorative details like brass rivets, carved wood trim, embroidered fabric, tiny stickers and charms, slightly worn but lovingly cared for. Single subject, centered, fills most of the frame, isolated on a plain pure white background, no floor, no cast shadow on the background, no text, no watermark.
```

**風格 B：物品圖示（一張 8 個）**
```
Premium game inventory icon sheet, 8 separate item icons arranged in 2 rows of 4, evenly spaced with generous empty white space between them, cozy post-apocalyptic survival game, richly detailed hand-painted illustration, clean dark brown outlines, warm muted palette with jewel-tone accents, soft cel shading with gentle gradients, a subtle warm highlight glint on each item, small charming details, each item seen from a slight 3/4 angle, plain pure white background, no grid lines, no frames, no labels, no text, no numbers. In this exact order, left to right, top row then bottom row:
```

**風格 C：寬幅場景插圖（比例 16:6）**
```
Wide horizontal illustration, side view, cozy post-apocalyptic survival game art, richly detailed hand-painted style, cinematic warm lighting with golden hour glow and soft volumetric light, overgrown vines and wildflowers reclaiming the city, abandoned but beautiful and melancholic, a few shambling zombies small and far in the background, no text, no people in the foreground.
```

**風格 D：人物頭像（比例 1:1）**
```
Circular character portrait inside an ornate thin brass frame with small engraved leaf patterns, cozy post-apocalyptic survival game, richly detailed hand-painted illustration, clean dark brown outlines, warm muted palette, soft warm rim light, expressive friendly face, chest-up, plain pure white background outside the frame, no text.
```

**風格 E：故事插圖卡（比例 4:3）**
```
Storybook illustration card for a cozy post-apocalyptic survival game, painterly hand-painted style, emotional and cinematic, soft warm light, rich colors with gentle film grain, delicate ornate vignette border with faint gold filigree corners, no text, no watermark.
```

---

## A. 角色與生物（風格 A，比例 1:1）

| 編號 | 代號 | 內容 | 狀態 |
|---|---|---|---|
| A1–A6 | char_idle / walk1 / walk2 / work / eat / sleep | 主角六個動作 | ✅ |
| A7 | char_wash | 主角洗臉 | ⬜ |
| A8 | char_hurt | 主角受傷 | ⬜ |
| A9–A11 | zombie_walk / bash / dead | 殭屍三個動作 | ✅ |
| A12 | zombie_hat | 戴毛帽的殭屍（變化款） | ⬜ |
| A13 | dog_idle / dog_walk | 狗 | ✅ |
| A14 | rat | 老鼠 | ✅ |
| A15 | cat_idle | 橘貓站著 | ⬜ |
| A16 | cat_walk | 橘貓走路 | ⬜ |
| A17 | cat_sleep | 橘貓睡覺 | ⬜ |
| A18 | hen | 母雞 | ⬜ |
| A19 | rabbit_idle | 兔子 | ⬜ |
| A20 | rabbit_hop | 兔子跳 | ⬜ |
| A21 | bees | 一小群蜜蜂 | ⬜ |
| A22–A25 | nbf_wang / chen / jie / lin | 四位鄰居全身（站在房間裡用） | ⬜ |

```
A7: The same young Asian survivor as reference (short black hair, dark blue hoodie, brown backpack, cargo pants), washing face over a small basin, water splashing, towel over shoulder, full body, small chibi proportions.
A8: Same survivor as reference, limping and holding one arm, bandage on forehead, tired but determined expression, full body, small chibi proportions.
A12: A shambling zombie wearing a faded red knitted beanie and a torn yellow raincoat, grey-green skin, arms forward, glowing red eyes, full body, small chibi proportions, creepy but oddly endearing, not gory.
```
橘貓（先做 A15 當參考）：
```
A15: A chubby orange tabby cat with a tiny bell on a red collar, standing side view facing right, fluffy tail up, full body.
A16: Same cat as reference, walking side view facing right, one paw lifted, tail swaying.
A17: Same cat as reference, curled up sleeping in a ball, seen from above, peaceful.
```
牧場動物：
```
A18: A plump white hen with a bright red comb and golden-brown wing tips, standing side view facing right, full body.
A19: A fluffy cream-colored rabbit with one brown ear, sitting side view facing right, full body.
A20: Same rabbit as reference, mid-hop side view facing right, ears back.
A21: A small swarm of five cute fuzzy honeybees in a loose cluster, golden stripes, shimmering wings.
```
鄰居全身（跟 D1–D4 頭像同一人）：
```
A22: A kind elderly Taiwanese grandma with a grey bun, floral blouse, cardigan and walking cane, standing, full body, small chibi proportions.
A23: A shy boy about 10 holding hands with his little sister about 6, both in school uniforms, standing, full body, small chibi proportions.
A24: A scruffy mechanic man in his thirties with stubble, grease-stained jacket, unlit cigarette behind ear, wrench in hand, full body, small chibi proportions.
A25: A gentle middle-aged science teacher with round glasses, knitted vest, carrying a notebook, full body, small chibi proportions.
```

---

## B. 家具（風格 A）

已有的全部 ✅：床、好床、馬桶、工作台、冰櫃、微波爐、發電機、儲電站、冷氣、暖爐、種植箱（含豐收版）、人力發電、榨汁機、釀酒機、精煉機、雷達、三台機器人、置物架、花盆架、大儲物櫃、溫室架、工具牆、配電盤，還有大門、窗戶、地板、牆。

**建議重做（角度跟其他家具不一致）**：床、好床、馬桶、微波爐、冷氣。用原本的描述，句尾加 `seen straight from above, top-down, not isometric`。冷氣改成落地式：`a white portable floor-standing air conditioner`。

---

## C. 頂樓與農場建築（風格 A）

| 編號 | 代號 | 內容 | 比例 |
|---|---|---|---|
| C1 | roof_bg_day | 頂樓白天全景（背景） | 16:9 |
| C2 | roof_bg_night | 頂樓晚上全景（背景） | 16:9 |
| C3 | coop | 雞舍 | 1:1 |
| C4 | fishtank | 魚菜共生 | 2:1 |
| C5 | shelter | 雨棚 | 2:1 |
| C6 | starchair | 觀星椅 | 1:1 |
| C7 | veg_bed | 頂樓菜圃（空的） | 2:1 |
| C8 | heat_lamp | 加溫燈 | 1:1 |
| C9 | sprinkler | 自動灑水 | 1:1 |
| C10 | herb_bed | 草藥圃（空的） | 2:1 |
| C11 | hutch | 兔籠 | 2:1 |
| C12 | hive | 蜂箱 | 1:1 |
| C13 | wormbox | 蚯蚓箱 | 1:1 |
| C14 | dryer | 曬架 | 2:1 |
| C15 | smoker | 煙燻爐 | 1:1 |
| C16 | jars | 醃漬缸（三個） | 2:1 |
| C17 | compost | 堆肥桶 | 1:1 |
| C18 | filter | 雨水過濾塔 | 1:2 |

C1、C2 不貼風格 A，改貼**風格 C**，比例改 16:9：
```
C1: A cozy apartment rooftop in a quiet Taiwanese city during the day, seen from a slightly elevated angle, tiled concrete floor, low railing with hanging potted plants and string lights, water tower, laundry line, distant skyline with overgrown buildings, soft blue sky with fluffy clouds, empty space in the middle for placing objects.
C2: The same rooftop at night, warm fairy lights glowing along the railing, a sky full of stars and a soft milky way, distant dark city with a few lonely lights, peaceful and magical, empty space in the middle.
```
C3–C18（風格 A）：
```
C3: A charming wooden chicken coop with a red shingled roof, a little ramp, nesting boxes with straw, a hand-painted heart sign.
C4: An aquaponics setup: a blue rectangular fish tank with orange tilapia visible through the glass, a planter tray of lush greens on top, copper pipes and a small pump, horizontal orientation.
C5: A rooftop rain shelter with a red-and-cream striped canvas awning on metal poles, a rain gutter funneling into a blue barrel, horizontal orientation.
C6: A cozy wooden reclining stargazing chair with a knitted blanket, a small lantern and a thermos beside it.
C7: An empty raised wooden garden bed filled with rich dark soil, neat rows, little wooden plant markers, horizontal orientation.
C8: A tall brass heat lamp with a glowing orange bulb and a warm halo, on a tripod stand.
C9: A small garden sprinkler system: a copper pipe with three spinning sprinkler heads spraying sparkling water droplets.
C10: An empty herb garden planter made of stacked stones and wood, dark soil, small hand-painted signs, horizontal orientation.
C11: A cozy wooden rabbit hutch with a wire mesh front, hay inside, a carrot-shaped name sign, a small ramp, horizontal orientation.
C12: A classic white-and-honey-yellow wooden beehive with stacked boxes, a little copper roof, a few bees around it.
C13: A wooden worm composting box with the lid open showing rich soil and a few pink earthworms, a small trowel leaning on it.
C14: A bamboo drying rack with sweet potato slices, red chili strings and leafy vegetables hanging to dry in the sun, horizontal orientation.
C15: A small brick-and-metal smokehouse oven with a chimney puffing soft smoke, glowing embers at the bottom, hanging fish visible inside.
C16: Three ceramic pickling jars of different sizes with cloth-tied lids and handwritten paper labels, glossy glaze, horizontal orientation.
C17: A wooden compost bin with slatted sides, vegetable scraps and leaves inside, a small pitchfork leaning on it.
C18: A tall homemade rainwater filtration tower made of a clear barrel with layers of gravel, sand and charcoal visible, a brass tap at the bottom, a funnel on top, vertical orientation.
```

---

## D. 人物頭像（風格 D，比例 1:1）

| 編號 | 代號 | 內容 |
|---|---|---|
| D1 | nb_wang | 王阿姨 |
| D2 | nb_chen | 陳家兄妹 |
| D3 | nb_jie | 阿傑 |
| D4 | nb_lin | 林老師 |
| D5 | p_zoe | 隔壁的女孩 Zoe |
| D6 | p_mgr | 倉庫經理 |
| D7 | p_ming | 無線電的阿明 |
| D8 | p_captain | 海星號老船長 |
| D9 | p_sister | 妹妹 |
| D10 | p_oldman | 超市阿伯 |

```
D1: A kind elderly Taiwanese grandma with a grey bun, floral blouse and jade bracelet, warm smile.
D2: A shy boy about 10 and his little sister about 6 side by side, the sister holding a crayon drawing.
D3: A scruffy mechanic in his thirties with stubble, a grease smudge on his cheek, unlit cigarette, half smirk.
D4: A gentle middle-aged science teacher with round glasses and a knitted vest, holding a pencil.
D5: A teenage girl with a messy ponytail and a too-big hoodie, cautious but hopeful eyes.
D6: A tired middle-aged warehouse manager with a clipboard, reflective vest and a stubbled jaw.
D7: A cheerful young man wearing headphones with a radio microphone, waving.
D8: A weathered old fisherman captain with a white beard, navy cap and a pipe, kind wrinkles.
D9: A teenage girl with short hair and a school camp T-shirt, holding a walkie-talkie, bright determined smile.
D10: A friendly old man in a supermarket apron, holding a red envelope, big grin.
```

---

## E. 作物生長階段（風格 A，比例 3:4，一張 4 種植物）

每張排成 **4 列 × 3 欄**：每一列一種植物，左到右是「小芽／長到一半／成熟可以收」，都種在一小塊土裡、從上往下看。

在風格 A 後面接這段，再接下表那一張的四種植物：
```
A plant growth chart sheet, 4 rows by 3 columns, evenly spaced with white space between, each cell shows one plant in a small round patch of dark soil seen from a top-down 3/4 angle, left column seedling, middle column half grown, right column fully grown and ready to harvest with ripe produce and a tiny sparkle. Rows from top to bottom:
```
| 編號 | 四列（上到下） |
|---|---|
| E1 | tomato plant / strawberry plant / yellow rapeseed flowers / brown mushrooms on a log |
| E2 | purple sweet potato vine / round green cabbage / green onion / red chili pepper plant |
| E3 | tall corn stalk / Thai basil / mung bean sprouts in a tray / pumpkin vine |
| E4 | taro with big heart-shaped leaves / peanut plant / sugarcane / tea bush |
| E5 | mint / aloe vera / mugwort / honeysuckle with white and yellow flowers |
| E6 | ginger plant（只有一列，其他三列留白） |

---

## F. 物品圖示（風格 B，比例 2:1，一張 8 個）

照順序排。括號裡是代號，方便我對照，生成時可以留著。

**F1 基本食物**
```
1) a cloth sack of rice (rice), 2) a pack of hard ration biscuits (biscuit), 3) a red plastic sausage stick (sausage), 4) a cup of instant noodles (noodle), 5) a tin can of food with a vintage label (can), 6) a bunch of fresh leafy vegetables (veg), 7) a chocolate bar half unwrapped in gold foil (choco), 8) a bowl of steamed white rice (rice_c)
```
**F2 水與能源**
```
1) a case of bottled water (water), 2) a single water bottle (wu), 3) a blue water storage barrel (barrel), 4) a rain collector bucket with a funnel (rain), 5) a red diesel jerry can (diesel), 6) a pack of AA batteries (cell), 7) a can of coffee (coffee), 8) a bottle of vitamin pills (vitamin)
```
**F3 材料**
```
1) a stack of wooden planks (board), 2) scrap metal sheets (metal), 3) a pane of glass (glass), 4) a pile of plastic scraps (plastic), 5) a bundle of mixed scraps tied with rope (matpack), 6) a taped cardboard parcel (pkg), 7) a homemade noise maker with an alarm clock and tin cans (noise), 8) a stack of sandbags (sandbag)
```
**F4 醫療與照明**
```
1) a first aid kit with a red cross (medkit), 2) a blister pack of painkillers (pills), 3) an antibiotic vial with a syringe (antib), 4) a wooden splint with bandage (splint), 5) a bar of soap with bubbles (soap), 6) a molotov cocktail with a cloth wick (molotov), 7) a red signal flare (flare), 8) a beeswax candle with a soft flame (candle)
```
**F5 武器與飲料**
```
1) a wooden baseball bat with a tape grip (bat), 2) a red crowbar (crowbar), 3) a homemade wooden bow with arrows (bow), 4) a glass bottle of strong liquor (alcohol), 5) a juice box with a straw (juice), 6) a cup of bubble milk tea (bubble), 7) a paper bag of Taiwanese popcorn chicken (friedchk), 8) a block of golden beeswax (wax)
```
**F6 種子 A**
```
1) a seed packet with a tomato picture (tomato), 2) a seed packet with a strawberry picture (straw), 3) a seed packet with a yellow rapeseed flower (rape), 4) a mushroom grow bag (mush), 5) an empty terracotta pot (pot), 6) a bag of fertilizer (fert), 7) a sweet potato seedling wrapped in paper (yam), 8) a seed packet with a cabbage picture (cabbage)
```
**F7 種子 B**
```
1) a bundle of green onion seedlings (scallion), 2) a seed packet with a red chili (chili), 3) a seed packet with corn (corn), 4) a seed packet with a basil leaf (basil), 5) a cloth bag of mung beans (sprout), 6) a seed packet with a pumpkin (pumpkin), 7) a small taro tuber with a sprout (taro), 8) a seed packet with peanuts (peanut)
```
**F8 種子 C 與草藥苗**
```
1) a sugarcane cutting (cane), 2) a small tea seedling in a pot (tea), 3) a mint seedling (mint), 4) a baby aloe in a pot (aloe), 5) a mugwort seedling (mugwort), 6) a honeysuckle cutting with one flower (honeys), 7) a knobby ginger root with a sprout (ginger), 8) a white hen sitting (hen)
```
**F9 農產 A**
```
1) a ripe red tomato (tomato_p), 2) a few strawberries (straw_p), 3) a cluster of brown mushrooms (mushroom), 4) a bundle of rapeseed stalks (rape_p), 5) a purple sweet potato (yam_p), 6) a round green cabbage (cabbage_p), 7) a bunch of green onions (scallion_p), 8) a few red chili peppers (chili_p)
```
**F10 農產 B**
```
1) an ear of corn with husk (corn_p), 2) a sprig of Thai basil (basil_p), 3) a handful of bean sprouts (sprout_p), 4) an orange pumpkin (pumpkin_p), 5) a purple-flecked taro root (taro_p), 6) a handful of peanuts in shells (peanut_p), 7) a few sticks of sugarcane (cane_p), 8) a pile of fresh green tea leaves (tea_p)
```
**F11 草藥與肉蛋**
```
1) mint leaves (mint_l), 2) a cut aloe leaf with gel (aloe_l), 3) a bundle of mugwort (mugwort_l), 4) white and yellow honeysuckle flowers (honeys_l), 5) a piece of ginger (ginger_l), 6) a brown egg (egg), 7) a tilapia fish (fish), 8) a cut of raw meat on paper (rabbit_m)
```
**F12 牧場與醬料**
```
1) a jar of golden honey with a dipper (honey), 2) a fluffy rabbit sitting (rabbit), 3) a small wooden box with bees (bees), 4) a block of Taiwanese brown sugar (sugar), 5) a jar of red chili sauce (chili_sauce), 6) a jar of green onion oil (scallion_oil), 7) a jar of peanut butter (peanut_paste), 8) a bag of dried sweet potato strips (yam_dry)
```
**F13 加工品與草藥茶**
```
1) a bag of dried fruit (fruit_dry), 2) a bundle of dried vegetables (veg_dry), 3) a smoked fish on a string (smoked_fish), 4) smoked eggs with amber shells (smoked_egg), 5) a smoked meat leg (smoked_meat), 6) a glass cup of mint tea (mint_tea), 7) a small jar of aloe gel (aloe_gel), 8) a smoldering herbal incense coil (repel)
```
**F14 草藥與基本料理**
```
1) a clay cup of ginger tea with steam (ginger_tea), 2) a paper packet of herbal fever medicine (fever), 3) a cloth herbal first aid pouch (herb_kit), 4) a bowl of vegetable soup (soup), 5) a bubbling hot pot (hotpot), 6) a roasted sweet potato split open with steam (yam_roast), 7) a plate of stir-fried cabbage (cabbage_fry), 8) a bowl of tomato soup (tomato_soup)
```
**F15 料理 A**
```
1) fried rice with canned meat and green onion (fried_rice), 2) a jar of Taiwanese pickled cabbage (pickle), 3) a bowl of creamy corn soup (corn_soup), 4) a bowl of sweet potato congee (yam_congee), 5) stir-fried noodles with bean sprouts (sprout_noodle), 6) spicy stir-fried sausage with chili (spicy_ham), 7) a jar of strawberry jam (jam), 8) a clay pot of three-cup mushrooms with basil (three_cup)
```
**F16 料理 B**
```
1) a bubbling red mala hot pot (mala_pot), 2) a family feast tray (banquet), 3) tomato and egg stir-fry (tomato_egg), 4) egg fried rice (egg_rice), 5) tea eggs with marbled shells (tea_egg), 6) a grilled fish with green onion (grill_fish), 7) a bowl of fish soup with basil (fish_soup), 8) a zongzi wrapped in bamboo leaves (zongzi)
```
**F17 料理 C**
```
1) a bowl of tangyuan in sweet soup (tangyuan), 2) pumpkin soup in a hollowed pumpkin (pumpkin_soup), 3) slices of taro cake (taro_cake), 4) a bowl of peanut soup (peanut_soup), 5) a glass of old-fashioned Taiwanese black tea (black_tea), 6) a pot of braised rabbit stew (rabbit_stew), 7) an old portable radio (radio_set), 8) a rolled blueprint tied with string (bp)
```

---

## G. 收藏品（風格 B，一張 8 個）

**G1 漫畫與老照片**
```
1) a manga volume with a chef fighting zombies on the cover, 2) the same manga series volume 2 with a rooftop tomato garden, 3) volume 3 with a torn last page, 4) the final volume with a cozy noodle shop, 5) a family photo in front of a night market, 6) a class graduation photo, 7) a beach sunset photo, 8) a photo of a grandma's 80th birthday cake
```
**G2 錄音帶與紀念品**
```
1) a cassette tape labeled with a little whale drawing, 2) a second cassette tape with a wave doodle, 3) a school radio club cassette, 4) a cassette with a handwritten label, 5) a tug-of-war champion certificate, 6) a transit card with a cat sticker, 7) a slightly ugly plastic dinosaur prize, 8) a red temple amulet charm
```

---

## H. 場景插圖（風格 C，比例 16:6）

| 編號 | 代號 | 內容 | 狀態 |
|---|---|---|---|
| H1–H5 | scene_smarket / school / hardware / hospital / tech | 五個外出地點 | ✅ |
| H6 | scene_home | 主角住的公寓 | ⬜ |
| H7 | scene_conv | 便利商店 | ⬜ |
| H8 | scene_mart | 超市（爆發前） | ⬜ |
| H9 | scene_pharm | 藥局 | ⬜ |
| H10 | scene_tool | 五金建材行 | ⬜ |
| H11 | scene_reno | 裝修公司 | ⬜ |
| H12 | scene_farm | 農貿市場 | ⬜ |
| H13 | scene_cars | 二手車行 | ⬜ |
| H14 | title | 標題畫面 | ⬜ |

H6–H13 是**爆發前最後一個早上**，所以不要殭屍：把風格 C 的最後一句（a few shambling zombies…）換成 `busy morning before the outbreak, a few hurried shoppers, no zombies`。
```
H6: An old five-story Taiwanese apartment building with balconies full of potted plants, iron window grilles, a scooter parked in front.
H7: A bright 24-hour convenience store with a glowing sign, posters in the windows, a stack of newspapers by the door.
H8: A neighborhood supermarket with colorful sale banners, shopping carts, crates of fruit outside.
H9: A small pharmacy with a green cross sign, shelves of medicine boxes visible through the glass.
H10: A crowded hardware and building materials shop with ladders, pipes and buckets displayed outside.
H11: A home renovation company storefront with a big window display of doors, solar panels and appliances.
H12: A lively traditional farmers' market with stalls of seedlings, vegetables, chickens in cages and rabbits.
H13: A small used car lot with a few old hatchbacks, colorful flags and a handwritten price board.
H14: A lone apartment window glowing warm yellow at dusk in a silent overgrown city, a survivor's silhouette inside with a dog beside them, a sky of deep orange and violet, epic and hopeful.
```

---

## I. 故事插圖卡（風格 E，比例 4:3）

這組要我再寫一點程式才會出現（結局畫面、夢、節日早晨），你給圖我就接上。

**I1–I7 結局**
```
I1 黎明 (dawn): Soldiers and survivors at dawn handing over a folder of evidence, the city skyline lit gold, rebuilding begins.
I2 真相 (truth): A survivor alone at a radio transmitter at night sending a message, screens across the city lighting up with news.
I3 街坊 (community): A small group of neighbors on a rooftop waving at an approaching rescue helicopter, holding hands.
I4 獨自倖存 (alone): A lone survivor on a rooftop at sunrise hearing a distant helicopter, a dog by their side.
I5 直升機 (heli): A survivor climbing a rope ladder into a helicopter at night, a red flare glowing on the rooftop below.
I6 海星號 (boat): An old fishing boat named Starfish leaving a misty harbor at dawn, the city fading behind.
I7 重逢 (reunion): A brother and sister hugging tightly at the door of a school shelter, tears of joy, warm light inside.
```
**I8–I15 夢（照順序）**
```
I8: A small child's hand holding an adult's hand at a glowing night market, faces out of frame.
I9: A rainy bus stop at night, a phone glowing and ringing on the bench.
I10: A family dining table with four chairs and only one person sitting.
I11: A morning doorway, a teenage girl with a backpack waving goodbye, her brother looking at his phone.
I12: An empty classroom with chalk numbers fading on the blackboard, dust in sunbeams.
I13: A girl speaking into a radio microphone, sound waves drawn in light.
I14: A beach at sunset, an old photo floating in the air with handwriting on the back.
I15: The sister turning around and smiling, a glowing radio dial showing 99.9.
```
**I16–I19 節日**
```
I16 端午: A survivor wrapping zongzi at a kitchen table, bamboo leaves and string, a dragon boat drawing taped on the wall.
I17 中秋: A rooftop barbecue under a huge full moon, pomelos and mooncakes, string lights, friends laughing.
I18 冬至: A steaming bowl of tangyuan held in two hands by a frosty window.
I19 除夕: A small but warm New Year's Eve dinner table with red decorations, a paper lantern and a family photo propped up.
```

---

## J. 介面（風格 A，比例 1:1）

```
J1 (app_icon): App icon, a cozy apartment window glowing at night with a tiny survivor and dog silhouette, rounded square, rich warm colors, no text.
J2 (logo): Game logo emblem, a cracked brass compass rose wrapped in green vines with a small house in the center, ornate, no text.
```

---

## 建議的順序

1. **F1–F17 物品圖示**：最常看到，倉庫、吃東西、廚房、農場全部會用到。
2. **C3–C18 頂樓建築 ＋ A15–A21 動物**：農場畫面會整個變漂亮。
3. **E1–E6 作物生長**：田地和草藥圃。
4. **D1–D10 頭像 ＋ A22–A25 鄰居全身**。
5. **H6–H14 場景**、**I 故事插圖**、**G 收藏品**、**J 介面**。

新圖大約 **105 張**（其中物品和收藏品是 19 張圖示表，每張 8 個）。
