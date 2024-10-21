#!/bin/bash

# 获取 systemd-inhibit --list 的输出
output=$(systemd-inhibit --list --no-legend)

# 使用 awk 解析输出，跳过第一行标题并将数据转换为 JSON
echo "$output" | awk '{ printf "{\"who\": \"%s\", \"pid\": %s, \"what\": \"%s\"}", $1, $4, $6 }' | jq -s '.'
