<?php
/** Single post — premium news article. */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
?>
<?php // A programme with a PDF is read on site rather than shown as an article.
if (cc25_is_programme_post(get_queried_object())) {
    while (have_posts()) { the_post(); get_template_part('template-parts/programme-reader'); }
    get_template_part('template-parts/site-footer');
    return;
} ?>
<?php while (have_posts()) : the_post(); $cats = get_the_category(); ?>
<div class="phero" style="min-height:auto">
  <div class="bg"></div><div class="grain"></div>
  <div class="phero-in" style="padding-bottom:26px">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('news', home_url('/'))); ?>" style="color:var(--on-navy-dim)">News</a><?php if ($cats) echo ' / <a href="' . esc_url(get_category_link($cats[0]->term_id)) . '" style="color:var(--on-navy-dim)">' . esc_html($cats[0]->name) . '</a>'; ?></div>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <article class="article">
      <?php if ($cats): ?><a class="art-cat" href="<?php echo esc_url(get_category_link($cats[0]->term_id)); ?>"><?php echo esc_html($cats[0]->name); ?></a><?php endif; ?>
      <?php // A match report leads with the score, read from the fixture rather
            // than retyped into the article. ?>
      <?php if (function_exists('cc25_is_report_post') && cc25_is_report_post()) echo cc25_report_header(); ?>
      <h1 class="art-h1"><?php the_title(); ?></h1>
      <div class="byline"><img class="av" src="<?php echo esc_url(cc25_club_logo()); ?>" alt="Cwmbran Celtic" width="42" height="42"><div>By <b><?php echo esc_html(cc25_byline()); ?></b> · <?php echo esc_html(get_the_date()); ?></div></div>
      <?php if (has_post_thumbnail()): ?>
        <div class="art-hero"><?php the_post_thumbnail('large', array('style' => 'width:100%;height:100%;object-fit:cover')); ?></div>
      <?php else: ?>
        <div class="art-hero photo"><div class="fill"></div><div class="gr"></div></div>
      <?php endif; ?>
      <div class="art-body prose"><?php the_content(); ?></div>
      <?php // Seeded on the post id so two stories published the same day do not
            // both name the same sponsor, while staying deterministic per post. ?>
      <?php echo cc25_sponsor_slot_html(
          (string) get_post_meta(get_the_ID(), '_cc25_sponsor', true),
          (function_exists('cc25_is_report_post') && cc25_is_report_post()) ? 'report' : 'story',
          (int) get_the_ID()
      ); ?>
      <?php // A written report shows the same gallery as the match centre does for that
      // game — one set of photos, keyed to the fixture, not two places to upload them.
      if (function_exists('cc25_report_game') && function_exists('cc25_match_gallery_html')) {
          $cc25_rg = cc25_report_game();
          if ($cc25_rg) {
              echo cc25_match_gallery_html($cc25_rg[0], $cc25_rg[1]);
          }
      } ?>
      <div class="share">
        <span>Share</span>
        <a href="<?php echo esc_url('https://www.facebook.com/sharer/sharer.php?u=' . urlencode(get_permalink())); ?>" target="_blank" rel="noopener" aria-label="Share on Facebook">f</a>
        <a href="<?php echo esc_url('https://twitter.com/intent/tweet?url=' . urlencode(get_permalink())); ?>" target="_blank" rel="noopener" aria-label="Share on X">&#120143;</a>
        <a href="<?php echo esc_url('mailto:?body=' . urlencode(get_permalink())); ?>" aria-label="Share by email">&#9993;</a>
      </div>
    </article>
  </div>
</section>
<?php endwhile; ?>
<?php get_template_part('template-parts/site-footer'); ?>
