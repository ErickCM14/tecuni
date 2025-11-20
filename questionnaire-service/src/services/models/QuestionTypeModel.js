const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionTypeSchema = new Schema({
  code: { type: String, unique: true },
  translations: {
    type: Map,
    of: new Schema({
      name: String,
      description: String
    }, { _id: false })
  }
}, { timestamps: true });

module.exports = mongoose.model('Questions_Types', questionTypeSchema);
