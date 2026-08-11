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
    array('name' => "Women's First Team",  'sub' => 'Genero Adran South',         'page' => cc25_page_url('ladies', $cc25_home), 'fx' => $cc25_fx . '#womens'),
    array('name' => "Women's Reserves",    'sub' => 'SWWGL Development League',   'page' => cc25_womens_res_url(),               'fx' => '', 'cta' => 'View fixtures'),
    array('name' => "Women's Under-19s",   'sub' => 'Adran U19s',                 'page' => cc25_womens_u19_url(),               'fx' => '', 'cta' => 'View fixtures'),
    array('name' => "Men's Reserves",      'sub' => 'Gwent Premier Combination',  'page' => cc25_reserves_url(),                 'fx' => $cc25_fx . '#reserves'),
    array('name' => "Men's Under-18s",     'sub' => 'Gwent County Youth League',  'page' => cc25_u18s_url(),                     'fx' => $cc25_fx . '#u18s'),
    array('name' => "Men's Vets",          'sub' => 'WVFA Over-40s',              'page' => cc25_vets_url(),                     'fx' => '', 'cta' => 'View team'),
    array('name' => "Juniors & Minis",     'sub' => 'Under 9 to Under 16',        'page' => cc25_juniors_url(),                  'fx' => '', 'cta' => 'Contacts'),
    array('name' => "Walking Football",    'sub' => 'Men\'s, Women\'s & Mixed · All ages welcome', 'page' => cc25_walking_football_url(), 'fx' => '', 'cta' => 'View section'),
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
            <a class="btn btn-sm btn-outline" href="<?php echo esc_url($t['page']); ?>"><?php echo esc_html(isset($t['cta']) ? $t['cta'] : 'Squad'); ?></a>
            <?php if (!empty($t['fx'])): ?>
            <a class="btn btn-sm btn-gold" href="<?php echo esc_url($t['fx']); ?>">Fixtures</a>
            <?php endif; ?>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
