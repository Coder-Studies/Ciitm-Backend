import Admission from '../Admission/Admission.model.mjs';
import status from './Status.model.mjs';
import fs from 'fs';
import path from 'path';

class Status_Utility {
  FIND_STATUS_BY_STUDENT_ID = async (student_id) => {
    let Student = await Admission.findOne({ uniqueId: student_id });
    if (!Student) {
      throw new Error('Student not found');
    }
    return status.findOne({ student_id: Student._id });
  };

  Status_Template = async ({ studentName, studentEmail, studentPassword }) => {
    try {
      let FilePath = path.join(
        path.resolve(),
        'src',
        'template',
        'email',
        'StatusApproved.html'
      );

      if (!fs.existsSync(FilePath)) {
        throw new Error('Email template file not found');
      }

      let SendMailTemplate = fs.readFileSync(FilePath, 'utf8');

      SendMailTemplate = SendMailTemplate.replace(
        /{{studentName}}/g,
        studentName
      )
        .replace(/{{studentEmail}}/g, studentEmail)
        .replace(/{{studentPassword}}/g, studentPassword)
        .replace(/{{year}}/g, new Date().getFullYear());

      return SendMailTemplate;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default new Status_Utility();
