<?php
/**
 * Front Page — Cwmbran Celtic premium homepage.
 * Round 1: static premium design (live feed wired in Round 2).
 */
if (!defined('ABSPATH')) exit;
$feed     = cc25_feed();
$team     = 'mens';
$next     = cc25_next_fixture($feed, $team);
$result   = cc25_latest_result($feed, $team);
$upcoming = cc25_upcoming($feed, $team, 4);
$table    = cc25_table($feed, $team);
get_template_part('template-parts/site-header');
?>

<section class="hero">
  <div class="bgphoto has-photo" style="background-image:url('<?php echo esc_url(get_stylesheet_directory_uri() . '/assets/img/hero.jpg'); ?>')"></div><div class="streak"></div><div class="grain"></div>
  <div class="ghost">CELTIC</div>
  <div class="hero-in">
    <span class="hero-eyebrow kick"><span class="ln"></span> Next Match · Ardal League South East</span>
    <h1>Matchday<br><span class="thin">at the Motazone Arena</span></h1>
    <p class="hero-sub">Blue and yellow, since 1925. Follow the Celts through the 2025/26 season — every fixture, every result, live.</p>
    <div class="count" id="count" aria-label="Countdown to kick-off" data-ko="<?php echo $next ? intval($next['date']) : ''; ?>">
      <div class="u"><div class="n" id="cd-d">00</div><div class="l">Days</div></div>
      <div class="sep">:</div>
      <div class="u"><div class="n" id="cd-h">00</div><div class="l">Hrs</div></div>
      <div class="sep">:</div>
      <div class="u"><div class="n" id="cd-m">00</div><div class="l">Mins</div></div>
      <div class="sep">:</div>
      <div class="u"><div class="n" id="cd-s">00</div><div class="l">Secs</div></div>
    </div>
  </div>
</section>

<?php if ($next):
  $o = cc25_opponent($next);
  $venue = $o['home'] ? '⚑ Motazone Arena' : '⚑ Away · ' . ($next['homeTeam'] ?? '');
?>
<div class="mcard-wrap">
  <div class="mcard">
    <div class="mcard-top">
      <span class="mc-tag"><span class="pulse"></span> Next Up</span>
      <span class="mc-comp"><?php echo esc_html($next['competition'] ?? 'Fixture'); ?></span>
      <span class="mc-venue"><?php echo esc_html($venue); ?></span>
    </div>
    <div class="mcard-body">
      <div class="mteam">
        <?php echo cc25_own_crest(60); ?>
        <div><div class="nm">Cwmbran Celtic</div><div class="rec"><?php echo $o['home'] ? 'At home' : 'On the road'; ?></div></div>
      </div>
      <div class="mko"><div class="t"><?php echo esc_html($next['time'] ?? 'TBC'); ?></div><div class="d"><?php echo esc_html(cc25_date($next['date'] ?? 0, 'D j M')); ?></div></div>
      <div class="mteam away">
        <?php echo cc25_crest($feed, $o['opponent'], 60); ?>
        <div><div class="nm"><?php echo esc_html($o['opponent']); ?></div><div class="rec"><?php echo $o['home'] ? 'Visitors' : 'Hosts'; ?></div></div>
      </div>
    </div>
    <div class="mcard-foot">
      <a class="btn btn-navy btn-sm" href="<?php echo esc_url(cc25_page_url('fixtures', home_url('/'))); ?>">Fixtures</a>
      <a class="btn btn-gold btn-sm" href="<?php echo esc_url(cc25_ext_url('tickets')); ?>" target="_blank" rel="noopener">Buy Tickets</a>
      <a class="btn btn-outline btn-sm" href="<?php echo esc_url(cc25_page_url('contact', home_url('/'))); ?>">Travel &amp; Ground</a>
    </div>
  </div>
</div>
<?php endif; ?>

<div class="league-strip">
  <div class="wrap">
    <span class="ll">Proud members of</span>
    <img src="<?php echo esc_url(get_stylesheet_directory_uri() . '/assets/img/league-logos.jpg'); ?>" alt="Ardal League South East &amp; Genero Adran South" loading="lazy">
  </div>
</div>

<section class="sec" style="padding-top:48px">
  <div class="wrap">
    <div class="grid-2">
      <div class="panel reveal">
        <div class="panel-h"><h3>Latest Result</h3><span class="badge"><?php echo $result ? esc_html($result['competition'] ?? 'Full Time') : 'Season 2025/26'; ?></span></div>
        <div class="panel-b">
        <?php if ($result):
          $ro = cc25_opponent($result);
          $home = ($result['homeAway'] ?? 'H') === 'H';
          $cc = intval($home ? ($result['homeScore'] ?? 0) : ($result['awayScore'] ?? 0));
          $op = intval($home ? ($result['awayScore'] ?? 0) : ($result['homeScore'] ?? 0));
          $wdl = $cc > $op ? 'w' : ($cc < $op ? 'l' : 'd');
        ?>
          <div class="result">
            <div><?php echo cc25_own_crest(58); ?><div class="cn">Cwmbran<br>Celtic</div></div>
            <div class="sc"><?php echo $cc . '–' . $op; ?><small>Full Time</small></div>
            <div><?php echo cc25_crest($feed, $ro['opponent'], 58); ?><div class="cn"><?php echo esc_html($ro['opponent']); ?></div></div>
          </div>
          <div class="result-foot"><span class="wdl <?php echo $wdl; ?>"><?php echo strtoupper($wdl); ?></span> <?php echo esc_html(cc25_date($result['date'] ?? 0)); ?><?php echo !empty($result['scorers']) ? ' · ' . esc_html($result['scorers']) : ''; ?></div>
        <?php else: ?>
          <p style="color:var(--muted);text-align:center;padding:22px 0;margin:0">No results yet — the new season is just around the corner.<br>Check back after the first whistle.</p>
        <?php endif; ?>
        </div>
      </div>
      <div class="panel reveal d1">
        <div class="panel-h"><h3>Upcoming</h3><span class="badge">Next <?php echo count($upcoming); ?></span></div>
        <div class="panel-b">
          <div class="fx">
          <?php if ($upcoming): foreach ($upcoming as $f): $fo = cc25_opponent($f); ?>
            <div class="fx-row">
              <div class="fx-d"><div class="n"><?php echo esc_html(cc25_date($f['date'] ?? 0, 'j')); ?></div><div class="m"><?php echo esc_html(cc25_date($f['date'] ?? 0, 'M')); ?></div></div>
              <div class="fx-o"><?php echo cc25_crest($feed, $fo['opponent'], 30); ?> <?php echo esc_html($fo['opponent']); ?></div>
              <span class="fx-ha <?php echo $fo['home'] ? 'h' : 'a'; ?>"><?php echo $fo['home'] ? 'Home' : 'Away'; ?></span>
            </div>
          <?php endforeach; else: ?>
            <p style="color:var(--muted);padding:16px 2px;margin:0">Fixtures will appear here once the season is released.</p>
          <?php endif; ?>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="tickets-band reveal">
      <div class="tk-card tk-season">
        <div class="kick" style="color:var(--gold)">Season 2025/26</div>
        <h3>Season Tickets</h3>
        <p>Every home league game at Motazone Arena — the best-value way to back the Celts all season long.</p>
        <a class="btn btn-gold" href="<?php echo esc_url(cc25_ext_url('tickets')); ?>" target="_blank" rel="noopener">Get a Season Ticket</a>
      </div>
      <div class="tk-card tk-match">
        <div class="kick" style="color:var(--blue-500)">Matchday</div>
        <h3>Matchday Tickets</h3>
        <p>Adults &pound;6 &middot; Concessions &pound;4 &middot; Under-16s free. Turn up and roar the Celts on.</p>
        <a class="btn btn-outline" href="<?php echo esc_url(cc25_ext_url('tickets')); ?>" target="_blank" rel="noopener">Matchday Info</a>
      </div>
      <div class="tk-card tk-bond">
        <div class="kick">The Celtic Bond &#9733;</div>
        <h3>Join the Bond</h3>
        <p>Win monthly cash prizes &amp; help fund the club — from just a few pounds a month.</p>
        <a class="btn btn-navy" href="<?php echo esc_url(cc25_page_url('celtic-bond', home_url('/'))); ?>">Join the Bond</a>
      </div>
    </div>
  </div>
</section>

<?php if ($table): ?>
<section class="sec sec-alt">
  <div class="wrap">
    <div class="sec-head reveal">
      <div><div class="sec-eye kick"><span class="ix">01</span><span class="ln"></span> The Table</div><h2>Ardal League South East</h2></div>
      <a class="viewall" href="<?php echo esc_url(cc25_page_url('fixtures', home_url('/'))); ?>">Full table &amp; results →</a>
    </div>
    <div class="table-wrap reveal d1">
      <div class="tscroll">
        <table class="lt tnum">
          <thead><tr><th>#</th><th class="club">Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead>
          <tbody>
          <?php foreach ($table as $row):
            $own = strpos((string) ($row['club'] ?? ''), 'Cwmbran Celtic') !== false;
            $gd = intval($row['gd'] ?? 0);
          ?>
            <tr<?php echo $own ? ' class="own"' : ''; ?>>
              <td class="pos"><?php echo intval($row['position'] ?? 0); ?></td>
              <td class="club"><?php echo cc25_crest($feed, $row['club'] ?? '', 26); ?> <?php echo esc_html($row['club'] ?? ''); ?></td>
              <td><?php echo intval($row['played'] ?? 0); ?></td>
              <td><?php echo intval($row['won'] ?? 0); ?></td>
              <td><?php echo intval($row['drawn'] ?? 0); ?></td>
              <td><?php echo intval($row['lost'] ?? 0); ?></td>
              <td><?php echo ($gd > 0 ? '+' : '') . $gd; ?></td>
              <td class="pts"><?php echo intval($row['points'] ?? 0); ?></td>
            </tr>
          <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>
<?php endif; ?>

<section class="sec">
  <div class="wrap">
    <div class="sec-head reveal">
      <div><div class="sec-eye kick"><span class="ix">02</span><span class="ln"></span> From the Club</div><h2>Latest News</h2></div>
      <a class="viewall" href="<?php echo esc_url(cc25_page_url('news', home_url('/'))); ?>">All news &rarr;</a>
    </div>
    <?php
    $cc25_news = new WP_Query(array('post_type' => 'post', 'posts_per_page' => 4, 'ignore_sticky_posts' => true));
    if ($cc25_news->have_posts()) : $cc25_n = 0;
      while ($cc25_news->have_posts()) : $cc25_news->the_post(); $cc25_n++; $cc25_c = get_the_category();
        if ($cc25_n === 1) : ?>
    <a class="news-lead reveal d1" href="<?php the_permalink(); ?>" style="color:inherit">
      <div class="photo"><?php if (has_post_thumbnail()) the_post_thumbnail('large', array('style' => 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover')); else echo '<div class="fill"></div><div class="gr"></div>'; ?><?php if ($cc25_c) echo '<span class="tag">' . esc_html($cc25_c[0]->name) . '</span>'; ?></div>
      <div class="lb">
        <time><?php echo esc_html(get_the_date()); ?></time>
        <h3><?php the_title(); ?></h3>
        <p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 26)); ?></p>
        <span class="viewall" style="margin-top:4px">Read more &rarr;</span>
      </div>
    </a>
    <div class="news-grid">
        <?php else : ?>
      <a class="ncard reveal" href="<?php the_permalink(); ?>" style="color:inherit">
        <div class="photo"><?php if (has_post_thumbnail()) the_post_thumbnail('medium_large', array('style' => 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover')); else echo '<div class="fill"></div><div class="gr"></div>'; ?><?php if ($cc25_c) echo '<span class="tag">' . esc_html($cc25_c[0]->name) . '</span>'; ?></div>
        <div class="ncb"><time><?php echo esc_html(get_the_date()); ?></time><h3><?php the_title(); ?></h3><p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 16)); ?></p></div>
      </a>
        <?php endif;
      endwhile;
      if ($cc25_n > 1) echo '</div>';
      wp_reset_postdata();
    else : ?>
      <p style="color:var(--muted);padding:20px 0">Club news will appear here once posts are published.</p>
    <?php endif; ?>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="bond-band reveal">
      <div class="grain"></div>
      <div class="bond-left">
        <div class="kick" style="color:var(--gold);position:relative;z-index:2">The Celtic Bond &#9733;</div>
        <h2>Back the Celts &amp; win every month</h2>
        <p>Join the Celtic Bond — our monthly members' draw. Every membership directly funds the club's future, and you could scoop a cash prize each month. The more members, the stronger the Celts.</p>
        <div class="bond-cta">
          <a class="btn btn-gold" href="<?php echo esc_url(cc25_page_url('celtic-bond', home_url('/'))); ?>">Join the Bond</a>
          <a class="btn btn-ghost" href="<?php echo esc_url(cc25_page_url('celtic-bond', home_url('/'))); ?>">How it works</a>
        </div>
      </div>
      <div class="bond-badge"><span class="bond-star">&#9733;</span><span class="bond-label">Members'<br>Draw</span></div>
    </div>
  </div>
</section>

<section class="heritage">
  <div class="grain"></div><div class="ghost">1925</div>
  <div class="heritage-in">
    <div class="est"><div class="y">1925</div><div class="t">ESTABLISHED</div></div>
    <div class="reveal">
      <h2>A century of blue &amp; yellow in Cwmbran</h2>
      <p>From the valleys to the Ardal League, Cwmbran Celtic has been the heartbeat of local football for a hundred years — built on community, youth and the people of the town.</p>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="cta reveal">
      <div class="grain"></div>
      <div>
        <div class="kick" style="color:var(--gold);position:relative;z-index:2">Stay in the loop</div>
        <h2>Never miss a Celts matchday</h2>
        <p>Fixtures, results, ticket news and club updates — straight to your inbox, every week during the season.</p>
      </div>
      <form class="signup" id="cc25-signup" data-endpoint="<?php echo esc_url(cc25_signup_endpoint()); ?>" data-secret="<?php echo esc_attr(cc25_signup_secret()); ?>">
        <label for="cc25-fn">Join the mailing list</label>
        <div class="row">
          <input id="cc25-fn" name="name" type="text" placeholder="First name" aria-label="First name" autocomplete="given-name">
          <input id="cc25-em" name="email" type="email" required placeholder="you@email.com" aria-label="Email" autocomplete="email">
          <button class="btn btn-gold" type="submit">Sign up</button>
        </div>
        <?php /* Honeypot: real people leave this empty; bots fill it and get silently ignored. */ ?>
        <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden">
        <small class="cc25-signup-msg" aria-live="polite">Free · unsubscribe any time · we never share your details.</small>
      </form>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head reveal">
      <div><div class="sec-eye kick"><span class="ix">03</span><span class="ln"></span> Proudly supported by</div><h2>Our Sponsors</h2></div>
      <a class="viewall" href="<?php echo esc_url(cc25_page_url('sponsors', home_url('/'))); ?>">All sponsors →</a>
    </div>
    <?php $cc25_main = cc25_sponsor_main(); ?>
    <div class="sponsor-main reveal">
      <?php echo cc25_sponsor_logo($cc25_main['name'], $cc25_main['file'], isset($cc25_main['url']) ? $cc25_main['url'] : ''); ?>
    </div>
    <div class="sponsor-wall reveal d1">
    <?php foreach (cc25_sponsors() as $s): ?>
      <div class="sponsor-card"><?php echo cc25_sponsor_logo($s[0], $s[1], isset($s[2]) ? $s[2] : '', ' loading="lazy"'); ?></div>
    <?php endforeach; ?>
    </div>
  </div>
</section>

<?php get_template_part('template-parts/site-footer'); ?>
