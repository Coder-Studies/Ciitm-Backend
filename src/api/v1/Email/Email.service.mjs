import EmailUtils from './Email.utils.mjs';
import { Review_Validator } from './Email.validator.mjs';
import Payment_Confirmation_Template from '../../../template/email/payment.template.js';
import path from 'path';
import fs from 'fs';
import { createTransport } from '../../../utils/SendMail.js';
import envConstant from '../../../constant/env.constant.mjs';
import { console } from 'inspector';
import StatusUtils from '../Status/Status.utils.mjs';
import StatusService from '../Status/Status.service.mjs';

class Email_Service {
  // sendReviewMail = async ({ recipientEmail, name, uniqueId }) => {
  //   try {
  //     let { error } = Review_Validator.validate({
  //       recipientEmail,
  //       name,
  //       uniqueId,
  //     });

  //     if (error) {
  //       throw new Error(error.details[0].message);
  //     }

  //     let Send_Review_Mail = await EmailUtils.sendReviewMail({
  //       recipientEmail,
  //       name,
  //       uniqueId,
  //     });
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // };

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
}

export default new Email_Service();
