import Joi from 'joi';

/**
 * Validation schema for student search query parameters
 * Used for finding students by course and semester with pagination
 */

/**
 * Validation middleware for student search query
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

export const studentSearchQuerySchema = Joi.object({
  // Course validation - required string
  course: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'Course must be a string',
    'string.empty': 'Course cannot be empty',
    'string.min': 'Course must be at least 2 characters long',
    'string.max': 'Course cannot exceed 100 characters',
    'any.required': 'Course is required',
  }),

  // Semester validation - required integer between 1-8
  semester: Joi.number().integer().min(1).max(8).required().messages({
    'number.base': 'Semester must be a number',
    'number.integer': 'Semester must be an integer',
    'number.min': 'Semester must be at least 1',
    'number.max': 'Semester cannot exceed 8',
    'any.required': 'Semester is required',
  }),

  // PerPage validation - optional integer for pagination (default: 10)
  PerPage: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .optional()
    .messages({
      'number.base': 'PerPage must be a number',
      'number.integer': 'PerPage must be an integer',
      'number.min': 'PerPage must be at least 1',
      'number.max': 'PerPage cannot exceed 100',
    }),

  // Limit validation - optional integer for result limiting (default: 50)
  Limit: Joi.number()
    .integer()
    .min(1)
    .max(1000)
    .default(50)
    .optional()
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 1000',
    }),
});
