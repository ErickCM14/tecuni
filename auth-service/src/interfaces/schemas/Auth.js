const Joi = require('joi');

class AuthSchema {
  register = () => {
    return Joi.object({
      name: Joi.string().trim().min(2).max(50).required().label('name'),
      lastname: Joi.string().trim().min(3).max(50).required().label('lastname'),
      username: Joi.string().trim().max(64).optional().label('username'),
      email: Joi.string().trim().email().max(64).required().label('email'),
      phone: Joi.string().trim().min(8).max(15).required().label('phone'),
      password: Joi.string().trim().min(8).max(64).required().label('password'),
      photo: Joi.string().uri().trim().max(128).allow('').optional().label('photo'),
      dob: Joi.date().iso().less('now').greater(new Date('1950-01-01')).optional().label('dob'),
      country: Joi.string().trim().pattern(/^[A-Za-zÀ-ÿ\u00f1\u00d1\s]+$/).min(2).max(56).optional().label('country'),
      state: Joi.string().trim().pattern(/^[A-Za-zÀ-ÿ\u00f1\u00d1\s]+$/).min(2).max(56).optional().label('state'),
      terms: Joi.boolean().required().label('terms'),
      deviceId: Joi.string().trim().min(6).max(256).optional().label('deviceId'),
      roles: Joi.array().items(Joi.string().trim()).unique().optional().label('roles'),
    });
  };

  login = () => {
    return Joi.object({
      email: Joi.string().trim().email().max(64).required().label('email'),
      // username: Joi.string().trim().max(64).required().label('username'),
      password: Joi.string().trim().min(8).max(64).required().label('password'),
    });
  };

  loginSocial = () => {
    return Joi.object({
      socialToken: Joi.string().trim().required().label('socialToken'),
    });
  };

  sendVerificationCode = () => {
    return Joi.object({
      email: Joi.string().trim().email().max(64).required().label('email'),
      code: Joi.string().trim().min(6).max(6).optional().label('code'),
    });
  };

  verifyAccount = () => {
    return Joi.object({
      email: Joi.string().trim().email().max(64).required().label('email'),
      code: Joi.string().trim().min(6).max(6).required().label('code'),
    });
  };

  forgotPassword = () => {
    return Joi.object({
      email: Joi.string().trim().email().max(64).required().label('email'),
      code: Joi.string().trim().min(6).max(6).optional().label('code'),
    });
  };

  resetPassword = () => {
    return Joi.object({
      email: Joi.string().trim().email().max(64).required().label('email'),
      password: Joi.string().trim().min(8).max(64).required().label('password'),
      code: Joi.string().trim().min(6).max(6).required().label('code'),
    });
  };
}

module.exports = new AuthSchema();
