#!/bin/bash

######## Configurer le serveur FTP via Telnet ########
sudo apt update > /dev/null
sudo apt install vsftpd apache2 -y > /dev/null

######## Configuration Apache2 ########
sudo cp ../html /var/www/html > /dev/null
sudo /etc/init.d/apache2 restart
mkdir /tmp/apache2 > /dev/null
sudo mv /var/www/* /tmp/apache2 > /dev/null

######## On déplace le fichier de configuration et on redémarre le service VFTDP ########
sudo cp ./vsftpd.conf /etc/vsftpd.conf > /dev/null
sudo /etc/init.d/vsftpd restart
[[ $? -ne 0 ]] && echo 
sudo mkdir /srv/ftp/ > /dev/null
sudo cp chnls.txt /srv/ftp > /dev/null
sudo chmod 777 /srv/ftp/chnls.txt > /dev/null
sudo chown nobody /srv/ftp/chnls.txt > /dev/null
######## Configuration IP de la machine : ########
echo -e "\nInterface ethernet utilisée pour se connecter aux Amino ?" 
read int
sudo ip a flush $int > /dev/null
sudo ip a add 192.168.1.1 dev $int > /dev/null

######## Demande à l'utilisateur ########
echo -e "\nCombien d'Amino à configurer"
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
	echo -e 'Si la derniere ligne donne 11, script \033[32m OK\033[0m, sinon \033[31m NOK\033[0m'
	echo
	echo
done