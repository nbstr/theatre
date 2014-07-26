#!/bin/bash
cp /root/projects/theatre/deploy/files/run-theatre.sh /etc/init/run-theatre.sh
cp /root/projects/theatre/deploy/files/theatre.conf /etc/init/theatre.conf

# Logs
mkdir /root/projects/theatre/logs
sudo start theatre
