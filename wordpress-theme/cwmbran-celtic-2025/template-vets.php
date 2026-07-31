<?php
/**
 * Template Name: Men's Vets
 * Over-40s Vets team page — intro + a link to club news for their games.
 * (No fixtures tab or squad cards yet — Vets aren't in the feed/static lists.)
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$cc25_home = home_url('/');
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">VETS</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('teams', $cc25_home)); ?>" style="color:var(--on-navy-dim)">Teams</a> / <span style="color:#fff">Men's Vets</span></div>
    <h1>Men's Vets</h1>
    <p>The Celts' Over-40s side, competing in Welsh Veterans Football Association (WVFA) competitions.</p>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <div class="cta reveal">
      <div class="grain"></div>
      <div>
        <div class="kick" style="color:var(--gold);position:relative;z-index:2">WVFA Over-40s Football</div>
        <h2>Follow the Vets</h2>
        <p>Cup ties, results and matchday details for the Vets are shared through the club's news &mdash; including their Workwear Supermarket O40s Cup campaign.</p>
      </div>
      <div class="signup" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">
        <a class="btn btn-gold btn-block" href="<?php echo esc_url(cc25_page_url('news', $cc25_home)); ?>">Latest club news &rarr;</a>
      </div>
    </div>
    <p class="spx-note reveal">Player cards for the Vets are coming soon.</p>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
