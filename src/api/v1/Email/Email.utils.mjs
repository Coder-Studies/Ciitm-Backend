import envConstant from '../../../constant/env.constant.mjs';
import { createTransport } from '../../../utils/SendMail.js';
import EmailConstant from './Email.constant.mjs';
import EmailService from './Email.service.mjs';

class Email_Utils {
  sendReviewMail = async (data) => {
    try {
      let { recipientEmail, name, uniqueId } = data;

      let MailSend_toUser = await createTransport().sendMail({
        from: `"MERN Coding School"  ${envConstant.GMAIL_User}>`,
        to: `${recipientEmail}`,
        subject: 'Admission Review',
        html: `
          <h1>Dear ${name},</h1>
          <p>Thank you for your interest in our MERN Coding School. We have received your application with the unique ID: ${uniqueId}.</p>
          <p>We are currently reviewing your application and will get back to you shortly with the next steps.</p>
          <p>Best regards,</p>
          <p>MERN Coding School Team</p>
        `,
      });

      if (!MailSend_toUser.rejected) {
        throw new Error(EmailConstant.EMAIL_NOT_SEND);
      }

      return {
        message: EmailConstant.EMAIL_SEND,
        data: MailSend_toUser.response,
      };
    } catch (error) {
      throw new Error(error);
    }
  };
  sendPaymentConfirmationMail = async (data) => {
    try {
      let { recipientEmail, studentName, email, studentId, amountPaid, discount, totalAmountDue, paymentDate, paymentMethod } = data;

      const htmlTemplate = EmailService.getPaymentConfirmationMailTemplate(studentName, email, studentId, amountPaid, discount, totalAmountDue, paymentDate, paymentMethod);

      let MailSend_toUser = await createTransport().sendMail({
        from: `"MERN Coding School"  ${envConstant.GMAIL_User}>`,
        to: `${recipientEmail}`,
        subject: 'Payment Confirmation',
        html: htmlTemplate,
      });
      if (!MailSend_toUser.rejected) {
        throw new Error(EmailConstant.EMAIL_NOT_SEND);
      }
      return {
        message: EmailConstant.EMAIL_SEND,
        data: MailSend_toUser.response,
      };

      
    } catch (error) {
      throw new Error(error);
    }
  };
}

export default new Email_Utils();
