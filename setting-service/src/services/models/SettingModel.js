const mongoose = require('mongoose');
const { Schema } = mongoose;

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  group: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingSchema);
