<?php
/**
 * Template Name: Men's Player Cards
 * The Men's 1st Team squad shown as the club's designed player cards, grouped
 * by role. Cards are bundled in assets/img/player-cards/ (4:5). Click to enlarge.
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');

$cc25_pc_base = get_stylesheet_directory_uri() . '/assets/img/player-cards/';
$cc25_pc_groups = array(
    'Management' => array(
        array("Stephen Muir", 'stephen-muir'), array("Sam Lewis", 'sam-lewis'),
        array("Martin Ingram", 'martin-ingram'), array("Ryan Thomas", 'ryan-thomas'), array("Conor James", 'conor-james'),
    ),
    'Goalkeeper' => array(
        array("Lewis Watkins", 'lewis-watkins'),
    ),
    'Defenders' => array(
        array("Zach Fry", 'zach-fry'), array("Arthur Furness", 'arthur-furness'), array("Oliver Berry", 'oliver-berry'),
        array("Charlie Donovan", 'charlie-donovan'), array("Kian Saunders", 'kian-saunders'),
        array("Elliott Hewings", 'elliott-hewings'), array("Terry Obeng", 'terry-obeng'),
    ),
    'Midfielders' => array(
        array("Lewis Cochrane", 'lewis-cochrane'), array("Tommy Challenger", 'tommy-challenger'), array("Jack Prosser", 'jack-prosser'),
        array("Cameron Jenkins", 'cameron-jenkins'), array("Efan Fletcher", 'efan-fletcher'), array("Finlay Wood", 'finlay-wood'),
    ),
    'Forwards' => array(
        array("Gabriel Howells", 'gabriel-howells'), array("Evan Maidment", 'evan-maidment'), array("Rudi Griffiths", 'rudi-griffiths'),
        array("Daniel Camaj", 'daniel-camaj'), array("Munya Mabwe", 'munya-mabwe'),
    ),
);
?>
<div class="phero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">SQUAD</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('teams', home_url('/'))); ?>" style="color:var(--on-navy-dim)">Teams</a> / <span style="color:#fff">Men's 1st Team</span></div>
    <h1>Men's 1st Team</h1>
    <p>The players and management representing Cwmbran Celtic in the Ardal League South East.</p>
  </div>
</div>

<section class="band">
  <div class="wrap">
    <?php $cc25_ix = 0; foreach ($cc25_pc_groups as $cc25_label => $cc25_cards): $cc25_ix++; ?>
      <div class="sec-head reveal"><div><div class="sec-eye kick"><span class="ix"><?php printf('%02d', $cc25_ix); ?></span><span class="ln"></span> <?php echo esc_html($cc25_label); ?></div><h2><?php echo esc_html($cc25_label); ?></h2></div></div>
      <div class="pc-grid reveal">
        <?php foreach ($cc25_cards as $cc25_c): $cc25_src = $cc25_pc_base . $cc25_c[1] . '.jpg'; ?>
          <button class="pc-card" type="button" data-full="<?php echo esc_url($cc25_src); ?>" aria-label="Enlarge <?php echo esc_attr($cc25_c[0]); ?>'s player card">
            <img src="<?php echo esc_url($cc25_src); ?>" alt="<?php echo esc_attr($cc25_c[0]); ?> &mdash; Cwmbran Celtic" loading="lazy" width="480" height="600">
          </button>
        <?php endforeach; ?>
      </div>
    <?php endforeach; ?>
  </div>
</section>

<div class="pc-lightbox" id="pc-lightbox" role="dialog" aria-modal="true" aria-label="Player card" hidden>
  <button class="pc-lb-close" type="button" aria-label="Close">&times;</button>
  <img id="pc-lb-img" src="" alt="">
</div>
<?php get_template_part('template-parts/site-footer'); ?>
