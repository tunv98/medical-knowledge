import firebase from "firebase/app";
import 'firebase/storage';

// config firebase
let config = {
    apiKey: "AIzaSyDyuuR4fljf-3CDB_rNkMlCKoKMiVEUHsY",
    authDomain: "medical-knowledge-aea33.firebaseapp.com",
    databaseURL: "https://medical-knowledge-aea33.firebaseio.com",
    projectId: "medical-knowledge-aea33",
    storageBucket: "medical-knowledge-aea33.appspot.com",
    messagingSenderId: "636037325775",
    appId: "1:636037325775:web:7af5eec2622545b1aae8ba",
    measurementId: "G-3VQGHJE94X"
};
firebase.initializeApp(config)

const storage = firebase.storage()

export {
    storage, firebase as default
}