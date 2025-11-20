require('dotenv').config();
const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('⚠️ Ya hay una conexión activa a MongoDB');
    return;
  }
  try {
    const mongoUri = process.env.MONGO_URI ||  'mongodb://admin:Admin2025.-Db@mongodb:27017/demoAPP?authSource=admin';

    const conn = await mongoose.connect(mongoUri, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    isConnected = true;
    console.log(`✅ Conectado a MongoDB en: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1); // Mata el proceso si falla la conexión
  }
};

module.exports = connectDB;
