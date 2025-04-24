import Joi from 'joi';

let Create_Album_Validator = Joi.object({
  albumName: Joi.string().required().messages({
    'string.empty': 'Image Name is empty',
    'string.base': 'Image Name must be a string',
    'any.required': 'Image Name is required',
  }),

  albumImageUrl: Joi.string().trim().required().messages({
    'string.empty': 'Album Image Url In Required',
    'any.required': 'Album Image Url In Required',
  }),

  albumDescription: Joi.string().min(5).max(225).required().messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 5 characters',
    'string.max': 'Description must be at most 255 characters',
    'any.required': 'Description is required',
  }),
});

export default Create_Album_Validator;
