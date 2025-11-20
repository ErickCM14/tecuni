const Joi = require('joi');

class QuestionTypeSchema {
    store = () => {
        return Joi.object({
            code: Joi.string().trim().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/).required().label('code'),
            translations: Joi.object().pattern(
                Joi.string().length(2),
                Joi.object({
                    name: Joi.string().min(3).max(100).required().label('name'),
                    description: Joi.string().min(3).max(200).required().label('description'),
                }).required()
            ).min(1).required().label('translations')
        });
    };

    update = () => {
        return Joi.object({
            code: Joi.string().trim().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/).optional().label('code'),
            translations: Joi.object().pattern(
                Joi.string().length(2), // Cualquier idioma en formato de 2 caracteres (es, en, fr, etc.)
                Joi.object({
                    name: Joi.string().min(3).max(100).required().label('name'),
                    description: Joi.string().min(3).max(200).required().label('description'),
                }).required()
            ).min(1).optional().label('translations'),
        });
    };
}

module.exports = new QuestionTypeSchema();
