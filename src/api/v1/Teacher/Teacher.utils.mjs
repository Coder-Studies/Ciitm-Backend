import TeacherSchema from './Teacher.model.mjs';

class Teacher_Utils {
  FindBy_teacherName = async (teacherName) => {
    return await TeacherSchema.findOne({ name: teacherName });
  };

  TOTAL_NUMBER_OF_Teachers = async () => {
    try {
      let NUMBER_OF_Teachers = (await TeacherSchema.find({})).length;
      return NUMBER_OF_Teachers;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  FindAllTeachers = async () => {
    try {
      let teachers = await TeacherSchema.find({}).sort({ createdAt: -1 });
      return teachers;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  deleteTeacher = async (teacherId) => {
    try {
      let deletedTeacher = await TeacherSchema.findByIdAndDelete(teacherId);
      if (!deletedTeacher) {
        throw new Error('Teacher not found');
      }
      return deletedTeacher;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateTeacher = async (teacherId, updateData) => {
    try {
      let updatedTeacher = await TeacherSchema.findByIdAndUpdate(
        teacherId,
        updateData,
        { new: true }
      );
      if (!updatedTeacher) {
        throw new Error('Teacher not found');
      }
      return updatedTeacher;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  


}

export default new Teacher_Utils();
