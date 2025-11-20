const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { firebaseConfig } = require('../../../config/oauth');

const appFirebase = initializeApp(firebaseConfig);

class FirebaseAuthService {
    async verifySocialToken(socialToken) {
        try {
            const decodedToken = await getAuth().verifyIdToken(socialToken);
            return decodedToken;
        } catch (error) {
            // console.log(error);
            // console.error("❌ Error verificando ID token:", error);
            // console.error("Mensaje:", error.errorInfo.message);
            throw new Error(`${error.message}`);
        }
    }
}

module.exports = FirebaseAuthService;