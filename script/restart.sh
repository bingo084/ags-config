#!/bin/bash

pkill gjs

ags run --gtk4 >~/.cache/ags/ags.log 2>&1 &

if [[ "$1" == "-i" ]]; then
  for i in {1..30}; do
    if ags inspect >/dev/null 2>&1; then
      break
    fi
    sleep 0.1
  done
fi
