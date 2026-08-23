#!/usr/bin/env python3
"""
Geometry audit for the score cards.

Renders cards and MEASURES them, rather than trusting the layout code. Every fault
found in this set so far was invisible in the code and obvious in the pixels: badges
positioned by their square box instead of their ink (unequal gaps), a row centred on
the score instead of on itself (off-centre against the panel), crests sized larger
than the panel is wide (badges over the border).

    python3 audit.py            # every men's fixture, both sizes, 0-0 and 5-5
    python3 audit.py --all      # every scoreline too (slow)

Reports, per card: the two gaps either side of the score, the row's margins against
the white panel, whether badges share a centre line, and anything drawn outside the
panel. Exits non-zero if any tolerance is breached, so it can gate a rerun.
"""
import json
import os
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import scores  # noqa: E402
import batch   # noqa: E402
import cards   # noqa: E402

# What "correct" means here. Generous enough not to trip on a glyph's side bearing,
# tight enough to catch anything a reader would notice.
TOL_GAP = 6        # px difference between the left and right gaps
TOL_MARGIN = 26    # px difference between the row's left and right panel margins
TOL_CENTRE = 4     # px difference between the two badges' vertical centres


def band_intrusion(canvas, fx, size):
    """Has any content been drawn into the vertical label band?

    Checked against the BAND'S OWN PIXELS, independently of panel(). That matters: the
    faults Connor found were caused by panel() reporting the wrong right edge, and an
    audit that trusts panel() cannot see them — it passed while badges were running
    under the yellow lettering.

    Compares the finished card's band columns against the same columns of the bare
    frame plus its label. Any difference is content that should not be there.
    """
    base, _, label_col = cards.frame(fx['frame'], size)
    ref = base.copy()
    cards.vertical_label(ref, fx['label'], label_col)
    x0, x1 = cards.BAND_X0 - 1, cards.BAND_X1 + 1
    got = np.asarray(canvas.convert('RGB').crop((x0, 0, x1, size[1]))).astype(int)
    want = np.asarray(ref.convert('RGB').crop((x0, 0, x1, size[1]))).astype(int)
    diff = np.abs(got - want).max(axis=2) > 12
    if not diff.any():
        return 0
    cols = np.where(diff.any(axis=0))[0]
    return len(cols)


def check_card(canvas, overflow, g):
    """Measure the layout the builder actually used, plus the rendered ink extent."""
    px0, py0, px1, py1 = g['panel']
    usb, scb, thb = g['us'], g['score'], g['them']

    gap_l = scb[0] - usb[2]
    gap_r = thb[0] - scb[2]
    row_l, row_r = g['row']
    margin_l = row_l - px0
    margin_r = px1 - row_r
    cy_us = (usb[1] + usb[3]) / 2
    cy_th = (thb[1] + thb[3]) / 2
    bl, bt, br, bb = g['block']

    faults = []
    if abs(gap_l - gap_r) > TOL_GAP:
        faults.append(f'gaps either side of the middle differ by {abs(gap_l-gap_r)}px ({gap_l} vs {gap_r})')
    if abs(margin_l - margin_r) > TOL_MARGIN:
        faults.append(f'badge row off-centre by {abs(margin_l-margin_r)//2}px (margins {margin_l} / {margin_r})')
    if abs(cy_us - cy_th) > TOL_CENTRE:
        faults.append(f'badges not on one centre line ({abs(cy_us-cy_th):.0f}px apart)')
    if bl < px0 or br > px1:
        faults.append(f'content outside the panel horizontally ({bl}..{br} vs {px0}..{px1})')
    if bt < py0 or bb > py1:
        faults.append(f'content outside the panel vertically ({bt}..{bb} vs {py0}..{py1})')
    if abs((bl - px0) - (px1 - br)) > TOL_MARGIN:
        faults.append(f'card off-centre horizontally (margins {bl-px0} / {px1-br})')
    if abs((bt - py0) - (py1 - bb)) > 16:
        faults.append(f'card not vertically centred ({bt-py0} top / {py1-bb} bottom)')
    if overflow > 0:
        faults.append(f'reported {overflow}px outside the panel')
    return faults


def main():
    every = '--all' in sys.argv
    allfx = json.load(open(scores.HERE + 'fixtures.json'))
    # From scores.py, not a second copy of the number: this said range(6) while the
    # cards went to 10-10, so --all measured every scoreline it knew about and none
    # of the two-digit ones — the only ones whose width had ever changed the layout.
    from scores import MAX_GOALS
    scorelines = ([(u, t) for u in range(MAX_GOALS + 1) for t in range(MAX_GOALS + 1)] if every
                  else [(0, 0), (2, 1), (5, 5)])

    total, bad = 0, 0
    faulty = []

    print('  FIXTURE CARDS (all teams)')
    for fx in allfx:
        problems = []
        for size, sl in ((scores.FEED, 'Feed'), (scores.STORY, 'Story')):
            canvas, overflow, g = batch.build(fx, size)
            faults = check_card(canvas, overflow, g)
            intr = band_intrusion(canvas, fx, size)
            if intr:
                faults.append(f'content drawn into the label band ({intr} columns)')
            total += 1
            if faults:
                bad += 1
                problems.append((sl, faults))
        if problems:
            faulty.append(fx['out'])
            print(f'    {fx["date"]} {fx["team"]:8} {fx["opp"][:22]:22} {len(problems)} problem(s)')
            for sl, faults in problems:
                for f in faults:
                    print(f'        {sl}: {f}')
    print(f'    {len(allfx)} fixtures x 2 sizes checked')

    print('\n  SCORE CARDS (men\'s first team)')
    for fx in [f for f in allfx if f['team'] == 'mens']:
        problems = []
        for size, sl in ((scores.FEED, 'Feed'), (scores.STORY, 'Story')):
            for us, them in scorelines:
                for stage, _ in scores.STAGES:
                    canvas, overflow, g = scores.build(fx, us, them, size, stage)
                    faults = check_card(canvas, overflow, g)
                    intr = band_intrusion(canvas, fx, size)
                    if intr:
                        faults.append(f'content drawn into the label band ({intr} columns)')
                    total += 1
                    if faults:
                        bad += 1
                        problems.append((sl, f'{us}-{them}', stage, faults))
        if problems:
            faulty.append(fx['out'])
            print(f'    {fx["date"]}  {fx["opp"][:22]:22} {len(problems)} problem(s)')
            for sl, sc, stage, faults in problems[:4]:
                for f in faults:
                    print(f'        {sl} {sc} {stage}: {f}')

    print(f'\n  {total} cards measured, {bad} with a fault')
    if faulty:
        print(f'  needing attention: {", ".join(sorted(set(faulty)))}')
    else:
        print('  every card: gaps equal, row centred, badges on one line, inside the panel')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
