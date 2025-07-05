import Admission from '../Admission/Admission.model.mjs';
import courseConstant from '../Course/course.constant.mjs';
import courseModel from '../Course/course.model.mjs';

class Student_Utils {
  FindByStudentId = async (studentId) => {
    return Admission.findOne({ uniqueId: studentId }).select(
      'uniqueId student.firstName student.lastName student.middleName student.email student.contactNumber student.avtar fee isAdmitted semester course_Id'
    );
  };

  FindStudentIdByUniqueId = async (uniqueId) => {

    const student = await Admission.findOne({ uniqueId: uniqueId });
    if (!student) {
      throw new Error('Student not found');
    }
    return student._id;
  }

  FindStudentBySemesterAndCourse = async ({
    semester,
    course,
    PerPage,
    Limit,
  }) => {
    try {
      const Find_Course = await courseModel.findOne({ courseName: course });
      console.log('Found Course:', Find_Course);
      if (!Find_Course) {
        throw new Error(courseConstant.COURSE_NOT_FOUND);
      }
      const query = {
        semester: semester,
        course_Id: String(Find_Course._id),
      };

      console.log('Query for finding students:', query);

      const options = {
        limit: Limit || 50,
        skip: (PerPage - 1) * (Limit || 50),
      };

      let a = Admission.find(query, null ,options).select(
        'uniqueId student.firstName student.lastName student.middleName student.email student.contactNumber isAdmitted'
      );

      return a.exec().then((students) => {
        console.log('Students found:', students);
        return students;
      });
    } catch (error) {
      console.error('Error finding students by semester and course:', error);
      throw new Error(
        error.message || 'Error fetching students by semester and course'
      );
    }
  };

  Find_FeeByStudentId({ studentId }) {
    return Admission.findOne({ studentId: studentId }).select('fee');
  }
}

export default new Student_Utils();
