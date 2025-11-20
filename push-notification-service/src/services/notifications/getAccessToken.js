// src/fcm/getAccessToken.js
const { GoogleAuth } = require('google-auth-library');

const SCOPES = ['https://www.googleapis.com/auth/firebase.messaging'];

async function getAccessToken() {
  // usa keyfile si está definido, sino variables de entorno
  const auth = new GoogleAuth({
    keyFile: process.env.FIREBASE_SA_PATH,
    scopes: SCOPES
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();
  if (!token || !token.token) throw new Error('No se pudo obtener el access token para FCM');
  return token.token;
}

module.exports = { getAccessToken };
