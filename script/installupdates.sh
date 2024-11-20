#!/bin/bash

refreshUpdates() {
  ags request "updates.refresh()" >/dev/null 2>&1
  exit
}

trap refreshUpdates SIGINT SIGTERM

ags request "updates.spin()" >/dev/null 2>&1

echo "-----------------------------------------------------"
echo "Start update"
echo "-----------------------------------------------------"
paru

ags request "updates.refresh()" >/dev/null 2>&1

read -p "Press enter to exit..."
