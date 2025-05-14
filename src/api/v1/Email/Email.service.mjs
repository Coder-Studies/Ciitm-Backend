import EmailUtils from './Email.utils.mjs';
import { Review_Validator } from './Email.validator.mjs';
import Payment_Confirmation_Template from '../../../template/email/payment.template.js';
import Admission_Confirmation_Template from '../../../template/email/admission.template.js';

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

      await EmailUtils.sendReviewMail({
        recipientEmail,
        name,
        uniqueId,
      });
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
}

export default new Email_Service();
