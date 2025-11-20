import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: String,
  message: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const ConversationSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  name: String,
  email: String,
  contactPhone: String,
  company: String,
  projectType: String,
  description: String,
  pending: Number,
  messages: [MessageSchema]
}, { timestamps: true });

export const ConversationModel = mongoose.model("Conversation", ConversationSchema);


// import mongoose from "mongoose";

// const MessageSchema = new mongoose.Schema({
//   role: String,
//   message: String,
//   timestamp: Date
// });

// const ConversationSchema = new mongoose.Schema({
//   phoneContact: String,
//   messages: [MessageSchema],
//   createdAt: Date,
//   updatedAt: Date
// });

// export const ConversationModel = mongoose.model("Conversation", ConversationSchema);