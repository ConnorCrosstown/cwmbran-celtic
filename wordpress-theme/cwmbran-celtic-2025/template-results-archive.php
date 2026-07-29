<?php
/**
 * Template Name: 2025-26 Results
 * Archive of the 2025/26 Cymru South season results (data in cc25_results_2526).
 * Applies to the page with slug "2025-26-archive".
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$cc25_home = home_url('/');
$cc25_res  = cc25_results_2526();
$cc25_p = $cc25_w = $cc25_d = $cc25_l = $cc25_gf = $cc25_ga = 0;
foreach ($cc25_res as $r) { $cc25_p++; $cc25_gf += $r[3]; $cc25_ga += $r[4]; if ($r[3] > $r[4]) $cc25_w++; elseif ($r[3] < $r[4]) $cc25_l++; else $cc25_d++; }
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">2025/26</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url($cc25_home); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('fixtures', $cc25_home)); ?>" style="color:var(--on-navy-dim)">Fixtures &amp; Results</a> / <span style="color:#fff">2025/26</span></div>
    <h1>2025/26 Season</h1>
    <p>Every result from the Celts' 2025/26 campaign in the Cymru South.</p>
    <div class="teamsel"><a class="btn btn-gold btn-sm" href="<?php echo esc_url(cc25_page_url('fixtures', $cc25_home)); ?>">This season's fixtures &rarr;</a></div>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <div class="arch-summary reveal">
      <div class="as-stat"><b><?php echo $cc25_p; ?></b><span>Played</span></div>
      <div class="as-stat"><b><?php echo $cc25_w; ?></b><span>Won</span></div>
      <div class="as-stat"><b><?php echo $cc25_d; ?></b><span>Drawn</span></div>
      <div class="as-stat"><b><?php echo $cc25_l; ?></b><span>Lost</span></div>
      <div class="as-stat"><b><?php echo $cc25_gf; ?></b><span>For</span></div>
      <div class="as-stat"><b><?php echo $cc25_ga; ?></b><span>Against</span></div>
    </div>
    <p class="reveal" style="color:var(--muted);max-width:660px;margin:10px 0 30px">A tough campaign ended in relegation from the Cymru South &mdash; and a fresh start in the Ardal League South East for 2026/27.</p>

    <?php $cc25_lm = ''; foreach ($cc25_res as $r):
      $rd = strtotime($r[0]); $home = $r[1]; $opp = $r[2]; $cc = intval($r[3]); $oc = intval($r[4]);
      $wdl = $cc > $oc ? 'w' : ($cc < $oc ? 'l' : 'd');
      $hs = $home ? $cc : $oc; $as = $home ? $oc : $cc;
      $oppcrest = cc25_res_crest($opp, 34);
      $mo = date('F Y', $rd); if ($mo !== $cc25_lm) { $cc25_lm = $mo; echo '<div class="monthlab">' . esc_html($mo) . '</div>'; }
    ?>
      <a class="mrow reveal" href="<?php echo esc_url($r[5]); ?>">
        <div class="mdate"><div class="d"><?php echo date('d', $rd); ?></div><div class="m"><?php echo date('M', $rd); ?></div><div class="day"><?php echo date('D', $rd); ?></div></div>
        <div class="mteams">
          <span class="mt<?php echo $home ? ' is-own' : ''; ?>"><?php echo $home ? cc25_own_crest(34) : $oppcrest; ?><span class="nm"><?php echo esc_html($home ? 'Cwmbran Celtic' : $opp); ?></span></span>
          <span class="mscore"><?php echo $hs . ' – ' . $as; ?></span>
          <span class="mt right<?php echo $home ? '' : ' is-own'; ?>"><?php echo $home ? $oppcrest : cc25_own_crest(34); ?><span class="nm"><?php echo esc_html($home ? $opp : 'Cwmbran Celtic'); ?></span></span>
        </div>
        <div><span class="res-badge <?php echo $wdl; ?>"><?php echo strtoupper($wdl); ?></span></div>
        <div class="mmeta"><div class="comp">Cymru South</div><span class="ha <?php echo $home ? 'h' : 'a'; ?>"><?php echo $home ? 'Home' : 'Away'; ?></span></div>
      </a>
    <?php endforeach; ?>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
