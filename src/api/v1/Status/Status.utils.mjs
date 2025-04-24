import status from './Status.model.mjs';

class Status_Utility {
  FIND_STATUS_BY_STUDENT_ID = async (student_id) => {
    return status.findOne({ student_id: student_id });
  };
}

export default new Status_Utility();
