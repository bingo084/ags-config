#!/bin/bash

output=$(systemd-inhibit --list | grep Ags | tail -1)

if [[ -z "$output" ]]; then
  echo '{"what": "off"}'
else
  echo -n "$output" | awk '{ printf "{\"pid\": %s, \"what\": \"%s\"}", $4, $6 }'
fi
