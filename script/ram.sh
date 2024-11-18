#!/bin/bash

interval=${1:-1}

while true; do
  free | grep Mem | awk '{print $3/$2 * 100}'
  sleep $interval
done
