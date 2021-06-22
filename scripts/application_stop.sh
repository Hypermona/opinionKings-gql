#!/bin/bash
#Stopping existing node servers
# cd ~
# sudo yum erase codedeploy-agent -y
# cd /opt
# sudo rm -r codedeploy-agent/
# cd ~
# sudo rm -r express-app/
# sudo ./install auto
echo "Stopping any existing node servers..."
pkill node