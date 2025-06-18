import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import courseConstant from './course.constant.mjs';
import courseService from './course.service.mjs';

const Course_Controller = {
  async createCourse(req, res) {
    try {
      console.log('Creating course with data:', req.body);
      const newCourse = await courseService.createCourse(req.body);
      if (!newCourse) {
        throw new Error(courseConstant.COURSE_NOT_CREATED);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        courseConstant.COURSE_CREATED,
        newCourse
      );
    } catch (error) {
      console.error('Error creating course:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || courseConstant.COURSE_NOT_CREATED
      );
    }
  },
};

export default Course_Controller;
