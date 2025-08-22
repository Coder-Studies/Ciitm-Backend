import Testimonial from './Testimonial.model.mjs';

class Testimonial_Utils {
  FIND_TestimonialByEmail = async (email) => {
    try {
      let testimonial = await Testimonial.findOne({ email: email });

      return testimonial;
    } catch (error) {
      throw new Error(`Error finding testimonial: ${error.message}`);
    }
  };

  FIND_ALL_Testimonials = async () => {
    try {
      let testimonials = await Testimonial.find();

      return testimonials;
    } catch (error) {
      throw new Error(`Error finding testimonials: ${error.message}`);
    }
  };
}

export default new Testimonial_Utils();

