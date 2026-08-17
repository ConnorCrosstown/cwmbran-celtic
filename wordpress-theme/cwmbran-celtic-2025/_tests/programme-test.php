<?php
/**
 * Assertions over programme link handling. Run from the theme root:
 *   php _tests/programme-test.php
 * functions.php loads standalone with these no-op stubs; WordPress never loads
 * this file.
 */

// This file ships inside the theme zip and must never execute over HTTP.
if (PHP_SAPI !== 'cli') exit;

function add_action() {}
function add_filter() {}
if (!defined('ABSPATH')) define('ABSPATH', __DIR__ . '/');
require __DIR__ . '/../functions.php';

$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label;
    echo "FAIL  $label\n";
}

// What counts as something we can read on our own site.
check('a plain .pdf is a PDF', cc25_is_pdf_url('https://www.cwmbranceltic.com/wp-content/uploads/2026/04/Ammanford-Programme.pdf'));
check('an uppercase .PDF is a PDF', cc25_is_pdf_url('https://example.com/a/PROGRAMME.PDF'));
check('a query string does not hide the extension', cc25_is_pdf_url('https://example.com/prog.pdf?ver=2'));
check('a fragment does not hide the extension', cc25_is_pdf_url('https://example.com/prog.pdf#page=3'));
check('both together do not hide it', cc25_is_pdf_url('https://example.com/prog.pdf?v=2#page=3'));

// The links that expire, and other things that must keep passing through.
check('a Heyzine flipbook is not a PDF', cc25_is_pdf_url('https://heyzine.com/flip-book/e3e0d6733d.html') === false);
check('an Issuu link is not a PDF', cc25_is_pdf_url('https://issuu.com/cwmbranceltic/docs/programme') === false);
check('empty is not a PDF', cc25_is_pdf_url('') === false);
check('whitespace is not a PDF', cc25_is_pdf_url('   ') === false);
check('null is not a PDF', cc25_is_pdf_url(null) === false);

// ".pdf" must be an extension, not merely present in the URL.
check('a directory named pdf is not a PDF', cc25_is_pdf_url('https://example.com/pdf/programme') === false);
check('a query parameter mentioning pdf is not a PDF', cc25_is_pdf_url('https://heyzine.com/view?file=prog.pdf') === false);
check('a host mentioning pdf is not a PDF', cc25_is_pdf_url('https://mypdf.com/programme') === false);
/* ---- extra pages ---------------------------------------------------------
 * Season advertising added to the digital programme. The table is keyed by the
 * season label cc25_programme_season() produces, so a typo there means an
 * advertiser silently gets nothing. */
$cc25_extras = cc25_programme_extras_static();
check('the extras table is keyed by season', (bool) preg_grep('~^\d{4}/\d{2}$~', array_keys($cc25_extras)) || $cc25_extras === array());
foreach ($cc25_extras as $cc25_season => $cc25_list) {
    check("season $cc25_season is a season label", (bool) preg_match('~^\d{4}/\d{2}$~', $cc25_season));
    foreach ($cc25_list as $cc25_n => $cc25_e) {
        check("$cc25_season extra $cc25_n names artwork", !empty($cc25_e['img']));
        check("$cc25_season extra $cc25_n artwork is in the theme",
            is_file(dirname(__DIR__) . '/assets/' . $cc25_e['img']));
        check("$cc25_season extra $cc25_n has alt text", !empty($cc25_e['alt']));
    }
}
check('the season label helper agrees with the table format',
    (bool) preg_match('~^\d{4}/\d{2}$~', cc25_season_label_from_ts(mktime(0, 0, 0, 9, 1, 2026))));

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
