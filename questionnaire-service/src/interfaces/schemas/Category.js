const Joi = require('joi');

class CategorySchema {
  store = () => {
    return Joi.object({
      icon: Joi.string().required().label('icon'),
      color: Joi.string().min(7).max(9).required().label('color'),
      translations: Joi.object().pattern(
        Joi.string().length(2),
        Joi.object({
          name: Joi.string().min(3).max(100).required().label('name'),
        }).required()
      ).min(1).required().label('translations')
    });
  };

  update = () => {
    return Joi.object({
      icon: Joi.string().optional().label('icon'),
      color: Joi.string().min(7).max(9).optional().label('color'),
      translations: Joi.object().pattern(
        Joi.string().length(2), // Cualquier idioma en formato de 2 caracteres (es, en, fr, etc.)
        Joi.object({
          name: Joi.string().min(3).max(100).required().label('name'),
        }).required()
      ).min(1).optional().label('translations'),
    });
  };
}

module.exports = new CategorySchema();
