#!/bin/bash
sudo apt-get -q -y install postfix 
cp /data/alarmclock/deploy/files/postfix.cf /etc/postfix/main.cf
sudo /etc/init.d/postfix restart
