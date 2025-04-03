import Testimonial_Schema from '../models/Testimonials.model.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.mjs';







export let Create_Testimonial = async ({ data, file }) => {
  try {
    let { filename } = file;

    let Cloudinary = await uploadOnCloudinary(filename);

    let Created_Testimonial = await Testimonial_Schema.create({
      name: data.name,
      email: data.email,
      image: Cloudinary.url,
      message: data.message,
      job_Role: data.job_Role,
      star: data.star,
    });

    if (!Create_Testimonial) {
      throw new Error('Failed to Create Testimonial');
    }

    return Created_Testimonial;
  } catch (error) {
    throw new Error(error.message || 'Failed to Find Course');
  }
};

