import Admission from '../Admission/Admission.model.mjs';
import status from './Status.model.mjs';

class Status_Utility {
  FIND_STATUS_BY_STUDENT_ID = async (student_id) => {
    let Student = await Admission.findOne({ uniqueId: student_id });
    if (!Student) {
      throw new Error('Student not found');
    }
    return status.findOne({ student_id: Student._id });
  };
}

export default new Status_Utility();
