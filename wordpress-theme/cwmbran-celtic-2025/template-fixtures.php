<?php
/**
 * Template Name: Fixtures & Results
 * Live fixtures, results and league table from the cwmbran-celtic-feed plugin.
 */
if (!defined('ABSPATH')) exit;
$feed     = cc25_feed();
$team     = 'mens';
$upcoming = cc25_upcoming($feed, $team, 30);
// cc25_results(), not the raw feed: it merges hand-recorded scores in, so a
// result stays visible whether or not allwalessport has caught up. Already sorted
// newest first.
$results  = cc25_results($feed, $team);
$table    = cc25_table($feed, $team);
// The CDN holds anonymous HTML for thirty days, so this page can outlive its own
// standings. The script re-asks a no-store endpoint and swaps the rows if needed.
if (function_exists('ccf_enqueue_table_script')) ccf_enqueue_table_script();

// Fixture lists live in cc25_static_fixtures() (functions.php) so the home-page
// match ticker and this page stay in sync. Men's Reserves + Women's are NOT in
// the allwalessport feed, so those lists are hand-maintained there.
$cc25_sf            = cc25_static_fixtures();
$cc25_mens_fixtures = $cc25_sf['mens']['list'];
get_template_part('template-parts/site-header');
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">FIXTURES</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <span style="color:#fff">Fixtures &amp; Results</span></div>
    <h1>Fixtures &amp; Results</h1>
    <p>Every match, result and the live league table — updated automatically, hourly, from allwalessport.</p>
    <div class="teamsel">
<?php $cc25_first = true; foreach (cc25_fx_teams() as $cc25_k => $cc25_label): ?>
      <button<?php echo $cc25_first ? ' class="on"' : ''; ?> data-team="<?php echo esc_attr($cc25_k); ?>"><?php echo cc25_fx_esc_text($cc25_label); ?></button>
<?php $cc25_first = false; endforeach; ?>
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
      <?php cc25_render_static_fixtures($cc25_mens_fixtures, 'mens'); ?>
    </div>

    <div class="panel" id="results">
      <?php if ($results): $lm = ''; foreach ($results as $r): $ro = cc25_opponent($r);
        $home = cc25_is_home($r);
        $cc = intval($home ? ($r['homeScore'] ?? 0) : ($r['awayScore'] ?? 0));
        $op = intval($home ? ($r['awayScore'] ?? 0) : ($r['homeScore'] ?? 0));
        $cc25_frec = cc25_find_match(cc25_date($r['date'] ?? 0, 'Y-m-d'), 'mens');
        $cc25_fpens = $cc25_frec ? cc25_match_pens($cc25_frec) : null;
        $wdl = cc25_wdl($cc, $op, $cc25_fpens);
        $mo = cc25_date($r['date'] ?? 0, 'F Y'); if ($mo !== $lm) { $lm = $mo; echo '<div class="monthlab">' . esc_html($mo) . '</div>'; }
        /* The row used to be one big <a> to the match report. That made it
           impossible to put a link INSIDE it — an anchor within an anchor is
           invalid — so the men's results were the only ones on the site that
           could not offer a Programme button (audit FIX-5). It is a plain div
           now, with the same buttons every other team's results already use. */
        $cc25_fymd = cc25_date($r['date'] ?? 0, 'Y-m-d'); ?>
        <?php $oppCrest = cc25_crest($feed, $ro['opponent'], 34); // Home team + its score on the left. ?>
        <div class="mrow reveal">
          <div class="mdate"><div class="d"><?php echo esc_html(cc25_date($r['date'] ?? 0, 'd')); ?></div><div class="m"><?php echo esc_html(cc25_date($r['date'] ?? 0, 'M')); ?></div><div class="day"><?php echo esc_html(cc25_date($r['date'] ?? 0, 'D')); ?></div></div>
          <div class="mteams">
            <span class="mt<?php echo $home ? ' is-own' : ''; ?>"><?php echo $home ? cc25_own_crest(34) : $oppCrest; ?><span class="nm"><?php echo esc_html($home ? 'Cwmbran Celtic' : $ro['opponent']); ?></span></span>
            <span class="mscore"><?php echo ($home ? $cc : $op) . ' – ' . ($home ? $op : $cc); ?></span>
            <span class="mt right<?php echo $home ? '' : ' is-own'; ?>"><?php echo $home ? $oppCrest : cc25_own_crest(34); ?><span class="nm"><?php echo esc_html($home ? $ro['opponent'] : 'Cwmbran Celtic'); ?></span></span>
          </div>
          <div><span class="res-badge <?php echo $wdl; ?>"><?php echo cc25_wdl_label($wdl, (bool) $cc25_fpens, true); ?></span></div>
          <div class="mmeta"><div class="comp"><?php echo esc_html($r['competition'] ?? ''); ?><?php
            $cc25_fpl = cc25_pens_line($cc25_frec ?: array());
            echo $cc25_fpl !== '' ? ' <span class="pens">&middot; ' . esc_html($cc25_fpl) . '</span>' : ''; ?></div><span class="ha <?php echo $home ? 'h' : 'a'; ?>"><?php echo $home ? 'Home' : 'Away'; ?></span><?php
            echo cc25_match_link_buttons(function_exists('cc25_match_links') ? cc25_match_links('mens', $cc25_fymd) : array()); ?></div>
        </div>
      <?php endforeach; else: ?>
        <p style="color:var(--muted);padding:24px 2px">No results yet — the season is about to kick off.</p>
      <?php endif; ?>
    </div>

    <div class="panel" id="table">
      <?php $cc25_tmeta = cc25_table_meta(); ?>
      <div class="table-wrap reveal<?php echo $table ? '' : ' is-empty'; ?>" data-ccf-table="<?php echo esc_attr($team); ?>">
        <div class="tscroll">
          <table class="lt tnum">
            <caption class="sr-only">Ardal League South East table — position, club, played, won, drawn, lost, goal difference, points</caption>
            <thead><tr><th scope="col">#</th><th scope="col" class="club">Club</th><th scope="col"><abbr title="Played">P</abbr></th><th scope="col"><abbr title="Won">W</abbr></th><th scope="col"><abbr title="Drawn">D</abbr></th><th scope="col"><abbr title="Lost">L</abbr></th><th scope="col"><abbr title="Goal difference">GD</abbr></th><th scope="col"><abbr title="Points">Pts</abbr></th></tr></thead>
            <tbody><?php echo cc25_table_rows_html($feed, $table); ?></tbody>
          </table>
        </div>
        <div class="zone"><span><i style="background:var(--gold)"></i> Cwmbran Celtic</span><span style="margin-left:auto;color:var(--faint)">Live from allwalessport &middot; <span data-ccf-updated><?php
          echo $cc25_tmeta['label']
             ? esc_html(($cc25_tmeta['stale'] ? 'last updated ' : 'updated ') . $cc25_tmeta['label'])
             : 'updated hourly'; ?></span></span></div>
        <p class="lt-empty" data-ccf-empty style="color:var(--muted);padding:24px 2px"<?php echo $table ? ' hidden' : ''; ?>><?php
          echo esc_html(cc25_table_empty_message($cc25_tmeta['source'])); ?></p>
      </div>
    </div>

  </div>
</section>
</div><!-- /#team-mens -->

<?php foreach (cc25_fx_teams() as $cc25_k => $cc25_label):
    if ($cc25_k === 'mens') continue;                       // bespoke block above
    if (!isset($cc25_sf[$cc25_k])) continue;                // no fixture list yet
    $cc25_meta = cc25_fx_team_meta($cc25_k);
    $cc25_squad = cc25_fx_squad_url($cc25_k);
    // Control-only PHP tags below sit at column 0: PHP eats the newline after a
    // closing tag, so leading whitespace here would be prepended to the next
    // line's output (unlike the indented control tags in the untouched Men's
    // block above — don't "tidy" these to match, it would change the rendered bytes).
?>
<div class="teamwrap" id="team-<?php echo esc_attr($cc25_k); ?>" hidden>
  <section class="band">
    <div class="wrap">
      <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> <?php echo esc_html($cc25_sf[$cc25_k]['league']); ?></div><h2><?php echo cc25_fx_esc_text($cc25_label); ?> &mdash; Fixtures &amp; Results</h2></div></div>
<?php if ($cc25_squad !== ''): ?>
      <div class="team-links reveal">
        <a class="btn btn-navy btn-sm" href="<?php echo esc_url($cc25_squad); ?>"><?php echo cc25_fx_esc_text($cc25_meta['squad_label']); ?> &rarr;</a>
      </div>
<?php endif; ?>
      <div class="tabs reveal">
        <button class="tab on" data-t="<?php echo esc_attr($cc25_k); ?>-fx">Fixtures</button>
        <button class="tab" data-t="<?php echo esc_attr($cc25_k); ?>-res">Results</button>
      </div>
      <div class="panel on" id="<?php echo esc_attr($cc25_k); ?>-fx"><?php cc25_render_static_fixtures($cc25_sf[$cc25_k]['list'], $cc25_k); ?></div>
      <div class="panel" id="<?php echo esc_attr($cc25_k); ?>-res"><?php cc25_render_static_results($cc25_k); ?></div>
    </div>
  </section>
</div><!-- /#team-<?php echo esc_attr($cc25_k); ?> -->
<?php endforeach; ?>
<?php get_template_part('template-parts/site-footer'); ?>
