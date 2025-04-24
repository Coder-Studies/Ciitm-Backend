import StudentCourseConstant from './Student-Course.constant.mjs';
import Student_Course from './Student-Course.model.mjs';

class Student_Course_Service {
  create = async (data) => {
    try {
      const { studentId, courseId, mode, university, endDate } = data;

      const newStudentCourse = await Student_Course.create({
        studentId,
        courseId,
        mode,
        university,

        endDate,
      });

      if (!newStudentCourse) {
        throw new Error(StudentCourseConstant.STUDENT_COURSE_NOT_CREATED);
      }

      return newStudentCourse;
    } catch (error) {
      throw new Error(error.message || 'Failed to create student course');
    }
  };
}

export default new Student_Course_Service();
