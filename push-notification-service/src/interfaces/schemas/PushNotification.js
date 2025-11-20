const Joi = require('joi');
const NotificationType = require('../../services/models/NotificationTypeModel');

// ---------- Sub-esquemas reutilizables ----------

const DataObjectSchema = Joi.object({
  id: Joi.string().trim().min(1).max(64).required().label('data.id'),
  notificationType: Joi.string().trim().min(1).max(50).required().label('data.notificationType'),
  extra_info: Joi.string().trim().max(255).optional().label('data.extra_info')
}).label('data');

const DestinataryEntrySchema = Joi.object({
  idUser: Joi.string().trim().min(1).max(64).required().label('destinatary.idUser'),
  idDevice: Joi.string().trim().min(1).max(256).required().label('destinatary.idDevice'),
  statusRead: Joi.string().trim().valid('unread', 'read', 'delivered')
    .default('unread')
    .label('destinatary.statusRead')
});

const DestinataryArraySchema = Joi.array()
  .items(DestinataryEntrySchema)
  .min(1)
  .required()
  .label('destinatary');

 

class PushNotificationSchema {
  // CREATE (store)

    store = () => {
        return Joi.object({
          code: Joi.string().trim().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/).required().label('code'),
          createdUser: Joi.string().trim().min(3).max(50).required().label('createdUser'),
          title: Joi.string().trim().min(3).max(180).required().label('title'),
          body: Joi.string().trim().min(3).max(500).required().label('body'),
          status: Joi.string().trim().valid('pending', 'sent').default('pending').label('status'), 
          data: DataObjectSchema.required(),
          destinatary: DestinataryArraySchema
        });
    };

    update = () => {
        return Joi.object({
          code: Joi.string().trim().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/).required().label('code'),
          title: Joi.string().trim().min(3).max(180).required().label('title'),
          body: Joi.string().trim().min(3).max(500).required().label('body'),
          status: Joi.string().trim().valid('pending', 'sent').required().label('status'), 
          data: DataObjectSchema.required(),
          destinatary: Joi.array().items(DestinataryEntrySchema).min(1).required().label('destinatary'),
          createdUser: Joi.string().trim().min(3).max(50).required().label('createdUser'),
          updateUser: Joi.string().trim().min(3).max(50).optional().label('updateUser')
        });
    };

    patch = () => {
        return Joi.object({
          code: Joi.string().trim().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/).label('code'),
          title: Joi.string().trim().min(3).max(180).label('title'),
          body: Joi.string().trim().min(3).max(500).label('body'),
          status: Joi.string().trim().valid('pending', 'sent').label('status'), 
          data: DataObjectSchema,
          destinatary: Joi.array().items(DestinataryEntrySchema).min(1).label('destinatary'),
          createdUser: Joi.string().trim().min(3).max(50).required().label('createdUser'),
          updateUser: Joi.string().trim().min(3).max(50).optional().label('updateUser')
        });
    };
  }
  module.exports = new PushNotificationSchema();
