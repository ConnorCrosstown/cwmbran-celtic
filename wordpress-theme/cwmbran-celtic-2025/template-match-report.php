<?php
/**
 * Template Name: Match Report
 * Premium match report driven by cc25_season_matches(). Reads ?g=<Y-m-d>;
 * defaults to the most recent game. Applies to the page with slug "match-report".
 */
if (!defined('ABSPATH')) exit;
get_template_part('template-parts/site-header');
$cc25_home = home_url('/');
$cc25_g = isset($_GET['g']) ? preg_replace('/[^0-9-]/', '', $_GET['g']) : '';
$m = cc25_get_match($cc25_g);
?>
<?php if (!$m): ?>
<div class="phero" style="min-height:auto"><div class="bg"></div><div class="grain"></div>
  <div class="phero-in"><h1>Match Report</h1><p>No match report available yet &mdash; check back after the next game.</p></div>
</div>
<?php else:
  $home = $m['home']; $opp = $m['opp']; $cc = intval($m['cc']); $oc = intval($m['oc']);
  $rd = strtotime($m['date']); $oppcrest = cc25_res_crest($opp, 64);

  /**
   * Build a name -> events map for one side, so the line-up can show a goal,
   * card or "subbed off" chip next to each player. $goals/$cards belong to that
   * side; $subs is that side's list of changes made.
   */
  $cc25_events = function ($goals, $cards, $subs) {
      $ev = array();
      foreach ($goals as $g) { $ev[$g['scorer']][] = array('t' => 'goal', 'min' => $g['min'], 'pen' => !empty($g['pen'])); }
      foreach ($cards as $c) { $ev[$c['player']][] = array('t' => (($c['type'] ?? 'y') === 'r' ? 'red' : 'yellow'), 'min' => intval($c['min'] ?? 0)); }
      foreach ($subs as $s) { $ev[$s['off']][] = array('t' => 'off', 'min' => intval($s['min'])); }
      return $ev;
  };
  // Minute a bench player came on (name -> min), and who they replaced.
  $cc25_onmap = function ($subs) {
      $on = array();
      foreach ($subs as $s) { $on[$s['on']] = array('min' => intval($s['min']), 'for' => $s['off']); }
      return $on;
  };

  // Render the event chips (goal / card / off) that sit after a player's name.
  $cc25_chips = function ($name, $ev) {
      if (empty($ev[$name])) return '';
      $out = '';
      foreach ($ev[$name] as $e) {
          if ($e['t'] === 'goal') $out .= '<span class="chip goal" title="Goal">&#9917;' . ($e['pen'] ? ' <em>P</em>' : '') . ' ' . intval($e['min']) . "&rsquo;</span>";
          elseif ($e['t'] === 'yellow') $out .= '<span class="chip yc" title="Yellow card">' . intval($e['min']) . "&rsquo;</span>";
          elseif ($e['t'] === 'red') $out .= '<span class="chip rc" title="Red card">' . intval($e['min']) . "&rsquo;</span>";
          elseif ($e['t'] === 'off') $out .= '<span class="chip off" title="Substituted off">&darr; ' . intval($e['min']) . "&rsquo;</span>";
      }
      return $out;
  };

  // One team column: numbered XI with chips, then the bench (who came on / unused).
  $cc25_team = function ($starters, $subs, $captain, $teamname, $crest, $ev, $onmap) use ($cc25_chips) {
      echo '<div class="mr-lineup"><div class="mr-lt">' . $crest . '<span>' . esc_html($teamname) . '</span></div>';
      echo '<ul class="mr-xi">';
      foreach ($starters as $p) {
          $no = intval($p[0]); $nm = $p[1]; $pos = isset($p[2]) ? $p[2] : '';
          echo '<li><span class="no">' . $no . '</span><span class="pn">' . esc_html($nm)
             . ($nm === $captain ? ' <span class="cap" title="Captain">C</span>' : '')
             . ($pos === 'GK' ? ' <span class="pos">GK</span>' : '') . '</span>'
             . '<span class="evs">' . $cc25_chips($nm, $ev) . '</span></li>';
      }
      echo '</ul>';
      if ($subs) {
          echo '<div class="mr-subs-lbl">Substitutes</div><ul class="mr-xi bench">';
          foreach ($subs as $p) {
              $no = intval($p[0]); $nm = $p[1];
              $on = isset($onmap[$nm]) ? $onmap[$nm] : null;
              echo '<li' . ($on ? '' : ' class="unused"') . '><span class="no">' . $no . '</span><span class="pn">' . esc_html($nm) . '</span>'
                 . '<span class="evs">' . ($on
                     ? '<span class="chip on" title="Came on">&uarr; ' . intval($on['min']) . "&rsquo;</span>"
                     : '<span class="chip none">Unused</span>') . '</span></li>';
          }
          echo '</ul>';
      }
      echo '</div>';
  };

  $ev_us  = $cc25_events($m['goals'], $m['cards'] ?? array(), $m['subs_made'] ?? array());
  $on_us  = $cc25_onmap($m['subs_made'] ?? array());
  $ev_opp = $cc25_events(array(), $m['opp_cards'] ?? array(), $m['opp_subs_made'] ?? array());
  $on_opp = $cc25_onmap($m['opp_subs_made'] ?? array());
?>
<div class="phero mr-hero">
  <div class="bg"></div><div class="grain"></div><div class="ghost">FULL&nbsp;TIME</div>
  <div class="phero-in">
    <div class="crumbs"><a href="<?php echo esc_url($cc25_home); ?>">Home</a> / <a href="<?php echo esc_url(cc25_page_url('fixtures', $cc25_home)); ?>" style="color:var(--on-navy-dim)">Fixtures &amp; Results</a> / <span style="color:#fff">Match Report</span></div>
    <div class="mr-eye kick"><?php echo esc_html($m['comp']); ?><?php echo !empty($m['round']) ? ' &middot; ' . esc_html($m['round']) : ''; ?> &middot; <?php echo esc_html(date('l j F Y', $rd)); ?></div>
    <div class="mr-score">
      <span class="mr-team"><?php echo $home ? cc25_own_crest(64) : $oppcrest; ?><span class="nm"><?php echo esc_html($home ? 'Cwmbran Celtic' : $opp); ?></span></span>
      <span class="mr-sc"><?php echo ($home ? $cc : $oc) . ' &ndash; ' . ($home ? $oc : $cc); ?><small>Full Time</small></span>
      <span class="mr-team"><?php echo $home ? $oppcrest : cc25_own_crest(64); ?><span class="nm"><?php echo esc_html($home ? $opp : 'Cwmbran Celtic'); ?></span></span>
    </div>
    <div class="mr-meta">&#9873; <?php echo esc_html($m['venue']); ?><?php if (!empty($m['time'])) echo ' &middot; KO ' . esc_html($m['time']); ?><?php if (!empty($m['att'])) echo ' &middot; Att ' . intval($m['att']); ?></div>
  </div>
</div>

<section class="band">
  <div class="wrap mr-wrap">
    <div class="mr-main">
      <?php if (!empty($m['goals'])): ?>
      <div class="mr-block reveal">
        <h2 class="mr-h">Goals</h2>
        <ul class="mr-goals">
          <?php foreach ($m['goals'] as $g): ?>
            <li><span class="mr-min"><?php echo intval($g['min']); ?>&rsquo;</span> <span class="mr-gball">&#9917;</span> <b><?php echo esc_html($g['scorer']); ?></b><?php echo !empty($g['pen']) ? ' <em>(pen)</em>' : ''; ?><?php echo !empty($g['assist']) ? ' <span class="mr-assist">assist: ' . esc_html($g['assist']) . '</span>' : ''; ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
      <?php endif; ?>

      <?php if (!empty($m['report'])): ?>
      <div class="mr-block reveal">
        <h2 class="mr-h">Match Report</h2>
        <div class="mr-report"><?php foreach (explode("\n\n", $m['report']) as $cc25_para) { echo '<p>' . esc_html(trim($cc25_para)) . '</p>'; } ?></div>
      </div>
      <?php endif; ?>

      <?php
      $cc25_allcards = array();
      foreach (($m['cards'] ?? array()) as $c) { $cc25_allcards[] = array('t' => 'Cwmbran Celtic', 'p' => $c['player'], 'type' => $c['type'] ?? 'y', 'min' => $c['min'] ?? 0, 'reason' => $c['reason'] ?? ''); }
      foreach (($m['opp_cards'] ?? array()) as $c) { $cc25_allcards[] = array('t' => $opp, 'p' => $c['player'], 'type' => $c['type'] ?? 'y', 'min' => $c['min'] ?? 0, 'reason' => $c['reason'] ?? ''); }
      if ($cc25_allcards): ?>
      <div class="mr-block reveal">
        <h2 class="mr-h">Cards</h2>
        <ul class="mr-cards">
          <?php foreach ($cc25_allcards as $c): ?><li><span class="mr-cardbox <?php echo $c['type'] === 'r' ? 'r' : 'y'; ?>"></span><span class="mr-min"><?php echo intval($c['min']); ?>&rsquo;</span> <b><?php echo esc_html($c['p']); ?></b> <span style="color:var(--muted)">&mdash; <?php echo esc_html($c['t']); ?></span><?php echo $c['reason'] ? ' <span class="mr-creason">(' . esc_html($c['reason']) . ')</span>' : ''; ?></li><?php endforeach; ?>
        </ul>
      </div>
      <?php endif; ?>

      <?php
      $cc25_hassubs = !empty($m['subs_made']) || !empty($m['opp_subs_made']);
      if ($cc25_hassubs): ?>
      <div class="mr-block reveal">
        <h2 class="mr-h">Substitutions</h2>
        <div class="mr-subgrid">
          <?php
          $cc25_sublist = function ($subs, $team, $crest) {
              if (empty($subs)) return;
              echo '<div class="mr-subcol"><div class="mr-subteam">' . $crest . '<span>' . esc_html($team) . '</span></div><ul class="mr-swaps">';
              foreach ($subs as $s) {
                  echo '<li><span class="mr-min">' . intval($s['min']) . "&rsquo;</span> "
                     . '<span class="on">&uarr; ' . esc_html($s['on']) . '</span> '
                     . '<span class="offlbl">for</span> <span class="off">' . esc_html($s['off']) . '</span></li>';
              }
              echo '</ul></div>';
          };
          $cc25_sublist($m['subs_made'] ?? array(), 'Cwmbran Celtic', cc25_own_crest(26));
          $cc25_sublist($m['opp_subs_made'] ?? array(), $opp, cc25_res_crest($opp, 26));
          ?>
        </div>
      </div>
      <?php endif; ?>
    </div>

    <aside class="mr-side">
      <div class="mr-block reveal">
        <h2 class="mr-h">Line-ups</h2>
        <?php
        $cc25_team($m['starters'], $m['subs'] ?? array(), $m['captain'] ?? '', 'Cwmbran Celtic', cc25_own_crest(26), $ev_us, $on_us);
        if (!empty($m['opp_starters'])) $cc25_team($m['opp_starters'], $m['opp_subs'] ?? array(), $m['opp_captain'] ?? '', $opp, cc25_res_crest($opp, 26), $ev_opp, $on_opp);
        ?>
        <div class="mr-key"><span><span class="chip goal">&#9917;</span> Goal</span><span><span class="chip yc">&nbsp;</span> Booked</span><span><span class="chip off">&darr;</span> Off</span><span><span class="chip on">&uarr;</span> On</span></div>
      </div>

      <?php if (!empty($m['ref'])): ?>
      <div class="mr-block reveal">
        <h2 class="mr-h">Match Officials</h2>
        <ul class="mr-offs">
          <li><span class="ol">Referee</span><span class="on"><?php echo esc_html($m['ref']); ?></span></li>
          <?php if (!empty($m['ar1'])): ?><li><span class="ol">Assistant</span><span class="on"><?php echo esc_html($m['ar1']); ?></span></li><?php endif; ?>
          <?php if (!empty($m['ar2'])): ?><li><span class="ol">Assistant</span><span class="on"><?php echo esc_html($m['ar2']); ?></span></li><?php endif; ?>
        </ul>
      </div>
      <?php endif; ?>

      <?php if (!empty($m['staff']) || !empty($m['opp_staff'])): ?>
      <div class="mr-block reveal">
        <h2 class="mr-h">In the Dugout</h2>
        <?php
        $cc25_stafflist = function ($staff, $team) {
            if (empty($staff)) return;
            echo '<div class="mr-staff"><div class="mr-stafft">' . esc_html($team) . '</div><ul class="mr-offs">';
            foreach ($staff as $s) { echo '<li><span class="ol">' . esc_html($s['role']) . '</span><span class="on">' . esc_html($s['name']) . '</span></li>'; }
            echo '</ul></div>';
        };
        $cc25_stafflist($m['staff'] ?? array(), 'Cwmbran Celtic');
        $cc25_stafflist($m['opp_staff'] ?? array(), $opp);
        ?>
      </div>
      <?php endif; ?>
    </aside>
  </div>
</section>
<?php endif; ?>
<?php get_template_part('template-parts/site-footer'); ?>
