import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";


const firebaseConfig = {
  apiKey: "<your firebaseConfig.apiKey>",
  authDomain: "<your firebaseConfig.authDomain>",
  databaseURL: "<your firebaseConfig.databaseURL>",
  projectId: "<your firebaseConfig.projectId>",
  storageBucket: "<your firebaseConfig.storageBucket>",
  messagingSenderId: "<your firebaseConfig.messagingSenderId>",
  appId: "<your firebaseConfig.appId>",
  measurementId: "<your firebaseConfig.measurementId>"
};

const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export default firebaseApp;