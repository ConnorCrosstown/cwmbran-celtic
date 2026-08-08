<?php
/**
 * Keeping the site un-breakable by the people who update it.
 *
 * The club's volunteers need to publish fixtures, results, reports and Bond
 * draws. None of that needs the ability to edit theme files — but until now a
 * single Administrator login could open Appearance > Theme File Editor and take
 * the live site down in a keystroke.
 *
 * The real fix is DISALLOW_FILE_EDIT in wp-config.php, which a theme cannot set
 * because wp-config loads first. So this does what a theme can: removes the
 * screens, blocks them if reached directly, and tells an admin how to make it
 * permanent.
 */
if (!defined('ABSPATH')) exit;

/** Drop the theme/plugin file editors from the menu. */
add_action('admin_menu', function () {
    remove_submenu_page('themes.php', 'theme-editor.php');
    remove_submenu_page('plugins.php', 'plugin-editor.php');
}, 999);

/** And refuse them if someone types the URL. Removing a menu item hides a screen;
 *  it does not protect it. */
add_action('admin_init', function () {
    global $pagenow;
    if (in_array($pagenow, array('theme-editor.php', 'plugin-editor.php'), true)) {
        wp_die(
            esc_html__('Editing theme and plugin files is disabled on this site. Ask your developer if you need a code change.', 'cc25'),
            esc_html__('Not allowed', 'cc25'),
            array('response' => 403, 'back_link' => true)
        );
    }
});

/** Belt and braces: WordPress asks this filter before showing the editors. */
add_filter('map_meta_cap', function ($caps, $cap) {
    if (in_array($cap, array('edit_themes', 'edit_plugins', 'edit_files'), true)) {
        return array('do_not_allow');
    }
    return $caps;
}, 10, 2);

/**
 * One-time nudge on the dashboard until wp-config carries the constant. Shown to
 * administrators only — an Editor can do nothing about it and shouldn't see it.
 */
add_action('admin_notices', function () {
    if (defined('DISALLOW_FILE_EDIT') && DISALLOW_FILE_EDIT) return;
    if (!current_user_can('manage_options')) return;
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->id !== 'dashboard') return;
    echo '<div class="notice notice-warning"><p><strong>Cwmbran Celtic:</strong> the theme has disabled the file editors, '
       . 'but add <code>define(\'DISALLOW_FILE_EDIT\', true);</code> to <code>wp-config.php</code> to turn them off for good — '
       . 'a theme cannot do that on its own.</p></div>';
});

/**
 * Paste-a-table parser, shared by every field where the club supplies a list.
 *
 * They already hand this data over as a pasted table, so the field is shaped like
 * one. Parsing is deliberately forgiving: a header row, stray whitespace, a
 * missing trailing column or a blank line should never cost someone their work.
 *
 * @param string $text  one record per line, columns separated by | or tab
 * @param array  $cols  column keys, in order
 * @return array        one row per line, keyed by $cols; short rows padded ''
 */
function cc25_parse_table($text, $cols) {
    $rows = array();
    $text = str_replace(array("\r\n", "\r"), "\n", (string) $text);
    foreach (explode("\n", $text) as $line) {
        $line = trim($line);
        if ($line === '') continue;
        // Tabs are what a spreadsheet paste actually produces; pipes are what
        // someone types by hand. Accept either, and a comma only if neither is
        // present (names contain commas far too often to split on them blindly).
        if (strpos($line, '|') !== false)        $parts = explode('|', $line);
        elseif (strpos($line, "\t") !== false)   $parts = explode("\t", $line);
        else                                     continue;   // one column is not a table row
        $parts = array_map('trim', $parts);
        // Skip a header row — the club's tables usually have one.
        if (count($rows) === 0 && cc25_table_looks_like_header($parts, $cols)) continue;
        $row = array();
        foreach ($cols as $i => $key) {
            $row[$key] = isset($parts[$i]) ? $parts[$i] : '';
        }
        if (implode('', $row) === '') continue;   // nothing but separators
        $rows[] = $row;
    }
    return $rows;
}

/** True when a row is column headings rather than data. */
function cc25_table_looks_like_header($parts, $cols) {
    $norm = function ($s) { return preg_replace('/[^a-z]/', '', strtolower((string) $s)); };
    $hits = 0;
    foreach ($parts as $p) {
        foreach ($cols as $c) {
            if ($norm($p) !== '' && $norm($p) === $norm($c)) { $hits++; break; }
        }
    }
    // Also catch the common wordings the keys don't match exactly.
    $words = array('bondno', 'no', 'number', 'prize', 'name', 'winner', 'paymentgroup', 'group',
                   'date', 'team', 'opponent', 'venue', 'score', 'competition');
    foreach ($parts as $p) {
        if (in_array($norm($p), $words, true)) $hits++;
    }
    return $hits >= 2;
}
