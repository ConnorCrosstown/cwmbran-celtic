<?php
/**
 * Template Name: Fixtures & Results
 * Live fixtures, results and league table from the cwmbran-celtic-feed plugin.
 */
if (!defined('ABSPATH')) exit;
$feed     = cc25_feed();
$team     = 'mens';
$upcoming = cc25_upcoming($feed, $team, 30);
$results  = cc25_team_items($feed['results'] ?? array(), $team);
usort($results, function ($a, $b) { return ($b['date'] ?? 0) <=> ($a['date'] ?? 0); });
$table    = cc25_table($feed, $team);

// Fixture lists live in cc25_static_fixtures() (functions.php) so the home-page
// match ticker and this page stay in sync. Men's Reserves + Women's are NOT in
// the allwalessport feed, so those lists are hand-maintained there.
$cc25_sf            = cc25_static_fixtures();
$cc25_mens_fixtures = $cc25_sf['mens']['list'];
$cc25_res_league    = $cc25_sf['reserves']['league'];
$cc25_reserves      = $cc25_sf['reserves']['list'];
$cc25_womens_league = $cc25_sf['womens']['league'];
$cc25_womens        = $cc25_sf['womens']['list'];
get_template_part('template-parts/site-header');
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">FIXTURES</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <span style="color:#fff">Fixtures &amp; Results</span></div>
    <h1>Fixtures &amp; Results</h1>
    <p>Every match, result and the live league table — updated automatically, hourly, from allwalessport.</p>
    <div class="teamsel">
      <button class="on" data-team="mens">Men's First Team</button>
      <button data-team="reserves">Men's Reserves</button>
      <button data-team="womens">Women's First Team</button>
    </div>
  </div>
</div>

<div class="teamwrap" id="team-mens">
<section class="band" style="padding:38px 0 18px">
  <div class="wrap">
    <div class="sec-head reveal" style="margin-bottom:0"><div><div class="sec-eye kick"><span class="ln"></span> <?php echo esc_html($cc25_sf['mens']['league']); ?></div><h2>Men's First Team &mdash; Fixtures</h2></div></div>
  </div>
</section>
<div class="tabs">
  <div class="tabs-in">
    <button class="tab on" data-t="fixtures">Fixtures</button>
    <button class="tab" data-t="results">Results</button>
    <button class="tab" data-t="table">League Table</button>
  </div>
</div>

<section class="band">
  <div class="wrap">

    <div class="team-links reveal">
      <a class="btn btn-navy btn-sm" href="<?php echo esc_url(cc25_page_url(array('mens-team', 'mens-1st-team'), home_url('/'))); ?>">Men's First Team squad &rarr;</a>
      <a class="btn btn-gold btn-sm" href="<?php echo esc_url(cc25_ext_url('tickets')); ?>" target="_blank" rel="noopener">Buy Tickets</a>
    </div>

    <div class="panel on" id="fixtures">
      <?php cc25_render_static_fixtures($cc25_mens_fixtures, cc25_ext_url('tickets')); ?>
    </div>

    <div class="panel" id="results">
      <?php if ($results): $lm = ''; foreach ($results as $r): $ro = cc25_opponent($r);
        $home = ($r['homeAway'] ?? 'H') === 'H';
        $cc = intval($home ? ($r['homeScore'] ?? 0) : ($r['awayScore'] ?? 0));
        $op = intval($home ? ($r['awayScore'] ?? 0) : ($r['homeScore'] ?? 0));
        $wdl = $cc > $op ? 'w' : ($cc < $op ? 'l' : 'd');
        $mo = cc25_date($r['date'] ?? 0, 'F Y'); if ($mo !== $lm) { $lm = $mo; echo '<div class="monthlab">' . esc_html($mo) . '</div>'; } ?>
        <?php $oppCrest = cc25_crest($feed, $ro['opponent'], 34); // Home team + its score on the left. ?>
        <div class="mrow reveal">
          <div class="mdate"><div class="d"><?php echo esc_html(cc25_date($r['date'] ?? 0, 'd')); ?></div><div class="m"><?php echo esc_html(cc25_date($r['date'] ?? 0, 'M')); ?></div><div class="day"><?php echo esc_html(cc25_date($r['date'] ?? 0, 'D')); ?></div></div>
          <div class="mteams">
            <span class="mt<?php echo $home ? ' is-own' : ''; ?>"><?php echo $home ? cc25_own_crest(34) : $oppCrest; ?><span class="nm"><?php echo esc_html($home ? 'Cwmbran Celtic' : $ro['opponent']); ?></span></span>
            <span class="mscore"><?php echo ($home ? $cc : $op) . ' – ' . ($home ? $op : $cc); ?></span>
            <span class="mt right<?php echo $home ? '' : ' is-own'; ?>"><?php echo $home ? $oppCrest : cc25_own_crest(34); ?><span class="nm"><?php echo esc_html($home ? $ro['opponent'] : 'Cwmbran Celtic'); ?></span></span>
          </div>
          <div><span class="res-badge <?php echo $wdl; ?>"><?php echo strtoupper($wdl); ?></span></div>
          <div class="mmeta"><div class="comp"><?php echo esc_html($r['competition'] ?? ''); ?></div><span class="ha <?php echo $home ? 'h' : 'a'; ?>"><?php echo $home ? 'Home' : 'Away'; ?></span></div>
        </div>
      <?php endforeach; else: ?>
        <p style="color:var(--muted);padding:24px 2px">No results yet — the season is about to kick off.</p>
      <?php endif; ?>
    </div>

    <div class="panel" id="table">
      <?php if ($table): ?>
      <div class="table-wrap reveal">
        <div class="tscroll">
          <table class="lt tnum">
            <thead><tr><th>#</th><th class="club">Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead>
            <tbody>
            <?php foreach ($table as $row): $own = strpos((string) ($row['club'] ?? ''), 'Cwmbran Celtic') !== false; $gd = intval($row['gd'] ?? 0); ?>
              <tr<?php echo $own ? ' class="own"' : ''; ?>>
                <td class="pos"><?php echo intval($row['position'] ?? 0); ?></td>
                <td class="club"><?php echo cc25_crest($feed, $row['club'] ?? '', 26); ?> <?php echo esc_html($row['club'] ?? ''); ?></td>
                <td><?php echo intval($row['played'] ?? 0); ?></td>
                <td><?php echo intval($row['won'] ?? 0); ?></td>
                <td><?php echo intval($row['drawn'] ?? 0); ?></td>
                <td><?php echo intval($row['lost'] ?? 0); ?></td>
                <td><?php echo ($gd > 0 ? '+' : '') . $gd; ?></td>
                <td class="pts"><?php echo intval($row['points'] ?? 0); ?></td>
              </tr>
            <?php endforeach; ?>
            </tbody>
          </table>
        </div>
        <div class="zone"><span><i style="background:var(--gold)"></i> Cwmbran Celtic</span><span style="margin-left:auto;color:var(--faint)">Live from allwalessport · updated hourly</span></div>
      </div>
      <?php else: ?>
        <p style="color:var(--muted);padding:24px 2px">The league table will appear here once the season is underway.</p>
      <?php endif; ?>
    </div>

  </div>
</section>
</div><!-- /#team-mens -->

<div class="teamwrap" id="team-reserves" hidden>
  <section class="band">
    <div class="wrap">
      <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> <?php echo esc_html($cc25_res_league); ?></div><h2>Men's Reserves &mdash; Fixtures</h2></div></div>
      <div class="team-links reveal">
        <a class="btn btn-navy btn-sm" href="<?php echo esc_url(cc25_reserves_url()); ?>">Men's Reserves &rarr;</a>
      </div>
      <div class="panel on"><?php cc25_render_static_fixtures($cc25_reserves); ?></div>
    </div>
  </section>
</div><!-- /#team-reserves -->

<div class="teamwrap" id="team-womens" hidden>
  <section class="band">
    <div class="wrap">
      <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> <?php echo esc_html($cc25_womens_league); ?></div><h2>Women's First Team &mdash; Fixtures</h2></div></div>
      <div class="team-links reveal">
        <a class="btn btn-navy btn-sm" href="<?php echo esc_url(cc25_page_url(array('ladies-team', 'ladies-1st-team'), home_url('/'))); ?>">Women's First Team squad &rarr;</a>
      </div>
      <div class="panel on"><?php cc25_render_static_fixtures($cc25_womens); ?></div>
    </div>
  </section>
</div><!-- /#team-womens -->
<?php get_template_part('template-parts/site-footer'); ?>
