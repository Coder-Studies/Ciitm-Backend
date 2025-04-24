import dotenv from 'dotenv';
dotenv.config();

import Social_Link_Validator from '../validation/Social_Link.Joi.js';
import TeacherSchema from '../models/Teacher.model.js';

export const create_Admin = async () => {
  try {
  } catch (error) {
    return error;
  }
};

export const Create_Social_Link = async ({
  linkedin,
  facebook,
  instagram,
  email,
  Number,
}) => {
  let link_Validator = await Social_Link_Validator.validateAsync({
    linkedin,
    facebook,
    instagram,
    email,
    Number,
  });
};

export const update_Social_Link = async (data) => {};

export const create_Album = async () => {};

export const create_Image = async (data) => {};

export const create_Course = async (data) => {};

export const create_Teacher = async (data) => {
  try {
    console.log('data', data);
    let {
      name,
      email,
      image,
      role,
      facebook,
      linkedin,
      twitter,
      Specialization,
      Experience,
      instagram,
    } = data;

    let Teacher = await TeacherSchema.create({
      name: name,
      email: email,
      image: image,
      role: role,
      Specialization: Specialization,
      Experience: Experience,
      social_media: [
        {
          facebook: facebook,
          linkedin: linkedin,
          twitter: twitter,
          instagram: instagram,
        },
      ],
    });

    if (!Teacher) {
      return new Error('Failed to create Teacher');
    }

    return Teacher;
  } catch (error) {
    return new Error(error.message || 'Error Creating Teacher');
  }
};
