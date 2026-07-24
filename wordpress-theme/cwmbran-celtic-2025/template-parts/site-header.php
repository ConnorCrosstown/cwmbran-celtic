<?php
/** Shared site header + premium nav. */
if (!defined('ABSPATH')) exit;
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<a class="skip" href="#main">Skip to content</a>
<header class="nav">
  <div class="wrap nav-in">
    <a class="brand" href="<?php echo esc_url(home_url('/')); ?>">
      <?php echo cc25_own_crest(42); ?>
      <span class="bt">Cwmbran Celtic<small>Est. 1925 · The Celts</small></span>
    </a>
    <nav class="main" id="cc25-primary-nav">
      <?php wp_nav_menu(array(
        'theme_location' => 'cc25_primary',
        'container'      => false,
        'menu_class'     => 'cc25-nav',
        'depth'          => 2,
        'fallback_cb'    => 'cc25_nav_fallback',
      )); ?>
    </nav>
    <a class="btn btn-tickets" href="<?php echo esc_url(cc25_ext_url('tickets')); ?>" target="_blank" rel="noopener">Buy Tickets</a>
    <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="cc25-primary-nav"><span></span></button>
  </div>
</header>
<?php $cc25_tk = cc25_ticker_items(); if ($cc25_tk) : ?>
<div class="match-ticker">
  <a class="tk-cta" href="<?php echo esc_url(cc25_ext_url('tickets')); ?>" target="_blank" rel="noopener">&#127903; Tickets</a>
  <div class="tk-viewport"><div class="tk-track"><?php echo $cc25_tk . $cc25_tk; ?></div></div>
  <a class="tk-cta tk-cta-bond" href="<?php echo esc_url(cc25_page_url('celtic-bond', home_url('/'))); ?>">Join the Bond &#9733;</a>
</div>
<?php endif; ?>
<main id="main">
