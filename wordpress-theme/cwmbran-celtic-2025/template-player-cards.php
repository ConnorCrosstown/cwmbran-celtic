<?php
/**
 * Template Name: Men's Player Cards
 * The Men's 1st Team squad shown as the club's designed player cards, grouped
 * by role. Cards are bundled in assets/img/player-cards/ (4:5). Click to enlarge.
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');

$cc25_pc_base = get_stylesheet_directory_uri() . '/assets/img/player-cards/';
$cc25_pc_dir  = get_stylesheet_directory() . '/assets/img/player-cards/';
$cc25_pc_groups = cc25_squad_players();
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">SQUAD</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('teams', home_url('/'))); ?>" style="color:var(--on-navy-dim)">Teams</a> / <span style="color:#fff">Men's 1st Team</span></div>
    <h1>Men's 1st Team</h1>
    <p>The players and management representing Cwmbran Celtic in the Ardal League South East.</p>
    <div class="teamsel"><a class="btn btn-gold btn-sm" href="<?php echo esc_url(cc25_page_url('fixtures', home_url('/')) . '#mens'); ?>">View First-Team fixtures &rarr;</a></div>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <?php $cc25_ix = 0; foreach ($cc25_pc_groups as $cc25_label => $cc25_cards): $cc25_ix++; ?>
      <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ix"><?php printf('%02d', $cc25_ix); ?></span><span class="ln"></span> <?php echo esc_html($cc25_label); ?></div><h2><?php echo esc_html($cc25_label); ?></h2></div></div>
      <div class="pc-grid reveal">
        <?php foreach ($cc25_cards as $cc25_c): $cc25_src = $cc25_pc_base . $cc25_c[1] . '.jpg'; $cc25_st = cc25_player_stat($cc25_c[0]); ?>
          <?php if (file_exists($cc25_pc_dir . $cc25_c[1] . '.jpg')): ?>
          <button class="pc-card" type="button" data-full="<?php echo esc_url($cc25_src); ?>" data-name="<?php echo esc_attr($cc25_c[0]); ?>"<?php if ($cc25_st): ?> data-apps="<?php echo intval($cc25_st['apps']); ?>" data-goals="<?php echo intval($cc25_st['goals']); ?>" data-assists="<?php echo intval($cc25_st['assists']); ?>"<?php endif; ?> aria-label="<?php echo esc_attr($cc25_c[0]); ?> &mdash; view player card and stats">
            <img src="<?php echo esc_url($cc25_src); ?>" alt="<?php echo esc_attr($cc25_c[0]); ?> &mdash; Cwmbran Celtic" loading="lazy" width="480" height="600">
          </button>
          <?php else: // No photo yet — holding card (same style as the women's placeholders). ?>
          <div class="wpc-card"><img class="wpc-crest" src="<?php echo esc_url(cc25_club_logo()); ?>" alt="" aria-hidden="true" loading="lazy"><div class="wpc-name"><?php echo esc_html($cc25_c[0]); ?><small>Cwmbran Celtic</small></div></div>
          <?php endif; ?>
        <?php endforeach; ?>
      </div>
    <?php endforeach; ?>
  </div>
</section>

<?php $cc25_ps = cc25_player_stats_sorted(); if ($cc25_ps): ?>
<section class="band" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> <?php echo esc_html(cc25_season()); ?></div><h2>Season Stats</h2></div></div>
    <div class="table-wrap reveal"><div class="tscroll">
      <table class="lt tnum">
        <thead><tr><th class="club">Player</th><th>Apps</th><th>Goals</th><th>Assists</th><th>Y</th><th>R</th></tr></thead>
        <tbody>
        <?php foreach ($cc25_ps as $cc25_p): ?>
          <tr><td class="club"><?php echo esc_html($cc25_p['name']); ?></td><td><?php echo intval($cc25_p['apps']); ?></td><td class="pts"><?php echo intval($cc25_p['goals']); ?></td><td><?php echo intval($cc25_p['assists']); ?></td><td><?php echo intval($cc25_p['yellows']); ?></td><td><?php echo intval($cc25_p['reds']); ?></td></tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </div></div>
    <p class="reveal" style="color:var(--faint);font-size:.82rem;margin-top:10px">Stats build up game-by-game from the official FAW match reports. Click any player card above to see their stats.</p>
  </div>
</section>
<?php endif; ?>

<div class="pc-lightbox" id="pc-lightbox" role="dialog" aria-modal="true" aria-label="Player card" hidden>
  <button class="pc-lb-close" type="button" aria-label="Close">&times;</button>
  <div class="pc-lb-inner">
    <img id="pc-lb-img" src="" alt="">
    <div class="pc-lb-meta" id="pc-lb-meta"></div>
  </div>
</div>
<?php get_template_part('template-parts/site-footer'); ?>
