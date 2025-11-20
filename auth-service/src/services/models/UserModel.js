const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String },
  email: { type: String, index: true, unique: true, required: true },
  username: { type: String },
  phone: { type: String },
  password: { type: String },
  photo: { type: String },
  dob: { type: Date },
  country: { type: String },
  state: { type: String },
  deviceId: { type: String, index: true },
  facebookId: { type: String, index: true },
  googleId: { type: String, index: true },
  appleId: { type: String, index: true },
  active: { type: Boolean, default: false, index: true },
  terms: { type: Boolean, default: false },
  roles: [{ type: Schema.Types.ObjectId, ref: 'Roles' }]
}, { timestamps: true });

module.exports = mongoose.model('Users', userSchema);