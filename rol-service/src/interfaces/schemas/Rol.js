const Joi = require('joi');

class RolSchema {
  store = () => {
    return Joi.object({
      name: Joi.string().trim().min(3).max(50).pattern(/^[a-z]+$/).required().label('name'),
      description: Joi.string().trim().min(3).max(64).optional().label('description'),
      permissions: Joi.array().items(Joi.string().trim()).unique().optional().label('permissions'),
    });
  };

  update = () => {
    return Joi.object({
      name: Joi.string().trim().min(3).max(50).pattern(/^[a-z]+$/).optional().label('name'),
      description: Joi.string().trim().min(3).max(64).optional().label('description'),
      permissions: Joi.array().items(Joi.string().trim()).unique().optional().label('permissions'),
    });
  };
}

module.exports = new RolSchema();
