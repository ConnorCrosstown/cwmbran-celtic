<?php
/**
 * Template Name: Music Shirts Launch
 * The 2026/27 Music Shirts announcement — a premium news article driven by
 * cc25_kit_launch(). Applies to the page with slug "music-shirts".
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');

// Honour WordPress's built-in page password so we can lock this page for a
// private preview: set a password on the page in wp-admin (Visibility →
// Password protected) and only people with it can view.
if (post_password_required()) {
    echo '<div class="phero" style="min-height:auto"><div class="bg"></div><div class="grain"></div>';
    echo '<div class="phero-in"><div class="kl-eye kick">Cwmbran Celtic · Private preview</div><h1 style="font-size:clamp(1.8rem,5vw,2.8rem)">This page is locked</h1>';
    echo '<p class="kl-dek">We&rsquo;re still putting the finishing touches to it. Enter the password to take a look.</p>';
    echo '<div class="pwform">' . get_the_password_form() . '</div></div></div>';
    get_template_part('template-parts/site-footer');
    return;
}

$k = cc25_kit_launch();
$kbase = get_stylesheet_directory_uri() . '/assets/img/kit/';
$sponbase = get_stylesheet_directory_uri() . '/assets/img/sponsor-banners/';
$home  = home_url('/');
// Music Venue Trust logo appears wherever it fits, once the asset is dropped in
// at assets/img/mvt-logo.png (transparent PNG). Hidden until then.
$mvt_logo_uri = get_stylesheet_directory_uri() . '/assets/img/mvt-logo.png';
$mvt_has_logo = file_exists(get_stylesheet_directory() . '/assets/img/mvt-logo.png');
?>
<div class="phero kl-hero">
  <div class="bg" style="background-image:linear-gradient(175deg,rgba(9,17,32,.78),rgba(9,17,32,.94) 78%),url('<?php echo esc_url($kbase . 'sfa-hero.webp'); ?>');background-size:cover;background-position:center 22%"></div><div class="grain"></div><div class="ghost">MUSIC&nbsp;SHIRTS</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url($home); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('news', $home)); ?>" style="color:var(--on-navy-dim)">News</a> / <span style="color:#fff">Music Shirts</span></div>
    <div class="kl-eye kick"><?php echo esc_html($k['eyebrow']); ?></div>
    <h1><?php echo esc_html($k['headline']); ?></h1>
    <p class="kl-dek"><?php echo esc_html($k['dek']); ?></p>
    <div class="kl-cta">
      <a class="btn btn-gold" href="<?php echo esc_url($k['shop_url']); ?>" target="_blank" rel="noopener">Pre-order your shirt &rarr;</a>
      <a class="btn btn-line" href="<?php echo esc_url($k['tickets_url']); ?>" target="_blank" rel="noopener">Season Tickets</a>
    </div>
    <div class="kl-date">Cwmbran Celtic FC &middot; <?php echo esc_html(date('j F Y', strtotime($k['date']))); ?></div>
  </div>
</div>

<section class="band">
  <div class="wrap kl-wrap">
    <div class="kl-lede reveal">
      <p>Cwmbran Celtic FC has today announced a landmark shirt-sponsor partnership that unites two worlds built on the very same foundations: <b>grassroots football and grassroots music</b>. For the 2026/27 season, four of the UK's most-loved independent bands &mdash; <b>Super Furry Animals</b>, <b>Mogwai</b>, <b>Panic Shack</b> and <b>Loose Articles</b> &mdash; will feature across the front of the club's men's and women's first-team shirts.</p>
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

    <?php // All shirts as data so premium.js can pick a random one to feature each visit. ?>
    <script type="application/json" id="kl-shirt-data"><?php echo wp_json_encode(array('base' => $kbase, 'shirts' => $k['shirts'])); ?></script>

    <?php $feat = $k['shirts'][0]; ?>
    <div class="kl-featshirt reveal" data-kl-featured>
      <button type="button" class="kl-featshirt-img shirt-zoom" data-full="<?php echo esc_url($kbase . $feat['img']); ?>"<?php if (!empty($feat['front'])): ?> data-front="<?php echo esc_url($kbase . $feat['front']); ?>"<?php endif; ?><?php if (!empty($feat['back'])): ?> data-back="<?php echo esc_url($kbase . $feat['back']); ?>"<?php endif; ?> data-cap="<?php echo esc_attr($feat['band'] . ' · ' . $feat['label']); ?>" aria-label="Enlarge the <?php echo esc_attr($feat['band']); ?> shirt &mdash; front and back"><img src="<?php echo esc_url($kbase . $feat['img']); ?>" alt="Cwmbran Celtic <?php echo esc_attr($feat['label'] . ' shirt — ' . $feat['band']); ?>" loading="lazy"><span class="zoom-hint" aria-hidden="true">⤢</span></button>
      <div class="kl-featshirt-body">
        <span class="kl-tag gold"><?php echo esc_html($feat['label']); ?></span>
        <h3><?php echo esc_html($feat['band']); ?></h3>
        <div class="kl-origin"><?php echo esc_html($feat['origin']); ?></div>
        <p><?php echo esc_html($feat['blurb']); ?></p>
        <a class="btn btn-gold btn-sm kl-feat-buy" href="<?php echo esc_url($k['shop_url']); ?>" target="_blank" rel="noopener">Pre-order this shirt &rarr;</a>
      </div>
    </div>

    <?php if (!empty($k['action'])): ?>
    <div class="kl-action reveal" aria-label="The 2026/27 Music Shirts in action">
      <?php foreach ($k['action'] as $a): ?>
      <div class="kl-action-img"><img src="<?php echo esc_url($kbase . $a); ?>" alt="Cwmbran Celtic in the 2026/27 Music Shirts" loading="lazy"></div>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>

    <div class="kl-shirts">
      <?php foreach (array_slice($k['shirts'], 1) as $i => $s): ?>
      <figure class="kl-shirt reveal<?php echo $i === 1 ? ' d1' : ($i === 2 ? ' d2' : ''); ?>">
        <button type="button" class="kl-shirt-img shirt-zoom" data-full="<?php echo esc_url($kbase . $s['img']); ?>"<?php if (!empty($s['front'])): ?> data-front="<?php echo esc_url($kbase . $s['front']); ?>"<?php endif; ?><?php if (!empty($s['back'])): ?> data-back="<?php echo esc_url($kbase . $s['back']); ?>"<?php endif; ?> data-cap="<?php echo esc_attr($s['band'] . ' · ' . $s['label']); ?>" aria-label="Enlarge the <?php echo esc_attr($s['band']); ?> shirt &mdash; front and back"><img src="<?php echo esc_url($kbase . $s['img']); ?>" alt="Cwmbran Celtic <?php echo esc_attr($s['label'] . ' shirt — ' . $s['band']); ?>" loading="lazy"><span class="zoom-hint" aria-hidden="true">⤢</span></button>
        <figcaption>
          <span class="kl-tag"><?php echo esc_html($s['label']); ?></span>
          <span class="kl-band"><?php echo esc_html($s['band']); ?></span>
          <span class="kl-origin"><?php echo esc_html($s['origin']); ?></span>
          <a class="btn btn-gold btn-sm kl-shirt-buy" href="<?php echo esc_url($k['shop_url']); ?>" target="_blank" rel="noopener">Pre-order &rarr;</a>
        </figcaption>
      </figure>
      <?php endforeach; ?>
    </div>

    <?php if (!empty($k['keepers'])): $gk_soon = !empty($k['keepers_soon']); ?>
    <div class="kl-gk-box<?php echo $gk_soon ? ' soon reveal' : ''; ?>">
      <div class="kl-gk-inner">
        <div class="kl-gk-head">
          <span class="kl-gk-eye kick">Between the sticks</span>
          <h3>Goalkeeper Kits</h3>
          <?php if ($gk_soon): ?><span class="kl-gk-soonlbl">&#9733; Coming Soon</span><?php endif; ?>
        </div>
        <div class="kl-shirts kl-gk-grid">
          <?php foreach ($k['keepers'] as $s): ?>
          <figure class="kl-shirt<?php echo $gk_soon ? ' is-soon' : ' reveal'; ?>">
            <?php if ($gk_soon): ?><span class="kl-soon-badge">Coming Soon</span><?php endif; ?>
            <button type="button" class="kl-shirt-img shirt-zoom" data-full="<?php echo esc_url($kbase . $s['img']); ?>"<?php if ($gk_soon): ?> data-soon="1"<?php endif; ?> data-cap="<?php echo esc_attr($s['band'] . ' · ' . $s['label']); ?>" aria-label="Enlarge the <?php echo esc_attr($s['band']); ?> goalkeeper shirt"><img src="<?php echo esc_url($kbase . $s['img']); ?>" alt="Cwmbran Celtic goalkeeper shirt — <?php echo esc_attr($s['band']); ?>" loading="lazy"><span class="zoom-hint" aria-hidden="true">⤢</span></button>
            <figcaption>
              <span class="kl-tag"><?php echo esc_html($s['label']); ?></span>
              <span class="kl-band"><?php echo esc_html($s['band']); ?></span>
              <span class="kl-origin"><?php echo esc_html($s['origin']); ?></span>
              <?php if ($gk_soon): ?>
              <span class="kl-soon-chip">Coming Soon</span>
              <?php else: ?>
              <a class="btn btn-gold btn-sm kl-shirt-buy" href="<?php echo esc_url($k['shop_url']); ?>" target="_blank" rel="noopener">Pre-order &rarr;</a>
              <?php endif; ?>
            </figcaption>
          </figure>
          <?php endforeach; ?>
        </div>
        <?php if ($gk_soon): ?><p class="kl-gk-note">Our four goalkeeper kits are on their way &mdash; pre-order opens very soon. Keep an eye out!</p><?php endif; ?>
      </div>
    </div>
    <?php endif; ?>

    <p class="kl-shirtnote reveal"><?php if (!empty($k['keepers']) && !empty($k['keepers_soon'])): ?>Men's and women's shirts are available to pre-order now, with a share of profit from every sale donated to Music Venue Trust. Goalkeeper kits coming soon.<?php else: ?>Men's, women's and goalkeeper shirts are available to pre-order now, with a share of profit from every sale donated to Music Venue Trust.<?php endif; ?></p>
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
    <div class="kl-mvt reveal<?php echo $mvt_has_logo ? ' has-logo' : ''; ?>">
      <div class="kl-mvt-badge">10%</div>
      <div class="kl-mvt-body">
        <div class="kick" style="color:var(--gold)">Backing grassroots music</div>
        <h2>10% of the profit of every shirt goes to Music Venue Trust</h2>
        <p>Music Venue Trust is a UK charity established in 2014 to protect, secure and improve grassroots music venues &mdash; the small rooms where emerging artists cut their teeth and where so much of the country's musical talent first performs. Every shirt you buy helps keep those doors open.</p>
        <a class="btn btn-line" href="<?php echo esc_url($k['mvt_url']); ?>" target="_blank" rel="noopener">About Music Venue Trust &rarr;</a>
      </div>
      <?php if ($mvt_has_logo): ?>
      <a class="kl-mvt-logowrap" href="<?php echo esc_url($k['mvt_url']); ?>" target="_blank" rel="noopener" aria-label="Music Venue Trust"><img src="<?php echo esc_url($mvt_logo_uri); ?>" alt="Music Venue Trust"></a>
      <?php endif; ?>
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
        <?php if (!empty($b['meta'])): ?><div class="kl-bandmeta"><?php echo esc_html($b['meta']); ?></div><?php endif; ?>
        <p><?php echo esc_html($b['d']); ?></p>
        <?php if (!empty($b['spotify']) || !empty($b['insta'])): ?>
        <div class="kl-bandlinks">
          <?php if (!empty($b['spotify'])): ?><a class="kl-blink spotify" href="<?php echo esc_url($b['spotify']); ?>" target="_blank" rel="noopener" aria-label="<?php echo esc_attr($b['n']); ?> on Spotify"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.6 14.4a.62.62 0 01-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 11-.28-1.21c3.8-.87 7.07-.5 9.72 1.1.29.18.38.57.21.86zm1.23-2.74a.78.78 0 01-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.78.78 0 11-.45-1.49c3.63-1.1 8.15-.56 11.24 1.33.37.22.49.7.25 1.07zm.11-2.85C14.72 8.05 9.5 7.86 6.53 8.76a.94.94 0 11-.54-1.8c3.41-1.03 9.18-.83 12.8 1.32a.94.94 0 01-.96 1.61z"/></svg><span>Spotify</span></a><?php endif; ?>
          <?php if (!empty($b['insta'])): ?><a class="kl-blink insta" href="<?php echo esc_url($b['insta']); ?>" target="_blank" rel="noopener" aria-label="<?php echo esc_attr($b['n']); ?> on Instagram"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 2.76a7.08 7.08 0 100 14.16 7.08 7.08 0 000-14.16zm0 11.68a4.6 4.6 0 110-9.2 4.6 4.6 0 010 9.2zm7.24-11.9a1.65 1.65 0 11-3.3 0 1.65 1.65 0 013.3 0z"/></svg><span>Instagram</span></a><?php endif; ?>
        </div>
        <?php endif; ?>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php if (!empty($k['sponsors'])): ?>
<section class="band kl-sponsors-band">
  <div class="wrap">
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> In partnership with</div><h2>Featured Sponsors</h2></div></div>
    <div class="kl-sponsors">
      <?php foreach ($k['sponsors'] as $sp): ?>
      <a class="kl-sponsor reveal" href="<?php echo esc_url(cc25_sponsor_click_url($sp['slug'])); ?>" target="_blank" rel="noopener">
        <div class="kl-sponsor-tile"><img src="<?php echo esc_url($sponbase . $sp['img']); ?>" alt="<?php echo esc_attr($sp['name']); ?>" loading="lazy"></div>
        <div class="kl-sponsor-meta"><span class="ds"><?php echo esc_html($sp['desc']); ?></span></div>
      </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<section class="band kl-final">
  <div class="wrap">
    <div class="kl-finalcard reveal">
      <h2>Wear the shirt. Back the Celts. Support live music.</h2>
      <p>Pre-order the 2026/27 Music Shirts now, and grab a season ticket for every home game &mdash; men's and women's &mdash; at Celtic Park.</p>
      <div class="kl-cta">
        <a class="btn btn-gold" href="<?php echo esc_url($k['shop_url']); ?>" target="_blank" rel="noopener">Pre-order your shirt &rarr;</a>
        <a class="btn btn-line" href="<?php echo esc_url($k['tickets_url']); ?>" target="_blank" rel="noopener">Get a Season Ticket</a>
      </div>
      <?php if ($mvt_has_logo): ?>
      <div class="kl-final-mvt"><span>Proudly supporting</span><a href="<?php echo esc_url($k['mvt_url']); ?>" target="_blank" rel="noopener"><img src="<?php echo esc_url($mvt_logo_uri); ?>" alt="Music Venue Trust"></a></div>
      <?php endif; ?>
    </div>
  </div>
</section>

<div class="shirt-lb" id="shirt-lb" role="dialog" aria-modal="true" aria-label="Shirt image" hidden>
  <button class="shirt-lb-x" type="button" aria-label="Close">&times;</button>
  <figure class="shirt-lb-fig">
    <div class="shirt-lb-imgs" id="shirt-lb-imgs"></div>
    <figcaption id="shirt-lb-cap"></figcaption>
    <a class="btn btn-gold shirt-lb-buy" href="<?php echo esc_url($k['shop_url']); ?>" target="_blank" rel="noopener">Pre-order this shirt &rarr;</a>
    <span class="shirt-lb-soon" hidden>&#9733; Coming Soon</span>
  </figure>
</div>
<?php get_template_part('template-parts/site-footer'); ?>
