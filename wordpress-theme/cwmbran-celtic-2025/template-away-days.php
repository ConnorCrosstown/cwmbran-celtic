<?php
/**
 * Template Name: Away Days
 * Away-trip planner: per team, the upcoming away fixtures with ground name,
 * address, kick-off and directions. Applies to the page with slug "away-days".
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$cc25_home = home_url('/');
$cc25_sf   = cc25_static_fixtures();
$cc25_keys = array('mens' => 's-mens', 'reserves' => 's-res', 'womens' => 's-wom');
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">AWAY</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url($cc25_home); ?>">Home</a> / <span style="color:#fff">Away Days</span></div>
    <h1>Away Days</h1>
    <p>Planning a trip? Every upcoming away game &mdash; with the ground, address, kick-off and directions &mdash; for all three teams.</p>
    <div class="teamsel">
      <button class="on" data-team="s-mens">Men's First Team</button>
      <button data-team="s-res">Men's Reserves</button>
      <button data-team="s-wom">Women's First Team</button>
    </div>
  </div>
</div>

<?php $cc25_first = true; foreach (array('mens', 'reserves', 'womens') as $cc25_tk):
  $cc25_team = $cc25_sf[$cc25_tk];
  $cc25_away = cc25_away_fixtures($cc25_tk);
?>
<div class="teamwrap" id="team-<?php echo esc_attr($cc25_keys[$cc25_tk]); ?>"<?php echo $cc25_first ? '' : ' hidden'; ?>>
  <section class="band">
    <div class="wrap">
      <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> <?php echo esc_html($cc25_team['league']); ?></div><h2><?php echo esc_html($cc25_team['title']); ?> &mdash; Away Days</h2></div></div>
      <?php if (!$cc25_away): ?>
        <p style="color:var(--muted);padding:12px 0 34px">No upcoming away games right now &mdash; check back soon.</p>
      <?php else: ?>
      <div class="away-list reveal">
        <?php foreach ($cc25_away as $cc25_rf):
          $cc25_opp = $cc25_rf[1];
          $cc25_g   = cc25_away_ground_link($cc25_opp);
          $cc25_rd  = strtotime($cc25_rf[0]);
          $cc25_comp = (isset($cc25_rf[3]) && $cc25_rf[3] !== '') ? $cc25_rf[3] : 'League';
        ?>
          <div class="away-card">
            <div class="away-date"><b><?php echo date('d', $cc25_rd); ?></b><span><?php echo date('M', $cc25_rd); ?></span><em><?php echo date('D', $cc25_rd); ?></em></div>
            <div class="away-main">
              <div class="away-opp"><?php echo cc25_res_crest($cc25_opp, 34); ?><span class="nm"><?php echo esc_html($cc25_opp); ?></span><span class="away-tag"><?php echo esc_html($cc25_comp); ?></span></div>
              <div class="away-ground">
                <?php if ($cc25_g['known']): ?><strong><?php echo esc_html($cc25_g['ground']); ?></strong> &middot; <?php echo esc_html($cc25_g['addr']); ?><?php else: ?><span style="color:var(--faint)">Ground details to follow</span><?php endif; ?>
              </div>
              <div class="away-ko"><?php echo esc_html(date('l', $cc25_rd)); ?> &middot; Kick-off <?php echo esc_html(cc25_date(cc25_row_kickoff_ms($cc25_rf[0], $cc25_rf[1]), 'g:ia')); ?></div>
            </div>
            <a class="btn btn-gold btn-sm away-dir" href="<?php echo esc_url($cc25_g['url']); ?>" target="_blank" rel="noopener">Directions &rarr;</a>
          </div>
        <?php endforeach; ?>
      </div>
      <?php endif; ?>
    </div>
  </section>
</div>
<?php $cc25_first = false; endforeach; ?>
<?php get_template_part('template-parts/site-footer'); ?>
