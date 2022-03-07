#!/bin/bash

######## Configurer le serveur FTP via Telnet ########
sudo apt update > /dev/null
sudo apt install vsftpd -y > /dev/null
######## On déplace le fichier de configuration et on redémarre le service VFTDP ########
sudo cp ./vsftpd.conf /etc/vsftpd.conf
sudo /etc/init.d/vsftpd restart
sudo mkdir /srv/ftp/
sudo cp chnls.txt /srv/ftp
sudo chmod 777 /srv/ftp/chnls.txt


######## Configuration IP de la machine : ########
sudo ip a flush $eth > /dev/null
sudo ip a add 192.168.1.1 dev $eth > /dev/null



echo -e "Combien d'Amino à configurer"
read nb

echo
echo

######## Tableau d'IP Amino ########
declare -a var

for ((i=1; i<=$nb; i++))
do
	echo "Adresse IP Amino N°$i"
	read in
	var+=($in)
done

echo
echo

for j in ${var[@]}
do
	{ echo -e "root\n" ;\
	sleep 2; \
	echo -e "root2root"; \
	sleep 1; \
	echo -e "\n"; \
	sleep 1; \
	echo -e "ftpget -u etudiant -p vitrygtr 192.168.1.1 /mnt/nv/chnls.txt /srv/ftp/chnls.txt"; \
	echo -e "cat /mnt/nv/chnls.txt | wc -l"; \
	sleep 1; } | telnet ${var[j]}
	echo
	echo
	echo -e 'Si la derniere ligne donne 11, script OK'
	echo 
	echo
done