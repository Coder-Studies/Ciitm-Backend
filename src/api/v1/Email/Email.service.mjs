import EmailUtils from './Email.utils.mjs';
import { Review_Validator } from './Email.validator.mjs';
import Payment_Confirmation_Template from '../../../template/email/payment.template.js';
import Admission_Confirmation_Template from '../../../template/email/admission.template.js';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import e from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Email_Service {
  sendReviewMail = async ({ recipientEmail, name, uniqueId }) => {
    try {
      let { error } = Review_Validator.validate({
        recipientEmail,
        name,
        uniqueId,
      });

      if (error) {
        throw new Error(error.details[0].message);
      }

      let Send_Review_Mail = await EmailUtils.sendReviewMail({
        recipientEmail,
        name,
        uniqueId,
      });

      console.log('Send_Review_Mail:', Send_Review_Mail);
    } catch (error) {
      throw new Error(error);
    }
  };

  sendPaymentConfirmation = async ({
    studentName,
    studentId,
    paymentId,
    totalAmountDue,
    amountPaid,
    email,
  }) => {
    console.log(email,studentName, studentId, paymentId, totalAmountDue, amountPaid);
    try {
      const result = await Payment_Confirmation_Template({
        studentName,
        studentId,
        paymentId,
        totalAmountDue,
        amountPaid,
        email,
      });
      return result; // ✅ Return the result
    } catch (error) {
      throw new Error(error.message);
    }
  };

  sendAdmissionConfirmation = async ({
    studentName,
    studentId,
    email,
    password,
  }) => {
    try {
      const result = await Admission_Confirmation_Template({
        studentName,
        studentId,
        email,
        password,
      });
      return result; // ✅ Return the result
    } catch (error) {
      throw new Error(error.message);
    }
  };
  getPaymentConfirmationMailTemplate(studentName, studentEmail, Unique_id, amountPaid, discount, dueFee, paymentDate, paymentMethod ) {
      // Construct path to the HTML template file
      const templatePath = path.join(
        __dirname,
        '../../../template/email/paymentConfirmationEmail.html'
      );
  
      // Read the HTML template file
      const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
      console.log('HTML Template Path:', templatePath, htmlTemplate);
  
      // Replace placeholders with actual values
      
   
      console.log('studentName:', studentName);
      const processedTemplate = htmlTemplate
        .replace(/{{studentName}}/g, studentName)
        .replace(/{{studentEmail}}/g, studentEmail)
        .replace(/{{Unique_id}}/g, Unique_id)
        .replace(/{{amountPaid}}/g, amountPaid)
        .replace(/{{discount}}/g, discount)
        .replace(/{{dueFee}}/g, dueFee)
        .replace(/{{paymentDate}}/g, paymentDate)
        .replace(/{{paymentMethod}}/g, paymentMethod);
  
      console.log('Processed Template:', processedTemplate);
  
      return processedTemplate;
    };
}

export default new Email_Service();
