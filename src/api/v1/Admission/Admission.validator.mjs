import Joi from 'joi';

export let AdmissionValidationSchema = Joi.object({
  firstName: Joi.string().required().min(5).trim().messages({
    'string.base': 'First Name should be a type of text',
    'string.empty': 'First Name cannot be an empty field',
    'string.min': 'Name Should have a minimum lenght of (#limit)',
    'any.required': 'First Name Should be Required',
  }),

  middleName: Joi.string().min(3).trim().messages({
    'string.base': 'Middle Name should be a type of text',
    'string.empty': 'Middle  Name cannot be an empty field',
    'string.min': 'Middle Name Should have a minimum lenght of (#limit)',
  }),

  lastName: Joi.string().required().min(3).trim().messages({
    'string.base': 'Last Name should be a type of text',
    'string.empty': 'Last Name cannot be an empty field',
    'string.min': 'Last Name Should have a minimum lenght of (#limit)',
    'any.required': 'First Name Should be Required',
  }),

  fatherName: Joi.string().min(4).required().messages({
    'string.base': 'Father Name Should be a Type of text',
    'string.empty': 'Father Name cannot be an empty Type',
    'string.min': 'Father Name Should have a minimum lenght of (#limit)',
    'any.required': 'Father Name Should be Required',
  }),

  motherName: Joi.string().min(4).required().messages({
    'string.base': 'Mother Name Should be a Type of text',
    'string.empty': 'Mother Name cannot be an empty Type',
    'string.min': 'Mother Name Should have a minimum lenght of (#limit)',
    'any.required': 'Mother Name Should be Required',
  }),

  email: Joi.string()
    .email()
    .min(4)
    .required()
    .pattern(/^([a-zA-Z0-9_-]+)@gmail\.com$/)
    .messages({
      'string.base': 'Mother Name Should be a Type of text',
      'string.empty': 'Mother Name cannot be an empty Type',
      'string.min': 'Mother Name Should have a minimum lenght of (#limit)',
      'any.required': 'Mother Name Should be Required',
      'string.pattern.base': 'Email should be in the format <email>@gmail.com',
    }),

  contactNumber: Joi.number().min(1000000000).required().messages({
    'number.base': 'Mobile Number should be a type of number',
    'number.empty': 'Mobile Number cannot be an empty value',
    'any.required': 'Mobile Number is required',
    'number.min': 'Mobile Number should have at least 10 digits',
  }),

  dateOfBirth: Joi.date()
    .required()
    .min(new Date('2005-01-01'))
    .less('now')
    .messages({
      'date.base': 'Date of Birth should be a valid date',
      'any.required': 'Date of Birth is required',
      'date.max': 'Date of Birth cannot be in the future',
      'date.min':
        'Date of Birth should be at least 16 years ago, starting from 1st January 2005',
      'date.less': 'Date of Birth cannot be in the future',
    }),

  gender: Joi.string()
    .required()
    .valid('Male', 'Female', 'Other')
    .trim()
    .messages({
      'string.base': 'Gender should be a type of text',
      'any.required': 'Gender is required',
      'string.valid':
        'Gender must be one of the following: Male, Female, or Other',
      'string.empty': 'Gender cannot be an empty value',
    }),

  nationality: Joi.string().required().trim().messages({
    'string.base': 'Nationality Should be a type of text',
    'any.required': 'Nationality is Required',
    'string.empty': 'Nationality cannot be an empty value',
  }),

  Gname: Joi.string().required().messages({
    'string.base': 'Guardian Name should be a type of text',
    'string.empty': 'Guardian Name cannot be an empty field',

    'any.required': 'Guardian Name Should be Required',
  }),

  Grelation: Joi.string().required().messages({
    'string.base': 'Guardian Relation should be a type of text',
    'string.empty': 'Guardian Relation cannot be an empty field',
    'any.required': 'Guardian Relation Should be Required',
  }),

  GcontactNumber: Joi.number().min(1000000000).required().messages({
    'number.base': 'Guardian  Number should be a type of number',
    'number.empty': 'Guardian  Number cannot be an empty value',
    'any.required': 'Guardian  Number is required',
    'number.min': 'Guardian  Number should have at least 10 digits',
  }),
  street: Joi.string().required().trim().messages({
    'string.base': 'Street should be a type of text',
    'string.empty': 'Street cannot be an empty field',

    'any.required': 'Street Should be Required',
  }),

  city: Joi.string().required().trim().messages({
    'string.base': 'City should be a type of text',
    'string.empty': 'City cannot be an empty field',

    'any.required': 'City Should be Required',
  }),

  state: Joi.string().required().trim().messages({
    'string.base': 'State should be a type of text',
    'string.empty': 'State cannot be an empty field',
    'any.required': 'State Should be Required',
  }),

  pinCode: Joi.number().required().min(4).messages({
    'number.base': 'Pincode should be a type of number',
    'number.empty': 'Pincode cannot be an empty field',
    'number.min': 'Pincode Should be at leat (#limit)',
    'any.required': 'Pincode Should be Required',
  }),

  AadharCardNumber: Joi.number().required().min(12).messages({
    'number.base': 'Aadhar Number should be a type of number',
    'number.empty': 'Aadhar Number cannot be an empty field',
    'number.min': 'Aadhar Number Should be at leat (#limit)',
    'any.required': 'Aadhar Number Should be Required',
  }),

  tenthMarks: Joi.number().required().min(100).messages({
    'number.base': 'Tenth Marks should be a type of number',
    'number.empty': 'Tenth Marks cannot be an empty field',
    'number.min': 'Tenth Marks Should be at leat (#limit)',
    'any.required': 'Tenth Marks Should be Required',
  }),

  tenthBoard: Joi.string().required().trim().uppercase().messages({
    'string.base': '10th Board Name Should be a type of text',
    'any.required': '10th Board Name is Required',
    'string.uppercase': '10th Board Name Should be Upper Case',
    'string.empty': '10th Board Name cannot be an empty value',
  }),

  tenthGrade: Joi.string()
    .required()
    .trim()
    .valid('A', 'B', 'C', 'D')
    .uppercase()
    .messages({
      'string.base': '10th Grade Name Should be a type of text',
      'any.required': '10th Grade Name is Required',
      'string.uppercase': '10th Grade Name Should be Upper Case',
      'string.empty': '10th Grade Name cannot be an empty value',
    }),

  twelfthMarks: Joi.number().required().min(100).messages({
    'number.base': 'twelfth Marks should be a type of number',
    'number.empty': 'twelfth Marks cannot be an empty field',
    'number.min': 'twelfth Marks Should be at leat (#limit)',
    'any.required': 'twelfth Marks Should be Required',
  }),

  twelfthBoard: Joi.string().required().trim().uppercase().messages({
    'string.base': '12th Board Name Should be a type of text',
    'any.required': '12th Board Name is Required',
    'string.uppercase': '12th Board Name Should be Upper Case',
    'string.empty': '12th Board Name cannot be an empty value',
  }),

  twelfthGrade: Joi.string()
    .required()
    .trim()
    .valid('A', 'B', 'C', 'D')
    .uppercase()
    .messages({
      'string.base': '12th Grade Name Should be a type of text',
      'any.required': '12th Grade Name is Required',
      'string.uppercase': '12th Grade Name Should be Upper Case',
      'string.empty': '12th Grade Name cannot be an empty value',
    }),

  mode: Joi.string().required().trim().valid('Online', 'Offline').messages({
    'string.base': 'mode Should be a type of text',
    'any.required': 'mode is Required',
    'string.empty': 'mode cannot be an empty value',
  }),

  university: Joi.string().required().trim().uppercase().messages({
    'string.base': 'mode Should be a type of text',
    'any.required': 'mode is Required',
    'string.uppercase': 'mode Should be Upper Case',
    'string.empty': 'mode cannot be an empty value',
  }),

  courseName: Joi.string().required().trim().uppercase().messages({
    'string.base': 'Course Name Should be a type of text',
    'any.required': 'Course Name is Required',
    'string.uppercase': 'Course Name Should be Upper Case',
    'string.empty': 'Course Name cannot be an empty value',
  }),
});
