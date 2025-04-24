import Joi from 'joi';

export let Review_Validator = Joi.object({
  recipientEmail: Joi.string().email().max(100).min(5).required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty',
    'string.base': 'Email must be a string',
    'string.min': 'Email must be at least 5 characters long',
    'string.max': 'Email must be at most 100 characters long',
  }),
  name: Joi.string().required().min(3).max(50).messages({
    'string.empty': 'Name cannot be empty',
    'any.required': 'Name is required',
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 50 characters long',
  }),
  uniqueId: Joi.string().required().messages({
    'string.empty': 'Unique ID cannot be empty',
    'any.required': 'Unique ID is required',
    'string.base': 'Unique ID must be a string',
  }),
});
