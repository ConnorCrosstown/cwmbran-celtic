<?php
/**
 * Template Name: Men's Reserves
 * Reserves team page — intro + a link to their fixtures. (No squad cards yet.)
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$cc25_home = home_url('/');
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">RESERVES</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('teams', $cc25_home)); ?>" style="color:var(--on-navy-dim)">Teams</a> / <span style="color:#fff">Men's Reserves</span></div>
    <h1>Men's Reserves</h1>
    <p>The Celts' second string, competing in the Autocentre Gwent Premier Combination League.</p>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <div class="cta reveal">
      <div class="grain"></div>
      <div>
        <div class="kick" style="color:var(--gold);position:relative;z-index:2">Autocentre Gwent Premier Combination League</div>
        <h2>Follow the Reserves</h2>
        <p>See the full season's fixtures for the Reserves — home and away, every matchday.</p>
      </div>
      <div class="signup" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">
        <a class="btn btn-gold btn-block" href="<?php echo esc_url(cc25_page_url('fixtures', $cc25_home) . '#reserves'); ?>">View Reserves fixtures &rarr;</a>
      </div>
    </div>
    <p class="spx-note reveal">Player cards for the Reserves are coming soon.</p>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
