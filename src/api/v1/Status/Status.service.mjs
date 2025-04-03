import StudentConst from '../Student/Student.constant.mjs';
import StudentUtils from '../Student/Student.utils.mjs';
import StatusConstant from './Status.constant.mjs';
import status from './Status.model.mjs';

class Status_Service {
  Update_Status = async ({ uniqueId, message, applicationStatus }) => {
    try {
      let Find_Student = await StudentUtils.FindByStudentId(uniqueId);

      if (!Find_Student) {
        throw new Error(StudentConst.STUDENT_NOT_FOUND);
      }

      let Update_Status = await status.findOneAndUpdate(
        { student_id: Find_Student._id.toString() },
        {
          $set: {
            message: message,
            applicationStatus: applicationStatus,
          },
        },
        { new: true }
      );

      if (!Update_Status) {
        throw new Error(StatusConstant.STATUS_NOT_UPDATED);
      }
      return Update_Status;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  createStatus = async function (Student_Id) {
    try {
      let create_new_Application_Status = await status.create({
        student_id: Student_Id,
      });
  
      if (!create_new_Application_Status) {
        throw new Error('Failed to Create Status');
      }
  
      return create_new_Application_Status;
    } catch (error) {
      throw new Error(error.message || 'Failed to Create Status');
    }
  };



}

export default new Status_Service();
