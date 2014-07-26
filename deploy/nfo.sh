# START SERVER
sudo start daretofund

# RUN SCRIPT
02_process.sh

# LIST PROCESSES
ps aux | grep node

# STOP PROCESSES
sudo stop daretofund

# STOP ALL NODE PROCESSES
sudo killall node

# READ LOGS
cd logs/
tail -f *