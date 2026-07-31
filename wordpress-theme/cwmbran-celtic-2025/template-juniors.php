<?php
/**
 * Template Name: Juniors & Minis
 * Junior/Mini section — one card per age group with its coach contact(s).
 * Data lives in cc25_junior_teams() (functions.php).
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$cc25_home = home_url('/');
$cc25_jr   = cc25_junior_teams();
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">JUNIORS</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('teams', $cc25_home)); ?>" style="color:var(--on-navy-dim)">Teams</a> / <span style="color:#fff">Juniors &amp; Minis</span></div>
    <h1>Juniors &amp; Minis</h1>
    <p>Grassroots football at the heart of the club — teams for boys and girls from Under 9 to Under 16.</p>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div>
      <div class="sec-eye kick"><span class="ln"></span> Join the Celts</div>
      <h2>Age groups &amp; contacts</h2>
    </div></div>
    <p class="reveal" style="color:var(--muted);max-width:60ch;margin:0 0 6px">New players are always welcome. To ask about training and joining a team, get in touch with the coach for the relevant age group below &mdash; just tap a number to call.</p>
    <div class="jr-grid reveal">
      <?php foreach ($cc25_jr as $g): ?>
        <div class="jr-card">
          <h3><?php echo esc_html($g['label']); ?></h3>
          <?php foreach ($g['contacts'] as $c):
            $tel = preg_replace('/\s+/', '', $c[1]); ?>
            <div class="jr-contact">
              <span class="nm"><?php echo esc_html($c[0]); ?></span>
              <a class="tel" href="tel:<?php echo esc_attr($tel); ?>"><?php echo esc_html($c[1]); ?></a>
            </div>
          <?php endforeach; ?>
        </div>
      <?php endforeach; ?>
    </div>
    <p class="spx-note reveal">Interested in helping out as a coach or volunteer? Contact any of the numbers above or the club directly.</p>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
