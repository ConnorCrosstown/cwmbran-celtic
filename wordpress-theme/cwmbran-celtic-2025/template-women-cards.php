<?php
/**
 * Template Name: Women's First Team
 * Placeholder squad cards for the Women's First Team — mirrors the Men's player
 * cards layout. Swap the placeholders for real player-card graphics when ready
 * (drop images in assets/img/player-cards-women/ and adapt like the men's).
 * Applies to the page with slug "ladies-team".
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$cc25_wsquad = array(
    'Fiona Caitlin Anthony', 'Hayleigh Louise Anthony', 'Sian Amelia Anthony', 'Claire Archer',
    'Ellie Bidhendy', 'Summer Bowen-Quirk', 'Lauren Boyd', 'Jodie Challenger', 'Hollie Channing',
    'Erin Chantry', 'Eve Chantry', 'Nevaeh Cole', 'Georgina Cridland', 'Teagan Eley',
    'Chelleter Graham-Sawyers', 'Gracie Grosvenor', 'Kimberley Harrison', 'Aimee Henson',
    'Abigail Jones', 'Claudia Laida', 'Chloe Leonard', 'Eloise Meaney', 'Lydia Meaney',
    'Macey Ffion Morris', 'Jasmine Rena Payne', 'Mia Peacock', 'Keeley Perkins',
    'Amie Leigh Preston-Roberts', 'Elena Scrivens', 'Cerys Alise Shipley', 'Georgia Shwartz',
    'Kaitlin Smith', 'Taiya Stokes', 'Daisy Thomas', 'Mia Jade Weaver', 'Emily White', 'Alys Lea Winter',
);
$cc25_logo = cc25_club_logo();
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">SQUAD</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('teams', home_url('/'))); ?>" style="color:var(--on-navy-dim)">Teams</a> / <span style="color:#fff">Women's First Team</span></div>
    <h1>Women's First Team</h1>
    <p>The players representing Cwmbran Celtic in the Genero Adran South.</p>
    <div class="teamsel"><a class="btn btn-gold btn-sm" href="<?php echo esc_url(cc25_page_url('fixtures', home_url('/')) . '#womens'); ?>">View Women's fixtures &rarr;</a></div>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ix">01</span><span class="ln"></span> Squad <?php echo esc_html(cc25_season()); ?></div><h2>First Team Squad</h2></div></div>
    <div class="pc-grid reveal">
      <?php foreach ($cc25_wsquad as $cc25_pl): ?>
        <div class="wpc-card">
          <img class="wpc-crest" src="<?php echo esc_url($cc25_logo); ?>" alt="" aria-hidden="true" loading="lazy">
          <div class="wpc-name"><?php echo esc_html($cc25_pl); ?><small>Cwmbran Celtic</small></div>
        </div>
      <?php endforeach; ?>
    </div>
    <p class="spx-note reveal" style="color:var(--faint);margin-top:6px">Player photos coming soon.</p>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
