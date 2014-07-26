#!/bin/bash
echo  "*.*          @logs.papertrailapp.com:46626" >> /etc/rsyslog.conf 
sudo /etc/init.d/rsyslog restart

sudo apt-get -q -y install rubygems1.9.1
sudo apt-get -q -y install build-essential ruby1.9.1 ruby1.9.1-dev
sudo gem -q -y install remote_syslog

cp /data/alarmclock/deploy/files/log_files.yml /etc/

sudo remote_syslog
