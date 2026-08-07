"""
Assertions over the programme sheet geometry. Run from this directory:
    python3 test_layout.py

The imposition is the part that silently ruins a print run — a page in the wrong
half prints fine and only reveals itself once it's folded.
"""
from layout import page_to_slot, slot_to_page, sheet_pages, half_origin, A5_W, A4L_W

fails = 0


def check(label, cond):
    global fails
    if cond:
        print(f'  ok  {label}')
        return
    fails += 1
    print(f'FAIL  {label}')


# The wrap: front cover leads, back cover is the other half of the same sheet.
check('page 1 is the right half of sheet 1', page_to_slot(1) == (1, 'right'))
check('page 32 is the left half of sheet 1', page_to_slot(32) == (1, 'left'))
check('sheet 1 carries pages 32 and 1', sheet_pages(1) == (32, 1))

# Everything else runs in order.
check('page 2 is sheet 2 left', page_to_slot(2) == (2, 'left'))
check('page 3 is sheet 2 right', page_to_slot(3) == (2, 'right'))
check('page 8 is sheet 5 left', page_to_slot(8) == (5, 'left'))
check('page 9 is sheet 5 right', page_to_slot(9) == (5, 'right'))
check('page 30 is sheet 16 left', page_to_slot(30) == (16, 'left'))
check('page 31 is sheet 16 right', page_to_slot(31) == (16, 'right'))

# Round-trip: every page maps to a slot and back to itself.
check('all 32 pages round-trip', all(slot_to_page(*page_to_slot(p)) == p for p in range(1, 33)))

# And every slot is used exactly once — no page lost, none duplicated.
slots = [page_to_slot(p) for p in range(1, 33)]
check('no slot is used twice', len(set(slots)) == 32)
check('every sheet appears exactly twice',
      all(sum(1 for s, _ in slots if s == n) == 2 for n in range(1, 17)))

# Geometry.
check('a half is exactly half the sheet', A5_W * 2 == A4L_W)
check('left half starts at x=0', half_origin('left') == 0.0)
check('right half starts at the midpoint', half_origin('right') == A5_W)

# Out of range must raise rather than silently wrap to the wrong sheet.
for bad in (0, 33, -1):
    try:
        page_to_slot(bad)
        check(f'page {bad} rejected', False)
    except ValueError:
        check(f'page {bad} rejected', True)

print('\n' + (f'{fails} FAILED' if fails else 'All checks passed'))
raise SystemExit(1 if fails else 0)
