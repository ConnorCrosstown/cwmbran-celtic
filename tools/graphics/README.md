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
