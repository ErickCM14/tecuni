import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";

export const mongoClient = {
  async connect() {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        // dbName: process.env.MONGO_DB,
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
      });
      console.log("🟢 Connected to MongoDB");
    }
  },
};
