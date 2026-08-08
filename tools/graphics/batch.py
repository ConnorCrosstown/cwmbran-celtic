#!/usr/bin/env python3
"""
Matchday graphics for every upcoming Cwmbran Celtic fixture.

Reads fixtures.json (written by export.php straight from the theme's own fixture
lists and kick-off overrides) and renders one 1080x1350 Instagram graphic each.

Frame follows the kit: the green frame for the green-and-white away, the
navy/yellow one for the yellow-and-blue home.
"""
import json, os, sys
from collections import Counter
from psd_tools import PSDImage
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__)) + '/'
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
THEME = REPO + '/wordpress-theme/cwmbran-celtic-2025/assets/img/'
FRAMES = os.path.expanduser('~/Downloads/')
OUT = os.path.expanduser('~/Downloads/CCFC Matchday Graphics/')
# One folder per team, so a matchday's posts aren't hunted out of a list of 70.
TEAM_DIR = {'mens': "Men's First Team", 'reserves': "Men's Reserves",
            'womens': "Women's First Team"}

NAVY = (12, 35, 64)
INK = (24, 28, 34)
MUTED = (110, 120, 132)
# The PSD's label shape spans 948-1036, but the white panel's edge clips it at
# 1029 in both frames, so the VISIBLE band is 950-1029. Centring on the shape
# instead leaves the lettering ~2px right of where it looks centred.
BAND_X0, BAND_X1 = 950, 1029
LABEL_TOP = 67                 # where the source type layer starts
BLACK_F = HERE + 'ArchivoBlack-Regular.ttf'
BODY_F = HERE + 'Archivo.ttf'


def black(sz):
    return ImageFont.truetype(BLACK_F, sz)


def body(sz, wght=600):
    f = ImageFont.truetype(BODY_F, sz)
    # Archivo's axes are ordered [Weight, Width] — reversing them silently gives
    # thin text at maximum width, which is not obviously wrong until you look.
    f.set_variation_by_axes([wght, 100])
    return f


def text_w(draw, s, font, tracking=0):
    if not tracking:
        return draw.textlength(s, font=font)
    return sum(draw.textlength(c, font=font) for c in s) + tracking * (len(s) - 1)


def draw_tracked(draw, xy, s, font, fill, tracking=0, centre=False):
    """Pillow has no letter-spacing, and these caps need it to read as a kicker."""
    x, y = xy
    if centre:
        x -= text_w(draw, s, font, tracking) / 2
    for c in s:
        draw.text((x, y), c, font=font, fill=fill)
        x += draw.textlength(c, font=font) + tracking


_probe = ImageDraw.Draw(Image.new('RGB', (10, 10)))
_fitcache = {}


def fit_size(target_w, s, lo=8, hi=400):
    """Largest size whose rendered width fits target_w."""
    key = (round(target_w), s)
    if key in _fitcache:
        return _fitcache[key]
    best = lo
    while lo <= hi:
        mid = (lo + hi) // 2
        if _probe.textlength(s, font=ImageFont.truetype(BLACK_F, mid)) <= target_w:
            best, lo = mid, mid + 1
        else:
            hi = mid - 1
    _fitcache[key] = best
    return best


_crestcache = {}


def crest(path, px):
    """Fit a badge into a px box, whatever its shape. No circular mask — most
    badges are roundels but Weston's is a shield, and a circle slices its corners
    off. Trimmed of flat light padding first so badges from different sources end
    up the same optical size, then scaled to contain."""
    key = (path, px)
    if key in _crestcache:
        return _crestcache[key]
    im = Image.open(path).convert('RGBA')
    # Content = anything not near-white, OR anything opaque. Done with a LUT on
    # the luma channel rather than a per-pixel loop, which does not scale to 70.
    mask = im.convert('L').point(lambda v: 255 if v < 248 else 0)
    alpha = im.getchannel('A').point(lambda v: 255 if v > 8 else 0)
    mask = Image.composite(mask, Image.new('L', im.size, 0), alpha)
    bb = mask.getbbox()
    if bb:
        im = im.crop(bb)
    w, h = im.size
    sc = px / max(w, h)
    im = im.resize((max(1, round(w * sc)), max(1, round(h * sc))), Image.LANCZOS)
    out = Image.new('RGBA', (px, px), (0, 0, 0, 0))
    out.alpha_composite(im, ((px - im.width) // 2, (px - im.height) // 2))
    _crestcache[key] = out
    return out


_framecache = {}


def frame(psd_name):
    """Base canvas with the frame's own vertical label hidden, plus the colours
    we need from it. Cached — compositing a PSD 70 times would dominate runtime."""
    if psd_name in _framecache:
        return _framecache[psd_name]
    psd = PSDImage.open(FRAMES + psd_name)
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
    accent = base.convert('RGB').getpixel((10, 10))
    _framecache[psd_name] = (base, accent, label_col)
    return _framecache[psd_name]


def build(fx):
    base, accent, label_col = frame(fx['frame'])
    canvas = base.copy()
    d = ImageDraw.Draw(canvas)

    # Vertical label, matched to the original type's 423px length then relabelled.
    # The frame's label band (PSD layer "Rectangle 2") runs x 948-1036, so the
    # lettering belongs on its centre line. Anchoring the rendered strip's left
    # edge to the source type layer's x left it 11px right of centre — the strip
    # carries the font's full ascent and descent, not just the inked glyphs. So
    # trim to the ink and centre that instead.
    vf = black(fit_size(423, "MEN'S TEAM"))
    asc, desc = vf.getmetrics()
    strip = Image.new('RGBA', (int(d.textlength(fx['label'], font=vf)) + 8, asc + desc), (0, 0, 0, 0))
    ImageDraw.Draw(strip).text((4, 0), fx['label'], font=vf, fill=label_col)
    strip = strip.rotate(-90, expand=True)
    ink = strip.getbbox()
    if ink:
        strip = strip.crop(ink)
    canvas.alpha_composite(strip, (round((BAND_X0 + BAND_X1) / 2 - strip.width / 2), LABEL_TOP))

    CX, y = 515, 112
    draw_tracked(d, (CX, y), fx['kicker'], body(33, 700), accent, tracking=8, centre=True)
    y += 58
    d.line([(CX - 62, y + 6), (CX + 62, y + 6)], fill=(214, 220, 226), width=3)
    y += 28
    sub = fx['sub']
    subf = body(26, 600)
    while text_w(d, sub, subf, 7) > 720 and subf.size > 16:
        subf = body(subf.size - 1, 600)
    draw_tracked(d, (CX, y), sub, subf, MUTED, tracking=7, centre=True)

    CREST, cy, gap = 320, 268, 104
    canvas.alpha_composite(crest(THEME + 'club-logo.webp', CREST), (CX - gap // 2 - CREST, cy))
    canvas.alpha_composite(crest(THEME + 'opponents/' + fx['crest'], CREST), (CX + gap // 2, cy))
    vsf = black(72)
    vb = d.textbbox((0, 0), 'V', font=vsf)
    d.text((CX - (vb[2] - vb[0]) / 2 - vb[0], cy + CREST / 2 - (vb[3] - vb[1]) / 2 - vb[1]),
           'V', font=vsf, fill=NAVY)

    # Capped as well as fitted: "UNDY" would otherwise be set enormous just
    # because it fits the width, and shove the details off the panel.
    NAME_MAX = 62
    y = cy + CREST + 48
    f1 = black(min(NAME_MAX, fit_size(780, fx['us'])))
    d.text((CX, y), fx['us'], font=f1, fill=NAVY, anchor='ma')
    y += f1.size + 20
    f2 = black(min(NAME_MAX, fit_size(780, fx['them'])))
    d.text((CX, y), fx['them'], font=f2, fill=NAVY, anchor='ma')
    y += f2.size + 46

    d.rectangle([CX - 300, y, CX + 300, y + 4], fill=accent)
    y += 40
    d.text((CX, y), fx['dateline'], font=body(42, 700), fill=INK, anchor='ma')
    y += 60
    d.text((CX, y), fx['kotext'].upper(), font=black(56), fill=accent, anchor='ma')
    y += 88

    pf = body(31, 700)
    pw = text_w(d, fx['pill'], pf, 9)
    d.rounded_rectangle([CX - pw / 2 - 40, y, CX + pw / 2 + 40, y + 64], radius=32, fill=NAVY)
    draw_tracked(d, (CX, y + 14), fx['pill'], pf, (255, 255, 255), tracking=9, centre=True)
    y += 64
    if fx.get('venue'):
        y += 26
        draw_tracked(d, (CX, y), fx['venue'], body(27, 600), MUTED, tracking=6, centre=True)
        y += 34

    folder = OUT + TEAM_DIR[fx['team']] + '/'
    os.makedirs(folder, exist_ok=True)
    canvas.convert('RGB').save(folder + fx['out'], quality=95)
    return y


fixtures = json.load(open(HERE + 'fixtures.json'))
only = sys.argv[1] if len(sys.argv) > 1 else None
if only:
    fixtures = [f for f in fixtures if only in f['out'] or only == f['team']]
overflow = []
for i, fx in enumerate(fixtures, 1):
    end = build(fx)
    if end > 1158:
        overflow.append((fx['out'], end))
    print(f"  {i:2d}/{len(fixtures)}  {fx['date']}  {fx['team']:8s} {'H' if fx['home'] else 'A'}  "
          f"{fx['opp'][:24]:24} {fx['kotext'][9:]:8} {'' if fx['confirmed'] else 'assumed KO'}")
print(f"\n{len(fixtures)} graphics -> {OUT}")
if overflow:
    print(f"WARNING: {len(overflow)} overflow the panel (ends past y=1158):")
    for o, e in overflow:
        print(f"   {o}  ends {e}")
