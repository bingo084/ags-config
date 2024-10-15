#!/bin/bash

refreshUpdates() {
  ags -r "refreshUpdates()" >/dev/null 2>&1
  exit
}

trap refreshUpdates SIGINT SIGTERM

ags -r "checkUpdates()" >/dev/null 2>&1

echo "-----------------------------------------------------"
echo "Start update"
echo "-----------------------------------------------------"
paru

ags -r "refreshUpdates()" >/dev/null 2>&1

read -p "Press enter to exit..."
