#!/bin/bash

sudo apt update && sudo apt install apt-transport-https -y


echo "Quelle interface pour le flux"
read eth
echo "Ajout multicast route"
sudo ip route add 224.0.0.0/8 dev $eth
sudo ip route add 225.0.0.0/8 dev $eth


curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/etc/apt/trusted.gpg.d/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/trusted.gpg.d/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install git vlc -y

mkdir /tmp/apache2
sudo mv /var/www/* /tmp/apache2
sudo git clone https://github.com/RayaneB75/teleSurIP /var/www