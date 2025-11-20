require('dotenv').config();
const firebaseConfig = {
    apiKey: process.env.APIKEY ? process.env.APIKEY : "AIzaSyD60o_xv7UkOr786Slnbb7FOLMpN6WLr6M",
    authDomain: process.env.AUTHDOMAIN ? process.env.AUTHDOMAIN : "idkyet-5f249.firebaseapp.com",
    projectId: process.env.PROJECTID ? process.env.PROJECTID : "idkyet-5f249",
    storageBucket: process.env.STORAGEBUCKET ? process.env.STORAGEBUCKET : "idkyet-5f249.firebasestorage.app",
    messagingSenderId: process.env.MESSAGINGSENDERID ? process.env.MESSAGINGSENDERID : "990891167892",
    appId: process.env.APPID ? process.env.APPID : "1:990891167892:web:84e4880cb0c281dc396481",
};

module.exports = { firebaseConfig };