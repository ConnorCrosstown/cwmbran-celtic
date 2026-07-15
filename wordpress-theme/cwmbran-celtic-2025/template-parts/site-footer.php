<?php
/** Shared site footer. */
if (!defined('ABSPATH')) exit;
?>
<footer class="ft">
  <div class="grain"></div>
  <div class="wrap">
    <div class="ft-grid">
      <div>
        <h4 style="display:flex;align-items:center;gap:11px"><?php echo cc25_own_crest(34); ?> Cwmbran Celtic AFC</h4>
        <p class="about">Ardal League South East. Playing at Motazone Arena since 1925 — proudly representing the town of Cwmbran, home and away.</p>
      </div>
      <div><h4>Club</h4>
        <a href="<?php echo esc_url(cc25_page_url('news', home_url('/'))); ?>">News</a>
        <a href="<?php echo esc_url(cc25_page_url('teams', home_url('/'))); ?>">Teams</a>
        <a href="<?php echo esc_url(cc25_page_url('fixtures', home_url('/'))); ?>">Fixtures &amp; Results</a>
        <a href="<?php echo esc_url(cc25_page_url('fixtures', home_url('/'))); ?>">League Table</a>
      </div>
      <div><h4>Matchday</h4>
        <a href="<?php echo esc_url(cc25_ext_url('tickets')); ?>" target="_blank" rel="noopener">Tickets</a>
        <a href="<?php echo esc_url(cc25_page_url('contact', home_url('/'))); ?>">Motazone Arena</a>
        <a href="<?php echo esc_url(cc25_page_url('hospitality', home_url('/'))); ?>">Hospitality</a>
        <a href="<?php echo esc_url(cc25_ext_url('shop')); ?>" target="_blank" rel="noopener">Club Shop</a>
      </div>
      <div><h4>Connect</h4>
        <a href="<?php echo esc_url(cc25_page_url('contact', home_url('/'))); ?>">Contact</a>
        <a href="<?php echo esc_url(cc25_page_url('sponsorship', home_url('/'))); ?>">Sponsorship</a>
        <a href="https://www.facebook.com/CwmbranCelticFC" target="_blank" rel="noopener">Facebook</a>
        <a href="https://twitter.com/CwmbranCelticFC" target="_blank" rel="noopener">X / Twitter</a>
      </div>
    </div>
    <div class="ft-bot">
      <span>© <?php echo esc_html(date_i18n('Y')); ?> Cwmbran Celtic AFC</span>
      <span>Fixtures &amp; table update automatically from allwalessport</span>
    </div>
  </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
