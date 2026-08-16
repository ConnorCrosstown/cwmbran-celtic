<?php
/**
 * Template Name: Men's Vets
 * Over-40s Vets team page — intro, a link to club news for their games, and the
 * registered squad as holding cards (crest + name), the same as the Women's and
 * Reserves pages, ready for real photography to replace them.
 *
 * No appearances on the cards: the Vets aren't in the match record the other
 * teams' stats are built from, so there is nothing true to show yet.
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$cc25_home = home_url('/');
$cc25_vsquad = cc25_vets_squad();
$cc25_vlogo  = cc25_club_logo();
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
  </div>
</section>

<?php if ($cc25_vsquad): ?>
<section class="band">
  <div class="wrap">
    <div class="sec-head reveal">
      <div>
        <div class="sec-eye kick"><span class="ix">01</span><span class="ln"></span> Squad <?php echo esc_html(cc25_season()); ?></div>
        <h2>Vets Squad</h2>
        <p class="sec-sub">The squad registered with the Welsh Veterans Football Association for this season.</p>
      </div>
    </div>
    <div class="pc-grid reveal">
      <?php foreach ($cc25_vsquad as $cc25_vp): ?>
        <div class="wpc-card">
          <img class="wpc-crest" src="<?php echo esc_url($cc25_vlogo); ?>" alt="" aria-hidden="true" loading="lazy">
          <div class="wpc-name"><?php echo esc_html($cc25_vp['name']); ?><small>Cwmbran Celtic</small></div>
        </div>
      <?php endforeach; ?>
    </div>
    <p class="spx-note reveal" style="color:var(--faint);margin-top:6px">Player photos coming soon.</p>
  </div>
</section>
<?php endif; ?>
<?php get_template_part('template-parts/site-footer'); ?>
