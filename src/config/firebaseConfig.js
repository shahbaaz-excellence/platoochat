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
  apiKey: "AIzaSyDyhu75NJKtUzwJqs5RZTkuMGth6nq496Q",
  authDomain: "platoo-7eff0.firebaseapp.com",
  databaseURL: "https://platoo-7eff0.firebaseio.com",
  projectId: "platoo-7eff0",
  storageBucket: "platoo-7eff0.appspot.com",
  messagingSenderId: "87835247367",
  appId: "1:87835247367:web:87797aaad8898f6c1fbba2",
  measurementId: "G-9JTZS7208F"
};

firebaseApp.initializeApp(firebaseConfig);
export const firestoreDb = firebase.firestore();
export const RealTimeDb = firebase.database();
export const auth = firebaseApp.auth();

export const networkingApi = "https://ai.platoo-platform.com";
export const baseUrl = "https://us-central1-platoo-7eff0.cloudfunctions.net";

