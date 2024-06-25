import Joi from 'joi';

export const registerContactSchema = Joi.object({
  name: Joi.string().min(2).max(32).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(16).required(),
});
