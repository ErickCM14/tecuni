require('dotenv').config();

module.exports = {
    oneSignal: {
        appId: process.env.ONE_SIGNAL_APP_ID || '',
        apiKey: process.env.ONE_SIGNAL_API_KEY || '',
    }
};