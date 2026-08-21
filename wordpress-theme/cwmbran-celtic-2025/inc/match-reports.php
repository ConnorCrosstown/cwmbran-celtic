<?php
/**
 * Match reports the club writes themselves.
 *
 * A report is an ordinary post in the "report" category with one extra field:
 * which game it is about. Everything factual — teams, date, score, competition —
 * is read from the fixture, so a report cannot contradict the results page. The
 * club supplies the things only a person has: scorers, attendance, the words and
 * the photos.
 *
 * A post rather than a custom type, because a report IS editorial: it wants the
 * normal editor, a featured image, galleries and a place in the news flow. That
 * is the same choice programmes and galleries already make.
 */
if (!defined('ABSPATH')) exit;

/* ---------------------------------------------------------------- editor UI */

add_action('add_meta_boxes', function () {
    add_meta_box('cc25_mr', 'Match report &amp; sponsor', 'cc25_mr_metabox', 'post', 'side', 'high');
});

function cc25_mr_metabox($post) {
    wp_nonce_field('cc25_mr_save', 'cc25_mr_nonce');
    $sel  = get_post_meta($post->ID, '_cc25_mr_game', true);
    $sc   = get_post_meta($post->ID, '_cc25_mr_scorers', true);
    $att  = get_post_meta($post->ID, '_cc25_mr_attendance', true);
    $spon = get_post_meta($post->ID, '_cc25_sponsor', true);
    $games = cc25_mr_recent_games();
    ?>
    <p><label for="cc25mr_game"><strong>Which game?</strong></label><br>
      <select id="cc25mr_game" name="cc25_mr_game" style="width:100%">
        <option value="">&mdash; not a match report &mdash;</option>
        <?php foreach ($games as $key => $label): ?>
          <option value="<?php echo esc_attr($key); ?>"<?php selected($sel, $key); ?>><?php echo esc_html($label); ?></option>
        <?php endforeach; ?>
      </select>
    </p>
    <p style="color:#666;font-size:11px;margin-top:-6px">Pick the game and the score, teams and competition are taken from the fixture &mdash; no need to type them, and they can&rsquo;t end up disagreeing with the results page.</p>

    <p><label for="cc25mr_scorers"><strong>Scorers</strong></label><br>
      <input type="text" id="cc25mr_scorers" name="cc25_mr_scorers" value="<?php echo esc_attr($sc); ?>" style="width:100%"
             placeholder="Wood; Berry (pen); Griffiths"></p>
    <p><label for="cc25mr_att"><strong>Attendance</strong></label><br>
      <input type="number" min="0" id="cc25mr_att" name="cc25_mr_attendance" value="<?php echo esc_attr($att); ?>" style="width:120px"></p>

    <?php // Every post carries a sponsor block, not just match reports — a news
          // story uses this field too. The main sponsor is offered alongside the
          // roster so a slot can be sold to Motazone like any other.
          $spx_choices = array_merge(array(cc25_sponsor_main()), cc25_sponsors()); ?>
    <p><label for="cc25mr_sponsor"><strong>Sponsored by</strong></label><br>
      <select id="cc25mr_sponsor" name="cc25_sponsor" style="width:100%">
        <option value="" data-banner="">&mdash; not sold, rotate sponsors &mdash;</option>
        <?php foreach ($spx_choices as $s): ?>
          <option value="<?php echo esc_attr($s['slug']); ?>"
                  data-banner="<?php echo esc_url(cc25_sponsor_url($s['file'])); ?>"
                  <?php selected($spon, $s['slug']); ?>><?php echo esc_html($s['name']); ?></option>
        <?php endforeach; ?>
      </select></p>
    <?php // The banner, not just the name — picking a sponsor is picking the image
          // that will appear in the article, so show it. ?>
    <p id="cc25mr_sponsor_preview" style="margin-top:-4px<?php echo $spon ? '' : ';display:none'; ?>">
      <img src="" alt="" style="max-width:100%;height:auto;border:1px solid #dcdcde;border-radius:4px;background:#0a1f3c"></p>
    <script>
    (function () {
        var sel = document.getElementById('cc25mr_sponsor');
        var box = document.getElementById('cc25mr_sponsor_preview');
        if (!sel || !box) return;
        var img = box.querySelector('img');
        function show() {
            var src = sel.options[sel.selectedIndex].getAttribute('data-banner') || '';
            img.src = src;
            img.alt = src ? sel.options[sel.selectedIndex].text + ' banner' : '';
            box.style.display = src ? '' : 'none';
        }
        sel.addEventListener('change', show);
        show();
    })();
    </script>
    <p style="color:#666;font-size:11px;margin-top:-6px">Leave this alone unless the slot has been sold &mdash; unsold, the post picks its own sponsor and a different post shows a different one. This field applies to <b>any</b> post, not just match reports.</p>

    <p style="color:#666;font-size:11px;margin:0">Set the category to <b>Report</b>, add a <b>Featured Image</b>, and write the report in the main editor. Photos go in as a normal gallery.</p>
    <?php
}

/** Games worth attaching a report to: played or upcoming, most recent first.
 *  Keyed "team|date" so the report survives a fixture being edited. */
function cc25_mr_recent_games() {
    if (!function_exists('cc25_static_fixtures')) return array();
    $teams = function_exists('cc25_fx_teams') ? cc25_fx_teams()
           : array('mens' => "Men's First Team", 'reserves' => "Men's Reserves", 'womens' => "Women's First Team");
    $now = time();
    $rows = array();
    foreach (cc25_static_fixtures() as $team => $data) {
        foreach ($data['list'] as $r) {
            if (empty($r[1]) || $r[1] === 'TBC') continue;
            $t = strtotime($r[0]);
            // Anything already played, plus the next fortnight — a report is
            // written after the game, so the list leads with the newest.
            if ($t > $now + 14 * 86400) continue;
            $rows[] = array('sort' => $t, 'key' => $team . '|' . $r[0], 'label' => sprintf(
                '%s — %s %s (%s)',
                date_i18n('j M Y', $t),
                (!empty($r[2]) ? 'v ' : 'away at '), $r[1],
                $teams[$team] ?? $team
            ));
        }
    }
    usort($rows, function ($a, $b) { return $b['sort'] <=> $a['sort']; });
    $out = array();
    foreach ($rows as $r) $out[$r['key']] = $r['label'];
    return $out;
}

add_action('save_post_post', function ($id) {
    if (!isset($_POST['cc25_mr_nonce']) || !wp_verify_nonce($_POST['cc25_mr_nonce'], 'cc25_mr_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $id)) return;
    $game = sanitize_text_field(wp_unslash($_POST['cc25_mr_game'] ?? ''));
    // Only accept a key we actually offered, so a stale form can't attach a
    // report to a game that no longer exists.
    if ($game !== '' && !isset(cc25_mr_recent_games()[$game])) $game = get_post_meta($id, '_cc25_mr_game', true);
    update_post_meta($id, '_cc25_mr_game', $game);
    update_post_meta($id, '_cc25_mr_scorers', sanitize_text_field(wp_unslash($_POST['cc25_mr_scorers'] ?? '')));
    $att = $_POST['cc25_mr_attendance'] ?? '';
    update_post_meta($id, '_cc25_mr_attendance', $att === '' ? '' : (string) max(0, (int) $att));
    // Only accept a slug we actually offered, so a stale form cannot attach a
    // sponsor who no longer exists.
    $spon = sanitize_text_field(wp_unslash($_POST['cc25_sponsor'] ?? ''));
    if ($spon !== '' && !cc25_sponsor_by_slug($spon)) $spon = '';
    update_post_meta($id, '_cc25_sponsor', $spon);
});

/* ----------------------------------------------------- keeping prose on-brand
 * The report body is the normal editor, because prose should be prose. What
 * cannot be allowed in is formatting pasted out of Word — inline styles, font
 * tags and colours that override the theme. Stripped on save rather than hidden
 * with CSS, so the stored content is clean too. */

/**
 * Remove formatting a paste carries with it, keeping the markup that means
 * something. Named rather than a closure so the tests exercise this exact code
 * instead of a copy of the patterns, which would pass even if this broke.
 */
function cc25_strip_pasted_formatting($content) {
    if (!is_string($content) || $content === '') return $content;
    // Inline style/colour/face attributes, and <font> wrappers.
    $content = preg_replace('/\s(style|color|face|bgcolor)\s*=\s*("[^"]*"|\'[^\']*\')/i', '', $content);
    $content = preg_replace('#</?font[^>]*>#i', '', $content);
    // Word leaves class="MsoNormal" and friends behind.
    $content = preg_replace('/\sclass\s*=\s*("|\')(Mso[^"\']*|[^"\']*\bMso[^"\']*)("|\')/i', '', $content);
    return $content;
}
add_filter('content_save_pre', 'cc25_strip_pasted_formatting', 20);

/* ------------------------------------------------------------------ readers */

/** The report post for a game, or null. */
function cc25_report_for($team, $ymd) {
    if (!function_exists('get_posts')) return null;
    static $cache = null;
    if ($cache === null) {
        $cache = array();
        foreach (get_posts(array('post_type' => 'post', 'post_status' => 'publish', 'numberposts' => -1,
                                 'meta_key' => '_cc25_mr_game', 'meta_compare' => 'EXISTS')) as $p) {
            $k = get_post_meta($p->ID, '_cc25_mr_game', true);
            if ($k !== '' && !isset($cache[$k])) $cache[$k] = $p;
        }
    }
    return $cache[$team . '|' . $ymd] ?? null;
}

/** True when this post is a match report the theme should decorate. */
function cc25_is_report_post($post = null) {
    $post = get_post($post);
    if (!$post || $post->post_type !== 'post') return false;
    return trim((string) get_post_meta($post->ID, '_cc25_mr_game', true)) !== '';
}

/** The fixture a report is about, as [team, ymd], or null. */
function cc25_report_game($post = null) {
    $post = get_post($post);
    if (!$post) return null;
    $k = (string) get_post_meta($post->ID, '_cc25_mr_game', true);
    if (strpos($k, '|') === false) return null;
    list($team, $ymd) = explode('|', $k, 2);
    return array($team, $ymd);
}

/**
 * What a match has attached to it: a written report, the match centre, and/or a
 * programme.
 *
 * Both the fixtures page and the results panels ask this, so "is there something
 * to click for this game" is answered in one place rather than three.
 *
 * 'report' and 'centre' are two different pages and both are offered when both
 * exist. They used to be one slot with the article winning, which meant that
 * publishing a news article about a game *hid* that game's line-ups, goal
 * timeline, stats and officials — the article became the only way in, and the
 * match centre could not be reached from the results row at all. A reader who
 * wants the words and a reader who wants the numbers are not the same reader.
 *
 * @return array{report:string, centre:string, programme:string} URLs, '' when absent
 */
function cc25_match_links($team, $ymd) {
    $out = array('report' => '', 'centre' => '', 'programme' => '');
    $r = function_exists('cc25_report_for') ? cc25_report_for($team, $ymd) : null;
    if ($r) $out['report'] = get_permalink($r);
    if (function_exists('cc25_match_report_url')) $out['centre'] = cc25_match_report_url($ymd, $team);
    if (function_exists('cc25_programme_for_date')) {
        $p = cc25_programme_for_date($ymd);
        if ($p) $out['programme'] = cc25_programme_read_url($p->ID);
    }
    return $out;
}

/** The programme published for a match date, or null. Programmes are dated to
 *  the game, which is what makes matching on date safe. */
function cc25_programme_for_date($ymd) {
    if (!function_exists('get_posts') || !$ymd) return null;
    static $cache = null;
    if ($cache === null) {
        $cache = array();
        foreach (get_posts(array('post_type' => 'post', 'post_status' => 'publish', 'numberposts' => -1,
                                 'category_name' => cc25_programme_category())) as $p) {
            $cache[get_the_date('Y-m-d', $p)] = $p;
        }
    }
    return $cache[$ymd] ?? null;
}
