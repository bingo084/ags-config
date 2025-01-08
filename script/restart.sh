#!/bin/bash

gjs_pid=$(pgrep gjs)

if [ -n "$gjs_pid" ]; then
    pkill -P $gjs_pid
    kill $gjs_pid
fi

ags run > ~/.cache/ags/ags.log 2>&1
