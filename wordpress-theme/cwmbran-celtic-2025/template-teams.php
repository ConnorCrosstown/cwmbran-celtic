<?php
/**
 * Template Name: Teams
 * Overview of the club's teams (SportsPress sp_team), linking to squads.
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');

$cc25_teams = get_posts(array(
    'post_type'   => 'sp_team',
    'numberposts' => -1,
    'orderby'     => 'menu_order',
    'order'       => 'ASC',
));
$cc25_squad = cc25_page_url('squad', '');
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">TEAMS</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <span style="color:#fff">Teams</span></div>
    <h1>Our Teams</h1>
    <p>From the first team to the youth setup — meet the sides that make up Cwmbran Celtic.</p>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <?php if ($cc25_teams): ?>
    <div class="teams-grid reveal">
      <?php foreach ($cc25_teams as $t):
        $img = get_the_post_thumbnail($t->ID, 'thumbnail', array('loading' => 'lazy'));
        $link = $cc25_squad ? $cc25_squad : get_permalink($t->ID);
      ?>
        <a class="team-card" href="<?php echo esc_url($link); ?>">
          <div class="team-crest-lg"><?php echo $img ? $img : cc25_own_crest(72); ?></div>
          <div class="team-name"><?php echo esc_html(get_the_title($t->ID)); ?></div>
          <span class="viewall">View squad →</span>
        </a>
      <?php endforeach; ?>
    </div>
    <?php else: ?>
      <p style="color:var(--muted);padding:40px 0">Teams will appear here once they're set up in SportsPress.</p>
    <?php endif; ?>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
