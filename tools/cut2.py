import sys, base64, io
from PIL import Image, ImageFilter
from collections import deque
src = sys.argv[1]; out = sys.argv[2]; H = int(sys.argv[3])
im = Image.open(src).convert('RGB'); W0, H0 = im.size
px = im.load()
def bgish(c):
    r, g, b = c
    return min(r, g, b) > 222 and max(r, g, b) - min(r, g, b) < 26
mask = Image.new('L', im.size, 0); m = mask.load()
q = deque()
for x in range(W0):
    for y in (0, H0 - 1): q.append((x, y))
for y in range(H0):
    for x in (0, W0 - 1): q.append((x, y))
seen = bytearray(W0 * H0)
while q:
    x, y = q.popleft()
    i = y * W0 + x
    if seen[i]: continue
    seen[i] = 1
    if not bgish(px[x, y]): continue
    m[x, y] = 255
    if x > 0: q.append((x - 1, y))
    if x < W0 - 1: q.append((x + 1, y))
    if y > 0: q.append((x, y - 1))
    if y < H0 - 1: q.append((x, y + 1))
# 背景遮罩稍微擴張＋羽化，去白邊
mask = mask.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
alpha = Image.eval(mask, lambda v: 255 - v)
rgba = im.convert('RGBA'); rgba.putalpha(alpha)
# 去掉小雜點：只保留主要區塊的外框
if len(sys.argv) > 4:
    a2 = alpha.load()
    for yy in range(H0):
        for xx in range(W0):
            if bgish(px[xx, yy]): a2[xx, yy] = 0
    alpha = alpha.filter(ImageFilter.MinFilter(3)); rgba.putalpha(alpha)
bbox = alpha.point(lambda v: 255 if v > 40 else 0).getbbox()
rgba = rgba.crop(bbox)
w, h = rgba.size; nw = max(1, round(w * H / h))
rgba = rgba.resize((nw, H), Image.LANCZOS)
rgba.save(out, 'WEBP', quality=88, method=6)
print(out, rgba.size, len(open(out, 'rb').read()))
