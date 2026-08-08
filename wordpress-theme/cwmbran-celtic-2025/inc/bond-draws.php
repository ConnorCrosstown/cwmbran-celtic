<?php
/**
 * Celtic Bond draws, editable in wp-admin.
 *
 * Was a hardcoded array in functions.php, edited by a developer once a month.
 * Now a post type with a paste-a-table winners field — the shape the club
 * already sends the winners in.
 *
 * Reads posts first and falls back to cc25_bond_draws_static(). So uploading
 * this theme changes nothing until a draw is entered, and a half-done migration
 * shows last month rather than an empty page.
 */
if (!defined('ABSPATH')) exit;

const CC25_BOND_CPT = 'cc25_bond_draw';
const CC25_BOND_COLS = array('no', 'prize', 'name', 'group');

add_action('init', function () {
    register_post_type(CC25_BOND_CPT, array(
        'labels' => array(
            'name'          => 'Bond Draws',
            'singular_name' => 'Bond Draw',
            'add_new_item'  => 'Add a Bond Draw',
            'edit_item'     => 'Edit Bond Draw',
            'menu_name'     => 'Bond Draws',
        ),
        'public'       => false,          // rendered by the Bond page, not its own URL
        'show_ui'      => true,
        'show_in_menu' => true,
        'menu_icon'    => 'dashicons-tickets-alt',
        'supports'     => array('title'),
        'capability_type' => 'post',      // Editors can manage them
        'map_meta_cap' => true,
    ));
});

add_action('add_meta_boxes', function () {
    add_meta_box('cc25_bond_draw', 'Draw details', 'cc25_bond_draw_metabox', CC25_BOND_CPT, 'normal', 'high');
});

function cc25_bond_draw_metabox($post) {
    wp_nonce_field('cc25_bond_save', 'cc25_bond_nonce');
    $date    = get_post_meta($post->ID, '_cc25_draw_date', true);
    $winners = get_post_meta($post->ID, '_cc25_draw_winners_raw', true);
    $parsed  = cc25_parse_table($winners, CC25_BOND_COLS);
    ?>
    <p><label><strong>Date of the draw</strong><br>
      <input type="date" name="cc25_draw_date" value="<?php echo esc_attr($date); ?>" style="max-width:220px">
    </label><br>
    <span style="color:#666;font-size:12px">This is what the page prints as &ldquo;Latest draw&rdquo;. Use the date the draw was actually made.</span></p>

    <p style="margin-bottom:4px"><strong>Winners</strong></p>
    <p style="color:#666;font-size:12px;margin-top:0">
      Paste the table straight in &mdash; one winner per line. Columns:
      <code>Bond No | Prize | Name | Payment Group</code>. A header row is fine, and
      a spreadsheet paste works as-is.
    </p>
    <textarea name="cc25_draw_winners" rows="9" style="width:100%;font-family:ui-monospace,Menlo,monospace;font-size:13px"
      placeholder="306 | £500 | Harri Pritchard | Youth Team&#10;62 | £50 | Stephen Fry | Walking Football"><?php
      echo esc_textarea($winners); ?></textarea>

    <?php // Echo back what was understood. Trusting a parser you can't see is how
          // a wrong table reaches the public page. ?>
    <?php if ($parsed): ?>
      <p style="margin:14px 0 6px"><strong><?php echo count($parsed); ?> winner<?php echo count($parsed) === 1 ? '' : 's'; ?> read from that:</strong></p>
      <table class="widefat striped" style="max-width:720px"><thead><tr>
        <th style="width:80px">No.</th><th style="width:120px">Prize</th><th>Name</th><th>Payment group</th>
      </tr></thead><tbody>
      <?php foreach ($parsed as $w): ?>
        <tr>
          <td><?php echo esc_html($w['no']); ?></td>
          <td><?php echo esc_html($w['prize']); ?></td>
          <td><?php echo esc_html($w['name']); ?></td>
          <td><?php echo esc_html($w['group']); ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody></table>
      <p style="color:#666;font-size:12px">If a column has landed in the wrong place, check the separators and save again.</p>
    <?php elseif (trim((string) $winners) !== ''): ?>
      <p style="color:#b32d2e;margin-top:12px"><strong>Nothing could be read from that.</strong>
      Each line needs its columns separated by <code>|</code> or by tabs &mdash; for example
      <code>306 | £500 | Harri Pritchard | Youth Team</code>.</p>
    <?php endif; ?>
    <?php
}

add_action('save_post_' . CC25_BOND_CPT, function ($id) {
    if (!isset($_POST['cc25_bond_nonce']) || !wp_verify_nonce($_POST['cc25_bond_nonce'], 'cc25_bond_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $id)) return;

    $date = sanitize_text_field(wp_unslash($_POST['cc25_draw_date'] ?? ''));
    // A date we can't read would break the "Latest draw" line, so keep the old one.
    if ($date === '' || preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        update_post_meta($id, '_cc25_draw_date', $date);
    }
    // Store the paste verbatim as well as the parse: if the parser is ever
    // improved, nobody has to retype anything.
    $raw = wp_unslash($_POST['cc25_draw_winners'] ?? '');
    update_post_meta($id, '_cc25_draw_winners_raw', sanitize_textarea_field($raw));
});

/** Draws from wp-admin, newest first, in the shape the Bond page expects.
 *  Returns none when there is no WordPress to ask — which is what the CLI tests
 *  are, and what lets the caller fall back to the hand-maintained list. */
function cc25_bond_draws_from_posts() {
    if (!function_exists('get_posts') || !function_exists('post_type_exists')) return array();
    if (!post_type_exists(CC25_BOND_CPT)) return array();
    $posts = get_posts(array('post_type' => CC25_BOND_CPT, 'post_status' => 'publish',
                             'numberposts' => -1, 'orderby' => 'meta_value', 'meta_key' => '_cc25_draw_date',
                             'order' => 'DESC'));
    $out = array();
    foreach ($posts as $p) {
        $date = get_post_meta($p->ID, '_cc25_draw_date', true);
        $rows = cc25_parse_table(get_post_meta($p->ID, '_cc25_draw_winners_raw', true), CC25_BOND_COLS);
        if (!$rows) continue;          // a draw with no readable winners is not a draw
        $winners = array();
        foreach ($rows as $r) {
            $winners[] = array(
                'no'    => (int) preg_replace('/\D/', '', $r['no']),
                'prize' => $r['prize'],
                'name'  => $r['name'],
                'group' => $r['group'],
            );
        }
        $out[] = array(
            'date'    => $date ?: get_the_date('Y-m-d', $p),
            'label'   => get_the_title($p) ?: cc25_bond_draw_label($date),
            'winners' => $winners,
        );
    }
    usort($out, function ($a, $b) { return strcmp($b['date'], $a['date']); });
    return $out;
}

/** "August 2026 Draw" from a date, so the title can be left blank. */
function cc25_bond_draw_label($date) {
    $t = $date ? strtotime($date) : false;
    return $t ? date_i18n('F Y', $t) . ' Draw' : 'Celtic Bond Draw';
}
