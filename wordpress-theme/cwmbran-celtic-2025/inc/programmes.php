<?php
/**
 * Match day programmes: which post is one, which season it belongs to, and whether
 * it can be read here or only linked away to. Moved out of functions.php unchanged.
 */
if (!defined('ABSPATH')) exit;


/* ---- Match Day Programmes ---------------------------------------------------
 * Post each programme as a normal Post in the "programme" category, set a
 * Featured Image (the cover), set the post date to the match date, and paste the
 * PDF / Issuu link in the "Match Day Programme" box. The archive page groups them
 * by season automatically and the newest shows on the home page. */
function cc25_programme_category() { return 'programme'; }

/** UK football season label (Aug–May) from a timestamp, e.g. "2026/27". */
function cc25_season_label_from_ts($ts) {
    $y = (int) date('Y', $ts); $m = (int) date('n', $ts);
    $start = ($m >= 7) ? $y : $y - 1;
    return $start . '/' . substr((string) ($start + 1), -2);
}
function cc25_programme_season($id) {
    $s = trim((string) get_post_meta($id, '_cc25_prog_season', true));
    return $s !== '' ? $s : cc25_season_label_from_ts((int) get_post_time('U', true, $id));
}
function cc25_programme_url($id) {
    $u = trim((string) get_post_meta($id, '_cc25_prog_url', true));
    return $u !== '' ? $u : get_permalink($id);
}

/* -------------------------------------------------------------------------
 * Programme reader. Programmes used to be Heyzine flipbooks, whose links
 * expire — so a PDF link is now read on the club's own site instead, at the
 * programme post's permalink. Non-PDF links (the remaining Heyzine ones) still
 * pass straight through, so the two can coexist while they are swapped over.
 * ---------------------------------------------------------------------- */

/** True when $url points at a PDF, ignoring any query string or fragment. */
function cc25_is_pdf_url($url) {
    $url = trim((string) $url);
    if ($url === '') return false;
    $path = (string) parse_url($url, PHP_URL_PATH);
    return strtolower(substr($path, -4)) === '.pdf';
}

/** The programme's PDF, or '' when it has none (an external flipbook, or nothing). */
function cc25_programme_pdf($id) {
    $u = trim((string) get_post_meta($id, '_cc25_prog_url', true));
    return cc25_is_pdf_url($u) ? $u : '';
}

/** Where a programme card should point: our own reader when there's a PDF to
 *  read, otherwise the external link exactly as before. */
function cc25_programme_read_url($id) {
    return cc25_programme_pdf($id) !== '' ? get_permalink($id) : cc25_programme_url($id);
}

/** True when this post is a programme the reader can render. */
function cc25_is_programme_post($post = null) {
    $post = get_post($post);
    if (!$post) return false;
    return in_category(cc25_programme_category(), $post) && cc25_programme_pdf($post->ID) !== '';
}

/** Sheet 1 of a landscape programme is the outer wrap (back cover | front cover)
 *  unless the club has said otherwise for this one. */
function cc25_programme_cover_wrap($id) {
    return get_post_meta($id, '_cc25_prog_nowrap', true) ? false : true;
}
/** All programme posts grouped by season, newest season first. */
function cc25_programmes_by_season() {
    $posts = get_posts(array(
        'post_type'   => 'post',
        'post_status' => 'publish',
        'numberposts' => -1,
        'category_name' => cc25_programme_category(),
        'orderby'     => 'date',
        'order'       => 'DESC',
    ));
    $by = array();
    foreach ($posts as $p) { $by[cc25_programme_season($p->ID)][] = $p; }
    uksort($by, function ($a, $b) { return intval($b) <=> intval($a); });
    return $by;
}
function cc25_latest_programme() {
    $p = get_posts(array('post_type' => 'post', 'post_status' => 'publish', 'numberposts' => 1,
        'category_name' => cc25_programme_category(), 'orderby' => 'date', 'order' => 'DESC'));
    return $p ? $p[0] : null;
}

/**
 * "Written by" byline override — lets one publisher credit the real author of a
 * post without that person needing a WordPress login. Shown on Posts.
 */
add_action('add_meta_boxes', function () {
    add_meta_box('cc25_byline', 'Written by', 'cc25_byline_metabox', 'post', 'side');
});
function cc25_byline_metabox($post) {
    wp_nonce_field('cc25_byline_save', 'cc25_byline_nonce');
    $name = get_post_meta($post->ID, '_cc25_byline', true);
    echo '<p><label><strong>Author name (byline)</strong><br>'
        . '<input type="text" name="cc25_byline" value="' . esc_attr($name) . '" style="width:100%" placeholder="e.g. Tony Strange"></label></p>';
    echo '<p style="color:#666;font-size:11px;margin:0">Leave blank to use the logged-in publisher. Fill it in to credit whoever wrote the piece &mdash; they don\'t need a login.</p>';
}
add_action('save_post', function ($id) {
    if (!isset($_POST['cc25_byline_nonce']) || !wp_verify_nonce($_POST['cc25_byline_nonce'], 'cc25_byline_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $id)) return;
    update_post_meta($id, '_cc25_byline', sanitize_text_field(wp_unslash($_POST['cc25_byline'] ?? '')));
});
/** Display byline for a post: the "Written by" override if set, else the author. */
function cc25_byline($id = null) {
    $id = $id ?: get_the_ID();
    $o = trim((string) get_post_meta($id, '_cc25_byline', true));
    return $o !== '' ? $o : get_the_author();
}

/** Editor box for the programme link + optional season override (shown on Posts). */
add_action('add_meta_boxes', function () {
    add_meta_box('cc25_prog', 'Match Day Programme', 'cc25_prog_metabox', 'post', 'side', 'high');
});
function cc25_prog_metabox($post) {
    wp_nonce_field('cc25_prog_save', 'cc25_prog_nonce');
    $url = get_post_meta($post->ID, '_cc25_prog_url', true);
    $season = get_post_meta($post->ID, '_cc25_prog_season', true);
    $nowrap = get_post_meta($post->ID, '_cc25_prog_nowrap', true);
    echo '<p><label><strong>Programme link</strong><br>'
        . '<input type="url" name="cc25_prog_url" value="' . esc_attr($url) . '" style="width:100%" placeholder="https://…/programme.pdf"></label></p>';
    echo '<p style="color:#666;font-size:11px;margin:0 0 12px">Upload the <b>PDF</b> to the Media Library and paste its link here — it is then read on this site, at this post\'s own address. Any other link (a Heyzine or Issuu flipbook) still opens away from the site, and will expire.</p>';
    echo '<p><label><strong>Season</strong> (optional)<br>'
        . '<input type="text" name="cc25_prog_season" value="' . esc_attr($season) . '" style="width:100%" placeholder="auto from post date, e.g. 2026/27"></label></p>';
    echo '<p><label><input type="checkbox" name="cc25_prog_nowrap" value="1"' . ($nowrap ? ' checked' : '') . '> '
        . '<strong>Pages run straight through</strong></label></p>';
    echo '<p style="color:#666;font-size:11px;margin:0 0 12px">Only for landscape PDFs, and only on phones, where each sheet is split into its two pages. Leave this unticked for a programme laid out as a booklet — the first sheet being back cover alongside front cover — so it opens on the front cover. Tick it if the PDF simply starts at page 1 on the left.</p>';
    echo '<p style="color:#666;font-size:11px;margin:0">To publish a programme: set the category to <b>Programme</b>, add a <b>Featured Image</b> (the cover), and set the <b>post date</b> to the match date.</p>';
}
add_action('save_post', function ($id) {
    if (!isset($_POST['cc25_prog_nonce']) || !wp_verify_nonce($_POST['cc25_prog_nonce'], 'cc25_prog_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $id)) return;
    update_post_meta($id, '_cc25_prog_url', esc_url_raw(wp_unslash($_POST['cc25_prog_url'] ?? '')));
    update_post_meta($id, '_cc25_prog_season', sanitize_text_field(wp_unslash($_POST['cc25_prog_season'] ?? '')));
    if (empty($_POST['cc25_prog_nowrap'])) {
        delete_post_meta($id, '_cc25_prog_nowrap');
    } else {
        update_post_meta($id, '_cc25_prog_nowrap', '1');
    }
});

/** Homepage "Latest Gallery" feature. Post a gallery as a normal Post in the
 * "gallery" category with a Featured Image, and the newest one shows on the
 * home page automatically. Returns the WP_Post or null. */
function cc25_gallery_category() { return 'gallery'; }
function cc25_latest_gallery() {
    if (!class_exists('WP_Query')) return null;
    $q = new WP_Query(array(
        'post_type'           => 'post',
        'post_status'         => 'publish',
        'posts_per_page'      => 1,
        'category_name'       => cc25_gallery_category(),
        'meta_query'          => array(array('key' => '_thumbnail_id', 'compare' => 'EXISTS')),
        'no_found_rows'       => true,
        'ignore_sticky_posts' => true,
    ));
    $post = $q->have_posts() ? $q->posts[0] : null;
    wp_reset_postdata();
    return $post;
}
function cc25_sponsorship_brochure() { return ''; }  // paste a 2026/27 brochure PDF URL to show the download button

/** Current football season label, e.g. "2026/27" — derived from the date so it
 * never goes stale (the season rolls over in July). */
function cc25_season() {
    $y = (int) date_i18n('Y');
    $start = ((int) date_i18n('n') >= 7) ? $y : $y - 1;
    return $start . '/' . substr((string) ($start + 1), -2);
}
