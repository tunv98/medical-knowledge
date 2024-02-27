import requests
import json
import speech_recognition as sr

#config speech API
API_ENDPOINT = 'https://api.wit.ai/speech'
wit_access_token = 'WZKUEVD2VTG2FEJQH73NP2NVQZKQQEAH'
#end speech_recognition

def read_audio(WAVE_FILENAME):
    with open(WAVE_FILENAME, 'rb') as f:
        audio = f.read()
    return audio

def transcriptUseWitAi(file):
    headers = {
        'authorization': 'Bearer ' + wit_access_token,
        'Content-Type' : 'audio/wav'
        }
    audio = read_audio(file.filename)
    response = requests.post(API_ENDPOINT, headers = headers, data = audio)
    data = json.loads(response.content)
    text = data['_text']
    return text

def transcriptUseGgApi(file):
#     AUDIO_FILE = ("dongmach1ph30.wav")
    result = {
        "code" : 0,
        "text" : "",
    }
    r = sr.Recognizer()
    print("file", file)
    with sr.AudioFile(file) as source:
        audio = r.record(source)
    try:
        print("audio", audio)
        result["text"] = r.recognize_google(audio, language='vi-VN')
        result["code"] = 1
        print("The audio file contains: " + result["text"])
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
        result["text"] = ""
        result["code"] = 2
    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}".format(e))
        result["text"] = ""
        result["code"] = 3
    return result