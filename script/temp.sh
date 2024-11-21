#!/bin/bash

cpu=$(sensors -A | grep 'Package id' | awk '{print int($4)}')
gpu=$(nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader,nounits)
printf '{"cpu": %s, "gpu": %s}\n' $cpu $gpu
