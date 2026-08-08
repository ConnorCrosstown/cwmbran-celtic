<?php
/** Export every upcoming fixture, kick-off resolved, ready for the graphics. */
if (PHP_SAPI !== 'cli') exit;
function add_action() {} function add_filter() {}
function get_transient() { return false; } function set_transient() {}
define('ABSPATH', __DIR__);
require __DIR__ . '/../../wordpress-theme/cwmbran-celtic-2025/functions.php';

$s = cc25_static_fixtures();
$today = (new DateTime('now', new DateTimeZone('Europe/London')))->format('Y-m-d');
$meta = array(
    'mens'     => array("MEN'S TEAM",     'CWMBRAN CELTIC',          'ARDAL SOUTH EAST'),
    'reserves' => array("MEN'S RESERVES", 'CWMBRAN CELTIC RESERVES', 'GWENT PREMIER'),
    'womens'   => array("WOMEN'S TEAM",   'CWMBRAN CELTIC WOMEN',    'ADRAN SOUTH'),
);
// Competition -> the two lines above the crests.
function comp_lines($comp, $league) {
    $map = array(
        'League'        => array('LEAGUE', $league),
        'Welsh Cup QR2' => array('WELSH CUP', 'QUALIFYING ROUND TWO'),
        'League Cup R1' => array('LEAGUE CUP', 'ROUND ONE'),
        'League Cup R2' => array('LEAGUE CUP', 'ROUND TWO'),
    );
    return $map[$comp] ?? array(strtoupper($comp), $league);
}

$ov = cc25_kickoff_overrides();
$out = array(); $nocrest = array();
foreach (array('mens', 'reserves', 'womens') as $t) {
    foreach ($s[$t]['list'] as $r) {
        list($ymd, $opp, $home) = array($r[0], $r[1], $r[2]);
        $comp = isset($r[3]) ? $r[3] : 'League';
        // Skip games with no graphic to make: past, opponent not yet drawn, or
        // called off (the site hides those too — cc25_hidden_fixtures).
        if ($ymd < $today || $opp === 'TBC' || cc25_fixture_hidden($opp, $ymd)) continue;
        $dt = new DateTime($ymd);
        $ko = cc25_kickoff_time($ymd, $opp, (int) $dt->format('N'));
        $conf = isset($ov[$ymd]);
        foreach ($ov as $k => $v) {
            $p = explode('|', $k, 2);
            if (count($p) === 2 && $p[0] === $ymd && cc25_norm_team($p[1]) === cc25_norm_team($opp)) $conf = true;
        }
        $file = cc25_opp_crest_file($opp);
        if (!$file) $nocrest[$opp] = 1;
        list($kick, $sub) = comp_lines($comp, $meta[$t][2]);
        $out[] = array(
            'team' => $t, 'label' => $meta[$t][0], 'us' => $meta[$t][1],
            'date' => $ymd, 'opp' => $opp, 'them' => strtoupper($opp),
            'home' => (bool) $home, 'comp' => $comp,
            'kicker' => $kick, 'sub' => $sub,
            'crest' => $file,
            'confirmed' => $conf,
            'dateline' => strtoupper($dt->format('l j F')),
            'kotext' => 'KICK-OFF ' . strtolower(DateTime::createFromFormat('H:i', $ko)->format('g:ia')),
            'pill' => $home ? 'HOME' : 'AWAY',
            'venue' => $home ? 'MOTAZONE ARENA' : null,
            // Kit-led: green frame for the green-and-white away, navy/yellow for
            // the yellow-and-blue home.
            'frame' => $home ? 'Men Navy Insta New.psd' : 'Men Green Insta New.psd',
            'out' => sprintf('%s %s %s v %s.png', $dt->format('Y-m-d'),
                array('mens' => 'CCFC', 'reserves' => 'CCFC Reserves', 'womens' => 'CCFC Women')[$t],
                $home ? '(H)' : '(A)', $opp),
        );
    }
}
usort($out, function ($a, $b) { return strcmp($a['date'] . $a['team'], $b['date'] . $b['team']); });
file_put_contents(__DIR__ . '/fixtures.json', json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
echo count($out) . " fixtures exported\n";
echo "confirmed kick-offs: " . count(array_filter($out, function ($f) { return $f['confirmed']; })) . "\n";
echo "missing crests: " . count($nocrest) . (count($nocrest) ? ' -> ' . implode(', ', array_keys($nocrest)) : '') . "\n";
$byteam = array(); foreach ($out as $f) { $byteam[$f['team']] = ($byteam[$f['team']] ?? 0) + 1; }
foreach ($byteam as $t => $n) echo "  $t: $n\n";
