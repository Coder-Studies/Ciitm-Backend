import Testimonial from '../models/Testimonials.model.js';
import { Create_Testimonial } from '../Service/client.service.js';
import { Delete_From_Cloudinary } from '../utils/Cloudinary.mjs';

export let Create_Testimonial_Controller = async (req, res) => {
  try {
    let data = req.body;
    let file = req.file;
    let Find_Testimonial = await Testimonial.findOne({ email: data.email });

    if (!Find_Testimonial) {
      let Create = await Create_Testimonial({ data, file });

      return res.status(201).json({
        message: 'Testimonial created successfully',
        data: Create,
        created: true,
      });
    }

    res.status(200).json({
      message: 'Testimonial already exists',
      Find_Testimonial,
      error: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Failed To Create Testimonial',
      error: true,
    });
  }
};

export let Find_Testimonial_Controller = async (req, res) => {
  try {
    let Find_Testimonial = await Testimonial.find();

    if (!Find_Testimonial) {
      return res.status(404).json({
        message: 'No testimonials found',
        error: true,
      });
    }

    return res.status(200).json({
      message: 'testimonials found',
      Find_Testimonial,
      found: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Failed to find testimonials',
      error: true,
    });
  }
};

export let Delete_Testimonial_Controller = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
    await Delete_From_Cloudinary(deletedTestimonial.image);

    if (!deletedTestimonial) {
      return res.status(404).json({
        message: 'Testimonial not found',
        error: true,
      });
    }

    return res.status(200).json({
      message: 'Testimonial deleted successfully',
      data: deletedTestimonial,
      deleted: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Failed to delete testimonial',
      error: true,
    });
  }
};
