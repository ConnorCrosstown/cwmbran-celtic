<?php
/**
 * Template Name: Match Day Programmes
 * Premium replacement for the digital programme archive. Programmes are Posts in
 * the "programme" category (cover = Featured Image, link in the Programme box,
 * post date = match date). Grouped by season into tabs; newest season first.
 * Applies to slug cwmbran-celtic-fc-match-day-programme-digital.
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$cc25_home  = home_url('/');
$cc25_progs = cc25_programmes_by_season();
$cc25_keys  = array();
foreach ($cc25_progs as $cc25_s => $cc25_l) { $cc25_keys[$cc25_s] = 's' . preg_replace('/\D/', '', $cc25_s); }
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">PROGRAMMES</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url($cc25_home); ?>">Home</a> / <span style="color:#fff">Match Day Programmes</span></div>
    <h1>Match Day Programmes</h1>
    <p>Read every home programme, free &mdash; catch up on the matchday reads from this season and the archive.</p>
    <?php if ($cc25_progs): $cc25_first = true; ?>
    <div class="teamsel">
      <?php foreach ($cc25_progs as $cc25_s => $cc25_l): ?>
        <button<?php echo $cc25_first ? ' class="on"' : ''; ?> data-team="<?php echo esc_attr($cc25_keys[$cc25_s]); ?>"><?php echo esc_html($cc25_s); ?></button>
      <?php $cc25_first = false; endforeach; ?>
    </div>
    <?php endif; ?>
  </div>
</div>

<?php if (!$cc25_progs): ?>
<section class="band"><div class="wrap">
  <p style="color:var(--muted);font-size:1.05rem;padding:30px 0;max-width:640px">No programmes here just yet. To add one, publish a Post in the <strong>Programme</strong> category with a cover image and the programme link &mdash; it'll appear here automatically.</p>
</div></section>
<?php else: $cc25_first = true; foreach ($cc25_progs as $cc25_s => $cc25_l): ?>
<div class="teamwrap" id="team-<?php echo esc_attr($cc25_keys[$cc25_s]); ?>"<?php echo $cc25_first ? '' : ' hidden'; ?>>
  <section class="band">
    <div class="wrap">
      <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> Season <?php echo esc_html($cc25_s); ?></div><h2>Match Day Programmes</h2></div></div>
      <div class="prog-grid reveal">
        <?php foreach ($cc25_l as $cc25_p):
          // A PDF is read on our own site, so it stays in this tab. Anything else
          // is still somebody else's flipbook and opens away from here.
          $cc25_pdf = cc25_programme_pdf($cc25_p->ID);
          $cc25_ext = $cc25_pdf === '' && trim((string) get_post_meta($cc25_p->ID, '_cc25_prog_url', true)) !== '';
          $cc25_url = cc25_programme_read_url($cc25_p->ID);
          $cc25_img = get_the_post_thumbnail($cc25_p->ID, 'medium_large', array('loading' => 'lazy', 'alt' => esc_attr(get_the_title($cc25_p->ID))));
        ?>
          <a class="prog-card" href="<?php echo esc_url($cc25_url); ?>"<?php echo $cc25_ext ? ' target="_blank" rel="noopener"' : ''; ?>>
            <div class="prog-cover"><?php echo $cc25_img ? $cc25_img : '<div class="prog-ph"><span>Cwmbran Celtic</span></div>'; ?></div>
            <div class="prog-info">
              <div class="prog-date kick"><?php echo esc_html(get_the_date('j M Y', $cc25_p->ID)); ?></div>
              <div class="prog-title"><?php echo esc_html(get_the_title($cc25_p->ID)); ?></div>
              <span class="prog-read">Read programme &rarr;</span>
            </div>
          </a>
        <?php endforeach; ?>
      </div>
    </div>
  </section>
</div>
<?php $cc25_first = false; endforeach; endif; ?>
<?php get_template_part('template-parts/site-footer'); ?>
