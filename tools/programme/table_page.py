"""
League table page (reader page 2).

Patched, not redrawn. The table's rules, header bars and outer borders are 45
filled rectangles in the source; reproducing them exactly would be fragile and
pointless, so the grid is left alone and only the cell contents are replaced.

That means the highlight has to be handled here too: the club's row is filled
yellow in the source, and the club moves up and down the table, so each row is
repainted white or yellow before its text goes back.

Geometry measured from the 7 August New Inn issue, in A5 page space.
"""
import re

import fitz
from layout import A5_W, A4L_H

TOP = 56.3                 # top of the first data row
PITCH = (263.6 - 56.3) / 16
ROWS = 16

POS_CX = 34.6              # position column, centred
TEAM_X = 46.1              # team name, left aligned
COL_CX = [192.9, 220.5, 248.0, 275.5, 303.1, 330.6, 358.2, 385.4]   # P W D L F A GD Pts
LEFT_EDGE, RIGHT_EDGE = 22.6, 397.2

WHITE = (1, 1, 1)
YELLOW = (1, 1, 0)
BLACK = (0, 0, 0)
FONT = 'helv'
SIZE = 10
# Baseline sits 11.95pt below the row top — calibrated against the source, whose
# first data row has its text top at 57.5 with the row starting at 56.3.
BASELINE_OFFSET = 11.95

US = 'cwmbran celtic'


def display_name(name):
    """The club writes "Goytre", the FAW writes "Goytre AFC (Gwent)". Match the
    programme's own style, and keep the column narrow enough to fit."""
    n = re.sub(r'\s*\([^)]*\)', '', name)
    n = re.sub(r'\s+(A\.?F\.?C|F\.?C)\.?$', '', n, flags=re.I)
    return n.strip()


def _norm(name):
    n = name.lower().replace('.', ' ')
    for junk in (' afc', ' fc', ' a.f.c', ' f.c'):
        n = n.replace(junk, '')
    return ' '.join(n.split())


def row_rect(n):
    """Full-width band for data row n (1-based), inset so the rules survive."""
    y0 = TOP + PITCH * (n - 1)
    return fitz.Rect(LEFT_EDGE, y0 + 0.7, RIGHT_EDGE, y0 + PITCH - 0.5)


def build(source_pdf, standings):
    """Return single-page A5 PDF bytes for the league table.

    standings: list of dicts with team, played, wins, draws, losses, goalsFor,
    goalsAgainst, points — already in table order.
    """
    src = fitz.open(source_pdf)
    out = fitz.open()
    page = out.new_page(width=A5_W, height=A4L_H)
    page.show_pdf_page(fitz.Rect(0, 0, A5_W, A4L_H), src, 1,
                       clip=fitz.Rect(0, 0, A5_W, A4L_H))

    for i in range(ROWS):
        band = row_rect(i + 1)
        row = standings[i] if i < len(standings) else None
        ours = row is not None and _norm(row['team']) == US
        page.draw_rect(band, color=None, fill=YELLOW if ours else WHITE)
        if row is None:
            continue

        gd = row['goalsFor'] - row['goalsAgainst']
        cells = [row['played'], row['wins'], row['draws'], row['losses'],
                 row['goalsFor'], row['goalsAgainst'], gd, row['points']]

        # insert_text, not insert_textbox: a textbox refuses anything under
        # ~17pt of height and these rows are 13pt, so it silently draws nothing.
        baseline = TOP + PITCH * i + BASELINE_OFFSET

        def centred(cx, s, size=SIZE):
            w = fitz.get_text_length(s, fontname=FONT, fontsize=size)
            page.insert_text((cx - w / 2, baseline), s, fontname=FONT,
                             fontsize=size, color=BLACK)

        centred(POS_CX, str(i + 1))
        # Long names are squeezed rather than allowed to run into the P column.
        name, size = display_name(row['team']), SIZE
        while fitz.get_text_length(name, fontname=FONT, fontsize=size) > 138 and size > 6.5:
            size -= 0.25
        page.insert_text((TEAM_X, baseline), name, fontname=FONT,
                         fontsize=size, color=BLACK)
        for cx, val in zip(COL_CX, cells):
            centred(cx, str(val))

    data = out.tobytes()
    out.close()
    src.close()
    return data


def from_faw(rows):
    """Map the FAW standings payload onto what build() wants."""
    out = []
    for r in rows:
        out.append({
            'team': r['team']['name'],
            'played': r.get('played', 0),
            'wins': r.get('wins', 0),
            'draws': r.get('draws', 0),
            'losses': r.get('losses', 0),
            'goalsFor': r.get('goalsFor', 0),
            'goalsAgainst': r.get('goalsAgainst', 0),
            'points': r.get('points', 0),
        })
    return out
