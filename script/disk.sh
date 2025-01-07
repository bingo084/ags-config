#!/bin/bash

interval=${1:-1}

while true; do
  output=$(df -h / | tail -1)
  size=$(echo $output | awk '{print $2}')
  used=$(echo $output | awk '{print $3}')
  avail=$(echo $output | awk '{print $4}')
  use=$(echo $output | awk '{print $5}')
  mount_on=$(echo $output | awk '{print $6}')
  printf '{"size": "%s", "used": "%s", "avail": "%s", "use": "%s", "mount_on": "%s"}\n' $size $used $avail $use $mount_on
  sleep $interval
done
