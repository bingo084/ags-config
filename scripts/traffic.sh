#!/bin/bash

interval=${1:-1}

read_all_interfaces_data() {
  awk '{
    if (!(tolower($1) ~ /^$|lo|veth|tun|tap|docker|br-|meta/)) {
      rx_bytes = $2
      tx_bytes = $10
      total_rx += rx_bytes
      total_tx += tx_bytes
    }
  }
  END {
    print total_rx, total_tx
  }' /proc/net/dev
}

while true; do
  last_data=$(read_all_interfaces_data)

  sleep $interval
  current_data=$(read_all_interfaces_data)

  last_rx_bytes=$(echo $last_data | awk '{print $1}')
  last_tx_bytes=$(echo $last_data | awk '{print $2}')
  current_rx_bytes=$(echo $current_data | awk '{print $1}')
  current_tx_bytes=$(echo $current_data | awk '{print $2}')

  rx_bps=$(((current_rx_bytes - last_rx_bytes) / interval))
  tx_bps=$(((current_tx_bytes - last_tx_bytes) / interval))

  printf '{"rx_bps": %d, "tx_bps": %d}\n' $rx_bps $tx_bps
done
