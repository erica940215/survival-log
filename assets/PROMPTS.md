# 素材生成提示詞

給 AI 繪圖工具（ChatGPT／Gemini／Midjourney／Leonardo 等）用的提示詞。提示詞用英文寫，因為大多數工具看英文比較準確；每段前面有中文說明。

## 使用方式

1. **每一張都把「共同風格」貼在最前面**，後面再接那一張自己的描述，整套的風格才會一致。
2. 大多數工具做不出透明背景，所以提示詞要求**純白背景**。生成好直接丟給我，去背、裁切、調大小都由我處理。
3. 比例照每張標示的設定（1:1 或 2:1）。工具不能設定比例的話，在提示詞最後加上 `aspect ratio 1:1` 這類字。
4. 先做一張角色和一張床，確定風格喜歡，再做其他的。
5. 不滿意的話，加上 `more detailed`（更細）、`simpler shapes`（更簡單）或 `brighter colors`（更亮）重新生成。

---

## 共同風格（每張都要貼）

```
Top-down 3/4 view game sprite, camera looking down from above at a slight angle so you see the top surface and a little of the front side. Cozy post-apocalyptic survival game, hand-drawn flat illustration, clean dark brown outlines, muted warm palette with soft cel shading, slightly worn and used look. Single object, centered, fills most of the frame, isolated on a plain pure white background, no floor, no cast shadow on the background, no text, no watermark.
```

---

## 一、角色（比例 1:1）

角色是同一個人，四張都要長得一樣。建議做好第一張後，把它當參考圖上傳，再生成其他三張。

**1. 站著（idle）**
```
A young Asian survivor, short black hair, dark blue hoodie, brown backpack, cargo pants, sneakers, standing still facing the viewer, relaxed pose, full body, small chibi proportions (head about 1/3 of body).
```

**2. 走路 A（walk1）**
```
Same character as reference, walking toward the viewer, left foot forward, arms swinging naturally, full body, small chibi proportions.
```

**3. 走路 B（walk2）**
```
Same character as reference, walking toward the viewer, right foot forward, arms swinging naturally, full body, small chibi proportions.
```

**4. 做事中（work）**
```
Same character as reference, crouching slightly and working with a hammer in hand, focused expression, full body, small chibi proportions.
```

---

## 二、殭屍（比例 1:1）

**5. 殭屍走路（zombie_walk）**
```
A shambling zombie, grey-green skin, torn dirty office shirt and jeans, arms stretched forward, hunched posture, red glowing eyes, full body, small chibi proportions, creepy but not gory.
```

**6. 殭屍撞門（zombie_bash）**
```
Same zombie as reference, both arms raised high as if pounding on a door, mouth open, full body, small chibi proportions, not gory.
```

**7. 殭屍倒下（zombie_dead）**
```
Same zombie as reference, lying flat on the ground face down, limp, seen from above, not gory, no blood.
```

---

## 三、動物（比例 1:1）

**8. 狗（dog）**
```
A friendly medium-sized brown mixed-breed dog with floppy ears and a red collar, standing side view facing right, tail up, full body.
```

**9. 狗走路（dog_walk）**
```
Same dog as reference, trotting side view facing right, one front paw lifted, tail wagging, full body.
```

**10. 老鼠（rat）**
```
A small grey rat seen from above, pink tail curled, sneaky pose, full body.
```

---

## 四、家具與設備

標示 **1:1** 的是 1 格大小，**2:1** 的是 2 格長（橫放）。

**11. 床 bed（2:1）**
```
A single bed seen from above, simple wooden frame, white mattress, one white pillow on the left, blue wrinkled blanket covering the right two thirds, horizontal orientation.
```

**12. 好床 bedroom（2:1）**
```
A comfortable double bed seen from above, dark wood frame, two fluffy pillows on the left, thick pink quilt with a folded edge, small bedside lamp, horizontal orientation.
```

**13. 馬桶 toilet（1:1）**
```
A white porcelain toilet seen from above, tank at the back, oval seat with lid open, slightly dirty, clean simple shape.
```

**14. 工作台 bench（2:1）**
```
A sturdy wooden workbench seen from above, scratched plank top, a hammer, a hand saw, a wrench, scattered screws and nails, a small vise on one end, horizontal orientation.
```

**15. 冰櫃 freezer（1:1）**
```
A white chest freezer seen from above, closed lid with a long grey handle, light frost on the edges, small green power light on the front.
```

**16. 微波爐 microwave（1:1）**
```
A small silver microwave oven seen from above and front, dark glass door, vent slits on top, a digital display with green numbers.
```

**17. 發電機 gen（2:1）**
```
An orange portable diesel generator seen from above, black engine block, fuel cap, exhaust pipe, metal frame handles, a little oil stain, horizontal orientation.
```

**18. 儲電站 battery（1:1）**
```
A blue-grey home battery power station seen from above and front, sturdy box, battery level display with green bars, thick cables plugged in.
```

**19. 冷氣 ac（1:1）**
```
A white portable air conditioner seen from above, round fan grille on top, control buttons, flexible exhaust hose.
```

**20. 暖爐 heater（1:1）**
```
A dark red electric space heater seen from above and front, glowing orange heating coils behind a metal grille, warm glow.
```

**21. 種植箱 lightbox（2:1）**
```
A long wooden planter box seen from above, filled with dark soil and rows of small green seedlings, a purple LED grow light bar mounted above, horizontal orientation.
```

**22. 人力發電 pedal（1:1）**
```
A stationary exercise bike connected to a small generator, seen from above, black seat, handlebars, a yellow box with cables.
```

**23. 榨汁機 juicer（1:1）**
```
A yellow countertop juicer machine seen from above, clear container with orange juice, round lid.
```

**24. 釀酒機 brewer（1:1）**
```
A small home brewing setup seen from above, wooden barrel with metal hoops, copper coiled pipe, a glass jug collecting liquid.
```

**25. 精煉機 refinery（2:1）**
```
A makeshift diesel refinery seen from above, two grey metal tanks, copper pipes connecting them, pressure gauges, a yellow fuel canister, industrial and improvised, horizontal orientation.
```

**26. 雷達 radar（1:1）**
```
A small rooftop radar dish on a green metal base seen from above, white dish with a central antenna, a blinking red light.
```

**27. 澆水機器人 bot_farm（1:1）**
```
A small round helper robot seen from above, light blue shell, cute face with two cyan glowing eyes, a watering can arm.
```

**28. 修理機器人 bot_fix（1:1）**
```
A small round helper robot seen from above, orange-tan shell, cute face with two cyan glowing eyes, a wrench arm.
```

**29. 料理機器人 bot_cook（1:1）**
```
A small round helper robot seen from above, cream-yellow shell, cute face with two cyan glowing eyes, wearing a tiny chef hat, a spatula arm.
```

**30. 置物架 shelf（1:1）**
```
A metal storage shelf seen from above and front, cardboard boxes, canned food, water bottles and supplies stacked on it.
```

**31. 花盆架 potrack（1:1）**
```
A small wooden rack with four terracotta pots seen from above, each pot has soil and a green tomato plant.
```

**32. 大儲物櫃 storage（2:1）**
```
A large wooden wardrobe-style storage cabinet seen from above and front, two doors slightly open, boxes, cans and supplies visible inside, horizontal orientation.
```

**33. 溫室架 greenhouse（2:1）**
```
A small indoor greenhouse rack seen from above, clear glass panels, several leafy green vegetable plants in soil trays, horizontal orientation.
```

**34. 工具牆 workshop（2:1）**
```
A wooden workshop table with a pegboard of hanging tools seen from above, saws, hammers, screwdrivers, a drill, organized but well used, horizontal orientation.
```

**35. 配電盤 powerroom（1:1）**
```
A grey electrical power panel cabinet seen from above and front, rows of switches, warning sticker, thick bundled cables.
```

---

## 五、房間（可以不做，有的話更像原作）

**36. 地板（floor，比例 1:1）**
```
Seamless tileable floor texture seen straight from above, worn beige ceramic tiles with subtle cracks and dirt, flat lighting, no objects.
```
（這張不用加「共同風格」，因為它是整片花紋，不是單一物件。）

**37. 牆（wall，比例 3:1）**
```
Seamless tileable interior wall texture seen from the front, faded cream painted concrete with water stains and small cracks, flat lighting, no objects.
```
（這張也不用加「共同風格」。）

**38. 大門（door，比例 1:2）**
```
A heavy reinforced front door seen from the front, dark green paint, wooden planks nailed across it, metal plates, padlock.
```

**39. 窗戶（window，比例 1:1）**
```
A small apartment window seen from the front, grey metal frame, dirty glass, wooden boards partly nailed across it.
```

---

## 六、外出地點插圖（比例 16:6，橫向，不用加「共同風格」）

這組是外出前看到的場景大圖，用另一套風格：

```
Wide horizontal illustration, side view, cozy post-apocalyptic survival game art, hand-drawn flat style, muted warm palette, abandoned and quiet, a few shambling zombies far in the background, no text, no people in foreground.
```

再接上地點：

**40. 超市（smarket）**
```
An abandoned neighborhood supermarket, broken sliding doors, empty shopping carts outside, faded sale banners.
```

**41. 學校（school）**
```
An abandoned elementary school building, empty playground, rusty gate half open, scattered backpacks.
```

**42. 五金行（hardware）**
```
An abandoned hardware store with metal roll-up shutters half open, ladders and tools leaning outside, rusty signboard.
```

**43. 醫院（hospital）**
```
An abandoned small hospital, ambulance parked crooked at the entrance, broken windows, red cross sign flickering.
```

**44. 科技公司（tech）**
```
An abandoned modern tech office building, glass facade with cracks, dead server lights visible inside, empty parking lot.
```

---

## 交給我的時候

- 直接在對話裡傳圖，說是第幾號就好。例如「11 床」。
- 同一個東西有好幾張候選的話，可以一起傳，跟我說要用哪張。
- 背景是白的沒關係，我會去背。
