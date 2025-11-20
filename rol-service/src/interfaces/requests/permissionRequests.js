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
// const Permission = require('../../services/models/PermissionModel');

// class RolRequests {
//   store() {
//     return [
//       body('tag').trim().notEmpty().withMessage('Tag is required').isLength({ min: 3 }).withMessage('Tag must be at least 3 characters').matches(/^[a-z_]+$/).withMessage('Tag must contain only letters, lowercase letters and underscores').custom(async (value) => {
//         const existing = await Permission.findOne({ tag: value });
//         if (existing) {
//           throw new Error('Tag must be unique');
//         }
//       }),
//       body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 characters').matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only letters'),
//       body('description').trim().optional().isString().withMessage('Description must be a string'),
//       RolRequests.handleValidation
//     ];
//   }

//   update() {
//     return [
//       body('tag').trim().optional().isString().withMessage('Tag must be a string').isLength({ min: 3 }).withMessage('Tag must be at least 3 characters').matches(/^[a-z_]+$/).withMessage('Tag must contain only letters, lowercase letters and underscores').custom(async (value, { req }) => {
//         if (!value) return true;
//         const existing = await Permission.findOne({ tag: value, _id: { $ne: req.params.id } });
//         if (existing) {
//           throw new Error('Tag must be unique');
//         }
//         return true;
//       }),
//       body('name').trim().optional().isString().withMessage('Name must be a string').isLength({ min: 3 }).withMessage('Name must be at least 3 characters').matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only letters'),
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
