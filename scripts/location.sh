#!/bin/bash

ntfy sub --poll --from-config | tail -1
ntfy sub --from-config
