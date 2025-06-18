import Joi from 'joi';

export const courseValidationSchema = Joi.object({
  courseName: Joi.string().trim().min(3).required().messages({
    'string.empty': 'Course name cannot be empty',
    'any.required': 'Course name is required',
    'string.base': 'Course name must be a valid string',
    'string.min': 'Course name must have at least 3 characters',
  }),
  courseCode: Joi.string().trim().min(3).required().messages({
    'string.empty': 'Course code cannot be empty',
    'any.required': 'Course code is required',
    'string.base': 'Course code must be a valid string',
    'string.min': 'Course code must have at least 3 characters',
  }),
  courseDescription: Joi.string().trim().required().messages({
    'string.empty': 'Course description cannot be empty',
    'any.required': 'Course description is required',
    'string.base': 'Course description must be a valid string',
  }),
  courseDuration: Joi.string().trim().required().messages({
    'string.empty': 'Course duration cannot be empty',
    'any.required': 'Course duration is required',
    'string.base': 'Course duration must be a valid string',
  }),
  courseEligibility: Joi.string().trim().required().messages({
    'string.empty': 'Course eligibility cannot be empty',
    'any.required': 'Course eligibility is required',
    'string.base': 'Course eligibility must be a valid string',
  }),
  courseThumbnail: Joi.string().trim().uri().required().messages({
    'string.empty': 'Course thumbnail URL cannot be empty',
    'any.required': 'Course thumbnail URL is required',
    'string.base': 'Course thumbnail must be a valid string',
    'string.uri': 'Course thumbnail must be a valid URI',
  }),
  coursePrice: Joi.number().required().messages({
    'number.base': 'Course price must be a valid number',
    'any.required': 'Course price is required',
  }),
});