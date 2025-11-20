const Joi = require('joi');

class UserSchema {
  create = () => {
    return Joi.object({
      name: Joi.string().trim().min(2).max(50).required().label('name'),
      lastname: Joi.string().trim().min(3).max(50).required().label('lastname'),
      username: Joi.string().trim().max(64).optional().label('username'),
      email: Joi.string().trim().email().max(64).required().label('email'),
      phone: Joi.string().trim().min(8).max(15).required().label('phone'),
      password: Joi.string().trim().min(8).max(64).required().label('password'),
      photo: Joi.string().uri().trim().max(128).optional().label('photo'),
      dob: Joi.date().iso().less('now').greater(new Date('1950-01-01')).optional().label('dob'),
      country: Joi.string().trim().pattern(/^[A-Za-zÀ-ÿ\u00f1\u00d1\s]+$/).min(2).max(56).optional().label('country'),
      state: Joi.string().trim().pattern(/^[A-Za-zÀ-ÿ\u00f1\u00d1\s]+$/).min(2).max(56).optional().label('state'),
      deviceId: Joi.string().trim().min(6).max(256).optional().label('deviceId'),
      roles: Joi.array().items(Joi.string().trim()).unique().optional().label('roles'),
    });
  };

  update = () => {
    return Joi.object({
      name: Joi.string().trim().min(4).max(50).label('name'),
      lastname: Joi.string().trim().min(3).max(50).optional().label('lastname'),
      username: Joi.string().trim().max(64).optional().label('username'),
      email: Joi.string().trim().email().max(64).optional().label('email'),
      phone: Joi.string().trim().min(8).max(15).optional().label('phone'),
      password: Joi.string().trim().min(8).max(64).optional().label('password'),
      photo: Joi.string().uri().trim().max(128).optional().label('photo'),
      dob: Joi.date().iso().less('now').greater(new Date('1950-01-01')).optional().label('dob'),
      country: Joi.string().trim().pattern(/^[A-Za-zÀ-ÿ\u00f1\u00d1\s]+$/).min(2).max(56).optional().label('country'),
      state: Joi.string().trim().pattern(/^[A-Za-zÀ-ÿ\u00f1\u00d1\s]+$/).min(2).max(56).optional().label('state'),
      school: Joi.string().trim().min(2).max(55).optional().label('school'),
      graduation_year: Joi.number().integer().min(1950).max(2100).optional().label('graduation_year'),
      deviceId: Joi.string().trim().min(6).max(256).optional().label('deviceId'),
      roles: Joi.array().items(Joi.string().trim()).unique().optional().label('roles'),
    });
  };
}

module.exports = new UserSchema();
