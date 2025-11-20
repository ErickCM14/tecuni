const mongoose = require('mongoose');
const { Schema } = mongoose;

const rolSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: { type: String },
  is_default: { type: Number, default: 0 },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permissions' }]
}, { timestamps: true });

module.exports = mongoose.model('Roles', rolSchema);
