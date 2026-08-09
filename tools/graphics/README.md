# Matchday graphics

One 1080x1350 Instagram graphic per upcoming fixture, built on the club's frame
PSDs.

    php export.php      # reads the theme's fixture lists + kick-off overrides
    python3 batch.py    # renders every upcoming fixture

Output goes to `~/Downloads/CCFC Matchday Graphics/<team>/`, one folder per team.

- Frame follows the kit: green for the green-and-white away, navy/yellow for the
  yellow-and-blue home.
- Crests come from the theme's `assets/img/opponents/`.
- Kick-off times come from `cc25_kickoff_overrides()`; the run prints
  `assumed KO` for any fixture still falling back to the day-of-week default.
- Fixtures that are postponed (`cc25_hidden_fixtures`) or have an undrawn
  opponent are skipped.

Rerun both commands after any fixture, kick-off or crest change.

## Score cards

Every possible full-time scoreline for every Men's First Team fixture, in both
Instagram sizes, so whoever is posting at full time picks one rather than making it.

    python3 scores.py                # all 27 men's fixtures
    python3 scores.py 2026-08-22     # one game (matches date, opponent or filename)

Output: `~/Downloads/CCFC Score Cards/<game>/Feed|Story/` — 36 cards per game per
size (0-0 up to 5-5), 1,944 in total, about a minute to run.

- **Cwmbran Celtic's score is always first**, home or away, because our crest is
  always on the left. `CCFC 2-1 Abergavenny Town.png` means Celtic scored two.
- Feed is 1080x1350, Story is 1080x1920. The story frame is a **splice, not a
  stretch**: both PSDs carry 661 byte-identical rows from y=491, so 570 rows are
  inserted inside that band and the border, corners and sponsor bar are untouched.
- The white panel's bounds are measured off the frame, not hardcoded, so content is
  centred at both sizes. Note `batch.py` still centres the fixture cards on
  `CX=515`, which is 18px right of the panel's real centre (497).
- Crest sizes are derived from the panel width. The story frame is taller, not
  wider, so hardcoded larger crests pushed both badges over the border — the run
  reports any card that draws outside the panel.
