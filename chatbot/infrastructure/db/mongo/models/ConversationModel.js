import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  // role: String,
  role: {
    type: String,
    enum: ["user", "bot", "system"],
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  // message: String,
  waId: { type: String, trim: true, required: true },
  status: {
    type: String,
    enum: ["received", "sent", "read", "delivered"],
    default: 'sent'
  },
  messageType: { type: String, trim: true },
  metaTimestamp: {
    type: Number,
    required: false,
    default: () => Math.floor(Date.now() / 1000)
  },
  timestamp: {
    type: Date,
    default: Date.now,
    set: ts => {
      if (typeof ts === "number") return new Date(ts * 1000);
      return ts;
    }
  }
}, { _id: false });

const ConversationSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  name: {
    type: String,
    trim: true,
  },
  // email: String,
  // contactPhone: String,
  // company: String,
  // projectType: String,
  // description: String,
  // pending: Number,
  messages: {
    type: [MessageSchema],
    default: []
  }
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