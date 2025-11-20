const Joi = require('joi');

class PermissionSchema {
  store = () => {
    return Joi.object({
      tag: Joi.string().trim().min(3).max(50).pattern(/^[a-z_]+$/).required().label('tag'),
      name: Joi.string().trim().min(3).max(50).pattern(/^[A-Za-z\s]+$/).required().label('name'),
      description: Joi.string().trim().min(3).max(64).optional().label('description'),
    });
  };

  update = () => {
    return Joi.object({
      tag: Joi.string().trim().min(3).max(50).pattern(/^[a-z_]+$/).optional().label('tag'),
      name: Joi.string().trim().min(3).max(50).pattern(/^[A-Za-z\s]+$/).optional().label('name'),
      description: Joi.string().trim().min(3).max(64).optional().label('description'),
    });
  };
}

module.exports = new PermissionSchema();
