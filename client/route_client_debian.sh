#!/bin/bash

echo "Quelle interface pour le flux"
read eth
echo "Ajout multicast route"
sudo ip route add 224.0.0.0/8 dev $eth
sudo ip route add 225.0.0.0/8 dev $eth

sudo apt update && sudo apt install apache2 vlc -y