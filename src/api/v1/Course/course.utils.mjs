import courseModel from './course.model.mjs';

class Course_Utils {
  FindBy_courseName = async (courseName) => {
    return await courseModel.findOne({ courseName: courseName });
  };
}

export default new Course_Utils();
