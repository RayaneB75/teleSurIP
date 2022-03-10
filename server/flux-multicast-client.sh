#!/bin/bash

####### Installation du flux Multicast #######

sudo apt update > /dev/null
sudo apt install vlc apt-transport-https -y > /dev/null

echo "Quelle interface pour le flux"
read eth
echo "Ajout multicast route"
sudo ip route add 225.0.0.0/8 dev $eth > /dev/null