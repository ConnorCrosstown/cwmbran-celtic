<?php
/** Standard content page — full-width premium content + a support band. */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
?>
<?php while (have_posts()) : the_post(); ?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">CELTIC</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <span style="color:#fff"><?php the_title(); ?></span></div>
    <span class="eyebrow kick"><span class="ln"></span> Cwmbran Celtic</span>
    <h1><?php the_title(); ?></h1>
  </div>
</div>

<section class="band page-wide">
  <div class="wrap">
    <div class="prose"><?php the_content(); ?></div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="support-band reveal">
      <div class="grain"></div>
      <div>
        <div class="kick" style="color:var(--gold);position:relative;z-index:2">Back the Celts</div>
        <h2>Support Cwmbran Celtic</h2>
        <p>Join the Celtic Bond's monthly draw, become a sponsor, or get in touch — every bit helps a hundred-year-old community club.</p>
      </div>
      <div class="sb-cta">
        <a class="btn btn-gold" href="<?php echo esc_url(cc25_page_url('celtic-bond', home_url('/'))); ?>">Join the Bond &#9733;</a>
        <a class="btn btn-ghost" href="<?php echo esc_url(cc25_page_url('sponsors', home_url('/'))); ?>">Sponsorship</a>
      </div>
    </div>
  </div>
</section>
<?php endwhile; ?>
<?php get_template_part('template-parts/site-footer'); ?>
