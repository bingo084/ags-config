#!/bin/bash

refreshUpdates() {
	ags -r "refreshUpdates()" >/dev/null 2>&1
	exit
}

trap refreshUpdates SIGINT SIGTERM EXIT

ags -r "checkUpdates()" >/dev/null 2>&1

echo "-----------------------------------------------------"
echo "Start update"
echo "-----------------------------------------------------"
paru

read -p "Press enter to exit..."
