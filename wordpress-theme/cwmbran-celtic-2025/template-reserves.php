<?php
/**
 * Template Name: Men's Reserves
 * Reserves team page — squad + a link to their fixtures.
 *
 * Holding cards, like the Women's page: the club crest and the player's name, ready
 * for real photography to replace them. Squad numbers and appearances are real —
 * both come from the match record — so the page says something true from day one
 * rather than being a list of names.
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$cc25_home = home_url('/');
$cc25_rsquad  = cc25_reserves_squad();
$cc25_rcap    = cc25_reserves_captain();
$cc25_rstats  = function_exists('cc25_player_stats') ? cc25_player_stats('reserves') : array();
$cc25_rlogo   = cc25_club_logo();
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
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head reveal">
      <div>
        <div class="sec-eye kick"><span class="ix">01</span><span class="ln"></span> Squad <?php echo esc_html(cc25_season()); ?></div>
        <h2>Reserves Squad</h2>
        <p class="sec-sub">Taken from the team sheets so far this season. More players as the season goes on.</p>
      </div>
    </div>
    <div class="pc-grid reveal">
      <?php foreach ($cc25_rsquad as $cc25_rp):
        /* Stats are keyed on the lowercased name, the same way the men's cards read
         * them. A player with no appearance yet simply has no line. */
        $cc25_rk = strtolower($cc25_rp['name']);
        $cc25_rs = $cc25_rstats[$cc25_rk] ?? null;
        $cc25_ric = $cc25_rp['name'] === $cc25_rcap;
      ?>
        <div class="wpc-card<?php echo $cc25_ric ? ' is-captain' : ''; ?>">
          <?php if (!empty($cc25_rp['no'])): ?>
            <span class="wpc-no" aria-hidden="true"><?php echo intval($cc25_rp['no']); ?></span>
          <?php endif; ?>
          <img class="wpc-crest" src="<?php echo esc_url($cc25_rlogo); ?>" alt="" aria-hidden="true" loading="lazy">
          <div class="wpc-name">
            <?php echo esc_html($cc25_rp['name']); ?>
            <small><?php
              $cc25_bits = array();
              if ($cc25_rp['pos'] !== '')  $cc25_bits[] = $cc25_rp['pos'] === 'GK' ? 'Goalkeeper' : $cc25_rp['pos'];
              if ($cc25_ric)               $cc25_bits[] = 'Captain';
              if ($cc25_rs && $cc25_rs['apps'] > 0) {
                  $cc25_bits[] = $cc25_rs['apps'] . ' app' . ($cc25_rs['apps'] === 1 ? '' : 's');
                  if ($cc25_rs['goals'] > 0) $cc25_bits[] = $cc25_rs['goals'] . ' goal' . ($cc25_rs['goals'] === 1 ? '' : 's');
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
<?php get_template_part('template-parts/site-footer'); ?>
