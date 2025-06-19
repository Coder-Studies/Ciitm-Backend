import Joi from 'joi';

let Teacher_validation = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is empty',
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is empty',
    'string.email': 'Email is invalid',
    'string.base': 'Email must be a string',
    'any.required': 'Email is required',
  }),

  role: Joi.string().required().messages({
    'string.empty': 'Role is empty',
    'string.base': 'Role must be a string',
    'any.required': 'Role is required',
  }),

  Specialization: Joi.string().required().messages({
    'string.empty': 'Specialization is empty',
    'string.base': 'Specialization must be a string',
    'any.required': 'Specialization is required',
  }),

  Experience: Joi.number().required().messages({
    'string.empty': 'Experience is empty',
    'string.base': 'Experience must be a string',
    'any.required': 'Experience is required',
  }),

  instagram: Joi.string()
    .uri()
    .trim()
    .pattern(/^https:\/\/www\.instagram\.com\/[a-zA-Z0-9_.]+\/?$/)
    .required()
    .messages({
      'string.empty': 'Instagram is empty',
      'string.base': 'Instagram must be a string',
      'any.required': 'Instagram is required',
      'string.pattern.base': 'Instagram URL format is invalid',
      'string.uri': 'Instagram URL must be a valid URL',
    }),
  facebook: Joi.string()
    .uri()
    .trim()
    .pattern(/^https:\/\/www\.facebook\.com\/[a-zA-Z0-9.]+\/?$/)
    .required()
    .messages({
      'string.empty': 'Facebook is empty',
      'string.base': 'Facebook must be a string',
      'any.required': 'Facebook is required',
      'string.pattern.base': 'Facebook URL format is invalid',
      'string.uri': 'Facebook URL must be a valid URL',
    }),
  linkedin: Joi.string()
    .uri()
    .trim()
    .pattern(/^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/)
    .required()
    .messages({
      'string.empty': 'LinkedIn is empty',
      'string.base': 'LinkedIn must be a string',
      'any.required': 'LinkedIn is required',
      'string.pattern.base': 'LinkedIn URL format is invalid',
      'string.uri': 'LinkedIn URL must be a valid URL',
    }),
  twitter: Joi.string()
    .uri()
    .trim()
    .pattern(/^https:\/\/x\.com\/[a-zA-Z0-9_]+(?:\/)?$/)
    .required()
    .messages({
      'string.empty': 'Twitter is empty',
      'string.base': 'Twitter must be a string',
      'any.required': 'Twitter is required',
      'string.pattern.base': 'Twitter URL format is invalid',
      'string.uri': 'Twitter URL must be a valid URL',
    }),
});

export default Teacher_validation;
