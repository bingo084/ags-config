#!/bin/bash

interval=${1:-1}

while true; do
  cpu=$(sensors -A | grep 'Package id' | awk '{print $4}')
  printf '{"cpu": "%s"}\n' $cpu
  sleep $interval
done
