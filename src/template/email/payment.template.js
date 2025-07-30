import EmailService from '../../api/v1/Email/Email.service.mjs';
import { createTransport } from '../../utils/SendMail.js';

import dotenv from 'dotenv';
dotenv.config();

const Payment_Confirmation_Template = async ({
  studentName,
  studentId,
  paymentId,
  discount,
  totalAmountDue,
  amountPaid,
  email,
  paymentDate,
  paymentMethod,
}) => {
  const htmlTemplate = EmailService.getPaymentConfirmationMailTemplate(studentName, email, studentId, amountPaid, discount, totalAmountDue, paymentDate, paymentMethod);
  let sendMail = await createTransport().sendMail({
    from: `"MERN Coding School" <${process.env.GMAIL_User}>`,
    to: `${studentName} <${email}>`,
    subject: 'Payment Confirmation - MERN Coding School',
    html: htmlTemplate,
  });

  return sendMail;
};

export default Payment_Confirmation_Template;
