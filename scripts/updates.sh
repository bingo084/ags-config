#!/bin/bash

packages_output=$(checkupdates 2>/dev/null)
aur_pkgs_output=$(paru -Qua 2>/dev/null)

final_packages_json="[]"
count=0

all_updatable_names=$(echo -e "${packages_output}\n${aur_pkgs_output}" | awk 'NF > 2 {print $1}' | sort -u | tr '\n' ' ')

if [ -n "$all_updatable_names" ]; then
  raw_package_info=$(LC_ALL=C paru -Qi $all_updatable_names 2>/dev/null)

  package_info_json_lines=$(echo "$raw_package_info" | awk '
    function flush_package_info() {
      if (current_name != "") {
        gsub(/"/, "\\\"", current_url);
        gsub(/"/, "\\\"", current_reason);
        gsub(/"/, "\\\"", current_description); # 转义 description 中的双引号

        # 在 printf 中加入 description 字段
        printf("{\"name\":\"%s\", \"url\":\"%s\", \"install_reason\":\"%s\", \"dependency\":%s, \"description\":\"%s\"}\n", \
               current_name, \
               (current_url == "" ? "N/A" : current_url), \
               (current_reason == "" ? "N/A" : current_reason), \
               current_dependency_flag, \
               (current_description == "" ? "N/A" : current_description)); # 添加 description
      }
      # 重置所有当前包的变量
      current_name = ""; current_url = ""; current_reason = ""; current_description = ""; current_dependency_flag = "true";
    }

    # 注意：以下模式中的空格数量是根据典型 pacman -Qi 输出调整的，
    # 如果你的 paru -Qi 输出格式略有不同，可能需要微调这些正则表达式中的空格。
    /^Name            : / { # 12 spaces before colon
      flush_package_info(); 
      current_name = $3; 
      for (i=4; i<=NF; i++) current_name = current_name " "$i;
      # 为新包重置所有字段
      current_url = ""; current_reason = ""; current_description = ""; current_dependency_flag = "true";
      next;
    }
    /^URL             : / { # 13 spaces before colon
      if (current_name != "") {
        current_url = $3;
        for (i=4; i<=NF; i++) current_url = current_url " "$i; 
      }
      next;
    }
    # 添加对 Description 字段的解析
    # pacman -Qi 输出中 "Description" 和 ":" 之间通常有5个空格
    /^Description     : / { # 5 spaces before colon
      if (current_name != "") {
        current_description = $3; # 第一个词
        for (i=4; i<=NF; i++) current_description = current_description " "$i; # 拼接后续的词
      }
      next;
    }
    /^Install Reason  : / { # 2 spaces before colon
      if (current_name != "") {
        current_reason = substr($0, index($0, $4)); 
        if (current_reason ~ /^Explicitly installed/) {
          current_dependency_flag = "false";
        } else {
          current_dependency_flag = "true";
        }
      }
      next;
    }
    END {
      flush_package_info(); 
    }
  ')

  package_info_map=$(echo "$package_info_json_lines" | jq -s 'map(select(.name != null and .name != "")) | INDEX(.name)')
  package_info_map=${package_info_map:-{\}}

  pkgs_base_stream=$(echo "$packages_output" | awk '
    NF > 2 {
      name=$1; old_v=$2; new_v=$NF;
      gsub(/"/, "\\\"", name); gsub(/"/, "\\\"", old_v); gsub(/"/, "\\\"", new_v);
      printf("{\"name\":\"%s\", \"old_version\":\"%s\", \"new_version\":\"%s\", \"aur\":false}\n", name, old_v, new_v);
    }')

  aur_pkgs_base_stream=$(echo "$aur_pkgs_output" | awk '
    NF > 2 {
      name=$1; old_v=$2; new_v=$NF;
      gsub(/"/, "\\\"", name); gsub(/"/, "\\\"", old_v); gsub(/"/, "\\\"", new_v);
      printf("{\"name\":\"%s\", \"old_version\":\"%s\", \"new_version\":\"%s\", \"aur\":true}\n", name, old_v, new_v);
    }')

  final_packages_json=$(
    echo -e "${pkgs_base_stream}\n${aur_pkgs_base_stream}" | jq -s '
    map(select(.name != null and .name != "")) | 
    map(
      # fallback 对象中加入 description 字段
      . + ( $ARG_PKG_INFO_MAP[.name] // {url: "N/A", install_reason: "N/A", dependency: true, description: "N/A"} )
    )' --argjson ARG_PKG_INFO_MAP "$package_info_map"
  )
  final_packages_json=${final_packages_json:-[]}

  count=$(echo "$final_packages_json" | jq 'length')
fi

jq --null-input --compact-output \
  --argjson count "$count" \
  --argjson packages "$final_packages_json" \
  '{"count": $count, "packages": $packages}'
