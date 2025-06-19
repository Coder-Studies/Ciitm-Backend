import TeacherSchema from '../models/Teacher.model.js';
import { create_Teacher } from '../Service/admin.service.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.mjs';
import Teacher_validation from '../validation/TeacherSchema.Joi.js';

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
