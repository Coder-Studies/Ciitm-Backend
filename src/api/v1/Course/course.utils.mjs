import courseModel from './course.model.mjs';

class Course_Utils {
  FindBy_courseName = async (courseName) => {
    return await courseModel.findOne({ courseName: courseName });
  };
  TOTAL_NUMBER_OF_COURSES = async () => {
    try {
      let NUMBER_OF_COURSES = (await courseModel.find({})).length;
      return NUMBER_OF_COURSES;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default new Course_Utils();
