import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyDntH0oWTN8ncRdCf2wE_5BaXr3YejmD1k",
  authDomain: "orbital-masterplan.firebaseapp.com",
  databaseURL: "https://orbital-masterplan-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "orbital-masterplan",
  storageBucket: "orbital-masterplan.appspot.com",
  messagingSenderId: "639962900885",
  appId: "1:639962900885:web:453bbb3ceaebdf3d9e2e9c",
  measurementId: "G-5LDCK8W5Y5"
};

const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export default firebaseApp;