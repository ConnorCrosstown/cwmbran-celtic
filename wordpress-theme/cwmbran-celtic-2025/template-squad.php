<?php
/**
 * Template Name: Squad
 * Premium squad grid pulled LIVE from SportsPress players (sp_player).
 * Groups by position; degrades gracefully if a field/photo is missing.
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');

$cc25_players = get_posts(array(
    'post_type'   => 'sp_player',
    'numberposts' => -1,
    'orderby'     => 'menu_order',
    'order'       => 'ASC',
));

// Group by SportsPress position taxonomy, in football order.
$cc25_order = array('Goalkeeper', 'Defender', 'Midfielder', 'Forward');
$cc25_groups = array();
foreach ($cc25_players as $pl) {
    $terms = get_the_terms($pl->ID, 'sp_position');
    $pos = ($terms && !is_wp_error($terms)) ? $terms[0]->name : 'Squad';
    $cc25_groups[$pos][] = $pl;
}
uksort($cc25_groups, function ($a, $b) use ($cc25_order) {
    $ia = array_search(rtrim($a, 's'), $cc25_order);
    $ib = array_search(rtrim($b, 's'), $cc25_order);
    $ia = $ia === false ? 99 : $ia;
    $ib = $ib === false ? 99 : $ib;
    return $ia <=> $ib;
});
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">SQUAD</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('teams', home_url('/'))); ?>" style="color:var(--on-navy-dim)">Teams</a> / <span style="color:#fff">Squad</span></div>
    <h1><?php echo esc_html(get_the_title()); ?></h1>
    <p>The players representing Cwmbran Celtic this season.</p>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <?php if ($cc25_players): $ix = 0; foreach ($cc25_groups as $pos => $list): $ix++; ?>
      <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ix"><?php printf('%02d', $ix); ?></span><span class="ln"></span> <?php echo esc_html($pos); ?>s</div><h2><?php echo esc_html($pos); ?>s</h2></div></div>
      <div class="squad-grid reveal">
        <?php foreach ($list as $pl):
          $num = get_post_meta($pl->ID, 'sp_number', true);
          $img = get_the_post_thumbnail($pl->ID, 'medium_large', array('loading' => 'lazy'));
        ?>
          <a class="squad-card" href="<?php echo esc_url(get_permalink($pl->ID)); ?>">
            <div class="squad-img">
              <?php echo $img ? $img : '<div class="squad-ph"></div>'; ?>
              <?php if ($num !== '') : ?><span class="squad-no"><?php echo intval($num); ?></span><?php endif; ?>
            </div>
            <div class="squad-info">
              <div class="squad-name"><?php echo esc_html(get_the_title($pl->ID)); ?></div>
              <div class="squad-pos"><?php echo esc_html($pos); ?></div>
            </div>
          </a>
        <?php endforeach; ?>
      </div>
    <?php endforeach; else: ?>
      <p style="color:var(--muted);padding:40px 0">The squad list will appear here once players are added in SportsPress.</p>
    <?php endif; ?>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
