<?php
/**
 * Fixtures, kick-offs, postponements and results — one record per game.
 *
 * These were four hardcoded lists that all had to agree with each other:
 *
 *   cc25_static_fixtures()    the season's games
 *   cc25_kickoff_overrides()  confirmed times, keyed by date|opponent
 *   cc25_hidden_fixtures()    postponements, keyed by opponent + date
 *   a score on a fixture row  results
 *
 * They didn't always agree, and that caused a live bug: a called-off Risca game
 * showed on the homepage as "next home game" because the postponement lived in a
 * second list. One record with a STATUS cannot disagree with itself.
 *
 * Reads posts first, per team, and falls back to the hardcoded arrays. A team
 * with no fixture posts behaves exactly as it does today.
 */
if (!defined('ABSPATH')) exit;

const CC25_FX_CPT = 'cc25_fixture';

/** team key => label, in the order the club thinks about them — and the order
 *  the fixtures page renders them, which now reads this list.
 *
 *  These labels are trusted PHP literals, rendered as HTML *text nodes* by
 *  cc25_fx_esc_text() rather than esc_html() — see that function for why. If
 *  team labels are ever moved out of this literal array (e.g. into editable
 *  post meta, alongside the fixture-record migration in this file), that
 *  trust assumption breaks and they must be escaped as untrusted input. */
function cc25_fx_teams() {
    return array(
        'mens'       => "Men's First Team",
        'reserves'   => "Men's Reserves",
        'womens'     => "Women's First Team",
        'womens_res' => "Women's Reserves",
        'womens_u19' => "Women's Under-19s",
        'u18s'       => "Men's Under-18s",
        'vets'       => "Men's Vets",
    );
}

/** Presentation data the fixtures page needs per team, kept beside the team
 * registry so a new team is one entry in two places rather than a copied block.
 *  - squad_slugs: candidate page slugs for the team's squad page, first match wins
 *  - squad_label: the button's text; '' means the team has no squad page yet
 *
 *  Like the labels in cc25_fx_teams(), squad_label is a trusted PHP literal
 *  rendered via cc25_fx_esc_text(), not esc_html() — see that function. */
function cc25_fx_team_meta($key) {
    $meta = array(
        'mens'     => array('squad_slugs' => array('mens-team', 'mens-1st-team'),     'squad_label' => "Men's First Team squad"),
        'reserves' => array('squad_slugs' => array(),                                 'squad_label' => "Men's Reserves"),
        'womens'   => array('squad_slugs' => array('ladies-team', 'ladies-1st-team'), 'squad_label' => "Women's First Team squad"),
        'womens_res' => array('squad_slugs' => array(), 'squad_label' => ''),
        'womens_u19' => array('squad_slugs' => array(), 'squad_label' => ''),
        'u18s'     => array('squad_slugs' => array(), 'squad_label' => ''),
        'vets'     => array('squad_slugs' => array(),                                 'squad_label' => "Men's Vets squad"),
    );
    return isset($meta[$key]) ? $meta[$key] : array('squad_slugs' => array(), 'squad_label' => '');
}

/**
 * Where a team's squad button on the fixtures page points, or '' for a team
 * with no squad page.
 *
 * Teams with their own URL helper go through it rather than through the slug
 * lookup, because those helpers already answer the question the slug lookup
 * gets wrong: where to send someone when the WP page hasn't been created. The
 * generic lookup's answer is the home page, which reads as a broken link.
 *
 * This is also what keeps a team's button off another team's page. The rule
 * used to be implicit in the template — a label with no slugs fell through to
 * the Reserves — so the Reserves page was one empty array away from being any
 * new team's squad link.
 */
function cc25_fx_squad_url($key) {
    $meta = cc25_fx_team_meta($key);
    if ($meta['squad_label'] === '') return '';
    if ($key === 'reserves') return cc25_reserves_url();
    if ($key === 'vets')     return cc25_vets_url();
    return $meta['squad_slugs'] ? cc25_page_url($meta['squad_slugs'], home_url('/')) : '';
}

/** Escape text that is rendered inside an HTML element (a text node), not an
 * attribute — so, unlike esc_html() (which uses ENT_QUOTES), a straight
 * apostrophe does not need turning into &#039; to be safe. Still escapes
 * & < > so a stray one of those can never break the markup around it.
 *
 * Exists because the fixtures page's team/squad labels (see cc25_fx_teams(),
 * cc25_fx_team_meta()) are today trusted PHP literals that were always
 * rendered unescaped — the ENT_QUOTES form of esc_html() would silently
 * rewrite their apostrophes and change the page's rendered bytes for no
 * safety benefit. This still escapes them defensively for the day those
 * labels stop being literals. */
function cc25_fx_esc_text($s) {
    return htmlspecialchars((string) $s, ENT_NOQUOTES, 'UTF-8');
}

function cc25_fx_statuses() {
    return array(
        'scheduled' => 'Scheduled — still to play',
        'played'    => 'Played — show the score',
        'postponed' => 'Postponed — hide it from the site',
    );
}

add_action('init', function () {
    register_post_type(CC25_FX_CPT, array(
        'labels' => array(
            'name'          => 'Fixtures',
            'singular_name' => 'Fixture',
            'add_new_item'  => 'Add a Fixture',
            'edit_item'     => 'Edit Fixture',
            'menu_name'     => 'Fixtures',
        ),
        'public'          => false,      // rendered by the fixtures page, not its own URL
        'show_ui'         => true,
        'show_in_menu'    => true,
        'menu_icon'       => 'dashicons-calendar-alt',
        'supports'        => array('title'),
        'capability_type' => 'post',
        'map_meta_cap'    => true,
    ));
});

/* ---------------------------------------------------------------- editor UI */

add_action('add_meta_boxes', function () {
    add_meta_box('cc25_fx', 'Match details', 'cc25_fx_metabox', CC25_FX_CPT, 'normal', 'high');
});

function cc25_fx_metabox($post) {
    wp_nonce_field('cc25_fx_save', 'cc25_fx_nonce');
    $g = function ($k, $d = '') use ($post) {
        $v = get_post_meta($post->ID, '_cc25_fx_' . $k, true);
        return $v === '' ? $d : $v;
    };
    $team = $g('team', 'mens');
    $opp  = $g('opponent');
    $status = $g('status', 'scheduled');
    $crest = $opp !== '' && function_exists('cc25_opp_crest_file') ? cc25_opp_crest_file($opp) : '';
    ?>
    <style>
      .cc25fx{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 26px;max-width:820px}
      .cc25fx label{display:block;font-weight:600;margin-bottom:4px}
      .cc25fx input[type=text],.cc25fx input[type=date],.cc25fx input[type=time],.cc25fx select{width:100%}
      .cc25fx .hint{color:#666;font-weight:400;font-size:12px;margin:4px 0 0}
      .cc25fx-full{grid-column:1/-1}
      .cc25fx-score{display:flex;align-items:center;gap:10px}
      .cc25fx-score input{width:70px}
    </style>
    <div class="cc25fx">
      <div>
        <label for="cc25fx_team">Team</label>
        <select id="cc25fx_team" name="cc25_fx_team">
          <?php foreach (cc25_fx_teams() as $k => $l): ?>
            <option value="<?php echo esc_attr($k); ?>"<?php selected($team, $k); ?>><?php echo esc_html($l); ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <div>
        <label for="cc25fx_status">Status</label>
        <select id="cc25fx_status" name="cc25_fx_status">
          <?php foreach (cc25_fx_statuses() as $k => $l): ?>
            <option value="<?php echo esc_attr($k); ?>"<?php selected($status, $k); ?>><?php echo esc_html($l); ?></option>
          <?php endforeach; ?>
        </select>
        <p class="hint">Postponed games disappear from the site until you give them a new date &mdash; no need to delete anything.</p>
      </div>

      <div>
        <label for="cc25fx_date">Date</label>
        <input type="date" id="cc25fx_date" name="cc25_fx_date" value="<?php echo esc_attr($g('date')); ?>">
      </div>
      <div>
        <label for="cc25fx_ko">Kick-off</label>
        <input type="time" id="cc25fx_ko" name="cc25_fx_ko" value="<?php echo esc_attr($g('ko')); ?>">
        <p class="hint">Leave blank and the usual time for that day is used &mdash; 2:30pm Saturday, 2:00pm Sunday, 7:30pm midweek. Fill it in whenever you know the real time.</p>
      </div>

      <div>
        <label for="cc25fx_opponent">Opponent</label>
        <input type="text" id="cc25fx_opponent" name="cc25_fx_opponent" value="<?php echo esc_attr($opp); ?>" list="cc25fx_opps" autocomplete="off">
        <datalist id="cc25fx_opps">
          <?php foreach (cc25_fx_known_opponents() as $o): ?><option value="<?php echo esc_attr($o); ?>"></option><?php endforeach; ?>
        </datalist>
        <?php if ($opp !== ''): ?>
          <p class="hint"><?php echo $crest
            ? '&#10003; Badge found: <code>' . esc_html($crest) . '</code>'
            : '&#9888; <strong>No badge for this name.</strong> Pick the spelling from the list if the club is already there, or ask for the badge to be added.'; ?></p>
        <?php else: ?>
          <p class="hint">Start typing &mdash; the clubs we already have badges for will suggest themselves.</p>
        <?php endif; ?>
      </div>
      <div>
        <label>Venue</label>
        <label style="font-weight:400"><input type="radio" name="cc25_fx_home" value="1" <?php checked($g('home', '1'), '1'); ?>> Home &mdash; Motazone Arena</label>
        <label style="font-weight:400"><input type="radio" name="cc25_fx_home" value="0" <?php checked($g('home', '1'), '0'); ?>> Away</label>
      </div>

      <div>
        <label for="cc25fx_comp">Competition</label>
        <input type="text" id="cc25fx_comp" name="cc25_fx_comp" value="<?php echo esc_attr($g('comp', 'League')); ?>" list="cc25fx_comps">
        <datalist id="cc25fx_comps">
          <?php foreach (array('League', 'Welsh Cup QR2', 'League Cup R1', 'League Cup R2', 'Amateur Trophy QR2') as $c): ?>
            <option value="<?php echo esc_attr($c); ?>"></option>
          <?php endforeach; ?>
        </datalist>
      </div>
      <div class="cc25fx-full">
        <label for="cc25fx_tickets">Ticket link</label>
        <input type="url" id="cc25fx_tickets" name="cc25_fx_tickets" value="<?php echo esc_attr($g('tickets')); ?>"
               placeholder="https://cwmbranceltic.gigantic.com/cwmbran-celtic-tickets/...">
        <p class="hint">The Gigantic page for <strong>this game</strong>. Every Buy Tickets button for it
          &mdash; the fixtures list, the home page, the matchday takeover &mdash; then goes straight there
          instead of the general listing. Leave it blank and they fall back to the club's promoter page,
          and the dashboard will tell you it is missing.
          <?php if ($g('home', '1') === '0'): ?><br><strong>This is an away game</strong>, so no ticket
          link is shown even if you enter one.<?php endif; ?></p>
      </div>
      <div>
        <label>Score</label>
        <div class="cc25fx-score">
          <span>Cwmbran Celtic</span>
          <input type="number" min="0" max="99" name="cc25_fx_us" value="<?php echo esc_attr($g('us')); ?>">
          <span>&ndash;</span>
          <input type="number" min="0" max="99" name="cc25_fx_them" value="<?php echo esc_attr($g('them')); ?>">
          <span>Opponent</span>
        </div>
        <p class="hint">Our score first, home or away. Only used once the status is <em>Played</em>.</p>
      </div>
    </div>
    <?php
}

/** Every opponent we already hold a badge for, so the editor guides to the
 *  spelling that resolves rather than inventing a new one. */
function cc25_fx_known_opponents() {
    $names = array();
    if (function_exists('cc25_static_fixtures')) {
        foreach (cc25_static_fixtures() as $t) {
            foreach ($t['list'] as $r) {
                if (!empty($r[1]) && $r[1] !== 'TBC') $names[$r[1]] = 1;
            }
        }
    }
    $names = array_keys($names);
    sort($names);
    return $names;
}

add_action('save_post_' . CC25_FX_CPT, function ($id) {
    if (!isset($_POST['cc25_fx_nonce']) || !wp_verify_nonce($_POST['cc25_fx_nonce'], 'cc25_fx_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $id)) return;

    $team = isset($_POST['cc25_fx_team']) ? sanitize_key($_POST['cc25_fx_team']) : 'mens';
    if (!isset(cc25_fx_teams()[$team])) $team = 'mens';
    $status = isset($_POST['cc25_fx_status']) ? sanitize_key($_POST['cc25_fx_status']) : 'scheduled';
    if (!isset(cc25_fx_statuses()[$status])) $status = 'scheduled';

    $date = sanitize_text_field(wp_unslash($_POST['cc25_fx_date'] ?? ''));
    if ($date !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) $date = get_post_meta($id, '_cc25_fx_date', true);
    $ko = sanitize_text_field(wp_unslash($_POST['cc25_fx_ko'] ?? ''));
    // A time we can't read must not silently become midnight — drop back to blank
    // so the day-of-week default applies instead.
    if ($ko !== '' && !preg_match('/^\d{2}:\d{2}$/', $ko)) $ko = '';

    $meta = array(
        'team'     => $team,
        'status'   => $status,
        'date'     => $date,
        'ko'       => $ko,
        'opponent' => sanitize_text_field(wp_unslash($_POST['cc25_fx_opponent'] ?? '')),
        'home'     => (isset($_POST['cc25_fx_home']) && $_POST['cc25_fx_home'] === '0') ? '0' : '1',
        'comp'     => sanitize_text_field(wp_unslash($_POST['cc25_fx_comp'] ?? '')) ?: 'League',
        'us'       => ($_POST['cc25_fx_us'] ?? '') === '' ? '' : (string) max(0, (int) $_POST['cc25_fx_us']),
        'them'     => ($_POST['cc25_fx_them'] ?? '') === '' ? '' : (string) max(0, (int) $_POST['cc25_fx_them']),
        // esc_url_raw, so a pasted address that is not a URL is not stored as one.
        'tickets'  => esc_url_raw(trim((string) wp_unslash($_POST['cc25_fx_tickets'] ?? ''))),
    );
    foreach ($meta as $k => $v) update_post_meta($id, '_cc25_fx_' . $k, $v);

    // Title is only ever seen in wp-admin, so write a useful one rather than
    // making someone think of it.
    $auto = trim(($meta['home'] === '1' ? 'Cwmbran Celtic v ' . $meta['opponent']
                                        : $meta['opponent'] . ' v Cwmbran Celtic'));
    if ($meta['date']) $auto .= ' — ' . date_i18n('j M Y', strtotime($meta['date']));
    $post = get_post($id);
    if ($post && ($post->post_title === '' || strpos($post->post_title, 'Auto Draft') === 0 || $post->post_title === 'Fixture')) {
        remove_action('save_post_' . CC25_FX_CPT, __FUNCTION__);
        wp_update_post(array('ID' => $id, 'post_title' => $auto));
    }
});

/* ------------------------------------------------- a usable admin list view */

add_filter('manage_' . CC25_FX_CPT . '_posts_columns', function ($cols) {
    return array(
        'cb'        => $cols['cb'],
        'cc25date'  => 'Date',
        'cc25team'  => 'Team',
        'title'     => 'Match',
        'cc25comp'  => 'Competition',
        'cc25stat'  => 'Status',
    );
});
add_action('manage_' . CC25_FX_CPT . '_posts_custom_column', function ($col, $id) {
    $g = function ($k) use ($id) { return get_post_meta($id, '_cc25_fx_' . $k, true); };
    if ($col === 'cc25date') {
        $d = $g('date');
        echo $d ? esc_html(date_i18n('D j M Y', strtotime($d))) . ($g('ko') ? ' &middot; ' . esc_html($g('ko')) : '') : '&mdash;';
    } elseif ($col === 'cc25team') {
        $t = cc25_fx_teams();
        echo esc_html($t[$g('team')] ?? $g('team'));
    } elseif ($col === 'cc25comp') {
        echo esc_html($g('comp')) . ' &middot; ' . ($g('home') === '0' ? 'Away' : 'Home');
    } elseif ($col === 'cc25stat') {
        $s = $g('status');
        $us = $g('us'); $them = $g('them');
        if ($s === 'played' && $us !== '' && $them !== '') {
            echo '<strong>' . intval($us) . '&ndash;' . intval($them) . '</strong>';
        } else {
            echo esc_html(ucfirst($s ?: 'scheduled'));
        }
    }
}, 10, 2);
add_filter('manage_edit-' . CC25_FX_CPT . '_sortable_columns', function ($c) {
    $c['cc25date'] = 'cc25date';
    return $c;
});
add_action('pre_get_posts', function ($q) {
    if (!is_admin() || !$q->is_main_query() || $q->get('post_type') !== CC25_FX_CPT) return;
    if ($q->get('orderby') === '' || $q->get('orderby') === 'cc25date') {
        $q->set('meta_key', '_cc25_fx_date');
        $q->set('orderby', 'meta_value');
        $q->set('order', $q->get('order') ?: 'ASC');
    }
});

/* ------------------------------------------------------------ reading posts */

/** Every fixture post, normalised. Memoised — several readers derive from this
 *  and one query is enough. Returns none without WordPress, which is what lets
 *  the callers fall back to the hardcoded arrays. */
function cc25_fx_posts() {
    static $cache = null;
    if ($cache !== null) return $cache;
    if (!function_exists('get_posts') || !function_exists('post_type_exists')) return $cache = array();
    if (!post_type_exists(CC25_FX_CPT)) return $cache = array();
    $out = array();
    foreach (get_posts(array('post_type' => CC25_FX_CPT, 'post_status' => 'publish', 'numberposts' => -1)) as $p) {
        $g = function ($k) use ($p) { return get_post_meta($p->ID, '_cc25_fx_' . $k, true); };
        $date = $g('date');
        $opp  = trim((string) $g('opponent'));
        if (!$date || $opp === '') continue;      // not enough to be a fixture
        $out[] = array(
            'id'       => $p->ID,
            'team'     => $g('team') ?: 'mens',
            'date'     => $date,
            'ko'       => $g('ko'),
            'opponent' => $opp,
            'home'     => $g('home') !== '0',
            'comp'     => $g('comp') ?: 'League',
            'status'   => $g('status') ?: 'scheduled',
            'us'       => $g('us'),
            'them'     => $g('them'),
            'tickets'  => $g('tickets'),
        );
    }
    usort($out, function ($a, $b) { return strcmp($a['date'], $b['date']); });
    return $cache = $out;
}

/** A fixture post as a hand-maintained row: [date, opponent, home, comp, score?]. */
function cc25_fx_to_row($f) {
    $row = array($f['date'], $f['opponent'], $f['home'], $f['comp']);
    if ($f['status'] === 'played' && $f['us'] !== '' && $f['them'] !== '') {
        $row[4] = array((int) $f['us'], (int) $f['them']);
    }
    return $row;
}

/**
 * Swap a team's hand-maintained list for its admin records — per team, so a
 * half-finished migration never shows a partial season. A team with no records
 * keeps its list whole.
 *
 * Pure, so the substitution rule can be tested without a database.
 *
 * @param array $static  team key => array with a 'list'
 * @param array $rows    team key => rows from the admin
 */
function cc25_fx_merge_lists($static, $rows) {
    foreach ($static as $team => $data) {
        if (empty($rows[$team]) || !is_array($rows[$team])) continue;
        $list = (isset($data['list']) && is_array($data['list'])) ? array_values($data['list']) : array();
        foreach ($rows[$team] as $record) {
            $at = cc25_fx_match_row($list, $record);
            if ($at === null) $list[] = $record;
            else              $list[$at] = $record;
        }
        // Ascending by date, the order the hardcoded lists are already written in
        // and the one cc25_render_static_fixtures walks to place its month labels.
        // cc25_static_results re-sorts newest-first for itself.
        usort($list, function ($a, $b) { return strcmp((string) ($a[0] ?? ''), (string) ($b[0] ?? '')); });
        $static[$team]['list'] = $list;
    }
    return $static;
}

/**
 * Where in $list an admin record belongs, or null for a game not in the list.
 *
 * "The same game" is the same opponent at the same venue on the same date —
 * opponent alone is not enough, because a league season plays everyone twice,
 * and date alone is not enough, because two teams can be out on one Saturday.
 *
 * A record whose date has MOVED still has to find its original row, or the site
 * would show the game twice: once on the old date from the hardcoded list and
 * once on the new one. So a near miss counts, using the same ten-day tolerance
 * cc25_fixture_hidden and cc25_results already apply to a re-dated game. Beyond
 * ten days it is treated as a genuinely different fixture, which is that rule's
 * existing meaning, not a new one invented here.
 */
function cc25_fx_match_row($list, $record) {
    $date = (string) ($record[0] ?? '');
    $opp  = cc25_norm_team($record[1] ?? '');
    $home = !empty($record[2]);
    $near = null;

    foreach ($list as $i => $row) {
        if (cc25_norm_team($row[1] ?? '') !== $opp) continue;
        if (!empty($row[2]) !== $home) continue;
        if ((string) ($row[0] ?? '') === $date) return $i;      // exact game
        $a = strtotime((string) ($row[0] ?? ''));
        $b = strtotime($date);
        if ($near === null && $a && $b && abs($a - $b) <= 10 * 86400) $near = $i;
    }
    return $near;
}

/** Confirmed kick-offs from the admin, as date|opponent => HH:MM. Merged over
 *  the hardcoded map so an unmigrated team keeps its times. */
function cc25_fx_kickoffs_from_posts() {
    $out = array();
    foreach (cc25_fx_posts() as $f) {
        if ($f['ko'] === '') continue;
        $out[$f['date'] . '|' . $f['opponent']] = $f['ko'];
    }
    return $out;
}

/** Postponements from the admin, as [opponent, date] pairs. */
function cc25_fx_hidden_from_posts() {
    $out = array();
    foreach (cc25_fx_posts() as $f) {
        if ($f['status'] === 'postponed') $out[] = array($f['opponent'], $f['date']);
    }
    return $out;
}

/* ---------------------------------------------------------------- importing */

add_action('admin_menu', function () {
    add_submenu_page('edit.php?post_type=' . CC25_FX_CPT, 'Import fixtures', 'Import from theme',
        'manage_options', 'cc25-fx-import', 'cc25_fx_import_screen');
});

function cc25_fx_import_screen() {
    if (!current_user_can('manage_options')) wp_die('Not allowed');
    $done = null;
    if (isset($_POST['cc25_fx_import']) && check_admin_referer('cc25_fx_import')) {
        $done = cc25_fx_import_run();
    }
    $have = count(cc25_fx_posts());
    echo '<div class="wrap"><h1>Import fixtures from the theme</h1>';
    echo '<p>The season&rsquo;s fixtures, confirmed kick-off times, postponements and results are currently written into the theme. '
       . 'This copies them in as Fixture records so they can be edited here instead. Nobody needs to retype anything.</p>';
    echo '<p>Running it twice is safe &mdash; a game that already exists is skipped, not duplicated.</p>';
    if ($done) {
        echo '<div class="notice notice-success"><p><strong>Imported ' . intval($done['created']) . ' fixtures</strong>'
           . ($done['skipped'] ? ', skipped ' . intval($done['skipped']) . ' already here' : '') . '.</p></div>';
    }
    echo '<p><strong>Fixture records right now: ' . intval($have) . '</strong></p>';
    echo '<form method="post">';
    wp_nonce_field('cc25_fx_import');
    echo '<p><button class="button button-primary" name="cc25_fx_import" value="1">Import from the theme</button></p>';
    echo '</form></div>';
}

/** Create fixture posts from the hardcoded arrays. Idempotent. */
function cc25_fx_import_run() {
    $created = $skipped = 0;
    // The hardcoded lists, not the posts-first readers — otherwise a partial
    // import would start importing from itself.
    $lists = function_exists('cc25_static_fixtures_static') ? cc25_static_fixtures_static() : array();
    $kick  = function_exists('cc25_kickoff_overrides_static') ? cc25_kickoff_overrides_static() : array();
    $hidden = function_exists('cc25_hidden_fixtures_static') ? cc25_hidden_fixtures_static() : array();

    $existing = array();
    foreach (cc25_fx_posts() as $f) {
        $existing[$f['team'] . '|' . $f['date'] . '|' . cc25_norm_team($f['opponent'])] = true;
    }

    foreach ($lists as $team => $data) {
        foreach ($data['list'] as $r) {
            $date = $r[0]; $opp = $r[1];
            if ($opp === '' ) continue;
            $key = $team . '|' . $date . '|' . cc25_norm_team($opp);
            if (isset($existing[$key])) { $skipped++; continue; }

            // Kick-off: the opponent-scoped override wins, then the whole-day one.
            $ko = '';
            if (isset($kick[$date . '|' . $opp])) $ko = $kick[$date . '|' . $opp];
            else {
                foreach ($kick as $k => $v) {
                    $p = explode('|', $k, 2);
                    if (count($p) === 2 && $p[0] === $date && cc25_norm_team($p[1]) === cc25_norm_team($opp)) { $ko = $v; break; }
                }
                if ($ko === '' && isset($kick[$date])) $ko = $kick[$date];
            }

            $status = 'scheduled';
            foreach ($hidden as $h) {
                if (cc25_norm_team($h[0]) === cc25_norm_team($opp) && $h[1] === $date) { $status = 'postponed'; break; }
            }
            $score = function_exists('cc25_row_score') ? cc25_row_score($r) : null;
            if ($score) $status = 'played';

            $home = !empty($r[2]);
            $title = ($home ? 'Cwmbran Celtic v ' . $opp : $opp . ' v Cwmbran Celtic')
                   . ' — ' . date_i18n('j M Y', strtotime($date));
            $id = wp_insert_post(array(
                'post_type' => CC25_FX_CPT, 'post_status' => 'publish', 'post_title' => $title,
            ));
            if (!$id || is_wp_error($id)) continue;
            $meta = array('team' => $team, 'date' => $date, 'ko' => $ko, 'opponent' => $opp,
                          'home' => $home ? '1' : '0', 'comp' => (isset($r[3]) && $r[3] !== '') ? $r[3] : 'League',
                          'status' => $status,
                          'us' => $score ? (string) $score[0] : '', 'them' => $score ? (string) $score[1] : '');
            foreach ($meta as $k => $v) update_post_meta($id, '_cc25_fx_' . $k, $v);
            $created++;
            $existing[$key] = true;
        }
    }
    // The memo is stale now that rows have been written.
    return array('created' => $created, 'skipped' => $skipped);
}
