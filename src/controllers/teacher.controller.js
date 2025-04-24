import TeacherSchema from '../models/Teacher.model.js';
import { create_Teacher } from '../Service/admin.service.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.mjs';
import Teacher_validation from '../validation/TeacherSchema.Joi.js';

export let Create_Teacher_Controller = async (req, res) => {
  try {
    let {
      name,
      email,
      role,
      facebook,
      linkedin,
      twitter,
      Specialization,
      Experience,
      instagram,
    } = req.body;

    const { filename } = req.file;

    let Cloudinary = await uploadOnCloudinary(filename);

    if (!Cloudinary) {
      return res.status(400).json({
        message: 'Failed to upload image in Cloudnary',
        status: 'Failed',
      });
    }

    let { error } = Teacher_validation.validate({
      name,
      email,
      role,
      facebook,
      linkedin,
      twitter,
      Specialization,
      Experience,
      instagram,
      image: Cloudinary.url,
    });

    if (error) {
      console.error('Validation Error Stack:', error.stack);

      return res.status(400).json({
        message: error.message, // Specific validation message
        error: true,
        details: error.details, // Detailed error information
      });
    }

    let Teacher = await create_Teacher({
      name: name,
      email: email,
      image: Cloudinary.url,
      role: role,
      Specialization: Specialization,
      Experience: Experience,
      instagram: instagram,
      facebook: facebook,
      linkedin: linkedin,
      twitter: twitter,
    });

    res.status(201).json({
      message: 'Teacher Created Successfully',
      Teacher,
      status: 'success',
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || 'Error Creating Teacher',
      status: 'Failed',
    });
  }
};

export let Find_Teacher_Controller = async (req, res) => {
  try {
    let Find_Teacher = await TeacherSchema.find();

    if (!Find_Teacher) {
      res.status(200).json({
        message: 'Failed To Find Teacher',
        found: false,
      });
    }

    res.status(200).json({
      message: 'Teacher Found',
      teacher: Find_Teacher,
      found: true,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || 'Failed To Find Teacher',
      error: true,
    });
  }
};
