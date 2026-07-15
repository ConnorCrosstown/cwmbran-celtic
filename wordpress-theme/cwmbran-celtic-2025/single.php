<?php
/** Single post — premium news article. */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
?>
<?php while (have_posts()) : the_post(); $cats = get_the_category(); ?>
<div class="phero" style="min-height:auto">
  <div class="bg"></div><div class="grain"></div>
  <div class="phero-in" style="padding-bottom:26px">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('news', home_url('/'))); ?>" style="color:var(--on-navy-dim)">News</a><?php if ($cats) echo ' / ' . esc_html($cats[0]->name); ?></div>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <article class="article">
      <?php if ($cats): ?><span class="art-cat"><?php echo esc_html($cats[0]->name); ?></span><?php endif; ?>
      <h1 class="art-h1"><?php the_title(); ?></h1>
      <div class="byline"><span class="av">CC</span><div>By <b><?php the_author(); ?></b> · <?php echo esc_html(get_the_date()); ?></div></div>
      <?php if (has_post_thumbnail()): ?>
        <div class="art-hero"><?php the_post_thumbnail('large', array('style' => 'width:100%;height:100%;object-fit:cover')); ?></div>
      <?php else: ?>
        <div class="art-hero photo"><div class="fill"></div><div class="gr"></div></div>
      <?php endif; ?>
      <div class="art-body prose"><?php the_content(); ?></div>
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
