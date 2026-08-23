#!/usr/bin/env python3
"""
One layout engine for every Cwmbran Celtic card.

batch.py (fixtures) and scores.py (results) each had their own copy of the frame
handling, the badge scaling and the panel geometry. They drifted: the fixture cards
were centred on a hardcoded CX=515 when the panel's real centre is 497, and they
placed badges by a square bounding box, which put a narrow shield 38px further from
the centre than a round crest. Both faults were fixed in the score cards and not in
the fixture cards, which is exactly what a second copy does.

So the shared parts live here, and both card types are the same call with a
different middle: a "V" for a fixture, a score for a result.

Everything measurable is measured rather than assumed — the panel's bounds come from
the frame's pixels, badges are sized and placed by their ink, and the block is
centred on what was actually drawn. audit.py checks the result.
"""
import os
from collections import Counter

from PIL import Image, ImageDraw, ImageFont
from psd_tools import PSDImage

HERE = os.path.dirname(os.path.abspath(__file__)) + '/'
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
THEME = REPO + '/wordpress-theme/cwmbran-celtic-2025/assets/img/'
FRAMES = os.path.expanduser('~/Downloads/')

NAVY = (12, 35, 64)
INK = (24, 28, 34)
MUTED = (110, 120, 132)
RULE = (214, 220, 226)

BAND_X0, BAND_X1 = 950, 1029       # the frame's vertical label band
LABEL_TOP = 67
BLACK_F = HERE + 'ArchivoBlack-Regular.ttf'
BODY_F = HERE + 'Archivo.ttf'

FEED = (1080, 1350)
STORY = (1080, 1920)
SPLICE_ROW = 491                   # inside the identical-row band in both frames


# ---------------------------------------------------------------------- type

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


# -------------------------------------------------------------------- badges

_crestcache = {}


def crest(path, slot_h, slot_w):
    """A badge trimmed to its ink and scaled to fill slot_h, capped by slot_w.

    Returns the ink at its natural aspect, NOT padded into a square. The padding was
    the alignment bug: badges positioned by their box meant a narrow shield sat 38px
    further from the centre than a round crest, so the middle of the card was 55px
    from one badge and 93px from the other.

    No circular mask: most are roundels, but Blaenavon and Croesyceiliog are shields
    and a circle slices their corners off.
    """
    key = (path, slot_h, round(slot_w))
    if key in _crestcache:
        return _crestcache[key]
    im = Image.open(path).convert('RGBA')
    # Content = dark-ish AND opaque, so flat white padding round the artwork is
    # trimmed but white INSIDE the badge is kept.
    mask = im.convert('L').point(lambda v: 255 if v < 248 else 0)
    alpha = im.getchannel('A').point(lambda v: 255 if v > 8 else 0)
    mask = Image.composite(mask, Image.new('L', im.size, 0), alpha)
    bb = mask.getbbox()
    if bb:
        im = im.crop(bb)
    w, h = im.size
    sc = min(slot_h / h, slot_w / w)
    out = im.resize((max(1, round(w * sc)), max(1, round(h * sc))), Image.LANCZOS)
    _crestcache[key] = out
    return out


# --------------------------------------------------------------------- frame

_framecache = {}


def frame(psd_name, size):
    """Base canvas at the requested size, the frame's own vertical label hidden,
    plus the accent and label colours read out of it.

    STORY is spliced rather than scaled. Both frames have 661 byte-identical rows
    from y=491, so extra rows lifted from inside that band extend the white panel and
    the yellow label band while the border, the rounded corners and the sponsor bar
    stay exactly as drawn — all of which a resize would squash.
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


_panelcache = {}


def panel(base, psd_name):
    """The white panel the content may occupy.

    Two things make this harder than "find the white pixels", and both produced live
    faults:

    1. The navy frame's label band is YELLOW, but the green frame's is WHITE and butts
       straight onto the panel — so a white scan runs through it and reports the panel
       as 82px wider than it is, putting badges under the "MEN'S TEAM" lettering. The
       right edge therefore comes from BAND_X0, which is the band's position in the
       PSD and identical in both colourways.

    2. The green frame's SPONSOR LOGOS are white too. Taking min/max of every white
       row jumped the green sponsor bar entirely and reported the panel as ending at
       y=1305 rather than 1157. So the vertical extent is a CONTIGUOUS scan from the
       top of the panel, which stops at the frame colour above the sponsor bar.

    Keyed by frame AND size. It used to be keyed on size alone, so both 1080x1350
    frames shared one entry and whichever rendered first imposed its bounds on the
    other — which is how navy cards ended up laid out to the green frame's 1028.
    """
    key = (psd_name, base.size)
    if key in _panelcache:
        return _panelcache[key]

    px = base.convert('RGB').load()
    w, h = base.size
    WHITE = (255, 255, 255)
    mid = w // 2

    # Top: first white row down the middle. Bottom: keep going only while it stays
    # white, so the sponsor bar ends it whatever colour the logos are.
    y0 = next(y for y in range(h) if px[mid, y] == WHITE)
    y1 = y0
    while y1 + 1 < h and px[mid, y1 + 1] == WHITE:
        y1 += 1

    # Left: first white column across the middle of the panel, scanned contiguously
    # inward so the border cannot be mistaken for it.
    row = (y0 + y1) // 2
    x0 = next(x for x in range(w) if px[x, row] == WHITE)
    # Right: the label band, from the PSD. Not measured — on the green frame it is the
    # same white as the panel and there is nothing in the pixels to find. The band's
    # first column is 949, so the panel's last usable one is 948.
    x1 = BAND_X0 - 2

    _panelcache[key] = (x0, y0, x1, y1)
    return _panelcache[key]


def vertical_label(canvas, text, label_col):
    """The frame's own vertical label, hidden and redrawn so it can be relabelled.

    Matched to the source type's 423px length. The rendered strip carries the font's
    full ascent and descent, not just the inked glyphs, so it is trimmed to the ink
    before centring — anchoring the untrimmed strip left it 11px right of where it
    looked centred.
    """
    d = ImageDraw.Draw(canvas)
    vf = black(fit_size(423, "MEN'S TEAM"))
    asc, desc = vf.getmetrics()
    strip = Image.new('RGBA', (int(d.textlength(text, font=vf)) + 8, asc + desc), (0, 0, 0, 0))
    ImageDraw.Draw(strip).text((4, 0), text, font=vf, fill=label_col)
    strip = strip.rotate(-90, expand=True)
    ink = strip.getbbox()
    if ink:
        strip = strip.crop(ink)
    canvas.alpha_composite(strip, (round((BAND_X0 + BAND_X1) / 2 - strip.width / 2), LABEL_TOP))


# ---------------------------------------------------------------------- card

def build(fx, size, middle, kicker, sub, extra_line=None):
    """One card.

    `middle` is what sits between the badges — 'V' for a fixture, '2-1' for a result.
    `extra_line` is the fixture cards' kick-off line; results have none.

    The content is drawn onto a transparent overlay from y=0, measured, then
    composited centred in the white panel. Drawing from a fixed top margin is what
    left the first score cards with 176px of dead space on the feed and 537px on the
    story, because a result card has one line fewer than the fixture layout was
    spaced for.

    Returns (canvas, overflow, geom) — geom is the layout as actually computed, so
    audit.py can check the real numbers instead of re-detecting them from pixels.
    """
    base, accent, label_col = frame(fx['frame'], size)
    canvas = base.copy()
    px0, py0, px1, py1 = panel(base, fx['frame'])
    CX = (px0 + px1) // 2
    story = size == STORY

    overlay = Image.new('RGBA', size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    geom = {'panel': (px0, py0, px1, py1), 'size': size}

    y = 0
    draw_tracked(d, (CX, y), kicker, body(33 if not story else 40, 700), accent, tracking=8, centre=True)
    y += 58 if not story else 70
    d.line([(CX - 62, y + 6), (CX + 62, y + 6)], fill=RULE, width=3)
    y += 28 if not story else 34
    subf = body(26 if not story else 31, 600)
    while text_w(d, sub, subf, 7) > (px1 - px0 - 60) and subf.size > 16:
        subf = body(subf.size - 1, 600)
    draw_tracked(d, (CX, y), sub, subf, MUTED, tracking=7, centre=True)
    y += 58 if not story else 72

    # Badge — middle — badge, laid out from a centred origin so the two gaps are
    # equal AND the row is balanced against the panel, whatever shape the badges are.
    row_w = (px1 - px0) - 56
    SLOT_H = 250 if not story else 270
    PAD = 46 if not story else 52

    mf_size = (72 if middle == 'V' else 150) if not story else (84 if middle == 'V' else 176)
    mf = black(mf_size)
    mb = d.textbbox((0, 0), middle, font=mf)
    mid_w, mid_h = mb[2] - mb[0], mb[3] - mb[1]

    # Every pixel of the middle comes off the badges, and a two-digit score is
    # nearly twice as wide as a one-digit one: at a flat size "10-10" left each
    # badge 195px where "2-1" leaves 295, so the crests visibly shrank on exactly
    # the scorelines nobody would think to check. Cap the middle so the slots never
    # fall below the height the badges are drawn at. Every score up to 9-9 measures
    # 250px and is well inside this, so no existing card moves.
    cap = row_w - 2 * PAD - 2 * SLOT_H
    if mid_w > cap:
        mf = black(max(40, int(mf_size * cap / mid_w)))
        mb = d.textbbox((0, 0), middle, font=mf)
        mid_w, mid_h = mb[2] - mb[0], mb[3] - mb[1]

    slot_w = (row_w - mid_w - 2 * PAD) / 2
    us_im = crest(THEME + 'club-logo.webp', SLOT_H, slot_w)
    them_im = crest(THEME + 'opponents/' + fx['crest'], SLOT_H, slot_w)

    row_h = max(us_im.height, them_im.height, mid_h)
    cy = y + row_h // 2
    row_total = us_im.width + PAD + mid_w + PAD + them_im.width
    x = round(CX - row_total / 2)
    row_x0 = x
    overlay.alpha_composite(us_im, (x, cy - us_im.height // 2))
    geom['us'] = (x, cy - us_im.height // 2, x + us_im.width, cy + us_im.height // 2)
    x += us_im.width + PAD
    d.text((x - mb[0], cy - mid_h // 2 - mb[1]), middle, font=mf, fill=NAVY)
    geom['score'] = (x, cy - mid_h // 2, x + mid_w, cy + mid_h // 2)
    x += mid_w + PAD
    overlay.alpha_composite(them_im, (x, cy - them_im.height // 2))
    geom['them'] = (x, cy - them_im.height // 2, x + them_im.width, cy + them_im.height // 2)
    geom['row'] = (row_x0, x + them_im.width)
    geom['pad'] = PAD

    y += row_h + (48 if not story else 62)

    # Capped as well as fitted: a short name like "UNDY" would otherwise be set
    # enormous just because it fits, and shove the details off the panel.
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

    if extra_line:
        d.text((CX, y), extra_line.upper(), font=black(56 if not story else 66), fill=accent, anchor='ma')
        y += 88 if not story else 104

    pf = body(31 if not story else 37, 700)
    pw = text_w(d, fx['pill'], pf, 9)
    ph = 64 if not story else 76
    d.rounded_rectangle([CX - pw / 2 - 40, y, CX + pw / 2 + 40, y + ph], radius=ph // 2, fill=NAVY)
    draw_tracked(d, (CX, y + (14 if not story else 18)), fx['pill'], pf, (255, 255, 255), tracking=9, centre=True)
    y += ph
    if fx.get('venue'):
        y += 26 if not story else 34
        # Shrink to fit, the way the team names already do. At a fixed size
        # "CARDIFF INTERNATIONAL SPORTS CAMPUS" ran 6px outside the panel — the
        # first away ground long enough to find this, because away venues were
        # never printed until there was a friendly worth naming one for.
        vs = 27 if not story else 33
        while vs > 15 and text_w(d, fx['venue'], body(vs, 600), 6) > row_w:
            vs -= 1
        draw_tracked(d, (CX, y), fx['venue'], body(vs, 600), MUTED, tracking=6, centre=True)

    # Centre the drawn block in the panel, measured off the ink so a card with one
    # line fewer does not sit high.
    ink = overlay.getbbox()
    overflow = 0
    if ink:
        block = overlay.crop(ink)
        top = py0 + ((py1 - py0) - block.height) // 2
        dy = max(py0 + 8, top) - ink[1]
        canvas.alpha_composite(block, (ink[0], max(py0 + 8, top)))
        for k in ('us', 'score', 'them'):
            a, b, c, e = geom[k]
            geom[k] = (a, b + dy, c, e + dy)
        geom['block'] = (ink[0], ink[1] + dy, ink[2], ink[3] + dy)
        overflow = max(0, px0 - ink[0], ink[2] - px1,
                       0 if block.height <= (py1 - py0) else block.height - (py1 - py0))

    vertical_label(canvas, fx['label'], label_col)
    return canvas, overflow, geom
