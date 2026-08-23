#!/usr/bin/env python3
"""
Score cards for every Men's First Team fixture.

Every possible scoreline, 0-0 up to 5-5, at half time and full time, in both
Instagram sizes — so whoever is posting picks the right card instead of making one.
144 per game.

    python3 scores.py            # every men's first-team fixture
    python3 scores.py 2026-08-14 # one game
    python3 scores.py reserves   # another team
    python3 scores.py all        # every team
    python3 audit.py             # measure the geometry of what it produced

Output: ~/Downloads/CCFC Score Cards/<team>/<game>/Full Time|Half Time/Feed|Story/

Scoped by team, the same way the matchday graphics are, so the Reserves and the
Women drop in alongside rather than needing a second folder.

CWMBRAN CELTIC'S SCORE IS ALWAYS FIRST, home or away, because our crest is always
on the left — the same convention as the fixture cards. "CCFC 2-1 Abergavenny Town"
means Celtic scored two. Filenames say so explicitly.

The layout itself lives in cards.py, shared with the fixture cards, so the two sets
cannot drift apart again — which is how the fixture cards ended up centred 18px off
and placing badges by a square box after the score cards had both fixed.
"""
import json
import os
import sys

from cards import FEED, STORY, HERE, build as build_card

MAX_GOALS = 5                      # 0-0 through 5-5
OUT = os.path.expanduser('~/Downloads/CCFC Score Cards/')
# Same names the matchday graphics use, so both sets read the same way on disk.
TEAM_DIR = {'mens': "Men's First Team", 'reserves': "Men's Reserves",
            'womens': "Women's First Team"}


def comp_line(fx):
    """"LEAGUE · ARDAL SOUTH EAST" — the fixture cards split these across the kicker
    and the line beneath, but a result card needs the stage in the kicker slot, so
    the competition and the round move onto one line."""
    a, b = fx['kicker'], fx['sub']
    return a if a == b else f'{a} · {b}'


def build(fx, us_goals, them_goals, size, stage='FULL TIME'):
    """A result card: the score sits where a fixture card puts its "V"."""
    return build_card(fx, size, f'{us_goals}-{them_goals}', stage, comp_line(fx))


def game_folder(fx):
    """One folder per game inside its team's folder, named as the fixture card is, so
    the two sets sort together and the teams stay separate."""
    return f'{OUT}{TEAM_DIR[fx["team"]]}/{os.path.splitext(fx["out"])[0]}/'


STAGES = (('FULL TIME', 'Full Time'), ('HALF TIME', 'Half Time'))


def render_game(fx, verbose=True):
    made, worst = 0, 0
    for stage, stage_dir in STAGES:
        for us in range(MAX_GOALS + 1):
            for them in range(MAX_GOALS + 1):
                for size, size_dir in ((FEED, 'Feed'), (STORY, 'Story')):
                    canvas, overflow, _ = build(fx, us, them, size, stage)
                    worst = max(worst, overflow)
                    folder = f'{game_folder(fx)}{stage_dir}/{size_dir}/'
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
    allfx = json.load(open(HERE + 'fixtures.json'))
    only = sys.argv[1] if len(sys.argv) > 1 else None
    if only in TEAM_DIR:
        fixtures = [f for f in allfx if f['team'] == only]
    elif only == 'all':
        fixtures = allfx
    elif only:
        # A date, an opponent or a filename — searched across every team. It used to
        # narrow the men's list only, so asking for a Reserves or Women's game by its
        # date got "no matching fixtures" for a game that was right there.
        fixtures = [f for f in allfx if only in f['out'] or only in f['date'] or only in f['opp']]
    else:
        fixtures = [f for f in allfx if f['team'] == 'mens']   # the default set
    if not fixtures:
        print(f'No fixture matches {only!r}. Try a date (2026-08-23), an opponent, a team, or "all".')
        return 1

    total, overflows = 0, []
    for fx in fixtures:
        made, worst = render_game(fx)
        total += made
        if worst > 0:
            overflows.append((fx['out'], worst))

    print(f'\n{total} score cards -> {OUT}')
    print(f'   {len(fixtures)} games x {len(STAGES)} stages x {(MAX_GOALS+1)**2} scorelines x 2 sizes')
    if overflows:
        print(f'WARNING: {len(overflows)} game(s) draw outside the white panel:')
        for o, w in overflows:
            print(f'   {o}  by {w}px')
    return 0


if __name__ == '__main__':
    sys.exit(main())
