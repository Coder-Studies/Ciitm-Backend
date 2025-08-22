import SendResponse from '../../../utils/SendResponse.mjs';
import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import TestimonialUtils from './Testimonial.utils.mjs';
import { TestimonialValidator } from './Testimonial.validator.mjs';
import Testimonial_Service from './Testimonial.service.mjs';
import Testimonial from './Testimonial.model.mjs';

class Testimonial_Controller {

  Create_Testimonial_Controller = async (req, res) => {
    try {
      let data = req.body;
      let file = req.file;

      console.log('File:', file);
      console.log('Data:', req.body);

      let Find_Testimonial = await TestimonialUtils.FIND_TestimonialByEmail(
        data.email
      );

      let { error } = TestimonialValidator.validate(req.body);

      if (error) {
        throw new Error(error.details[0].message);
      }

      if (!Find_Testimonial) {
        let Create = await Testimonial_Service.Create_Testimonial({
          data,
          file,
        });

        SendResponse.success(
          res,
          StatusCodeConstant.CREATED,
          'Testimonial created successfully',
          Create
        );
      }

      throw new Error('Testimonial already exists for this email');
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Failed To Create Testimonial'
      );
    }
  };

  Find_Testimonial_Controller = async (req, res) => {
    try {
      let Find_Testimonial = await TestimonialUtils.FIND_ALL_Testimonials();

      if (!Find_Testimonial || Find_Testimonial.length === 0) {
        SendResponse.error(
          res,
          StatusCodeConstant.NOT_FOUND,
          'No testimonials found'
        );
        return;
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'Testimonials found',
        Find_Testimonial
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Failed to find testimonials'
      );
    }
  };

  Delete_Testimonial_Controller = async (req, res) => {
    try {
      const { id } = req.params;

      const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
      await Delete_From_Cloudinary(deletedTestimonial.image);

      if (!deletedTestimonial) {
        throw new Error('Testimonial not found');
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'Testimonial deleted successfully',
        deletedTestimonial
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Failed to delete testimonial'
      );
    }
  };
}

export default new Testimonial_Controller();


