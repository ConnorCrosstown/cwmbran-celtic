/**
 * The sponsor band rotates.
 *
 * WHY THIS RUNS IN THE BROWSER
 * ----------------------------
 * The obvious implementation is a random pick in PHP. inc/sponsors.php used to
 * do exactly that and was changed away from it, because under full-page caching
 * a PHP-side random is rolled once, baked into the cached HTML, and served to
 * everybody until the cache expires. It looks random in development and is
 * frozen in production. Choosing the window here instead means it is genuinely
 * random per visitor, whatever any cache in front of the site is doing.
 */
import { rotationWindow } from './sponsor-rotation.js';

const CYCLE_MS = 7000;
const FADE_MS = 450;   // must match .cc-band-item transition in style.css

function startBand(band) {
    const items = Array.from(band.querySelectorAll('.cc-band-item'));
    const size = parseInt(band.dataset.window || '6', 10);
    if (items.length <= size) return;   // everyone is already on screen

    let offset = Math.floor(Math.random() * items.length);

    const show = (indices) => {
        indices.forEach((i) => {
            const img = items[i].querySelector('img');
            if (img && !img.getAttribute('src') && img.dataset.src) img.src = img.dataset.src;
        });
        items.forEach((el, i) => el.classList.toggle('is-on', indices.includes(i)));
    };

    show(rotationWindow(items.length, size, offset));

    setInterval(() => {
        const on = items.filter((el) => el.classList.contains('is-on'));
        on.forEach((el) => el.classList.add('is-fading'));
        setTimeout(() => {
            offset += size;
            show(rotationWindow(items.length, size, offset));
            items.forEach((el) => el.classList.remove('is-fading'));
        }, FADE_MS);
    }, CYCLE_MS);
}

if (typeof document !== 'undefined') {
    document.querySelectorAll('.cc-band').forEach(startBand);
}
