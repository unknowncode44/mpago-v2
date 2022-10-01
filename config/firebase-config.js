const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');


require('dotenv').config()

const serviceAccount = require('./mmrun-fda85-firebase-adminsdk-6y0sv-d53810779e.json')


// {
//     "type": process.env.SA_TYPE,
//     "project_id": process.env.SA_PROJECT_ID,
//     "private_key_id": process.env.SA_PRIVATE_KEY_ID,
//     "private_key": process.env.SA_PRIVATE_KEY,
//     "client_email": process.env.SA_CLIENT_EMAIL,
//     "client_id": process.env.SA_CLIENT_ID,
//     "auth_uri": process.env.SA_AUTH_URI,
//     "token_uri": process.env.SA_TOKEN_URI,
//     "auth_provider_x509_cert_url": process.env.SA_AUTH_PROVIDER_CERT_URL,
//     "client_x509_cert_url": process.env.SA_CLIENT_CERT_URL,
// }


// Initialize Firebase
const app = initializeApp({
    credential: cert(serviceAccount)
});
const db = getFirestore()

module.exports = db;