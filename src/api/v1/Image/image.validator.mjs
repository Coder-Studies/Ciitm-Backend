import Joi from 'joi';

export let Create_Image_Validator = Joi.object({
  userID: Joi.string()
    .hex()
    .custom(async function (value, helpers) {
      const user = await User.findById(value);
      if (!user) {
        throw new Error('User not found');
      }
      return value;
    }),

  albumName: Joi.string().required().messages({
    'string.empty': 'Album Name is empty',
    'string.base': 'Album Name must be a string',
    'any.required': 'Album Name is required',
  }),
  imageName: Joi.string().messages({
    'string.empty': 'Image Name is empty',
    'string.base': 'Image Name must be a string',
  }),

  imageDescription: Joi.string().allow('').optional().messages({
    'string.base': 'Image Description must be a string',
  }),
  url: Joi.string().trim().required().uri().messages({
    'string.empty': 'Image URL is required',
    'any.required': 'Image URL is required',
  }),
});
