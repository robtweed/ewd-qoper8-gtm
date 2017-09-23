#!/usr/bin/env bash

sudo ntpdate -s ntp.ubuntu.com
sudo apt-get -qq update
sudo apt-get -qq install build-essential mc
wget -q https://downloads.sourceforge.net/project/fis-gtm/GT.M-amd64-Linux/V6.3-002/gtm_V63002_linux_x8664_pro.tar.gz
mkdir ~/gtm_V63002_linux_x8664_pro
tar zxvf ~/gtm_V63002_linux_x8664_pro.tar.gz -C ~/gtm_V63002_linux_x8664_pro
(cd /home/vagrant/gtm_V63002_linux_x8664_pro && sudo ./gtminstall --distrib /home/vagrant/gtm_V63002_linux_x8664_pro)
/usr/lib/fis-gtm/V6.3-002_x86_64/gtmprofile
/usr/lib/fis-gtm/V6.3-002_x86_64/gtmbase
(cd /vagrant && npm install)
