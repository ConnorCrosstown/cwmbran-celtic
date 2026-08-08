#!/usr/bin/env python3
"""
Press-coverage graphic for Instagram, on the club's own frame.

    python3 press.py

Quotes the publication's headline and names them, which is what "as seen in"
means. Deliberately does NOT reproduce their masthead, typeface or commissioned
artwork — that would be passing their brand off as ours. The typography here is
the club's.
"""
import os
from collections import Counter
from psd_tools import PSDImage
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__)) + '/'
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
THEME = REPO + '/wordpress-theme/cwmbran-celtic-2025/assets/img/'
FRAMES = os.path.expanduser('~/Downloads/')
OUT = os.path.expanduser('~/Downloads/CCFC Matchday Graphics/Club News/')

NAVY = (12, 35, 64)
INK = (24, 28, 34)
MUTED = (110, 120, 132)
BLACK_F = HERE + 'ArchivoBlack-Regular.ttf'
BODY_F = HERE + 'Archivo.ttf'
BAND_X0, BAND_X1, LABEL_TOP = 950, 1029, 67
CX = 515

JOB = dict(
    psd='Men Navy Insta New.psd',
    label='IN THE PRESS',
    kicker='AS SEEN IN',
    outlet='THE GUARDIAN',
    headline='Why Super Furry Animals joined music\u2019s dash to '
             'cross over football\u2019s vinyl frontier',
    byline='Emma John · Saturday 8 August 2026',
    bands=('SUPER FURRY ANIMALS · MOGWAI', 'PANIC SHACK · LOOSE ARTICLES'),
    foot='10% OF EVERY SHIRT SUPPORTS MUSIC VENUE TRUST',
    out='2026-08-08 Guardian feature.png',
)


def black(sz):
    return ImageFont.truetype(BLACK_F, sz)


def body(sz, wght=600):
    f = ImageFont.truetype(BODY_F, sz)
    f.set_variation_by_axes([wght, 100])   # [Weight, Width] — that order
    return f


def text_w(d, s, font, tracking=0):
    if not tracking:
        return d.textlength(s, font=font)
    return sum(d.textlength(c, font=font) for c in s) + tracking * (len(s) - 1)


def tracked(d, xy, s, font, fill, tracking=0, centre=False):
    x, y = xy
    if centre:
        x -= text_w(d, s, font, tracking) / 2
    for c in s:
        d.text((x, y), c, font=font, fill=fill)
        x += d.textlength(c, font=font) + tracking


def wrap(d, text, font, max_w):
    """Greedy wrap. The headline is fixed copy, so this only has to be right for
    the text it is given rather than clever."""
    words, lines, cur = text.split(), [], ''
    for w in words:
        trial = (cur + ' ' + w).strip()
        if d.textlength(trial, font=font) <= max_w or cur == '':
            cur = trial
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines


def fit_wrapped(d, text, max_w, max_h, lo=20, hi=96, leading=1.14):
    """Largest size at which the wrapped headline fits its box. Set too large it
    would run into the strap; too small and the quote stops carrying the card."""
    best = (lo, wrap(d, text, black(lo), max_w))
    for size in range(lo, hi + 1):
        f = black(size)
        lines = wrap(d, text, f, max_w)
        if len(lines) * size * leading <= max_h:
            best = (size, lines)
        else:
            break
    return best


def frame(name):
    psd = PSDImage.open(FRAMES + name)
    label_col = NAVY
    for layer in psd:
        if layer.kind == 'type':
            im = layer.composite().convert('RGBA')
            seen = Counter(im.getpixel((x, y))[:3]
                           for y in range(im.height) for x in range(im.width)
                           if im.getpixel((x, y))[3] > 200)
            if seen:
                label_col = seen.most_common(1)[0][0]
            layer.visible = False
    base = Image.new('RGBA', (1080, 1350), (255, 255, 255, 255))
    base.alpha_composite(psd.composite(force=True).convert('RGBA'))
    return base, base.convert('RGB').getpixel((10, 10)), label_col


def build(job):
    canvas, accent, label_col = frame(job['psd'])
    d = ImageDraw.Draw(canvas)

    # Vertical label, centred on the visible band — see batch.py for why 950-1029.
    vf = black(62)
    asc, desc = vf.getmetrics()
    strip = Image.new('RGBA', (int(d.textlength(job['label'], font=vf)) + 8, asc + desc), (0, 0, 0, 0))
    ImageDraw.Draw(strip).text((4, 0), job['label'], font=vf, fill=label_col)
    strip = strip.rotate(-90, expand=True)
    ink = strip.getbbox()
    if ink:
        strip = strip.crop(ink)
    canvas.alpha_composite(strip, (round((BAND_X0 + BAND_X1) / 2 - strip.width / 2), LABEL_TOP))

    y = 116
    tracked(d, (CX, y), job['kicker'], body(30, 700), MUTED, tracking=10, centre=True)
    y += 52
    of = black(min(74, int(74 * 780 / max(1, d.textlength(job['outlet'], font=black(74))))))
    d.text((CX, y), job['outlet'], font=of, fill=accent, anchor='ma')
    y += of.size + 34
    d.rectangle([CX - 300, y, CX + 300, y + 4], fill=accent)
    y += 46

    # The headline, quoted.
    size, lines = fit_wrapped(d, '“' + job['headline'] + '”', 790, 430)
    hf = black(size)
    for ln in lines:
        d.text((CX, y), ln, font=hf, fill=NAVY, anchor='ma')
        y += int(size * 1.14)
    y += 22

    tracked(d, (CX, y), job['byline'].upper(), body(25, 600), MUTED, tracking=5, centre=True)
    y += 56
    d.line([(CX - 62, y), (CX + 62, y)], fill=(214, 220, 226), width=3)
    y += 30

    sf = body(30, 700)
    for ln in job['bands']:
        tracked(d, (CX, y), ln, sf, NAVY, tracking=3, centre=True)
        y += 42
    y += 16
    ff = body(25, 600)
    for ln in wrap(d, job['foot'], ff, 780):
        tracked(d, (CX, y), ln, ff, accent, tracking=4, centre=True)
        y += 34

    # Crest and site at the foot. Without it the card ended 200px short of the
    # panel and read as unfinished rather than airy.
    y += 40
    crest = Image.open(THEME + 'club-logo.webp').convert('RGBA').resize((104, 104), Image.LANCZOS)
    canvas.alpha_composite(crest, (CX - 52, int(y)))
    y += 118
    tracked(d, (CX, y), 'CWMBRANCELTIC.COM', body(26, 700), MUTED, tracking=7, centre=True)
    y += 34

    os.makedirs(OUT, exist_ok=True)
    canvas.convert('RGB').save(OUT + job['out'], quality=95)
    print(f"  wrote {job['out']}  (content ends y={y}, panel ends 1158)")
    if y > 1158:
        print('  WARNING: content overflows the panel')
    return OUT + job['out']


if __name__ == '__main__':
    build(JOB)
