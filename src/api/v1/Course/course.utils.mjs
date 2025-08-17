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

  FindAllCourses = async () => {
    try {
      let courses = await courseModel.find({}).sort({ createdAt: -1 });

      return courses;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  FindAllCoursesName = async () => {
    try {
      const courses = await courseModel
        .find({}, { courseName: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();

      return courses;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  FindCourseById = async (courseId) => {
    try {
      let course = await courseModel.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      return course;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default new Course_Utils();
