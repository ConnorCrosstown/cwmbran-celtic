<?php
// wordpress-plugin/cwmbran-celtic-feed/includes/class-ccf-render.php
if (!defined('ABSPATH')) exit;

class CCF_Render {
    /** Crest HTML from the feed's crests map, keyed by exact club name. */
    public static function crest(array $feed, string $name, int $size = 40): string {
        $c = $feed['crests'][$name] ?? null;
        $style = "width:{$size}px;height:{$size}px";
        if (is_array($c) && ($c['kind'] ?? '') === 'image') {
            return '<img class="ccf-crest" style="' . esc_attr($style) . '" src="' . esc_url($c['src']) . '" alt="' . esc_attr($c['alt'] ?? $name) . '" loading="lazy" />';
        }
        if (is_array($c) && ($c['kind'] ?? '') === 'monogram') {
            $hue = (int) ($c['hue'] ?? 0);
            $bg = "hsl($hue,55%,42%)";
            return '<span class="ccf-crest ccf-monogram" style="' . esc_attr($style . ";background:$bg") . '">' . esc_html($c['initials'] ?? '') . '</span>';
        }
        return '<span class="ccf-crest ccf-monogram" style="' . esc_attr($style) . '">' . esc_html(mb_substr($name, 0, 2)) . '</span>';
    }

    private static function team_items(array $list, string $team): array {
        return array_values(array_filter($list, fn($x) => ($x['team'] ?? 'mens') === $team));
    }

    public static function fixtures(array $feed, string $team): string {
        if (empty($feed['fixtures'])) return '';
        $items = self::team_items($feed['fixtures'], $team);
        if (!$items) return '';
        $out = '<ul class="ccf-list ccf-fixtures">';
        foreach ($items as $f) {
            $date = date_i18n('D j M', (int) round(((int) $f['date']) / 1000));
            $out .= '<li class="ccf-row">'
                . '<span class="ccf-date">' . esc_html($date . ' · ' . ($f['time'] ?? '')) . '</span>'
                . '<span class="ccf-team">' . self::crest($feed, $f['homeTeam']) . esc_html($f['homeTeam']) . '</span>'
                . '<span class="ccf-vs">v</span>'
                . '<span class="ccf-team">' . self::crest($feed, $f['awayTeam']) . esc_html($f['awayTeam']) . '</span>'
                . '<span class="ccf-comp">' . esc_html($f['competition'] ?? '') . '</span>'
                . '</li>';
        }
        return $out . '</ul>';
    }

    public static function results(array $feed, string $team): string {
        if (empty($feed['results'])) return '';
        $items = self::team_items($feed['results'], $team);
        if (!$items) return '';
        $out = '<ul class="ccf-list ccf-results">';
        foreach ($items as $r) {
            $date = date_i18n('D j M', (int) round(((int) $r['date']) / 1000));
            $score = (int) $r['homeScore'] . '–' . (int) $r['awayScore'];
            $out .= '<li class="ccf-row">'
                . '<span class="ccf-date">' . esc_html($date) . '</span>'
                . '<span class="ccf-team">' . self::crest($feed, $r['homeTeam']) . esc_html($r['homeTeam']) . '</span>'
                . '<span class="ccf-score">' . esc_html($score) . '</span>'
                . '<span class="ccf-team">' . self::crest($feed, $r['awayTeam']) . esc_html($r['awayTeam']) . '</span>'
                . '</li>';
        }
        return $out . '</ul>';
    }

    public static function table(array $feed, string $team): string {
        $rows = $feed['tables'][$team] ?? [];
        if (!$rows) return '';
        $out = '<table class="ccf-table"><thead><tr>'
            . '<th>#</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th>'
            . '</tr></thead><tbody>';
        foreach ($rows as $row) {
            $own = (strpos((string) $row['club'], 'Cwmbran Celtic') !== false) ? ' class="ccf-own"' : '';
            $out .= "<tr$own>"
                . '<td>' . (int) $row['position'] . '</td>'
                . '<td class="ccf-club">' . self::crest($feed, $row['club'], 24) . esc_html($row['club']) . '</td>'
                . '<td>' . (int) $row['played'] . '</td>'
                . '<td>' . (int) $row['won'] . '</td>'
                . '<td>' . (int) $row['drawn'] . '</td>'
                . '<td>' . (int) $row['lost'] . '</td>'
                . '<td>' . (int) $row['gd'] . '</td>'
                . '<td><strong>' . (int) $row['points'] . '</strong></td>'
                . '</tr>';
        }
        return $out . '</tbody></table>';
    }
}
