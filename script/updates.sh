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
        gsub(/"/, "\\\"", current_reason); # 使用 current_reason

        # JSON key 改为 "install_reason"
        printf("{\"name\":\"%s\", \"url\":\"%s\", \"install_reason\":\"%s\", \"dependency\":%s}\n", \
               current_name, \
               (current_url == "" ? "N/A" : current_url), \
               (current_reason == "" ? "N/A" : current_reason), \
               current_dependency_flag);
      }
      current_name = ""; current_url = ""; current_reason = ""; current_dependency_flag = "true"; # awk 变量名修改
    }

    /^Name            : / {
      flush_package_info(); 
      current_name = $3; 
      for (i=4; i<=NF; i++) current_name = current_name " "$i;
      current_url = ""; current_reason = ""; current_dependency_flag = "true"; # awk 变量名修改
      next;
    }
    /^URL             : / {
      if (current_name != "") {
        current_url = $3;
        for (i=4; i<=NF; i++) current_url = current_url " "$i; 
      }
      next;
    }
    /^Install Reason  : / {
      if (current_name != "") {
        current_reason = substr($0, index($0, $4)); # awk 变量名修改
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
      # fallback 对象中字段名也修改为 "install_reason"
      . + ( $ARG_PKG_INFO_MAP[.name] // {url: "N/A", install_reason: "N/A", dependency: true} )
    )' --argjson ARG_PKG_INFO_MAP "$package_info_map"
  )
  final_packages_json=${final_packages_json:-[]}

  count=$(echo "$final_packages_json" | jq 'length')
fi

jq --null-input --compact-output \
  --argjson count "$count" \
  --argjson packages "$final_packages_json" \
  '{"count": $count, "packages": $packages}'
