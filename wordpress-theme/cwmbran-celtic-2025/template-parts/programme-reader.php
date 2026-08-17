<?php
/**
 * Match day programme reader. Included from single.php for a programme post that
 * has a PDF — see cc25_is_programme_post().
 *
 * Everything needed to actually get the programme is in this markup: the cover
 * and the download link. The reader script enhances it; it isn't required.
 */
if (!defined('ABSPATH')) exit;

$cc25_pdf   = cc25_programme_pdf(get_the_ID());
$cc25_wrap  = cc25_programme_cover_wrap(get_the_ID()) ? '1' : '0';
$cc25_vend  = get_stylesheet_directory_uri() . '/assets/vendor/pdfjs/';
// Versioned by mtime like the rest of the theme's assets — these are imported by
// URL from the reader, so wp_enqueue_script's versioning can't reach them.
$cc25_pgv   = @filemtime(get_stylesheet_directory() . '/assets/programme-pages.js') ?: '1';
$cc25_pages = get_stylesheet_directory_uri() . '/assets/programme-pages.js?ver=' . rawurlencode($cc25_pgv);
$cc25_cover = get_the_post_thumbnail(get_the_ID(), 'large', array('alt' => esc_attr(get_the_title())));
?>
<div class="phero" style="min-height:auto">
  <div class="bg"></div><div class="grain"></div>
  <div class="phero-in" style="padding-bottom:26px">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url(array('cwmbran-celtic-fc-match-day-programme-digital', 'programmes'), home_url('/'))); ?>" style="color:var(--on-navy-dim)">Match Day Programmes</a></div>
    <h1><?php the_title(); ?></h1>
    <p><?php echo esc_html(get_the_date('l j F Y')); ?> &middot; Motazone Arena</p>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <div class="prog-reader" id="cc25-prog-reader"
         tabindex="0"
         role="group"
         aria-label="<?php echo esc_attr(get_the_title()); ?> — match day programme"
         data-pdf="<?php echo esc_url($cc25_pdf); ?>"
         data-pages="<?php echo esc_url($cc25_pages); ?>"
         data-pdfjs="<?php echo esc_url($cc25_vend . 'pdf.min.js'); ?>"
         data-worker="<?php echo esc_url($cc25_vend . 'pdf.worker.min.js'); ?>"
         data-cover-wrap="<?php echo esc_attr($cc25_wrap); ?>">

      <div class="prog-stage">
        <?php // Shown until the first page paints, and left standing if it never does. ?>
        <div class="prog-fallback">
          <?php if ($cc25_cover): ?><div class="prog-fallback-cover"><?php echo $cc25_cover; ?></div><?php endif; ?>
          <p class="prog-fallback-msg">Loading the programme&hellip;</p>
          <?php // Fills as the PDF downloads. A programme is several megabytes;
                // a bar that moves is the difference between waiting and leaving. ?>
          <div class="prog-progress"><span class="prog-progress-bar"></span></div>
          <p class="prog-failed-msg">The programme couldn&rsquo;t be shown here. You can still download it below.</p>
          <noscript><p class="prog-fallback-msg">Turn on JavaScript to read the programme here, or download it below.</p></noscript>
        </div>
        <canvas class="prog-canvas" aria-label="Programme page"></canvas>
      </div>

      <div class="prog-bar">
        <button class="prog-nav prev" type="button" aria-label="Previous page">&lsaquo;</button>
        <span class="prog-count" aria-live="polite" aria-atomic="true"></span>
        <button class="prog-nav next" type="button" aria-label="Next page">&rsaquo;</button>
      </div>

      <div class="prog-tools">
        <button class="prog-tool prog-zoom-out" type="button" aria-label="Zoom out">&minus;</button>
        <button class="prog-tool prog-zoom-in" type="button" aria-label="Zoom in">+</button>
        <?php // Both pages at once, for a sheet whose table runs across the fold. ?>
        <button class="prog-tool prog-spread" type="button" aria-pressed="false">Both pages</button>
        <button class="prog-tool prog-thumbs-toggle" type="button" aria-expanded="false">All pages</button>
        <button class="prog-tool prog-fs" type="button" aria-label="Full screen">Full screen</button>
      </div>

      <div class="prog-thumbs" hidden></div>

      <p class="prog-hint">Arrows, swipe or &larr; &rarr; to turn the page. Pinch or double-tap to zoom.</p>
    </div>

    <p class="prog-dl">
      <a class="btn btn-navy" href="<?php echo esc_url($cc25_pdf); ?>" target="_blank" rel="noopener">Download the programme (PDF)</a>
    </p>

    <?php if (trim(get_the_content()) !== ''): ?>
    <div class="art-body prose" style="margin-top:26px"><?php the_content(); ?></div>
    <?php endif; ?>
  </div>
</section>
