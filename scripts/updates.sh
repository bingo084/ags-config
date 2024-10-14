#!/bin/bash

interval=${1:-3600}

while true; do
  packages=$(checkupdates 2>/dev/null)
  count=$(($(echo "$packages" | grep -vc ^\$) + $(paru -Qua 2>/dev/null | wc -l)))
  packages_array=$(echo -n "$packages" | awk '{printf("{\"name\": \"%s\", \"old_version\": \"%s\", \"new_version\": \"%s\"}", $1, $2, $NF)}' | jq -s .)
  jq --unbuffered --null-input --compact-output \
    --argjson count "$count" \
    --argjson packages "$packages_array" \
    '{"count": $count, "packages": $packages}'
  sleep $interval
done
