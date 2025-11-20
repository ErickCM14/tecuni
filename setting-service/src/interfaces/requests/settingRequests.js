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

// class SettingRequests {
//   create() {
//     return [
//       body('key').trim().notEmpty().withMessage('Key is required').isLength({ min: 3 }).withMessage('Key must be at least 3 characters').matches(/^[a-z_]+$/).withMessage('Key must contain only letters, lowercase letters and underscores'),
//       body('value').trim().notEmpty().withMessage('Value is required'),
//       body('group').trim().notEmpty().withMessage('Group is required').isLength({ min: 3 }).withMessage('Group must be at least 3 characters').matches(/^[a-z_]+$/).withMessage('Group must contain only letters, lowercase letters and underscores'),
//       SettingRequests.handleValidation
//     ];
//   }

//   update() {
//     return [
//       body('key').trim().notEmpty().withMessage('Key is required').isLength({ min: 3 }).withMessage('Key must be at least 3 characters').matches(/^[a-z_]+$/).withMessage('Key must contain only letters, lowercase letters and underscores'),
//       body('value').trim().notEmpty().withMessage('Value is required'),
//       body('group').trim().notEmpty().withMessage('Group is required').isLength({ min: 3 }).withMessage('Group must be at least 3 characters').matches(/^[a-z_]+$/).withMessage('Group must contain only letters, lowercase letters and underscores'),
//       SettingRequests.handleValidation
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

// module.exports = new SettingRequests();
