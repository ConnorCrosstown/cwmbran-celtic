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

echo "\n" . ($failures ? count($failures) . " FAILED\n" : "All checks passed\n");
exit($failures ? 1 : 0);
