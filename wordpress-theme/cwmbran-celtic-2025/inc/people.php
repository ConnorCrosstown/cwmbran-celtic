<?php
/**
 * Who runs the club — the people behind the Contact page.
 *
 * One card per PERSON, not per role. Karen Robinson is General Manager, Junior
 * Football Secretary and Safeguarding Officer; three cards with the same face and
 * number would read as a padded committee and be three things to keep in step.
 *
 * Deliberately NOT sourced from COMET. The match record names whoever was in the
 * technical area that day — for 28 July it has Samuel Lewis and Stephen Muir as
 * "First Team Manager" — which is not the same as who holds the role. Job titles
 * come from the club.
 *
 * Reads posts first, falls back to cc25_people_static(). Uploading the theme
 * changes nothing until someone is entered in wp-admin.
 */
if (!defined('ABSPATH')) exit;

const CC25_PERSON_CPT = 'cc25_person';

/** The groups, in the order the page prints them. */
function cc25_people_groups() {
    return array(
        'officials' => array(
            'label' => 'Club Officials',
            'blurb' => 'The committee that runs Cwmbran Celtic day to day.',
        ),
        'football'  => array(
            'label' => 'Team Management',
            'blurb' => 'The people in charge of each side, from the first team to walking football.',
        ),
        'social'    => array(
            'label' => 'Social Club',
            'blurb' => 'Bookings, functions and the bar at the Motazone Arena.',
        ),
    );
}

/**
 * The club's own list, as supplied 8 Aug 2026.
 *
 * 'roles' is a list because people hold more than one. Order within a group is the
 * order here — committee seniority, not alphabetical, since that is how a club
 * contact list is read.
 *
 * Karen Robinson was given as 07961 97492 against General Manager and 07961 974920
 * against the other two. The first is ten digits, one short of a UK mobile, so the
 * eleven-digit number is used for all three.
 */
function cc25_people_static() {
    return array(
        array('name' => 'Barrie Desmond', 'group' => 'officials',
              'roles' => array('Chairperson'), 'phone' => '07831 441109'),
        array('name' => 'Karen Robinson', 'group' => 'officials',
              'roles' => array('General Manager', 'Junior Football Secretary', 'Safeguarding Officer'),
              'phone' => '07961 974920'),
        array('name' => 'Tony Strange', 'group' => 'officials',
              'roles' => array('Football Secretary'), 'phone' => '07968 947897'),
        array('name' => 'Sue Perrett', 'group' => 'officials',
              'roles' => array('Treasurer'), 'phone' => '07952 497336'),

        array('name' => 'Simon Berry', 'group' => 'football',
              'roles' => array('1st Team Manager'), 'phone' => '07990 160252'),
        array('name' => 'Neil Jones', 'group' => 'football',
              'roles' => array('Senior Development Team Manager'), 'phone' => '07367 628851'),
        array('name' => 'James Kinsella', 'group' => 'football',
              'roles' => array("Ladies 1st Team Manager"), 'phone' => '07881 360962'),
        /* No number supplied — the card prints without one rather than being omitted. */
        array('name' => 'Jack Shepherd', 'group' => 'football',
              'roles' => array("Ladies Development Team Manager"), 'phone' => ''),
        array('name' => 'Nick Beckett', 'group' => 'football',
              'roles' => array("Walking Football (Men's & Ladies')"), 'phone' => '07919 323520'),

        array('name' => 'Kevin Thomas', 'group' => 'social',
              'roles' => array('Social Club Manager'), 'phone' => '07368 211186'),
    );
}

/** The club's landline. Not a person, so it is not a card. */
function cc25_club_phone() {
    return '01633 774019';
}

/**
 * Everyone, posts first.
 *
 * A person with no name is skipped: an untitled draft would otherwise print an
 * empty card on a public page.
 */
function cc25_people() {
    $posts = cc25_people_from_posts();
    return $posts ? $posts : cc25_people_static();
}

/** People entered in wp-admin. Empty when there is no WordPress to ask, which is
 *  what the CLI tests are and what makes the fallback work. */
function cc25_people_from_posts() {
    if (!function_exists('get_posts') || !function_exists('post_type_exists')) return array();
    if (!post_type_exists(CC25_PERSON_CPT)) return array();
    $posts = get_posts(array(
        'post_type' => CC25_PERSON_CPT, 'post_status' => 'publish', 'numberposts' => -1,
        'orderby' => array('menu_order' => 'ASC', 'title' => 'ASC'),
    ));
    $out = array();
    foreach ($posts as $p) {
        $name = trim(get_the_title($p));
        if ($name === '') continue;
        $group = (string) get_post_meta($p->ID, '_cc25_person_group', true);
        $groups = cc25_people_groups();
        $out[] = array(
            'name'  => $name,
            'group' => isset($groups[$group]) ? $group : 'officials',
            'roles' => cc25_person_roles_parse((string) get_post_meta($p->ID, '_cc25_person_roles', true)),
            'phone' => trim((string) get_post_meta($p->ID, '_cc25_person_phone', true)),
            'email' => trim((string) get_post_meta($p->ID, '_cc25_person_email', true)),
            'photo' => $p->ID,
        );
    }
    return $out;
}

/** One role per line, blanks dropped. */
function cc25_person_roles_parse($raw) {
    $out = array();
    foreach (preg_split('/\r\n|\r|\n/', (string) $raw) as $line) {
        $line = trim($line);
        if ($line !== '') $out[] = $line;
    }
    return $out;
}

/** People grouped and ordered ready for the page. Groups with nobody in them are
 *  dropped so an empty heading never prints. */
function cc25_people_by_group($people = null) {
    if ($people === null) $people = cc25_people();
    $out = array();
    foreach (cc25_people_groups() as $key => $meta) {
        $in = array();
        foreach ($people as $p) {
            if (($p['group'] ?? 'officials') === $key) $in[] = $p;
        }
        if ($in) $out[$key] = array('label' => $meta['label'], 'blurb' => $meta['blurb'], 'people' => $in);
    }
    return $out;
}

/**
 * A phone number as a tel: href, or '' if there isn't a usable one.
 *
 * Strips everything but digits and a leading +, so "07961 974920" and
 * "(01633) 774019" both dial. Returning '' for junk means the template can decide
 * between a link and plain text on the return value alone.
 */
function cc25_phone_href($phone) {
    $raw = trim((string) $phone);
    if ($raw === '') return '';
    $plus = strpos($raw, '+') === 0;
    $digits = preg_replace('/\D/', '', $raw);
    if (strlen($digits) < 9) return '';
    return 'tel:' . ($plus ? '+' : '') . $digits;
}

/**
 * True when a number is a plausible complete UK number.
 *
 * 11 digits for 0-prefixed numbers, or 10 for the few older area codes. This is
 * what the dashboard check uses: the list the club supplied had a ten-digit mobile
 * in it, and a number one digit short looks exactly as confident as a right one.
 */
function cc25_phone_looks_complete($phone) {
    $digits = preg_replace('/\D/', '', (string) $phone);
    if ($digits === '') return true;                  /* absent is not incomplete */
    if (strpos($digits, '07') === 0) return strlen($digits) === 11;
    if (strpos($digits, '0') === 0) return strlen($digits) === 11 || strlen($digits) === 10;
    return strlen($digits) >= 10;
}

/** Initials for the photo placeholder, so a card without a portrait still looks
 *  designed rather than broken. Mirrors how a missing opponent crest is handled. */
function cc25_person_initials($name) {
    $parts = preg_split('/\s+/', trim((string) $name));
    $out = '';
    foreach ($parts as $p) {
        if ($p === '') continue;
        $out .= strtoupper(mb_substr($p, 0, 1));
        if (mb_strlen($out) >= 2) break;
    }
    return $out !== '' ? $out : 'CC';
}

/** True if this person is the safeguarding contact. That one gets picked out on the
 *  page: a club with juniors should not make it hard to find. */
function cc25_person_is_safeguarding($person) {
    foreach (($person['roles'] ?? array()) as $r) {
        if (stripos($r, 'safeguarding') !== false) return true;
    }
    return false;
}

/* ---- wp-admin ------------------------------------------------------------- */

add_action('init', function () {
    register_post_type(CC25_PERSON_CPT, array(
        'labels' => array(
            'name'          => 'Club People',
            'singular_name' => 'Person',
            'add_new_item'  => 'Add a Person',
            'edit_item'     => 'Edit Person',
            'menu_name'     => 'Club People',
        ),
        'public'          => false,   /* rendered by the Contact page, not its own URL */
        'show_ui'         => true,
        'show_in_menu'    => true,
        'menu_icon'       => 'dashicons-groups',
        'supports'        => array('title', 'thumbnail', 'page-attributes'),
        'capability_type' => 'post',
        'map_meta_cap'    => true,
    ));
});

add_action('add_meta_boxes', function () {
    add_meta_box('cc25_person', 'Role and contact', 'cc25_person_metabox', CC25_PERSON_CPT, 'normal', 'high');
});

function cc25_person_metabox($post) {
    wp_nonce_field('cc25_person_save', 'cc25_person_nonce');
    $roles = get_post_meta($post->ID, '_cc25_person_roles', true);
    $phone = get_post_meta($post->ID, '_cc25_person_phone', true);
    $email = get_post_meta($post->ID, '_cc25_person_email', true);
    $group = get_post_meta($post->ID, '_cc25_person_group', true);
    ?>
    <p><label><strong>Group</strong><br>
      <select name="cc25_person_group" style="max-width:280px">
        <?php foreach (cc25_people_groups() as $k => $g): ?>
          <option value="<?php echo esc_attr($k); ?>"<?php echo $group === $k ? ' selected' : ''; ?>><?php echo esc_html($g['label']); ?></option>
        <?php endforeach; ?>
      </select>
    </label></p>

    <p style="margin-bottom:4px"><strong>Role or roles</strong></p>
    <p style="color:#666;font-size:12px;margin-top:0">One per line. Somebody holding three
      jobs gets one card listing all three &mdash; don't add them three times.</p>
    <textarea name="cc25_person_roles" rows="3" style="width:100%;max-width:520px"
      placeholder="General Manager&#10;Junior Football Secretary&#10;Safeguarding Officer"><?php
      echo esc_textarea($roles); ?></textarea>

    <p><label><strong>Phone</strong><br>
      <input type="text" name="cc25_person_phone" value="<?php echo esc_attr($phone); ?>" style="max-width:260px" placeholder="07961 974920">
    </label><br>
    <span style="color:#666;font-size:12px">Leave blank to print no number. This goes on a
      public page &mdash; only add a personal mobile if that person is happy for it to be there.</span>
    <?php if ($phone !== '' && !cc25_phone_looks_complete($phone)): ?>
      <br><span style="color:#b32d2e;font-size:12px"><strong>That looks a digit short</strong>
      &mdash; <?php echo esc_html(strlen(preg_replace('/\D/', '', $phone))); ?> digits. A UK mobile has 11.</span>
    <?php endif; ?></p>

    <p><label><strong>Email</strong><br>
      <input type="email" name="cc25_person_email" value="<?php echo esc_attr($email); ?>" style="max-width:320px" placeholder="secretary@cwmbranceltic.com">
    </label><br>
    <span style="color:#666;font-size:12px">A club address is better than a personal one where there is one.</span></p>

    <p style="color:#666;font-size:12px;margin-bottom:0">The <strong>Featured image</strong> is the
      portrait. Without one the card shows their initials, which is fine &mdash; it is not broken.</p>
    <?php
}

add_action('save_post_' . CC25_PERSON_CPT, function ($id) {
    if (!isset($_POST['cc25_person_nonce']) || !wp_verify_nonce($_POST['cc25_person_nonce'], 'cc25_person_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $id)) return;

    $groups = cc25_people_groups();
    $group  = sanitize_text_field(wp_unslash($_POST['cc25_person_group'] ?? ''));
    update_post_meta($id, '_cc25_person_group', isset($groups[$group]) ? $group : 'officials');

    update_post_meta($id, '_cc25_person_roles',
        sanitize_textarea_field(wp_unslash($_POST['cc25_person_roles'] ?? '')));
    update_post_meta($id, '_cc25_person_phone',
        sanitize_text_field(wp_unslash($_POST['cc25_person_phone'] ?? '')));

    $email = sanitize_email(wp_unslash($_POST['cc25_person_email'] ?? ''));
    update_post_meta($id, '_cc25_person_email', $email);
});
