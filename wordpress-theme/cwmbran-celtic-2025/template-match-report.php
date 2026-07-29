<?php
/**
 * Template Name: Match Report
 * Premium match report driven by cc25_season_matches(). Reads ?g=<Y-m-d>;
 * defaults to the most recent game. Applies to the page with slug "match-report".
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$cc25_home = home_url('/');
$cc25_g = isset($_GET['g']) ? preg_replace('/[^0-9-]/', '', $_GET['g']) : '';
$m = cc25_get_match($cc25_g);
?>
<?php if (!$m): ?>
<div class="phero" style="min-height:auto"><div class="bg"></div><div class="grain"></div>
  <div class="phero-in"><h1>Match Report</h1><p>No match report available yet &mdash; check back after the next game.</p></div>
</div>
<?php else:
  $home = $m['home']; $opp = $m['opp']; $cc = intval($m['cc']); $oc = intval($m['oc']);
  $rd = strtotime($m['date']); $oppcrest = cc25_res_crest($opp, 64);
?>
<div class="phero mr-hero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">FULL&nbsp;TIME</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url($cc25_home); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('fixtures', $cc25_home)); ?>" style="color:var(--on-navy-dim)">Fixtures &amp; Results</a> / <span style="color:#fff">Match Report</span></div>
    <div class="mr-eye kick"><?php echo esc_html($m['comp']); ?> &middot; <?php echo esc_html(date('l j F Y', $rd)); ?></div>
    <div class="mr-score">
      <span class="mr-team"><?php echo $home ? cc25_own_crest(64) : $oppcrest; ?><span class="nm"><?php echo esc_html($home ? 'Cwmbran Celtic' : $opp); ?></span></span>
      <span class="mr-sc"><?php echo ($home ? $cc : $oc) . ' &ndash; ' . ($home ? $oc : $cc); ?><small>Full Time</small></span>
      <span class="mr-team"><?php echo $home ? $oppcrest : cc25_own_crest(64); ?><span class="nm"><?php echo esc_html($home ? $opp : 'Cwmbran Celtic'); ?></span></span>
    </div>
    <div class="mr-meta">&#9873; <?php echo esc_html($m['venue']); ?><?php if (!empty($m['att'])) echo ' &middot; Att ' . intval($m['att']); ?><?php if (!empty($m['ref'])) echo ' &middot; Ref ' . esc_html($m['ref']); ?></div>
  </div>
</div>

<section class="band">
  <div class="wrap mr-wrap">
    <div class="mr-main">
      <?php if (!empty($m['goals'])): ?>
      <div class="mr-block reveal">
        <h2 class="mr-h">Goals</h2>
        <ul class="mr-goals">
          <?php foreach ($m['goals'] as $g): ?>
            <li><span class="mr-min"><?php echo intval($g['min']); ?>&rsquo;</span> <b><?php echo esc_html($g['scorer']); ?></b><?php echo !empty($g['pen']) ? ' <em>(pen)</em>' : ''; ?><?php echo !empty($g['assist']) ? ' <span class="mr-assist">assist: ' . esc_html($g['assist']) . '</span>' : ''; ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
      <?php endif; ?>

      <?php if (!empty($m['report'])): ?>
      <div class="mr-block reveal">
        <h2 class="mr-h">Match Report</h2>
        <div class="mr-report"><?php foreach (explode("\n\n", $m['report']) as $cc25_para) { echo '<p>' . esc_html(trim($cc25_para)) . '</p>'; } ?></div>
      </div>
      <?php endif; ?>

      <?php
      $cc25_allcards = array();
      foreach (($m['cards'] ?? array()) as $c) { $cc25_allcards[] = array('t' => 'Cwmbran Celtic', 'p' => $c['player'], 'type' => $c['type'] ?? 'y', 'min' => $c['min'] ?? 0); }
      foreach (($m['opp_cards'] ?? array()) as $c) { $cc25_allcards[] = array('t' => $opp, 'p' => $c['player'], 'type' => $c['type'] ?? 'y', 'min' => $c['min'] ?? 0); }
      if ($cc25_allcards): ?>
      <div class="mr-block reveal">
        <h2 class="mr-h">Cards</h2>
        <ul class="mr-cards">
          <?php foreach ($cc25_allcards as $c): ?><li><span class="mr-cardbox <?php echo $c['type'] === 'r' ? 'r' : 'y'; ?>"></span><span class="mr-min"><?php echo intval($c['min']); ?>&rsquo;</span> <b><?php echo esc_html($c['p']); ?></b> <span style="color:var(--muted)">&mdash; <?php echo esc_html($c['t']); ?></span></li><?php endforeach; ?>
        </ul>
      </div>
      <?php endif; ?>
    </div>

    <aside class="mr-side">
      <div class="mr-block reveal">
        <h2 class="mr-h">Line-ups</h2>
        <?php
        $cc25_xi = function ($starters, $subs, $captain, $teamname) {
            echo '<div class="mr-lineup"><div class="mr-lt">' . esc_html($teamname) . '</div><ol class="mr-xi">';
            foreach ($starters as $i => $n) { echo '<li><span class="no">' . ($i + 1) . '</span>' . esc_html($n) . ($n === $captain ? ' <span class="cap">C</span>' : '') . '</li>'; }
            echo '</ol>';
            if ($subs) { echo '<div class="mr-subs-lbl">Subs</div><div class="mr-subs">' . esc_html(implode(', ', $subs)) . '</div>'; }
            echo '</div>';
        };
        $cc25_xi($m['starters'], $m['subs'] ?? array(), $m['captain'] ?? '', 'Cwmbran Celtic');
        if (!empty($m['opp_starters'])) $cc25_xi($m['opp_starters'], $m['opp_subs'] ?? array(), $m['opp_captain'] ?? '', $opp);
        ?>
      </div>
    </aside>
  </div>
</section>
<?php endif; ?>
<?php get_template_part('template-parts/site-footer'); ?>
