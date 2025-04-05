const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const serviceAccount = require("./permissions.json");

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_apiKey,
    authDomain: import.meta.env.VITE_authDomain,
    projectId: import.meta.env.VITE_projectId,
    storageBucket: import.meta.env.VITE_storageBucket,
    messagingSenderId: import.meta.env.VITE_messagingSenderId,
    appId: import.meta.env.VITE_appId
  };

const app = initializeApp(serviceAccount);
const db = getFirestore(app);

module.exports = db;