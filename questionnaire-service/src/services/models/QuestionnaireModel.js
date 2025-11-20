const mongoose = require('mongoose');
const { Schema } = mongoose;

const responseSchema = new Schema({
  value: String,
  order: Number,
  translations: {
    type: Map,
    of: new Schema({
      label: String
    }, { _id: false })
  }
}, { _id: false });

const questionSchema = new Schema({
  questionType: {
    code: String,
    translations: {
      type: Map,
      of: new Schema({
        name: String,
        description: String
      }, { _id: false })
    }
  },
  translations: {
    type: Map,
    of: new Schema({
      label: String
    }, { _id: false })
  },
  responses: [responseSchema]
}, { _id: false });

const questionnaireSchema = new Schema({
  code: { type: String, unique: true },
  icon: String,
  color: String,
  translations: {
    type: Map,
    of: new Schema({
      name: String,
      description: String
    }, { _id: false })
  },
  category: {
    icon: String,
    color: String,
    translations: {
      type: Map,
      of: new Schema({
        name: String
      }, { _id: false })
    }
  },
  questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Questionnaires', questionnaireSchema);
