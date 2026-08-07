"""
Programme sheet geometry.

The club's programme is 16 A4-landscape sheets, two A5 pages up, with sheet 1 as
the outer wrap: back cover on the left, front cover on the right. Everything
else runs in order, so sheet k+1 holds reader pages 2k and 2k+1.

Kept free of any PDF library so the CLI test can load it directly.
"""

A4L_W, A4L_H = 841.92, 595.32     # A4 landscape, as the source PDF measures
A5_W = A4L_W / 2                  # one readable page

SHEETS = 16
PAGES = SHEETS * 2                # 32


def page_to_slot(page, sheets=SHEETS):
    """Reader page number (1-based) -> (sheet, 'left'|'right').

    The wrap is the whole reason this isn't just divmod: page 1 is the RIGHT
    half of sheet 1 and the last page is its left half.
    """
    if not (1 <= page <= sheets * 2):
        raise ValueError(f'page {page} outside 1..{sheets * 2}')
    if page == 1:
        return (1, 'right')
    if page == sheets * 2:
        return (1, 'left')
    k, r = divmod(page, 2)
    return (k + 1, 'left' if r == 0 else 'right')


def slot_to_page(sheet, half, sheets=SHEETS):
    """The inverse, so a classification keyed by sheet can be read back."""
    if sheet == 1:
        return 1 if half == 'right' else sheets * 2
    return (sheet - 1) * 2 if half == 'left' else (sheet - 1) * 2 + 1


def half_origin(half):
    """x offset of a half within the sheet."""
    return 0.0 if half == 'left' else A5_W


def sheet_pages(sheet, sheets=SHEETS):
    """The two reader pages a sheet carries, left then right."""
    return (slot_to_page(sheet, 'left', sheets), slot_to_page(sheet, 'right', sheets))
