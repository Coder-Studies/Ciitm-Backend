import courseConstant from './course.constant.mjs';
import courseModel from './course.model.mjs';
import { courseValidationSchema } from './course.validator.mjs';

class courseService {
  async createCourse(courseData) {
    try {
      let { error } = courseValidationSchema.validate(courseData);

      if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
      }



      // Check if course with the same code already exists
      const existingCourse = await courseModel.findOne({
        courseCode: courseData.courseCode,
      });


      if (existingCourse) {
        throw new Error(courseConstant.ALREADY_Created);
      }

      let CreatedCourse =  await courseModel.create(courseData);
      return CreatedCourse;
    } catch (error) {
      throw new Error(`Error creating course: ${error.message}`);
    }
  }
}

export default new courseService();
