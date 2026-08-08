<?php
/**
 * Match photography.
 *
 * Keyed by GAME ("team|YYYY-MM-DD"), not by post, because there are two kinds of
 * report page — the club-written post and the COMET-built match centre at
 * /match-report/?g=… — and photos from a game belong to both. Hanging them off the
 * written report would mean no photos until somebody writes one, and the games
 * already on the site have no post at all.
 *
 * Empty is the normal state. Every report renders exactly as it does today until a
 * gallery exists for that game, so this can ship before the first photo is taken.
 *
 * The credit is part of the gallery rather than an afterthought: a photographer's
 * name should be impossible to forget, so it defaults to whoever was credited last.
 */
if (!defined('ABSPATH')) exit;

const CC25_GALLERY_CPT = 'cc25_gallery';

/**
 * A grid thumbnail size.
 *
 * Registered so a 6MP phone upload isn't what a visitor downloads twelve of. WP
 * generates this on upload and emits srcset automatically; the lightbox asks for
 * 'large'. Cropped square so the grid stays even whatever shape came out of the
 * camera.
 */
add_action('after_setup_theme', function () {
    add_image_size('cc25_gal', 700, 700, true);
});

/* ---------------------------------------------------------------- reading */

/**
 * Attachment IDs from the stored CSV.
 *
 * Pure and separate so it can be tested: this is the part that decides whether a
 * gallery renders at all, and a stray empty string or a 0 would print a broken
 * image on a public page.
 */
function cc25_gallery_parse_ids($csv) {
    $out = array();
    foreach (explode(',', (string) $csv) as $bit) {
        $id = (int) trim($bit);
        if ($id > 0 && !in_array($id, $out, true)) $out[] = $id;
    }
    return $out;
}

/**
 * The gallery for a game, or null when there isn't one.
 *
 * @return array{ids:int[], credit:string, id:int}|null
 */
function cc25_match_gallery($team, $ymd) {
    if (!function_exists('get_posts') || !function_exists('post_type_exists')) return null;
    if (!post_type_exists(CC25_GALLERY_CPT)) return null;
    $key = $team . '|' . $ymd;

    static $cache = null;
    if ($cache === null) {
        $cache = array();
        foreach (get_posts(array('post_type' => CC25_GALLERY_CPT, 'post_status' => 'publish',
                                 'numberposts' => -1)) as $p) {
            $k = (string) get_post_meta($p->ID, '_cc25_gal_game', true);
            if ($k === '' || isset($cache[$k])) continue;
            $ids = cc25_gallery_parse_ids(get_post_meta($p->ID, '_cc25_gal_ids', true));
            if (!$ids) continue;   /* a gallery with no photos is not a gallery */
            $cache[$k] = array(
                'ids'    => $ids,
                'credit' => trim((string) get_post_meta($p->ID, '_cc25_gal_credit', true)),
                'id'     => $p->ID,
            );
        }
    }
    return $cache[$key] ?? null;
}

/**
 * The credit to offer for a new gallery: whoever was credited most recently.
 *
 * One photographer shoots most weeks, so asking every time is friction that
 * eventually gets skipped — and an uncredited photo is the thing this is meant to
 * prevent.
 */
function cc25_photo_credit_default() {
    if (!function_exists('get_posts') || !function_exists('post_type_exists')) return '';
    if (!post_type_exists(CC25_GALLERY_CPT)) return '';
    $posts = get_posts(array('post_type' => CC25_GALLERY_CPT, 'post_status' => array('publish', 'draft'),
                             'numberposts' => 8, 'orderby' => 'modified', 'order' => 'DESC'));
    foreach ($posts as $p) {
        $c = trim((string) get_post_meta($p->ID, '_cc25_gal_credit', true));
        if ($c !== '') return $c;
    }
    return '';
}

/** Render the gallery for a game, or nothing at all. Both report surfaces call
 *  this, so they cannot drift apart. */
function cc25_match_gallery_html($team, $ymd) {
    $gal = cc25_match_gallery($team, $ymd);
    if (!$gal) return '';
    if (!function_exists('locate_template')) return '';
    $tpl = locate_template('template-parts/match-gallery.php');
    if (!$tpl) return '';
    set_query_var('cc25_gal', $gal);
    ob_start();
    include $tpl;
    return ob_get_clean();
}

/* ---------------------------------------------------------------- wp-admin */

add_action('init', function () {
    register_post_type(CC25_GALLERY_CPT, array(
        'labels' => array(
            'name'          => 'Match Galleries',
            'singular_name' => 'Match Gallery',
            'add_new_item'  => 'Add a Match Gallery',
            'edit_item'     => 'Edit Match Gallery',
            'menu_name'     => 'Match Galleries',
        ),
        'public'          => false,   /* shown on the report pages, not its own URL */
        'show_ui'         => true,
        'show_in_menu'    => true,
        'menu_icon'       => 'dashicons-format-gallery',
        'supports'        => array('title'),
        'capability_type' => 'post',
        'map_meta_cap'    => true,
    ));
});

add_action('add_meta_boxes', function () {
    add_meta_box('cc25_gal', 'Photos', 'cc25_gallery_metabox', CC25_GALLERY_CPT, 'normal', 'high');
});

/** The media modal, only on this screen. */
add_action('admin_enqueue_scripts', function ($hook) {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->post_type !== CC25_GALLERY_CPT) return;
    wp_enqueue_media();
    $rel = '/assets/gallery-admin.js';
    wp_enqueue_script('cc25-gallery-admin', get_stylesheet_directory_uri() . $rel,
        array('jquery'), (string) (@filemtime(get_stylesheet_directory() . $rel) ?: '1'), true);
});

function cc25_gallery_metabox($post) {
    wp_nonce_field('cc25_gal_save', 'cc25_gal_nonce');
    $game   = (string) get_post_meta($post->ID, '_cc25_gal_game', true);
    $ids    = cc25_gallery_parse_ids(get_post_meta($post->ID, '_cc25_gal_ids', true));
    $credit = (string) get_post_meta($post->ID, '_cc25_gal_credit', true);
    if ($credit === '') $credit = cc25_photo_credit_default();
    $games  = function_exists('cc25_mr_recent_games') ? cc25_mr_recent_games() : array();
    ?>
    <p><label for="cc25gal_game"><strong>Which game?</strong></label><br>
      <select id="cc25gal_game" name="cc25_gal_game" style="width:100%;max-width:520px">
        <option value="">&mdash; pick the game &mdash;</option>
        <?php foreach ($games as $key => $label): ?>
          <option value="<?php echo esc_attr($key); ?>"<?php selected($game, $key); ?>><?php echo esc_html($label); ?></option>
        <?php endforeach; ?>
      </select>
    </label></p>
    <p style="color:#666;font-size:12px;margin-top:-6px">The photos appear on that game&rsquo;s
      match report automatically &mdash; both the written report and the match centre.</p>

    <p><label for="cc25gal_credit"><strong>Photographer</strong></label><br>
      <input type="text" id="cc25gal_credit" name="cc25_gal_credit" value="<?php echo esc_attr($credit); ?>"
             style="width:100%;max-width:360px" placeholder="Name of the photographer">
    </label><br>
    <span style="color:#666;font-size:12px">Printed under every photo in this gallery. Pre-filled
      with whoever was credited last, so it only needs typing once.</span></p>

    <p style="margin-bottom:6px"><strong>Photos</strong></p>
    <div id="cc25gal-picker"
         data-ids="<?php echo esc_attr(implode(',', $ids)); ?>"
         data-nonce="<?php echo esc_attr(wp_create_nonce('cc25_gal_pick')); ?>">
      <p>
        <button type="button" class="button button-primary" id="cc25gal-add">Add or edit photos</button>
        <button type="button" class="button" id="cc25gal-clear">Remove all</button>
      </p>
      <div id="cc25gal-thumbs" class="cc25gal-thumbs">
        <?php foreach ($ids as $i): $t = wp_get_attachment_image($i, 'thumbnail'); ?>
          <?php if ($t): ?><span class="cc25gal-thumb" data-id="<?php echo intval($i); ?>"><?php echo $t; ?></span><?php endif; ?>
        <?php endforeach; ?>
      </div>
      <input type="hidden" name="cc25_gal_ids" id="cc25gal-ids" value="<?php echo esc_attr(implode(',', $ids)); ?>">
    </div>
    <p style="color:#666;font-size:12px">
      <?php echo $ids ? esc_html(count($ids) . ' photo' . (count($ids) === 1 ? '' : 's') . ' in this gallery.') : 'No photos yet.'; ?>
      Drag them into order in the media window. Upload the full-size files &mdash; the site
      makes its own smaller copies, so nobody downloads a 6MP original to look at a grid.
    </p>
    <style>
      .cc25gal-thumbs{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}
      .cc25gal-thumb img{width:78px;height:78px;object-fit:cover;border-radius:4px;display:block}
    </style>
    <?php
}

add_action('save_post_' . CC25_GALLERY_CPT, function ($id) {
    if (!isset($_POST['cc25_gal_nonce']) || !wp_verify_nonce($_POST['cc25_gal_nonce'], 'cc25_gal_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $id)) return;

    /* Only a game we actually offered, so a stale form can't attach photos to a
     * fixture that no longer exists — the same guard the report box uses, learned
     * from an import that overwrote the wrong game. */
    $game  = sanitize_text_field(wp_unslash($_POST['cc25_gal_game'] ?? ''));
    $games = function_exists('cc25_mr_recent_games') ? cc25_mr_recent_games() : array();
    if ($game !== '' && $games && !isset($games[$game])) {
        $game = (string) get_post_meta($id, '_cc25_gal_game', true);
    }
    update_post_meta($id, '_cc25_gal_game', $game);

    update_post_meta($id, '_cc25_gal_credit',
        sanitize_text_field(wp_unslash($_POST['cc25_gal_credit'] ?? '')));

    /* Re-serialised through the parser, so whatever the browser posted is stored in
     * the one format the reader understands. */
    $ids = cc25_gallery_parse_ids(wp_unslash($_POST['cc25_gal_ids'] ?? ''));
    update_post_meta($id, '_cc25_gal_ids', implode(',', $ids));

    /* An untitled gallery is hard to find in a list of twenty, so name it after the
     * game it belongs to when the club hasn't. */
    if ($game !== '' && trim(get_the_title($id)) === '' && $games && isset($games[$game])) {
        remove_action('save_post_' . CC25_GALLERY_CPT, __FUNCTION__);
        wp_update_post(array('ID' => $id, 'post_title' => $games[$game]));
    }
});

/** Warn when a gallery has photos but no credit. The whole point is that the
 *  photographer gets his name on his work; silence here would defeat it. */
add_action('admin_notices', function () {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->post_type !== CC25_GALLERY_CPT || $screen->base !== 'post') return;
    $id = isset($_GET['post']) ? (int) $_GET['post'] : 0;
    if (!$id) return;
    $ids    = cc25_gallery_parse_ids(get_post_meta($id, '_cc25_gal_ids', true));
    $credit = trim((string) get_post_meta($id, '_cc25_gal_credit', true));
    if ($ids && $credit === '') {
        echo '<div class="notice notice-warning"><p><strong>No photographer credited.</strong> '
           . 'These photos will publish without a byline &mdash; add a name above.</p></div>';
    }
});
