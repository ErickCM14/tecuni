const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  icon: { type: String },
  color: { type: String },
  translations: {
    type: Map,
    of: new Schema({
      name: String
    }, { _id: false })
  }
}, { timestamps: true });

module.exports = mongoose.model('Categories', categorySchema);
