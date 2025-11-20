const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  tag: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Permissions', permissionSchema);
