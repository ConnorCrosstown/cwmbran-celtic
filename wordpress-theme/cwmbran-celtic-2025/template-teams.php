<?php
/**
 * Template Name: Teams
 * All Teams hub — a card per team linking to that team's page + its fixtures.
 * (Replaces the old SportsPress mixed-player listing.)
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');

$cc25_home = home_url('/');
$cc25_fx   = cc25_page_url('fixtures', $cc25_home);
$cc25_hub = array(
    array('name' => "Men's First Team",   'sub' => 'Ardal League South East',    'page' => cc25_page_url('mens', $cc25_home),   'fx' => $cc25_fx . '#mens'),
    array('name' => "Men's Reserves",      'sub' => 'Gwent Premier Combination',  'page' => cc25_reserves_url(),                 'fx' => $cc25_fx . '#reserves'),
    array('name' => "Women's First Team",  'sub' => 'Genero Adran South',         'page' => cc25_page_url('ladies', $cc25_home), 'fx' => $cc25_fx . '#womens'),
);
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">TEAMS</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <span style="color:#fff">Teams</span></div>
    <h1>Our Teams</h1>
    <p>Meet the sides that make up Cwmbran Celtic — tap through to each squad and its fixtures.</p>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <div class="teams-grid reveal">
      <?php foreach ($cc25_hub as $t): ?>
        <div class="team-card">
          <div class="team-crest-lg"><?php echo cc25_own_crest(72); ?></div>
          <div class="team-name"><?php echo esc_html($t['name']); ?></div>
          <div class="team-sub"><?php echo esc_html($t['sub']); ?></div>
          <div class="team-links">
            <a class="btn btn-sm btn-outline" href="<?php echo esc_url($t['page']); ?>">Squad</a>
            <a class="btn btn-sm btn-gold" href="<?php echo esc_url($t['fx']); ?>">Fixtures</a>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
