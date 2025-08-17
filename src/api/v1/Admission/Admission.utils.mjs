import Admission from './Admission.model.mjs';
import path from 'path';
import fs from 'fs';

class Admission_Utils {
  FIND_NUMBER_OF_ADMISSION = async () => {
    try {
      let NUMBER_OF_ADMISSION = (await Admission.find({})).length;
      return NUMBER_OF_ADMISSION;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  /*
    @param {Object} data - The data to be used in the email template.
     @returns {Promise<string>} - The formatted email template with the provided data.
  */

  Admission_Template = async ({
    name,
    courseName,
    semester,
    admissionDate,
    studentId,
    ImageUrl,
  }) => {
    if (!name || !courseName || !semester || !admissionDate || !studentId) {
      throw new Error('Missing required fields for email template');
    }

    let AdmissionTemplate = null;

    let FilePath = path.join(
      path.resolve(),
      'src',
      'template',
      'email',
      'AdmissionTemplate.html'
    );

    AdmissionTemplate = fs.readFileSync(FilePath, 'utf8');

    AdmissionTemplate = AdmissionTemplate.replace(
      /{{year}}/g,
      new Date().getFullYear()
    )
      .replace(/{{studentImageUrl}}/g, ImageUrl)
      .replace(/{{studentName}}/g, name)
      .replace(/{{courseName}}/g, courseName)
      .replace(/{{semester}}/g, semester)
      .replace(/{{admissionDate}}/g, admissionDate)
      .replace(/{{studentId}}/g, studentId);

    return AdmissionTemplate;
  };
}

export default new Admission_Utils();
