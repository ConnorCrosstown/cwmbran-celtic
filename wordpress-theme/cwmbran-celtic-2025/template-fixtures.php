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

// Men's Reserves — Autocentre Gwent Premier Combination League. Their league is
// NOT in the allwalessport feed, so this fixture list is maintained here by hand.
// Each: [date Y-m-d, opponent, isHome(bool), competition].
$cc25_res_league = 'Autocentre Gwent Premier Combination League';
$cc25_reserves = array(
    array('2026-08-08', 'Rogerstone', false, 'League Cup R1'),
    array('2026-08-15', 'Croesyceiliog', false, 'League'),
    array('2026-08-22', 'Rogerstone', true, 'League'),
    array('2026-08-29', 'Abercarn United', false, 'League'),
    array('2026-09-05', 'Tredegar Town', true, 'League'),
    array('2026-09-12', 'Chepstow Town', false, 'League'),
    array('2026-09-19', 'Cwmbran Town', true, 'League'),
    array('2026-09-26', 'Abertillery Excelsiors', true, 'League'),
    array('2026-10-03', 'New Inn', false, 'League'),
    array('2026-10-10', 'Undy', true, 'League'),
    array('2026-10-17', 'Newport Corinthians', false, 'League'),
    array('2026-10-24', 'Lliswerry', true, 'League'),
    array('2026-10-31', 'Abertillery Bluebirds', false, 'League'),
    array('2026-11-07', 'Blaenavon Blues', true, 'League'),
    array('2026-11-14', 'Blaenavon Blues', false, 'League'),
    array('2026-11-21', 'Croesyceiliog', true, 'League'),
    array('2026-11-28', 'Rogerstone', false, 'League'),
    array('2026-12-05', 'Abercarn United', true, 'League'),
    array('2026-12-12', 'Tredegar Town', false, 'League'),
    array('2026-12-19', 'Chepstow Town', true, 'League'),
    array('2027-01-09', 'New Inn', true, 'League'),
    array('2027-01-16', 'Undy', false, 'League'),
    array('2027-01-23', 'Newport Corinthians', true, 'League'),
    array('2027-01-30', 'Lliswerry', false, 'League'),
    array('2027-02-06', 'Abertillery Bluebirds', true, 'League'),
    array('2027-02-13', 'Cwmbran Town', false, 'League'),
    array('2027-02-20', 'Abertillery Excelsiors', false, 'League'),
);
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
      <button disabled>Ladies <small>coming soon</small></button>
    </div>
  </div>
</div>

<div class="teamwrap" id="team-mens">
<div class="tabs">
  <div class="tabs-in">
    <button class="tab on" data-t="fixtures">Fixtures</button>
    <button class="tab" data-t="results">Results</button>
    <button class="tab" data-t="table">League Table</button>
  </div>
</div>

<section class="band">
  <div class="wrap">

    <div class="panel on" id="fixtures">
      <?php if ($upcoming): $lm = ''; foreach ($upcoming as $f): $fo = cc25_opponent($f); $isHome = $fo['home'];
        // List the HOME team on the left, away on the right (standard listing).
        $oppCrest = cc25_crest($feed, $fo['opponent'], 34);
        $mo = cc25_date($f['date'] ?? 0, 'F Y'); if ($mo !== $lm) { $lm = $mo; echo '<div class="monthlab">' . esc_html($mo) . '</div>'; } ?>
        <div class="mrow reveal">
          <div class="mdate"><div class="d"><?php echo esc_html(cc25_date($f['date'] ?? 0, 'd')); ?></div><div class="m"><?php echo esc_html(cc25_date($f['date'] ?? 0, 'M')); ?></div><div class="day"><?php echo esc_html(cc25_date($f['date'] ?? 0, 'D')); ?></div></div>
          <div class="mteams">
            <span class="mt<?php echo $isHome ? ' is-own' : ''; ?>"><?php echo $isHome ? cc25_own_crest(34) : $oppCrest; ?><span class="nm"><?php echo esc_html($isHome ? 'Cwmbran Celtic' : $fo['opponent']); ?></span></span>
            <span class="mvs">vs</span>
            <span class="mt right<?php echo $isHome ? '' : ' is-own'; ?>"><?php echo $isHome ? $oppCrest : cc25_own_crest(34); ?><span class="nm"><?php echo esc_html($isHome ? $fo['opponent'] : 'Cwmbran Celtic'); ?></span></span>
          </div>
          <div class="mscore"><?php echo esc_html(cc25_kickoff_label($f)); ?></div>
          <div class="mmeta"><div class="comp"><?php echo esc_html($f['competition'] ?? ''); ?></div><span class="ha <?php echo $isHome ? 'h' : 'a'; ?>"><?php echo $isHome ? 'Home' : 'Away'; ?></span></div>
        </div>
      <?php endforeach; else: ?>
        <p style="color:var(--muted);padding:24px 2px">Fixtures will appear here once the season is released.</p>
      <?php endif; ?>
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
      <div class="panel on">
        <?php $lm = ''; foreach ($cc25_reserves as $rf):
          $rd = strtotime($rf[0]); $home = $rf[2]; $opp = $rf[1]; $comp = $rf[3];
          $mo = date('F Y', $rd); if ($mo !== $lm) { $lm = $mo; echo '<div class="monthlab">' . esc_html($mo) . '</div>'; }
          $oppCrest = cc25_crest($feed, $opp, 34); ?>
        <div class="mrow mrow-res reveal">
          <div class="mdate"><div class="d"><?php echo date('d', $rd); ?></div><div class="m"><?php echo date('M', $rd); ?></div><div class="day"><?php echo date('D', $rd); ?></div></div>
          <div class="mteams">
            <span class="mt<?php echo $home ? ' is-own' : ''; ?>"><?php echo $home ? cc25_own_crest(34) : $oppCrest; ?><span class="nm"><?php echo esc_html($home ? 'Cwmbran Celtic' : $opp); ?></span></span>
            <span class="mvs">vs</span>
            <span class="mt right<?php echo $home ? '' : ' is-own'; ?>"><?php echo $home ? $oppCrest : cc25_own_crest(34); ?><span class="nm"><?php echo esc_html($home ? $opp : 'Cwmbran Celtic'); ?></span></span>
          </div>
          <div class="mmeta"><div class="comp"><?php echo esc_html($comp); ?></div><span class="ha <?php echo $home ? 'h' : 'a'; ?>"><?php echo $home ? 'Home' : 'Away'; ?></span></div>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>
</div><!-- /#team-reserves -->
<?php get_template_part('template-parts/site-footer'); ?>
