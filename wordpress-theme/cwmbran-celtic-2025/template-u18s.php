<?php
/**
 * Template Name: Under-18s
 * Under-18s team page — intro, their fixtures, and a squad section that appears only
 * once there are players to show.
 *
 * The squad is deliberately absent rather than an empty grid: the age group joined the
 * site with the club's fixture list of 10 Aug 2026 and the player list is coming later.
 * cc25_u18s_squad() returns none for now, and the section switches itself on when it
 * returns some — so adding the players is the only step, with no template change.
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$cc25_home    = home_url('/');
$cc25_squad   = function_exists('cc25_u18s_squad') ? cc25_u18s_squad() : array();
$cc25_stats   = function_exists('cc25_player_stats') ? cc25_player_stats('u18s') : array();
$cc25_logo    = cc25_club_logo();
$cc25_league  = cc25_static_fixtures()['u18s']['league'];
// Their next game, so the page says something current while the squad is still to come.
$cc25_card    = function_exists('cc25_next_up_card') ? cc25_next_up_card(cc25_feed(), 'u18s', 'Under-18s') : '';
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">U18s</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url($cc25_home); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('teams', $cc25_home)); ?>" style="color:var(--on-navy-dim)">Teams</a> / <span style="color:#fff">Under-18s</span></div>
    <h1>Under-18s</h1>
    <p>The next generation of Celts, competing in the <?php echo esc_html($cc25_league); ?> on Sunday afternoons.</p>
    <div class="teamsel">
      <a class="btn btn-gold btn-sm" href="<?php echo esc_url(cc25_page_url('fixtures', $cc25_home) . '#u18s'); ?>">View Under-18s fixtures &rarr;</a>
    </div>
  </div>
</div>

<?php if ($cc25_card): ?>
<section class="band band-tight">
  <div class="wrap">
    <?php // Not .mcard-wrap: that pulls the card up over the hero, which works on the
    // home page but here landed on top of the hero's own fixtures button. ?>
    <div class="nextup reveal"><div class="nextup-track"><?php echo $cc25_card; ?></div></div>
  </div>
</section>
<?php endif; ?>

<section class="band">
  <div class="wrap">
    <div class="cta reveal">
      <div class="grain"></div>
      <div>
        <div class="kick" style="color:var(--gold);position:relative;z-index:2"><?php echo esc_html($cc25_league); ?></div>
        <h2>Follow the Under-18s</h2>
        <p>Every fixture for the season &mdash; home and away, all on a Sunday.</p>
      </div>
      <div class="signup" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">
        <a class="btn btn-gold btn-block" href="<?php echo esc_url(cc25_page_url('fixtures', $cc25_home) . '#u18s'); ?>">View Under-18s fixtures &rarr;</a>
      </div>
    </div>
  </div>
</section>

<?php // The squad section only exists once there are players in it. An empty grid with
// "coming soon" under it says less than nothing.
if ($cc25_squad): ?>
<section class="band">
  <div class="wrap">
    <div class="sec-head reveal">
      <div>
        <div class="sec-eye kick"><span class="ix">01</span><span class="ln"></span> Squad <?php echo esc_html(cc25_season()); ?></div>
        <h2>Under-18s Squad</h2>
      </div>
    </div>
    <div class="pc-grid reveal">
      <?php foreach ($cc25_squad as $cc25_p):
        $cc25_k = strtolower($cc25_p['name']);
        $cc25_s = $cc25_stats[$cc25_k] ?? null;
      ?>
        <div class="wpc-card">
          <?php if (!empty($cc25_p['no'])): ?>
            <span class="wpc-no" aria-hidden="true"><?php echo intval($cc25_p['no']); ?></span>
          <?php endif; ?>
          <img class="wpc-crest" src="<?php echo esc_url($cc25_logo); ?>" alt="" aria-hidden="true" loading="lazy">
          <div class="wpc-name">
            <?php echo esc_html($cc25_p['name']); ?>
            <small><?php
              $cc25_bits = array();
              if (!empty($cc25_p['pos'])) $cc25_bits[] = $cc25_p['pos'] === 'GK' ? 'Goalkeeper' : $cc25_p['pos'];
              if ($cc25_s && $cc25_s['apps'] > 0) {
                  $cc25_bits[] = $cc25_s['apps'] . ' app' . ($cc25_s['apps'] === 1 ? '' : 's');
                  if ($cc25_s['goals'] > 0) $cc25_bits[] = $cc25_s['goals'] . ' goal' . ($cc25_s['goals'] === 1 ? '' : 's');
              }
              echo esc_html($cc25_bits ? implode(' · ', $cc25_bits) : 'Cwmbran Celtic');
            ?></small>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
    <p class="spx-note reveal" style="color:var(--faint);margin-top:6px">Player photos coming soon.</p>
  </div>
</section>
<?php endif; ?>

<section class="band band-tight">
  <div class="wrap">
    <div class="contact-more reveal">
      <div>
        <h3>Juniors &amp; Minis</h3>
        <p>Under 7 to Under 16, with a coach contact for every age group.</p>
        <a class="btn btn-sm btn-outline" href="<?php echo esc_url(cc25_juniors_url()); ?>">Age-group contacts &rarr;</a>
      </div>
      <div>
        <h3>Men's Reserves</h3>
        <p>Where most of this squad goes next &mdash; the Gwent Premier Combination.</p>
        <a class="btn btn-sm btn-outline" href="<?php echo esc_url(cc25_reserves_url()); ?>">Reserves squad &rarr;</a>
      </div>
    </div>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
