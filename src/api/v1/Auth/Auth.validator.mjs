import Joi from 'joi';

export let SignUp_Validator = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),

  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a valid email',
    'any.required': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),

  password: Joi.string().required().messages({
    'string.base': 'Password must be a string',
    'any.required': 'Password is required',
  }),

  confirm_Password: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Confirm Password must match Password',
      'any.required': 'Confirm Password is required',
    }),
});
