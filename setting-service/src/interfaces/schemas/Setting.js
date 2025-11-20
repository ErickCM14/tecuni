const Joi = require('joi');

class SettingSchema {
  store = () => {
    return Joi.object({
      key: Joi.string().trim().min(3).max(50).pattern(/^[a-z_]+$/).required().label('key'),
      value: Joi.any().required().label('value'),
      group: Joi.string().trim().min(3).max(50).pattern(/^[a-z_]+$/).required().label('group'),
    });
  };

  update = () => {
    return Joi.object({
      key: Joi.string().trim().min(3).max(50).pattern(/^[a-z_]+$/).optional().label('key'),
      value: Joi.any().required().label('value'),
      group: Joi.string().trim().min(3).max(50).pattern(/^[a-z_]+$/).required().label('group'),
    });
  };
}

module.exports = new SettingSchema();
