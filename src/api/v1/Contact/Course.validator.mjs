import Joi from 'joi';

// Define Joi schema for validation
export const Create_Contact_Validator = Joi.object({
  cName: Joi.string().required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  cEmail: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  cNumber: Joi.number().required().messages({
    'number.base': 'Number must be a valid number',
    'number.empty': 'Number is required',
    'any.required': 'Number is required',
  }),
  cMessage: Joi.string().required().messages({
    'string.empty': 'Message is required',
    'any.required': 'Message is required',
  }),
});
