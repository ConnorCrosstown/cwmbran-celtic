#!/usr/bin/env bash
#
# Bundled theme images: full-resolution originals in, WebP the site actually
# ships out.
#
# The 2026-08-21 audit found opponent crests being served at their full artwork
# size — rogerstone.png was 480x480 and 248 KB — to be drawn at 34 pixels. The
# fixtures page alone carried 2.72 MB of them. Resizing by hand is exactly the
# job nobody remembers to do twice, so it happens here instead.
#
#   originals   wordpress-theme/_img-src/<dir>/         (never shipped)
#   shipped     wordpress-theme/cwmbran-celtic-2025/assets/img/<dir>/*.webp
#
# Re-runnable: it rebuilds the shipped folders from scratch every time, so
# deleting an original removes the file the site serves too.
#
# Add a new crest by dropping the artwork in _img-src/opponents/ at whatever
# size it came in, running this, and adding a line to cc25_opp_crest_file().
#
# Usage:  tools/build-theme-images.sh          (needs cwebp + sips, macOS)
#
# NOTE assets/img/share/ is deliberately NOT processed. Those cards are the
# Open Graph images, they must stay exactly 1200x630, and the social crawlers
# that read them treat WebP inconsistently. Leave them as JPEG.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/wordpress-theme/_img-src"
OUT="$ROOT/wordpress-theme/cwmbran-celtic-2025/assets/img"

command -v cwebp >/dev/null || { echo "cwebp not found — brew install webp" >&2; exit 1; }
command -v sips  >/dev/null || { echo "sips not found — this script expects macOS" >&2; exit 1; }

# dir:longest-edge:quality
#
# Crests are drawn between 26 and 64 px, so 128 is already four times the
# largest and stays crisp on a retina screen. The rest are sized to the biggest
# box each is ever drawn in — player cards to the lightbox, kit shots to the
# shirt viewer — not to the card thumbnail, or enlarging one would go soft.
SPECS=(
  "opponents:128:82"
  "player-cards:800:80"
  "kit:1200:80"
  "sponsor-banners:900:82"
  "shop:900:80"
  "sponsors:400:85"
)

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

total_before=0
total_after=0

for spec in "${SPECS[@]}"; do
  dir="${spec%%:*}"; rest="${spec#*:}"; max="${rest%%:*}"; q="${rest##*:}"
  [ -d "$SRC/$dir" ] || { echo "skip $dir (no originals)"; continue; }

  rm -rf "$OUT/$dir"; mkdir -p "$OUT/$dir"
  before=0; after=0; n=0

  for f in "$SRC/$dir"/*; do
    [ -f "$f" ] || continue
    case "${f##*.}" in
      png|PNG|jpg|JPG|jpeg|JPEG|webp|WEBP) ;;
      *) echo "  ignoring non-image $(basename "$f")"; continue ;;
    esac
    base="$(basename "$f")"; stem="${base%.*}"
    before=$(( before + $(stat -f%z "$f") ))

    # An original that is ALREADY a small-enough WebP is copied untouched.
    # Re-encoding it would be lossy compression applied on top of lossy
    # compression, which costs quality and saves nothing — several sponsor
    # logos arrived that way.
    edge="$(sips -g pixelWidth -g pixelHeight "$f" 2>/dev/null \
            | awk '/pixelWidth|pixelHeight/ {if ($2>m) m=$2} END {print m+0}')"
    if [ "${f##*.}" = "webp" ] && [ "$edge" -le "$max" ] && [ "$edge" -gt 0 ]; then
      cp "$f" "$OUT/$dir/$stem.webp"
    else
      # -s format png is load-bearing: sips -Z alone silently writes NOTHING when
      # the input is a WebP, so the next step would encode a file that isn't there.
      sips -s format png -Z "$max" "$f" --out "$tmp/$stem.png" >/dev/null 2>&1
      [ -s "$tmp/$stem.png" ] || { echo "  FAILED to decode $dir/$base" >&2; exit 1; }
      # -alpha_q keeps crest transparency clean; most are cut-outs on no background.
      cwebp -quiet -q "$q" -alpha_q 95 "$tmp/$stem.png" -o "$OUT/$dir/$stem.webp"
    fi
    [ -s "$OUT/$dir/$stem.webp" ] || { echo "  FAILED to encode $dir/$base" >&2; exit 1; }

    after=$(( after + $(stat -f%z "$OUT/$dir/$stem.webp") ))
    n=$(( n + 1 ))
  done

  printf "%-16s %2d files  %7.1f KB -> %7.1f KB\n" "$dir" "$n" \
    "$(echo "$before/1024" | bc -l)" "$(echo "$after/1024" | bc -l)"
  total_before=$(( total_before + before ))
  total_after=$(( total_after + after ))
done

printf "\n%-16s          %7.2f MB -> %7.2f MB  (saved %.2f MB)\n" TOTAL \
  "$(echo "$total_before/1048576" | bc -l)" \
  "$(echo "$total_after/1048576" | bc -l)" \
  "$(echo "($total_before-$total_after)/1048576" | bc -l)"
