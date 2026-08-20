<?php
/**
 * The theme must not ship or reference a .mjs file. Run from the theme root:
 *   php _tests/module-assets-test.php
 *
 * WHY THIS TEST EXISTS
 * --------------------
 * The programme reader is an ES module, and ES modules were shipped as .mjs —
 * which is correct, and which broke the reader completely on the live site.
 * cwmbranceltic.com's server has no MIME mapping for .mjs and serves it as
 * "text/plain; charset=UTF-8". Browsers refuse to execute a module script
 * whose MIME type is not a JavaScript one, so programme-reader.mjs never ran,
 * on any programme, for anybody. The page sat on "Loading the programme…"
 * forever. Verified in a browser against the live site on 17 Aug 2026: the
 * identical bytes fail from their .mjs URL and run from a blob typed
 * text/javascript.
 *
 * .js from the same directory is served as application/javascript, so every
 * module now uses .js. This test is here so a future .mjs cannot creep back in
 * — the failure is silent in every automated check we have, because the file
 * exists, the markup is right, and only the browser refuses it.
 */
if (PHP_SAPI !== 'cli') exit;

$root = dirname(__DIR__);
$failures = array();
function check($label, $cond) {
    global $failures;
    if ($cond) { echo "  ok  $label\n"; return; }
    $failures[] = $label; echo "  FAIL $label\n";
}

/* ---- 1. No .mjs file ships in the theme ------------------------------- */
$mjs = array();
$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS));
foreach ($it as $f) {
    if (strtolower($f->getExtension()) === 'mjs') $mjs[] = substr($f->getPathname(), strlen($root) + 1);
}
check('no .mjs files ship in the theme' . ($mjs ? ' (found: ' . implode(', ', $mjs) . ')' : ''), !$mjs);

/* ---- 2. Nothing in our own source points at a .mjs -------------------- */
/* Vendor bundles mention .mjs in their own internals; only our files matter. */
$ours = array();
foreach ($it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS)) as $f) {
    $rel = substr($f->getPathname(), strlen($root) + 1);
    if (strpos($rel, 'assets/vendor/') === 0) continue;
    // This file has to name the extension to explain why it must not appear.
    if ($rel === '_tests/module-assets-test.php') continue;
    if (!in_array(strtolower($f->getExtension()), array('php', 'js'), true)) continue;
    $ours[] = array($rel, $f->getPathname());
}
$refs = array();
foreach ($ours as $o) {
    list($rel, $path) = $o;
    if (preg_match('/[\w.\/-]+\.mjs/', (string) file_get_contents($path), $m)) $refs[] = "$rel -> $m[0]";
}
check('no theme source references a .mjs' . ($refs ? ' (found: ' . implode('; ', $refs) . ')' : ''), !$refs);

/* ---- 3. Every asset the reader loads actually exists ------------------ */
$needed = array(
    'assets/programme-reader.js',
    'assets/programme-pages.js',
    'assets/vendor/pdfjs/pdf.min.js',
    'assets/vendor/pdfjs/pdf.worker.min.js',
    'assets/sponsor-band.js',
    'assets/sponsor-rotation.js',
);
foreach ($needed as $n) check("$n exists", is_file($root . '/' . $n));

/* ---- 4. Node must read assets/*.js as ES modules ---------------------- */
/* Without this, `node _tests/reader-order-test.js` treats programme-pages.js
 * as CommonJS and its `export` is a syntax error. */
$pkg = $root . '/assets/package.json';
$ok = is_file($pkg) && (json_decode((string) file_get_contents($pkg), true)['type'] ?? '') === 'module';
check('assets/package.json marks the directory as ESM for Node', $ok);

echo $failures ? "\n" . count($failures) . " FAILED\n" : "\nAll checks passed\n";
exit($failures ? 1 : 0);
