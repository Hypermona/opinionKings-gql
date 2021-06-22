#!/bin/bash
#Stopping existing node servers

isExistApp = `pgrep node`
if [[ -n  $isExistApp ]]; then
    echo "Stopping any existing node servers"
    pkill node        
fi