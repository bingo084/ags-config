#!/bin/bash

interval=${1:-3600}

while true; do
  packages=$(checkupdates 2>/dev/null)
  aur_pkgs=$(paru -Qua 2>/dev/null)
  count=$(echo -e "$packages\n$aur_pkgs" | grep -vc ^\$)
  packages_json=$(echo -n "$packages" | awk '{printf("{\"name\": \"%s\", \"old_version\": \"%s\", \"new_version\": \"%s\"}", $1, $2, $NF)}')
  aur_pkgs_json=$(echo -n "$aur_pkgs" | awk '{printf("{\"name\": \"%s\", \"old_version\": \"%s\", \"new_version\": \"%s\", \"aur\": true}", $1, $2, $NF)}')
  packages_array=$(echo -e "$packages_json\n$aur_pkgs_json" | jq -s .)
  jq --unbuffered --null-input --compact-output \
    --argjson count "$count" \
    --argjson packages "$packages_array" \
    '{"count": $count, "packages": $packages}'
  sleep $interval
done
