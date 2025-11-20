const mongoose = require('mongoose');
const { Schema } = mongoose;
 
const notificationTypeModel = require('../../services/models/NotificationTypeModel');

// 1) Define el sub-esquema para 'data'
const DataEntrySchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    notificationType: { type: String, required: true, trim: true },
    extra_info: { type: String, trim: true }
  },
  { _id: false, id: false } // no crear _id para el subdoc
);
const NotificationTypeEntrySchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true }, 
  },
  { _id: false, id: false } // no crear _id para el subdoc
);
// 2) (opcional) sub-esquema para destinatary si lo necesitas como Map o Array
const DestinataryEntrySchema = new Schema(
  {
    idUser: { type: String, required: true, trim: true },
    idDevice: { type: String, required: true, trim: true },
    statusRead: { type: String, enum: ['unread', 'read', 'delivered', 'error'], default: 'unread' }
  },
  { _id: false, id: false }
);
// 3) Esquema principal
const PushNotificationSchema = new Schema(
  {
    code: { type: String, unique: true }, 
    title: { type: String, required: true, trim: true },
    body:  { type: String, required: true, trim: true },
    status:{ type: String, enum: ['pending','sent','failed','read'], default: 'pending', index: true },
    createdUser: { type: String, trim: true },
    updateUser:  { type: String, trim: true },
    data: DataEntrySchema,               
    destinatary: [DestinataryEntrySchema]
  },
  { timestamps: true }
);
// en tu schema de PushNotification
PushNotificationSchema.index({ 'destinatary.idUser': 1, createdAt: -1 });
PushNotificationSchema.index({ 'destinatary.idUser': 1, 'destinatary.statusRead': 1 });

module.exports = mongoose.model('PushNotification', PushNotificationSchema);