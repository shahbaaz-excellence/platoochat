import firebase from "firebase/compat";
import firebaseApp from "firebase/compat/app";
import "firebase/compat/auth";

// var firebaseConfig = {
//   apiKey: "AIzaSyApRqc2T856a_ENBx6Svhdb1Pqorh8HDtk",
//   authDomain: "platoo-chat.firebaseapp.com",
//   projectId: "platoo-chat",
//   storageBucket: "platoo-chat.appspot.com",
//   messagingSenderId: "326612069245",
//   appId: "1:326612069245:web:dfd4955c618c6c0c07fa14"
// };

var firebaseConfig = {
  apiKey: "AIzaSyAaowy-juDBu-rtUbTAp5XdQChI7FXIYm0",
  authDomain: "platoo-polls.firebaseapp.com",
  projectId: "platoo-polls",
  storageBucket: "platoo-polls.appspot.com",
  messagingSenderId: "1026961897594",
  appId: "1:1026961897594:web:428198f70674f508f323c3"
};

firebaseApp.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const RealTimeDb = firebase.database();

export const auth = firebaseApp.auth();