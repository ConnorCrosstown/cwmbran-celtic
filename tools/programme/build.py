#!/usr/bin/env python3
"""
Build a match day programme.

    python3 build.py 2026-08-22

Reads the match from fixtures.json (exported from the theme's own fixture lists
and kick-off overrides), seeds every page from the previous issue, and replaces
the pages that change. Output is versioned, never overwritten, so a programme
sent for approval still exists when the edits come back.

Currently regenerated: the cover. Everything else carries over from the source
issue — see the design doc for the pages still to come.
"""
import argparse, datetime, json, os, re, sys
import cover, faw, table_page
from compose import Programme

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
CRESTS = REPO + '/wordpress-theme/cwmbran-celtic-2025/assets/img/opponents/'
PHOTOS = os.path.expanduser('~/Downloads/CCFC Programme Photos/')
OUT = os.path.expanduser('~/Downloads/CCFC Programmes/')
SOURCE = os.path.expanduser('~/Downloads/2026.08.07 New Inn.pdf')


def load_fixtures(path):
    with open(path) as f:
        return json.load(f)


def pick(fixtures, date):
    home = [f for f in fixtures if f['date'] == date and f['home']
            and f['team'] in ('mens', 'womens')]
    if not home:
        raise SystemExit(f'no home first-team fixture on {date}')
    if len(home) > 1:
        raise SystemExit(f'{len(home)} home fixtures on {date}: '
                         + ', '.join(f"{f['team']} v {f['opp']}" for f in home))
    return home[0]


def next_version(stem):
    """v1, v2, v3 — approval feedback produces a new file, never a silent
    overwrite of the PDF someone is still reviewing."""
    os.makedirs(OUT, exist_ok=True)
    used = [int(m.group(1)) for f in os.listdir(OUT)
            if (m := re.match(re.escape(stem) + r' v(\d+)\.pdf$', f))]
    return max(used, default=0) + 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('date', help='fixture date, YYYY-MM-DD')
    ap.add_argument('--photo', help='cover photo (defaults to the one named in the match JSON)')
    ap.add_argument('--fixtures', default=HERE + '/fixtures.json')
    ap.add_argument('--source', default=SOURCE, help='previous issue to seed from')
    args = ap.parse_args()

    fx = pick(load_fixtures(args.fixtures), args.date)
    ko_time = re.search(r'(\d+):(\d+)(am|pm)', fx['kotext'], re.I)
    hh, mm, ap_ = int(ko_time.group(1)), int(ko_time.group(2)), ko_time.group(3).lower()
    if ap_ == 'pm' and hh != 12:
        hh += 12
    kickoff = datetime.datetime.combine(
        datetime.date.fromisoformat(fx['date']), datetime.time(hh, mm))

    photo = args.photo
    if photo and not os.path.isabs(photo):
        photo = PHOTOS + photo
    if photo and not os.path.exists(photo):
        raise SystemExit(f'photo not found: {photo}')

    crest = CRESTS + fx['crest']
    if not os.path.exists(crest):
        crest = None

    prog = Programme(args.source)
    prog.replace(1, cover.build(args.source, fx['opp'], kickoff, photo=photo, crest=crest))

    # League table — live, where the FAW publishes one for this team.
    table_note = None
    try:
        prog.replace(2, table_page.build(args.source,
                                         table_page.from_faw(faw.standings(fx['team']))))
        table_note = 'live from faw.cymru'
    except KeyError:
        table_note = 'CARRIED OVER — no FAW competition mapped for this team'
    except Exception as e:
        table_note = f'CARRIED OVER — fetch failed ({type(e).__name__})'

    team = {'mens': '', 'womens': ' Women'}[fx['team']]
    stem = f"{fx['date']} Cwmbran Celtic{team} v {fx['opp']}"
    v = next_version(stem)
    path = prog.write(f'{OUT}{stem} v{v}.pdf')
    prog.close()

    print(f"  match     {fx['dateline'].title()}, {fx['kotext'].lower()}")
    print(f"  opponent  {fx['opp']}  ({fx['comp']})")
    print(f"  kick-off  {'confirmed' if fx['confirmed'] else 'ASSUMED from day-of-week default'}")
    print(f"  photo     {os.path.basename(photo) if photo else 'kept from previous issue'}")
    print(f"  table     {table_note}")
    print(f"  written   {path}")
    print(f"\n  Pages regenerated: cover, league table. The rest carry over from")
    print(f"  {os.path.basename(args.source)} and still show that match's content.")


if __name__ == '__main__':
    main()
