<?php
/**
 * Template Name: Sponsors
 * Main sponsor + full sponsor wall (current list from the club's sponsor data).
 */
if (!defined('ABSPATH')) exit;
$main = cc25_sponsor_main();
get_template_part('template-parts/site-header');
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">SPONSORS</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <span style="color:#fff">Sponsors</span></div>
    <h1>Our Sponsors</h1>
    <p>Cwmbran Celtic is proudly backed by a fantastic group of local and national partners.</p>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ix">01</span><span class="ln"></span> Leading the way</div><h2>Main Sponsor</h2></div></div>
    <div class="sponsor-main sponsor-main-lg reveal">
      <?php echo cc25_sponsor_logo($main['name'], $main['file'], cc25_sponsor_link($main)); ?>
    </div>

    <div class="sec-head reveal" style="margin-top:56px"><div><div class="sec-eye kick"><span class="ix">02</span><span class="ln"></span> Backing the Celts</div><h2>Sponsors &amp; Partners</h2></div></div>
    <div class="sponsor-wall reveal d1">
    <?php foreach (cc25_sponsors() as $s): ?>
      <?php echo cc25_sponsor_card_html($s, cc25_sponsor_link($s)); ?>
    <?php endforeach; ?>
    </div>

    <?php echo cc25_charity_partners_html(); ?>

    <div class="cta reveal" style="margin-top:60px">
      <div class="grain"></div>
      <div>
        <div class="kick" style="color:var(--gold);position:relative;z-index:2">Partner with us</div>
        <h2>Become a Cwmbran Celtic sponsor</h2>
        <p>Back a hundred-year-old community club and reach supporters across Cwmbran and beyond. Packages to suit every business.</p>
      </div>
      <div class="signup" style="display:flex;align-items:center;justify-content:center">
        <a class="btn btn-gold btn-block" href="<?php echo esc_url(cc25_page_url('contact', home_url('/'))); ?>">Get in touch</a>
      </div>
    </div>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
