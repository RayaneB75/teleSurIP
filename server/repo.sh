#!/bin/bash

####### Installation du repository #######

sudo apt update > /dev/null
sudo apt install apt-transport-https -y > /dev/null

echo "Quelle interface pour le flux"
read eth
echo "Ajout multicast route"
sudo ip route add 224.0.0.0/8 dev $eth > /dev/null
sudo ip route add 225.0.0.0/8 dev $eth > /dev/null


curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/etc/apt/trusted.gpg.d/githubcli-archive-keyring.gpg > /dev/null
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/trusted.gpg.d/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable m$"
sudo apt update > /dev/null
sudo apt install git vlc -y > /dev/null

mkdir /tmp/apache2 > /dev/null
sudo mv /var/www/* /tmp/apache2 > /dev/null