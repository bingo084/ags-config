#!/bin/bash

interval=${1:-1}

while true; do
  top -b -n 1 | grep "Cpu(s)" | awk '{print $2 + $4}'
  sleep $interval
done
