const Joi = require('joi');

class QuestionnaireSchema {
  store = () => {
    return Joi.object({
      code: Joi.string().trim().min(3).max(50).alphanum().required().label('code'),
      icon: Joi.string().allow('').optional().label('icon'),
      color: Joi.string().allow('').min(7).max(9).optional().label('color'),
      translations: Joi.object().pattern(
        Joi.string().length(2), // Cualquier idioma en formato de 2 caracteres (es, en, fr, etc.)
        Joi.object({
          name: Joi.string().min(3).max(100).required().label('name'),
          description: Joi.string().min(3).max(200).required().label('description'),
        }).required()
      ).min(1).required().label('translations'),
      categoryId: Joi.string().optional().label('categoryId'),
      questions: Joi.array().items(
        Joi.object({
          translations: Joi.object().pattern(
            Joi.string().length(2),
            Joi.object({
              label: Joi.string().min(3).max(150).required().label('labelTranslationQuestion'),
            }).required()
          ).min(1).required().label('translationsQuestion'),
          questionType: Joi.string().valid('multiple_choice', 'multiple_selection', 'open_ended_question').required().label('questionType'),
          responses: Joi.when('questionType', {
            is: Joi.valid('multiple_choice', 'multiple_selection'),
            then: Joi.array().items(
              Joi.object({
                value: Joi.string().min(1).max(100).required().label('responseValue'),
                order: Joi.number().integer().min(1).required().label('responseOrder'),
                translations: Joi.object().pattern(
                  Joi.string().length(2),
                  Joi.object({
                    label: Joi.string().min(1).max(512).required().label('labelTranslationResponse'),
                  }).required()
                ).min(1).required().label('translationsResponse')
              })
            ).min(1).required().label('responsesQuestions'),
            otherwise: Joi.array().length(0).optional().label('responsesQuestions')
          })
        })
      ).min(1).required().label('questions')
    });
  };

  update = () => {
    return Joi.object({
      code: Joi.string().trim().min(3).max(50).alphanum().required().label('code'),
      icon: Joi.string().allow('').optional().label('icon'),
      color: Joi.string().allow('').min(7).max(9).optional().label('color'),
      translations: Joi.object().pattern(
        Joi.string().length(2), // Cualquier idioma en formato de 2 caracteres (es, en, fr, etc.)
        Joi.object({
          name: Joi.string().min(3).max(100).required().label('name'),
          description: Joi.string().min(3).max(200).required().label('description'),
        }).required()
      ).min(1).required().label('translations'),
      categoryId: Joi.string().optional().label('categoryId'),
      questions: Joi.array().items(
        Joi.object({
          translations: Joi.object().pattern(
            Joi.string().length(2),
            Joi.object({
              label: Joi.string().min(3).max(150).required().label('labelTranslationQuestion'),
            }).required()
          ).min(1).required().label('translationsQuestion'),
          questionType: Joi.string().valid('multiple_choice', 'multiple_selection', 'open_ended_question').required().label('questionType'),
          responses: Joi.when('questionType', {
            is: Joi.valid('multiple_choice', 'multiple_selection'),
            then: Joi.array().items(
              Joi.object({
                value: Joi.string().min(1).max(100).required().label('responseValue'),
                order: Joi.number().integer().min(1).required().label('responseOrder'),
                translations: Joi.object().pattern(
                  Joi.string().length(2),
                  Joi.object({
                    label: Joi.string().min(1).max(512).required().label('labelTranslationResponse'),
                  }).required()
                ).min(1).required().label('translationsResponse')
              })
            ).min(1).required().label('responsesQuestions'),
            otherwise: Joi.array().length(0).optional().label('responsesQuestions')
          })
        })
      ).min(1).required().label('questions')
    });
  };

  patch = () => {
    return Joi.object({
      code: Joi.string().trim().min(3).max(50).alphanum().allow('').optional().label('code'),
      icon: Joi.string().allow('').optional().label('icon'),
      color: Joi.string().allow('').min(7).max(9).optional().label('color'),
      translations: Joi.object().pattern(
        Joi.string().length(2), // Cualquier idioma en formato de 2 caracteres (es, en, fr, etc.)
        Joi.object({
          name: Joi.string().min(3).max(100).required().label('name'),
          description: Joi.string().min(3).max(200).required().label('description'),
        }).required()
      ).min(1).allow('').optional().label('translations'),
      categoryId: Joi.string().allow('').optional().label('categoryId'),
      questions: Joi.array().items(
        Joi.object({
          translations: Joi.object().pattern(
            Joi.string().length(2),
            Joi.object({
              label: Joi.string().min(3).max(150).required().label('labelTranslationQuestion'),
            }).required()
          ).min(1).optional().label('translationsQuestion'),
          questionType: Joi.string().valid('multiple_choice', 'multiple_selection', 'open_ended_question').required().label('questionType'),
          responses: Joi.when('questionType', {
            is: Joi.valid('multiple_choice', 'multiple_selection'),
            then: Joi.array().items(
              Joi.object({
                value: Joi.string().min(1).max(100).required().label('responseValue'),
                order: Joi.number().integer().min(1).required().label('responseOrder'),
                translations: Joi.object().pattern(
                  Joi.string().length(2),
                  Joi.object({
                    label: Joi.string().min(1).max(512).required().label('labelTranslationResponse'),
                  }).required()
                ).min(1).required().label('translationsResponse')
              })
            ).min(1).optional().label('responsesQuestions'),
            otherwise: Joi.array().length(0).optional().label('responsesQuestions')
          })
        })
      ).min(1).optional().label('questions')
    });
  };
}

module.exports = new QuestionnaireSchema();
