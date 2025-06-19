import Admission from '../Admission/Admission.model.mjs';

class Student_Utils {
  FindByStudentId = async (studentId) => {
    console.log('Finding student by ID:', studentId);
    return Admission.findOne({ uniqueId: studentId });
  };

  FindStudentBySemesterAndCourse = async ({ semester, course }) => {
    return Admission.find({ course: course, semester: semester }).select(
      'uniqueId student.firstName student.middleName student.lastName student.contactNumber'
    ).limit().skip(0).sort({ createdAt: -1 });
  };

  Find_FeeByStudentId({ studentId }) {
    return Admission.findOne({ studentId: studentId }).select('fee');
  }
}

export default new Student_Utils();
