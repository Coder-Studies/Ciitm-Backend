import Admission from '../Admission/Admission.model.mjs';

class Student_Utils {
  FindByStudentId = async (studentId) => {
    return Admission.findOne({ studentId: studentId });
  };

  Find_FeeByStudentId({ studentId }) {
    return Admission.findOne({ studentId: studentId }).select('fee');
  }
}

export default new Student_Utils();
