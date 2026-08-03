# Walking Football Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Walking Football page to the `cwmbran-celtic-2025` theme and surface it in the Teams hub and the All Teams nav dropdown.

**Architecture:** Content that changes rarely (sessions, prices, club story, inclusion) renders on the club site from data functions in `functions.php`; content that changes often (fixtures, photo gallery, sponsorship tiers) links out to the section's own site. One page template following the existing `template-vets.php` / `template-juniors.php` pattern, routed by slug through the theme's `template_include` map.

**Tech Stack:** WordPress classic theme, PHP 8.5, hand-written CSS in `style.css`. No build step. No PHP framework.

**Spec:** `docs/superpowers/specs/2026-08-03-walking-football-section-design.md`

## Global Constraints

- Theme root for every path below: `wordpress-theme/cwmbran-celtic-2025/`.
- Escape all output: `esc_html()` for text, `esc_url()` for hrefs, `esc_attr()` for attributes. Match the surrounding file.
- Reuse existing CSS classes — `phero`, `band`, `wrap`, `sec-head`, `sec-eye kick`, `jr-grid`, `jr-card`, `cta`, `spx-note`, `btn btn-gold`, `btn btn-outline`, `reveal`. New CSS is limited to the timeline and session/price grids.
- Every outbound link gets `target="_blank" rel="noopener"`.
- Their site resolves at `https://cwmbrancelticwalkingfootball.co.uk` — **no "club"** in the domain, despite what their page footers print.
- British English. Club voice: plain, warm, no marketing gloss.
- Do **not** copy their fixtures list or photo gallery into the theme.
- Do **not** touch the club's own sponsorship or Celtic Bond pages.
- Never run `git push`. Commit locally only.

## Test approach

The theme has no PHP test framework. Two verification layers apply:

1. **Data functions** get real red/green tests. `functions.php` loads standalone
   under PHP CLI with only two no-op stubs (`add_action`, `add_filter`) — this
   has been verified. Tests live in `_tests/wf-data-test.php` and run with
   `php _tests/wf-data-test.php`. The directory is not `_audit/`, so it is
   committed; WordPress never loads it.
2. **Templates and CSS** get `php -l` syntax checks plus the manual browser
   checklist in Task 6.

## File Structure

| File | Responsibility |
|------|----------------|
| `functions.php` (modify) | Data functions, URL helper, slug/template routing, page provisioning, nav item |
| `template-walking-football.php` (create) | The page — eight sections, rendering only |
| `template-teams.php` (modify) | One extra hub card |
| `style.css` (modify) | Timeline + session/price grid styles |
| `_tests/wf-data-test.php` (create) | Assertions over the data functions |

---

### Task 1: Walking Football data functions

**Files:**
- Modify: `functions.php` — insert after `cc25_junior_teams()` (ends line 185)
- Create: `_tests/wf-data-test.php`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `cc25_wf_sessions(): array` — rows of `['label'=>string,'day'=>string,'time'=>string]`
  - `cc25_wf_venue(): array` — `['name'=>string,'address'=>string,'map'=>string]`
  - `cc25_wf_prices(): array` — rows of `['label'=>string,'price'=>string,'note'=>string,'bond'=>bool]`
  - `cc25_wf_timeline(): array` — rows of `['when'=>string,'what'=>string]`
  - `cc25_wf_links(): array` — keys `site, sessions, story, inclusion, sponsorship, gallery, contact, facebook, phone`

- [ ] **Step 1: Write the failing test**

Create `_tests/wf-data-test.php`:

```php
<?php
/**
 * Assertions over the Walking Football data functions. Run from the theme root:
 *   php _tests/wf-data-test.php
 * functions.php loads standalone with these two no-op stubs; WordPress never
 * loads this file.
 */
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

// Sessions
$s = cc25_wf_sessions();
check('7 sessions', count($s) === 7);
check('every session has label, day, time', count(array_filter($s, function ($r) {
    return !empty($r['label']) && !empty($r['day']) && !empty($r['time']);
})) === 7);
$days = array_unique(array_column($s, 'day'));
sort($days);
check('days are Wed/Thu/Fri/Sun', $days === array('Friday', 'Sunday', 'Thursday', 'Wednesday'));
check('three Thursday sessions', count(array_filter($s, function ($r) {
    return $r['day'] === 'Thursday';
})) === 3);

// Venue
$v = cc25_wf_venue();
check('venue is Llantarnam school', strpos($v['name'], 'Llantarnam') !== false);
check('venue address has postcode', strpos($v['address'], 'NP44 3XB') !== false);
check('venue map link is https', strpos($v['map'], 'https://') === 0);

// Prices
$p = cc25_wf_prices();
check('3 price rows', count($p) === 3);
check('one row flagged as the Bond', count(array_filter($p, function ($r) {
    return !empty($r['bond']);
})) === 1);
check('prices are 6/10/10', array_column($p, 'price') === array('£6', '£10', '£10'));

// Timeline
$t = cc25_wf_timeline();
check('12 timeline rows', count($t) === 12);
check('starts January 2024', $t[0]['when'] === 'January 2024');
check('ends with the tri-national', strpos($t[count($t) - 1]['what'], 'Wales, Ireland and England') !== false);
check('every row has when and what', count(array_filter($t, function ($r) {
    return !empty($r['when']) && !empty($r['what']);
})) === 12);

// Links
$l = cc25_wf_links();
foreach (array('site','sessions','story','inclusion','sponsorship','gallery','contact','facebook','whatsapp','phone') as $k) {
    check("links has '$k'", isset($l[$k]) && $l[$k] !== '');
}
check('domain has no "club"', strpos($l['site'], 'walkingfootballclub') === false);
check('site is the right domain', strpos($l['site'], 'cwmbrancelticwalkingfootball.co.uk') !== false);
check('phone is the section mobile', preg_replace('/\s+/', '', $l['phone']) === '07919323520');
check('whatsapp uses the international number', $l['whatsapp'] === 'https://wa.me/447919323520');

echo "\n";
if ($failures) { echo count($failures) . " FAILED\n"; exit(1); }
echo "all passed\n";
```

- [ ] **Step 2: Run the test to verify it fails**

Run from `wordpress-theme/cwmbran-celtic-2025/`:
```bash
php _tests/wf-data-test.php
```
Expected: fatal error — `Call to undefined function cc25_wf_sessions()`.

- [ ] **Step 3: Add the data functions**

In `functions.php`, immediately after the closing brace of `cc25_junior_teams()` and before the `cc25_slug_candidates()` docblock:

```php
/**
 * WALKING FOOTBALL — the section runs its own site and keeps it updated, so
 * only slow-changing content lives here. Fixtures, the photo gallery and
 * sponsorship tiers link out (see cc25_wf_links()) rather than being copied.
 *
 * Weekly sessions, in running order.
 * Each row: ['label' => session, 'day' => weekday, 'time' => start].
 * All sessions run at cc25_wf_venue().
 */
function cc25_wf_sessions() {
    return array(
        array('label' => "Men's Under 50s",                'day' => 'Thursday',  'time' => '7:00pm'),
        array('label' => "Men's Over 50s",                 'day' => 'Thursday',  'time' => '7:00pm'),
        array('label' => "Men's Over 60s",                 'day' => 'Thursday',  'time' => '7:00pm'),
        array('label' => "Men's Social",                   'day' => 'Wednesday', 'time' => '4:00pm'),
        array('label' => "Women's Competitive (Over 35s)", 'day' => 'Friday',    'time' => '6:00pm'),
        array('label' => "Women's Social (all ages)",      'day' => 'Friday',    'time' => '6:00pm'),
        array('label' => "Mixed (all ages)",               'day' => 'Sunday',    'time' => '9:00am'),
    );
}

/** Where every Walking Football session is played. */
function cc25_wf_venue() {
    return array(
        'name'    => 'Llantarnam Community Primary School',
        'address' => 'James Prosser Way, Llantarnam, Cwmbran, NP44 3XB',
        'map'     => 'https://www.google.com/maps/search/?api=1&query=Llantarnam+Community+Primary+School+NP44+3XB',
    );
}

/** Monthly subscriptions. 'bond' marks the row that links to the Celtic Bond. */
function cc25_wf_prices() {
    return array(
        array('label' => 'Social',      'price' => '£6',  'note' => 'Social sessions.',                  'bond' => false),
        array('label' => 'Competitive', 'price' => '£10', 'note' => 'Competitive squads.',               'bond' => false),
        array('label' => 'Celtic Bond', 'price' => '£10', 'note' => 'All players — the club\'s draw.',   'bond' => true),
    );
}

/** The section's story so far. Each row: ['when' => date, 'what' => milestone]. */
function cc25_wf_timeline() {
    return array(
        array('when' => 'January 2024',   'what' => 'A small group of men decide it is time to bring football back into their lives.'),
        array('when' => 'April 2024',     'what' => "A women's group launches and the community grows."),
        array('when' => 'June 2024',      'what' => "The women's team play their first friendly, against Caldicot."),
        array('when' => 'September 2024', 'what' => 'A first Fun Day celebrates walking football, friendship and community.'),
        array('when' => 'September 2024', 'what' => "The women's team join their first competitive league."),
        array('when' => 'November 2024',  'what' => 'Sponsorship and grants bring tracksuits and training kit.'),
        array('when' => 'March 2025',     'what' => "A men's 50s walking football team is formed."),
        array('when' => 'April 2025',     'what' => 'First anniversary — 100 members.'),
        array('when' => 'May 2025',       'what' => "The women's team win their first league campaign."),
        array('when' => 'August 2025',    'what' => 'The section hosts its first tournament — 300 players.'),
        array('when' => 'September 2025', 'what' => 'A first social mixed tournament, for players outside the leagues.'),
        array('when' => 'Nov–Dec 2025',   'what' => 'A tri-national tournament brings together Wales, Ireland and England.'),
    );
}

/**
 * Every outbound Walking Football destination in one place, so a domain move is
 * a single edit. NOTE: their pages print the address with "club" in it, but the
 * site only resolves without it.
 */
function cc25_wf_links() {
    $site = 'https://cwmbrancelticwalkingfootball.co.uk';
    return array(
        'site'        => $site . '/',
        'sessions'    => $site . '/session-times',
        'story'       => $site . '/community-%26-club-story',
        'inclusion'   => $site . '/social-inclusion',
        'sponsorship' => $site . '/sponsorship',
        'gallery'     => $site . '/photo-gallery',
        'contact'     => $site . '/contact-us',
        'facebook'    => 'https://www.facebook.com/p/Cwmbran-Celtic-Walking-Football-Club-61573941128119/',
        // 07919 323520 in international form, as wa.me requires.
        'whatsapp'    => 'https://wa.me/447919323520',
        'phone'       => '07919 323520',
    );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
php _tests/wf-data-test.php
```
Expected: every line `ok`, final line `all passed`, exit 0.

- [ ] **Step 5: Commit**

```bash
git add wordpress-theme/cwmbran-celtic-2025/functions.php \
        wordpress-theme/cwmbran-celtic-2025/_tests/wf-data-test.php
git commit -m "feat(cwmbran-theme): Walking Football data functions + tests"
```

---

### Task 2: Routing and page provisioning

Make the slug resolve to the new template and make sure a page exists to resolve to.

**Files:**
- Modify: `functions.php:73-100` (the `template_include` `$map`)
- Modify: `functions.php:120-141` (`cc25_ensure_pages()` and the version stamp at line ~146)
- Modify: `functions.php` — add `cc25_walking_football_url()` after `cc25_juniors_url()` (ends line 170)

**Interfaces:**
- Consumes: `cc25_slug_candidates('walking-football')` — already present at `functions.php:200`, mapping to `array('cwmbran-walking-football-2', 'walking-football', 'walking')`
- Produces: `cc25_walking_football_url(): string`

**Context:** the live site may already have a Walking Football page under the legacy slug `cwmbran-walking-football-2`. Provisioning must not create a duplicate, and routing must cover every variant.

- [ ] **Step 1: Add the URL helper**

In `functions.php`, after the closing brace of `cc25_juniors_url()`:

```php
/** Walking Football destination: the dedicated page if it exists (under any of
 * the known slugs), else the teams hub, so the hub card never dead-links. */
function cc25_walking_football_url() {
    $p = cc25_page_url('walking-football', '');
    return $p ? $p : cc25_page_url('teams', home_url('/'));
}
```

- [ ] **Step 2: Route every slug variant to the template**

In the `template_include` `$map`, after the `'minis'` line:

```php
            'walking-football'           => 'template-walking-football.php',
            'cwmbran-walking-football-2' => 'template-walking-football.php',
            'walking'                    => 'template-walking-football.php',
```

- [ ] **Step 3: Provision the page only when no variant exists**

In `cc25_ensure_pages()`, after the `$pages = array(...);` block and before the `foreach`:

```php
    // Walking Football: the live site may already have this page under the
    // legacy slug, so only provision when none of the known variants exist.
    $wf_exists = false;
    foreach (cc25_slug_candidates('walking-football') as $wf_slug) {
        if (get_page_by_path($wf_slug)) { $wf_exists = true; break; }
    }
    if (!$wf_exists) $pages['walking-football'] = 'Walking Football';
```

Then bump the version stamp so it runs on the next admin load. Change:

```php
    $ver = '2026-07-31-juniors';
```

to:

```php
    $ver = '2026-08-03-walking-football';
```

- [ ] **Step 4: Verify syntax and the helper's fallback**

```bash
php -l functions.php
```
Expected: `No syntax errors detected`.

Then confirm the helper is defined and the slug candidates are intact:

```bash
php -r '
function add_action(){} function add_filter(){}
define("ABSPATH","/tmp/");
require "functions.php";
var_dump(function_exists("cc25_walking_football_url"));
print_r(cc25_slug_candidates("walking-football"));
'
```
Expected: `bool(true)` and the three slugs.

- [ ] **Step 5: Commit**

```bash
git add wordpress-theme/cwmbran-celtic-2025/functions.php
git commit -m "feat(cwmbran-theme): route + provision the Walking Football page"
```

---

### Task 3: The page template — hero, what it is, sessions, prices

**Files:**
- Create: `template-walking-football.php`

**Interfaces:**
- Consumes: `cc25_wf_sessions()`, `cc25_wf_venue()`, `cc25_wf_prices()`, `cc25_wf_links()` (Task 1); `cc25_page_url()` (existing)
- Produces: the file that Task 4 appends sections 5–8 to

- [ ] **Step 1: Create the template with sections 1–4**

```php
<?php
/**
 * Template Name: Walking Football
 * The club's Walking Football section. Sessions, prices, story and inclusion
 * render here; fixtures, the gallery and sponsorship tiers link out to the
 * section's own site, which they keep updated. Data: cc25_wf_* in functions.php.
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$cc25_home  = home_url('/');
$cc25_wf    = cc25_wf_links();
$cc25_ven   = cc25_wf_venue();
$cc25_tel   = preg_replace('/\s+/', '', $cc25_wf['phone']);
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">WALKING</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url($cc25_home); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('teams', $cc25_home)); ?>" style="color:var(--on-navy-dim)">Teams</a> / <span style="color:#fff">Walking Football</span></div>
    <h1>Walking Football</h1>
    <p>Football at a walking pace &mdash; men's, women's and mixed sessions every week in Llantarnam. Friendship, fitness and fun, whatever your starting point.</p>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div>
      <div class="sec-eye kick"><span class="ln"></span> The game</div>
      <h2>What it is, and who can play</h2>
    </div></div>
    <p class="reveal" style="color:var(--muted);max-width:62ch;margin:0 0 18px">Walking football is a slower-paced version of the game, designed to keep people active, social and smiling. The rule that defines it is simple: <strong style="color:var(--text)">no running</strong>. That takes the strain out of the game and opens it up to players who thought their playing days were behind them.</p>
    <div class="wf-two reveal">
      <div class="jr-card">
        <h3>Who can play</h3>
        <ul class="wf-list">
          <li>Anyone aged 50 and over</li>
          <li>Players coming back from injury</li>
          <li>Anyone managing a health condition</li>
          <li>Anyone who would rather take it at a gentler pace</li>
        </ul>
        <p class="wf-fine">Sessions run for men, women and mixed groups &mdash; and the social sessions are open to all ages.</p>
      </div>
      <div class="jr-card">
        <h3>Why people stay</h3>
        <ul class="wf-list">
          <li>Fitness, balance and heart health, without the pounding</li>
          <li>Friendships and a community that looks out for each other</li>
          <li>A welcoming session whatever your ability</li>
          <li>A way back into the game you never stopped loving</li>
        </ul>
        <p class="wf-fine">Walking football was first played in 2011. It now has its own governing bodies and national and international tournaments.</p>
      </div>
    </div>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head reveal"><div>
      <div class="sec-eye kick"><span class="ln"></span> Every week</div>
      <h2>Session times</h2>
    </div></div>
    <div class="wf-sessions reveal">
      <?php foreach (cc25_wf_sessions() as $s): ?>
        <div class="wf-session">
          <div class="nm"><?php echo esc_html($s['label']); ?></div>
          <div class="when"><span class="day"><?php echo esc_html($s['day']); ?></span><span class="time"><?php echo esc_html($s['time']); ?></span></div>
        </div>
      <?php endforeach; ?>
    </div>
    <p class="spx-note reveal">All sessions are played at <strong style="color:var(--text)"><?php echo esc_html($cc25_ven['name']); ?></strong>, <?php echo esc_html($cc25_ven['address']); ?>. <a href="<?php echo esc_url($cc25_ven['map']); ?>" target="_blank" rel="noopener">Open in maps &rarr;</a><br>New players are always welcome &mdash; just turn up, or call <a href="tel:<?php echo esc_attr($cc25_tel); ?>"><?php echo esc_html($cc25_wf['phone']); ?></a> first for a chat.</p>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div>
      <div class="sec-eye kick"><span class="ln"></span> Membership</div>
      <h2>What it costs</h2>
    </div></div>
    <div class="wf-prices reveal">
      <?php foreach (cc25_wf_prices() as $p): ?>
        <div class="wf-price">
          <div class="amt"><?php echo esc_html($p['price']); ?><span class="per">/month</span></div>
          <div class="lbl"><?php echo esc_html($p['label']); ?></div>
          <div class="note">
            <?php echo esc_html($p['note']); ?>
            <?php if (!empty($p['bond'])): ?>
              <a href="<?php echo esc_url(cc25_page_url('celtic-bond', $cc25_home)); ?>">About the Celtic Bond &rarr;</a>
            <?php endif; ?>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
    <p class="spx-note reveal">Prices are set by the Walking Football section &mdash; check the <a href="<?php echo esc_url($cc25_wf['sessions']); ?>" target="_blank" rel="noopener">section's own site</a> for the latest.</p>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
```

- [ ] **Step 2: Verify syntax**

```bash
php -l template-walking-football.php
```
Expected: `No syntax errors detected`.

- [ ] **Step 3: Confirm `band-alt` exists, or drop it**

```bash
grep -c "\.band-alt" style.css
```
If the count is `0`, remove `band-alt` from the sessions `<section>` class so it reads `class="band"`. Do not invent the class.

- [ ] **Step 4: Commit**

```bash
git add wordpress-theme/cwmbran-celtic-2025/template-walking-football.php
git commit -m "feat(cwmbran-theme): Walking Football page — sessions, prices, intro"
```

---

### Task 4: The page template — story, inclusion, signposts, contact

**Files:**
- Modify: `template-walking-football.php` — insert before the closing `get_template_part('template-parts/site-footer')` line

**Interfaces:**
- Consumes: `cc25_wf_timeline()`, `cc25_wf_links()` (Task 1); `$cc25_wf`, `$cc25_tel`, `$cc25_home` (Task 3)
- Produces: the complete page

- [ ] **Step 1: Insert sections 5–8**

Place these immediately before the final `<?php get_template_part('template-parts/site-footer'); ?>` line:

```php
<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head reveal"><div>
      <div class="sec-eye kick"><span class="ln"></span> Since 2024</div>
      <h2>Our story</h2>
    </div></div>
    <p class="reveal" style="color:var(--muted);max-width:62ch;margin:0 0 20px">It started with a handful of players who missed the game. Inside two years it became one of the busiest parts of the club.</p>
    <ol class="wf-tl reveal">
      <?php foreach (cc25_wf_timeline() as $m): ?>
        <li>
          <span class="when"><?php echo esc_html($m['when']); ?></span>
          <span class="what"><?php echo esc_html($m['what']); ?></span>
        </li>
      <?php endforeach; ?>
    </ol>
    <blockquote class="wf-quote reveal">
      <p>&ldquo;It's incredible that in such a short space of time, walking football has brought back my confidence.&rdquo;</p>
      <cite>Emma</cite>
    </blockquote>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div>
      <div class="sec-eye kick"><span class="ln"></span> Social inclusion</div>
      <h2>More than just football</h2>
    </div></div>
    <p class="reveal" style="color:var(--muted);max-width:62ch;margin:0 0 18px">The section believes football should be open to everyone, whatever their age, background, ability, fitness or financial circumstances.</p>
    <div class="wf-three reveal">
      <div class="jr-card">
        <h3>Our values</h3>
        <ul class="wf-list">
          <li>Everyone is welcome</li>
          <li>New players are encouraged, never judged</li>
          <li>Social connection matters as much as competition</li>
        </ul>
      </div>
      <div class="jr-card">
        <h3>Health &amp; wellbeing</h3>
        <ul class="wf-list">
          <li>Physical fitness</li>
          <li>Mental wellbeing</li>
          <li>Healthy ageing</li>
          <li>Less loneliness and isolation</li>
        </ul>
      </div>
      <div class="jr-card">
        <h3>Our commitment</h3>
        <ul class="wf-list">
          <li>Treating every member fairly and with respect</li>
          <li>Promoting equality, diversity and inclusion</li>
          <li>Challenging discrimination in all its forms</li>
        </ul>
      </div>
    </div>
    <blockquote class="wf-quote reveal">
      <p>&ldquo;Walking football means the world to me. It's helped me so much in finding who I am again.&rdquo;</p>
      <cite>A Cwmbran Celtic walking footballer</cite>
    </blockquote>
  </div>
</section>

<section class="band band-alt">
  <div class="wrap">
    <div class="sec-head reveal"><div>
      <div class="sec-eye kick"><span class="ln"></span> Keep up</div>
      <h2>Fixtures &amp; photos</h2>
    </div></div>
    <p class="reveal" style="color:var(--muted);max-width:62ch;margin:0 0 18px">The section runs its own site and keeps it up to date &mdash; that's where the current fixtures and the photo gallery live.</p>
    <div class="wf-two reveal">
      <div class="jr-card">
        <h3>Fixtures &amp; tournaments</h3>
        <p class="wf-fine">Friendlies, league games and tournament dates, kept current by the section.</p>
        <a class="btn btn-sm btn-gold" href="<?php echo esc_url($cc25_wf['site']); ?>" target="_blank" rel="noopener">View fixtures &rarr;</a>
      </div>
      <div class="jr-card">
        <h3>Photo gallery</h3>
        <p class="wf-fine">Matchdays, fun days and tournaments, from the first session onwards.</p>
        <a class="btn btn-sm btn-outline" href="<?php echo esc_url($cc25_wf['gallery']); ?>" target="_blank" rel="noopener">View gallery &rarr;</a>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="cta reveal">
      <div class="grain"></div>
      <div>
        <div class="kick" style="color:var(--gold);position:relative;z-index:2">Get involved</div>
        <h2>Come and have a game</h2>
        <p>Turn up to a session, or get in touch first if you would rather ask a few questions. Businesses can back the section directly &mdash; sponsorship funds pitch hire, kit, competition fees, insurance and help for new members.</p>
      </div>
      <div class="signup" style="display:flex;flex-direction:column;gap:10px;justify-content:center">
        <a class="btn btn-gold btn-block" href="tel:<?php echo esc_attr($cc25_tel); ?>">Call <?php echo esc_html($cc25_wf['phone']); ?></a>
        <a class="btn btn-outline btn-block" href="<?php echo esc_url($cc25_wf['whatsapp']); ?>" target="_blank" rel="noopener">WhatsApp</a>
        <a class="btn btn-outline btn-block" href="<?php echo esc_url($cc25_wf['facebook']); ?>" target="_blank" rel="noopener">Facebook</a>
        <a class="btn btn-outline btn-block" href="<?php echo esc_url($cc25_wf['sponsorship']); ?>" target="_blank" rel="noopener">Sponsor the section</a>
      </div>
    </div>
    <p class="spx-note reveal">Walking Football is part of Cwmbran Celtic AFC and runs its own site at <a href="<?php echo esc_url($cc25_wf['site']); ?>" target="_blank" rel="noopener">cwmbrancelticwalkingfootball.co.uk</a>.</p>
  </div>
</section>
```

- [ ] **Step 2: Verify syntax**

```bash
php -l template-walking-football.php
```
Expected: `No syntax errors detected`.

- [ ] **Step 3: Apply the same `band-alt` decision as Task 3**

If Task 3 Step 3 found `band-alt` absent, remove it from the two sections above too.

- [ ] **Step 4: Commit**

```bash
git add wordpress-theme/cwmbran-celtic-2025/template-walking-football.php
git commit -m "feat(cwmbran-theme): Walking Football page — story, inclusion, contact"
```

---

### Task 5: Styles for the new blocks

**Files:**
- Modify: `style.css` — append after the `.jr-contact` rules (currently ending line 1521)

**Interfaces:**
- Consumes: classes emitted in Tasks 3–4 — `wf-two`, `wf-three`, `wf-list`, `wf-fine`, `wf-sessions`, `wf-session`, `wf-prices`, `wf-price`, `wf-tl`, `wf-quote`
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Append the styles**

```css
/* ---- Walking Football ------------------------------------------------- */
.wf-two{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:14px 0 4px}
.wf-three{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:14px 0 4px}
.wf-list{margin:0;padding-left:18px;color:var(--muted)}
.wf-list li{padding:5px 0;line-height:1.55}
.wf-fine{color:var(--muted);font-size:.92rem;line-height:1.62;margin:10px 0 0}
.jr-card .btn{margin-top:12px}

.wf-sessions{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin:14px 0 4px}
.wf-session{background:var(--surface);border:1px solid var(--hair);border-left:3px solid var(--gold);border-radius:10px;padding:16px 18px;box-shadow:var(--shadow-sm)}
.wf-session .nm{font-family:var(--display);text-transform:uppercase;letter-spacing:.03em;font-size:.98rem;color:var(--text)}
.wf-session .when{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-top:9px;padding-top:9px;border-top:1px solid var(--hair)}
.wf-session .day{color:var(--muted);font-size:.93rem}
.wf-session .time{font-family:var(--display);font-variant-numeric:tabular-nums;letter-spacing:.02em;color:var(--text);white-space:nowrap}

.wf-prices{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:14px 0 4px}
.wf-price{background:var(--surface);border:1px solid var(--hair);border-radius:12px;padding:22px 20px;text-align:center;box-shadow:var(--shadow-sm)}
.wf-price .amt{font-family:var(--display);font-size:2.1rem;line-height:1;color:var(--text)}
.wf-price .amt .per{font-size:.82rem;color:var(--muted);margin-left:4px;letter-spacing:.02em}
.wf-price .lbl{text-transform:uppercase;letter-spacing:.08em;font-size:.78rem;color:var(--gold);margin:9px 0 6px}
.wf-price .note{color:var(--muted);font-size:.9rem;line-height:1.55}
.wf-price .note a{display:block;margin-top:6px}

.wf-tl{list-style:none;margin:0;padding:0 0 0 22px;border-left:2px solid var(--hair)}
.wf-tl li{position:relative;padding:0 0 20px 18px}
.wf-tl li:last-child{padding-bottom:0}
.wf-tl li::before{content:"";position:absolute;left:-29px;top:5px;width:11px;height:11px;border-radius:50%;background:var(--gold);border:2px solid var(--surface)}
.wf-tl .when{display:block;font-family:var(--display);text-transform:uppercase;letter-spacing:.05em;font-size:.8rem;color:var(--gold);margin-bottom:3px}
.wf-tl .what{color:var(--muted);line-height:1.62}

.wf-quote{margin:26px 0 0;padding:20px 24px;background:var(--surface);border:1px solid var(--hair);border-left:3px solid var(--gold);border-radius:10px}
.wf-quote p{margin:0;color:var(--text);font-size:1.06rem;line-height:1.62;font-style:italic}
.wf-quote cite{display:block;margin-top:9px;font-style:normal;color:var(--muted);font-size:.9rem}

@media(max-width:860px){.wf-three{grid-template-columns:1fr}.wf-prices{grid-template-columns:1fr}}
@media(max-width:640px){.wf-two{grid-template-columns:1fr}}
```

- [ ] **Step 2: Verify the CSS variables used all exist**

```bash
for v in --surface --hair --gold --text --muted --display --shadow-sm; do
  printf '%s: ' "$v"; grep -c -- "$v:" style.css
done
```
Expected: a non-zero count for each. If any is `0`, find the real variable name with `grep -n "^:root" -A 40 style.css` and use that instead — do not invent variables.

- [ ] **Step 3: Commit**

```bash
git add wordpress-theme/cwmbran-celtic-2025/style.css
git commit -m "style(cwmbran-theme): Walking Football sessions, prices, timeline"
```

---

### Task 6: Teams hub card and All Teams nav item

The two entry points the user asked for.

**Files:**
- Modify: `template-teams.php:12-18` (the `$cc25_hub` array)
- Modify: `functions.php:830-835` (the All Teams dropdown children in `cc25_nav_items()`)

**Interfaces:**
- Consumes: `cc25_walking_football_url()` (Task 2)
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Add the hub card**

In `template-teams.php`, add as the last row of `$cc25_hub`, after the Juniors & Minis row:

```php
    array('name' => "Walking Football",    'sub' => 'Men\'s, Women\'s & Mixed · All ages welcome', 'page' => cc25_walking_football_url(), 'fx' => '', 'cta' => 'View section'),
```

The `'fx' => ''` is deliberate — Walking Football is not in the allwalessport feed, so it gets no Fixtures button, same as Men's Vets.

- [ ] **Step 2: Add the nav item**

In `cc25_nav_items()`, add after the `Juniors &amp; Minis` child of All Teams:

```php
            array('Walking Football', cc25_walking_football_url(), false),
```

- [ ] **Step 3: Verify syntax**

```bash
php -l template-teams.php && php -l functions.php
```
Expected: `No syntax errors detected` for both.

- [ ] **Step 4: Confirm the hub now has six entries**

```bash
grep -c "array('name'" template-teams.php
```
Expected: `6`.

- [ ] **Step 5: Commit**

```bash
git add wordpress-theme/cwmbran-celtic-2025/template-teams.php \
        wordpress-theme/cwmbran-celtic-2025/functions.php
git commit -m "feat(cwmbran-theme): Walking Football in Teams hub + All Teams nav"
```

---

### Task 7: Verification pass

**Files:** none modified unless a check fails.

- [ ] **Step 1: Re-run the data tests and lint every touched file**

```bash
php _tests/wf-data-test.php
php -l functions.php
php -l template-walking-football.php
php -l template-teams.php
```
Expected: `all passed`, then `No syntax errors detected` three times.

- [ ] **Step 2: Confirm every outbound URL resolves**

```bash
php -r '
function add_action(){} function add_filter(){}
define("ABSPATH","/tmp/");
require "functions.php";
foreach (cc25_wf_links() as $k => $v) {
  if (strpos($v, "http") !== 0) continue;
  $code = trim(shell_exec("curl -s -o /dev/null -w %{http_code} -L " . escapeshellarg($v)));
  echo str_pad($k, 14), $code, "  ", $v, "\n";
}'
```
Expected: `200` for each URL on their own domain. A `404` means the path changed — fix the URL in `cc25_wf_links()` and re-run. Facebook and `wa.me` commonly return `400`/`403`/`302` to a bare curl; check those two in a browser rather than trusting the status code.

- [ ] **Step 3: Browser checks**

Requires the theme installed on a WordPress instance. Confirm:

- The page renders at its slug with header, footer and all eight sections.
- Teams hub shows six cards and the Walking Football card opens the page.
- All Teams dropdown lists Walking Football and it opens the page.
- At 390px wide: session cards, price cards and the timeline stack cleanly and nothing overflows horizontally; the hamburger menu shows the new item.
- The Celtic Bond link in the prices section reaches the club's Bond page.
- Tapping the phone number on a mobile opens the dialler.

- [ ] **Step 4: Report the open questions to Connor**

These were agreed in the spec as build-then-confirm. List them in the completion summary rather than guessing:

1. **Nick Beckett** is named as Chair/Founder on their site but is **not** used anywhere in this build — confirm whether he should be added.
2. **07919 323520** is published as the public contact number.
3. Prices £6 / £10 / £10 are still current.
4. Testimonial attribution: Emma's quote is attributed; the second runs as "A Cwmbran Celtic walking footballer" because their site's credit ("Our Arrie") is ambiguous. Confirm or supply the right name.
5. **Separate finding, not fixed here:** `template-bond.php:52` and `:56` describe walking football as "60+". Their sessions actually run from Under 50s upward and include women's Over 35s and all-ages mixed. Flag for Connor to approve a copy fix.

- [ ] **Step 5: Commit any fixes from this pass**

```bash
git add -A wordpress-theme/cwmbran-celtic-2025/
git commit -m "fix(cwmbran-theme): Walking Football verification fixes"
```

Skip if nothing changed.

---

## Deployment note

This theme is uploaded to WordPress as a zip; there is no automated deploy. After
merging, Connor uploads the theme and loads any wp-admin page once — the
version stamp bumped in Task 2 triggers `cc25_ensure_pages()` and creates the
Walking Football page if it does not already exist.
