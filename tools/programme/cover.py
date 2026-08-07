"""
Programme cover.

The club's cover is almost entirely baked into images by Publisher — the
masthead, "CWMBRAN CELTIC v", "THE MOTAZONE ARENA" and the sponsor strip are all
artwork, not text. Only four things actually change from match to match:

    the opponent's name, the date/kick-off line, the action photo, the crest

So the cover is not rebuilt. The previous issue's cover is placed as vector and
those four regions are patched over it, which keeps the masthead and sponsors
pixel-identical to what the club already prints.

Region coordinates are measured from the source issue and are in A5 page space
(origin top-left, as PyMuPDF reports text).
"""
import io
import fitz
from PIL import Image
from layout import A5_W, A4L_H

# Measured on 2026.08.07 New Inn, sheet 1 right half, minus the A5_W offset.
PHOTO = fitz.Rect(22.6, 198.5, 396.9, 450.7)
CREST = fitz.Rect(331.6, 462.1, 391.2, 521.6)
# The source crest sits inside a thin drawn frame a little larger than the image
# itself; patch the frame too or its top and left edges survive as stray rules.
CREST_PATCH = fitz.Rect(327.0, 457.5, 396.0, 526.0)
# Text band: from just under "CWMBRAN CELTIC v" to just above "THE MOTAZONE
# ARENA", stopping short of the crest on the right.
TEXT_BAND = fitz.Rect(96.0, 479.0, 320.0, 506.0)

YELLOW = (252 / 255, 219 / 255, 8 / 255)
BLUE = (0, 0, 1)
CENTRE_X = 211.2          # the club centres these two lines here, not on 210.48
OPP_BASELINE = 491.5      # baseline of the opponent line in the source
DATE_BASELINE = 502.8
FONT = 'hebo'             # Helvetica-Bold — the source subsets an Arial-alike


def _fill_crop(path, rect, dpi=300):
    """Crop to the target aspect and scale for print, so the photo fills its
    box rather than letterboxing inside it."""
    im = Image.open(path).convert('RGB')
    want = rect.width / rect.height
    w, h = im.size
    have = w / h
    if have > want:                       # too wide — trim the sides
        new_w = int(round(h * want))
        left = (w - new_w) // 2
        im = im.crop((left, 0, left + new_w, h))
    elif have < want:                     # too tall — trim top and bottom
        new_h = int(round(w / want))
        top = (h - new_h) // 2
        im = im.crop((0, top, w, top + new_h))
    target_px = int(rect.width / 72 * dpi)
    if im.width > target_px:
        im = im.resize((target_px, int(round(target_px / want))), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=92, subsampling=0)
    return buf.getvalue()


def ordinal(n):
    if 11 <= n % 100 <= 13:
        return 'th'
    return {1: 'st', 2: 'nd', 3: 'rd'}.get(n % 10, 'th')


def build(source_pdf, opponent, kickoff, photo=None, crest=None):
    """Return single-page A5 PDF bytes for the cover.

    kickoff is a datetime; opponent is displayed as given (upper case).
    photo/crest are file paths; either may be None to keep the previous issue's.
    """
    src = fitz.open(source_pdf)
    out = fitz.open()
    page = out.new_page(width=A5_W, height=A4L_H)
    # Start from the existing cover, clipped to its half of the sheet.
    page.show_pdf_page(fitz.Rect(0, 0, A5_W, A4L_H), src, 0,
                       clip=fitz.Rect(A5_W, 0, A5_W * 2, A4L_H))

    if photo:
        page.draw_rect(PHOTO, color=None, fill=YELLOW)
        page.insert_image(PHOTO, stream=_fill_crop(photo, PHOTO))

    if crest:
        page.draw_rect(CREST_PATCH, color=None, fill=YELLOW)
        page.insert_image(CREST, filename=crest, keep_proportion=True)

    # Patch the two live text lines.
    page.draw_rect(TEXT_BAND, color=None, fill=YELLOW)

    name = opponent.upper()
    w = fitz.get_text_length(name, fontname=FONT, fontsize=12)
    page.insert_text((CENTRE_X - w / 2, OPP_BASELINE), name,
                     fontname=FONT, fontsize=12, color=BLUE)

    # "FRIDAY 7th AUGUST 2026, KO 6:30PM" — the ordinal is superscripted in the
    # original, so it is drawn as three runs to keep that.
    day = kickoff.day
    pre = f'{kickoff:%A} {day}'.upper()
    suf = ordinal(day)
    ko = kickoff.strftime('%I:%M%p').lstrip('0').replace(':00', ':00')
    post = f' {kickoff:%B %Y}, KO {ko}'.upper()
    w_pre = fitz.get_text_length(pre, fontname=FONT, fontsize=10)
    w_suf = fitz.get_text_length(suf, fontname=FONT, fontsize=6.5)
    w_post = fitz.get_text_length(post, fontname=FONT, fontsize=10)
    x = CENTRE_X - (w_pre + w_suf + w_post) / 2
    page.insert_text((x, DATE_BASELINE), pre, fontname=FONT, fontsize=10, color=BLUE)
    page.insert_text((x + w_pre, DATE_BASELINE - 3.5), suf, fontname=FONT, fontsize=6.5, color=BLUE)
    page.insert_text((x + w_pre + w_suf, DATE_BASELINE), post, fontname=FONT, fontsize=10, color=BLUE)

    data = out.tobytes()
    out.close()
    src.close()
    return data
