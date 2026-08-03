<?php
/**
 * Front Page — Cwmbran Celtic premium homepage.
 * Round 1: static premium design (live feed wired in Round 2).
 */
if (!defined('ABSPATH')) exit;
$feed     = cc25_feed();
$team     = 'mens';
$next     = cc25_next_fixture($feed, $team);
$result   = cc25_latest_result($feed, $team);
$upcoming = cc25_upcoming($feed, $team, 4);
$table    = cc25_table($feed, $team);
get_template_part('template-parts/site-header');
?>

<?php // Home-page takeover. Priority: MUSIC SHIRTS launch (from its embargo time),
// then a RESULT celebration (fireworks, every visit), then the next-home-game.
$cc25_kllive = cc25_kit_launch_live();
$cc25_kl     = cc25_kit_launch();
$cc25_klurl  = cc25_page_url('music-shirts', home_url('/'));
$cc25_kbase  = get_stylesheet_directory_uri() . '/assets/img/kit/';
$cc25_cel = cc25_result_celebration();
$cc25_hg  = cc25_next_home_fixture($feed, $team);
$cc25_hgo = $cc25_hg ? cc25_opponent($cc25_hg) : null;
if ($cc25_kllive): ?>
<div class="splash is-launch" id="cc25-splash" role="dialog" aria-modal="true" aria-labelledby="splash-title" data-always="1" data-key="music-shirts-2627" hidden>
  <div class="splash-bg" data-close></div>
  <div class="splash-card splash-launch">
    <button class="splash-x" type="button" aria-label="Close" data-close>&times;</button>
    <div class="splash-carousel" data-carousel>
      <div class="splash-track">
        <?php foreach ($cc25_kl['shirts'] as $s): ?>
        <div class="splash-slide">
          <img src="<?php echo esc_url($cc25_kbase . $s['img']); ?>" alt="<?php echo esc_attr($s['band'] . ' — ' . $s['label']); ?> shirt" loading="lazy">
          <span class="splash-slide-cap"><b><?php echo esc_html($s['band']); ?></b> &middot; <?php echo esc_html($s['label']); ?></span>
        </div>
        <?php endforeach; ?>
      </div>
      <button class="splash-arw prev" type="button" aria-label="Previous shirt">&lsaquo;</button>
      <button class="splash-arw next" type="button" aria-label="Next shirt">&rsaquo;</button>
      <div class="splash-dots"><?php foreach ($cc25_kl['shirts'] as $i => $s): ?><button type="button" class="<?php echo $i === 0 ? 'on' : ''; ?>" data-i="<?php echo $i; ?>" aria-label="Show shirt <?php echo $i + 1; ?>"></button><?php endforeach; ?></div>
    </div>
    <div class="splash-launch-body">
      <div class="splash-eye kick">Just launched &middot; 2026/27</div>
      <div class="splash-launch-title" id="splash-title">Music Shirts</div>
      <div class="splash-launch-bands">Super Furry Animals &middot; Mogwai &middot; Panic Shack &middot; Loose Articles</div>
      <div class="splash-launch-mvt">&#9733; 10% of every shirt supports <a href="<?php echo esc_url($cc25_kl['mvt_url']); ?>" target="_blank" rel="noopener"><b>Music Venue Trust</b></a></div>
      <div class="splash-cta">
        <a class="btn btn-gold" href="<?php echo esc_url($cc25_klurl); ?>">See the shirts</a>
        <a class="btn btn-outline" href="<?php echo esc_url($cc25_kl['shop_url']); ?>" target="_blank" rel="noopener">Pre-order</a>
      </div>
      <button class="splash-later" type="button" data-close>Maybe later</button>
    </div>
  </div>
</div>
<?php elseif (cc25_kit_launch_countdown()): $cc25_klts = cc25_kit_launch_ts(); ?>
<div class="splash is-countdown" id="cc25-splash" role="dialog" aria-modal="true" aria-labelledby="splash-title" data-always="1" data-key="ms-countdown" hidden>
  <div class="splash-bg" data-close></div>
  <div class="splash-card splash-cd">
    <button class="splash-x" type="button" aria-label="Close" data-close>&times;</button>
    <div class="splash-cd-eye kick">Dropping today &middot; 12:00 noon</div>
    <div class="splash-cd-title" id="splash-title">Music Shirts</div>
    <div class="splash-cd-sub">Four bands. One club. The 2026/27 reveal is almost here&hellip;</div>
    <div class="splash-count splash-cd-clock" data-ko="<?php echo intval($cc25_klts * 1000); ?>" aria-label="Countdown to the Music Shirts launch">
      <div class="u"><b data-d>00</b><span>Days</span></div>
      <div class="u"><b data-h>00</b><span>Hrs</span></div>
      <div class="u"><b data-m>00</b><span>Mins</span></div>
      <div class="u"><b data-s>00</b><span>Secs</span></div>
    </div>
    <div class="splash-cd-mvt">&#9733; 10% of the profit of every shirt supports Music Venue Trust</div>
    <button class="splash-later" type="button" data-close>Close</button>
  </div>
</div>
<?php elseif ($cc25_cel): ?>
<div class="splash is-result" id="cc25-splash" role="dialog" aria-modal="true" aria-labelledby="splash-title" data-key="result-<?php echo esc_attr($cc25_cel['opponent'] . '-' . intval($cc25_cel['us']) . '-' . intval($cc25_cel['them'])); ?>" hidden>
  <canvas class="splash-fw" aria-hidden="true"></canvas>
  <div class="splash-bg" data-close></div>
  <div class="splash-card">
    <button class="splash-x" type="button" aria-label="Close" data-close>&times;</button>
    <div class="splash-today"><span class="dot"></span> Full&nbsp;Time</div>
    <div class="splash-match splash-result" id="splash-title">
      <span class="splash-team"><?php echo cc25_own_crest(56); ?><span class="nm">Cwmbran Celtic</span></span>
      <span class="splash-score"><?php echo intval($cc25_cel['us']); ?><i>&ndash;</i><?php echo intval($cc25_cel['them']); ?></span>
      <span class="splash-team"><?php echo cc25_crest($feed, $cc25_cel['opponent'], 56); ?><span class="nm"><?php echo esc_html($cc25_cel['opponent']); ?></span></span>
    </div>
    <div class="splash-winline">What a result &mdash; get in, Celts!</div>
    <?php if ($cc25_hg): ?>
    <div class="splash-next">
      <div class="splash-next-eye kick">Next home game &middot; <?php echo esc_html(cc25_date($cc25_hg['date'] ?? 0, 'D j M')); ?> &middot; <?php echo esc_html(cc25_kickoff_label($cc25_hg)); ?></div>
      <div class="splash-next-match"><?php echo cc25_own_crest(28); ?> <span>Cwmbran Celtic</span> <em>vs</em> <?php echo cc25_crest($feed, $cc25_hgo['opponent'], 28); ?> <span><?php echo esc_html($cc25_hgo['opponent']); ?></span></div>
    </div>
    <?php endif; ?>
    <div class="splash-cta">
      <a class="btn btn-gold" href="<?php echo esc_url(cc25_ext_url('tickets')); ?>" target="_blank" rel="noopener">Buy Matchday Ticket</a>
      <?php if (cc25_season_tickets_on()): ?><a class="btn btn-outline" href="<?php echo esc_url(cc25_ext_url('tickets')); ?>" target="_blank" rel="noopener">Season Ticket</a><?php endif; ?>
    </div>
    <button class="splash-later" type="button" data-close>Maybe later</button>
  </div>
</div>
<?php elseif ($cc25_hg): $hgo = $cc25_hgo;
  // Is this home game TODAY? Flip the takeover into a bold "It's Matchday" state.
  $cc25_md = (cc25_date($cc25_hg['date'] ?? 0, 'Y-m-d') === date_i18n('Y-m-d')); ?>
<div class="splash<?php echo $cc25_md ? ' is-matchday' : ''; ?>" id="cc25-splash" role="dialog" aria-modal="true" aria-labelledby="splash-title" data-key="hg-<?php echo intval($cc25_hg['date'] ?? 0); ?><?php echo $cc25_md ? '-md' : ''; ?>" hidden>
  <div class="splash-bg" data-close></div>
  <div class="splash-card">
    <button class="splash-x" type="button" aria-label="Close" data-close>&times;</button>
    <?php if ($cc25_md): ?>
      <div class="splash-today"><span class="dot"></span> It's Matchday!</div>
    <?php else: ?>
      <div class="splash-eye kick">Next home game &middot; Motazone Arena</div>
    <?php endif; ?>
    <div class="splash-match" id="splash-title">
      <span class="splash-team"><?php echo cc25_own_crest(54); ?><span class="nm">Cwmbran Celtic</span></span>
      <span class="splash-vs">vs</span>
      <span class="splash-team"><?php echo cc25_crest($feed, $hgo['opponent'], 54); ?><span class="nm"><?php echo esc_html($hgo['opponent']); ?></span></span>
    </div>
    <div class="splash-meta"><?php echo $cc25_md ? 'Today' : esc_html(cc25_date($cc25_hg['date'] ?? 0, 'l j F')); ?> &middot; Kick-off <?php echo esc_html(cc25_kickoff_label($cc25_hg)); ?> &middot; Motazone Arena</div>
    <?php if ($cc25_md): ?><div class="splash-kolab kick">Kick-off in</div><?php endif; ?>
    <div class="splash-count" data-ko="<?php echo intval(cc25_kickoff_ms($cc25_hg)); ?>" aria-label="Countdown to kick-off">
      <div class="u"><b data-d>00</b><span>Days</span></div>
      <div class="u"><b data-h>00</b><span>Hrs</span></div>
      <div class="u"><b data-m>00</b><span>Mins</span></div>
      <div class="u"><b data-s>00</b><span>Secs</span></div>
    </div>
    <div class="splash-cta">
      <a class="btn btn-gold" href="<?php echo esc_url(cc25_ext_url('tickets')); ?>" target="_blank" rel="noopener">Buy Matchday Ticket</a>
      <?php if ($cc25_md): ?>
        <a class="btn btn-outline" href="<?php echo esc_url(cc25_page_url('travel', home_url('/'))); ?>">Travel &amp; Ground</a>
      <?php elseif (cc25_season_tickets_on()): ?>
        <a class="btn btn-outline" href="<?php echo esc_url(cc25_ext_url('tickets')); ?>" target="_blank" rel="noopener">Season Ticket</a>
      <?php else: ?>
        <a class="btn btn-outline" href="<?php echo esc_url(cc25_page_url('travel', home_url('/'))); ?>">Travel &amp; Ground</a>
      <?php endif; ?>
    </div>
    <button class="splash-later" type="button" data-close>Maybe later</button>
  </div>
</div>
<?php endif; ?>

<section class="hero">
  <div class="bgphoto has-photo" style="background-image:url('<?php echo esc_url(get_stylesheet_directory_uri() . '/assets/img/hero.jpg'); ?>')"></div><div class="streak"></div><div class="grain"></div>
  <div class="ghost">CELTIC</div>
  <div class="hero-in">
    <?php $cc25_hero_comp = ($next && !empty($next['competition'])) ? $next['competition'] : 'Ardal League South East'; ?>
    <span class="hero-eyebrow kick"><span class="ln"></span> <?php echo $next ? 'Next Match &middot; ' . esc_html($cc25_hero_comp) : 'Cwmbran Celtic AFC &middot; ' . esc_html($cc25_hero_comp); ?></span>
    <?php if ($next): ?>
    <h1><span class="sr-only">Cwmbran Celtic AFC — </span>Matchday<br><span class="thin">at the Motazone Arena</span></h1>
    <p class="hero-sub">Blue and yellow, since 1924. Follow the Celts through the <?php echo esc_html(cc25_season()); ?> season — every fixture, every result, live.</p>
    <div class="count" id="count" aria-label="Countdown to kick-off" data-ko="<?php echo intval(cc25_kickoff_ms($next)); ?>">
      <div class="u"><div class="n" id="cd-d">00</div><div class="l">Days</div></div>
      <div class="sep">:</div>
      <div class="u"><div class="n" id="cd-h">00</div><div class="l">Hrs</div></div>
      <div class="sep">:</div>
      <div class="u"><div class="n" id="cd-m">00</div><div class="l">Mins</div></div>
      <div class="sep">:</div>
      <div class="u"><div class="n" id="cd-s">00</div><div class="l">Secs</div></div>
    </div>
    <?php else: ?>
    <h1>Cwmbran Celtic AFC<br><span class="thin">The Celts &middot; Est. 1924</span></h1>
    <p class="hero-sub">Blue and yellow, since 1924. Follow the Celts through the <?php echo esc_html(cc25_season()); ?> season — every fixture, every result, and the road ahead.</p>
    <?php endif; ?>
  </div>
</section>

<?php if ($cc25_kllive): ?>
<a class="ms-roller" href="<?php echo esc_url($cc25_klurl); ?>" aria-label="Music Shirts 2026/27 — out now">
  <span class="ms-roll-track"><?php
    $cc25_roll_unit = str_repeat(
      '<span class="ms-roll-item">Music Shirts 2026/27</span><span class="ms-roll-dot">&#9917;</span>'
      . '<span class="ms-roll-item">Out now</span><span class="ms-roll-dot">&#9917;</span>'
      . '<span class="ms-roll-item">Super Furry Animals</span><span class="ms-roll-dot">&#9917;</span>'
      . '<span class="ms-roll-item">Mogwai</span><span class="ms-roll-dot">&#9917;</span>'
      . '<span class="ms-roll-item">Panic Shack</span><span class="ms-roll-dot">&#9917;</span>'
      . '<span class="ms-roll-item">Loose Articles</span><span class="ms-roll-dot">&#9917;</span>'
      . '<span class="ms-roll-item">10% to Music Venue Trust</span><span class="ms-roll-dot">&#9917;</span>'
      . '<span class="ms-roll-item">Shop now &rarr;</span><span class="ms-roll-dot">&#9917;</span>', 2);
    echo $cc25_roll_unit . $cc25_roll_unit; // duplicated for a seamless loop
  ?></span>
</a>
<?php endif; ?>

<?php if ($next):
  $o = cc25_opponent($next);
  $venue = $o['home'] ? '⚑ Motazone Arena' : '⚑ Away · ' . ($next['homeTeam'] ?? '');
?>
<div class="mcard-wrap">
  <div class="mcard">
    <div class="mcard-top">
      <span class="mc-tag"><span class="pulse"></span> Next Up</span>
      <span class="mc-comp"><?php echo esc_html($next['competition'] ?? 'Fixture'); ?></span>
      <span class="mc-venue"><?php echo esc_html($venue); ?></span>
    </div>
    <div class="mcard-body">
      <div class="mteam">
        <?php echo cc25_own_crest(60); ?>
        <div><div class="nm">Cwmbran Celtic</div><div class="rec"><?php echo $o['home'] ? 'At home' : 'On the road'; ?></div></div>
      </div>
      <div class="mko"><div class="t"><?php echo esc_html(cc25_kickoff_label($next)); ?></div><div class="d"><?php echo esc_html(cc25_date($next['date'] ?? 0, 'D j M')); ?></div></div>
      <div class="mteam away">
        <?php echo cc25_crest($feed, $o['opponent'], 60); ?>
        <div><div class="nm"><?php echo esc_html($o['opponent']); ?></div><div class="rec"><?php echo $o['home'] ? 'Visitors' : 'Hosts'; ?></div></div>
      </div>
    </div>
    <div class="mcard-foot">
      <a class="btn btn-navy btn-sm" href="<?php echo esc_url(cc25_page_url('fixtures', home_url('/'))); ?>">Fixtures</a>
      <?php if ($o['home']): // tickets only for home games — no tickets sold for away ?>
      <a class="btn btn-gold btn-sm" href="<?php echo esc_url(cc25_ext_url('tickets')); ?>" target="_blank" rel="noopener">Buy Tickets</a>
      <?php endif; ?>
      <a class="btn btn-navy btn-sm" href="<?php echo esc_url(cc25_travel_url($o['opponent'], $o['home'])); ?>">Travel &amp; Ground</a>
    </div>
  </div>
</div>
<?php endif; ?>

<div class="league-strip">
  <div class="wrap">
    <span class="ll">Proud members of</span>
    <img src="<?php echo esc_url(get_stylesheet_directory_uri() . '/assets/img/league-logos.jpg'); ?>" alt="Ardal League South East &amp; Genero Adran South" loading="lazy">
  </div>
</div>

<?php if ($cc25_kllive): ?>
<section class="sec" style="padding-top:40px;padding-bottom:0" aria-label="Music Shirts launch">
  <div class="wrap">
    <div class="kl-banner reveal">
      <div class="kl-banner-img"><img src="<?php echo esc_url($cc25_kbase . 'kit-sfa.jpg'); ?>" alt="Cwmbran Celtic 2026/27 Music Shirts" loading="lazy"></div>
      <div class="kl-banner-body">
        <div class="kl-banner-eye kick">New for 2026/27 &middot; Just launched</div>
        <h2>The Music Shirts are here</h2>
        <p>Super Furry Animals, Mogwai, Panic Shack &amp; Loose Articles &mdash; on the shirt. 10% of every sale to <a class="kl-inlink" href="<?php echo esc_url($cc25_kl['mvt_url']); ?>" target="_blank" rel="noopener">Music Venue Trust</a>.</p>
        <a class="kl-banner-cta" href="<?php echo esc_url($cc25_klurl); ?>">Read the story &amp; see all the shirts &rarr;</a>
      </div>
    </div>
  </div>
</section>
<?php endif; ?>

<section class="sec" style="padding-top:48px" aria-label="This season">
  <div class="wrap">
    <h2 class="sr-only">This season at a glance</h2>
    <div class="grid-2">
      <div class="panel reveal">
        <div class="panel-h"><h3>Latest Result</h3><span class="badge"><?php echo $result ? esc_html($result['competition'] ?? 'Full Time') : esc_html('Season ' . cc25_season()); ?></span></div>
        <div class="panel-b">
        <?php if ($result):
          $ro = cc25_opponent($result);
          $home = cc25_is_home($result);
          $cc = intval($home ? ($result['homeScore'] ?? 0) : ($result['awayScore'] ?? 0));
          $op = intval($home ? ($result['awayScore'] ?? 0) : ($result['homeScore'] ?? 0));
          $wdl = $cc > $op ? 'w' : ($cc < $op ? 'l' : 'd');
        ?>
          <div class="result">
            <div><?php echo cc25_own_crest(58); ?><div class="cn">Cwmbran<br>Celtic</div></div>
            <div class="sc"><?php echo $cc . '–' . $op; ?><small>Full Time</small></div>
            <div><?php echo cc25_crest($feed, $ro['opponent'], 58); ?><div class="cn"><?php echo esc_html($ro['opponent']); ?></div></div>
          </div>
          <div class="result-foot"><span class="wdl <?php echo $wdl; ?>"><?php echo strtoupper($wdl); ?></span> <?php echo esc_html(cc25_date($result['date'] ?? 0)); ?><?php echo !empty($result['scorers']) ? ' · ' . esc_html($result['scorers']) : ''; ?></div>
          <?php $cc25_rrl = cc25_match_report_url(cc25_date($result['date'] ?? 0, 'Y-m-d')); if ($cc25_rrl): ?>
          <a class="panel-more" href="<?php echo esc_url($cc25_rrl); ?>">Full match report &amp; stats &rarr;</a>
          <?php endif; ?>
        <?php else: ?>
          <p style="color:var(--muted);text-align:center;padding:22px 0;margin:0">No results yet — the new season is just around the corner.<br>Check back after the first whistle.</p>
        <?php endif; ?>
        <a class="panel-more" href="<?php echo esc_url(cc25_page_url('fixtures', home_url('/')) . '#results'); ?>">Results &amp; league table &rarr;</a>
        </div>
      </div>
      <div class="panel reveal d1">
        <div class="panel-h"><h3>Upcoming</h3><span class="badge">Next <?php echo count($upcoming); ?></span></div>
        <div class="panel-b">
          <div class="fx">
          <?php if ($upcoming): foreach ($upcoming as $f): $fo = cc25_opponent($f); ?>
            <div class="fx-row">
              <div class="fx-d"><div class="n"><?php echo esc_html(cc25_date($f['date'] ?? 0, 'j')); ?></div><div class="m"><?php echo esc_html(cc25_date($f['date'] ?? 0, 'M')); ?></div></div>
              <div class="fx-o"><?php echo cc25_crest($feed, $fo['opponent'], 30); ?> <?php echo esc_html($fo['opponent']); ?></div>
              <span class="fx-ha <?php echo $fo['home'] ? 'h' : 'a'; ?>"><?php echo $fo['home'] ? 'Home' : 'Away'; ?></span>
            </div>
          <?php endforeach; else: ?>
            <p style="color:var(--muted);padding:16px 2px;margin:0">Fixtures will appear here once the season is released.</p>
          <?php endif; ?>
          </div>
          <a class="panel-more" href="<?php echo esc_url(cc25_page_url('fixtures', home_url('/'))); ?>">All fixtures &rarr;</a>
        </div>
      </div>
    </div>
  </div>
</section>

<?php
// Latest match report(s) — highlighted from the games that have a written report.
$cc25_reports = cc25_match_reports(3);
if ($cc25_reports):
    $rf   = $cc25_reports[0];
    $rfh  = !empty($rf['home']); $rfopp = $rf['opp'];
    $rfcc = intval($rf['cc']); $rfoc = intval($rf['oc']);
    $rfwd = $rfcc > $rfoc ? 'w' : ($rfcc < $rfoc ? 'l' : 'd');
    $rfurl = cc25_match_report_url($rf['date']);
    $rfex  = wp_trim_words(wp_strip_all_tags($rf['report']), 40, ' …');
    $rfsc  = array();
    foreach (($rf['goals'] ?? array()) as $g) { $rfsc[] = $g['scorer'] . (!empty($g['pen']) ? ' (pen)' : '') . " " . intval($g['min']) . "'"; }
?>
<section class="sec" style="padding-top:0" aria-label="Latest match report">
  <div class="wrap">
    <div class="sec-head reveal">
      <div><div class="sec-eye kick"><span class="ln"></span> Match Centre</div><h2>Match Reports</h2></div>
      <a class="sec-more" href="<?php echo esc_url(cc25_page_url('fixtures', home_url('/')) . '#results'); ?>">All results &rarr;</a>
    </div>

    <a class="mrfeat reveal" href="<?php echo esc_url($rfurl); ?>">
      <div class="mrfeat-score">
        <span class="mrfeat-rb <?php echo $rfwd; ?>"><?php echo $rfwd === 'w' ? 'WIN' : ($rfwd === 'l' ? 'LOSS' : 'DRAW'); ?></span>
        <div class="mrfeat-teams">
          <span class="t"><?php echo $rfh ? cc25_own_crest(46) : cc25_res_crest($rfopp, 46); ?><b><?php echo esc_html($rfh ? 'Cwmbran Celtic' : $rfopp); ?></b></span>
          <span class="sc"><?php echo ($rfh ? $rfcc : $rfoc) . '<i>&ndash;</i>' . ($rfh ? $rfoc : $rfcc); ?></span>
          <span class="t"><?php echo $rfh ? cc25_res_crest($rfopp, 46) : cc25_own_crest(46); ?><b><?php echo esc_html($rfh ? $rfopp : 'Cwmbran Celtic'); ?></b></span>
        </div>
        <div class="mrfeat-comp"><?php echo esc_html($rf['comp']); ?> &middot; <?php echo esc_html(date('D j M Y', strtotime($rf['date']))); ?></div>
      </div>
      <div class="mrfeat-body">
        <div class="kick" style="color:var(--gold-deep)">Match Report</div>
        <h3><?php echo esc_html($rfh ? "Cwmbran Celtic {$rfcc}–{$rfoc} $rfopp" : "$rfopp {$rfoc}–{$rfcc} Cwmbran Celtic"); ?></h3>
        <?php if ($rfsc): ?><div class="mrfeat-scorers">&#9917; <?php echo esc_html(implode(' · ', $rfsc)); ?></div><?php endif; ?>
        <p><?php echo esc_html($rfex); ?></p>
        <?php if (!empty($rf['report_by'])): ?><div class="mrfeat-by">Words by <?php echo esc_html($rf['report_by']); ?></div><?php endif; ?>
        <span class="mrfeat-cta">Read the full report, stats &amp; line-ups &rarr;</span>
      </div>
    </a>

    <?php if (count($cc25_reports) > 1): ?>
    <div class="mrfeat-more">
      <?php foreach (array_slice($cc25_reports, 1) as $rm):
        $mh = !empty($rm['home']); $mo = $rm['opp']; $mcc = intval($rm['cc']); $moc = intval($rm['oc']);
        $mwd = $mcc > $moc ? 'w' : ($mcc < $moc ? 'l' : 'd'); $murl = cc25_match_report_url($rm['date']); ?>
      <a class="mrfeat-card" href="<?php echo esc_url($murl); ?>">
        <span class="mrfeat-rb <?php echo $mwd; ?>"><?php echo strtoupper($mwd); ?></span>
        <span class="cx"><?php echo $mh ? cc25_own_crest(26) : cc25_res_crest($mo, 26); ?><?php echo cc25_res_crest($mh ? $mo : 'Cwmbran Celtic', 26); ?></span>
        <span class="mx"><b><?php echo esc_html($mh ? "Cwmbran Celtic {$mcc}–{$moc} $mo" : "$mo {$moc}–{$mcc} Cwmbran Celtic"); ?></b><em><?php echo esc_html(date('j M Y', strtotime($rm['date']))); ?></em></span>
      </a>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>
  </div>
</section>
<?php endif; ?>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="tickets-band reveal<?php echo cc25_season_tickets_on() ? '' : ' tickets-band-2'; ?>">
      <?php if (cc25_season_tickets_on()): ?>
      <div class="tk-card tk-season">
        <div class="kick" style="color:var(--gold)">Season <?php echo esc_html(cc25_season()); ?></div>
        <h3>Season Tickets</h3>
        <p>Every home league game at Motazone Arena — the best-value way to back the Celts all season long.</p>
        <a class="btn btn-gold" href="<?php echo esc_url(cc25_ext_url('tickets')); ?>" target="_blank" rel="noopener">Get a Season Ticket</a>
      </div>
      <?php endif; ?>
      <div class="tk-card tk-match">
        <div class="kick" style="color:var(--blue-500)">Matchday</div>
        <h3>Matchday Tickets</h3>
        <p>Adults &pound;6 &middot; Concessions &pound;4 &middot; Under-16s free. Turn up and roar the Celts on.</p>
        <a class="btn btn-gold" href="<?php echo esc_url(cc25_ext_url('tickets')); ?>" target="_blank" rel="noopener">Buy a Matchday Ticket</a>
      </div>
      <div class="tk-card tk-bond">
        <div class="kick">The Celtic Bond &#9733;</div>
        <h3>Join the Bond</h3>
        <p>Win monthly cash prizes &amp; help fund the club — from just a few pounds a month.</p>
        <a class="btn btn-navy" href="<?php echo esc_url(cc25_page_url('celtic-bond', home_url('/'))); ?>">Join the Bond</a>
      </div>
    </div>
  </div>
</section>

<?php if ($table): ?>
<section class="sec sec-alt">
  <div class="wrap">
    <div class="sec-head reveal">
      <div><div class="sec-eye kick"><span class="ix">01</span><span class="ln"></span> The Table</div><h2>Ardal League South East</h2></div>
      <a class="viewall" href="<?php echo esc_url(cc25_page_url('fixtures', home_url('/'))); ?>">Full table &amp; results →</a>
    </div>
    <div class="table-wrap reveal d1">
      <div class="tscroll">
        <table class="lt tnum">
          <caption class="sr-only">Ardal League South East table — position, club, played, won, drawn, lost, goal difference, points</caption>
          <thead><tr><th scope="col">#</th><th scope="col" class="club">Club</th><th scope="col"><abbr title="Played">P</abbr></th><th scope="col"><abbr title="Won">W</abbr></th><th scope="col"><abbr title="Drawn">D</abbr></th><th scope="col"><abbr title="Lost">L</abbr></th><th scope="col"><abbr title="Goal difference">GD</abbr></th><th scope="col"><abbr title="Points">Pts</abbr></th></tr></thead>
          <tbody>
          <?php foreach ($table as $row):
            $own = strpos((string) ($row['club'] ?? ''), 'Cwmbran Celtic') !== false;
            $gd = intval($row['gd'] ?? 0);
          ?>
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
    </div>
  </div>
</section>
<?php endif; ?>

<section class="sec">
  <div class="wrap">
    <div class="sec-head reveal">
      <div><div class="sec-eye kick"><span class="ix">02</span><span class="ln"></span> From the Club</div><h2>Latest News</h2></div>
      <a class="viewall" href="<?php echo esc_url(cc25_page_url('news', home_url('/'))); ?>">All news &rarr;</a>
    </div>
    <?php
    $cc25_news = new WP_Query(array('post_type' => 'post', 'posts_per_page' => 4, 'ignore_sticky_posts' => true, 'category__not_in' => cc25_hidden_cat_ids()));
    if ($cc25_news->have_posts()) : $cc25_n = 0;
      while ($cc25_news->have_posts()) : $cc25_news->the_post(); $cc25_n++; $cc25_c = get_the_category();
        if ($cc25_n === 1) : ?>
    <div class="news-lead reveal d1">
      <div class="photo"><?php if (has_post_thumbnail()) the_post_thumbnail('large', array('style' => 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover')); else echo '<div class="fill"></div><div class="gr"></div>'; ?><?php if ($cc25_c) echo '<a class="tag" href="' . esc_url(get_category_link($cc25_c[0]->term_id)) . '">' . esc_html($cc25_c[0]->name) . '</a>'; ?></div>
      <div class="lb">
        <time datetime="<?php echo esc_attr(get_the_date('c')); ?>"><?php echo esc_html(get_the_date()); ?></time>
        <h3><a class="cardlink" href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
        <p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 26)); ?></p>
        <span class="viewall" style="margin-top:4px">Read more &rarr;</span>
      </div>
    </div>
    <div class="news-grid">
        <?php else : ?>
      <div class="ncard reveal">
        <div class="photo"><?php if (has_post_thumbnail()) the_post_thumbnail('medium_large', array('style' => 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover')); else echo '<div class="fill"></div><div class="gr"></div>'; ?><?php if ($cc25_c) echo '<a class="tag" href="' . esc_url(get_category_link($cc25_c[0]->term_id)) . '">' . esc_html($cc25_c[0]->name) . '</a>'; ?></div>
        <div class="ncb"><time datetime="<?php echo esc_attr(get_the_date('c')); ?>"><?php echo esc_html(get_the_date()); ?></time><h3><a class="cardlink" href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3><p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 16)); ?></p></div>
      </div>
        <?php endif;
      endwhile;
      if ($cc25_n > 1) echo '</div>';
      wp_reset_postdata();
    else : ?>
      <p style="color:var(--muted);padding:20px 0">Club news will appear here once posts are published.</p>
    <?php endif; ?>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="bond-band reveal">
      <div class="grain"></div>
      <div class="bond-left">
        <div class="kick" style="color:var(--gold);position:relative;z-index:2">The Celtic Bond &#9733;</div>
        <h2>Back the Celts &amp; win every month</h2>
        <p>Join the Celtic Bond — our monthly members' draw. Every membership directly funds the club's future, and you could scoop a cash prize each month. The more members, the stronger the Celts.</p>
        <div class="bond-cta">
          <a class="btn btn-gold" href="<?php echo esc_url(cc25_page_url('celtic-bond', home_url('/'))); ?>">Join the Bond</a>
          <a class="btn btn-ghost" href="<?php echo esc_url(cc25_page_url('celtic-bond', home_url('/'))); ?>">How it works</a>
        </div>
      </div>
      <div class="bond-badge"><span class="bond-star">&#9733;</span><span class="bond-label">Members'<br>Draw</span></div>
    </div>
  </div>
</section>

<section class="heritage">
  <div class="grain"></div><div class="ghost">1924</div>
  <div class="heritage-in">
    <div class="est"><div class="y">1924</div><div class="t">ESTABLISHED</div></div>
    <div class="reveal">
      <h2>A century of blue &amp; yellow in Cwmbran</h2>
      <p>From the valleys to the Ardal League, Cwmbran Celtic has been the heartbeat of local football for a hundred years — built on community, youth and the people of the town.</p>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="cta reveal">
      <div class="grain"></div>
      <div>
        <div class="kick" style="color:var(--gold);position:relative;z-index:2">Stay in the loop</div>
        <h2>Never miss a Celts matchday</h2>
        <p>Fixtures, results, ticket news and club updates — straight to your inbox, every week during the season.</p>
      </div>
      <form class="signup" id="cc25-signup" data-endpoint="<?php echo esc_url(cc25_signup_endpoint()); ?>" data-secret="<?php echo esc_attr(cc25_signup_secret()); ?>">
        <label for="cc25-fn">Join the mailing list</label>
        <div class="row">
          <input id="cc25-fn" name="name" type="text" placeholder="First name" aria-label="First name" autocomplete="given-name">
          <input id="cc25-em" name="email" type="email" required placeholder="you@email.com" aria-label="Email" autocomplete="email">
          <button class="btn btn-gold" type="submit">Sign up</button>
        </div>
        <?php /* Honeypot: real people leave this empty; bots fill it and get silently ignored. */ ?>
        <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden">
        <small class="cc25-signup-msg" aria-live="polite">Free · unsubscribe any time · we never share your details.</small>
      </form>
    </div>
  </div>
</section>

<?php $cc25_gal = cc25_latest_gallery(); if ($cc25_gal): ?>
<section class="sec galfeat" aria-label="Latest gallery">
  <div class="wrap">
    <div class="sec-head reveal">
      <div><div class="sec-eye kick"><span class="ln"></span> From the club</div><h2>Latest Gallery</h2></div>
      <a class="viewall" href="<?php echo esc_url(cc25_page_url('galleries', home_url('/'))); ?>">All galleries &rarr;</a>
    </div>
    <a class="galcard reveal" href="<?php echo esc_url(get_permalink($cc25_gal->ID)); ?>">
      <div class="galcard-img"><?php echo get_the_post_thumbnail($cc25_gal->ID, 'large', array('loading' => 'lazy', 'alt' => esc_attr(get_the_title($cc25_gal->ID)))); ?></div>
      <div class="galcard-body">
        <div class="kick" style="color:var(--gold)">Gallery &middot; <?php echo esc_html(get_the_date('j M Y', $cc25_gal->ID)); ?></div>
        <h3><?php echo esc_html(get_the_title($cc25_gal->ID)); ?></h3>
        <span class="btn btn-gold">View the gallery &rarr;</span>
      </div>
    </a>
  </div>
</section>
<?php endif; ?>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head reveal">
      <div><div class="sec-eye kick"><span class="ix">03</span><span class="ln"></span> Proudly supported by</div><h2>Our Sponsors</h2></div>
      <a class="viewall" href="<?php echo esc_url(cc25_page_url('sponsors', home_url('/'))); ?>">All sponsors →</a>
    </div>
    <?php $cc25_main = cc25_sponsor_main(); ?>
    <div class="sponsor-main reveal">
      <?php echo cc25_sponsor_logo($cc25_main['name'], $cc25_main['file'], isset($cc25_main['url']) ? $cc25_main['url'] : ''); ?>
    </div>
    <?php echo cc25_featured_sponsor_html('card'); ?>
    <div class="sponsor-wall reveal d1">
    <?php foreach (cc25_sponsors() as $s): ?>
      <div class="sponsor-card"><?php echo cc25_sponsor_logo($s[0], $s[1], isset($s[2]) ? $s[2] : '', ' loading="lazy"'); ?></div>
    <?php endforeach; ?>
    </div>
  </div>
</section>

<?php get_template_part('template-parts/site-footer'); ?>
