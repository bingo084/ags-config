#!/bin/bash

output=$(systemd-inhibit --list | grep Ags | tail -1)

echo -n "$output" | awk '{ printf "{\"pid\": %s, \"what\": \"%s\"}", $4, $6 }'
