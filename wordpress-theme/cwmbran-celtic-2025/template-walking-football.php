<?php
/**
 * Template Name: Walking Football
 * The club's Walking Football section. Sessions, prices, story and inclusion
 * render here; fixtures, the gallery and sponsorship tiers link out to the
 * section's own site, which they keep updated. Data: cc25_wf_* in functions.php.
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$cc25_home  = home_url('/');
$cc25_wf    = cc25_wf_links();
$cc25_ven   = cc25_wf_venue();
$cc25_tel   = preg_replace('/\s+/', '', $cc25_wf['phone']);
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">WALKING</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url($cc25_home); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('teams', $cc25_home)); ?>" style="color:var(--on-navy-dim)">Teams</a> / <span style="color:#fff">Walking Football</span></div>
    <h1>Walking Football</h1>
    <p>Football at a walking pace &mdash; men's, women's and mixed sessions every week in Llantarnam. Friendship, fitness and fun, whatever your starting point.</p>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div>
      <div class="sec-eye kick"><span class="ln"></span> The game</div>
      <h2>What it is, and who can play</h2>
    </div></div>
    <p class="reveal" style="color:var(--muted);max-width:62ch;margin:0 0 18px">Walking football is a slower-paced version of the game, designed to keep people active, social and smiling. The rule that defines it is simple: <strong style="color:var(--text)">no running</strong>. That takes the strain out of the game and opens it up to players who thought their playing days were behind them.</p>
    <div class="wf-two reveal">
      <div class="jr-card">
        <h3>Who can play</h3>
        <ul class="wf-list">
          <li>Anyone aged 50 and over</li>
          <li>Players coming back from injury</li>
          <li>Anyone managing a health condition</li>
          <li>Anyone who would rather take it at a gentler pace</li>
        </ul>
        <p class="wf-fine">Sessions run for men, women and mixed groups &mdash; and the social sessions are open to all ages.</p>
      </div>
      <div class="jr-card">
        <h3>Why people stay</h3>
        <ul class="wf-list">
          <li>Fitness, balance and heart health, without the pounding</li>
          <li>Friendships and a community that looks out for each other</li>
          <li>A welcoming session whatever your ability</li>
          <li>A way back into the game you never stopped loving</li>
        </ul>
        <p class="wf-fine">Walking football was first played in 2011. It now has its own governing bodies and national and international tournaments.</p>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div>
      <div class="sec-eye kick"><span class="ln"></span> Every week</div>
      <h2>Session times</h2>
    </div></div>
    <div class="wf-sessions reveal">
      <?php foreach (cc25_wf_sessions() as $s): ?>
        <div class="wf-session">
          <div class="nm"><?php echo esc_html($s['label']); ?></div>
          <div class="when"><span class="day"><?php echo esc_html($s['day']); ?></span><span class="time"><?php echo esc_html($s['time']); ?></span></div>
        </div>
      <?php endforeach; ?>
    </div>
    <p class="spx-note reveal">All sessions are played at <strong style="color:var(--text)"><?php echo esc_html($cc25_ven['name']); ?></strong>, <?php echo esc_html($cc25_ven['address']); ?>. <a href="<?php echo esc_url($cc25_ven['map']); ?>" target="_blank" rel="noopener">Open in maps &rarr;</a><br>New players are always welcome &mdash; just turn up, or call <a href="tel:<?php echo esc_attr($cc25_tel); ?>"><?php echo esc_html($cc25_wf['phone']); ?></a> first for a chat.</p>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div>
      <div class="sec-eye kick"><span class="ln"></span> Membership</div>
      <h2>What it costs</h2>
    </div></div>
    <div class="wf-prices reveal">
      <?php foreach (cc25_wf_prices() as $p): ?>
        <div class="wf-price">
          <div class="amt"><?php echo esc_html($p['price']); ?><span class="per">/month</span></div>
          <div class="lbl"><?php echo esc_html($p['label']); ?></div>
          <div class="note">
            <?php echo esc_html($p['note']); ?>
            <?php if (!empty($p['bond'])): ?>
              <a href="<?php echo esc_url(cc25_page_url('celtic-bond', $cc25_home)); ?>">About the Celtic Bond &rarr;</a>
            <?php endif; ?>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
    <p class="spx-note reveal">Prices are set by the Walking Football section &mdash; check the <a href="<?php echo esc_url($cc25_wf['sessions']); ?>" target="_blank" rel="noopener">section's own site</a> for the latest.</p>
  </div>
</section>
<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div>
      <div class="sec-eye kick"><span class="ln"></span> Since 2024</div>
      <h2>Our story</h2>
    </div></div>
    <p class="reveal" style="color:var(--muted);max-width:62ch;margin:0 0 20px">It started with a handful of players who missed the game. Inside two years it became one of the busiest parts of the club.</p>
    <ol class="wf-tl reveal">
      <?php foreach (cc25_wf_timeline() as $m): ?>
        <li>
          <span class="when"><?php echo esc_html($m['when']); ?></span>
          <span class="what"><?php echo esc_html($m['what']); ?></span>
        </li>
      <?php endforeach; ?>
    </ol>
    <blockquote class="wf-quote reveal">
      <p>&ldquo;It's incredible that in such a short space of time, walking football has brought back my confidence.&rdquo;</p>
      <cite>Emma</cite>
    </blockquote>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div>
      <div class="sec-eye kick"><span class="ln"></span> Social inclusion</div>
      <h2>More than just football</h2>
    </div></div>
    <p class="reveal" style="color:var(--muted);max-width:62ch;margin:0 0 18px">The section believes football should be open to everyone, whatever their age, background, ability, fitness or financial circumstances.</p>
    <div class="wf-three reveal">
      <div class="jr-card">
        <h3>Our values</h3>
        <ul class="wf-list">
          <li>Everyone is welcome</li>
          <li>New players are encouraged, never judged</li>
          <li>Social connection matters as much as competition</li>
        </ul>
      </div>
      <div class="jr-card">
        <h3>Health &amp; wellbeing</h3>
        <ul class="wf-list">
          <li>Physical fitness</li>
          <li>Mental wellbeing</li>
          <li>Healthy ageing</li>
          <li>Less loneliness and isolation</li>
        </ul>
      </div>
      <div class="jr-card">
        <h3>Our commitment</h3>
        <ul class="wf-list">
          <li>Treating every member fairly and with respect</li>
          <li>Promoting equality, diversity and inclusion</li>
          <li>Challenging discrimination in all its forms</li>
        </ul>
      </div>
    </div>
    <blockquote class="wf-quote reveal">
      <p>&ldquo;Walking football means the world to me. It's helped me so much in finding who I am again.&rdquo;</p>
      <cite>A Cwmbran Celtic walking footballer</cite>
    </blockquote>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div>
      <div class="sec-eye kick"><span class="ln"></span> Keep up</div>
      <h2>Fixtures &amp; photos</h2>
    </div></div>
    <p class="reveal" style="color:var(--muted);max-width:62ch;margin:0 0 18px">The section runs its own site and keeps it up to date &mdash; that's where the current fixtures and the photo gallery live.</p>
    <div class="wf-two reveal">
      <div class="jr-card">
        <h3>Fixtures &amp; tournaments</h3>
        <p class="wf-fine">Friendlies, league games and tournament dates, kept current by the section.</p>
        <a class="btn btn-sm btn-gold" href="<?php echo esc_url($cc25_wf['site']); ?>" target="_blank" rel="noopener">View fixtures &rarr;</a>
      </div>
      <div class="jr-card">
        <h3>Photo gallery</h3>
        <p class="wf-fine">Matchdays, fun days and tournaments, from the first session onwards.</p>
        <a class="btn btn-sm btn-outline" href="<?php echo esc_url($cc25_wf['gallery']); ?>" target="_blank" rel="noopener">View gallery &rarr;</a>
      </div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <div class="cta reveal">
      <div class="grain"></div>
      <div>
        <div class="kick" style="color:var(--gold);position:relative;z-index:2">Get involved</div>
        <h2>Come and have a game</h2>
        <p>Turn up to a session, or get in touch first if you would rather ask a few questions. Businesses can back the section directly &mdash; sponsorship funds pitch hire, kit, competition fees, insurance and help for new members.</p>
      </div>
      <div class="signup" style="display:flex;flex-direction:column;gap:10px;justify-content:center">
        <a class="btn btn-gold btn-block" href="tel:<?php echo esc_attr($cc25_tel); ?>">Call <?php echo esc_html($cc25_wf['phone']); ?></a>
        <a class="btn btn-outline btn-block" href="<?php echo esc_url($cc25_wf['whatsapp']); ?>" target="_blank" rel="noopener">WhatsApp</a>
        <a class="btn btn-outline btn-block" href="<?php echo esc_url($cc25_wf['facebook']); ?>" target="_blank" rel="noopener">Facebook</a>
        <a class="btn btn-outline btn-block" href="<?php echo esc_url($cc25_wf['sponsorship']); ?>" target="_blank" rel="noopener">Sponsor the section</a>
      </div>
    </div>
    <p class="spx-note reveal">Walking Football is part of Cwmbran Celtic FC and runs its own site at <a href="<?php echo esc_url($cc25_wf['site']); ?>" target="_blank" rel="noopener">cwmbrancelticwalkingfootball.co.uk</a>.</p>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
