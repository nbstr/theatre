#!/bin/bash
sudo apt-get -q -y install monit 
cp /data/alarmclock/deploy/files/monitrc /etc/monit/
sudo /etc/init.d/monit restart
# tail -f /var/log/monit.log
