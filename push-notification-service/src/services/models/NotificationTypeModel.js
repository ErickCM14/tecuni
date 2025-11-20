const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationTypeSchema = new Schema({  
  code: { type: String, unique: true }, 
  status: String,
  createdUser:String, 
  updatedUser:String, 

}, { timestamps: true }); 

module.exports = mongoose.model('NotificationType', notificationTypeSchema);
