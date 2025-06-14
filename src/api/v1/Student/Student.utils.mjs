import Admission from '../Admission/Admission.model.mjs';

class Student_Utils {
  FindByStudentId = async (studentId) => {
    console.log('Finding student by ID:', studentId);
    return Admission.findOne({ uniqueId: studentId });
  };

  FindStudentBySemisterAndCourse = async ({ semester, course }) => {
    return Admission.find({ course: course }).select(
      'uniqueId student.firstName student.middleName student.lastName contactNumber'
    );
  };

  Find_FeeByStudentId({ studentId }) {
    return Admission.findOne({ studentId: studentId }).select('fee');
  }
}

export default new Student_Utils();
