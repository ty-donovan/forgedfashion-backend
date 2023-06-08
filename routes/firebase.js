const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getStorage } = require('firebase/storage');
const { getAuth } = require("firebase/auth");


const serviceAccount = require("../permissions.json");


const app = initializeApp(serviceAccount);
const storage = getStorage(app)
const db = getFirestore(app);
const auth = getAuth(app);

module.exports = { db, storage, auth };