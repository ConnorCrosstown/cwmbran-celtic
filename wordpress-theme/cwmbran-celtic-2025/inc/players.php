<?php
/**
 * Squads, entered in wp-admin instead of in this theme.
 *
 * Four squads used to live in functions.php as arrays, in three shapes: the men's
 * grouped by position and carrying a card-image slug, the Reserves name and
 * position, the Vets with FAW registration numbers, the U18s empty and waiting. A
 * player joining or leaving meant a code change and a theme upload.
 *
 * Same shape as cc25_people(): posts if there are any, the list in the theme if
 * there are not. Uploading the theme changes nothing until someone is entered.
 *
 * A team's posts REPLACE that team's list rather than merging into it. Merging
 * cannot delete anybody, and taking a player off the site is most of the point.
 * The trade is that a half-entered squad is the squad — so there is an importer
 * that seeds the whole thing from the theme in one go.
 *
 * NOT the women's first team: that page reads SportsPress, which holds four
 * seasons of history and is a separate job.
 */
if (!defined('ABSPATH')) exit;

const CC25_PLAYER_CPT = 'cc25_player';

/** The squads this handles, and the function each falls back to. */
function cc25_squad_teams() {
    return array(
        'mens'     => array('label' => "Men's First Team", 'grouped' => true,  'fallback' => 'cc25_squad_players_static'),
        'reserves' => array('label' => "Men's Reserves",   'grouped' => false, 'fallback' => 'cc25_reserves_squad_static'),
        'u18s'     => array('label' => "Men's Under-18s",  'grouped' => false, 'fallback' => 'cc25_u18s_squad_static'),
        'vets'     => array('label' => 'Veterans',         'grouped' => false, 'fallback' => 'cc25_vets_squad_static'),
    );
}

/** The position groups the men's page prints, in order. */
function cc25_squad_groups() {
    return array('Management', 'Goalkeeper', 'Defenders', 'Midfielders', 'Forwards');
}

/* ----------------------------------------------------------------- reading */

/**
 * One team's players as entered in wp-admin, or [] if none are.
 *
 * Flat records: name, no, pos, group, slug, id. Each squad uses the fields it
 * needs and ignores the rest.
 */
function cc25_squad_from_posts($team) {
    if (!function_exists('get_posts') || !function_exists('post_type_exists')) return array();
    if (!post_type_exists(CC25_PLAYER_CPT)) return array();
    $posts = get_posts(array(
        'post_type' => CC25_PLAYER_CPT, 'post_status' => 'publish', 'numberposts' => -1,
        'orderby' => array('menu_order' => 'ASC', 'title' => 'ASC'),
    ));
    $out = array();
    foreach ($posts as $p) {
        $id = is_object($p) ? $p->ID : (int) $p;
        if ((string) get_post_meta($id, '_cc25_player_team', true) !== $team) continue;
        $name = trim((string) get_the_title($p));
        if ($name === '') continue;
        $no = trim((string) get_post_meta($id, '_cc25_player_no', true));
        $out[] = array(
            'name'  => $name,
            'no'    => $no === '' ? '' : (int) $no,
            'pos'   => trim((string) get_post_meta($id, '_cc25_player_pos', true)),
            'group' => trim((string) get_post_meta($id, '_cc25_player_group', true)),
            'slug'  => trim((string) get_post_meta($id, '_cc25_player_slug', true)),
            'id'    => trim((string) get_post_meta($id, '_cc25_player_reg', true)),
        );
    }
    return $out;
}

/** True when this team is being run from wp-admin rather than from the theme. */
function cc25_squad_is_managed($team) {
    return (bool) cc25_squad_from_posts($team);
}

/* ------------------------------------------ the four squads, as before but live */

/** The men's first team, grouped by position, [name, card-slug] per player. */
function cc25_squad_players() {
    $rows = cc25_squad_from_posts('mens');
    if (!$rows) return cc25_squad_players_static();
    $out = array();
    foreach (cc25_squad_groups() as $g) {           // the order the page prints
        foreach ($rows as $r) {
            if ($r['group'] !== $g) continue;
            $out[$g][] = array($r['name'], $r['slug']);
        }
    }
    // Anyone filed under a group that no longer exists still belongs on the page.
    foreach ($rows as $r) {
        if (in_array($r['group'], cc25_squad_groups(), true)) continue;
        $out[$r['group'] !== '' ? $r['group'] : 'Squad'][] = array($r['name'], $r['slug']);
    }
    return $out;
}

function cc25_reserves_squad() {
    $rows = cc25_squad_from_posts('reserves');
    if (!$rows) return cc25_reserves_squad_static();
    // 'no' is carried even though the hardcoded list has never had one: the page
    // already prints a shirt number when a player has one, so entering one in
    // wp-admin should show it rather than be quietly dropped here.
    return array_map(function ($r) {
        return array('no' => $r['no'], 'name' => $r['name'], 'pos' => $r['pos']);
    }, $rows);
}

function cc25_u18s_squad() {
    $rows = cc25_squad_from_posts('u18s');
    if (!$rows) return cc25_u18s_squad_static();
    return array_map(function ($r) {
        return array('no' => $r['no'], 'name' => $r['name'], 'pos' => $r['pos']);
    }, $rows);
}

function cc25_vets_squad() {
    $rows = cc25_squad_from_posts('vets');
    if (!$rows) return cc25_vets_squad_static();
    return array_map(function ($r) {
        return array('id' => $r['id'], 'name' => $r['name'], 'pos' => $r['pos']);
    }, $rows);
}

/* ------------------------------------------- names are the join key: guarding it */

/**
 * Every name that has appeared on a team sheet for this side.
 *
 * The squad list and the match records are joined on the NAME, so a spelling
 * difference silently detaches a player from his own appearances — the men's list
 * says "Lewis Cochrane" and "Jonny Invernizzi" where the team sheets say Louis and
 * Jonathan, and both were showing no games all season.
 */
function cc25_squad_known_names($team) {
    if (!function_exists('cc25_season_matches')) return array();
    $seen = array();
    foreach (cc25_season_matches() as $m) {
        if (($m['team'] ?? 'mens') !== $team) continue;
        foreach (array('starters', 'subs') as $k) {
            foreach ((array) ($m[$k] ?? array()) as $p) {
                $n = is_array($p) ? ($p[1] ?? '') : $p;
                if ($n !== '') $seen[strtolower(trim($n))] = trim($n);
            }
        }
    }
    ksort($seen);
    return array_values($seen);
}

/** Has anyone played under this spelling? */
function cc25_squad_name_known($team, $name) {
    $k = strtolower(trim((string) $name));
    foreach (cc25_squad_known_names($team) as $n) {
        if (strtolower($n) === $k) return true;
    }
    return false;
}

/**
 * Players with appearances on record who are not in the squad list.
 *
 * Either a spelling that drifted or someone who has played and never been added.
 * Both end the same way: a player on the site with no games against his name.
 */
function cc25_squad_unlisted($team) {
    if (!function_exists('cc25_player_stats')) return array();
    $listed = array();
    foreach (cc25_squad_names($team) as $n) $listed[strtolower($n)] = 1;
    $out = array();
    foreach (cc25_player_stats($team) as $key => $row) {
        if (isset($listed[strtolower($key)])) continue;
        $out[] = isset($row['name']) ? $row['name'] : $key;
    }
    sort($out);
    return $out;
}

/** Just the names in a squad, whatever shape that squad is in. */
function cc25_squad_names($team) {
    $teams = cc25_squad_teams();
    if (!isset($teams[$team])) return array();
    $out = array();
    if ($team === 'mens') {
        foreach (cc25_squad_players() as $group) {
            foreach ($group as $p) $out[] = is_array($p) ? $p[0] : $p;
        }
        return $out;
    }
    $fn = array('reserves' => 'cc25_reserves_squad', 'u18s' => 'cc25_u18s_squad', 'vets' => 'cc25_vets_squad');
    foreach (call_user_func($fn[$team]) as $p) $out[] = $p['name'];
    return $out;
}

/* ------------------------------------------------------------------ wp-admin */

add_action('init', function () {
    register_post_type(CC25_PLAYER_CPT, array(
        'labels' => array(
            'name'          => 'Players',
            'singular_name' => 'Player',
            'add_new_item'  => 'Add a Player',
            'edit_item'     => 'Edit Player',
            'menu_name'     => 'Players',
        ),
        'public'          => false,   // rendered by the team pages, not their own URL
        'show_ui'         => true,
        'show_in_menu'    => true,
        'menu_icon'       => 'dashicons-groups',
        'supports'        => array('title', 'page-attributes'),   // title is the NAME
        'capability_type' => 'post',
        'map_meta_cap'    => true,
    ));
});

add_action('add_meta_boxes', function () {
    add_meta_box('cc25_player', 'Player', 'cc25_player_metabox', CC25_PLAYER_CPT, 'normal', 'high');
});

function cc25_player_metabox($post) {
    wp_nonce_field('cc25_player_save', 'cc25_player_nonce');
    $g = function ($k) use ($post) { return get_post_meta($post->ID, '_cc25_player_' . $k, true); };
    $team = (string) $g('team');
    $name = trim(get_the_title($post));
    ?>
    <p style="color:#666;font-size:12px;margin-top:0">The <strong>title of this post is the player's name</strong>, and it is
      what joins them to their appearances and goals. Spell it the way the team sheets do.</p>
    <p><label><strong>Team</strong><br>
      <select name="cc25_player_team" style="min-width:240px">
        <?php foreach (cc25_squad_teams() as $k => $t): ?>
          <option value="<?php echo esc_attr($k); ?>"<?php echo $team === $k ? ' selected' : ''; ?>><?php echo esc_html($t['label']); ?></option>
        <?php endforeach; ?>
      </select></label>
      <span style="color:#b32d2e;font-size:12px">&nbsp;The first player added to a team replaces that team's whole list from the theme.</span>
    </p>
    <p style="display:flex;gap:14px;flex-wrap:wrap;max-width:860px">
      <label style="flex:0 0 110px">Shirt no.<br><input type="number" min="0" name="cc25_player_no" value="<?php echo esc_attr($g('no')); ?>" style="width:100%"></label>
      <label style="flex:0 0 150px">Position<br><input type="text" name="cc25_player_pos" value="<?php echo esc_attr($g('pos')); ?>" placeholder="GK" style="width:100%"></label>
      <label style="flex:1;min-width:200px">Group <em>(men's first team)</em><br>
        <select name="cc25_player_group" style="width:100%">
          <option value="">&mdash;</option>
          <?php foreach (cc25_squad_groups() as $grp): ?>
            <option value="<?php echo esc_attr($grp); ?>"<?php echo $g('group') === $grp ? ' selected' : ''; ?>><?php echo esc_html($grp); ?></option>
          <?php endforeach; ?>
        </select></label>
    </p>
    <p style="display:flex;gap:14px;flex-wrap:wrap;max-width:860px">
      <label style="flex:1;min-width:220px">Player-card image slug <em>(men's first team)</em><br>
        <input type="text" name="cc25_player_slug" value="<?php echo esc_attr($g('slug')); ?>" placeholder="arthur-furness" style="width:100%"></label>
      <label style="flex:1;min-width:220px">FAW registration <em>(Vets)</em><br>
        <input type="text" name="cc25_player_reg" value="<?php echo esc_attr($g('reg')); ?>" style="width:100%"></label>
    </p>
    <?php
    // The check that earns this screen its place: a name nobody has played under.
    if ($name !== '' && $team !== '' && !cc25_squad_name_known($team, $name)):
        $near = cc25_squad_nearest_names($team, $name); ?>
      <p style="background:#fcf9e8;border-left:4px solid #dba617;padding:10px 14px">
        <strong>No appearances are recorded under this spelling.</strong>
        That is fine for a new signing. If they have played, the name here and the name on the team
        sheet have to match exactly, or their games and goals will not find them.
        <?php if ($near): ?><br>The team sheets say: <strong><?php echo esc_html(implode(', ', $near)); ?></strong>.<?php endif; ?>
      </p>
    <?php endif; ?>
    <?php
}

/** The surname, for matching people rather than strings. */
function cc25_squad_surname($name) {
    $parts = preg_split('/\s+/', trim(strtolower((string) $name)));
    return $parts ? end($parts) : '';
}

/**
 * Names on this team's sheets that look like the one given.
 *
 * Surname first, edit distance second. "Jonny" for "Jonathan" is five edits — past
 * any threshold worth setting — and it is exactly the case the warning is for. Two
 * players who share a surname share it exactly; two spellings of one player almost
 * never differ there.
 */
function cc25_squad_nearest_names($team, $name, $limit = 3) {
    $sur = cc25_squad_surname($name);
    $seen = array();
    $out = array();
    foreach (cc25_squad_known_names($team) as $n) {
        if (strtolower($n) === strtolower($name)) continue;
        if ($sur !== '' && cc25_squad_surname($n) === $sur) { $out[] = $n; $seen[$n] = 1; }
    }
    foreach (cc25_squad_known_names($team) as $n) {
        if (isset($seen[$n]) || strtolower($n) === strtolower($name)) continue;
        $d = levenshtein(strtolower($n), strtolower($name));
        if ($d > 0 && $d <= max(3, (int) floor(strlen($name) / 4))) $out[] = $n;
    }
    return array_slice($out, 0, $limit);
}

/**
 * Surnames the team sheets spell more than one way.
 *
 * The worse half of the same problem: COMET recorded Cochrane as both Lewis and
 * Louis across two matches, so his appearances are split between two keys and he
 * loses games whichever spelling the squad list uses. Nothing else on the site
 * would ever mention it.
 *
 * @return array surname => [spelling, spelling, ...]
 */
function cc25_squad_name_variants($team) {
    $by = array();
    foreach (cc25_squad_known_names($team) as $n) {
        $sur = cc25_squad_surname($n);
        if ($sur === '') continue;
        $by[$sur][strtolower($n)] = $n;
    }
    $out = array();
    foreach ($by as $sur => $names) {
        if (count($names) > 1) $out[$sur] = array_values($names);
    }
    return $out;
}

add_action('save_post_' . CC25_PLAYER_CPT, function ($id) {
    if (!isset($_POST['cc25_player_nonce']) || !wp_verify_nonce($_POST['cc25_player_nonce'], 'cc25_player_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $id)) return;
    $teams = cc25_squad_teams();
    $team = (string) ($_POST['cc25_player_team'] ?? '');
    update_post_meta($id, '_cc25_player_team', isset($teams[$team]) ? $team : 'mens');
    foreach (array('no', 'pos', 'group', 'slug', 'reg') as $k) {
        update_post_meta($id, '_cc25_player_' . $k, sanitize_text_field(wp_unslash($_POST['cc25_player_' . $k] ?? '')));
    }
}, 10);

/** Team and shirt number in the Players list, so a squad reads as a squad. */
add_filter('manage_' . CC25_PLAYER_CPT . '_posts_columns', function ($cols) {
    $out = array();
    foreach ($cols as $k => $v) {
        $out[$k] = $v;
        if ($k === 'title') { $out['cc25_team'] = 'Team'; $out['cc25_no'] = 'No.'; $out['cc25_apps'] = 'Appearances'; }
    }
    return $out;
});
add_action('manage_' . CC25_PLAYER_CPT . '_posts_custom_column', function ($col, $id) {
    $teams = cc25_squad_teams();
    if ($col === 'cc25_team') {
        $t = (string) get_post_meta($id, '_cc25_player_team', true);
        echo esc_html($teams[$t]['label'] ?? $t);
    } elseif ($col === 'cc25_no') {
        echo esc_html((string) get_post_meta($id, '_cc25_player_no', true));
    } elseif ($col === 'cc25_apps') {
        $t = (string) get_post_meta($id, '_cc25_player_team', true);
        $stats = function_exists('cc25_player_stats') ? cc25_player_stats($t ?: 'mens') : array();
        $k = strtolower(trim(get_the_title($id)));
        // Nought is a fact; a dash means the name matches no team sheet at all.
        echo isset($stats[$k]) ? intval($stats[$k]['apps'])
            : '<span style="color:#b32d2e" title="No team sheet uses this spelling">&mdash;</span>';
    }
}, 10, 2);

/* --------------------------------------------------------------- the importer */

/**
 * Seed the Players screen from the lists in the theme.
 *
 * A team's posts replace that team's list outright, so entering a squad one player
 * at a time would put a one-man squad on the site until the last name went in. This
 * fills a whole team in one go. It skips a name that already exists rather than
 * updating it, so running it twice cannot overwrite an edit.
 */
function cc25_players_import($team) {
    $teams = cc25_squad_teams();
    if (!isset($teams[$team]) || !function_exists('wp_insert_post')) return array(0, 0);
    $existing = array();
    foreach (cc25_squad_from_posts($team) as $r) $existing[strtolower($r['name'])] = 1;

    $rows = array();
    if ($team === 'mens') {
        foreach (cc25_squad_players_static() as $group => $players) {
            foreach ($players as $p) $rows[] = array('name' => $p[0], 'group' => $group, 'slug' => $p[1]);
        }
    } else {
        foreach (call_user_func($teams[$team]['fallback']) as $p) {
            $rows[] = array('name' => $p['name'], 'no' => $p['no'] ?? '', 'pos' => $p['pos'] ?? '', 'reg' => $p['id'] ?? '');
        }
    }
    $added = $skipped = 0;
    foreach ($rows as $i => $r) {
        if (isset($existing[strtolower($r['name'])])) { $skipped++; continue; }
        $id = wp_insert_post(array(
            'post_type' => CC25_PLAYER_CPT, 'post_status' => 'publish',
            'post_title' => $r['name'], 'menu_order' => $i,
        ));
        if (!$id || is_wp_error($id)) continue;
        update_post_meta($id, '_cc25_player_team', $team);
        foreach (array('no', 'pos', 'group', 'slug', 'reg') as $k) {
            update_post_meta($id, '_cc25_player_' . $k, (string) ($r[$k] ?? ''));
        }
        $added++;
    }
    return array($added, $skipped);
}

add_action('admin_menu', function () {
    add_submenu_page('edit.php?post_type=' . CC25_PLAYER_CPT, 'Import squads', 'Import from theme',
        'manage_options', 'cc25-players-import', 'cc25_players_import_page');
});

function cc25_players_import_page() {
    if (!current_user_can('manage_options')) return;
    $done = '';
    if (!empty($_POST['cc25_players_import']) && check_admin_referer('cc25_players_import')) {
        $t = sanitize_text_field(wp_unslash($_POST['cc25_players_import']));
        list($added, $skipped) = cc25_players_import($t);
        $done = sprintf('%d added, %d already there.', $added, $skipped);
    }
    echo '<div class="wrap"><h1>Import squads from the theme</h1>';
    echo '<p>Copies a squad out of the theme and into the Players screen so it can be edited here. '
       . 'A name already on the Players screen is left alone, so this is safe to run again.</p>';
    if ($done) echo '<div class="notice notice-success"><p>' . esc_html($done) . '</p></div>';
    echo '<table class="widefat striped" style="max-width:760px"><thead><tr><th>Team</th>'
       . '<th>In the theme</th><th>Entered here</th><th></th></tr></thead><tbody>';
    foreach (cc25_squad_teams() as $key => $t) {
        $static = $key === 'mens' ? count(cc25_squad_names_static_mens())
                                  : count((array) call_user_func($t['fallback']));
        $live = count(cc25_squad_from_posts($key));
        echo '<tr><td><strong>' . esc_html($t['label']) . '</strong></td><td>' . intval($static) . '</td><td>'
           . ($live ? intval($live) . ' &mdash; <em>this team is run from here</em>' : '&mdash;') . '</td><td>';
        echo '<form method="post" style="margin:0">';
        wp_nonce_field('cc25_players_import');
        echo '<button class="button" name="cc25_players_import" value="' . esc_attr($key) . '">Import</button>';
        echo '</form></td></tr>';
    }
    echo '</tbody></table>';

    // The reason this screen exists at all.
    echo '<h2 style="margin-top:32px">Played but not listed</h2>';
    echo '<p>Names that appear on a team sheet with no matching player. Either the spelling drifted, '
       . 'or they have played and were never added &mdash; both leave someone on the site with no games '
       . 'against their name.</p>';
    $any = false;
    foreach (cc25_squad_teams() as $key => $t) {
        $orphans = cc25_squad_unlisted($key);
        if (!$orphans) continue;
        $any = true;
        echo '<p><strong>' . esc_html($t['label']) . ':</strong> ' . esc_html(implode(', ', $orphans)) . '</p>';
    }
    if (!$any) echo '<p><em>Nobody &mdash; every name on a team sheet has a player.</em></p>';

    // The half nothing else reports: the sheets disagreeing with themselves.
    echo '<h2 style="margin-top:32px">Spelled two ways on the team sheets</h2>';
    echo '<p>The same surname recorded under more than one spelling. Appearances are counted '
       . 'per spelling, so a player like this is losing games whichever one the squad uses. '
       . 'Fixing it means correcting the name on the match record, not here.</p>';
    $anyv = false;
    foreach (cc25_squad_teams() as $key => $t) {
        foreach (cc25_squad_name_variants($key) as $sur => $spellings) {
            $anyv = true;
            printf('<p><strong>%s:</strong> %s</p>', esc_html($t['label']), esc_html(implode('  /  ', $spellings)));
        }
    }
    if (!$anyv) echo '<p><em>None &mdash; every surname is spelled one way.</em></p>';
    echo '</div>';
}

/** The men's fallback flattened, for counting. */
function cc25_squad_names_static_mens() {
    $out = array();
    foreach (cc25_squad_players_static() as $group) foreach ($group as $p) $out[] = $p[0];
    return $out;
}
