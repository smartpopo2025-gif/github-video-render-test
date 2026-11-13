#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/assets
fetch() {
  local id="$1" file="$2"
  local url="https://images.pexels.com/photos/$id/pexels-photo-$id.jpeg?auto=compress&cs=tinysrgb&w=1920"
  echo "Downloading $file from Pexels photo $id"
  curl -fLSs --retry 4 --retry-delay 2 --connect-timeout 15 --max-time 120 \
    -A "Mozilla/5.0 RemotionProductConcept/1.0" "$url" -o "public/assets/$file"
  test "$(wc -c < "public/assets/$file")" -gt 20000
  file "public/assets/$file"
  file "public/assets/$file" | grep -qE 'JPEG|image data'
}
fetch 30554816 pepsi_ice.jpg
fetch 17461398 pepsi_dew.jpg
fetch 11659356 pepsi_splash.jpg
echo "Pexels assets retrieved. Credits in README.md."
