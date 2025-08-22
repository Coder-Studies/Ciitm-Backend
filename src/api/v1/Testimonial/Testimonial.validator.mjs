import Joi from 'joi';

export const TestimonialValidator = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be valid',
    'any.required': 'Email is required',
  }),

  message: Joi.string().required().messages({
    'string.empty': 'Message is required',
    'any.required': 'Message is required',
  }),
  job_Role: Joi.string().required().messages({
    'string.empty': 'Job role is required',
    'any.required': 'Job role is required',
  }),
  star: Joi.number().min(0).max(5).required().messages({
    'number.base': 'Star rating must be a number',
    'number.min': 'Star rating cannot be less than 0',
    'number.max': 'Star rating cannot be more than 5',
    'any.required': 'Star rating is required',
  }),

});


