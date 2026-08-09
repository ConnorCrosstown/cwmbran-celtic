#!/usr/bin/env python3
"""
Event artwork for a Gigantic ticket listing.

Matched to the image already on the club's listing: 820x500, the competition on two
lines at the top, both badges either side of a V filling most of the height, and the
venue along the bottom. No date and no kick-off time — the listing page states both,
and putting them in the artwork means it has to be remade if either moves.

    python3 gigantic.py                # the next home game for the men
    python3 gigantic.py 2026-08-29     # a specific game
    python3 gigantic.py --all-home     # every remaining home game

Output: ~/Downloads/CCFC Gigantic/<game>/

Two backgrounds per size:
  "pitch"  — the ground. NOTE: assets/img/hero.jpg is credited "©Cwmbran Life", so
             it needs their permission before it goes on a commercial listing. Its
             watermark is left intact rather than cropped off.
  "navy"   — the club's colours, no photo. Safe to use immediately.

Written at 820x500 and at 2x for quality, since 820x500 is what the current listing
shows and upscaling later would be worse than starting bigger.

Built on cards.py for the fonts and the badge handling, so the badges are trimmed to
their ink and spaced the same way as the social and print artwork.
"""
import json
import os
import sys

from PIL import Image, ImageDraw, ImageEnhance

import cards

OUT = os.path.expanduser('~/Downloads/CCFC Gigantic/')

NAVY = (26, 45, 110)                 # the ink on the existing listing image
NAVY_BG = (7, 30, 74)                # the frames' navy
WHITE = (255, 255, 255)

BASE = (820, 500)                    # what the listing actually displays
SIZES = (BASE, (1640, 1000))


def pitch_bg(size):
    """The ground, cropped to the listing's aspect and lifted so navy type reads over
    it. The watermark stays: it is somebody's credit, not a blemish to clone out."""
    im = Image.open(cards.THEME + 'hero.jpg').convert('RGB')
    want = size[0] / size[1]
    w, h = im.size
    if w / h > want:
        # Trim from the RIGHT only. Centring the crop slices the "©Cwmbran Life"
        # watermark in the bottom-left corner, which is worse than either extreme:
        # the credit is still there but no longer legible.
        nw = int(h * want)
        im = im.crop((0, 0, nw, h))
    else:                            # too tall: trim top and bottom
        nh = int(w / want)
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im = im.resize(size, Image.LANCZOS)
    # Washed back so the badges and the navy type carry, the way the current one is.
    im = ImageEnhance.Brightness(im).enhance(1.18)
    im = ImageEnhance.Color(im).enhance(0.72)
    return Image.blend(im, Image.new('RGB', size, WHITE), 0.32)


def navy_bg(size):
    """Club colours, no photograph — nothing to clear rights on."""
    im = Image.new('RGB', size, NAVY_BG)
    d = ImageDraw.Draw(im, 'RGBA')
    w, h = size
    for y in range(0, h, 3):         # the same faint texture the web templates use
        for x in range((y // 3) % 3, w, 3):
            d.point((x, y), fill=(255, 255, 255, 7))
    return im


def build(fx, size, background):
    W, H = size
    dark = background == 'navy'
    im = (navy_bg if dark else pitch_bg)(size)
    ink = WHITE if dark else NAVY
    u = H / 500.0                    # everything scales off the reference height

    block = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(block)
    CX = W // 2
    room = W - int(56 * u)

    # ---- competition, two lines, as on the existing image ------------------
    y = 0
    l1, l2 = fx['kicker'], fx['sub']
    f1 = cards.black(int(30 * u))
    while cards._probe.textlength(l1, font=f1) > room and f1.size > 10:
        f1 = cards.black(f1.size - 1)
    d.text((CX, y), l1, font=f1, fill=ink, anchor='ma')
    y += f1.size + int(6 * u)
    f2 = cards.black(int(30 * u))
    while cards._probe.textlength(l2, font=f2) > room and f2.size > 10:
        f2 = cards.black(f2.size - 1)
    d.text((CX, y), l2, font=f2, fill=ink, anchor='ma')
    y += f2.size + int(26 * u)

    # ---- badges either side of a V ----------------------------------------
    # Half the height, as on the current listing, and laid out from a centred origin
    # so the two gaps are equal whatever shape the opponent's badge is.
    slot_h = int(250 * u)
    vf = cards.black(int(92 * u))
    vb = d.textbbox((0, 0), 'V', font=vf)
    v_w, v_h = vb[2] - vb[0], vb[3] - vb[1]
    PAD = int(30 * u)
    slot_w = (room - v_w - 2 * PAD) / 2
    us_im = cards.crest(cards.THEME + 'club-logo.webp', slot_h, slot_w)
    them_im = cards.crest(cards.THEME + 'opponents/' + fx['crest'], slot_h, slot_w)

    row_h = max(us_im.height, them_im.height, v_h)
    cy = y + row_h // 2
    total = us_im.width + PAD + v_w + PAD + them_im.width
    x = round(CX - total / 2)
    block.alpha_composite(us_im, (x, cy - us_im.height // 2))
    x += us_im.width + PAD
    d.text((x - vb[0], cy - v_h // 2 - vb[1]), 'V', font=vf, fill=ink)
    x += v_w + PAD
    block.alpha_composite(them_im, (x, cy - them_im.height // 2))
    y += row_h + int(24 * u)

    # ---- venue -------------------------------------------------------------
    venue = 'THE MOTAZONE ARENA'
    vf2 = cards.black(int(34 * u))
    while cards._probe.textlength(venue, font=vf2) > room and vf2.size > 10:
        vf2 = cards.black(vf2.size - 1)
    d.text((CX, y), venue, font=vf2, fill=ink, anchor='ma')

    bb = block.getbbox()
    if bb:
        crop = block.crop(bb)
        im.paste(crop, (bb[0], (H - crop.height) // 2), crop)
    return im


def next_home(fixtures):
    """The next home game for the men, by date — the same answer the website gives."""
    home = sorted([f for f in fixtures if f['team'] == 'mens' and f['home']],
                  key=lambda f: f['date'])
    return home[0] if home else None


def main():
    fixtures = json.load(open(cards.HERE + 'fixtures.json'))
    arg = sys.argv[1] if len(sys.argv) > 1 else None

    if arg == '--all-home':
        chosen = [f for f in fixtures if f['team'] == 'mens' and f['home']]
    elif arg:
        chosen = [f for f in fixtures if f['team'] == 'mens' and (arg in f['date'] or arg in f['opp'])]
    else:
        n = next_home(fixtures)
        chosen = [n] if n else []

    if not chosen:
        print('No matching home fixture.')
        return 1

    made = 0
    for fx in chosen:
        folder = OUT + os.path.splitext(fx['out'])[0] + '/'
        os.makedirs(folder, exist_ok=True)
        for bg in ('pitch', 'navy'):
            for size in SIZES:
                name = f'{fx["opp"]} - {bg} - {size[0]}x{size[1]}.png'
                build(fx, size, bg).save(folder + name)
                made += 1
        print(f'  {fx["date"]}  v {fx["opp"]:22} {fx["comp"]}')

    print(f'\n{made} images -> {OUT}')
    print('NOTE: the "pitch" versions use assets/img/hero.jpg, credited "©Cwmbran Life".')
    print('      Clear it with them before using it on a paid listing, or use "navy".')
    return 0


if __name__ == '__main__':
    sys.exit(main())
