"""
Build a programme by reusing the club's existing artwork and regenerating only
the pages that move.

The source issue is vector, so a reused page is placed as vector — no
rasterising, no quality loss, and the sponsor adverts stay exactly as sold.
Pages we generate are drawn at A5 and dropped into the same slot, so the sheet
imposition is unchanged and it prints and folds as it always has.
"""
import fitz
from layout import A4L_W, A4L_H, A5_W, SHEETS, page_to_slot, half_origin


def half_rect(half):
    """The A5 region of a landscape sheet."""
    x0 = half_origin(half)
    return fitz.Rect(x0, 0, x0 + A5_W, A4L_H)


class Programme:
    """A new 16-sheet programme, seeded from a previous issue.

    Every page starts as the previous issue's page. Call replace() for the ones
    that change; anything untouched carries over verbatim.
    """

    def __init__(self, source_pdf):
        self.src = fitz.open(source_pdf)
        if self.src.page_count != SHEETS:
            raise ValueError(f'expected {SHEETS} sheets, got {self.src.page_count}')
        self.replacements = {}   # reader page -> single-page fitz.Document (A5)

    def replace(self, page_no, a5_pdf_bytes):
        """Swap one reader page for freshly generated A5 artwork."""
        doc = fitz.open('pdf', a5_pdf_bytes)
        if doc.page_count != 1:
            raise ValueError(f'page {page_no}: expected 1 A5 page, got {doc.page_count}')
        self.replacements[page_no] = doc

    def write(self, path):
        out = fitz.open()
        for sheet in range(1, SHEETS + 1):
            page = out.new_page(width=A4L_W, height=A4L_H)
            for half in ('left', 'right'):
                target = half_rect(half)
                # Which reader page belongs in this slot?
                page_no = next(p for p in range(1, SHEETS * 2 + 1)
                               if page_to_slot(p) == (sheet, half))
                if page_no in self.replacements:
                    page.show_pdf_page(target, self.replacements[page_no], 0)
                else:
                    # Clip to the half so the neighbouring page can't bleed in.
                    page.show_pdf_page(target, self.src, sheet - 1,
                                       clip=half_rect(half))
        out.set_metadata({
            'title': 'Cwmbran Celtic AFC — Match Day Programme',
            'author': 'Cwmbran Celtic AFC',
            'producer': 'cwmbran-celtic/tools/programme',
        })
        out.save(path, garbage=4, deflate=True)
        out.close()
        return path

    def close(self):
        self.src.close()
        for d in self.replacements.values():
            d.close()
