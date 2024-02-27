# coding=utf-8
from flask import Flask, request, jsonify, render_template
from flask_mysqldb import MySQL
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
from flask_cors import CORS
from datetime import date
import base64
import speech_recognition as sr
import requests
import json
from function import read_audio, transcriptUseWitAi, transcriptUseGgApi
from elastic import getAll, insertData, deleteId, searchScroll
# from .models import db, Audio
import pyrebase
import ast
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token

app = Flask(__name__)
CORS(app)
# config database
app.config['MYSQL_DB'] = 'MedicalKnowledge'
app.config['MYSQL_CURSORCLASS'] ='DictCursor'
app.config['JSON_AS_ASCII'] = False
app.config['JWT_SECRET_KEY'] = 'secret'

#Env: dev
# app.config['MYSQL_USER']='admin1'
# app.config['MYSQL_PASSWORD'] = 'admin1'
#Env: production
app.config['MYSQL_USER']='phpmyadmin'
app.config['MYSQL_PASSWORD'] = '19101998'

bcrypt = Bcrypt(app)
jwt = JWTManager(app)
mysql = MySQL(app)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://admin1:admin1@localhost/MedicalKnowledge'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)
# migrate = Migrate(app, db)
# manager = Manager(app)
# manager.add_command('db', MigrateCommand)

# config firebase
config = {
    "apiKey": "AIzaSyDyuuR4fljf-3CDB_rNkMlCKoKMiVEUHsY",
    "authDomain": "medical-knowledge-aea33.firebaseapp.com",
    "databaseURL": "https://medical-knowledge-aea33.firebaseio.com",
    "projectId": "medical-knowledge-aea33",
    "storageBucket": "medical-knowledge-aea33.appspot.com",
    "messagingSenderId": "636037325775",
    "appId": "1:636037325775:web:7af5eec2622545b1aae8ba",
    "measurementId": "G-3VQGHJE94X"
}
firebase = pyrebase.initialize_app(config)


#end firebase
#user
@app.route('/api/users/register', methods=['POST'])
def register():
    cur = mysql.connection.cursor()
    firstname = request.get_json()['firstname']
    lastname = request.get_json()['lastname']
    email = request.get_json()['email']
    password = bcrypt.generate_password_hash(request.get_json()['password']).decode('utf-8')
    created = date.today()
    cur.execute("INSERT INTO user (firstname, lastname, email, password, created) VALUE ('" +
    str(firstname) + "', '" +
    str(lastname) + "', '" +
    str(email) + "', '" +
    str(password) + "', '" +
    str(created) + "')")
    mysql.connection.commit()
    result = {
        "firstname": firstname,
        "lastname": lastname,
        "email": email,
        "password": password,
        "created": created
    }
    return jsonify({"result": result})

@app.route('/api/users/login', methods=['POST'])
def login():
    cur = mysql.connection.cursor()
    email = request.get_json()['email']
    password =request.get_json()['password']
    result = ""

    cur.execute("SELECT * FROM user where email = '" + str(email) + "'")
    rv = cur.fetchone()
    if rv:
        if bcrypt.check_password_hash(rv['password'], password):
            access_token = create_access_token(identity = {'id': rv['id'], 'firstname': rv['firstname'], 'lastname': rv['lastname'],'email': rv['email']})
            result = jsonify({"code": 0, "token": access_token})
    else:
        result = jsonify({"code": 1, "error": "Invalid username and password"})
    return result
#end user
# router
@app.route('/')
def server():
#     getAll()
    return "Welcome Server"


@app.route('/api/searchdt', methods=['GET'])
def get_list_audios():
    cur = mysql.connection.cursor()
    keySearch = request.args.get('key')
    page = int(request.args.get('page'))
    page_size = int(request.args.get('page_size'))
    key = base64.b64decode(keySearch)
    #like_key = "%" + key.decode("UTF-8") + "%"
    indexObj = searchScroll(key.decode("UTF-8"), page, page_size)
    # search content no index
    #cur.execute("SELECT * FROM MedicalKnowledge.audio WHERE title like %s ", [str(like_key)])
    # cur.execute("SELECT * FROM MedicalKnowledge.audio WHERE title like %s ", [str("dạ dày")])
    # response = cur.fetchall()
    # search fulltext mysql
    # cur.execute("SELECT * FROM MedicalKnowledge.audio WHERE MATCH(content) AGAINST(%s) ", [str(like_key)])
    prev = {  
        "total": indexObj['total'],
        "hasNext": indexObj['hasNext']
    }
    # if (len(indexObj['arr']) == 0):
    # 	return jsonify(prev = prev, arr = tuple(indexObj['arr']))
    # format_strings = ','.join(['%s'] * len(indexObj['arr']))
    # cur.execute("SELECT * FROM MedicalKnowledge.audio WHERE id in (%s)" % format_strings, tuple(indexObj['arr']))
    # response = cur.fetchall()
    return jsonify(prev = prev, result = tuple(indexObj['arr']))

@app.route('/api/adddt',methods= ['POST'])
def addAudio():
    #start request from UI
    file = request.files["file"]
    arr = [
    request.form['title'],
    request.form['author'],
    request.form['position'],
    request.form['link'],
    request.form['date'],
    request.form['status'],
    request.form['user_id']
    ]
    #end request from UI

    if arr[5] == "1":
        result = transcriptUseGgApi(file)
        if(result["code"] == 1):
        #start save into db
            cur = mysql.connection.cursor()
            cur.execute("INSERT INTO audio(title, author, position, refs, date, content, status, user_id) values (%s, %s, %s,%s, %s, %s, true, %s)",([str(arr[0])], [str(arr[1])], [str(arr[2])], [str(arr[3])], [str(arr[4])], [str(result["text"])], [str(arr[6])]))
            mysql.connection.commit()
            lastId = cur.lastrowid
            cur.close()
            #end save into db

            #insert ES
            insertData(lastId,arr[0],result["text"] )
            #end insert ES
    else:
        result = {
        "code" : 1,
        "text" : "ok",
        }
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO audio(title, author, position, refs, date, content, status, user_id) values (%s, %s, %s, %s, %s, %s, false, %s)",([str(arr[0])], [str(arr[1])], [str(arr[2])], [str(arr[3])], [str(arr[4])], [str("")], [str(arr[6])]))
        mysql.connection.commit()
        cur.close()
    return result


@app.route('/audio')
def transcript():
    transcriptUseGgApi()
    return "done"


# end router


# @app.route('/0')
# def getAllEs():
#     return getAll()
#
# @app.route('/1')
# def insertDataEs():
#     return insertData()
#
# @app.route('/2')
# def searchKeyEs():
#     obj = searchKey('tim')
#     return "done"
#
# @app.route('/3')
# def deleteES():
#     return deleteId(7)

if __name__ == "__main__":
    app.run(debug=True)

# from subprocess import check_call
# ok = check_call(['ffmpeg','-i','input.mp3','output.wav'])
# if ok:
#  with open('output.wav', 'rb') as f:
#  wav_file = f.read()
