#!/bin/bash

top -b -n 1 | grep "Cpu(s)" | awk '{print $2 + $4}'
