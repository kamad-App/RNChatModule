import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/auth';

var firebaseConfig = {
  apiKey: 'AIzaSyAg-GLD8oidMo91PZqS4Tg84z52F4r-7vw',
  authDomain: 'chat-6095f.firebaseapp.com',
  databaseURL: 'https://chat-6095f-default-rtdb.firebaseio.com/',
  projectId: 'chat-6095f',
  storageBucket: 'chat-6095f.appspot.com',
  messagingSenderId: '675729610627',
  appId: '1:675729610627:ios:57095164b0335141e2c8b6',
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
//const firebaseSvc = new FirebaseSvc();
console.log('auth', auth);
export {db, auth};
//export default firebaseSvc;