<?php
/**
 * Template Name: Sponsorship
 * "Sponsorship Opportunities" — the commercial pitch page (partner with the
 * club). Ways-to-partner + tailored packages, NO public pricing (by design),
 * strong contact CTA. Replaces the out-of-date Divi page (was the 22/23
 * brochure + old contact).
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');

$spx_email    = cc25_sponsorship_email();
$spx_brochure = cc25_sponsorship_brochure();

// Ways to partner — names + benefit copy, prices intentionally omitted.
$spx_ways = array(
    array('Shirt &amp; Kit', 'Front, back, sleeve or training kit — your logo on home &amp; away shirts, worn all season, home and away.'),
    array('Perimeter Boards', 'Branded pitchside hoardings seen at every matchday — and in the match photography that travels across social media.'),
    array('Matchday &amp; Match Ball', 'Sponsor a full matchday or the match ball — PA announcements, social posts and matchday hospitality.'),
    array('Stadium Naming Rights', 'Put your name on our home — signage, PA and a presence across every piece of club media.'),
    array("Women's &amp; Youth Teams", 'Back our women&rsquo;s side (SWFA Cup champions) or a youth team — kit, training gear and branding.'),
    array('Hospitality &amp; Programme', 'Become our official hospitality partner or matchday-programme sponsor — events, awards nights and full-page presence.'),
    array('Digital &amp; Social', 'A digital-first partnership — content collaboration, post branding and mentions to our online supporters.'),
    array('Canteen / Tea Bar', 'Brand the matchday canteen — signage, cups and menu boards in the busiest spot on the ground.'),
);

// Tailored packages — perks only, no pricing.
$spx_pkgs = array(
    array('Platinum', 'Shirt front, all perimeter boards, 10 matchday tickets, social mentions and a programme page.'),
    array('Gold', 'Shirt sleeve, four boards, six matchday tickets and social mentions.'),
    array('Silver', 'Two perimeter boards and four matchday tickets.'),
    array('Board', 'A single perimeter board for the full season — a great first step.'),
);
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">PARTNERS</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <span style="color:#fff">Sponsorship</span></div>
    <h1>Sponsorship Opportunities</h1>
    <p>Put your brand behind a hundred-year-old community club — and reach supporters across Cwmbran and beyond.</p>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ix">01</span><span class="ln"></span> Why partner with the Celts</div><h2>The feel-good factor</h2></div></div>
    <p class="spx-lead reveal">Whatever the result on the pitch, Cwmbran Celtic Commercial delivers one of the finest matchday experiences in Welsh League football. Backing the Celts gives your business that &lsquo;feel-good factor&rsquo; of supporting your local community team — providing football and fun for more than 500 players of all ages and genders — while putting your brand in front of supporters home, away and online.</p>

    <div class="stats reveal d1">
      <div class="stat"><div class="n">1924</div><div class="l">Established &mdash; a century of Celts</div></div>
      <div class="stat"><div class="n">500+</div><div class="l">Players, all ages &amp; genders</div></div>
      <div class="stat"><div class="n">2</div><div class="l">Senior teams &mdash; Men&rsquo;s &amp; Women&rsquo;s</div></div>
      <div class="stat"><div class="n">Champions</div><div class="l">Women&rsquo;s SWFA Cup holders</div></div>
    </div>
  </div>
</section>

<section class="band sec-alt">
  <div class="wrap">
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ix">02</span><span class="ln"></span> Ways to partner</div><h2>Find the right fit</h2></div></div>
    <div class="spx-ways reveal d1">
      <?php foreach ($spx_ways as $w): ?>
      <div class="spx-way">
        <h3><?php echo $w[0]; ?></h3>
        <p><?php echo $w[1]; ?></p>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ix">03</span><span class="ln"></span> Tailored packages</div><h2>Done-for-you, or build your own</h2></div></div>
    <div class="spx-pkgs reveal d1">
      <?php foreach ($spx_pkgs as $p): ?>
      <div class="spx-pkg">
        <h3><?php echo esc_html($p[0]); ?></h3>
        <p><?php echo $p[1]; ?></p>
      </div>
      <?php endforeach; ?>
    </div>
    <p class="spx-note reveal">Prefer a ready-made bundle? Choose Platinum, Gold, Silver or Board — or we&rsquo;ll build a package around your goals and budget. Contra and in-kind deals are always welcome.</p>
  </div>
</section>

<section class="band sec-alt">
  <div class="wrap">
    <div class="cta reveal">
      <div class="grain"></div>
      <div>
        <div class="kick" style="color:var(--gold);position:relative;z-index:2">Let&rsquo;s talk</div>
        <h2>Back the Celts this season</h2>
        <p>Tell us about your business and we&rsquo;ll shape a partnership that works — from a single perimeter board to a season-long headline deal.</p>
      </div>
      <div class="signup" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">
        <a class="btn btn-gold btn-block" href="mailto:<?php echo esc_attr($spx_email); ?>?subject=<?php echo rawurlencode('Cwmbran Celtic sponsorship enquiry'); ?>">Email our commercial team</a>
        <?php if ($spx_brochure): ?>
        <a class="btn btn-outline btn-block" href="<?php echo esc_url($spx_brochure); ?>" target="_blank" rel="noopener">Download the brochure (PDF)</a>
        <?php endif; ?>
        <small style="color:var(--on-navy-dim);text-align:center"><?php echo esc_html($spx_email); ?></small>
      </div>
    </div>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
