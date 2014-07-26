#!/bin/bash
# Create directory for the app.
mkdir -p /data

# Install libraries.
sudo apt-get update
sudo apt-get -q -y install g++ build-essential git

# Nodejs.
cd ~
wget http://nodejs.org/dist/v0.10.26/node-v0.10.26.tar.gz
tar -xvzf node-v0.10.26.tar.gz
cd node-v0.10.26
./configure
make
sudo make install
sudo ln -s /usr/local/bin/node /usr/bin/node 

# Npm.
cd ~
git clone git://github.com/isaacs/npm.git
cd npm/scripts
chmod +x install.sh
sudo ./install.sh

# Mongodb.
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/10gen.list
sudo apt-get update && sudo apt-get install mongodb-10gen
# mongo 

# Redis
sudo apt-get -q -y install redis-server 

# Install Repo. [interactive]
cd /data
git clone https://github.com/Philmod/alarmclock.git
cd alarmclock
npm install

# Hostname.
echo "alarmclock" > /etc/hostname
sudo hostname alarmclock 
echo "127.0.0.1 localhost alarmclock" >> /etc/hosts

# Fin.
echo "Finished."
