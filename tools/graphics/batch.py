#!/usr/bin/env python3
"""
Matchday graphics for every upcoming Cwmbran Celtic fixture.

Reads fixtures.json (written by export.php straight from the theme's own fixture
lists and kick-off overrides) and renders each one in both Instagram sizes.

    php export.php      # refresh fixtures.json from the theme
    python3 batch.py    # every upcoming fixture, all teams
    python3 batch.py mens
    python3 audit.py    # measure the geometry of what came out

Output: ~/Downloads/CCFC Matchday Graphics/<team>/Feed|Story/

Frame follows the kit: green for the green-and-white away, navy/yellow for the
yellow-and-blue home. Crests come from the theme's assets/img/opponents/. Kick-off
times come from cc25_kickoff_overrides(); the run prints `assumed KO` for any
fixture still falling back to the day-of-week default. Postponed fixtures and
undrawn opponents are skipped by export.php.

The layout lives in cards.py, shared with the score cards. It used to live here in
its own copy, which is how these cards ended up centred on a hardcoded CX=515 —
18px right of the panel's real centre — and placing badges by a square bounding box
long after both were fixed for the results. One engine, two middles: a "V" here, a
score there.
"""
import json
import os
import sys

from cards import FEED, STORY, HERE, build as build_card

OUT = os.path.expanduser('~/Downloads/CCFC Matchday Graphics/')
# One folder per team, so a matchday's posts aren't hunted out of a list of 70.
TEAM_DIR = {'mens': "Men's First Team", 'reserves': "Men's Reserves",
            'womens': "Women's First Team"}
SIZES = ((FEED, 'Feed'), (STORY, 'Story'))


def build(fx, size):
    """A fixture card: a "V" between the badges, and the kick-off line results omit."""
    return build_card(fx, size, 'V', fx['kicker'], fx['sub'], fx['kotext'])


def main():
    fixtures = json.load(open(HERE + 'fixtures.json'))
    only = sys.argv[1] if len(sys.argv) > 1 else None
    if only:
        fixtures = [f for f in fixtures if only in f['out'] or only == f['team']]
    if not fixtures:
        print('No matching fixtures.')
        return 1

    overflows = []
    made = 0
    for i, fx in enumerate(fixtures, 1):
        worst = 0
        for size, size_dir in SIZES:
            canvas, overflow, _ = build(fx, size)
            worst = max(worst, overflow)
            folder = f'{OUT}{TEAM_DIR[fx["team"]]}/{size_dir}/'
            os.makedirs(folder, exist_ok=True)
            canvas.convert('RGB').save(folder + fx['out'], quality=95)
            made += 1
        if worst > 0:
            overflows.append((fx['out'], worst))
        print(f"  {i:2d}/{len(fixtures)}  {fx['date']}  {fx['team']:8s} {'H' if fx['home'] else 'A'}  "
              f"{fx['opp'][:24]:24} {fx['kotext'][9:]:8} {'' if fx['confirmed'] else 'assumed KO'}")

    print(f'\n{made} graphics ({len(fixtures)} fixtures x {len(SIZES)} sizes) -> {OUT}')
    if overflows:
        print(f'WARNING: {len(overflows)} fixture(s) draw outside the white panel:')
        for o, w in overflows:
            print(f'   {o}  by {w}px')
    return 0


if __name__ == '__main__':
    sys.exit(main())
