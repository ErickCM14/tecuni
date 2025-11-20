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