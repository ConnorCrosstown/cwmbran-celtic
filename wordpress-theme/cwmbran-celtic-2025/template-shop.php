<?php
/**
 * Template Name: Club Shop
 * A shop front, not a shop. Tor Sports takes the orders; this page does the
 * selling their category pages can't — three ranges given proper billing, then
 * a short curated strip of what's worth pushing.
 *
 * Applies to slugs shop / club-shop / kit (see cc25_route_templates).
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');

$cc25_home  = home_url('/');
$cc25_img   = get_stylesheet_directory_uri() . '/assets/img/';
$cc25_ranges = cc25_shop_ranges();
$cc25_feat   = cc25_shop_featured();
$cc25_shopall = cc25_ext_url('shop');
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">SHOP</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url($cc25_home); ?>">Home</a> / <span style="color:#fff">Club Shop</span></div>
    <h1>Club Shop</h1>
    <p>Blue and yellow, on and off the pitch. Every order puts money straight back into Cwmbran Celtic &mdash; from the minis to the first teams.</p>
    <div class="team-links reveal" style="justify-content:flex-start">
      <a class="btn btn-gold btn-sm" href="#ranges">Browse the ranges</a>
      <a class="btn btn-ghost btn-sm" href="<?php echo esc_url($cc25_shopall); ?>" target="_blank" rel="noopener">Full shop at Tor Sports &rarr;</a>
    </div>
  </div>
</div>

<?php // ---- The three ranges. Big, deliberate, one decision each. ---- ?>
<section class="band" id="ranges">
  <div class="wrap">
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> Three ranges</div><h2>Pick your kit</h2></div>
      <p class="sec-note">Sizes, stock and checkout are handled by Tor Sports, the club&rsquo;s kit partner.</p>
    </div>
    <div class="shop-ranges">
      <?php foreach ($cc25_ranges as $i => $r): $ext = strpos($r['url'], 'tor-sports.co.uk') !== false; ?>
      <article class="shop-range tone-<?php echo esc_attr($r['tone']); ?> reveal" style="--d:<?php echo $i * 90; ?>ms">
        <div class="shop-range-img">
          <img src="<?php echo esc_url($cc25_img . $r['img']); ?>" alt="<?php echo esc_attr($r['name']); ?>" loading="lazy">
          <span class="shop-range-meta"><?php echo esc_html($r['meta']); ?></span>
        </div>
        <div class="shop-range-body">
          <div class="shop-range-eye kick"><?php echo esc_html($r['eye']); ?></div>
          <h3><?php echo esc_html($r['name']); ?></h3>
          <p><?php echo esc_html($r['blurb']); ?></p>
          <div class="shop-range-cta">
            <a class="btn btn-gold btn-sm" href="<?php echo esc_url($r['url']); ?>"<?php echo $ext ? ' target="_blank" rel="noopener"' : ''; ?>><?php echo esc_html($r['cta']); ?></a>
            <?php if ($r['shop']): ?><a class="btn btn-outline btn-sm" href="<?php echo esc_url($r['shop']); ?>" target="_blank" rel="noopener">Buy shirts</a><?php endif; ?>
          </div>
        </div>
      </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php // ---- Curated, not catalogued. Eight things, £12 to £50. ---- ?>
<section class="band alt">
  <div class="wrap">
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> Popular right now</div><h2>Pick of the range</h2></div>
      <p class="sec-note">A few of our favourites. The full range &mdash; every size and colour &mdash; is over at Tor Sports.</p>
    </div>
    <div class="shop-grid">
      <?php foreach ($cc25_feat as $i => $p): ?>
      <a class="shop-card reveal" style="--d:<?php echo ($i % 4) * 70; ?>ms" href="<?php echo esc_url($p['url']); ?>" target="_blank" rel="noopener">
        <div class="shop-card-img">
          <img src="<?php echo esc_url($cc25_img . 'shop/' . $p['img']); ?>" alt="<?php echo esc_attr('Cwmbran Celtic ' . $p['name']); ?>" loading="lazy">
          <?php if ($p['was']): ?><span class="shop-sale">Sale</span><?php endif; ?>
        </div>
        <div class="shop-card-body">
          <span class="shop-card-range kick"><?php echo esc_html($p['range']); ?></span>
          <span class="shop-card-name"><?php echo esc_html($p['name']); ?></span>
          <span class="shop-card-price"><?php echo esc_html($p['price']); ?><?php if ($p['was']): ?> <s><?php echo esc_html($p['was']); ?></s><?php endif; ?></span>
        </div>
      </a>
      <?php endforeach; ?>
    </div>
    <p class="shop-note reveal">Prices checked 8 August 2026. Tor Sports may run offers we haven&rsquo;t caught &mdash; their page is always right.</p>
  </div>
</section>

<?php // ---- Why it matters. The club's actual pitch for buying. ---- ?>
<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> Where the money goes</div><h2>Every order backs the club</h2></div></div>
    <div class="tg-grid shop-why reveal">
      <div class="tg-info"><div class="kick" style="color:var(--gold)">Grassroots</div><h3>Straight back in</h3><p>Shop income goes where subs and gate money go &mdash; pitches, kit, referees and coaching, across every team from the minis up.</p></div>
      <div class="tg-info"><div class="kick" style="color:var(--gold)">10%</div><h3>Music Venue Trust</h3><p>Every Music Shirt sold sends a tenth of its profit to <a href="https://www.musicvenuetrust.com" target="_blank" rel="noopener">Music Venue Trust</a>, protecting the grassroots venues those four bands came through.</p></div>
      <div class="tg-info"><div class="kick" style="color:var(--gold)">Local</div><h3>Made with Tor</h3><p>Our kit partner <a href="https://www.tor-sports.co.uk/" target="_blank" rel="noopener">Tor Sports</a> run the shop, so orders are handled properly and the club isn&rsquo;t sitting on stock.</p></div>
    </div>
    <div class="shop-foot reveal">
      <a class="btn btn-gold" href="<?php echo esc_url($cc25_shopall); ?>" target="_blank" rel="noopener">Visit the full club shop</a>
      <a class="btn btn-outline" href="<?php echo esc_url(cc25_page_url('celtic-bond', $cc25_home)); ?>">Or join the Celtic Bond</a>
    </div>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
