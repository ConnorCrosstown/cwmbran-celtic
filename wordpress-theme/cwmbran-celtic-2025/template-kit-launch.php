<?php
/**
 * Template Name: Music Shirts Launch
 * The 2026/27 Music Shirts announcement — a premium news article driven by
 * cc25_kit_launch(). Applies to the page with slug "music-shirts".
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$k = cc25_kit_launch();
$kbase = get_stylesheet_directory_uri() . '/assets/img/kit/';
$home  = home_url('/');
?>
<div class="phero kl-hero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">MUSIC&nbsp;SHIRTS</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url($home); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('news', $home)); ?>" style="color:var(--on-navy-dim)">News</a> / <span style="color:#fff">Music Shirts</span></div>
    <div class="kl-eye kick"><?php echo esc_html($k['eyebrow']); ?></div>
    <h1><?php echo esc_html($k['headline']); ?></h1>
    <p class="kl-dek"><?php echo esc_html($k['dek']); ?></p>
    <div class="kl-cta">
      <a class="btn btn-gold" href="<?php echo esc_url($k['shop_url']); ?>" target="_blank" rel="noopener">Pre-order your shirt &rarr;</a>
      <a class="btn btn-ghost" href="<?php echo esc_url($k['tickets_url']); ?>" target="_blank" rel="noopener">Season tickets</a>
    </div>
    <div class="kl-date">Cwmbran Celtic AFC &middot; <?php echo esc_html(date('j F Y', strtotime($k['date']))); ?></div>
  </div>
</div>

<section class="band">
  <div class="wrap kl-wrap">
    <div class="kl-lede reveal">
      <p>Cwmbran Celtic AFC has today announced a landmark shirt-sponsor partnership that unites two worlds built on the very same foundations: <b>grassroots football and grassroots music</b>. For the 2026/27 season, four of the UK's most-loved independent bands &mdash; <b>Super Furry Animals</b>, <b>Mogwai</b>, <b>Panic Shack</b> and <b>Loose Articles</b> &mdash; will feature across the front of the club's men's and women's first-team shirts.</p>
    </div>
    <div class="kl-body reveal">
      <p>Community, passion, and the amazing people who keep them both alive &mdash; that's what football and music at this level share. Most of the money raised through shirt sales goes directly towards supporting the club's many teams: six senior sides across the men's and women's sections, plus veterans, walking football and a full junior set-up for boys and girls. And <b>10% of the profit from every shirt</b> will be donated to <a href="<?php echo esc_url($k['mvt_url']); ?>" target="_blank" rel="noopener">Music Venue Trust</a>, the charity dedicated to protecting, securing and improving the UK's grassroots music venues.</p>
      <p>Bands and football shirts have a long history together &mdash; from Wet Wet Wet's Clydebank deal in the 1990s to Ed Sheeran's Ipswich Town shirts, and Bohemians sporting both Fontaines D.C. and Oasis on their kit. Super Furry Animals know the territory better than most, having appeared on an iconic Cardiff City shirt back in 1999. What sets this partnership apart is the theme running across all four first-team home and away shirts: four bands helping support a community football club &mdash; and the venues they started their careers in.</p>
      <p>Super Furry Animals and Panic Shack carry the banner for Welsh music. Glasgow post-rock institution Mogwai are Celtic fans and jumped at the chance to appear on our green-and-white hooped shirt, and Manchester punk band Loose Articles are big football fans whose drummer's mother lives in Cwmbran. It's a cross-section of the independent scene spanning three decades and three countries. And these are the first shirts from <b>Tor Sports</b>, the club's new kit supplier.</p>
    </div>
  </div>
</section>

<section class="band kl-shirts-band">
  <div class="wrap">
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> The 2026/27 Range</div><h2>The Shirts</h2></div></div>
    <div class="kl-shirts">
      <?php foreach ($k['shirts'] as $i => $s): ?>
      <figure class="kl-shirt reveal<?php echo $i === 1 ? ' d1' : ($i === 2 ? ' d2' : ''); ?>">
        <div class="kl-shirt-img"><img src="<?php echo esc_url($kbase . $s['img']); ?>" alt="Cwmbran Celtic <?php echo esc_attr($s['label']); ?> shirt &mdash; <?php echo esc_attr($s['band']); ?>" loading="lazy"></div>
        <figcaption>
          <span class="kl-tag"><?php echo esc_html($s['label']); ?></span>
          <span class="kl-band"><?php echo esc_html($s['band']); ?></span>
          <span class="kl-origin"><?php echo esc_html($s['origin']); ?></span>
        </figcaption>
      </figure>
      <?php endforeach; ?>
    </div>
    <p class="kl-shirtnote reveal">Men's and women's shirts are available to pre-order now, with a share of profit from every sale donated to Music Venue Trust.</p>
    <div class="kl-shirtcta reveal"><a class="btn btn-gold" href="<?php echo esc_url($k['shop_url']); ?>" target="_blank" rel="noopener">Pre-order at Tor Sports &rarr;</a></div>
  </div>
</section>

<section class="band">
  <div class="wrap kl-wrap">
    <?php foreach ($k['quotes'] as $q): ?>
    <blockquote class="kl-quote reveal">
      <p>&ldquo;<?php echo esc_html($q['text']); ?>&rdquo;</p>
      <cite><span class="qn"><?php echo esc_html($q['by']); ?></span><span class="qr"><?php echo esc_html($q['role']); ?></span></cite>
    </blockquote>
    <?php endforeach; ?>
  </div>
</section>

<section class="band kl-mvt-band">
  <div class="wrap">
    <div class="kl-mvt reveal">
      <div class="kl-mvt-badge">10%</div>
      <div class="kl-mvt-body">
        <div class="kick" style="color:var(--gold)">Backing grassroots music</div>
        <h2>10% of every shirt goes to Music Venue Trust</h2>
        <p>Music Venue Trust is a UK charity established in 2014 to protect, secure and improve grassroots music venues &mdash; the small rooms where emerging artists cut their teeth and where so much of the country's musical talent first performs. Every shirt you buy helps keep those doors open.</p>
        <a class="btn btn-ghost" href="<?php echo esc_url($k['mvt_url']); ?>" target="_blank" rel="noopener">About Music Venue Trust &rarr;</a>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> On the shirts</div><h2>The Bands</h2></div></div>
    <div class="kl-bands">
      <?php foreach ($k['bands'] as $b): ?>
      <div class="kl-bandcard reveal">
        <h3><?php echo esc_html($b['n']); ?></h3>
        <p><?php echo esc_html($b['d']); ?></p>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="band kl-final">
  <div class="wrap">
    <div class="kl-finalcard reveal">
      <h2>Wear the shirt. Back the Celts. Support live music.</h2>
      <p>Pre-order the 2026/27 Music Shirts now, and grab a season ticket for every home game &mdash; men's and women's &mdash; at Celtic Park.</p>
      <div class="kl-cta">
        <a class="btn btn-gold" href="<?php echo esc_url($k['shop_url']); ?>" target="_blank" rel="noopener">Pre-order your shirt &rarr;</a>
        <a class="btn btn-navy" href="<?php echo esc_url($k['tickets_url']); ?>" target="_blank" rel="noopener">Get a season ticket</a>
      </div>
    </div>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
