import Joi from "joi";

export const userLoginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(8).max(30).required() 
    .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+=-]*$')) 
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password must not exceed 30 characters.',
      'string.pattern.base': 'Password must contain only letters, numbers, and special characters.',
    })
  });