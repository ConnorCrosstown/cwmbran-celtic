<?php
/**
 * Template Name: Travel & Ground
 * Everything a visiting supporter (or new fan) needs for a matchday at
 * The Motazone Arena: address, map, how to get here, admission and facilities.
 * Assign this template by giving the WP page the slug "travel-and-ground".
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$cc25_home    = home_url('/');
$cc25_venue   = 'The Motazone Arena';
$cc25_venue2  = 'Celtic Park';
$cc25_addr    = 'Henllys Way, Cwmbran, Torfaen, NP44 3FS';
$cc25_pc      = 'NP44 3FS';
$cc25_mapq    = rawurlencode($cc25_venue . ', Henllys Way, Cwmbran ' . $cc25_pc);
$cc25_dir_url = 'https://www.google.com/maps/dir/?api=1&destination=' . rawurlencode('The Motazone Arena Cwmbran ' . $cc25_pc);
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">GROUND</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url($cc25_home); ?>">Home</a> / <span style="color:#fff">Travel &amp; Ground</span></div>
    <h1>Travel &amp; Ground</h1>
    <p>Everything you need for a matchday with the Celts &mdash; how to find us, how to get here, and what to expect when you arrive.</p>
    <div class="teamsel">
      <a class="btn btn-gold btn-sm" href="<?php echo esc_url($cc25_dir_url); ?>" target="_blank" rel="noopener">Get directions &rarr;</a>
      <a class="btn btn-outline btn-sm" href="<?php echo esc_url(cc25_page_url('fixtures', $cc25_home)); ?>">See fixtures</a>
    </div>
  </div>
</div>

<section class="band">
  <div class="wrap">

    <!-- Address + map -->
    <div class="tg-top reveal">
      <div class="tg-addr">
        <div class="kick" style="color:var(--gold)">The Home of Cwmbran Celtic</div>
        <h2><?php echo esc_html($cc25_venue); ?></h2>
        <p class="tg-sub"><?php echo esc_html($cc25_venue2); ?></p>
        <address class="tg-address"><?php echo esc_html($cc25_addr); ?></address>
        <div class="tg-satnav"><span class="lab">Sat nav</span><strong><?php echo esc_html($cc25_pc); ?></strong></div>
        <div class="tg-btns">
          <a class="btn btn-navy btn-sm" href="<?php echo esc_url($cc25_dir_url); ?>" target="_blank" rel="noopener">Directions</a>
          <a class="btn btn-outline btn-sm" href="<?php echo esc_url('https://www.google.com/maps/search/?api=1&query=' . $cc25_mapq); ?>" target="_blank" rel="noopener">Open in Maps</a>
        </div>
      </div>
      <div class="tg-map">
        <iframe title="Map to The Motazone Arena" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=<?php echo $cc25_mapq; ?>&output=embed"></iframe>
      </div>
    </div>

    <!-- Getting here -->
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> Getting here</div><h2>How to reach us</h2></div></div>
    <div class="tg-grid reveal">
      <div class="tg-info">
        <div class="kick" style="color:var(--blue-500)">By car</div>
        <h3>From the M4</h3>
        <p>Leave the M4 at <strong>Junction 26 (Newport)</strong> and follow the A4051 north towards Cwmbran. The ground is off Henllys Way on the western side of town. Sat nav postcode <strong><?php echo esc_html($cc25_pc); ?></strong>.</p>
      </div>
      <div class="tg-info">
        <div class="kick" style="color:var(--blue-500)">Parking</div>
        <h3>At the ground</h3>
        <p>Parking is available at the ground and on the surrounding streets. Please park considerately and leave residents' driveways and junctions clear.</p>
      </div>
      <div class="tg-info">
        <div class="kick" style="color:var(--blue-500)">By train</div>
        <h3>Cwmbran station</h3>
        <p>Cwmbran railway station is roughly <strong>1.5 miles</strong> away, on the line between Cardiff, Newport and Hereford. It's a short taxi or bus ride to the ground from there.</p>
      </div>
      <div class="tg-info">
        <div class="kick" style="color:var(--blue-500)">By bus</div>
        <h3>Cwmbran bus station</h3>
        <p>Cwmbran bus station is in the town centre, with local services running out towards Henllys and Fairwater close to the ground.</p>
      </div>
    </div>

    <!-- On the day -->
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> On the day</div><h2>Matchday info</h2></div></div>
    <div class="tg-grid reveal">
      <div class="tg-info">
        <div class="kick" style="color:var(--gold)">Admission</div>
        <h3>Pay on the gate</h3>
        <p><strong>Adults &pound;6</strong> &middot; <strong>Concessions &pound;4</strong> &middot; <strong>Under-16s free</strong>. You can also grab tickets in advance online.</p>
        <a class="btn btn-gold btn-sm" href="<?php echo esc_url(cc25_ext_url('tickets')); ?>" target="_blank" rel="noopener">Buy tickets</a>
      </div>
      <div class="tg-info">
        <div class="kick" style="color:var(--gold)">Kick-off</div>
        <h3>When to arrive</h3>
        <p>Saturday fixtures usually kick off at <strong>2:30pm</strong>, with midweek games at <strong>7:30pm</strong>. Always check the fixture for the exact time &mdash; a few games move.</p>
        <a class="btn btn-outline btn-sm" href="<?php echo esc_url(cc25_page_url('fixtures', $cc25_home)); ?>">Check the fixture</a>
      </div>
      <div class="tg-info">
        <div class="kick" style="color:var(--gold)">At the ground</div>
        <h3>Clubhouse &amp; bar</h3>
        <p>The clubhouse is open on matchdays for hot and cold drinks, snacks and a pint before, during and after the game. Come and make a day of it.</p>
      </div>
      <div class="tg-info">
        <div class="kick" style="color:var(--gold)">Accessibility</div>
        <h3>Access for all</h3>
        <p>There's step-free access and hard standing around the pitch. If you have specific access requirements, <a href="<?php echo esc_url(cc25_page_url('contact', $cc25_home)); ?>">get in touch</a> before the game and we'll help.</p>
      </div>
    </div>

    <!-- Away supporters -->
    <div class="cta reveal">
      <div class="grain"></div>
      <div>
        <div class="kick" style="color:var(--gold);position:relative;z-index:2">Visiting supporters</div>
        <h2>You're very welcome</h2>
        <p>Cwmbran Celtic is a friendly, family club. Away fans are welcome right across the ground &mdash; come and enjoy the game, and the clubhouse afterwards. Travelling with a team? We'll send your club a matchday info sheet ahead of the visit.</p>
      </div>
      <div class="signup" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">
        <a class="btn btn-gold btn-block" href="<?php echo esc_url($cc25_dir_url); ?>" target="_blank" rel="noopener">Get directions &rarr;</a>
        <a class="btn btn-navy btn-block" href="<?php echo esc_url(cc25_page_url('contact', $cc25_home)); ?>">Contact the club</a>
      </div>
    </div>

  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
