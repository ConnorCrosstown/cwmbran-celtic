/**
 * Assertions over the sponsor rotation window. Run from the theme root:
 *   node _tests/sponsor-rotation-test.js
 * Imports the maths directly — it touches no DOM.
 */
import { rotationWindow } from '../assets/sponsor-rotation.js';

let failures = 0;
function check(label, cond) {
    if (cond) { console.log(`  ok  ${label}`); return; }
    failures++;
    console.log(`FAIL  ${label}`);
}

// The real thing: 22 sponsors, six on screen.
check('a window is six long', rotationWindow(22, 6, 0).length === 6);
check('it starts at the offset', rotationWindow(22, 6, 4)[0] === 4);
check('it wraps past the end', rotationWindow(22, 6, 20).join() === '20,21,0,1,2,3');
check('an offset past the end wraps round', rotationWindow(22, 6, 22)[0] === 0);

// No sponsor may appear twice on screen at once — two tiles of the same logo
// side by side reads as a bug to the sponsor looking at it.
check('no window repeats a sponsor', [...Array(22).keys()].every(o => new Set(rotationWindow(22, 6, o)).size === 6));

// Advancing by the window size cycles the whole roster and returns home.
const seen = new Set();
for (let step = 0; step * 6 < 22 * 6; step++) rotationWindow(22, 6, step * 6).forEach(i => seen.add(i));
check('advancing by a window covers every sponsor', seen.size === 22);

// Degenerate rosters must not hang or throw — a club with three sponsors and a
// six-wide band is a real state on a fresh install.
check('a roster smaller than the window shows what there is', rotationWindow(3, 6, 0).join() === '0,1,2');
check('a roster of one shows one', rotationWindow(1, 6, 0).join() === '0');
check('an empty roster shows nothing', rotationWindow(0, 6, 0).length === 0);
check('a negative offset is treated as zero', rotationWindow(22, 6, -1)[0] === 0);

console.log('');
if (failures) { console.log(`${failures} FAILED`); process.exit(1); }
console.log('all passed');
