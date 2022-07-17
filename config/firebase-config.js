const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

require('dotenv').config()
console.log(process.env);

const serviceAccount = require("./mmrun-fda85-firebase-adminsdk-6y0sv-d53810779e.json")


// Initialize Firebase
const app = initializeApp({
    credential: cert(serviceAccount)
});
const db = getFirestore()

module.exports = db;