<?php
/**
 * Template Name: Contact
 * Everyone who runs the club, as people cards grouped by what they do — the same
 * visual language as the squad cards, with a portrait instead of a designed 4:5.
 *
 * Data comes from cc25_people(): wp-admin first, the club's own list as fallback.
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');

$cc25_home   = home_url('/');
$cc25_groups = cc25_people_by_group();
$cc25_safe   = null;
foreach (cc25_people() as $cc25_p) {
    if (cc25_person_is_safeguarding($cc25_p)) { $cc25_safe = $cc25_p; break; }
}
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">CONTACT</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url($cc25_home); ?>">Home</a> / <span style="color:#fff">Contact</span></div>
    <h1>Contact the Club</h1>
    <p>Cwmbran Celtic is run by volunteers. Whatever you need &mdash; joining a team, sponsoring the club, booking the function room &mdash; someone below is the right person to ask.</p>
    <div class="teamsel">
      <a class="btn btn-gold btn-sm" href="<?php echo esc_url(cc25_phone_href(cc25_club_phone())); ?>">Social Club &middot; <?php echo esc_html(cc25_club_phone()); ?></a>
      <?php // btn-ghost, not btn-outline: outline takes its colour from --text, which is
      // near-black and invisible on the navy hero. ?>
      <a class="btn btn-ghost btn-sm" href="<?php echo esc_url(cc25_page_url('travel', $cc25_home)); ?>">Find the ground &rarr;</a>
    </div>
  </div>
</div>

<?php // Safeguarding, picked out above the directory. A club with juniors and minis
// should not make this the thing you scroll to find.
if ($cc25_safe): ?>
<section class="band band-tight">
  <div class="wrap">
    <div class="safeguard-note reveal">
      <div class="safeguard-ico" aria-hidden="true">&#9873;</div>
      <div>
        <div class="kick safeguard-eye">Safeguarding</div>
        <p>Any concern about the welfare of a child or young person at the club goes to
          <strong><?php echo esc_html($cc25_safe['name']); ?></strong>, our Safeguarding Officer<?php
          $cc25_sh = cc25_phone_href($cc25_safe['phone'] ?? '');
          if ($cc25_sh): ?> &mdash; <a href="<?php echo esc_url($cc25_sh); ?>"><?php echo esc_html($cc25_safe['phone']); ?></a><?php endif; ?>.
          If a child is at immediate risk, call the police on 999.</p>
      </div>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if (!$cc25_groups): ?>
<section class="band"><div class="wrap">
  <p style="color:var(--muted);font-size:1.05rem;padding:30px 0;max-width:640px">No contacts listed yet. Add people under <strong>Club People</strong> in the dashboard and they'll appear here, grouped by what they do.</p>
</div></section>
<?php else: $cc25_ix = 0; foreach ($cc25_groups as $cc25_key => $cc25_g): $cc25_ix++; ?>
<section class="band">
  <div class="wrap">
    <div class="sec-head reveal">
      <div>
        <?php // A numbered index rather than the group name — the h2 below already says
        // it, and printing it twice reads like a mistake. Matches the homepage sections. ?>
        <div class="sec-eye kick"><span class="ix"><?php echo esc_html(sprintf('%02d', $cc25_ix)); ?></span><span class="ln"></span> Who's who</div>
        <h2><?php echo esc_html($cc25_g['label']); ?></h2>
        <p class="sec-sub"><?php echo esc_html($cc25_g['blurb']); ?></p>
      </div>
    </div>
    <div class="people-grid reveal">
      <?php foreach ($cc25_g['people'] as $cc25_pp):
        $cc25_ph  = cc25_phone_href($cc25_pp['phone'] ?? '');
        $cc25_em  = trim((string) ($cc25_pp['email'] ?? ''));
        $cc25_img = !empty($cc25_pp['photo']) ? get_the_post_thumbnail($cc25_pp['photo'], 'medium', array('loading' => 'lazy', 'alt' => esc_attr($cc25_pp['name']))) : '';
      ?>
        <div class="person-card<?php echo cc25_person_is_safeguarding($cc25_pp) ? ' is-safeguard' : ''; ?>">
          <div class="person-photo">
            <?php if ($cc25_img): echo $cc25_img; else: ?>
              <span class="person-initials" aria-hidden="true"><?php echo esc_html(cc25_person_initials($cc25_pp['name'])); ?></span>
            <?php endif; ?>
          </div>
          <div class="person-body">
            <div class="person-name"><?php echo esc_html($cc25_pp['name']); ?></div>
            <ul class="person-roles">
              <?php foreach (($cc25_pp['roles'] ?? array()) as $cc25_r): ?>
                <li><?php echo esc_html($cc25_r); ?></li>
              <?php endforeach; ?>
            </ul>
            <div class="person-contact">
              <?php if ($cc25_ph): ?>
                <a class="person-tel" href="<?php echo esc_url($cc25_ph); ?>"><?php echo esc_html($cc25_pp['phone']); ?></a>
              <?php endif; ?>
              <?php if ($cc25_em): ?>
                <a class="person-email" href="mailto:<?php echo esc_attr($cc25_em); ?>"><?php echo esc_html($cc25_em); ?></a>
              <?php endif; ?>
              <?php if (!$cc25_ph && !$cc25_em): ?>
                <span class="person-nocontact">Contact via the Social Club</span>
              <?php endif; ?>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endforeach; endif; ?>

<?php // The age-group coaches are already maintained for the Juniors page. Point at
// it rather than keeping a second copy that can drift out of step. ?>
<section class="band band-tight">
  <div class="wrap">
    <div class="contact-more reveal">
      <div>
        <h3>Juniors &amp; Minis</h3>
        <p>Every age group from Under 7 to Under 16 has its own coach contact, listed on the Juniors page.</p>
        <a class="btn btn-sm btn-outline" href="<?php echo esc_url(cc25_juniors_url()); ?>">Age-group contacts &rarr;</a>
      </div>
      <div>
        <h3>Sponsorship</h3>
        <p>Shirt, board and matchball sponsorship, and what each one includes.</p>
        <a class="btn btn-sm btn-outline" href="<?php echo esc_url(cc25_page_url('sponsorship', $cc25_home)); ?>">Sponsor the club &rarr;</a>
      </div>
    </div>
  </div>
</section>
<?php get_template_part('template-parts/site-footer'); ?>
