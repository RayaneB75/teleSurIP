#!/bin/bash

sudo apt update > /dev/null
sudo apt install apt-transport-https -y > /dev/null

echo "Quelle interface pour le flux"
read eth
echo "Ajout multicast route"
sudo ip route add 224.0.0.0/8 dev $eth > /dev/null
sudo ip route add 225.0.0.0/8 dev $eth > /dev/null


curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/etc/apt/trusted.gpg.d/githubcli-archive-keyring.gpg > /dev/null
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/trusted.gpg.d/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable m$
sudo apt update > /dev/null
sudo apt install git vlc vsftpd -y > /dev/null

mkdir /tmp/apache2 > /dev/null
sudo mv /var/www/* /tmp/apache2 > /dev/null


echo "Appuyer sur ENTER pour continuer le script"
read rien


sudo ip a flush $eth > /dev/null
sudo ip a add 192.168.1.1 dev $eth > /dev/null


for i in {10. .255}
do
	ping 192.168.1.$i -c 1 && [[ $? -ne 0 ]] && continue
	{ echo -e "root\n" ;\
	sleep 2; \
	echo -e "root2root"; \
	sleep 1; \
	echo -e "\n"; \
	sleep 1; \
	echo -e "ftpget -u etudiant -p vitrygtr 192.168.1.1 /mnt/nv/chnls.txt /srv/ftp/chnls.txt"; \
	echo -e "cat /mnt/nv/chnls.txt | wc -l"; \
	sleep 1; } | telnet 192.168.1.$i
	echo -e 'Si la derniere ligne donne 11, script OK'
done
