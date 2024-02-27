source env/bin/activate
pip3 install 

python3 app.py

LOAD SERVER

systemctl daemon-reload
systemctl start medicalknowledge
systemctl restart medicalknowledge
systemctl status medicalknowledge
systemctl stop medicalknowledge

xoa port: 
sudo fuser -k 5000/tcp

gunicorn -b 127.0.0.1:5000 app:app

etc/systemd/system

112.213.88.74:5000