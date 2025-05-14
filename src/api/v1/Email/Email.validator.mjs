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

export let Payment_Confirmation_Validator = Joi.object({
  studentName: Joi.string().required().min(3).max(50).messages({
    'string.empty': 'Student name cannot be empty',
    'any.required': 'Student name is required',
    'string.base': 'Student name must be a string',
    'string.min': 'Student name must be at least 3 characters long',
    'string.max': 'Student name must be at most 50 characters long',
  }),
  studentId: Joi.string().required().messages({
    'string.empty': 'Student ID cannot be empty',
    'any.required': 'Student ID is required',
    'string.base': 'Student ID must be a string',
  }),
  paymentId: Joi.string().required().messages({
    'string.empty': 'Payment ID cannot be empty',
    'any.required': 'Payment ID is required',
    'string.base': 'Payment ID must be a string',
  }),
  totalAmountDue: Joi.number().required().min(0).messages({
    'number.base': 'Total amount due must be a number',
    'any.required': 'Total amount due is required',
    'number.min': 'Total amount due cannot be negative',
  }),
  amountPaid: Joi.number().required().min(0).messages({
    'number.base': 'Amount paid must be a number',
    'any.required': 'Amount paid is required',
    'number.min': 'Amount paid cannot be negative',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty',
  }),
});

export let Admission_Confirmation_Validator = Joi.object({
  studentName: Joi.string().required().min(3).max(50).messages({
    'string.empty': 'Student name cannot be empty',
    'any.required': 'Student name is required',
    'string.base': 'Student name must be a string',
    'string.min': 'Student name must be at least 3 characters long',
    'string.max': 'Student name must be at most 50 characters long',
  }),
  studentId: Joi.string().required().messages({
    'string.empty': 'Student ID cannot be empty',
    'any.required': 'Student ID is required',
    'string.base': 'Student ID must be a string',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty',
  }),
  password: Joi.string().required().min(6).messages({
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required',
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least 6 characters long',
  }),
});
