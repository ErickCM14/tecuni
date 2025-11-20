const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      errors: { label: 'key' }
    });

    if (error) {
      const formattedErrors = error.details.map((err) => {
        const labelKey = `labels.${err.context.label}`;
        const fieldLabel = req.t(labelKey, { defaultValue: err.context.label });

        const messageKey = `validation.${err.type}`;
        const message = req.t(messageKey, {
          field: fieldLabel,
          param: err.context.limit || err.context.peers || ''
        });

        return message
      });

      return res.status(400).json({
        success: false,
        message: formattedErrors.join(' ')
      });
    }

    next();
  };
}

module.exports = validate;

// const { body, validationResult } = require('express-validator');

// class RolRequests {

//   store() {
//     return [
//       body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 characters').matches(/^[a-z]+$/).withMessage('Name must contain only letters and lowercase letters'),
//       body('description').trim().optional().isString().withMessage('Description must be a string'),
//       RolRequests.handleValidation
//     ];
//   }

//   update() {
//     return [
//       body('name').trim().optional().isString().withMessage('Name must be a string').isLength({ min: 3 }).withMessage('Name must be at least 3 characters').matches(/^[a-z]+$/).withMessage('Name must contain only letters and lowercase letters'),
//       body('description').trim().optional().isString().withMessage('Description must be a string'),
//       RolRequests.handleValidation
//     ];
//   }

//   static handleValidation(req, res, next) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const errorMessages = errors.array().map(err => `${err.msg}`).join(', ');

//       return res.status(422).json({
//         success: false,
//         message: `${errorMessages}`,
//         data: errors.array()
//       });
//     }
//     next();
//   }
// }

// module.exports = new RolRequests();
