<?php
/**
 * Every bundled image the theme names must exist. Run from the theme root:
 *   php _tests/bundled-images-test.php
 *
 * The 2026-08-21 audit moved the bundled artwork to WebP (13.2 MB -> 3.0 MB),
 * which meant rewriting a filename in roughly eighty places. A missed one does
 * not error: PHP happily builds the URL, the browser asks for a file that is not
 * there, and a crest or a player card is simply blank — on the fixtures page,
 * on a matchday, where nobody is looking at the code.
 *
 * So the filenames are checked against the filesystem here instead.
 */

// This file ships inside the theme zip and must never execute over HTTP.
if (PHP_SAPI !== 'cli') exit;

$root = dirname(__DIR__);
$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}

/* ---- Crests: the map in cc25_opp_crest_file() is the club's badge index ---- */

$fn = file_get_contents($root . '/functions.php');
preg_match('/function cc25_opp_crest_file.*?\n}/s', $fn, $m);
preg_match_all("/=> '([^']+\.[a-z]+)'/", $m[0], $crests);
$crests = $crests[1];

check('the crest map is not empty', count($crests) >= 25);
$missing = array();
foreach ($crests as $file) {
    if (!file_exists($root . '/assets/img/opponents/' . $file)) $missing[] = $file;
}
check('every mapped crest file exists' . ($missing ? ' — missing: ' . implode(', ', $missing) : ''),
      $missing === array());
check('every mapped crest is WebP',
      count(array_filter($crests, function ($f) { return substr($f, -5) === '.webp'; })) === count($crests));

/* ---- Every other bundled path written as a literal in the PHP ---- */

$dirs = array('kit', 'player-cards', 'sponsor-banners', 'shop', 'sponsors');
$stems = array();
foreach ($dirs as $d) {
    foreach (glob($root . '/assets/img/' . $d . '/*') as $f) {
        $stems[pathinfo($f, PATHINFO_FILENAME)] = $d;
    }
}
check('bundled artwork was found on disk', count($stems) > 80);

$phps = array();
foreach (array('/*.php', '/inc/*.php', '/template-parts/*.php') as $g) {
    $phps = array_merge($phps, glob($root . $g));
}
$bad = array();
foreach ($phps as $p) {
    if (!preg_match_all("/'([A-Za-z0-9_\-]+)\.(png|jpg|jpeg)'/", file_get_contents($p), $mm)) continue;
    foreach ($mm[1] as $i => $stem) {
        // Only artwork that lives in a converted folder; share cards and the
        // root-level images (hero.jpg, mvt-logo.png) are deliberately untouched.
        if (!isset($stems[$stem])) continue;
        $bad[] = basename($p) . ': ' . $stem . '.' . $mm[2][$i];
    }
}
check('no converted image is still referenced by its old extension'
      . ($bad ? ' — ' . implode(', ', array_slice($bad, 0, 6)) : ''), $bad === array());

/* ---- The exclusions are deliberate and must stay that way ---- */

$share = glob($root . '/assets/img/share/*');
check('share cards still exist', count($share) > 20);
check('share cards are still JPEG — social crawlers handle WebP inconsistently',
      count(array_filter($share, function ($f) { return substr($f, -4) === '.jpg'; })) === count($share));

// Originals live outside the theme folder, so they are in git but never shipped.
check('originals are not inside the theme', !is_dir($root . '/assets/img/_src'));
check('and the source folder is beside it', is_dir(dirname($root) . '/_img-src/opponents'));

/* ---- The weight, which is the whole point ---- */

$bytes = 0;
foreach ($dirs as $d) foreach (glob($root . '/assets/img/' . $d . '/*') as $f) $bytes += filesize($f);
foreach (glob($root . '/assets/img/opponents/*') as $f) $bytes += filesize($f);
printf("      bundled artwork now %.2f MB\n", $bytes / 1048576);
check('bundled artwork stays under 4 MB (was 13.2 MB)', $bytes < 4 * 1048576);

$crestBytes = 0;
foreach (glob($root . '/assets/img/opponents/*') as $f) $crestBytes += filesize($f);
check('the whole crest set is under 300 KB (was 2.30 MB)', $crestBytes < 300 * 1024);

echo "\n" . (count($failures) ? count($failures) . " FAILURE(S)\n" : "All checks passed\n");
exit(count($failures) ? 1 : 0);
