# medical-knowledge
yarn run build
sudo systemctl reload nginx
_______________________________
sudo service nginx start
sudo service nginx restart


edit config default:

    cd /etc/nginx/sites-available  
sudo gedit medicalknowledge
cd .. && cd sites-enabled && rm medicalknowledge && ln -s /etc/nginx/sites-available/medicalknowledge /etc/nginx/sites-enabled/
cd .. && cd sites-available
sudo rm medicalknowledge
ln -s /etc/nginx/sites-available/medicalknowledge /etc/nginx/sites-enabled/
systemctl reload nginx
service nginx restart
nginx
systemctl status nginx.service

nano /etc/systemd/system/medicalknowledge.service
systemctl daemon-reload
systemctl start medicalknowledge.service
systemctl status medicalknowledge.service