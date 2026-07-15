<?php
/** Blog home / archives / search / fallback — premium news listing. */
if (!defined('ABSPATH')) exit;

if (is_search()) {
    $cc25_title = 'Search';
    $cc25_sub   = 'Results for &ldquo;' . esc_html(get_search_query()) . '&rdquo;';
} elseif (is_category() || is_archive()) {
    $cc25_title = single_cat_title('', false) ?: get_the_archive_title();
    $cc25_sub   = 'Latest from around the Celts.';
} else {
    $cc25_title = 'Club News';
    $cc25_sub   = 'Match reports, transfers, youth &amp; community — everything from around the Celts.';
}
get_template_part('template-parts/site-header');
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">NEWS</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <span style="color:#fff"><?php echo esc_html(wp_strip_all_tags($cc25_title)); ?></span></div>
    <h1><?php echo esc_html(wp_strip_all_tags($cc25_title)); ?></h1>
    <p><?php echo wp_kses_post($cc25_sub); ?></p>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <?php if (have_posts()): $cc25_i = 0; ?>
      <?php while (have_posts()): the_post(); $cc25_i++; $c = get_the_category(); ?>
        <?php if ($cc25_i === 1): ?>
        <article class="feature reveal">
          <a class="photo" href="<?php the_permalink(); ?>" style="min-height:360px;display:block">
            <?php if (has_post_thumbnail()) the_post_thumbnail('large', array('style' => 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover')); else echo '<div class="fill"></div><div class="gr"></div>'; ?>
            <?php if ($c) echo '<span class="tag">' . esc_html($c[0]->name) . '</span>'; ?>
          </a>
          <div class="fb">
            <span class="kicker">Featured</span>
            <h2 style="text-transform:none;letter-spacing:0"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
            <p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 32)); ?></p>
            <time><?php echo esc_html(get_the_date()); ?></time>
            <a class="viewall" href="<?php the_permalink(); ?>">Read more →</a>
          </div>
        </article>
        <div class="news-grid">
        <?php else: ?>
          <article class="ncard reveal">
            <a class="photo" href="<?php the_permalink(); ?>" style="aspect-ratio:16/10;display:block">
              <?php if (has_post_thumbnail()) the_post_thumbnail('medium_large', array('style' => 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover')); else echo '<div class="fill"></div><div class="gr"></div>'; ?>
              <?php if ($c) echo '<span class="tag">' . esc_html($c[0]->name) . '</span>'; ?>
            </a>
            <div class="ncb"><time><?php echo esc_html(get_the_date()); ?></time><h3 style="text-transform:none;letter-spacing:0"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3><p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 18)); ?></p></div>
          </article>
        <?php endif; ?>
      <?php endwhile; ?>
      <?php if ($cc25_i > 1) echo '</div>'; ?>
      <div class="pager"><?php echo paginate_links(array('prev_text' => '← Prev', 'next_text' => 'Next →')); ?></div>
    <?php else: ?>
      <p style="color:var(--muted);padding:40px 0">No news posts yet — check back soon.</p>
    <?php endif; ?>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
