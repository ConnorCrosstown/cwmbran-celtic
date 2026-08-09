#!/usr/bin/env python3
"""
Full-time score cards for every Men's First Team fixture.

One card per possible scoreline, 0-0 up to 5-5 — 36 per game — in both Instagram
sizes, so whoever is posting at full time picks the right one instead of making it.

    python3 export.php   # (from batch.py's flow) refreshes fixtures.json
    python3 scores.py            # every men's fixture
    python3 scores.py 2026-08-14 # one game

Output: ~/Downloads/CCFC Score Cards/<game>/Feed|Story/

CWMBRAN CELTIC'S SCORE IS ALWAYS FIRST, home or away, because our crest is always
on the left — the same convention as the fixture cards. "CCFC 2-1 Abergavenny Town"
means Celtic scored two. Filenames say so explicitly.

The story size is a SPLICE, not a stretch: both frames carry 661 byte-identical
rows (y 491-1151), so 570 extra rows are inserted inside that band and the frame's
proportions, border and sponsor bar are untouched.
"""
import json
import os
import sys
from collections import Counter

from PIL import Image, ImageDraw, ImageFont
from psd_tools import PSDImage

HERE = os.path.dirname(os.path.abspath(__file__)) + '/'
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
THEME = REPO + '/wordpress-theme/cwmbran-celtic-2025/assets/img/'
FRAMES = os.path.expanduser('~/Downloads/')
OUT = os.path.expanduser('~/Downloads/CCFC Score Cards/')

NAVY = (12, 35, 64)
INK = (24, 28, 34)
MUTED = (110, 120, 132)
BAND_X0, BAND_X1 = 950, 1029
LABEL_TOP = 67
BLACK_F = HERE + 'ArchivoBlack-Regular.ttf'
BODY_F = HERE + 'Archivo.ttf'

MAX_GOALS = 5                      # 0-0 through 5-5
FEED = (1080, 1350)
STORY = (1080, 1920)
SPLICE_ROW = 491                   # inside the identical-row band in both frames


def black(sz):
    return ImageFont.truetype(BLACK_F, sz)


def body(sz, wght=600):
    f = ImageFont.truetype(BODY_F, sz)
    # Archivo's axes are ordered [Weight, Width]. Reversed gives thin text at
    # maximum width, which is not obviously wrong until you look closely.
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
    """Fit a badge into a px box, whatever its shape. No circular mask — most badges
    are roundels but some are shields, and a circle slices the corners off. Trimmed
    of flat light padding first so badges from different sources end up the same
    optical size."""
    key = (path, px)
    if key in _crestcache:
        return _crestcache[key]
    im = Image.open(path).convert('RGBA')
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


def frame(psd_name, size):
    """Base canvas at the requested size, the frame's own vertical label hidden,
    plus the colours taken from it.

    STORY is spliced rather than scaled. Both frames have 661 byte-identical rows
    from y=491, so 570 rows lifted from inside that band extend the white panel and
    the yellow label band without touching the border, the corners or the sponsor
    bar — all of which a resize would squash.
    """
    key = (psd_name, size)
    if key in _framecache:
        return _framecache[key]

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

    feed = Image.new('RGBA', FEED, (255, 255, 255, 255))
    feed.alpha_composite(psd.composite(force=True).convert('RGBA'))

    if size == FEED:
        base = feed
    else:
        extra = size[1] - FEED[1]
        base = Image.new('RGBA', size, (255, 255, 255, 255))
        base.paste(feed.crop((0, 0, size[0], SPLICE_ROW)), (0, 0))
        strip = feed.crop((0, SPLICE_ROW, size[0], SPLICE_ROW + 1)).resize((size[0], extra), Image.NEAREST)
        base.paste(strip, (0, SPLICE_ROW))
        base.paste(feed.crop((0, SPLICE_ROW, size[0], FEED[1])), (0, SPLICE_ROW + extra))

    accent = base.convert('RGB').getpixel((10, 10))
    _framecache[key] = (base, accent, label_col)
    return _framecache[key]


def comp_line(fx):
    """"LEAGUE · ARDAL SOUTH EAST" — the fixture cards split these across the kicker
    and the line beneath, but a result card needs FULL TIME in the kicker slot, so
    the competition and the round move onto one line."""
    a, b = fx['kicker'], fx['sub']
    return a if a == b else f'{a} · {b}'


_panelcache = {}


def panel(base):
    """The white panel's bounds, measured off the frame rather than hardcoded.

    batch.py centres the fixture cards on CX=515, but the panel actually spans
    x 47-948, whose centre is 497 — so those cards sit 18px right of centre. Reading
    it from the pixels means the score cards are centred, and stay centred for the
    spliced story frame where the vertical bounds move.
    """
    key = base.size
    if key in _panelcache:
        return _panelcache[key]
    px = base.convert('RGB').load()
    w, h = base.size
    mid = w // 2
    ys = [y for y in range(h) if px[mid, y] == (255, 255, 255)]
    row = (ys[0] + ys[-1]) // 2
    xs = [x for x in range(w) if px[x, row] == (255, 255, 255)]
    _panelcache[key] = (xs[0], ys[0], xs[-1], ys[-1])
    return _panelcache[key]


def build(fx, us_goals, them_goals, size):
    """Composite one card.

    The content is drawn onto a transparent overlay starting at y=0, measured, then
    composited centred in the white panel. Drawing straight onto the canvas from a
    fixed top margin is what left the first attempt with 176px of dead space on the
    feed and 537px on the story — the card has no kick-off line to fill the gap the
    fixture layout was spaced for.
    """
    base, accent, label_col = frame(fx['frame'], size)
    canvas = base.copy()
    px0, py0, px1, py1 = panel(base)
    CX = (px0 + px1) // 2

    overlay = Image.new('RGBA', size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    story = size == STORY

    y = 0
    draw_tracked(d, (CX, y), 'FULL TIME', body(33 if not story else 40, 700), accent, tracking=8, centre=True)
    y += 58 if not story else 70
    d.line([(CX - 62, y + 6), (CX + 62, y + 6)], fill=(214, 220, 226), width=3)
    y += 28 if not story else 34
    sub = comp_line(fx)
    subf = body(26 if not story else 31, 600)
    while text_w(d, sub, subf, 7) > (px1 - px0 - 60) and subf.size > 16:
        subf = body(subf.size - 1, 600)
    draw_tracked(d, (CX, y), sub, subf, MUTED, tracking=7, centre=True)
    y += (58 if not story else 72)

    # Crests either side, score between them — the fixture cards put a "V" in that
    # slot, so a result reads as the same family with the number where the V was.
    #
    # Sized off the panel, not hardcoded. The story frame is TALLER, not wider, so an
    # earlier attempt at 310px crests with a 350px gap came to 970px across a 902px
    # panel and pushed both badges over the border — measuring the render is the only
    # reason that was caught.
    row_w = (px1 - px0) - 60
    SCORE_GAP = 300 if not story else 310
    CREST = min(250 if not story else 280, (row_w - SCORE_GAP) // 2)
    overlay.alpha_composite(crest(THEME + 'club-logo.webp', CREST), (CX - SCORE_GAP // 2 - CREST, y))
    overlay.alpha_composite(crest(THEME + 'opponents/' + fx['crest'], CREST), (CX + SCORE_GAP // 2, y))

    score = f'{us_goals}-{them_goals}'
    sf = black(min(150 if not story else 190, fit_size(SCORE_GAP - 24, score)))
    sb = d.textbbox((0, 0), score, font=sf)
    d.text((CX - (sb[2] - sb[0]) / 2 - sb[0], y + CREST / 2 - (sb[3] - sb[1]) / 2 - sb[1]),
           score, font=sf, fill=NAVY)
    y += CREST + (48 if not story else 66)

    NAME_MAX = 62 if not story else 74
    avail = row_w
    f1 = black(min(NAME_MAX, fit_size(avail, fx['us'])))
    d.text((CX, y), fx['us'], font=f1, fill=NAVY, anchor='ma')
    y += f1.size + (20 if not story else 26)
    f2 = black(min(NAME_MAX, fit_size(avail, fx['them'])))
    d.text((CX, y), fx['them'], font=f2, fill=NAVY, anchor='ma')
    y += f2.size + (46 if not story else 62)

    d.rectangle([CX - 300, y, CX + 300, y + 4], fill=accent)
    y += 40 if not story else 54
    d.text((CX, y), fx['dateline'], font=body(42 if not story else 50, 700), fill=INK, anchor='ma')
    y += 60 if not story else 76

    pf = body(31 if not story else 37, 700)
    pw = text_w(d, fx['pill'], pf, 9)
    ph = 64 if not story else 76
    d.rounded_rectangle([CX - pw / 2 - 40, y, CX + pw / 2 + 40, y + ph], radius=ph // 2, fill=NAVY)
    draw_tracked(d, (CX, y + (14 if not story else 18)), fx['pill'], pf, (255, 255, 255), tracking=9, centre=True)
    y += ph
    if fx.get('venue'):
        y += 26 if not story else 34
        draw_tracked(d, (CX, y), fx['venue'], body(27 if not story else 33, 600), MUTED, tracking=6, centre=True)

    # Centre the drawn block in the panel. Measured off the ink, so a card with no
    # venue line does not sit high.
    ink = overlay.getbbox()
    overflow = 0
    if ink:
        block = overlay.crop(ink)
        top = py0 + ((py1 - py0) - block.height) // 2
        canvas.alpha_composite(block, (ink[0], max(py0 + 8, top)))
        # Did anything land outside the white panel? Returned so the batch reports it
        # rather than writing 1,944 cards with a badge over the border.
        overflow = max(0, px0 - ink[0], ink[2] - px1,
                       0 if block.height <= (py1 - py0) else block.height - (py1 - py0))

    d = ImageDraw.Draw(canvas)

    # Vertical label, matched to the original type's 423px length then relabelled.
    # The strip carries the font's full ascent and descent, so it is trimmed to the
    # ink before centring — otherwise it sits ~11px right of where it looks centred.
    vf = black(fit_size(423, "MEN'S TEAM"))
    asc, desc = vf.getmetrics()
    strip = Image.new('RGBA', (int(d.textlength(fx['label'], font=vf)) + 8, asc + desc), (0, 0, 0, 0))
    ImageDraw.Draw(strip).text((4, 0), fx['label'], font=vf, fill=label_col)
    strip = strip.rotate(-90, expand=True)
    ink = strip.getbbox()
    if ink:
        strip = strip.crop(ink)
    canvas.alpha_composite(strip, (round((BAND_X0 + BAND_X1) / 2 - strip.width / 2), LABEL_TOP))

    return canvas, overflow

def game_folder(fx):
    """One folder per game, named as the fixture card is, so the two sets sit
    side by side and sort together."""
    return OUT + os.path.splitext(fx['out'])[0] + '/'


def render_game(fx, verbose=True):
    made, worst = 0, 0
    for us in range(MAX_GOALS + 1):
        for them in range(MAX_GOALS + 1):
            for size, label in ((FEED, 'Feed'), (STORY, 'Story')):
                canvas, overflow = build(fx, us, them, size)
                worst = max(worst, overflow)
                folder = game_folder(fx) + label + '/'
                os.makedirs(folder, exist_ok=True)
                # Celtic's score first, and the filename says which is which so
                # nobody has to remember the convention at five o'clock.
                name = f'CCFC {us}-{them} {fx["opp"]}.png'
                canvas.convert('RGB').save(folder + name, quality=95)
                made += 1
    if verbose:
        flag = '' if worst <= 0 else f'  OUTSIDE THE PANEL by {worst}px'
        print(f'  {fx["date"]}  {"H" if fx["home"] else "A"}  {fx["opp"][:26]:26} '
              f'{made:3d} cards{flag}')
    return made, worst


def main():
    fixtures = [f for f in json.load(open(HERE + 'fixtures.json')) if f['team'] == 'mens']
    only = sys.argv[1] if len(sys.argv) > 1 else None
    if only:
        fixtures = [f for f in fixtures if only in f['out'] or only in f['date'] or only in f['opp']]
    if not fixtures:
        print('No matching men\'s fixtures.')
        return 1

    total, overflows = 0, []
    for fx in fixtures:
        made, worst = render_game(fx)
        total += made
        if worst > 0:
            overflows.append((fx['out'], worst))

    print(f'\n{total} score cards ({MAX_GOALS + 1}x{MAX_GOALS + 1} per game, Feed + Story) -> {OUT}')
    if overflows:
        print(f'WARNING: {len(overflows)} game(s) draw outside the white panel:')
        for o, w in overflows:
            print(f'   {o}  by {w}px')
    return 0


if __name__ == '__main__':
    sys.exit(main())
