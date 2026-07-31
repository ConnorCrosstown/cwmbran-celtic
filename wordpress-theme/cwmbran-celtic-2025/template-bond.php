<?php
/**
 * Template Name: The Celtic Bond
 * Premium replacement for the club's dated /the-celtic-bond/ page: the 100-Club
 * style monthly draw — what it is, how it works, and how to join.
 * Applies automatically to the page with slug "the-celtic-bond".
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$cc25_home     = home_url('/');
$cc25_amt      = cc25_bond_amount();
$cc25_join     = cc25_bond_join_url();
$cc25_join_url = $cc25_join ? $cc25_join : cc25_page_url('contact', $cc25_home);
$cc25_results  = cc25_page_url('bond-results', '');
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">BOND</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url($cc25_home); ?>">Home</a> / <span style="color:#fff">The Celtic Bond</span></div>
    <h1>The Celtic Bond</h1>
    <p>The club's 100&nbsp;Club &mdash; back the Celts every month for just <?php echo esc_html($cc25_amt); ?>, and you could land a cash prize while funding the future of the club.</p>
    <div class="teamsel">
      <a class="btn btn-gold btn-sm" href="#join">Join the Bond &rarr;</a>
      <a class="btn btn-outline btn-sm" href="#winners">Latest winners</a>
    </div>
  </div>
</div>

<?php $cc25_draws = function_exists('cc25_bond_draws') ? cc25_bond_draws() : array(); if ($cc25_draws): $cc25_d = $cc25_draws[0]; ?>
<section class="band" id="winners">
  <div class="wrap">
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> Latest draw &middot; <?php echo esc_html(date('j F Y', strtotime($cc25_d['date']))); ?></div><h2><?php echo esc_html($cc25_d['label']); ?> &mdash; Winners</h2></div></div>
    <div class="table-wrap reveal"><div class="tscroll">
      <table class="lt tnum">
        <thead><tr><th>No.</th><th class="club">Winner</th><th>Prize</th><th class="club">Section</th></tr></thead>
        <tbody>
        <?php foreach ($cc25_d['winners'] as $cc25_w): ?>
          <tr><td class="pos"><?php echo intval($cc25_w['no']); ?></td><td class="club"><?php echo esc_html($cc25_w['name']); ?></td><td class="pts"><?php echo esc_html($cc25_w['prize']); ?></td><td class="club"><?php echo esc_html($cc25_w['group']); ?></td></tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </div></div>
    <p class="reveal" style="color:var(--muted);margin-top:14px">Congratulations to all our winners! Every draw is made by committee members with witnesses. Want your own number in the next one? <a href="#join" style="color:var(--blue-500)">Join the Bond &rarr;</a></p>
  </div>
</section>
<?php endif; ?>

<section class="band">
  <div class="wrap">
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> Back your club</div><h2>What is the Celtic Bond?</h2></div></div>
    <p class="reveal" style="max-width:760px;font-size:1.12rem;line-height:1.7;color:var(--muted);margin:-10px 0 34px">
      The Celtic Bond is our 100&nbsp;Club-style monthly draw. For <strong style="color:var(--text)"><?php echo esc_html($cc25_amt); ?> a month</strong> you get your own number in every draw &mdash; and every penny goes straight back into Cwmbran Celtic, from our mini and junior sides right through to the first teams and 60+ walking football.
    </p>
    <div class="tg-grid reveal">
      <div class="tg-info"><div class="kick" style="color:var(--gold)">Win</div><h3>Monthly cash prizes</h3><p>A cash prize drawn every single month. The more members join, the bigger the pot gets.</p></div>
      <div class="tg-info"><div class="kick" style="color:var(--gold)">Give back</div><h3>Every penny funds the club</h3><p>Your subscription supports every team &mdash; mini, junior, first teams, women's and 60+ walking football.</p></div>
      <div class="tg-info"><div class="kick" style="color:var(--gold)">Yours</div><h3>Your own lucky number</h3><p>You keep the same allocated number in every monthly draw for as long as you're a member.</p></div>
      <div class="tg-info"><div class="kick" style="color:var(--gold)">Easy</div><h3>Just <?php echo esc_html($cc25_amt); ?> a month</h3><p>One simple direct debit. No fuss, and you can cancel any time.</p></div>
    </div>
  </div>
</section>

<section class="band" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> The draw</div><h2>How it works</h2></div></div>
    <div class="tg-grid reveal">
      <div class="tg-info"><div class="kick" style="color:var(--blue-500)">01</div><h3>Get your number</h3><p>When you join you're given a permanent number, from 1 up to however many members there are.</p></div>
      <div class="tg-info"><div class="kick" style="color:var(--blue-500)">02</div><h3>Drawn every month</h3><p>The draw takes place on the last Saturday of each month, using a random number generator.</p></div>
      <div class="tg-info"><div class="kick" style="color:var(--blue-500)">03</div><h3>Fair &amp; witnessed</h3><p>Every draw is made by at least two committee members with two witnesses, then recorded and archived.</p></div>
      <div class="tg-info"><div class="kick" style="color:var(--blue-500)">04</div><h3>Winners paid</h3><p>If your number comes up, we'll be in touch &mdash; and your prize is on its way.</p></div>
    </div>
  </div>
</section>

<section class="band" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ln"></span> Get involved</div><h2>How to join</h2></div></div>
    <div class="tg-grid reveal">
      <div class="tg-info"><div class="kick" style="color:var(--gold)">Step 1</div><h3>Register your details</h3><p>Send us your name, email, phone number and how you're connected to the club.</p></div>
      <div class="tg-info"><div class="kick" style="color:var(--gold)">Step 2</div><h3>Set up your direct debit</h3><p>Complete a quick, secure <?php echo esc_html($cc25_amt); ?>-a-month direct debit.</p></div>
      <div class="tg-info"><div class="kick" style="color:var(--gold)">Step 3</div><h3>Get your number</h3><p>Once we've verified your membership, your Celtic Bond number is emailed straight to you.</p></div>
    </div>

    <div id="join" class="bond-join reveal">
      <div class="bond-join-copy">
        <div class="kick" style="color:var(--gold)">Ready to back the Celts?</div>
        <h2>Join the Celtic Bond</h2>
        <p>Fill in your details and we'll be in touch to set up your <?php echo esc_html($cc25_amt); ?>-a-month direct debit and give you your Bond number. Questions? Email <a href="mailto:<?php echo esc_attr(cc25_bond_email()); ?>"><?php echo esc_html(cc25_bond_email()); ?></a>.</p>
      </div>
      <div class="bond-form-card">
        <?php $cc25_bond_state = isset($_GET['bond']) ? sanitize_key($_GET['bond']) : ''; ?>
        <?php if ($cc25_bond_state === 'sent'): ?>
          <div class="bond-note ok"><strong>Thanks &mdash; you're on the list!</strong><br>We'll be in touch soon to set up your direct debit and give you your Celtic Bond number.</div>
        <?php else: ?>
          <?php if ($cc25_bond_state === 'err'): ?><div class="bond-note err">Please add your name and a valid email address, then try again.</div><?php endif; ?>
          <form class="bond-form" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <input type="hidden" name="action" value="cc25_bond_join">
            <div class="bf-row">
              <label>Your name<input type="text" name="cc_name" required></label>
              <label>Email<input type="email" name="cc_email" required></label>
            </div>
            <div class="bf-row">
              <label>Phone<input type="tel" name="cc_phone"></label>
              <label>Connection to the club<input type="text" name="cc_conn" placeholder="supporter, player's parent&hellip;"></label>
            </div>
            <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="bf-hp">
            <button type="submit" class="btn btn-gold btn-block">Join the Celtic Bond &rarr;</button>
            <small>We'll only use these details to set up your Bond membership.</small>
          </form>
        <?php endif; ?>
      </div>
    </div>

    <p class="reveal" style="color:var(--faint);font-size:.85rem;line-height:1.6;margin:22px 0 0;max-width:760px">
      The committee reserves the right to change the amount and number of prizes and to introduce special prize draws at their discretion. In the case of any dispute, the committee's decision is final.
    </p>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
