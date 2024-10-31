import Joi from 'joi';

export const eventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  date: Joi.date().min('now').required().messages({
    'date.min': 'Date must be today or in the future.',
  }),
  totalSeats: Joi.number().integer().min(0).required(),
  availableSeats: Joi.number().integer().min(0).required()
});

export const updateEventSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  date: Joi.date().min('now').optional().messages({
    'date.min': 'Date must be today or in the future.',
  }),
  totalSeats: Joi.number().integer().min(1).optional(),
  availableSeats: Joi.number().integer().min(0).optional()
});
