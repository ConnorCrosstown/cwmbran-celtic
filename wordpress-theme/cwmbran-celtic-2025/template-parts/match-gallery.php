<?php
/**
 * Match photography on a report page. Rendered by cc25_match_gallery_html(), which
 * passes the gallery in as the 'cc25_gal' query var.
 *
 * The credit is markup, not a nicety: it sits in the heading and again on every
 * enlarged photo, so a shot cannot be seen full-size without the byline.
 */
if (!defined('ABSPATH')) exit;

$cc25_gal = get_query_var('cc25_gal');
if (!$cc25_gal || empty($cc25_gal['ids'])) return;

$cc25_gcredit = trim((string) ($cc25_gal['credit'] ?? ''));
$cc25_gcount  = count($cc25_gal['ids']);
?>
<div class="mr-block mrg" id="match-gallery">
  <h2 class="mr-h">Photos</h2>
  <?php if ($cc25_gcredit !== ''): ?>
    <p class="mrg-credit">All photography by <strong><?php echo esc_html($cc25_gcredit); ?></strong></p>
  <?php endif; ?>

  <div class="mrg-grid" data-mrg data-credit="<?php echo esc_attr($cc25_gcredit); ?>">
    <?php foreach ($cc25_gal['ids'] as $cc25_i):
      $cc25_thumb = wp_get_attachment_image($cc25_i, 'cc25_gal', false, array(
          'loading'  => 'lazy',
          'decoding' => 'async',
          'class'    => 'mrg-img',
      ));
      if (!$cc25_thumb) continue;
      /* The lightbox wants a big version, not the original — a phone original is
       * several megabytes and nobody needs it to look at a photo on a page. */
      $cc25_full = wp_get_attachment_image_url($cc25_i, 'large');
      if (!$cc25_full) $cc25_full = wp_get_attachment_image_url($cc25_i, 'full');
      $cc25_cap  = trim((string) wp_get_attachment_caption($cc25_i));
      $cc25_alt  = trim((string) get_post_meta($cc25_i, '_wp_attachment_image_alt', true));
    ?>
      <button class="mrg-item" type="button"
              data-full="<?php echo esc_url($cc25_full); ?>"
              data-caption="<?php echo esc_attr($cc25_cap); ?>"
              aria-label="<?php echo esc_attr($cc25_alt !== '' ? $cc25_alt : 'Match photograph'); ?> &mdash; view larger">
        <?php echo $cc25_thumb; ?>
        <?php if ($cc25_cap !== ''): ?><span class="mrg-cap"><?php echo esc_html($cc25_cap); ?></span><?php endif; ?>
      </button>
    <?php endforeach; ?>
  </div>

  <?php // Said once at the bottom too. Photographers get their work reposted without
  // asking more than anyone else on a football website. ?>
  <?php if ($cc25_gcredit !== ''): ?>
    <?php // A literal ©, not &copy;: this whole string goes through esc_html, which
    // would turn the entity into the visible text "&copy;". ?>
    <p class="mrg-rights"><?php echo esc_html(sprintf(
      '%d photograph%s © %s. Please ask before reusing them.',
      $cc25_gcount, $cc25_gcount === 1 ? '' : 's', $cc25_gcredit)); ?></p>
  <?php endif; ?>
</div>

<div class="mrg-lightbox" id="mrg-lightbox" role="dialog" aria-modal="true" aria-label="Match photograph" hidden>
  <button class="mrg-lb-close" type="button" aria-label="Close">&times;</button>
  <button class="mrg-lb-nav prev" type="button" aria-label="Previous photo">&lsaquo;</button>
  <button class="mrg-lb-nav next" type="button" aria-label="Next photo">&rsaquo;</button>
  <figure class="mrg-lb-inner">
    <img id="mrg-lb-img" src="" alt="">
    <figcaption class="mrg-lb-meta"><span class="mrg-lb-cap"></span><span class="mrg-lb-credit"></span></figcaption>
  </figure>
</div>
