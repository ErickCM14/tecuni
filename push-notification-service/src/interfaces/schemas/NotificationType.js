const Joi = require('joi');

class NotificationTypeSchema {
    store = () => {
        return Joi.object({
            code: Joi.string().trim().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/).required().label('code'),            
            status: Joi.string().valid('true', 'false').required().label('status'), 
            createdUser:  Joi.string().trim().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/).allow(null).label('createdUser'),
            updatedUser:  Joi.string().trim().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/).allow(null).label('updatedUser')
        });
    };

    update = () => {
        return Joi.object({
            code: Joi.string().trim().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/).optional().label('code'),
            status: Joi.string().valid('true', 'false').required().label('status'), 
            createdUser:  Joi.string().trim().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/).allow(null).label('createdUser'),
            updatedUser:  Joi.string().trim().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/).allow(null).label('updatedUser')
        });
    };
}

module.exports = new NotificationTypeSchema();
